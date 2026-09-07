import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const showcaseRoot = resolve(root, "showcase");
const sourceRoot = resolve(root, "src");
const sourceIndex = resolve(sourceRoot, "index");

function showcaseSourceFiles(): string[] {
  const files: string[] = [];
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory)) {
      const path = resolve(directory, entry);
      if (statSync(path).isDirectory()) visit(path);
      else if (/\.(tsx?|jsx?)$/.test(entry)) files.push(path);
    }
  };
  visit(showcaseRoot);
  return files;
}

function resolvesToRootUmbrella(filename: string, specifier: string) {
  if (specifier === "@gouno/ui") return true;
  if (!specifier.startsWith(".")) return false;

  const clean = specifier.split(/[?#]/, 1)[0];
  const target = resolve(dirname(filename), clean);
  const targetWithoutExtension = target.replace(/\.(tsx?|jsx?)$/, "");
  return target === sourceRoot || targetWithoutExtension === sourceIndex;
}

function rootUmbrellaImports(filename: string): string[] {
  const source = ts.createSourceFile(
    filename,
    readFileSync(filename, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    filename.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const violations: string[] = [];

  const record = (node: ts.Node, specifier: ts.Expression | undefined) => {
    if (!specifier || !ts.isStringLiteralLike(specifier)) return;
    if (!resolvesToRootUmbrella(filename, specifier.text)) return;
    const position = source.getLineAndCharacterOfPosition(node.getStart(source));
    violations.push(
      `${relative(root, filename)}:${position.line + 1} -> ${specifier.text}`,
    );
  };

  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      record(node, node.moduleSpecifier);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword
    ) {
      record(node, node.arguments[0]);
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return violations;
}

describe("Showcase public API consumption", () => {
  it("imports runtime APIs from canonical formal layers instead of the root umbrella", () => {
    const violations = showcaseSourceFiles().flatMap(rootUmbrellaImports).sort();
    expect(violations).toEqual([]);
  });
});
