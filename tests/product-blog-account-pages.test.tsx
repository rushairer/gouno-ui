import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  BlogAccountNotificationsDemo,
  BlogAccountSettingsDemo,
} from "../showcase/demos/products/blog/account-pages";
import { ThemeProvider } from "../src/theme";

afterEach(cleanup);

function renderNotifications(initialScenario: "data" | "empty" | "error" = "data") {
  return render(
    <ThemeProvider brand="blog" storageKey={`blog-account-notifications-${initialScenario}-theme`}>
      <BlogAccountNotificationsDemo initialScenario={initialScenario} />
    </ThemeProvider>,
  );
}

function renderSettings(initialScenario: "data" | "save-error" = "data") {
  return render(
    <ThemeProvider brand="blog" storageKey={`blog-account-settings-${initialScenario}-theme`}>
      <BlogAccountSettingsDemo initialScenario={initialScenario} />
    </ThemeProvider>,
  );
}

describe("Blog public account page migrations", () => {
  it("preserves notification filtering and per-item/all read transitions", () => {
    renderNotifications();

    expect(screen.getByRole("heading", { level: 1, name: "通知" })).toBeTruthy();
    expect(screen.getByText("2 条未读")).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "未读" }));
    expect(screen.getByText("Aben 回复了你的评论")).toBeTruthy();
    expect(screen.getByText("你在一条讨论中被提及")).toBeTruthy();
    expect(screen.queryByText("站点通知偏好已更新")).toBeNull();

    const firstNotification = screen.getByText("Aben 回复了你的评论").closest('[data-slot="card"]');
    expect(firstNotification).toBeTruthy();
    fireEvent.click(within(firstNotification as HTMLElement).getByRole("button", { name: "标为已读" }));
    expect(screen.getByText("1 条未读")).toBeTruthy();
    expect(screen.queryByText("Aben 回复了你的评论")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "全部标为已读" }));
    expect(screen.getByText("0 条未读")).toBeTruthy();
    expect(screen.getByText("没有未读通知")).toBeTruthy();
  });

  it("marks a notification read before navigating to its product destination", () => {
    renderNotifications();

    const firstNotification = screen.getByText("Aben 回复了你的评论").closest('[data-slot="card"]');
    fireEvent.click(within(firstNotification as HTMLElement).getByRole("button", { name: "查看" }));

    expect(screen.getByText(/\/articles\/oauth2-bff-product-experience#comment-comment-1/)).toBeTruthy();
    expect(screen.getByText("1 条未读")).toBeTruthy();
  });

  it("preserves notification empty and non-fatal loading-error states", () => {
    const empty = renderNotifications("empty");
    expect(screen.getByText("还没有通知")).toBeTruthy();
    empty.unmount();

    renderNotifications("error");
    expect(screen.getByText("通知加载失败")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "重试" }));
    expect(screen.getByText("Aben 回复了你的评论")).toBeTruthy();
  });

  it("saves only Blog-local profile and notification preferences", () => {
    renderSettings();

    expect(screen.getByRole("heading", { level: 1, name: "账户设置" })).toBeTruthy();
    expect(screen.getByText("paw@example.test")).toBeTruthy();
    expect(screen.getByText(/密码、MFA、Passkey 与会话由 GOSSO/)).toBeTruthy();

    const name = screen.getByLabelText(/^显示名称/);
    fireEvent.change(name, { target: { value: "Paw Studio" } });
    expect(screen.getByText("有未保存的 Blog-local 修改")).toBeTruthy();

    const systemPreference = screen.getByRole("switch", { name: "站点动态" });
    expect(systemPreference.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(systemPreference);
    expect(systemPreference.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "保存设置" }));
    expect(screen.getByText("Blog 账户偏好已保存。")).toBeTruthy();
    expect(screen.getByText("所有 Blog-local 设置已保存")).toBeTruthy();
  });

  it("retains edited values when Blog-local save fails", () => {
    renderSettings("save-error");

    const name = screen.getByLabelText(/^显示名称/) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Paw Draft" } });
    fireEvent.click(screen.getByRole("button", { name: "保存设置" }));

    expect(screen.getByText(/账户偏好保存失败/)).toBeTruthy();
    expect(name.value).toBe("Paw Draft");
    expect(screen.getByText("有未保存的 Blog-local 修改")).toBeTruthy();
  });

  it("keeps identity-security management outside Blog and routes account pages through PublicShell", () => {
    renderSettings();

    fireEvent.click(screen.getByRole("button", { name: "前往 GOSSO 账户中心" }));
    expect(screen.getByText(/https:\/\/sso\.example\.test\/account-settings/)).toBeTruthy();

    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/products/blog/account-pages.tsx"),
      "utf8",
    );

    expect(source).toContain("BlogPublicShellFixture");
    expect(source).toContain('import { PageHeader } from "../../../../src/gouno"');
    expect(source).not.toContain('src/patterns');
    expect(source).not.toMatch(/<(?:AppShell|PageContainer)\b/);
    expect(source).not.toMatch(/\b(?:PasswordForm|MFAForm|PasskeyManager|LoginForm|AccountShell)\b/);
    expect(source).not.toMatch(/\bfetch\s*\(|\baxios\b|XMLHttpRequest|WebSocket/);
    expect(source).not.toMatch(/shadow-(?:md|lg|xl|2xl|raised|overlay|modal)/);
  });
});
