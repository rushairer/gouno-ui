import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
  });

  it("keeps filtering and empty-state behavior product-local", () => {
    render(<BlogAdminPostsDemo />);
    const search = screen.getByLabelText("搜索文章");
    fireEvent.change(search, { target: { value: "不存在的文章关键词" } });

    expect(screen.getByText("没有符合当前筛选条件的文章")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "清除筛选" }));
    expect(screen.getAllByText("从真实产品抽象一套可维护的 UI 组件体系").length).toBe(2);
  });

  it("supports selection and batch status updates without restoring a public BulkActionBar", () => {
    render(<BlogAdminPostsDemo />);
    const [desktopCheckbox] = screen.getAllByLabelText(/选择文章 从真实产品抽象一套可维护的 UI 组件体系/);
    fireEvent.click(desktopCheckbox);

    expect(screen.getByText("已选择 1 篇")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "转为草稿" }));
    expect(screen.getByText("已将 1 篇文章转为草稿（Showcase 模拟）。")).toBeTruthy();
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
