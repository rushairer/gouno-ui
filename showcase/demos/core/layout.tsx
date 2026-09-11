import { Space } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
import FlexDemo from "./flex/flex-0";
import FlexDemoSource from "./flex/flex-0.tsx?raw";
import FlexWrapDemo from "./flex/flex-1";
import FlexWrapDemoSource from "./flex/flex-1.tsx?raw";
import GridDemo from "./grid/grid-0";
import GridDemoSource from "./grid/grid-0.tsx?raw";
import ResponsiveGridDemo from "./grid/grid-1";
import ResponsiveGridDemoSource from "./grid/grid-1.tsx?raw";
import PageLayoutDemo from "./page-layout/page-layout-0";
import PageLayoutDemoSource from "./page-layout/page-layout-0.tsx?raw";
import SplitterBasicDemo from "./splitter/splitter-0";
import SplitterBasicDemoSource from "./splitter/splitter-0.tsx?raw";
import SplitterMultipleDemo from "./splitter/splitter-1";
import SplitterMultipleDemoSource from "./splitter/splitter-1.tsx?raw";
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
    description:
      "同一 family 提供两层能力：Grid 是简单 CSS Grid helper；Row/Col 是 24 栅格布局。Row 拥有 gutter/对齐/换行，Col 拥有 span/offset/order/push/pull/flex 与 xs-sm-md-lg-xl-xxl 响应式覆盖。",
    code: canonicalCoreSource(GridDemoSource),
    render: () => <GridDemo />,
    demos: [
      {
        title: "24 栅格与响应式 Col",
        description:
          "响应式断点沿用 Gouno/Tailwind 640/768/1024/1280/1536 体系；每个更大断点继承上一档未覆盖的字段。",
        code: canonicalCoreSource(ResponsiveGridDemoSource),
        render: () => <ResponsiveGridDemo />,
      },
    ],
    api: [
      { name: "columns", description: "Grid helper 的固定列数或 auto-fit。", type: '1 | 2 | 3 | 4 | "auto"', defaultValue: '"auto"' },
      { name: "gap", description: "Grid helper 的间距 token 或像素值；数字通过 style 生效。", type: '"sm" | "md" | "lg" | number', defaultValue: '"md"' },
      { name: "...div props", description: "Grid helper 透传标准 div 属性并支持真实 ref。", type: "HTMLAttributes<HTMLDivElement>" },
    ],
    apiSections: [
      {
        title: "Row API",
        rows: [
          { name: "gutter", description: "水平 gutter，或 [horizontal, vertical]；由 Row/Col 结构共同拥有。", type: "number | [number, number]", defaultValue: "0" },
          { name: "align", description: "交叉轴对齐。", type: '"top" | "middle" | "bottom" | "stretch"', defaultValue: '"top"' },
          { name: "justify", description: "主轴分布。", type: '"start" | "center" | "end" | "space-between" | "space-around" | "space-evenly"', defaultValue: '"start"' },
          { name: "wrap", description: "是否允许 Col 换行。", type: "boolean", defaultValue: "true" },
          { name: "ref", description: "指向真实 Row div。", type: "Ref<HTMLDivElement>" },
        ],
      },
      {
        title: "Col API",
        rows: [
          { name: "span", description: "占用 0-24 栅格；0 隐藏。", type: "GridSpan", defaultValue: "24" },
          { name: "offset / push / pull", description: "0-24 栅格偏移与视觉位移。", type: "GridSpan", defaultValue: "0" },
          { name: "order", description: "Flex order。", type: "number", defaultValue: "0" },
          { name: "flex", description: "需要自由伸缩时覆盖固定 span 的 flex shorthand。", type: "CSSProperties['flex']" },
          { name: "xs / sm / md / lg / xl / xxl", description: "响应式 span 数值或 ColSize；按断点逐级继承。", type: "GridSpan | ColSize" },
          { name: "ref", description: "指向真实 Col div。", type: "Ref<HTMLDivElement>" },
        ],
      },
    ],
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
    description:
      "可访问的可调面板容器。canonical API 使用 Splitter.Panel 组合多个区域；orientation 沿用 Gouno 轴向词汇，sizes/defaultSizes 管理完整尺寸向量，Panel 负责 min/max/resizable 约束。旧 first/second API 仅保留兼容。",
    code: canonicalCoreSource(SplitterBasicDemoSource),
    render: () => <SplitterBasicDemo />,
    demos: [
      {
        title: "垂直多面板",
        description:
          "同一 Splitter 支持三个及以上 Panel；分隔条可拖动，也可聚焦后用方向键、Home/End 调整相邻面板。",
        code: canonicalCoreSource(SplitterMultipleDemoSource),
        render: () => <SplitterMultipleDemo />,
      },
    ],
    api: [
      { name: "children", description: "canonical 直接子项使用 Splitter.Panel。", type: "ReactNode" },
      { name: "orientation", description: "面板排列轴向；水平排列对应垂直 separator。", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
      { name: "sizes", description: "受控完整尺寸向量；数值按比例归一化为 100%。", type: "readonly number[]" },
      { name: "defaultSizes", description: "非受控初始尺寸向量。", type: "readonly number[]" },
      { name: "onSizesChange", description: "拖动或键盘调整后的完整尺寸向量。", type: "(sizes: readonly number[]) => void" },
      { name: "onResizeStart / onResizeEnd", description: "一次调整开始/结束时的尺寸快照。", type: "(sizes: readonly number[]) => void" },
      { name: "step", description: "键盘方向键每次调整的百分比；Shift 为五倍步长。", type: "number", defaultValue: "1" },
      { name: "first / second", description: "兼容旧二面板 API；新代码使用 Splitter.Panel。", type: "ReactNode", defaultValue: "deprecated" },
      { name: "defaultSize / min / max / onResize", description: "旧 first-panel 兼容契约；onResize 继续返回首面板 number。", type: "legacy compatibility", defaultValue: "deprecated" },
      { name: "...div props", description: "透传根 div 的标准属性、事件、data-* 与 ARIA。", type: "HTMLAttributes<HTMLDivElement>" },
      { name: "ref", description: "指向真实 Splitter 根 div。", type: "Ref<HTMLDivElement>" },
    ],
    apiSections: [
      {
        title: "Splitter.Panel API",
        rows: [
          { name: "defaultSize", description: "未提供 root defaultSizes 时的初始占比。", type: "number" },
          { name: "min", description: "调整时允许的最小占比。", type: "number", defaultValue: "0" },
          { name: "max", description: "调整时允许的最大占比。", type: "number", defaultValue: "100" },
          { name: "resizable", description: "false 时禁用该 Panel 两侧相邻的 resize handle。", type: "boolean", defaultValue: "true" },
          { name: "children", description: "Panel 内容。", type: "ReactNode" },
          { name: "...div props", description: "透传真实 Panel div 属性并支持 ref。", type: "HTMLAttributes<HTMLDivElement>" },
        ],
      },
    ],
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
