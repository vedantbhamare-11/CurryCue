import { Fragment, type ReactNode } from 'react';

// Small dependency-free renderer for the markdown subset chat replies use: **bold**, *italic*,
// `code`, "-"/"*"/"1." lists, "#" headings and paragraphs. It only ever creates React elements
// from plain strings (never raw HTML), so model output cannot inject markup.

const INLINE = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\*[^*\s][^*\n]*\*)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(INLINE)
    .filter((part) => part !== '')
    .map((part, i) => {
      const key = `${keyPrefix}-${i}`;
      if (/^\*\*[^*\n]+\*\*$/.test(part)) return <strong key={key}>{part.slice(2, -2)}</strong>;
      if (/^`[^`\n]+`$/.test(part)) {
        return (
          <code key={key} className="rounded bg-background/60 px-1 py-0.5 text-[0.85em]">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (/^\*[^*\s][^*\n]*\*$/.test(part)) return <em key={key}>{part.slice(1, -1)}</em>;
      return <Fragment key={key}>{part}</Fragment>;
    });
}

export function ChatMarkdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const key = `p-${blocks.length}`;
    blocks.push(
      <p key={key}>
        {paragraph.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {renderInline(line, `${key}-${i}`)}
          </Fragment>
        ))}
      </p>
    );
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    const key = `l-${blocks.length}`;
    const items = list.items.map((item, i) => <li key={i}>{renderInline(item, `${key}-${i}`)}</li>);
    blocks.push(
      list.ordered ? (
        <ol key={key} className="list-decimal space-y-1 pl-5">{items}</ol>
      ) : (
        <ul key={key} className="list-disc space-y-1 pl-5">{items}</ul>
      )
    );
    list = null;
  };

  for (const line of text.replace(/\r\n/g, '\n').split('\n')) {
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const heading = line.match(/^\s*#{1,6}\s+(.*)$/);

    if (bullet || numbered) {
      flushParagraph();
      const ordered = Boolean(numbered);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push((bullet || numbered)![1]);
      continue;
    }

    flushList();
    if (!line.trim()) {
      flushParagraph();
    } else if (heading) {
      flushParagraph();
      blocks.push(
        <p key={`h-${blocks.length}`} className="font-semibold">
          {renderInline(heading[1], `h-${blocks.length}`)}
        </p>
      );
    } else {
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();

  return <div className="space-y-2 break-words">{blocks}</div>;
}
