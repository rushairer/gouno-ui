import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  BlogAdminAIOperationsDemo,
  formatAIOpsRoute,
  parseAIOpsRoute,
} from "../showcase/demos/products/blog-admin-ai-operations";

afterEach(cleanup);

describe("Blog Admin AI Operations route shell", () => {
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
    expect(parseAIOpsRoute("?tab=advanced")).toEqual({
      tab: "overview",
      record: "workflow",
      workflow: undefined,
      run: undefined,
    });
    expect(formatAIOpsRoute({ tab: "records", record: "workflow", workflow: 43, run: 245 })).toBe(
      "/admin/ai-ops?tab=records&record=workflow&workflow=43&run=245",
    );
    expect(formatAIOpsRoute({ tab: "automation", record: "workflow", workflow: 43 })).toBe(
      "/admin/ai-ops?tab=automation&workflow=43",
    );
  });

  it("exposes four operational surfaces with one page-local tablist", () => {
    render(<BlogAdminAIOperationsDemo />);

    expect(screen.getByRole("heading", { level: 1, name: "AI 运营" })).toBeTruthy();
    expect(screen.getAllByRole("tablist")).toHaveLength(1);
    expect(screen.getByRole("tab", { name: "概览" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: /待我处理/ })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "自动化" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "运行中心" })).toBeTruthy();
    expect(screen.queryByRole("tab", { name: "高级设置" })).toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "从一件想改善的事开始" })).toBeTruthy();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "自动化" }), { button: 0 });
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
});