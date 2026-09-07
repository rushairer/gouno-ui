# Abstraction Evidence Register

Status: living decision log for product-driven Gouno UI evolution.

This register is evidence, not a second API specification. Read `docs/product-driven-development.md` for admission, `docs/architecture.md` for ownership, and `docs/api-specification.md` for public API rules.

## How to use this register

Add or update an entry whenever a migrated product page or architecture review causes one of these outcomes:

- a Core API is materially extended or corrected;
- a new Pattern or Gouno abstraction is admitted;
- an abstraction is revalidated, merged, moved, simplified, quarantined or removed;
- repeated code is deliberately kept product-local because evidence is insufficient or semantics differ;
- later product evidence overturns an earlier decision.

Do not record every local JSX block. Record decisions that future agents might otherwise rediscover or contradict.

Each entry should contain:

- **Decision**: short stable name.
- **Status**: `candidate`, `accepted`, `rejected`, `superseded`, or `revisit`.
- **Owner**: `Core`, `Theme`, `Pattern`, `Gouno`, `Product-local`, or repository process.
- **Evidence**: concrete product pages/scenarios, not hypothetical examples.
- **Cross-product review**: what was checked in Gosso Admin, Blog Admin, Blog, canonical Gouno UI and Legacy.
- **Reasoning**: semantic/state/interaction rationale; avoid relying on legacy names.
- **API impact**: added/changed/removed public API, or `none`.
- **Follow-up**: what later pages should validate or challenge.

## Baseline decisions

### PD-001 — Product-driven evolution process

- **Status:** accepted
- **Owner:** repository process
- **Evidence:** architecture review before the Gosso Admin page-by-page migration phase.
- **Cross-product review:** canonical Gouno UI, Gosso Admin, Blog Admin and Blog are designated evidence sources; Gosso Admin is the first active migration line.
- **Reasoning:** public abstractions must be discovered from real product semantics/interactions rather than predicted from catalog completeness or copied from legacy component boundaries.
- **API impact:** none.
- **Follow-up:** product-driven public API changes follow `docs/product-driven-development.md` and record durable decisions here.

### PD-002 — Migration execution model

- **Status:** accepted
- **Owner:** repository process
- **Evidence:** need to avoid both single-product overfitting and multi-product context fragmentation.
- **Cross-product review:** Gosso Admin is the primary implementation line; Blog Admin and relevant Blog pages are prior-art/validation corpora until their own active stage.
- **Reasoning:** one active page stream preserves focus, while mandatory cross-product review prevents separate legacy products from producing duplicate public abstractions under different names.
- **API impact:** none.
- **Follow-up:** after representative Gosso Admin coverage, start Blog Admin as the next active validation stage and challenge earlier abstractions rather than preserving them automatically.

### PD-003 — Core maturity posture

- **Status:** accepted
- **Owner:** Core governance
- **Evidence:** Core already spans the main product-agnostic controls, data entry, display, navigation, feedback, layout and overlay domains.
- **Cross-product review:** current product work indicates that real usage is more valuable than additional catalog parity.
- **Reasoning:** Core breadth is sufficient to begin product pressure-testing, but individual APIs remain open to evidence-driven correction. Component count is not a completion metric.
- **API impact:** future Core additions/extensions require real product evidence and API-spec compliance.
- **Follow-up:** do not add Core components solely because another UI library exposes them.

### PD-004 — Minimum pre-admitted product structure

- **Status:** accepted for the start of product validation
- **Owner:** Gouno
- **Evidence:** Showcase product spaces and real admin products require a shared application chrome and page content track before page-specific migration begins.
- **Cross-product review:** the same shell/container responsibilities are useful to the Gouno UI Showcase, Gosso Admin and Blog Admin without requiring administration semantics in the component names.
- **Reasoning:** `AppShell`, `PageContainer`, `NavigationGroup` and `navigationItemClass` are the minimum admitted Gouno structure. `AppShell` owns application chrome/responsive navigation/focus return; `PageContainer` owns only content width and vertical rhythm. Other historical Pattern/Gouno abstractions are not automatic precedent.
- **API impact:** canonical names are `AppShell` and `PageContainer`; the former `AdminShell`/`AdminPage` naming is superseded by PD-007.
- **Follow-up:** real Gosso Admin and Blog Admin pages may still simplify or revise these contracts if evidence shows they are wrong.

### PD-005 — Existing Pattern/Gouno implementations are not automatic precedent

- **Status:** accepted
- **Owner:** Pattern/Gouno governance
- **Evidence:** prior speculative abstraction can create duplicate or overly thin public components even when layer ownership is technically correct.
- **Cross-product review:** historical Pattern/Gouno implementations remain available under `src/legacy` for prior-art review when relevant product pages are migrated.
- **Reasoning:** architecture purity answers where an admitted abstraction belongs, not whether it deserves to exist. Historical implementations therefore count as evidence, not proof.
- **API impact:** pre-validation Pattern/Gouno APIs outside the minimum structure are removed from canonical public entries and quarantined under `src/legacy`; no Legacy package path is published.
- **Follow-up:** record each consequential re-admission, rejection, merge or replacement decision as product pages create real demand.

## Migration evidence

### PD-006 — Gosso Admin Overview remains Core-first and page-local

