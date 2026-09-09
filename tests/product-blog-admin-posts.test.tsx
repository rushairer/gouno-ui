import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminPostsDemo } from "../showcase/demos/products/blog-admin-posts";

afterEach(cleanup);

describe("Blog Admin Posts product migration fixture", () => {
  it("uses the admitted PageHeader while keeping Fixture metadata outside product flow", () => {
    render(<BlogAdminPostsDemo />);

    const header = screen.getByRole("heading", { level: 1, name: "文章" });
    expect(header.closest('[data-slot="page-header"]')).toBeTruthy();
    expect(screen.queryByText("/admin/posts")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/admin/posts")).toBeTruthy();
    expect(screen.getByRole("radio", { name: "有数据" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "内容管理员" })).toBeTruthy();
  });

  it("keeps filtering and empty-state behavior product-local", () => {
    render(<BlogAdminPostsDemo />);
    const search = screen.getByLabelText("搜索文章");
    expect(search.getAttribute("placeholder")).toBe("搜索标题、摘要或正文");
    fireEvent.change(search, { target: { value: "不存在的文章关键词" } });

    expect(screen.getByText("没有符合当前筛选条件的文章")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "清除筛选" }));
    expect(screen.getAllByText("从真实产品抽象一套可维护的 UI 组件体系").length).toBe(2);
  });

  it("uses the admitted BulkActionBar while keeping batch actions product-owned", () => {
    render(<BlogAdminPostsDemo />);
    const [desktopCheckbox] = screen.getAllByLabelText(/选择文章 从真实产品抽象一套可维护的 UI 组件体系/);
    fireEvent.click(desktopCheckbox);

    expect(screen.getByText("已选择 1 篇")).toBeTruthy();
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("bulk-action-bar");
    expect(toolbar.className).toContain("sticky");
    expect(toolbar.className).toContain("bottom-4");
    expect(screen.getByRole("button", { name: "交给 AI" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "转为草稿" }));
    expect(screen.getByText("已将 1 篇文章转为草稿（Showcase 模拟）。")).toBeTruthy();
  });

  it("restores the real compatible Workflow launcher instead of a notice-only AI action", () => {
    render(<BlogAdminPostsDemo />);
    fireEvent.click(screen.getAllByLabelText(/选择文章 从真实产品抽象一套可维护的 UI 组件体系/)[0]);
    fireEvent.click(screen.getByRole("button", { name: "交给 AI" }));

    const dialog = screen.getByRole("dialog", { name: "将所选文章交给 AI" });
    expect(within(dialog).getByText("已选择 1 项资源；Workflow 默认只能访问这些目标。")).toBeTruthy();
    expect(within(dialog).getByRole("combobox", { name: "Workflow" })).toBeTruthy();
    expect(within(dialog).getByText(/资源范围：post-101/)).toBeTruthy();

    fireEvent.click(within(dialog).getByRole("button", { name: "运行" }));
    expect(within(dialog).getByText(/Workflow 已提交（Run #247）。范围已固定为本次选择的 1 项资源。/)).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "打开运行中心" }));
    expect(screen.getByText("将进入 /admin/ai-ops?tab=records&record=workflow&workflow=31（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves author ownership permissions without leaking manager batch/delete controls", () => {
    render(<BlogAdminPostsDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "普通作者" }));

    expect(screen.getByRole("button", { name: "新建文章" })).toBeTruthy();
    expect(screen.queryByRole("toolbar", { name: "批量操作" })).toBeNull();
    expect(screen.queryByLabelText("选择当前页全部文章")).toBeNull();
    expect(screen.queryAllByRole("button", { name: "删除文章" })).toHaveLength(0);

    const ownTitle = screen.getAllByText("从真实产品抽象一套可维护的 UI 组件体系")[0];
    const ownRow = ownTitle.closest("tr");
    expect(ownRow).toBeTruthy();
    expect(within(ownRow!).getByRole("button", { name: "编辑文章" })).toBeTruthy();

    const otherTitle = screen.getAllByText("OAuth 2.0 Authorization Code + PKCE 的 BFF 实践")[0];
    const otherRow = otherTitle.closest("tr");
    expect(otherRow).toBeTruthy();
    expect(within(otherRow!).getByRole("button", { name: "查看详情（只读）" })).toBeTruthy();
  });

  it("keeps selection when the real all-or-none batch endpoint fails", () => {
    render(<BlogAdminPostsDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "批量操作失败" }));
    fireEvent.click(screen.getAllByLabelText(/选择文章 从真实产品抽象一套可维护的 UI 组件体系/)[0]);

    fireEvent.click(screen.getByRole("button", { name: "立即发布" }));
    expect(screen.getByText("批量操作失败；所选文章保持选中，可修正问题后重试（Showcase 模拟）。")).toBeTruthy();
    expect(screen.getByText("已选择 1 篇")).toBeTruthy();
  });

  it("keeps the single-delete confirmation open when deletion fails", () => {
    render(<BlogAdminPostsDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "单篇删除失败" }));

    const title = screen.getAllByText("从真实产品抽象一套可维护的 UI 组件体系")[0];
    const row = title.closest("tr");
    fireEvent.click(within(row!).getByRole("button", { name: "删除文章" }));
    const dialog = screen.getByRole("dialog", { name: "删除文章" });
    fireEvent.click(within(dialog).getByRole("button", { name: "永久删除" }));

    expect(screen.getByText("删除文章失败；确认窗口保持打开，可直接重试（Showcase 模拟）。")).toBeTruthy();
    expect(screen.getByRole("dialog", { name: "删除文章" })).toBeTruthy();
    expect(screen.getAllByText("从真实产品抽象一套可维护的 UI 组件体系").length).toBeGreaterThanOrEqual(1);
  });

  it("preserves loading, empty and error states through Showcase-only scenario controls", () => {
    const { container } = render(<BlogAdminPostsDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));

    fireEvent.click(screen.getByRole("radio", { name: "加载中" }));
    expect(screen.getByRole("status")).toBeTruthy();
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("radio", { name: "空状态" }));
    expect(screen.getByText("还没有文章")).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "错误" }));
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("data-type")).toBe("error");
    expect(screen.getByText("文章加载失败")).toBeTruthy();
  });
});
