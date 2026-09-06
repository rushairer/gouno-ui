import { useState, type ReactNode } from "react";
import { Heading, Text } from "../../src/core";
import { PageHeader, Panel } from "../../src/gouno";
import { ApiTable, type ApiRow } from "./api-table";
import { CodeBlock } from "./code-block";
import { DemoBlock } from "./demo-block";

export interface ComponentDemo {
  title: string;
  description?: string;
  code: string;
  render: () => ReactNode;
}

export interface ComponentDocument {
  title: string;
  description: string;
  code: string;
  render: () => ReactNode;
  demos?: ComponentDemo[];
  api?: ApiRow[];
  notes?: ReactNode;
}

const commonApi: ApiRow[] = [
  { name: "disabled", description: "禁用交互", type: "boolean", defaultValue: "false" },
  { name: "className", description: "追加样式类", type: "string" },
];

function DemoSection({ demo }: { demo: ComponentDemo }) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  return (
    <Panel>
      <div className="mb-4">
        <Heading level={3}>{demo.title}</Heading>
        {demo.description ? <Text tone="muted">{demo.description}</Text> : null}
      </div>
      <div className="mb-4 flex gap-1 border-b" role="tablist" aria-label={`${demo.title} 示例视图`}>
        {(["preview", "code"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            className={`border-b-2 px-3 py-2 text-sm ${tab === value ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
            onClick={() => setTab(value)}
          >
            {value === "preview" ? "Preview" : "Code"}
          </button>
        ))}
      </div>
      {tab === "preview" ? <DemoBlock>{demo.render()}</DemoBlock> : <CodeBlock code={demo.code} />}
    </Panel>
  );
}

export function ComponentPage({ document }: { document: ComponentDocument }) {
  const demos: ComponentDemo[] = [
    { title: "基础用法", code: document.code, render: document.render },
    ...(document.demos ?? []),
  ];
  return (
    <div className="space-y-6">
      <PageHeader title={document.title} description={document.description} />
      {demos.map((demo, index) => <DemoSection key={`${demo.title}-${index}`} demo={demo} />)}
      <Panel>
        <Heading level={3}>状态与用法</Heading>
        <Text tone="muted">Core 组件统一使用 semantic tokens，并提供键盘焦点、禁用态和表单关联。交互状态既可受控，也可在简单场景下使用默认值。</Text>
        {document.notes}
      </Panel>
      <Panel>
        <Heading level={3} className="mb-4">API</Heading>
        <ApiTable rows={document.api ?? commonApi} />
      </Panel>
    </div>
  );
}
