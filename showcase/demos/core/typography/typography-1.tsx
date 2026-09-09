import { Heading, Space, Text, Typography } from "../../../../src/core";

export default function TypographySemanticsExample() {
  return (
    <Space orientation="vertical" gap="md" align="start">
      <Heading level={1} id="page-title" data-context="page">
        页面主标题
      </Heading>
      <Heading level={3}>区块标题</Heading>
      <Text as="span" size="sm" tone="muted" data-kind="metadata">
        2026-09-09 · 5 分钟阅读
      </Text>
      <Text tone="success">配置已保存。</Text>
      <Typography as="small" data-kind="primitive">
        仅需要统一基础文字样式时使用 Typography。
      </Typography>
    </Space>
  );
}
