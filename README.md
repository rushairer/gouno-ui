# @gouno/ui

Shared React UI library for the Gouno product family, including reusable Core components, compound Patterns, Gouno product shells/templates, semantic themes, and a static Showcase.

**Live Showcase:** https://rushairer.github.io/gouno-ui/

## Architecture

The source has four formal public owners plus internal primitive/utility foundations:

- `src/components/primitives` / `src/lib` — internal behavior primitives and utilities; not public product domains.
- `src/core` — pure, product-agnostic controls, layout, data entry, display, feedback and overlay APIs.
- `src/theme` — theme state, persistence contract and theme controls.
- `src/patterns` — reusable multi-component interactions such as DataTable, async feedback, Toast and confirmation flows.
- `src/gouno` — Gouno product-family shells, page layout families, templates and business-status presentation.

Dependency direction is one-way:

```text
components/primitives + lib → Core → Theme → Patterns → Gouno
```

A layer may depend on itself or anything to its left, never anything to its right. Product policy, authentication, API clients, routes and application session state do not belong in Core or Patterns. The executable contract is documented in [`docs/architecture.md`](docs/architecture.md) and enforced from real TypeScript imports/exports.

Each public symbol, including type-only exports, has one canonical owner. Higher layers may compose lower layers, but they do not reimplement or re-export them merely to create a second import path.

## Public entry points

New code should prefer the owning formal layer:

```ts
import { Button, Pagination, Table } from "@gouno/ui/core";
import { DataTable, ConfirmDialog } from "@gouno/ui/patterns";
import { AdminShell, Panel, PageHeader } from "@gouno/ui/gouno";
import { ThemeProvider, ThemeToggle, useTheme } from "@gouno/ui/theme";
```

The root entry remains available for existing consumers:

```ts
import { Button, DataTable, AdminShell, ThemeProvider } from "@gouno/ui";
```

The four formal layer entries use explicit symbol manifests. The package intentionally does **not** expose source-directory wildcard subpaths such as `@gouno/ui/core/*`, `@gouno/ui/patterns/*`, or `@gouno/ui/gouno/*`.

The root `@gouno/ui` entry is intentionally retained as an external compatibility umbrella because current Gouno product applications still consume it. It is not a fifth owner: automated TypeScript-symbol tests require the root surface to equal the exact union of Core, Theme, Patterns and Gouno plus `cn`. Library implementation code and the Showcase are forbidden from depending on the umbrella; the Showcase imports every runtime API from its canonical formal layer.

Core deliberately excludes product concepts such as `AdminShell`, `StatusBadge`, `RiskBadge`, page templates and product action policy. Patterns likewise does not duplicate Core components such as Tabs or Pagination. Theme APIs have a dedicated owner instead of being forwarded through Gouno.

## Component organization

One public component or tightly coupled component family belongs in one focused implementation module. Barrel files are export-only. Catch-all implementation modules such as `misc`, `visual`, or mixed `date-time` files are intentionally avoided.

Examples:

- Spinner, Progress, AspectRatio and Kbd each have focused Core modules.
- Typography, Heading and Text share the typography domain.
- DateRangePicker, TimePicker and ColorPicker have separate owners.
- Gouno `layout.tsx` is a pure barrel over focused Panel, Page, DefinitionList and ListStack families.
- DataTable remains one public Pattern contract while sorting/filtering/pagination/selection/expansion state lives in a private model module.
- Feedback, AsyncState and Toast have separate Pattern owners.
- ToastProvider, `useToast` and the declarative Toast bridge share one Sonner-backed orchestration path instead of parallel notification state machines.
- `src/core/public-props.ts` is a type-only contract manifest for thin wrappers. Tests require it to contain no runtime imports or runtime exports.

Every PascalCase runtime component exported from Core, Theme, Patterns or Gouno must also export a same-owner `ComponentNameProps` type. The test discovers components from the TypeScript symbol table and uses no component allowlist.

Global configuration APIs are not published speculatively. A provider/config surface is public only when formal components actually consume it with documented precedence and behavior tests; the former inert `ConfigProvider/useConfig` surface was removed.

## API governance

Before changing a public component, read:

- `AGENTS.md`
- `docs/architecture.md` — executable ownership/dependency contract
- `docs/api-specification.md` — binding target API contract
- `docs/api-conformance.md` — current conformance register
- `docs/migration.md` — compatibility and ownership migrations

Public API changes must synchronize exported types, component API documentation, Showcase examples, interaction/accessibility behavior and focused tests. Existing APIs or closed conformance records are not naming precedents when they conflict with the specification.

Architecture conformance and Showcase completion are separate claims. The structural invariants above are fully automated, while catalog components remain below 100% until their own API table, examples, source equivalence, accessibility and focused-test evidence have actually been reviewed.

## Theme and CSS

Import Tailwind once in the consuming app, then import `@gouno/ui/tokens.css` and `@gouno/ui/base.css`; register `node_modules/@gouno/ui/dist` with Tailwind `@source` when required by the consumer build.

Wrap the application in `ThemeProvider`, including error/auth boundaries, and provide an origin-local `storageKey` plus brand. The package supports light/dark/system theme modes and Blog, Blog Admin and Gosso Admin brands.

```tsx
import { ThemeProvider, ThemeToggle } from "@gouno/ui/theme";

<ThemeProvider brand="blog-admin" storageKey="blog-admin:theme">
  <App />
</ThemeProvider>
```

## Build and verification

```bash
npm ci
npm run typecheck
npm test -- --run
npm run build
npm run showcase:build
```

The main-branch GitHub Actions workflow runs the same gate on Node.js 24 before publishing the Showcase to `gh-pages`. Every external GitHub Action used by that workflow is pinned to an immutable commit SHA, and tests prevent the Node baseline, action pinning, or verification gate from silently regressing.

The verification suite includes architecture ownership, dependency DAG, named public Props, type-only contract-manifest, Showcase canonical-import and delivery-workflow invariants in addition to component behavior tests.

Run `npm run showcase:dev` for local component documentation and product scenarios. Showcase fixtures are static: they do not authenticate, read cookies, call APIs, or mutate application state.

## Consumer distribution

React and React DOM are peer dependencies. Generated consumer archives are immutable distribution artifacts rather than editable component forks. Consumers should migrate through the formal package APIs and follow `docs/migration.md` when ownership changes.
