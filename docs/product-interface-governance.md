# Gouno Product Interface Governance

Status: binding companion to `docs/design-language.md` for product navigation depth, tabbed-page composition and corpus-level UI consistency.

This document exists because some interface defects are neither a public component API problem nor a page-local styling choice. They sit one level above components: product information architecture, route-family boundaries and the way persistent navigation composes with content surfaces.

Read this together with:

- `docs/design-language.md` for visual hierarchy, surfaces, spacing, elevation and control geometry;
- `docs/product-surface-elevation-audit.md` for the current Showcase business-surface depth classification;
- `docs/product-driven-development.md` for evidence and stop-the-line workflow;
- `docs/abstraction-register.md` for material architecture decisions;
- `docs/api-specification.md` for public React API contracts.

These rules do **not** create new public Pattern/Gouno components. Product IA can be binding while implementation remains product-local.

## External evidence basis

Gouno uses mature systems as evidence, not as an authority:

- Carbon Tabs groups related information within the same context and explicitly says vertical Tabs must not replace navigation. Carbon also recommends other navigation patterns, such as side navigation, when a tab set becomes too large or overloaded.
- Carbon UI Shell defines the left panel as product navigation and uses it for frequently switched secondary destinations. Its guidance separates product navigation depth from page-local Tabs.
- Carbon's documentation navigation guidance notes that a single page-specific tab set can be less discoverable than menu items when those destinations have durable page identity.
- Atlassian Tabs describes Tabs as grouping similar information on the same page.
- WAI-ARIA Tabs establishes that the active `tabpanel` is labelled by its owning `tab`, so a duplicate visible heading is not required merely to identify the panel.

Reference pages:

- https://carbondesignsystem.com/components/tabs/usage/
- https://carbondesignsystem.com/components/UI-shell-left-panel/usage/
- https://gatsby.carbondesignsystem.com/guides/navigation/tabs/
- https://atlassian.design/components/tabs

## PI-01 — Product navigation has a depth budget

Normal application pages get **one persistent page-local Tabs layer**. A second persistent Tabs row is a stop-the-line information-architecture signal, not a styling problem to normalize.

Promote an inner tab family to product/sidebar navigation when most of the following are true:

- its destinations have durable names users can understand independently of the parent page;
- users may want to enter or bookmark those destinations directly;
- the destinations are administration/configuration domains rather than transient views of one task;
- permissions, ownership, status or lifecycle can differ by destination;
- users switch among them repeatedly outside one short workflow;
- the inner tab family remains useful even if the outer tab is removed.

Example:

```text
Avoid
AI 运营
└─ 高级设置 Tab
   └─ Agents | Skills | Tools | 知识库 | 模型连接 | Sandbox 连接器

Prefer
AI Automation
├─ AI 运营
│  └─ 概览 | 待我处理 | 自动化 | 运行中心
└─ AI 设置
   └─ Agents | Skills | Tools | 知识库 | 模型连接 | Sandbox 连接器
```

The second form gives operations and governance different route-family identities and removes a persistent two-dimensional navigation path.

### Allowed lower-level switching

A lower-level switch is allowed when it is **view state inside one bounded task**, not product navigation. Examples include Markdown/Preview in an editor, a table/list view switch, or an inspector mode. Such controls must not masquerade as a second product route family.

Editor workspaces remain an explicit exception under PD-035/PD-036 because their Tabs switch editor views rather than application destinations.

## PI-02 — Tabs name the panel; the panel lead adds context

For a normal route-family task/settings page, use:

```text
PageHeader (route-family H1)
Tabs
Active TabPanel
├─ optional open lead: description / status / actions
└─ content surfaces
```

The active Tab is already the panel identity. Therefore:

- do not immediately repeat the Tab label as a visible H2;
- do not wrap the repeated Tab label + description inside the first Card just to make the Card look complete;
- place concise panel context in an **open lead outside Card/Table/List boundaries**;
- keep active-panel actions in that lead when they apply to the whole panel;
- omit the lead entirely when it adds no information.

The lead is presentation grammar, not a public component contract. Showcase may use a private helper to enforce the grammar; real products may compose it directly.

## PI-03 — Surface-local titles must name surface-local concepts

A Card/Table/List title is valid only when the surface itself owns a distinct concept beneath the active Tab.

Valid:

