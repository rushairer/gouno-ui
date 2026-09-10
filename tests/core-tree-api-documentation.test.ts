import { describe, expect, it } from "vitest";
import ts from "typescript";
import { treeDocuments } from "../showcase/demos/core/tree-document";

const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.json")!;
const parsed = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config,
  ts.sys,
  process.cwd(),
);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();

describe("Core Tree API documentation", () => {
  it("documents every library-defined TreeProps property", () => {
    const source = program.getSourceFile(`${process.cwd()}/src/core/tree.tsx`)!;
    const declaration = source.statements.find(
      (node) => ts.isInterfaceDeclaration(node) && node.name.text === "TreeProps",
    )!;
    const props = checker
      .getPropertiesOfType(checker.getTypeAtLocation(declaration))
      .filter((prop) =>
        prop.declarations?.some(
          (node) => !node.getSourceFile().fileName.includes("node_modules"),
        ),
      );
    const names = treeDocuments.tree.api?.map((row) => row.name) ?? [];

    expect(names.length).toBe(new Set(names).size);
    expect(
      props.map((prop) => prop.name).filter((propName) => !names.includes(propName)),
    ).toEqual([]);
    for (const row of treeDocuments.tree.api ?? []) {
      expect(row.type).not.toMatch(/\bfunction\b|\bany\b/);
    }
  });

  it("keeps controlled checking and asynchronous loading visible in source-backed demos", () => {
    expect(treeDocuments.tree.code).toContain("treeData={treeData}");
    expect(treeDocuments.tree.code).toContain("selectedKeys={selectedKeys}");
    expect(treeDocuments.tree.code).toContain("checkedKeys={checkedKeys}");
    expect(treeDocuments.tree.code).toContain("checkable");
    expect(treeDocuments.tree.demos?.[0].code).toContain("loadData={async");
    expect(treeDocuments.tree.demos?.[0].code).toContain("isLeaf: false");
  });
});
