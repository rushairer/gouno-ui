import { Card, Grid, Space, Splitter } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
import FlexDemo from "./flex/flex-0";
import FlexDemoSource from "./flex/flex-0.tsx?raw";
import FlexWrapDemo from "./flex/flex-1";
import FlexWrapDemoSource from "./flex/flex-1.tsx?raw";
import PageLayoutDemo from "./page-layout/page-layout-0";
import PageLayoutDemoSource from "./page-layout/page-layout-0.tsx?raw";
import SeparatorDemo from "./separator/separator-0";
import SeparatorDemoSource from "./separator/separator-0.tsx?raw";
import SeparatorVerticalDemo from "./separator/separator-1";
import SeparatorVerticalDemoSource from "./separator/separator-1.tsx?raw";
import SpaceBasicDemo from "./space/space-0";
import SpaceBasicDemoSource from "./space/space-0.tsx?raw";
import SpaceAlignmentDemo from "./space/space-1";
import SpaceAlignmentDemoSource from "./space/space-1.tsx?raw";
import SpaceWrapSplitDemo from "./space/space-2";
import SpaceWrapSplitDemoSource from "./space/space-2.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

const nativeRegionApi = [
  {
    name: "children",
    description: "区域内容。",
    type: "ReactNode",
  },
  {
    name: "className",
    description: "在 canonical region 样式之上扩展布局。",
    type: "string",
  },
] as const;

