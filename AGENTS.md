# @gouno/ui Architecture and Delivery Rules

## Layers

- `src/core` contains pure, product-agnostic components. It may depend on internal primitives and semantic tokens, but never on Gouno routes, business state, authentication, API clients, or product templates.
- `src/patterns` contains reusable compound interactions such as DataTable, command-style navigation, feedback orchestration, and confirmation flows.
- `src/gouno` contains Gouno product-family shells, layouts, and templates. Product concepts such as AdminShell and PageHeader belong here.
- `src/components/primitives` contains internal Radix/shadcn behavior primitives. It is not a public product domain and must not become a dumping ground for composite components.
- `showcase` composes public APIs and static fixtures. It does not implement component behavior or call services.

## Source organization

- One public component or tightly coupled primitive per file.
- Domain barrel files are allowed only for exports; do not place unrelated implementations in barrels.
- Do not recreate `src/legacy`, compatibility directories, or product-specific aliases.
- Use semantic design tokens and `cn`; do not add page-local colors or business-specific styling to Core.
- Public components should support controlled and/or uncontrolled state where meaningful, disabled/readOnly/loading/error states, keyboard operation, focus management, and ARIA relationships.

## API and quality

- Prefer composition and explicit slots over hidden business behavior.
- Keep browser-native form serialization where it improves interoperability.
- Add focused jsdom/Vitest coverage for state transitions, keyboard behavior, accessibility attributes, and data interactions.
- Every Core addition needs a Showcase example covering default, variants/sizes, disabled/loading/error or empty states, and at least one interactive state.
- Every Showcase Demo and its displayed source code must describe the same rendered implementation. Keep component props, children, layout wrappers, state, event handlers, labels, URLs, disabled/loading behavior, and interaction feedback synchronized; do not use abbreviated or illustrative code that differs from the Preview.
- Every Showcase catalog entry must provide an English name, a Chinese name, and an API-plus-examples completion estimate. Show incomplete values explicitly as estimates, hide 100% badges, and only assign 100 after reviewing the component's public API and example checklist. Update the estimate in the same change when public API, documented states, interaction coverage, accessibility, or tests materially change.
- Prefer defining each Demo as a focused component and display code that can reproduce that Demo without hidden behavior. When a Demo changes, update its displayed source in the same change and verify both Preview and Code views.
- Run `npm run typecheck`, `npm test -- --run`, `npm run build`, and `npm run showcase:build` at the end of each coherent phase.

## Scope boundaries

- This package has no authentication, API access, connector behavior, or application session state.
- Do not modify `/Users/aben/Git/gouno-blog/packages/ui` from this repository.
