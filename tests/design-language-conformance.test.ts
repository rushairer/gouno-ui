import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const productsRoot = resolve(repoRoot, "showcase/demos/products");
const sourceRoot = resolve(repoRoot, "src");

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

  it("owns visible elevation through semantic theme roles only", () => {
    const tokens = readFileSync(resolve(sourceRoot, "tokens.css"), "utf8");
    expect(tokens).toContain("--shadow-raised: var(--elevation-shadow-raised)");
    expect(tokens).toContain("--shadow-overlay: var(--elevation-shadow-overlay)");
    expect(tokens).toContain("--shadow-modal: var(--elevation-shadow-modal)");
    for (const size of ["xs", "sm", "md", "lg", "xl", "2xl"]) {
      expect(tokens).toContain(`--shadow-${size}: 0 0 #0000`);
    }
    expect(tokens).toContain("--raised: #1a222c");
  });

  it("uses semantic elevation names in canonical runtime source and isolates the one overflow shadow cue", () => {
    const tablePath = resolve(sourceRoot, "components/primitives/table.tsx");
    for (const file of canonicalSourceFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toMatch(/shadow-(?:md|lg|xl|2xl)/);
      if (file === tablePath) {
        expect(source.match(/shadow-\[/g) ?? []).toHaveLength(2);
        expect(source).toContain("shadow-[inset_0_1px_0_");
        expect(source).toContain("shadow-[inset_0_-1px_0_");
      } else {
        expect(source).not.toContain("shadow-[");
      }
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
      expect(source).not.toMatch(/shadow-(?:md|lg|xl|2xl|raised|overlay|modal|\[)/);
    }
  });

  it("keeps BulkActionBar as an intentional semantic overlay instead of a decorative Card shadow", () => {
    const source = readFileSync(resolve(sourceRoot, "patterns/bulk-action-bar.tsx"), "utf8");
    expect(source).toContain("sticky bottom-4");
    expect(source).toContain("shadow-overlay");
    expect(source).not.toMatch(/shadow-(?:xs|sm|md|lg|xl|2xl)(?:\s|["'])/);
  });

  it("uses one route-family PageHeader before Tabs on normal tabbed task pages", () => {
    const accountRoot = resolve(productsRoot, "gosso-account-settings/index.tsx");
    const systemRoot = resolve(productsRoot, "gosso-system-management/index.tsx");
    const blogAI = resolve(productsRoot, "blog-admin-ai-operations/index.tsx");
    const blogAISettings = resolve(productsRoot, "blog-admin-ai-settings/index.tsx");
    const blogSettings = resolve(productsRoot, "blog-admin-site-settings.tsx");

    for (const file of [accountRoot, systemRoot, blogAI, blogAISettings]) expectHeaderBeforeTabs(file);

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
    const routeFamilies = [
      sourceFiles(resolve(productsRoot, "gosso-account-settings")),
      sourceFiles(resolve(productsRoot, "gosso-system-management")),
      sourceFiles(resolve(productsRoot, "blog-admin-ai-operations")),
      sourceFiles(resolve(productsRoot, "blog-admin-ai-settings")),
      [resolve(productsRoot, "blog-admin-site-settings.tsx")],
    ];

    for (const files of routeFamilies) {
      expect(tabsCount(combined(files.filter((file) => /\.tsx$/.test(file))))).toBe(1);
    }

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

  it("does not echo tab labels as immediate panel headings", () => {
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

  it("uses one open panel-lead grammar across governed tabbed settings pages", () => {
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