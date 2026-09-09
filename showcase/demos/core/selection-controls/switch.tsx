import { useState } from "react";
import { Space, Switch, Text } from "../../../../src/core";

export default function SwitchDemo() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Space orientation="vertical" align="start">
      <Switch
        label="启用通知"
        checked={enabled}
        onChange={(event) => setEnabled(event.currentTarget.checked)}
      />
      <Switch label="系统策略" disabled defaultChecked />
      <Text size="sm" tone="muted" aria-live="polite">
        通知：{enabled ? "开启" : "关闭"}
      </Text>
    </Space>
  );
}
