import TableGrouped from "./table/grouped";
import TableGroupedCode from "./table/grouped.tsx?raw";
import TableUnbordered from "./table/unbordered";
import TableUnborderedCode from "./table/unbordered.tsx?raw";
import { tableApiSections } from "./table/api-sections";
import Example1 from "./table/table-0";
import Example1Source from "./table/table-0.tsx?raw";
import Example2 from "./table/table-1";
import Example2Source from "./table/table-1.tsx?raw";
import Example3 from "./table/table-2";
import Example3Source from "./table/table-2.tsx?raw";
import StatisticExample from "./statistic/statistic-0";
import StatisticExampleSource from "./statistic/statistic-0.tsx?raw";
import ListBasicExample from "./list/list-0";
import ListBasicExampleSource from "./list/list-0.tsx?raw";
import ListStatesExample from "./list/list-1";
import ListStatesExampleSource from "./list/list-1.tsx?raw";
import DescriptionsBasicExample from "./descriptions/descriptions-0";
import DescriptionsBasicExampleSource from "./descriptions/descriptions-0.tsx?raw";
import DescriptionsBorderedExample from "./descriptions/descriptions-1";
import DescriptionsBorderedExampleSource from "./descriptions/descriptions-1.tsx?raw";
import ImagePreviewExample from "./image/image-0";
import ImagePreviewExampleSource from "./image/image-0.tsx?raw";
import ImageControlledExample from "./image/image-1";
import ImageControlledExampleSource from "./image/image-1.tsx?raw";
import { Calendar, Carousel, Timeline, Tree } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core");

