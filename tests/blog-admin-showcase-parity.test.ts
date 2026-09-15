import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
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
