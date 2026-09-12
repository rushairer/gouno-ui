import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminNotificationsDemo } from "../showcase/demos/products/blog-admin/notifications";

afterEach(cleanup);

describe("Blog Admin Notifications product migration fixture", () => {
  it("uses PageHeader and keeps Fixture metadata outside product flow", () => {
    render(<BlogAdminNotificationsDemo />);

    const header = screen.getByRole("heading", { level: 1, name: "通知中心" });
    expect(header.closest('[data-slot="page-header"]')).toBeTruthy();
    expect(screen.getByRole("button", { name: "全部标为已读" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "清空已读" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "清空全部" })).toBeTruthy();
    expect(screen.queryByText("/admin/notifications")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/admin/notifications")).toBeTruthy();
    expect(screen.getByRole("radio", { name: "写操作成功" })).toBeTruthy();
  });

  it("preserves notification presentation, destinations and status/type filters", () => {
    render(<BlogAdminNotificationsDemo />);

    expect(screen.getByText("AI 工作流执行失败")).toBeTruthy();
    expect(screen.getByText("Workflow 告警")).toBeTruthy();
    expect(screen.getAllByText("评论互动").length).toBeGreaterThan(0);
    expect(screen.getByText("系统通知")).toBeTruthy();
    expect(screen.getByText("关联内容：AI 设计系统审计")).toBeTruthy();

    fireEvent.click(screen.getByRole("combobox", { name: "通知状态筛选" }));
    fireEvent.click(screen.getByRole("option", { name: "未读通知 (3)" }));
    expect(screen.getByText("AI 工作流执行失败")).toBeTruthy();
    expect(screen.queryByText("站点证书轮换完成")).toBeNull();

    fireEvent.click(screen.getByRole("combobox", { name: "通知类型筛选" }));
    fireEvent.click(screen.getByRole("option", { name: "AI 运营告警" }));
    expect(screen.getByText("AI Agent 配额接近阈值")).toBeTruthy();
    expect(screen.queryByText("新的评论回复")).toBeNull();
  });

  it("uses canonical BulkActionBar for product-owned mark-read actions", () => {
    render(<BlogAdminNotificationsDemo />);

    fireEvent.click(screen.getByRole("checkbox", { name: "选择通知 AI 工作流执行失败" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "选择通知 新的评论回复" }));

    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("bulk-action-bar");
    expect(screen.getByText("已选择 2 条通知")).toBeTruthy();
    fireEvent.click(within(toolbar).getByRole("button", { name: "标为已读" }));

    expect(screen.queryByRole("toolbar", { name: "批量操作" })).toBeNull();
    expect(screen.getByText("已将选中的 2 条通知标为已读（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves selection and unread state when batch mark-read fails", () => {
    render(<BlogAdminNotificationsDemo />);
    fireEvent.click(screen.getByRole("checkbox", { name: "选择通知 AI 工作流执行失败" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "选择通知 新的评论回复" }));
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "写操作失败" }));

    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    fireEvent.click(within(toolbar).getByRole("button", { name: "标为已读" }));

    const failure = screen.getByText("批量标记已读失败；通知状态与当前选择保持不变（Showcase 模拟）。");
    expect(failure.closest('[role="alert"]')?.getAttribute("data-type")).toBe("error");
    expect(screen.getByText("已选择 2 条通知")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "标为已读" }).length).toBeGreaterThanOrEqual(3);
  });

  it("preserves single notification read and destination behavior", () => {
    render(<BlogAdminNotificationsDemo />);

    const title = screen.getByText("AI 工作流执行失败");
    const card = title.closest('[role="listitem"]');
    expect(card).toBeTruthy();
    if (!card) return;

    fireEvent.click(within(card).getByRole("button", { name: "标为已读" }));
    expect(within(card).queryByRole("button", { name: "标为已读" })).toBeNull();
    expect(screen.getByText("通知已标记为已读（Showcase 模拟）。")).toBeTruthy();

    fireEvent.click(within(card).getByRole("button", { name: "前往处理" }));
    expect(screen.getByText("前往 /admin/ai-ops?tab=records&record=workflow（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves batch deletion through product-owned actions", () => {
    render(<BlogAdminNotificationsDemo />);

    fireEvent.click(screen.getByRole("checkbox", { name: "选择通知 AI Agent 配额接近阈值" }));
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    fireEvent.click(within(toolbar).getByRole("button", { name: "批量删除" }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("批量删除 1 条通知")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "确认删除" }));
    expect(screen.queryByText("AI Agent 配额接近阈值")).toBeNull();
    expect(screen.getByText("已删除选中的 1 条通知（Showcase 模拟）。")).toBeTruthy();
  });

  it("closes delete confirmation but preserves rows and selection when delete fails", () => {
    render(<BlogAdminNotificationsDemo />);
    fireEvent.click(screen.getByRole("checkbox", { name: "选择通知 AI Agent 配额接近阈值" }));
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "写操作失败" }));

    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    fireEvent.click(within(toolbar).getByRole("button", { name: "批量删除" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "确认删除" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("通知删除/清理失败；列表和当前选择保持不变，可重新发起操作（Showcase 模拟）。")).toBeTruthy();
    expect(screen.getByText("AI Agent 配额接近阈值")).toBeTruthy();
    expect(screen.getByText("已选择 1 条通知")).toBeTruthy();
  });

  it("preserves global clear-read confirmation without removing unread items", () => {
    render(<BlogAdminNotificationsDemo />);

    fireEvent.click(screen.getByRole("button", { name: "清空已读" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("清空已读通知")).toBeTruthy();
    expect(within(dialog).getByText(/共 2 条/)).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "确认清空" }));

    expect(screen.queryByText("站点证书轮换完成")).toBeNull();
    expect(screen.queryByText("文章收到新评论")).toBeNull();
    expect(screen.getByText("AI 工作流执行失败")).toBeTruthy();
    expect(screen.getByText("已清空 2 条已读通知（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves loading, empty and error states in isolated fixture renders", () => {
    const renderScenario = (name: "加载中" | "空状态" | "错误") => {
      render(<BlogAdminNotificationsDemo />);
      fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
      fireEvent.click(screen.getByRole("radio", { name }));
    };

    renderScenario("加载中");
    expect(screen.getByRole("status", { name: "通知加载中" })).toBeTruthy();
    cleanup();

    renderScenario("空状态");
    expect(screen.getByText("暂无相关通知记录。")).toBeTruthy();
    cleanup();

    renderScenario("错误");
    expect(screen.getByText("通知加载失败")).toBeTruthy();
  });
});
