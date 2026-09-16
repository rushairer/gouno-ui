import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminPostEditorDemo } from "../showcase/demos/products/blog-admin/post-editor";

afterEach(cleanup);

describe("Blog Admin PostEditor", () => {
  it("uses the shared document editor shell with stable navigator, canvas and inspector regions", () => {
    const { container } = render(<BlogAdminPostEditorDemo />);

    expect(container.querySelector("[data-showcase-fixture-dock]")).toBeTruthy();
    expect(screen.getByLabelText("文章编辑器")).toBeTruthy();
    expect(container.querySelector('[data-slot="document-editor-shell"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="page-header"]')).toBeNull();
    expect(screen.getByLabelText("编辑器导航")).toBeTruthy();
    expect(screen.getByLabelText("文章编辑画布")).toBeTruthy();
    expect(screen.getByLabelText("文章元数据 Inspector")).toBeTruthy();
    expect(screen.getByRole("tab", { name: /大纲 4/ }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: /历史 2/ }).getAttribute("aria-selected")).toBe("false");
    expect(screen.getByLabelText("文章正文 Markdown")).toBeTruthy();
    expect(screen.getByRole("button", { name: "编辑" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "分屏" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByRole("button", { name: "预览" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByText("所有更改已保存")).toBeTruthy();
  });

  it("keeps unsaved editor state while switching between edit, split and preview", () => {
    render(<BlogAdminPostEditorDemo />);
    const title = screen.getByLabelText("标题") as HTMLTextAreaElement;
    const body = screen.getByLabelText("文章正文 Markdown") as HTMLTextAreaElement;

    fireEvent.change(title, { target: { value: "不会丢失的编辑标题" } });
    fireEvent.change(body, { target: { value: "## 新章节\n\n```ts\nconst wide = true;\n```" } });
    expect(screen.getByText("有未保存的更改")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "分屏" }));
    expect(screen.getByLabelText("文章预览")).toBeTruthy();
    expect(screen.getByLabelText("文章正文 Markdown")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "预览" }));
    expect(screen.getByLabelText("文章预览")).toBeTruthy();
    expect(screen.queryByLabelText("文章正文 Markdown")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "编辑" }));
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

  it("keeps outline and history as stable peer views and restores only after confirmation", () => {
    render(<BlogAdminPostEditorDemo />);

    fireEvent.mouseDown(screen.getByRole("tab", { name: /历史 2/ }), { button: 0 });
    expect(screen.getByRole("tab", { name: /历史 2/ }).getAttribute("aria-selected")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "查看 2026-09-08 18:32 的历史版本" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeTruthy();
    expect(dialog.textContent).toContain("先查看版本内容，再决定是否恢复。");
    fireEvent.click(screen.getByRole("button", { name: "恢复版本" }));

    expect(screen.getByText("已成功恢复历史版本。")).toBeTruthy();
    expect((screen.getByLabelText("文章正文 Markdown") as HTMLTextAreaElement).value).toBe(
      "## 背景\n\n上一版重点讨论 Agent 运行记录。\n\n## 结论\n\n先把执行证据做完整，再扩大自动化范围。",
    );
    expect(screen.getByText("已于 22:42 保存")).toBeTruthy();
    expect(screen.getByRole("tab", { name: /大纲 2/ }).getAttribute("aria-selected")).toBe("true");
  });

  it("keeps field AI attached to its field instead of presenting detached page-level actions", () => {
    render(<BlogAdminPostEditorDemo />);

    fireEvent.click(screen.getByRole("button", { name: "AI 生成标题候选" }));
    expect(screen.getByLabelText("标题候选")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Agent 工作流可观测性：从运行记录到人工审批/ }));
    expect((screen.getByLabelText("标题") as HTMLTextAreaElement).value).toBe("Agent 工作流可观测性：从运行记录到人工审批");

    fireEvent.click(screen.getByRole("button", { name: "AI 根据正文生成摘要" }));
    fireEvent.click(screen.getByRole("button", { name: /从运行证据、人工审批和失败回放三个层面/ }));
    expect((screen.getByLabelText("摘要") as HTMLTextAreaElement).value).toContain("三个层面");
  });

  it("keeps another author's post read-only and removes write-only AI and publish actions", () => {
    render(<BlogAdminPostEditorDemo initialRoute="readonly" />);

    expect(screen.getByText(/只读模式（他人文章）/)).toBeTruthy();
    expect((screen.getByLabelText("标题") as HTMLTextAreaElement).disabled).toBe(true);
    expect((screen.getByLabelText("文章正文 Markdown") as HTMLTextAreaElement).disabled).toBe(true);
    expect(screen.queryByRole("button", { name: "保存草稿" })).toBeNull();
    expect(screen.queryByRole("button", { name: "发布" })).toBeNull();
    expect(screen.queryByRole("button", { name: "智能补全" })).toBeNull();
    expect(screen.queryByRole("button", { name: "AI 写作" })).toBeNull();
    expect(screen.queryByRole("button", { name: "插入内容" })).toBeNull();
  });

  it("reviews metadata suggestions before applying them and keeps writing/image AI inside editor tools", () => {
    render(<BlogAdminPostEditorDemo />);

    fireEvent.click(screen.getByRole("button", { name: "智能补全" }));
    expect(screen.getByLabelText("AI 元数据建议")).toBeTruthy();
    expect(screen.getByText("AI 建议 6 项修改")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "全部应用" }));
    expect(screen.getByDisplayValue("agent-workflow-observability")).toBeTruthy();
    expect(screen.getByDisplayValue(/Workflow/)).toBeTruthy();
    expect(screen.getByText(/已应用 AI 元数据建议/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "AI 写作" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "继续写作" }));
    expect(screen.getByLabelText("AI 写作助手")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "生成 / 执行" }));
    expect(screen.getByText("生成结果预览")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "追加到末尾" }));
    expect((screen.getByLabelText("文章正文 Markdown") as HTMLTextAreaElement).value).toContain("三个治理抓手");

    fireEvent.click(screen.getByRole("button", { name: "插入内容" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "AI 生成图片" }));
    expect(screen.getByLabelText("AI 图片生成器")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("生图提示词"), { target: { value: "Agent approval workflow illustration" } });
    fireEvent.change(screen.getByLabelText("图片描述 Alt"), { target: { value: "Agent 审批工作流" } });
    fireEvent.click(screen.getByRole("button", { name: "开始生图" }));
    expect(screen.getByText("AI 生成插图预览")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "设为文章封面" }));
    expect((screen.getByLabelText("封面 URL") as HTMLInputElement).value).toBe("/media/ai-generated-agent-workflow.webp");
    expect((screen.getByLabelText("替代文本") as HTMLInputElement).value).toBe("Agent 审批工作流");
  });
});
