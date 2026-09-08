# Gouno UI Design Language

Status: binding visual-composition contract for canonical Gouno UI and migrated product surfaces.

Decision record: **PD-023 — Single Surface + Shared Edge Inset**. This document is the durable specification for that decision and future visual-composition rules.

This document governs visual structure that is too durable to leave as page-local taste but is not itself a public React API contract.

- `docs/product-driven-development.md` decides when real product evidence requires design-system work.
- `docs/architecture.md` decides layer ownership and dependency direction.
- `docs/api-specification.md` decides public API naming, state and behavior.
- This document defines cross-component visual composition invariants such as surfaces, spacing ownership and alignment.
- `docs/abstraction-register.md` records abstraction evidence; this visual decision is identified here as PD-023 because it governs composition rather than introducing a public abstraction.

## DL-01 — One semantic region, one dominant surface boundary

A semantic section or collection should expose one dominant perceivable boundary by default.

`Card`, bordered `Table`, and bordered/list-group containers are peer surface choices. Do not wrap a self-surfaced Table/List in another Card merely to create padding, alignment, radius or background.

Prefer:

```text
PageHeader

┌──────── standalone Table / List ────────┐
│ content                                 │
├─────────────────────────────────────────┤
│ content                                 │
└─────────────────────────────────────────┘
```

Avoid without additional semantics:

```text
PageHeader

┌──────── Card ───────────────────────────┐
│  ┌──── bordered Table / List ────────┐ │
│  │ content                           │ │
│  └───────────────────────────────────┘ │
└────────────────────────────────────────┘
```

A nested surface is justified only when the outer surface owns additional semantic structure such as its own section header, explanatory body, persistent actions/footer, independent state or visually meaningful grouping. Even then, prefer full-bleed inner content or a single shared boundary over two adjacent borders/radii when the inner collection is the main body.

## DL-02 — Surface boundary and content alignment are separate concerns

Do not add a container boundary just to align content.

Normal product/admin surfaces share a common edge inset for their first and last primary content. The current base edge inset is `24px` (`spacing-6`). This is the visual axis used by normal `Card` content and normal bordered collection surfaces.

Compact surfaces may use `16px` (`spacing-4`) when density is an explicit compact mode.

The edge inset governs the distance from the outer surface boundary to the first/last meaningful content. It does **not** require every internal gap or table column to use the same value.

A landing/dashboard composition may differ in typography, elevation, background treatment and vertical rhythm without inventing a different horizontal content axis. A normal application-surface Hero therefore uses the same base edge inset unless a genuinely different spacious reading/result surface is intentionally documented.

## DL-03 — Preserve data density inside aligned Tables

Table edge alignment and internal column density are separate axes.

For normal/touch bordered Tables:

- first column left edge: `24px`;
- last column right edge: `24px`;
- intermediate cell horizontal padding remains the Table density default (`16px` today).

For compact bordered Tables:

- first/last surface edge inset: `16px`;
- intermediate cell horizontal padding remains compact (`12px` today).

Do not increase every Table cell to 24px merely to align the outer content axis. This would reduce useful data density without improving the surface boundary relationship.

Unbordered/open Tables are allowed to follow their local/open-layout density because no explicit surface boundary exists to align against.

## DL-04 — Standalone list rows follow the same edge axis

When a List is itself the surface (border/radius/background/dividers), its rows should place the first and last primary content on the same edge inset as peer normal surfaces: `24px` by default, `16px` for an explicitly compact surface.

A self-surfaced list should not acquire an outer Card solely to obtain this inset. Put the inset on the rows/list anatomy that owns it.

## DL-05 — Cards express grouping, not generic page padding

`Card` is a semantic visual grouping surface. Its default/base padding (`24px`) establishes the normal surface content axis.

Use a Card when its boundary communicates meaningful grouping. Do not use Card as a generic replacement for page gutters or as an alignment shim around another complete surface.

Task-page `PageHeader` remains outside content surfaces unless the title is genuinely card-local. Open layouts, direct Table/List surfaces and Cards may coexist as peer children under one page composition.

`Card padding="lg"` is a deliberate spacious-surface choice, not the default for an application page. Use it only when a larger inset is part of the semantic presentation (for example, an intentionally spacious standalone/result/reading surface). Do not use it merely because a page is visually important.

## DL-06 — Structural spacing versus content spacing

PD-020 remains binding: compound components own structural spacing between their semantic regions; content regions own their own internal content rhythm.

This rule and the surface rules are complementary:

- page/container gutter aligns peer regions at the page level;
- surface edge inset aligns content inside a boundary;
- compound structural gap separates semantic slots;
- content spacing arranges business content inside a slot.

Do not solve a defect in one level by adding arbitrary margin/padding at another level.

## DL-07 — Binding design changes require corpus conformance

A new or changed binding design-language rule is not complete when only the triggering page is fixed. The change must be migrated through the existing product evidence corpus before normal page migration continues.

For every binding visual-composition change:

1. fix the triggering page/component;
2. identify the already-migrated product surfaces governed by the same rule;
3. scan the completed comparison corpus and the currently migrated pages in the active product line;
4. classify each occurrence as conforming, stale, or an intentional exception;
5. fix stale occurrences in the same hardening phase;
6. document intentional exceptions where a future agent will encounter them (this document or the product migration README);
7. add an automated regression check when the invariant is reasonably detectable from source or runtime structure;
8. only then resume ordinary page migration.

A rule that exists only in documentation while completed product fixtures still violate it is not considered fully adopted.

Current Gosso Admin application-shell surfaces are a completed comparison corpus. Their normal Card/List/Table/landing surfaces use the shared 24px edge axis. Standalone identity and contained result surfaces may intentionally use a different spacious treatment, but the exception must be semantic and internally consistent rather than accidental legacy padding.

New migrated pages start from the current contract. Do not introduce 20px/32px normal application-surface insets and rely on a future cleanup pass.

## Review checklist

When a page looks misaligned or over-framed, ask in this order:

1. Is this boundary communicating a real semantic grouping, or only adding padding?
2. Is the child already a complete surface?
3. Are peer surfaces aligned by edge inset rather than by extra wrappers?
4. Can Table/List preserve internal density while aligning only its outer content edges?
5. Is the discrepancy actually page gutter, surface inset, compound structural gap, or content spacing?
6. Would removing one border/radius make the hierarchy clearer without losing meaning?
7. If this rule just changed, have all already-migrated governed surfaces been scanned and migrated or explicitly documented as intentional exceptions?

These rules are design-language invariants, not permission to create new Pattern/Gouno components. Public abstraction still requires the product-driven admission process.
