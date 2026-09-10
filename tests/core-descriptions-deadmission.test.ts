import { describe, expect, it } from "vitest";
import * as Core from "../src/core";
import { showcaseCatalog } from "../showcase/catalog";
import { coreRuntimeFamilyCoverage } from "../showcase/core-family-coverage";
import { dataDisplayDocuments } from "../showcase/demos/core/data-display";

describe("Core Descriptions de-admission", () => {
  it("keeps Descriptions outside the canonical runtime and Showcase inventory", () => {
    expect("Descriptions" in Core).toBe(false);
    expect("Descriptions" in coreRuntimeFamilyCoverage).toBe(false);
    expect("descriptions" in dataDisplayDocuments).toBe(false);

    const ids = showcaseCatalog.flatMap((group) =>
      group.items.map((item) => item.id),
    );
    expect(ids).not.toContain("core-descriptions");
  });
});
