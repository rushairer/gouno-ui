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

The Posts migration was rechecked after PD-023/PD-024. Its normal application surfaces conform to the shared surface contract; the one spacious `Card padding="lg"` is intentionally limited to the contained `Empty` result surface and is not an application alignment precedent. `tests/design-language-conformance.test.ts` now protects both migrated Blog Admin pages from drifting back to accidental 20px/32px normal application insets.

Posts and Members both independently reuse admitted `PageHeader` without expanding its API. They also both need responsive resource presentation, but this is not yet evidence for restoring Legacy `DataTable`, `ResponsiveList`, `FilterBar`, `BulkActionBar` or `AsyncState`. The current evidence says that resource-management mechanics repeat; it does not yet prove one stable public feature-bag boundary.

Do not collapse Gosso identity users and Blog members into one page/domain abstraction merely because both render a user-like table. Gosso manages identity-platform accounts; Blog Admin manages product membership, roles and high-privilege product actions. Shared abstractions must come from smaller stable presentation/interaction contracts, not from similar nouns or screenshots.

Real Blog `SudoGate` prior art currently appears in multiple Blog-owned high-privilege areas (including Members, Site Settings and advanced/AI administration). That is sufficient to trigger review, but not to admit a public Pattern: all current evidence is still one product family and tightly coupled to GOSSO step-up/MFA policy. Keep the security gate product-local until independent product evidence proves a product-agnostic interaction contract.

The next high-value Blog Admin target is Site Settings. It should challenge both PD-024 full-bleed/sticky action anatomy and the repeated Sudo/MFA gate before any shared form/security Pattern is considered.

A product-page catalog value of `100` means that the individual Showcase fixture is complete for the migrated route scope; it never means the entire Blog Admin product space has been migrated.

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
