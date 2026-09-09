import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const source = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("semantic elevation system", () => {
  it("defines canvas, control, surface, raised, overlay and modal roles", () => {
    const tokens = source("src/tokens.css");

    expect(tokens).toContain("--color-canvas: var(--canvas)");
    expect(tokens).toContain("--shadow-control: var(--elevation-shadow-control)");
    expect(tokens).toContain("--shadow-surface: var(--elevation-shadow-surface)");
    expect(tokens).toContain("--shadow-raised: var(--elevation-shadow-raised)");
    expect(tokens).toContain("--shadow-overlay: var(--elevation-shadow-overlay)");
    expect(tokens).toContain("--shadow-modal: var(--elevation-shadow-modal)");
    expect(tokens).toContain("--canvas: #f6f7f9");
    expect(tokens).toContain("--canvas: #0f1319");
  });

  it("keeps raw size shadows flat compatibility aliases", () => {
    const tokens = source("src/tokens.css");
    for (const size of ["xs", "sm", "md", "lg", "xl", "2xl"]) {
      expect(tokens).toContain(`--shadow-${size}: 0 0 #0000`);
    }
  });

  it("places normal application content on the semantic canvas", () => {
    const shell = source("src/gouno/app-shell.tsx");
    expect(shell).toContain('data-slot="app-shell" className="min-h-dvh bg-canvas text-foreground"');
    expect(shell).toContain("border-b bg-background");
    expect(shell).toContain("border-r bg-sidebar");
  });

  it("uses low surface depth for persistent bounded content and stronger depth only for raised cards", () => {
    const card = source("src/core/card.tsx");
    const table = source("src/components/primitives/table.tsx");

    expect(card).toContain('variant === "default" && "shadow-surface"');
    expect(card).toContain('variant === "subtle" && "bg-muted"');
    expect(card).toContain('variant === "elevated" && "bg-raised shadow-raised"');
    expect(card).toContain("hover:shadow-raised");
    expect(table).toContain('bordered ? "border border-border/80 bg-card shadow-surface"');
  });

  it("uses micro depth only on tangible controls", () => {
    const button = source("src/components/primitives/button.tsx");
    const segmented = source("src/core/segmented.tsx");

    for (const variant of ["default", "destructive", "outline", "secondary"]) {
      expect(button).toMatch(new RegExp(`${variant}:\\s*\\n?\\s*"[^"]*shadow-control`));
    }
    expect(button).toContain('ghost: "hover:bg-accent hover:text-accent-foreground"');
    expect(button).toContain('link: "text-primary underline-offset-4 hover:underline"');
    expect(segmented).toContain("peer-checked:shadow-control");
  });
});
