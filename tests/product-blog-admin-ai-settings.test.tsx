import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  BlogAdminAISettingsDemo,
  aiSettingsFixture,
  formatAISettingsRoute,
  parseAISettingsRoute,
} from "../showcase/demos/products/blog-admin-ai-settings";

afterEach(cleanup);

function openTab(name: string) {
  fireEvent.mouseDown(screen.getByRole("tab", { name }), { button: 0 });
}

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

  it("restores Agent creation and editing entry points after the route split", () => {
    render(<BlogAdminAISettingsDemo />);

    fireEvent.click(screen.getByRole("button", { name: "创建 Agent" }));
    expect(screen.getByRole("heading", { level: 2, name: "创建 Agent" })).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Agent 名称"), { target: { value: "Research Review Agent" } });
    fireEvent.click(screen.getByRole("button", { name: "保存 Agent" }));

    expect(screen.getByText("Research Review Agent", { selector: "strong" })).toBeTruthy();
    expect(screen.getByText("Research Review Agent 已保存到静态 Fixture。")).toBeTruthy();
    expect(screen.getByRole("button", { name: "编辑 Research Review Agent" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "删除 Research Review Agent" })).toBeTruthy();
  });

  it("restores Skill import/create/export/copy/edit management actions", () => {
    render(<BlogAdminAISettingsDemo />);
    openTab("Skills");

    expect(screen.getByRole("button", { name: "导入 Skill" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "创建 Skill" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "导入 Skill" }));
    expect(screen.getByText("Imported Skill 75", { selector: "strong" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "导出" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "复制" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "编辑" }).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "创建 Skill" }));
    expect(screen.getByRole("heading", { level: 2, name: "创建 Skill" })).toBeTruthy();
  });

  it("restores Provider defaults, protected import/export and CRUD entry points", () => {
    render(<BlogAdminAISettingsDemo />);
    openTab("模型连接");

    expect(screen.getByText("模型连接与密钥保护")).toBeTruthy();
    expect(screen.getByRole("button", { name: "导出模型连接" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "导入模型连接" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "添加模型连接" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "默认用途" })).toBeTruthy();
    expect(screen.getByText("API Key •••• 4821")).toBeTruthy();

    fireEvent.click(screen.getAllByRole("button", { name: "测试连接" })[0]);
    expect(screen.getByText("OpenAI GPT-5.6：连接测试成功。")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "添加模型连接" }));
    expect(screen.getByRole("heading", { level: 2, name: "添加模型连接" })).toBeTruthy();
  });

  it("restores Embedding creation, connection testing and protected rebuild actions", () => {
    render(<BlogAdminAISettingsDemo />);
    openTab("知识库");

    expect(screen.getByText("敏感配置需要近期 MFA")).toBeTruthy();
    expect(screen.getByRole("button", { name: "重试失败任务" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "全量重建" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "添加 Embedding 模型" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "测试 Blog Knowledge" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "添加 Embedding 模型" }));
    expect(screen.getByRole("heading", { level: 2, name: "添加 Embedding 模型" })).toBeTruthy();
  });

  it("represents Connector profile OAuth and Outbox approval state transitions without real services", () => {
    render(<BlogAdminAISettingsDemo />);
    openTab("Sandbox 连接器");

    expect(screen.getByRole("button", { name: "添加 Connector Profile" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Outbox 沙箱" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "加入 Outbox" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "OAuth Web Research Sandbox" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "加入 Outbox" }));
    expect(screen.getByText("#304 · fixture-304", { selector: "strong" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "批准 fixture-304" }));
    expect(screen.getByText("Outbox #304 已更新为已批准。")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "OAuth Web Research Sandbox" }));
    expect(screen.getByText(/Web Research Sandbox 已模拟完成 Mock OAuth 回调/)).toBeTruthy();
    expect(aiSettingsFixture.connectorOutbox.some((item) => item.status === "failed")).toBe(true);
  });

  it("keeps governance behavior product-local while the navigation depth stays flat", () => {
    render(<BlogAdminAISettingsDemo />);

    openTab("Tools");
    expect(screen.queryByRole("heading", { level: 2, name: "Tools" })).toBeNull();
    expect(screen.getByText("create_draft", { selector: "strong" })).toBeTruthy();
    expect(screen.getByText(/Workflow 不直接调用 Tool/)).toBeTruthy();
    expect(aiSettingsFixture.tools.find((tool) => tool.name === "create_draft")?.risk).toBe("high");
  });
});