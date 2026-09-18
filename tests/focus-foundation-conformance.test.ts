import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd());

function collectTsx(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTsx(path);
    return entry.isFile() && path.endsWith(".tsx") ? [path] : [];
  });
}

describe("Focus Foundation", () => {
  it("keeps one token authority for focus indicator geometry", () => {
    const tokens = readFileSync(resolve(root, "src/tokens.css"), "utf8");
    const base = readFileSync(resolve(root, "src/base.css"), "utf8");

    for (const marker of [
      "--focus-ring-width: 2px;",
      "--focus-ring-offset-control: 2px;",
      "--focus-ring-offset-standalone: 3px;",
      "--focus-ring-offset-inset: -2px;",
    ]) {
      expect(tokens).toContain(marker);
    }

    for (const marker of [
      ".focus-control:focus-visible",
      ".focus-standalone:focus-visible",
      ".focus-inset:focus-visible",
      ".focus-within-owner:has(:focus-visible)",
      ".peer:focus-visible ~ .focus-peer-control",
    ]) {
      expect(base).toContain(marker);
    }
  });

  it("keeps modal close controls keyboard-visible instead of pointer-focus styled", () => {
    for (const file of [
      "src/components/primitives/dialog.tsx",
      "src/components/primitives/sheet.tsx",
    ]) {
      const source = readFileSync(resolve(root, file), "utf8");
      expect(source).toContain("focus-control");
      expect(source).not.toMatch(/\bfocus:ring-|\bfocus:outline-/);
    }
  });

  it("keeps raw focus geometry out of governed implementation and product corpora", () => {
    const files = [
      ...collectTsx(resolve(root, "src")),
      ...collectTsx(resolve(root, "showcase/components")),
      ...collectTsx(resolve(root, "showcase/demos/products/blog")),
      ...collectTsx(resolve(root, "showcase/demos/products/blog-admin")),
      ...collectTsx(resolve(root, "showcase/demos/products/gosso-admin")),
    ];
    const raw =
      /\b(?:focus-visible|peer-focus-visible|focus-within|focus):(?:ring-(?:\d+|\[[^\]]+\])|ring-offset-(?:\d+|\[[^\]]+\])|ring-inset)\b/;

    const offenders = files.filter((file) =>
      raw.test(readFileSync(file, "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});
