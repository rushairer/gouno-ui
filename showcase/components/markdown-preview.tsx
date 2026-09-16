import type { HTMLAttributes, ReactNode } from "react";
import { Text } from "../../src/core";
import { cn } from "../../src/lib/utils";
import { CodeBlock } from "./code-block";

export interface MarkdownPreviewProps extends HTMLAttributes<HTMLElement> {
  value: string;
  emptyLabel?: ReactNode;
}

function safeUrl(value: string, kind: "href" | "src") {
  const url = value.trim();
  if (!url) return kind === "href" ? "#" : "";
  if (/^(https?:\/\/|\/|#)/i.test(url)) return url;
  if (kind === "href" && /^mailto:/i.test(url)) return url;
  return kind === "href" ? "#" : "";
}

function renderInline(source: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const token = /(!?\[[^\]\n]+\]\([^\s)]+\)|`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = token.exec(source)) !== null) {
    if (match.index > cursor) nodes.push(source.slice(cursor, match.index));
    const value = match[0];
    const key = `${keyPrefix}-${index++}`;

    if (value.startsWith("![")) {
      const image = value.match(/^!\[([^\]]+)\]\(([^)]+)\)$/);
      const src = image ? safeUrl(image[2], "src") : "";
      nodes.push(
        src ? (
          <img key={key} src={src} alt={image?.[1] ?? ""} className="my-3 max-h-96 max-w-full rounded-md border object-contain" />
        ) : (
          <span key={key}>{value}</span>
        ),
      );
    } else if (value.startsWith("[")) {
      const link = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      nodes.push(
        link ? (
          <a key={key} href={safeUrl(link[2], "href")} className="font-medium text-primary underline underline-offset-4">
            {link[1]}
          </a>
        ) : (
          <span key={key}>{value}</span>
        ),
      );
    } else if (value.startsWith("`")) {
      nodes.push(<code key={key} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.92em]">{value.slice(1, -1)}</code>);
    } else if (value.startsWith("**") || value.startsWith("__")) {
      nodes.push(<strong key={key} className="font-semibold text-foreground">{value.slice(2, -2)}</strong>);
    } else if (value.startsWith("~~")) {
      nodes.push(<del key={key}>{value.slice(2, -2)}</del>);
    } else {
      nodes.push(<em key={key}>{value.slice(1, -1)}</em>);
    }

    cursor = match.index + value.length;
  }

  if (cursor < source.length) nodes.push(source.slice(cursor));
  return nodes;
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableDelimiter(line: string) {
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function isHorizontalRule(line: string) {
  return /^\s{0,3}((\*\s*){3,}|(-\s*){3,}|(_\s*){3,})\s*$/.test(line);
}

function isBlockStart(lines: string[], index: number) {
  const line = lines[index] ?? "";
  const next = lines[index + 1] ?? "";
  return (
    /^\s*(```|~~~)/.test(line) ||
    /^\s{0,3}#{1,6}\s+/.test(line) ||
    /^\s*>\s?/.test(line) ||
    /^\s*[-*+]\s+\[[ xX]\]\s+/.test(line) ||
    /^\s*[-*+]\s+/.test(line) ||
    /^\s*\d+[.)]\s+/.test(line) ||
    isHorizontalRule(line) ||
    (line.includes("|") && isTableDelimiter(next))
  );
}

function renderParagraph(text: string, key: string) {
  const lines = text.split("\n");
  return (
    <p key={key} className="text-sm leading-7 text-muted-foreground">
      {lines.flatMap((line, index) => [
        ...renderInline(line, `${key}-line-${index}`),
        index < lines.length - 1 ? <br key={`${key}-br-${index}`} /> : null,
      ])}
    </p>
  );
}

export function MarkdownPreview({ value, emptyLabel = "开始写作后，预览会出现在这里。", className, ...props }: MarkdownPreviewProps) {
  const source = value.trim();
  if (!source) return <Text tone="muted">{emptyLabel}</Text>;

  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  let blockIndex = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const key = `markdown-block-${blockIndex++}`;
    const fence = line.match(/^\s*(```|~~~)\s*([^\s]*)\s*$/);
    if (fence) {
      const marker = fence[1];
      const language = fence[2] || "text";
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trimStart().startsWith(marker)) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push(<CodeBlock key={key} code={codeLines.join("\n")} language={language} />);
      continue;
    }

    const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const headingClass = {
        1: "text-2xl font-semibold tracking-tight",
        2: "text-xl font-semibold tracking-tight",
        3: "text-base font-semibold",
        4: "text-sm font-semibold",
        5: "text-sm font-semibold text-muted-foreground",
        6: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
      }[level];
      const content = renderInline(heading[2], key);
      blocks.push(
        level === 1 ? <h1 key={key} className={headingClass}>{content}</h1>
          : level === 2 ? <h2 key={key} className={headingClass}>{content}</h2>
            : level === 3 ? <h3 key={key} className={headingClass}>{content}</h3>
              : level === 4 ? <h4 key={key} className={headingClass}>{content}</h4>
                : level === 5 ? <h5 key={key} className={headingClass}>{content}</h5>
                  : <h6 key={key} className={headingClass}>{content}</h6>,
      );
      index += 1;
      continue;
    }

    if (isHorizontalRule(line)) {
      blocks.push(<hr key={key} className="border-border" />);
      index += 1;
      continue;
    }

    if (line.includes("|") && isTableDelimiter(lines[index + 1] ?? "")) {
      const header = splitTableRow(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].trim() && lines[index].includes("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }
      blocks.push(
        <div key={key} className="overflow-x-auto rounded-md border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                {header.map((cell, cellIndex) => (
                  <th key={`${key}-head-${cellIndex}`} className="border-b px-3 py-2 font-semibold">
                    {renderInline(cell, `${key}-head-${cellIndex}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${key}-row-${rowIndex}`} className="border-b last:border-b-0">
                  {header.map((_, cellIndex) => (
                    <td key={`${key}-cell-${rowIndex}-${cellIndex}`} className="px-3 py-2 text-muted-foreground">
                      {renderInline(row[cellIndex] ?? "", `${key}-cell-${rowIndex}-${cellIndex}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      blocks.push(
        <blockquote key={key} className="border-l-2 pl-4 text-sm leading-7 text-muted-foreground">
          {quoteLines.flatMap((quoteLine, quoteIndex) => [
            ...renderInline(quoteLine, `${key}-${quoteIndex}`),
            quoteIndex < quoteLines.length - 1 ? <br key={`${key}-br-${quoteIndex}`} /> : null,
          ])}
        </blockquote>,
      );
      continue;
    }

    if (/^\s*[-*+]\s+\[[ xX]\]\s+/.test(line)) {
      const items: { checked: boolean; text: string }[] = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*[-*+]\s+\[([ xX])\]\s+(.+)$/);
        if (!match) break;
        items.push({ checked: match[1].toLowerCase() === "x", text: match[2] });
        index += 1;
      }
      blocks.push(
        <ul key={key} className="space-y-1.5 text-sm leading-7 text-muted-foreground">
          {items.map((item, itemIndex) => (
            <li key={`${key}-${itemIndex}`} className="flex items-start gap-2">
              <input type="checkbox" checked={item.checked} readOnly disabled className="mt-1.5 size-4 shrink-0" />
              <span>{renderInline(item.text, `${key}-${itemIndex}`)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*[-*+]\s+(.+)$/);
        if (!match || /^\[[ xX]\]\s+/.test(match[1])) break;
        items.push(match[1]);
        index += 1;
      }
      blocks.push(
        <ul key={key} className="list-disc space-y-1 pl-6 text-sm leading-7 text-muted-foreground">
          {items.map((item, itemIndex) => (
            <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*\d+[.)]\s+(.+)$/);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }
      blocks.push(
        <ol key={key} className="list-decimal space-y-1 pl-6 text-sm leading-7 text-muted-foreground">
          {items.map((item, itemIndex) => (
            <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines, index)) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push(renderParagraph(paragraphLines.join("\n"), key));
  }

  return (
    <article {...props} className={cn("mx-auto max-w-3xl space-y-4", className)}>
      {blocks}
    </article>
  );
}
