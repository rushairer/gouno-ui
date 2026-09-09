import { useState, type ReactNode } from "react";
import { Card, Heading, Text } from "../../src/core";
import { CodeBlock } from "./code-block";
import { DemoBlock } from "./demo-block";

export interface DemoSectionProps {
  title: string;
  description?: string;
  code: string;
  children: ReactNode;
}

/**
 * Canonical Showcase example surface used by every Gouno UI documentation layer.
 * Preview and source stay paired so consumers can validate the rendered contract
 * and copy the matching canonical API usage from the same example.
 */
export function DemoSection({ title, description, code, children }: DemoSectionProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <Card>
      <div className="mb-4">
        <Heading level={3}>{title}</Heading>
        {description ? <Text tone="muted">{description}</Text> : null}
      </div>
      <div
        className="mb-4 flex gap-1 border-b"
        role="tablist"
        aria-label={`${title} 示例视图`}
      >
        {(["preview", "code"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            className={`border-b-2 px-3 py-2 text-sm ${
              tab === value
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
            onClick={() => setTab(value)}
          >
            {value === "preview" ? "Preview" : "Code"}
          </button>
        ))}
      </div>
      {tab === "preview" ? <DemoBlock>{children}</DemoBlock> : <CodeBlock code={code} />}
    </Card>
  );
}
