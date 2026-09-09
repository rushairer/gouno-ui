# Product Page Migration Fixtures

This directory contains product pages genuinely rebuilt under the product-driven migration process. Read `AGENTS.md`, `docs/product-driven-development.md`, `docs/design-language.md`, and `docs/product-interface-governance.md` before changing a migrated product surface.

A Showcase file existing for a route proves **route-level coverage only**. It does not prove that every real-product action, state transition, permission branch, responsive presentation, failure mode, or management entry point has been migrated. Fidelity is accepted only after direct comparison with the current real product source.

## Current migration phase

- **Gosso Admin:** completed first-product comparison corpus.
- **Blog Admin:** completed second-product comparison corpus after route-level coverage and behavior/detail fidelity hardening.
- **Blog public site:** active migration line. `PublicShell` + Home, discovery and the base ArticleDetail reading surface are represented; community/account families remain active follow-up evidence.

Completed corpora remain live evidence. A later Blog public-site migration may reopen a canonical component or an existing product fixture if it exposes a genuine cross-product defect, but ordinary implementation work no longer advances Blog Admin page by page.

## Blog public route coverage

Current migrated public surfaces:

1. `blog-home.tsx` — `/`, composed with the product-local shared `BlogPublicShellFixture` and `BlogArticleTeaser` grammar.
2. `blog-article-index.tsx` — `/articles` and `/search`; the same mode-driven implementation also contains the route semantics later used by `/categories/:slug` and `/tags/:slug`.
3. `blog-discovery-indexes.tsx` — `/categories`, `/tags`, `/archive`.
4. `blog-article-detail.tsx` — `/articles/:slug`; base reading fidelity covers cover/title/summary, author/date/read/view/like metadata, native-hash TOC, representative rich article content, canonical CodeBlock copy semantics, media, related reading, scroll-progress presentation and preview/loading/error/not-found states.

All public-site catalog entries use `presentation="standalone"`. Showcase navigation tooling may float above the preview, but it must not wrap the public site in `AppShell` or `PageContainer`.

`PublicShell` and article teaser repetition is intentionally shared only inside the Blog Showcase product fixture. It is not a Pattern/Gouno admission event. By contrast, Categories, Tags, Archive and ArticleDetail validate the already-admitted `PageHeader(title, description, actions)` contract because their real route-level title/description semantics match it; this validation does not extend the PageHeader API or turn the rest of the public-site shell into Gouno structure.

Discovery migration uses current canonical APIs rather than restoring older product aliases/feature bags: Core `Card`, `Empty`, `Skeleton`, `SearchField`, `Pagination` and related controls own their narrow contracts, while loading/filtering/navigation/data grouping remain product-local.

### ArticleDetail reading boundary

The first Reading pass intentionally migrates the document/reading contract before community state machines:

- the article is one dominant ground-level reading surface; cover, PageHeader, metadata and body are not split into nested competing Cards;
- ArticleDetail remains inside the product-local `BlogPublicShellFixture`; it does not use `AppShell` or `PageContainer`;
- real heading IDs and `scroll-margin-top` remain product/content responsibilities while canonical `Anchor` supplies the native hash TOC links;
- canonical `CodeBlock` owns the read-only code frame, horizontal overflow and copy feedback while syntax presentation stays caller/product-owned;
- representative paragraphs, H2/H3, lists, blockquote, table, code and figure content validate reading rhythm without admitting a public `MarkdownRenderer`;
- a ground-level sticky TOC aside remains page composition, not a public `TableOfContents` Pattern;
- related reading reuses the Blog product-local article teaser instead of creating a shared Reading Pattern;
- likes/comments/replies/reporting and comment form behavior are deliberately deferred to the next Reading stage so their state machines can be validated independently.

This pass also confirms that a public reading page may use a more spacious internal article rhythm (`p-6 sm:p-8`) because the reading surface owns its content typography/measure. That is a semantic document-content exception and must not be copied back as an application-shell spacing repair.

## Blog Admin route coverage

Completed migrated route families:

1. `blog-admin-dashboard.tsx` — `/admin/dashboard`.
2. `blog-admin-posts.tsx` — `/admin/posts`.
3. `blog-admin-post-editor.tsx` — `/admin/posts/new`, `/admin/posts/:id/edit`.
4. `blog-admin-pages.tsx` — `/admin/pages`.
5. `blog-admin-page-editor.tsx` — `/admin/pages/new`, `/admin/pages/:id/edit`.
6. `blog-admin-categories.tsx` — `/admin/categories`.
7. `blog-admin-tags.tsx` — `/admin/tags`.
8. `blog-admin-comments.tsx` — `/admin/comments`.
9. `blog-admin-notifications.tsx` — `/admin/notifications`.
10. `blog-admin-media-library.tsx` — `/admin/media`.
11. `blog-admin-users.tsx` — `/admin/users`.
12. `blog-admin-site-settings.tsx` — `/admin/settings`.
13. `blog-admin-ai-operations/` — `/admin/ai-ops` operations route family.
14. `blog-admin-ai-settings/` — `/admin/ai-settings` governance/configuration route family.

### AI Operations and AI Settings are intentionally separate

The current real `gouno-blog` application mounts both `/admin/ai-ops` and `/admin/ai-settings`. The migration keeps the target information architecture split between operational work and stable governance/configuration.

The split is:

- **AI Operations:** Overview, Inbox, Automation, Workflow/Agent Records; user work is discovery, decision, execution, and evidence review.
- **AI Settings:** Agents, Skills, Tools, Knowledge/Embedding, Model Connections, Sandbox Connectors; user work is stable governance/configuration.

