import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const layerEntries = {
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
    throw new Error(
      ts.flattenDiagnosticMessageText(parsedFile.error.messageText, "\n"),
    );
  }

  const parsed = ts.parseJsonConfigFileContent(parsedFile.config, ts.sys, root);
  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: { ...parsed.options, noEmit: true },
  });
  return { program, checker: program.getTypeChecker() };
}

function moduleExports(
  program: ts.Program,
  checker: ts.TypeChecker,
  filename: string,
) {
  const source = program.getSourceFile(filename);
  if (!source) throw new Error(`Missing source file: ${filename}`);
  const symbol = checker.getSymbolAtLocation(source);
  if (!symbol) throw new Error(`Missing module symbol: ${filename}`);
  return checker.getExportsOfModule(symbol);
}

function targetSymbol(checker: ts.TypeChecker, symbol: ts.Symbol) {
  return symbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(symbol)
    : symbol;
}

describe("public component props contract", () => {
  it("exports a named XxxProps type for every formal public JSX component", () => {
    const { program, checker } = createChecker();
    const missing: string[] = [];

    for (const [layer, filename] of Object.entries(layerEntries)) {
      const exports = moduleExports(program, checker, filename);
      const names = new Set(exports.map((symbol) => symbol.getName()));

      for (const symbol of exports) {
        const name = symbol.getName();
        if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) continue;
        const target = targetSymbol(checker, symbol);
        if (!(target.flags & ts.SymbolFlags.Value)) continue;

        const propsName = `${name}Props`;
        if (!names.has(propsName)) missing.push(`${layer}.${name} -> ${propsName}`);
      }
    }

    expect(missing.sort()).toEqual([]);
  });
});
