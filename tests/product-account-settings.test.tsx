import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { GossoAccountSettingsDemo } from "../showcase/demos/products/gosso-account-settings";

afterEach(cleanup);

function selectTab(name: string) {
  fireEvent.mouseDown(screen.getByRole("tab", { name }), {
    button: 0,
    ctrlKey: false,
  });
}

describe("Gosso Admin Account Settings migration fixture", () => {
  it("preserves the five route-backed account settings sections without putting fixture chrome in product flow", () => {
    render(<GossoAccountSettingsDemo />);

    expect(screen.getAllByRole("tab")).toHaveLength(5);
    expect(screen.queryByText("真实产品路由")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    expect(screen.getByText("/account-settings/profile")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "个人资料" })).toBeTruthy();

    selectTab("修改密码");
    expect(screen.getByText("/account-settings/password")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "修改密码" })).toBeTruthy();

    selectTab("活跃会话");
    expect(screen.getByText("/account-settings/sessions")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "活跃会话" })).toBeTruthy();
  });

  it("keeps password validation local to the page fixture", () => {
    render(<GossoAccountSettingsDemo />);
    selectTab("修改密码");

    fireEvent.change(screen.getByLabelText(/^当前密码/), {
      target: { value: "current-password" },
    });
    fireEvent.change(screen.getByLabelText(/^新密码/), {
      target: { value: "abcdefghijkl" },
    });
    fireEvent.change(screen.getByLabelText(/^确认新密码/), {
      target: { value: "abcdefghijklX" },
    });
    fireEvent.click(screen.getByRole("button", { name: "修改密码" }));
    expect(screen.getByText("两次输入的新密码不一致。")).toBeTruthy();

    fireEvent.change(screen.getByLabelText(/^确认新密码/), {
      target: { value: "abcdefghijkl" },
    });
    fireEvent.click(screen.getByRole("button", { name: "修改密码" }));
    expect(screen.getByText("密码更新流程已完成（Showcase 模拟）。")).toBeTruthy();
  });

  it("keeps self-surfaced passkey and session collections out of redundant Cards", () => {
    render(<GossoAccountSettingsDemo />);

    selectTab("通行密钥 (FIDO2)");
    const passkeyList = screen.getByRole("list", { name: "已注册通行密钥" });
    expect(screen.getByText("MacBook Pro")).toBeTruthy();
    expect(screen.getByText("iPhone")).toBeTruthy();
    expect(passkeyList.closest('[data-slot="card"]')).toBeNull();

    selectTab("活跃会话");
    const sessionTable = screen.getByRole("table");
    expect(screen.getByText("macOS · Chrome")).toBeTruthy();
    expect(screen.getByText("当前会话")).toBeTruthy();
    expect(sessionTable.closest('[data-slot="card"]')).toBeNull();

    const terminateButtons = screen.getAllByRole("button", { name: "终止会话" });
    fireEvent.click(terminateButtons[0]);
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "确认终止" }));
    expect(screen.queryByText("iPhone · Safari")).toBeNull();
    expect(screen.getByText("iPhone · Safari 会话已终止（Showcase 模拟）。")).toBeTruthy();
  });
});
