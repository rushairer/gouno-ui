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
  resolve(productsRoot, "gosso-admin/overview.tsx"),
  ...sourceFiles(resolve(productsRoot, "gosso-admin/account-settings")),
  ...sourceFiles(resolve(productsRoot, "gosso-admin/system-management")),
].filter((file) => /\.(tsx?|jsx?)$/.test(file));

const blogAdminApplicationFiles = [
  resolve(productsRoot, "blog-admin/dashboard.tsx"),
  resolve(productsRoot, "blog-admin/posts.tsx"),
  resolve(productsRoot, "blog-admin/post-editor.tsx"),
  resolve(productsRoot, "blog-admin/categories.tsx"),
  resolve(productsRoot, "blog-admin/tags.tsx"),
  resolve(productsRoot, "blog-admin/pages.tsx"),
  resolve(productsRoot, "blog-admin/page-editor.tsx"),
  resolve(productsRoot, "blog-admin/comments.tsx"),
  resolve(productsRoot, "blog-admin/notifications.tsx"),
  resolve(productsRoot, "blog-admin/media-library.tsx"),
  resolve(productsRoot, "blog-admin/users.tsx"),
  resolve(productsRoot, "blog-admin/site-settings.tsx"),
  ...sourceFiles(resolve(productsRoot, "blog-admin/ai/operations")),
  ...sourceFiles(resolve(productsRoot, "blog-admin/ai/settings")),
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
    const overview = readFileSync(resolve(productsRoot, "gosso-admin/overview.tsx"), "utf8");
    expect(overview).toContain("px-6 py-5");
    expect(overview).toContain('<Card padding="base" variant="elevated"');
    expect(overview).toContain("<Card");
    expect(overview).toContain("interactive");
    expect(overview).toContain('padding="none"');
    expect(overview).not.toContain("shadow-surface");
    expect(overview).not.toContain("hover:shadow-raised");
    expect(overview).not.toContain("shadow-sm");
    expect(overview).not.toContain("shadow-md");
  });

  it("uses explicit Card anatomy for full-bleed sticky actions across products", () => {
    const siteSettingsFiles = [
      resolve(productsRoot, "gosso-admin/system-management/site-settings.tsx"),
      resolve(productsRoot, "blog-admin/site-settings.tsx"),
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
      resolve(productsRoot, "blog-admin/dashboard.tsx"),
      resolve(productsRoot, "blog-admin/posts.tsx"),
      resolve(productsRoot, "blog-admin/categories.tsx"),
      resolve(productsRoot, "blog-admin/pages.tsx"),
      resolve(productsRoot, "blog-admin/users.tsx"),
      resolve(productsRoot, "gosso-admin/system-management/users.tsx"),
      resolve(productsRoot, "gosso-admin/system-management/clients.tsx"),
    ];

    for (const file of actionFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).toContain("min-w-max flex-nowrap");
    }

    const systemActions = readFileSync(resolve(productsRoot, "gosso-admin/system-management/shared.tsx"), "utf8");
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
      "gosso-admin/auth/not-found.tsx",
      "gosso-admin/auth/shared.tsx",
      "gosso-admin/overview.tsx",
    ]);
  });

  it("keeps semantic surface and raised shadows component-owned across product fixtures", () => {
    const manualSemanticShadowFiles = allProductFiles
      .filter((file) =>
        /\\bshadow-(?:control|surface|raised|overlay|modal)\\b/.test(
          readFileSync(file, "utf8"),
        ),
      )
      .map((file) => relative(productsRoot, file).replaceAll("\\", "/"))
      .sort();

    expect(manualSemanticShadowFiles).toEqual([]);
    const overview = readFileSync(resolve(productsRoot, "gosso-admin/overview.tsx"), "utf8");
    expect(overview).toContain("interactive");
    expect(overview).toContain('padding="none"');
    expect(overview).not.toContain("shadow-surface");
    expect(overview).not.toContain("hover:shadow-raised");
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
    const showcaseCss = readFileSync(resolve(repoRoot, "showcase/styles/showcase.css"), "utf8");
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
    const accountRoot = resolve(productsRoot, "gosso-admin/account-settings/index.tsx");
    const blogAI = resolve(productsRoot, "blog-admin/ai/operations/index.tsx");
    const blogAISettings = resolve(productsRoot, "blog-admin/ai/settings/index.tsx");
    const blogSettings = resolve(productsRoot, "blog-admin/site-settings.tsx");

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

    const accountShared = readFileSync(resolve(productsRoot, "gosso-admin/account-settings/shared.tsx"), "utf8");
    const managementFiles = sourceFiles(resolve(productsRoot, "gosso-admin/system-management"))
      .filter((file) => !file.endsWith("index.tsx") && /\.tsx$/.test(file));
    expect(accountShared).not.toContain("PageHeader");
    for (const file of managementFiles) {
      expect(readFileSync(file, "utf8")).not.toContain("PageHeader");
    }
  });

  it("enforces a one-persistent-Tabs navigation budget for normal route families", () => {
    const tabbedRouteFamilies = [
      sourceFiles(resolve(productsRoot, "gosso-admin/account-settings")),
      sourceFiles(resolve(productsRoot, "blog-admin/ai/operations")),
      sourceFiles(resolve(productsRoot, "blog-admin/ai/settings")),
      [resolve(productsRoot, "blog-admin/site-settings.tsx")],
    ];

    for (const files of tabbedRouteFamilies) {
      expect(tabsCount(combined(files.filter((file) => /\.tsx$/.test(file))))).toBe(1);
    }

    const systemManagement = combined(sourceFiles(resolve(productsRoot, "gosso-admin/system-management")));
    expect(tabsCount(systemManagement)).toBe(0);

    const aiOps = combined(sourceFiles(resolve(productsRoot, "blog-admin/ai/operations")));
    const aiSettingsRoot = readFileSync(resolve(productsRoot, "blog-admin/ai/settings/index.tsx"), "utf8");
    const aiSettingsSections = readFileSync(resolve(productsRoot, "blog-admin/ai/settings/sections.tsx"), "utf8");
    expect(aiOps).not.toContain("AIOpsAdvancedPanel");
    expect(aiOps).not.toContain('key: "advanced"');
    expect(aiSettingsRoot).toContain("<Tabs<AISettingsSection>");
    expect(aiSettingsSections).not.toContain("<Tabs");

    // PostEditor owns one persistent document-navigation Tabs. Edit/split/preview is
    // view state owned by the shared MarkdownEditor rather than a second navigation tier.
    const postEditor = readFileSync(resolve(productsRoot, "blog-admin/post-editor.tsx"), "utf8");
    expect(tabsCount(postEditor)).toBe(1);
    expect(postEditor).toContain("<Tabs<NavigatorMode>");
    expect(postEditor).toContain("<MarkdownEditor");
    expect(postEditor).not.toContain("<Tabs<EditorMode>");
    expect(postEditor).not.toContain("<PageHeader");

    // PageEditor has no document-navigation tier. Edit/split/preview is the same
    // MarkdownEditor view state and therefore must not consume a persistent Tabs tier.
    const pageEditor = readFileSync(resolve(productsRoot, "blog-admin/page-editor.tsx"), "utf8");
    expect(tabsCount(pageEditor)).toBe(0);
    expect(pageEditor).toContain("<MarkdownEditor");
    expect(pageEditor).not.toContain("<Tabs<EditorMode>");
    expect(pageEditor).not.toContain("<PageHeader");
  });

  it("does not echo tab or route labels as immediate content headings", () => {
    const accountEchoes = [
      ["gosso-admin/account-settings/profile.tsx", 'title="个人资料"'],
      ["gosso-admin/account-settings/password.tsx", 'title="修改密码"'],
      ["gosso-admin/account-settings/mfa.tsx", 'title="多因素认证 (MFA)"'],
      ["gosso-admin/account-settings/security.tsx", 'title="通行密钥 (FIDO2)"'],
      ["gosso-admin/account-settings/security.tsx", 'title="活跃会话"'],
    ] as const;
    const managementEchoes = [
      ["gosso-admin/system-management/clients.tsx", 'title="OAuth2 客户端"'],
      ["gosso-admin/system-management/users.tsx", 'title="用户管理"'],
      ["gosso-admin/system-management/audit-logs.tsx", 'title="审计日志"'],
      ["gosso-admin/system-management/site-settings.tsx", 'title="站点设置"'],
      ["gosso-admin/system-management/system-status.tsx", 'title="系统状态"'],
    ] as const;

    for (const [path, echo] of [...accountEchoes, ...managementEchoes]) {
      expect(readFileSync(resolve(productsRoot, path), "utf8")).not.toContain(echo);
    }

    const blogSettings = readFileSync(resolve(productsRoot, "blog-admin/site-settings.tsx"), "utf8");
    for (const title of ["基础信息", "网站图标", "首页 Hero 标语与插图", "公开联系方式", "默认 SEO"]) {
      expect(blogSettings).not.toContain(`title="${title}"`);
    }

    const aiSettings = readFileSync(resolve(productsRoot, "blog-admin/ai/settings/sections.tsx"), "utf8");
    expect(aiSettings).not.toContain("<CardTitle>Agents</CardTitle>");
    expect(aiSettings).not.toContain("<CardTitle>Tools</CardTitle>");

    const systemStatus = readFileSync(resolve(productsRoot, "gosso-admin/system-management/system-status.tsx"), "utf8");
    expect(systemStatus).toContain('<Heading level={2} variant="compact">基础设施健康</Heading>');
    expect(systemStatus).toContain('return <Card padding="base"><Heading level={2} variant="compact"');
  });

  it("uses one open content-lead grammar across governed settings and management pages", () => {
    const lead = readFileSync(resolve(repoRoot, "showcase/components/tab-panel-lead.tsx"), "utf8");
    const account = readFileSync(resolve(productsRoot, "gosso-admin/account-settings/shared.tsx"), "utf8");
    const system = readFileSync(resolve(productsRoot, "gosso-admin/system-management/shared.tsx"), "utf8");
    const blogSettings = readFileSync(resolve(productsRoot, "blog-admin/site-settings.tsx"), "utf8");
    const aiSettings = readFileSync(resolve(productsRoot, "blog-admin/ai/settings/sections.tsx"), "utf8");

    expect(lead).toContain('data-slot="showcase-tab-panel-lead"');
    expect(lead).toContain("min-h-9");
    expect(lead).toContain('size="sm"');
    expect(lead).toContain('data-slot="showcase-tab-panel-feedback"');
    expect(lead).not.toContain("<Card");
    expect(account).toContain("<TabPanelLead");
    expect(account).toContain("<TabPanelFeedback>{feedback}</TabPanelFeedback>");
    expect(system).toContain("ManagementPanelLead = TabPanelLead");
    expect(system).toContain("ManagementPanelFeedback = TabPanelFeedback");
    expect(blogSettings).toContain("<TabPanelLead description={description} />");
    expect(blogSettings).not.toMatch(/<SettingsSurface\b[^>]*\btitle=/);
    expect(aiSettings).toContain("<TabPanelLead");
    expect(aiSettings).toContain("<TabPanelFeedback>");
  });

  it("keeps top-level tab feedback between the panel lead and business content", () => {
    const aiRoot = readFileSync(resolve(productsRoot, "blog-admin/ai/settings/index.tsx"), "utf8");
    const aiSettings = readFileSync(resolve(productsRoot, "blog-admin/ai/settings/sections.tsx"), "utf8");

    const rootLead = aiRoot.indexOf("<AISettingsSectionLead");
    const privilegedFeedback = aiRoot.indexOf("<PrivilegedAccessGate", rootLead);
    const rootBody = aiRoot.indexOf("{sectionPanel}", privilegedFeedback);
    expect(rootLead).toBeGreaterThanOrEqual(0);
    expect(privilegedFeedback).toBeGreaterThan(rootLead);
    expect(rootBody).toBeGreaterThan(privilegedFeedback);

    const agentStart = aiSettings.indexOf("function AgentList");
    const agentFeedback = aiSettings.indexOf("<TabPanelFeedback>", agentStart);
    const agentContent = aiSettings.indexOf('<Card padding="none" className="overflow-hidden">', agentFeedback);
    expect(agentFeedback).toBeGreaterThan(agentStart);
    expect(agentContent).toBeGreaterThan(agentFeedback);

    const knowledgeStart = aiSettings.indexOf("function KnowledgePanel");
    const knowledgeFeedback = aiSettings.indexOf("<TabPanelFeedback>", knowledgeStart);
    const knowledgeMetrics = aiSettings.indexOf('<div className="grid gap-4 sm:grid-cols-3">', knowledgeFeedback);
    expect(knowledgeFeedback).toBeGreaterThan(knowledgeStart);
    expect(knowledgeMetrics).toBeGreaterThan(knowledgeFeedback);
  });

  it("keeps governed management alerts in the shared feedback slot", () => {
    const files = [
      "gosso-admin/system-management/clients.tsx",
      "gosso-admin/system-management/users.tsx",
      "gosso-admin/system-management/audit-logs.tsx",
      "gosso-admin/system-management/site-settings.tsx",
      "gosso-admin/system-management/system-status.tsx",
    ];

    for (const path of files) {
      const source = readFileSync(resolve(productsRoot, path), "utf8");
      const lead = source.indexOf("<ManagementPanelLead");
      const feedback = source.indexOf("<ManagementPanelFeedback", lead);
      expect(lead, path).toBeGreaterThanOrEqual(0);
      expect(feedback, path).toBeGreaterThan(lead);
    }

    const audit = readFileSync(resolve(productsRoot, "gosso-admin/system-management/audit-logs.tsx"), "utf8");
    expect(audit.indexOf("<ManagementPanelFeedback")).toBeLessThan(audit.indexOf('<Card padding="sm">'));
  });

  it("binds list CRUD and Dedicated Editor subtypes to the governed composition grammar", () => {
    const aiSettings = readFileSync(resolve(productsRoot, "blog-admin/ai/settings/index.tsx"), "utf8");
    const aiEditors = readFileSync(resolve(productsRoot, "blog-admin/ai/settings/editors.tsx"), "utf8");
    const automation = readFileSync(resolve(productsRoot, "blog-admin/ai/operations/automation-management.tsx"), "utf8");
    const workflowEditor = readFileSync(resolve(productsRoot, "blog-admin/ai/operations/workflow-editor.tsx"), "utf8");
    const postEditor = readFileSync(resolve(productsRoot, "blog-admin/post-editor.tsx"), "utf8");
    const pageEditor = readFileSync(resolve(productsRoot, "blog-admin/page-editor.tsx"), "utf8");

    expect(aiSettings).toContain('data-pattern="dedicated-list-editor"');
    expect(aiSettings).toContain("<DedicatedEditorLead");
    expect(aiSettings).toContain('data-pattern="contextual-list-editor"');
    expect(aiSettings).toContain("<Drawer");
    expect(aiEditors).toContain("DedicatedEditorLayout");
    expect(aiEditors).toContain("DedicatedEditorSection");
    expect(aiEditors).toContain("DedicatedEditorActions");
    expect(aiEditors).toContain('surface?: AISettingsEditorSurface');
    expect(aiEditors).toContain('id="ai-settings-provider-editor"');
    expect(aiEditors).toContain('id="ai-settings-embedding-editor"');
    expect(aiEditors).toContain('id="ai-settings-connector-editor"');
    expect(automation).toContain('data-pattern="dedicated-list-editor"');
    expect(automation).toContain("<DedicatedEditorLead");
    expect(automation).toContain("返回 Workflow 详情");
    expect(workflowEditor).toContain("DedicatedEditorLayout");
    expect(workflowEditor).toContain("DedicatedEditorSection");
    expect(workflowEditor).toContain("DedicatedEditorActions");
    expect(workflowEditor).not.toContain("<CardTitle");
    expect(postEditor).toContain('data-pattern="dedicated-workspace-editor"');
    expect(pageEditor).toContain('data-pattern="dedicated-workspace-editor"');
  });

  it("keeps product interface governance discoverable and machine-enforced", () => {
    const agents = readFileSync(resolve(repoRoot, "AGENTS.md"), "utf8");
    const governance = readFileSync(resolve(repoRoot, "docs/product-interface-governance.md"), "utf8");

    expect(agents).toContain("docs/product-interface-governance.md");
    expect(governance).toContain("## PI-01 — Product navigation has a depth budget");
    expect(governance).toContain("## PI-02 — Tabs name the panel; the panel lead adds context");
    expect(governance).toContain("## PI-04 — Visible elevation uses semantic roles only");
    expect(governance).toContain("## PI-05 — New binding rules require a corpus pass, not screenshot patching");
    expect(governance).toContain("## PI-06 — Master-detail is a task pattern, not a generic list/detail default");
    expect(governance).toContain("## PI-07 — List-triggered create/edit uses complexity-based editor surfaces");
    expect(governance).toContain("## PI-08 — Common admin data blocks use governed composition contracts");
    expect(governance).toContain("## PI-09 — Editor forms share one cross-surface composition grammar");
    expect(governance).toContain("Configuration Editor");
    expect(governance).toContain("Workspace Editor");
    const dedicatedEditor = readFileSync(resolve(repoRoot, "docs/patterns/dedicated-editor.md"), "utf8");
    expect(dedicatedEditor).toContain("Dedicated Editor is a **composition pattern**");
    expect(dedicatedEditor).toContain("Do not add `DedicatedEditor` to `src/patterns`");
    const designLanguage = readFileSync(resolve(repoRoot, "docs/design-language.md"), "utf8");
    expect(designLanguage).toContain("## DL-15 — Page composition uses ordered semantic slots");
    expect(designLanguage).toContain("## DL-16 — Bounded business sections use canonical surface anatomy");
  });
  it("keeps editor forms and Workflow detail on canonical section surfaces", () => {
    const aiEditors = readFileSync(resolve(productsRoot, "blog-admin/ai/settings/editors.tsx"), "utf8");
    const automation = readFileSync(resolve(productsRoot, "blog-admin/ai/operations/automation-management.tsx"), "utf8");
    const workflowExecution = readFileSync(resolve(productsRoot, "blog-admin/ai/operations/workflow-execution.tsx"), "utf8");
    const gossoSiteSettings = readFileSync(resolve(productsRoot, "gosso-admin/system-management/site-settings.tsx"), "utf8");

    expect(aiEditors).toContain("EditorFormSurfaceSection");
    expect(aiEditors).not.toContain("function EditorSection(");
    expect(automation).not.toContain("rounded-xl border bg-background");
    expect(automation).toMatch(/<Card[\s\S]{0,160}padding="none"[\s\S]{0,160}aria-label="Workflow 资产"/);
    expect(automation).toContain('aria-label="最近运行"');
    expect(automation).toContain('aria-label="Workflow 流程定义"');
    expect(workflowExecution).not.toMatch(/rounded-(?:lg|xl) border bg-background/);
    expect(workflowExecution).toMatch(/<Card[^>]*data-slot="workflow-run-surface"/);
    expect(workflowExecution).toMatch(/<Card[^>]*aria-label="Workflow 版本历史"/);
    expect(gossoSiteSettings).toContain('aria-label="登录页预览"');
  });

});
