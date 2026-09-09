import { useState } from "react";
import { CheckableTag, Space, Text } from "../../../../src/core";

export default function UncontrolledTagDemo() {
  const [action, setAction] = useState("点击标签切换状态");

  return (
    <Space orientation="vertical" align="start">
      <CheckableTag
        defaultChecked
        onChange={(checked) =>
          setAction(checked ? "已选中 TypeScript" : "已取消 TypeScript")
        }
      >
        TypeScript
      </CheckableTag>
      <Text tone="muted" aria-live="polite">
        {action}
      </Text>
    </Space>
  );
}
