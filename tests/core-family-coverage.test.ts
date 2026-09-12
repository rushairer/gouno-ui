import { describe, expect, it } from "vitest";
import ts from "typescript";
import { showcaseCatalog } from "../showcase/catalog";
import { coreRuntimeFamilyCoverage } from "../showcase/catalog/core-family-coverage";

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

  it("points every runtime export at a visible Core Showcase family", () => {
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
      expect(coverage.familyId, `${name} must have a family`).not.toBeNull();
      expect(
        visibleCoreFamilies.has(coverage.familyId!),
        `${name} -> ${coverage.familyId}`,
      ).toBe(true);
    }
  });

  it("certifies reviewed sibling APIs in their canonical families", () => {
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
      "App",
      "AspectRatio",
      "Container",
      "Stack",
    ] as const) {
      expect(coreRuntimeFamilyCoverage[name].review, name).toBe("covered");
    }
  });

  it("has no runtime export waiting for family review or assignment", () => {
    const pending = Object.entries(coreRuntimeFamilyCoverage)
      .filter(([, coverage]) => coverage.review !== "covered")
      .map(([name]) => name)
      .sort();

    expect(pending).toEqual([]);
  });
});
