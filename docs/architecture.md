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
- `patterns` owns only admitted reusable compound interactions. Current canonical runtime surface: `BulkActionBar`.
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

- Gosso Admin has completed route-level migration plus product-language convergence and acts as the first comparison corpus.
- Blog Admin has completed route-level migration plus behavior/detail fidelity hardening and acts as the second comparison corpus.
- Blog public site is the active page-by-page validation line, beginning with its real `PublicShell` + Home surface.
- Public Blog pages must challenge abstractions formed during the two admin products rather than mechanically inherit application-shell assumptions.
- New pages start with Core + Theme + admitted Gouno structure only where semantics match, plus product-local composition.
- `AppShell`/`PageContainer` remain application-shell structure; a public document/content shell stays product-local until independent evidence proves a shared Gouno contract.
- `PageHeader` remains admitted for route-level title/description/actions semantics; public Blog pages use it only when that semantic contract genuinely exists.
- `BulkActionBar` is the first admitted Pattern, proven by independent Posts, Comments and Categories selection workflows; public Blog reading/discovery surfaces must not expand it by analogy.
- The third semantically equivalent occurrence triggers review, not automatic extraction.

## Admitted Pattern interactions

### BulkActionBar

Selection-aware bulk-action interaction shared across otherwise different resource presentations. It owns the accessible `toolbar` surface, selected-context label, sticky action visibility and a canonical cancel-selection affordance. Product actions remain arbitrary `children`; the Pattern does not know about AI, publishing, deletion, resource types or selection state storage.

Its public API intentionally stays smaller than Legacy prior art: `selectionLabel`, `onCancel`, optional `cancelLabel`, `children`, standard `aria-label` and normal HTML/className extension. Product-specific convenience props are not admitted.

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

## Compound layout ownership

Compound components own structural relationships between their semantic regions; content placed into a region owns its own internal padding/rhythm unless the slot contract explicitly says otherwise.

For example, Tabs owns the TabBar↔TabPanel structural gap in every placement, while `TabPanel` does not pad arbitrary business content. Decorative indicators, borders and focus affordances stay inside the relevant component visual/scroll boundary so they do not create accidental overflow. See PD-020.

## Internal composition

Implementation modules import concrete modules rather than formal barrels. Large compound components may split private helpers without publishing them. Public providers are allowed only when canonical components actually consume them with documented precedence and tests.

## Showcase as consumer and validation laboratory

Showcase has two distinct roles:

1. **Integration consumer** — dogfood admitted Core/Theme/Pattern/Gouno APIs when they match the job.
2. **Documentation/development tooling** — own private utilities such as source preview, API tables, demo framing, viewport simulation and fixture controls.

Showcase-local repetition is not sufficient public-abstraction evidence. Evidence strength is:

1. independent real-product cross-product evidence;
2. repeated semantically equivalent real pages within one product;
3. Showcase/tests/tooling usage as supporting evidence only.

A Showcase-local utility can become canonical only when a real product independently creates the same semantic need and the normal admission review passes. Example: Showcase `CodeBlock` stays private until a real page such as Blog article rendering proves the same read-only code/highlight/copy contract; if admitted, implement Core `CodeBlock` and migrate Showcase to it.

`FixtureDock` is another private tooling example: route labels and scenario controls float outside normal product layout so fixtures remain accessible without becoming part of the demonstrated product design. Its reuse is zero evidence for Pattern/Gouno admission.

Showcase information architecture keeps product workspace and design-system owner separate:

- workspaces: `Gouno UI`, `Gosso Admin`, `Blog Admin`, `Blog`;
- inside Gouno UI: `Core`, `Theme`, `Patterns`, `Gouno`;
- only canonical APIs appear in Gouno UI;
- only genuinely migrated pages appear in product workspaces;
- completed product workspaces remain comparison corpora rather than active implementation lines;
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
