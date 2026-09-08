import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminUsersDemo } from "../showcase/demos/products/blog-admin-users";

afterEach(cleanup);

describe("Blog Admin Members product migration fixture", () => {
  it("uses PageHeader and keeps route metadata in FixtureDock", () => {
    render(<BlogAdminUsersDemo />);

    const header = screen.getByRole("heading", { level: 1, name: "成员与权限" });
    expect(header.closest('[data-slot="page-header"]')).toBeTruthy();
    expect(screen.queryByText("/admin/users")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/admin/users")).toBeTruthy();
    expect(screen.getByRole("radio", { name: "已解锁" })).toBeTruthy();
  });

  it("keeps Sudo/MFA gating product-local while preserving the member surface", () => {
    render(<BlogAdminUsersDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "已锁定" }));

    expect(screen.getByText("成员与权限安全保护")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "完成 MFA 并解锁" }));
    expect(screen.getByText("高权限操作已解锁")).toBeTruthy();
    expect(screen.getAllByText("内容编辑").length).toBeGreaterThanOrEqual(1);
  });

  it("supports editing Blog-local member identity and role data", () => {
    render(<BlogAdminUsersDemo />);
    const editButtons = screen.getAllByRole("button", { name: "编辑 内容编辑 成员与权限" });
    fireEvent.click(editButtons[0]);

    const name = screen.getByLabelText("显示名称");
    fireEvent.change(name, { target: { value: "内容主编" } });
    fireEvent.change(screen.getByLabelText("Blog 角色"), { target: { value: "admin" } });
    fireEvent.click(screen.getByRole("button", { name: "保存成员" }));

    expect(screen.getByText("成员“内容主编”的信息与权限已更新（Showcase 模拟）。")).toBeTruthy();
    expect(screen.getAllByText("内容主编").length).toBeGreaterThanOrEqual(1);
  });

  it("supports high-risk suspend confirmation without creating a shared Pattern", () => {
    render(<BlogAdminUsersDemo />);
    const suspendButtons = screen.getAllByRole("button", { name: "暂停 内容编辑" });
    fireEvent.click(suspendButtons[0]);

    expect(screen.getByText("这是高权限操作")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "确认暂停" }));
    expect(screen.getByText("成员“内容编辑”已暂停（Showcase 模拟）。")).toBeTruthy();
  });

  it("preserves loading, empty and error states through Showcase-only controls", () => {
    const { container } = render(<BlogAdminUsersDemo />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));

    fireEvent.click(screen.getByRole("radio", { name: "加载中" }));
    expect(screen.getByRole("status")).toBeTruthy();
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("radio", { name: "空状态" }));
    expect(screen.getByText("暂未同步到任何登录用户")).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "错误" }));
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("data-type")).toBe("error");
    expect(screen.getByText("成员目录加载失败")).toBeTruthy();
  });
});
