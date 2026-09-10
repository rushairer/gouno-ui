import { useState } from "react";
import { Button, Tabs, Text } from "../../../../src/core";

const items = [
  { key: "profile", label: "资料", children: <Text>个人资料设置。</Text> },
  { key: "security", label: "安全", children: <Text>安全与认证设置。</Text> },
] as const;

type TabKey = (typeof items)[number]["key"];

export function ControlledTabs() {
  const [activeKey, setActiveKey] = useState<TabKey>("profile");
  return (
    <div className="flex flex-col gap-4">
      <Tabs
        aria-label="账户栏目"
        activeKey={activeKey}
        items={items}
        onChange={setActiveKey}
        tabBarExtraContent={
          <Button size="small" onClick={() => setActiveKey("security")}>
            打开安全设置
          </Button>
        }
      />
      <Text tone="muted" size="sm">当前：{activeKey}</Text>
    </div>
  );
}
