import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminPostEditorDemo } from "../showcase/demos/products/blog-admin-post-editor";

afterEach(cleanup);

describe("Blog Admin PostEditor", () => {
  it("preserves the standalone editor grammar instead of forcing PageHeader page composition", () => {
    const { container } = render(<BlogAdminPostEditorDemo />);

    expect(container.querySelector("[data-showcase-fixture-dock]")).toBeTruthy();
    expect(screen.getByLabelText("文章编辑器")).toBeTruthy();
    expect(container.querySelector('[data-slot="page-header"]')).toBeNull();
    expect(screen.getByLabelText("编辑器导航")).toBeTruthy();
    expect(screen.getByLabelText("文章编辑画布")).toBeTruthy();
    expect(screen.getByLabelText("文章元数据 Inspector")).toBeTruthy();
    expect(screen.getByDisplayValue("每日 AI 资讯：Agent 工作流进入可观测阶段")).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Markdown" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "预览" }).getAttribute("aria-selected")).toBe("false");
    expect(screen.getByText("所有更改已保存")).toBeTruthy();
  });

  it("keeps unsaved editor state while switching between Markdown and preview", () => {
    const { container } = render(<BlogAdminPostEditorDemo />);
    const title = screen.getByLabelText("标题") as HTMLTextAreaElement;
    const body = screen.getByLabelText("文章正文 Markdown") as HTMLTextAreaElement;

    fireEvent.change(title, { target: { value: "不会丢失的编辑标题" } });
    fireEvent.change(body, { target: { value: "## 新章节\n\n```ts\nconst wide = true;\n```" } });
    expect(screen.getByText("有未保存的更改")).toBeTruthy();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "预览" }), { button: 0 });
    expect(screen.getByLabelText("文章预览")).toBeTruthy();
    expect(container.querySelector('[aria-label="文章预览"] pre')?.className).toContain("overflow-x-auto");
    expect(container.querySelector('[aria-label="文章预览"] table')?.parentElement?.className).toContain("overflow-x-auto");

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Markdown" }), { button: 0 });
    expect((screen.getByLabelText("标题") as HTMLTextAreaElement).value).toBe("不会丢失的编辑标题");
    expect((screen.getByLabelText("文章正文 Markdown") as HTMLTextAreaElement).value).toBe(
      "## 新章节\n\n```ts\nconst wide = true;\n```",
    );
  });

  it("saves a new draft and transitions the fixture to an editable persisted route", () => {
    render(<BlogAdminPostEditorDemo initialRoute="new" />);

    fireEvent.change(screen.getByLabelText("标题"), { target: { value: "新草稿" } });
    fireEvent.change(screen.getByLabelText("文章正文 Markdown"), { target: { value: "草稿正文" } });
    fireEvent.click(screen.getByRole("button", { name: "保存草稿" }));

    expect(screen.getByText("草稿已保存。")).toBeTruthy();
    expect(screen.getByText("已于 22:48 保存")).toBeTruthy();
    expect((screen.getByLabelText("标题") as HTMLTextAreaElement).value).toBe("新草稿");
  });

  it("preserves the real 409 conflict feedback path without discarding the draft", () => {
    render(<BlogAdminPostEditorDemo initialScenario="conflict" />);

    fireEvent.change(screen.getByLabelText("标题"), { target: { value: "发生冲突但仍保留" } });
    fireEvent.click(screen.getByRole("button", { name: "保存草稿" }));

    expect(screen.getByText("内容已被其他编辑者更新（409 冲突）")).toBeTruthy();
    expect((screen.getByLabelText("标题") as HTMLTextAreaElement).value).toBe("发生冲突但仍保留");
    expect(screen.getByText("有未保存的更改")).toBeTruthy();
  });

  it("restores a selected history version only after confirmation", () => {
    render(<BlogAdminPostEditorDemo />);

    fireEvent.click(screen.getByRole("button", { name: /版本历史 \(2\)/ }));
    fireEvent.click(screen.getByRole("button", { name: /2026-09-08 18:32 · 恢复/ }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "恢复版本" }));

    expect(screen.getByText("已成功恢复历史版本。")).toBeTruthy();
    expect((screen.getByLabelText("文章正文 Markdown") as HTMLTextAreaElement).value).toBe(
      "## 背景\n\n上一版重点讨论 Agent 运行记录。\n\n## 结论\n\n先把执行证据做完整，再扩大自动化范围。",
    );
    expect(screen.getByText("已于 22:42 保存")).toBeTruthy();
  });

  it("keeps another author's post read-only and removes write-only AI and publish actions", () => {
    render(<BlogAdminPostEditorDemo initialRoute="readonly" />);

    expect(screen.getByText(/只读模式（他人文章）/)).toBeTruthy();
    expect((screen.getByLabelText("标题") as HTMLTextAreaElement).disabled).toBe(true);
    expect((screen.getByLabelText("文章正文 Markdown") as HTMLTextAreaElement).disabled).toBe(true);
    expect(screen.queryByRole("button", { name: "保存草稿" })).toBeNull();
    expect(screen.queryByRole("button", { name: "发布" })).toBeNull();
    expect(screen.queryByRole("button", { name: "AI 一键补全元数据" })).toBeNull();
    expect(screen.queryByRole("button", { name: "AI 写作与润色" })).toBeNull();
  });

  it("preserves AI metadata, writing and image result flows as product-owned orchestration", () => {
    render(<BlogAdminPostEditorDemo />);

    fireEvent.click(screen.getByRole("button", { name: "AI 一键补全元数据" }));
    expect(screen.getByDisplayValue("agent-workflow-observability")).toBeTruthy();
    expect(screen.getByDisplayValue(/Workflow/)).toBeTruthy();
    expect(screen.getByText(/AI 已补全摘要、Slug、分类、标签、Alt 与 SEO/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "AI 写作与润色" }));
    fireEvent.click(screen.getByRole("button", { name: "生成 / 执行" }));
    expect(screen.getByText("生成结果预览")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "追加到末尾" }));
    expect((screen.getByLabelText("文章正文 Markdown") as HTMLTextAreaElement).value).toContain("三个治理抓手");

    fireEvent.click(screen.getByRole("button", { name: "AI 文生图插画" }));
    fireEvent.change(screen.getByLabelText("图片描述 Alt"), { target: { value: "Agent 审批工作流" } });
    fireEvent.click(screen.getByRole("button", { name: "开始生图" }));
    expect(screen.getByText("AI 生成插图预览")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "设为文章封面" }));
    expect((screen.getByLabelText("封面 URL") as HTMLInputElement).value).toBe("/media/ai-generated-agent-workflow.webp");
    expect((screen.getByLabelText("替代文本") as HTMLInputElement).value).toBe("Agent 审批工作流");
  });
});
