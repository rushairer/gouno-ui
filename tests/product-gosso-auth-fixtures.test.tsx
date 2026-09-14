import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GossoCallbackDemo } from "../showcase/demos/products/gosso-admin/auth/callback";
import { GossoForgotPasswordDemo } from "../showcase/demos/products/gosso-admin/auth/forgot-password";
import { GossoResetPasswordDemo } from "../showcase/demos/products/gosso-admin/auth/reset-password";

afterEach(cleanup);

function openFixture() {
  fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
}

describe("Gosso standalone auth fixture fidelity", () => {
  it("covers callback loading, success and failure", () => {
    const view = render(<GossoCallbackDemo />);
    expect(screen.getByRole("status")).toBeTruthy();
    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "成功" }));
    expect(screen.getByText("授权回调已完成")).toBeTruthy();
    view.unmount();

    render(<GossoCallbackDemo />);
    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "失败" }));
    expect(screen.getByText("CALLBACK_PARAMS_MISSING")).toBeTruthy();
  });

  it("keeps forgot-password anti-enumeration response and service failure distinct", () => {
    const view = render(<GossoForgotPasswordDemo />);
    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "已提交" }));
    expect(screen.getByText("重置请求已受理")).toBeTruthy();
    view.unmount();

    render(<GossoForgotPasswordDemo />);
    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "失败" }));
    expect(screen.getByText("重置请求暂时失败")).toBeTruthy();
  });

  it("hides reset form for expired, invalid and unavailable token states", () => {
    const view = render(<GossoResetPasswordDemo />);
    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "已过期" }));
    expect(screen.getByText("密码重置链接已过期")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "重置密码" })).toBeNull();
    view.unmount();

    render(<GossoResetPasswordDemo />);
    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "无效链接" }));
    expect(screen.getByText("密码重置链接无效")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "重置密码" })).toBeNull();
  });
});
