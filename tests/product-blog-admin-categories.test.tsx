import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminCategoriesDemo } from "../showcase/demos/products/blog-admin/categories";

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

  it("preserves desktop Table and mobile Card collection with stable actions", () => {
    render(<BlogAdminCategoriesDemo />);
    expect(screen.getByRole("table")).toBeTruthy();
    expect(screen.getByRole("list", { name: "分类列表" })).toBeTruthy();
    expect(screen.getAllByText("工程实践").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("engineering-practice").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByRole("button", { name: "编辑分类 工程实践" }).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByRole("button", { name: "删除分类 工程实践" }).length).toBeGreaterThanOrEqual(2);
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
    expect(screen.getAllByText("Design System").length).toBeGreaterThanOrEqual(2);
    fireEvent.click(screen.getAllByRole("button", { name: "编辑分类 Design System" })[0]);
    fireEvent.change(screen.getByRole("textbox", { name: "分类描述" }), { target: { value: "验证分类编辑工作流。" } });
    fireEvent.click(screen.getByRole("button", { name: "保存修改" }));
    expect(screen.getAllByText("验证分类编辑工作流。").length).toBeGreaterThanOrEqual(2);
  });

  it("reuses the product-local WorkflowLauncher for category resources", () => {
    render(<BlogAdminCategoriesDemo />);
    fireEvent.click(screen.getAllByRole("checkbox", { name: "选择分类 工程实践" })[0]);
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("bulk-action-bar");
    expect(screen.getByText("已选择 1 个分类")).toBeTruthy();

    fireEvent.click(within(toolbar).getByRole("button", { name: "交给 AI" }));
    const dialog = screen.getByRole("dialog", { name: "将所选分类交给 AI" });
    expect((within(dialog).getByRole("combobox", { name: "Workflow" }) as HTMLButtonElement).textContent).toContain("分类与标签整理");
    expect(within(dialog).getByText("工程实践")).toBeTruthy();
    expect(within(dialog).getByText("/engineering-practice · 18 篇文章")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "运行" }));
    expect(within(dialog).getByText("Workflow 已提交（Run #261）。范围已锁定到本次选择的 1 项资源。")).toBeTruthy();
  });

  it("preserves real partial batch-delete failure and retains failed selection", () => {
    render(<BlogAdminCategoriesDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "批量部分失败" }));
    fireEvent.click(screen.getAllByRole("checkbox", { name: "选择分类 工程实践" })[0]);
    fireEvent.click(screen.getAllByRole("checkbox", { name: "选择分类 身份安全" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "删除" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "确认删除" }));
    expect(screen.queryByText("工程实践")).toBeNull();
    expect(screen.getAllByText("身份安全").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("已选择 1 个分类")).toBeTruthy();
    expect(screen.getByText("已删除 1 个分类；1 个未删除：模拟 API 拒绝删除，失败项继续保持选中。")).toBeTruthy();
    expect(screen.getByRole("alert").getAttribute("data-type")).toBe("error");
  });

  it("preserves destructive confirmation and loading/empty/error states", () => {
    render(<BlogAdminCategoriesDemo />);
    fireEvent.click(screen.getAllByRole("button", { name: "删除分类 身份安全" })[0]);
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
