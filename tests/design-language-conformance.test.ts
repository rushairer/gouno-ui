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

const blogAdminApplicationFiles = [
  resolve(productsRoot, "blog-admin-dashboard.tsx"),
  resolve(productsRoot, "blog-admin-posts.tsx"),
  resolve(productsRoot, "blog-admin-post-editor.tsx"),
  resolve(productsRoot, "blog-admin-categories.tsx"),
  resolve(productsRoot, "blog-admin-tags.tsx"),
  resolve(productsRoot, "blog-admin-pages.tsx"),
  resolve(productsRoot, "blog-admin-page-editor.tsx"),
  resolve(productsRoot, "blog-admin-comments.tsx"),
  resolve(productsRoot, "blog-admin-notifications.tsx"),
  resolve(productsRoot, "blog-admin-media-library.tsx"),
  resolve(productsRoot, "blog-admin-users.tsx"),
  resolve(productsRoot, "blog-admin-site-settings.tsx"),
  ...sourceFiles(resolve(productsRoot, "blog-admin-ai-operations")),
];

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

  it("uses explicit Card anatomy for full-bleed sticky actions across products", () => {
    const siteSettingsFiles = [
      resolve(productsRoot, "gosso-system-management/site-settings.tsx"),
      resolve(productsRoot, "blog-admin-site-settings.tsx"),
    ];

    for (const file of siteSettingsFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).toContain('<Card padding="none" className="gap-0 overflow-clip">');
      expect(source).toContain('<CardContent className="flex flex-col gap-5 p-6">');
      expect(source).toContain('<CardFooter className="sticky bottom-0 z-10 justify-between border-t bg-card/95 px-6 py-4 backdrop-blur">');
      expect(source).not.toContain("-mx-6");
      expect(source).not.toContain("-mb-6");
    }
  });

  it("keeps migrated Blog Admin pages on the current surface contract", () => {
    for (const file of blogAdminApplicationFiles) {
      const source = readFileSync(file, "utf8");
      const spaciousCards = source.match(/<Card\b[^>]*padding=["']lg["'][^>]*>/g) ?? [];
      const spaciousEmptyCards = source.match(/<Card\b[^>]*padding=["']lg["'][^>]*>\s*<Empty\b/g) ?? [];

      // DL-07 permits spacious treatment for a contained Empty/result surface, not for normal
      // application content or as an alignment shim. Every current Blog Admin lg Card must be one.
      expect(spaciousCards).toHaveLength(spaciousEmptyCards.length);
      expect(source).not.toMatch(/(?:^|\s)p-(?:5|8)(?:\s|["'])/);
    }
  });

  it("keeps dense Table row actions single-line and structurally uniform", () => {
    const actionFiles = [
      resolve(productsRoot, "blog-admin-dashboard.tsx"),
      resolve(productsRoot, "blog-admin-posts.tsx"),
      resolve(productsRoot, "blog-admin-categories.tsx"),
      resolve(productsRoot, "blog-admin-pages.tsx"),
      resolve(productsRoot, "blog-admin-users.tsx"),
      resolve(productsRoot, "gosso-system-management/users.tsx"),
      resolve(productsRoot, "gosso-system-management/clients.tsx"),
    ];

    for (const file of actionFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).toContain("min-w-max flex-nowrap");
    }

    const systemActions = readFileSync(resolve(productsRoot, "gosso-system-management/shared.tsx"), "utf8");
    expect(systemActions).toContain("<IconButton");
    expect(systemActions).toContain('variant="ghost"');
    expect(systemActions).not.toContain('<Button size="small" variant={color === "error" ? "solid" : "outline"}');
  });
});
