import { describe, expect, it } from "vitest";
import ts from "typescript";
import { dataEntryDocuments } from "../showcase/demos/core/data-entry";
import { dataDisplayDocuments } from "../showcase/demos/core/data-display";
import { feedbackDocuments } from "../showcase/demos/core/feedback";
import { paginationDocument } from "../showcase/demos/core/pagination";

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
const sections = dataDisplayDocuments["data-table"].apiSections!;
const cases = [
  [
    "src/patterns/data-table.types.ts",
    "DataTableColumn",
    {
      api: sections.find((section) => section.title === "DataTableColumn<T>")!
        .rows,
    },
  ],
  [
    "src/patterns/data-table.types.ts",
    "DataTablePagination",
    {
      api: sections.find((section) => section.title === "DataTablePagination")!
        .rows,
    },
  ],
  [
    "src/patterns/data-table.types.ts",
    "DataTableSortState",
    {
      api: sections.find((section) => section.title === "DataTableSortState")!
        .rows,
    },
  ],
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
  [
    "src/patterns/data-table.types.ts",
    "DataTableProps",
    dataDisplayDocuments["data-table"],
  ],
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
        props.map((prop) => prop.name).filter((name) => !names.includes(name)),
      ).toEqual([]);
    });
  }
});
