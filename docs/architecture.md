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

`@gouno/ui` remains a compatibility umbrella. It must equal the exact union of all four formal entry points plus `cn`; it must not invent a fifth ownership layer. `tests/public-api-ownership.test.ts` verifies both uniqueness and root-union equivalence with the TypeScript type checker.

## Internal composition

Implementation modules import concrete modules rather than the package root or formal layer barrels. This keeps dependency edges visible and reduces accidental cycles and barrel-driven bundle coupling.

Large compound components may split state, derivation and render helpers into internal modules without exposing those helpers publicly. `DataTable` follows this model: `DataTable` is the public Pattern while its model hook remains private.

## File ownership

One implementation file should own one component family or one tightly related internal concern. Catch-all public implementation modules such as `misc.tsx`, `visual.tsx` and `navigation-patterns.tsx` are prohibited.

Barrel files may aggregate exports, but they do not contain component implementations.

## Change rule

Any architectural change that introduces a new public owner, layer edge, alias, package subpath or cross-layer re-export must update the relevant architecture tests in the same change. Tests describe invariants; they are not compatibility exceptions.
