import { describe, expect, it } from "vitest";
import { showcaseCatalog } from "../showcase/catalog";
import { coreDocuments } from "../showcase/demos/core/registry";

describe("reviewed Showcase source trust", () => {
  it("requires every visible 100% Core example to be complete canonical package source", () => {
    const reviewed = showcaseCatalog
      .filter(
        (group) => group.workspace === "gouno-ui" && group.layer === "core",
      )
      .flatMap((group) => group.items)
      .filter((item) => item.progress === 100);

    expect(reviewed.length).toBeGreaterThan(0);

    for (const item of reviewed) {
      const key = item.id.replace(/^core-/, "");
      const document = coreDocuments[key];
      expect(document, `${item.id} must have a canonical document`).toBeTruthy();

      const examples = [document, ...(document.demos ?? [])];
      for (const [index, example] of examples.entries()) {
        expect(
          example.code,
          `${item.id} example ${index} must use the canonical Core package entry`,
        ).toContain("@gouno/ui/core");
        expect(
          example.code,
          `${item.id} example ${index} must not expose repository-relative source imports`,
        ).not.toMatch(/\.\.\/.*src/);
        expect(
          example.code.trim().split("\n").length,
          `${item.id} example ${index} must be a complete copyable source example`,
        ).toBeGreaterThan(2);
      }
    }
  });
});
