# Abstraction Evidence Register

Status: living decision log for product-driven Gouno UI evolution.

This register is evidence, not a second API specification. Read `docs/product-driven-development.md` for the admission process, `docs/architecture.md` for ownership, and `docs/api-specification.md` for public API rules.

## How to use this register

Add or update an entry whenever a migrated product page causes one of these outcomes:

- a Core API is materially extended or corrected;
- a new Pattern or Gouno abstraction is admitted;
- an existing Pattern/Gouno abstraction is revalidated, merged, moved, simplified or removed;
- a repeated block is deliberately kept product-local because the evidence is insufficient or the semantics differ;
- later product evidence overturns an earlier abstraction decision.

Do not record every local JSX block. Record decisions that future agents might otherwise rediscover or contradict.

Each entry should contain:

- **Decision**: short stable name.
- **Status**: `candidate`, `accepted`, `rejected`, `superseded`, or `revisit`.
- **Owner**: `Core`, `Theme`, `Pattern`, `Gouno`, or `Product-local`.
- **Evidence**: concrete product pages/scenarios, not hypothetical examples.
- **Cross-product review**: what was checked in Gosso Admin, Blog Admin, Blog and Gouno UI.
- **Reasoning**: semantic/state/interaction rationale; avoid relying on legacy component names.
- **API impact**: added/changed/removed public API, or `none`.
- **Follow-up**: what later pages should validate or challenge.

## Baseline decisions

### PD-001 — Product-driven evolution process

- **Status:** accepted
- **Owner:** repository process
- **Evidence:** architecture review before the Gosso Admin page-by-page migration phase.
- **Cross-product review:** existing Gouno UI, Gosso Admin, Blog Admin and Blog are all designated as evidence sources; Gosso Admin is the first active migration line.
- **Reasoning:** public abstractions must be discovered from real product semantics and interactions rather than predicted from catalog completeness or copied from legacy component boundaries.
- **API impact:** none.
- **Follow-up:** every product-driven public API change must follow `docs/product-driven-development.md` and add evidence here when it creates a durable decision.

### PD-002 — Migration execution model

- **Status:** accepted
- **Owner:** repository process
- **Evidence:** need to avoid both single-product overfitting and multi-product migration context fragmentation.
- **Cross-product review:** Gosso Admin is the primary implementation line; Blog Admin and relevant Blog pages are prior-art and validation corpora until their own active migration stage.
- **Reasoning:** one active page stream preserves focus, while mandatory cross-product review prevents two legacy products from producing duplicate public abstractions under different names.
- **API impact:** none.
- **Follow-up:** after representative Gosso Admin coverage, start Blog Admin as the next active validation stage and challenge earlier abstractions rather than preserving them automatically.

### PD-003 — Core maturity posture

- **Status:** accepted
- **Owner:** Core governance
- **Evidence:** current Core already spans the main product-agnostic controls, data entry, display, navigation, feedback, layout and overlay domains.
- **Cross-product review:** current product work indicates the next useful signal is real usage rather than additional catalog parity.
- **Reasoning:** Core breadth is sufficient to begin product pressure-testing, but individual APIs remain open to evidence-driven correction. Component count is not a completion metric.
- **API impact:** future Core additions/extensions require real product evidence and API-spec compliance.
- **Follow-up:** do not add Core components solely because another UI library exposes them.

### PD-004 — Minimum pre-accepted product scaffolding

- **Status:** accepted for the start of product validation
- **Owner:** Gouno
- **Evidence:** Showcase product spaces require a shared application/page shell before page-specific migration can begin.
- **Cross-product review:** current Showcase uses the admin shell/page structure across its product workspaces.
- **Reasoning:** `AdminShell`, `AdminPage`, `NavigationGroup` and `navigationItemClass` are treated as the minimum existing product-space scaffolding. Other pre-existing Pattern/Gouno APIs remain provisional and must be revalidated when encountered.
- **API impact:** none in this decision.
- **Follow-up:** real Gosso Admin and Blog Admin pages may still simplify or revise this shell if evidence shows the current contract is wrong.

### PD-005 — Existing Pattern/Gouno APIs are not automatic precedent

- **Status:** accepted
- **Owner:** Pattern/Gouno governance
- **Evidence:** prior speculative abstraction can cause duplicate or overly thin public components even when architecture ownership is technically correct.
- **Cross-product review:** all existing Pattern/Gouno APIs outside the minimum shell are subject to cross-product revalidation when first encountered in migration.
- **Reasoning:** architecture purity answers where an abstraction belongs, not whether it deserves to exist. Existing exports therefore count as prior art, not proof.
- **API impact:** none immediately; future changes may merge, remove, move or simplify public APIs with compatibility assessment.
- **Follow-up:** record each consequential revalidation decision as product pages are migrated.

## Migration evidence

No Gosso Admin page migration decision has been recorded under this process yet.

Add the first page-level entry before or together with the first product-driven public abstraction/API change.
