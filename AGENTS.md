# @gouno/ui Architecture and Delivery Rules

## Read first

Before changing public components, product pages, ownership or API contracts, read in order:

1. this file;
2. `docs/architecture.md`;
3. `docs/api-specification.md`;
4. `docs/product-driven-development.md`;
5. `docs/abstraction-register.md`;
6. `docs/api-conformance.md` when an existing public contract changes.

Repository contracts are the durable source of truth. Do not reconstruct architecture decisions from chat history or legacy product component names.

## Formal public layers

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

- `src/core` contains pure, product-agnostic components. It may depend on internal primitives, utilities and semantic tokens, but never on Theme, Patterns, Gouno, Legacy, routes, business state, authentication, API clients or product templates.
- `src/theme` owns theme state, persistence contracts and theme controls. Theme may compose Core, but never depends on Patterns, Gouno or Legacy.
- `src/patterns` contains only **admitted** reusable compound interactions. It may compose Core and Theme, but never imports Gouno product policy or Legacy. It is valid for this layer to be empty while product evidence is insufficient.
- `src/gouno` contains only **admitted** Gouno product-family structure and policy. The current canonical surface is `AppShell`, `PageContainer`, `NavigationGroup` and `navigationItemClass`.
- `src/components/primitives` and `src/lib` are internal implementation foundations, not public product domains.
- `showcase` is a real integration consumer of canonical public layers and static fixtures. It must never import Legacy or the root compatibility umbrella at runtime.

The executable contract is documented in `docs/architecture.md` and enforced by architecture, dependency-graph, public-ownership, public-component-props, legacy-boundary, type-contract-manifest and Showcase-boundary tests.

## Legacy quarantine

`src/legacy` is a non-canonical prior-art museum, not a fifth layer and not a compatibility API.

- It is excluded from TypeScript build output and package publication.
- It has no package export path and no Showcase navigation.
- Core, Theme, Patterns, Gouno and Showcase must never import it.
- Do not maintain, refactor, fix or extend Legacy during normal product work.
- Historical relative imports inside quarantined snapshots may reflect their former source locations because the snapshots are intentionally non-executable.
- Consult Legacy only when a real product page exposes a candidate abstraction and prior art is useful.
- Re-create an admitted abstraction cleanly in its canonical layer only after it passes `docs/product-driven-development.md`, conforms to `docs/api-specification.md`, has Showcase/tests, and is recorded in `docs/abstraction-register.md`.
- Do not create `src/candidates` or any public incubator. Candidate abstractions remain product-local code plus decision evidence until admitted.

## Public ownership

- Every canonical public symbol, including type-only exports, has exactly one owner: Core, Theme, Patterns or Gouno.
- Every PascalCase runtime component in a formal public layer must export a same-owner `ComponentNameProps` type.
- Complex components keep explicit handwritten Props when semantics or generics matter. Thin wrappers and compound primitives may expose type-only runtime-derived Props aliases only when they exactly track implementation.
- `src/core/public-props.ts` is a type-contract manifest only. It contains type-only imports/exported type aliases and zero runtime values.
- Formal layer entry points use explicit symbol manifests; `export *` manifests are not allowed there.
- The package root is the only external compatibility umbrella. It equals the exact union of the four formal entries plus `cn`; it is not a fifth owner.
- New library and Showcase code imports the canonical owning layer. Implementation modules import concrete modules, not formal barrels or the package root.
- Higher layers may compose lower layers but must not reimplement or re-export them merely to create a second import path.
- Do not expose source-directory wildcard package subpaths.

## Source organization

- One public component or tightly coupled component family per implementation file.
- Domain barrels contain exports only.
- Large compound components may split state/derivation/render helpers into private modules without expanding public API.
- Do not create catch-all implementation files such as `misc.tsx`, `visual.tsx` or mixed product utility surfaces.
- Prefer one state/orchestration backend per admitted public concept.
- Do not publish speculative global contexts/providers. A provider is public only when formal components consume it with documented precedence and behavior tests.
- Use semantic design tokens and `cn`; do not add product-specific styling or business semantics to Core.
- Public components support controlled/uncontrolled state where meaningful, disabled/readOnly/loading/error states, keyboard operation, focus management and ARIA relationships appropriate to the component.

