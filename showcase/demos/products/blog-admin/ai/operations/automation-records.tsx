import { useMemo, useState } from "react";
import { Clock3, GitBranch, ShieldCheck, Wrench } from "lucide-react";
import {
  Alert,
  Button,
  Empty,
  Heading,
  Select,
  Tag,
  Text,
} from "../../../../../../src/core";
import type {
  AIOpsAutomationRecordsFixture,
  AgentRunFixture,
  WorkflowRunFixture,
  WorkflowRunStatus,
} from "./automation-records-fixtures";
import { TabPanelLead } from "../../../../../components/tab-panel-lead";
import {
  OpsMeta,
  OpsObjectRow,
  OpsRegionHeading,
  OpsSummaryStrip,
} from "./canonical-patterns";

export type AIOpsRecordsTarget = {
  record: "workflow" | "agent";
  workflow?: number;
  run?: number;
};

function duration(start?: string, finish?: string) {
  if (!start || !finish || start === "刚刚" || finish === "刚刚")
    return finish ? "< 1 s" : "运行中";
  const value = new Date(finish).getTime() - new Date(start).getTime();
  if (!Number.isFinite(value) || value < 0) return "—";
  return `${(value / 1000).toFixed(1)} s`;
}

function RunStatus({
  status,
}: {
  status: WorkflowRunStatus | AgentRunFixture["status"];
}) {
  if (status === "succeeded") return <Tag color="success">成功</Tag>;
  if (status === "failed") return <Tag color="error">失败</Tag>;
  if (status === "awaiting_approval")
    return <Tag color="warning">等待审批</Tag>;
  if (status === "waiting_for_user") return <Tag color="warning">等待用户</Tag>;
  if (status === "running") return <Tag color="primary">运行中</Tag>;
  if (status === "queued") return <Tag color="primary">已排队</Tag>;
  if (status === "cancelled") return <Tag>已取消</Tag>;
  return <Tag>{status}</Tag>;
}

function workflowRunSummary(run: WorkflowRunFixture) {
  if (run.errorMessage) return run.errorMessage;
  if (run.outputSummary) return run.outputSummary;
  const waiting = run.steps.find((step) =>
    ["waiting_for_user", "awaiting_approval"].includes(step.status),
  );
  if (waiting) return waiting.detail;
  if (run.status === "succeeded") return "本次运行成功完成。";
  return "打开查看本次执行证据。";
}

