import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GossoAccountSettingsDemo } from "../showcase/demos/products/gosso-admin/account-settings";

const { toCanvas } = vi.hoisted(() => ({
  toCanvas: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("qrcode", () => ({
  default: { toCanvas },
}));

afterEach(cleanup);

function openFixture() {
  fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
}

function selectTab(name: string | RegExp) {
  fireEvent.mouseDown(screen.getByRole("tab", { name }), {
    button: 0,
    ctrlKey: false,
  });
}

describe("Gosso Admin account settings fixture fidelity", () => {
  it("preserves profile loading and read-error states", () => {
    const view = render(<GossoAccountSettingsDemo />);
    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "加载中" }));
    expect(screen.getByRole("status", { name: "个人资料加载中" })).toBeTruthy();
    view.unmount();

    render(<GossoAccountSettingsDemo />);
    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "加载失败" }));
    expect(screen.getByText("个人资料加载失败")).toBeTruthy();
  });

  it("models recent-auth separately from password form validation", () => {
    render(<GossoAccountSettingsDemo />);
    selectTab(/修改密码/);
    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "需要近期认证" }));
    expect(screen.getByText("需要近期强认证")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "修改密码" })).toBeNull();
  });

  it("preserves empty and loading collection states for passkeys", () => {
    const view = render(<GossoAccountSettingsDemo />);
    selectTab(/通行密钥/);
    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "空状态" }));
    expect(screen.getByText("还没有通行密钥")).toBeTruthy();
    view.unmount();

    render(<GossoAccountSettingsDemo />);
    selectTab(/通行密钥/);
    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "加载中" }));
    expect(screen.getByRole("status", { name: "通行密钥 (FIDO2)加载中" })).toBeTruthy();
  });

  it("keeps MFA enrollment state machine product-local", () => {
    render(<GossoAccountSettingsDemo />);
    selectTab(/多因素认证/);
    openFixture();
    fireEvent.click(screen.getByRole("radio", { name: "配置中" }));
    expect(screen.getByRole("img", { name: "GOSSO MFA 配置二维码" })).toBeTruthy();
    expect(screen.getByText("使用身份验证器扫描二维码")).toBeTruthy();
  });
});
