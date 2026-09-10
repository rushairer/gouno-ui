import { describe, expect, it } from "vitest";
import * as Core from "../src/core";
import { showcaseCatalog } from "../showcase/catalog";
import { coreRuntimeFamilyCoverage } from "../showcase/core-family-coverage";
import { dataDisplayDocuments } from "../showcase/demos/core/data-display";

describe("Core Timeline de-admission", () => {
  it("keeps Timeline outside the canonical runtime and Showcase inventory", () => {
    expect("Timeline" in Core).toBe(false);
    expect("Timeline" in coreRuntimeFamilyCoverage).toBe(false);
    expect("timeline" in dataDisplayDocuments).toBe(false);

    const ids = showcaseCatalog.flatMap((group) =>
      group.items.map((item) => item.id),
    );
    expect(ids).not.toContain("core-timeline");
  });
});
