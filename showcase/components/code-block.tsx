import { Highlight, type Language } from "prism-react-renderer";
import { CodeBlock as CoreCodeBlock } from "../../src/core";

export function CodeBlock({ code, language = "tsx" }: { code: string; language?: Language }) {
  return (
    <CoreCodeBlock
      code={code}
      language={language}
      renderCode={(source) => (
        <Highlight code={source} language={language}>
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
