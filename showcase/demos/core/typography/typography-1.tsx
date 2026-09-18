import { Heading, Space, Text, Typography } from "../../../../src/core";

export default function TypographySemanticsExample() {
  return (
    <Space orientation="vertical" gap="md" align="start">
      <Heading level={1} variant="page" id="page-title" data-context="page">
        页面主标题
      </Heading>
      <Heading level={2} variant="task">
        嵌套任务标题
      </Heading>
      <Heading level={1} variant="task">
        独立任务标题（同一视觉 role，不同 document level）
      </Heading>
      <Heading level={3} variant="section">区块标题</Heading>
      <Text
        as="span"
        size="sm"
        tone="muted"
        weight="medium"
        family="mono"
        data-kind="metadata"
      >
        2026-09-09 · 5 分钟阅读
      </Text>
      <Text size="sm" tone="muted" leading="relaxed">
        较长的辅助说明通过 semantic leading 控制阅读节奏，而不是 className 中的 leading-*。
      </Text>
      <Text tone="success">配置已保存。</Text>
      <Typography as="small" data-kind="primitive">
        仅需要统一基础文字样式时使用 Typography。
      </Typography>
    </Space>
  );
}
