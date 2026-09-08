import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GossoOverviewDemo } from "../showcase/demos/products/gosso-overview";

describe("Gosso Admin Overview product language", () => {
  it("uses semantic feedback for restricted system-management access", () => {
    render(<GossoOverviewDemo />);
    fireEvent.click(screen.getByRole("radio", { name: "普通用户" }));
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("data-type")).toBe("info");
    expect(screen.getByText("系统管理权限受限")).toBeTruthy();
    expect(screen.getByRole("button", { name: "切换账户" })).toBeTruthy();
  });
});
