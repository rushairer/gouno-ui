import { useMemo, useState, type ReactNode } from "react";
import { Bell, Bot, Check, CheckCheck, ChevronRight, Filter, GitBranch, MessageSquare, Trash2 } from "lucide-react";
import {
  Alert,
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
import { BulkActionBar } from "../../../src/patterns";
import { cn } from "../../../src/lib/utils";
import { FixtureDock } from "../../components/fixture-dock";

type FixtureScenario = "data" | "loading" | "empty" | "error";
type MutationScenario = "success" | "error";
type NotificationStatus = "all" | "unread" | "read";
type NotificationTypeFilter = "all" | "ai" | "comment";
type NotificationKind = "ai_workflow_failed" | "ai_agent_warning" | "comment_reply" | "comment" | "system";
type DeleteAction =
  | { kind: "single"; id: number; title: string }
  | { kind: "batch"; ids: number[] }
  | { kind: "clear_read" }
  | { kind: "clear_all" }
  | null;
type Notice = { type: "success" | "info" | "error"; message: string } | null;

type NotificationFixture = {
  id: number;
  type: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  destination: string;
  relatedTitle?: string;
};

const initialNotifications: readonly NotificationFixture[] = [
  {
    id: 501,
    type: "ai_workflow_failed",
    title: "AI 工作流执行失败",
    body: "文章摘要工作流连续重试后仍未完成，请检查最近一次执行记录。",
    createdAt: "2026-09-08 10:08",
    readAt: null,
    destination: "/admin/ai-ops?tab=records&record=workflow",
    relatedTitle: "AI 设计系统审计",
  },
  {
    id: 502,
    type: "ai_agent_warning",
    title: "AI Agent 配额接近阈值",
    body: "本周期自动化任务已使用 86% 的预算额度。",
    createdAt: "2026-09-08 09:42",
    readAt: null,
    destination: "/admin/ai-ops?tab=records&record=agent",
  },
  {
    id: 503,
    type: "comment_reply",
    title: "新的评论回复",
    body: "Paw 回复了文章下的讨论，并提到 OAuth BFF 的会话边界。",
    createdAt: "2026-09-08 09:10",
    readAt: null,
    destination: "/articles/oauth-bff#comment-88",
    relatedTitle: "OAuth 2.0 BFF 实践",
  },
  {
    id: 504,
    type: "comment",
    title: "文章收到新评论",
    body: "有读者在 Kafka 消费模型文章下留下了新的问题。",
    createdAt: "2026-09-07 22:30",
    readAt: "2026-09-08 08:00",
    destination: "/admin/comments",
    relatedTitle: "Kafka 消费者背压设计",
  },
  {
    id: 505,
    type: "system",
    title: "站点证书轮换完成",
    body: "边缘节点证书已经完成轮换，当前无需人工操作。",
    createdAt: "2026-09-07 20:15",
    readAt: "2026-09-07 20:20",
    destination: "/admin/settings",
  },
];

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "错误" },
] as const;

const mutationOptions = [
  { value: "success", label: "写操作成功" },
  { value: "error", label: "写操作失败" },
] as const;

function resolvePresentation(item: NotificationFixture) {
  if (item.type === "ai_workflow_failed") {
    return {
      icon: <GitBranch />,
      tag: "Workflow 告警",
      color: "warning" as const,
      iconClass: "bg-warning-subtle text-warning",
    };
  }
  if (item.type.startsWith("ai_")) {
    return {
      icon: <Bot />,
      tag: "AI 运营告警",
      color: "warning" as const,
      iconClass: "bg-warning-subtle text-warning",
    };
  }
  if (item.type === "comment_reply" || item.type === "comment") {
    return {
      icon: <MessageSquare />,
      tag: "评论互动",
      color: "primary" as const,
      iconClass: "bg-accent text-accent-foreground",
    };
  }
  return {
    icon: <Bell />,
    tag: "系统通知",
    color: "info" as const,
    iconClass: "bg-info-subtle text-info",
  };
}

