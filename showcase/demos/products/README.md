# Product Page Migration Fixtures

This directory contains only product pages genuinely migrated under the product-driven process.

Follow `docs/product-driven-development.md` rather than copying historical abstractions. New migrated pages should begin with Core + Theme + admitted Gouno structure supplied by the Showcase shell, keep uncertain composition product-local, and record durable abstraction decisions in `docs/abstraction-register.md`.

## Gosso Admin coverage

The current Gosso Admin Showcase covers every user-facing route family with static fixtures:

1. `gosso-overview.tsx` — Overview `/`.
2. `gosso-account-settings.tsx` — Account Settings `/account-settings/:tab`.
3. `gosso-system-management/` — System Management `/system-management/:tab`.
4. `gosso-auth/` — Login, forgot/reset password and OAuth callback standalone identity routes.
5. `gosso-auth/not-found.tsx` — application-family Not Found state.

## Gosso Admin product-level design grammar

Gosso Admin intentionally has two surface families. They should be internally consistent, but they must not be forced into one layout merely for visual uniformity.

### Application-shell pages

Application pages render inside canonical `AppShell` + `PageContainer`.

- Task/settings page families use the stable grammar `Showcase fixture context → route Tabs when needed → PageHeader → content surfaces`.
- `PageHeader` owns route-level title, description and page actions. Cards own content grouping, not the route title.
- Overview is an intentional landing-page exception: its prominent identity/role hero is page content rather than a task-page `PageHeader`.
- Not Found remains in the application page family.
- Showcase-only fixture controls may use local strips/panels, but they are not evidence for public Pattern/Gouno APIs.

### Standalone identity pages

Login, password recovery/reset and OAuth callback preserve their real standalone route structure.

- `AuthSurface` is a Gosso-product-local fixture helper, not a public Gouno abstraction.
- Identity cards share the same width, icon/title hierarchy, surface treatment and route fixture footer.
- Scenario-only fixture controls such as Login mode and Callback state are supplied through `AuthSurface.fixtureControl` and are anchored to the authentication card's top-center edge. Do not position them independently against the viewport.
- `StandaloneNavigation` belongs only to Showcase tooling. It defaults expanded so standalone routes remain easy to navigate, but it does not change the real product surface contract.

### Consistency review rule

When a new Gosso page or state is added, compare it with its own surface family first: page grammar, content hierarchy, spacing, action prominence, surface/radius treatment, state controls and responsive behavior. Fix same-product drift locally before using Gosso as evidence for Blog Admin or a public Pattern/Gouno abstraction.

Blog Admin and Blog remain separate validation workspaces until their own real pages are migrated. They should challenge Gosso-derived assumptions rather than mechanically copy this product-local grammar.
