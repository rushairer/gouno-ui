import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { showcaseCatalog } from "../showcase/catalog";
import { GossoCallbackDemo } from "../showcase/demos/products/gosso-auth/callback";
import { GossoForgotPasswordDemo } from "../showcase/demos/products/gosso-auth/forgot-password";
import { GossoLoginDemo } from "../showcase/demos/products/gosso-auth/login";
import { GossoNotFoundDemo } from "../showcase/demos/products/gosso-auth/not-found";
import { GossoResetPasswordDemo } from "../showcase/demos/products/gosso-auth/reset-password";

afterEach(cleanup);

describe("Gosso Admin authentication route fixtures", () => {
  it("preserves password, MFA and Sudo login states without a public auth abstraction", () => {
    const { container } = render(<GossoLoginDemo />);
    expect(screen.getByText("/login")).toBeTruthy();
    expect(container.querySelector('[data-slot="gosso-auth-fixture-control"]')).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/用户名/), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText(/^密码/), { target: { value: "correct-horse-battery" } });
    fireEvent.click(screen.getByRole("button", { name: "登录" }));
    expect(screen.getByLabelText(/动态验证码/)).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "Sudo" }));
    expect(screen.getByText("Administrator")).toBeTruthy();
    expect(screen.getByText(/step-up/)).toBeTruthy();
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

  it("represents callback loading and error states on the same auth fixture-control anchor", () => {
    const { container } = render(<GossoCallbackDemo />);
    expect(container.querySelector('[data-slot="gosso-auth-fixture-control"]')).toBeTruthy();
    expect(screen.getByText(/Authorization Code \+ PKCE/)).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "失败" }));
    expect(screen.getByText(/CALLBACK_PARAMS_MISSING/)).toBeTruthy();
  });

  it("keeps NotFound inside the application page family", () => {
    render(<GossoNotFoundDemo />);
    expect(screen.getByRole("heading", { name: "页面不存在" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "返回概览" })).toBeTruthy();
  });

  it("marks only real standalone auth routes as Showcase standalone presentation", () => {
    const pages = showcaseCatalog.flatMap((group) => group.items);
    const standalone = pages.filter((page) => page.presentation === "standalone").map((page) => page.id).sort();
    expect(standalone).toEqual([
      "gosso-callback",
      "gosso-forgot-password",
      "gosso-login",
      "gosso-reset-password",
    ]);
    expect(pages.find((page) => page.id === "gosso-not-found")?.presentation).toBe("app-shell");
  });
});
