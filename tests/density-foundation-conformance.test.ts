import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Density Foundation conformance", () => {
  it("publishes a global comfortable/compact policy from ThemeProvider", () => {
    const theme = source("src/theme/provider.tsx");

    expect(theme).toContain('export type Density = "comfortable" | "compact";');
    expect(theme).toContain('density = "comfortable"');
    expect(theme).toContain("root.dataset.density = density;");
  });

  it("owns Table density geometry in tokens and CSS instead of TSX branches", () => {
    const tokens = source("src/tokens.css");
    const base = source("src/base.css");
    const table = source("src/components/primitives/table.tsx");

    for (const marker of [
      "--table-density-comfortable-cell-block:",
      "--table-density-comfortable-edge-inset:",
      "--table-density-compact-cell-block:",
      "--table-density-compact-edge-inset:",
      "--table-density-touch-cell-block:",
      "--table-density-touch-edge-inset:",
    ]) {
      expect(tokens).toContain(marker);
    }

    expect(base).toContain(
      'html[data-density="compact"]\n    [data-slot="table-container"][data-density="default"]',
    );
    expect(base).toContain('[data-slot="table-container"][data-density="compact"]');
    expect(base).toContain('[data-slot="table-container"][data-density="touch"]');
    expect(base).toContain("padding-block: var(--table-cell-block);");
    expect(base).toContain("padding-inline: var(--table-cell-inline);");
    expect(base).toContain("padding-inline-start: var(--table-edge-inset);");

    expect(table).toContain("data-density={density}");
    expect(table).not.toMatch(/density\s*===/);
    expect(table).not.toMatch(/\[&_t[hd]\]:p[xy]-/);
    expect(table).not.toMatch(/\[&_tfoot_(?:th|td)\]:h-/);
  });

  it("keeps global density as a fallback rather than a replacement for explicit Table modes", () => {
    const table = source("src/components/primitives/table.tsx");
    const docs = source("showcase/demos/core/table/api-sections.ts");

    expect(table).toContain('export type TableDensity = "default" | "compact" | "touch";');
    expect(table).toContain('density = "default"');
    expect(docs).toContain('"default" | "compact" | "touch"');
  });
});
