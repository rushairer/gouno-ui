import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BlogAdminAIOperationsDemo } from "../showcase/demos/products/blog-admin/ai/operations";
import {
  AIOpsRecordsPanel,
  type AIOpsRecordsTarget,
} from "../showcase/demos/products/blog-admin/ai/operations/automation-records";
import { aiOpsAutomationRecordsFixture } from "../showcase/demos/products/blog-admin/ai/operations/automation-records-fixtures";
import { WorkflowExecutionPanel } from "../showcase/demos/products/blog-admin/ai/operations/workflow-execution";

afterEach(cleanup);

const workflow = aiOpsAutomationRecordsFixture.workflows[0];
const nextWorkflowRunId = Math.max(...aiOpsAutomationRecordsFixture.workflowRuns.map((run) => run.id)) + 1;

function renderWorkflowExecution(overrides: Partial<Parameters<typeof WorkflowExecutionPanel>[0]> = {}) {
  const props: Parameters<typeof WorkflowExecutionPanel>[0] = {
    workflow,
    onPreflight: vi.fn().mockResolvedValue({ ready: true }),
    onRun: vi.fn().mockResolvedValue({ id: 246, status: "succeeded" }),
    onRollback: vi.fn(),
    onOpenRecords: vi.fn(),
    ...overrides,
  };
  render(<WorkflowExecutionPanel {...props} />);
  return props;
}

function openFirstWorkflow() {
  fireEvent.click(screen.getByRole("button", { name: "打开 Workflow：旧文维护" }));
}

function openWorkflowMenu() {
  fireEvent.pointerDown(screen.getByRole("button", { name: "更多 Workflow 操作" }), {
    button: 0,
    ctrlKey: false,
  });
}

