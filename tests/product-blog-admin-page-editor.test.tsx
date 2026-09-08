import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminPageEditorDemo } from "../showcase/demos/products/blog-admin-page-editor";

afterEach(cleanup);

describe("Blog Admin PageEditor", () => {
  it("preserves the independent two-column editor grammar without forcing PostEditor features", () => {
    const { container } = render(<BlogAdminPageEditorDemo />);

    expect(container.querySelector("[data-showcase-fixture-dock]")).toBeTruthy();
    expect(screen.getByLabelText("单页编辑器")).toBeTruthy();
    expect(container.querySelector('[data-slot="page-header"]')).toBeNull();
    expect(screen.getByLabelText("单页编辑画布")).toBeTruthy();
    expect(screen.getByLabelText("单页元数据 Inspector")).toBeTruthy();
    expect(screen.queryByLabelText("编辑器导航")).toBeNull();
    expect(screen.queryByRole("button", { name: /版本历史/ })).toBeNull();
    expect(screen.getByDisplayValue("关于我们")).toBeTruthy();
    expect(screen.getByDisplayValue("about-us")).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Markdown" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "预览" }).getAttribute("aria-selected")).toBe("false");
    expect(screen.queryByRole("option", { name: "定时发布" })).toBeNull();
    expect(screen.queryByText(/只读模式/)).toBeNull();
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

    const navigation = screen.getByRole("checkbox", { name: "显示在顶部主导航栏" }) as HTMLInputElement;
    expect(navigation.checked).toBe(true);
    fireEvent.click(navigation);
    expect(screen.queryByLabelText("导航排序权重")).toBeNull();
    fireEvent.click(navigation);

    const order = screen.getByLabelText("导航排序权重") as HTMLInputElement;
    fireEvent.change(order, { target: { value: "20" } });
    expect(order.value).toBe("20");
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

  it("preserves AI metadata, writing and image insertion as page-owned orchestration", () => {
    render(<BlogAdminPageEditorDemo />);

    fireEvent.click(screen.getByRole("button", { name: "AI 一键补全元数据" }));
    expect(screen.getByText(/AI 已补全摘要、Slug 与 SEO/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "AI 写作与润色" }));
    fireEvent.click(screen.getByRole("button", { name: "生成 / 执行" }));
    expect(screen.getByText("生成结果预览")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "追加到末尾" }));
    expect((screen.getByLabelText("单页正文 Markdown") as HTMLTextAreaElement).value).toContain("我们相信什么");

    fireEvent.click(screen.getByRole("button", { name: "AI 文生图插画" }));
    fireEvent.change(screen.getByLabelText("图片描述 Alt"), { target: { value: "团队与开放技术" } });
    fireEvent.click(screen.getByRole("button", { name: "开始生图" }));
    expect(screen.getByText("AI 生成插图预览")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "插入到正文末尾" }));
    expect((screen.getByLabelText("单页正文 Markdown") as HTMLTextAreaElement).value).toContain("![团队与开放技术](/media/ai-generated-page.webp)");
  });
});
