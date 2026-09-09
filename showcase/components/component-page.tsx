import type { ReactNode } from "react";
import { Card, Heading, Text } from "../../src/core";
import { ApiTable, type ApiRow } from "./api-table";
import { DemoSection } from "./demo-section";

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
  apiSections?: { title: string; description?: string; rows: ApiRow[] }[];
}

const commonApi: ApiRow[] = [
  {
    name: "disabled",
    description: "禁用交互",
    type: "boolean",
    defaultValue: "false",
  },
  { name: "className", description: "追加样式类", type: "string" },
];

export function ComponentPage({ document }: { document: ComponentDocument }) {
  const demos: ComponentDemo[] = [
    { title: "基础用法", code: document.code, render: document.render },
    ...(document.demos ?? []),
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Core · @gouno/ui/core
        </div>
        <Heading level={1}>{document.title}</Heading>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          {document.description}
        </Text>
      </header>
      {demos.map((demo, index) => (
        <DemoSection
          key={`${demo.title}-${index}`}
          title={demo.title}
          description={demo.description}
          code={demo.code}
        >
          {demo.render()}
        </DemoSection>
      ))}
      <Card>
        <Heading level={3}>状态与用法</Heading>
        <Text tone="muted">
          Core 组件统一使用 semantic tokens，并提供键盘焦点、禁用态和表单关联。交互状态既可受控，也可在简单场景下使用默认值。
        </Text>
        {document.notes}
      </Card>
      <Card>
        <Heading level={3} className="mb-4">
          API
        </Heading>
        <ApiTable rows={document.api ?? commonApi} />
        {document.apiSections?.map((section) => (
          <section key={section.title} className="mt-6 space-y-3">
            <Heading level={3}>{section.title}</Heading>
            {section.description ? <Text tone="muted">{section.description}</Text> : null}
            <ApiTable rows={section.rows} />
          </section>
        ))}
      </Card>
    </div>
  );
}
