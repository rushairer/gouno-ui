import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { componentReviews, reviewedProgress } from "../showcase/catalog/component-progress";
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
    expect(Object.keys(componentReviews).sort()).toEqual([...catalogIds].sort());
    for (const [id, review] of Object.entries(componentReviews)) {
      expect(review.scope.trim(), id).not.toBe("");
      expect(review.baseline.trim(), id).not.toBe("");
      expect(review.evidence.length, id).toBeGreaterThan(0);
      for (const path of review.evidence) expect(existsSync(path), `${id}: ${path}`).toBe(true);
    }
  });

  it("allows a reviewed family to reopen without losing its evidence or catalog entry", () => {
    const previous = componentReviews["core-select"];
    expect(reviewedProgress({ ...previous, status: "reopened" }, 100)).toBe(99);
    expect(reviewedProgress(previous, 0)).toBe(100);
    expect(showcaseCatalog.flatMap((group) => group.items).some((page) => page.id === "core-select")).toBe(true);
  });

  it("leaves no temporary pretypecheck governance hook in the certified tree", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.pretypecheck).toBeUndefined();
    expect(existsSync(".github/scripts/package.original.json")).toBe(false);
  });
});
