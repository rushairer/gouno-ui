import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const blogAdminRoot = resolve(
  repoRoot,
  "showcase/demos/products/blog-admin",
);

function sourceFiles(path: string): string[] {
  if (!existsSync(path)) return [];
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path).flatMap((entry) =>
    sourceFiles(resolve(path, entry)),
  );
}

function sourceFile(file: string, source: string) {
  return ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
}

function jsxTag(node: ts.Node, file: ts.SourceFile) {
  if (ts.isJsxElement(node)) return node.openingElement.tagName.getText(file);
  if (ts.isJsxSelfClosingElement(node)) return node.tagName.getText(file);
  return "";
}

function jsxAttributes(node: ts.JsxElement | ts.JsxSelfClosingElement) {
  return ts.isJsxElement(node)
    ? node.openingElement.attributes
    : node.attributes;
}

function staticAttribute(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
  name: string,
) {
  const attribute = jsxAttributes(node).properties.find(
    (item) => ts.isJsxAttribute(item) && item.name.text === name,
  );
  if (!attribute || !ts.isJsxAttribute(attribute) || !attribute.initializer)
    return "";
  if (ts.isStringLiteral(attribute.initializer)) return attribute.initializer.text;
  if (
    ts.isJsxExpression(attribute.initializer) &&
    attribute.initializer.expression &&
    (ts.isStringLiteral(attribute.initializer.expression) ||
      ts.isNoSubstitutionTemplateLiteral(attribute.initializer.expression))
  ) {
    return attribute.initializer.expression.text;
  }
  return "";
}

function containsAlert(node: ts.Node, file: ts.SourceFile) {
  let found = false;
  function visit(child: ts.Node) {
    if (found) return;
    if (jsxTag(child, file) === "Alert") {
      found = true;
      return;
    }
    ts.forEachChild(child, visit);
  }
  visit(node);
  return found;
}

function isNoticeIdentifier(node: ts.Node) {
  while (ts.isParenthesizedExpression(node)) node = node.expression;
  return ts.isIdentifier(node) && node.text === "notice";
}

const applicationFiles = sourceFiles(blogAdminRoot).filter(
  (file) =>
    /\.tsx$/.test(file) &&
    !file.endsWith("fixture-notification.tsx") &&
    !file.includes("/fixtures/"),
);

describe("Blog Admin Showcase parity contract", () => {
  it("provides canonical Notification ownership to embedded fixtures", () => {
    const main = readFileSync(resolve(repoRoot, "showcase/main.tsx"), "utf8");
    expect(main).toContain("NotificationProvider");
    expect(main).toContain("<NotificationProvider>");
  });

  it("does not render transient fixture notice state as page Alert", () => {
    for (const filePath of applicationFiles) {
      const source = readFileSync(filePath, "utf8");
      const file = sourceFile(filePath, source);
      const violations: number[] = [];

      function visit(node: ts.Node) {
        if (
          ts.isConditionalExpression(node) &&
          isNoticeIdentifier(node.condition) &&
          containsAlert(node.whenTrue, file)
        ) {
          violations.push(
            file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1,
          );
        }
        if (
          ts.isBinaryExpression(node) &&
          node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
          isNoticeIdentifier(node.left) &&
          containsAlert(node.right, file)
        ) {
          violations.push(
            file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1,
          );
        }
        ts.forEachChild(node, visit);
      }

      visit(file);
      expect(violations, `${filePath} renders notice state with Alert`).toEqual(
        [],
      );

      if (/\bsetNotice\s*\(/.test(source)) {
        expect(source).toContain("<FixtureNotification");
      }
    }
  });

  it("keeps product fixtures on canonical form and button primitives", () => {
    const violations: string[] = [];

    for (const filePath of applicationFiles) {
      const source = readFileSync(filePath, "utf8");
      const file = sourceFile(filePath, source);
      const displayPath = relative(repoRoot, filePath).replaceAll("\\", "/");

      function visit(node: ts.Node) {
        if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
          const tag = jsxTag(node, file);
          const line =
            file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
          if (["button", "select", "textarea"].includes(tag)) {
            violations.push(`${displayPath}:${line} native ${tag}`);
          }
          if (tag === "input") {
            const type = staticAttribute(node, "type") || "text";
            const classes = new Set(
              staticAttribute(node, "className").split(/\s+/),
            );
            const hiddenFileBridge =
              type === "file" &&
              (classes.has("sr-only") || classes.has("hidden"));
            if (type !== "hidden" && !hiddenFileBridge) {
              violations.push(`${displayPath}:${line} visible native input`);
            }
          }
        }
        ts.forEachChild(node, visit);
      }

      visit(file);
    }

    expect(violations).toEqual([]);
  });

  it("routes fixture notifications through canonical Notification without recreating an overlay", () => {
    const adapter = readFileSync(
      resolve(blogAdminRoot, "fixture-notification.tsx"),
      "utf8",
    );
    expect(adapter).toContain("NotificationProvider");
    expect(adapter).toContain("useNotification");
    expect(adapter).toContain("open({");
    expect(adapter).not.toMatch(/\bfixed\b/);
    expect(adapter).not.toMatch(/\bz-\d+\b/);
    expect(adapter).not.toMatch(/shadow-(?:sm|md|lg|xl|2xl)/);
  });
});
