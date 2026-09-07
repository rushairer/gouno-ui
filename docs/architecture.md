# Gouno UI Architecture Contract

This document defines architectural boundaries enforced by source and tests. Public API design is governed by `docs/api-specification.md`; abstraction admission by `docs/product-driven-development.md`; durable evidence by `docs/abstraction-register.md`.

## Canonical dependency direction

```text
components/primitives + lib
          ↓
        core
          ↓
        theme
          ↓
       patterns
          ↓
        gouno
```

A formal layer may depend on itself or a lower layer, never a higher layer.

- `core` owns product-agnostic controls, layout, data entry, navigation, display, feedback and overlay APIs.
- `theme` owns theme state, persistence and theme controls.
- `patterns` owns only admitted reusable compound interactions and may remain empty.
- `gouno` owns admitted Gouno product-family structure/policy. Current canonical runtime surface: `AppShell`, `PageContainer`, `PageHeader`, `NavigationGroup`, `navigationItemClass`.
- `components/primitives` and `lib` are implementation foundations, not public package domains.

The dependency graph is verified from real TypeScript imports/exports by tests.

## Legacy is outside the DAG

`src/legacy` is a non-compiled, non-published prior-art museum, not a fifth layer.

- no package export;
- no Showcase navigation;
- no imports from Core/Theme/Patterns/Gouno/Showcase into Legacy;
- no normal feature maintenance;
- consulted only after a real product need creates an abstraction question.

Re-admission means designing a clean canonical implementation from current evidence. Moving an old file back is not admission.

## Public ownership

Every canonical public symbol, including types, has exactly one owner. Formal entry points use explicit symbol manifests. The package root remains an external compatibility umbrella equal to the exact union of Core + Theme + Patterns + Gouno + `cn`; repository implementation and Showcase do not consume it.

Every PascalCase runtime public component exports a same-owner `ComponentNameProps` type. `src/core/public-props.ts` remains type-only.

## Product-driven admission before ownership

Layer correctness does not prove that a component deserves to exist. Apply `docs/product-driven-development.md` first.

Current operating model:

- Gosso Admin is the primary page-by-page implementation line.
- Blog Admin and relevant Blog pages are cross-product prior-art/validation corpora.
- New pages start with Core + Theme + admitted Gouno structure + product-local composition.
- The initial shell baseline is `AppShell`, `PageContainer`, `NavigationGroup`, `navigationItemClass`.
- `PageHeader` was later admitted from real cross-product page evidence; see PD-011.
- Pattern remains intentionally empty until a compound interaction earns admission.
- The third semantically equivalent occurrence triggers review, not automatic extraction.

## Admitted Gouno structure

### AppShell

Application-level chrome: header, navigation, responsive navigation surface, main region and focus-return behavior. It owns no routing, auth, permission or business state.

### PageContainer

Page content track: width constraint and vertical rhythm. It owns no title/filter/action semantics.

### PageHeader

Product-family page presentation policy: one page title, optional description and one canonical `actions` slot. It does not own filters, tables, routes or business state. Historical `action`/`actions` synonyms are not restored.

### NavigationGroup / navigationItemClass

Shared product navigation grouping/presentation used by admitted shells.

Product-specific names and policies stay local until separately proven.

## Internal composition

Implementation modules import concrete modules rather than formal barrels. Large compound components may split private helpers without publishing them. Public providers are allowed only when canonical components actually consume them with documented precedence and tests.

## Showcase as consumer and validation laboratory

Showcase has two distinct roles:

1. **Integration consumer** — dogfood admitted Core/Theme/Pattern/Gouno APIs when they match the job.
2. **Documentation/development tooling** — own private utilities such as source preview, API tables, demo framing and viewport simulation.

Showcase-local repetition is not sufficient public-abstraction evidence. Evidence strength is:

1. independent real-product cross-product evidence;
2. repeated semantically equivalent real pages within one product;
3. Showcase/tests/tooling usage as supporting evidence only.

A Showcase-local utility can become canonical only when a real product independently creates the same semantic need and the normal admission review passes. Example: Showcase `CodeBlock` stays private until a real page such as Blog article rendering proves the same read-only code/highlight/copy contract; if admitted, implement Core `CodeBlock` and migrate Showcase to it.

Showcase information architecture keeps product workspace and design-system owner separate:

- workspaces: `Gouno UI`, `Gosso Admin`, `Blog Admin`, `Blog`;
- inside Gouno UI: `Core`, `Theme`, `Patterns`, `Gouno`;
- only canonical APIs appear in Gouno UI;
- only genuinely migrated pages appear in product workspaces;
- empty workspaces show an empty state, not simulated pages.

## Delivery contract

Before Pages publication on main, Node.js 24 runs:

- `npm run typecheck`
- `npm test -- --run`
- `npm run build`
- `npm run showcase:build`

## Change rule

Any change introducing or removing a public owner, layer edge, package path, public component, global provider, Legacy dependency, Showcase root import or delivery dependency must update the relevant invariant tests in the same change.

Any product-driven accept/reject/merge/move/remove/material-API decision must update `docs/abstraction-register.md` so future sessions do not depend on chat history.
