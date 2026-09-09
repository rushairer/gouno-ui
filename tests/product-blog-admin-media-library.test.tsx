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
    expect(screen.queryByText("/admin/media")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/admin/media")).toBeTruthy();
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

  it("restores media_asset WorkflowLauncher resource and Run semantics", () => {
    render(<BlogAdminMediaLibraryDemo />);

    fireEvent.click(screen.getByRole("checkbox", { name: "选择媒体 design-system-cover.png" }));
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("bulk-action-bar");
    expect(screen.getByText("已选择 1 个媒体")).toBeTruthy();

    fireEvent.click(within(toolbar).getByRole("button", { name: "交给 AI" }));
    const dialog = screen.getByRole("dialog", { name: "将所选媒体交给 AI" });
    expect((within(dialog).getByRole("combobox", { name: "Workflow" }) as HTMLButtonElement).textContent).toContain("媒体无障碍检查");
    expect(within(dialog).getByText("检查手选媒体的 Alt 文本与复用质量。")).toBeTruthy();
    expect(within(dialog).getByText("design-system-cover.png")).toBeTruthy();
    expect(within(dialog).getByText("PNG · Alt：设计系统文章封面")).toBeTruthy();

    fireEvent.click(within(dialog).getByRole("button", { name: "运行" }));
    expect(within(dialog).getByText("Workflow 已提交（Run #263）。范围已锁定到本次选择的 1 项资源。")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "打开运行中心" }));
    expect(screen.getByText("将进入 /admin/ai-ops?tab=records&record=workflow&workflow=79&run=263（Showcase 模拟）。")).toBeTruthy();
  });

  it("keeps media Workflow scope fixed to the source-page selection", () => {
    render(<BlogAdminMediaLibraryDemo />);
    fireEvent.click(screen.getByRole("checkbox", { name: "选择媒体 design-system-cover.png" }));
    fireEvent.click(screen.getByRole("button", { name: "交给 AI" }));

    const dialog = screen.getByRole("dialog", { name: "将所选媒体交给 AI" });
    expect(within(dialog).queryByRole("button", { name: "移除" })).toBeNull();
    expect(within(dialog).getByText("范围来自当前页面选择，启动后不可在此修改")).toBeTruthy();
    expect((within(dialog).getByRole("button", { name: "运行" }) as HTMLButtonElement).disabled).toBe(false);
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

  it("uses the real image format contract and disables upload until a file is selected", () => {
    render(<BlogAdminMediaLibraryDemo />);

    fireEvent.click(screen.getByRole("button", { name: "上传图片" }));
    const dialog = screen.getByRole("dialog");
    const input = within(dialog).getByLabelText("媒体文件");
    expect(input.getAttribute("accept")).toBe("image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,image/avif,image/bmp,.svg,.ico,.avif,.bmp");
    const uploadButton = within(dialog).getByRole("button", { name: "上传图片" }) as HTMLButtonElement;
    expect(uploadButton.disabled).toBe(true);

    const file = new File(["<svg></svg>"], "architecture-new.svg", { type: "image/svg+xml" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(uploadButton.disabled).toBe(false);
    fireEvent.change(within(dialog).getByLabelText("上传图片替代文本"), { target: { value: "新架构图" } });
    fireEvent.click(uploadButton);

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

  it("restores AI image style presets and disables generation before a prompt exists", () => {
    render(<BlogAdminMediaLibraryDemo />);

    fireEvent.click(screen.getByRole("button", { name: "AI 文生图" }));
    const dialog = screen.getByRole("dialog");
    const generate = within(dialog).getByRole("button", { name: "开始生图并入库" }) as HTMLButtonElement;
    expect(generate.disabled).toBe(true);
    expect(within(dialog).getByRole("button", { name: "📊 架构图解" })).toBeTruthy();
    expect(within(dialog).getByRole("button", { name: "🖼️ 科技插画" })).toBeTruthy();
    expect(within(dialog).getByRole("button", { name: "🧸 简单卡通" })).toBeTruthy();

    fireEvent.click(within(dialog).getByRole("button", { name: "📊 架构图解" }));
    expect((within(dialog).getByLabelText("AI 生图提示词") as HTMLTextAreaElement).value).toBe("A sleek modern architectural diagram illustration showing system components, clean lines, isometric view, tech palette");
    expect(generate.disabled).toBe(false);
  });

  it("preserves AI text-to-image generation and automatic library insertion", () => {
    render(<BlogAdminMediaLibraryDemo />);

    fireEvent.click(screen.getByRole("button", { name: "AI 文生图" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("AI 生图提示词"), { target: { value: "深色分布式系统架构插画" } });
    fireEvent.change(within(dialog).getByLabelText("AI 图片替代文本"), { target: { value: "AI 生成架构插画" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "开始生图并入库" }));

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
