import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "showcase/demos/products");

function read(path: string) {
  return readFileSync(resolve(root, path), "utf8");
}

function expectBefore(source: string, before: string, after: string) {
  const beforeIndex = source.indexOf(before);
  const afterIndex = source.indexOf(after);
  expect(beforeIndex, before + " missing").toBeGreaterThanOrEqual(0);
  expect(afterIndex, after + " missing").toBeGreaterThanOrEqual(0);
  expect(beforeIndex).toBeLessThan(afterIndex);
}

describe("admin data composition product corpus", () => {
  it("marks the audited Blog Admin and Gosso Admin collection pages", () => {
    const paths = [
      "blog-admin/posts.tsx",
      "blog-admin/pages.tsx",
      "blog-admin/categories.tsx",
      "blog-admin/comments.tsx",
      "blog-admin/tags.tsx",
      "blog-admin/media-library.tsx",
      "blog-admin/users.tsx",
      "gosso-admin/system-management/users.tsx",
      "gosso-admin/system-management/clients.tsx",
      "gosso-admin/system-management/audit-logs.tsx",
    ];

    for (const path of paths) {
      expect(read(path), path).toContain('data-pattern="collection-composition"');
    }
  });

  it("keeps page-level collection read errors before filters and data surfaces", () => {
    const posts = read("blog-admin/posts.tsx");
    const pages = read("blog-admin/pages.tsx");
    const comments = read("blog-admin/comments.tsx");
    const media = read("blog-admin/media-library.tsx");
    const audit = read("gosso-admin/system-management/audit-logs.tsx");

    expectBefore(posts, 'title="文章加载失败"', 'aria-label="搜索文章"');
    expectBefore(pages, 'title="单页加载失败"', 'aria-label="搜索单页"');
    expectBefore(comments, 'title="评论加载失败"', 'aria-label="评论状态"');
    expectBefore(media, 'title="媒体加载失败"', 'aria-label="搜索媒体"');
    expectBefore(audit, 'title="审计日志加载失败"', '<Card padding="sm">');

    for (const source of [posts, pages, comments, media]) {
      expect(source).toContain('scenario === "error" ? null : scenario === "loading" ?');
    }
  });

  it("binds the audited Settings pages to one settings composition grammar", () => {
    const account = read("gosso-admin/account-settings/shared.tsx");
    const site = read("blog-admin/site-settings.tsx");
    const ai = read("blog-admin/ai/settings/index.tsx");

    expect(account).toContain('data-pattern="settings-composition"');
    expect(site).toContain('data-pattern="settings-composition"');
    expect(ai).toContain('data-pattern="settings-composition"');

    expectBefore(account, "<TabPanelLead", "<TabPanelFeedback>");
    expectBefore(site, "<TabPanelLead", '<Card padding="none"');
    const aiSettingsBranch = ai.slice(ai.indexOf('data-pattern="settings-composition"'));
    expectBefore(aiSettingsBranch, "<AISettingsSectionLead", "<FixtureNotification");
  });

  it("binds AI operational peer navigation to the Master-Detail contract", () => {
    const inbox = read("blog-admin/ai/operations/overview-inbox.tsx");
    const records = read("blog-admin/ai/operations/automation-records.tsx");

    expect(inbox).toContain('data-pattern="master-detail-composition"');
    expect(records.match(/data-pattern="master-detail-composition"/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("binds run evidence and dashboard metrics to the governed summary/detail grammar", () => {
    const records = read("blog-admin/ai/operations/automation-records.tsx");
    const patterns = read("blog-admin/ai/operations/canonical-patterns.tsx");
    const dashboard = read("blog-admin/dashboard.tsx");

    expect(records.match(/data-pattern="record-detail-composition"/g)?.length).toBeGreaterThanOrEqual(2);
    expect(patterns).toContain('data-pattern="data-summary-composition"');
    expect(dashboard).toContain('data-pattern="data-summary-composition"');
    expect(dashboard).toContain('aria-label="站点运营摘要"');
  });

  it("keeps the composition contracts documented as Showcase-only design grammar", () => {
    const governance = readFileSync(resolve(process.cwd(), "docs/product-interface-governance.md"), "utf8");
    const contract = readFileSync(resolve(process.cwd(), "docs/patterns/admin-data-composition.md"), "utf8");
    const abstractions = readFileSync(resolve(process.cwd(), "docs/abstraction-register.md"), "utf8");

    expect(governance).toContain("## PI-08 — Common admin data blocks use governed composition contracts");
    expect(contract).toContain("Admin Data Composition");
    expect(contract).toContain("Collection");
    expect(contract).toContain("Record Detail");
    expect(contract).toContain("Master-Detail");
    expect(contract).toContain("Settings");
    expect(contract).toContain("Data Summary");
    expect(abstractions).toContain("### PD-079 — Admin data composition stays Showcase-only");
  });
});
