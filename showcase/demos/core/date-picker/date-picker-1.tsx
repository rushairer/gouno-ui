import { useState } from "react";

import { DatePicker, Space, Text } from "../../../../src/core";
function ControlledDatePickerDemo() {
  const [value, setValue] = useState("2026-09-06");
  return (
    <Space orientation="vertical">
      <DatePicker value={value} allowClear onChange={setValue} />
      <Text tone="muted">日期：{value || "未选择"}</Text>
    </Space>
  );
}
export default function Example13() {
  return <ControlledDatePickerDemo />;
}
