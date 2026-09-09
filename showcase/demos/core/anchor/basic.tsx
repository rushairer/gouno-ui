import { Anchor, Heading, Text } from "../../../../src/core";

const items = [
  { key: "anchor-overview", title: "概览" },
  { key: "anchor-contract", title: "交互契约" },
  { key: "anchor-accessibility", title: "可访问性" },
];

export default function AnchorBasicDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-[11rem_minmax(0,1fr)]">
      <Anchor aria-label="示例文章目录" items={items} className="self-start" />
      <div className="space-y-8">
        <section id="anchor-overview" className="scroll-mt-24 space-y-2">
          <Heading level={3}>概览</Heading>
          <Text tone="muted">Anchor 使用真实 hash 链接连接页面内章节。</Text>
        </section>
        <section id="anchor-contract" className="scroll-mt-24 space-y-2">
          <Heading level={3}>交互契约</Heading>
          <Text tone="muted">默认保留浏览器原生锚点行为；固定头部间距优先由目标章节的 scroll-margin-top 拥有。</Text>
        </section>
        <section id="anchor-accessibility" className="scroll-mt-24 space-y-2">
          <Heading level={3}>可访问性</Heading>
          <Text tone="muted">通过标准 aria-label 为目录导航提供产品语言中的可访问名称。</Text>
        </section>
      </div>
    </div>
  );
}