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

Blog Admin migration starts with the real resource-management surface that creates the strongest cross-product pressure:

1. `blog-admin-posts.tsx` — Posts `/admin/posts`, including filters, loading/error/empty states, desktop Table, mobile list presentation, selection/batch actions, pagination and destructive confirmation.

The Posts migration reuses admitted `PageHeader`, but filter bars, bulk actions, responsive resource-list composition and DataTable-like behavior remain product-local until additional Blog Admin pages prove a smaller stable shared contract.

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
- Overview is an intentional landing-page exception: its prominent identity/role hero is page content rather than a task-page `PageHeader`.
- Not Found remains in the application page family, but its centered error Card is a contained result surface rather than a task-page header layout.
- Persistent in-flow success/info/warning/error feedback uses canonical `Alert`; do not recreate Alert semantics with one-off subtle Cards.
- Resource tables rely on Core `Table` for horizontal overflow. Do not add redundant responsive wrappers merely for product consistency.

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

Blog Admin is now the active second-product validation workspace. It must challenge Gosso-derived assumptions rather than mechanically copy the Gosso product-local grammar. Blog remains empty until its own real pages are migrated.
