import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  BlogAdminAISettingsDemo,
  aiSettingsFixture,
  formatAISettingsRoute,
  parseAISettingsRoute,
} from "../showcase/demos/products/blog-admin-ai-settings";

afterEach(cleanup);

describe("Blog Admin AI Settings route family", () => {
  it("uses stable section routes instead of nesting product navigation inside AI Operations", () => {
    expect(parseAISettingsRoute("/admin/ai-settings")).toBe("agents");
    expect(parseAISettingsRoute("/admin/ai-settings?section=providers")).toBe("providers");
    expect(parseAISettingsRoute("?section=unknown")).toBe("agents");
    expect(formatAISettingsRoute("agents")).toBe("/admin/ai-settings");
    expect(formatAISettingsRoute("connectors")).toBe("/admin/ai-settings?section=connectors");
  });

  it("exposes one route-level H1 and exactly one page-local tablist", () => {
    render(<BlogAdminAISettingsDemo />);

    expect(screen.getByRole("heading", { level: 1, name: "AI 设置" })).toBeTruthy();
    expect(screen.getAllByRole("tablist")).toHaveLength(1);
    for (const name of ["Agents", "Skills", "Tools", "知识库", "模型连接", "Sandbox 连接器"]) {
      expect(screen.getByRole("tab", { name })).toBeTruthy();
    }

    expect(screen.queryByRole("heading", { level: 2, name: "Agents" })).toBeNull();
    expect(screen.getByText("Skill Version + 模型连接 + 运行计划组成可审计的执行单元。")).toBeTruthy();
    expect(screen.getByText("Daily Briefing Writer")).toBeTruthy();
  });

  it("keeps governance behavior product-local while the navigation depth stays flat", () => {
    render(<BlogAdminAISettingsDemo />);

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Tools" }), { button: 0 });
    expect(screen.queryByRole("heading", { level: 2, name: "Tools" })).toBeNull();
    expect(screen.getByText("create_draft", { selector: "strong" })).toBeTruthy();
    expect(screen.getByText(/Workflow 不直接调用 Tool/)).toBeTruthy();
    expect(aiSettingsFixture.tools.find((tool) => tool.name === "create_draft")?.risk).toBe("high");

    fireEvent.mouseDown(screen.getByRole("tab", { name: "模型连接" }), { button: 0 });
    expect(screen.getByText("gpt-5.6-sol")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "测试连接" })[0]);
    expect(screen.getByText("OpenAI GPT-5.6：连接测试成功。")).toBeTruthy();
  });
});