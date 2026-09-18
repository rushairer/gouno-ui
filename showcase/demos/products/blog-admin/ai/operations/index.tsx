import { useState, type ReactNode } from "react";
import {
  Clock3,
  GitBranch,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Segmented,
  Skeleton,
  TabPanel,
  Tabs,
  Tag,
} from "../../../../../../src/core";
import { PageHeader } from "../../../../../../src/gouno";
import { FixtureDock } from "../../../../../components/fixture-dock";
import { TabPanelFeedback, TabPanelLead } from "../../../../../components/tab-panel-lead";
import { AutomationManagement } from "./automation-management";
import {
  AIOpsRecordsPanel,
  type AIOpsRecordsTarget,
} from "./automation-records";
import {
  aiOpsAutomationRecordsFixture,
  type AIOpsAutomationRecordsFixture,
  type WorkflowFixture,
  type WorkflowRunFixture,
} from "./automation-records-fixtures";
import { WorkflowExecutionPanel } from "./workflow-execution";
import { aiOpsDecisionFixture, type AIOpsDecisionFixture, type AIOpsTab } from "./fixtures";
import { AIOpsInboxPanel, AIOpsOverviewPanel } from "./overview-inbox";
import { FixtureNotification } from "../../fixture-notification";

export type AIOpsRecordType = "workflow" | "agent";
export type AIOpsRouteState = {
  tab: AIOpsTab;
  record: AIOpsRecordType;
  workflow?: number;
  run?: number;
};

type FixtureScenario = "data" | "loading" | "error";
type OperationScenario = "success" | "run-failure" | "approval-failure";
type Notice = { type: "success" | "error"; text: string } | null;

const validTabs = new Set<AIOpsTab>(["overview", "inbox", "automation", "records"]);
const validRecordTypes = new Set<AIOpsRecordType>(["workflow", "agent"]);

