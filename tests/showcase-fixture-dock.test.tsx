import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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
  it("publishes Fixture toolbar height for portaled overlay safe area", () => {
    render(<FixtureTools><main>Product</main></FixtureTools>);
    expect(document.documentElement.style.getPropertyValue("--showcase-tools-inset-top")).toBe("48px");
  });

  it("binds portaled Sheets to the Fixture overlay safe area", () => {
    const styles = readFileSync(resolve(process.cwd(), "showcase/styles/showcase.css"), "utf8");
    expect(styles).toContain('[data-slot="sheet-overlay"]');
    expect(styles).toContain('[data-slot="sheet-content"][data-side="right"]');
    expect(styles).toContain('height: calc(100dvh - var(--showcase-tools-inset-top, 3rem))');
  });

  it("keeps global notice overlays below Showcase tooling", () => {
    const styles = readFileSync(resolve(process.cwd(), "showcase/styles/showcase.css"), "utf8");
    expect(styles).toContain('[data-slot="message-region"]');
    expect(styles).toContain('[data-slot="notification-region"]');
    expect(styles).toContain('top: calc(var(--showcase-tools-inset-top, 3rem) + 1rem)');
  });

  it("reserves normal-flow space when rendered without Showcase tooling", () => {
    render(<FixtureDock route="/example" />);
    expect(screen.getByRole("button", { name: "打开 Fixture 控制" }).closest("[data-showcase-fixture-dock]")?.className).not.toMatch(/fixed|absolute/);
  });
});
