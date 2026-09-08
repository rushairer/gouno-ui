# Product Page Migration Fixtures

This directory contains only product pages genuinely migrated under the product-driven process.

Follow `docs/product-driven-development.md` rather than copying historical abstractions. New migrated pages should begin with Core + Theme + admitted Gouno structure supplied by the Showcase shell, keep uncertain composition product-local, and record durable abstraction decisions in `docs/abstraction-register.md`.

## Gosso Admin coverage

The Gosso Admin Showcase covers every user-facing route family with static fixtures:

1. `gosso-overview.tsx` — Overview `/`.
2. `gosso-account-settings.tsx` — Account Settings `/account-settings/:tab`.
3. `gosso-system-management/` — System Management `/system-management/:tab`.
4. `gosso-auth/` — Login, forgot/reset password and OAuth callback standalone identity routes.
5. `gosso-auth/not-found.tsx` — application-family Not Found state.

Gosso Admin is now the completed comparison corpus while Blog Admin is the active migration line.

## Blog Admin coverage

Blog Admin is the active second-product validation workspace. The current migrated pages are:

1. `blog-admin-posts.tsx` — Posts `/admin/posts`, including filters, loading/error/empty states, desktop Table, mobile list presentation, selection/batch actions, pagination and destructive confirmation.
2. `blog-admin-users.tsx` — Members & Roles `/admin/users`, including Blog-local membership/role semantics, desktop Table/mobile Cards, edit role/name, suspend/restore, ownership transfer and product-local Sudo/MFA security states.
3. `blog-admin-site-settings.tsx` — Site Settings `/admin/settings`, including all five real settings groups, RSS validation, favicon/Hero upload semantics, dirty/save lifecycle, loading/error states and product-local Sudo/MFA protection.
4. `blog-admin-comments.tsx` — Comments `/admin/comments`, including status/reported filters, moderation queue, selection/batch delete, AI workflow entry, destructive confirmation and loading/error/empty states.
5. `blog-admin-categories.tsx` — Categories `/admin/categories`, including taxonomy Table, selection/batch workflows, create/edit Drawer, AI Slug assistance, destructive confirmation and loading/error/empty states.
6. `blog-admin-tags.tsx` — Tags `/admin/tags`, including responsive Card Grid, rename/merge, selection/batch delete, partial batch failure with failed-item retention, AI workflow entry and loading/error/empty states.
7. `blog-admin-pages.tsx` — Pages `/admin/pages`, including search/status filters, desktop Table/mobile list presentation, path/template/navigation metadata, pagination, single/batch deletion and AI workflow entry.
8. `blog-admin-notifications.tsx` — Notifications `/admin/notifications`, including status/type filters, notification Card queue, unread/read state transitions, product-owned selected actions, global clear operations and loading/error/empty states.

The Posts migration was rechecked after PD-023/PD-024. Its normal application surfaces conform to the shared surface contract; the one spacious `Card padding="lg"` is intentionally limited to the contained `Empty` result surface and is not an application alignment precedent. `tests/design-language-conformance.test.ts` protects every currently migrated Blog Admin page from drifting back to accidental 20px/32px normal application insets.

Posts and Members independently reuse admitted `PageHeader` without expanding its API. Comments, Categories, Tags, Pages and Notifications continue validating the same route-header contract across moderation-list, taxonomy-table, Card-Grid, responsive collection and notification-queue workflows. Resource-management mechanics repeat, but the surrounding presentations remain intentionally different; this continues to reject restoration of one broad Legacy `DataTable`, `ResponsiveList`, `FilterBar` or `AsyncState` feature bag.

Do not collapse Gosso identity users and Blog members into one page/domain abstraction merely because both render a user-like table. Gosso manages identity-platform accounts; Blog Admin manages product membership, roles and high-privilege product actions. Shared abstractions must come from smaller stable presentation/interaction contracts, not from similar nouns or screenshots.

Dense desktop Table row actions are governed by DL-09: repeated row actions use one compact icon-action structural family, stay on one line and let Core Table horizontal overflow own width pressure. Danger changes semantic color rather than control structure. This rule is protected across Blog Posts/Categories/Pages/Members and Gosso Users/OAuth Clients; it deliberately does not create a public `RowActions`, `ActionGroup` or DataTable abstraction.