export const layoutDocuments: Record<string, ComponentDocument> = {
  space: {
    title: "Space 间距",
    description:
      "统一水平或垂直元素间距。使用 orientation 表示轴向，gap 表示间距；wrap、split 和 block 覆盖常见操作组布局。",
    code: canonicalCoreSource(SpaceBasicDemoSource),
    render: () => <SpaceBasicDemo />,
    demos: [
      {
        title: "垂直排列与宽度",
        code: canonicalCoreSource(SpaceAlignmentDemoSource),
        render: () => <SpaceAlignmentDemo />,
      },
      {
        title: "换行与分隔内容",
        code: canonicalCoreSource(SpaceWrapSplitDemoSource),
        render: () => <SpaceWrapSplitDemo />,
      },
    ],
    api: [
      {
        name: "orientation",
        description:
          "排列轴向；对应 Ant Design Space 的 direction 语义，但遵循 Gouno 轴向命名规范",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
      },
      {
        name: "gap",
        description:
          "元素间距 token 或像素值；对应 Ant Design Space 的 size 语义，但遵循 Gouno 间距命名规范",
        type: '"xs" | "sm" | "md" | "lg" | "xl" | number',
        defaultValue: '"md"',
      },
      {
        name: "align",
        description: "交叉轴对齐；未设置时遵循 flex 默认行为，垂直排列为 stretch",
        type: '"start" | "end" | "center" | "baseline" | "stretch"',
      },
      {
        name: "wrap",
        description: "是否允许子项换行",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "split",
        description: "在相邻子项之间插入分隔内容",
        type: "ReactNode",
      },
      {
        name: "block",
        description: "让 Space 容器占满父级宽度",
        type: "boolean",
        defaultValue: "false",
      },
      { name: "children", description: "排列的 React 子项", type: "ReactNode" },
      { name: "className", description: "Space 容器样式类", type: "string" },
      { name: "style", description: "Space 容器内联样式", type: "CSSProperties" },
      { name: "ref", description: "Space 根 div 引用", type: "Ref<HTMLDivElement>" },
    ],
  },
  flex: {
    title: "Flex 弹性布局",
    description:
      "无额外子项 wrapper 的 block layout。公开 API 直接对应 CSS flex-direction / align-items / justify-content / flex-wrap，并复用 Gouno gap token；适合比 Space 更自由的布局组合。",
    code: canonicalCoreSource(FlexDemoSource),
    render: () => <FlexDemo />,
    demos: [
      {
        title: "反向、换行与数值 gap",
        description:
          "wrap 接受 boolean 或 CSS flex-wrap 值；数值 gap 按 px 处理，不依赖运行时生成 Tailwind arbitrary class。",
        code: canonicalCoreSource(FlexWrapDemoSource),
        render: () => <FlexWrapDemo />,
      },
    ],
    api: [
      {
        name: "direction",
        description: "CSS flex-direction；Gouno Flex 使用 CSS 语义，不增加 vertical 同义布尔值。",
        type: '"row" | "column" | "row-reverse" | "column-reverse"',
        defaultValue: '"row"',
      },
      {
        name: "align",
        description: "交叉轴 align-items。",
        type: '"start" | "center" | "end" | "stretch" | "baseline"',
      },
      {
        name: "justify",
        description: "主轴 justify-content。",
        type:
          '"start" | "center" | "end" | "space-between" | "space-around" | "space-evenly"',
      },
      {
        name: "gap",
        description: "共享间距 token 或显式像素间距。",
        type: '"xs" | "sm" | "md" | "lg" | "xl" | number',
        defaultValue: '"md"',
      },
      {
        name: "wrap",
        description: "flex-wrap；true 等价于 wrap，false 等价于 nowrap。",
        type: 'boolean | "nowrap" | "wrap" | "wrap-reverse"',
        defaultValue: "false",
      },
      {
        name: "flex",
        description: "容器作为父级 flex item 时使用的 CSS flex shorthand。",
        type: "CSSProperties['flex']",
      },
      { name: "children", description: "直接参与 flex layout 的子项。", type: "ReactNode" },
      { name: "className", description: "扩展 Flex 根节点样式。", type: "string" },
      { name: "style", description: "透传根节点 style；显式 gap/flex prop 拥有对应字段。", type: "CSSProperties" },
      {
        name: "...div props",
        description: "透传标准 div 属性、事件、data-* 与 ARIA。",
        type: "HTMLAttributes<HTMLDivElement>",
      },
      { name: "ref", description: "指向真实 Flex 根 div。", type: "Ref<HTMLDivElement>" },
    ],
  },
  grid: {
    title: "Grid 网格",
    description: "固定列或自动适配的响应式网格。",
    code: '<Grid columns={3}>{[1, 2, 3].map((item) => <Card key={item} padding="sm">Card {item}</Card>)}</Grid>',
    render: () => (
      <Grid columns={3}>
        {[1, 2, 3].map((item) => (
          <Card key={item} padding="sm">
            Card {item}
          </Card>
        ))}
      </Grid>
    ),
  },
  separator: {
    title: "Separator 分隔线",
    description:
      "内容区之间的 canonical separator。默认 decorative；水平模式支持可见标题、标题位置和 solid/dashed/dotted 线型，垂直模式保持 line-only。父级布局继续拥有外部间距。",
    code: canonicalCoreSource(SeparatorDemoSource),
    render: () => <SeparatorDemo />,
    demos: [
      {
        title: "垂直与语义 Separator",
        description:
          "纯视觉分隔保持 decorative；真正承担结构分隔语义时显式 decorative={false} 并可提供 accessible name。",
        code: canonicalCoreSource(SeparatorVerticalDemoSource),
        render: () => <SeparatorVerticalDemo />,
      },
    ],
    api: [
      {
        name: "orientation",
        description: "分隔轴向。",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
      },
      {
        name: "decorative",
        description: "纯视觉分隔时移除 separator 语义。",
        type: "boolean",
        defaultValue: "true",
      },
      {
        name: "variant",
        description: "线型，不承载颜色或业务状态。",
        type: '"solid" | "dashed" | "dotted"',
        defaultValue: '"solid"',
      },
      {
        name: "children",
        description: "水平 Separator 的可见标题/内容；垂直模式保持 line-only。",
        type: "ReactNode",
      },
      {
        name: "titlePlacement",
        description: "水平标题位置。",
        type: '"start" | "center" | "end"',
        defaultValue: '"center"',
      },
      {
        name: "classNames",
        description: "root / line / content 语义槽 class。",
        type: "Partial<Record<SeparatorSemantic, string>>",
      },
      {
        name: "styles",
        description: "root / line / content 语义槽 style。",
        type: "Partial<Record<SeparatorSemantic, CSSProperties>>",
      },
      {
        name: "...div props",
        description: "透传根 div 的标准属性、事件、data-* 与 ARIA。",
        type: "HTMLAttributes<HTMLDivElement>",
      },
      { name: "ref", description: "指向真实 Separator 根 div。", type: "Ref<HTMLDivElement>" },
    ],
  },
  splitter: {
    title: "Splitter 分隔面板",
    description: "通过拖动分隔条调整两个面板尺寸。",
    code: '<Splitter first={<PanelA />} second={<PanelB />} />',
    render: () => (
      <Splitter
        first={<div className="p-4">左侧面板</div>}
        second={<div className="p-4">右侧面板</div>}
      />
    ),
  },
  "page-layout": {
    title: "Layout 页面布局",
    description:
      "Header、Sider、Content、Footer 的基础语义骨架。各区域只负责结构与默认 surface，不拥有路由、鉴权或产品状态。",
    code: canonicalCoreSource(PageLayoutDemoSource),
    render: () => <PageLayoutDemo />,
    api: [
      {
        name: "children",
        description: "Layout 区域树。",
        type: "ReactNode",
      },
      {
        name: "className",
        description: "在 flex column 应用骨架之上扩展布局。",
        type: "string",
      },
      {
        name: "...div props",
        description: "透传原生 div 属性，包括 data/aria/id/事件。",
        type: "HTMLAttributes<HTMLDivElement>",
      },
    ],
    apiSections: [
      {
        title: "LayoutHeader API",
        rows: [
          ...nativeRegionApi,
          {
            name: "...header props",
            description: "透传原生 header 属性。",
            type: "HTMLAttributes<HTMLElement>",
          },
        ],
      },
      {
        title: "LayoutSider API",
        rows: [
          ...nativeRegionApi,
          {
            name: "...aside props",
            description: "透传原生 aside 属性。",
            type: "HTMLAttributes<HTMLElement>",
          },
        ],
      },
      {
        title: "LayoutContent API",
        rows: [
          ...nativeRegionApi,
          {
            name: "...main props",
            description: "透传原生 main 属性。",
            type: "HTMLAttributes<HTMLElement>",
          },
        ],
      },
      {
        title: "LayoutFooter API",
        rows: [
          ...nativeRegionApi,
          {
            name: "...footer props",
            description: "透传原生 footer 属性。",
            type: "HTMLAttributes<HTMLElement>",
          },
        ],
      },
    ],
  },
};
