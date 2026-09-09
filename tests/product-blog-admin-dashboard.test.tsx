import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminDashboardDemo } from "../showcase/demos/products/blog-admin-dashboard";

afterEach(cleanup);

describe("Blog Admin Dashboard product migration fixture", () => {
  it("uses PageHeader and keeps the real route in FixtureDock", () => {
    render(<BlogAdminDashboardDemo />);

    const header = screen.getByRole("heading", { level: 1, name: "数据概览" });
    expect(header.closest('[data-slot="page-header"]')).toBeTruthy();
    expect(screen.getByRole("button", { name: "新建文章" })).toBeTruthy();
    expect(screen.queryByText("/admin/dashboard")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/admin/dashboard")).toBeTruthy();
  });

  it("preserves the four operational metrics and their product destinations", () => {
    render(<BlogAdminDashboardDemo />);

    expect(screen.getByText("文章总数")).toBeTruthy();
    expect(screen.getByText("86")).toBeTruthy();
    expect(screen.getByText("总阅读量")).toBeTruthy();
    expect(screen.getByText("128,430")).toBeTruthy();
    expect(screen.getByText("总获赞数")).toBeTruthy();
    expect(screen.getByText("3,842")).toBeTruthy();
    expect(screen.getByText("评论互动")).toBeTruthy();
    expect(screen.getByText("1,268")).toBeTruthy();
    expect(screen.getByText("待审核 7 条")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /文章总数/ }));
    expect(screen.getByText("将进入 /admin/posts（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves traffic trend and content-health semantics", () => {
    render(<BlogAdminDashboardDemo />);

    expect(screen.getByRole("img", { name: "最近 30 天访问趋势" })).toBeTruthy();
    expect(screen.getByText("30 天访问趋势")).toBeTruthy();
    expect(screen.getByText("待审核评论")).toBeTruthy();
    expect(screen.getByText("被举报内容")).toBeTruthy();
    expect(screen.getByText("已发布文章")).toBeTruthy();
    expect(screen.getByText("草稿待发布")).toBeTruthy();
    expect(screen.getByText("系统状态正常")).toBeTruthy();
  });

  it("preserves AI failure alerts, record destinations and mark-all-read", () => {
    render(<BlogAdminDashboardDemo />);

    expect(screen.getByText("AI 运营提醒")).toBeTruthy();
    expect(screen.getByText("AI 每日资讯")).toBeTruthy();
    expect(screen.getByText("文章 SEO Reviewer")).toBeTruthy();

    fireEvent.click(screen.getByText("AI 每日资讯").closest("button")!);
    expect(screen.getByText("将进入 /admin/ai-ops?tab=records&record=workflow&run=241（Showcase 模拟）。")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "全部已读" }));
    expect(screen.queryByText("AI 运营提醒")).toBeNull();
    expect(screen.getByText("AI 运营提醒已全部标记为已读（Showcase 模拟）。")).toBeTruthy();
  });

  it("keeps AI alerts visible when mark-all-read fails", () => {
    render(<BlogAdminDashboardDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "提醒操作失败" }));

    fireEvent.click(screen.getByRole("button", { name: "全部已读" }));

    const failure = screen.getByText("标记 AI 运营提醒为已读失败；提醒仍保留，可稍后重试（Showcase 模拟）。");
    expect(failure.closest('[role="alert"]')?.getAttribute("data-type")).toBe("error");
    expect(screen.getByText("AI 运营提醒")).toBeTruthy();
    expect(screen.getByText("AI 每日资讯")).toBeTruthy();
  });

  it("preserves the Top Posts table and one-line canonical row actions", () => {
    render(<BlogAdminDashboardDemo />);

    expect(screen.getByText("表现最佳文章")).toBeTruthy();
    const table = screen.getByRole("table");
    expect(within(table).getByText("OAuth 2.0 BFF：浏览器为什么不该持有 Token")).toBeTruthy();
    expect(within(table).getByText("28,640")).toBeTruthy();
    expect(within(table).getByText("812")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /编辑文章 OAuth 2.0 BFF/ }));
    expect(screen.getByText("将进入 /admin/posts/101/edit（Showcase 模拟）。")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /打开前台文章 OAuth 2.0 BFF/ }));
    expect(screen.getByText("将进入 /articles/oauth-bff-browser-session（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves permission-dependent primary actions and metric destinations", () => {
    render(<BlogAdminDashboardDemo />);

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "审核员" }));
    expect(screen.queryByRole("button", { name: "新建文章" })).toBeNull();
    expect(screen.getByRole("button", { name: "审核评论" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /文章总数/ })).toBeNull();
    expect(screen.getByRole("button", { name: /评论互动/ })).toBeTruthy();
    expect(screen.queryByText("AI 运营提醒")).toBeNull();

    fireEvent.click(screen.getByRole("radio", { name: "其他后台权限" }));
    expect(screen.queryByRole("button", { name: "审核评论" })).toBeNull();
    expect(screen.queryByRole("button", { name: /评论互动/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "文章管理" })).toBeNull();
    expect(screen.queryByRole("button", { name: "查看全部文章" })).toBeNull();
  });

  it("preserves loading, empty and error states in isolated renders", () => {
    const renderScenario = (name: "加载中" | "空数据" | "错误") => {
      render(<BlogAdminDashboardDemo />);
      fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
      fireEvent.click(screen.getByRole("radio", { name }));
    };

    renderScenario("加载中");
    expect(screen.getByRole("status", { name: "数据概览加载中" })).toBeTruthy();
    cleanup();

    renderScenario("空数据");
    expect(screen.getByText("暂无访问趋势")).toBeTruthy();
    expect(screen.getByText("暂无表现数据")).toBeTruthy();
    expect(screen.queryByText("AI 运营提醒")).toBeNull();
    cleanup();

    renderScenario("错误");
    expect(screen.getByText("数据概览加载失败")).toBeTruthy();
    expect(screen.getByRole("button", { name: "重新载入" })).toBeTruthy();
  });
});
