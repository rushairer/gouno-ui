import { describe, expect, it } from "vitest";
import ts from "typescript";
import { dataEntryDocuments } from "../showcase/demos/core/data-entry";
import { feedbackDocuments } from "../showcase/demos/core/feedback";
import { paginationDocument } from "../showcase/demos/core/pagination";
import { tagDocuments } from "../showcase/demos/core/tag";
import { badgeDocuments } from "../showcase/demos/core/badge";

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
  ["src/core/input.tsx", "InputProps", dataEntryDocuments.input],
  ["src/core/textarea.tsx", "TextareaProps", dataEntryDocuments.textarea],
  ["src/core/select.tsx", "SelectProps", dataEntryDocuments.select],
  [
    "src/core/input-number.tsx",
    "InputNumberProps",
    dataEntryDocuments["input-number"],
  ],
  [
    "src/core/date-picker.tsx",
    "DatePickerProps",
    dataEntryDocuments["date-picker"],
  ],
  ["src/core/upload.tsx", "UploadProps", dataEntryDocuments.upload],
  ["src/core/form.tsx", "FormProps", dataEntryDocuments.form],
  ["src/core/modal.tsx", "ModalProps", feedbackDocuments.modal],
  ["src/core/drawer.tsx", "DrawerProps", feedbackDocuments.drawer],
  ["src/core/pagination.tsx", "PaginationProps", paginationDocument],
] as const;

describe("public API documentation", () => {
  for (const [file, name, document] of cases) {
    it(`${name} documents every library-defined property including inherited properties`, () => {
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
      for (const row of document.api ?? []) {
        expect(
          row.type,
          `${name}.${row.name} must document its signature`,
        ).not.toMatch(/\bfunction\b|\bany\b/);
      }
      expect(names.length).toBe(new Set(names).size);
      expect(
        props.map((prop) => prop.name).filter((propName) => !names.includes(propName)),
      ).toEqual([]);
    });
  }

  it("keeps the Select multi-tag Preview and Code example sourced from the same capability", () => {
    const demo = dataEntryDocuments.select.demos?.find(
      (item) => item.title === "多选 Tags 与搜索",
    );
    expect(demo).toBeTruthy();
    expect(demo?.code).toContain('mode="multiple"');
    expect(demo?.code).toContain("maxTagCount");
    expect(demo?.code).toContain("setValues");
    expect(demo?.render).toBeTypeOf("function");
  });

  it("keeps the non-controlled CheckableTag demo content-sized in vertical Space", () => {
    const demo = tagDocuments.tag.demos?.find(
      (item) => item.title === "非受控可选标签",
    );
    expect(demo?.code).toContain('orientation="vertical" align="start"');
  });

  it("keeps Badge API and its executable source example aligned", () => {
    const demo = badgeDocuments.badge;
    expect(demo.code).toContain("overflowCount");
    expect(demo.code).toContain('status="success"');
    expect(demo.code).toContain("setCount");
    expect(demo.api?.map((row) => row.name)).toContain("title");
  });
});