function positiveInt(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

export function parseAIOpsRoute(value: string): AIOpsRouteState {
  const query = value.includes("?") ? value.slice(value.indexOf("?") + 1) : value.replace(/^\?/, "");
  const params = new URLSearchParams(query);
  const requestedTab = params.get("tab") as AIOpsTab | null;
  const requestedRecord = params.get("record") as AIOpsRecordType | null;
  const tab = requestedTab && validTabs.has(requestedTab) ? requestedTab : "overview";
  const record = requestedRecord && validRecordTypes.has(requestedRecord) ? requestedRecord : "workflow";
  return {
    tab,
    record,
    workflow: record === "workflow" ? positiveInt(params.get("workflow")) : undefined,
    run: positiveInt(params.get("run")),
  };
}

export function formatAIOpsRoute(route: AIOpsRouteState): string {
  const params = new URLSearchParams();
  if (route.tab !== "overview") params.set("tab", route.tab);
  if (route.tab === "records") {
    params.set("record", route.record);
    if (route.record === "workflow" && route.workflow) params.set("workflow", String(route.workflow));
    if (route.run) params.set("run", String(route.run));
  } else if (route.tab === "automation" && route.workflow) {
    params.set("workflow", String(route.workflow));
  }
  const query = params.toString();
  return `/admin/ai-ops${query ? `?${query}` : ""}`;
}

function cloneDecisionFixture(): AIOpsDecisionFixture {
  return {
    ...aiOpsDecisionFixture,
    approvals: aiOpsDecisionFixture.approvals.map((item) => ({
      ...item,
      proposal: {
        ...item.proposal,
        suggestions: item.proposal.suggestions ? [...item.proposal.suggestions] : undefined,
      },
      beforeSnapshot: item.beforeSnapshot ? { ...item.beforeSnapshot } : undefined,
    })),
    interactions: aiOpsDecisionFixture.interactions.map((item) => ({
      ...item,
      options: item.options ? [...item.options] : undefined,
    })),
    operations: {
      suggestions: aiOpsDecisionFixture.operations.suggestions.map((item) => ({ ...item, evidence: [...item.evidence] })),
      candidateSets: aiOpsDecisionFixture.operations.candidateSets.map((item) => ({
        ...item,
        candidates: item.candidates.map((candidate) => ({ ...candidate })),
      })),
      mediaCandidates: aiOpsDecisionFixture.operations.mediaCandidates.map((item) => ({ ...item })),
      editorialTasks: aiOpsDecisionFixture.operations.editorialTasks.map((item) => ({ ...item })),
    },
  };
}

function cloneAutomationFixture(): AIOpsAutomationRecordsFixture {
  return {
    workflows: aiOpsAutomationRecordsFixture.workflows.map((workflow) => ({
      ...workflow,
      discoveryTools: [...workflow.discoveryTools],
      inputFields: workflow.inputFields.map((field) => ({ ...field })),
      steps: workflow.steps.map((step) => ({ ...step })),
      input: { ...workflow.input },
      metrics: { ...workflow.metrics },
      latestRun: workflow.latestRun ? { ...workflow.latestRun } : undefined,
      versions: workflow.versions.map((version) => ({ ...version })),
    })),
    workflowRuns: aiOpsAutomationRecordsFixture.workflowRuns.map((run) => ({
      ...run,
      steps: run.steps.map((step) => ({ ...step })),
      resources: run.resources.map((resource) => ({ ...resource })),
      interactions: run.interactions.map((interaction) => ({
        ...interaction,
        options: interaction.options ? [...interaction.options] : undefined,
      })),
      events: run.events.map((event) => ({ ...event })),
      mediaCandidates: run.mediaCandidates.map((candidate) => ({ ...candidate })),
    })),
    agentRuns: aiOpsAutomationRecordsFixture.agentRuns.map((run) => ({
      ...run,
      citations: run.citations?.map((citation) => ({ ...citation })),
      toolCalls: run.toolCalls.map((call) => ({ ...call })),
    })),
  };
}

function pendingDecisionCount(fixture: AIOpsDecisionFixture) {
  return (
    fixture.interactions.length +
    fixture.approvals.filter((item) => item.status === "pending" || item.status === "failed").length +
    fixture.operations.suggestions.filter((item) => item.status === "new").length +
    fixture.operations.candidateSets.filter((item) => item.status === "pending").length +
    fixture.operations.mediaCandidates.filter((item) => ["brief_ready", "ready_to_generate", "failed"].includes(item.status)).length +
    fixture.operations.editorialTasks.filter((item) => item.status === "open").length
  );
}

function LoadingSurface() {
  return (
    <div className="grid gap-6 xl:grid-cols-[19rem_minmax(0,1fr)]" aria-label="AI 运营加载中">
      <Card padding="base"><Skeleton className="h-80 w-full" /></Card>
      <Card padding="base"><Skeleton className="h-80 w-full" /></Card>
    </div>
  );
}

function tabLabel(label: string, icon: ReactNode, badge?: number) {
  return (
    <span className="inline-flex items-center gap-2">
      {icon}
      <span>{label}</span>
      {badge ? <Tag color="warning">{badge}</Tag> : null}
    </span>
  );
}

export function BlogAdminAIOperationsDemo({
  initialRoute = { tab: "overview", record: "workflow" },
}: {
  initialRoute?: AIOpsRouteState;
}) {
  const [route, setRoute] = useState<AIOpsRouteState>(initialRoute);
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [operationScenario, setOperationScenario] = useState<OperationScenario>("success");
  const [decisionFixture, setDecisionFixture] = useState(cloneDecisionFixture);
  const [automationRecordsFixture, setAutomationRecordsFixture] = useState(cloneAutomationFixture);
  const [selectedApprovalId, setSelectedApprovalId] = useState<number | null>(decisionFixture.approvals[0]?.id ?? null);
  const [notice, setNotice] = useState<Notice>(null);

  const selectTab = (tab: AIOpsTab) => {
    setRoute((current) => ({ ...current, tab }));
    setNotice(null);
  };

  const selectWorkflow = (workflow: WorkflowFixture) => {
    setRoute((current) => ({ ...current, tab: "automation", record: "workflow", workflow: workflow.id, run: undefined }));
    setNotice(null);
  };

  const openRecords = (target: AIOpsRecordsTarget) => {
    setRoute({
      tab: "records",
      record: target.record,
      workflow: target.record === "workflow" ? target.workflow : undefined,
      run: target.run,
    });
  };

  const updateRecordsRoute = (target: AIOpsRecordsTarget) => {
    setRoute((current) => ({
      tab: "records",
      record: target.record,
      workflow:
        target.record === "workflow"
          ? target.workflow ?? (current.record === "workflow" ? current.workflow : undefined)
          : undefined,
      run: target.run,
    }));
  };

  const reviewApproval = (id: number, approved: boolean) => {
    if (approved && operationScenario === "approval-failure") {
      setDecisionFixture((current) => ({
        ...current,
        approvals: current.approvals.map((item) =>
          item.id === id
            ? { ...item, status: "failed", reviewNote: "下游执行失败；审批提案已保留，可修正后再次重试。" }
            : item,
        ),
      }));
      setNotice({ type: "error", text: `审批 #${id} 执行失败；提案未丢失，仍可从待我处理重试。` });
      return;
    }

    setDecisionFixture((current) => ({
      ...current,
      approvals: current.approvals.map((item) =>
        item.id === id ? { ...item, status: approved ? "approved" : "rejected" } : item,
      ),
    }));
    setNotice({ type: "success", text: approved ? `审批 #${id} 已批准，后续执行仍受 Workflow 运行状态约束。` : `审批 #${id} 已拒绝。` });
  };

  const saveWorkflow = (workflow: WorkflowFixture) => {
    setAutomationRecordsFixture((current) => ({
      ...current,
      workflows: current.workflows.some((item) => item.id === workflow.id)
        ? current.workflows.map((item) => item.id === workflow.id ? workflow : item)
        : [...current.workflows, workflow],
    }));
    setRoute((current) => ({ ...current, tab: "automation", record: "workflow", workflow: workflow.id, run: undefined }));
    setNotice({ type: "success", text: `${workflow.name} 已保存，当前版本 v${workflow.currentVersion}。` });
  };

  const deleteWorkflow = (workflow: WorkflowFixture) => {
    setAutomationRecordsFixture((current) => ({
      ...current,
      workflows: current.workflows.filter((item) => item.id !== workflow.id),
      workflowRuns: current.workflowRuns.filter((run) => run.workflowId !== workflow.id),
    }));
    setRoute((current) => current.workflow === workflow.id
      ? { ...current, tab: "automation", record: "workflow", workflow: undefined, run: undefined }
      : current);
    setNotice({ type: "success", text: `${workflow.name} 已从静态 Fixture 删除。` });
  };

  const toggleWorkflow = (workflow: WorkflowFixture) => {
    setAutomationRecordsFixture((current) => ({
      ...current,
      workflows: current.workflows.map((item) => item.id === workflow.id ? {
        ...item,
        enabled: !item.enabled,
        nextRunAt: item.enabled ? "—" : "待重新计算",
      } : item),
    }));
    setNotice({ type: "success", text: `${workflow.name} 已${workflow.enabled ? "停用" : "启用"}。` });
  };

  const rollbackWorkflow = (workflowId: number, version: number) => {
    setAutomationRecordsFixture((current) => ({
      ...current,
      workflows: current.workflows.map((workflow) => workflow.id === workflowId ? { ...workflow, currentVersion: version } : workflow),
    }));
    setNotice({ type: "success", text: `Workflow #${workflowId} 已回滚到 v${version}。` });
  };

  const runWorkflow = async (workflowId: number, dryRun: boolean): Promise<{ id: number; status: WorkflowRunFixture["status"] }> => {
    const workflow = automationRecordsFixture.workflows.find((item) => item.id === workflowId);
    if (!workflow) throw new Error("Workflow 不存在。");
    const id = automationRecordsFixture.workflowRuns.reduce((highest, run) => Math.max(highest, run.id), 0) + 1;
    const failed = operationScenario === "run-failure" && !dryRun;
    const status: WorkflowRunFixture["status"] = failed ? "failed" : dryRun ? "succeeded" : "awaiting_approval";
    const tokenUsage = failed ? 640 : dryRun ? 320 : 1180;
    const outputSummary = failed
      ? "读取运营事件时失败，未产生候选结果。"
      : dryRun
        ? "Preflight 与受控输入验证通过，未写入产品数据。"
        : "候选结果已生成，等待人工审批。";
    const run: WorkflowRunFixture = {
      id,
      workflowId,
      workflowName: workflow.name,
      workflowVersion: workflow.currentVersion,
      status,
      dryRun,
      startedAt: "刚刚",
      finishedAt: failed || dryRun ? "刚刚" : undefined,
      inputTokens: failed ? 640 : dryRun ? 200 : 760,
      outputTokens: failed ? 0 : dryRun ? 120 : 420,
      tokenUsage,
      triggeredBy: "admin",
      outputSummary,
      errorCode: failed ? "tool_execution_failed" : undefined,
      errorMessage: failed ? "query_events failed: column reference event_key is ambiguous" : undefined,
      steps: [{
        id: failed ? "query-events" : dryRun ? "dry-run" : "candidate",
        name: failed ? "读取运营事件" : dryRun ? "验证 Workflow 配置" : "生成候选结果",
        type: failed ? "resource_query" : dryRun ? "output" : "model",
        status: failed ? "failed" : "succeeded",
        durationMs: failed ? 410 : dryRun ? 260 : 840,
        detail: outputSummary,
        errorMessage: failed ? "column reference event_key is ambiguous" : undefined,
      }],
      resources: failed || dryRun ? [] : [{ type: "candidate", label: `${workflow.name} 候选结果`, source: "manual", accessLevel: "target" }],
      interactions: failed || dryRun ? [] : [{ id: id + 1000, type: "approval", label: "确认应用候选结果", status: "pending", stepId: "approval" }],
      events: [
        { type: "run_started", message: `${dryRun ? "Dry-run" : "Run"} requested from Showcase`, createdAt: "刚刚" },
        {
          type: failed ? "run_failed" : dryRun ? "run_succeeded" : "approval_created",
          message: failed ? "query_events failed before candidate generation" : dryRun ? "No writes applied" : "Approval fixture created",
          createdAt: "刚刚",
        },
      ],
      mediaCandidates: [],
    };
    setAutomationRecordsFixture((current) => ({
      ...current,
      workflowRuns: [run, ...current.workflowRuns],
      workflows: current.workflows.map((item) => item.id === workflowId ? {
        ...item,
        metrics: {
          runs: item.metrics.runs + 1,
          failures: item.metrics.failures + (failed ? 1 : 0),
          tokens: item.metrics.tokens + run.tokenUsage,
        },
        latestRun: { id, status, at: "刚刚", summary: outputSummary },
      } : item),
    }));
    return { id, status };
  };

  const tabs = [
    { key: "overview", label: tabLabel("概览", <Sparkles aria-hidden="true" className="size-4" />) },
    { key: "inbox", label: tabLabel("待我处理", <ShieldCheck aria-hidden="true" className="size-4" />, pendingDecisionCount(decisionFixture)) },
    { key: "automation", label: tabLabel("自动化", <GitBranch aria-hidden="true" className="size-4" />) },
    { key: "records", label: tabLabel("运行中心", <Clock3 aria-hidden="true" className="size-4" />) },
  ] as const;

  const selectedWorkflow = route.workflow
    ? automationRecordsFixture.workflows.find((item) => item.id === route.workflow) ?? automationRecordsFixture.workflows[0] ?? null
    : automationRecordsFixture.workflows[0] ?? null;
  const recordsFixture = route.record === "workflow" && route.workflow
    ? {
        ...automationRecordsFixture,
        workflowRuns: automationRecordsFixture.workflowRuns.filter((item) => item.workflowId === route.workflow),
      }
    : automationRecordsFixture;

  const panelDescriptions: Record<AIOpsTab, string> = {
    overview: "先处理失败与等待人工的运行，再决定建议、候选和后续编辑任务；AI 不会绕过人工边界直接发布内容。",
    inbox: "把审批、选择、确认、运营建议和后续编辑任务放进同一人工决策队列，而不是分散成多个互不相关的卡片区。",
    automation: "Workflow 是持续运行的版本化自动化资产。先判断状态与最近结果，再进入定义、边界和人工执行。",
    records: "从一次 Run 追溯执行步骤、资源边界、人工交互、媒体候选、Tool Call 与持久化事件；这里是证据中心，不是 Workflow 配置页。",
  };

  let content: ReactNode = null;
  if (scenario === "loading") {
    content = (
      <div className="flex flex-col gap-5">
        <TabPanelLead description={panelDescriptions[route.tab]} />
        <LoadingSurface />
      </div>
    );
  } else if (scenario === "error") {
    content = (
      <div className="flex flex-col gap-5">
        <TabPanelLead description={panelDescriptions[route.tab]} />
        <TabPanelFeedback>
          <Alert type="error" showIcon title="AI 运营数据加载失败" description="Showcase 模拟真实聚合请求失败；刷新后可重新加载，不会丢失产品数据。" />
        </TabPanelFeedback>
      </div>
    );
  } else if (route.tab === "overview") {
    content = <AIOpsOverviewPanel fixture={decisionFixture} automation={automationRecordsFixture} onNavigate={selectTab} />;
  } else if (route.tab === "inbox") {
    content = (
      <AIOpsInboxPanel
        fixture={decisionFixture}
        selectedApprovalId={selectedApprovalId}
        onSelectApproval={setSelectedApprovalId}
        onReviewApproval={(approval, approved) => reviewApproval(approval.id, approved)}
        onResolveInteraction={(task, response) => {
          setDecisionFixture((current) => ({ ...current, interactions: current.interactions.filter((item) => item.id !== task.id) }));
          setNotice({ type: "success", text: `Run #${task.workflowRunId} 已收到交互响应：${JSON.stringify(response)}` });
        }}
        onOpenOperation={(kind, id) => setNotice({ type: "success", text: `已打开 ${kind} #${id} 的产品处理入口。` })}
      />
    );
  } else if (route.tab === "automation") {
    content = (
      <AutomationManagement
        workflows={automationRecordsFixture.workflows}
        workflowRuns={automationRecordsFixture.workflowRuns}
        selectedWorkflowId={selectedWorkflow?.id}
        onSave={saveWorkflow}
        onDelete={deleteWorkflow}
        onToggle={toggleWorkflow}
        onSelect={selectWorkflow}
        onOpenRecords={(workflow) => openRecords({ record: "workflow", workflow: workflow.id })}
        onOpenRun={(run) => openRecords({ record: "workflow", workflow: run.workflowId, run: run.id })}
        detailContent={selectedWorkflow ? (
          <WorkflowExecutionPanel
            workflow={selectedWorkflow}
            onPreflight={async () => ({ ready: true })}
            onRun={async (workflowId, dryRun) => runWorkflow(workflowId, dryRun)}
            onRollback={rollbackWorkflow}
            onOpenRecords={openRecords}
          />
        ) : undefined}
      />
    );
  } else {
    content = (
      <AIOpsRecordsPanel
        fixture={recordsFixture}
        initialRecord={route.record}
        initialRunId={route.run}
        onRouteChange={updateRecordsRoute}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route={formatAIOpsRoute(route)}
        note="AI 运营 Fixture 已按 Blog Admin 当前真实对象与 API 能力重建：人工决策、Workflow 资产、异步 Run 与证据链保持同一产品语义。"
        controls={(
          <div className="flex flex-col gap-3">
            <Segmented<FixtureScenario>
              aria-label="AI Ops 场景"
              options={[
                { value: "data", label: "数据" },
                { value: "loading", label: "加载" },
                { value: "error", label: "错误" },
              ]}
              value={scenario}
              onChange={setScenario}
            />
            <Segmented<OperationScenario>
              aria-label="AI Ops 操作场景"
              options={[
                { value: "success", label: "操作成功" },
                { value: "run-failure", label: "运行失败" },
                { value: "approval-failure", label: "审批重试失败" },
              ]}
              value={operationScenario}
              onChange={(value) => { setOperationScenario(value); setNotice(null); }}
            />
          </div>
        )}
      />
      <PageHeader
        title="AI 运营"
        description="观察运营信号、处理人工决策、管理自动化，并从 Run 追溯真实执行证据。"
        actions={<Button variant="outline" icon={<RefreshCw />} onClick={() => { setScenario("data"); setNotice({ type: "success", text: "AI 运营数据已刷新。" }); }}>刷新</Button>}
      />
      <Tabs<AIOpsTab> activeKey={route.tab} items={tabs} onChange={selectTab} ariaLabel="AI 运营工作区">
        <TabPanel value={route.tab}>
          <FixtureNotification notice={notice} onConsumed={() => setNotice(null)} />
          {content}
        </TabPanel>
      </Tabs>
    </div>
  );
}

export { aiOpsDecisionFixture, aiOpsAutomationRecordsFixture };
