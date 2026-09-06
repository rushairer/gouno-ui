import { useState } from "react";

import { Select, Space, Text } from "../../../../src/core";
function ControlledSelectDemo() {
  const [value, setValue] = useState("design");
  return (
    <Space direction="vertical">
      <Select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="design">设计</option>
        <option value="engineering">工程</option>
        <option value="product">产品</option>
      </Select>
      <Text tone="muted">当前值：{value}</Text>
    </Space>
  );
}
export default function Example9() {
  return <ControlledSelectDemo />;
}
