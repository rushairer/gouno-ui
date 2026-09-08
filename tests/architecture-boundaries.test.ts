import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = resolve(process.cwd(), "src");

function sourceFiles(directory: string): string[] {
  const result: string[] = [];
  const root = resolve(sourceRoot, directory);
  if (!existsSync(root)) return result;
  const visit = (path: string) => {
    for (const entry of readdirSync(path)) {
      const child = resolve(path, entry);
      if (statSync(child).isDirectory()) visit(child);
      else if (/\.(tsx?|jsx?)$/.test(entry)) result.push(child);
    }
  };
  visit(root);
  return result;
}

function contents(directory: string): string {
  return sourceFiles(directory).map((file) => readFileSync(file, "utf8")).join("\n");
}

describe("public layer architecture", () => {
  it("keeps Core free of higher-layer and Legacy imports", () => {
    const core = contents("core");
    expect(core).not.toMatch(/from\s+["']\.\.\/(?:theme|patterns|gouno|legacy)\//);
  });

  it("keeps Theme free of Pattern, Gouno and Legacy imports", () => {
    const theme = contents("theme");
    expect(theme).not.toMatch(/from\s+["']\.\.\/(?:patterns|gouno|legacy)\//);
  });

  it("keeps canonical Patterns free of Gouno and Legacy imports", () => {
    const patterns = contents("patterns");
    expect(patterns).not.toMatch(/from\s+["']\.\.\/(?:gouno|legacy)\//);
  });

  it("publishes only admitted Pattern interactions", async () => {
    const patterns = await import("../src/patterns/index");
    expect(Object.keys(patterns).sort()).toEqual(["BulkActionBar"]);
  });

  it("publishes only admitted Gouno product-family structure", async () => {
    const gouno = await import("../src/gouno/index");
    expect(Object.keys(gouno).sort()).toEqual(
      ["AppShell", "NavigationGroup", "PageContainer", "PageHeader", "navigationItemClass"].sort(),
    );
    for (const legacyName of [
      "AdminShell",
      "AdminPage",
      "Panel",
      "DashboardTemplate",
      "StatusBadge",
      "ActionGroup",
      "FilterBar",
    ]) {
      expect(legacyName in gouno).toBe(false);
    }
  });

  it("publishes curated layer entry points without Legacy or source wildcards", () => {
    const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")) as { exports: Record<string, unknown> };
    const exportKeys = Object.keys(packageJson.exports);
    expect(exportKeys).not.toContain("./legacy");
    expect(exportKeys).not.toContain("./legacy/*");
    expect(exportKeys).not.toContain("./core/*");
    expect(exportKeys).not.toContain("./patterns/*");
    expect(exportKeys).not.toContain("./gouno/*");
  });

  it("uses explicit symbol manifests in every formal layer entry", () => {
    for (const entry of ["core/index.ts", "patterns/index.ts", "gouno/index.ts", "theme/index.ts"]) {
      const source = readFileSync(resolve(sourceRoot, entry), "utf8");
      expect(source).not.toMatch(/export\s+\*/);
    }
  });

  it("keeps Theme controls owned by the Theme entry point", async () => {
    const gouno = await import("../src/gouno/index");
    const theme = await import("../src/theme/index");
    expect("ThemeProvider" in gouno).toBe(false);
    expect("ThemeToggle" in gouno).toBe(false);
    expect(typeof theme.ThemeProvider).toBe("function");
    expect(typeof theme.ThemeToggle).toBe("function");
  });

  it("does not expose inert global configuration surfaces", async () => {
    expect(existsSync(resolve(sourceRoot, "core/config-provider.tsx"))).toBe(false);
    const core = await import("../src/core/index");
    expect("ConfigProvider" in core).toBe(false);
    expect("useConfig" in core).toBe(false);
  });

  it("does not recreate public catch-all implementation modules", () => {
    for (const relativePath of ["core/misc.tsx", "core/visual.tsx", "core/date-time.tsx", "patterns/navigation-patterns.tsx"]) {
      expect(existsSync(resolve(sourceRoot, relativePath))).toBe(false);
    }
  });

  it("keeps Legacy explicitly quarantined outside canonical ownership", () => {
    expect(existsSync(resolve(sourceRoot, "legacy/README.md"))).toBe(true);
    expect(existsSync(resolve(sourceRoot, "legacy/patterns"))).toBe(true);
    expect(existsSync(resolve(sourceRoot, "legacy/gouno"))).toBe(true);
  });
});
