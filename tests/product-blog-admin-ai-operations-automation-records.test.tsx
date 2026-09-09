import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BlogAdminAIOperationsDemo } from "../showcase/demos/products/blog-admin-ai-operations";
import {
  AIOpsAutomationPanel,
  AIOpsRecordsPanel,
  type AIOpsRecordsTarget,
} from "../showcase/demos/products/blog-admin-ai-operations/automation-records";
import { aiOpsAutomationRecordsFixture } from "../showcase/demos/products/blog-admin-ai-operations/automation-records-fixtures";

afterEach(cleanup);

describe("Blog Admin AI Operations automation/records migration modules", () => {
  it("preserves workflow execution context, scope, metrics and version history", () => {
    render(
      <AIOpsAutomationPanel
        fixture={aiOpsAutomationRecordsFixture}
        onPreflight={vi.fn().mockResolvedValue({ ready: true })}
        onRun={vi.fn().mockResolvedValue({ id: 246, status: "succeeded" })}
        onRollback={vi.fn()}
        onOpenRecords={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "旧文维护" })).toBeTruthy();
    expect(screen.getByText("严格限制所选资源")).toBeTruthy();
    expect(screen.getByText("允许发现：search_posts, read_post")).toBeTruthy();
    expect(screen.getByText("31 / 2 / 128400")).toBeTruthy();
    expect(screen.getByText("v4")).toBeTruthy();
    expect(screen.getByRole("button", { name: "回滚到 v3" })).toBeTruthy();
  });

  it("blocks execution when preflight fails and never queues the workflow", async () => {
    const onPreflight = vi.fn().mockResolvedValue({ ready: false, message: "关联 Agent 未启用。" });
    const onRun = vi.fn();
    render(
      <AIOpsAutomationPanel
        fixture={aiOpsAutomationRecordsFixture}
        onPreflight={onPreflight}
        onRun={onRun}
        onRollback={vi.fn()}
        onOpenRecords={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "运行" }));

    await waitFor(() =>
      expect(onPreflight).toHaveBeenCalledWith(42, false, { topic: "AI Agent", days: 180 }),
    );
    expect(onRun).not.toHaveBeenCalled();
    expect(await screen.findByText("关联 Agent 未启用。")).toBeTruthy();
  });

  it("preserves dry-run semantics and opens the exact workflow run target", async () => {
    const onRun = vi.fn().mockResolvedValue({ id: 246, status: "succeeded" });
    const onOpenRecords = vi.fn<(target: AIOpsRecordsTarget) => void>();
    render(
      <AIOpsAutomationPanel
        fixture={aiOpsAutomationRecordsFixture}
        onPreflight={vi.fn().mockResolvedValue({ ready: true })}
        onRun={onRun}
        onRollback={vi.fn()}
        onOpenRecords={onOpenRecords}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Dry-run" }));

    await waitFor(() =>
      expect(onRun).toHaveBeenCalledWith(42, true, { topic: "AI Agent", days: 180 }),
    );
    fireEvent.click(await screen.findByRole("button", { name: "查看 Run #246" }));
    expect(onOpenRecords).toHaveBeenCalledWith({ record: "workflow", workflow: 42, run: 246 });
  });

  it("treats a failed returned Run as an error while preserving its evidence link", async () => {
    const onOpenRecords = vi.fn<(target: AIOpsRecordsTarget) => void>();
    render(
      <AIOpsAutomationPanel
        fixture={aiOpsAutomationRecordsFixture}
        onPreflight={vi.fn().mockResolvedValue({ ready: true })}
        onRun={vi.fn().mockResolvedValue({ id: 246, status: "failed" })}
        onRollback={vi.fn()}
        onOpenRecords={onOpenRecords}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "运行" }));
    expect(await screen.findByText("运行失败（Run #246）。请修正后重试，步骤日志可在运行中心查看。")).toBeTruthy();
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("data-type")).toBe("error");
    fireEvent.click(screen.getByRole("button", { name: "查看 Run #246" }));
    expect(onOpenRecords).toHaveBeenCalledWith({ record: "workflow", workflow: 42, run: 246 });
  });

  it("keeps rollback explicit and scoped to the selected workflow version", () => {
    const onRollback = vi.fn();
    render(
      <AIOpsAutomationPanel
        fixture={aiOpsAutomationRecordsFixture}
        onPreflight={vi.fn().mockResolvedValue({ ready: true })}
        onRun={vi.fn().mockResolvedValue({ id: 246, status: "succeeded" })}
        onRollback={onRollback}
        onOpenRecords={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "回滚到 v3" }));
    expect(onRollback).toHaveBeenCalledWith(42, 3);
  });

  it("restores Workflow create, edit, enable/disable and delete management entry points", () => {
    render(<BlogAdminAIOperationsDemo initialRoute={{ tab: "automation", record: "workflow" }} />);

    expect(screen.getByRole("button", { name: "创建 Workflow" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "编辑" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "停用" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "删除" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "创建 Workflow" }));
    fireEvent.change(screen.getByLabelText(/Workflow 名称/), { target: { value: "内容巡检" } });
    fireEvent.click(screen.getByRole("button", { name: "保存 Workflow" }));
    expect(screen.getByText("内容巡检 已保存，当前版本 v1。")).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "选择要管理的 Workflow" }).textContent).toContain("内容巡检 · v1");

    fireEvent.click(screen.getByRole("button", { name: "启用" }));
    expect(screen.getByText("内容巡检 已启用。")).toBeTruthy();
    expect(screen.getByRole("button", { name: "停用" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "删除" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "确认删除 Workflow" })).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "删除" }));
    expect(screen.getByText("内容巡检 已从静态 Fixture 删除。")).toBeTruthy();
  });

  it("keeps a newly created Dry-run reachable as real run evidence in the run center", async () => {
    render(<BlogAdminAIOperationsDemo initialRoute={{ tab: "automation", record: "workflow" }} />);

    fireEvent.click(screen.getByRole("button", { name: "Dry-run" }));
    fireEvent.click(await screen.findByRole("button", { name: "查看 Run #246" }));

    expect(await screen.findByRole("heading", { level: 3, name: "Run #246 · 旧文维护" })).toBeTruthy();
    expect(screen.getByText("验证 Workflow 配置")).toBeTruthy();
    expect(screen.getByText("No writes applied")).toBeTruthy();
  });

  it("keeps a failed live Run reachable with error, step and event evidence", async () => {
    render(<BlogAdminAIOperationsDemo initialRoute={{ tab: "automation", record: "workflow" }} />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "运行失败" }));

    fireEvent.click(screen.getByRole("button", { name: "运行" }));
    expect(await screen.findByText("运行失败（Run #246）。请修正后重试，步骤日志可在运行中心查看。")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "查看 Run #246" }));

    expect(await screen.findByRole("heading", { level: 3, name: "Run #246 · 旧文维护" })).toBeTruthy();
    expect(screen.getAllByText("query_events failed: column reference event_key is ambiguous").length).toBeGreaterThan(0);
    expect(screen.getByText("读取运营事件")).toBeTruthy();
    expect(screen.getByText("run_failed")).toBeTruthy();
  });

  it("preserves workflow run deep-link evidence across steps, resources, interactions and events", () => {
    const onRouteChange = vi.fn<(target: AIOpsRecordsTarget) => void>();
    render(
      <AIOpsRecordsPanel
        fixture={aiOpsAutomationRecordsFixture}
        initialRecord="workflow"
        initialRunId={245}
        onRouteChange={onRouteChange}
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Run #245 · AI 每日资讯" })).toBeTruthy();
    expect(screen.getByText("发现近 24 小时资讯")).toBeTruthy();
    expect(screen.getByText("7 verified references")).toBeTruthy();
    expect(screen.getByText("为技术架构文章选择封面方向")).toBeTruthy();
    expect(screen.getByText("interaction_created")).toBeTruthy();
    expect(screen.getByText(/AI Daily Briefing hero/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Run #244/ }));
    expect(onRouteChange).toHaveBeenCalledWith({ record: "workflow", workflow: 42, run: 244 });
    expect(screen.getByRole("heading", { level: 3, name: "Run #244 · 旧文维护" })).toBeTruthy();
    expect(screen.getAllByText("Dry-run").length).toBeGreaterThan(0);
    expect(screen.getByText("No writes applied")).toBeTruthy();
  });

  it("keeps agent records separate and exposes failed tool-call evidence", () => {
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
    expect(screen.getByRole("heading", { level: 3, name: "Run #701 · Content Maintainer" })).toBeTruthy();
    expect(screen.getByText("query_events")).toBeTruthy();
    expect(screen.getByText("column reference event_key is ambiguous")).toBeTruthy();
  });
});
