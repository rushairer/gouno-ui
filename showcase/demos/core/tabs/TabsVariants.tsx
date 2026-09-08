import { Card, Tabs, Text } from "../../../../src/core";

const panel = (label: string) => (
  <Card padding="base" className="bg-muted/15 shadow-none">
    <Text>{label}</Text>
  </Card>
);

const items = [
  { key: "one", label: "项目", children: panel("项目列表。") },
  { key: "two", label: "成员", children: panel("成员列表。") },
  { key: "three", label: "权限", children: panel("权限设置。") },
] as const;

export function TabsVariants() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Text size="sm" tone="muted">Line · 默认</Text>
        <Tabs ariaLabel="线型标签页" defaultActiveKey="one" items={items} />
      </div>
      <div className="flex flex-col gap-2">
        <Text size="sm" tone="muted">Card</Text>
        <Tabs ariaLabel="卡片标签页" defaultActiveKey="one" items={items} type="card" />
      </div>
    </div>
  );
}
