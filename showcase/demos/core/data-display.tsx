import { useState } from "react";
import { Calendar, Carousel, Descriptions, Empty, Grid, Image, Input, List, Skeleton, Space, Statistic, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tag, Text, Timeline, Tree } from "../../../src/core";
import { DataTable } from "../../../src";
import type { ComponentDocument } from "../../components/component-page";

function DataTableDemo() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const rows = [
    { id: "ui", name: "Gouno UI", status: "Stable", score: 98 },
    { id: "blog", name: "Blog", status: "Preview", score: 86 },
    { id: "admin", name: "Admin", status: "Stable", score: 94 },
    { id: "gosso", name: "Gosso", status: "Draft", score: 72 },
    { id: "docs", name: "Docs", status: "Stable", score: 91 },
  ];
  return (
    <Space direction="vertical" className="w-full" size="lg">
      <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
        <div><Text>产品目录</Text><Text tone="muted" className="block text-xs">支持筛选、排序、选择、展开和分页</Text></div>
        <Input className="w-full sm:w-64" aria-label="筛选名称" placeholder="筛选名称" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <DataTable
        rowKey="id"
        dataSource={rows}
        density="default"
        bordered
        filter={(row) => row.name.toLowerCase().includes(query.toLowerCase())}
        columns={[
          { key: "name", title: "名称", dataIndex: "name", sorter: true, width: 220 },
          { key: "status", title: "状态", dataIndex: "status", render: (value) => <Tag tone={value === "Stable" ? "success" : value === "Draft" ? "warning" : "info"}>{String(value)}</Tag> },
          { key: "score", title: "评分", dataIndex: "score", sorter: (a, b) => a.score - b.score, align: "right", render: (value) => <span className="font-medium tabular-nums">{String(value)}%</span> },
        ]}
        selectable
        selectedRowKeys={selected}
        onSelectionChange={(keys) => setSelected(keys)}
        rowDisabled={(row) => row.status === "Draft"}
        expandedRowRender={(row) => <div className="rounded-md bg-muted/40 px-3 py-2 text-sm"><Text tone="muted">{row.name} 当前完成度为 {row.score}%，可在此放置更多操作。</Text></div>}
        pagination={{ pageSize: 3 }}
      />
    </Space>
  );
}

const dataTableCode = `function DataTableDemo() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const rows = [
    { id: "ui", name: "Gouno UI", status: "Stable", score: 98 },
    { id: "blog", name: "Blog", status: "Preview", score: 86 },
    { id: "admin", name: "Admin", status: "Stable", score: 94 },
    { id: "gosso", name: "Gosso", status: "Draft", score: 72 },
    { id: "docs", name: "Docs", status: "Stable", score: 91 },
  ];
  return (
    <Space direction="vertical" className="w-full" size="lg">
      <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
        <div><Text>产品目录</Text><Text tone="muted" className="block text-xs">支持筛选、排序、选择、展开和分页</Text></div>
        <Input className="w-full sm:w-64" aria-label="筛选名称" placeholder="筛选名称" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <DataTable rowKey="id" dataSource={rows} density="default" bordered filter={(row) => row.name.toLowerCase().includes(query.toLowerCase())} columns={[{ key: "name", title: "名称", dataIndex: "name", sorter: true, width: 220 }, { key: "status", title: "状态", dataIndex: "status", render: (value) => <Tag tone={value === "Stable" ? "success" : value === "Draft" ? "warning" : "info"}>{String(value)}</Tag> }, { key: "score", title: "评分", dataIndex: "score", sorter: (a, b) => a.score - b.score, align: "right", render: (value) => <span className="font-medium tabular-nums">{String(value)}%</span> }]} selectable selectedRowKeys={selected} onSelectionChange={(keys) => setSelected(keys)} rowDisabled={(row) => row.status === "Draft"} expandedRowRender={(row) => <div className="rounded-md bg-muted/40 px-3 py-2 text-sm"><Text tone="muted">{row.name} 当前完成度为 {row.score}%，可在此放置更多操作。</Text></div>} pagination={{ pageSize: 3 }} />
    </Space>
  );
}`;

