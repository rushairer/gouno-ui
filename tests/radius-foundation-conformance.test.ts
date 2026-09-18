import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Radius Foundation conformance", () => {
  it("keeps one numeric radius scale and aliases compatibility/control names to md", () => {
    const tokens = source("src/tokens.css");

    expect(tokens).toContain("--radius-sm: 4px;");
    expect(tokens).toContain("--radius-md: 6px;");
    expect(tokens).toContain("--radius-lg: 10px;");
    expect(tokens).toContain("--radius-xl: 10px;");
    expect(tokens).toContain("--radius: var(--radius-md);");
    expect(tokens).toContain("--radius-control: var(--radius-md);");

    expect(tokens).not.toMatch(/--radius:\s*6px/);
    expect(tokens).not.toMatch(/--radius-control:\s*6px/);
  });

  it("keeps Button default radius on the shared md path while preserving shape overrides", () => {
    const primitiveButton = source("src/components/primitives/button.tsx");
    const coreButton = source("src/core/button.tsx");
    const base = source("src/base.css");

    expect(primitiveButton).toContain("rounded-md");
    expect(coreButton).toContain('round: "rounded-full"');
    expect(coreButton).toContain('circle: "rounded-full aspect-square px-0"');
    expect(base).toContain('border-radius: var(--radius-control);');
  });

  it("removes raw control radius literals while keeping the documented Tooltip arrow exception", () => {
    const checkbox = source("src/components/primitives/checkbox.tsx");
    const tooltip = source("src/components/primitives/tooltip.tsx");

    expect(checkbox).toContain("rounded-sm");
    expect(checkbox).not.toContain("rounded-[4px]");
    expect(tooltip).toContain("rounded-[2px]");
  });
});
