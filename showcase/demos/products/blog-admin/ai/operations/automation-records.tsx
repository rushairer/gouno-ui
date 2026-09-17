import { useMemo, useState } from "react";
import { Clock3, GitBranch } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

export type AIOpsRecordsTarget = {
  record: "workflow" | "agent";
  workflow?: number;
  run?: number;
};

function RunStatus({ status }: { status: WorkflowRunStatus | AgentRunFixture["status"] }) {
  if (status === "succeeded") return <Tag color="success">成功</Tag>;
  if (status === "failed") return <Tag color="error">失败</Tag>;
  if (status === "awaiting_approval") return <Tag color="warning">等待审批</Tag>;
  if (status === "waiting_for_user") return <Tag color="warning">等待用户</Tag>;
  if (status === "running") return <Tag color="primary">运行中</Tag>;
  return <Tag>已排队</Tag>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="min-w-0 py-2">
      <Text size="xs" tone="muted">{label}</Text>
      <strong className="mt-1 block text-sm">{value}</strong>
      {detail ? <Text size="xs" tone="muted">{detail}</Text> : null}
    </div>
  );
}

function WorkflowRunDetail({ run }: { run: WorkflowRunFixture }) {
  const finished = run.finishedAt || "仍在运行";

  return (
    <div className="flex min-w-0 flex-col gap-5" aria-label={`Workflow Run #${run.id} 详情`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Heading level={3}>Run #{run.id} · {run.workflowName}</Heading>
              <RunStatus status={run.status} />
              {run.dryRun ? <Tag>Dry-run</Tag> : null}
            </div>
            <Text className="mt-1" tone="muted">一次运行就是一份可追溯证据：执行步骤、资源、人工交互与事件都保留在这里。</Text>
          </div>
        </div>

        <div className="grid border-y py-3 sm:grid-cols-2 xl:grid-cols-4 xl:divide-x">
          <div className="xl:pr-4"><Metric label="开始时间" value={run.startedAt} /></div>
          <div className="xl:px-4"><Metric label="结束时间" value={finished} /></div>
          <div className="xl:px-4"><Metric label="Token" value={String(run.tokenUsage)} /></div>
          <div className="xl:pl-4"><Metric label="执行步骤" value={String(run.steps.length)} /></div>
        </div>

        {run.errorMessage ? (
          <Alert
            type="error"
            showIcon
            title="运行失败"
            description={run.errorMessage}
          />
        ) : null}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.2fr)]">
        <Card padding="none" className="overflow-hidden">
          <CardHeader className="border-b p-6">
            <CardTitle className="text-base">执行过程</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {run.steps.map((step, index) => (
                <div key={step.id} className="flex gap-4 p-6">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-sm">{step.name}</strong>
                      <RunStatus status={step.status === "waiting_for_user" ? "waiting_for_user" : step.status} />
                    </div>
                    <Text size="xs" tone="muted">{step.durationMs} ms</Text>
                    <Text size="sm" className="mt-1">{step.detail}</Text>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex min-w-0 flex-col gap-5">
          <Card padding="none" className="overflow-hidden">
            <CardHeader className="border-b p-6">
              <CardTitle className="text-base">运行证据</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <section>
                  <strong className="text-sm">资源</strong>
                  <div className="mt-3 flex flex-col gap-3">
                    {run.resources.length ? run.resources.map((resource, index) => (
                      <div key={`${resource.type}-${index}`} className="flex items-center justify-between gap-3">
                        <Text size="sm">{resource.label}</Text>
                        <Tag>{resource.type}</Tag>
                      </div>
                    )) : <Text size="sm" tone="muted">该运行没有结构化资源快照。</Text>}
                  </div>
                </section>
                <section>
                  <strong className="text-sm">人工交互</strong>
                  <div className="mt-3 flex flex-col gap-3">
                    {run.interactions.length ? run.interactions.map((interaction, index) => (
                      <div key={`${interaction.type}-${index}`}>
                        <Text size="sm">{interaction.label}</Text>
                        <Text size="xs" tone="muted">{interaction.type} · {interaction.status}</Text>
                      </div>
                    )) : <Text size="sm" tone="muted">本次运行没有人工交互。</Text>}
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <CardHeader className="border-b p-6">
              <CardTitle className="text-base">事件</CardTitle>
            </CardHeader>
            <CardContent className="divide-y p-0">
              {run.events.map((event, index) => (
                <div key={`${event.type}-${index}`} className="p-6">
                  <strong className="font-mono text-xs">{event.type}</strong>
                  <Text size="sm" tone="muted">{event.message}</Text>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {run.mediaCandidates.length ? (
        <Card padding="none" className="overflow-hidden">
          <CardHeader className="border-b p-6"><CardTitle className="text-base">媒体候选</CardTitle></CardHeader>
          <CardContent className="divide-y p-0">
            {run.mediaCandidates.map((candidate) => (
              <div key={candidate.id} className="flex flex-wrap items-center justify-between gap-3 p-6">
                <Text size="sm">#{candidate.id} · {candidate.title}</Text>
                <Tag color={candidate.status === "failed" ? "error" : candidate.status === "generated" ? "success" : "warning"}>
                  {candidate.status}
                </Tag>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function AgentRunDetail({ run }: { run: AgentRunFixture }) {
  return (
    <div className="flex min-w-0 flex-col gap-5" aria-label={`Agent Run #${run.id} 详情`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Heading level={3}>Run #{run.id} · {run.agentName}</Heading>
          <RunStatus status={run.status} />
        </div>
        <Text>{run.summary}</Text>
        <div className="grid border-y py-3 sm:grid-cols-3 sm:divide-x">
          <div className="sm:pr-4"><Metric label="开始时间" value={run.startedAt} /></div>
          <div className="sm:px-4"><Metric label="结束时间" value={run.finishedAt || "仍在运行"} /></div>
          <div className="sm:pl-4"><Metric label="Token" value={String(run.tokenUsage)} /></div>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <CardHeader className="border-b p-6">
          <CardTitle className="text-base">Tool Calls</CardTitle>
        </CardHeader>
        <CardContent className="divide-y p-0">
          {run.toolCalls.map((call, index) => (
            <div key={`${call.tool}-${index}`} className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="font-mono text-sm">{call.tool}</strong>
                <Tag color={call.status === "succeeded" ? "success" : "error"}>{call.status}</Tag>
              </div>
              <Text size="sm" tone="muted" className="mt-1">{call.detail}</Text>
            </div>
          ))}
        </CardContent>
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

  const workflowRuns = useMemo(() => fixture.workflowRuns.filter((run) => {
    if (workflowId && run.workflowId !== workflowId) return false;
    if (status && run.status !== status) return false;
    return true;
  }), [fixture.workflowRuns, status, workflowId]);

  const selectedWorkflowRun = workflowRuns.find((run) => run.id === selectedWorkflowRunId) ?? workflowRuns[0] ?? null;
  const selectedAgentRun = fixture.agentRuns.find((run) => run.id === selectedAgentRunId) ?? fixture.agentRuns[0] ?? null;

  const selectRecord = (next: "workflow" | "agent") => {
    setRecord(next);
    onRouteChange({ record: next });
  };

  return (
    <div className="flex flex-col gap-5" aria-label="运行中心">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Heading level={2}>运行中心</Heading>
          <Text tone="muted">从一次 Run 追溯步骤、资源、人工交互、事件和 Tool Call，而不是只看最终状态。</Text>
        </div>
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
      </div>

      {record === "workflow" ? (
        <div className="flex flex-col gap-5">
          <div className="grid gap-3 md:grid-cols-2">
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
              {fixture.workflows.map((workflow) => (
                <option key={workflow.id} value={workflow.id}>{workflow.name}</option>
              ))}
            </Select>
            <Select
              aria-label="按状态筛选 Workflow 运行"
              placeholder="全部状态"
              value={status}
              onChange={(value) => setStatus(String(value))}
            >
              <option value="">全部状态</option>
              <option value="succeeded">成功</option>
              <option value="failed">失败</option>
              <option value="awaiting_approval">等待审批</option>
              <option value="waiting_for_user">等待用户</option>
            </Select>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(15rem,0.62fr)_minmax(0,1.8fr)]">
            <Card padding="none" className="overflow-hidden">
              <CardHeader className="border-b p-6"><CardTitle className="text-base">Workflow Runs</CardTitle></CardHeader>
              <CardContent className="divide-y p-0">
                {workflowRuns.length ? workflowRuns.map((run) => (
                  <Button
                    key={run.id}
                    type="button"
                    variant="ghost"
                    aria-pressed={selectedWorkflowRun?.id === run.id}
                    className="flex h-auto w-full items-start justify-between gap-3 whitespace-normal rounded-none p-6 text-left aria-pressed:bg-accent/30"
                    onClick={() => {
                      setSelectedWorkflowRunId(run.id);
                      onRouteChange({ record: "workflow", workflow: run.workflowId, run: run.id });
                    }}
                  >
                    <div className="min-w-0">
                      <strong className="block text-sm">Run #{run.id}</strong>
                      <Text size="xs" tone="muted">{run.workflowName} · {run.startedAt}</Text>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <RunStatus status={run.status} />
                      {run.dryRun ? <Tag>Dry-run</Tag> : null}
                    </div>
                  </Button>
                )) : <div className="p-6"><Text tone="muted">没有符合条件的 Workflow Run。</Text></div>}
              </CardContent>
            </Card>
            {selectedWorkflowRun ? <WorkflowRunDetail run={selectedWorkflowRun} /> : null}
          </div>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(15rem,0.62fr)_minmax(0,1.8fr)]">
          <Card padding="none" className="overflow-hidden">
            <CardHeader className="border-b p-6"><CardTitle className="text-base">Agent Runs</CardTitle></CardHeader>
            <CardContent className="divide-y p-0">
              {fixture.agentRuns.map((run) => (
                <Button
                  key={run.id}
                  type="button"
                  variant="ghost"
                  aria-pressed={selectedAgentRun?.id === run.id}
                  className="flex h-auto w-full items-start justify-between gap-3 whitespace-normal rounded-none p-6 text-left aria-pressed:bg-accent/30"
                  onClick={() => {
                    setSelectedAgentRunId(run.id);
                    onRouteChange({ record: "agent", run: run.id });
                  }}
                >
                  <div className="min-w-0">
                    <strong className="block text-sm">Run #{run.id}</strong>
                    <Text size="xs" tone="muted">{run.agentName} · {run.startedAt}</Text>
                  </div>
                  <RunStatus status={run.status} />
                </Button>
              ))}
            </CardContent>
          </Card>
          {selectedAgentRun ? <AgentRunDetail run={selectedAgentRun} /> : null}
        </div>
      )}
    </div>
  );
}
