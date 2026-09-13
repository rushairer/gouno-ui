# @gouno/ui

Shared React UI system for the Gouno product family: product-agnostic Core, dedicated Theme, product-driven Pattern/Gouno abstractions, and a static Showcase used as component documentation plus real-page validation.

**Live Showcase:** https://rushairer.github.io/gouno-ui/

## Install

```bash
npm install @gouno/ui
```

`@gouno/ui` is published as an immutable public npm package. Gouno products should initially pin an exact version and upgrade it through a normal dependency PR rather than tracking mutable archives or repository branches.

For Tailwind CSS v4 consumers, import Tailwind once, then the canonical tokens/base styles, and register the package dist directory as a Tailwind source:

```css
@import "tailwindcss";
@import "@gouno/ui/tokens.css";
@import "@gouno/ui/base.css";

@source "../node_modules/@gouno/ui/dist";
```

Use the formal public entry points rather than source paths:

```tsx
import { Button, Card } from "@gouno/ui/core";
import { ThemeProvider } from "@gouno/ui/theme";
import { BulkActionBar } from "@gouno/ui/patterns";
import { AppShell, PageContainer, PageHeader } from "@gouno/ui/gouno";
```

React and React DOM are peer dependencies. See [`docs/releasing.md`](docs/releasing.md) for the immutable npm release contract.

## Architecture

Formal public owners:

- `src/core` — product-agnostic controls, layout, data entry/display, navigation, feedback and overlays.
- `src/theme` — brand/theme state, persistence and controls.
- `src/patterns` — admitted reusable compound interactions. Current runtime surface: `BulkActionBar`.
- `src/gouno` — admitted Gouno product-family structure/policy. Current runtime surface: `AppShell`, `PageContainer`, `PageHeader`, `NavigationGroup`, `navigationItemClass`.

```text
components/primitives + lib → Core → Theme → Patterns → Gouno
```

`src/legacy` has been removed from the current source tree. Historical implementations live in Git history; do not recreate a Legacy, Candidates or Incubator source layer.

See [`docs/architecture.md`](docs/architecture.md) and [`docs/product-driven-development.md`](docs/product-driven-development.md).

## Public entry points

```ts
import { Button, CodeBlock, Pagination, Table, Tabs } from "@gouno/ui/core";
import { ThemeProvider, ThemeToggle, useTheme } from "@gouno/ui/theme";
import { BulkActionBar } from "@gouno/ui/patterns";
import { AppShell, PageContainer, PageHeader } from "@gouno/ui/gouno";
```

`BulkActionBar` is the first admitted Pattern. It was extracted only after three independently rebuilt Blog Admin workflows (Posts, Comments and Categories) converged on the same selection-aware toolbar interaction. Its API intentionally excludes resource-specific or AI-specific shortcuts.

`CodeBlock` was admitted to Core only after the real Blog article renderer independently proved the same read-only code frame, horizontal overflow and copy-feedback contract that Showcase had previously exercised privately. Core deliberately does not own a syntax highlighter; consumers may inject token rendering through `renderCode(code)` while `code` remains the sole display/copy source.

The root `@gouno/ui` is an external compatibility umbrella, not a fifth owner. Repository implementation and Showcase import canonical formal layers instead. Source wildcard paths and historical Legacy package paths are not public API.

## Product-driven evolution

Three real product corpora are now closed as comparison evidence:

- **Gosso Admin** — completed first-product corpus after route coverage plus product-language convergence.
- **Blog Admin** — completed second-product corpus after route coverage plus behavior/detail fidelity hardening.
- **Gouno Blog public site** — completed third-product corpus after PublicShell/Home, discovery, reading, document, account and final NotFound route-family validation.
- **No active fourth-product migration line is selected.** New product migration starts only when a real independently owned product/page family is chosen, or when a completed corpus exposes a genuine canonical defect that requires reopening a component or fixture.

Pages still start Core-first with Theme, admitted Gouno structure where semantics match, and local composition. Public-site document/content shells are not forced into `AppShell` merely for visual consistency. Small repetition is preferred over premature extraction, and the third semantically equivalent occurrence still triggers review rather than automatic extraction.

