import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FixtureDock } from "../showcase/components/fixture-dock";

afterEach(cleanup);

describe("Showcase FixtureDock", () => {
  it("stays out of the mobile PageHeader band while remaining a compact edge control", () => {
    const { container } = render(
      <FixtureDock route="/admin/example" note="Static fixture" controls={<button>Switch state</button>} />,
    );

    const dock = container.querySelector("[data-showcase-fixture-dock]");
    expect(dock?.className).toContain("right-0");
    expect(dock?.className).toContain("top-1/2");
    expect(dock?.className).toContain("-translate-y-1/2");
    expect(dock?.className).toContain("sm:top-20");

    const trigger = screen.getByRole("button", { name: "打开 Fixture 控制" });
    expect(trigger.className).toContain("w-7");
    expect(trigger.className).toContain("sm:w-auto");
    expect(trigger.querySelector("span")?.className).toContain("hidden sm:inline");

    fireEvent.click(trigger);
    expect(screen.getByText("/admin/example")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Switch state" })).toBeTruthy();
  });
});
