import { useState } from "react";

import { InputNumber, Space, Text } from "../../../../src/core";
function ControlledInputNumberDemo() {
  const [value, setValue] = useState<number | null>(1280);
  return (
    <Space direction="vertical">
      <InputNumber
        value={value}
        min={0}
        step={100}
        precision={2}
        formatter={(n) => (n === null ? "" : `¥ ${n}`)}
        parser={(s) => Number(s.replace(/[^0-9.-]/g, ""))}
        onChange={setValue}
      />
      <Text tone="muted">数值：{value ?? "空"}</Text>
    </Space>
  );
}
export default function Example11() {
  return <ControlledInputNumberDemo />;
}