```text
系统状态 Tab

查看身份服务健康探针……     ← open panel lead

┌ 基础设施健康 ───────────┐  ← H2 belongs to this Card
│ PostgreSQL / Redis       │
└─────────────────────────┘

┌ OpenID Connect 配置 ────┐  ← another distinct H2
│ ...                      │
└─────────────────────────┘
```

Invalid:

```text
基础信息 Tab

┌ 基础信息 ───────────────┐  ← label echo
│ 站点名称、内容定位……    │
│ form fields              │
└─────────────────────────┘
```

A title that merely restates route/Tab identity belongs to navigation, not to the surface. Moving it inside a border does not create a new semantic section.

## PI-04 — Visible elevation uses semantic roles only

Visible depth is a semantic role, never a raw Tailwind shadow size and never an automatic consequence of CSS positioning.

Canonical roles remain:

- `shadow-raised`: deliberately promoted focal surface that is visually detached from peer page content;
- `shadow-overlay`: temporary/floating UI that actually occupies a layer above other content;
- `shadow-modal`: blocking high-depth overlay.

All raw size aliases (`shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`) are compatibility-only and intentionally resolve to no visible shadow. New canonical/product code must not use them as design vocabulary.

`sticky`, `fixed` and `absolute` describe layout behavior; they do **not** by themselves establish elevation. A sticky region may remain part of its owning surface or normal page flow.

`BulkActionBar` is the current proof: it stays sticky for access during selection, but its normal product presentation is contextual ground. Border + opaque card surface separate it from the collection without manufacturing a floating layer. If a future product needs a genuinely detached toolbar that covers unrelated content, that behavior must be admitted explicitly instead of inheriting `shadow-overlay` from `position: sticky`.

Normal Cards, tables, filters, dashboards, lists, form sections, editor frames, navigation, selected/unread states and in-flow feedback stay ground-level. A border, neutral/white box, rounded container or otherwise empty page does not justify a shadow.

The current business-product raised whitelist is deliberately small and is recorded in `docs/product-surface-elevation-audit.md`: the Gosso Overview focal hero and the standalone Gosso authentication card. New visible product elevation is a corpus-level design-language change, not a page-local styling choice.

## PI-05 — New binding rules require a corpus pass, not screenshot patching

A binding rule is adopted only after the governed corpus has been classified and the invariant has automated coverage where practical.

For every new interface-governance rule:

1. fix the triggering page;
2. enumerate all route families and components governed by the same rule;
3. classify each occurrence as conforming, stale or an intentional exception;
4. migrate stale occurrences before continuing normal product work;
5. record exceptions next to the rule or migration evidence;
6. add source/runtime regression coverage for properties that can be mechanically checked;
7. run the complete typecheck/test/package/Showcase gate on exact `main`;
8. review light and dark rendering for rules that source tests cannot prove.

Current automated checks should cover at least:

- one persistent page-local Tabs layer for normal tabbed route families;
- PageHeader-before-Tabs ordering;
- no immediate Tab-label heading echo in governed settings/management pages;
- open panel leads outside Card boundaries where a lead is used;
- semantic elevation ownership, the explicit raised-product whitelist and flat raw shadow aliases;
- sticky product surfaces remaining ground unless a real layer relationship is admitted;
- dense Table action geometry;
- surface edge/radius/padding ownership.

## Review checklist

Before accepting a normal Admin page or route family, ask:

1. Is each persistent navigation layer actually navigation, or is a view-state control being confused with navigation?
2. Does the page contain more than one persistent Tabs layer? If yes, should the inner destinations become sidebar/product routes?
3. Does the active Tab already say the same thing as the first visible heading?
4. Is explanatory copy an open panel lead, or has it been trapped inside a Card only because the Card needed a header?
5. Does every Card-local heading name a concept owned by that Card rather than the route/Tab?
6. Does any normal in-flow surface have visible elevation without a semantic depth role?
7. Is elevation being inferred merely from `sticky`/`fixed`/`absolute`, a border, a white box or an empty background? If yes, keep it ground unless an actual Z-axis relationship can be explained.
8. If a semantic overlay has a shadow, does it actually cover or float above peer content rather than simply remaining visible while scrolling?
9. Has the same rule been scanned across Gosso Admin + Blog Admin rather than fixed only where a screenshot exposed it?
10. Is there a regression gate for the invariant, or a documented reason why only visual review can prove it?

A page that passes component API tests but fails these questions is not interface-conformant.
