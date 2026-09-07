import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "../src/gouno";
import { GossoSystemManagementDemo } from "../showcase/demos/products/gosso-system-management";

function selectTab(name: string) {
  fireEvent.mouseDown(screen.getByRole("tab", { name }), { button: 0 });
}

describe("Gosso Admin System Management migration fixture", () => {
  it("preserves all five route-backed management sections", () => {
    render(<GossoSystemManagementDemo />);
    expect(screen.getAllByRole("tab")).toHaveLength(5);
    expect(screen.getByText("/system-management/clients")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "OAuth2 客户端" })).toBeTruthy();

    selectTab("用户管理");
    expect(screen.getByText("/system-management/users")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "用户管理" })).toBeTruthy();

    selectTab("审计日志");
    expect(screen.getByText("/system-management/audit-logs")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "审计日志" })).toBeTruthy();

    selectTab("站点设置");
    expect(screen.getByText("/system-management/site-settings")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "站点设置" })).toBeTruthy();

    selectTab("系统状态");
    expect(screen.getByText("/system-management/system")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "系统状态" })).toBeTruthy();
    expect(screen.getByText("基础设施健康")).toBeTruthy();
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
