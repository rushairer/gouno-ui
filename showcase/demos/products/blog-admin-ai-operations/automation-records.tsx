import { useMemo, useState } from "react";
import { Clock3, GitBranch, History, Play, RotateCcw, Search, TestTube2 } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Heading,
  Input,
  Select,
  Tag,
  Text,
} from "../../../../src/core";
import type {
  AIOpsAutomationRecordsFixture,
  AgentRunFixture,
  WorkflowFixture,
  WorkflowRunFixture,
  WorkflowRunStatus,
} from "./automation-records-fixtures";

export type AIOpsRecordsTarget = {
  record: "workflow" | "agent";
  workflow?: number;
  run?: number;
};

type RunFeedback = {
  type: "success" | "error";
  message: string;
  runId?: number;
};

function WorkflowStatus({ enabled }: { enabled: boolean }) {
  return enabled ? <Tag color="success">已启用</Tag> : <Tag>已停用</Tag>;
}

function RunStatus({ status }: { status: WorkflowRunStatus | AgentRunFixture["status"] }) {
  if (status === "succeeded") return <Tag color="success">成功</Tag>;
  if (status === "failed") return <Tag color="error">失败</Tag>;
  if (status === "awaiting_approval") return <Tag color="warning">等待审批</Tag>;
  if (status === "waiting_for_user") return <Tag color="warning">等待用户</Tag>;
  if (status === "running") return <Tag color="primary">运行中</Tag>;
  return <Tag>已排队</Tag>;
}

function workflowMatches(workflow: WorkflowFixture, query: string, status: string) {
  const normalized = query.trim().toLowerCase();
  if (status === "enabled" && !workflow.enabled) return false;
  if (status === "disabled" && workflow.enabled) return false;
  if (!normalized) return true;
  return `${workflow.name} ${workflow.description}`.toLowerCase().includes(normalized);
}

