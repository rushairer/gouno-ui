import type { HTMLAttributes, ReactNode } from "react";
import { Text } from "../../src/core";
import { cn } from "../../src/lib/utils";

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
  const token = /(!?\[[^\]\n]+\]\([^\s)]+\)|`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;
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
    } else if (value.startsWith("**")) {
      nodes.push(<strong key={key} className="font-semibold text-foreground">{value.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key}>{value.slice(1, -1)}</em>);
    }

    cursor = match.index + value.length;
  }

  if (cursor < source.length) nodes.push(source.slice(cursor));
  return nodes;
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

  return (
    <article {...props} className={cn("mx-auto max-w-3xl space-y-4", className)}>
      {source.split(/\n{2,}/).map((block, index) => {
        const text = block.trim();
        const key = `markdown-block-${index}`;

        if (text.startsWith("```") && text.endsWith("```")) {
          return (
            <pre key={key} className="overflow-x-auto rounded-md bg-muted p-4 font-mono text-xs leading-6">
              <code>{text.replace(/^```[^\n]*\n?/, "").replace(/```$/, "")}</code>
            </pre>
          );
        }
        if (text.startsWith("### ")) {
          return <h3 key={key} className="text-base font-semibold">{renderInline(text.slice(4), key)}</h3>;
        }
        if (text.startsWith("## ")) {
          return <h2 key={key} className="text-xl font-semibold tracking-tight">{renderInline(text.slice(3), key)}</h2>;
        }
        if (text.startsWith("# ")) {
          return <h1 key={key} className="text-2xl font-semibold tracking-tight">{renderInline(text.slice(2), key)}</h1>;
        }
        if (text.split("\n").every((line) => /^[-*]\s+/.test(line))) {
          return (
            <ul key={key} className="list-disc space-y-1 pl-6 text-sm leading-7 text-muted-foreground">
              {text.split("\n").map((line, lineIndex) => (
                <li key={`${key}-${lineIndex}`}>{renderInline(line.replace(/^[-*]\s+/, ""), `${key}-${lineIndex}`)}</li>
              ))}
            </ul>
          );
        }
        if (text.split("\n").every((line) => /^\d+\.\s+/.test(line))) {
          return (
            <ol key={key} className="list-decimal space-y-1 pl-6 text-sm leading-7 text-muted-foreground">
              {text.split("\n").map((line, lineIndex) => (
                <li key={`${key}-${lineIndex}`}>{renderInline(line.replace(/^\d+\.\s+/, ""), `${key}-${lineIndex}`)}</li>
              ))}
            </ol>
          );
        }
        if (text.split("\n").every((line) => line.startsWith("> "))) {
          return (
            <blockquote key={key} className="border-l-2 pl-4 text-sm leading-7 text-muted-foreground">
              {text.split("\n").flatMap((line, lineIndex) => [
                ...renderInline(line.slice(2), `${key}-${lineIndex}`),
                lineIndex < text.split("\n").length - 1 ? <br key={`${key}-br-${lineIndex}`} /> : null,
              ])}
            </blockquote>
          );
        }
        return renderParagraph(text, key);
      })}
    </article>
  );
}
