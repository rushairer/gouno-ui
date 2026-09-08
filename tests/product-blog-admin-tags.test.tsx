import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminTagsDemo } from "../showcase/demos/products/blog-admin-tags";

afterEach(cleanup);

describe("Blog Admin Tags product migration fixture", () => {
  it("preserves the route-level PageHeader and keeps Fixture metadata outside product flow", () => {
    render(<BlogAdminTagsDemo />);

    const header = screen.getByRole("heading", { level: 1, name: "标签" });
    expect(header.closest('[data-slot="page-header"]')).toBeTruthy();
    expect(screen.queryByText("/admin/tags")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/admin/tags")).toBeTruthy();
  });

  it("validates the admitted BulkActionBar on a later card-grid workflow without API expansion", () => {
    render(<BlogAdminTagsDemo />);

    fireEvent.click(screen.getByRole("checkbox", { name: "选择标签 React" }));
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    expect(toolbar.getAttribute("data-slot")).toBe("bulk-action-bar");
    expect(screen.getByText("已选择 1 个标签")).toBeTruthy();
    expect(within(toolbar).getByRole("button", { name: "交给 AI" })).toBeTruthy();
    expect(within(toolbar).getByRole("button", { name: "删除" })).toBeTruthy();
    expect(within(toolbar).getByRole("button", { name: "取消" })).toBeTruthy();

    fireEvent.click(within(toolbar).getByRole("button", { name: "取消" }));
    expect(screen.queryByRole("toolbar", { name: "批量操作" })).toBeNull();
  });

  it("preserves rename and merge management workflows", () => {
    render(<BlogAdminTagsDemo />);

    const designSystemCard = screen.getByText("Design System").closest('[role="listitem"]');
    expect(designSystemCard).toBeTruthy();
    fireEvent.click(within(designSystemCard as HTMLElement).getByRole("button", { name: "重命名" }));

    const renameDialog = screen.getByRole("dialog");
    fireEvent.change(within(renameDialog).getByRole("textbox", { name: "标签名称" }), { target: { value: "UI Systems" } });
    fireEvent.click(within(renameDialog).getByRole("button", { name: "保存修改" }));
    expect(screen.getByText("UI Systems")).toBeTruthy();
    expect(screen.getByText("/ui-systems")).toBeTruthy();

    const kafkaCard = screen.getByText("Kafka").closest('[role="listitem"]');
    expect(kafkaCard).toBeTruthy();
    fireEvent.click(within(kafkaCard as HTMLElement).getByRole("button", { name: "合并" }));

    const mergeDialog = screen.getByRole("dialog");
    fireEvent.click(within(mergeDialog).getByRole("combobox", { name: "合并目标" }));
    fireEvent.click(screen.getByRole("option", { name: /Go · 26 篇/ }));
    fireEvent.click(within(mergeDialog).getByRole("button", { name: "确认合并" }));

    expect(screen.queryByText("Kafka")).toBeNull();
    expect(screen.getByText("Go")).toBeTruthy();
    expect(screen.getByText("35 篇文章")).toBeTruthy();
  });

  it("preserves batch AI and destructive actions", () => {
    render(<BlogAdminTagsDemo />);

    fireEvent.click(screen.getByRole("checkbox", { name: "选择标签 OAuth" }));
    const toolbar = screen.getByRole("toolbar", { name: "批量操作" });
    fireEvent.click(within(toolbar).getByRole("button", { name: "交给 AI" }));

    const aiDialog = screen.getByRole("dialog");
    expect(within(aiDialog).getByText("OAuth")).toBeTruthy();
    fireEvent.click(within(aiDialog).getByRole("button", { name: "启动工作流" }));
    expect(screen.getByText("已将 1 个标签交给 AI 工作流（Showcase 模拟）。")).toBeTruthy();

    fireEvent.click(screen.getByRole("checkbox", { name: "选择标签 OAuth" }));
    fireEvent.click(screen.getByRole("toolbar", { name: "批量操作" }).querySelector('button[aria-label]') ?? screen.getByRole("button", { name: "删除" }));
  });

  it("preserves loading, empty and error states", () => {
    render(<BlogAdminTagsDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));

    fireEvent.click(screen.getByRole("radio", { name: "加载中" }));
    expect(screen.getByRole("status", { name: "标签加载中" })).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "空状态" }));
    expect(screen.getByText("还没有标签")).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "错误" }));
    expect(screen.getByText("标签加载失败")).toBeTruthy();
  });
});
