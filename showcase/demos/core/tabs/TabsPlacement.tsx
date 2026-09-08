import { Card, Tabs, Text } from "../../../../src/core";

const panel = (label: string) => (
  <Card padding="base" className="bg-muted/15 shadow-none">
    <Text>{label}</Text>
  </Card>
);

const items = [
  { key: "general", label: "常规", children: panel("常规设置内容。") },
  { key: "security", label: "安全", children: panel("安全设置内容。") },
  { key: "advanced", label: "高级", children: panel("高级设置内容。") },
] as const;

export function TabsPlacement() {
  return (
    <div className="min-h-44 max-w-3xl">
      <Tabs
        ariaLabel="设置栏目"
        defaultActiveKey="general"
        items={items}
        tabPosition="left"
        size="small"
      />
    </div>
  );
}
