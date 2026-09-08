import {
  ChevronRight,
  GitBranch,
  Lightbulb,
  Play,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  Heading,
  Statistic,
  Tag,
  Text,
} from "../../../../src/core";
import type {
  AIOpsDecisionFixture,
  AIOpsTab,
  ApprovalFixture,
  InteractionFixture,
  OperationsFixture,
} from "./fixtures";

function approvalTitle(approval: ApprovalFixture): string {
  if (approval.actionType === "create_content_candidates") {
    return `为文章 #${approval.targetId ?? "?"} 准备${approval.proposal.field === "summary" ? "摘要" : "标题"}候选`;
  }
  if (approval.actionType === "create_media_candidate") {
    return `为${approval.targetType === "page" ? "单页" : "文章"}准备图片方案`;
  }
  return approval.proposal.title || "应用内容建议";
}

function proposalImpact(approval: ApprovalFixture): string {
  if (approval.actionType === "create_content_candidates") {
    return "批准后只会生成候选项，不会直接修改或发布文章。";
  }
  if (approval.actionType === "create_media_candidate") {
    return "批准后只会创建图片任务；真正生成图片仍需要后续确认。";
  }
  return "批准后会应用下面展示的内容建议；不会影响其他文章或站点设置。";
}

function ReadableProposal({ approval }: { approval: ApprovalFixture }) {
  const proposal = approval.proposal;
  if (approval.actionType === "create_content_candidates") {
    return (
      <Card padding="base" variant="subtle" aria-label="候选内容预览">
        <div className="flex flex-col gap-3">
          <Text size="xs" tone="muted">候选内容</Text>
          <div className="flex flex-col gap-2">
            {(proposal.suggestions ?? []).map((suggestion, index) => (
              <div key={suggestion} className="rounded-md border bg-background px-4 py-3 text-sm">
                <span className="mr-2 font-mono text-xs text-muted-foreground">{index + 1}</span>
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="base" variant="subtle" aria-label="内容提案预览">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Heading level={3}>{proposal.title || "内容提案"}</Heading>
          {proposal.summary ? <Text tone="muted">{proposal.summary}</Text> : null}
        </div>
        {proposal.content ? (
          <div className="rounded-md border bg-background p-4">
            {proposal.content.split("\n").map((line, index) => (
              line.startsWith("## ") ? (
                <h4 key={`${line}-${index}`} className="mb-2 mt-3 text-sm font-semibold first:mt-0">{line.slice(3)}</h4>
              ) : line.startsWith("- ") ? (
                <p key={`${line}-${index}`} className="pl-3 text-sm text-muted-foreground">• {line.slice(2)}</p>
              ) : line ? (
                <p key={`${line}-${index}`} className="text-sm text-muted-foreground">{line}</p>
              ) : null
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export function AIOpsOverviewPanel({
  fixture,
  onNavigate,
}: {
  fixture: AIOpsDecisionFixture;
  onNavigate: (tab: AIOpsTab) => void;
}) {
  const pendingApprovals = fixture.approvals.filter((item) => item.status === "pending" || item.status === "failed").length;
  const newSuggestions = fixture.operations.suggestions.filter((item) => item.status === "new").length;
  const pendingCandidates = fixture.operations.candidateSets.filter((item) => item.status === "pending").length;
  const readyMedia = fixture.operations.mediaCandidates.filter((item) => item.status === "ready_to_generate").length;
  const reviewCount = pendingApprovals + newSuggestions + pendingCandidates + readyMedia;

  return (
    <div className="flex flex-col gap-6" aria-label="AI 运营概览">
      <Card padding="base">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-2">
            <Heading level={2}>从一件想改善的事开始</Heading>
            <Text tone="muted">AI 会找出机会、准备建议；发布、修改和生成始终由你决定。</Text>
          </div>
          <Button variant="solid" color="primary" icon={<GitBranch />} onClick={() => onNavigate("automation")}>查看自动化</Button>
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="当前待办">
        <button type="button" className="text-left" onClick={() => onNavigate("inbox")}>
          <Card padding="base" interactive className="h-full">
            <div className="flex items-start justify-between gap-4">
              <Statistic title="待审批变更" value={pendingApprovals} />
              <ShieldCheck className="size-5 text-muted-foreground" />
            </div>
            <Text size="xs" tone="muted">项等待你的审批</Text>
          </Card>
        </button>
        <button type="button" className="text-left" onClick={() => onNavigate("inbox")}>
          <Card padding="base" interactive className="h-full">
            <div className="flex items-start justify-between gap-4">
              <Statistic title="内容建议" value={newSuggestions + pendingCandidates} />
              <Lightbulb className="size-5 text-muted-foreground" />
            </div>
            <Text size="xs" tone="muted">条待处理建议与候选</Text>
          </Card>
        </button>
        <button type="button" className="text-left" onClick={() => onNavigate("inbox")}>
          <Card padding="base" interactive className="h-full">
            <div className="flex items-start justify-between gap-4">
              <Statistic title="图片任务" value={readyMedia} />
              <Sparkles className="size-5 text-muted-foreground" />
            </div>
            <Text size="xs" tone="muted">个图片任务可继续生成</Text>
          </Card>
        </button>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card padding="none" className="overflow-hidden">
          <CardHeader className="border-b p-6">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base">下一步做什么？</CardTitle>
              <Text size="xs" tone="muted">按影响与人工决策优先级排序。</Text>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-6">
            <strong>{reviewCount ? `有 ${reviewCount} 项工作等你决定` : "当前没有需要你处理的事项"}</strong>
            <Text size="sm" tone="muted">先审阅 AI 准备好的建议；它不会自行修改博客内容。</Text>
            <div><Button icon={<ShieldCheck />} onClick={() => onNavigate("inbox")}>进入待我处理</Button></div>
          </CardContent>
        </Card>

        <Card padding="none" className="overflow-hidden">
          <CardHeader className="border-b p-6">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base">让 AI 持续帮忙</CardTitle>
              <Text size="xs" tone="muted">已启用 {fixture.enabledWorkflowCount} 个自动化流程。</Text>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-6">
            <ul className="space-y-3 text-sm">
              <li><strong>发布前检查</strong><Text size="xs" tone="muted">发现 SEO、链接和内容问题。</Text></li>
              <li><strong>旧文更新</strong><Text size="xs" tone="muted">发现需要维护的文章。</Text></li>
              <li><strong>运营周报</strong><Text size="xs" tone="muted">汇总值得关注的变化。</Text></li>
            </ul>
            <div><Button icon={<Play />} onClick={() => onNavigate("automation")}>配置自动化</Button></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InteractionQueue({
  tasks,
  onResolve,
}: {
  tasks: InteractionFixture[];
  onResolve: (task: InteractionFixture, response: unknown) => void;
}) {
  if (tasks.length === 0) return null;
  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader className="border-b p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">流程交互</CardTitle>
            <Text size="xs" tone="muted">图片选择、确认和输入都在这里处理，并回到原运行。</Text>
          </div>
          <Tag color="primary">{tasks.length}</Tag>
        </div>
      </CardHeader>
      <CardContent className="divide-y p-0">
        {tasks.map((task) => (
          <div key={task.id} className="flex flex-col gap-3 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <strong className="text-sm">{task.title}</strong>
                <Text size="xs" tone="muted">Run #{task.workflowRunId} · {task.stepId}</Text>
              </div>
              <Tag>{task.type === "choice" ? "选择项" : "确认预览"}</Tag>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.type === "choice" && task.options?.length ? task.options.map((option) => (
                <Button key={option} size="small" onClick={() => onResolve(task, { option })}>{option}</Button>
              )) : (
                <Button size="small" variant="solid" color="primary" onClick={() => onResolve(task, { confirmed: true })}>确认并继续</Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ApprovalQueue({
  approvals,
  selectedId,
  onSelect,
  onReview,
}: {
  approvals: ApprovalFixture[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onReview: (approval: ApprovalFixture, approved: boolean) => void;
}) {
  const selected = approvals.find((approval) => approval.id === selectedId) ?? approvals[0] ?? null;
  const actionable = selected?.status === "pending" || selected?.status === "failed";

  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader className="border-b p-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">需要你决定的内容变更</CardTitle>
          <Text size="xs" tone="muted">先读清楚影响，再决定是否批准。AI 不会绕过你的确认。</Text>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {approvals.length === 0 ? (
          <div className="p-6"><Empty title="当前没有待审批变更" /></div>
        ) : (
          <div className="grid min-h-96 grid-cols-1 lg:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.8fr)]">
            <div className="border-b lg:border-b-0 lg:border-r">
              {approvals.map((approval) => (
                <button
                  key={approval.id}
                  type="button"
                  className={`flex w-full items-start justify-between gap-3 border-b p-4 text-left transition-colors last:border-b-0 hover:bg-muted/40 ${selected?.id === approval.id ? "bg-muted/50" : ""}`}
                  onClick={() => onSelect(approval.id)}
                >
                  <span className="min-w-0">
                    <strong className="block text-sm">{approvalTitle(approval)}</strong>
                    <span className="text-xs text-muted-foreground">来自 AI 运行 #{approval.runId}</span>
                  </span>
                  <Tag color={approval.status === "failed" ? "error" : approval.status === "pending" ? "warning" : "default"}>
                    {approval.status === "failed" ? "执行失败" : approval.status === "pending" ? "待审批" : approval.status === "approved" ? "已批准" : "已拒绝"}
                  </Tag>
                </button>
              ))}
            </div>
            <div className="min-w-0 p-6">
              {selected ? (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <Tag color="warning">请你确认</Tag>
                    <Heading level={2}>{approvalTitle(selected)}</Heading>
                    <Text tone="muted">{proposalImpact(selected)}</Text>
                  </div>
                  {selected.status === "failed" ? (
                    <Alert
                      type="error"
                      showIcon
                      title="上次执行失败，提案未丢失"
                      description={selected.reviewNote || "未记录具体错误，请重试；若再次失败请查看服务日志。"}
                    />
                  ) : null}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Card padding="sm" variant="subtle">
                      <Text size="xs" tone="muted">批准后会发生什么</Text>
                      <strong className="mt-1 block text-sm">{approvalTitle(selected)}</strong>
                    </Card>
                    <Card padding="sm" variant="subtle">
                      <Text size="xs" tone="muted">不会发生什么</Text>
                      <strong className="mt-1 block text-sm">{selected.actionType === "create_content_candidates" ? "不会直接修改或发布文章" : "不会影响其他文章或设置"}</strong>
                    </Card>
                  </div>
                  <ReadableProposal approval={selected} />
                  <details className="rounded-md border p-4">
                    <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
                      查看技术详情
                      <ChevronRight className="size-4" />
                    </summary>
                    <pre className="mt-4 max-h-64 overflow-auto rounded-md bg-muted p-4 text-xs">{JSON.stringify(selected.proposal, null, 2)}</pre>
                  </details>
                  {actionable ? (
                    <div className="flex flex-wrap justify-end gap-2 border-t pt-5">
                      <Button icon={<X />} onClick={() => onReview(selected, false)}>拒绝此建议</Button>
                      <Button variant="solid" color="primary" icon={<ShieldCheck />} onClick={() => onReview(selected, true)}>
                        {selected.status === "failed" ? "重试批准并执行" : "批准并继续"}
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : <Empty title="选择一项查看其影响" />}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OperationsReview({
  operations,
  onOpen,
}: {
  operations: OperationsFixture;
  onOpen: (kind: keyof OperationsFixture, id: number) => void;
}) {
  const groups: Array<{
    key: keyof OperationsFixture;
    title: string;
    description: string;
    items: Array<{ id: number; title: string; status: string }>;
  }> = [
    { key: "suggestions", title: "运营建议", description: "AI 找到的内容维护机会。", items: operations.suggestions },
    { key: "candidateSets", title: "内容候选", description: "需要你选择的标题或摘要候选。", items: operations.candidateSets },
    { key: "mediaCandidates", title: "图片任务", description: "经过审批后等待生成的媒体方案。", items: operations.mediaCandidates },
    { key: "editorialTasks", title: "编辑任务", description: "需要人工复核的运营事项。", items: operations.editorialTasks },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="运营建议与候选">
      {groups.map((group) => (
        <Card key={group.key} padding="none" className="overflow-hidden">
          <CardHeader className="border-b p-6">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base">{group.title}</CardTitle>
              <Text size="xs" tone="muted">{group.description}</Text>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {group.items.length === 0 ? <div className="p-6"><Empty title={`暂无${group.title}`} /></div> : group.items.map((item) => (
              <button key={item.id} type="button" className="flex w-full items-center justify-between gap-3 border-b p-4 text-left last:border-b-0 hover:bg-muted/40" onClick={() => onOpen(group.key, item.id)}>
                <span className="min-w-0 truncate text-sm font-medium">{item.title}</span>
                <Tag>{item.status}</Tag>
              </button>
            ))}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export function AIOpsInboxPanel({
  fixture,
  selectedApprovalId,
  onSelectApproval,
  onReviewApproval,
  onResolveInteraction,
  onOpenOperation,
}: {
  fixture: AIOpsDecisionFixture;
  selectedApprovalId: number | null;
  onSelectApproval: (id: number) => void;
  onReviewApproval: (approval: ApprovalFixture, approved: boolean) => void;
  onResolveInteraction: (task: InteractionFixture, response: unknown) => void;
  onOpenOperation: (kind: keyof OperationsFixture, id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-6" aria-label="待我处理">
      <InteractionQueue tasks={fixture.interactions} onResolve={onResolveInteraction} />
      <ApprovalQueue approvals={fixture.approvals} selectedId={selectedApprovalId} onSelect={onSelectApproval} onReview={onReviewApproval} />
      <OperationsReview operations={fixture.operations} onOpen={onOpenOperation} />
    </div>
  );
}
