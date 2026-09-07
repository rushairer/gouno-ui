import { Heading, Space, Text } from "../../../../src/core";

export default function TypographyExample() {
  return (
    <Space orientation="vertical" gap="sm">
      <Heading level={2}>组件文档</Heading>
      <Text size="lg">面向产品团队的共享 UI 基础。</Text>
      <Text tone="muted">辅助说明使用 muted，不依赖颜色之外的语义。</Text>
      <Text tone="danger">错误信息明确关联到当前内容。</Text>
    </Space>
  );
}
