import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  GitBranch,
  Image,
  Lightbulb,
  Play,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  Alert,
  Button,
  Empty,
  Heading,
  Tag,
  Text,
} from "../../../../../../src/core";
import type {
  AIOpsDecisionFixture,
  AIOpsTab,
  ApprovalFixture,
  CandidateSetFixture,
  EditorialTaskFixture,
  InteractionFixture,
  MediaCandidateFixture,
  OperationsFixture,
  SuggestionFixture,
} from "./fixtures";
import type {
  AIOpsAutomationRecordsFixture,
  WorkflowRunStatus,
} from "./automation-records-fixtures";
import { TabPanelLead } from "../../../../../components/tab-panel-lead";
import {
  OpsMeta,
  OpsObjectRow,
  OpsRegionHeading,
  OpsSummaryStrip,
} from "./canonical-patterns";

type DecisionKind =
  | "interaction"
  | "approval"
  | "suggestion"
  | "candidate"
  | "media"
  | "editorial";
type DecisionFilter = "all" | "approval" | "choice" | "operation" | "follow-up";

type DecisionItem = {
  key: string;
  kind: DecisionKind;
  id: number;
  title: string;
  status: string;
  createdAt: string;
  meta: string;
  summary: string;
  payload:
    | InteractionFixture
    | ApprovalFixture
    | SuggestionFixture
    | CandidateSetFixture
    | MediaCandidateFixture
    | EditorialTaskFixture;
};

function runStatus(status: WorkflowRunStatus) {
  if (status === "failed") return <Tag color="error">失败</Tag>;
  if (status === "waiting_for_user") return <Tag color="warning">等待用户</Tag>;
  if (status === "awaiting_approval")
    return <Tag color="warning">等待审批</Tag>;
  if (status === "running") return <Tag color="primary">运行中</Tag>;
  if (status === "queued") return <Tag>已排队</Tag>;
  if (status === "cancelled") return <Tag>已取消</Tag>;
  return <Tag color="success">成功</Tag>;
}

function approvalTitle(approval: ApprovalFixture): string {
  if (approval.actionType === "create_content_candidates") {
    return `为${approval.targetLabel || `文章 #${approval.targetId ?? "?"}`}准备${approval.proposal.field === "summary" ? "摘要" : "标题"}候选`;
  }
  if (approval.actionType === "create_media_candidate") {
    return `为${approval.targetLabel || (approval.targetType === "page" ? "单页" : "文章")}准备图片方案`;
  }
  return approval.proposal.title || "应用内容建议";
}

function approvalImpact(approval: ApprovalFixture): {
  happens: string;
  safe: string;
} {
  if (approval.actionType === "create_content_candidates") {
    return {
      happens: "生成一组可选择的内容候选，后续仍会形成明确的内容变更审批。",
      safe: "不会直接修改或发布文章。",
    };
  }
  if (approval.actionType === "create_media_candidate") {
    return {
      happens: "创建媒体任务并回到所属 Run 继续生成、选择和预览。",
      safe: "不会跳过人工选择，也不会自动应用到文章。",
    };
  }
  return {
    happens: "应用当前展示的内容建议。",
    safe: "不会影响其他文章或站点设置。",
  };
}

function interactionLabel(task: InteractionFixture) {
  if (task.type === "choice") return "需要选择";
  if (task.type === "input") return "需要输入";
  if (task.type === "preview_confirm") return "需要确认";
  return "需要审批";
}