describe("Blog Admin AI Operations automation/records canonical modules", () => {
  it("preserves selected Workflow execution context, run boundary and version history", () => {
    renderWorkflowExecution();

    expect(screen.getByText("运行当前 Workflow")).toBeTruthy();
    expect(screen.getByText("本次运行输入")).toBeTruthy();
    expect(screen.getByText("运行范围")).toBeTruthy();
    expect(screen.getByText("遵守 Workflow 严格资源边界")).toBeTruthy();
    expect(screen.getByDisplayValue("AI Agent")).toBeTruthy();
    expect(screen.getByDisplayValue("180")).toBeTruthy();
    expect(screen.getByText("版本历史")).toBeTruthy();
    expect(screen.getByText("v4")).toBeTruthy();
    expect(screen.getByRole("button", { name: "回滚到 v3" })).toBeTruthy();
  });

  it("blocks execution when preflight fails and never queues the Workflow", async () => {
    const onPreflight = vi.fn().mockResolvedValue({ ready: false, message: "关联 Agent 未启用。" });
    const onRun = vi.fn();
    renderWorkflowExecution({ onPreflight, onRun });

    fireEvent.click(screen.getByRole("button", { name: "运行" }));

    await waitFor(() =>
      expect(onPreflight).toHaveBeenCalledWith(42, false, { topic: "AI Agent", days: 180 }),
    );
    expect(onRun).not.toHaveBeenCalled();
    expect(await screen.findByText("关联 Agent 未启用。")).toBeTruthy();
  });

  it("preserves dry-run semantics and opens the exact Workflow Run target", async () => {
    const onRun = vi.fn().mockResolvedValue({ id: 246, status: "succeeded" });
    const onOpenRecords = vi.fn<(target: AIOpsRecordsTarget) => void>();
    renderWorkflowExecution({ onRun, onOpenRecords });

    fireEvent.click(screen.getByRole("button", { name: "Dry-run" }));

    await waitFor(() =>
      expect(onRun).toHaveBeenCalledWith(42, true, { topic: "AI Agent", days: 180 }),
    );
    fireEvent.click(await screen.findByRole("button", { name: "查看 Run #246" }));
    expect(onOpenRecords).toHaveBeenCalledWith({ record: "workflow", workflow: 42, run: 246 });
  });

  it("treats a failed returned Run as an error while preserving its evidence link", async () => {
    const onOpenRecords = vi.fn<(target: AIOpsRecordsTarget) => void>();
    renderWorkflowExecution({
      onRun: vi.fn().mockResolvedValue({ id: 246, status: "failed" }),
      onOpenRecords,
    });

    fireEvent.click(screen.getByRole("button", { name: "运行" }));
    expect(await screen.findByText("运行失败 · Run #246")).toBeTruthy();
    expect(screen.getByText("失败证据已经持久化。进入运行中心查看失败步骤、资源与事件后再决定是否重试。")).toBeTruthy();
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("data-type")).toBe("error");
    fireEvent.click(screen.getByRole("button", { name: "查看 Run #246" }));
    expect(onOpenRecords).toHaveBeenCalledWith({ record: "workflow", workflow: 42, run: 246 });
  });

  it("keeps rollback explicit and scoped to the selected Workflow version", () => {
    const onRollback = vi.fn();
    renderWorkflowExecution({ onRollback });

    fireEvent.click(screen.getByRole("button", { name: "回滚到 v3" }));
    expect(onRollback).toHaveBeenCalledWith(42, 3);
  });

  it("uses a Workflow list route and a dedicated full-width detail route", () => {
    render(<BlogAdminAIOperationsDemo initialRoute={{ tab: "automation", record: "workflow" }} />);

    expect(screen.getByRole("button", { name: "创建 Workflow" })).toBeTruthy();
    expect(screen.getByRole("list", { name: "Workflow 列表" })).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2, name: "旧文维护" })).toBeNull();
    expect(screen.queryByRole("button", { name: "编辑" })).toBeNull();

    openFirstWorkflow();
    expect(screen.queryByRole("list", { name: "Workflow 列表" })).toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "旧文维护" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "返回 Workflow 列表" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "编辑" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "运行记录" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "更多 Workflow 操作" })).toBeTruthy();
    expect(screen.getByText("成功率")).toBeTruthy();
    expect(screen.getByRole("region", { name: "最近运行" })).toBeTruthy();
    const recentRunRows = screen.getAllByRole("button", { name: /打开最近 Run #/ });
    expect(recentRunRows.length).toBeGreaterThan(0);
    expect(recentRunRows[0].className).toContain("[&>span]:contents");

    fireEvent.click(screen.getByRole("button", { name: "返回 Workflow 列表" }));
    expect(screen.getByRole("list", { name: "Workflow 列表" })).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2, name: "旧文维护" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "创建 Workflow" }));
    fireEvent.change(screen.getByLabelText(/Workflow 名称/), { target: { value: "内容巡检" } });
    fireEvent.click(screen.getByRole("button", { name: "保存 Workflow" }));
    expect(screen.getByText("内容巡检 已保存，当前版本 v1。")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "内容巡检" })).toBeTruthy();
    expect(screen.queryByRole("list", { name: "Workflow 列表" })).toBeNull();

    openWorkflowMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "启用 Workflow" }));
    expect(screen.getByText("内容巡检 已启用。")).toBeTruthy();

    openWorkflowMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: /删除 Workflow/ }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "确认删除 Workflow" })).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "删除" }));
    expect(screen.getByText("内容巡检 已从静态 Fixture 删除。")).toBeTruthy();
    expect(screen.getByRole("list", { name: "Workflow 列表" })).toBeTruthy();
  });

  it("keeps a Dry-run reachable as real run evidence from the selected Workflow detail", async () => {
    render(<BlogAdminAIOperationsDemo initialRoute={{ tab: "automation", record: "workflow" }} />);
    openFirstWorkflow();

    fireEvent.click(screen.getByRole("button", { name: "Dry-run" }));
    fireEvent.click(await screen.findByRole("button", { name: `查看 Run #${nextWorkflowRunId}` }));

    expect(await screen.findByRole("heading", { level: 2, name: `Run #${nextWorkflowRunId} · 旧文维护` })).toBeTruthy();
    expect(screen.getByText("验证 Workflow 配置")).toBeTruthy();
    expect(screen.getAllByText(/Dry-run 未写入产品数据/).length).toBeGreaterThan(0);
  });

  it("keeps a failed live Run reachable with error, step and event evidence", async () => {
    render(<BlogAdminAIOperationsDemo initialRoute={{ tab: "automation", record: "workflow" }} />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "运行失败" }));
    openFirstWorkflow();

    fireEvent.click(screen.getByRole("button", { name: "运行" }));
    expect(await screen.findByText(`运行失败 · Run #${nextWorkflowRunId}`)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: `查看 Run #${nextWorkflowRunId}` }));

    expect(await screen.findByRole("heading", { level: 2, name: `Run #${nextWorkflowRunId} · 旧文维护` })).toBeTruthy();
    expect(screen.getAllByText("query_events failed: column reference event_key is ambiguous").length).toBeGreaterThan(0);
    expect(screen.getByText("读取运营事件")).toBeTruthy();
    expect(screen.getByText("run_failed")).toBeTruthy();
  });

  it("preserves Workflow Run deep-link evidence across steps, resources, interactions and events", () => {
    const onRouteChange = vi.fn<(target: AIOpsRecordsTarget) => void>();
    render(
      <AIOpsRecordsPanel
        fixture={aiOpsAutomationRecordsFixture}
        initialRecord="workflow"
        initialRunId={245}
        onRouteChange={onRouteChange}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Run #245 · AI 每日资讯" })).toBeTruthy();
    expect(screen.getByText("发现近 24 小时资讯")).toBeTruthy();
    expect(screen.getByText("7 verified references")).toBeTruthy();
    expect(screen.getByText("为技术架构文章选择封面方向")).toBeTruthy();
    expect(screen.getByText("interaction_created")).toBeTruthy();
    expect(screen.getByText(/AI Daily Briefing hero/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Run #244/ }));
    expect(onRouteChange).toHaveBeenCalledWith({ record: "workflow", workflow: 42, run: 244 });
    expect(screen.getByRole("heading", { level: 2, name: "Run #244 · 旧文维护" })).toBeTruthy();
    expect(screen.getAllByText("Dry-run").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dry-run 未写入产品数据/).length).toBeGreaterThan(0);
  });

  it("keeps Agent records separate and exposes failed Tool Call evidence", () => {
    const onRouteChange = vi.fn<(target: AIOpsRecordsTarget) => void>();
    render(
      <AIOpsRecordsPanel
        fixture={aiOpsAutomationRecordsFixture}
        onRouteChange={onRouteChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Agent 运行" }));
    expect(onRouteChange).toHaveBeenCalledWith({ record: "agent" });

    fireEvent.click(screen.getByRole("button", { name: /Run #701/ }));
    expect(onRouteChange).toHaveBeenCalledWith({ record: "agent", run: 701 });
    expect(screen.getByRole("heading", { level: 2, name: "Run #701 · Content Maintainer" })).toBeTruthy();
    expect(screen.getByText("query_events")).toBeTruthy();
    expect(screen.getByText("column reference event_key is ambiguous")).toBeTruthy();
  });
});
