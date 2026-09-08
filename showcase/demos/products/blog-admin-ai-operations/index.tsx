import { useState, type ReactNode } from "react";
import {
  Bot,
  Clock3,
  GitBranch,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Segmented,
  Skeleton,
  Tabs,
  Tag,
} from "../../../../src/core";
import { PageHeader } from "../../../../src/gouno";
import { FixtureDock } from "../../../components/fixture-dock";
import { AIOpsAdvancedPanel } from "./advanced";
import {
  aiOpsAdvancedFixture,
  type AIOpsAdvancedFixture,
  type AIOpsAdvancedSection,
  type AgentFixture,
  type ProviderFixture,
  type SkillFixture,
} from "./advanced-fixtures";
import {
  AIOpsAutomationPanel,
  AIOpsRecordsPanel,
  type AIOpsRecordsTarget,
} from "./automation-records";
import { aiOpsAutomationRecordsFixture } from "./automation-records-fixtures";
import { aiOpsDecisionFixture, type AIOpsDecisionFixture, type AIOpsTab } from "./fixtures";
import { AIOpsInboxPanel, AIOpsOverviewPanel } from "./overview-inbox";

export type AIOpsRecordType = "workflow" | "agent";
export type AIOpsRouteState = {
  tab: AIOpsTab;
  record: AIOpsRecordType;
  workflow?: number;
  run?: number;
};

type FixtureScenario = "data" | "loading" | "error";

const validTabs = new Set<AIOpsTab>(["overview", "inbox", "automation", "records", "advanced"]);
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
    approvals: aiOpsDecisionFixture.approvals.map((item) => ({ ...item, proposal: { ...item.proposal } })),
    interactions: aiOpsDecisionFixture.interactions.map((item) => ({ ...item, options: item.options ? [...item.options] : undefined })),
    operations: {
      suggestions: aiOpsDecisionFixture.operations.suggestions.map((item) => ({ ...item })),
      candidateSets: aiOpsDecisionFixture.operations.candidateSets.map((item) => ({ ...item })),
      mediaCandidates: aiOpsDecisionFixture.operations.mediaCandidates.map((item) => ({ ...item })),
      editorialTasks: aiOpsDecisionFixture.operations.editorialTasks.map((item) => ({ ...item })),
    },
  };
}

function cloneAdvancedFixture(): AIOpsAdvancedFixture {
  return {
    ...aiOpsAdvancedFixture,
    agents: aiOpsAdvancedFixture.agents.map((item) => ({ ...item, capabilities: [...item.capabilities] })),
    skills: aiOpsAdvancedFixture.skills.map((item) => ({ ...item, capabilities: [...item.capabilities] })),
    tools: aiOpsAdvancedFixture.tools.map((item) => ({ ...item, surfaces: [...item.surfaces] })),
    knowledge: {
      profiles: aiOpsAdvancedFixture.knowledge.profiles.map((item) => ({ ...item })),
      index: { ...aiOpsAdvancedFixture.knowledge.index },
    },
    providers: aiOpsAdvancedFixture.providers.map((item) => ({ ...item })),
    connectors: aiOpsAdvancedFixture.connectors.map((item) => ({ ...item })),
  };
}

function pendingDecisionCount(fixture: AIOpsDecisionFixture) {
  return (
    fixture.approvals.filter((item) => item.status === "pending" || item.status === "failed").length +
    fixture.operations.suggestions.filter((item) => item.status === "new").length +
    fixture.operations.candidateSets.filter((item) => item.status === "pending").length +
    fixture.operations.mediaCandidates.filter((item) => item.status === "ready_to_generate").length
  );
}

