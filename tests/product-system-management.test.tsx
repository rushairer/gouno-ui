import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PageHeader } from "../src/gouno";
import { GossoSystemManagementDemo, type SystemManagementSection } from "../showcase/demos/products/gosso-admin/system-management";

afterEach(cleanup);

function openFixture() {
  fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
}

function renderScenario(section: SystemManagementSection, scenario: string) {
  const view = render(<GossoSystemManagementDemo section={section} />);
  openFixture();
  fireEvent.click(screen.getByRole("radio", { name: scenario }));
  return view;
}

describe("Gosso Admin System Management migration fixture", () => {
  it("promotes durable management domains out of route-family Tabs", () => {
    const clients = render(<GossoSystemManagementDemo section="clients" />);
    expect(screen.getByRole("heading", { level: 1, name: "OAuth2 客户端" })).toBeTruthy();
    expect(screen.queryByRole("tab")).toBeNull();
    openFixture();
    expect(screen.getByText("/system-management/clients")).toBeTruthy();
    expect(screen.getByText("注册与维护 OAuth 2.0 / OpenID Connect 客户端、回调地址、授权类型和访问范围。")).toBeTruthy();
    clients.unmount();

    const users = render(<GossoSystemManagementDemo section="users" />);
    expect(screen.getByRole("heading", { level: 1, name: "用户管理" })).toBeTruthy();
    openFixture();
    expect(screen.getByText("/system-management/users")).toBeTruthy();
    expect(screen.getAllByText("正常").length).toBeGreaterThan(0);
    users.unmount();

    const audit = render(<GossoSystemManagementDemo section="audit-logs" />);
    expect(screen.getByRole("heading", { level: 1, name: "审计日志" })).toBeTruthy();
    openFixture();
    expect(screen.getByText("/system-management/audit-logs")).toBeTruthy();
    audit.unmount();

    const settings = render(<GossoSystemManagementDemo section="site-settings" />);
    expect(screen.getByRole("heading", { level: 1, name: "站点设置" })).toBeTruthy();
    openFixture();
    expect(screen.getByText("/system-management/site-settings")).toBeTruthy();
    settings.unmount();

    render(<GossoSystemManagementDemo section="system" />);
    expect(screen.getByRole("heading", { level: 1, name: "系统状态" })).toBeTruthy();
    openFixture();
    expect(screen.getByText("/system-management/system")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "基础设施健康" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "OpenID Connect 配置" })).toBeTruthy();
    expect(screen.getAllByText("正常").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "切换故障 Fixture" })).toBeNull();
  });

  it("preserves OAuth client loading, empty and error states through Showcase-only controls", () => {
    let view = renderScenario("clients", "加载中");
    expect(screen.getByRole("status", { name: "OAuth2 客户端加载中" })).toBeTruthy();
    view.unmount();
    view = renderScenario("clients", "空状态");
    expect(screen.getByText("还没有 OAuth2 客户端")).toBeTruthy();
    view.unmount();
    renderScenario("clients", "错误");
    expect(screen.getByText("OAuth2 客户端加载失败")).toBeTruthy();
  });

  it("preserves user-directory loading, empty and error states", () => {
    let view = renderScenario("users", "加载中");
    expect(screen.getByRole("status", { name: "用户目录加载中" })).toBeTruthy();
    view.unmount();
    view = renderScenario("users", "空状态");
    expect(screen.getByText("还没有用户")).toBeTruthy();
    view.unmount();
    renderScenario("users", "错误");
    expect(screen.getByText("用户目录加载失败")).toBeTruthy();
  });

  it("dogfoods the low-fidelity collection PageSkeleton for audit loading", () => {
    let view = renderScenario("audit-logs", "加载中");
    const loading = screen.getByRole("status", { name: "审计日志加载中" });
    expect(loading.getAttribute("data-slot")).toBe("page-skeleton");
    expect(loading.getAttribute("data-layout")).toBe("collection");
    expect(screen.queryByRole("columnheader")).toBeNull();
    view.unmount();
    view = renderScenario("audit-logs", "空状态");
    expect(screen.getByText("暂无审计事件")).toBeTruthy();
    view.unmount();
    renderScenario("audit-logs", "错误");
    expect(screen.getByText("审计日志加载失败")).toBeTruthy();
  });

  it("keeps filter-empty distinct from fixture-empty audit state", () => {
    render(<GossoSystemManagementDemo section="audit-logs" />);
    fireEvent.change(screen.getByLabelText("事件类型"), { target: { value: "no.such.event" } });
    fireEvent.click(screen.getByRole("button", { name: "查询" }));
    expect(screen.getByText("没有匹配的审计事件")).toBeTruthy();
    expect(screen.getByRole("button", { name: "清除筛选" })).toBeTruthy();
  });

  it("keeps site-settings loading and read failure outside the editable surface", () => {
    let view = renderScenario("site-settings", "加载中");
    expect(screen.getByRole("status", { name: "站点设置加载中" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "保存设置" })).toBeNull();
    view.unmount();
    renderScenario("site-settings", "加载失败");
    expect(screen.getByText("站点设置加载失败")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "保存设置" })).toBeNull();
  });

  it("dogfoods dashboard PageSkeleton for the unresolved system-status region", () => {
    let view = renderScenario("system", "检查中");
    const loading = screen.getByRole("status", { name: "系统状态检查中" });
    expect(loading.getAttribute("data-slot")).toBe("page-skeleton");
    expect(loading.getAttribute("data-layout")).toBe("dashboard");
    view.unmount();
    view = renderScenario("system", "部分异常");
    expect(screen.getByText("Redis 探针异常")).toBeTruthy();
    expect(screen.getByText("异常")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "切换故障 Fixture" })).toBeNull();
    view.unmount();
    renderScenario("system", "不可用");
    expect(screen.getByText("身份服务不可用")).toBeTruthy();
    expect(screen.getByText("503 Service Unavailable")).toBeTruthy();
  });

  it("keeps OAuth client editing as page-local Core composition", () => {
    render(<GossoSystemManagementDemo section="clients" />);
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
