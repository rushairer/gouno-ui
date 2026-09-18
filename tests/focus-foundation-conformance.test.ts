import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Focus Foundation conformance", () => {
  it("defines one 2px/2px fallback geometry", () => {
    const tokens = source("src/tokens.css");
    const base = source("src/base.css");

    expect(tokens).toContain("--focus-ring-width: 2px;");
    expect(tokens).toContain("--focus-ring-offset: 2px;");
    expect(base).toContain("outline: var(--focus-ring-width) solid var(--ring);");
    expect(base).toContain("outline-offset: var(--focus-ring-offset);");
    expect(base).not.toContain("outline-offset: 3px;");
  });

  it("keeps primitive direct focus rings on canonical 2px geometry", () => {
    for (const path of [
      "src/components/primitives/button.tsx",
      "src/components/primitives/input.tsx",
      "src/components/primitives/textarea.tsx",
      "src/components/primitives/checkbox.tsx",
      "src/components/primitives/radio-group.tsx",
      "src/components/primitives/switch.tsx",
      "src/components/primitives/select.tsx",
      "src/components/primitives/tabs.tsx",
      "src/components/primitives/badge.tsx",
    ]) {
      const text = source(path);
      expect(text, path).toContain("focus-visible:ring-2");
      expect(text, path).not.toContain("focus-visible:ring-[3px]");
    }
  });

  it("prevents Tabs and Badge from stacking the global outline with their owned ring", () => {
    const tabs = source("src/components/primitives/tabs.tsx");
    const badge = source("src/components/primitives/badge.tsx");

    expect(tabs).toContain("outline-none focus-visible:border-ring focus-visible:ring-2");
    expect(tabs).not.toContain("focus-visible:outline-1");
    expect(tabs).not.toContain("focus-visible:outline-ring");

    expect(badge).toContain("outline-none focus-visible:border-ring focus-visible:ring-2");
  });

  it("keeps Dialog and Sheet close focus keyboard-visible", () => {
    for (const path of [
      "src/components/primitives/dialog.tsx",
      "src/components/primitives/sheet.tsx",
    ]) {
      const text = source(path);
      expect(text, path).toContain("focus-visible:ring-2");
      expect(text, path).toContain("focus-visible:outline-none");
      expect(text, path).not.toMatch(/\bfocus:ring-/);
      expect(text, path).not.toContain("focus:outline-hidden");
    }
  });
});
