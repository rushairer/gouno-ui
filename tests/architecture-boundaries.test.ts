import { readdirSync, readFileSync, statSync } from "node:fs";
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
  return sourceFiles(directory)
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
}

describe("public layer architecture", () => {
  it("keeps core free of patterns and product-layer imports", () => {
    expect(contents("core")).not.toMatch(/from\s+["']\.\.\/patterns\//);
    expect(contents("core")).not.toMatch(/from\s+["']\.\.\/gouno\//);
  });

  it("keeps reusable patterns free of product-layer imports", () => {
    expect(contents("patterns")).not.toMatch(/from\s+["']\.\.\/gouno\//);
  });

  it("keeps product policy out of reusable navigation patterns", () => {
    const navigation = readFileSync(
      resolve(sourceRoot, "patterns/navigation-patterns.tsx"),
      "utf8",
    );
    expect(navigation).not.toContain("gouno-blog:theme");
    expect(navigation).not.toContain('includes("后台")');
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
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), "package.json"), "utf8"),
    ) as { exports: Record<string, unknown> };
    const exportKeys = Object.keys(packageJson.exports);
    expect(exportKeys).not.toContain("./core/*");
    expect(exportKeys).not.toContain("./patterns/*");
    expect(exportKeys).not.toContain("./gouno/*");
  });

  it("does not create a second canonical Core import path through Patterns", () => {
    const patternsIndex = readFileSync(
      resolve(sourceRoot, "patterns/index.ts"),
      "utf8",
    );
    expect(patternsIndex).not.toMatch(/from\s+["']\.\.\/core\//);
  });
});
