import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminPagesDemo } from "../showcase/demos/products/blog-admin-pages";

afterEach(cleanup);

describe("Blog Admin Pages product migration fixture", () => {
  it("uses PageHeader while keeping Fixture metadata outside product flow", () => {
    render(<BlogAdminPagesDemo />);

    const header = screen.getByRole("heading", { level: 1, name: "单页" });
    expect(header.closest('[data-slot="page-header"]')).toBeTruthy();
    expect(screen.queryByText("/admin/pages")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/admin/pages")).toBeTruthy();
    expect(screen.getByRole("radio", { name: "有数据" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "删除成功" })).toBeTruthy();
  });

  it("preserves page metadata, responsive collection structure and row actions", () => {
    render(<BlogAdminPagesDemo />);

    expect(screen.getAllByText("关于我").length).toBeGreaterThan(0);
    expect(screen.getAllByText("/about").length).toBeGreaterThan(0);
    expect(screen.getAllByText("profile").length).toBeGreaterThan(0);
    expect(screen.getAllByText("主导航 · 10").length).toBeGreaterThan(0);
    expect(screen.getAllByText("已发布").length).toBeGreaterThan(0);
    expect(screen.getByRole("list", { name: "单页列表" })).toBeTruthy();

    expect(screen.getAllByRole("button", { name: "查看单页 关于我" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "复制单页链接 关于我" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "编辑单页 关于我" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "删除单页 关于我" }).length).toBeGreaterThan(0);
  });

  it("keeps search/status filters and filtered empty state product-local", () => {
    render(<BlogAdminPagesDemo />);

    fireEvent.change(screen.getByLabelText("搜索单页"), { target: { value: "不存在的单页关键词" } });
    expect(screen.getByText("没有符合当前筛选条件的单页")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "清除" }));
    expect(screen.getAllByText("关于我").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("combobox", { name: "单页状态" }));
    fireEvent.click(screen.getByRole("option", { name: "草稿" }));
    expect(screen.getAllByText("服务条款").length).toBeGreaterThan(0);
    expect(screen.queryByText("友情链接")).toBeNull();
  });

  it("restores the page-specific Workflow launcher and resource input semantics", () => {
    render(<BlogAdminPagesDemo />);

    fireEvent.click(screen.getAllByLabelText("选择单页 关于我")[0]);
    expect(screen.getByText("已选择 1 页")).toBeTruthy();
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("bulk-action-bar");

    fireEvent.click(screen.getByRole("button", { name: "交给 AI" }));
    const dialog = screen.getByRole("dialog", { name: "将所选单页交给 AI" });
    expect(within(dialog).getByRole("combobox", { name: "Workflow" })).toHaveValue("73");
    expect(within(dialog).getByText("单页审校与优化（手选）")).toBeTruthy();
    expect(within(dialog).getByText("关于我")).toBeTruthy();
    expect(within(dialog).getByText("/about")).toBeTruthy();

    fireEvent.click(within(dialog).getByRole("button", { name: "运行" }));
    expect(within(dialog).getByText("Workflow 已提交（Run #251）。范围已固定为本次输入的 1 个单页。")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "打开运行中心" }));
    expect(screen.getByText("将进入 /admin/ai-ops?tab=records&record=workflow&workflow=73（Showcase 模拟）。")).toBeTruthy();
  });

  it("allows the Workflow resource field to remove a preselected page", () => {
    render(<BlogAdminPagesDemo />);
    fireEvent.click(screen.getAllByLabelText("选择单页 关于我")[0]);
    fireEvent.click(screen.getByRole("button", { name: "交给 AI" }));

    const dialog = screen.getByRole("dialog", { name: "将所选单页交给 AI" });
    fireEvent.click(within(dialog).getByRole("button", { name: "移除" }));
    expect(within(dialog).getByText("至少保留 1 个单页资源才能运行。")).toBeTruthy();
    expect(within(dialog).getByRole("button", { name: "运行" })).toBeDisabled();
  });

  it("preserves single-page destructive confirmation", () => {
    render(<BlogAdminPagesDemo />);

    fireEvent.click(screen.getAllByRole("button", { name: "删除单页 服务条款" })[0]);
    const dialog = screen.getByRole("dialog", { name: "删除单页" });
    expect(within(dialog).getByText(/确认永久删除《服务条款》/)).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "永久删除" }));

    expect(screen.queryByText("服务条款")).toBeNull();
    expect(screen.getByText("单页《服务条款》已删除（Showcase 模拟）。")).toBeTruthy();
  });

  it("keeps rows, selection and confirmation intact when page deletion fails", () => {
    render(<BlogAdminPagesDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "删除失败" }));
    fireEvent.click(screen.getAllByLabelText("选择单页 关于我")[0]);
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    fireEvent.click(within(toolbar).getByRole("button", { name: "删除" }));

    const dialog = screen.getByRole("dialog", { name: "批量删除单页" });
    fireEvent.click(within(dialog).getByRole("button", { name: "永久删除" }));

    expect(screen.getByText("删除单页失败；当前列表、选择与确认窗口保持不变，可直接重试（Showcase 模拟）。")).toBeTruthy();
    expect(screen.getByRole("dialog", { name: "批量删除单页" })).toBeTruthy();
    expect(screen.getByText("已选择 1 页")).toBeTruthy();
    expect(screen.getAllByText("关于我").length).toBeGreaterThan(0);
  });

  it("preserves pagination over the responsive collection", () => {
    render(<BlogAdminPagesDemo />);

    const pagination = screen.getByRole("navigation", { name: "单页分页" });
    expect(within(pagination).getByText("1-4 / 6 页")).toBeTruthy();
    fireEvent.click(within(pagination).getByRole("button", { name: "Page 2" }));
    expect(within(pagination).getByText("5-6 / 6 页")).toBeTruthy();
    expect(screen.getAllByText("站点历史").length).toBeGreaterThan(0);
  });

  it("preserves loading, empty and error states in isolated fixture renders", () => {
    const renderScenario = (name: "加载中" | "空状态" | "错误") => {
      render(<BlogAdminPagesDemo />);
      fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
      fireEvent.click(screen.getByRole("radio", { name }));
    };

    renderScenario("加载中");
    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.getByText("正在加载单页…")).toBeTruthy();
    cleanup();

    renderScenario("空状态");
    expect(screen.getByText("还没有创建过独立单页")).toBeTruthy();
    cleanup();

    renderScenario("错误");
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("data-type")).toBe("error");
    expect(screen.getByText("单页加载失败")).toBeTruthy();
  });
});
