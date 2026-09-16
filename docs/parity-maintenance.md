# Showcase Parity Maintenance Contract

Gouno UI, Blog / Blog Admin, and Gosso Admin have completed their Showcase parity hardening passes. Ongoing work therefore follows a maintenance contract rather than reopening migration work for every UI change.

## Source-of-truth chain

```text
Gouno UI primitive / token
        ↓
Canonical Showcase pattern or fixture
        ↓
┌───────────────────────┐
│                       │
Blog / Blog Admin   Gosso Admin
```

Showcase is the canonical composition/reference layer. Product code keeps ownership of routing, authentication, authorization, persistence, network state, security policy, and product-only behavior.

Parity means matching the canonical contract where semantics overlap. It does not mean copying Showcase DOM or moving product-only business rules into Showcase.

## Bidirectional gates

Parity is intentionally checked in both directions.

### Consumer-side gate

Each product parity workflow checks the product candidate against current `rushairer/gouno-ui@main`.

This catches:

- product-local CSS or composition drift;
- product changes that stop using a canonical primitive/pattern correctly;
- stale action grammar or accessible names;
- responsive geometry and overflow regressions;
- a product that still builds but no longer matches the current Showcase contract.

### Producer-side reciprocal gate

Gouno UI runs:

- `.github/workflows/blog-consumer-parity.yml`
- `.github/workflows/gosso-admin-consumer-parity.yml`

Each workflow compares the candidate Gouno UI / Showcase tree with the current consumer `main` branch.

This catches canonical changes that would silently break or visually drift an already-hardened consumer before the Gouno UI change is merged or released.

`scripts/check-parity-maintenance-contract.mjs` guards the existence and essential semantics of these reciprocal workflows. `npm run verify` runs that guard.

## What must trigger a focused parity review

Reopen only the affected parity surface when one of these changes occurs:

1. a structural or material visual change to an exported `@gouno/ui` primitive, token, Theme, Pattern, or Gouno component;
2. a canonical Showcase fixture/pattern changes composition or state ownership;
3. a product introduces a new page family, shell, key state, or canonical composition not covered by current parity scenarios;
4. shared composition changes around `AppShell`, `PageContainer`, `PageHeader`, `Toolbar`, `FilterBar`, `Card`, `Modal`, `Alert`, `Notification`, `Tabs`, or privileged-access patterns;
5. breakpoints, shell width/rhythm, navigation behavior, or overflow ownership changes.

A text-only business copy change, product-only API behavior, or unrelated backend change does not require reopening the full UI hardening corpus unless it affects one of the contracts above.

## Acceptance layers

The maintenance stack remains layered:

1. static/source contract guards;
2. DOM and accessibility semantics;
3. computed-style parity;
4. bounding-box / geometry parity;
5. responsive and no-horizontal-overflow checks;
6. browser interaction acceptance;
7. paired screenshots retained as review evidence.

Paired screenshots are evidence, not the primary assertion mechanism. A broad full-page pixel-baseline suite is intentionally not mandatory because font/browser/content churn would create high-noise failures. If a future deterministic visual-golden smoke suite is added, keep it small and limited to stable canonical surfaces rather than every route/state/theme combination.

## Release and consumer upgrade rule

Producer-side parity does not replace package adoption.

When published `@gouno/ui` behavior changes, consumers continue to pin an exact package version and upgrade through a normal dependency change. The consumer PR must pass its own CI, browser acceptance, and Showcase parity gates before merge.

The expected sequence is:

```text
Gouno UI candidate
  → reciprocal consumer parity
  → merge
  → release immutable npm version when package output changed
  → consumer exact-version upgrade
  → consumer parity + browser acceptance
  → merge consumer main
```

Showcase-only fixture/test changes that do not alter the published package do not require an npm version bump.

## Intentional deviations

A deviation is valid only when product semantics require it. Keep the canonical shared surface identical where possible and document/test the smallest product-only delta.

Examples include product-only routing targets, authentication/security state machines, or a document TOC that has no Showcase equivalent. Do not use an intentional delta as permission for page-local CSS repairs or alternative component grammar.
