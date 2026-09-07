# Gouno UI Architecture Contract

This document defines the architectural boundaries enforced by the source and test suite. Public API naming remains governed by `docs/api-specification.md`.

## Dependency direction

The formal layers form one directed acyclic graph:

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

A layer may depend on itself or a lower layer. It must never import or re-export a higher layer.

- `core` owns product-agnostic controls, layout, data entry, navigation, display and overlay APIs.
- `theme` owns theme state and theme controls. Theme controls may compose Core components.
- `patterns` owns reusable multi-component interactions. Patterns may compose Core and Theme, but contain no Gouno product policy.
- `gouno` owns product-family shells, status semantics and page templates.
- `components/primitives` and `lib` are implementation foundations, not package subpaths.

The dependency graph is verified from real TypeScript import/export declarations by `tests/dependency-graph.test.ts`.

## Public ownership

Every public symbol has exactly one canonical formal owner: Core, Theme, Patterns or Gouno. This includes type-only exports.

The four formal entry points use explicit symbol manifests. Directory wildcard package exports and layer-level `export *` manifests are prohibited.

`@gouno/ui` remains an external compatibility umbrella because existing Gouno product applications still import from it. It must equal the exact union of all four formal entry points plus `cn`; it must not invent a fifth ownership layer. `tests/public-api-ownership.test.ts` verifies both uniqueness and root-union equivalence with the TypeScript type checker.

Repository implementation code and the Showcase do not consume the root umbrella. Internal modules use concrete implementation imports, while Showcase runtime modules import from the owning formal layer. `tests/showcase-boundaries.test.ts` recursively parses Showcase imports and rejects any dependency that resolves to the root umbrella.

Every PascalCase runtime component exported by a formal layer must also export a same-owner `ComponentNameProps` type. `tests/public-component-props.test.ts` discovers components directly from the TypeScript symbol table and has no component allowlist. Complex components keep explicit handwritten public props; thin wrappers and compound primitives may use type-only runtime-derived aliases when that preserves the exact implementation contract.

## Internal composition

Implementation modules import concrete modules rather than the package root or formal layer barrels. This keeps dependency edges visible and reduces accidental cycles and barrel-driven bundle coupling.

Large compound components may split state, derivation and render helpers into internal modules without exposing those helpers publicly. `DataTable` follows this model: `DataTable` is the public Pattern while its model hook remains private.

Global configuration surfaces are not speculative placeholders. A public context/config provider is allowed only when formal components actually consume it with documented precedence and behavior tests. The former inert `ConfigProvider/useConfig` API was removed for this reason.

## File ownership

One implementation file should own one component family or one tightly related internal concern. Catch-all public implementation modules such as `misc.tsx`, `visual.tsx` and `navigation-patterns.tsx` are prohibited.

Barrel files may aggregate exports, but they do not contain component implementations.

Type-only contract manifests are allowed when they derive exact props from implementation symbols and add no runtime dependency edge. `src/core/public-props.ts` is the current contract manifest. `tests/type-contract-manifest.test.ts` requires every import in that file to be type-only, every declaration to be an exported type alias, and the module to expose zero runtime values.

## Showcase as an integration consumer

Showcase is not an architectural exception. Its runtime source uses Core, Theme, Patterns and Gouno through the same canonical layer boundaries recommended to new consumers. It may use repository-relative paths during local development, but those paths must resolve to the owning layer rather than `src/index.ts`.

Preview/Code source transformation may display package-form import paths as text; only actual TypeScript module dependencies participate in the boundary rule.

Component-catalog completion percentages are documentation-audit evidence, not architecture scores. A component remains below 100% until its own API table, examples, source equivalence, accessibility and focused tests satisfy `AGENTS.md`, even when the package architecture itself is fully conformant.

## Delivery contract

The main-branch verification workflow uses Node.js 24 and pins every external GitHub Action to an immutable commit SHA. Before Pages publication it must run, in order as one verification gate:

- `npm run typecheck`
- `npm test -- --run`
- `npm run build`
- `npm run showcase:build`

`tests/workflow-hardening.test.ts` prevents action pinning, the Node baseline and the verification gate from silently drifting.

## Change rule

Any architectural change that introduces a new public owner, layer edge, alias, package subpath, public component, global configuration surface, cross-layer re-export, Showcase root-umbrella import, runtime value in a type-contract manifest, or delivery-workflow dependency must update the relevant invariant tests in the same change. Tests describe invariants; they are not compatibility exceptions.
