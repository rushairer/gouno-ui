import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Steps } from "../src/core/steps";

const source = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

afterEach(cleanup);

describe("Responsive Foundation conformance", () => {
  it("defines one canonical breakpoint tier scale", () => {
    const tokens = source("src/tokens.css");

    expect(tokens).toContain("--breakpoint-sm: 40rem;");
    expect(tokens).toContain("--breakpoint-md: 48rem;");
    expect(tokens).toContain("--breakpoint-lg: 64rem;");
    expect(tokens).toContain("--breakpoint-xl: 80rem;");
    expect(tokens).toContain("--breakpoint-2xl: 96rem;");
  });

  it("keeps base media queries on the same rem tiers instead of px copies", () => {
    const base = source("src/base.css");

    expect(base).toContain("@media (width < 48rem)");
    expect(base).toContain("@media (width >= 40rem)");
    expect(base).toContain("@media (width >= 48rem)");
    expect(base).toContain("@media (width >= 64rem)");
    expect(base).toContain("@media (width >= 80rem)");
    expect(base).toContain("@media (width >= 96rem)");

    expect(base).not.toMatch(/@media\s*\((?:min|max)-width:\s*\d+px/);
  });

  it("binds automatic horizontal Steps stacking to canonical sm", () => {
    render(
      <Steps
        items={[
          { key: "one", title: "One" },
          { key: "two", title: "Two" },
        ]}
      />,
    );

    const root = document.querySelector('[data-slot="steps"]');
    expect(root?.className).toContain("max-sm:flex-col");
    expect(root?.className).toContain("max-sm:overflow-visible");
    expect(root?.className).not.toContain("max-[531px]");
  });

  it("preserves the explicit responsive opt-out", () => {
    render(
      <Steps
        responsive={false}
        items={[
          { key: "one", title: "One" },
          { key: "two", title: "Two" },
        ]}
      />,
    );

    const root = document.querySelector('[data-slot="steps"]');
    expect(root?.className).not.toContain("max-sm:flex-col");
    expect(root?.className).not.toContain("max-sm:overflow-visible");
  });
});
