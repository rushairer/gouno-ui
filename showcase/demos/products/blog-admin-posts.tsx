import { useMemo, useState, type ReactNode } from "react";
import {
  Copy,
  Edit2,
  Eye,
  FileText,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
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

type PostStatus = "published" | "draft" | "scheduled";
type FixtureScenario = "data" | "loading" | "empty" | "error";
type DeleteTarget = { kind: "single"; id: string } | { kind: "batch" } | null;

interface PostFixture {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: readonly string[];
  status: PostStatus;
  updatedAt: string;
  views: number;
}

const pageSize = 4;

const initialPosts: readonly PostFixture[] = [
  {
    id: "post-101",
    title: "从真实产品抽象一套可维护的 UI 组件体系",
    slug: "product-driven-ui-system",
    category: "工程实践",
    tags: ["React", "Design System"],
    status: "published",
    updatedAt: "2026-09-07",
    views: 12840,
  },
  {
    id: "post-102",
    title: "OAuth 2.0 Authorization Code + PKCE 的 BFF 实践",
    slug: "oauth2-pkce-bff-practice",
    category: "身份安全",
    tags: ["OAuth", "Security"],
    status: "published",
    updatedAt: "2026-09-06",
    views: 9342,
  },
  {
    id: "post-103",
    title: "Tailwind CSS v4 与 shadcn/ui 的设计语言收敛",
    slug: "tailwind-v4-shadcn-alignment",
    category: "前端",
    tags: ["Tailwind", "React"],
    status: "draft",
    updatedAt: "2026-09-05",
    views: 0,
  },
  {
    id: "post-104",
    title: "分布式任务调度：从任务拆分到结果汇聚",
    slug: "distributed-task-orchestration",
    category: "后端架构",
    tags: ["Go", "Distributed"],
    status: "scheduled",
    updatedAt: "2026-09-04",
    views: 0,
  },
  {
    id: "post-105",
    title: "Kafka 高吞吐消费场景中的背压与并发边界",
    slug: "kafka-backpressure-concurrency",
    category: "后端架构",
    tags: ["Kafka", "Go"],
    status: "published",
    updatedAt: "2026-09-02",
    views: 6731,
  },
  {
    id: "post-106",
    title: "组件 API 为什么应该晚于真实页面出现",
    slug: "component-api-after-product-evidence",
    category: "工程实践",
    tags: ["Design System"],
    status: "draft",
    updatedAt: "2026-08-31",
    views: 0,
  },
];

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "错误" },
] as const;

const statusLabel: Record<PostStatus, string> = {
  published: "已发布",
  draft: "草稿",
  scheduled: "定时发布",
};

function StatusTag({ status }: { status: PostStatus }) {
  if (status === "published") return <Tag color="success">{statusLabel[status]}</Tag>;
  if (status === "scheduled") return <Tag color="warning">{statusLabel[status]}</Tag>;
  return <Tag>{statusLabel[status]}</Tag>;
}

