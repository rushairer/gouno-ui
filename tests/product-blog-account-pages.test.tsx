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

function renderNotifications(
  initialScenario:
    | "data"
    | "loading"
    | "empty"
    | "error"
    | "mutation-error" = "data",
) {
  return render(
    <ThemeProvider
      brand="blog"
      storageKey={`blog-account-notifications-${initialScenario}-theme`}
    >
      <BlogAccountNotificationsDemo initialScenario={initialScenario} />
    </ThemeProvider>,
  );
}

function renderSettings(
  initialScenario: "available" | "missing-admin-url" = "available",
) {
  return render(
    <ThemeProvider
      brand="blog"
      storageKey={`blog-account-settings-${initialScenario}-theme`}
    >
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
    expect(screen.queryByText("站点通知已送达")).toBeNull();

    const firstNotification = screen
      .getByText("Aben 回复了你的评论")
      .closest('[data-slot="card"]');
    expect(firstNotification).toBeTruthy();
    fireEvent.click(
      within(firstNotification as HTMLElement).getByRole("button", {
        name: "标为已读",
      }),
    );
    expect(screen.getByText("1 条未读")).toBeTruthy();
    expect(screen.queryByText("Aben 回复了你的评论")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "全部标为已读" }));
    expect(screen.getByText("0 条未读")).toBeTruthy();
    expect(screen.getByText("没有未读通知")).toBeTruthy();
  });

  it("marks a notification read before navigating to its product destination", () => {
    renderNotifications();

    const firstNotification = screen
      .getByText("Aben 回复了你的评论")
      .closest('[data-slot="card"]');
    fireEvent.click(
      within(firstNotification as HTMLElement).getByRole("button", {
        name: "查看",
      }),
    );

    expect(
      screen.getByText(
        /\/articles\/oauth2-bff-product-experience#comment-comment-1/,
      ),
    ).toBeTruthy();
    expect(screen.getByText("1 条未读")).toBeTruthy();
  });

  it("uses notification-local loading, empty and fatal load-error anatomy", () => {
    const loading = renderNotifications("loading");
    expect(screen.getByRole("status", { name: "通知加载中" })).toBeTruthy();
    expect(screen.queryByRole("radio", { name: "全部" })).toBeNull();
    loading.unmount();

    const empty = renderNotifications("empty");
    expect(screen.getByText("还没有通知")).toBeTruthy();
    empty.unmount();

    renderNotifications("error");
    expect(screen.getByText("通知加载失败")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "重试" }));
    expect(screen.getByText("Aben 回复了你的评论")).toBeTruthy();
  });

  it("keeps loaded notifications visible when a read mutation fails", () => {
    renderNotifications("mutation-error");

    const firstNotification = screen
      .getByText("Aben 回复了你的评论")
      .closest('[data-slot="card"]');
    fireEvent.click(
      within(firstNotification as HTMLElement).getByRole("button", {
        name: "标为已读",
      }),
    );

    expect(screen.getByText("通知操作失败")).toBeTruthy();
    expect(screen.getByText(/标记已读失败/)).toBeTruthy();
    expect(screen.getByText("Aben 回复了你的评论")).toBeTruthy();
    expect(screen.getByText("2 条未读")).toBeTruthy();
  });

  it("keeps Blog Account Settings scoped to the real GOSSO identity boundary", () => {
    renderSettings();

    expect(
      screen.getByRole("heading", { level: 1, name: "账户设置" }),
    ).toBeTruthy();
    expect(screen.getByText("paw@example.test")).toBeTruthy();
    expect(
      screen.getByText(/密码、邮箱、MFA、Passkey/),
    ).toBeTruthy();
    expect(screen.queryByLabelText(/^显示名称/)).toBeNull();
    expect(screen.queryByRole("switch")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "打开 GOSSO Admin" }));
    expect(
      screen.getByText(/https:\/\/sso\.example\.test\/account-settings/),
    ).toBeTruthy();
  });

  it("renders a persistent configuration error when the identity-center URL is unavailable", () => {
    renderSettings("missing-admin-url");

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText(/未提供身份管理中心地址/)).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "打开 GOSSO Admin" }),
    ).toBeNull();
  });

  it("keeps identity security outside Blog and routes account pages through PublicShell", () => {
    renderSettings();

    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/products/blog/account-pages.tsx"),
      "utf8",
    );

    expect(source).toContain("BlogPublicShellFixture");
    expect(source).toContain(
      'import { PageHeader } from "../../../../src/gouno"',
    );
    expect(source).not.toContain('src/patterns');
    expect(source).not.toMatch(/<(?:AppShell|PageContainer)\b/);
    expect(source).not.toMatch(
      /\b(?:PasswordForm|MFAForm|PasskeyManager|LoginForm|AccountShell)\b/,
    );
    expect(source).not.toMatch(/\bfetch\s*\(|\baxios\b|XMLHttpRequest|WebSocket/);
    expect(source).not.toMatch(/<button\b/);
    expect(source).not.toMatch(/\b(?:displayName|savedBio|PreferenceToggle)\b/);
    expect(source).not.toMatch(/shadow-(?:md|lg|xl|2xl|raised|overlay|modal)/);
  });
});
