import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminCommentsDemo } from "../showcase/demos/products/blog-admin-comments";

afterEach(cleanup);

describe("Blog Admin Comments product migration fixture", () => {
  it("preserves the route-level PageHeader and keeps Fixture metadata outside product flow", () => {
    render(<BlogAdminCommentsDemo />);
    const header = screen.getByRole("heading", { level: 1, name: "评论" });
    expect(header.closest('[data-slot="page-header"]')).toBeTruthy();
    expect(screen.queryByText("/admin/comments")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/admin/comments")).toBeTruthy();
  });

  it("preserves the real status and reported-only moderation filters", () => {
    render(<BlogAdminCommentsDemo />);
    expect(screen.getByRole("combobox", { name: "评论状态" })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "仅看被举报" })).toBeTruthy();
    expect(screen.getByText("Lina")).toBeTruthy();
    expect(screen.getByText("Kai")).toBeTruthy();
    expect(screen.queryByText("Mori")).toBeNull();
    fireEvent.click(screen.getByRole("checkbox", { name: "仅看被举报" }));
    expect(screen.queryByText("Lina")).toBeNull();
    expect(screen.getByText("Kai")).toBeTruthy();
    expect(screen.getByText("被举报 2 次")).toBeTruthy();
  });

  it("restores comment-resource WorkflowLauncher and run evidence", () => {
    render(<BlogAdminCommentsDemo />);
    fireEvent.click(screen.getByRole("checkbox", { name: "选择评论 1201" }));
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("bulk-action-bar");
    expect(screen.getByText("已选择 1 条评论")).toBeTruthy();

    fireEvent.click(within(toolbar).getByRole("button", { name: "交给 AI" }));
    const dialog = screen.getByRole("dialog", { name: "将所选评论交给 AI" });
    expect((within(dialog).getByRole("combobox", { name: "Workflow" }) as HTMLButtonElement).textContent).toContain("评论回复草稿（手选）");
    expect(within(dialog).getByText("为手选评论逐条创建待审批回复草稿。")).toBeTruthy();
    expect(within(dialog).getByText("#1201 · Lina")).toBeTruthy();
    expect(within(dialog).getByText(/文章 #101/)).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "运行" }));
    expect(within(dialog).getByText("Workflow 已提交（Run #262）。范围已锁定到本次选择的 1 项资源。")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "打开运行中心" }));
    expect(screen.getByText("将进入 /admin/ai-ops?tab=records&record=workflow&workflow=78&run=262（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves real partial batch-delete failure and retains failed comments selected", () => {
    render(<BlogAdminCommentsDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "批量部分失败" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "选择评论 1201" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "选择评论 1202" }));
    fireEvent.click(screen.getByRole("button", { name: "删除" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "永久删除" }));
    expect(screen.queryByText("Lina")).toBeNull();
    expect(screen.getByText("Kai")).toBeTruthy();
    expect(screen.getByText("已选择 1 条评论")).toBeTruthy();
    expect(screen.getByText("已删除 1 条评论；1 条未删除：模拟 API 删除失败，失败项继续保持选中。")).toBeTruthy();
    expect(screen.getByRole("alert").getAttribute("data-type")).toBe("error");
  });

  it("preserves moderation and destructive confirmation semantics", () => {
    render(<BlogAdminCommentsDemo />);
    fireEvent.click(screen.getByRole("button", { name: "通过 Lina 的评论" }));
    expect(screen.queryByText("Lina")).toBeNull();
    expect(screen.getByText("评论已通过（Showcase 模拟）。")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "删除 Kai 的评论" }));
    expect(screen.getByText("删除评论")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "永久删除" }));
    expect(screen.queryByText("Kai")).toBeNull();
    expect(screen.getByText("评论已删除（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves loading, empty and error queue states", () => {
    render(<BlogAdminCommentsDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "加载中" }));
    expect(screen.getByRole("status", { name: "评论加载中" })).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "空状态" }));
    expect(screen.getByText("当前队列已经处理完毕。")).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "错误" }));
    expect(screen.getByRole("alert").getAttribute("data-type")).toBe("error");
    expect(screen.getByText("评论加载失败")).toBeTruthy();
  });
});
