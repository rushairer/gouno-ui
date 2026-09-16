import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminPageEditorDemo } from "../showcase/demos/products/blog-admin/page-editor";

afterEach(cleanup);

describe("Blog Admin PageEditor", () => {
  it("uses the shared two-column document editor without PostEditor-only navigation", () => {
    const { container } = render(<BlogAdminPageEditorDemo />);

    expect(container.querySelector("[data-showcase-fixture-dock]")).toBeTruthy();
    expect(screen.getByLabelText("单页编辑器")).toBeTruthy();
    expect(container.querySelector('[data-slot="document-editor-shell"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="page-header"]')).toBeNull();
    expect(screen.getByLabelText("单页编辑画布")).toBeTruthy();
    expect(screen.getByLabelText("单页元数据 Inspector")).toBeTruthy();
    expect(screen.queryByLabelText("编辑器导航")).toBeNull();
    expect(screen.queryByText("文档导航")).toBeNull();
    expect(screen.queryByText(/版本历史/)).toBeNull();
    expect(screen.getByDisplayValue("关于我们")).toBeTruthy();
    expect(screen.getByDisplayValue("about-us")).toBeTruthy();
    expect(screen.getByLabelText("单页正文 Markdown")).toBeTruthy();
    expect(screen.getByRole("button", { name: "编辑" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "分屏" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByRole("button", { name: "预览" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.queryByRole("option", { name: "定时发布" })).toBeNull();
    expect(screen.queryByText(/只读模式/)).toBeNull();
  });

  it("keeps unsaved page content while switching edit, split and preview", () => {
    render(<BlogAdminPageEditorDemo />);
    const body = screen.getByLabelText("单页正文 Markdown") as HTMLTextAreaElement;

    fireEvent.change(body, { target: { value: "## 新页面章节\n\n不会丢失的正文" } });
    fireEvent.click(screen.getByRole("button", { name: "分屏" }));
    expect(screen.getByLabelText("单页正文 Markdown")).toBeTruthy();
    expect(screen.getByLabelText("单页预览")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "预览" }));
    expect(screen.queryByLabelText("单页正文 Markdown")).toBeNull();
    expect(screen.getByLabelText("单页预览")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "编辑" }));
    expect((screen.getByLabelText("单页正文 Markdown") as HTMLTextAreaElement).value).toBe("## 新页面章节\n\n不会丢失的正文");
  });

  it("requires both title and slug before a new page can persist", () => {
    render(<BlogAdminPageEditorDemo initialRoute="new" />);

    fireEvent.change(screen.getByLabelText("标题"), { target: { value: "新单页" } });
    fireEvent.click(screen.getByRole("button", { name: "保存草稿" }));
    expect(screen.getByText("请填写单页访问路径 (Slug)。")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("访问路径 (Slug)"), { target: { value: "new-page" } });
    fireEvent.click(screen.getByRole("button", { name: "保存草稿" }));

    expect(screen.getByText("单页草稿已保存。")).toBeTruthy();
    expect(screen.getByText("已于 23:58 保存")).toBeTruthy();
    expect((screen.getByLabelText("标题") as HTMLTextAreaElement).value).toBe("新单页");
    expect((screen.getByLabelText("访问路径 (Slug)") as HTMLInputElement).value).toBe("new-page");
  });

  it("persists a dirty new page before opening the frontsite preview", () => {
    render(<BlogAdminPageEditorDemo initialRoute="new" />);

    fireEvent.change(screen.getByLabelText("标题"), { target: { value: "预览单页" } });
    fireEvent.change(screen.getByLabelText("访问路径 (Slug)"), { target: { value: "preview-page" } });
    fireEvent.change(screen.getByLabelText("单页正文 Markdown"), { target: { value: "尚未保存的预览正文" } });
    fireEvent.click(screen.getByRole("button", { name: "预览前台页面" }));

    expect(screen.getByText("已先保存并打开 /preview-page（Showcase 模拟）。")).toBeTruthy();
    expect(screen.getByText("已于 23:58 保存")).toBeTruthy();
    expect((screen.getByLabelText("单页正文 Markdown") as HTMLTextAreaElement).value).toBe("尚未保存的预览正文");
  });

  it("preserves the backend 409 conflict message without discarding the draft", () => {
    render(<BlogAdminPageEditorDemo initialScenario="conflict" />);

    fireEvent.change(screen.getByLabelText("标题"), { target: { value: "发生冲突但仍保留" } });
    fireEvent.click(screen.getByRole("button", { name: "保存草稿" }));

    expect(screen.getByText("单页已被其他编辑者更新（409 冲突）")).toBeTruthy();
    expect((screen.getByLabelText("标题") as HTMLTextAreaElement).value).toBe("发生冲突但仍保留");
    expect(screen.getByText("有未保存的更改")).toBeTruthy();
  });

  it("keeps page template, navigation visibility and sort order product-owned", () => {
    render(<BlogAdminPageEditorDemo />);

    const template = screen.getByRole("combobox", { name: "显示模板" });
    fireEvent.click(template);
    fireEvent.click(screen.getByRole("option", { name: "问答与指南 (FAQ)" }));
    expect(template.textContent).toContain("问答与指南");

    const navigation = screen.getByRole("checkbox", { name: /显示在顶部主导航栏/ }) as HTMLInputElement;
    expect(navigation.checked).toBe(true);
    fireEvent.click(navigation);
    expect(screen.queryByLabelText("导航排序权重")).toBeNull();
    fireEvent.click(navigation);

    const order = screen.getByLabelText("导航排序权重") as HTMLInputElement;
    fireEvent.change(order, { target: { value: "20" } });
    expect(order.value).toBe("20");
  });

  it("keeps field AI attached to title, summary and slug", () => {
    render(<BlogAdminPageEditorDemo />);

    fireEvent.click(screen.getByRole("button", { name: "AI 生成标题候选" }));
    fireEvent.click(screen.getByRole("button", { name: /关于我们：技术、产品与长期主义/ }));
    expect((screen.getByLabelText("标题") as HTMLTextAreaElement).value).toBe("关于我们：技术、产品与长期主义");

    fireEvent.click(screen.getByRole("button", { name: "AI 根据正文生成摘要" }));
    fireEvent.click(screen.getByRole("button", { name: /介绍团队背景、技术方向、产品理念与长期目标/ }));
    expect((screen.getByLabelText("摘要 / 描述") as HTMLTextAreaElement).value).toContain("产品理念");

    fireEvent.click(screen.getByRole("button", { name: "AI 生成 Slug 候选" }));
    fireEvent.click(screen.getByRole("button", { name: /team-and-vision/ }));
    expect((screen.getByLabelText("访问路径 (Slug)") as HTMLInputElement).value).toBe("team-and-vision");
  });

  it("reviews metadata suggestions before applying and does not change page configuration", () => {
    render(<BlogAdminPageEditorDemo />);

    const template = screen.getByRole("combobox", { name: "显示模板" });
    expect(template.textContent).toContain("关于页专用模板");
    const navigation = screen.getByRole("checkbox", { name: /显示在顶部主导航栏/ }) as HTMLInputElement;
    expect(navigation.checked).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "智能补全" }));
    expect(screen.getByLabelText("AI 元数据建议")).toBeTruthy();
    expect(screen.getByText("AI 建议 4 项修改")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "全部应用" }));

    expect(screen.getByText(/已应用 AI 元数据建议/)).toBeTruthy();
    expect((screen.getByLabelText("访问路径 (Slug)") as HTMLInputElement).value).toBe("about-us");
    expect(template.textContent).toContain("关于页专用模板");
    expect(navigation.checked).toBe(true);
  });

  it("keeps writing and image generation inside MarkdownEditor tools", async () => {
    render(<BlogAdminPageEditorDemo />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "AI 写作" }), {
      button: 0,
      ctrlKey: false,
    });
    fireEvent.click(screen.getByRole("menuitem", { name: "继续写作" }));
    expect(screen.getByLabelText("AI 写作助手")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "生成 / 执行" }));
    expect(screen.getByText("生成结果预览")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "追加到末尾" }));
    expect((screen.getByLabelText("单页正文 Markdown") as HTMLTextAreaElement).value).toContain("我们相信什么");

    fireEvent.pointerDown(screen.getByRole("button", { name: "插入内容" }), {
      button: 0,
      ctrlKey: false,
    });
    fireEvent.click(screen.getByRole("menuitem", { name: "AI 生成图片" }));
    expect(screen.getByLabelText("AI 图片生成器")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("生图提示词"), { target: { value: "Technology team illustration" } });
    fireEvent.change(screen.getByLabelText("图片描述 Alt"), { target: { value: "团队与开放技术" } });
    fireEvent.click(screen.getByRole("button", { name: "开始生图" }));
    expect(screen.getByText("AI 生成插图预览")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "插入光标位置" }));
    await waitFor(() => {
      expect((screen.getByLabelText("单页正文 Markdown") as HTMLTextAreaElement).value).toContain("![团队与开放技术](/media/ai-generated-page.webp)");
    });
  });

  it("guards dirty navigation with the canonical description-only Modal", () => {
    const { container } = render(<BlogAdminPageEditorDemo />);

    fireEvent.change(screen.getByLabelText("标题"), { target: { value: "准备离开的草稿" } });
    fireEvent.click(screen.getByRole("button", { name: "返回单页列表" }));

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("离开编辑器后，尚未保存的内容会丢失。")).toBeTruthy();
    expect(container.querySelector('[data-slot="modal-body"]')).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "放弃并离开" }));
    expect(screen.getByText("已放弃更改，将返回 /admin/pages（Showcase 模拟）。")).toBeTruthy();
  });
});
