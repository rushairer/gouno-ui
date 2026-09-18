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
    expect(tokens).toContain("--border-width-accent: 4px;");
    for (const utility of [
      "@utility edge-emphasis",
      "@utility edge-s-accent",
      "@utility edge-bs-emphasis",
      "@utility edge-be-emphasis",
      "@utility edge-s-emphasis",
      "@utility edge-e-emphasis",
    ]) {
      expect(tokens).toContain(utility);
    }
  });

  it("routes Core 2px roles through semantic emphasis utilities", () => {
    const spinner = source("src/core/spinner.tsx");
    const timeline = source("src/core/timeline.tsx");
    const steps = source("src/core/steps.tsx");
    const table = source("src/components/primitives/table.tsx");

    expect(spinner).toContain("edge-emphasis border-current border-e-transparent");
    expect(timeline).toContain("block size-3 rounded-full edge-emphasis");
    expect(steps).toContain("edge-be-emphasis border-primary");
    expect(table).toContain("[&_tfoot_tr]:edge-bs-emphasis");

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

    expect(demo).toContain("edge-be-emphasis");
    expect(markdown).toContain("edge-s-emphasis ps-4");
    expect(selected).toContain("edge-s-emphasis");
    expect(selected).toContain("border-s-primary");
    expect(selected).toContain("border-s-transparent");

    expect(markdown).not.toContain("border-l-2");
    expect(selected).not.toContain("border-l-2");
    expect(selected).not.toContain("border-l-primary");
  });

  it("preserves the stronger Public Blog reading quote as an explicit content accent", () => {
    const article = source("showcase/demos/products/blog/article-detail.tsx");
    const documentPage = source("showcase/demos/products/blog/document-pages.tsx");

    for (const implementation of [article, documentPage]) {
      expect(implementation).toContain(
        "edge-s-accent border-s-primary/40 bg-muted/40",
      );
      expect(implementation).not.toContain("border-l-4");
    }
  });

  it("keeps dynamic Timeline color separate from border-width authority", () => {
    const timeline = source("src/core/timeline.tsx");

    expect(timeline).toContain('"--timeline-color": color');
    expect(timeline).toContain("border-[var(--timeline-color,var(--primary))]");
    expect(timeline).toContain("edge-emphasis");
  });
});
