import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Border Foundation conformance", () => {
  it("owns the stable boundary and emphasis widths in tokens", () => {
    const tokens = source("src/tokens.css");

    expect(tokens).toContain("--border-width-boundary: 1px;");
    expect(tokens).toContain("--border-width-emphasis: 2px;");
    for (const utility of [
      "@utility border-emphasis",
      "@utility border-bs-emphasis",
      "@utility border-be-emphasis",
      "@utility border-s-emphasis",
      "@utility border-e-emphasis",
    ]) {
      expect(tokens).toContain(utility);
    }
  });

  it("routes Core 2px roles through semantic emphasis utilities", () => {
    const spinner = source("src/core/spinner.tsx");
    const timeline = source("src/core/timeline.tsx");
    const steps = source("src/core/steps.tsx");
    const table = source("src/components/primitives/table.tsx");

    expect(spinner).toContain("border-emphasis border-current border-e-transparent");
    expect(timeline).toContain("block size-3 rounded-full border-emphasis");
    expect(steps).toContain("border-be-emphasis border-primary");
    expect(table).toContain("[&_tfoot_tr]:border-bs-emphasis");

    for (const implementation of [spinner, timeline, steps, table]) {
      expect(implementation).not.toMatch(/\bborder(?:-[trblxyse]|-(?:bs|be))?-2\b/);
    }
  });

  it("uses logical emphasis edges in canonical Showcase compositions", () => {
    const demo = source("showcase/components/demo-section.tsx");
    const markdown = source("showcase/components/markdown-preview.tsx");
    const selected = source(
      "showcase/demos/products/blog-admin/ai/operations/canonical-patterns.tsx",
    );

    expect(demo).toContain("border-be-emphasis");
    expect(markdown).toContain("border-s-emphasis ps-4");
    expect(selected).toContain("border-s-emphasis");
    expect(selected).toContain("border-s-primary");
    expect(selected).toContain("border-s-transparent");

    expect(markdown).not.toContain("border-l-2");
    expect(selected).not.toContain("border-l-2");
    expect(selected).not.toContain("border-l-primary");
  });

  it("keeps dynamic Timeline color separate from border-width authority", () => {
    const timeline = source("src/core/timeline.tsx");

    expect(timeline).toContain('"--timeline-color": color');
    expect(timeline).toContain("border-[var(--timeline-color,var(--primary))]");
    expect(timeline).toContain("border-emphasis");
  });
});
