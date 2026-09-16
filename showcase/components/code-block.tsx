import { Highlight, type Language } from "prism-react-renderer";
import { CodeBlock as CoreCodeBlock } from "../../src/core";

const languageAliases: Record<string, Language> = {
  cjs: "javascript",
  go: "clike",
  html: "markup",
  js: "javascript",
  jsonc: "json",
  md: "markdown",
  py: "python",
  rust: "clike",
  sh: "bash",
  shell: "bash",
  ts: "typescript",
  yml: "yaml",
};

const supportedLanguages = new Set<Language>([
  "bash",
  "c",
  "clike",
  "cpp",
  "css",
  "javascript",
  "jsx",
  "json",
  "markdown",
  "markup",
  "python",
  "sql",
  "tsx",
  "typescript",
  "yaml",
]);

function normalizeLanguage(language: string): Language {
  const normalized = language.trim().toLowerCase();
  const alias = languageAliases[normalized];
  if (alias) return alias;
  if (supportedLanguages.has(normalized as Language)) return normalized as Language;
  return "markup";
}

export function CodeBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  const prismLanguage = normalizeLanguage(language);

  return (
    <CoreCodeBlock
      code={code}
      language={language}
      renderCode={(source) => (
        <Highlight code={source} language={prismLanguage}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <>
              {tokens.map((line, lineIndex) => (
                <span key={lineIndex} {...getLineProps({ line })} className="code-line">
                  {line.map((token, tokenIndex) => {
                    const properties = getTokenProps({ token });
                    return (
                      <span
                        key={tokenIndex}
                        {...properties}
                        style={undefined}
                        className={token.types.map((type) => `syntax-${type}`).join(" ")}
                      />
                    );
                  })}
                  {lineIndex < tokens.length - 1 ? "\n" : null}
                </span>
              ))}
            </>
          )}
        </Highlight>
      )}
    />
  );
}
