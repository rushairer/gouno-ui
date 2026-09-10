import { describe, expect, it } from "vitest";
import ts from "typescript";
import { showcaseCatalog } from "../showcase/catalog";
import { coreRuntimeFamilyCoverage } from "../showcase/core-family-coverage";

const configPath = ts.findConfigFile(
  process.cwd(),
  ts.sys.fileExists,
  "tsconfig.json",
)!;
const parsed = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config,
  ts.sys,
  process.cwd(),
);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();

function runtimePascalCaseExports() {
  const source = program.getSourceFile(`${process.cwd()}/src/core/index.ts`)!;
  const moduleSymbol = checker.getSymbolAtLocation(source)!;
  return checker
    .getExportsOfModule(moduleSymbol)
    .filter((symbol) => /^[A-Z]/.test(symbol.name))
    .filter((symbol) => {
      const target =
        symbol.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(symbol)
          : symbol;
      return Boolean(target.flags & ts.SymbolFlags.Value);
    })
    .map((symbol) => symbol.name)
    .sort();
}

describe("Core runtime Showcase family coverage", () => {
  it("inventories every PascalCase runtime export from the canonical Core entry", () => {
    expect(Object.keys(coreRuntimeFamilyCoverage).sort()).toEqual(
      runtimePascalCaseExports(),
    );
  });

  it("points every assigned runtime export at a visible Core Showcase family", () => {
    const visibleCoreFamilies = new Set(
      showcaseCatalog
        .filter(
          (group) =>
            group.workspace === "gouno-ui" && group.layer === "core",
        )
        .flatMap((group) => group.items)
        .map((item) => item.id),
    );

    for (const [name, coverage] of Object.entries(coreRuntimeFamilyCoverage)) {
      if (coverage.familyId === null) continue;
      expect(
        visibleCoreFamilies.has(coverage.familyId),
        `${name} -> ${coverage.familyId}`,
      ).toBe(true);
    }
  });

  it("certifies product-proven Form and selection siblings in their canonical families", () => {
    for (const name of [
      "Field",
      "FormField",
      "FieldGroup",
      "FieldSet",
      "FieldLegend",
      "FieldLabel",
      "FormLayout",
      "FormGrid",
      "FormActions",
      "OverlayForm",
      "CheckboxGroup",
      "CheckboxField",
      "SearchField",
      "AvatarImage",
      "AvatarFallback",
      "Divider",
    ] as const) {
      expect(coreRuntimeFamilyCoverage[name].review, name).toBe("covered");
    }
  });

  it("has no assigned runtime export still waiting for family review", () => {
    const needsReview = Object.entries(coreRuntimeFamilyCoverage)
      .filter(([, coverage]) => coverage.review === "needs-review")
      .map(([name]) => name)
      .sort();

    expect(needsReview).toEqual([]);
  });

  it("keeps currently unassigned public runtime APIs explicit instead of hiding them", () => {
    const unassigned = Object.entries(coreRuntimeFamilyCoverage)
      .filter(([, coverage]) => coverage.review === "unassigned")
      .map(([name]) => name)
      .sort();

    expect(unassigned).toEqual(["App", "AspectRatio", "Container", "Stack"]);
  });

  it("requires every unassigned export to explain why it remains public", () => {
    for (const [name, coverage] of Object.entries(coreRuntimeFamilyCoverage)) {
      if (coverage.review !== "unassigned") continue;
      expect(coverage.familyId, name).toBeNull();
      expect(coverage.note?.trim(), name).toBeTruthy();
    }
  });
});
