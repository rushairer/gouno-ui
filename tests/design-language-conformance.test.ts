import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const productsRoot = resolve(repoRoot, "showcase/demos/products");
const sourceRoot = resolve(repoRoot, "src");
const rawShadowClass = /shadow-(?:xs|sm|md|lg|xl|2xl)(?:\s|["'`])/;

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
  ...sourceFiles(resolve(productsRoot, "blog-admin-ai-settings")),
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

function tabsCount(source: string) {
  return source.match(/<Tabs(?:<|\s)/g)?.length ?? 0;
}

describe("design-language conformance", () => {
  it("keeps completed Gosso application surfaces on the normal 24px edge axis", () => {
    const source = combined(gossoApplicationFiles);

    expect(source).not.toMatch(/<Card\b[^>]*padding=["']lg["']/);
    expect(source).not.toMatch(/(?:^|\s)p-(?:5|8)(?:\s|["'])/);
  });

  it("keeps the Gosso overview hierarchy explicit across surface and raised levels", () => {
    const overview = readFileSync(resolve(productsRoot, "gosso-overview.tsx"), "utf8");
    expect(overview).toContain("px-6 py-5");
    expect(overview).toContain('<Card padding="base" variant="elevated"');
    expect(overview).toContain("shadow-surface");
    expect(overview).toContain("hover:shadow-raised");
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

  it("owns visible elevation through semantic theme roles only", () => {
    const tokens = readFileSync(resolve(sourceRoot, "tokens.css"), "utf8");
    expect(tokens).toContain("--color-canvas: var(--canvas)");
    expect(tokens).toContain("--shadow-control: var(--elevation-shadow-control)");
    expect(tokens).toContain("--shadow-surface: var(--elevation-shadow-surface)");
    expect(tokens).toContain("--shadow-raised: var(--elevation-shadow-raised)");
    expect(tokens).toContain("--shadow-overlay: var(--elevation-shadow-overlay)");
    expect(tokens).toContain("--shadow-modal: var(--elevation-shadow-modal)");
    for (const size of ["xs", "sm", "md", "lg", "xl", "2xl"]) {
      expect(tokens).toContain(`--shadow-${size}: 0 0 #0000`);
    }
    expect(tokens).toContain("--canvas: #0f1319");
    expect(tokens).toContain("--raised: #1a222c");
  });

  it("uses semantic elevation names in canonical runtime source without arbitrary shadow utilities", () => {
    for (const file of canonicalSourceFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toMatch(rawShadowClass);
      expect(source).not.toContain("shadow-[");
    }

    const table = readFileSync(resolve(sourceRoot, "components/primitives/table.tsx"), "utf8");
    expect(table).toContain("caption-side-bottom border-t border-border/60");
    expect(table).toContain("caption-side-top border-b border-border/60");
  });

  it("keeps navigation ground-level while bordered tables use low surface separation", () => {
    const table = readFileSync(resolve(sourceRoot, "components/primitives/table.tsx"), "utf8");
    const shell = readFileSync(resolve(sourceRoot, "gouno/app-shell.tsx"), "utf8");
    expect(table).toContain('bordered ? "border border-border/80 bg-card shadow-surface"');
    expect(table).not.toContain('bg-card shadow-sm');
    expect(shell).not.toContain("aria-[current=page]:shadow-sm");
    expect(shell).not.toContain("aria-[current=page]:shadow-surface");
  });

  it("prevents product fixtures from carrying raw, arbitrary, overlay or modal shadow utilities", () => {
    for (const file of allProductFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toMatch(rawShadowClass);
      expect(source).not.toMatch(/shadow-(?:overlay|modal|\[)/);
    }
  });

  it("reserves persistent raised Card variants for audited focal and standalone surfaces", () => {
    const elevatedFiles = allProductFiles
      .filter((file) => readFileSync(file, "utf8").includes('variant="elevated"'))
      .map((file) => relative(productsRoot, file).replaceAll("\\", "/"))
      .sort();

    expect(elevatedFiles).toEqual([
      "gosso-auth/not-found.tsx",
      "gosso-auth/shared.tsx",
      "gosso-overview.tsx",
    ]);
  });

  it("allows manual raised elevation only as the audited hover state of overview peer cards", () => {
    const manualRaisedFiles = allProductFiles
      .filter((file) => readFileSync(file, "utf8").includes("shadow-raised"))
      .map((file) => relative(productsRoot, file).replaceAll("\\", "/"))
      .sort();

    expect(manualRaisedFiles).toEqual(["gosso-overview.tsx"]);
    const overview = readFileSync(resolve(productsRoot, "gosso-overview.tsx"), "utf8");
    expect(overview).toContain("shadow-surface");
    expect(overview).toContain("hover:shadow-raised");
  });

  it("keeps BulkActionBar sticky but contextual and ground-level by default", () => {
    const source = readFileSync(resolve(sourceRoot, "patterns/bulk-action-bar.tsx"), "utf8");
    expect(source).toContain("sticky bottom-4");
    expect(source).toContain("bg-card");
    expect(source).not.toContain("shadow-surface");
    expect(source).not.toContain("shadow-raised");
    expect(source).not.toContain("shadow-overlay");
    expect(source).not.toContain("backdrop-blur");
    expect(source).not.toMatch(/shadow-(?:xs|sm|md|lg|xl|2xl|control|surface|raised|overlay|modal|\[)/);
  });

  it("keeps migration-only class hooks out of canonical and Showcase runtime", () => {
    const base = readFileSync(resolve(sourceRoot, "base.css"), "utf8");
    const showcaseCss = readFileSync(resolve(repoRoot, "showcase/showcase.css"), "utf8");
    const button = readFileSync(resolve(sourceRoot, "core/button.tsx"), "utf8");
    const card = readFileSync(resolve(sourceRoot, "core/card.tsx"), "utf8");
    const form = readFileSync(resolve(sourceRoot, "core/form.tsx"), "utf8");
    const showcaseMain = readFileSync(resolve(repoRoot, "showcase/main.tsx"), "utf8");
    const demoBlock = readFileSync(resolve(repoRoot, "showcase/components/demo-block.tsx"), "utf8");
    const codeBlock = readFileSync(resolve(repoRoot, "showcase/components/code-block.tsx"), "utf8");

    for (const selector of [
      "posts-list-surface",
      "posts-filter-bar",
      'data-slot=\"responsive-list\"',
      "state-feedback",
      ".feedback",
      "icon-button__icon",
      "icon-button--secondary",
      "icon-button--danger",
    ]) {
      expect(base).not.toContain(selector);
    }
    expect(showcaseCss).not.toContain('data-slot="data-table"');
    expect(button).not.toContain("btn-color-");
    expect(button).not.toContain("is-loading");
    expect(button).not.toContain("btn-sm");
    expect(card).not.toContain("ui-card");
    expect(form).not.toContain('"form-layout flex');
    expect(showcaseMain).not.toContain('className={`${navigationItemClass} ${page === item.id ? "active" : ""}`}');
    expect(showcaseMain).not.toContain("页面 Demo /");
    expect(showcaseMain).not.toContain("previewLabel");
    expect(showcaseMain).not.toMatch(rawShadowClass);
    expect(demoBlock).not.toContain('className="demo-block ');
    expect(codeBlock).not.toContain('className="code-block ');
  });

  it("uses one route-family PageHeader before Tabs on normal tabbed task pages", () => {
    const accountRoot = resolve(productsRoot, "gosso-account-settings/index.tsx");
    const blogAI = resolve(productsRoot, "blog-admin-ai-operations/index.tsx");
    const blogAISettings = resolve(productsRoot, "blog-admin-ai-settings/index.tsx");
    const blogSettings = resolve(productsRoot, "blog-admin-site-settings.tsx");

    for (const file of [accountRoot, blogAI, blogAISettings]) expectHeaderBeforeTabs(file);

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

  it("enforces a one-persistent-Tabs navigation budget for normal route families", () => {
    const tabbedRouteFamilies = [
      sourceFiles(resolve(productsRoot, "gosso-account-settings")),
      sourceFiles(resolve(productsRoot, "blog-admin-ai-operations")),
      sourceFiles(resolve(productsRoot, "blog-admin-ai-settings")),
      [resolve(productsRoot, "blog-admin-site-settings.tsx")],
    ];

    for (const files of tabbedRouteFamilies) {
      expect(tabsCount(combined(files.filter((file) => /\.tsx$/.test(file))))).toBe(1);
    }

    const systemManagement = combined(sourceFiles(resolve(productsRoot, "gosso-system-management")));
    expect(tabsCount(systemManagement)).toBe(0);

    const aiOps = combined(sourceFiles(resolve(productsRoot, "blog-admin-ai-operations")));
    const aiSettingsRoot = readFileSync(resolve(productsRoot, "blog-admin-ai-settings/index.tsx"), "utf8");
    const aiSettingsSections = readFileSync(resolve(productsRoot, "blog-admin-ai-settings/sections.tsx"), "utf8");
    expect(aiOps).not.toContain("AIOpsAdvancedPanel");
    expect(aiOps).not.toContain('key: "advanced"');
    expect(aiSettingsRoot).toContain("<Tabs<AISettingsSection>");
    expect(aiSettingsSections).not.toContain("<Tabs");

    // Editor mode Tabs are view-state controls, not product-navigation tiers.
    for (const editor of ["blog-admin-post-editor.tsx", "blog-admin-page-editor.tsx"]) {
      const source = readFileSync(resolve(productsRoot, editor), "utf8");
      expect(source).toContain("<Tabs<EditorMode>");
      expect(source).not.toContain("<PageHeader");
    }
  });

  it("does not echo tab or route labels as immediate content headings", () => {
    const accountEchoes = [
      ["gosso-account-settings/profile.tsx", 'title="个人资料"'],
      ["gosso-account-settings/password.tsx", 'title="修改密码"'],
      ["gosso-account-settings/mfa.tsx", 'title="多因素认证 (MFA)"'],
      ["gosso-account-settings/security.tsx", 'title="通行密钥 (FIDO2)"'],
      ["gosso-account-settings/security.tsx", 'title="活跃会话"'],
    ] as const;
    const managementEchoes = [
      ["gosso-system-management/clients.tsx", 'title="OAuth2 客户端"'],
      ["gosso-system-management/users.tsx", 'title="用户管理"'],
      ["gosso-system-management/audit-logs.tsx", 'title="审计日志"'],
      ["gosso-system-management/site-settings.tsx", 'title="站点设置"'],
      ["gosso-system-management/system-status.tsx", 'title="系统状态"'],
    ] as const;

    for (const [path, echo] of [...accountEchoes, ...managementEchoes]) {
      expect(readFileSync(resolve(productsRoot, path), "utf8")).not.toContain(echo);
    }

    const blogSettings = readFileSync(resolve(productsRoot, "blog-admin-site-settings.tsx"), "utf8");
    for (const title of ["基础信息", "网站图标", "首页 Hero 标语与插图", "公开联系方式", "默认 SEO"]) {
      expect(blogSettings).not.toContain(`title="${title}"`);
    }

    const aiSettings = readFileSync(resolve(productsRoot, "blog-admin-ai-settings/sections.tsx"), "utf8");
    expect(aiSettings).not.toContain("<CardTitle>Agents</CardTitle>");
    expect(aiSettings).not.toContain("<CardTitle>Tools</CardTitle>");

    const systemStatus = readFileSync(resolve(productsRoot, "gosso-system-management/system-status.tsx"), "utf8");
    expect(systemStatus).toContain('<Heading level={2} className="text-base">基础设施健康</Heading>');
    expect(systemStatus).toContain('return <Card padding="base"><Heading level={2}');
  });

  it("uses one open content-lead grammar across governed settings and management pages", () => {
    const lead = readFileSync(resolve(repoRoot, "showcase/components/tab-panel-lead.tsx"), "utf8");
    const account = readFileSync(resolve(productsRoot, "gosso-account-settings/shared.tsx"), "utf8");
    const system = readFileSync(resolve(productsRoot, "gosso-system-management/shared.tsx"), "utf8");
    const blogSettings = readFileSync(resolve(productsRoot, "blog-admin-site-settings.tsx"), "utf8");
    const aiSettings = readFileSync(resolve(productsRoot, "blog-admin-ai-settings/sections.tsx"), "utf8");

    expect(lead).toContain('data-slot="showcase-tab-panel-lead"');
    expect(lead).not.toContain("<Card");
    expect(account).toContain("<TabPanelLead");
    expect(system).toContain("ManagementPanelLead = TabPanelLead");
    expect(blogSettings).toContain("<TabPanelLead description={description} />");
    expect(blogSettings).not.toMatch(/<SettingsSurface\b[^>]*\btitle=/);
    expect(aiSettings).toContain("<TabPanelLead");
  });

  it("keeps product interface governance discoverable and machine-enforced", () => {
    const agents = readFileSync(resolve(repoRoot, "AGENTS.md"), "utf8");
    const governance = readFileSync(resolve(repoRoot, "docs/product-interface-governance.md"), "utf8");

    expect(agents).toContain("docs/product-interface-governance.md");
    expect(governance).toContain("## PI-01 — Product navigation has a depth budget");
    expect(governance).toContain("## PI-02 — Tabs name the panel; the panel lead adds context");
    expect(governance).toContain("## PI-04 — Visible elevation uses semantic roles only");
    expect(governance).toContain("## PI-05 — New binding rules require a corpus pass, not screenshot patching");
  });
});