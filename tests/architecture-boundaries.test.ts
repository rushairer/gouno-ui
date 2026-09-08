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
    const core = await import("../src/core/index");
    const theme = await import("../src/theme/index");
    expect("ThemeToggle" in core).toBe(false);
    expect("ThemeProvider" in theme).toBe(true);
    expect("ThemeToggle" in theme).toBe(true);
    expect("useTheme" in theme).toBe(true);
  });

  it("does not expose inert global configuration surfaces", async () => {
    const core = await import("../src/core/index");
    expect("ConfigProvider" in core).toBe(false);
    expect("LocaleProvider" in core).toBe(false);
  });

  it("does not recreate public catch-all implementation modules", () => {
    expect(existsSync(resolve(sourceRoot, "core/components.tsx"))).toBe(false);
    expect(existsSync(resolve(sourceRoot, "core/feedback.tsx"))).toBe(false);
    expect(existsSync(resolve(sourceRoot, "core/display.tsx"))).toBe(false);
    expect(existsSync(resolve(sourceRoot, "gouno/layout.tsx"))).toBe(false);
  });

  it("keeps Legacy explicitly quarantined outside canonical ownership", () => {
    const legacyReadme = readFileSync(resolve(sourceRoot, "legacy/README.md"), "utf8");
    expect(legacyReadme).toContain("not compiled");
    expect(legacyReadme).toContain("not published");
    expect(legacyReadme).toContain("not shown in Showcase");
  });
});