function buildDecisionItems(fixture: AIOpsDecisionFixture): DecisionItem[] {
  const items: DecisionItem[] = [];
  fixture.interactions.forEach((task) =>
    items.push({
      key: `interaction-${task.id}`,
      kind: "interaction",
      id: task.id,
      title: task.title,
      status: interactionLabel(task),
      createdAt: task.createdAt || "",
      meta: `${task.workflowName || "Workflow"} · Run #${task.workflowRunId}${task.targetLabel ? ` · ${task.targetLabel}` : ""}`,
      summary: task.reason || "当前 Run 需要人工输入后才能继续。",
      payload: task,
    }),
  );
  fixture.approvals
    .filter((item) => item.status === "pending" || item.status === "failed")
    .forEach((approval) =>
      items.push({
        key: `approval-${approval.id}`,
        kind: "approval",
        id: approval.id,
        title: approvalTitle(approval),
        status: approval.status === "failed" ? "执行失败" : "待审批",
        createdAt: approval.createdAt || "",
        meta: `Agent Run #${approval.runId}${approval.targetLabel ? ` · ${approval.targetLabel}` : ""}`,
        summary:
          approval.status === "failed"
            ? approval.reviewNote || "上次批准后的执行失败，提案仍然保留。"
            : "需要确认 AI 准备的变更及其影响范围。",
        payload: approval,
      }),
    );
  fixture.operations.suggestions
    .filter((item) => item.status === "new")
    .forEach((item) =>
      items.push({
        key: `suggestion-${item.id}`,
        kind: "suggestion",
        id: item.id,
        title: item.title,
        status:
          item.priority === "high"
            ? "优先处理"
            : item.priority === "medium"
              ? "建议查看"
              : "可稍后",
        createdAt: item.createdAt,
        meta: `${item.sourceLabel}${item.targetLabel ? ` · ${item.targetLabel}` : ""}`,
        summary: item.description,
        payload: item,
      }),
    );
  fixture.operations.candidateSets
    .filter((item) => item.status === "pending")
    .forEach((item) =>
      items.push({
        key: `candidate-${item.id}`,
        kind: "candidate",
        id: item.id,
        title: item.title,
        status: "需要选择",
        createdAt: item.createdAt,
        meta: `Run #${item.sourceRunId} · 文章 #${item.postId}`,
        summary: `${item.candidates.length} 个候选；选择后只会创建下一步内容变更审批。`,
        payload: item,
      }),
    );
  fixture.operations.mediaCandidates
    .filter((item) =>
      ["brief_ready", "ready_to_generate", "failed"].includes(item.status),
    )
    .forEach((item) =>
      items.push({
        key: `media-${item.id}`,
        kind: "media",
        id: item.id,
        title: item.title,
        status:
          item.status === "failed"
            ? "生成失败"
            : item.status === "brief_ready"
              ? "待审核"
              : "可生成",
        createdAt: item.createdAt,
        meta: `${item.workflowRunId ? `Run #${item.workflowRunId} · ` : ""}文章 #${item.postId} · ${item.placement === "cover" ? "封面" : "正文插图"}`,
        summary: item.errorMessage || item.brief,
        payload: item,
      }),
    );
  fixture.operations.editorialTasks
    .filter((item) => item.status === "open")
    .forEach((item) =>
      items.push({
        key: `editorial-${item.id}`,
        kind: "editorial",
        id: item.id,
        title: item.title,
        status: "待跟进",
        createdAt: item.createdAt,
        meta: item.sourceLabel,
        summary: item.description,
        payload: item,
      }),
    );
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function decisionStatus(item: DecisionItem) {
  if (item.status.includes("失败"))
    return <Tag color="error">{item.status}</Tag>;
  if (
    ["待审批", "需要选择", "需要输入", "需要确认", "待审核"].includes(
      item.status,
    )
  )
    return <Tag color="warning">{item.status}</Tag>;
  if (item.status === "可生成") return <Tag color="primary">{item.status}</Tag>;
  return <Tag>{item.status}</Tag>;
}

export function AIOpsOverviewPanel({
  fixture,
  automation,
  onNavigate,
}: {
  fixture: AIOpsDecisionFixture;
  automation?: AIOpsAutomationRecordsFixture;
  onNavigate: (tab: AIOpsTab) => void;
}) {
  const decisions = buildDecisionItems(fixture);
  const runs = automation?.workflowRuns || [];
  const activeRuns = runs.filter((run) =>
    ["queued", "running"].includes(run.status),
  ).length;
  const failedRuns = runs.filter((run) => run.status === "failed").length;
  const waitingRuns = runs.filter((run) =>
    ["waiting_for_user", "awaiting_approval"].includes(run.status),
  ).length;
  const tokenUsage = runs.reduce((total, run) => total + run.tokenUsage, 0);
  const attentionRuns = runs
    .filter((run) =>
      ["failed", "waiting_for_user", "awaiting_approval"].includes(run.status),
    )
    .slice(0, 4);
  const workflows = automation?.workflows || [];

  return (
    <div className="flex flex-col gap-6" aria-label="AI 运营概览">
      <TabPanelLead
        description="先处理失败与等待人工的运行，再决定建议、候选和后续编辑任务；AI 不会绕过人工边界直接发布内容。"
        actions={
          <>
            <Button
              variant="outline"
              icon={<ShieldCheck />}
              onClick={() => onNavigate("inbox")}
            >
              待我处理 {decisions.length}
            </Button>
            <Button
              variant="solid"
              color="primary"
              icon={<GitBranch />}
              onClick={() => onNavigate("automation")}
            >
              查看自动化
            </Button>
          </>
        }
      />

      <OpsSummaryStrip
        ariaLabel="AI 运营健康度"
        items={[
          { label: "执行中", value: activeRuns, detail: "queued / running" },
          {
            label: "失败运行",
            value: failedRuns,
            detail: failedRuns ? "优先查看失败证据" : "暂无失败",
          },
          {
            label: "等待人工",
            value: waitingRuns + decisions.length,
            detail: `${decisions.length} 项在决策队列`,
          },
          {
            label: "Fixture Token",
            value: tokenUsage.toLocaleString(),
            detail: "当前示例 Run 合计",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <section
          className="overflow-hidden rounded-lg border bg-background"
          aria-label="需要关注"
        >
          <div className="border-b px-5 py-4">
            <OpsRegionHeading
              title="需要关注"
              description="失败、等待审批和等待输入的 Run 优先于普通成功记录。"
              action={
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => onNavigate("records")}
                >
                  进入运行中心
                </Button>
              }
            />
          </div>
          <div>
            {attentionRuns.length ? (
              attentionRuns.map((run) => (
                <OpsObjectRow
                  key={run.id}
                  title={`Run #${run.id} · ${run.workflowName}`}
                  status={runStatus(run.status)}
                  meta={`${run.startedAt}${run.workflowVersion ? ` · Workflow v${run.workflowVersion}` : ""}`}
                  summary={
                    run.errorMessage ||
                    run.outputSummary ||
                    "查看本次执行证据。"
                  }
                  signals={run.dryRun ? <Tag>Dry-run</Tag> : undefined}
                  onClick={() => onNavigate("records")}
                />
              ))
            ) : (
              <div className="p-8">
                <Empty title="暂无需要关注的运行" />
              </div>
            )}
          </div>
        </section>

        <section
          className="overflow-hidden rounded-lg border bg-background"
          aria-label="自动化健康度"
        >
          <div className="border-b px-5 py-4">
            <OpsRegionHeading
              title="自动化健康度"
              description={`${workflows.filter((item) => item.enabled).length} 个 Workflow 已启用`}
            />
          </div>
          <div>
            {workflows.slice(0, 4).map((workflow) => (
              <OpsObjectRow
                key={workflow.id}
                title={workflow.name}
                status={
                  <Tag color={workflow.enabled ? "success" : undefined}>
                    {workflow.enabled ? "已启用" : "已停用"}
                  </Tag>
                }
                meta={`${workflow.schedule} · 下次 ${workflow.nextRunAt}`}
                summary={workflow.latestRun?.summary || workflow.description}
                signals={
                  <>
                    <OpsMeta>v{workflow.currentVersion}</OpsMeta>
                    <OpsMeta>
                      {workflow.metrics.runs} 次运行 ·{" "}
                      {workflow.metrics.failures} 次失败
                    </OpsMeta>
                  </>
                }
                onClick={() => onNavigate("automation")}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function DecisionWorkbench({
  item,
  onReviewApproval,
  onResolveInteraction,
  onOpenOperation,
}: {
  item: DecisionItem | null;
  onReviewApproval: (approval: ApprovalFixture, approved: boolean) => void;
  onResolveInteraction: (task: InteractionFixture, response: unknown) => void;
  onOpenOperation: (kind: keyof OperationsFixture, id: number) => void;
}) {
  if (!item)
    return (
      <div className="p-8">
        <Empty title="当前没有需要处理的事项" />
      </div>
    );

  const context = (
    <div className="flex flex-wrap items-center gap-2 type-caption text-muted-foreground">
      <span>{item.meta}</span>
      {item.createdAt ? (
        <>
          <span aria-hidden="true">·</span>
          <span>{item.createdAt}</span>
        </>
      ) : null}
    </div>
  );

  if (item.kind === "interaction") {
    const task = item.payload as InteractionFixture;
    return (
      <div className="flex flex-col gap-5 p-6">
        {context}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Heading level={2}>{task.title}</Heading>
            <Text className="mt-2" tone="muted">
              {task.reason || "当前运行需要你的输入才能继续。"}
            </Text>
          </div>
          <Tag color="warning">{interactionLabel(task)}</Tag>
        </div>
        <section className="border-t pt-5">
          <OpsRegionHeading
            title="为什么需要你"
            description="这一步属于运行中的 Human Interaction。完成后 Workflow 会从当前步骤继续，不会创建新的独立运行。"
          />
        </section>
        {task.type === "choice" && task.options?.length ? (
          <section className="border-t pt-5">
            <OpsRegionHeading
              title="请选择一个方向"
              description="选择只会提交给当前 Run，后续媒体生成与应用仍保留各自的确认边界。"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {task.options.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  onClick={() => onResolveInteraction(task, { option })}
                >
                  {option}
                </Button>
              ))}
            </div>
          </section>
        ) : (
          <section className="border-t pt-5">
            <OpsRegionHeading
              title="确认后会发生什么"
              description="确认当前预览/范围，并恢复所属 Run 的后续步骤。"
            />
            <div className="mt-4">
              <Button
                variant="solid"
                color="primary"
                icon={<Play />}
                onClick={() => onResolveInteraction(task, { confirmed: true })}
              >
                确认并继续
              </Button>
            </div>
          </section>
        )}
        <div className="border-t pt-4 type-caption text-muted-foreground">
          安全边界：不会跳过后续审批、媒体选择或内容应用步骤。
        </div>
      </div>
    );
  }

  if (item.kind === "approval") {
    const approval = item.payload as ApprovalFixture;
    const impact = approvalImpact(approval);
    return (
      <div className="flex flex-col gap-5 p-6">
        {context}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Heading level={2}>{approvalTitle(approval)}</Heading>
            <Text className="mt-2" tone="muted">
              需要确认 AI 准备的变更以及真正会影响的对象。
            </Text>
          </div>
          {decisionStatus(item)}
        </div>
        {approval.status === "failed" ? (
          <Alert
            type="error"
            showIcon
            title="上次批准后的执行失败"
            description={approval.reviewNote || "提案仍保留，可修正后重试。"}
          />
        ) : null}
        <section className="border-t pt-5">
          <OpsRegionHeading
            title="AI 准备了什么"
            description={
              approval.proposal.summary ||
              "以下内容来自本次 Agent / Workflow 运行。"
            }
          />
          <div className="mt-4 rounded-md bg-muted/35 p-4">
            {approval.proposal.title ? (
              <strong className="type-body-sm type-weight-semibold">{approval.proposal.title}</strong>
            ) : null}
            {approval.proposal.content ? (
              <pre className="mt-3 whitespace-pre-wrap type-family-sans type-body-sm type-leading-relaxed text-muted-foreground">
                {approval.proposal.content}
              </pre>
            ) : null}
            {approval.proposal.suggestions?.length ? (
              <ol className="space-y-2 type-body-sm type-weight-semibold">
                {approval.proposal.suggestions.map((value, index) => (
                  <li key={value}>
                    <span className="mr-2 type-caption text-muted-foreground">
                      {index + 1}.
                    </span>
                    {value}
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </section>
        <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
          <div>
            <Text size="xs" tone="muted">
              批准后会发生什么
            </Text>
            <strong className="mt-1 block type-body-sm type-weight-semibold">{impact.happens}</strong>
          </div>
          <div>
            <Text size="xs" tone="muted">
              不会发生什么
            </Text>
            <strong className="mt-1 block type-body-sm type-weight-semibold">{impact.safe}</strong>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t pt-5">
          <Button
            variant="outline"
            icon={<X />}
            onClick={() => onReviewApproval(approval, false)}
          >
            拒绝此建议
          </Button>
          <Button
            variant="solid"
            color="primary"
            icon={<ShieldCheck />}
            onClick={() => onReviewApproval(approval, true)}
          >
            {approval.status === "failed" ? "重试批准并执行" : "批准并继续"}
          </Button>
        </div>
      </div>
    );
  }

  if (item.kind === "suggestion") {
    const suggestion = item.payload as SuggestionFixture;
    return (
      <div className="flex flex-col gap-5 p-6">
        {context}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Heading level={2}>{suggestion.title}</Heading>
            <Text className="mt-2" tone="muted">
              {suggestion.description}
            </Text>
          </div>
          {decisionStatus(item)}
        </div>
        <section className="border-t pt-5">
          <OpsRegionHeading
            title="AI 的判断依据"
            description="这是只读运营证据；创建编辑任务不会修改或发布内容。"
          />
          <ul className="mt-4 space-y-2 type-body-sm type-weight-semibold">
            {suggestion.evidence.map((evidence) => (
              <li key={evidence} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                {evidence}
              </li>
            ))}
          </ul>
        </section>
        <div className="flex flex-wrap justify-end gap-2 border-t pt-5">
          <Button
            variant="outline"
            onClick={() => onOpenOperation("suggestions", suggestion.id)}
          >
            暂不处理
          </Button>
          <Button
            variant="solid"
            color="primary"
            onClick={() => onOpenOperation("suggestions", suggestion.id)}
          >
            创建编辑任务
          </Button>
        </div>
      </div>
    );
  }

  if (item.kind === "candidate") {
    const set = item.payload as CandidateSetFixture;
    return (
      <div className="flex flex-col gap-5 p-6">
        {context}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Heading level={2}>{set.title}</Heading>
            <Text className="mt-2" tone="muted">
              当前值：{set.beforeValue}
            </Text>
          </div>
          {decisionStatus(item)}
        </div>
        <section className="border-t pt-5">
          <OpsRegionHeading
            title="选择候选"
            description="选择后只会创建下一步明确的内容变更审批，不会立即写入文章。"
          />
          <div className="mt-4 space-y-3">
            {set.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <strong className="type-body-sm type-weight-semibold">{candidate.value}</strong>
                  <Text size="xs" tone="muted" className="mt-1">
                    {candidate.rationale}
                  </Text>
                </div>
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => onOpenOperation("candidateSets", set.id)}
                >
                  选择此项
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (item.kind === "media") {
    const media = item.payload as MediaCandidateFixture;
    return (
      <div className="flex flex-col gap-5 p-6">
        {context}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Heading level={2}>{media.title}</Heading>
            <Text className="mt-2" tone="muted">
              {media.brief}
            </Text>
          </div>
          {decisionStatus(item)}
        </div>
        <OpsSummaryStrip
          items={[
            {
              label: "位置",
              value: media.placement === "cover" ? "封面" : "正文插图",
            },
            { label: "Safety", value: media.safetyStatus },
            { label: "Copyright", value: media.copyrightStatus },
            { label: "目标", value: `文章 #${media.postId}` },
          ]}
        />
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenOperation("mediaCandidates", media.id)}
          >
            拒绝方案
          </Button>
          <Button
            variant="solid"
            color="primary"
            icon={<Image />}
            onClick={() => onOpenOperation("mediaCandidates", media.id)}
          >
            {media.status === "brief_ready" ? "审核通过" : "生成图片"}
          </Button>
        </div>
      </div>
    );
  }

  const task = item.payload as EditorialTaskFixture;
  return (
    <div className="flex flex-col gap-5 p-6">
      {context}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Heading level={2}>{task.title}</Heading>
          <Text className="mt-2" tone="muted">
            {task.description}
          </Text>
        </div>
        {decisionStatus(item)}
      </div>
      <section className="border-t pt-5">
        <OpsRegionHeading
          title="后续工作"
          description="这是由 AI 运营建议转成的人工编辑任务。完成或取消只更新任务状态，本身不会修改内容。"
        />
      </section>
      <div className="flex flex-wrap justify-end gap-2 border-t pt-5">
        <Button
          variant="outline"
          onClick={() => onOpenOperation("editorialTasks", task.id)}
        >
          取消任务
        </Button>
        <Button
          variant="solid"
          color="primary"
          onClick={() => onOpenOperation("editorialTasks", task.id)}
        >
          标记完成
        </Button>
      </div>
    </div>
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
  const allItems = useMemo(() => buildDecisionItems(fixture), [fixture]);
  const defaultKey = selectedApprovalId
    ? `approval-${selectedApprovalId}`
    : allItems[0]?.key || "";
  const [selectedKey, setSelectedKey] = useState(defaultKey);
  const [filter, setFilter] = useState<DecisionFilter>("all");
  const [mobilePane, setMobilePane] = useState<"master" | "detail">(
    selectedApprovalId ? "detail" : "master",
  );

  const items = allItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "approval") return item.kind === "approval";
    if (filter === "choice")
      return item.kind === "interaction" || item.kind === "candidate";
    if (filter === "follow-up") return item.kind === "editorial";
    return item.kind === "suggestion" || item.kind === "media";
  });
  const selected =
    allItems.find((item) => item.key === selectedKey) ||
    items[0] ||
    allItems[0] ||
    null;

  return (
    <div className="flex flex-col gap-5" aria-label="待我处理">
      <TabPanelLead
        description="把审批、选择、确认、运营建议和后续编辑任务放进同一人工决策队列，而不是分散成多个互不相关的卡片区。"
      />
      <div className="flex flex-wrap gap-2" aria-label="决策队列筛选">
        {(
          [
            ["all", "全部"],
            ["approval", "审批"],
            ["choice", "选择 / 确认"],
            ["operation", "运营建议"],
            ["follow-up", "后续任务"],
          ] as Array<[DecisionFilter, string]>
        ).map(([key, label]) => (
          <Button
            key={key}
            size="small"
            variant={filter === key ? "solid" : "outline"}
            color={filter === key ? "primary" : undefined}
            onClick={() => {
              setFilter(key);
              setMobilePane("master");
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      <div
        data-slot="ops-master-detail"
        data-pattern="master-detail-composition"
        data-mobile-pane={mobilePane}
        className="grid min-h-[34rem] items-stretch overflow-hidden rounded-lg border bg-background xl:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.55fr)]"
      >
        <section
          data-slot="ops-rail"
          className={`${mobilePane === "detail" ? "hidden md:flex" : "flex"} min-h-0 min-w-0 flex-col border-b xl:border-b-0 xl:border-r`}
          aria-label="Decision Queue"
        >
          <div className="shrink-0 border-b px-[18px] py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <strong className="type-body-sm type-weight-semibold">决策队列</strong>
                <Text size="xs" tone="muted">
                  {items.length} 项符合当前筛选
                </Text>
              </div>
              <Clock3 className="size-4 text-muted-foreground" />
            </div>
          </div>
          <div
            data-slot="ops-rail-body"
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          >
            {items.length ? (
              items.map((item) => (
                <OpsObjectRow
                  key={item.key}
                  title={item.title}
                  status={decisionStatus(item)}
                  meta={item.meta}
                  summary={item.summary}
                  signals={
                    item.createdAt ? (
                      <OpsMeta>{item.createdAt}</OpsMeta>
                    ) : undefined
                  }
                  selected={selected?.key === item.key}
                  onClick={() => {
                    setSelectedKey(item.key);
                    setMobilePane("detail");
                    if (item.kind === "approval") onSelectApproval(item.id);
                  }}
                />
              ))
            ) : (
              <div className="p-8">
                <Empty title="当前筛选没有待处理事项" />
              </div>
            )}
          </div>
        </section>
        <section
          data-slot="ops-detail-pane"
          className={`${mobilePane === "master" ? "hidden md:block" : "block"} min-w-0`}
          aria-label="Decision Workbench"
        >
          <div className="border-b p-4 md:hidden">
            <Button
              variant="ghost"
              icon={<ArrowLeft />}
              onClick={() => setMobilePane("master")}
            >
              返回决策队列
            </Button>
          </div>
          <DecisionWorkbench
            item={selected}
            onReviewApproval={onReviewApproval}
            onResolveInteraction={onResolveInteraction}
            onOpenOperation={onOpenOperation}
          />
        </section>
      </div>
    </div>
  );
}
