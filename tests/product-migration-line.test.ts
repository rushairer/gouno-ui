import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const processDocs = [
  "AGENTS.md",
  "README.md",
  "docs/architecture.md",
  "docs/product-driven-development.md",
  "showcase/demos/products/README.md",
] as const;

describe("product migration line", () => {
  it("keeps all three validated products as completed comparison corpora with no active fourth line", () => {
    for (const path of processDocs) {
      const normalized = read(path).toLowerCase();
      expect(normalized, path).toContain("gosso admin");
      expect(normalized, path).toContain("blog admin");
      expect(normalized, path).toMatch(/blog public|gouno blog public site/);
      expect(normalized, path).toMatch(/completed|closed/);
      expect(normalized, path).toMatch(/comparison corpus|comparison corpora/);
      expect(normalized, path).toMatch(/no active|no fourth|none selected|暂无.*active|without an active/);
      expect(normalized, path).not.toMatch(
        /blog public(?: site)? (?:is|as) the active|active migration line:\*\* gouno blog public|blog public.*active page-by-page|active public-site migration workspace/,
      );
    }
  });

  it("keeps the completed Blog public surfaces standalone from the Showcase AppShell", () => {
    const catalog = read("showcase/catalog.tsx");
    const expectedEntries = [
      'item("blog-home", "Home", "首页", 100, <Home />, "standalone")',
      'item("blog-articles", "ArticleIndex", "文章列表", 100, <FileText />, "standalone")',
      'item("blog-article-detail", "ArticleDetail", "文章详情", 100, <FileText />, "standalone")',
      'item("blog-search", "Search", "搜索结果", 100, <Search />, "standalone")',
      'item("blog-categories", "Categories", "分类索引", 100, <ListTree />, "standalone")',
      'item("blog-tags", "Tags", "标签索引", 100, <Tags />, "standalone")',
      'item("blog-archive", "Archive", "文章归档", 100, <History />, "standalone")',
      'item("blog-about", "About", "关于", 100, <CircleHelp />, "standalone")',
      'item("blog-custom-page", "CustomPage", "自定义单页", 100, <FileText />, "standalone")',
      'item("blog-account-notifications", "Notifications", "账户通知", 100, <Bell />, "standalone")',
      'item("blog-account-settings", "Account Settings", "账户设置", 100, <UserCog />, "standalone")',
      'item("blog-not-found", "Not Found", "未找到", 100, <CircleHelp />, "standalone")',
    ];

    for (const entry of expectedEntries) expect(catalog).toContain(entry);
  });
});
