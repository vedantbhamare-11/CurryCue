// Usage:
//   npm run check:models            compare configured models with each provider's live model list
//   npm run check:models -- --probe also send a tiny real request per model (proves it works for
//                                   your key; costs a few tokens; 429 means "exists, rate limited")
// Reads .env.local via `node --env-file`. Exits 1 if any configured model looks dead.
import { deflateSync } from 'node:zlib';
import {
  GEMINI_BASE_URL,
  envList,
  envPrefix,
  getProviderOrder,
  resolveGeminiModels,
  resolveOpenAICompatible,
} from '../src/lib/server/ai-config.ts';

const probe = process.argv.includes('--probe');
const env = process.env;
let problems = 0;

// 64x64 solid red PNG: big enough for vision models (a 1x1 image is rejected as too small)
function redPng(size = 64) {
  const table = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (buf) => {
    let c = 0xffffffff;
    for (const byte of buf) c = table[(c ^ byte) & 255] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const sum = Buffer.alloc(4);
    sum.writeUInt32BE(crc(body));
    return Buffer.concat([len, body, sum]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array.from({ length: size * 3 }, (_, i) => (i % 3 === 0 ? 255 : 0)))]);
  const raw = Buffer.concat(Array.from({ length: size }, () => row));
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  return png.toString('base64');
}

async function getJson(url, headers) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(20_000) });
  const body = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, body };
}

function report(kind, model, source, listed, probeResult) {
  let mark = listed ? 'ok ' : 'MISSING';
  let note = listed ? 'listed' : 'not in provider model list (retired or renamed?)';
  if (probeResult) {
    if (probeResult.ok) note += ', request works';
    else if (probeResult.status === 429) note += ', request rate limited (model exists)';
    else {
      mark = 'FAIL';
      note = `request failed: ${probeResult.message}`;
    }
  }
  if (mark === 'MISSING' || mark === 'FAIL') problems++;
  console.log(`   [${mark.padEnd(7)}] ${kind.padEnd(6)} ${model}  (${source})  ${note}`);
}

async function checkOpenAICompatible(name) {
  const { provider, reason } = resolveOpenAICompatible(name, env);
  if (!provider) {
    console.log(`\n${name}: skipped (${reason})`);
    return;
  }
  console.log(`\n${name}  ${provider.baseUrl}`);

  const list = await getJson(`${provider.baseUrl}/models`, { Authorization: `Bearer ${provider.apiKey}` });
  if (!list.ok) {
    problems++;
    console.log(`   [FAIL   ] could not list models: HTTP ${list.status} ${list.body?.error?.message ?? ''}`);
    return;
  }
  const live = new Map((list.body?.data ?? []).map((m) => [m.id, m]));
  const prefix = envPrefix(name);

  const run = async (kind, models, envKey) => {
    const source = envList(env, envKey) ? 'env' : 'default';
    for (const model of models) {
      const entry = live.get(model);
      const listed = Boolean(entry) && entry.active !== false;
      let probeResult;
      if (probe && listed) {
        const content =
          kind === 'vision'
            ? [
                { type: 'text', text: 'What colour is this image? one word' },
                { type: 'image_url', image_url: { url: `data:image/png;base64,${redPng()}` } },
              ]
            : 'Reply with the single word ok';
        const response = await fetch(`${provider.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${provider.apiKey}` },
          body: JSON.stringify({ model, messages: [{ role: 'user', content }], ...provider.bodyFor?.(model) }),
          signal: AbortSignal.timeout(45_000),
        }).catch((error) => ({ ok: false, status: 0, json: async () => ({ error: { message: String(error) } }) }));
        const body = await response.json().catch(() => null);
        probeResult = { ok: response.ok, status: response.status, message: body?.error?.message?.slice(0, 120) ?? `HTTP ${response.status}` };
      }
      report(kind, model, source, listed, probeResult);
    }
  };

  await run('text', provider.textModels, `${prefix}_TEXT_MODELS`);
  if (provider.visionModels.length === 0) console.log('   (no vision models configured: image scans will skip this provider)');
  await run('vision', provider.visionModels, `${prefix}_VISION_MODELS`);
}

async function checkGemini() {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('\ngemini: skipped (GEMINI_API_KEY is not set)');
    return;
  }
  console.log(`\ngemini  ${GEMINI_BASE_URL}`);

  const live = new Set();
  let pageToken = '';
  do {
    const page = await getJson(`${GEMINI_BASE_URL}/models?pageSize=1000${pageToken ? `&pageToken=${pageToken}` : ''}`, { 'x-goog-api-key': apiKey });
    if (!page.ok) {
      problems++;
      console.log(`   [FAIL   ] could not list models: HTTP ${page.status} ${page.body?.error?.message ?? ''}`);
      return;
    }
    for (const m of page.body?.models ?? []) live.add(m.name.replace(/^models\//, ''));
    pageToken = page.body?.nextPageToken ?? '';
  } while (pageToken);

  const source = envList(env, 'GEMINI_MODELS') ? 'env' : 'default';
  for (const model of resolveGeminiModels(env)) {
    const listed = live.has(model);
    let probeResult;
    if (probe && listed) {
      const response = await fetch(`${GEMINI_BASE_URL}/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Reply with the single word ok' }] }] }),
        signal: AbortSignal.timeout(60_000),
      }).catch((error) => ({ ok: false, status: 0, json: async () => ({ error: { message: String(error) } }) }));
      const body = await response.json().catch(() => null);
      // 503 = overloaded right now, not retired: the model exists
      probeResult = { ok: response.ok, status: response.status === 503 ? 429 : response.status, message: body?.error?.message?.slice(0, 120) ?? `HTTP ${response.status}` };
    }
    // Gemini lists models that are no longer available to new keys (2.5-flash was), so only --probe is conclusive
    report('text', model, source, listed, probeResult);
  }
  if (!probe) console.log('   note: Gemini still lists some retired models; run with --probe to confirm they actually work');
}

console.log(`AI model check (${probe ? 'with live probes' : 'list only'}); providers: ${getProviderOrder(env).join(', ')}`);

for (const name of getProviderOrder(env)) {
  if (name === 'gemini') await checkGemini();
  else await checkOpenAICompatible(name);
}

console.log(
  problems === 0
    ? '\nAll configured models look healthy.'
    : `\n${problems} problem(s). Fix by setting <PROVIDER>_TEXT_MODELS / <PROVIDER>_VISION_MODELS (or GEMINI_MODELS) in .env.local; no code change needed.`
);
process.exit(problems === 0 ? 0 : 1);
