import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GossoOverviewDemo } from "../showcase/demos/products/gosso-admin/overview";

afterEach(cleanup);

describe("Gosso Admin Overview product language", () => {
  it("keeps Showcase scenario controls outside product flow while preserving semantic feedback", () => {
    render(<GossoOverviewDemo />);
    expect(screen.queryByRole("radio", { name: "普通用户" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "普通用户" }));
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("data-type")).toBe("info");
    expect(screen.getByText("系统管理权限受限")).toBeTruthy();
    expect(screen.getByRole("button", { name: "切换账户" })).toBeTruthy();
  });
});
