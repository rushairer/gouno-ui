import { describe, expect, it } from "vitest";
import ts from "typescript";
import { advancedDataDisplayDocuments } from "../showcase/demos/core/data-display-advanced";

const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.json")!;
const parsed = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config,
  ts.sys,
  process.cwd(),
);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();

const cases = [
  ["src/core/timeline.tsx", "TimelineProps", advancedDataDisplayDocuments.timeline],
  ["src/core/calendar.tsx", "CalendarProps", advancedDataDisplayDocuments.calendar],
  ["src/core/carousel.tsx", "CarouselProps", advancedDataDisplayDocuments.carousel],
] as const;

describe("advanced Core Data Display API documentation", () => {
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

  it("keeps mature features visible in complete source-backed examples", () => {
    expect(advancedDataDisplayDocuments.timeline.code).toContain("items={[");
    expect(advancedDataDisplayDocuments.timeline.demos?.[0].code).toContain(
      'orientation="horizontal"',
    );
    expect(advancedDataDisplayDocuments.calendar.code).toContain("showWeek");
    expect(advancedDataDisplayDocuments.calendar.demos?.[0].code).toContain(
      'defaultMode="year"',
    );
    expect(advancedDataDisplayDocuments.carousel.code).toContain("draggable");
    expect(advancedDataDisplayDocuments.carousel.demos?.[0].code).toContain(
      'effect="fade"',
    );
  });
});