export const dataDisplayDocuments: Record<string, ComponentDocument> = {
  list: { title: "List 列表", description: "基础分隔列表和自定义条目。", code: '<List data={items} renderItem={item => <Text>{item}</Text>} />', render: () => <List data={["Button", "Input", "Table"]} renderItem={item => <Text>{item}</Text>} /> },
  descriptions: { title: "Descriptions 描述列表", description: "展示对象属性和详情信息。", code: '<Descriptions columns={2} bordered items={[{ label: "版本", children: "0.2.0" }, { label: "状态", children: <Tag tone="success">Stable</Tag> }]} />', render: () => <Descriptions columns={2} bordered items={[{ label: "版本", children: "0.2.0" }, { label: "状态", children: <Tag tone="success">Stable</Tag> }]} /> },
  calendar: { title: "Calendar 日历", description: "日期网格、选中态和可选边界。", code: '<Calendar value={new Date()} onChange={setDate} />', render: () => <div className="max-w-md"><Calendar value={new Date(2026, 0, 15)} onChange={() => undefined} /></div> },
  image: { title: "Image 图片", description: "图片加载失败时提供可访问 fallback。", code: '<Image src="/cover.png" fallback={<Empty />} />', render: () => <Image src="/missing.png" alt="示例图片" fallback={<div className="rounded border p-10 text-center text-sm text-muted-foreground">Fallback</div>} /> },
  carousel: { title: "Carousel 轮播", description: "受控视觉轮播和键盘可达的操作按钮。", code: '<Carousel items={[<Card>One</Card>, <Card>Two</Card>]} />', render: () => <Carousel items={[<div key="1" className="p-12 text-center">Slide One</div>, <div key="2" className="p-12 text-center">Slide Two</div>]} /> },
  table: { title: "Table 表格", description: "统一表头、行、单元格和响应式容器样式。", code: '<Table bordered><TableHeader><TableRow><TableHead>名称</TableHead><TableHead>状态</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Gouno UI</TableCell><TableCell><Tag tone="success">正常</Tag></TableCell></TableRow></TableBody><TableFooter><TableRow><TableCell>总计</TableCell><TableCell>1 项</TableCell></TableRow></TableFooter><TableCaption>组件状态</TableCaption></Table>', render: () => <Table bordered><TableHeader><TableRow><TableHead>名称</TableHead><TableHead>状态</TableHead><TableHead>负责人</TableHead></TableRow></TableHeader><TableBody><TableRow data-state="selected"><TableCell>Gouno UI</TableCell><TableCell><Tag tone="success">正常</Tag></TableCell><TableCell>Design</TableCell></TableRow><TableRow><TableCell>Blog</TableCell><TableCell><Tag tone="info">预览</Tag></TableCell><TableCell>Product</TableCell></TableRow><TableRow aria-disabled="true" className="opacity-60"><TableCell>Legacy</TableCell><TableCell>禁用</TableCell><TableCell>Archive</TableCell></TableRow></TableBody><TableFooter><TableRow><TableCell>总计</TableCell><TableCell colSpan={2}>3 项</TableCell></TableRow></TableFooter><TableCaption>组件状态与负责人</TableCaption></Table>, demos: [{ title: "密度、边框与滚动", description: "默认、紧凑和触控密度在同一套语义表格结构上工作。", code: '<Space direction="vertical" className="w-full"><Table density="compact" bordered><TableHeader><TableRow><TableHead>紧凑表格</TableHead><TableHead>状态</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>构建任务</TableCell><TableCell>完成</TableCell></TableRow></TableBody></Table><Table density="touch" bordered fixed stickyHeader><TableHeader><TableRow><TableHead>触控表格</TableHead><TableHead>状态</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>发布任务</TableCell><TableCell>等待</TableCell></TableRow></TableBody></Table></Space>', render: () => <Space direction="vertical" className="w-full"><Table density="compact" bordered><TableHeader><TableRow><TableHead>紧凑表格</TableHead><TableHead>状态</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>构建任务</TableCell><TableCell>完成</TableCell></TableRow></TableBody></Table><Table density="touch" bordered fixed stickyHeader><TableHeader><TableRow><TableHead>触控表格</TableHead><TableHead>状态</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>发布任务</TableCell><TableCell>等待</TableCell></TableRow></TableBody></Table></Space> }, { title: "加载与空状态", code: '<Grid columns={2}><Skeleton className="h-32 w-full" /><Empty title="暂无数据" description="调整筛选条件后重试。" /></Grid>', render: () => <Grid columns={2}><Skeleton className="h-32 w-full" /><Empty title="暂无数据" description="调整筛选条件后重试。" /></Grid> }], api: [{ name: "density", description: "行间距密度", type: '"default" | "compact" | "touch"', defaultValue: '"default"' }, { name: "bordered", description: "显示容器边框", type: "boolean", defaultValue: "false" }, { name: "fixed", description: "使用固定表格布局", type: "boolean", defaultValue: "false" }, { name: "stickyHeader", description: "固定表头", type: "boolean", defaultValue: "false" }, { name: "containerClassName", description: "响应式容器类名", type: "string" }, { name: "className", description: "表格类名", type: "string" }, { name: "TableHeader", description: "表头组合组件", type: "React.Component" }, { name: "TableBody", description: "表体组合组件", type: "React.Component" }, { name: "TableFooter", description: "表尾组合组件", type: "React.Component" }, { name: "TableCaption", description: "表格说明组合组件", type: "React.Component" }] },
  "data-table": { title: "DataTable 数据表格", description: "面向业务列表的排序、筛选、分页、行选择、展开行、禁用行和状态原语。", code: dataTableCode, render: () => <DataTableDemo />, api: [{ name: "children", description: "直接组合 Table 子元素", type: "ReactNode" }, { name: "columns", description: "列定义", type: "DataTableColumn<T>[]" }, { name: "dataSource", description: "行数据", type: "T[]" }, { name: "rowKey", description: "稳定行键", type: "keyof T | function" }, { name: "loading", description: "加载状态", type: "boolean" }, { name: "loadingRows", description: "加载骨架行数", type: "number" }, { name: "loadingCols", description: "加载骨架列数", type: "number" }, { name: "empty", description: "强制空状态", type: "boolean" }, { name: "emptyState", description: "空状态覆盖内容", type: "ReactNode" }, { name: "error", description: "错误状态内容", type: "ReactNode" }, { name: "className", description: "外层类名", type: "string" }, { name: "containerClassName", description: "表格滚动容器类名", type: "string" }, { name: "density", description: "表格密度", type: "TableDensity" }, { name: "selectable", description: "启用行选择", type: "boolean" }, { name: "selectedRowKeys", description: "受控选中键", type: "string[]" }, { name: "onSelectionChange", description: "选中变化回调", type: "function" }, { name: "defaultSort", description: "非受控初始排序", type: "DataTableSortState" }, { name: "sort", description: "受控排序状态", type: "DataTableSortState | null" }, { name: "onSortChange", description: "排序变化回调", type: "function" }, { name: "filter", description: "行过滤函数", type: "(record: T) => boolean" }, { name: "pagination", description: "客户端或服务端分页配置", type: "DataTablePagination | false" }, { name: "bordered", description: "显示表格边框", type: "boolean" }, { name: "stickyHeader", description: "固定表头", type: "boolean" }, { name: "rowDisabled", description: "禁用指定行", type: "(record: T) => boolean" }, { name: "expandedRowKeys", description: "受控展开键", type: "string[]" }, { name: "defaultExpandedRowKeys", description: "非受控初始展开键", type: "string[]" }, { name: "onExpandedRowsChange", description: "展开变化回调", type: "function" }, { name: "expandedRowRender", description: "展开行内容", type: "(record, index) => ReactNode" }, { name: "summary", description: "当前页摘要行", type: "(rows: T[]) => ReactNode" }, { name: "onRow", description: "行原生属性回调", type: "(record, index) => HTMLAttributes<HTMLTableRowElement>" }, { name: "rowClassName", description: "行类名回调", type: "(record, index) => string" }, { name: "toolbar", description: "表格工具栏", type: "ReactNode" }, { name: "batchActions", description: "批量操作渲染回调", type: "(keys, clearSelection) => ReactNode" }, { name: "caption", description: "表格说明", type: "ReactNode" }, { name: "locale", description: "空状态和分页文案", type: "DataTableLocale" }] },
  statistic: { title: "Statistic 统计数值", description: "突出展示指标及单位。", code: '<Statistic title="访问量" value="12,480" />', render: () => <Grid columns={2}><Statistic title="访问量" value="12,480" /><Statistic title="增长" value="18.6" suffix="%" /></Grid> },
  timeline: { title: "Timeline 时间轴", description: "按顺序展示事件。", code: '<Timeline items={[{ title: "创建" }]} />', render: () => <Timeline items={[{ title:"创建项目", description:"09:00" },{ title:"完成构建", description:"09:12" }]} /> },
  tree: { title: "Tree 树", description: "层级展开、选择和复选。", code: '<Tree data={nodes} defaultExpandedKeys={["root"]} />', render: () => <Tree defaultExpandedKeys={["root"]} data={[{ key:"root", title:"组件", children:[{key:"core",title:"Core"},{key:"patterns",title:"Patterns"}]}]} /> }
};
