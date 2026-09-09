import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const processDocs = [
  "AGENTS.md",
  "README.md",
  "docs/architecture.md",
  "docs/product-driven-development.md",
  "showcase/demos/products/README.md",
] as const;

describe("product migration line", () => {
  it("keeps Blog public as the single active migration line", () => {
    for (const path of processDocs) {
      const normalized = read(path).toLowerCase();
      expect(normalized, path).toMatch(/blog public|gouno blog public site/);
      expect(normalized, path).toMatch(
        /active migration line|active workspace|active page-by-page validation line|active public-site migration workspace/,
      );
    }
  });

  it("keeps Blog Admin as a completed comparison corpus", () => {
    for (const path of processDocs) {
      const normalized = read(path).toLowerCase();
      expect(normalized, path).toContain("blog admin");
      expect(normalized, path).toContain("completed");
      expect(normalized, path).toMatch(/comparison corpus|comparison corpora/);
      expect(normalized, path).not.toMatch(
        /blog admin is the active|active migration line:\*\* gouno blog admin|blog admin.*active page-by-page/,
      );
    }
  });

  it("starts the Blog workspace with the real Home migration", () => {
    const catalog = read("showcase/catalog.tsx");
    expect(catalog).toContain('item("blog-home", "Home", "首页", 100, <Home />)');
  });
});
