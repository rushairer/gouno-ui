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

function hasJsxAttribute(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
  name: string,
) {
  return jsxAttributes(node).properties.some(
    (item) => ts.isJsxAttribute(item) && item.name.text === name,
  );
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

  it("keeps every Blog Admin inline AI suggestion surface retryable", () => {
    const violations: string[] = [];

    for (const filePath of applicationFiles) {
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
            const line =
              file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
            violations.push(`${displayPath}:${line} ${tag} missing onRegenerate`);
          }
        }
        ts.forEachChild(node, visit);
      }

      visit(file);
    }

    expect(violations).toEqual([]);
  });

  it("uses the canonical AI suggestion picker for category Slug candidates", () => {
    const categories = readFileSync(
      resolve(blogAdminRoot, "categories.tsx"),
      "utf8",
    );

    expect(categories).toContain("<AISuggestionPicker");
    expect(categories).toContain('aria-label="Slug AI 建议"');
    expect(categories).toContain('groupLabel="Slug 候选"');
    expect(categories).toContain("onRegenerate={regenerateSlug}");
    expect(categories).toContain('applyLabel="使用所选 Slug"');
    expect(categories).not.toContain('aria-label="Slug 候选">');
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

  it("uses one product-local privileged-access grammar across Members, Site Settings and AI Settings", () => {
    const gate = readFileSync(
      resolve(blogAdminRoot, "privileged-access-gate.tsx"),
      "utf8",
    );
    const users = readFileSync(resolve(blogAdminRoot, "users.tsx"), "utf8");
    const settings = readFileSync(
      resolve(blogAdminRoot, "site-settings.tsx"),
      "utf8",
    );
    const ai = readFileSync(
      resolve(blogAdminRoot, "ai/settings/index.tsx"),
      "utf8",
    );
    const aiSections = readFileSync(
      resolve(blogAdminRoot, "ai/settings/sections.tsx"),
      "utf8",
    );

    expect(gate).toContain('data-slot="blog-privileged-access-gate"');
    expect(gate).toContain("高权限操作需要身份验证");
    expect(gate).toContain("高权限操作已解锁");
    expect(gate).toContain("重新锁定");
    expect(users).toContain("<PrivilegedAccessGate");
    expect(settings).toContain("<PrivilegedAccessGate");
    expect(ai).toContain("<PrivilegedAccessGate");
    expect(users).not.toContain("Sudo 已解锁");
    expect(settings).not.toContain("Sudo 已解锁");
    expect(aiSections).not.toContain("敏感配置需要近期 MFA");
    expect(aiSections).not.toContain('title="模型连接与密钥保护"');
  });
});
