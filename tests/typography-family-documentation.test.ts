import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { typographyDocuments } from "../showcase/demos/core/typography";

describe("Typography family documentation", () => {
  it("owns Typography in one focused Showcase document", () => {
    const general = readFileSync(
      resolve(process.cwd(), "showcase/demos/core/general.tsx"),
      "utf8",
    );
    expect(general).not.toContain("typography:");
    expect(general).not.toContain("TypographyExample");
    expect(typographyDocuments.typography).toBeTruthy();
  });

  it("keeps every Typography Preview backed by executable raw source", () => {
    const document = typographyDocuments.typography;
    expect(document.code).toContain("<Heading level={2}>");
    expect(document.code).toContain("<Text size=\"lg\">");

    const semantics = document.demos?.find(
      (demo) => demo.title === "语义宿主与原生属性",
    );
    expect(semantics).toBeTruthy();
    expect(semantics?.code).toContain('<Heading level={1} id="page-title"');
    expect(semantics?.code).toContain('<Text as="span" size="sm" tone="muted"');
    expect(semantics?.code).toContain('<Typography as="small" data-kind="primitive"');
    expect(semantics?.render).toBeTypeOf("function");
  });

  it("documents Heading, Text and Typography including native prop forwarding", () => {
    const sections = new Map(
      typographyDocuments.typography.apiSections?.map((section) => [
        section.title,
        section.rows,
      ]) ?? [],
    );

    expect(sections.get("Heading API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining([
        "level",
        "children",
        "className",
        "...heading props",
      ]),
    );
    expect(sections.get("Text API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining([
        "as",
        "size",
        "tone",
        "children",
        "className",
        "...element props",
      ]),
    );
    expect(sections.get("Typography API")?.map((row) => row.name)).toEqual(
      expect.arrayContaining([
        "as",
        "children",
        "className",
        "...element props",
      ]),
    );
  });
});
