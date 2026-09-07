import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const sourceRoot = resolve(process.cwd(), "src");
const layers = [
  { name: "core", rank: 1, root: resolve(sourceRoot, "core") },
  { name: "theme", rank: 2, root: resolve(sourceRoot, "theme") },
  { name: "patterns", rank: 3, root: resolve(sourceRoot, "patterns") },
  { name: "gouno", rank: 4, root: resolve(sourceRoot, "gouno") },
] as const;

function sourceFiles(directory: string): string[] {
  const files: string[] = [];
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

function layerFor(path: string) {
  return layers.find(
    (layer) => path === layer.root || path.startsWith(`${layer.root}/`),
  );
}

function moduleSpecifiers(file: string): string[] {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const specifiers: string[] = [];

  const visit = (node: ts.Node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return specifiers;
}

describe("source dependency graph", () => {
  it("allows dependencies only toward the same or a lower architectural layer", () => {
    const violations: string[] = [];

    for (const sourceLayer of layers) {
      for (const file of sourceFiles(sourceLayer.root)) {
        for (const specifier of moduleSpecifiers(file)) {
          if (!specifier.startsWith(".")) continue;
          const target = resolve(dirname(file), specifier);
          const targetLayer = layerFor(target);
          if (!targetLayer || targetLayer.rank <= sourceLayer.rank) continue;
          violations.push(
            `${relative(sourceRoot, file)} -> ${specifier} (${sourceLayer.name} -> ${targetLayer.name})`,
          );
        }
      }
    }

    expect(violations.sort()).toEqual([]);
  });

  it("keeps implementation modules from depending on the root compatibility umbrella", () => {
    const violations: string[] = [];
    const rootEntry = resolve(sourceRoot, "index");

    for (const layer of layers) {
      for (const file of sourceFiles(layer.root)) {
        for (const specifier of moduleSpecifiers(file)) {
          if (!specifier.startsWith(".")) continue;
          const target = resolve(dirname(file), specifier).replace(/\.(tsx?|jsx?)$/, "");
          if (target === rootEntry) {
            violations.push(`${relative(sourceRoot, file)} -> ${specifier}`);
          }
        }
      }
    }

    expect(violations.sort()).toEqual([]);
  });

  it("keeps implementation modules on direct imports instead of formal layer barrels", () => {
    const violations: string[] = [];

    for (const layer of layers) {
      for (const file of sourceFiles(layer.root)) {
        if (file === resolve(layer.root, "index.ts")) continue;
        for (const specifier of moduleSpecifiers(file)) {
          if (!specifier.startsWith(".")) continue;
          const target = resolve(dirname(file), specifier);
          const targetLayer = layers.find(({ root }) => target === root);
          if (targetLayer) {
            violations.push(
              `${relative(sourceRoot, file)} -> ${specifier} (${targetLayer.name} barrel)`,
            );
          }
        }
      }
    }

    expect(violations.sort()).toEqual([]);
  });
});
