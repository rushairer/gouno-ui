import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import LocalizedControlsExample from "../showcase/demos/core/config-provider/localized";

afterEach(cleanup);

describe("ConfigProvider Showcase locale proof", () => {
  it("makes provider language differences visible without source inspection or hidden aria-only controls", () => {
    render(<LocalizedControlsExample />);

    expect(
      screen.getByRole("combobox", { name: "中文 Provider 默认 Select" })
        .textContent,
    ).toContain("请选择");
    expect(
      screen.getByRole("combobox", { name: "English provider default Select" })
        .textContent,
    ).toContain("Please select");

    expect(screen.getByRole("button", { name: "上一页" }).textContent).toContain(
      "上一页",
    );
    expect(screen.getByRole("button", { name: "Previous" }).textContent).toContain(
      "Previous",
    );
    expect(screen.getByText("跳至")).toBeTruthy();
    expect(screen.getByText("Go to")).toBeTruthy();
  });

  it("shows that explicit caller copy wins over the provider defaults", () => {
    render(<LocalizedControlsExample />);

    expect(
      screen.getByRole("combobox", {
        name: "中文 Provider 业务覆盖 Select",
      }).textContent,
    ).toContain("业务自定义占位文案");
    expect(
      screen.getByRole("combobox", {
        name: "English provider product override Select",
      }).textContent,
    ).toContain("Product-owned placeholder");
  });
});
