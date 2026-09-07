import { Tabs, Text } from "../../../../src/core";

const items = [
  { key: "one", label: "项目", children: <Text>项目列表。</Text> },
  { key: "two", label: "成员", children: <Text>成员列表。</Text> },
  { key: "three", label: "权限", children: <Text>权限设置。</Text> },
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
