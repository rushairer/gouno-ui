import { describe, expect, it } from "vitest";
import ts from "typescript";
import {
  appShellApi,
  navigationGroupApi,
  navigationHelperApi,
  pageContainerApi,
} from "../showcase/demos/gouno/components";
import { pageHeaderApi } from "../showcase/demos/gouno/page-header";

const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.json")!;
const parsed = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config,
  ts.sys,
  process.cwd(),
);
const program = ts.createProgram(parsed.fileNames, parsed.options);

function interfacePropertyNames(file: string, name: string) {
  const source = program.getSourceFile(`${process.cwd()}/${file}`)!;
  const declaration = source.statements.find(
    (node) => ts.isInterfaceDeclaration(node) && node.name.text === name,
  );
  if (!declaration || !ts.isInterfaceDeclaration(declaration)) return [];
  return declaration.members
    .filter(ts.isPropertySignature)
    .map((member) =>
      ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)
        ? member.name.text
        : member.name.getText(source),
    )
    .sort();
}

describe("Gouno public API documentation", () => {
  it("keeps AppShellProps and the AppShell API table in exact sync", () => {
    expect(appShellApi.map((row) => row.name).sort()).toEqual(
      interfacePropertyNames("src/gouno/app-shell.tsx", "AppShellProps"),
    );
  });

  it("keeps NavigationGroupProps and its family API table in exact sync", () => {
    expect(navigationGroupApi.map((row) => row.name).sort()).toEqual(
      interfacePropertyNames("src/gouno/app-shell.tsx", "NavigationGroupProps"),
    );
    expect(navigationHelperApi.map((row) => row.name)).toEqual(["navigationItemClass"]);
  });

  it("keeps PageHeaderProps and the PageHeader API table in exact sync", () => {
    expect(pageHeaderApi.map((row) => row.name).sort()).toEqual(
      interfacePropertyNames("src/gouno/page-header.tsx", "PageHeaderProps"),
    );
  });

  it("documents PageContainer as the native div-prop boundary it actually exports", () => {
    expect(pageContainerApi.map((row) => row.name)).toEqual([
      "children",
      "className",
      "...div props",
    ]);
    const source = program.getSourceFile(`${process.cwd()}/src/gouno/page-container.tsx`)!;
    const alias = source.statements.find(
      (node) => ts.isTypeAliasDeclaration(node) && node.name.text === "PageContainerProps",
    );
    expect(alias && ts.isTypeAliasDeclaration(alias) ? alias.type.getText(source) : "").toBe(
      "HTMLAttributes<HTMLDivElement>",
    );
  });
});
