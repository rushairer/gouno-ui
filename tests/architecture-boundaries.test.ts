import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = resolve(process.cwd(), "src");

function sourceFiles(directory: string): string[] {
  const result: string[] = [];
  const visit = (path: string) => {
    for (const entry of readdirSync(path)) {
      const child = resolve(path, entry);
      if (statSync(child).isDirectory()) visit(child);
      else if (/\.(tsx?|jsx?)$/.test(entry)) result.push(child);
    }
  };
  visit(resolve(sourceRoot, directory));
  return result;
}

function contents(directory: string): string {
  return sourceFiles(directory).map((file) => readFileSync(file, "utf8")).join("\n");
}

describe("public layer architecture", () => {
  it("keeps core free of patterns and product-layer imports", () => {
    expect(contents("core")).not.toMatch(/from\s+["']\.\.\/patterns\//);
    expect(contents("core")).not.toMatch(/from\s+["']\.\.\/gouno\//);
  });

  it("keeps reusable patterns free of product-layer imports", () => {
    expect(contents("patterns")).not.toMatch(/from\s+["']\.\.\/gouno\//);
  });

  it("keeps business status tags in the Gouno layer", async () => {
    const core = await import("../src/core/index");
    const gouno = await import("../src/gouno/index");
    expect("StatusBadge" in core).toBe(false);
    expect("StatusIndicator" in core).toBe(false);
    expect("RiskBadge" in core).toBe(false);
    expect(typeof gouno.StatusBadge).toBe("function");
    expect(typeof gouno.StatusIndicator).toBe("function");
    expect(typeof gouno.RiskBadge).toBe("function");
  });

  it("publishes curated layer entry points instead of source-directory wildcards", () => {
    const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")) as { exports: Record<string, unknown> };
    const exportKeys = Object.keys(packageJson.exports);
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

  it("does not create a second canonical Core import path through Patterns", () => {
    const patternsIndex = readFileSync(resolve(sourceRoot, "patterns/index.ts"), "utf8");
    expect(patternsIndex).not.toMatch(/from\s+["']\.\.\/core\//);
    expect(patternsIndex).not.toContain("TableDensity");
  });

  it("does not re-export Core or primitive APIs from Pattern implementation modules", () => {
    const patterns = contents("patterns");
    expect(patterns).not.toMatch(
      /export\s+(?:type\s+)?\*\s+from\s+["']\.\.\/(?:core|components\/primitives)\//,
    );
  });

  it("does not reimplement Core-owned Tabs or Pagination inside Patterns", () => {
    const patterns = contents("patterns");
    expect(patterns).not.toMatch(/export\s+(?:const|function)\s+(Tabs|TabList|TabPanel|Pagination)\b/);
    expect(patterns).not.toContain("SubnavTabs");
  });

  it("keeps product action policy out of reusable Patterns", () => {
    const patterns = contents("patterns");
    expect(patterns).not.toContain("onAIAssist");
    expect(patterns).not.toContain("aiLabel");
    expect(patterns).not.toContain("交给 AI");
  });

  it("keeps theme controls owned by the theme entry point", async () => {
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
    for (const relativePath of [
      "core/misc.tsx",
      "core/visual.tsx",
      "core/date-time.tsx",
      "patterns/navigation-patterns.tsx",
    ]) {
      expect(existsSync(resolve(sourceRoot, relativePath))).toBe(false);
    }
  });

  it("keeps feedback, async state and toast as separate pattern owners", () => {
    const feedback = readFileSync(resolve(sourceRoot, "patterns/feedback.tsx"), "utf8");
    const asyncState = readFileSync(resolve(sourceRoot, "patterns/async-state.tsx"), "utf8");
    const toast = readFileSync(resolve(sourceRoot, "patterns/toast.tsx"), "utf8");
    expect(feedback).not.toContain("AsyncState");
    expect(feedback).not.toContain("ToastProvider");
    expect(asyncState).not.toContain("ToastProvider");
    expect(toast).not.toContain("EmptyState");
  });

  it("keeps DataTable model internals private to the Pattern implementation", async () => {
    const dataTableSource = readFileSync(resolve(sourceRoot, "patterns/data-table.tsx"), "utf8");
    expect(dataTableSource).not.toMatch(/export\s+(?:type\s+)?\*/);
    const patterns = await import("../src/patterns/index");
    expect("useDataTableModel" in patterns).toBe(false);
    expect("DataTableRecord" in patterns).toBe(false);
  });

  it("keeps Gouno layout families split and free of synonym aliases", async () => {
    const layoutSource = readFileSync(resolve(sourceRoot, "gouno/layout.tsx"), "utf8");
    expect(layoutSource).not.toMatch(/function\s+/);
    const gouno = await import("../src/gouno/index");
    expect("WorkspacePanel" in gouno).toBe(false);
    expect("AdminPageHeader" in gouno).toBe(false);
    expect(typeof gouno.Panel).toBe("function");
    expect(typeof gouno.PageHeader).toBe("function");
  });
});
