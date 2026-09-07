# Migration guide

The package exposes three formal component layers plus a dedicated Theme entry point:

- `@gouno/ui/core` — pure controls and visual primitives.
- `@gouno/ui/patterns` — reusable compound interactions.
- `@gouno/ui/gouno` — Gouno product shells and templates.
- `@gouno/ui/theme` — theme context and theme controls.

The package root remains a convenience aggregate entry.

## Curated subpaths

Source-directory wildcard exports (`@gouno/ui/core/*`, `@gouno/ui/patterns/*`, `@gouno/ui/gouno/*`) are no longer public API. Migrate physical-file imports to the owning layer:

```ts
// Before
import { DataTable } from "@gouno/ui/patterns/data-table";
import { AdminShell } from "@gouno/ui/gouno/admin-shell";

// After
import { DataTable } from "@gouno/ui/patterns";
import { AdminShell } from "@gouno/ui/gouno";
```

## Canonical owners

`FormLayout`, `FormGrid`, `FormActions`, `Tabs`, `Pagination`, and `TableDensity` are Core-owned APIs. Import them from `@gouno/ui/core` (or the package root), not Patterns.

`ThemeProvider`, `useTheme`, and `ThemeToggle` are Theme-owned APIs. Import them from `@gouno/ui/theme` (or the package root), not Gouno.

Patterns no longer carries duplicate Tabs/Pagination implementations or the `SubnavTabs` alias.

## Removed inert ConfigProvider

`ConfigProvider`, `useConfig`, and `UIConfig` have been removed from the public API. The former context stored `componentSize` and `direction`, but no public component consumed those values, so wrapping an application in it did not change component behavior.

Use explicit component props for control configuration and `ThemeProvider` only for theme/brand/density behavior. A future global configuration API must be introduced only together with audited component consumption, precedence rules, documentation and behavior tests.

## BulkActionBar

`BulkActionBar` is product-agnostic. Product-specific actions such as AI assistance are caller-provided children instead of dedicated `onAIAssist`/`aiLabel` props.

```tsx
<BulkActionBar selectionLabel="已选择 3 项" onCancel={clearSelection}>
  <Button onClick={runAIAssist}>交给 AI</Button>
</BulkActionBar>
```

## Gouno layout aliases

Use `Panel` instead of the removed `WorkspacePanel` alias, and `PageHeader` instead of `AdminPageHeader`.

Gouno layout families remain available through `@gouno/ui/gouno`; the source-level `layout.tsx` file is now an export-only barrel and is not a separate public subpath.
