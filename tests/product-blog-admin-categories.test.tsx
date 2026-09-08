import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminCategoriesDemo } from "../showcase/demos/products/blog-admin-categories";

afterEach(cleanup);

describe("Blog Admin Categories product migration fixture", () => {
  it("preserves the route-level PageHeader and keeps Fixture metadata outside product flow", () => {
    render(<BlogAdminCategoriesDemo />);

    const header = screen.getByRole("heading", { level: 1, name: "分类" });
    expect(header.closest('[data-slot="page-header"]')).toBeTruthy();
    expect(screen.queryByText("/admin/categories")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/admin/categories")).toBeTruthy();
  });

  it("preserves category table semantics and stable row actions", () => {
    render(<BlogAdminCategoriesDemo />);

    expect(screen.getByRole("table")).toBeTruthy();
    expect(screen.getByText("工程实践")).toBeTruthy();
    expect(screen.getByText("engineering-practice")).toBeTruthy();
    expect(screen.getByRole("button", { name: "编辑分类 工程实践" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "删除分类 工程实践" })).toBeTruthy();
  });

  it("preserves create/edit Drawer and AI Slug assistance", () => {
    render(<BlogAdminCategoriesDemo />);

    fireEvent.click(screen.getByRole("button", { name: "新建分类" }));
    expect(screen.getByText("创建一个可长期复用的内容主题。")).toBeTruthy();

    fireEvent.change(screen.getByRole("textbox", { name: "分类名称" }), { target: { value: "Design System" } });
    fireEvent.click(screen.getByRole("button", { name: "AI 生成" }));
    fireEvent.click(screen.getByRole("button", { name: "design-system" }));
    fireEvent.click(screen.getByRole("button", { name: "创建分类" }));

    expect(screen.getByText("分类“Design System”已创建（Showcase 模拟）。")).toBeTruthy();
    expect(screen.getByText("Design System")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "编辑分类 Design System" }));
    fireEvent.change(screen.getByRole("textbox", { name: "分类描述" }), { target: { value: "验证分类编辑工作流。" } });
    fireEvent.click(screen.getByRole("button", { name: "保存修改" }));
    expect(screen.getByText("验证分类编辑工作流。")).toBeTruthy();
  });

  it("repeats the selection-aware bulk toolbar contract without a shared Pattern yet", () => {
    render(<BlogAdminCategoriesDemo />);

    fireEvent.click(screen.getByRole("checkbox", { name: "选择分类 工程实践" }));
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar).toBeTruthy();
    expect(screen.getByText("已选择 1 个分类")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "交给 AI" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("将所选分类交给 AI")).toBeTruthy();
    expect(within(dialog).getByText("工程实践")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "启动工作流" }));
    expect(screen.getByText("已将 1 个分类交给 AI 工作流（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves destructive confirmation and loading/empty/error states", () => {
    render(<BlogAdminCategoriesDemo />);

    fireEvent.click(screen.getByRole("button", { name: "删除分类 身份安全" }));
    expect(screen.getByText("删除分类“身份安全”？相关文章会移至未分类。")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "确认删除" }));
    expect(screen.queryByText("身份安全")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "加载中" }));
    expect(screen.getByRole("status")).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "空状态" }));
    expect(screen.getByText("还没有分类")).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "错误" }));
    expect(screen.getByText("分类加载失败")).toBeTruthy();
  });
});
