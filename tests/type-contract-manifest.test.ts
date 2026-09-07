import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const manifestPath = resolve(root, "src/core/public-props.ts");

function createProgram() {
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
  return ts.createProgram({
    rootNames: parsed.fileNames,
    options: { ...parsed.options, noEmit: true },
  });
}

describe("Core public Props type manifest", () => {
  it("contains only type-only imports and exported type aliases", () => {
    const source = ts.createSourceFile(
      manifestPath,
      readFileSync(manifestPath, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );

    for (const statement of source.statements) {
      if (ts.isImportDeclaration(statement)) {
        expect(statement.importClause?.isTypeOnly).toBe(true);
        continue;
      }

      expect(ts.isTypeAliasDeclaration(statement)).toBe(true);
      if (ts.isTypeAliasDeclaration(statement)) {
        expect(
          statement.modifiers?.some(
            (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
          ),
        ).toBe(true);
      }
    }
  });

  it("exports zero runtime values", () => {
    const program = createProgram();
    const checker = program.getTypeChecker();
    const source = program.getSourceFile(manifestPath);
    if (!source) throw new Error(`Missing source file: ${manifestPath}`);
    const moduleSymbol = checker.getSymbolAtLocation(source);
    if (!moduleSymbol) throw new Error("Missing public-props module symbol");

    const runtimeExports = checker
      .getExportsOfModule(moduleSymbol)
      .filter((symbol) => {
        const target =
          symbol.flags & ts.SymbolFlags.Alias
            ? checker.getAliasedSymbol(symbol)
            : symbol;
        return Boolean(target.flags & ts.SymbolFlags.Value);
      })
      .map((symbol) => symbol.getName())
      .sort();

    expect(runtimeExports).toEqual([]);
  });
});
