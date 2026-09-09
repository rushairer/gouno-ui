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
      const source = read(path);
      expect(source, path).toMatch(/Blog public|Blog public site|Gouno Blog public site/);
      expect(source, path).toMatch(/active migration line|active workspace|active page-by-page validation line|active public-site migration workspace/);
    }
  });

  it("keeps Blog Admin as a completed comparison corpus", () => {
    for (const path of processDocs) {
      const source = read(path);
      expect(source, path).toMatch(/Blog Admin/);
      expect(source, path).toMatch(/completed second-product|completed second comparison|completed comparison corpora|completed comparison corpus|completed second-product comparison corpus/);
      expect(source, path).not.toMatch(/Blog Admin is the active|Active migration line:\*\* Gouno Blog Admin|Blog Admin.*active page-by-page/);
    }
  });

  it("does not populate the Blog workspace before a real public page lands", () => {
    const catalog = read("showcase/catalog.tsx");
    expect(catalog).toContain('{ workspace: "blog", group: "Migrated Pages 已迁移页面", items: [] }');
  });
});
