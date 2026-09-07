# @gouno/ui Architecture and Delivery Rules

## Layers

The formal public layers form one directed acyclic graph. A layer may depend on itself or a lower layer, never on a higher layer:

```text
src/components/primitives + src/lib
                 ↓
              src/core
                 ↓
             src/theme
                 ↓
           src/patterns
                 ↓
             src/gouno
```

- `src/core` contains pure, product-agnostic components. It may depend on internal primitives, utilities and semantic tokens, but never on Theme, Patterns, Gouno routes, business state, authentication, API clients, or product templates.
- `src/theme` owns theme state, persistence contracts and theme controls. Theme controls may compose Core components, but Theme never depends on Patterns or Gouno.
- `src/patterns` contains reusable compound interactions such as DataTable, async feedback, Toast orchestration and confirmation flows. It may compose Core and Theme, but never imports Gouno product policy.
- `src/gouno` contains Gouno product-family shells, layouts, status semantics and templates. Product concepts such as AdminShell and PageHeader belong here.
- `src/components/primitives` contains internal Radix/shadcn behavior primitives. It is not a public product domain and must not become a dumping ground for composite components.
- `showcase` composes public APIs and static fixtures. It does not implement component behavior or call services.

The executable architecture contract is documented in [docs/architecture.md](docs/architecture.md) and enforced by architecture, dependency-graph and public-ownership tests.

## Public ownership

- Every public symbol, including type-only exports, has exactly one canonical owner: Core, Theme, Patterns, or Gouno.
- The four formal layer entry points must use explicit symbol manifests; `export *` manifests are not allowed there.
- The package root is the only compatibility umbrella. It must equal the exact union of the four formal entries plus `cn` and must not become a fifth ownership layer.
- Do not expose source-directory wildcard package subpaths such as `core/*`, `patterns/*`, or `gouno/*`.
- Implementation modules import concrete modules, not the package root or formal layer barrels.
- Higher layers may compose lower-layer components but must not reimplement or re-export them merely to create a second import path.

## Source organization

- One public component or tightly coupled component family per implementation file.
- Domain barrel files are allowed only for exports; do not place unrelated implementations in barrels.
- Large compound components may split state, derivation and render helpers into private modules without expanding the public API. `DataTable` is the reference pattern: one public component with a private model module.
- Do not recreate `src/legacy`, compatibility directories, catch-all implementation files such as `misc.tsx`/`visual.tsx`, or product-specific synonym aliases.
- Prefer one state/orchestration backend per public concept. Do not maintain parallel internal implementations for the same Toast, overlay, navigation, pagination or selection contract.
- Use semantic design tokens and `cn`; do not add page-local colors or business-specific styling to Core.
- Public components should support controlled and/or uncontrolled state where meaningful, disabled/readOnly/loading/error states, keyboard operation, focus management, and ARIA relationships.

## API and quality

- Before designing, implementing, modifying, or reviewing public components, read [Public API Specification](docs/api-specification.md) and the applicable semantic entries. It is the binding target API contract; existing APIs are not naming precedents.
- Consult [API Conformance Register](docs/api-conformance.md) for known implementation gaps. New APIs must conform; existing gaps do not authorize an unrelated migration or removal of compatibility APIs.
- Determine each prop's meaning and owning component before implementation. Synchronize exported types, a separate API table for every public JSX component, matching demos, and appropriate behavior verification. Check re-exported third-party props as part of the public surface.
- Do not introduce undocumented aliases or exceptions. Changes to the specification must state evidence and impact; exceptions must identify the affected components, reason, and exit conditions in the conformance register.
- API migrations require a separate compatibility assessment and migration instructions. Publishing the specification does not mean existing components have migrated or authorize deleting old interfaces.
- Prefer composition and explicit slots over hidden business behavior.
- Keep browser-native form serialization where it improves interoperability.
- Add focused jsdom/Vitest coverage for state transitions, keyboard behavior, accessibility attributes, data interactions, architectural ownership and dependency direction.
- Every Core addition needs a Showcase example covering default, variants/sizes, disabled/loading/error or empty states, and at least one interactive state.
- Every Showcase Demo and its displayed source code must describe the same rendered implementation. Keep component props, children, layout wrappers, state, event handlers, labels, URLs, disabled/loading behavior, and interaction feedback synchronized; do not use abbreviated or illustrative code that differs from the Preview.
- Every Showcase catalog entry must provide an English name, a Chinese name, and an API-plus-examples completion estimate. Show incomplete values explicitly as estimates, hide 100% badges, and only assign 100 after reviewing the component's public API and example checklist. Update the estimate in the same change when public API, documented states, interaction coverage, accessibility, or tests materially change.
- A component may be marked `100%` only when both of these are complete and aligned: (1) its full current public API, named public types, defaults, events, DOM/ref and accessibility contract are documented in the component's API tables; and (2) every required Showcase Demo has a working Preview and Code panel sourced from the same reusable `?raw` demo module, with the displayed code reproducing the Preview's imports, props, state, handlers, content, layout and observable feedback. Complete API documentation alone, or a working Demo alone, is never sufficient for `100%`; any mismatch or missing evidence keeps the estimate below `100%`.
- Prefer defining each Demo as a focused component and display code that can reproduce that Demo without hidden behavior. When a Demo changes, update its displayed source in the same change and verify both Preview and Code views.
- Demo width is part of the documented contract. `DemoBlock` owns one shared preview content track; demos must not add arbitrary component-specific `max-width`, `w-*`, or width overrides to make one state look different from another. If a component needs a constrained reading width, declare that width once for the whole demo and use the same wrapper in both Preview and displayed source. Components that are expected to align in a form or table demo must use the same width track across basic, variant, controlled, loading, and error examples.
- A catalog percentage is an audit result, never a progress claim supplied by hand. A component may show `100%` only when its exported public API has been checked against the implementation, every public prop/state is represented in the API table, the required demos and displayed source are complete and equivalent, accessibility/keyboard behavior is covered, and focused tests pass. Any missing, uncertain, or stale API documentation keeps the result below 100% until corrected.
- Run `npm run typecheck`, `npm test -- --run`, `npm run build`, and `npm run showcase:build` at the end of each coherent phase.

## Scope boundaries

- This package has no authentication, API access, connector behavior, or application session state.
- Do not modify `/Users/aben/Git/gouno-blog/packages/ui` from this repository.

## Demo source verification

- Each Code panel must import the exact rendered demo module with `?raw`. One file per demo, including only its necessary imports and helpers; never show a page's entire example collection for one preview.
- Format demo modules as readable multiline TSX. Do not fix compressed examples by inserting arbitrary line breaks into displayed strings.
- Keep missing API, example and test evidence as explicit incomplete audit entries. Do not restore 100% by deleting gaps, changing test expectations, or applying arbitrary score deductions.
