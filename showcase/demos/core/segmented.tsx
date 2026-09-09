import type { ComponentDocument } from "../../components/component-page";
import BasicSegmentedDemo from "./segmented/basic";
import BasicSegmentedDemoSource from "./segmented/basic.tsx?raw";
import ControlledSegmentedDemo from "./segmented/controlled";
import ControlledSegmentedDemoSource from "./segmented/controlled.tsx?raw";
import DisabledSegmentedDemo from "./segmented/disabled";
import DisabledSegmentedDemoSource from "./segmented/disabled.tsx?raw";
import SegmentedSizesDemo from "./segmented/sizes";
import SegmentedSizesDemoSource from "./segmented/sizes.tsx?raw";
import SegmentedLayoutDemo from "./segmented/layout";
import SegmentedLayoutDemoSource from "./segmented/layout.tsx?raw";
import NumericSegmentedDemo from "./segmented/numeric";
import NumericSegmentedDemoSource from "./segmented/numeric.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const segmentedDocuments: Record<string, ComponentDocument> = {
  segmented: {
    title: "Segmented 分段控制器",
    description:
      "在少量互斥选项之间快速切换。使用真实 radio group 语义，支持受控/非受控状态、尺寸、方向、形状、图标与整行布局。所有 Preview 与 Code 均来自同一个示例源码。",
    code: publicSource(BasicSegmentedDemoSource),
    render: () => <BasicSegmentedDemo />,
    demos: [
      {
        title: "受控状态与图标",
        description:
          "value/onChange 使用业务值；option 可提供 icon、label 与 disabled。Code 同时展示真实 viewOptions 与当前值反馈。",
        code: publicSource(ControlledSegmentedDemoSource),
        render: () => <ControlledSegmentedDemo />,
      },
      {
        title: "局部与整体禁用",
        description: "单个 option 和整个控件都可以禁用。",
        code: publicSource(DisabledSegmentedDemoSource),
        render: () => <DisabledSegmentedDemo />,
      },
      {
        title: "尺寸与圆角",
        description:
          "尺寸遵守 Gouno UI 全局 ControlSize：small / middle / large；shape 只表达几何形态。",
        code: publicSource(SegmentedSizesDemoSource),
        render: () => <SegmentedSizesDemo />,
      },
      {
        title: "Block 与垂直方向",
        description:
          "block 让水平 Segmented 占满父容器；orientation 使用唯一 canonical 入口，不提供 vertical 别名。",
        code: publicSource(SegmentedLayoutDemoSource),
        render: () => <SegmentedLayoutDemo />,
      },
      {
        title: "数字值与表单 name",
        description:
          "string/number 都是合法业务值。name 会应用到同组原生 radio，让浏览器保留标准方向键行为。",
        code: publicSource(NumericSegmentedDemoSource),
        render: () => <NumericSegmentedDemo />,
      },
    ],
    api: [
      {
        name: "options",
        description:
          "候选项；可直接传 string/number，或传带 label/icon/disabled/className 的对象",
        type: "readonly (string | number | SegmentedOption)[]",
        defaultValue: "[]",
      },
      { name: "value", description: "受控选中值", type: "string | number" },
      {
        name: "defaultValue",
        description: "非受控初始值；未提供时选择首个可用项",
        type: "string | number",
        defaultValue: "首个可用项",
      },
      {
        name: "onChange",
        description: "选中值变化时触发",
        type: "(value: string | number) => void",
      },
      {
        name: "disabled",
        description: "禁用整个控件",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "block",
        description: "占满父容器可用宽度",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "orientation",
        description: "排列方向；这是方向的唯一公开写入口",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
      },
      {
        name: "size",
        description: "统一控件尺寸",
        type: '"small" | "middle" | "large"',
        defaultValue: '"middle"',
      },
      {
        name: "shape",
        description: "几何形态",
        type: '"default" | "round"',
        defaultValue: '"default"',
      },
      {
        name: "name",
        description: "传给同组 input[type=radio]；未提供时自动生成稳定组名",
        type: "string",
      },
      {
        name: "aria-label",
        description: "为分段控制器提供可访问名称；遵循标准 ARIA 属性拼写",
        type: "string",
      },
      { name: "className", description: "追加根节点样式类", type: "string" },
    ],
    apiSections: [
      {
        title: "SegmentedOption",
        rows: [
          {
            name: "value",
            description: "业务值，必须在同一 Segmented 内唯一",
            type: "string | number",
          },
          {
            name: "label",
            description: "展示内容；省略时可仅展示 icon",
            type: "ReactNode",
          },
          { name: "icon", description: "选项图标", type: "ReactNode" },
          {
            name: "disabled",
            description: "禁用当前选项",
            type: "boolean",
            defaultValue: "false",
          },
          {
            name: "className",
            description: "追加当前 option 外层样式类",
            type: "string",
          },
        ],
      },
    ],
    notes: (
      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
        <p>
          每个选项由真实 input[type=radio] 承载，并共享 name，因此键盘焦点、表单语义与浏览器原生方向键切换不会依赖模拟 role 行为。
        </p>
        <p>
          高层 API 参考成熟 Segmented 约定，但遵守 Gouno UI 命名规范：尺寸使用全局 middle，不引入 medium；方向只保留 orientation，不增加 vertical 同义入口。
        </p>
      </div>
    ),
  },
};
