import TableGrouped from "./table/grouped";
import TableGroupedCode from "./table/grouped.tsx?raw";
import TableUnbordered from "./table/unbordered";
import TableUnborderedCode from "./table/unbordered.tsx?raw";
import { tableApiSections } from "./table/api-sections";
import { dataTableApiSections } from "./data-table/api-sections";
import DataTableStates from "./data-table/states";
import DataTableStatesCode from "./data-table/states.tsx?raw";
import DataTableServer from "./data-table/server";
import DataTableServerCode from "./data-table/server.tsx?raw";
import DataTableActions from "./data-table/actions";
import DataTableActionsCode from "./data-table/actions.tsx?raw";
import Example1 from "./table/table-0";
import Example1Source from "./table/table-0.tsx?raw";
import Example2 from "./table/table-1";
import Example2Source from "./table/table-1.tsx?raw";
import Example3 from "./table/table-2";
import Example3Source from "./table/table-2.tsx?raw";
import Example4 from "./data-table/data-table-0";
import Example4Source from "./data-table/data-table-0.tsx?raw";
import { useState } from "react";
import {
  Calendar,
  Carousel,
  Descriptions,
  Empty,
  Grid,
  Image,
  Input,
  List,
  Skeleton,
  Space,
  Statistic,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Text,
  Timeline,
  Tree,
} from "../../../src/core";
import { DataTable } from "../../../src";
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
    code: '<Descriptions columns={2} bordered items={[{ label: "版本", children: "0.2.0" }, { label: "状态", children: <Tag tone="success">Stable</Tag> }]} />',
    render: () => (
      <Descriptions
        columns={2}
        bordered
        items={[
          { label: "版本", children: "0.2.0" },
          { label: "状态", children: <Tag tone="success">Stable</Tag> },
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
    code: '<Image src="/cover.png" fallback={<Empty />} />',
    render: () => (
      <Image
        src="/missing.png"
        alt="示例图片"
        fallback={
          <div className="rounded border p-10 text-center text-sm text-muted-foreground">
            Fallback
          </div>
        }
      />
    ),
  },
  carousel: {
    title: "Carousel 轮播",
    description: "受控视觉轮播和键盘可达的操作按钮。",
    code: "<Carousel items={[<Card>One</Card>, <Card>Two</Card>]} />",
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
        ).replaceAll("../../../../src/patterns", "@gouno/ui/patterns"),
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
  "data-table": {
    apiSections: dataTableApiSections,
    title: "DataTable 数据表格",
    description:
      "面向业务列表的排序、筛选、分页、行选择、展开行、禁用行和状态原语。",
    code: Example4Source.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ).replaceAll("../../../../src", "@gouno/ui"),
    render: () => <Example4 />,
    api: [
      {
        name: "children",
        description: "直接组合 Table 子元素",
        type: "ReactNode",
      },
      { name: "columns", description: "列定义", type: "DataTableColumn<T>[]" },
      {
        name: "dataSource",
        description: "行数据",
        type: "T[]",
        defaultValue: "[]",
      },
      {
        name: "rowKey",
        description: "稳定行键",
        type: "keyof T | ((record: T, index: number) => string)",
      },
      {
        name: "loading",
        description: "加载状态",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "loadingRows",
        description: "加载骨架行数",
        type: "number",
        defaultValue: "4",
      },
      {
        name: "loadingCols",
        description: "加载骨架列数",
        type: "number",
        defaultValue: "4",
      },
      { name: "empty", description: "强制空状态", type: "boolean" },
      { name: "emptyState", description: "空状态覆盖内容", type: "ReactNode" },
      { name: "error", description: "错误状态内容", type: "ReactNode" },
      { name: "className", description: "外层类名", type: "string" },
      {
        name: "containerClassName",
        description: "表格滚动容器类名",
        type: "string",
      },
      {
        name: "density",
        description: "表格密度",
        type: "TableDensity",
        defaultValue: '"default"',
      },
      { name: "selectable", description: "启用行选择", type: "boolean" },
      { name: "selectedRowKeys", description: "受控选中键", type: "string[]" },
      {
        name: "onSelectionChange",
        description: "选中变化回调",
        type: "(keys: string[], rows: T[]) => void",
      },
      {
        name: "defaultSort",
        description: "非受控初始排序",
        type: "DataTableSortState",
      },
      {
        name: "sort",
        description: "受控排序状态",
        type: "DataTableSortState | null",
      },
      {
        name: "onSortChange",
        description: "排序变化回调",
        type: "(sort: DataTableSortState | undefined) => void",
      },
      {
        name: "filter",
        description: "行过滤函数",
        type: "(record: T) => boolean",
      },
      {
        name: "pagination",
        description: "客户端或服务端分页配置",
        type: "DataTablePagination | false",
        defaultValue: "false",
      },
      {
        name: "bordered",
        description: "显示表格边框",
        type: "boolean",
        defaultValue: "true",
      },
      {
        name: "stickyHeader",
        description: "固定表头",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "rowDisabled",
        description: "禁用指定行",
        type: "(record: T) => boolean",
      },
      { name: "expandedRowKeys", description: "受控展开键", type: "string[]" },
      {
        name: "defaultExpandedRowKeys",
        description: "非受控初始展开键",
        type: "string[]",
        defaultValue: "[]",
      },
      {
        name: "onExpandedRowsChange",
        description: "展开变化回调",
        type: "(keys: string[]) => void",
      },
      {
        name: "expandedRowRender",
        description: "展开行内容",
        type: "(record: T, index: number) => ReactNode",
      },
      {
        name: "summary",
        description: "当前页摘要行",
        type: "(rows: T[]) => ReactNode",
      },
      {
        name: "onRow",
        description: "行原生属性回调",
        type: "(record: T, index: number) => HTMLAttributes<HTMLTableRowElement>",
      },
      {
        name: "rowClassName",
        description: "行类名回调",
        type: "(record: T, index: number) => string",
      },
      { name: "toolbar", description: "表格工具栏", type: "ReactNode" },
      {
        name: "batchActions",
        description: "批量操作渲染回调",
        type: "(keys: string[], clearSelection: () => void) => ReactNode",
      },
      { name: "caption", description: "表格说明", type: "ReactNode" },
      {
        name: "locale",
        description: "空状态和分页文案",
        type: "DataTableProps<T>['locale']",
      },
    ],
    demos: [
      {
        title: "加载、空与错误状态",
        code: DataTableStatesCode.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src/patterns", "@gouno/ui/patterns"),
        render: () => <DataTableStates />,
      },
      {
        title: "服务端分页与受控排序",
        code: DataTableServerCode.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src/patterns", "@gouno/ui/patterns"),
        render: () => <DataTableServer />,
      },
      {
        title: "列显示、批量操作与摘要",
        code: DataTableActionsCode.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ).replaceAll("../../../../src/patterns", "@gouno/ui/patterns"),
        render: () => <DataTableActions />,
      },
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
              { key: "patterns", title: "Patterns" },
            ],
          },
        ]}
      />
    ),
  },
};
