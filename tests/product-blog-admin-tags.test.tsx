import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminTagsDemo } from "../showcase/demos/products/blog-admin-tags";

afterEach(cleanup);

describe("Blog Admin Tags product migration fixture", () => {
  it("preserves PageHeader and keeps Fixture metadata outside product flow", () => {
    render(<BlogAdminTagsDemo />);

    const header = screen.getByRole("heading", { level: 1, name: "标签" });
    expect(header.closest('[data-slot="page-header"]')).toBeTruthy();
    expect(screen.queryByText("/admin/tags")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/admin/tags")).toBeTruthy();
  });

  it("preserves the responsive tag-card collection and product-owned actions", () => {
    render(<BlogAdminTagsDemo />);

    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.getByText("34 篇")).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "选择标签 React" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "重命名标签 React" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "合并标签 React" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "删除标签 React" })).toBeTruthy();
  });

  it("validates BulkActionBar in a Card Grid without expanding the Pattern API", () => {
    render(<BlogAdminTagsDemo />);

    fireEvent.click(screen.getByRole("checkbox", { name: "选择标签 React" }));
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("bulk-action-bar");
    expect(screen.getByText("已选择 1 个标签")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "交给 AI" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("将所选标签交给 AI")).toBeTruthy();
    expect(within(dialog).getByText("React")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "启动工作流" }));
    expect(screen.getByText("已将 1 个标签交给 AI 工作流（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves rename and merge semantics inside the product workflow", () => {
    render(<BlogAdminTagsDemo />);

    fireEvent.click(screen.getByRole("button", { name: "重命名标签 React" }));
    fireEvent.change(screen.getByRole("textbox", { name: "新标签名称" }), { target: { value: "React UI" } });
    fireEvent.click(screen.getByRole("button", { name: "保存名称" }));
    expect(screen.getByText("React UI")).toBeTruthy();
    expect(screen.getByText("标签“React”已重命名为“React UI”（Showcase 模拟）。")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "合并标签 Kafka" }));
    fireEvent.change(screen.getByRole("textbox", { name: "目标标签" }), { target: { value: "Go" } });
    fireEvent.click(screen.getByRole("button", { name: "合并标签" }));
    expect(screen.queryByText("Kafka")).toBeNull();
    expect(screen.getByText("31 篇")).toBeTruthy();
    expect(screen.getByText("标签“Kafka”已合并至“Go”（Showcase 模拟）。")).toBeTruthy();
  });

  it("keeps failed batch items selected for retry and preserves async states", () => {
    render(<BlogAdminTagsDemo />);

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "批量部分失败" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "选择标签 React" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "选择标签 OAuth" }));
    fireEvent.click(screen.getByRole("button", { name: "删除" }));
    fireEvent.click(screen.getByRole("button", { name: "确认删除" }));

    expect(screen.queryByText("React")).toBeNull();
    expect(screen.getByText("OAuth")).toBeTruthy();
    expect(screen.getByText("已选择 1 个标签")).toBeTruthy();
    expect(screen.getByText("已删除 1 个标签；1 个未删除：模拟 API 拒绝删除，失败项继续保持选中。")).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "加载中" }));
    expect(screen.getByRole("status", { name: "标签加载中" })).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "空状态" }));
    expect(screen.getByText("文章添加标签后会自动在这里汇总。")).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "错误" }));
    expect(screen.getByText("标签加载失败")).toBeTruthy();
  });
});