Before a Pattern/Gouno addition or material Core extension, compare canonical UI, relevant Git history when historical prior art is useful, and matching real product cases across all completed corpora. Durable decisions live in [`docs/abstraction-register.md`](docs/abstraction-register.md); public naming/state/composition rules live in [`docs/api-specification.md`](docs/api-specification.md).

Current admitted abstractions demonstrate the process rather than a fixed catalog: `AppShell`/`PageContainer` were the initial shell baseline; `PageHeader` was re-admitted only after real page evidence; `BulkActionBar` became the first Pattern only after three different migrated collection workflows proved a smaller shared interaction than the surrounding page structures; `CodeBlock` moved from Showcase-private tooling into Core only when the public Blog reading path supplied independent product demand.

## Showcase role

Showcase separates product workspace from design-system ownership:

- **Gouno UI** — canonical `Core / Theme / Patterns / Gouno` documentation.
- **Gosso Admin** — completed first-product comparison corpus.
- **Blog Admin** — completed second-product comparison corpus.
- **Blog** — completed third-product public-site comparison corpus.

There is currently no active product workspace receiving page-by-page migration. Completed workspaces stay live as regression/comparison evidence and may be reopened only when a real new product or a discovered canonical defect creates demand.

Showcase dogfoods admitted canonical APIs. `CodeBlock` is now a canonical Core component, while Showcase's Prism renderer remains a private adapter layered on top of it. API tables, demo framing, viewport simulation and similar documentation tooling remain private; Showcase-only repetition is supporting evidence and cannot create another public abstraction by itself.

Every PascalCase Core runtime export is now assigned to a visible Core Showcase family. The coverage gate rejects `needs-review` and `unassigned` entries; established Core APIs follow the explicit retention policy rather than being removed solely because no current product calls them.

## Tabs

Core Tabs uses a mature high-level contract while retaining Radix-backed accessibility/composition:

```tsx
<Tabs
  aria-label="Account sections"
  activeKey={activeKey}
  items={[
    { key: "profile", label: "Profile" },
    { key: "security", label: "Security" },
  ]}
  onChange={setActiveKey}
/>
```

Canonical state names are `activeKey`, `defaultActiveKey`, `items[].key`, `onChange`. The pre-reset high-level `value`, `defaultValue` and `items[].value` compatibility inputs have been removed. Primitive `Tab`/`TabPanel` still use `value` only as their composition key. Standard `aria-label` / `aria-labelledby` is canonical; `ariaLabel` remains temporarily as an explicitly deprecated real-product migration bridge until vendored artifacts are refreshed. The default `type="line"` uses a lightweight ink-bar style; `type="card"` is explicit. See [`docs/migration.md`](docs/migration.md) for the breaking migration details.

## Neutral application structure

```tsx
<AppShell brand="GOSSO" navigation={renderNavigation}>
  <PageContainer>
    <PageHeader
      title="OAuth2 客户端"
      description="管理客户端注册与授权配置。"
      actions={<Button>注册客户端</Button>}
    />
    <RouteContent />
  </PageContainer>
</AppShell>
```

`AppShell` owns application chrome, `PageContainer` owns content width/rhythm, and `PageHeader` owns only page title/description/actions presentation. Routing, authentication, permissions, filtering, tables and business state stay in the consuming product unless separately admitted.

## Build and verification

```bash
npm ci
npm run release:check
```

`release:check` runs typecheck, the full test suite, package build, Showcase build and the publication-surface check. `npm run package:check` additionally verifies that formal entry points load from `dist` and that `npm pack --dry-run` contains the required public files without leaking source, Showcase, docs, scripts or workflow internals.

Main CI uses the same Node.js 24 release gate before publishing Showcase to `gh-pages`. Pull requests run the same release-readiness check. Stable npm publication is tag-driven; see [`docs/releasing.md`](docs/releasing.md).

Run `npm run showcase:dev` for local documentation/product scenarios. Showcase fixtures are static: they do not authenticate, read cookies, call APIs or mutate real application state.
