import { useMemo, useState } from "react";
import { DataTable, FilterBar, BulkActionBar, Pagination, Feedback } from "../../src/patterns";
import { Badge, Button, Container, Input } from "../../src/core";
import { PageHeader, Panel, PanelHeader } from "../../src/gouno";

const rows = [
  { id: "post-01", title: "设计系统迁移计划", type: "文章", status: "已发布", author: "Gouno Owner" },
  { id: "post-02", title: "组件 API 规范", type: "文档", status: "草稿", author: "Editorial Team" },
  { id: "post-03", title: "主题与品牌令牌", type: "文章", status: "待审核", author: "Gouno Owner" },
  { id: "post-04", title: "Showcase 信息架构", type: "页面", status: "已发布", author: "Editorial Team" },
];

export function PatternsOverview() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [density, setDensity] = useState<"default" | "compact" | "touch">("default");
  const visible = useMemo(() => rows.filter(row => `${row.title} ${row.type} ${row.author}`.includes(query)), [query]);
  const toggleAll = () => setSelected(selected.length === visible.length ? [] : visible.map(row => row.id));
  return <Container className="space-y-6">
    <PageHeader title="Gouno UI Patterns" description="可跨产品复用的复合交互模式，不绑定 Blog 或 Gosso 业务。" />
    <Panel><PanelHeader title="DataTable pattern" description="筛选、密度、选择、批量操作和分页组合。" actions={<select aria-label="表格密度" className="h-9 rounded-md border bg-input px-3 text-sm" value={density} onChange={e => setDensity(e.target.value as typeof density)}><option value="default">默认</option><option value="compact">紧凑</option><option value="touch">触控</option></select>} />
      <FilterBar><Input aria-label="搜索内容" placeholder="搜索标题、类型或作者" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} /></FilterBar>
      <DataTable density={density} empty={visible.length === 0} emptyState={<Feedback type="info">没有匹配的记录。</Feedback>}>
        <thead><tr><th className="w-10"><input type="checkbox" aria-label="全选" checked={visible.length > 0 && selected.length === visible.length} onChange={toggleAll} /></th><th>标题</th><th>类型</th><th>状态</th><th>作者</th><th>操作</th></tr></thead>
        <tbody>{visible.map(row => <tr key={row.id}><td><input type="checkbox" aria-label={`选择 ${row.title}`} checked={selected.includes(row.id)} onChange={e => setSelected(current => e.target.checked ? [...current, row.id] : current.filter(id => id !== row.id))} /></td><td className="font-medium">{row.title}</td><td>{row.type}</td><td><Badge tone={row.status === "已发布" ? "success" : row.status === "草稿" ? "neutral" : "warning"}>{row.status}</Badge></td><td>{row.author}</td><td><Button size="sm" variant="ghost">查看</Button></td></tr>)}</tbody>
      </DataTable>
      {selected.length > 0 ? <BulkActionBar selectionLabel={`已选择 ${selected.length} 项`} onCancel={() => setSelected([])}><Button size="sm" variant="danger">批量归档</Button></BulkActionBar> : null}
      <Pagination page={page} pages={3} onChange={setPage} />
    </Panel>
  </Container>;
}
