import { useMemo, useState, type ReactNode } from "react";
import { Bot, Check, EyeOff, Flag, Trash2, X } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Empty,
  Modal,
  Segmented,
  Select,
  Skeleton,
  Tag,
  Text,
} from "../../../src/core";
import { PageHeader } from "../../../src/gouno";
import { FixtureDock } from "../../components/fixture-dock";

type CommentStatus = "pending" | "visible" | "hidden";
type CommentFilter = CommentStatus | "all";
type FixtureScenario = "data" | "loading" | "empty" | "error";
type DeleteTarget = { kind: "single"; id: number } | { kind: "batch" } | null;

interface CommentFixture {
  id: number;
  postId: number;
  author: string;
  content: string;
  status: CommentStatus;
  reportCount: number;
  createdAt: string;
}

const initialComments: readonly CommentFixture[] = [
  {
    id: 1201,
    postId: 101,
    author: "Lina",
    content: "这篇关于 Design System 的复盘很有帮助。想继续看看 Pattern 层最后会保留哪些能力。",
    status: "pending",
    reportCount: 0,
    createdAt: "2026-09-08T06:42:00+08:00",
  },
  {
    id: 1202,
    postId: 102,
    author: "Kai",
    content: "这里的 OAuth 回调是不是还可以补一个错误态示例？",
    status: "pending",
    reportCount: 2,
    createdAt: "2026-09-08T05:18:00+08:00",
  },
  {
    id: 1203,
    postId: 103,
    author: "Mori",
    content: "Tailwind v4 迁移后 token 的边界讲得很清楚。",
    status: "visible",
    reportCount: 0,
    createdAt: "2026-09-07T23:36:00+08:00",
  },
  {
    id: 1204,
    postId: 104,
    author: "Noah",
    content: "这条评论包含明显的灌水内容，需要管理员决定是否继续展示。",
    status: "hidden",
    reportCount: 4,
    createdAt: "2026-09-07T20:11:00+08:00",
  },
];

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "错误" },
] as const;

const statusLabels: Record<CommentStatus, string> = {
  pending: "待审核",
  visible: "已通过",
  hidden: "已隐藏",
};

function statusColor(status: CommentStatus) {
  if (status === "visible") return "success" as const;
  if (status === "pending") return "warning" as const;
  return "default" as const;
}