export const dataDisplayDocuments: Record<string, ComponentDocument> = {
  list: {
    title: "List 列表",
    description:
      "稳定键驱动的数据列表，覆盖边框、分隔、尺寸、横纵布局、加载、空状态与头尾扩展。保留成熟 List 能力，但不把分页和网格重新塞回单个组件。",
    code: publicSource(ListBasicExampleSource),
    render: () => <ListBasicExample />,
    demos: [
      {
        title: "加载、空状态与 Load More",
        description:
          "loading 复用 Core Spin；空状态通过 locale.emptyText 本地化；额外加载动作保持显式组合。",
        code: publicSource(ListStatesExampleSource),
        render: () => <ListStatesExample />,
      },
    ],
    api: [
      { name: "dataSource", description: "列表数据源", type: "readonly T[]", defaultValue: "[]" },
      { name: "renderItem", description: "渲染每个数据项", type: "(item: T, index: number) => ReactNode" },
      { name: "rowKey", description: "稳定条目键；禁止退回数组索引键", type: "keyof T | ((item: T) => Key)" },
      { name: "bordered", description: "显示列表外边框", type: "boolean", defaultValue: "false" },
      { name: "split", description: "显示条目间分隔线", type: "boolean", defaultValue: "true" },
      { name: "size", description: "列表内容密度", type: '"small" | "medium" | "large"', defaultValue: '"medium"' },
      { name: "itemLayout", description: "条目内容排列方向", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
      { name: "loading", description: "用 Core Spin 覆盖列表内容区域", type: "boolean", defaultValue: "false" },
      { name: "header", description: "列表头部内容", type: "ReactNode" },
      { name: "footer", description: "列表尾部内容", type: "ReactNode" },
      { name: "loadMore", description: "列表后的显式加载更多区域", type: "ReactNode" },
      { name: "locale", description: "列表局部文案，当前包含 emptyText", type: "ListLocale" },
      { name: "classNames", description: "按语义槽追加 className，可读取当前组件状态", type: "ListClassNames" },
      { name: "styles", description: "按语义槽追加 style，可读取当前组件状态", type: "ListStyles" },
      { name: "ref", description: "真实根 div 引用", type: "Ref<HTMLDivElement>" },
    ],
    apiSections: [
      {
        title: "ListLocale API",
        rows: [
          { name: "emptyText", description: "空数据时展示的本地化内容", type: "ReactNode" },
        ],
      },
      {
        title: "Semantic DOM",
        description: "classNames/styles 支持稳定语义槽，不要求调用方依赖内部 DOM 层级。",
        rows: [
          { name: "root", description: "列表根容器", type: "semantic slot" },
          { name: "header", description: "头部区域", type: "semantic slot" },
          { name: "body", description: "ul 数据区域", type: "semantic slot" },
          { name: "item", description: "li 条目", type: "semantic slot" },
          { name: "empty", description: "空状态区域", type: "semantic slot" },
          { name: "loadMore", description: "加载更多区域", type: "semantic slot" },
          { name: "footer", description: "尾部区域", type: "semantic slot" },
        ],
      },
    ],
  },
  descriptions: {
    title: "Descriptions 描述列表",
    description:
      "面向对象详情的键值描述组件，支持标题、额外动作、响应式列数、跨列、边框、尺寸与横纵布局，并以稳定 item.key 驱动渲染。",
    code: publicSource(DescriptionsBasicExampleSource),
    render: () => <DescriptionsBasicExample />,
    demos: [
      {
        title: "带边框、尺寸与垂直布局",
        description:
          "边框描述表仍保留语义 dl/dt/dd；span=filled 可让长信息占满当前行。",
        code: publicSource(DescriptionsBorderedExampleSource),
        render: () => <DescriptionsBorderedExample />,
      },
    ],
    api: [
      { name: "title", description: "描述列表标题", type: "ReactNode" },
      { name: "extra", description: "标题区域右侧额外内容", type: "ReactNode" },
      { name: "items", description: "带稳定 key 的描述项", type: "readonly DescriptionsItem[]", defaultValue: "[]" },
      { name: "bordered", description: "显示边框和标签底色", type: "boolean", defaultValue: "false" },
      { name: "colon", description: "横向布局标签后显示冒号", type: "boolean", defaultValue: "true" },
      { name: "column", description: "列数或响应式列数映射", type: "DescriptionsColumn", defaultValue: "3" },
      { name: "layout", description: "标签与内容的排列方式", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
      { name: "size", description: "描述项内容密度", type: '"small" | "medium" | "large"', defaultValue: '"large"' },
      { name: "classNames", description: "按语义槽追加 className", type: "DescriptionsClassNames" },
      { name: "styles", description: "按语义槽追加 style", type: "DescriptionsStyles" },
      { name: "ref", description: "真实根 div 引用", type: "Ref<HTMLDivElement>" },
    ],
    apiSections: [
      {
        title: "DescriptionsItem API",
        rows: [
          { name: "key", description: "稳定条目键", type: "Key" },
          { name: "label", description: "字段标签", type: "ReactNode" },
          { name: "children", description: "字段值", type: "ReactNode" },
          { name: "span", description: "跨列数量、filled 或响应式映射", type: "DescriptionsSpan" },
          { name: "className", description: "单条描述项类名", type: "string" },
          { name: "style", description: "单条描述项样式", type: "CSSProperties" },
        ],
      },
      {
        title: "Responsive column / span",
        rows: [
          { name: "breakpoints", description: "响应式键", type: '"xs" | "sm" | "md" | "lg" | "xl" | "xxl"' },
          { name: "column count", description: "每行列数", type: "1 | 2 | 3 | 4 | 5 | 6" },
          { name: "filled", description: "占满当前行剩余语义宽度", type: '"filled"' },
        ],
      },
    ],
  },
  calendar: {
    title: "Calendar 日历",
    description: "日期网格、选中态和可选边界。",
    code: "<Calendar value={new Date()} onChange={setDate} />",
    render: () => (
      <div className="max-w-md">
        <Calendar value={new Date(2026, 0, 15)} onChange={() => undefined} />
      </div>
    ),
  },
  image: {
    title: "Image 图片",
    description:
      "具备加载占位、备用地址、可访问失败态和默认预览能力的图片组件；预览支持受控打开、缩放、旋转、翻转、拖动、滚轮与自定义工具栏/图片渲染。",
    code: publicSource(ImagePreviewExampleSource),
    render: () => <ImagePreviewExample />,
    demos: [
      {
        title: "Fallback、受控预览与 transform 事件",
        description:
          "fallback 是备用图片 URL；自定义加载内容使用 placeholder。预览可以由外部状态控制并观察用户变换动作。",
        code: publicSource(ImageControlledExampleSource),
        render: () => <ImageControlledExample />,
      },
    ],
    api: [
      { name: "fallback", description: "主图片加载失败后尝试的备用图片 URL", type: "string" },
      { name: "placeholder", description: "图片尚未完成加载时的占位内容", type: "ReactNode" },
      { name: "preview", description: "启用预览或配置预览行为", type: "boolean | ImagePreviewConfig", defaultValue: "true" },
      { name: "classNames", description: "按图片语义槽追加 className", type: "ImageClassNames" },
      { name: "styles", description: "按图片语义槽追加 style", type: "ImageStyles" },
      { name: "ref", description: "真实缩略图 img 引用", type: "Ref<HTMLImageElement>" },
    ],
    apiSections: [
      {
        title: "ImagePreviewConfig API",
        rows: [
          { name: "open / defaultOpen", description: "预览的受控/非受控打开状态", type: "boolean" },
          { name: "src", description: "预览层使用的替代图片地址", type: "string" },
          { name: "cover", description: "缩略图 hover/focus 预览覆盖层", type: "ReactNode | ImageCoverConfig" },
          { name: "mask", description: "遮罩显示、模糊与点击关闭策略", type: "boolean | ImagePreviewMaskConfig" },
          { name: "minScale / maxScale", description: "预览缩放上下界", type: "number" },
          { name: "scaleStep", description: "每次缩放比例步长", type: "number", defaultValue: "0.5" },
          { name: "movable", description: "放大后允许拖动", type: "boolean", defaultValue: "true" },
          { name: "wheel", description: "允许鼠标滚轮缩放", type: "boolean", defaultValue: "true" },
          { name: "onOpenChange", description: "预览打开状态变化回调", type: "(open: boolean) => void" },
          { name: "onTransform", description: "缩放、旋转、翻转、拖动等变换回调", type: "(info: { transform: ImageTransform; action: ImageTransformAction }) => void" },
          { name: "actionsRender", description: "替换或包裹默认工具栏", type: "(originalNode: ReactElement, info: ImageToolbarInfo) => ReactNode" },
          { name: "imageRender", description: "替换或包裹预览图片节点", type: "(originalNode: ReactElement, info: { transform: ImageTransform; src: string; alt: string }) => ReactNode" },
          { name: "classNames", description: "预览 root/image/toolbar 类名", type: "Partial<Record<\"root\" | \"image\" | \"toolbar\", string>>" },
          { name: "styles", description: "预览 root/image/toolbar/mask 样式", type: "Partial<Record<\"root\" | \"image\" | \"toolbar\" | \"mask\", CSSProperties>>" },
        ],
      },
      {
        title: "Preview transforms",
        rows: [
          { name: "flip", description: "水平/垂直翻转", type: '"flipX" | "flipY"' },
          { name: "rotate", description: "每次向左/右旋转 90°", type: '"rotateLeft" | "rotateRight"' },
          { name: "zoom", description: "按钮、滚轮和双击缩放", type: '"zoomIn" | "zoomOut" | "wheel" | "doubleClick"' },
          { name: "move / reset", description: "放大后拖动并可恢复默认变换", type: '"move" | "reset"' },
        ],
      },
    ],
  },
  carousel: {
    title: "Carousel 轮播",
    description: "受控视觉轮播和键盘可达的操作按钮。",
    code: "<Carousel items={[<div>One</div>, <div>Two</div>]} />",
    render: () => (
      <Carousel
        items={[
          <div key="1" className="p-12 text-center">
            Slide One
          </div>,
          <div key="2" className="p-12 text-center">
            Slide Two
          </div>,
        ]}
      />
    ),
  },
  table: {
    apiSections: tableApiSections,
    title: "Table 表格",
    description: "统一表头、行、单元格和响应式容器样式。",
    code: Example1Source.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ).replaceAll("../../../../src", "@gouno/ui"),
    render: () => <Example1 />,
    demos: [
      {
        title: "密度、边框与滚动",
        description: "默认、紧凑和触控密度在同一套语义表格结构上工作。",
        code: Example2Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example2 />,
      },
      {
        title: "加载与空状态",
        code: Example3Source.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src", "@gouno/ui"),
        render: () => <Example3 />,
      },
      {
        title: "分组表头、合并单元格与汇总",
        code: TableGroupedCode.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ),
        render: () => <TableGrouped />,
      },
      {
        title: "无列垂直分隔线",
        description:
          "默认 bordered=false，仅保留行分隔线；适合阅读型数据列表。",
        code: TableUnborderedCode.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ),
        render: () => <TableUnbordered />,
      },
    ],
    api: [
      {
        name: "density",
        description: "行间距密度",
        type: '"default" | "compact" | "touch"',
        defaultValue: '"default"',
      },
      {
        name: "bordered",
        description: "显示容器边框",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "fixed",
        description: "使用固定表格布局",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "stickyHeader",
        description: "固定表头",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "containerClassName",
        description: "响应式容器类名",
        type: "string",
      },
      { name: "className", description: "表格类名", type: "string" },
    ],
  },
  statistic: {
    title: "Statistic 统计数值",
    description: "展示一个调用方拥有的指标标签与数值；组件只负责基础排版，不拥有 Card、趋势或格式化策略。",
    code: StatisticExampleSource.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ),
    render: () => <StatisticExample />,
    api: [
      { name: "title", description: "指标标签", type: "ReactNode" },
      { name: "value", description: "调用方提供的展示值", type: "ReactNode" },
      { name: "prefix", description: "数值前缀", type: "ReactNode" },
      { name: "suffix", description: "数值后缀或单位", type: "ReactNode" },
      { name: "className", description: "根 div 附加类名", type: "string" },
      { name: "aria-label", description: "需要为整个指标组提供额外名称时使用的标准 ARIA 属性", type: "string" },
      { name: "ref", description: "真实根 div 引用", type: "Ref<HTMLDivElement>" },
    ],
  },
  timeline: {
    title: "Timeline 时间轴",
    description: "按顺序展示事件。",
    code: '<Timeline items={[{ key: "created", title: "创建", content: "09:00" }]} />',
    render: () => (
      <Timeline
        items={[
          { key: "created", title: "创建项目", content: "09:00" },
          { key: "built", title: "完成构建", content: "09:12" },
        ]}
      />
    ),
  },
  tree: {
    title: "Tree 树",
    description: "层级展开、选择和复选。",
    code: '<Tree data={nodes} defaultExpandedKeys={["root"]} />',
    render: () => (
      <Tree
        defaultExpandedKeys={["root"]}
        data={[
          {
            key: "root",
            title: "组件",
            children: [
              { key: "core", title: "Core" },
              { key: "theme", title: "Theme" },
            ],
          },
        ]}
      />
    ),
  },
};