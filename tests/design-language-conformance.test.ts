import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const productsRoot = resolve(process.cwd(), "showcase/demos/products");
const sourceRoot = resolve(process.cwd(), "src");

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

const allProductFiles = sourceFiles(productsRoot).filter((file) => /\.(tsx?|jsx?)$/.test(file));
const canonicalSourceFiles = sourceFiles(sourceRoot).filter(
  (file) => /\.(tsx?|jsx?)$/.test(file) && !file.includes(`${resolve(sourceRoot, "legacy")}/`),
);

function combined(files: readonly string[]): string {
  return files.map((file) => readFileSync(file, "utf8")).join("\n");
}

function expectHeaderBeforeTabs(file: string) {
  const source = readFileSync(file, "utf8");
  const header = source.indexOf("<PageHeader");
  const tabs = source.indexOf("<Tabs");
  expect(header).toBeGreaterThanOrEqual(0);
  expect(tabs).toBeGreaterThan(header);
}

describe("design-language conformance", () => {
  it("keeps completed Gosso application surfaces on the normal 24px edge axis", () => {
    const source = combined(gossoApplicationFiles);

    expect(source).not.toMatch(/<Card\b[^>]*padding=["']lg["']/);
    expect(source).not.toMatch(/(?:^|\s)p-(?:5|8)(?:\s|["'])/);
  });

  it("keeps the Gosso overview quick-link surface aligned while reserving elevation for the focal hero", () => {
    const overview = readFileSync(resolve(productsRoot, "gosso-overview.tsx"), "utf8");
    expect(overview).toContain("px-6 py-5");
    expect(overview).toContain('<Card padding="base" variant="elevated"');
    expect(overview).not.toContain("shadow-sm");
    expect(overview).not.toContain("shadow-md");
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

  it("owns elevation through semantic theme roles instead of Tailwind defaults", () => {
    const tokens = readFileSync(resolve(sourceRoot, "tokens.css"), "utf8");
    expect(tokens).toContain("--shadow-raised: var(--elevation-shadow-raised)");
    expect(tokens).toContain("--shadow-overlay: var(--elevation-shadow-overlay)");
    expect(tokens).toContain("--shadow-modal: var(--elevation-shadow-modal)");
    expect(tokens).toContain("--shadow-xs: 0 0 #0000");
    expect(tokens).toContain("--shadow-sm: 0 0 #0000");
    expect(tokens).toContain("--raised: #1a222c");
  });

  it("uses semantic elevation names in canonical runtime source", () => {
    for (const file of canonicalSourceFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toMatch(/shadow-(?:md|lg|xl|2xl)/);
    }
  });

  it("keeps normal table and navigation surfaces on ground elevation", () => {
    const table = readFileSync(resolve(sourceRoot, "components/primitives/table.tsx"), "utf8");
    const shell = readFileSync(resolve(sourceRoot, "gouno/app-shell.tsx"), "utf8");
    expect(table).not.toContain('bg-card shadow-sm');
    expect(shell).not.toContain("aria-[current=page]:shadow-sm");
  });

  it("prevents product fixtures from creating effective page-local elevation", () => {
    for (const file of allProductFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toMatch(/shadow-(?:md|lg|xl|raised|overlay|modal|\[)/);
    }
  });

  it("uses one route-family PageHeader before Tabs on normal tabbed task pages", () => {
    const accountRoot = resolve(productsRoot, "gosso-account-settings/index.tsx");
    const systemRoot = resolve(productsRoot, "gosso-system-management/index.tsx");
    const blogAI = resolve(productsRoot, "blog-admin-ai-operations/index.tsx");
    const blogSettings = resolve(productsRoot, "blog-admin-site-settings.tsx");

    for (const file of [accountRoot, systemRoot, blogAI]) expectHeaderBeforeTabs(file);

    // Site Settings builds its Tabs value before the render return; assert rendered ordering
    // by checking the return tree: route PageHeader precedes the computed tabbed content slot.
    const settingsSource = readFileSync(blogSettings, "utf8");
    expect(settingsSource).toContain("<Tabs<SettingsTab>");
    const settingsReturn = settingsSource.slice(settingsSource.lastIndexOf("return ("));
    const header = settingsReturn.indexOf("<PageHeader");
    const content = settingsReturn.indexOf("{content}");
    expect(header).toBeGreaterThanOrEqual(0);
    expect(content).toBeGreaterThan(header);

    const accountShared = readFileSync(resolve(productsRoot, "gosso-account-settings/shared.tsx"), "utf8");
    const managementFiles = sourceFiles(resolve(productsRoot, "gosso-system-management"))
      .filter((file) => !file.endsWith("index.tsx") && /\.tsx$/.test(file));
    expect(accountShared).not.toContain("PageHeader");
    for (const file of managementFiles) {
      expect(readFileSync(file, "utf8")).not.toContain("PageHeader");
    }
  });
});