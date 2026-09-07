import type { ComponentDocument } from "../../../components/component-page";

type ApiRow = NonNullable<ComponentDocument["apiSections"]>[number]["rows"][number];

const native = (element: string, refType: string, description: string): ApiRow[] => [
  { name: "children", type: "ReactNode", description },
  { name: "className", type: "string", description: `透传至 ${element}` },
  { name: "style", type: "CSSProperties", description: `${element} 的内联样式` },
  { name: "ref", type: `Ref<${refType}>`, description: `原生 ${element}` },
];

export const tableApiSections: ComponentDocument["apiSections"] = [
  {
    title: "Table API",
    description: "语义主体为 table；滚动容器通过 containerClassName 定制。",
    rows: [
      ...native("Table", "HTMLTableElement", "caption 与表格分组"),
      { name: "density", type: '"default" | "compact" | "touch"', defaultValue: '"default"', description: "数据密度" },
      { name: "bordered", type: "boolean", defaultValue: "false", description: "显示外框和列分隔线" },
      { name: "fixed", type: "boolean", defaultValue: "false", description: "使用固定表格布局" },
      { name: "stickyHeader", type: "boolean", defaultValue: "false", description: "固定表头" },
      { name: "containerClassName", type: "string", description: "滚动容器类名" },
    ],
  },
  { title: "TableHeader API", rows: native("THEAD", "HTMLTableSectionElement", "表头 TableRow") },
  { title: "TableBody API", rows: native("TBODY", "HTMLTableSectionElement", "数据 TableRow") },
  { title: "TableFooter API", rows: native("TFOOT", "HTMLTableSectionElement", "汇总 TableRow") },
  { title: "TableRow API", rows: [...native("TR", "HTMLTableRowElement", "TableHead 或 TableCell"), { name: "onClick", type: "MouseEventHandler<HTMLTableRowElement>", description: "原生行点击" }] },
  { title: "TableHead API", rows: [...native("TH", "HTMLTableCellElement", "标题内容"), { name: "colSpan", type: "number", defaultValue: "浏览器 1", description: "跨列" }, { name: "rowSpan", type: "number", defaultValue: "浏览器 1", description: "跨行" }, { name: "scope", type: '"col" | "row" | "colgroup" | "rowgroup"', description: "标题关联范围" }, { name: "headers", type: "string", description: "关联标题 id" }] },
  { title: "TableCell API", rows: [...native("TD", "HTMLTableCellElement", "数据内容"), { name: "colSpan", type: "number", defaultValue: "浏览器 1", description: "跨列" }, { name: "rowSpan", type: "number", defaultValue: "浏览器 1", description: "跨行" }, { name: "headers", type: "string", description: "关联标题 id" }] },
  { title: "TableCaption API", description: "captionSide 映射 CSS caption-side；它不属于单元格属性。", rows: [...native("TableCaption", "HTMLTableCaptionElement", "可访问表格说明"), { name: "captionSide", type: '"top" | "bottom"', defaultValue: '"top"', description: "表格说明所在侧" }] },
];
