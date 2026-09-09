import { describe, expect, it } from "vitest";
import { showcaseCatalog } from "../showcase/catalog";
import { coreDocuments } from "../showcase/demos/core/registry";

describe("Showcase Core documentation coverage", () => {
  it("keeps the Core catalog and document registry in one-to-one sync", () => {
    const catalogDocumentIds = showcaseCatalog
      .filter((group) => group.workspace === "gouno-ui" && group.layer === "core")
      .flatMap((group) => group.items)
      .map((item) => item.id.replace(/^core-/, ""))
      .sort();

    expect(Object.keys(coreDocuments).sort()).toEqual(catalogDocumentIds);
  });

  it("requires every registered Core document and demo to expose matching code", () => {
    for (const [id, document] of Object.entries(coreDocuments)) {
      expect(document.title.trim(), `${id} title`).not.toBe("");
      expect(document.description.trim(), `${id} description`).not.toBe("");
      expect(document.code.trim(), `${id} base code`).not.toBe("");
      expect(typeof document.render, `${id} render`).toBe("function");

      for (const demo of document.demos ?? []) {
        expect(demo.title.trim(), `${id} demo title`).not.toBe("");
        expect(demo.code.trim(), `${id} ${demo.title} code`).not.toBe("");
        expect(typeof demo.render, `${id} ${demo.title} render`).toBe("function");
      }
    }
  });
});
