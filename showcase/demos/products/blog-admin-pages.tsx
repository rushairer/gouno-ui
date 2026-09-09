import { useMemo, useState, type ReactNode } from "react";
import { Copy, Edit2, Eye, FileText, Plus, Search, Sparkles, Trash2, X } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Empty,
  IconButton,
  Input,
  Modal,
  Pagination,
  Segmented,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Text,
} from "../../../src/core";
import { PageHeader } from "../../../src/gouno";
import { BulkActionBar } from "../../../src/patterns";
import { FixtureDock } from "../../components/fixture-dock";
import { BlogAdminWorkflowLauncherFixture } from "./blog-admin-workflow-launcher-fixture";

type PageStatus = "published" | "draft";
type FixtureScenario = "data" | "loading" | "empty" | "error";
type MutationScenario = "success" | "delete-error";
type DeleteTarget = { kind: "single"; id: number } | { kind: "batch" } | null;
type Notice = { type: "success" | "info" | "error"; message: string } | null;

type PageFixture = {
  id: number;
  title: string;
  summary: string;
  slug: string;
  template: string;
  showInNav: boolean;
  sortOrder: number;
  status: PageStatus;
  updatedAt: string;
};

const pageSize = 4;
const pageReviewWorkflows = [
  {
    id: 73,
    name: "单页审校与优化（手选）",
    description: "检查手选单页的内容质量、访问路径与导航元数据。",
  },
] as const;

const initialPages: readonly PageFixture[] = [
  { id: 201, title: "关于我", summary: "站点作者、技术方向与长期写作主题。", slug: "about", template: "profile", showInNav: true, sortOrder: 10, status: "published", updatedAt: "2026-09-07" },
  { id: 202, title: "友情链接", summary: "长期关注的技术站点与朋友链接。", slug: "friends", template: "links", showInNav: true, sortOrder: 20, status: "published", updatedAt: "2026-09-06" },
  { id: 203, title: "隐私政策", summary: "说明访问日志、Cookie 与站点数据的使用方式。", slug: "privacy", template: "legal", showInNav: false, sortOrder: 0, status: "published", updatedAt: "2026-09-05" },
  { id: 204, title: "服务条款", summary: "", slug: "terms", template: "legal", showInNav: false, sortOrder: 0, status: "draft", updatedAt: "2026-09-04" },
  { id: 205, title: "站点历史", summary: "记录博客的重要版本、架构迁移与设计演进。", slug: "history", template: "default", showInNav: true, sortOrder: 30, status: "draft", updatedAt: "2026-09-02" },
  { id: 206, title: "联系我", summary: "合作、技术交流与问题反馈入口。", slug: "contact", template: "contact", showInNav: false, sortOrder: 0, status: "published", updatedAt: "2026-08-30" },
];

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "错误" },
] as const;

const mutationOptions = [
  { value: "success", label: "删除成功" },
  { value: "delete-error", label: "删除失败" },
] as const;

function PageStatusTag({ status }: { status: PageStatus }) {
  return status === "published" ? <Tag color="success">已发布</Tag> : <Tag>草稿</Tag>;
}

function PageActions({ page, onNotice, onDelete }: {
  page: PageFixture;
  onNotice: (notice: Notice) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex min-w-max flex-nowrap items-center justify-end gap-1">
      <IconButton
        label={`${page.status === "published" ? "查看" : "预览"}单页 ${page.title}`}
        icon={<Eye />}
        variant="ghost"
        onClick={() => onNotice({ type: "info", message: `${page.status === "published" ? "查看" : "预览"} /${page.slug}（Showcase 模拟）。` })}
      />
      <IconButton
        label={`复制单页链接 ${page.title}`}
        icon={<Copy />}
        variant="ghost"
        onClick={() => onNotice({ type: "success", message: `已复制 /${page.slug}（Showcase 模拟）。` })}
      />
      <IconButton
        label={`编辑单页 ${page.title}`}
        icon={<Edit2 />}
        variant="ghost"
        onClick={() => onNotice({ type: "info", message: `将进入 /admin/pages/${page.id}/edit（Showcase 模拟）。` })}
      />
      <IconButton
        label={`删除单页 ${page.title}`}
        icon={<Trash2 />}
        variant="ghost"
        color="error"
        onClick={() => onDelete(page.id)}
      />
    </div>
  );
}

