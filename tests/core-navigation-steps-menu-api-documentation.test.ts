import { describe, expect, it } from "vitest";
import ts from "typescript";
import { stepsMenuDocuments } from "../showcase/demos/core/steps-menu";

const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.json")!;
const parsed = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config,
  ts.sys,
  process.cwd(),
);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();

function sourceText(file: string) {
  return program.getSourceFile(`${process.cwd()}/${file}`)?.getFullText() ?? "";
}

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

describe("Core Steps/Menu API documentation", () => {
  it.each([
    ["src/core/steps.tsx", "StepsProps", stepsMenuDocuments.steps],
    ["src/core/menu.tsx", "MenuProps", stepsMenuDocuments.menu],
  ])("documents every library-defined %s property", (file, interfaceName, document) => {
    const propNames = libraryProps(file, interfaceName);
    const documentedNames = document.api?.map((row) => row.name) ?? [];

    expect(documentedNames.length).toBe(new Set(documentedNames).size);
    expect(propNames.filter((name) => !documentedNames.includes(name))).toEqual([]);
    for (const row of document.api ?? []) {
      expect(row.type).not.toMatch(/\bfunction\b|\bany\b/);
    }
  });

  it("keeps Steps behavior in source-backed examples", () => {
    expect(stepsMenuDocuments.steps.code).toContain("current={current}");
    expect(stepsMenuDocuments.steps.code).toContain("percent={65}");
    expect(stepsMenuDocuments.steps.code).toContain("onChange={setCurrent}");
    expect(stepsMenuDocuments.steps.demos?.[0].code).toContain("maxCount={4}");
    expect(stepsMenuDocuments.steps.demos?.[0].code).toContain('type="dot"');
    expect(stepsMenuDocuments.steps.demos?.[0].code).toContain('variant="outlined"');
  });

  it("keeps Menu hierarchy and state in source-backed examples", () => {
    expect(stepsMenuDocuments.menu.code).toContain("selectedKeys={selectedKeys}");
    expect(stepsMenuDocuments.menu.code).toContain("openKeys={openKeys}");
    expect(stepsMenuDocuments.menu.code).toContain('type: "submenu"');
    expect(stepsMenuDocuments.menu.code).toContain('type: "group"');
    expect(stepsMenuDocuments.menu.code).toContain('type: "divider"');
    expect(stepsMenuDocuments.menu.demos?.[0].code).toContain('mode="horizontal"');
    expect(stepsMenuDocuments.menu.demos?.[0].code).toContain("multiple");
    expect(stepsMenuDocuments.menu.demos?.[0].code).toContain("inlineCollapsed");
  });

  it("rejects pre-hardening aliases and mixed semantic dimensions", () => {
    const stepsSource = sourceText("src/core/steps.tsx");
    const menuSource = sourceText("src/core/menu.tsx");
    const menuProps = libraryProps("src/core/menu.tsx", "MenuProps");

    expect(stepsSource).not.toMatch(/\bdescription\??:/);
    expect(stepsSource).not.toContain("labelPlacement");
    expect(stepsSource).not.toContain("progressDot");
    expect(stepsSource).not.toMatch(/\bdirection\??:/);
    expect(stepsSource).not.toContain('"medium"');

    expect(menuProps).not.toContain("ariaLabel");
    expect(menuSource).not.toMatch(/\bdanger\??:/);
    expect(menuSource).not.toMatch(/\btheme\??:/);
  });
});
