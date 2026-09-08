import { useState } from "react";
import { Columns3, List, Rows3 } from "lucide-react";
import { Segmented, Text } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";

type ViewMode = "list" | "compact" | "board";

const viewOptions = [
  { value: "list", label: "列表", icon: <List /> },
  { value: "compact", label: "紧凑", icon: <Rows3 /> },
  { value: "board", label: "看板", icon: <Columns3 /> },
] as const;

function ControlledSegmentedDemo() {
  const [value, setValue] = useState<ViewMode>("list");
  return (
    <div className="flex flex-col gap-3">
      <Segmented<ViewMode>
        aria-label="视图模式"
        options={viewOptions}
        value={value}
        onChange={setValue}
      />
      <Text size="sm" tone="muted">当前值：{value}</Text>
    </div>
  );
}

export const segmentedDocuments: Record<string, ComponentDocument> = {
  segmented: {
    title: "Segmented 分段控制器",
    description: "在少量互斥选项之间快速切换。使用真实 radio group 语义，支持受控/非受控状态、尺寸、方向、形状、图标与整行布局。",
    code: `<Segmented
  aria-label="时间范围"
  options={["日", "周", "月"]}
  defaultValue="周"
/>`,
    render: () => (
      <Segmented aria-label="时间范围" options={["日", "周", "月"]} defaultValue="周" />
    ),
    demos: [
      {
        title: "受控状态与图标",
        description: "value/onChange 使用业务值；option 可提供 icon、label 与 disabled。",
        code: `const [value, setValue] = useState("list");

<Segmented
  aria-label="视图模式"
  value={value}
  onChange={setValue}
  options={[
    { value: "list", label: "列表", icon: <List /> },
    { value: "compact", label: "紧凑", icon: <Rows3 /> },
    { value: "board", label: "看板", icon: <Columns3 /> },
  ]}
/>`,
        render: () => <ControlledSegmentedDemo />,
      },
      {
        title: "局部与整体禁用",
        description: "单个 option 和整个控件都可以禁用。",
        code: `<Segmented
  aria-label="发布渠道"
  options={[
    { value: "web", label: "Web" },
    { value: "app", label: "App" },
    { value: "legacy", label: "Legacy", disabled: true },
  ]}
/>

<Segmented aria-label="禁用示例" options={["A", "B"]} disabled />`,
        render: () => (
          <div className="flex flex-col gap-4">
            <Segmented
              aria-label="发布渠道"
              options={[
                { value: "web", label: "Web" },
                { value: "app", label: "App" },
                { value: "legacy", label: "Legacy", disabled: true },
              ]}
            />
            <Segmented aria-label="禁用示例" options={["A", "B"]} disabled />
          </div>
        ),
      },
      {
        title: "尺寸与圆角",
        description: "尺寸遵守 Gouno UI 全局 ControlSize：small / middle / large；shape 只表达几何形态。",
        code: `<Segmented size="small" options={["日", "周", "月"]} />
<Segmented size="middle" options={["日", "周", "月"]} />
<Segmented size="large" shape="round" options={["日", "周", "月"]} />`,
        render: () => (
          <div className="flex flex-col items-start gap-4">
            <Segmented aria-label="小尺寸" size="small" options={["日", "周", "月"]} />
            <Segmented aria-label="中尺寸" size="middle" options={["日", "周", "月"]} />
            <Segmented aria-label="大尺寸圆角" size="large" shape="round" options={["日", "周", "月"]} />
          </div>
        ),
      },
      {
        title: "Block 与垂直方向",
        description: "block 让水平 Segmented 占满父容器；orientation 使用唯一 canonical 入口，不提供 vertical 别名。",
        code: `<Segmented block options={["概览", "安全", "会话"]} />

<Segmented
  orientation="vertical"
  options={["概览", "安全", "会话"]}
/>`,
        render: () => (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="min-w-0"><Segmented aria-label="整行导航" block options={["概览", "安全", "会话"]} /></div>
            <div><Segmented aria-label="垂直导航" orientation="vertical" options={["概览", "安全", "会话"]} /></div>
          </div>
        ),
      },
      {
        title: "数字值与表单 name",
        description: "string/number 都是合法业务值。name 会应用到同组原生 radio，让浏览器保留标准方向键行为。",
        code: `<Segmented
  aria-label="每页数量"
  name="page-size"
  options={[10, 20, 50]}
  defaultValue={20}
/>`,
        render: () => <Segmented aria-label="每页数量" name="page-size" options={[10, 20, 50]} defaultValue={20} />,
      },
    ],
    api: [
      { name: "options", description: "候选项；可直接传 string/number，或传带 label/icon/disabled/className 的对象", type: "readonly (string | number | SegmentedOption)[]", defaultValue: "[]" },
      { name: "value", description: "受控选中值", type: "string | number" },
      { name: "defaultValue", description: "非受控初始值；未提供时选择首个可用项", type: "string | number", defaultValue: "首个可用项" },
      { name: "onChange", description: "选中值变化时触发", type: "(value: string | number) => void" },
      { name: "disabled", description: "禁用整个控件", type: "boolean", defaultValue: "false" },
      { name: "block", description: "占满父容器可用宽度", type: "boolean", defaultValue: "false" },
      { name: "orientation", description: "排列方向；这是方向的唯一公开写入口", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
      { name: "size", description: "统一控件尺寸", type: '"small" | "middle" | "large"', defaultValue: '"middle"' },
      { name: "shape", description: "几何形态", type: '"default" | "round"', defaultValue: '"default"' },
      { name: "name", description: "传给同组 input[type=radio]；未提供时自动生成稳定组名", type: "string" },
      { name: "aria-label", description: "为分段控制器提供可访问名称；遵循标准 ARIA 属性拼写", type: "string" },
      { name: "className", description: "追加根节点样式类", type: "string" },
    ],
    apiSections: [
      {
        title: "SegmentedOption",
        rows: [
          { name: "value", description: "业务值，必须在同一 Segmented 内唯一", type: "string | number" },
          { name: "label", description: "展示内容；省略时可仅展示 icon", type: "ReactNode" },
          { name: "icon", description: "选项图标", type: "ReactNode" },
          { name: "disabled", description: "禁用当前选项", type: "boolean", defaultValue: "false" },
          { name: "className", description: "追加当前 option 外层样式类", type: "string" },
        ],
      },
    ],
    notes: (
      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
        <p>每个选项由真实 input[type=radio] 承载，并共享 name，因此键盘焦点、表单语义与浏览器原生方向键切换不会依赖模拟 role 行为。</p>
        <p>高层 API 参考成熟 Segmented 约定，但遵守 Gouno UI 命名规范：尺寸使用全局 middle，不引入 medium；方向只保留 orientation，不增加 vertical 同义入口。</p>
      </div>
    ),
  },
};
