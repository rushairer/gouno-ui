import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { showcaseCatalog } from "../showcase/catalog";
import { GossoCallbackDemo } from "../showcase/demos/products/gosso-admin/auth/callback";
import { GossoForgotPasswordDemo } from "../showcase/demos/products/gosso-admin/auth/forgot-password";
import { GossoLoginDemo } from "../showcase/demos/products/gosso-admin/auth/login";
import { GossoNotFoundDemo } from "../showcase/demos/products/gosso-admin/auth/not-found";
import { GossoResetPasswordDemo } from "../showcase/demos/products/gosso-admin/auth/reset-password";

afterEach(cleanup);

describe("Gosso Admin authentication route fixtures", () => {
  it("preserves password, MFA and Sudo login states without a public auth abstraction", () => {
    render(<GossoLoginDemo />);
    expect(screen.getByRole("heading", { level: 1, name: "统一身份中心" })).toBeTruthy();
    expect(screen.queryByText("/login")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/login")).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/用户名/), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText(/^密码/, { selector: 'input[type="password"]' }), { target: { value: "correct-horse-battery" } });
    fireEvent.click(screen.getByRole("button", { name: "登录" }));
    expect(screen.getByLabelText(/动态验证码/)).toBeTruthy();
    const transitionAlert = screen.getByText("密码验证通过；fixture 模拟服务端要求第二因素。").closest('[role="alert"]');
    expect(transitionAlert?.getAttribute("data-type")).toBe("info");

    fireEvent.click(screen.getByRole("radio", { name: "Sudo" }));
    expect(screen.getByRole("heading", { level: 1, name: "验证敏感操作" })).toBeTruthy();
    expect(screen.getByText("Administrator")).toBeTruthy();
    expect(screen.getByText(/step-up/)).toBeTruthy();
  });

  it("uses success feedback for passkey login fixture", () => {
    render(<GossoLoginDemo />);
    fireEvent.click(screen.getByRole("button", { name: "使用通行密钥登录" }));
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("data-type")).toBe("success");
    expect(screen.getByText("通行密钥登录成功（Showcase 模拟）。")).toBeTruthy();
  });

  it("keeps forgot-password success generic", () => {
    render(<GossoForgotPasswordDemo />);
    fireEvent.change(screen.getByLabelText(/邮箱/), { target: { value: "person@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "发送重置链接" }));
    expect(screen.getByText(/如果该邮箱对应有效账户/)).toBeTruthy();
  });

  it("validates reset-password length locally", () => {
    render(<GossoResetPasswordDemo />);
    fireEvent.change(screen.getByLabelText(/新密码/), { target: { value: "short" } });
    fireEvent.change(screen.getByLabelText(/确认密码/), { target: { value: "short" } });
    fireEvent.click(screen.getByRole("button", { name: "重置密码" }));
    expect(screen.getByText("新密码至少需要 12 个字符。")).toBeTruthy();
  });

  it("represents callback loading and error states", () => {
    render(<GossoCallbackDemo />);
    expect(screen.getByRole("heading", { level: 1, name: "正在完成身份验证" })).toBeTruthy();
    expect(screen.getByText(/Authorization Code \+ PKCE/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "失败" }));
    expect(screen.getByRole("heading", { level: 1, name: "身份验证失败" })).toBeTruthy();
    expect(screen.getByText(/CALLBACK_PARAMS_MISSING/)).toBeTruthy();
  });

  it("keeps NotFound inside the application page family with one local page heading", () => {
    render(<GossoNotFoundDemo />);
    expect(screen.getByRole("heading", { level: 1, name: "页面不存在" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "返回概览" })).toBeTruthy();
  });

  it("marks only real Gosso auth routes as standalone presentation", () => {
    const pages = showcaseCatalog
      .filter((group) => group.workspace === "gosso-admin")
      .flatMap((group) => group.items);
    const standalone = pages
      .filter((page) => page.presentation === "standalone")
      .map((page) => page.id)
      .sort();
    expect(standalone).toEqual([
      "gosso-callback",
      "gosso-forgot-password",
      "gosso-login",
      "gosso-reset-password",
    ]);
    expect(pages.find((page) => page.id === "gosso-not-found")?.presentation).toBe("app-shell");
  });
});
