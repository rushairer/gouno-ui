import { describe, expect, it } from "vitest";
import ts from "typescript";
import { dataDisplayDocuments } from "../showcase/demos/core/data-display";

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

const cases = [
  ["src/core/list.tsx", "ListProps", dataDisplayDocuments.list],
  [
    "src/core/descriptions.tsx",
    "DescriptionsProps",
    dataDisplayDocuments.descriptions,
  ],
  ["src/core/image.tsx", "ImageProps", dataDisplayDocuments.image],
] as const;

describe("Core Data Display API documentation", () => {
  for (const [file, name, document] of cases) {
    it(`${name} documents every library-defined property`, () => {
      const source = program.getSourceFile(`${process.cwd()}/${file}`)!;
      const declaration = source.statements.find(
        (node) => ts.isInterfaceDeclaration(node) && node.name.text === name,
      )!;
      const props = checker
        .getPropertiesOfType(checker.getTypeAtLocation(declaration))
        .filter((prop) =>
          prop.declarations?.some(
            (node) => !node.getSourceFile().fileName.includes("node_modules"),
          ),
        );
      const names = document.api?.map((row) => row.name) ?? [];

      expect(names.length).toBe(new Set(names).size);
      expect(
        props.map((prop) => prop.name).filter((propName) => !names.includes(propName)),
      ).toEqual([]);
      for (const row of document.api ?? []) {
        expect(row.type).not.toMatch(/\bfunction\b|\bany\b/);
      }
    });
  }

  it("keeps List, Descriptions and Image Preview/Code examples source-identical", () => {
    expect(dataDisplayDocuments.list.code).toContain('rowKey="id"');
    expect(dataDisplayDocuments.list.code).toContain("dataSource={tasks}");
    expect(dataDisplayDocuments.descriptions.code).toContain(
      "column={{ xs: 1, md: 2, xl: 3 }}",
    );
    expect(dataDisplayDocuments.descriptions.code).toContain('span: "filled"');
    expect(dataDisplayDocuments.image.code).toContain("preview={{");
    expect(dataDisplayDocuments.image.code).toContain("scaleStep: 0.5");
  });
});
