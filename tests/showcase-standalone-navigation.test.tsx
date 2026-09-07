import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StandaloneNavigation } from "../showcase/components/standalone-navigation";

describe("Standalone Showcase navigation", () => {
  it("provides a compact return control and product page menu", () => {
    const onNavigate = vi.fn();
    render(
      <StandaloneNavigation
        workspace="gosso-admin"
        currentPage="gosso-login"
        onNavigate={onNavigate}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "返回应用页" }));
    expect(onNavigate).toHaveBeenCalledWith("gosso-overview");

    fireEvent.click(screen.getByRole("button", { name: "打开页面菜单" }));
    expect(screen.getByText("Authentication Pages 认证页")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reset Password 重置密码" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Reset Password 重置密码" }));
    expect(onNavigate).toHaveBeenLastCalledWith("gosso-reset-password");
  });
});
