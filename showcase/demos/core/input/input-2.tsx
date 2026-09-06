import { useState } from "react";
import { Search } from "lucide-react";
import { Input, Space, Text } from "../../../../src/core";
function ControlledInputDemo() {
  const [value, setValue] = useState("Gouno UI");
  return (
    <Space direction="vertical">
      <Input
        value={value}
        allowClear
        prefix={<Search />}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
      />
      <Text tone="muted">当前值：{value || "（空）"}</Text>
    </Space>
  );
}
export default function Example3() {
  return <ControlledInputDemo />;
}