function LoadingComments() {
  return (
    <div className="space-y-3" role="status" aria-label="评论加载中" aria-live="polite">
      {Array.from({ length: 3 }, (_, index) => (
        <Card key={index} padding="base">
          <div className="flex gap-4">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex gap-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-32" /></div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function BlogAdminCommentsDemo() {
  const [comments, setComments] = useState<CommentFixture[]>(() => [...initialComments]);
  const [status, setStatus] = useState<CommentFilter>("pending");
  const [reportedOnly, setReportedOnly] = useState(false);
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [selected, setSelected] = useState<number[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [aiOpen, setAIOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(
    () => comments.filter((comment) => {
      if (status !== "all" && comment.status !== status) return false;
      if (reportedOnly && comment.reportCount === 0) return false;
      return true;
    }),
    [comments, reportedOnly, status],
  );

  const visibleComments = scenario === "empty" ? [] : filtered;
  const selectedComments = useMemo(
    () => comments.filter((comment) => selected.includes(comment.id)),
    [comments, selected],
  );

  const clearSelection = () => setSelected([]);

  const updateStatus = (next: string) => {
    setStatus(next as CommentFilter);
    clearSelection();
    setNotice(null);
  };

  const setSelection = (id: number, checked: boolean) => {
    setSelected((current) => checked
      ? [...new Set([...current, id])]
      : current.filter((item) => item !== id));
  };

  const moderate = (comment: CommentFixture, next: "visible" | "hidden") => {
    setComments((current) => current.filter((item) => item.id !== comment.id));
    setSelected((current) => current.filter((id) => id !== comment.id));
    setNotice(next === "visible" ? "评论已通过（Showcase 模拟）。" : "评论已隐藏（Showcase 模拟）。");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const ids = deleteTarget.kind === "batch" ? selected : [deleteTarget.id];
    const count = ids.length;
    setComments((current) => current.filter((comment) => !ids.includes(comment.id)));
    setSelected((current) => current.filter((id) => !ids.includes(id)));
    setDeleteTarget(null);
    setNotice(count > 1 ? `已删除 ${count} 条评论（Showcase 模拟）。` : "评论已删除（Showcase 模拟）。");
  };

  const launchAI = () => {
    const count = selected.length;
    setAIOpen(false);
    setNotice(`已将 ${count} 条评论交给 AI 工作流（Showcase 模拟）。`);
  };

  const deleteDescription: ReactNode = deleteTarget?.kind === "batch"
    ? `确认永久删除选中的 ${selected.length} 条评论？此操作无法撤销。`
    : "确认永久删除这条评论？此操作无法撤销。";

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route="/admin/comments"
        note="保留真实审核队列、举报筛选、批量删除与 AI 工作流入口；Fixture 状态不请求真实 Blog API。"
        controls={(
          <Segmented<FixtureScenario>
            aria-label="评论页 Fixture 状态"
            options={scenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              clearSelection();
              setNotice(null);
            }}
            block
          />
        )}
      />

      <PageHeader
        title="评论"
        description="审核讨论、处理举报，并维护高质量的交流空间。"
      />

      {notice ? <Alert type="success" showIcon title={notice} closable={{ onClose: () => setNotice(null) }} /> : null}

      <Card padding="base" className="shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 sm:w-48">
            <Select
              aria-label="评论状态"
              value={status}
              onChange={(value) => updateStatus(String(value))}
            >
              <option value="pending">待审核</option>
              <option value="visible">已通过</option>
              <option value="hidden">已隐藏</option>
              <option value="all">全部</option>
            </Select>
          </div>
          <Checkbox
            label="仅看被举报"
            checked={reportedOnly}
            onChange={(event) => {
              setReportedOnly(event.target.checked);
              clearSelection();
            }}
          />
        </div>
      </Card>

      {selected.length > 0 ? (
        <Card padding="sm" className="sticky bottom-4 z-20 border-primary/30 bg-background/95 shadow-lg backdrop-blur">
          <div role="toolbar" aria-label="批量操作" className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Text size="sm" className="font-medium sm:mr-auto">已选择 {selected.length} 条评论</Text>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="small" icon={<Bot />} onClick={() => setAIOpen(true)}>交给 AI</Button>
              <Button size="small" color="error" icon={<Trash2 />} onClick={() => setDeleteTarget({ kind: "batch" })}>删除</Button>
              <Button size="small" variant="text" icon={<X />} onClick={clearSelection}>取消</Button>
            </div>
          </div>
        </Card>
      ) : null}

      {scenario === "error" ? (
        <Alert
          type="error"
          showIcon
          title="评论加载失败"
          description="无法读取当前审核队列。真实产品会保留筛选条件并允许重新请求。"
          action={<Button size="small" onClick={() => setScenario("data")}>重新载入</Button>}
        />
      ) : scenario === "loading" ? (
        <LoadingComments />
      ) : visibleComments.length === 0 ? (
        <Card padding="base">
          <Empty
            title="当前队列已经处理完毕。"
            description={reportedOnly ? "当前筛选条件下没有被举报的评论。" : "没有符合当前状态筛选的评论。"}
          />
        </Card>
      ) : (
        <div role="list" aria-label="评论审核列表" className="space-y-3">
          {visibleComments.map((comment) => (
            <Card key={comment.id} padding="base" role="listitem" className="shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3.5">
                  <div className="pt-0.5">
                    <Checkbox
                      aria-label={`选择评论 ${comment.id}`}
                      checked={selected.includes(comment.id)}
                      onChange={(event) => setSelection(comment.id, event.target.checked)}
                    />
                  </div>
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {comment.author.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-sm font-semibold text-foreground">{comment.author}</strong>
                      <time className="font-mono text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleString("zh-CN")}
                      </time>
                      <Tag color={statusColor(comment.status)}>{statusLabels[comment.status]}</Tag>
                      {comment.reportCount > 0 ? (
                        <Badge status="error" text={`被举报 ${comment.reportCount} 次`} />
                      ) : null}
                      <span className="font-mono text-xs text-muted-foreground">文章 #{comment.postId}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{comment.content}</p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 border-t border-border/60 pt-3 md:border-t-0 md:pt-0">
                  <Button
                    size="small"
                    variant="ghost"
                    icon={<Check />}
                    aria-label={`通过 ${comment.author} 的评论`}
                    onClick={() => moderate(comment, "visible")}
                  >
                    通过
                  </Button>
                  <Button
                    size="small"
                    variant="ghost"
                    icon={<EyeOff />}
                    aria-label={`隐藏 ${comment.author} 的评论`}
                    onClick={() => moderate(comment, "hidden")}
                  >
                    隐藏
                  </Button>
                  <Button
                    size="small"
                    variant="ghost"
                    color="error"
                    icon={<Trash2 />}
                    aria-label={`删除 ${comment.author} 的评论`}
                    onClick={() => setDeleteTarget({ kind: "single", id: comment.id })}
                  >
                    删除
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={deleteTarget !== null}
        title={deleteTarget?.kind === "batch" ? "批量删除评论" : "删除评论"}
        description={deleteDescription}
        onClose={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        okText="永久删除"
        okButtonProps={{ variant: "solid", color: "error" }}
      >
        <Text size="sm" tone="muted">删除后无法恢复，请确认目标评论无保留价值。</Text>
      </Modal>

      <Modal
        open={aiOpen}
        title="将所选评论交给 AI"
        description="真实产品会把所选评论作为 comment 资源传给 WorkflowLauncher。"
        onClose={() => setAIOpen(false)}
        onOk={launchAI}
        okText="启动工作流"
        okButtonProps={{ variant: "solid", color: "primary" }}
      >
        <div className="space-y-3">
          <Text size="sm" tone="muted">本次将处理 {selectedComments.length} 条评论：</Text>
          <ul className="space-y-2 text-sm">
            {selectedComments.map((comment) => (
              <li key={comment.id} className="rounded-md border bg-muted/30 px-3 py-2">
                <span className="font-medium">#{comment.id} · {comment.author}</span>
                <span className="ml-2 text-muted-foreground">文章 #{comment.postId}</span>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
