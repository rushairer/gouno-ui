import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminMediaDemo } from "../showcase/demos/products/blog-admin-media";

afterEach(cleanup);

function openFixture() {
  if (!screen.queryByRole("radio", { name: "有数据" })) {
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
  }
}

describe("Blog Admin Media Library product migration fixture", () => {
  it("preserves PageHeader and keeps Fixture metadata outside product flow", () => {
    render(<BlogAdminMediaDemo />);

    const header = screen.getByRole("heading", { level: 1, name: "媒体库" });
    expect(header.closest('[data-slot="page-header"]')).toBeTruthy();
    expect(screen.getByRole("button", { name: "AI 文生图" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "上传图片" })).toBeTruthy();
    expect(screen.queryByText("/admin/media")).toBeNull();

    openFixture();
    expect(screen.getByText("/admin/media")).toBeTruthy();
  });

  it("preserves search/type filtering and full-bleed media-card anatomy", () => {
    const { container } = render(<BlogAdminMediaDemo />);

    expect(screen.getByText("design-system-cover.webp")).toBeTruthy();
    expect(screen.getByText("oauth-bff-flow.png")).toBeTruthy();
    expect(container.querySelectorAll('[data-slot="card"].overflow-clip').length).toBeGreaterThan(0);

    fireEvent.change(screen.getByRole("textbox", { name: "搜索媒体" }), { target: { value: "OAuth" } });
    expect(screen.getByText("oauth-bff-flow.png")).toBeTruthy();
    expect(screen.queryByText("design-system-cover.webp")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "清除" }));
    fireEvent.click(screen.getByRole("combobox", { name: "媒体类型" }));
    fireEvent.click(screen.getByRole("option", { name: "SVG" }));
    expect(screen.getByText("kafka-backpressure.svg")).toBeTruthy();
    expect(screen.getByText("favicon.svg")).toBeTruthy();
    expect(screen.queryByText("oauth-bff-flow.png")).toBeNull();
  });

  it("validates BulkActionBar in a visual asset Grid and keeps reference failures selected", () => {
    render(<BlogAdminMediaDemo />);

    fireEvent.click(screen.getByRole("checkbox", { name: "选择媒体 design-system-cover.webp" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "选择媒体 oauth-bff-flow.png" }));

    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("bulk-action-bar");
    expect(screen.getByText("已选择 2 个媒体")).toBeTruthy();

    fireEvent.click(within(toolbar).getByRole("button", { name: "删除" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("确认永久删除选中的 2 个媒体？仍被文章引用的媒体将保留。")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "永久删除" }));

    expect(screen.queryByText("design-system-cover.webp")).toBeNull();
    expect(screen.getByText("oauth-bff-flow.png")).toBeTruthy();
    expect(screen.getByText("已选择 1 个媒体")).toBeTruthy();
    expect(screen.getByText("已删除 1 个媒体；1 个未删除：仍被文章引用。")).toBeTruthy();
    expect(screen.getByText("OAuth 2.0 Authorization Code + PKCE 的 BFF 实践")).toBeTruthy();
  });

  it("preserves copy and alt-text editing workflows", () => {
    render(<BlogAdminMediaDemo />);

    fireEvent.click(screen.getByRole("button", { name: "复制相对地址 design-system-cover.webp" }));
    expect(screen.getByText("已复制 /uploads/design-system-cover.webp（Showcase 模拟）。")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "编辑替代文本 design-system-cover.webp" }));
    const drawer = screen.getByRole("dialog");
    fireEvent.change(within(drawer).getByRole("textbox", { name: "编辑替代文本" }), { target: { value: "新的设计系统封面说明" } });
    fireEvent.click(within(drawer).getByRole("button", { name: "保存修改" }));

    expect(screen.getByText("替代文本已更新（Showcase 模拟）。")).toBeTruthy();
    expect(screen.getByText("替代文本：新的设计系统封面说明")).toBeTruthy();
  });

  it("preserves upload and AI image-generation drawers without extending Core Upload", () => {
    render(<BlogAdminMediaDemo />);

    fireEvent.click(screen.getByRole("button", { name: "上传图片" }));
    let drawer = screen.getByRole("dialog");
    const file = new File(["fixture"], "new-cover.webp", { type: "image/webp" });
    fireEvent.change(within(drawer).getByLabelText("图片文件"), { target: { files: [file] } });
    fireEvent.change(within(drawer).getByRole("textbox", { name: "上传替代文本" }), { target: { value: "新上传封面" } });
    fireEvent.click(within(drawer).getByRole("button", { name: "上传图片" }));

    expect(screen.getByText("图片“new-cover.webp”已上传（Showcase 模拟）。")).toBeTruthy();
    expect(screen.getByText("new-cover.webp")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "AI 文生图" }));
    drawer = screen.getByRole("dialog");
    fireEvent.change(within(drawer).getByRole("textbox", { name: "生图提示词" }), { target: { value: "分布式任务调度架构插画" } });
    fireEvent.change(within(drawer).getByRole("textbox", { name: "AI 图片替代文本" }), { target: { value: "分布式架构图" } });
    fireEvent.click(within(drawer).getByRole("button", { name: "生成并入库" }));

    expect(screen.getByText("AI 图片已生成并自动存入媒体库（Showcase 模拟）。")).toBeTruthy();
    expect(screen.getByText(/ai-generated-\d+\.png/)).toBeTruthy();
    expect(screen.getByText("替代文本：分布式架构图")).toBeTruthy();
  });

  it("preserves loading, empty and error states", () => {
    render(<BlogAdminMediaDemo />);

    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "加载中" }));
    expect(screen.getByRole("status", { name: "媒体加载中" })).toBeTruthy();

    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "空状态" }));
    expect(screen.getByText("没有符合条件的媒体资源")).toBeTruthy();

    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "错误" }));
    expect(screen.getByText("媒体加载失败")).toBeTruthy();
  });
});
