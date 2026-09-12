import { describe, expect, it } from "vitest";
import { componentReviews, reviewedProgress } from "../showcase/catalog/component-progress";
import { showcaseCatalog } from "../showcase/catalog";

describe("Showcase catalog metadata", () => {
  const pages = showcaseCatalog.flatMap((group) => group.items);

  it("provides complete bilingual labels for every navigation entry", () => {
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      expect(page.name).toMatch(/[A-Za-z]/);
      expect(page.nameZh).toMatch(/[\u3400-\u9fff]/);
      expect(page.label).toBe(`${page.name} ${page.nameZh}`);
    }
  });

  it("provides a valid completion percentage for every entry", () => {
    for (const page of pages) {
      expect(Number.isInteger(page.progress)).toBe(true);
      expect(page.progress).toBeGreaterThanOrEqual(0);
      expect(page.progress).toBeLessThanOrEqual(100);
    }
  });

  it("reports canonical progress from review evidence rather than a permanent 100 requirement", () => {
    for (const page of pages.filter((item) => /^(core|theme|pattern|gouno)-/.test(item.id))) {
      expect(page.progress).toBe(reviewedProgress(componentReviews[page.id], page.progress));
    }
  });
});
