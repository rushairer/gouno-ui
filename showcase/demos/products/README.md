# Product Page Migration Fixtures

This directory contains product pages genuinely rebuilt under the product-driven migration process. Read `AGENTS.md`, `docs/product-driven-development.md`, `docs/design-language.md`, and `docs/product-interface-governance.md` before changing a migrated product surface.

A Showcase file existing for a route proves **route-level coverage only**. It does not by itself prove every real-product action, state transition, permission branch, responsive presentation, failure mode, management entry point or accessibility behavior. Fidelity is accepted only after direct comparison with the current real product source.

## Current migration phase

- **Gosso Admin:** completed first-product comparison corpus.
- **Blog Admin:** completed second-product comparison corpus after route-level coverage and behavior/detail fidelity hardening.
- **Gouno Blog public site:** completed third-product comparison corpus after PublicShell/Home, discovery, ArticleDetail reading/community, About/CustomPage documents, account Notifications/Settings and final NotFound route-family validation.
- **No active fourth-product migration line is selected.** Completed fixtures stay live as regression/comparison evidence and are reopened only when a real new product or a discovered canonical defect requires it.

## Blog public route coverage

Current completed public surfaces:

1. `blog-home.tsx` — `/`, composed with the product-local `BlogPublicShellFixture` and `BlogArticleTeaser` grammar.
2. `blog-article-index.tsx` — `/articles`, `/search`, plus category/tag detail modes used by `/categories/:slug` and `/tags/:slug`.
3. `blog-discovery-indexes.tsx` — `/categories`, `/tags`, `/archive`.
4. `blog-article-detail.tsx` — `/articles/:slug`; reading fidelity covers cover/title/summary, author/date/read/view metadata, native-hash TOC, representative rich content, Core `CodeBlock`, media, related reading, preview/loading/error/not-found and the attached product-local community state machine.
5. `blog-document-pages.tsx` — fixed `/about` plus dynamic `/:slug` CustomPage document states; the two pages share only a Blog-local document surface while dynamic lifecycle remains page-owned.
6. `blog-account-pages.tsx` — `/account/notifications` and `/account/settings`; notifications/read transitions and Blog-local profile/preference editing stay product-owned while password/MFA/Passkey/session policy stays in GOSSO.
7. `blog-not-found.tsx` — final unresolved-route fallback under `BlogPublicShellFixture`.

Compatibility redirects `/notifications` → `/account/notifications` and `/settings` → `/account/settings` remain route policy only; they do not create duplicate Showcase pages.

All public-site catalog entries use `presentation="standalone"`. Showcase navigation tooling may float above the preview, but it must not wrap the public site in `AppShell` or `PageContainer`.

`PublicShell`, article teaser, document surface and community/account orchestration are intentionally shared only inside the Blog product fixture where appropriate. None is a Pattern/Gouno admission event. By contrast, Categories, Tags, Archive, ArticleDetail, CustomPage and account task pages may validate already-admitted narrow Core/Gouno contracts where their real semantics match; that validation does not automatically expand those APIs.

### ArticleDetail reading/community boundary

The final ArticleDetail corpus preserves two separately owned layers:

- the article is one dominant ground-level reading surface; cover, PageHeader, metadata and body are not split into nested competing Cards;
- ArticleDetail stays inside product-local `BlogPublicShellFixture`; it does not use `AppShell` or `PageContainer`;
- heading IDs and `scroll-margin-top` stay content responsibilities while Core `Anchor` supplies real hash links;
- Core `CodeBlock` owns read-only code frame, horizontal overflow and copy feedback while syntax presentation stays caller-owned;
- representative paragraph/H2/H3/list/blockquote/table/code/figure content validates reading rhythm without a public `MarkdownRenderer`;
- sticky TOC remains page composition, not a `TableOfContents` Pattern;
- related reading reuses the same-product article teaser;
- like/comment/reply/report/comment-form state is implemented product-locally and composes existing Core controls rather than admitting Community/Reading feature bags.

A public reading page may use a more spacious internal article rhythm because the document surface owns its content typography/measure. That is a semantic reading exception and is not precedent for changing the normal application-shell edge axis.

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

The real application mounts both `/admin/ai-ops` and `/admin/ai-settings`. The migration keeps operational execution/evidence separate from stable governance/configuration. Do not restore the historical nested `Advanced` navigation merely to match old source structure.

Current static fixtures preserve management entry points including Agent lifecycle/run entry, Skill import/export/edit/delete, model-connection lifecycle/test/default assignment, Embedding profile lifecycle/test/rebuild, Connector profile/OAuth/Outbox flows and Workflow lifecycle/run/dry-run/rollback. No real API key, OAuth credential, Agent execution, Connector network call or product mutation is permitted here.

## Fidelity acceptance rule

For each migrated product route, compare current real product source with the Showcase fixture across these dimensions before treating the route as fidelity-complete:

1. route/page identity and product-navigation depth;
2. primary and secondary action entry points;
3. create/edit/delete/enable/disable or equivalent lifecycle where present;
4. filtering, search, pagination and selection semantics;
5. destructive confirmation and partial-failure retention where supported;
6. loading, empty, fatal-error and non-fatal error states;
7. permission and recent-MFA/Sudo branches;
8. desktop and mobile/responsive presentations when materially different;
9. deep links and evidence continuity between related screens;
10. accessibility/keyboard/focus semantics;
11. displayed Showcase source matching rendered implementation;
12. current binding design-language and product-interface rules.

A catalog value of `100` means the **currently audited/proven route scope** is coherent. It is not a permanent parity certificate. If a later comparison finds omitted behavior, fix the fixture and focused tests before relying on that value again.

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

Editor workspaces are an explicit exception. PostEditor and PageEditor use command-bar/editor grammar with Markdown/preview view-state Tabs rather than normal task-page anatomy. Their state machines and inspectors remain product-local until independent evidence proves a shared public contract.

Public Blog pages are a different product family. Do not wrap them in `AppShell` or copy Admin page grammar merely for visual consistency. Start from document/navigation/reading/account semantics and promote only independently proven shared contracts.

## Current cross-product evidence

### PageHeader

Posts, Members, Comments, Categories, Tags, Pages, Notifications, Media, Site Settings and AI workspaces validate admitted Gouno `PageHeader`. Public Blog discovery/document/account surfaces additionally validate its narrow route/document title + description/actions responsibility where applicable, while confirming that `PageHeader` does not imply `AppShell` ownership.

### Anchor and CodeBlock

ArticleDetail consumes both reading-triggered Core hardening results together. `Anchor` remains a native-hash navigation primitive with target spacing owned by headings; `CodeBlock` keeps one canonical code string while syntax presentation remains caller-owned. Their coexistence does not create `ArticleShell`, `MarkdownRenderer`, `TableOfContents` or a generic Reading Pattern.

### BulkActionBar

Posts, Comments and Categories supplied the independent evidence that admitted canonical `BulkActionBar`. Tags, Pages, Notifications and Media validate the same small contract across different presentations. The Pattern owns toolbar semantics, selected-context presentation and cancel-selection; products own selection state and business actions.

Do not recreate broad Legacy `DataTable`, `ResponsiveList`, `FilterBar`, `AsyncState`, AI workspace, editor feature bag, public-site shell, reading feature bag, document feature bag or account feature bag merely because several pages contain similar markup. Compare user intent, state, lifecycle, accessibility, responsive behavior and failure semantics first.

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
