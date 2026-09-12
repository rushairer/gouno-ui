import { describe, expect, it } from "vitest";
import { coreRuntimeFamilyCoverage } from "../showcase/catalog/core-family-coverage";
import { tabsDocument } from "../showcase/demos/core/tabs";

describe("Tabs family documentation", () => {
  it("documents the primitive composition family alongside high-level Tabs", () => {
    const primitiveDemo = tabsDocument.demos?.find(
      (demo) => demo.title === "Primitive composition",
    );
    expect(primitiveDemo).toBeTruthy();
    expect(primitiveDemo?.code).toContain("TabList");
    expect(primitiveDemo?.code).toContain('value="overview"');
    expect(primitiveDemo?.code).toContain("TabPanel");

    const sections = new Map(
      tabsDocument.apiSections?.map((section) => [
        section.title,
        section.rows,
      ]) ?? [],
    );
    expect(sections.get("TabList API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining([
        "type",
        "size",
        "tabPosition",
        "centered",
        "extra",
        "...TabsList props",
      ]),
    );
    expect(sections.get("Tab API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining([
        "value",
        "disabled",
        "size",
        "tabPosition",
        "...TabsTrigger props",
      ]),
    );
    expect(sections.get("TabPanel API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["value", "children", "...TabsContent props"]),
    );
  });

  it("certifies TabList, Tab and TabPanel in the visible Tabs family", () => {
    for (const name of ["TabList", "Tab", "TabPanel"] as const) {
      expect(coreRuntimeFamilyCoverage[name]).toEqual({
        familyId: "core-tabs",
        review: "covered",
      });
    }
  });
});