function RowActions({
  post,
  onNotice,
  onDelete,
}: {
  post: PostFixture;
  onNotice: (message: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex min-w-max flex-nowrap items-center justify-end gap-1">
      <IconButton
        label={post.status === "published" ? "查看文章" : "预览文章"}
        icon={<Eye />}
        variant="ghost"
        onClick={() => onNotice(`${post.status === "published" ? "查看" : "预览"}《${post.title}》（Showcase 模拟）。`)}
      />
      <IconButton
        label="复制文章链接"
        icon={<Copy />}
        variant="ghost"
        onClick={() => onNotice(`已复制 /articles/${post.slug}（Showcase 模拟）。`)}
      />
      <IconButton
        label="编辑文章"
        icon={<Edit2 />}
        variant="ghost"
        onClick={() => onNotice(`将进入 /admin/posts/${post.id}/edit（Showcase 模拟）。`)}
      />
      <IconButton
        label="删除文章"
        icon={<Trash2 />}
        variant="ghost"
        color="error"
        onClick={() => onDelete(post.id)}
      />
    </div>
  );
}

function LoadingPosts() {
  return (
    <Card padding="base" aria-label="文章加载中">
      <div className="flex flex-col gap-4" role="status" aria-live="polite">
        <Text size="sm" tone="muted">正在加载文章…</Text>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="grid gap-3 border-t pt-4 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_8rem_8rem]">
            <div className="flex flex-col gap-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function BlogAdminPostsDemo() {
  const [posts, setPosts] = useState<PostFixture[]>(() => [...initialPosts]);
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const categories = useMemo(() => [...new Set(posts.map((post) => post.category))].sort(), [posts]);
  const tags = useMemo(() => [...new Set(posts.flatMap((post) => post.tags))].sort(), [posts]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (normalized && !`${post.title} ${post.slug}`.toLowerCase().includes(normalized)) return false;
      if (status && post.status !== status) return false;
      if (category && post.category !== category) return false;
      if (tag && !post.tags.includes(tag)) return false;
      return true;
    });
  }, [category, posts, query, status, tag]);

  const resultPosts = scenario === "empty" ? [] : filtered;
  const total = resultPosts.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pages);
  const visiblePosts = resultPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasFilters = Boolean(query || status || category || tag);
  const allVisibleSelected = visiblePosts.length > 0 && visiblePosts.every((post) => selected.includes(post.id));

  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
    setSelected([]);
  };

  const clearFilters = () => {
    setQuery("");
    setStatus("");
    setCategory("");
    setTag("");
    setPage(1);
    setSelected([]);
  };

  const setSelection = (id: string, checked: boolean) => {
    setSelected((current) => checked ? [...new Set([...current, id])] : current.filter((item) => item !== id));
  };

  const applyBatch = (action: "publish" | "draft") => {
    if (!selected.length) return;
    const nextStatus: PostStatus = action === "publish" ? "published" : "draft";
    setPosts((current) => current.map((post) => selected.includes(post.id) ? { ...post, status: nextStatus } : post));
    setNotice(action === "publish" ? `已发布 ${selected.length} 篇文章（Showcase 模拟）。` : `已将 ${selected.length} 篇文章转为草稿（Showcase 模拟）。`);
    setSelected([]);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === "batch") {
      const count = selected.length;
      setPosts((current) => current.filter((post) => !selected.includes(post.id)));
      setSelected([]);
      setNotice(`已删除 ${count} 篇文章（Showcase 模拟）。`);
    } else {
      const target = posts.find((post) => post.id === deleteTarget.id);
      setPosts((current) => current.filter((post) => post.id !== deleteTarget.id));
      setSelected((current) => current.filter((id) => id !== deleteTarget.id));
      if (target) setNotice(`已删除《${target.title}》（Showcase 模拟）。`);
    }
    setDeleteTarget(null);
  };

  const deleteDescription: ReactNode = deleteTarget?.kind === "batch"
    ? `确认永久删除已选择的 ${selected.length} 篇文章？此操作无法撤销。`
    : deleteTarget?.kind === "single"
      ? `确认永久删除《${posts.find((post) => post.id === deleteTarget.id)?.title ?? "该文章"}》？此操作无法撤销。`
      : null;

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route="/admin/posts"
        note="Blog Admin 第一张真实迁移页面；状态切换只改变 Showcase fixture，不请求真实 Blog API。"
        controls={(
          <Segmented<FixtureScenario>
            aria-label="文章页 Fixture 状态"
            options={scenarioOptions}
            value={scenario}
            onChange={(value) => { setScenario(value); setSelected([]); setNotice(null); }}
            block
          />
        )}
      />

      <PageHeader
        title="文章"
        description="管理全站草稿、定时内容与已发布文章。"
        actions={(
          <Button variant="solid" color="primary" icon={<Plus />} onClick={() => setNotice("将进入 /admin/posts/new（Showcase 模拟）。")}>新建文章</Button>
        )}
      />

      {notice ? <Alert type="success" showIcon title={notice} closable={{ onClose: () => setNotice(null) }} /> : null}

      <Card padding="base" className="shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="min-w-0 flex-1">
            <Input
              aria-label="搜索文章"
              prefix={<Search className="size-4" />}
              value={query}
              onChange={(event) => updateFilter(setQuery, event.target.value)}
              placeholder="搜索标题或 slug"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:flex xl:shrink-0">
            <div className="min-w-0 xl:w-36">
              <Select aria-label="文章状态" value={status} onChange={(value) => updateFilter(setStatus, String(value))}>
                <option value="">全部状态</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
                <option value="scheduled">定时发布</option>
              </Select>
            </div>
            <div className="min-w-0 xl:w-40">
              <Select aria-label="文章分类" value={category} onChange={(value) => updateFilter(setCategory, String(value))}>
                <option value="">全部分类</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </Select>
            </div>
            <div className="min-w-0 xl:w-40">
              <Select aria-label="文章标签" value={tag} onChange={(value) => updateFilter(setTag, String(value))}>
                <option value="">全部标签</option>
                {tags.map((item) => <option key={item} value={item}>{item}</option>)}
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 xl:justify-end">
            <Text size="sm" tone="muted" className="whitespace-nowrap">{filtered.length} 篇</Text>
            {hasFilters ? <Button size="small" variant="text" icon={<X />} onClick={clearFilters}>清除</Button> : null}
          </div>
        </div>
      </Card>

      {selected.length > 0 ? (
        <BulkActionBar
          selectionLabel={`已选择 ${selected.length} 篇`}
          onCancel={() => setSelected([])}
        >
          <Button size="small" icon={<Sparkles />} onClick={() => setNotice(`将对 ${selected.length} 篇文章启动 AI 辅助流程（Showcase 模拟）。`)}>交给 AI</Button>
          <Button size="small" onClick={() => applyBatch("publish")}>立即发布</Button>
          <Button size="small" onClick={() => applyBatch("draft")}>转为草稿</Button>
          <Button size="small" color="error" icon={<Trash2 />} onClick={() => setDeleteTarget({ kind: "batch" })}>删除</Button>
        </BulkActionBar>
      ) : null}

      {scenario === "error" ? (
        <Alert
          type="error"
          showIcon
          title="文章加载失败"
          description="无法读取文章列表。真实产品会保留筛选条件并允许重新请求。"
          action={<Button size="small" onClick={() => setScenario("data")}>重新载入</Button>}
        />
      ) : scenario === "loading" ? (
        <LoadingPosts />
      ) : visiblePosts.length === 0 ? (
        <Card padding="lg">
          <Empty
            icon={<FileText className="size-7 text-muted-foreground" />}
            title={hasFilters ? "没有符合当前筛选条件的文章" : "还没有文章"}
            description={hasFilters ? "调整或清除筛选条件后重试。" : "创建第一篇文章，开始构建站点内容。"}
            action={hasFilters ? <Button onClick={clearFilters}>清除筛选</Button> : <Button variant="solid" color="primary" icon={<Plus />} onClick={() => setNotice("将进入 /admin/posts/new（Showcase 模拟）。")}>撰写第一篇文章</Button>}
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
                      aria-label="选择当前页全部文章"
                      checked={allVisibleSelected}
                      onChange={(event) => {
                        const visibleIds = visiblePosts.map((post) => post.id);
                        setSelected((current) => event.target.checked
                          ? [...new Set([...current, ...visibleIds])]
                          : current.filter((id) => !visibleIds.includes(id)));
                      }}
                    />
                  </TableHead>
                  <TableHead>文章</TableHead>
                  <TableHead className="w-28">状态</TableHead>
                  <TableHead className="w-28">更新时间</TableHead>
                  <TableHead className="w-24 text-right">阅读</TableHead>
                  <TableHead className="w-40 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePosts.map((post) => (
                  <TableRow key={post.id} data-state={selected.includes(post.id) ? "selected" : undefined}>
                    <TableCell className="text-center">
                      <Checkbox
                        aria-label={`选择文章 ${post.title}`}
                        checked={selected.includes(post.id)}
                        onChange={(event) => setSelection(post.id, event.target.checked)}
                      />
                    </TableCell>
                    <TableCell className="min-w-72 whitespace-normal">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold leading-snug">{post.title}</span>
                        <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <code className="font-mono">/{post.slug}</code>
                          <Tag bordered={false}>{post.category}</Tag>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell><StatusTag status={post.status} /></TableCell>
                    <TableCell><time className="font-mono text-xs text-muted-foreground">{post.updatedAt}</time></TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">{post.views.toLocaleString()}</TableCell>
                    <TableCell><RowActions post={post} onNotice={setNotice} onDelete={(id) => setDeleteTarget({ kind: "single", id })} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 md:hidden" role="list" aria-label="文章列表">
            {visiblePosts.map((post) => (
              <Card key={post.id} padding="base" role="listitem" className={selected.includes(post.id) ? "border-primary/40 bg-accent/20" : undefined}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Checkbox aria-label={`选择文章 ${post.title}`} checked={selected.includes(post.id)} onChange={(event) => setSelection(post.id, event.target.checked)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold leading-snug">{post.title}</span>
                        <StatusTag status={post.status} />
                      </div>
                      <code className="mt-1 block break-all font-mono text-xs text-muted-foreground">/{post.slug}</code>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{post.category}</span>
                    <time>更新于 {post.updatedAt}</time>
                    <span>{post.views.toLocaleString()} 次阅读</span>
                  </div>
                  <RowActions post={post} onNotice={setNotice} onDelete={(id) => setDeleteTarget({ kind: "single", id })} />
                </div>
              </Card>
            ))}
          </div>

          {total > pageSize ? (
            <Pagination
              ariaLabel="文章分页"
              page={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={(nextPage) => { setPage(nextPage); setSelected([]); }}
              align="center"
              showTotal={(count, range) => `${range[0]}-${range[1]} / ${count} 篇`}
            />
          ) : null}
        </>
      )}

      <Modal
        open={deleteTarget !== null}
        title={deleteTarget?.kind === "batch" ? "批量删除文章" : "删除文章"}
        description={deleteDescription}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onOk={confirmDelete}
        okText="永久删除"
        cancelText="取消"
        okButtonProps={{ variant: "solid", color: "error" }}
      >
        <Text size="sm" tone="muted">这是静态 Showcase fixture；确认后只更新当前预览数据。</Text>
      </Modal>
    </div>
  );
}
