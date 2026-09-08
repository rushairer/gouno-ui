import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCheck,
  Edit2,
  ExternalLink,
  Eye,
  FileText,
  GitBranch,
  Heart,
  MessageSquare,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  IconButton,
  Segmented,
  Skeleton,
  Statistic,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "../../../src/core";
import { PageHeader } from "../../../src/gouno";
import { FixtureDock } from "../../components/fixture-dock";

type FixtureScenario = "data" | "loading" | "empty" | "error";
type CapabilityScenario = "admin" | "moderator" | "viewer";

type TopPostFixture = {
  id: number;
  title: string;
  slug: string;
  views: number;
  likes: number;
  editable: boolean;
};

type AIAlertFixture = {
  id: number;
  type: "agent" | "workflow";
  title: string;
  body: string;
  createdAt: string;
  destination: string;
};

type DashboardSummary = {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  pendingComments: number;
  reportedItems: number;
  dailyEvents: Array<{ date: string; count: number }>;
  topPosts: TopPostFixture[];
  aiAlerts: AIAlertFixture[];
};

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空数据" },
  { value: "error", label: "错误" },
] as const;

const capabilityOptions = [
  { value: "admin", label: "管理员" },
  { value: "moderator", label: "审核员" },
  { value: "viewer", label: "只读" },
] as const;

const fullSummary: DashboardSummary = {
  totalPosts: 86,
  publishedPosts: 72,
  totalViews: 128430,
  totalLikes: 3842,
  totalComments: 1268,
  pendingComments: 7,
  reportedItems: 2,
  dailyEvents: [
    { date: "08-10", count: 2860 },
    { date: "08-11", count: 3120 },
    { date: "08-12", count: 2780 },
    { date: "08-13", count: 3560 },
    { date: "08-14", count: 4210 },
    { date: "08-15", count: 3920 },
    { date: "08-16", count: 4680 },
    { date: "08-17", count: 5120 },
    { date: "08-18", count: 4380 },
    { date: "08-19", count: 5260 },
    { date: "08-20", count: 5880 },
    { date: "08-21", count: 5460 },
    { date: "08-22", count: 6210 },
    { date: "08-23", count: 6940 },
  ],
  topPosts: [
    { id: 101, title: "OAuth 2.0 BFF：浏览器为什么不该持有 Token", slug: "oauth-bff-browser-session", views: 28640, likes: 812, editable: true },
    { id: 102, title: "Golang 分布式任务系统：从 Task 到 Worker 的完整交互", slug: "golang-distributed-task-flow", views: 21480, likes: 604, editable: true },
    { id: 103, title: "Kafka 消费者背压：为什么 goroutine 越多反而越慢", slug: "kafka-consumer-backpressure", views: 18320, likes: 487, editable: false },
    { id: 104, title: "从组件库到产品：Design System 的真实验证路径", slug: "design-system-product-validation", views: 15190, likes: 402, editable: true },
  ],
  aiAlerts: [
    {
      id: 801,
      type: "workflow",
      title: "AI 每日资讯",
      body: "Agent run 241 failed：provider timeout after 45s",
      createdAt: "2026-09-08 09:38",
      destination: "/admin/ai-ops?tab=records&record=workflow&run=241",
    },
    {
      id: 802,
      type: "agent",
      title: "文章 SEO Reviewer",
      body: "Structured output validation failed at step 3",
      createdAt: "2026-09-08 08:52",
      destination: "/admin/ai-ops?tab=records&record=agent&run=238",
    },
  ],
};

const emptySummary: DashboardSummary = {
  totalPosts: 0,
  publishedPosts: 0,
  totalViews: 0,
  totalLikes: 0,
  totalComments: 0,
  pendingComments: 0,
  reportedItems: 0,
  dailyEvents: [],
  topPosts: [],
  aiAlerts: [],
};

function MetricCard({
  icon,
  title,
  value,
  detail,
  route,
  onNavigate,
}: {
  icon: ReactNode;
  title: string;
  value: ReactNode;
  detail: ReactNode;
  route?: string;
  onNavigate: (route: string) => void;
}) {
  const content = (
    <Card padding="base" interactive={Boolean(route)} className="h-full">
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <Statistic title={title} value={value} />
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
            {icon}
          </span>
        </div>
        <div className="mt-auto text-xs text-muted-foreground">{detail}</div>
      </div>
    </Card>
  );

  if (!route) return content;
  return (
    <button type="button" className="block h-full w-full text-left" onClick={() => onNavigate(route)}>
      {content}
    </button>
  );
}

function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="数据概览加载中" aria-live="polite">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} padding="base">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-36" />
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card padding="base" className="lg:col-span-2"><Skeleton className="h-64 w-full" /></Card>
        <Card padding="base"><Skeleton className="h-64 w-full" /></Card>
      </div>
      <Card padding="base"><Skeleton className="h-56 w-full" /></Card>
    </div>
  );
}

