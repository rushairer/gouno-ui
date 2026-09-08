import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PageHeader } from "../src/gouno";
import { GossoSystemManagementDemo } from "../showcase/demos/products/gosso-system-management";

afterEach(cleanup);

function selectTab(name: string) {
  fireEvent.mouseDown(screen.getByRole("tab", { name }), { button: 0 });
}

describe("Gosso Admin System Management migration fixture", () => {
  it("keeps one route-family H1, tab-labelled panels and only meaningful local H2 content", () => {
    render(<GossoSystemManagementDemo />);
    expect(screen.getByRole("heading", { level: 1, name: "系统管理" })).toBeTruthy();
    expect(screen.getAllByRole("tab")).toHaveLength(5);
    expect(screen.queryByText("真实产品路由")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/system-management/clients")).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2, name: "OAuth2 客户端" })).toBeNull();
    expect(screen.getByText("注册与维护 OAuth 2.0 / OpenID Connect 客户端、回调地址、授权类型和访问范围。")).toBeTruthy();

    selectTab("用户管理");
    expect(screen.getByText("/system-management/users")).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2, name: "用户管理" })).toBeNull();
    expect(screen.getAllByText("正常").length).toBeGreaterThan(0);

    selectTab("审计日志");
    expect(screen.getByText("/system-management/audit-logs")).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2, name: "审计日志" })).toBeNull();

    selectTab("站点设置");
    expect(screen.getByText("/system-management/site-settings")).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2, name: "站点设置" })).toBeNull();

    selectTab("系统状态");
    expect(screen.getByText("/system-management/system")).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2, name: "系统状态" })).toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "基础设施健康" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "OpenID Connect 配置" })).toBeTruthy();
    expect(screen.getAllByText("正常").length).toBeGreaterThan(0);
  });

  it("uses the Core Empty state when audit filters have no results", () => {
    render(<GossoSystemManagementDemo />);
    selectTab("审计日志");
    fireEvent.change(screen.getByLabelText("事件类型"), { target: { value: "no.such.event" } });
    fireEvent.click(screen.getByRole("button", { name: "查询" }));
    expect(screen.getByText("没有匹配的审计事件")).toBeTruthy();
    expect(screen.getByRole("button", { name: "清除筛选" })).toBeTruthy();
  });

  it("keeps OAuth client editing as page-local Core composition", () => {
    render(<GossoSystemManagementDemo />);
    fireEvent.click(screen.getByRole("button", { name: "注册客户端" }));
    const dialog = screen.getByRole("dialog", { name: "注册 OAuth2 客户端" });
    expect(dialog).toBeTruthy();
    expect(within(dialog).getByText("Grant Types")).toBeTruthy();
    expect(within(dialog).getByText("Scopes")).toBeTruthy();
  });
});

describe("Gouno PageHeader", () => {
  it("owns one canonical actions slot without restoring ActionGroup", () => {
    render(<PageHeader title="Title" description="Description" actions={<button type="button">Create</button>} />);
    expect(screen.getByRole("heading", { name: "Title" })).toBeTruthy();
    expect(screen.getByText("Description")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create" })).toBeTruthy();
  });
});