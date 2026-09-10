import { describe, expect, it } from "vitest";
import ts from "typescript";
import { tabsDocument } from "../showcase/demos/core/tabs";

const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.json")!;
const parsed = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config,
  ts.sys,
  process.cwd(),
);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();
const source = program.getSourceFile(`${process.cwd()}/src/core/tabs.tsx`)!;

function interfacePropertyNames(name: string) {
  const declaration = source.statements.find(
    (node): node is ts.InterfaceDeclaration =>
      ts.isInterfaceDeclaration(node) && node.name.text === name,
  )!;
  return checker
    .getPropertiesOfType(checker.getTypeAtLocation(declaration))
    .map((property) => property.name);
}

describe("Tabs canonical sealing", () => {
  it("removes pre-reset high-level state aliases from TabsProps", () => {
    const names = interfacePropertyNames("TabsProps");
    expect(names).toEqual(expect.arrayContaining([
      "activeKey",
      "defaultActiveKey",
      "items",
      "onChange",
    ]));
    expect(names).not.toContain("value");
    expect(names).not.toContain("defaultValue");
    expect(names).not.toContain("onValueChange");
  });

  it("requires stable high-level item keys instead of items[].value", () => {
    const names = interfacePropertyNames("TabItem");
    expect(names).toContain("key");
    expect(names).not.toContain("value");
  });

  it("keeps only the explicitly deprecated accessibility alias for product migration", () => {
    const text = source.getFullText();
    expect(text).not.toContain("LegacyTabItem");
    expect(text).not.toContain("legacyValue");
    expect(text).not.toContain("legacyDefaultValue");
    expect(text).toContain("@deprecated Use the standard `aria-label` attribute");
    expect(text).toContain("ariaLabel?: string");
    expect(text).toContain("ariaLabel ?? legacyAriaLabel");
  });

  it("shows only canonical state and standard ARIA in executable Core examples", () => {
    const examples = [
      tabsDocument.code,
      ...(tabsDocument.demos?.map((demo) => demo.code) ?? []),
    ];
    const highLevelExamples = examples.filter((code) => code.includes("<Tabs"));

    expect(highLevelExamples.length).toBeGreaterThan(0);
    for (const code of highLevelExamples) {
      expect(code).not.toContain("ariaLabel=");
      expect(code).not.toContain("defaultValue=");
      expect(code).not.toContain(" value=");
    }
    expect(tabsDocument.code).toContain('aria-label="工作区栏目"');
    expect(tabsDocument.api?.map((row) => row.name)).toEqual(
      expect.arrayContaining([
        "activeKey",
        "defaultActiveKey",
        "items",
        "onChange",
        "aria-label / aria-labelledby",
        "ariaLabel",
      ]),
    );
  });
});