- **Status:** accepted
- **Owner:** Product-local
- **Evidence:** Gosso Admin `/` (`gosso-admin-frontend/src/pages/Home.tsx`) at source commit `f9466f3c103cd7a40e24ec90556a359331e2adc8`, including administrator and regular-user render paths.
- **Cross-product review:** no new public abstraction or material Core capability was proposed, so no public-admission review was triggered. Historical dashboard/template abstractions were deliberately not used as implementation precedent. Blog Admin and Blog remain comparison corpora for any later attempt to generalize the page hero, quick navigation or role notice.
- **Reasoning:** the page can be reconstructed with existing Core `Card`, `Button`, `ButtonLink`, `Heading`, `Text`, `Tag`, `Segmented`, semantic native links and local Tailwind composition. The legacy `QuickCard` helper is useful within one page, but three data instances on one page are not evidence of a public Pattern/Gouno component. Administrator/user differences are represented as Showcase fixture state rather than application session logic.
- **API impact:** none. No Pattern/Gouno component was added and no Core API was expanded.
- **Follow-up:** when later Gosso Admin or Blog Admin pages expose semantically similar action-card navigation, compare intent, state, responsive behavior and accessibility. The third semantically equivalent page occurrence triggers review rather than automatic extraction.

### PD-007 — Canonical/Legacy separation and neutral application-structure naming

- **Status:** accepted
- **Owner:** repository process / Gouno
- **Evidence:** after the first real Gosso Admin page migration, the source tree and Showcase still mixed pre-validation Pattern/Gouno APIs and simulated business pages with canonical work. `AdminShell` and `AdminPage` also encoded an administration context that was not necessary to their actual structural responsibilities.
- **Cross-product review:** the shell/content-track responsibilities are useful across the Gouno UI Showcase, Gosso Admin and Blog Admin; Blog remains a distinct public product corpus. Historical `DataTable`, Toast, Feedback, templates, Panel/PageHeader and status components remain inspectable as prior art but are not required by the first real migrated page.
- **Reasoning:** physical source organization should communicate confidence. Canonical directories must mean “admitted and usable”; historical speculative abstractions belong in a non-public quarantine. `AppShell` is the established neutral term for application chrome, while `PageContainer` precisely describes the old `AdminPage` component's actual width/rhythm responsibility without implying business domain. Product workspace navigation must represent actual migration, not old demo inventions.
- **API impact:** rename `AdminShell` → `AppShell` and `AdminPage` → `PageContainer`; keep `NavigationGroup`/`navigationItemClass`; remove unverified Pattern/Gouno exports from canonical entries; move their source snapshots to `src/legacy`; remove simulated product pages from Showcase; remove `DataTable` from the Core Showcase because it was never Core-owned; expose Theme and canonical Gouno sections explicitly in the Gouno UI workspace.
- **Follow-up:** the canonical Pattern layer intentionally remains empty until real pages justify a Pattern. Gosso Admin continues one real page at a time. Any Legacy idea must pass the same admission checklist as a new abstraction before reappearing publicly.

### PD-008 — Gosso Admin Account Settings stays Core-first across five security workflows

- **Status:** accepted
- **Owner:** Product-local
- **Evidence:** Gosso Admin `/account-settings/:tab` (`AccountSettings.tsx`, `ProfilePanel.tsx`, `PasswordPanel.tsx`, `MFAPanel.tsx`, `PasskeysPanel.tsx`, `SessionsPanel.tsx`) at source commit `f9466f3c103cd7a40e24ec90556a359331e2adc8`. The migrated Showcase page covers Profile, Password, MFA, Passkeys and Sessions as one route-backed page family with static fixtures.
- **Cross-product review:** this page did not require a new public Pattern/Gouno abstraction or material Core expansion. Historical `Panel`, `PanelHeader`, `PlainSection`, `DefinitionList`, `Feedback`, `ListStack`, `AsyncState`, `DataTable`, `StatusBadge`, Toast and confirmation helpers were reviewed as Legacy prior art because the source page used those concepts. Canonical Core already provides the necessary product-agnostic behavior through `Card`, `Tabs`, `FormField`, `Input`, `Button`, `IconButton`, `Tag`, `Alert`, `Modal`, `QRCode`, `Empty` and `Table`; therefore Blog Admin/Blog admission review was not triggered.
- **Reasoning:** the five tabs share one product route family but contain materially different workflows: profile editing, password mutation, TOTP enrollment/status, WebAuthn credential management and session revocation. Reintroducing historical wrapper names would mainly compress markup rather than establish a stable cross-product semantic contract. The Sessions tab deliberately uses Core `Table` because the real page exposes a small read/action table with no demonstrated sorting/filtering/pagination model; this is not evidence for re-admitting the historical `DataTable` Pattern. Confirmation behavior is represented by a page-local Modal composition until repeated product evidence proves a reusable lifecycle contract.
- **API impact:** none. No canonical public API was added, restored, renamed or expanded. The Pattern layer remains intentionally empty.
- **Follow-up:** migrate System Management next. Its clients/users/audit/system tabs are expected to provide stronger evidence around data-table orchestration, status presentation, destructive confirmation and repeated surface structure. If those semantics recur across later Gosso Admin and Blog Admin pages, perform the Rule-of-Three abstraction review instead of restoring Legacy by name.
