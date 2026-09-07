# @gouno/ui

Shared React UI system for the Gouno product family: product-agnostic Core, dedicated Theme, product-driven Pattern/Gouno abstractions, and a static Showcase used as component documentation plus real-page validation.

**Live Showcase:** https://rushairer.github.io/gouno-ui/

## Architecture

Formal public owners:

- `src/core` — product-agnostic controls, layout, data entry/display, navigation, feedback and overlays.
- `src/theme` — brand/theme state, persistence and controls.
- `src/patterns` — admitted reusable compound interactions; intentionally allowed to remain empty.
- `src/gouno` — admitted Gouno product-family structure/policy. Current runtime surface: `AppShell`, `PageContainer`, `PageHeader`, `NavigationGroup`, `navigationItemClass`.

```text
components/primitives + lib → Core → Theme → Patterns → Gouno
```

`src/legacy` is a non-public prior-art museum: not compiled, not published, hidden from Showcase and forbidden as a canonical dependency.

See [`docs/architecture.md`](docs/architecture.md) and [`docs/product-driven-development.md`](docs/product-driven-development.md).

## Public entry points

```ts
import { Button, Pagination, Table, Tabs } from "@gouno/ui/core";
import { ThemeProvider, ThemeToggle, useTheme } from "@gouno/ui/theme";
import { AppShell, PageContainer, PageHeader } from "@gouno/ui/gouno";
```

`@gouno/ui/patterns` remains a formal owner boundary but currently exports no admitted Pattern.

The root `@gouno/ui` is an external compatibility umbrella, not a fifth owner. Repository implementation and Showcase import canonical formal layers instead. Source wildcard paths and Legacy paths are not public API.

## Product-driven evolution

- Gosso Admin is the primary page-by-page migration line.
- Blog Admin and relevant Blog pages are cross-product evidence corpora.
- Pages start Core-first with Theme, admitted Gouno structure and local composition.
- Small repetition is preferred over premature extraction.
- The third semantically equivalent occurrence triggers review, not automatic extraction.
- Before a Pattern/Gouno addition or material Core extension, compare canonical UI, Legacy and matching real product cases.
- Durable decisions live in [`docs/abstraction-register.md`](docs/abstraction-register.md).
- Public naming/state/composition rules live in [`docs/api-specification.md`](docs/api-specification.md).

Current admitted Gouno examples demonstrate the process rather than a fixed catalog: `AppShell`/`PageContainer` were the initial shell baseline; `PageHeader` was later re-admitted only after Gosso Admin and Blog Admin independently proved the same title/description/actions page contract.

## Showcase role

Showcase separates product workspace from design-system ownership:

- **Gouno UI** — canonical `Core / Theme / Patterns / Gouno` documentation.
- **Gosso Admin** — only genuinely migrated pages.
- **Blog Admin** and **Blog** — remain empty until their real migration begins.

Showcase dogfoods admitted canonical APIs, but documentation tooling such as `CodeBlock`, API tables, demo framing and viewport simulation may stay private. Showcase-only repetition is supporting evidence, not sufficient reason to create a public abstraction. If a real product independently needs the same capability, the normal admission process decides whether it moves into Core/Pattern/Gouno.

## Tabs

Core Tabs uses a mature high-level contract while retaining Radix-backed accessibility/composition:

```tsx
<Tabs
  activeKey={activeKey}
  items={[
    { key: "profile", label: "Profile" },
    { key: "security", label: "Security" },
  ]}
  onChange={setActiveKey}
/>
```

Canonical state names are `activeKey`, `defaultActiveKey`, `items[].key`, `onChange`. The default `type="line"` uses a lightweight ink-bar style; `type="card"` is explicit. See [`docs/migration.md`](docs/migration.md) for temporary pre-reset compatibility names.

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
npm run typecheck
npm test -- --run
npm run build
npm run showcase:build
```

Main CI runs the same Node.js 24 gate before publishing Showcase to `gh-pages`.

Run `npm run showcase:dev` for local documentation/product scenarios. Showcase fixtures are static: they do not authenticate, read cookies, call APIs or mutate real application state.

React and React DOM are peer dependencies. Existing products using older vendored archives can migrate page-by-page; see [`docs/migration.md`](docs/migration.md).
