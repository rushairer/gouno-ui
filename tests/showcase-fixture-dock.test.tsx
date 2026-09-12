import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FixtureDock } from "../showcase/components/fixture-dock";
import { FixtureTools } from "../showcase/components/fixture-tools";

afterEach(cleanup);

describe("Showcase FixtureDock", () => {
  it("portals the entry into reserved tools space outside the product viewport", () => {
    const { container } = render(<FixtureTools><main><FixtureDock route="/admin/example" controls={<button>Switch state</button>} /><button>Product action</button></main></FixtureTools>);
    const trigger = screen.getByRole("button", { name: "打开 Fixture 控制" });
    expect(trigger.closest("[data-showcase-fixture-target]")).toBeTruthy();
    expect(trigger.closest("[data-showcase-product-viewport]")).toBeNull();
    expect(container.querySelector("[data-showcase-product-viewport]")?.contains(screen.getByRole("button", { name: "Product action" }))).toBe(true);
    fireEvent.click(trigger);
    expect(screen.getByText("/admin/example")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Switch state" })).toBeTruthy();
  });
  it("reserves normal-flow space when rendered without Showcase tooling", () => {
    render(<FixtureDock route="/example" />);
    expect(screen.getByRole("button", { name: "打开 Fixture 控制" }).closest("[data-showcase-fixture-dock]")?.className).not.toMatch(/fixed|absolute/);
  });
});
