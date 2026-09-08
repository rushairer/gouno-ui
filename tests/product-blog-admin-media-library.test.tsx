import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminMediaLibraryDemo } from "../showcase/demos/products/blog-admin-media-library";

afterEach(cleanup);

describe("Blog Admin Media Library product migration fixture", () => {
  it("uses PageHeader and keeps Fixture metadata outside product flow", () => {
    render(<BlogAdminMediaLibraryDemo />);

    const header = screen.getByRole("heading", { level: 1, name: "媒体库" });
    expect(header.closest('[data-slot="page-header"]')).toBeTruthy();
    expect(screen.getByRole("button", { name: "AI 文生图" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "上传图片" })).toBeTruthy();
    expect(screen.queryByText("/admin/medialibrary")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/admin/medialibrary")).toBeTruthy();
  });

  it("preserves media metadata, search and content-type filtering", () => {
    render(<BlogAdminMediaLibraryDemo />);

    expect(screen.getByRole("list", { name: "媒体资源" })).toBeTruthy();
    expect(screen.getByText("oauth-bff-flow.svg")).toBeTruthy();
    expect(screen.getByText("引用 2")).toBeTruthy();
    expect(screen.getByText("5 / 5")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("搜索媒体"), { target: { value: "favicon" } });
    expect(screen.getByText("site-favicon.ico")).toBeTruthy();
    expect(screen.queryByText("oauth-bff-flow.svg")).toBeNull();
    expect(screen.getByText("1 / 5")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "清除" }));

    fireEvent.click(screen.getByRole("combobox", { name: "媒体类型" }));
    fireEvent.click(screen.getByRole("option", { name: "SVG" }));
    expect(screen.getByText("2 / 5")).toBeTruthy();
    expect(screen.getByText("oauth-bff-flow.svg")).toBeTruthy();
    expect(screen.getByText("go-worker-architecture.svg")).toBeTruthy();
    expect(screen.queryByText("design-system-cover.png")).toBeNull();
  });

  it("uses canonical BulkActionBar and keeps AI resource semantics product-owned", () => {
    render(<BlogAdminMediaLibraryDemo />);

    fireEvent.click(screen.getByRole("checkbox", { name: "选择媒体 design-system-cover.png" }));
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("bulk-action-bar");
    expect(screen.getByText("已选择 1 个媒体")).toBeTruthy();

    fireEvent.click(within(toolbar).getByRole("button", { name: "交给 AI" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("将所选媒体交给 AI")).toBeTruthy();
    expect(within(dialog).getByText("design-system-cover.png")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "启动工作流" }));
    expect(screen.getByText("已将 1 个媒体交给 AI 工作流（Showcase 模拟）。")).toBeTruthy();
  });

  it("blocks deletion for referenced media and exposes the referencing posts", () => {
    render(<BlogAdminMediaLibraryDemo />);

    fireEvent.click(screen.getByRole("button", { name: "删除媒体 oauth-bff-flow.svg" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("删除媒体")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "永久删除" }));

    expect(screen.getByText("oauth-bff-flow.svg")).toBeTruthy();
    expect(screen.getByText("该媒体仍被文章引用，移除引用后才能删除。")).toBeTruthy();
    expect(screen.getByRole("button", { name: "OAuth 2.0 BFF 实践" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "浏览器 Session 边界" })).toBeTruthy();
  });

  it("preserves Promise.allSettled-style partial batch deletion and failed selection", () => {
    render(<BlogAdminMediaLibraryDemo />);

    fireEvent.click(screen.getByRole("checkbox", { name: "选择媒体 oauth-bff-flow.svg" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "选择媒体 design-system-cover.png" }));
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    fireEvent.click(within(toolbar).getByRole("button", { name: "删除" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("批量删除媒体")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "永久删除" }));

    expect(screen.queryByText("design-system-cover.png")).toBeNull();
    expect(screen.getByText("oauth-bff-flow.svg")).toBeTruthy();
    expect(screen.getByText("已选择 1 个媒体")).toBeTruthy();
    expect(screen.getByText("已删除 1 个媒体；1 个未删除：可能仍被文章引用。")).toBeTruthy();
  });

  it("uses canonical Upload for SVG/ICO-compatible upload and stores the new asset", () => {
    render(<BlogAdminMediaLibraryDemo />);

    fireEvent.click(screen.getByRole("button", { name: "上传图片" }));
    const dialog = screen.getByRole("dialog");
    const input = within(dialog).getByLabelText("媒体文件");
    expect(input.getAttribute("accept")).toBe("image/*,.svg,.ico");

    const file = new File(["<svg></svg>"], "architecture-new.svg", { type: "image/svg+xml" });
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.change(within(dialog).getByLabelText("上传图片替代文本"), { target: { value: "新架构图" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "上传图片" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("architecture-new.svg")).toBeTruthy();
    expect(screen.getByText("图片已上传（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves Alt Text editing", () => {
    render(<BlogAdminMediaLibraryDemo />);

    fireEvent.click(screen.getByRole("button", { name: "编辑替代文本 site-favicon.ico" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("编辑替代文本"), { target: { value: "IO84 站点图标" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "保存修改" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("Alt Text：IO84 站点图标")).toBeTruthy();
    expect(screen.getByText("替代文本已更新（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves AI text-to-image generation and automatic library insertion", () => {
    render(<BlogAdminMediaLibraryDemo />);

    fireEvent.click(screen.getByRole("button", { name: "AI 文生图" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("AI 生图提示词"), { target: { value: "深色分布式系统架构插画" } });
    fireEvent.change(within(dialog).getByLabelText("AI 图片替代文本"), { target: { value: "AI 生成架构插画" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "生成并入库" }));

    expect(within(dialog).getByText(/已自动存入媒体库/)).toBeTruthy();
    expect(screen.getByText("ai-generated-706.png")).toBeTruthy();
    expect(screen.getByText("图片已由 AI 生成并自动存入媒体库（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves loading, empty and error states in isolated fixture renders", () => {
    const renderScenario = (name: "加载中" | "空状态" | "错误") => {
      render(<BlogAdminMediaLibraryDemo />);
      fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
      fireEvent.click(screen.getByRole("radio", { name }));
    };

    renderScenario("加载中");
    expect(screen.getByRole("status", { name: "媒体加载中" })).toBeTruthy();
    cleanup();

    renderScenario("空状态");
    expect(screen.getByText("还没有媒体资源")).toBeTruthy();
    cleanup();

    renderScenario("错误");
    expect(screen.getByText("媒体加载失败")).toBeTruthy();
  });
});
