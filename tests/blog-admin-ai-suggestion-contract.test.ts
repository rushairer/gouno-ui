import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const blogAdminRoot = resolve(repoRoot, "showcase/demos/products/blog-admin");

function sourceFiles(path: string): string[] {
  if (!existsSync(path)) return [];
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path).flatMap((entry) => sourceFiles(resolve(path, entry)));
}

function sourceFile(file: string, source: string) {
  return ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function jsxTag(node: ts.Node, file: ts.SourceFile) {
  if (ts.isJsxElement(node)) return node.openingElement.tagName.getText(file);
  if (ts.isJsxSelfClosingElement(node)) return node.tagName.getText(file);
  return "";
}

function jsxAttributes(node: ts.JsxElement | ts.JsxSelfClosingElement) {
  return ts.isJsxElement(node) ? node.openingElement.attributes : node.attributes;
}

function hasJsxAttribute(node: ts.JsxElement | ts.JsxSelfClosingElement, name: string) {
  return jsxAttributes(node).properties.some(
    (item) => ts.isJsxAttribute(item) && item.name.text === name,
  );
}

describe("Blog Admin AI suggestion contract", () => {
  it("keeps every inline AISuggestion surface retryable", () => {
    const violations: string[] = [];
    const files = sourceFiles(blogAdminRoot).filter((file) => file.endsWith(".tsx"));

    for (const filePath of files) {
      const source = readFileSync(filePath, "utf8");
      const file = sourceFile(filePath, source);
      const displayPath = relative(repoRoot, filePath).replaceAll("\\", "/");

      function visit(node: ts.Node) {
        if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
          const tag = jsxTag(node, file);
          if (
            ["AISuggestionPicker", "AISuggestionReview"].includes(tag) &&
            !hasJsxAttribute(node, "onRegenerate")
          ) {
            const line = file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
            violations.push(`${displayPath}:${line} ${tag} missing onRegenerate`);
          }
        }
        ts.forEachChild(node, visit);
      }

      visit(file);
    }

    expect(violations).toEqual([]);
  });

  it("uses the canonical picker for category Slug candidates", () => {
    const source = readFileSync(resolve(blogAdminRoot, "categories.tsx"), "utf8");

    expect(source).toContain("<AISuggestionPicker");
    expect(source).toContain('aria-label="Slug AI 建议"');
    expect(source).toContain('groupLabel="Slug 候选"');
    expect(source).toContain("onRegenerate={regenerateSlug}");
    expect(source).toContain('applyLabel="使用所选 Slug"');
    expect(source).not.toContain('aria-label="Slug 候选">');
  });
});
