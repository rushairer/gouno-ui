import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const canonicalPublicPages = [
  ["blog-home", "Home"],
  ["blog-articles", "ArticleIndex"],
  ["blog-article-detail", "ArticleDetail"],
  ["blog-search", "Search"],
  ["blog-categories", "Categories"],
  ["blog-tags", "Tags"],
  ["blog-archive", "Archive"],
  ["blog-about", "About"],
  ["blog-custom-page", "CustomPage"],
  ["blog-account-notifications", "Notifications"],
  ["blog-account-settings", "Account Settings"],
  ["blog-not-found", "Not Found"],
] as const;

const publicFixtureFiles = [
  "showcase/demos/products/blog-home.tsx",
  "showcase/demos/products/blog-article-index.tsx",
  "showcase/demos/products/blog-article-detail.tsx",
  "showcase/demos/products/blog-discovery-indexes.tsx",
  "showcase/demos/products/blog-document-pages.tsx",
  "showcase/demos/products/blog-account-pages.tsx",
  "showcase/demos/products/blog-not-found.tsx",
] as const;

describe("Blog public route closure", () => {
  it("keeps every canonical public route family represented exactly once as standalone", () => {
    const catalog = read("showcase/catalog.tsx");

    for (const [id, name] of canonicalPublicPages) {
      const idMatches = catalog.match(new RegExp(`item\\(\\"${id}\\"`, "g")) ?? [];
      expect(idMatches.length, id).toBe(1);
      expect(catalog, id).toContain(`item("${id}", "${name}"`);
      const entry = catalog.split(`item("${id}"`)[1]?.split("),")[0] ?? "";
      expect(entry, id).toContain('"standalone"');
    }
  });

  it("keeps category/tag detail as ArticleIndex modes instead of duplicate page families", () => {
    const source = read("showcase/demos/products/blog-article-index.tsx");
    const catalog = read("showcase/catalog.tsx");

    expect(source).toContain('type ArticleIndexMode = "articles" | "search" | "tag" | "category"');
    expect(catalog).not.toContain("blog-category-detail");
    expect(catalog).not.toContain("blog-tag-detail");
  });

  it("keeps compatibility redirects as route policy rather than duplicate Showcase surfaces", () => {
    const catalog = read("showcase/catalog.tsx");
    const fixtureDocs = read("showcase/demos/products/README.md");

    expect(fixtureDocs).toContain("/notifications");
    expect(fixtureDocs).toContain("/settings");
    expect(fixtureDocs).toMatch(/compatibility redirect|兼容/i);
    expect(catalog).not.toContain("blog-notifications-compat");
    expect(catalog).not.toContain("blog-settings-compat");
  });

  it("keeps every public product fixture outside AppShell and real service calls", () => {
    for (const path of publicFixtureFiles) {
      const source = read(path);
      expect(source, path).not.toMatch(/<(?:AppShell|PageContainer)\b/);
      expect(source, path).not.toMatch(/\b(?:fetch\s*\(|axios\b|XMLHttpRequest|WebSocket)/);
    }
  });

  it("keeps the public product corpus limited to known Blog fixture files", () => {
    const productFiles = readdirSync(resolve(root, "showcase/demos/products"))
      .filter((name) => name.startsWith("blog-") && name.endsWith(".tsx") && !name.startsWith("blog-admin-"));

    for (const expected of publicFixtureFiles) {
      expect(productFiles).toContain(expected.split("/").at(-1)!);
    }
  });
});