Blog Admin Site Settings independently revalidates the Gosso Site Settings full-bleed sticky action anatomy: `Card padding="none"` owns border/radius/clipping while `CardContent` and `CardFooter` own their own insets. Cross-product repetition strengthens PD-024, but Core Card anatomy already expresses the stable structure, so there is still no evidence that a `StickyFormFooter` or `SaveBar` Pattern would add meaningful behavior rather than wrap class names.

Real Blog `SudoGate` prior art appears in multiple Blog-owned high-privilege areas, and Members plus Site Settings exercise two distinct real workflows in Showcase. The Rule-of-Three review threshold is satisfied, but public admission remains deferred: all evidence is still Blog-owned and tightly coupled to GOSSO recent-MFA/Sudo policy.

### First admitted Pattern: BulkActionBar

Posts, Comments and Categories are three independently rebuilt routes with different surrounding UI, yet all converge on the same selection-aware bulk interaction: selected-context label, accessible `role="toolbar"`, arbitrary product actions, explicit cancel-selection and sticky bottom visibility. This is the first repeated contract that is meaningfully more than layout classes, so PD-028 admits canonical `BulkActionBar` under `@gouno/ui/patterns`.

The Pattern stays deliberately small. It owns toolbar semantics/presentation and cancel affordance; the product owns selection state and every business action. AI, publish, delete, resource type and workflow-launcher concepts remain children/product code. Legacy `onAIAssist` and non-standard `ariaLabel` are not restored.

Tags, Pages and Notifications are later validation cases after admission. Tags proves the Pattern across a responsive Card Grid and partial batch failure; Pages proves it alongside responsive Table/mobile-list filtering and pagination; Notifications changes the selected action set to `标为已读` + `批量删除` inside a Card-based state machine. All three fit the same canonical API unchanged. Partial-failure state, page resource keys, read-state transitions and every other domain semantic remain product-owned.

The next high-value Blog Admin target is **Media Library `/admin/medialibrary`**. It combines a media Card Grid with upload, AI text-to-image and Alt Text Drawers, reference-aware destructive confirmation and partial batch failure, making it the next stronger Core/Pattern pressure test. Do not restore Legacy `onAIAssist`; AI remains an ordinary product-owned child action.

A product-page catalog value of `100` means that the individual Showcase fixture is complete for the migrated route scope; it never means the entire Blog Admin product space has been migrated.

## Per-page acceptance guard

A new Showcase migration is not accepted merely because every individual Core/Gouno prop is valid. Before a page is marked complete, perform an explicit composition-level conformance pass against the current binding design language and the already-migrated comparison corpus.

- Check every applicable rule in `docs/design-language.md`; a component API may permit several variants while the product corpus intentionally permits only one composition in a given context.
- Compare the new page with already-migrated pages from the same surface family for spacing, action hierarchy, responsive behavior, feedback semantics and state presentation.
- For dense desktop Table row actions, DL-09 is mandatory: one compact structural action family, no wrapping, and width pressure belongs to Core Table overflow.
- Once a Pattern is admitted, use it on semantically matching later pages before re-inventing equivalent product-local composition; do not expand the Pattern just to avoid local product code.
- If the new page exposes a missing design-language constraint, stop the line, update the binding rule, fix the governed corpus and add/extend conformance coverage before resuming migration.
- If the difference is genuinely product-local, document or preserve it rather than weakening a shared rule to make the page match mechanically.

This guard closes an important distinction exposed by the first Blog/Gosso row-action drift: **API-valid composition is necessary but not sufficient for design-language conformance.**

## Showcase fixture tooling

Fixture controls are development tooling, not product UI. Route labels, scenario switches and `静态 Fixture` markers must not consume normal product-layout space or be styled as if they belonged to the real application.

