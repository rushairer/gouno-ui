# Gouno UI Architecture Contract

This document defines architectural boundaries enforced by source and tests. Public API design is governed by `docs/api-specification.md`; abstraction admission by `docs/product-driven-development.md`; durable evidence by `docs/abstraction-register.md`.

## Canonical dependency direction

The formal public layers form one directed acyclic graph:

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

A formal layer may depend on itself or a lower layer. It must never import or re-export a higher layer.

- `core` owns product-agnostic controls, layout primitives, data entry, navigation, display, feedback and overlay APIs.
- `theme` owns theme state, persistence and theme controls; it may compose Core.
- `patterns` owns only admitted reusable multi-component interactions; it may compose Core/Theme and is allowed to be empty while evidence is insufficient.
- `gouno` owns only admitted Gouno product-family structure/policy. Its current canonical surface is `AppShell`, `PageContainer`, `NavigationGroup` and `navigationItemClass`.
- `components/primitives` and `lib` are implementation foundations, not package subpaths.

The dependency graph is verified from real TypeScript import/export declarations by `tests/dependency-graph.test.ts`.

## Legacy is outside the DAG

`src/legacy` is deliberately **not** another architectural layer. It is a non-compiled, non-published source museum for pre-validation abstractions.

Legacy has these hard properties:

- excluded from `tsconfig.json` and `tsconfig.build.json`;
- no package export path;
- no Showcase navigation;
- no imports from Core, Theme, Patterns, Gouno or Showcase into Legacy;
- no normal feature maintenance;
- used only as prior-art evidence when real product work raises an abstraction question.

An idea leaves Legacy only by being re-admitted through `docs/product-driven-development.md` and implemented cleanly in a canonical layer. Legacy file existence is never public API evidence.

`tests/legacy-boundaries.test.ts` enforces the quarantine.

## Public ownership

Every canonical public symbol has exactly one owner: Core, Theme, Patterns or Gouno. This includes type-only exports.

Formal entry points use explicit symbol manifests. Directory wildcard package exports and layer-level `export *` manifests are prohibited.

`@gouno/ui` remains an external compatibility umbrella for consumers. It equals the exact union of all formal entry points plus `cn`; it does not invent a fifth ownership layer. `tests/public-api-ownership.test.ts` verifies uniqueness and root-union equivalence with the TypeScript checker.

Repository implementation code and Showcase do not consume the root umbrella. Internal modules import concrete implementation modules, while Showcase imports from canonical formal layers.

Every PascalCase runtime component exported by a formal layer must also export a same-owner `ComponentNameProps` type. `tests/public-component-props.test.ts` discovers components directly from TypeScript symbols without an allowlist.

## Product-driven admission before ownership

Layer ownership does not prove that an abstraction deserves to exist. Apply `docs/product-driven-development.md` before creating a Pattern/Gouno component or materially extending Core.

Current validation model:

- Gosso Admin is the primary page-by-page implementation line.
- Blog Admin and relevant Blog pages are mandatory cross-product prior-art/validation corpora.
- Product pages are rebuilt Core-first with Theme, the minimum admitted Gouno structure and product-local composition.
- The minimum admitted structure is `AppShell`, `PageContainer`, `NavigationGroup` and `navigationItemClass`.
- Pre-validation Pattern/Gouno implementations are quarantined in `src/legacy`; they are historical evidence only.
- The third semantically equivalent occurrence triggers review, not automatic extraction.
- Cross-product comparison uses user intent, state, interaction, accessibility and responsive semantics rather than legacy names or DOM similarity.

Once admitted, this document determines canonical ownership and legal dependencies; `docs/api-specification.md` governs the API contract.

## Neutral application structure naming

The canonical shell names intentionally avoid `Admin`:

- `AppShell` describes application-level chrome: header, navigation, responsive navigation surface, main region and focus-return behavior. It does not imply one product type or own routing/authentication/business state.
- `PageContainer` describes only the page content track: width constraint and vertical rhythm. It does not imply admin pages or bundle speculative title/filter/action semantics.
- `NavigationGroup` and `navigationItemClass` remain neutral because their semantics already match their responsibility.

Product-specific words belong in product-local routes/content until repeated evidence proves a Gouno-family policy.

## Internal composition

Implementation modules import concrete modules rather than the package root or formal layer barrels. This keeps dependency edges visible and avoids cycles/barrel-driven coupling.

Large admitted compound components may split model/render helpers into private modules without publishing those helpers.

Global configuration surfaces are not speculative placeholders. A public provider is allowed only when canonical components actually consume it with documented precedence and behavior tests.

## File ownership

One implementation file owns one public component family or tightly related internal concern. Catch-all public implementation modules are prohibited.

Barrel files aggregate exports but do not contain unrelated implementations.

`src/core/public-props.ts` remains a type-only contract manifest. Tests require type-only imports/exported aliases and zero runtime values.

## Showcase as integration consumer and validation laboratory

Showcase is not an architecture exception. Runtime source consumes canonical formal layers only.

Its information architecture keeps two dimensions separate:

1. **Product workspace** — `Gouno UI`, `Gosso Admin`, `Blog Admin`, `Blog`.
2. **Design-system ownership** inside `Gouno UI` — `Core`, `Theme`, `Patterns`, `Gouno`.

Core retains usage-oriented categories such as General, Layout, Data Entry, Navigation, Data Display and Feedback. Other layers use categories appropriate to their semantics rather than being forced into Core/Ant Design categories.

Only admitted canonical APIs appear in the Gouno UI workspace. Legacy is hidden entirely. Product workspaces contain only pages genuinely migrated under the product-driven process; empty workspaces show an empty state instead of simulated pages.

Showcase has two responsibilities that must not be confused:

- as an **integration consumer**, it should dogfood admitted Core/Theme/Pattern/Gouno APIs whenever those APIs match the job;
- as **documentation/development tooling**, it may own private utilities such as source-code preview, API tables, viewport simulation and demo framing.

Showcase-local repetition is not sufficient evidence for a public Pattern/Gouno/Core abstraction. Evidence quality is ordered as follows:

1. independent real-product, cross-product evidence (strongest);
2. repeated semantically equivalent pages inside one real product;
3. Showcase/tests/tooling usage (supporting evidence only).

A Showcase-local utility may later become canonical when a real product independently creates the same product-agnostic need. At that point run the normal prior-art/admission review; if admitted, move the capability into the correct canonical owner and change Showcase to consume it. For example, the current Showcase source `CodeBlock` remains private until a real product such as Blog article rendering proves the same read-only code/highlight/copy contract.

Component completion percentages are documentation-audit evidence, not architecture scores.

## Delivery contract

The main-branch verification workflow uses Node.js 24 and pins external GitHub Actions to immutable commit SHAs. Before Pages publication it runs:

- `npm run typecheck`
- `npm test -- --run`
- `npm run build`
- `npm run showcase:build`

## Change rule

Any change introducing a public owner, layer edge, package path, public component, global provider, cross-layer re-export, Legacy dependency, Showcase root import or delivery dependency must update the relevant invariant tests in the same change.

Any product-driven decision that admits, rejects, merges, moves, removes or materially changes an abstraction must update `docs/abstraction-register.md` so future sessions can reconstruct the decision without chat history.
