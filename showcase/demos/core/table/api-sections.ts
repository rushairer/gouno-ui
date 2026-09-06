import type { ComponentDocument } from "../../../components/component-page";

export const tableApiSections: ComponentDocument["apiSections"] = [
  {
    title: "组合组件",
    description:
      "每个组件透传对应 HTML 元素的属性、事件及 React 19 ref。排序、分页和选择请组合 DataTable。",
    rows: [
      {
        name: "TableHeader",
        type: 'ComponentProps<"thead">',
        description: "表头分组",
      },
      {
        name: "TableBody",
        type: 'ComponentProps<"tbody">',
        description: "表体分组",
      },
      {
        name: "TableFooter",
        type: 'ComponentProps<"tfoot">',
        description: "汇总分组",
      },
      {
        name: "TableRow",
        type: 'ComponentProps<"tr">',
        description:
          "表格行，可传 onClick、onDoubleClick 和 data-state=selected",
      },
      {
        name: "TableHead",
        type: 'ComponentProps<"th">',
        description: "列标题或行标题单元格",
      },
      {
        name: "TableCell",
        type: 'ComponentProps<"td">',
        description: "数据单元格",
      },
      {
        name: "TableCaption",
        type: 'ComponentProps<"caption">',
        description: "可访问表格说明",
      },
    ],
  },
  {
    title: "单元格常用原生属性",
    rows: [
      {
        name: "colSpan",
        type: "number",
        defaultValue: "1",
        description: "TableHead / TableCell 横向合并列数",
      },
      {
        name: "rowSpan",
        type: "number",
        defaultValue: "1",
        description: "TableHead / TableCell 纵向合并行数",
      },
      {
        name: "scope",
        type: '"col" | "row" | "colgroup" | "rowgroup"',
        description: "TableHead 标题关联范围",
      },
      {
        name: "headers",
        type: "string",
        description: "关联标题单元格 id 列表",
      },
      {
        name: "className",
        type: "string",
        description: "使用公共样式约定扩展单元格",
      },
      { name: "children", type: "ReactNode", description: "单元格内容" },
    ],
  },
  {
    title: "视觉行为",
    rows: [
      {
        name: "bordered=false",
        type: "boolean",
        defaultValue: "false",
        description: "不显示列之间的垂直分隔线，仅保留行分隔线；参见无列垂直分隔线 Demo",
      },
      {
        name: "TableFooter",
        type: "Component",
        description: "Footer 单元格使用与 density 对应的内边距并垂直居中",
      },
    ],
  },
];
