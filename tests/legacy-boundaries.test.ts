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

describe("source boundaries", () => {
  it("does not keep a Legacy source tree", () => {
    expect(existsSync(resolve(sourceRoot, "legacy"))).toBe(false);
  });

  it("does not publish a Legacy package path", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(root, "package.json"), "utf8"),
    ) as { exports: Record<string, unknown> };
    expect(Object.keys(packageJson.exports).some((key) => key.startsWith("./legacy"))).toBe(false);
  });

  it("keeps canonical layers and Showcase free of Legacy imports", () => {
    const violations: string[] = [];
    for (const protectedRoot of protectedRoots) {
      for (const file of sourceFiles(protectedRoot)) {
        for (const specifier of moduleSpecifiers(file)) {
          if (/(^|\/)legacy(?:\/|$)/i.test(specifier)) {
            violations.push(`${relative(root, file)} -> ${specifier}`);
          }
        }
      }
    }
    expect(violations.sort()).toEqual([]);
  });

  it("does not carry obsolete Legacy TypeScript exclusions", () => {
    for (const filename of ["tsconfig.json", "tsconfig.build.json"]) {
      const config = JSON.parse(readFileSync(resolve(root, filename), "utf8")) as {
        exclude?: string[];
      };
      expect(config.exclude ?? []).not.toContain("src/legacy/**/*");
    }

    const showcaseConfig = JSON.parse(
      readFileSync(resolve(root, "showcase/tsconfig.json"), "utf8"),
    ) as { exclude?: string[] };
    expect(showcaseConfig.exclude ?? []).not.toContain("../src/legacy/**/*");
  });
});
