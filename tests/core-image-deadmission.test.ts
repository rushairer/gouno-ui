import { describe, expect, it } from "vitest";
import * as Core from "../src/core";
import { showcaseCatalog } from "../showcase/catalog";
import { coreRuntimeFamilyCoverage } from "../showcase/core-family-coverage";
import { dataDisplayDocuments } from "../showcase/demos/core/data-display";

describe("Core Image de-admission", () => {
  it("keeps Image outside the canonical runtime and Showcase inventory", () => {
    expect("Image" in Core).toBe(false);
    expect("Image" in coreRuntimeFamilyCoverage).toBe(false);
    expect("image" in dataDisplayDocuments).toBe(false);

    const ids = showcaseCatalog.flatMap((group) =>
      group.items.map((item) => item.id),
    );
    expect(ids).not.toContain("core-image");
  });
});
