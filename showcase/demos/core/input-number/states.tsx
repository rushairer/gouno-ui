import { useState } from "react";

import { InputNumber, Select, Space, Text } from "../../../../src/core";

export default function InputNumberStatesDemo() {
  const [state, setState] = useState("ready");
  const [value, setValue] = useState<number | null>(12.5);
  return (
    <Space orientation="vertical" align="stretch">
      <Select
        aria-label="数字输入状态"
        value={state}
        onChange={(next) => setState(String(next))}
      >
        <option value="ready">正常</option>
        <option value="disabled">禁用</option>
        <option value="readonly">只读</option>
        <option value="error">错误</option>
      </Select>
      <InputNumber
        value={value}
        onChange={setValue}
        size="large"
        min={0}
        max={100}
        step={0.5}
        precision={2}
        disabled={state === "disabled"}
        readOnly={state === "readonly"}
        status={state === "error" ? "error" : undefined}
        aria-label="百分比"
      />
      <Text role="status">{value ?? "空"}</Text>
    </Space>
  );
}
