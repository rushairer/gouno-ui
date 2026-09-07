# Migration guide

The package has four formal public owners:

- `@gouno/ui/core` — product-agnostic controls and visual primitives.
- `@gouno/ui/theme` — theme/brand state and controls.
- `@gouno/ui/patterns` — admitted compound interactions; currently intentionally empty.
- `@gouno/ui/gouno` — admitted Gouno product-family structure.

`src/legacy` is not public API and has no import path.

## Root compatibility umbrella

The package root `@gouno/ui` remains available because existing Gouno products still consume it. It is a compatibility umbrella, not a fifth owner.

New code should prefer canonical formal entry points. Gouno UI implementation and Showcase must not depend on the root umbrella.

## Product-validation reset

The repository has moved from speculative Pattern/Gouno catalog design to product-driven validation.

Pre-validation Pattern/Gouno implementations have been removed from canonical public entries and preserved only as source snapshots under `src/legacy`. This includes historical concepts such as DataTable, Toast orchestration, Feedback/AsyncState, ConfirmDialog, BulkActionBar, SectionNav, Panel/PageHeader families, product status tags and page templates.

These are **not** compatibility imports:

```ts
// No longer canonical/public
import { DataTable, ToastProvider } from "@gouno/ui/patterns";
import { Panel, PageHeader, DashboardTemplate } from "@gouno/ui/gouno";
```

When a real product page needs similar behavior, rebuild Core-first and run the admission process in `docs/product-driven-development.md`. Do not import from `src/legacy`.

Existing products using an older vendored `@gouno/ui` archive can continue on that immutable archive until the relevant pages are migrated. The standalone repository does not preserve speculative aliases solely to imitate those old archives.

## Application structure rename

The previously admitted shell/container names have been made product-neutral:

```ts
// Before
import { AdminShell, AdminPage } from "@gouno/ui/gouno";

// Now
import { AppShell, PageContainer } from "@gouno/ui/gouno";
```

Rationale:

- `AppShell` is the application-chrome contract: header, desktop navigation, mobile navigation surface, main region and focus-return behavior. It does not own routing, authentication, permissions or business state.
- `PageContainer` is only a content-width and vertical-rhythm container. The old `AdminPage` name implied administration even though the implementation did not contain admin semantics.
- `NavigationGroup` and `navigationItemClass` keep their existing names because they are already domain-neutral.

Do not introduce `Admin*` aliases unless administration itself becomes a proven semantic contract with independent behavior.

## Tabs high-level API alignment

Core Tabs now uses the mature high-level naming adopted by the repository API rules while retaining the Radix-backed composition API.

```tsx
// Canonical high-level API
<Tabs
  activeKey={activeKey}
  defaultActiveKey="profile"
  items={[
    { key: "profile", label: "Profile" },
    { key: "security", label: "Security" },
  ]}
  onChange={setActiveKey}
/>
```

Migrate pre-reset call sites as they are touched:

```text
value              → activeKey
defaultValue       → defaultActiveKey
items[].value      → items[].key
onValueChange      → onChange
```

`type="line"` is the default product style; `type="card"` is explicit. `size` uses `small/middle/large`; `tabPosition` uses `top/right/bottom/left`.

The pre-reset `value/defaultValue/items[].value` shape is temporarily accepted only so already-migrated fixtures are not broken in the middle of the product-validation sequence. It is not documented as a second canonical API and must be removed before the next stable package release.

For custom composition, use `Tabs` with `TabList`, `Tab`, and `TabPanel`; do not create another public active-state write path.

## Curated subpaths

Physical source files are not public subpaths. Use the owning formal layer:

```ts
import { Button, Table, Pagination } from "@gouno/ui/core";
import { ThemeProvider, ThemeToggle } from "@gouno/ui/theme";
import { AppShell, PageContainer } from "@gouno/ui/gouno";
```

Do not use source wildcard paths such as `@gouno/ui/core/*`, `@gouno/ui/patterns/*`, `@gouno/ui/gouno/*`, or any Legacy path.

## Canonical owners retained

`FormLayout`, `FormGrid`, `FormActions`, `Tabs`, `Pagination`, `Table` and `TableDensity` are Core-owned APIs.

`ThemeProvider`, `useTheme`, `ThemeToggle`, theme modes and brand types are Theme-owned APIs.

The current Pattern entry exists as a formal owner boundary but exports nothing until a real interaction passes admission.

## Removed inert ConfigProvider

`ConfigProvider`, `useConfig` and `UIConfig` remain removed. The former context stored settings that canonical components did not consume.

Use explicit component props for control configuration and `ThemeProvider` for theme/brand behavior. A future global configuration API must be introduced together with real component consumption, precedence rules, documentation and tests.

## Showcase migration meaning

Product workspace navigation represents real migration only:

- Gosso Admin contains only pages actually migrated under the current process.
- Blog Admin and Blog remain empty until real pages are moved.
- Old simulated pages are intentionally removed rather than kept as placeholders.

The Gouno UI workspace documents only canonical APIs. Legacy is not shown. Showcase-local documentation utilities are not public-abstraction evidence by themselves; see `docs/architecture.md` and PD-009.

## Compatibility assessment

This reset removes/renames public exports and therefore has breaking compatibility impact for consumers that update to this repository's next package artifact. Treat a future published package accordingly under SemVer or provide an explicit migration release note.

The current workflow is deliberately page-by-page: consumer products should not mechanically replace removed Pattern/Gouno APIs with new wrappers. Let each real page prove which abstractions should return.
