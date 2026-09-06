import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Highlight, type Language } from "prism-react-renderer";

async function copyText(code: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(code);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = code;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function CodeBlock({ code, language = "tsx" }: { code: string; language?: Language }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);
  return (
    <div className="code-block overflow-hidden rounded-md border bg-card">
      <div className="flex min-h-10 items-center justify-between border-b bg-muted/50 px-3">
        <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{language}</span>
        <button
          type="button"
          className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={copied ? "代码已复制" : "复制代码"}
          onClick={async () => { await copyText(code); setCopied(true); }}
        >
          {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <Highlight code={code.trim()} language={language}>
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} code-block__pre overflow-auto bg-background p-4 text-sm leading-6 text-foreground`}>
            <code>{tokens.map((line, lineIndex) => <span key={lineIndex} {...getLineProps({ line })} className="code-line">{line.map((token, tokenIndex) => {
              const properties = getTokenProps({ token });
              return <span key={tokenIndex} {...properties} style={undefined} className={token.types.map((type) => `syntax-${type}`).join(" ")} />;
            })}{lineIndex < tokens.length - 1 ? "\n" : null}</span>)}</code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