function WorkflowRunDetail({
  run,
  resolvedInteractions,
  onResolveInteraction,
}: {
  run: WorkflowRunFixture;
  resolvedInteractions: Set<number>;
  onResolveInteraction: (id: number) => void;
}) {
  const waitingInteraction = run.interactions.find(
    (item) =>
      item.status === "pending" && !resolvedInteractions.has(item.id || -1),
  );

  return (
    <div
      data-pattern="record-detail-composition"
      className="flex min-w-0 flex-col gap-6"
      aria-label={`Workflow Run #${run.id} 详情`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Heading level={2}>
                Run #{run.id} · {run.workflowName}
              </Heading>
              <RunStatus status={run.status} />
              {run.dryRun ? <Tag>Dry-run</Tag> : null}
            </div>
            <Text className="mt-2 max-w-4xl" tone="muted">
              {workflowRunSummary(run)}
            </Text>
            <Text size="xs" tone="muted" className="mt-1">
              {run.workflowVersion ? `Workflow v${run.workflowVersion} · ` : ""}
              {run.triggeredBy ? `触发：${run.triggeredBy}` : ""}
            </Text>
          </div>
        </div>

        <OpsSummaryStrip
          ariaLabel={`Run #${run.id} 摘要`}
          items={[
            {
              label: "开始时间",
              value: run.startedAt,
              detail: run.finishedAt
                ? `结束 ${run.finishedAt}`
                : "仍在执行 / 等待",
            },
            {
              label: "总耗时",
              value: duration(run.startedAt, run.finishedAt),
              detail: run.dryRun ? "Dry-run" : "正式运行",
            },
            {
              label: "Token",
              value: run.tokenUsage.toLocaleString(),
              detail:
                run.inputTokens !== undefined
                  ? `${run.inputTokens} in / ${run.outputTokens || 0} out`
                  : undefined,
            },
            {
              label: "执行步骤",
              value: run.steps.length,
              detail: `${run.resources.length} 个资源 · ${run.interactions.length} 个人工交互`,
            },
          ]}
        />
      </div>

      {run.errorMessage ? (
        <Alert
          type="error"
          showIcon
          title="运行失败"
          description={`${run.errorMessage}${run.errorCode ? ` · ${run.errorCode}` : ""}`}
        />
      ) : waitingInteraction ? (
        <Alert
          type="warning"
          showIcon
          title="运行正在等待人工输入"
          description={`${waitingInteraction.label}${waitingInteraction.stepId ? ` · ${waitingInteraction.stepId}` : ""}。完成后 Workflow 会从当前步骤继续。`}
        />
      ) : null}

      <section
        className="overflow-hidden rounded-lg border bg-background"
        aria-label="执行过程"
      >
        <div className="border-b px-5 py-4">
          <OpsRegionHeading
            title="执行过程"
            description="按真实执行顺序阅读每一步的结果、等待原因和失败证据。"
          />
        </div>
        {run.steps.length ? (
          <ol className="divide-y">
            {run.steps.map((step, index) => (
              <li
                key={`${step.id}-${step.iteration ?? 0}`}
                className="flex gap-4 px-5 py-4"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border type-caption type-weight-semibold">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <strong className="type-body-sm type-weight-semibold">{step.name}</strong>
                      <Text size="xs" tone="muted" className="mt-1">
                        {step.type ? `${step.type} · ` : ""}
                        {step.durationMs.toLocaleString()} ms
                        {step.iteration !== undefined
                          ? ` · iteration ${step.iteration}`
                          : ""}
                      </Text>
                    </div>
                    <RunStatus status={step.status} />
                  </div>
                  <Text size="sm" className="mt-2">
                    {step.errorMessage || step.detail}
                  </Text>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="p-8">
            <Empty title="该运行没有步骤日志" />
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section
          className="overflow-hidden rounded-lg border bg-background"
          aria-label="运行资源"
        >
          <div className="border-b px-5 py-4">
            <OpsRegionHeading
              title="资源证据"
              description="Target 资源可以成为提案目标；Discovery / Read 资源只提供上下文。"
            />
          </div>
          {run.resources.length ? (
            <div className="divide-y">
              {run.resources.map((resource, index) => (
                <div
                  key={`${resource.type}-${resource.label}-${index}`}
                  className="flex items-start justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <strong className="type-body-sm type-weight-semibold">{resource.label}</strong>
                    <Text size="xs" tone="muted" className="mt-1">
                      {resource.type} · {resource.source || "snapshot"}
                    </Text>
                  </div>
                  <Tag
                    color={
                      resource.accessLevel === "target" ? "primary" : undefined
                    }
                  >
                    {resource.accessLevel === "target" ? "目标" : "只读"}
                  </Tag>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8">
              <Empty title="该运行没有结构化资源快照" />
            </div>
          )}
        </section>

        <section
          className="overflow-hidden rounded-lg border bg-background"
          aria-label="人工交互"
        >
          <div className="border-b px-5 py-4">
            <OpsRegionHeading
              title="人工交互"
              description="Choice、Input、Preview Confirm 与 Approval 都属于原 Run；处理后恢复原流程。"
            />
          </div>
          {run.interactions.length ? (
            <div className="divide-y">
              {run.interactions.map((interaction, index) => {
                const resolved =
                  interaction.status === "resolved" ||
                  (interaction.id
                    ? resolvedInteractions.has(interaction.id)
                    : false);
                return (
                  <div key={interaction.id || index} className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <strong className="type-body-sm type-weight-semibold">{interaction.label}</strong>
                        <Text size="xs" tone="muted" className="mt-1">
                          {interaction.type}
                          {interaction.stepId ? ` · ${interaction.stepId}` : ""}
                          {interaction.expiresAt
                            ? ` · 到期 ${interaction.expiresAt}`
                            : ""}
                        </Text>
                      </div>
                      <Tag color={resolved ? "success" : "warning"}>
                        {resolved ? "已处理" : "待处理"}
                      </Tag>
                    </div>
                    {!resolved && interaction.options?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {interaction.options.map((option) => (
                          <Button
                            key={option}
                            size="small"
                            variant="outline"
                            onClick={() =>
                              interaction.id &&
                              onResolveInteraction(interaction.id)
                            }
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    ) : !resolved && interaction.id ? (
                      <div className="mt-3">
                        <Button
                          size="small"
                          variant="solid"
                          color="primary"
                          icon={<ShieldCheck />}
                          onClick={() => onResolveInteraction(interaction.id!)}
                        >
                          确认并继续
                        </Button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8">
              <Empty title="本次运行没有人工交互" />
            </div>
          )}
        </section>
      </div>

      {run.mediaCandidates.length ? (
        <section
          className="overflow-hidden rounded-lg border bg-background"
          aria-label="媒体候选"
        >
          <div className="border-b px-5 py-4">
            <OpsRegionHeading
              title="媒体候选"
              description="媒体从 Brief → Generate → Select → Preview → Apply 逐步推进，不把生成等同于应用。"
            />
          </div>
          <div className="divide-y">
            {run.mediaCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <strong className="type-body-sm type-weight-semibold">
                    #{candidate.id} · {candidate.title}
                  </strong>
                  <Text size="xs" tone="muted" className="mt-1">
                    {candidate.brief || "媒体候选"}
                    {candidate.placement ? ` · ${candidate.placement}` : ""}
                  </Text>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Tag
                    color={
                      candidate.status === "failed"
                        ? "error"
                        : candidate.status === "generated"
                          ? "success"
                          : "warning"
                    }
                  >
                    {candidate.status}
                  </Tag>
                  {candidate.safetyStatus ? (
                    <Tag>Safety {candidate.safetyStatus}</Tag>
                  ) : null}
                  {candidate.copyrightStatus ? (
                    <Tag>Copyright {candidate.copyrightStatus}</Tag>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {run.events.length ? (
        <details className="rounded-lg border bg-background">
          <summary className="cursor-pointer px-5 py-4 type-body-sm type-weight-semibold">
            运行事件与技术证据 · {run.events.length}
          </summary>
          <div className="divide-y border-t">
            {run.events
              .slice()
              .reverse()
              .map((event, index) => (
                <div key={`${event.type}-${index}`} className="px-5 py-3">
                  <strong className="type-family-mono type-caption type-weight-semibold">{event.type}</strong>
                  <Text size="xs" tone="muted" className="mt-1">
                    {event.createdAt ? `${event.createdAt} · ` : ""}
                    {event.message}
                  </Text>
                </div>
              ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function AgentRunDetail({ run }: { run: AgentRunFixture }) {
  return (
    <div
      data-pattern="record-detail-composition"
      className="flex min-w-0 flex-col gap-6"
      aria-label={`Agent Run #${run.id} 详情`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Heading level={2}>
            Run #{run.id} · {run.agentName}
          </Heading>
          <RunStatus status={run.status} />
        </div>
        <Text className="mt-2" tone="muted">
          {run.summary}
        </Text>
        <Text size="xs" tone="muted" className="mt-1">
          {run.provider || "provider"}
          {run.model ? ` · ${run.model}` : ""}
        </Text>
      </div>

      <OpsSummaryStrip
        items={[
          {
            label: "开始时间",
            value: run.startedAt,
            detail: run.finishedAt ? `结束 ${run.finishedAt}` : "仍在运行",
          },
          { label: "总耗时", value: duration(run.startedAt, run.finishedAt) },
          {
            label: "Token",
            value: run.tokenUsage.toLocaleString(),
            detail:
              run.inputTokens !== undefined
                ? `${run.inputTokens} in / ${run.outputTokens || 0} out`
                : undefined,
          },
          {
            label: "Tool Calls",
            value: run.toolCalls.length,
            detail: `${run.toolCalls.filter((call) => call.status === "failed").length} 个失败`,
          },
        ]}
      />

      {run.errorMessage ? (
        <Alert
          type="error"
          showIcon
          title="Agent 运行失败"
          description={`${run.errorMessage}${run.errorCode ? ` · ${run.errorCode}` : ""}`}
        />
      ) : null}

      <section
        className="overflow-hidden rounded-lg border bg-background"
        aria-label="Tool Calls"
      >
        <div className="border-b px-5 py-4">
          <OpsRegionHeading
            title="Tool Calls"
            description="风险等级来自 Tool 定义；read / propose / write 不应被视觉上混成同一种调用。"
            action={<Wrench className="size-4 text-muted-foreground" />}
          />
        </div>
        {run.toolCalls.length ? (
          <div className="divide-y">
            {run.toolCalls.map((call, index) => (
              <div key={`${call.tool}-${index}`} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <strong className="type-family-mono type-body-sm type-weight-semibold">{call.tool}</strong>
                    <Text size="xs" tone="muted" className="mt-1">
                      {call.detail}
                    </Text>
                  </div>
                  <div className="flex gap-2">
                    {call.riskLevel ? (
                      <Tag
                        color={
                          call.riskLevel === "write"
                            ? "error"
                            : call.riskLevel === "propose"
                              ? "warning"
                              : undefined
                        }
                      >
                        {call.riskLevel}
                      </Tag>
                    ) : null}
                    <Tag
                      color={
                        call.status === "failed"
                          ? "error"
                          : call.status === "executed" ||
                              call.status === "succeeded"
                            ? "success"
                            : undefined
                      }
                    >
                      {call.status}
                    </Tag>
                  </div>
                </div>
                {call.resultSummary ? (
                  <div className="mt-3 rounded-md bg-muted/35 px-4 py-3 type-body-sm type-weight-semibold">
                    {call.resultSummary}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8">
            <Empty title="本次 Agent Run 没有 Tool Call" />
          </div>
        )}
      </section>

      {run.citations?.length ? (
        <section
          className="overflow-hidden rounded-lg border bg-background"
          aria-label="引用证据"
        >
          <div className="border-b px-5 py-4">
            <OpsRegionHeading
              title="引用证据"
              description="引用验证结果属于 Agent 输出证据，不与 Tool Call 日志混排。"
            />
          </div>
          <div className="divide-y">
            {run.citations.map((citation) => (
              <div
                key={citation.title}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <strong className="type-body-sm type-weight-semibold">{citation.title}</strong>
                <div className="flex gap-2">
                  <Tag
                    color={
                      citation.status === "validated" ? "success" : "warning"
                    }
                  >
                    {citation.status}
                  </Tag>
                  {citation.score !== undefined ? (
                    <Tag>{citation.score.toFixed(2)}</Tag>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function AIOpsRecordsPanel({
  fixture,
  initialRecord = "workflow",
  initialRunId,
  onRouteChange,
}: {
  fixture: AIOpsAutomationRecordsFixture;
  initialRecord?: "workflow" | "agent";
  initialRunId?: number;
  onRouteChange: (target: AIOpsRecordsTarget) => void;
}) {
  const [record, setRecord] = useState<"workflow" | "agent">(initialRecord);
  const [workflowId, setWorkflowId] = useState(0);
  const [status, setStatus] = useState("");
  const [resolvedInteractions, setResolvedInteractions] = useState<Set<number>>(
    () => new Set(),
  );
  const [selectedWorkflowRunId, setSelectedWorkflowRunId] = useState(
    initialRecord === "workflow"
      ? (initialRunId ?? fixture.workflowRuns[0]?.id ?? 0)
      : 0,
  );
  const [selectedAgentRunId, setSelectedAgentRunId] = useState(
    initialRecord === "agent"
      ? (initialRunId ?? fixture.agentRuns[0]?.id ?? 0)
      : (fixture.agentRuns[0]?.id ?? 0),
  );

  const workflowRuns = useMemo(
    () =>
      fixture.workflowRuns.filter((run) => {
        if (workflowId && run.workflowId !== workflowId) return false;
        if (status === "active" && !["queued", "running"].includes(run.status))
          return false;
        if (
          status === "waiting" &&
          !["awaiting_approval", "waiting_for_user"].includes(run.status)
        )
          return false;
        if (
          status &&
          !["active", "waiting"].includes(status) &&
          run.status !== status
        )
          return false;
        return true;
      }),
    [fixture.workflowRuns, status, workflowId],
  );

  const selectedWorkflowRun =
    workflowRuns.find((run) => run.id === selectedWorkflowRunId) ??
    workflowRuns[0] ??
    null;
  const selectedAgentRun =
    fixture.agentRuns.find((run) => run.id === selectedAgentRunId) ??
    fixture.agentRuns[0] ??
    null;

  const selectRecord = (next: "workflow" | "agent") => {
    setRecord(next);
    onRouteChange({ record: next });
  };

  return (
    <div className="flex flex-col gap-5" aria-label="运行中心">
      <TabPanelLead
        description="从一次 Run 追溯执行步骤、资源边界、人工交互、媒体候选、Tool Call 与持久化事件；这里是证据中心，不是 Workflow 配置页。"
        actions={
          <div className="flex flex-wrap gap-2" aria-label="运行中心类型">
            <Button
              variant={record === "workflow" ? "solid" : "outline"}
              color={record === "workflow" ? "primary" : undefined}
              onClick={() => selectRecord("workflow")}
              icon={<GitBranch />}
            >
              Workflow 任务
            </Button>
            <Button
              variant={record === "agent" ? "solid" : "outline"}
              color={record === "agent" ? "primary" : undefined}
              onClick={() => selectRecord("agent")}
              icon={<Clock3 />}
            >
              Agent 运行
            </Button>
          </div>
        }
      />

      {record === "workflow" ? (
        <div className="flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Select
              aria-label="按 Workflow 筛选运行"
              value={String(workflowId)}
              onChange={(value) => {
                const next = Number(value) || 0;
                setWorkflowId(next);
                onRouteChange({
                  record: "workflow",
                  workflow: next || undefined,
                });
              }}
            >
              <option value="0">全部 Workflow</option>
              {fixture.workflows.map((workflow) => (
                <option key={workflow.id} value={workflow.id}>
                  {workflow.name}
                </option>
              ))}
            </Select>
            <Select
              aria-label="按状态筛选 Workflow 运行"
              value={status}
              onChange={(value) => setStatus(String(value))}
            >
              <option value="">全部状态</option>
              <option value="active">运行中</option>
              <option value="waiting">等待人工</option>
              <option value="succeeded">成功</option>
              <option value="failed">失败</option>
              <option value="cancelled">已取消</option>
            </Select>
          </div>

          <div
            data-slot="ops-master-detail"
            data-pattern="master-detail-composition"
            className="grid items-stretch gap-6 xl:grid-cols-[19rem_minmax(0,1fr)]"
          >
            <section
              data-slot="ops-rail"
              className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border bg-background"
              aria-label="Workflow Runs"
            >
              <div className="shrink-0 border-b px-[18px] py-4">
                <strong className="type-body-sm type-weight-semibold">Workflow Runs</strong>
                <Text size="xs" tone="muted">
                  {workflowRuns.length} 条运行记录
                </Text>
              </div>
              <div
                data-slot="ops-rail-body"
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
              >
                {workflowRuns.length ? (
                  workflowRuns.map((run) => (
                    <OpsObjectRow
                      key={run.id}
                      title={`Run #${run.id}`}
                      status={<RunStatus status={run.status} />}
                      meta={`${run.workflowName} · ${run.startedAt}`}
                      summary={workflowRunSummary(run)}
                      signals={
                        <>
                          {run.dryRun ? <Tag>Dry-run</Tag> : null}
                          {run.workflowVersion ? (
                            <OpsMeta>v{run.workflowVersion}</OpsMeta>
                          ) : null}
                          <OpsMeta>{run.steps.length} 步</OpsMeta>
                          <OpsMeta>
                            {run.tokenUsage.toLocaleString()} Token
                          </OpsMeta>
                        </>
                      }
                      selected={selectedWorkflowRun?.id === run.id}
                      onClick={() => {
                        setSelectedWorkflowRunId(run.id);
                        onRouteChange({
                          record: "workflow",
                          workflow: run.workflowId,
                          run: run.id,
                        });
                      }}
                    />
                  ))
                ) : (
                  <div className="p-8">
                    <Empty title="没有符合条件的 Workflow Run" />
                  </div>
                )}
              </div>
            </section>
            {selectedWorkflowRun ? (
              <WorkflowRunDetail
                run={selectedWorkflowRun}
                resolvedInteractions={resolvedInteractions}
                onResolveInteraction={(id) =>
                  setResolvedInteractions(
                    (current) => new Set([...current, id]),
                  )
                }
              />
            ) : (
              <Empty title="选择一个 Run 查看证据" />
            )}
          </div>
        </div>
      ) : (
        <div
          data-slot="ops-master-detail"
          data-pattern="master-detail-composition"
          className="grid min-w-0 items-stretch gap-6 xl:grid-cols-[19rem_minmax(0,1fr)]"
        >
          <section
            data-slot="ops-rail"
            className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border bg-background"
            aria-label="Agent Runs"
          >
            <div className="border-b px-[18px] py-4">
              <strong className="type-body-sm type-weight-semibold">Agent Runs</strong>
              <Text size="xs" tone="muted">
                {fixture.agentRuns.length} 条运行记录
              </Text>
            </div>
            <div
              data-slot="ops-rail-body"
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            >
              {fixture.agentRuns.map((run) => (
                <OpsObjectRow
                  key={run.id}
                  title={`Run #${run.id}`}
                  status={<RunStatus status={run.status} />}
                  meta={`${run.agentName} · ${run.startedAt}`}
                  summary={run.errorMessage || run.summary}
                  signals={
                    <>
                      <OpsMeta>
                        {run.provider || "provider"}
                        {run.model ? ` · ${run.model}` : ""}
                      </OpsMeta>
                      <OpsMeta>{run.toolCalls.length} Tool Calls</OpsMeta>
                    </>
                  }
                  selected={selectedAgentRun?.id === run.id}
                  onClick={() => {
                    setSelectedAgentRunId(run.id);
                    onRouteChange({ record: "agent", run: run.id });
                  }}
                />
              ))}
            </div>
          </section>
          {selectedAgentRun ? <AgentRunDetail run={selectedAgentRun} /> : null}
        </div>
      )}
    </div>
  );
}
