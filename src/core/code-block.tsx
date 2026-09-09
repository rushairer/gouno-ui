import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Canonical source text used for both display input and clipboard copy. */
  code: string;
  /** Optional language label. Syntax rendering remains caller-owned through renderCode. */
  language?: string;
  /** Whether to expose the copy action. */
  copyable?: boolean;
  /** Accessible and visible label for the copy action. */
  copyLabel?: string;
  /** Accessible and visible label shown after a successful copy. */
  copiedLabel?: string;
  /** Optional presentation hook for syntax highlighting. Receives the exact canonical code string. */
  renderCode?: (code: string) => ReactNode;
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall back to the document copy path for restricted clipboard contexts.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Unable to copy code");
}

export function CodeBlock({
  code,
  language,
  copyable = true,
  copyLabel = "复制代码",
  copiedLabel = "代码已复制",
  renderCode,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const showToolbar = Boolean(language) || copyable;

  const handleCopy = async () => {
    try {
      await copyText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      {...props}
      data-slot="code-block"
      data-language={language || undefined}
      className={cn("min-w-0 overflow-hidden rounded-lg border bg-card", className)}
    >
      {showToolbar ? (
        <div
          data-slot="code-block-toolbar"
          className="flex min-h-10 items-center justify-between gap-3 border-b bg-muted/40 px-3"
        >
          {language ? (
            <span
              data-slot="code-block-language"
              className="min-w-0 truncate font-mono text-xs uppercase tracking-wide text-muted-foreground"
            >
              {language}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
          {copyable ? (
            <Button
              type="button"
              size="small"
              variant="text"
              className="h-8 shrink-0 px-2 text-xs text-muted-foreground"
              aria-label={copied ? copiedLabel : copyLabel}
              icon={copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              onClick={() => void handleCopy()}
            >
              <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
            </Button>
          ) : null}
        </div>
      ) : null}
      <pre
        data-slot="code-block-pre"
        className="m-0 max-w-full overflow-auto bg-background p-4 font-mono text-sm leading-6 text-foreground [tab-size:2]"
      >
        <code data-slot="code-block-code">{renderCode ? renderCode(code) : code}</code>
      </pre>
    </div>
  );
}
