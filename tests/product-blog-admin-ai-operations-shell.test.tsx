import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  BlogAdminAIOperationsDemo,
  formatAIOpsRoute,
  parseAIOpsRoute,
} from "../showcase/demos/products/blog-admin-ai-operations";

afterEach(cleanup);

describe("Blog Admin AI Operations complete route shell", () => {
  it("parses and formats the real tab/record/workflow/run query contract", () => {
    expect(parseAIOpsRoute("/admin/ai-ops")).toEqual({ tab: "overview", record: "workflow", workflow: undefined, run: undefined });
    expect(parseAIOpsRoute("/admin/ai-ops?tab=records&record=workflow&workflow=43&run=245")).toEqual({
      tab: "records",
      record: "workflow",
      workflow: 43,
      run: 245,
    });
    expect(parseAIOpsRoute("?tab=records&record=agent&workflow=43&run=701")).toEqual({
      tab: "records",
      record: "agent",
      workflow: undefined,
      run: 701,
    });
    expect(formatAIOpsRoute({ tab: "records", record: "workflow", workflow: 43, run: 245 })).toBe(
      "/admin/ai-ops?tab=records&record=workflow&workflow=43&run=245",
    );
    expect(formatAIOpsRoute({ tab: "automation", record: "workflow", workflow: 43 })).toBe(
      "/admin/ai-ops?tab=automation&workflow=43",
    );
  });

  it("exposes all five top-level AI Ops surfaces without putting product content inside Tabs", () => {
    render(<BlogAdminAIOperationsDemo />);

    expect(screen.getByRole("heading", { level: 1, name: "AI 运营" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "概览" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: /待我处理/ })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "自动化" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "运行中心" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "高级设置" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "从一件想改善的事开始" })).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "自动化" }));
    expect(screen.getByLabelText("自动化")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "旧文维护" })).toBeTruthy();
  });

  it("honors a direct automation workflow route without inventing a new router abstraction", () => {
    render(
      <BlogAdminAIOperationsDemo
        initialRoute={{ tab: "automation", record: "workflow", workflow: 43 }}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "AI 每日资讯" })).toBeTruthy();
    expect(screen.getByDisplayValue("AI")).toBeTruthy();
    expect(screen.getByText("58 / 4 / 421900")).toBeTruthy();
  });

  it("hydrates a Workflow Run deep link with its filtered evidence chain", () => {
    render(
      <BlogAdminAIOperationsDemo
        initialRoute={{ tab: "records", record: "workflow", workflow: 43, run: 245 }}
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Run #245 · AI 每日资讯" })).toBeTruthy();
    expect(screen.getByText("发现近 24 小时资讯")).toBeTruthy();
    expect(screen.getByText("为技术架构文章选择封面方向")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Run #244/ })).toBeNull();
  });

  it("keeps all six Advanced governance domains product-local", () => {
    render(<BlogAdminAIOperationsDemo initialRoute={{ tab: "advanced", record: "workflow" }} />);

    for (const name of ["Agents", "Skills", "Tools", "知识库", "模型连接", "Sandbox 连接器"]) {
      expect(screen.getByRole("tab", { name })).toBeTruthy();
    }
    expect(screen.getByText("Daily Briefing Writer")).toBeTruthy();
    expect(screen.getByText("Skill: Daily Briefing v6")).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "Tools" }));
    expect(screen.getByText("create_draft")).toBeTruthy();
    expect(screen.getByText("高风险")).toBeTruthy();
    expect(screen.getByText(/Workflow 不直接调用 Tool/)).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "模型连接" }));
    expect(screen.getByText("gpt-5.6-sol")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "测试连接" })[0]);
    expect(screen.getByText("OpenAI GPT-5.6：连接测试成功。")).toBeTruthy();
  });
});