function LoadingSurface() {
  return (
    <div className="flex flex-col gap-6" aria-label="AI 运营加载中">
      <div className="grid gap-4 md:grid-cols-3">
        <Card padding="base"><Skeleton className="h-20 w-full" /></Card>
        <Card padding="base"><Skeleton className="h-20 w-full" /></Card>
        <Card padding="base"><Skeleton className="h-20 w-full" /></Card>
      </div>
      <Card padding="base"><Skeleton className="h-64 w-full" /></Card>
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
  const [decisionFixture, setDecisionFixture] = useState(cloneDecisionFixture);
  const [advancedFixture, setAdvancedFixture] = useState(cloneAdvancedFixture);
  const [advancedSection, setAdvancedSection] = useState<AIOpsAdvancedSection>("agents");
  const [selectedApprovalId, setSelectedApprovalId] = useState<number | null>(decisionFixture.approvals[0]?.id ?? null);
  const [notice, setNotice] = useState<string>("");

  const selectTab = (tab: AIOpsTab) => {
    setRoute((current) => ({ ...current, tab }));
    setNotice("");
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
    setDecisionFixture((current) => ({
      ...current,
      approvals: current.approvals.map((item) =>
        item.id === id ? { ...item, status: approved ? "approved" : "rejected" } : item,
      ),
    }));
    setNotice(approved ? `审批 #${id} 已批准，后续执行仍受 Workflow 运行状态约束。` : `审批 #${id} 已拒绝。`);
  };

  const toggleAgent = (agent: AgentFixture) => {
    setAdvancedFixture((current) => ({
      ...current,
      agents: current.agents.map((item) => item.id === agent.id ? { ...item, enabled: !item.enabled } : item),
    }));
    setNotice(`${agent.name} 已${agent.enabled ? "停用" : "启用"}。`);
  };

  const tabs = [
    { key: "overview", label: tabLabel("概览", <Sparkles aria-hidden="true" className="size-4" />) },
    { key: "inbox", label: tabLabel("待我处理", <ShieldCheck aria-hidden="true" className="size-4" />, pendingDecisionCount(decisionFixture)) },
    { key: "automation", label: tabLabel("自动化", <GitBranch aria-hidden="true" className="size-4" />) },
    { key: "records", label: tabLabel("运行中心", <Clock3 aria-hidden="true" className="size-4" />) },
    { key: "advanced", label: tabLabel("高级设置", <Settings2 aria-hidden="true" className="size-4" />) },
  ] as const;

  let content: ReactNode = null;
  if (scenario === "loading") {
    content = <LoadingSurface />;
  } else if (scenario === "error") {
    content = <Alert type="error" showIcon title="AI 运营数据加载失败" description="Showcase 模拟真实聚合请求失败；刷新后可重新加载，不会丢失产品数据。" />;
  } else if (route.tab === "overview") {
    content = <AIOpsOverviewPanel fixture={decisionFixture} onNavigate={selectTab} />;
  } else if (route.tab === "inbox") {
    content = (
      <AIOpsInboxPanel
        fixture={decisionFixture}
        selectedApprovalId={selectedApprovalId}
        onSelectApproval={setSelectedApprovalId}
        onReviewApproval={(approval, approved) => reviewApproval(approval.id, approved)}
        onResolveInteraction={(task, response) => {
          setDecisionFixture((current) => ({ ...current, interactions: current.interactions.filter((item) => item.id !== task.id) }));
          setNotice(`Run #${task.workflowRunId} 已收到交互响应：${JSON.stringify(response)}`);
        }}
        onOpenOperation={(kind, id) => setNotice(`已打开 ${kind} #${id} 的产品处理入口。`)}
      />
    );
  } else if (route.tab === "automation") {
    content = (
      <AIOpsAutomationPanel
        fixture={aiOpsAutomationRecordsFixture}
        initialWorkflowId={route.workflow}
        onPreflight={async () => ({ ready: true })}
        onRun={async (_workflowId, dryRun) => ({ id: dryRun ? 246 : 247, status: dryRun ? "succeeded" : "awaiting_approval" })}
        onRollback={(workflowId, version) => setNotice(`Workflow #${workflowId} 已请求回滚到 v${version}。`)}
        onOpenRecords={openRecords}
      />
    );
  } else if (route.tab === "records") {
    content = (
      <AIOpsRecordsPanel
        fixture={aiOpsAutomationRecordsFixture}
        initialRecord={route.record}
        initialWorkflowId={route.workflow}
        initialRunId={route.run}
        onRouteChange={updateRecordsRoute}
      />
    );
  } else {
    content = (
      <AIOpsAdvancedPanel
        fixture={advancedFixture}
        section={advancedSection}
        onSectionChange={setAdvancedSection}
        onRunAgent={(agent) => setNotice(`${agent.name} 已排队运行；运行证据会进入运行中心。`)}
        onToggleAgent={toggleAgent}
        onCopySkill={(skill: SkillFixture) => setNotice(`${skill.name} v${skill.version} 已创建自定义副本。`)}
        onRetryIndex={() => setNotice("失败索引任务已重新排队。")}
        onRebuildIndex={() => setNotice("知识索引已请求全量重建。")}
        onTestProvider={(provider: ProviderFixture) => setNotice(`${provider.name}：连接测试成功。`)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route={formatAIOpsRoute(route)}
        note="保留真实 AI Ops 五个顶层 Tab、运行深链接与 Advanced 配置语义；Fixture 不请求真实 Agent/Workflow API。"
        controls={(
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
        )}
      />
      <PageHeader
        title="AI 运营"
        description="从发现机会、人工决策、自动化执行到运行证据与治理配置，保持完整的人机协作边界。"
        actions={<Button variant="outline" icon={<RefreshCw />} onClick={() => { setScenario("data"); setNotice("AI 运营数据已刷新。"); }}>刷新</Button>}
      />
      <Tabs<AIOpsTab> activeKey={route.tab} items={tabs} onChange={selectTab} ariaLabel="AI 运营工作区" />
      {notice ? <Alert type="success" showIcon title={notice} /> : null}
      {content}
    </div>
  );
}

export { aiOpsDecisionFixture, aiOpsAutomationRecordsFixture, aiOpsAdvancedFixture };
