import type { ComponentDocument } from "../../components/component-page";
import { layoutDocuments } from "./layout";
import LayoutFoundationsDemo from "./layout-primitives/layout-foundations";
import LayoutFoundationsDemoSource from "./layout-primitives/layout-foundations.tsx?raw";
import StackDemo from "./layout-primitives/stack";
import StackDemoSource from "./layout-primitives/stack.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const surfaceReview5bDocuments: Record<string, ComponentDocument> = {
  flex: {
    ...layoutDocuments.flex,
    description:
      "Flex 是通用弹性布局；Stack 作为 established Core sibling 保留在同一 family，用数值 gap 和 direction 表达简单的堆叠布局，不创建第二套页面结构语义。",
    demos: [
      ...(layoutDocuments.flex.demos ?? []),
      {
        title: "Stack 便捷堆叠",
        description:
          "Stack 适合简单的纵向/反向 flex 排列；需要 align、justify、token gap 或 wrap 时优先使用 Flex。",
        code: canonicalCoreSource(StackDemoSource),
        render: () => <StackDemo />,
      },
    ],
    apiSections: [
      ...(layoutDocuments.flex.apiSections ?? []),
      {
        title: "Stack API",
        rows: [
          {
            name: "direction",
            description: "flex 主轴方向。",
            type: '"row" | "column" | "row-reverse" | "column-reverse"',
            defaultValue: '"column"',
          },
          {
            name: "gap",
            description: "子项间距，按像素数值写入 inline gap。",
            type: "number",
            defaultValue: "16",
          },
          {
            name: "...div props",
            description: "透传原生 div 属性、事件、aria/data 和 className/style。",
            type: "HTMLAttributes<HTMLDivElement>",
          },
          {
            name: "ref",
            description: "指向真实 Stack div。",
            type: "Ref<HTMLDivElement>",
          },
        ],
      },
    ],
  },
  "page-layout": {
    ...layoutDocuments["page-layout"],
    description:
      "Layout family 包含页面区域骨架以及 established Core 的低层结构 wrappers：App 负责最小根高度，Container 提供居中宽度约束，AspectRatio 负责稳定内容比例。它们不承担 AppShell 路由、导航或产品策略。",
    demos: [
      ...(layoutDocuments["page-layout"].demos ?? []),
      {
        title: "App / Container / AspectRatio 基础结构",
        description:
          "三个 wrappers 只负责各自的 DOM/layout 约束；产品级应用框架仍使用 Gouno AppShell，页面内容策略仍由调用方拥有。",
        code: canonicalCoreSource(LayoutFoundationsDemoSource),
        render: () => <LayoutFoundationsDemo />,
      },
    ],
    apiSections: [
      ...(layoutDocuments["page-layout"].apiSections ?? []),
      {
        title: "App API",
        rows: [
          {
            name: "...div props",
            description: "透传原生 div 属性；默认仅增加 min-h-full。",
            type: "HTMLAttributes<HTMLDivElement>",
          },
          { name: "ref", description: "指向真实 App div。", type: "Ref<HTMLDivElement>" },
        ],
      },
      {
        title: "Container API",
        rows: [
          {
            name: "...div props",
            description: "透传原生 div 属性；默认提供居中、max-w-7xl 与水平内边距。",
            type: "HTMLAttributes<HTMLDivElement>",
          },
          {
            name: "ref",
            description: "指向真实 Container div。",
            type: "Ref<HTMLDivElement>",
          },
        ],
      },
      {
        title: "AspectRatio API",
        rows: [
          {
            name: "ratio",
            description: "宽高比；非有限值或非正数回退为 16/9。",
            type: "number",
            defaultValue: "16 / 9",
          },
          {
            name: "children",
            description: "受比例约束的内容。",
            type: "ReactNode",
          },
          {
            name: "...div props",
            description: "透传原生 div 属性、className、style、aria/data 与事件。",
            type: "HTMLAttributes<HTMLDivElement>",
          },
          {
            name: "ref",
            description: "指向真实 AspectRatio div。",
            type: "Ref<HTMLDivElement>",
          },
        ],
      },
    ],
  },
};
