import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const entries = {
  core: resolve(root, "src/core/index.ts"),
  patterns: resolve(root, "src/patterns/index.ts"),
  gouno: resolve(root, "src/gouno/index.ts"),
  theme: resolve(root, "src/theme/index.ts"),
} as const;

function createChecker() {
  const configPath = resolve(root, "tsconfig.build.json");
  const parsedFile = ts.parseConfigFileTextToJson(
    configPath,
    readFileSync(configPath, "utf8"),
  );
  if (parsedFile.error) {
    throw new Error(ts.flattenDiagnosticMessageText(parsedFile.error.messageText, "\n"));
  }

  const parsed = ts.parseJsonConfigFileContent(parsedFile.config, ts.sys, root);
  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: { ...parsed.options, noEmit: true },
  });
  return { program, checker: program.getTypeChecker() };
}

function exportedNames(
  program: ts.Program,
  checker: ts.TypeChecker,
  filename: string,
): string[] {
  const source = program.getSourceFile(filename);
  if (!source) throw new Error(`Missing source file: ${filename}`);
  const symbol = checker.getSymbolAtLocation(source);
  if (!symbol) throw new Error(`Missing module symbol: ${filename}`);
  return checker
    .getExportsOfModule(symbol)
    .map((item) => item.getName())
    .filter((name) => name !== "default")
    .sort();
}

describe("formal public API ownership", () => {
  it("assigns every public symbol, including type-only symbols, to one layer", () => {
    const { program, checker } = createChecker();
    const owners = new Map<string, string[]>();

    for (const [layer, filename] of Object.entries(entries)) {
      for (const name of exportedNames(program, checker, filename)) {
        const current = owners.get(name) ?? [];
        current.push(layer);
        owners.set(name, current);
      }
    }

    const duplicates = [...owners.entries()]
      .filter(([, layers]) => layers.length > 1)
      .map(([name, layers]) => `${name}: ${layers.join(", ")}`)
      .sort();

    expect(duplicates).toEqual([]);
  });
});