- Use the Showcase-private `FixtureDock` for route/state metadata and scenario controls that need to remain quickly accessible.
- The dock is fixed outside normal document flow and defaults visually compact; its popover may temporarily overlay the preview when opened.
- Do not reproduce route/status fixture banners inside `PageContainer`, Cards, forms or authentication surfaces.
- Do not use `FixtureDock` as Pattern/Gouno evidence. It belongs to Showcase tooling under PD-009/PD-021.
- Real product feedback still belongs in the product surface and uses canonical components such as `Alert`; only simulation metadata belongs in the dock.

## Gosso Admin product-level design grammar

Gosso Admin intentionally has two surface families. They should be internally consistent, but they must not be forced into one layout merely for visual uniformity.

### Application-shell pages

Application pages render inside canonical `AppShell` + `PageContainer`.

- Task/settings page families use the stable product grammar `route Tabs when needed → PageHeader → content surfaces`; Showcase fixture context floats outside that grammar in `FixtureDock`.
- `PageHeader` owns route-level title, description and page actions. Cards own content grouping, not the route title. A contained result/error Card uses local `Heading`/`Text` instead of nesting `PageHeader`.
- Overview is an intentional landing-page exception in **composition**, not in the normal horizontal content axis: its Hero and peer quick-link surfaces still use the shared 24px application-surface edge inset.
- Normal application-shell `Card`, bordered `Table` and self-surfaced `List` content starts on the shared 24px edge axis. Do not introduce `padding="lg"`, `p-5` or `p-8` merely to make one page feel more prominent or to repair alignment.
- A larger/spacious inset is allowed only for a semantic exception such as an intentionally spacious standalone/result/reading surface; document the exception where the page is defined rather than letting it become accidental precedent.
- Not Found remains in the application page family, but its centered error Card is a contained result surface rather than a task-page header layout.
- Persistent in-flow success/info/warning/error feedback uses canonical `Alert`; do not recreate Alert semantics with one-off subtle Cards.
- Resource tables rely on Core `Table` for horizontal overflow. Do not add redundant responsive wrappers merely for product consistency.
- `tests/design-language-conformance.test.ts` protects the completed Gosso application corpus from drifting back to 20px/32px normal surface insets. If an intentional exception is added, document its semantics instead of weakening the normal-axis rule globally.

### Standalone identity pages

Login, password recovery/reset and OAuth callback preserve their real standalone route structure.

- `AuthSurface` is a Gosso-product-local fixture helper, not a public Gouno abstraction.
- Identity cards share the same width, H1 title hierarchy and surface treatment. Showcase route/scenario metadata is no longer embedded in the card.
- Login/Callback scenario controls are exposed through the Showcase-private `FixtureDock`, keeping the authentication card visually equivalent to the real product surface.
- Validation errors, informational transitions and successful authentication fixtures use the matching Alert semantic type instead of one generic feedback color.
- `StandaloneNavigation` belongs only to Showcase tooling. It defaults expanded so standalone routes remain easy to navigate, but it does not change the real product surface contract.

### Language and status policy

- User-facing product state labels should use the product locale consistently (`正常`, `已暂停`, `异常`, etc.).
- Protocol identifiers and standardized OAuth/OIDC vocabulary may remain in English where preserving the exact technical term improves comprehension (`Issuer`, `Grant Types`, `Scopes`, `Public`, `Confidential`).
- Do not create decorative color alternation that implies hierarchy where none exists; repeated peer navigation cards use one icon treatment unless semantics differ.

### Consistency review rule

When a new Gosso page or state is added, compare it with its own surface family first: page grammar, heading hierarchy, content hierarchy, spacing, action prominence, surface/radius treatment, state controls, feedback semantics, terminology and responsive behavior. Fix same-product drift locally before using Gosso as evidence for Blog Admin or a public Pattern/Gouno abstraction.

When a binding rule in `docs/design-language.md` changes, do not only fix the page that exposed it. Run the DL-07 corpus-conformance pass across every already-migrated governed Gosso application surface, fix stale call sites, document real exceptions and keep the automated conformance test synchronized.

Blog Admin is now the active second-product validation workspace. It must challenge Gosso-derived assumptions rather than mechanically copy the Gosso product-local grammar. Blog remains empty until its own real pages are migrated.