function LoadingPages() {
  return (
    <Card padding="base" aria-label="单页加载中">
      <div className="flex flex-col gap-4" role="status" aria-live="polite">
        <Text size="sm" tone="muted">正在加载单页…</Text>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="grid gap-3 border-t pt-4 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_9rem_7rem_7rem]">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-4/5" />
            </div>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function BlogAdminPagesDemo() {
  const [pagesData, setPagesData] = useState<PageFixture[]>(() => [...initialPages]);
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [mutation, setMutation] = useState<MutationScenario>("success");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [aiOpen, setAIOpen] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return pagesData.filter((item) => {
      if (normalized && !`${item.title} ${item.summary} ${item.slug}`.toLowerCase().includes(normalized)) return false;
      if (status && item.status !== status) return false;
      return true;
    });
  }, [pagesData, query, status]);

  const resultPages = scenario === "empty" ? [] : filtered;
  const total = resultPages.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visiblePages = resultPages.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasFilters = Boolean(query || status);
  const allVisibleSelected = visiblePages.length > 0 && visiblePages.every((item) => selected.includes(item.id));
  const selectedPages = useMemo(
    () => pagesData.filter((item) => selected.includes(item.id)),
    [pagesData, selected],
  );

  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
    setSelected([]);
    setAIOpen(false);
  };

  const clearFilters = () => {
    setQuery("");
    setStatus("");
    setPage(1);
    setSelected([]);
    setAIOpen(false);
  };

  const setSelection = (id: number, checked: boolean) => {
    setSelected((current) => checked
      ? [...new Set([...current, id])]
      : current.filter((item) => item !== id));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (mutation === "delete-error") {
      setNotice({ type: "error", message: "删除单页失败；当前列表、选择与确认窗口保持不变，可直接重试（Showcase 模拟）。" });
      return;
    }

    const ids = deleteTarget.kind === "batch" ? selected : [deleteTarget.id];
    const count = ids.length;
    const single = deleteTarget.kind === "single" ? pagesData.find((item) => item.id === deleteTarget.id) : null;
    setPagesData((current) => current.filter((item) => !ids.includes(item.id)));
    setSelected((current) => current.filter((id) => !ids.includes(id)));
    setDeleteTarget(null);
    setAIOpen(false);
    setNotice({
      type: "success",
      message: deleteTarget.kind === "batch"
        ? `所选 ${count} 个单页已删除（Showcase 模拟）。`
        : `单页《${single?.title ?? "该单页"}》已删除（Showcase 模拟）。`,
    });
  };

  const deleteDescription: ReactNode = deleteTarget?.kind === "batch"
    ? `确认永久删除选中的 ${selected.length} 个单页？此操作无法撤销。`
    : deleteTarget?.kind === "single"
      ? `确认永久删除《${pagesData.find((item) => item.id === deleteTarget.id)?.title ?? "该单页"}》？此操作无法撤销。`
      : null;

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route="/admin/pages"
        note="保留真实单页筛选、响应式 Table/List、路径/模板/导航元数据、删除失败重试与 page_ids WorkflowLauncher；Workflow 资源范围由当前页面选择固定注入，Fixture 不请求真实 Blog/AI API。"
        controls={(
          <div className="flex flex-col gap-3">
            <Segmented<FixtureScenario>
              aria-label="单页 Fixture 状态"
              options={scenarioOptions}
              value={scenario}
              onChange={(value) => {
                setScenario(value);
                setSelected([]);
                setNotice(null);
                setDeleteTarget(null);
                setAIOpen(false);
              }}
              block
            />
            <Segmented<MutationScenario>
              aria-label="单页删除场景"
              options={mutationOptions}
              value={mutation}
              onChange={(value) => { setMutation(value); setNotice(null); }}
              block
            />
          </div>
        )}
      />

      <PageHeader
        title="单页"
        description="管理关于我、友情链接、隐私政策等独立单页。"
        actions={(
          <Button
            variant="solid"
            color="primary"
            icon={<Plus />}
            onClick={() => setNotice({ type: "info", message: "将进入 /admin/pages/new（Showcase 模拟）。" })}
          >
            新建单页
          </Button>
        )}
      />

      {notice ? <Alert type={notice.type} showIcon title={notice.message} closable={{ onClose: () => setNotice(null) }} /> : null}

      <Card padding="base">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <Input
              aria-label="搜索单页"
              prefix={<Search className="size-4" />}
              value={query}
              onChange={(event) => updateFilter(setQuery, event.target.value)}
              placeholder="搜索标题、摘要或路径"
            />
          </div>
          <div className="min-w-0 lg:w-40 lg:shrink-0">
            <Select aria-label="单页状态" value={status} onChange={(value) => updateFilter(setStatus, String(value))}>
              <option value="">全部状态</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <Text size="sm" tone="muted" className="whitespace-nowrap">{total} 页</Text>
            {hasFilters ? <Button size="small" variant="text" icon={<X />} onClick={clearFilters}>清除</Button> : null}
          </div>
        </div>
      </Card>

      {selected.length > 0 ? (
        <BulkActionBar selectionLabel={`已选择 ${selected.length} 页`} onCancel={() => { setSelected([]); setAIOpen(false); }}>
          <Button size="small" icon={<Sparkles />} onClick={() => setAIOpen(true)}>交给 AI</Button>
          <Button size="small" color="error" icon={<Trash2 />} onClick={() => setDeleteTarget({ kind: "batch" })}>删除</Button>
        </BulkActionBar>
      ) : null}

      {scenario === "error" ? (
        <Alert
          type="error"
          showIcon
          title="单页加载失败"
          description="无法读取单页列表。真实产品会保留筛选条件并允许重新请求。"
          action={<Button size="small" onClick={() => setScenario("data")}>重新载入</Button>}
        />
      ) : scenario === "loading" ? (
        <LoadingPages />
      ) : visiblePages.length === 0 ? (
        <Card padding="lg">
          <Empty
            icon={<FileText className="size-7 text-muted-foreground" />}
            title={hasFilters ? "没有符合当前筛选条件的单页" : "还没有创建过独立单页"}
            description={hasFilters ? "调整或清除筛选条件后重试。" : "创建关于我、友情链接或隐私政策等独立页面。"}
            action={hasFilters
              ? <Button onClick={clearFilters}>清除筛选</Button>
              : <Button variant="solid" color="primary" icon={<Plus />} onClick={() => setNotice({ type: "info", message: "将进入 /admin/pages/new（Showcase 模拟）。" })}>新建单页</Button>}
          />
        </Card>
      ) : (
        <>
          <div className="hidden md:block">
            <Table density="compact" bordered>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">
                    <Checkbox
                      aria-label="选择当前页全部单页"
                      checked={allVisibleSelected}
                      onChange={(event) => {
                        const visibleIds = visiblePages.map((item) => item.id);
                        setSelected((current) => event.target.checked
                          ? [...new Set([...current, ...visibleIds])]
                          : current.filter((id) => !visibleIds.includes(id)));
                      }}
                    />
                  </TableHead>
                  <TableHead>单页</TableHead>
                  <TableHead className="w-40">访问路径</TableHead>
                  <TableHead className="w-28">模板</TableHead>
                  <TableHead className="w-36">导航展示</TableHead>
                  <TableHead className="w-28">状态</TableHead>
                  <TableHead className="w-32">更新时间</TableHead>
                  <TableHead className="w-40 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePages.map((item) => (
                  <TableRow key={item.id} data-state={selected.includes(item.id) ? "selected" : undefined}>
                    <TableCell className="text-center">
                      <Checkbox aria-label={`选择单页 ${item.title}`} checked={selected.includes(item.id)} onChange={(event) => setSelection(item.id, event.target.checked)} />
                    </TableCell>
                    <TableCell className="min-w-72 whitespace-normal">
                      <div className="flex flex-col gap-1">
                        <strong className="text-sm font-semibold leading-snug text-foreground">{item.title}</strong>
                        {item.summary ? <span className="line-clamp-1 text-xs text-muted-foreground">{item.summary}</span> : <span className="text-xs italic text-muted-foreground/60">无摘要</span>}
                      </div>
                    </TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">/{item.slug}</code></TableCell>
                    <TableCell><Tag>{item.template || "default"}</Tag></TableCell>
                    <TableCell>{item.showInNav ? <Tag color="success">主导航 · {item.sortOrder}</Tag> : <Text size="xs" tone="muted">隐藏</Text>}</TableCell>
                    <TableCell><PageStatusTag status={item.status} /></TableCell>
                    <TableCell><time className="font-mono text-xs text-muted-foreground">{item.updatedAt}</time></TableCell>
                    <TableCell><PageActions page={item} onNotice={setNotice} onDelete={(id) => setDeleteTarget({ kind: "single", id })} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 md:hidden" role="list" aria-label="单页列表">
            {visiblePages.map((item) => (
              <Card key={item.id} padding="base" role="listitem" className={selected.includes(item.id) ? "border-primary/40 bg-accent/20" : undefined}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Checkbox aria-label={`选择单页 ${item.title}`} checked={selected.includes(item.id)} onChange={(event) => setSelection(item.id, event.target.checked)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <strong className="min-w-0 break-words text-sm font-semibold leading-snug">{item.title}</strong>
                        <PageStatusTag status={item.status} />
                      </div>
                      <code className="mt-1 block break-all font-mono text-xs text-muted-foreground">/{item.slug}</code>
                      {item.summary ? <Text size="xs" tone="muted" className="mt-2 line-clamp-2">{item.summary}</Text> : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Tag>{item.template || "default"}</Tag>
                    <span>{item.showInNav ? `主导航 · ${item.sortOrder}` : "导航隐藏"}</span>
                    <time>更新于 {item.updatedAt}</time>
                  </div>
                  <PageActions page={item} onNotice={setNotice} onDelete={(id) => setDeleteTarget({ kind: "single", id })} />
                </div>
              </Card>
            ))}
          </div>

          {total > pageSize ? (
            <Pagination
              ariaLabel="单页分页"
              page={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={(nextPage) => { setPage(nextPage); setSelected([]); setAIOpen(false); }}
              align="center"
              showTotal={(count, range) => `${range[0]}-${range[1]} / ${count} 页`}
            />
          ) : null}
        </>
      )}

      <Modal
        open={deleteTarget !== null}
        title={deleteTarget?.kind === "batch" ? "批量删除单页" : "删除单页"}
        description={deleteDescription}
        onClose={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        okText="永久删除"
        okButtonProps={{ variant: "solid", color: "error" }}
      >
        <Text size="sm" tone="muted">删除只影响当前静态 Fixture；真实产品会调用 pages API。</Text>
      </Modal>

      <BlogAdminWorkflowLauncherFixture
        open={aiOpen}
        title="将所选单页交给 AI"
        description={`已选择 ${selected.length} 项资源；Workflow 默认只能访问这些目标。`}
        resourceLabel="单页"
        resources={selectedPages.map((item) => ({ key: item.id, label: item.title, detail: `/${item.slug}` }))}
        workflows={pageReviewWorkflows}
        runIdBase={251}
        onClose={() => setAIOpen(false)}
        onNavigate={(route) => {
          setAIOpen(false);
          setNotice({ type: "info", message: `将进入 ${route}（Showcase 模拟）。` });
        }}
      />
    </div>
  );
}