Do not restore the historical nested `Advanced` navigation merely to match old source structure. Migrate capabilities into the correct target route family instead.

The fidelity pass preserves management entry points after this IA split. Current fixtures cover, among other behavior:

- Agent create/edit/delete, enable/disable and run entry points;
- Skill create/import/export/copy/edit/delete;
- model connection create/import/export/edit/delete/test and default text/image assignment;
- Embedding profile create/edit/delete/test plus retry/rebuild index controls;
- Connector profile create/edit and OAuth/Mock OAuth state;
- Connector Outbox enqueue, approval, mock delivery, retry and revoke;
- Workflow create/edit/enable/disable/delete as well as run/dry-run/rollback;
- newly launched Workflow runs entering the current Run Center evidence fixture rather than linking to a nonexistent run.

All of these remain **static Showcase behavior**. No real API key, OAuth credential, Agent execution, Connector network call, or product mutation is permitted here.

## Fidelity acceptance rule

For each migrated product route, compare the current real product source with the Showcase fixture across these dimensions before treating the route as fidelity-complete:

1. route/page identity and product-navigation depth;
2. primary and secondary action entry points;
3. create/edit/delete/enable/disable or equivalent management lifecycle where present;
4. filtering, search, pagination and selection semantics;
5. destructive confirmation and partial-failure retention where the product supports it;
6. loading, empty, fatal-error and non-fatal error states;
7. permission and recent-MFA/Sudo branches;
8. desktop and mobile/responsive presentations when they materially differ;
9. deep links and evidence continuity between related screens;
10. accessibility/keyboard/focus semantics that belong to the product interaction;
11. displayed Showcase source matching the rendered implementation;
12. current binding design-language and product-interface rules.

A catalog value of `100` means the **currently audited/proven route scope** is coherent. It is not a permanent parity certificate. If a later real-page comparison finds an omitted behavior, fix the fixture and focused tests before relying on that value again.

## Product composition grammar

Normal application-shell task/settings pages use:

```text
PageHeader (route-family H1)
Tabs, when the route family needs one persistent page-local navigation layer
Active panel lead, only when it adds context/actions
Content surfaces
```

Binding consequences:

- `PageHeader` appears before page-local Tabs.
- The active Tab already labels its panel; do not immediately echo the same wording as an H2.
- Panel-wide description/status/actions may use an open lead outside Card/Table/List boundaries.
- A Card-local heading must name a real Card-local concept.
- Normal surfaces share the current 24px edge axis; do not use `Card padding="lg"`, `p-5`, or `p-8` as an alignment repair.
- One semantic collection normally owns one dominant surface boundary.
- Visible elevation uses semantic roles only; product code does not choose raw shadow sizes.

Editor workspaces are an explicit exception. PostEditor and PageEditor use command-bar/editor grammar with Markdown/preview view-state Tabs rather than the normal task-page `PageHeader → Tabs → content` anatomy. Their state machines and inspectors remain product-local until independent product evidence proves a shared public contract.

Public Blog pages are a different product family. Do not wrap them in `AppShell` or copy Admin page grammar merely for visual consistency. Start from their real document/navigation/reading semantics and promote only independently proven shared contracts. A spacious public reading surface is likewise not precedent for changing the normal application-shell edge axis.

## Current cross-product evidence

### PageHeader

Posts, Members, Comments, Categories, Tags, Pages, Notifications, Media, Site Settings and AI workspaces validate the admitted Gouno `PageHeader` contract without expanding it into product policy. Public Blog Categories, Tags, Archive and ArticleDetail now validate the same narrow route/document title + description responsibility in a standalone content shell. This strengthens the contract while confirming that `PageHeader` does not imply `AppShell` ownership.

### Anchor and CodeBlock

ArticleDetail is the first product fixture that consumes both reading-triggered Core hardening results together. `Anchor` remains a native-hash navigation primitive with target spacing owned by headings; `CodeBlock` keeps one canonical code string while syntax presentation remains caller-owned. Their coexistence inside one article does not create `ArticleShell`, `MarkdownRenderer`, `TableOfContents` or a generic Reading Pattern.

### BulkActionBar

Posts, Comments and Categories supplied the independent evidence that admitted canonical `BulkActionBar`. Tags, Pages, Notifications and Media validate the same small contract across different presentations. The Pattern owns toolbar semantics, selected-context presentation and cancel-selection; products own selection state and business actions.

Do not recreate a broad Legacy `DataTable`, `ResponsiveList`, `FilterBar`, `AsyncState`, AI workspace, editor feature bag, public-site shell or reading feature bag merely because several pages contain similar markup. Compare user intent, state, lifecycle, accessibility, responsive behavior and failure semantics first.

### Sudo/MFA

Members and Site Settings exercise distinct Blog-owned recent-MFA/Sudo workflows. This remains product-local policy; it is not a public Gouno Pattern merely because several Blog Admin pages use it.

## Fixture tooling

`FixtureDock` is Showcase development tooling, never product UI.

- Route labels, scenario switches and static-fixture markers stay outside normal product layout.
- Product feedback stays in the product surface using canonical feedback components.
- Fixture controls do not count as abstraction-admission evidence.
- Static fixtures may model state transitions, but they must never call real services or retain real secrets.

## Conformance and delivery

When a fidelity pass changes a binding visual/composition rule, run the DL-07/PI-05 corpus pass rather than fixing only the triggering page. Keep focused product tests synchronized with the real behavior being claimed.

A migration/hardening phase is not complete merely because code was pushed. Exact `main` must pass:

```bash
npm run typecheck
npm test -- --run
npm run build
npm run showcase:build
```

When Showcase output changed, the corresponding GitHub Pages publication must also complete successfully for the expected `main` SHA.
