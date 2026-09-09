import { useState } from "react";
import { Button, Space, Text } from "../../../../src/core";

export default function ButtonTypesDemo() {
  const [action, setAction] = useState("尚未操作");

  return (
    <Space orientation="vertical">
      <Space wrap>
        <Button
          variant="solid"
          color="primary"
          onClick={() => setAction("主要按钮")}
        >
          主要按钮
        </Button>
        <Button variant="outline" onClick={() => setAction("次要按钮")}>
          次要按钮
        </Button>
        <Button variant="dashed" onClick={() => setAction("虚线按钮")}>
          虚线按钮
        </Button>
        <Button variant="text" onClick={() => setAction("文本按钮")}>
          文本按钮
        </Button>
        <Button variant="link" onClick={() => setAction("操作型链接按钮")}>
          操作型链接
        </Button>
      </Space>
      <Text tone="muted" aria-live="polite">
        最近操作：{action}
      </Text>
    </Space>
  );
}
