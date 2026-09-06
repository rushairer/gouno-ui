import type { ComponentDocument } from "../../../components/component-page";
import { paginationDocument } from "../pagination";

export const dataTableApiSections: ComponentDocument["apiSections"] = [
  {
    title: "DataTableColumn<T>",
    rows: [
      { name: "key", type: "string", description: "必填，稳定且唯一的列键" },
      { name: "title", type: "ReactNode", description: "必填，列标题" },
      { name: "dataIndex", type: "keyof T", description: "从记录读取的字段" },
      {
        name: "render",
        type: "(value: unknown, record: T, index: number) => ReactNode",
        description: "自定义单元格，index 为原始数据索引",
      },
      {
        name: "sorter",
        type: "boolean | ((left: T, right: T) => number)",
        description:
          "true 时数值按数值排序，其他按字符串；server 模式只通知排序变化",
      },
      {
        name: "width",
        type: "number | string",
        description: "列宽，由 HTML 表格布局参与计算",
      },
      {
        name: "align",
        type: '"left" | "center" | "right"',
        description: "表头及单元格对齐",
      },
      {
        name: "ellipsis",
        type: "boolean",
        defaultValue: "false",
        description: "超长字段截断，并用 title 显示原值",
      },
      {
        name: "hidden",
        type: "boolean",
        defaultValue: "false",
        description: "从表头和数据行隐藏该列",
      },
    ],
  },
  {
    title: "DataTablePagination",
    description:
      "继承 Pagination 配置；mode=server 时 dataSource 已是当前页数据，组件不会再次切片。",
    rows: [
      {
        name: "mode",
        type: '"client" | "server"',
        defaultValue: '"client"',
        description: "客户端或服务端分页契约",
      },
      ...paginationDocument.api!.map((row) =>
        row.name === "total"
          ? {
              ...row,
              description: "server 模式下的总数；client 模式由筛选后行数计算",
              defaultValue: "dataSource.length",
            }
          : row.name === "prevText" || row.name === "nextText"
            ? {
                ...row,
                defaultValue: row.name === "prevText" ? '"上一页"' : '"下一页"',
              }
            : row.name === "ariaLabel"
              ? { ...row, defaultValue: '"表格分页"' }
              : row.name === "showTotal"
                ? { ...row, defaultValue: "locale.totalText 或 N 条记录" }
                : row,
      ),
    ],
  },
  {
    title: "DataTableSortState",
    rows: [
      { name: "key", type: "string", description: "排序列的 key" },
      {
        name: "direction",
        type: '"ascend" | "descend"',
        description: "排序方向；sort=null 表示受控无排序",
      },
    ],
  },
  {
    title: "locale",
    rows: [
      {
        name: "emptyText",
        type: "ReactNode",
        description: "空数据提示",
        defaultValue: '"暂无数据"',
      },
      {
        name: "totalText",
        type: "(total: number) => ReactNode",
        description: "总记录数文案",
      },
      {
        name: "previousText",
        type: "ReactNode",
        description: "上一页文案",
        defaultValue: '"上一页"',
      },
      {
        name: "nextText",
        type: "ReactNode",
        description: "下一页文案",
        defaultValue: '"下一页"',
      },
    ],
  },
];
