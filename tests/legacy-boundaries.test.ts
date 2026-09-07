import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const sourceRoot = resolve(root, "src");
const protectedRoots = [
  resolve(sourceRoot, "core"),
  resolve(sourceRoot, "theme"),
  resolve(sourceRoot, "patterns"),
  resolve(sourceRoot, "gouno"),
  resolve(root, "showcase"),
];

function sourceFiles(directory: string): string[] {
  const files: string[] = [];
  if (!existsSync(directory)) return files;
  const visit = (path: string) => {
    for (const entry of readdirSync(path)) {
      const child = resolve(path, entry);
      if (statSync(child).isDirectory()) visit(child);
      else if (/\.(tsx?|jsx?)$/.test(entry)) files.push(child);
    }
  };
  visit(directory);
  return files;
}

function moduleSpecifiers(file: string): string[] {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const specifiers: string[] = [];
  const visit = (node: ts.Node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return specifiers;
}

describe("Legacy quarantine", () => {
  it("excludes Legacy from both source build configurations", () => {
    for (const filename of ["tsconfig.json", "tsconfig.build.json"]) {
      const config = JSON.parse(readFileSync(resolve(root, filename), "utf8")) as {
        exclude?: string[];
      };
      expect(config.exclude).toContain("src/legacy/**/*");
    }
  });

  it("does not publish a Legacy package path", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(root, "package.json"), "utf8"),
    ) as { exports: Record<string, unknown> };
    expect(Object.keys(packageJson.exports).some((key) => key.startsWith("./legacy"))).toBe(false);
  });

  it("keeps canonical layers and Showcase from importing quarantined source", () => {
    const violations: string[] = [];
    for (const protectedRoot of protectedRoots) {
      for (const file of sourceFiles(protectedRoot)) {
        for (const specifier of moduleSpecifiers(file)) {
          if (specifier.includes("legacy")) {
            violations.push(`${relative(root, file)} -> ${specifier}`);
          }
        }
      }
    }
    expect(violations.sort()).toEqual([]);
  });

  it("keeps the quarantine documented and non-canonical", () => {
    const readme = readFileSync(resolve(sourceRoot, "legacy/README.md"), "utf8");
    expect(readme).toContain("not a fifth architectural layer");
    expect(readme).toContain("no package export path");
  });
});
