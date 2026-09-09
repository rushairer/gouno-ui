import { useState } from "react";
import { Checkbox, Space, Text } from "../../../../src/core";

export default function CheckboxDemo() {
  const [checked, setChecked] = useState(true);

  return (
    <Space orientation="vertical" align="start">
      <Checkbox
        label="接受条款"
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
      />
      <Checkbox label="已锁定选项" disabled defaultChecked />
      <Text size="sm" tone="muted" aria-live="polite">
        当前：{checked ? "已接受" : "未接受"}
      </Text>
    </Space>
  );
}
