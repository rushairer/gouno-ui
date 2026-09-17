import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminPostEditorDemo } from "../showcase/demos/products/blog-admin/post-editor";

afterEach(cleanup);

describe("Blog Admin PostEditor AI metadata and cover actions", () => {
  it("reviews classification and tag suggestions as one section-scoped AI action", () => {
    render(<BlogAdminPostEditorDemo initialRoute="new" />);
    fireEvent.change(screen.getByLabelText("标题"), { target: { value: "Agent 工作流治理" } });

    fireEvent.click(screen.getByRole("button", { name: "AI 推荐分类与标签" }));
    expect(screen.getByLabelText("AI 分类与标签建议")).toBeTruthy();
    expect(screen.getByRole("group", { name: "分类与标签建议" })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "应用 分类 建议" })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "应用 标签补充 建议" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "应用 2 项建议" }));
    expect(screen.getByRole("combobox", { name: "分类" }).textContent).toContain("AI");
    expect((screen.getByLabelText("标签") as HTMLInputElement).value).toBe("AI 治理, 自动化");
  });

  it("uses one cover-source menu and writes the chosen image into URL and alt fields", () => {
    render(<BlogAdminPostEditorDemo />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "选择文章封面" }), {
      button: 0,
      ctrlKey: false,
    });
    expect(screen.getByRole("menuitem", { name: "从媒体库选择" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "上传图片" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "AI 生成封面" })).toBeTruthy();
    fireEvent.click(screen.getByRole("menuitem", { name: "上传图片" }));

    expect((screen.getByLabelText("封面 URL") as HTMLInputElement).value).toBe("/media/uploads/agent-governance-cover.webp");
    expect((screen.getByLabelText("替代文本") as HTMLInputElement).value).toBe("Agent 工作流治理文章封面");
  });

  it("keeps AI cover generation single-purpose and fills both cover fields after acceptance", () => {
    render(<BlogAdminPostEditorDemo />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "选择文章封面" }), {
      button: 0,
      ctrlKey: false,
    });
    fireEvent.click(screen.getByRole("menuitem", { name: "AI 生成封面" }));
    expect(screen.getByRole("dialog", { name: "AI 生成封面" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "插入光标位置" })).toBeNull();

    fireEvent.change(screen.getByLabelText("生图提示词"), { target: { value: "Editorial cover for Agent workflow governance" } });
    fireEvent.change(screen.getByLabelText("图片描述 Alt"), { target: { value: "Agent 工作流治理封面" } });
    fireEvent.click(screen.getByRole("button", { name: "生成图片" }));
    expect(screen.getByText("AI 生成封面预览")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "使用此封面" }));

    expect((screen.getByLabelText("封面 URL") as HTMLInputElement).value).toBe("/media/ai-generated-agent-workflow.webp");
    expect((screen.getByLabelText("替代文本") as HTMLInputElement).value).toBe("Agent 工作流治理封面");
  });

  it("removes taxonomy and cover write actions in read-only mode", () => {
    render(<BlogAdminPostEditorDemo initialRoute="readonly" />);
    expect(screen.queryByRole("button", { name: "AI 推荐分类与标签" })).toBeNull();
    expect(screen.queryByRole("button", { name: "选择文章封面" })).toBeNull();
  });
});
