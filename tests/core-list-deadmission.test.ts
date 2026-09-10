import { describe, expect, it } from "vitest";
import * as Core from "../src/core";
import { showcaseCatalog } from "../showcase/catalog";
import { coreRuntimeFamilyCoverage } from "../showcase/core-family-coverage";
import { dataDisplayDocuments } from "../showcase/demos/core/data-display";

describe("Core List de-admission", () => {
  it("keeps List outside the canonical runtime and Showcase inventory", () => {
    expect("List" in Core).toBe(false);
    expect("List" in coreRuntimeFamilyCoverage).toBe(false);
    expect("list" in dataDisplayDocuments).toBe(false);

    const ids = showcaseCatalog.flatMap((group) =>
      group.items.map((item) => item.id),
    );
    expect(ids).not.toContain("core-list");
  });
});
