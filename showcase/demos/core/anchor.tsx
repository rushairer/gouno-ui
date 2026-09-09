import type { ComponentDocument } from "../../components/component-page";
import AnchorBasicDemo from "./anchor/basic";
import AnchorBasicDemoSource from "./anchor/basic.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const anchorDocument: ComponentDocument = {
  title: "Anchor 锚点",
  description:
    "页面内章节导航。默认保留原生 hash 行为；固定头部遮挡优先由目标章节的 CSS scroll-margin-top 处理，需要组件主动滚动时才使用 offset。",
  code: publicSource(AnchorBasicDemoSource),
  render: () => <AnchorBasicDemo />,
  api: [
    { name: "items", description: "章节链接数据；key 默认生成 #key，href 可显式覆盖", type: "readonly AnchorItem[]" },
    { name: "offset", description: "本地 hash 目标的顶部像素偏移；0 时不劫持浏览器原生滚动", type: "number", defaultValue: "0" },
    { name: "aria-label", description: "目录导航的标准可访问名称", type: "string", defaultValue: '"On this page"' },
    { name: "className", description: "附加根 nav 样式类", type: "string" },
  ],
  notes: (
    <p className="text-sm text-muted-foreground">
      对 sticky header 场景优先给目标 heading 设置 scroll-margin-top；这样键盘、复制链接和浏览器原生 hash 导航共享同一位置语义。offset 只用于调用方无法控制目标章节样式的场景。
    </p>
  ),
};