export function BlogAdminDashboardDemo() {
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [capability, setCapability] = useState<CapabilityScenario>("admin");
  const [alerts, setAlerts] = useState<AIAlertFixture[]>(() => [...fullSummary.aiAlerts]);
  const [notice, setNotice] = useState<string | null>(null);

  const summary = scenario === "empty" ? emptySummary : { ...fullSummary, aiAlerts: alerts };
  const canCreatePost = capability === "admin";
  const canModerate = capability !== "viewer";
  const canManageAI = capability === "admin";
  const canViewPosts = true;
  const drafts = Math.max(0, summary.totalPosts - summary.publishedPosts);
  const maxTraffic = Math.max(1, ...summary.dailyEvents.map((item) => item.count));
  const trafficTotal = useMemo(
    () => summary.dailyEvents.reduce((total, item) => total + item.count, 0),
    [summary.dailyEvents],
  );

  const navigate = (route: string) => setNotice(`将进入 ${route}（Showcase 模拟）。`);

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route="/admin/dashboard"
        note="保留真实指标、30 天趋势、治理健康度、AI 失败提醒和 Top Posts；Fixture 不请求 analytics/notifications API。"
        controls={(
          <div className="flex flex-col gap-3">
            <Segmented<FixtureScenario>
              aria-label="Dashboard Fixture 状态"
              options={scenarioOptions}
              value={scenario}
              onChange={(value) => {
                setScenario(value);
                setNotice(null);
                if (value === "data") setAlerts([...fullSummary.aiAlerts]);
              }}
              block
            />
            <Segmented<CapabilityScenario>
              aria-label="Dashboard 权限场景"
              options={capabilityOptions}
              value={capability}
              onChange={(value) => {
                setCapability(value);
                setNotice(null);
              }}
              block
            />
          </div>
        )}
      />

      <PageHeader
        title="数据概览"
        description="了解站点整体运营情况，掌握内容表现与用户互动。"
        actions={canCreatePost ? (
          <Button variant="solid" color="primary" icon={<Plus />} onClick={() => navigate("/admin/posts/new")}>新建文章</Button>
        ) : canModerate ? (
          <Button variant="solid" color="primary" icon={<MessageSquare />} onClick={() => navigate("/admin/comments?status=pending")}>审核评论</Button>
        ) : null}
      />

      {notice ? <Alert type="info" showIcon title={notice} closable={{ onClose: () => setNotice(null) }} /> : null}

      {scenario === "error" ? (
        <Alert
          type="error"
          showIcon
          title="数据概览加载失败"
          description="无法读取站点运营汇总。真实产品会保留 Admin Shell 并允许重新请求。"
          action={<Button size="small" onClick={() => setScenario("data")}>重新载入</Button>}
        />
      ) : scenario === "loading" ? (
        <DashboardLoading />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={<FileText className="size-4" />}
              title="文章总数"
              value={summary.totalPosts.toLocaleString()}
              detail={<span>已发布 {summary.publishedPosts} · 草稿 {drafts}</span>}
              route={canViewPosts ? "/admin/posts" : undefined}
              onNavigate={navigate}
            />
            <MetricCard
              icon={<Eye className="size-4" />}
              title="总阅读量"
              value={summary.totalViews.toLocaleString()}
              detail="全站累计公开阅读次数"
              route={canViewPosts ? "/admin/posts?status=published" : undefined}
              onNavigate={navigate}
            />
            <MetricCard
              icon={<Heart className="size-4" />}
              title="总获赞数"
              value={summary.totalLikes.toLocaleString()}
              detail="读者正向互动累计"
              route={canViewPosts ? "/admin/posts" : undefined}
              onNavigate={navigate}
            />
            <MetricCard
              icon={<MessageSquare className="size-4" />}
              title="评论互动"
              value={summary.totalComments.toLocaleString()}
              detail={summary.pendingComments > 0 ? `待审核 ${summary.pendingComments} 条` : "全站互动良好"}
              route={canModerate ? "/admin/comments?status=pending" : "/admin/media"}
              onNavigate={navigate}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card padding="none" className="lg:col-span-2 overflow-hidden">
              <CardHeader className="border-b p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <TrendingUp className="size-4 text-primary" />
                      30 天访问趋势
                    </CardTitle>
                    <Text size="xs" tone="muted">每日页面访问量分布 · 当前 Fixture 展示最近 14 个采样日</Text>
                  </div>
                  <Badge tone="brand" pill>{trafficTotal.toLocaleString()} 次访问</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {summary.dailyEvents.length === 0 ? (
                  <Empty title="暂无访问趋势" description="产生公开页面访问后，这里会显示最近 30 天趋势。" />
                ) : (
                  <div className="flex h-56 items-end gap-1.5 sm:gap-2" role="img" aria-label="最近 30 天访问趋势">
                    {summary.dailyEvents.map((item) => {
                      const height = Math.max(6, Math.round((item.count / maxTraffic) * 100));
                      return (
                        <div key={item.date} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2" title={`${item.date}: ${item.count} 次访问`}>
                          <div className="w-full rounded-t-sm bg-primary/65 transition-opacity hover:bg-primary" style={{ height: `${height}%` }} />
                          <span className="hidden truncate text-[10px] text-muted-foreground sm:block">{item.date.slice(-2)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card padding="none" className="overflow-hidden">
              <CardHeader className="border-b p-6">
                <CardTitle className="text-base">内容治理与指标</CardTitle>
                <Text size="xs" tone="muted">关键待办事项与健康指标</Text>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 p-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <Text size="xs" tone="muted">待审核评论</Text>
                    <div className="mt-1 text-xl font-semibold">{summary.pendingComments}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <Text size="xs" tone="muted">被举报内容</Text>
                    <div className="mt-1 text-xl font-semibold">{summary.reportedItems}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <Text size="xs" tone="muted">已发布文章</Text>
                    <div className="mt-1 text-xl font-semibold">{summary.publishedPosts}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <Text size="xs" tone="muted">草稿待发布</Text>
                    <div className="mt-1 text-xl font-semibold">{drafts}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 border-t pt-4">
                  <Text size="xs" tone="muted">系统状态正常</Text>
                  <Button size="small" variant="text" onClick={() => navigate("/admin/posts")}>文章管理</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {canManageAI && summary.aiAlerts.length > 0 ? (
            <Card padding="none" className="overflow-hidden border-warning/40">
              <CardHeader className="border-b p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <AlertTriangle className="size-4 text-warning" />
                      AI 运营提醒
                    </CardTitle>
                    <Text size="xs" tone="muted">需要关注的 Agent / Workflow 执行失败记录。</Text>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="small" icon={<CheckCheck />} onClick={() => {
                      setAlerts([]);
                      setNotice("AI 运营提醒已全部标记为已读（Showcase 模拟）。");
                    }}>全部已读</Button>
                    <Button size="small" variant="text" onClick={() => navigate("/admin/ai-ops?tab=records")}>查看全部记录</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="divide-y p-0">
                {summary.aiAlerts.map((alert) => {
                  const workflow = alert.type === "workflow";
                  return (
                    <button
                      key={alert.id}
                      type="button"
                      className="flex w-full items-start justify-between gap-4 p-4 text-left transition-colors hover:bg-muted/40 sm:p-6"
                      onClick={() => navigate(alert.destination)}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground">
                          {workflow ? <GitBranch className="size-4" /> : <Bot className="size-4" />}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <strong className="text-sm">{workflow ? "Workflow 执行失败" : "Agent 执行失败"}</strong>
                            <span className="text-xs font-medium text-warning">{alert.title}</span>
                          </div>
                          <Text size="xs" tone="muted" className="mt-1 line-clamp-1">失败原因：{alert.body}</Text>
                          <time className="mt-1 block text-[11px] text-muted-foreground">{alert.createdAt}</time>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-primary">查看失败详情</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          ) : null}

          <Card padding="none" className="overflow-hidden">
            <CardHeader className="border-b p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base">表现最佳文章</CardTitle>
                  <Text size="xs" tone="muted">按全站阅读量与点赞数排序的热门内容</Text>
                </div>
                <Button size="small" variant="text" onClick={() => navigate("/admin/posts")}>查看全部文章</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {summary.topPosts.length === 0 ? (
                <div className="p-6">
                  <Empty title="暂无表现数据" description="发布文章并产生阅读后，这里会出现热门内容排行。" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">排名</TableHead>
                      <TableHead>文章标题</TableHead>
                      <TableHead className="w-28 text-right">阅读量</TableHead>
                      <TableHead className="w-28 text-right">点赞数</TableHead>
                      <TableHead className="w-28 text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.topPosts.map((post, index) => (
                      <TableRow key={post.id}>
                        <TableCell className="text-center font-mono text-xs text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-muted-foreground">{post.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-muted-foreground">{post.likes.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex min-w-max flex-nowrap items-center justify-end gap-1">
                            <IconButton
                              size="small"
                              variant="ghost"
                              icon={<Edit2 />}
                              aria-label={`${post.editable ? "编辑" : "查看"}文章 ${post.title}`}
                              onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                            />
                            <IconButton
                              size="small"
                              variant="ghost"
                              icon={<ExternalLink />}
                              aria-label={`打开前台文章 ${post.title}`}
                              onClick={() => navigate(`/articles/${post.slug || post.id}`)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
