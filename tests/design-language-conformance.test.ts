import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const productsRoot = resolve(process.cwd(), "showcase/demos/products");

function sourceFiles(path: string): string[] {
  if (!existsSync(path)) return [];
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path).flatMap((entry) => sourceFiles(resolve(path, entry)));
}

const gossoApplicationFiles = [
  resolve(productsRoot, "gosso-overview.tsx"),
  ...sourceFiles(resolve(productsRoot, "gosso-account-settings")),
  ...sourceFiles(resolve(productsRoot, "gosso-system-management")),
].filter((file) => /\.(tsx?|jsx?)$/.test(file));

function combined(files: readonly string[]): string {
  return files.map((file) => readFileSync(file, "utf8")).join("\n");
}

describe("design-language conformance", () => {
  it("keeps completed Gosso application surfaces on the normal 24px edge axis", () => {
    const source = combined(gossoApplicationFiles);

    expect(source).not.toMatch(/<Card\b[^>]*padding=["']lg["']/);
    expect(source).not.toMatch(/(?:^|\s)p-(?:5|8)(?:\s|["'])/);
  });

  it("keeps the Gosso overview quick-link surface aligned without forcing vertical density", () => {
    const overview = readFileSync(resolve(productsRoot, "gosso-overview.tsx"), "utf8");
    expect(overview).toContain("px-6 py-5");
    expect(overview).toContain('<Card padding="base" variant="elevated"');
  });

  it("keeps site-settings sticky actions on the same 24px card inset", () => {
    const siteSettings = readFileSync(resolve(productsRoot, "gosso-system-management/site-settings.tsx"), "utf8");
    expect(siteSettings).toContain('<Card padding="base"');
    expect(siteSettings).toContain("-mx-6 -mb-6");
    expect(siteSettings).toContain("px-6 py-4");
  });
});
