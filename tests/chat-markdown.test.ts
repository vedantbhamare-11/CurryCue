import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// tsconfig uses jsx: preserve (Next compiles it), so give tsx the classic factory for the component's JSX
(globalThis as { React?: unknown }).React = React;
const { ChatMarkdown } = await import('@/components/chat-markdown');

const html = (text: string) => renderToStaticMarkup(React.createElement(ChatMarkdown, { text })).replace(/^<div class="space-y-2 break-words">|<\/div>$/g, '');

test('bold, italic and inline code', () => {
  assert.match(html('you can **skip Step 1** entirely'), /<strong>skip Step 1<\/strong>/);
  assert.match(html('Use *fresh* tomatoes'), /<em>fresh<\/em>/);
  assert.match(html('Set it to `medium` heat'), /<code[^>]*>medium<\/code>/);
});

test('lists: -, * and numbered; bold inside items', () => {
  assert.equal((html('You need:\n- onion\n- tomato\n- salt').match(/<li>/g) ?? []).length, 3);
  assert.equal((html('* onion\n* tomato').match(/<li>/g) ?? []).length, 2);
  assert.match(html('1. Heat oil\n2. Add onion\n3) Stir'), /<ol/);
  assert.equal((html('- **Onion**: 2 nos\n- **Tomato**: 1').match(/<strong>/g) ?? []).length, 2);
});

test('headings, paragraphs and line breaks', () => {
  assert.doesNotMatch(html('## Tips\nStir often.'), /##/);
  assert.match(html('Line one\nLine two\n\nNew paragraph'), /Line one<br\/>Line two/);
  assert.equal((html('Line one\nLine two\n\nNew paragraph').match(/<p>/g) ?? []).length, 2);
  assert.match(html('- a\n- b\nDone.'), /<\/ul><p>Done\.<\/p>/);
});

test('things that look like markdown but are not', () => {
  assert.doesNotMatch(html('Use 2 * 3 cups'), /<em>/);
  assert.match(html('Add red_chili_powder'), /red_chili_powder/);
  assert.match(html('Use **bold but never close'), /\*\*bold but never close/);
  assert.equal(html(''), '');
});

test('HTML in model output is escaped, never injected', () => {
  const out = html('Try <script>alert(1)</script> and <img src=x onerror=alert(1)>');
  assert.doesNotMatch(out, /<script|<img/);
  assert.match(out, /&lt;script&gt;/);
});

test('Windows newlines and non-Latin text', () => {
  assert.equal((html('a\r\n- b\r\n- c').match(/<li>/g) ?? []).length, 2);
  assert.match(html('प्याज़ **भूनें** until golden'), /<strong>भूनें<\/strong>/);
});