export function AIOpsAutomationPanel({
  fixture,
  onPreflight,
  onRun,
  onRollback,
  onOpenRecords,
}: {
  fixture: AIOpsAutomationRecordsFixture;
  onPreflight: (
    workflowId: number,
    dryRun: boolean,
    input: Record<string, unknown>,
  ) => Promise<{ ready: boolean; message?: string }>;
  onRun: (
    workflowId: number,
    dryRun: boolean,
    input: Record<string, unknown>,
  ) => Promise<{ id: number; status: WorkflowRunStatus }>;
  onRollback: (workflowId: number, version: number) => void;
  onOpenRecords: (target: AIOpsRecordsTarget) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(fixture.workflows[0]?.id ?? 0);
  const [inputByWorkflow, setInputByWorkflow] = useState<Record<number, { topic: string; days: number }>>(
    () => Object.fromEntries(fixture.workflows.map((item) => [item.id, { ...item.input }])),
  );
  const [running, setRunning] = useState<"run" | "dry" | null>(null);
  const [feedback, setFeedback] = useState<RunFeedback | null>(null);

  const visible = useMemo(
    () => fixture.workflows.filter((workflow) => workflowMatches(workflow, query, status)),
    [fixture.workflows, query, status],
  );
  const selected = fixture.workflows.find((workflow) => workflow.id === selectedWorkflowId) ?? visible[0] ?? null;

  const execute = async (workflow: WorkflowFixture, dryRun: boolean) => {
    const input = inputByWorkflow[workflow.id] ?? workflow.input;
    setRunning(dryRun ? "dry" : "run");
    setFeedback(null);
    try {
      const preflight = await onPreflight(workflow.id, dryRun, input);
      if (!preflight.ready) {
        setFeedback({ type: "error", message: preflight.message || "运行前置检查未通过。" });
        return;
      }
      const result = await onRun(workflow.id, dryRun, input);
      if (result.status === "failed") {
        setFeedback({
          type: "error",
          runId: result.id,
          message: `${dryRun ? "Dry-run" : "运行"}失败（Run #${result.id}）。请修正后重试，步骤日志可在运行中心查看。`,
        });
        return;
      }
      setFeedback({
        type: "success",
        runId: result.id,
        message:
          result.status === "waiting_for_user"
            ? `Run #${result.id} 已进入等待用户状态，可到运行中心继续处理。`
            : result.status === "awaiting_approval"
              ? `Run #${result.id} 已等待审批，没有自动应用内容变更。`
              : `${dryRun ? "Dry-run" : "运行"}已创建 Run #${result.id}。`,
      });
    } catch (reason) {
      setFeedback({
        type: "error",
        message: reason instanceof Error ? reason.message : "Workflow 运行失败。",
      });
    } finally {
      setRunning(null);
    }
  };

  return (
    <div className="flex flex-col gap-6" aria-label="自动化">
      <Card padding="base">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <Input
              aria-label="搜索 Workflow"
              prefix={<Search className="size-4" />}
              placeholder="搜索名称或描述"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="lg:w-40">
            <Select aria-label="Workflow 状态" value={status} onChange={(value) => setStatus(String(value))}>
              <option value="">全部状态</option>
              <option value="enabled">已启用</option>
              <option value="disabled">已停用</option>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.75fr)]">
        <Card padding="none" className="overflow-hidden">
          <CardHeader className="border-b p-6">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base">Workflow</CardTitle>
              <Text size="xs" tone="muted">选择一个流程查看运行范围、输入、版本与执行状态。</Text>
            </div>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {visible.length ? (
              visible.map((workflow) => (
                <button
                  key={workflow.id}
                  type="button"
                  aria-pressed={selected?.id === workflow.id}
                  className="flex w-full items-start justify-between gap-4 p-6 text-left hover:bg-muted/40"
                  onClick={() => setSelectedWorkflowId(workflow.id)}
                >
                  <div className="min-w-0">
                    <strong className="text-sm">{workflow.name}</strong>
                    <Text size="xs" tone="muted">v{workflow.currentVersion} · {workflow.schedule}</Text>
                  </div>
                  <WorkflowStatus enabled={workflow.enabled} />
                </button>
              ))
            ) : (
              <div className="p-6"><Text tone="muted">没有符合条件的 Workflow。</Text></div>
            )}
          </CardContent>
        </Card>

        {selected ? (
          <div className="flex min-w-0 flex-col gap-6">
            <Card padding="base">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Heading level={2}>{selected.name}</Heading>
                      <WorkflowStatus enabled={selected.enabled} />
                    </div>
                    <Text tone="muted">{selected.description}</Text>
                  </div>
                  <Button
                    variant="outline"
                    icon={<Clock3 />}
                    onClick={() => onOpenRecords({ record: "workflow", workflow: selected.id })}
                  >
                    运行记录
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div><Text size="xs" tone="muted">执行计划</Text><strong>{selected.schedule}</strong><Text size="xs" tone="muted">{selected.timezone}</Text></div>
                  <div><Text size="xs" tone="muted">下次运行</Text><strong>{selected.nextRunAt}</strong></div>
                  <div><Text size="xs" tone="muted">运行 / 失败 / Token</Text><strong>{selected.metrics.runs} / {selected.metrics.failures} / {selected.metrics.tokens}</strong></div>
                </div>

                <div className="rounded-md border p-4">
                  <Text size="xs" tone="muted">运行范围</Text>
                  <strong>{selected.scopeMode === "strict" ? "严格限制所选资源" : "兼容模式"}</strong>
                  <Text size="xs" tone="muted">
                    {selected.discoveryTools.length ? `允许发现：${selected.discoveryTools.join(", ")}` : "无额外 discovery tools"}
                  </Text>
                </div>
              </div>
            </Card>

            <Card padding="none" className="overflow-hidden">
              <CardHeader className="border-b p-6">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base">运行输入</CardTitle>
                  <Text size="xs" tone="muted">输入会先经过 preflight；正式运行和 dry-run 使用同一份受控输入。</Text>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    主题
                    <Input
                      aria-label="Workflow 主题"
                      value={(inputByWorkflow[selected.id] ?? selected.input).topic}
                      onChange={(event) =>
                        setInputByWorkflow((current) => ({
                          ...current,
                          [selected.id]: {
                            ...(current[selected.id] ?? selected.input),
                            topic: event.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    时间范围（天）
                    <Input
                      aria-label="Workflow 时间范围"
                      type="number"
                      min={1}
                      value={(inputByWorkflow[selected.id] ?? selected.input).days}
                      onChange={(event) =>
                        setInputByWorkflow((current) => ({
                          ...current,
                          [selected.id]: {
                            ...(current[selected.id] ?? selected.input),
                            days: Number(event.target.value) || 1,
                          },
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    icon={<TestTube2 />}
                    disabled={Boolean(running)}
                    onClick={() => void execute(selected, true)}
                  >
                    {running === "dry" ? "Dry-run 中…" : "Dry-run"}
                  </Button>
                  <Button
                    variant="solid"
                    color="primary"
                    icon={<Play />}
                    disabled={!selected.enabled || Boolean(running)}
                    onClick={() => void execute(selected, false)}
                  >
                    {running === "run" ? "运行中…" : "运行"}
                  </Button>
                </div>

                {feedback ? (
                  <Alert
                    type={feedback.type}
                    showIcon
                    title={feedback.message}
                    description={feedback.runId ? `运行记录：Run #${feedback.runId}` : undefined}
                  />
                ) : null}
                {feedback?.runId ? (
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => onOpenRecords({ record: "workflow", workflow: selected.id, run: feedback.runId })}
                    >
                      查看 Run #{feedback.runId}
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card padding="none" className="overflow-hidden">
              <CardHeader className="border-b p-6">
                <div className="flex items-center gap-2">
                  <History className="size-4 text-muted-foreground" />
                  <CardTitle className="text-base">版本历史</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="divide-y p-0">
                {selected.versions.map((version) => (
                  <div key={version.version} className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <strong>v{version.version}</strong>
                      <Text size="xs" tone="muted">{version.createdAt} · {version.note}</Text>
                    </div>
                    {version.version !== selected.currentVersion ? (
                      <Button
                        size="small"
                        variant="outline"
                        icon={<RotateCcw />}
                        onClick={() => onRollback(selected.id, version.version)}
                      >
                        回滚到 v{version.version}
                      </Button>
                    ) : <Tag color="primary">当前版本</Tag>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function WorkflowRunDetail({ run }: { run: WorkflowRunFixture }) {
  return (
    <div className="flex flex-col gap-5" aria-label={`Workflow Run #${run.id} 详情`}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Heading level={3}>Run #{run.id} · {run.workflowName}</Heading>
          <RunStatus status={run.status} />
          {run.dryRun ? <Tag>Dry-run</Tag> : null}
        </div>
        <Text tone="muted">{run.startedAt} · Token {run.tokenUsage}</Text>
        {run.errorMessage ? <Alert type="error" showIcon title={run.errorMessage} /> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card padding="base">
          <CardTitle className="text-base">步骤</CardTitle>
          <div className="mt-4 flex flex-col gap-4">
            {run.steps.map((step) => (
              <div key={step.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-sm">{step.name}</strong>
                  <RunStatus status={step.status === "waiting_for_user" ? "waiting_for_user" : step.status} />
                </div>
                <Text size="xs" tone="muted">{step.durationMs} ms · {step.detail}</Text>
              </div>
            ))}
          </div>
        </Card>
        <Card padding="base">
          <CardTitle className="text-base">资源</CardTitle>
          <div className="mt-4 flex flex-col gap-3">
            {run.resources.map((resource, index) => (
              <div key={`${resource.type}-${index}`} className="flex items-center justify-between gap-3">
                <Text size="sm">{resource.label}</Text><Tag>{resource.type}</Tag>
              </div>
            ))}
          </div>
        </Card>
        <Card padding="base">
          <CardTitle className="text-base">交互</CardTitle>
          <div className="mt-4 flex flex-col gap-3">
            {run.interactions.length ? run.interactions.map((interaction, index) => (
              <div key={`${interaction.type}-${index}`}>
                <strong className="text-sm">{interaction.label}</strong>
                <Text size="xs" tone="muted">{interaction.type} · {interaction.status}</Text>
              </div>
            )) : <Text tone="muted">本次运行没有人工交互。</Text>}
          </div>
        </Card>
        <Card padding="base">
          <CardTitle className="text-base">事件</CardTitle>
          <div className="mt-4 flex flex-col gap-3">
            {run.events.map((event, index) => (
              <div key={`${event.type}-${index}`}>
                <strong className="text-sm">{event.type}</strong>
                <Text size="xs" tone="muted">{event.message}</Text>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {run.mediaCandidates.length ? (
        <Card padding="base">
          <CardTitle className="text-base">媒体候选</CardTitle>
          <div className="mt-4 flex flex-col gap-3">
            {run.mediaCandidates.map((candidate) => (
              <div key={candidate.id} className="flex flex-wrap items-center justify-between gap-3">
                <Text size="sm">#{candidate.id} · {candidate.title}</Text>
                <Tag color={candidate.status === "failed" ? "error" : candidate.status === "generated" ? "success" : "warning"}>
                  {candidate.status}
                </Tag>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function AgentRunDetail({ run }: { run: AgentRunFixture }) {
  return (
    <div className="flex flex-col gap-5" aria-label={`Agent Run #${run.id} 详情`}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Heading level={3}>Run #{run.id} · {run.agentName}</Heading>
          <RunStatus status={run.status} />
        </div>
        <Text tone="muted">{run.startedAt} · Token {run.tokenUsage}</Text>
        <Text>{run.summary}</Text>
      </div>
      <Card padding="base">
        <CardTitle className="text-base">Tool Calls</CardTitle>
        <div className="mt-4 flex flex-col gap-4">
          {run.toolCalls.map((call, index) => (
            <div key={`${call.tool}-${index}`} className="border-t pt-4 first:border-t-0 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-sm">{call.tool}</strong>
                <Tag color={call.status === "succeeded" ? "success" : "error"}>{call.status}</Tag>
              </div>
              <Text size="xs" tone="muted">{call.detail}</Text>
            </div>
          ))}
        </div>
      </Card>
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
  const [selectedWorkflowRunId, setSelectedWorkflowRunId] = useState(
    initialRecord === "workflow" ? initialRunId ?? fixture.workflowRuns[0]?.id ?? 0 : 0,
  );
  const [selectedAgentRunId, setSelectedAgentRunId] = useState(
    initialRecord === "agent" ? initialRunId ?? fixture.agentRuns[0]?.id ?? 0 : fixture.agentRuns[0]?.id ?? 0,
  );

  const workflowRuns = useMemo(() => {
    return fixture.workflowRuns.filter((run) => {
      if (workflowId && run.workflowId !== workflowId) return false;
      if (status && run.status !== status) return false;
      return true;
    });
  }, [fixture.workflowRuns, status, workflowId]);
  const selectedWorkflowRun = fixture.workflowRuns.find((run) => run.id === selectedWorkflowRunId) ?? workflowRuns[0] ?? null;
  const selectedAgentRun = fixture.agentRuns.find((run) => run.id === selectedAgentRunId) ?? fixture.agentRuns[0] ?? null;

  const selectRecord = (next: "workflow" | "agent") => {
    setRecord(next);
    onRouteChange({ record: next });
  };

  return (
    <div className="flex flex-col gap-6" aria-label="运行中心">
      <Card padding="base">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Heading level={2}>运行中心</Heading>
            <Text tone="muted">从运行记录追溯步骤、资源、人工交互、事件和 Tool Call，而不是只看最终状态。</Text>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="运行中心类型">
            <Button variant={record === "workflow" ? "solid" : "outline"} color={record === "workflow" ? "primary" : undefined} onClick={() => selectRecord("workflow")} icon={<GitBranch />}>
              Workflow 任务
            </Button>
            <Button variant={record === "agent" ? "solid" : "outline"} color={record === "agent" ? "primary" : undefined} onClick={() => selectRecord("agent")} icon={<Clock3 />}>
              Agent 运行
            </Button>
          </div>
        </div>
      </Card>

      {record === "workflow" ? (
        <div className="flex flex-col gap-6">
          <Card padding="base">
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                aria-label="按 Workflow 筛选运行"
                value={String(workflowId)}
                onChange={(value) => {
                  const next = Number(value) || 0;
                  setWorkflowId(next);
                  onRouteChange({ record: "workflow", workflow: next || undefined });
                }}
              >
                <option value="0">全部 Workflow</option>
                {fixture.workflows.map((workflow) => <option key={workflow.id} value={workflow.id}>{workflow.name}</option>)}
              </Select>
              <Select aria-label="按状态筛选 Workflow 运行" value={status} onChange={(value) => setStatus(String(value))}>
                <option value="">全部状态</option>
                <option value="succeeded">成功</option>
                <option value="failed">失败</option>
                <option value="awaiting_approval">等待审批</option>
                <option value="waiting_for_user">等待用户</option>
              </Select>
            </div>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.75fr)]">
            <Card padding="none" className="overflow-hidden">
              <CardHeader className="border-b p-6"><CardTitle className="text-base">Workflow Runs</CardTitle></CardHeader>
              <CardContent className="divide-y p-0">
                {workflowRuns.length ? workflowRuns.map((run) => (
                  <button
                    key={run.id}
                    type="button"
                    aria-pressed={selectedWorkflowRun?.id === run.id}
                    className="flex w-full items-start justify-between gap-4 p-6 text-left hover:bg-muted/40"
                    onClick={() => {
                      setSelectedWorkflowRunId(run.id);
                      onRouteChange({ record: "workflow", workflow: run.workflowId, run: run.id });
                    }}
                  >
                    <div>
                      <strong className="text-sm">Run #{run.id}</strong>
                      <Text size="xs" tone="muted">{run.workflowName} · {run.startedAt}</Text>
                    </div>
                    <div className="flex flex-col items-end gap-1"><RunStatus status={run.status} />{run.dryRun ? <Tag>Dry-run</Tag> : null}</div>
                  </button>
                )) : <div className="p-6"><Text tone="muted">没有符合条件的 Workflow Run。</Text></div>}
              </CardContent>
            </Card>
            {selectedWorkflowRun ? <WorkflowRunDetail run={selectedWorkflowRun} /> : null}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.75fr)]">
          <Card padding="none" className="overflow-hidden">
            <CardHeader className="border-b p-6"><CardTitle className="text-base">Agent Runs</CardTitle></CardHeader>
            <CardContent className="divide-y p-0">
              {fixture.agentRuns.map((run) => (
                <button
                  key={run.id}
                  type="button"
                  aria-pressed={selectedAgentRun?.id === run.id}
                  className="flex w-full items-start justify-between gap-4 p-6 text-left hover:bg-muted/40"
                  onClick={() => {
                    setSelectedAgentRunId(run.id);
                    onRouteChange({ record: "agent", run: run.id });
                  }}
                >
                  <div><strong className="text-sm">Run #{run.id}</strong><Text size="xs" tone="muted">{run.agentName} · {run.startedAt}</Text></div>
                  <RunStatus status={run.status} />
                </button>
              ))}
            </CardContent>
          </Card>
          {selectedAgentRun ? <AgentRunDetail run={selectedAgentRun} /> : null}
        </div>
      )}
    </div>
  );
}
