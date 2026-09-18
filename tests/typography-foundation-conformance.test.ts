import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const productsRoot = resolve(root, "showcase/demos/products");
const bannedVisualUtility =
  /\b(?:text-(?:xs|sm|base|lg|xl|[2-9]xl|\[[^\]]+\])|font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)|tracking-[^\s"'\x60]+|leading-[^\s"'\x60]+)/;

function collectTsx(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTsx(path);
    return entry.isFile() && path.endsWith(".tsx") ? [path] : [];
  });
}

function openingTags(source: string, component: "Heading" | "CardTitle" | "Text") {
  const expression = new RegExp(`<${component}\\b[\\s\\S]{0,500}?>`, "g");
  return source.match(expression) ?? [];
}

describe("Typography Foundation conformance", () => {
  it("keeps product heading semantics on Core Heading rather than raw h1-h6", () => {
    const offenders = collectTsx(productsRoot)
      .map((path) => ({
        path,
        count: (readFileSync(path, "utf8").match(/<h[1-6]\b/g) ?? []).length,
      }))
      .filter((entry) => entry.count > 0);

    expect(offenders).toEqual([]);
  });

  it("keeps product Heading and CardTitle visual scale under semantic role ownership", () => {
    const offenders = collectTsx(productsRoot).flatMap((path) => {
      const source = readFileSync(path, "utf8");
      return [
        ...openingTags(source, "Heading").map((tag) => ({ path, component: "Heading", tag })),
        ...openingTags(source, "CardTitle").map((tag) => ({ path, component: "CardTitle", tag })),
      ].filter((entry) => bannedVisualUtility.test(entry.tag));
    });

    expect(offenders).toEqual([]);
  });

  it("keeps product Text metrics under semantic Text props", () => {
    const offenders = collectTsx(productsRoot).flatMap((path) => {
      const source = readFileSync(path, "utf8");
      return openingTags(source, "Text")
        .map((tag) => ({ path, component: "Text", tag }))
        .filter((entry) => bannedVisualUtility.test(entry.tag));
    });

    expect(offenders).toEqual([]);
  });

  it("binds admitted page/editor compositions to explicit typography roles", () => {
    const pageHeader = readFileSync(resolve(root, "src/gouno/page-header.tsx"), "utf8");
    const dedicatedEditor = readFileSync(
      resolve(root, "showcase/components/patterns/dedicated-editor.tsx"),
      "utf8",
    );

    expect(pageHeader).toContain('<Heading level={1} variant="page">');
    expect(pageHeader).not.toMatch(/<Heading[^>]*className="[^"]*text-/);

    expect(dedicatedEditor).toContain("headingLevel = 2");
    expect(dedicatedEditor).toContain('<Heading level={headingLevel} variant="task">');
    expect(dedicatedEditor).not.toMatch(
      /<Heading[^>]*className="[^"]*(?:text-(?:xs|sm|base|lg|xl|[2-9]xl)|font-(?:medium|semibold|bold)|tracking-|leading-)/,
    );
  });

  it("keeps semantic typography scale owned by tokens and Core", () => {
    const tokens = readFileSync(resolve(root, "src/tokens.css"), "utf8");
    const typography = readFileSync(resolve(root, "src/core/typography.tsx"), "utf8");

    for (const token of [
      "--type-display-title-size",
      "--type-page-title-size",
      "--type-task-title-size",
      "--type-section-title-size",
      "--type-subsection-title-size",
      "--type-compact-title-size",
      "--type-label-title-size",
      "--type-body-size",
      "--type-body-sm-size",
      "--type-caption-size",
      "--type-title-weight",
      "--type-title-tracking",
    ]) {
      expect(tokens).toContain(token);
    }

    expect(typography).toContain("export type HeadingVariant");
    expect(typography).toContain("data-typography-role={resolvedVariant}");
    expect(typography).toContain('page: "type-page-title"');
    expect(typography).toContain('task: "type-task-title"');
    expect(tokens).toContain(".type-page-title {");
    expect(tokens).toContain(".type-body-sm {");
  });
});
