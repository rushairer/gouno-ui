import { useState } from "react";
import { Button, Flex, Progress, Space, Text } from "../../../../src/core";

export default function ProgressExample() {
  const [value, setValue] = useState(64);
  return (
    <Space orientation="vertical" gap="sm" className="w-full max-w-xl">
      <Progress value={value} max={100} aria-label="上传进度" />
      <Flex align="center" justify="space-between" className="w-full">
        <Text tone="muted">已完成 {value}%</Text>
        <Space>
          <Button size="small" onClick={() => setValue((current) => Math.max(0, current - 10))}>减少</Button>
          <Button size="small" variant="solid" color="primary" onClick={() => setValue((current) => Math.min(100, current + 10))}>增加</Button>
        </Space>
      </Flex>
    </Space>
  );
}
