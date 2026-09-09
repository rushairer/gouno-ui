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
import {
  Calendar,
  Carousel,
  Descriptions,
  Empty,
  Grid,
  Image,
  List,
  Statistic,
  Table,
  Tag,
  Text,
  Timeline,
  Tree,
} from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";

export const dataDisplayDocuments: Record<string, ComponentDocument> = {
  list: {
    title: "List 列表",
    description: "基础分隔列表和自定义条目。",
    code: "<List data={items} renderItem={item => <Text>{item}</Text>} />",
    render: () => (
      <List
        data={["Button", "Input", "Table"]}
        renderItem={(item) => <Text>{item}</Text>}
      />
    ),
  },
  descriptions: {
    title: "Descriptions 描述列表",
    description: "展示对象属性和详情信息。",
    code: '<Descriptions columns={2} bordered items={[{ label: "版本", children: "0.2.0" }, { label: "状态", children: <Tag color="success">Stable</Tag> }]} />',
    render: () => (
      <Descriptions
        columns={2}
        bordered
        items={[
          { label: "版本", children: "0.2.0" },
          { label: "状态", children: <Tag color="success">Stable</Tag> },
        ]}
      />
    ),
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
    description: "图片加载失败时提供可访问 fallback。",
    code: '<Image src="/cover.png" fallback={<Empty title="图片不可用" description="请稍后重试。" />} />',
    render: () => (
      <Image
        src="/missing.png"
        alt="示例图片"
        fallback={
          <Empty title="图片不可用" description="请稍后重试。" />
        }
      />
    ),
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
    description: "突出展示指标及单位。",
    code: '<Statistic title="访问量" value="12,480" />',
    render: () => (
      <Grid columns={2}>
        <Statistic title="访问量" value="12,480" />
        <Statistic title="增长" value="18.6" suffix="%" />
      </Grid>
    ),
  },
  timeline: {
    title: "Timeline 时间轴",
    description: "按顺序展示事件。",
    code: '<Timeline items={[{ title: "创建" }]} />',
    render: () => (
      <Timeline
        items={[
          { title: "创建项目", description: "09:00" },
          { title: "完成构建", description: "09:12" },
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
