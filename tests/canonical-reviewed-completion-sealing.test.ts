import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { showcaseCatalog } from "../showcase/catalog";

const canonicalId = /^(core|theme|pattern|gouno)-/;

describe("canonical reviewed-completion sealing", () => {
  it("keeps the reviewed completion set exactly aligned with the canonical Showcase catalog", () => {
    const catalogIds = new Set(
      showcaseCatalog
        .flatMap((group) => group.items)
        .map((page) => page.id)
        .filter((id) => canonicalId.test(id)),
    );
    const source = readFileSync("showcase/catalog/component-progress.ts", "utf8");
    const block = source.match(/const completedComponents = new Set\(\[([\s\S]*?)\]\);/)?.[1];
    if (!block) throw new Error("completedComponents block missing");
    const completedIds = new Set(
      [...block.matchAll(/"((?:core|theme|pattern|gouno)-[^"]+)"/g)].map(
        (match) => match[1],
      ),
    );

    expect([...completedIds].sort()).toEqual([...catalogIds].sort());
  });

  it("reports every canonical Showcase page as reviewed 100", () => {
    const pages = showcaseCatalog
      .flatMap((group) => group.items)
      .filter((page) => canonicalId.test(page.id));

    expect(pages.length).toBeGreaterThan(0);
    expect(pages.every((page) => page.progress === 100)).toBe(true);
  });

  it("leaves no temporary pretypecheck governance hook in the certified tree", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.pretypecheck).toBeUndefined();
    expect(existsSync(".github/scripts/package.original.json")).toBe(false);
  });
});
