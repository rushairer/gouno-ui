import { useState } from "react";

import { DatePicker, Select, Space, Text } from "../../../../src/core";

export default function DatePickerStatesDemo() {
  const [state, setState] = useState("ready");
  const [value, setValue] = useState("2026-09-06");
  const readOnly = state === "readonly";
  const disabled = state === "disabled";
  return (
    <Space orientation="vertical" align="stretch">
      <Select
        aria-label="日期状态"
        value={state}
        onChange={(event) => setState(event.target.value)}
      >
        <option value="ready">正常</option>
        <option value="disabled">禁用</option>
        <option value="readonly">只读</option>
        <option value="error">错误</option>
      </Select>
      <DatePicker
        value={value}
        onChange={setValue}
        min="2026-01-01"
        max="2026-12-31"
        disabled={disabled}
        readOnly={readOnly}
        status={state === "error" ? "error" : undefined}
        allowClear
        aria-label="日期"
      />
      <Text role="status">{value || "未选择日期"}</Text>
    </Space>
  );
}