function LoadingNotifications() {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="通知加载中" aria-live="polite">
      <Text size="sm" tone="muted">正在加载通知…</Text>
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index} padding="base">
          <div className="flex items-start gap-4">
            <Skeleton className="size-4" />
            <Skeleton className="size-9 rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function BlogAdminNotificationsDemo() {
  const [items, setItems] = useState<NotificationFixture[]>(() => [...initialNotifications]);
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [mutation, setMutation] = useState<MutationScenario>("success");
  const [selected, setSelected] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<NotificationStatus>("all");
  const [typeFilter, setTypeFilter] = useState<NotificationTypeFilter>("all");
  const [deleteAction, setDeleteAction] = useState<DeleteAction>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const sourceItems = scenario === "empty" ? [] : items;
  const filtered = useMemo(() => sourceItems.filter((item) => {
    if (statusFilter === "unread" && item.readAt) return false;
    if (statusFilter === "read" && !item.readAt) return false;
    const isAI = item.type.startsWith("ai_");
    const isComment = item.type === "comment" || item.type === "comment_reply";
    if (typeFilter === "ai" && !isAI) return false;
    if (typeFilter === "comment" && !isComment) return false;
    return true;
  }), [sourceItems, statusFilter, typeFilter]);

  const unreadCount = items.filter((item) => !item.readAt).length;
  const readCount = items.length - unreadCount;
  const allFilteredSelected = filtered.length > 0 && filtered.every((item) => selected.includes(item.id));
  const hasFilters = statusFilter !== "all" || typeFilter !== "all";

  const markOneRead = (id: number) => {
    if (mutation === "error") {
      setNotice({ type: "error", message: "标记通知为已读失败；该通知仍保持未读，可稍后重试（Showcase 模拟）。" });
      return;
    }
    setItems((current) => current.map((item) => item.id === id && !item.readAt
      ? { ...item, readAt: "2026-09-08 10:31" }
      : item));
    setNotice({ type: "success", message: "通知已标记为已读（Showcase 模拟）。" });
  };

  const markAllRead = () => {
    if (mutation === "error") {
      setNotice({ type: "error", message: "全部标为已读失败；通知读取状态保持不变（Showcase 模拟）。" });
      return;
    }
    setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt || "2026-09-08 10:31" })));
    setNotice({ type: "success", message: "全部通知已标记为已读（Showcase 模拟）。" });
  };

  const markSelectedRead = () => {
    const count = selected.length;
    if (mutation === "error") {
      setNotice({ type: "error", message: "批量标记已读失败；通知状态与当前选择保持不变（Showcase 模拟）。" });
      return;
    }
    setItems((current) => current.map((item) => selected.includes(item.id)
      ? { ...item, readAt: item.readAt || "2026-09-08 10:31" }
      : item));
    setSelected([]);
    setNotice({ type: "success", message: `已将选中的 ${count} 条通知标为已读（Showcase 模拟）。` });
  };

  const toggleSelectAllFiltered = (checked: boolean) => {
    const filteredIds = filtered.map((item) => item.id);
    setSelected((current) => checked
      ? [...new Set([...current, ...filteredIds])]
      : current.filter((id) => !filteredIds.includes(id)));
  };

  const executeDelete = () => {
    if (!deleteAction) return;

    if (mutation === "error") {
      setNotice({ type: "error", message: "通知删除/清理失败；列表和当前选择保持不变，可重新发起操作（Showcase 模拟）。" });
      setDeleteAction(null);
      return;
    }

    if (deleteAction.kind === "single") {
      setItems((current) => current.filter((item) => item.id !== deleteAction.id));
      setSelected((current) => current.filter((id) => id !== deleteAction.id));
      setNotice({ type: "success", message: "通知已删除（Showcase 模拟）。" });
    } else if (deleteAction.kind === "batch") {
      const ids = new Set(deleteAction.ids);
      setItems((current) => current.filter((item) => !ids.has(item.id)));
      setSelected([]);
      setNotice({ type: "success", message: `已删除选中的 ${deleteAction.ids.length} 条通知（Showcase 模拟）。` });
    } else if (deleteAction.kind === "clear_read") {
      setItems((current) => current.filter((item) => !item.readAt));
      setSelected((current) => current.filter((id) => items.some((item) => item.id === id && !item.readAt)));
      setNotice({ type: "success", message: `已清空 ${readCount} 条已读通知（Showcase 模拟）。` });
    } else {
      setItems([]);
      setSelected([]);
      setNotice({ type: "success", message: "已清空全部通知（Showcase 模拟）。" });
    }

    setDeleteAction(null);
  };

  const confirmTitle = deleteAction?.kind === "single"
    ? "删除通知"
    : deleteAction?.kind === "batch"
      ? `批量删除 ${deleteAction.ids.length} 条通知`
      : deleteAction?.kind === "clear_read"
        ? "清空已读通知"
        : "清空全部通知";

  const confirmDescription: ReactNode = deleteAction?.kind === "single"
    ? `确定要删除“${deleteAction.title}”吗？删除后无法恢复。`
    : deleteAction?.kind === "batch"
      ? `确定要永久删除已选中的 ${deleteAction.ids.length} 条通知吗？`
      : deleteAction?.kind === "clear_read"
        ? `确定要清空所有已读通知（共 ${readCount} 条）吗？未读通知将继续保留。`
        : "确定要清空所有通知记录吗？包括未读和已读通知。";

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route="/admin/notifications"
        note="保留真实通知筛选、已读状态机、批量管理、全局清理及写操作失败后的状态保留语义；Fixture 不请求 notifications API。"
        controls={(
          <div className="flex flex-col gap-3">
            <Segmented<FixtureScenario>
              aria-label="通知页 Fixture 状态"
              options={scenarioOptions}
              value={scenario}
              onChange={(value) => {
                setScenario(value);
                setSelected([]);
                setNotice(null);
                setDeleteAction(null);
              }}
              block
            />
            <Segmented<MutationScenario>
              aria-label="通知写操作场景"
              options={mutationOptions}
              value={mutation}
              onChange={(value) => {
                setMutation(value);
                setNotice(null);
                setDeleteAction(null);
              }}
              block
            />
          </div>
        )}
      />

      <PageHeader
        title="通知中心"
        description="查看系统告警、AI 自动化异常与站点互动通知，并支持批量管理与清理。"
        actions={items.length > 0 ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {unreadCount > 0 ? (
              <Button size="small" icon={<CheckCheck />} onClick={markAllRead}>全部标为已读</Button>
            ) : null}
            {readCount > 0 ? (
              <Button size="small" icon={<Trash2 />} onClick={() => setDeleteAction({ kind: "clear_read" })}>清空已读</Button>
            ) : null}
            <Button size="small" color="error" icon={<Trash2 />} onClick={() => setDeleteAction({ kind: "clear_all" })}>
              清空全部
            </Button>
          </div>
        ) : undefined}
      />

      {notice ? (
        <Alert type={notice.type} showIcon title={notice.message} closable={{ onClose: () => setNotice(null) }} />
      ) : null}

      <Card padding="base">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Filter className="size-3.5" />
              <span>筛选</span>
            </div>
            <div className="w-44">
              <Select
                aria-label="通知状态筛选"
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(String(value) as NotificationStatus);
                  setSelected([]);
                }}
              >
                <option value="all">全部状态 ({items.length})</option>
                <option value="unread">未读通知 ({unreadCount})</option>
                <option value="read">已读通知 ({readCount})</option>
              </Select>
            </div>
            <div className="w-40">
              <Select
                aria-label="通知类型筛选"
                value={typeFilter}
                onChange={(value) => {
                  setTypeFilter(String(value) as NotificationTypeFilter);
                  setSelected([]);
                }}
              >
                <option value="all">全部类型</option>
                <option value="ai">AI 运营告警</option>
                <option value="comment">互动与评论</option>
              </Select>
            </div>
            {hasFilters ? (
              <Button
                size="small"
                variant="text"
                onClick={() => {
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setSelected([]);
                }}
              >
                清除筛选
              </Button>
            ) : null}
          </div>

          {filtered.length > 0 && scenario === "data" ? (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Checkbox
                aria-label="全选当前通知列表"
                checked={allFilteredSelected}
                onChange={(event) => toggleSelectAllFiltered(event.target.checked)}
              />
              <span>全选当前列表 ({filtered.length})</span>
            </label>
          ) : null}
        </div>
      </Card>

      {selected.length > 0 ? (
        <BulkActionBar selectionLabel={`已选择 ${selected.length} 条通知`} onCancel={() => setSelected([])}>
          <Button size="small" icon={<Check />} onClick={markSelectedRead}>标为已读</Button>
          <Button size="small" color="error" icon={<Trash2 />} onClick={() => setDeleteAction({ kind: "batch", ids: [...selected] })}>
            批量删除
          </Button>
        </BulkActionBar>
      ) : null}

      {scenario === "error" ? (
        <Alert
          type="error"
          showIcon
          title="通知加载失败"
          description="无法读取通知列表。真实产品会保留页面筛选上下文并允许重新请求。"
          action={<Button size="small" onClick={() => setScenario("data")}>重新载入</Button>}
        />
      ) : scenario === "loading" ? (
        <LoadingNotifications />
      ) : filtered.length === 0 ? (
        <Card padding="lg">
          <Empty
            icon={<Bell className="size-7 text-muted-foreground" />}
            title={hasFilters ? "暂无符合当前筛选条件的通知。" : "暂无相关通知记录。"}
            description={hasFilters ? "调整状态或类型筛选后重试。" : "系统告警、AI 异常和互动提醒会出现在这里。"}
            action={hasFilters ? (
              <Button onClick={() => { setStatusFilter("all"); setTypeFilter("all"); }}>
                清除筛选
              </Button>
            ) : undefined}
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3" role="list" aria-label="通知列表">
          {filtered.map((item) => {
            const presentation = resolvePresentation(item);
            const unread = !item.readAt;
            const checked = selected.includes(item.id);
            return (
              <Card
                key={item.id}
                padding="base"
                role="listitem"
                className={cn(
                  "transition-colors",
                  unread ? "border-primary/40" : "border-border/60 bg-card/70",
                  checked && "bg-accent/20",
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <Checkbox
                      aria-label={`选择通知 ${item.title}`}
                      checked={checked}
                      onChange={(event) => setSelected((current) => event.target.checked
                        ? [...current, item.id]
                        : current.filter((id) => id !== item.id))}
                    />
                    <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4", presentation.iconClass)}>
                      {presentation.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-sm font-semibold text-foreground">{item.title}</strong>
                        <Tag color={presentation.color}>{presentation.tag}</Tag>
                        {unread ? <span className="size-2 rounded-full bg-primary" aria-label="未读" /> : null}
                        <time className="font-mono text-xs text-muted-foreground">{item.createdAt}</time>
                      </div>
                      <Text size="xs" tone="muted" className="mt-1 line-clamp-2 leading-relaxed">{item.body}</Text>
                      {item.relatedTitle ? <Text size="xs" tone="muted" className="mt-1">关联内容：{item.relatedTitle}</Text> : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                    {unread ? <Button size="small" onClick={() => markOneRead(item.id)}>标为已读</Button> : null}
                    <Button
                      size="small"
                      variant="text"
                      icon={<ChevronRight />}
                      iconPlacement="end"
                      onClick={() => {
                        if (unread) markOneRead(item.id);
                        setNotice({ type: "info", message: `前往 ${item.destination}（Showcase 模拟）。` });
                      }}
                    >
                      前往处理
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      color="error"
                      icon={<Trash2 />}
                      aria-label={`删除通知 ${item.title}`}
                      onClick={() => setDeleteAction({ kind: "single", id: item.id, title: item.title })}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={deleteAction !== null}
        title={confirmTitle}
        description={confirmDescription}
        onClose={() => setDeleteAction(null)}
        onOk={executeDelete}
        okText={deleteAction?.kind === "clear_all" || deleteAction?.kind === "clear_read" ? "确认清空" : "确认删除"}
        okButtonProps={{ variant: "solid", color: "error" }}
      >
        <Text size="sm" tone="muted">这是静态 Showcase fixture；确认后只更新当前预览数据。</Text>
      </Modal>
    </div>
  );
}
