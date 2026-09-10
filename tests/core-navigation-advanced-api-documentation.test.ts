import { describe, expect, it } from "vitest";
import ts from "typescript";
import { advancedNavigationDocuments } from "../showcase/demos/core/navigation-advanced";

const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.json")!;
const parsed = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config,
  ts.sys,
  process.cwd(),
);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();

function libraryProps(file: string, interfaceName: string) {
  const source = program.getSourceFile(`${process.cwd()}/${file}`)!;
  const declaration = source.statements.find(
    (node) => ts.isInterfaceDeclaration(node) && node.name.text === interfaceName,
  )!;
  return checker
    .getPropertiesOfType(checker.getTypeAtLocation(declaration))
    .filter((prop) =>
      prop.declarations?.some(
        (node) => !node.getSourceFile().fileName.includes("node_modules"),
      ),
    )
    .map((prop) => prop.name);
}

describe("Core advanced Navigation API documentation", () => {
  it.each([
    ["src/core/breadcrumb.tsx", "BreadcrumbProps", advancedNavigationDocuments.breadcrumb],
    ["src/core/collapse.tsx", "CollapseProps", advancedNavigationDocuments.collapse],
  ])("documents every library-defined %s property", (file, interfaceName, document) => {
    const propNames = libraryProps(file, interfaceName);
    const documentedNames = document.api?.map((row) => row.name) ?? [];

    expect(documentedNames.length).toBe(new Set(documentedNames).size);
    expect(propNames.filter((name) => !documentedNames.includes(name))).toEqual([]);
    for (const row of document.api ?? []) {
      expect(row.type).not.toMatch(/\bfunction\b|\bany\b/);
    }
  });

  it("keeps Breadcrumb route/menu behavior in source-backed examples", () => {
    expect(advancedNavigationDocuments.breadcrumb.code).toContain("params={{ projectId");
    expect(advancedNavigationDocuments.breadcrumb.code).toContain("menu:");
    expect(advancedNavigationDocuments.breadcrumb.demos?.[0].code).toContain("itemRender=");
    expect(advancedNavigationDocuments.breadcrumb.demos?.[0].code).toContain('type: "separator"');
  });

  it("keeps Collapse state and lifecycle behavior in source-backed examples", () => {
    expect(advancedNavigationDocuments.collapse.code).toContain("activeKey={activeKey}");
    expect(advancedNavigationDocuments.collapse.code).toContain("accordion");
    expect(advancedNavigationDocuments.collapse.demos?.[0].code).toContain("destroyOnHidden");
    expect(advancedNavigationDocuments.collapse.demos?.[0].code).toContain('collapsible: "icon"');
    expect(advancedNavigationDocuments.collapse.demos?.[0].code).toContain("forceRender: true");
  });
});
