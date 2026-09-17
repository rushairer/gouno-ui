import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AIOpsAutomationPanel, AIOpsRecordsPanel } from "../showcase/demos/products/blog-admin/ai/operations/automation-records";
import { aiOpsAutomationRecordsFixture } from "../showcase/demos/products/blog-admin/ai/operations/automation-records-fixtures";
import { AISettingsEditor } from "../showcase/demos/products/blog-admin/ai/settings/editors";
import { aiSettingsFixture } from "../showcase/demos/products/blog-admin/ai/settings/fixtures";

afterEach(cleanup);

describe("Blog Admin AI canonical redesign contract", () => {
  it("keeps automation centered on one selected workflow with execution context and evidence access", () => {
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
    expect(screen.getByText("本次运行输入")).toBeTruthy();
    expect(screen.getByText("运行范围")).toBeTruthy();
    expect(screen.getByRole("button", { name: "运行记录" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Dry-run" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "运行" })).toBeTruthy();
  });

  it("presents run detail as summary, execution process and evidence instead of peer card fragments", () => {
    render(
      <AIOpsRecordsPanel
        fixture={aiOpsAutomationRecordsFixture}
        initialRecord="workflow"
        initialRunId={245}
        onRouteChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Run #245 · AI 每日资讯" })).toBeTruthy();
    expect(screen.getByText("执行过程")).toBeTruthy();
    expect(screen.getByText("运行证据")).toBeTruthy();
    expect(screen.getByText("资源")).toBeTruthy();
    expect(screen.getByText("人工交互")).toBeTruthy();
    expect(screen.getByText("事件")).toBeTruthy();
  });

  it("groups Agent settings into identity, binding, schedule and stricter runtime governance", () => {
    render(
      <AISettingsEditor
        editor={{ kind: "agent", value: aiSettingsFixture.agents[0] }}
        fixture={aiSettingsFixture}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: /编辑 Agent/ })).toBeTruthy();
    expect(screen.getByText("基础信息")).toBeTruthy();
    expect(screen.getByText("能力绑定")).toBeTruthy();
    expect(screen.getByText("触发方式")).toBeTruthy();
    expect(screen.getByText("运行治理")).toBeTruthy();
    expect(screen.getByText(/覆盖值只能更严格/)).toBeTruthy();
    expect(screen.getByLabelText(/Agent 名称/)).toBeTruthy();
    expect(screen.getByLabelText(/绑定 Skill Version/)).toBeTruthy();
    expect(screen.getByLabelText(/日运行上限/)).toBeTruthy();
    expect(screen.getByLabelText(/月 Token 预算/)).toBeTruthy();
    expect(screen.getByLabelText(/最大步数覆盖/)).toBeTruthy();
  });

  it("keeps Skill behavior, tool authorization, publication policy and governance limits together", () => {
    render(
      <AISettingsEditor
        editor={{ kind: "skill", value: aiSettingsFixture.skills[0] }}
        fixture={aiSettingsFixture}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("能力定义")).toBeTruthy();
    expect(screen.getByText("Tool 授权")).toBeTruthy();
    expect(screen.getByText("输入契约")).toBeTruthy();
    expect(screen.getByText("执行与发布边界")).toBeTruthy();
    expect(screen.getByText("默认治理限制")).toBeTruthy();
    expect(screen.getByLabelText(/固定指令/)).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: /web_research/ })).toBeTruthy();
    expect(screen.getByLabelText(/内容发布策略/)).toBeTruthy();
    expect(screen.getByLabelText("Max steps")).toBeTruthy();
    expect(screen.getByLabelText(/默认日运行上限/)).toBeTruthy();
    expect(screen.getByLabelText("Max input tokens")).toBeTruthy();
    expect(screen.getByLabelText("Max output tokens")).toBeTruthy();
    expect(screen.getByLabelText(/默认月 Token 预算/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "保存 Skill" })).toBeTruthy();
  });
});
