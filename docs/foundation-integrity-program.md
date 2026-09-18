# Gouno UI Foundation Integrity Program

Status: active, binding remediation program.
Program id: **FI-001**
Started: 2026-09-18

This program exists because a component can have an API, Showcase demo, tests and historical review evidence while still failing to own the corresponding design-system decision. Foundation completion therefore cannot be inferred from component completion.

The machine-readable source of progress is `foundation-integrity.json`. Chat history and screenshots are evidence inputs, not the progress ledger.

## Objective

Re-certify the Gouno UI foundation from the bottom up:

```text
Theme / Tokens
      ↓
Core primitives
      ↓
Gouno structure + admitted Patterns
      ↓
Canonical Showcase corpus
      ↓
Blog / Blog Admin / Gosso Admin consumers
```

A Foundation is complete only when design authority is explicit, bypasses are audited, the corpus conforms, regression guards exist, representative visuals are certified, and real consumers remain compatible.

## Seven mandatory gates

| Gate | Question |
| --- | --- |
| Inventory | Have owners, public APIs, tokens, direct utility bypasses and product usages been enumerated? |
| Tokens | Are stable semantic values owned by Theme/tokens rather than page-local literals? |
| Authority | Is there one canonical API/role for the decision, with extension points that cannot silently erase the invariant? |
| Corpus | Have Showcase product fixtures been migrated or explicitly classified as intentional exceptions? |
| Guard | Can static/runtime tests prevent the known bypass or regression class from returning? |
| Visual | Are representative Light/Dark and responsive cases certified where the rule is visual? |
| Consumers | Do reciprocal Blog/Gosso checks pass after the canonical change? |

Only **7/7** permits `certified`. Any discovered Foundation defect reopens affected reviews immediately.

## Foundation workstreams

Typography, Spacing, Sizing, Radius, Color, Elevation, Surface, Border, Layout, Responsive behavior, Density, Motion, Focus, Overlay/layering, Interaction state, Accessibility.

Existing Design Language rules are evidence, not automatic certification. A rule can be correct while its authority or corpus is still incomplete.

## Execution order

### Phase 0 — Governance and measurable progress

- create this durable program and `foundation-integrity.json`;
- add `lint:foundation` to `npm run verify`;
- prevent a non-certified Foundation from leaving affected component reviews marked `reviewed`;
- report passed gates / total gates on every verification run.

Exit: progress ledger is machine checked on every main push.

### Phase 1 — Typography Foundation

1. Define semantic visual roles independently from HTML heading levels.
2. Add typography tokens for size, line-height, weight and tracking.
3. Redesign Core `Heading` / `Text` authority without breaking semantic host control.
4. Remove `PageHeader` heading-size override.
5. Define nested vs standalone Dedicated Editor heading semantics.
6. Align Card/section/panel title roles and audit Public Blog reading exceptions.
7. Migrate raw product heading utilities or document deliberate reading exceptions.
8. Add static corpus guards.
9. Refresh representative Goldens.
10. Require Blog/Gosso parity.

Exit: Typography 7/7, affected reviews re-certified.

### Phase 2 — Geometry Foundations

Audit and harden Spacing, Sizing, Radius, Border, Layout and Density. No page-local utility may redefine a canonical control/surface geometry contract.

### Phase 3 — Visual Semantic Foundations

Audit and harden Color, Elevation and Surface. Existing DL-10/DL-16 evidence is re-validated rather than grandfathered.

### Phase 4 — Interaction Foundations

Audit Responsive behavior, Motion, Focus, Overlay/layering and Interaction state, including keyboard/focus geometry and reduced-motion behavior.

### Phase 5 — Accessibility Foundation

Re-certify semantic structure, naming, focus, forms, tables, overlays and heading outlines across representative product corpora.

### Phase 6 — Corpus and consumer re-certification

Run corpus-wide guards, Golden matrix, Blog Consumer Parity and Gosso Admin Consumer Parity. No Foundation may be declared complete with consumer regressions outstanding.

## Progress rules

- `foundation-integrity.json` is the sole numeric progress source.
- A gate becomes `passed` only with repository evidence.
- `in_progress` is not counted as passed.
- `blocked` must name blocking evidence/work.
- A Foundation may be `planned`, `reopened`, `in_progress` or `certified`.
- `certified` requires every gate `passed`.
- A non-certified Foundation with `affectedComponentReviews` requires those review entries to be explicitly `reopened`.
- Stage commits update the ledger in the same phase that changes evidence.

## Current execution

Typography is the first reopened Foundation. Inventory is already proven by current source, while tokens, authority and corpus are actively being corrected. All other Foundations remain deliberately unclaimed until their own inventory pass is performed.

The first concrete defect set is:

- Core `Heading.level` currently couples semantic element and visual scale.
- Gouno `PageHeader` overrides an H1 from Core `text-3xl` to `text-2xl`.
- Dedicated Editor relies on H2 default scale but has no explicit nested/standalone title-role contract.
- Product fixtures still contain raw `h1/h2/h3 + text-*` heading authority.
- `CardTitle` and product-local region headings express useful visual roles but those roles are not yet named in the Typography system.
- Existing Typography tests prove rendering/API behavior but do not prevent canonical role bypass.

These findings reopen Typography certification immediately.
