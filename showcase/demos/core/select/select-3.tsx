import { useState } from "react";
import { Select, Space, Text } from "../../../../src/core";

export default function SelectClearDemo() {
  const [cleared, setCleared] = useState(false);
  return (
    <Space orientation="vertical">
      <Select aria-label="发布状态" allowClear defaultValue="ready" onClear={() => setCleared(true)}>
        <option value="">请选择状态</option>
        <option value="ready">已准备</option>
        <option value="draft">草稿</option>
      </Select>
      <Text tone="muted" aria-live="polite">{cleared ? "已清除选择" : "保留当前选择或使用清除按钮"}</Text>
    </Space>
  );
}
