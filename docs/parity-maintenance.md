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
7. paired screenshots retained as review evidence;
8. a deliberately small canonical visual-golden smoke gate for stable Showcase fixtures.

Paired product/Showcase screenshots remain diagnostic review evidence. Pixel goldens are a final drift detector, not a replacement for semantic, style, geometry, responsive or interaction assertions.

## Canonical visual golden smoke

`.github/workflows/canonical-visual-golden.yml` runs a deterministic Playwright visual gate against accepted Showcase fixtures. The golden set is intentionally **representative rather than exhaustive**: it covers stable product archetypes and adds dark/mobile counterparts only where they materially prove a design-language contract.

The current accepted baseline set contains **23 PNGs**:

- **19 light-theme baselines**
  - Blog: Home, Article Detail, Search, Account Settings;
  - Blog Admin: Dashboard, Posts desktop/mobile, Post Editor;
  - Blog Admin AI Operations: Overview, Inbox, Workflow List, Workflow Detail desktop/mobile, Workflow Editor and Run Center;
  - Gosso Admin: Overview, OAuth2 Clients, Site Settings and Account Settings.
- **4 dark-theme baselines**
  - Blog Admin Posts desktop/mobile;
  - Blog Admin Post Editor desktop;
  - Gosso Admin Site Settings desktop.

The dark set is deliberately a **semantic cross-section**, not a second copy of every light screenshot. New dual-theme baselines are added when a design-language rule depends on surface, border, elevation, focus or state contrast and computed-style parity alone is insufficient evidence.

The suite also performs behavior-only interaction checks, such as Gosso Account Settings → MFA Tab and narrow/mobile Markdown editor round-trips, without creating a PNG for every interaction state.

The visual environment is deterministic:

- GitHub Actions Ubuntu runner;
- Node.js 24;
- isolated `@playwright/test` 1.55.0;
- pinned Chromium from that Playwright release;
- `zh-CN` locale and `Asia/Shanghai` timezone;
- device scale factor `1`;
- desktop `1440×900`, narrow `782×900` and mobile `390×844` canonical viewports;
- explicit Light or Dark theme initialization before navigation;
- `maxDiffPixelRatio: 0.002`.

### Golden matrix policy

Use the smallest matrix that proves the current contract:

- **Collection**: at least one desktop + mobile pair; when selection/surface contrast is binding, include Light + Dark.
- **Settings**: at least one representative page in both Light + Dark; add mobile when layout collapse is non-trivial.
- **Master-Detail / Record Detail**: keep desktop evidence and add mobile where the single-pane collapse is a governed behavior.
- **Dedicated Configuration Editor / Workspace Editor**: keep at least one representative of each editor subtype; add Dark when section/surface hierarchy changed.
- **Modal / Drawer**: add an opened-overlay golden when overlay geometry, safe-area or internal form rhythm changes.
- **Public / Auth**: retain representative standalone/public surfaces when theme hierarchy differs materially from Admin application shells.

Do **not** multiply every route by Desktop × Mobile × Light × Dark. A new baseline must correspond to a governed visual invariant or a recurring regression class.

### Baseline update rule

Normal comparison CI remains read-only and **must never** run `--update-snapshots`.

Baseline regeneration is an explicit, separately gated refresh path in the same workflow:

1. an intentional canonical visual change is reviewed;
2. a commit with the exact message `chore(showcase): refresh canonical visual goldens` triggers the refresh job;
3. only that refresh job receives narrowly scoped `contents: write`;
4. the pinned Playwright environment regenerates snapshots;
5. the workflow commits generated PNGs with `test(showcase): refresh canonical visual goldens`;
6. that follow-up commit re-enters the normal read-only comparison path and must pass.

Before accepting new PNGs:

1. confirm the canonical change is intentional and belongs in Gouno UI / Showcase;
2. review the visual diff rather than accepting changed pixels mechanically;
3. require the normal static/type/unit/build/Showcase gates;
4. require Blog and Gosso reciprocal consumer parity where applicable;
5. regenerate only through the explicit refresh job;
6. require the resulting verification commit to pass the normal Golden comparison.

On CI failure, the HTML report and `test-results/canonical-visual-golden` evidence are retained for 14 days. Product-only routing, authentication, authorization, persistence, API state and security policy are outside the golden contract.

`scripts/check-parity-maintenance-contract.mjs` seals the reciprocal-parity workflow markers, deterministic visual environment, pixel tolerance, accepted baseline set, normal read-only comparison path and the single explicit write-enabled refresh path so the visual gate cannot silently disappear, broaden write permissions or drift away from documentation.

## Release and consumer upgrade rule

Producer-side parity does not replace package adoption.

When published `@gouno/ui` behavior changes, consumers continue to pin an exact package version and upgrade through a normal dependency change. The consumer PR must pass its own CI, browser acceptance, and Showcase parity gates before merge.

The expected sequence is:

```text
Gouno UI candidate
  → reciprocal consumer parity
  → canonical visual golden smoke
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