## Product-driven evolution

Gouno UI is in product-validation mode.

- **Primary migration line:** Gosso Admin, one real page at a time.
- **Cross-product evidence corpora:** Gouno Blog Admin and relevant Gouno Blog pages.
- **Execution model:** single-line implementation, multi-product validation.
- Rebuild pages with Core, Theme, the minimum admitted Gouno structure (`AppShell`, `PageContainer`, `NavigationGroup`, `navigationItemClass`) and product-local JSX/Tailwind first.
- Existing Legacy implementations are prior art, never automatic precedent.
- First semantic occurrence stays local. Second similarity is noted. The third semantically equivalent occurrence triggers abstraction review; it does not automatically authorize extraction.
- Compare user intent, state, interaction lifecycle, accessibility, responsive behavior and content/action policy instead of legacy component/file names or DOM similarity.
- Before a new public Pattern/Gouno abstraction or material Core capability, search Gouno UI, Gosso Admin, Blog Admin and relevant Blog pages for prior art.
- If evidence is insufficient, keep the code product-local.
- Record durable accept/reject/merge/move/remove/API decisions in `docs/abstraction-register.md`.
- Product demand may refine Core APIs, but `docs/api-specification.md` remains binding; legacy product APIs are not naming precedents.

## Showcase information architecture

Showcase separates **product spaces** from **design-system ownership**:

- Product spaces are `Gouno UI`, `Gosso Admin`, `Blog Admin` and `Blog`.
- Inside the `Gouno UI` space, the first navigation dimension is ownership: `Core`, `Theme`, `Patterns`, `Gouno`.
- Core keeps usage-oriented categories such as General, Layout, Data Entry, Navigation, Data Display and Feedback.
- Theme, Patterns and Gouno use categories meaningful to their own semantics; they are not forced into Core/Ant Design categories.
- Only canonical admitted APIs appear in Gouno UI Showcase. Legacy never appears.
- Product spaces display only pages actually migrated under the product-driven process. Do not retain simulated placeholder pages that look like completed migration.
- An empty product space shows an empty state; it does not invent pages.
- Patterns may visibly show no admitted components until real product evidence creates one.

## API and quality

- `docs/api-specification.md` is the binding target API contract; existing APIs are not naming precedents.
- Consult `docs/api-conformance.md` for known canonical implementation gaps. Legacy is outside canonical conformance.
- Determine each prop's meaning and owning component before implementation. Synchronize exported types, API tables, matching demos and behavior verification.
- Do not introduce undocumented aliases or semantic duplicate write paths.
- API migrations require explicit compatibility assessment and migration instructions.
- Prefer composition and explicit slots over hidden business behavior or generic future-proof configuration bags.
- Preserve browser-native form serialization where it improves interoperability.
- Add focused jsdom/Vitest coverage for state transitions, keyboard behavior, accessibility, data interactions and architectural ownership.
- Every Core addition needs Showcase evidence covering defaults, meaningful variants/states and interaction.
- Every Showcase Preview and displayed Code sample must describe the same rendered implementation.
- Component completion percentages are audit evidence, not architecture scores or manually asserted progress.
- A component may show `100%` only after its complete canonical API, examples/source equivalence, accessibility/keyboard contract and focused tests are reviewed.

## Delivery

Run at the end of each coherent phase:

```bash
npm run typecheck
npm test -- --run
npm run build
npm run showcase:build
```

The main verification workflow uses Node.js 24 and must run the same gate before Pages publication. External GitHub Actions stay pinned to immutable commit SHAs.

## Scope boundaries

- This package contains no authentication, API access, connector behavior or application session state.
- Product fixtures in Showcase are static and never call real services.
- Do not modify `/Users/aben/Git/gouno-blog/packages/ui` from this repository.
