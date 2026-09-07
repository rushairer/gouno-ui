import { Tabs, Text } from "../../../../src/core";

const items = [
  { key: "general", label: "常规", children: <Text>常规设置内容。</Text> },
  { key: "security", label: "安全", children: <Text>安全设置内容。</Text> },
  { key: "advanced", label: "高级", children: <Text>高级设置内容。</Text> },
] as const;

export function TabsPlacement() {
  return (
    <div className="min-h-44">
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
