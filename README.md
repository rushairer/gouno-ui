# @gouno/ui

Shared React UI system for the Gouno product family: a broad product-agnostic Core, a dedicated Theme layer, product-driven Pattern/Gouno abstractions, and a static Showcase used as both component documentation and real-page validation laboratory.

**Live Showcase:** https://rushairer.github.io/gouno-ui/

## Architecture

There are four formal public owners:

- `src/core` — pure, product-agnostic controls, layout, data entry, display, navigation, feedback and overlays.
- `src/theme` — brand/theme state, persistence contract and theme controls.
- `src/patterns` — admitted reusable compound interactions. This layer is intentionally allowed to be empty while real product evidence is insufficient.
- `src/gouno` — admitted Gouno product-family structure/policy. The current canonical surface is `AppShell`, `PageContainer`, `NavigationGroup` and `navigationItemClass`.

Internal primitives/utilities live under `src/components/primitives` and `src/lib`.

Dependency direction is one-way:

```text
components/primitives + lib → Core → Theme → Patterns → Gouno
```

A formal layer may depend on itself or anything to its left, never anything to its right.

### Legacy quarantine

`src/legacy` is a non-canonical source museum for pre-validation Pattern/Gouno implementations. It is **not** a fifth layer, package subpath or compatibility API. It is excluded from builds, hidden from Showcase, and forbidden as a dependency of canonical layers or Showcase.

Legacy exists only so product-driven reviews can inspect prior art without mistaking it for an approved design-system contract.

See [`docs/architecture.md`](docs/architecture.md), [`docs/product-driven-development.md`](docs/product-driven-development.md) and [`src/legacy/README.md`](src/legacy/README.md).

## Public entry points

New code should import from the canonical owner:

```ts
import { Button, Pagination, Table } from "@gouno/ui/core";
import { ThemeProvider, ThemeToggle, useTheme } from "@gouno/ui/theme";
import { AppShell, PageContainer } from "@gouno/ui/gouno";
```

`@gouno/ui/patterns` remains a formal entry point but currently exports no admitted Pattern. Real product evidence must establish a Pattern before anything is added there.

The root entry remains an external compatibility umbrella for existing consumers:

```ts
import { Button, ThemeProvider, AppShell } from "@gouno/ui";
```

The root is not a fifth owner. Automated TypeScript-symbol tests require it to equal the exact union of Core, Theme, Patterns and Gouno plus `cn`. Repository implementation code and Showcase must not depend on the root umbrella.

Source-directory wildcard imports such as `@gouno/ui/core/*`, `@gouno/ui/patterns/*`, `@gouno/ui/gouno/*` and any Legacy path are not public API.

## Product-driven component evolution

The repository is in a real-product validation phase.

- Gosso Admin is the primary page-by-page migration line.
- Blog Admin and relevant Blog pages are cross-product evidence corpora rather than parallel migration streams by default.
- Pages are rebuilt with Core + Theme + the minimum admitted Gouno structure + local JSX/Tailwind first.
- Small repetition is preferred over premature abstraction.
- The third semantically equivalent occurrence triggers abstraction review; it does not automatically create a component.
- Before admitting a Pattern/Gouno component or materially extending Core, review canonical prior art, Legacy and matching product cases.
- Durable decisions are recorded in [`docs/abstraction-register.md`](docs/abstraction-register.md).

The binding public API naming/state/composition rules remain [`docs/api-specification.md`](docs/api-specification.md).

## Neutral application structure

The canonical Gouno shell avoids unnecessary product-domain naming:

```tsx
import { AppShell, PageContainer } from "@gouno/ui/gouno";

<AppShell brand="GOSSO" navigation={renderNavigation}>
  <PageContainer>
    <RouteContent />
  </PageContainer>
</AppShell>
```

- `AppShell` describes application chrome and responsive navigation, not “admin” behavior.
- `PageContainer` describes only the page content width/rhythm track, not a page template.
- Routing, authentication, permissions, API clients and business state stay in the consuming product.

## Showcase information architecture

Showcase keeps product spaces and design-system ownership as separate dimensions.

Product spaces:

- **Gouno UI** — canonical design-system documentation.
- **Gosso Admin** — only pages actually migrated under the current process.
- **Blog Admin** — empty until real migration begins.
- **Blog** — empty until real migration begins.

Inside **Gouno UI**, navigation is organized first by canonical owner:

- **Core** — keeps familiar usage categories such as General, Layout, Data Entry, Navigation, Data Display and Feedback.
- **Theme** — theme/brand APIs.
- **Patterns** — only admitted compound interactions; currently empty.
- **Gouno** — admitted product-family structure/policy.

Legacy never appears in Showcase. Old simulated business pages are not retained as fake migration progress.

## Component organization

- One public component or tightly coupled family per focused implementation module.
- Formal layer barrels are explicit symbol manifests.
- Catch-all public implementation modules are avoided.
- Every PascalCase runtime component exported by Core, Theme, Patterns or Gouno exports a same-owner `ComponentNameProps` type.
- `src/core/public-props.ts` is a type-only contract manifest and contains no runtime exports.
- Global providers/config surfaces are published only when canonical components actually consume them with documented behavior.

## API governance

Before changing public components or product-driven abstractions, read:

1. `AGENTS.md`
2. `docs/architecture.md`
3. `docs/api-specification.md`
4. `docs/product-driven-development.md`
5. `docs/abstraction-register.md`
6. `docs/api-conformance.md` when changing an existing public contract

Public API changes synchronize exported types, API documentation, Showcase evidence, interaction/accessibility behavior and focused tests. Existing implementations and Legacy APIs are not naming precedents when they conflict with the specification.

## Theme and CSS

Import Tailwind once in the consuming app, then import `@gouno/ui/tokens.css` and `@gouno/ui/base.css`; register `node_modules/@gouno/ui/dist` with Tailwind `@source` when required.

```tsx
import { ThemeProvider, ThemeToggle } from "@gouno/ui/theme";

<ThemeProvider brand="blog-admin" storageKey="blog-admin:theme">
  <App />
</ThemeProvider>
```

The package supports light/dark/system modes and Blog, Blog Admin and Gosso Admin brands.

## Build and verification

```bash
npm ci
npm run typecheck
npm test -- --run
npm run build
npm run showcase:build
```

The main-branch GitHub Actions workflow runs the same gate on Node.js 24 before publishing Showcase to `gh-pages`. Tests cover ownership, dependency DAG, named public Props, Legacy quarantine, type-only manifests, Showcase canonical imports and workflow hardening in addition to component behavior.

Run `npm run showcase:dev` for local documentation and product scenarios. Showcase fixtures are static: they do not authenticate, read cookies, call APIs or mutate real application state.

## Consumer distribution

React and React DOM are peer dependencies. Generated consumer archives are immutable distribution artifacts rather than editable component forks. Existing products using older vendored archives can migrate page-by-page to the current canonical API; see [`docs/migration.md`](docs/migration.md).
