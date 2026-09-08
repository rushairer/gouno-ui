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

    fireEvent.change(screen.getByLabelText("单页状态"), { target: { value: "draft" } });
    expect(screen.getAllByText("服务条款").length).toBeGreaterThan(0);
    expect(screen.queryByText("友情链接")).toBeNull();
  });

  it("uses canonical BulkActionBar and keeps AI resource semantics product-owned", () => {
    render(<BlogAdminPagesDemo />);

    const [desktopCheckbox] = screen.getAllByLabelText("选择单页 关于我");
    fireEvent.click(desktopCheckbox);

    expect(screen.getByText("已选择 1 页")).toBeTruthy();
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("bulk-action-bar");

    fireEvent.click(screen.getByRole("button", { name: "交给 AI" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("将所选单页交给 AI")).toBeTruthy();
    expect(within(dialog).getByText("/about")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "启动工作流" }));
    expect(screen.getByText("已将 1 个单页交给 AI 工作流（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves single-page destructive confirmation", () => {
    render(<BlogAdminPagesDemo />);

    fireEvent.click(screen.getAllByRole("button", { name: "删除单页 服务条款" })[0]);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("删除单页")).toBeTruthy();
    expect(within(dialog).getByText(/确认永久删除《服务条款》/)).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "永久删除" }));

    expect(screen.queryByText("服务条款")).toBeNull();
    expect(screen.getByText("单页《服务条款》已删除（Showcase 模拟）。")).toBeTruthy();
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
