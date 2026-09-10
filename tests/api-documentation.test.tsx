import { describe, expect, it } from "vitest";
import ts from "typescript";
import { buttonDocuments } from "../showcase/demos/core/button";
import { dataEntryDocuments } from "../showcase/demos/core/data-entry";
import { formDocuments } from "../showcase/demos/core/form";
import { feedbackDocuments } from "../showcase/demos/core/feedback";
import { otherDocuments } from "../showcase/demos/core/other";
import { paginationDocument } from "../showcase/demos/core/pagination";
import { selectionControlDocuments } from "../showcase/demos/core/selection-controls";
import { tabsDocument } from "../showcase/demos/core/tabs";
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
  ["src/core/button.tsx", "ButtonProps", buttonDocuments.button],
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
  ["src/core/form.tsx", "FormProps", formDocuments.form],
  ["src/core/tag.tsx", "TagProps", tagDocuments.tag],
  ["src/core/empty.tsx", "EmptyProps", feedbackDocuments.empty],
  ["src/core/result.tsx", "ResultProps", feedbackDocuments.result],
  ["src/core/qrcode.tsx", "QRCodeProps", otherDocuments.qrcode],
  ["src/core/modal.tsx", "ModalProps", feedbackDocuments.modal],
  ["src/core/drawer.tsx", "DrawerProps", feedbackDocuments.drawer],
  ["src/core/pagination.tsx", "PaginationProps", paginationDocument],
  ["src/core/tabs.tsx", "TabsProps", tabsDocument],
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

  it("documents every public Button-family role on the canonical Button page", () => {
    const sections = new Map(
      buttonDocuments.button.apiSections?.map((section) => [
        section.title,
        section.rows,
      ]) ?? [],
    );
    expect(sections.get("ButtonLink API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["to", "href", "disabled", "loading"]),
    );
    expect(sections.get("IconButton API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["label", "icon", "...ButtonProps"]),
    );
    expect(sections.get("IconButtonLink API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["label", "icon", "...ButtonLinkProps"]),
    );
    expect(sections.get("ChoiceButton API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["selected", "...ButtonProps"]),
    );
    expect(sections.get("NavigationProvider API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["link", "children"]),
    );
  });

  it("documents the high-level and low-level Form family on one canonical page", () => {
    const sections = new Map(
      formDocuments.form.apiSections?.map((section) => [
        section.title,
        section.rows,
      ]) ?? [],
    );

    expect(sections.get("Field / FormField API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining([
        "label",
        "children",
        "hint",
        "error",
        "required",
        "hideLabel",
      ]),
    );
    expect(sections.get("FieldGroup API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["children", "...div props"]),
    );
    expect(sections.get("FieldSet API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["children", "...fieldset props"]),
    );
    expect(sections.get("FieldLegend API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["variant", "children"]),
    );
    expect(sections.get("FieldLabel API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["htmlFor", "children"]),
    );
    expect(sections.get("FormGrid API")?.map((row) => row.name)).toContain(
      "columns",
    );
    expect(sections.get("FormActions API")?.map((row) => row.name)).toContain(
      "children",
    );
    expect(sections.get("OverlayForm API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["actions", "actionClassName", "children"]),
    );

    const demoTitles = formDocuments.form.demos?.map((demo) => demo.title) ?? [];
    expect(demoTitles).toEqual(
      expect.arrayContaining([
        "Form composition helpers",
        "Low-level Field anatomy",
      ]),
    );
  });

  it("documents CheckboxGroup and keeps selection Preview/Code on executable source", () => {
    const checkbox = selectionControlDocuments.checkbox;
    const group = checkbox.apiSections?.find(
      (section) => section.title === "CheckboxGroup API",
    );

    expect(group?.rows.map((row) => row.name)).toEqual(["label", "children"]);
    expect(checkbox.code).toContain('label="已锁定选项" disabled');
    expect(checkbox.code).toContain("aria-live=\"polite\"");
    expect(
      checkbox.demos?.find((demo) => demo.title === "CheckboxGroup 组级语义")
        ?.code,
    ).toContain('name="permissions"');
    expect(selectionControlDocuments.radio.code).toContain('label="旧套餐" disabled');
    expect(selectionControlDocuments.switch.code).toContain('label="系统策略" disabled');
  });

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

  it("keeps Tabs canonical examples on activeKey/items.key rather than primitive naming", () => {
    expect(tabsDocument.code).toContain("defaultActiveKey");
    expect(tabsDocument.code).toContain('key: "overview"');
    expect(tabsDocument.code).not.toContain("defaultValue=");
    expect(tabsDocument.api?.map((row) => row.name)).toContain("tabPosition");
  });
});
