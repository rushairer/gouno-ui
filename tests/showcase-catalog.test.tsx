import { describe, expect, it } from "vitest";
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

  it("reports the canonical catalog as fully reviewed", () => {
    expect(pages.length).toBeGreaterThan(0);
    expect(pages.every((page) => page.progress === 100)).toBe(true);
    expect(pages.some((page) => page.progress < 100)).toBe(false);
  });
});
