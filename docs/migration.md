# Migration guide

The package exposes three formal component layers plus a dedicated theme entry point:

```ts
import { Button, Input, Modal, DataTable } from "@gouno/ui";
```

The `components/primitives` directory is an internal Radix/shadcn behavior layer. Consumers should choose an explicit public owner:

- `@gouno/ui/core` for pure controls and visual primitives.
- `@gouno/ui/patterns` for reusable compound interactions.
- `@gouno/ui/gouno` for Gouno product shells and templates.
- `@gouno/ui/theme` for theme context and theme controls.

## Curated subpaths

The former source-directory wildcard exports (`@gouno/ui/core/*`, `@gouno/ui/patterns/*`, and `@gouno/ui/gouno/*`) are no longer public API. They exposed physical files as accidental package contracts and allowed internal aliases or duplicate ownership to bypass the formal layer entry points.

Migrate wildcard imports to the owning layer:

```ts
// Before
import { DataTable } from "@gouno/ui/patterns/data-table";
import { AdminShell } from "@gouno/ui/gouno/admin-shell";

// After
import { DataTable } from "@gouno/ui/patterns";
import { AdminShell } from "@gouno/ui/gouno";
```

`FormLayout`, `FormGrid`, and `FormActions` are Core-owned APIs. Import them from `@gouno/ui/core` (or the package root), not from `@gouno/ui/patterns`.

## Ownership cleanup

Patterns no longer carries duplicate implementations or aliases for Core `Tabs` and `Pagination`. Import those from `@gouno/ui/core`.

Theme APIs have one formal owner. `ThemeProvider`, `useTheme`, and `ThemeToggle` are exported from `@gouno/ui/theme` (and the package root), not from `@gouno/ui/gouno`.

`BulkActionBar` is now product-agnostic. Product-specific actions such as AI assistance belong in caller-provided `children` instead of dedicated `onAIAssist`/`aiLabel` props.
