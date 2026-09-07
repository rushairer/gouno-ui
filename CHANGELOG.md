# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added

- Added a zero-whitelist TypeScript contract test requiring every formal public JSX component in Core, Theme, Patterns, and Gouno to export an exact named `ComponentNameProps` type.
- Added bilingual names and red, explicitly estimated API-plus-examples completion badges to incomplete Core component and product-scenario entries in the Showcase navigation; completed entries omit the badge.
- Added separate Ant Design-style Badge and Tag APIs: Badge now covers counts, dots, overflow, zero visibility, statuses, colors, sizes, offsets, and dynamic values; Tag covers semantic and custom colors, icons, borders, closing, disabled behavior, and controlled or uncontrolled CheckableTag selection.
- Added dedicated Badge and Tag Showcase pages with interaction-complete examples, matching source code, and full API tables.
- Added theme-aware TSX syntax highlighting and an accessible copy action to every Showcase source-code block.
- Added a reusable DataTable data-source mode with column definitions, sorting, filtering, pagination, row selection, loading, empty, and density states, plus a dedicated Showcase page.
- Added a first-class Form wrapper with vertical/horizontal layouts, native FormData submission, disabled/loading fieldsets, and `onFinish` support.
- Added Overlay behavior coverage for Modal and Drawer Escape handling, focus restoration, placement metadata, and responsive direction semantics.
- Added keyboard navigation to AutoComplete and a typed, accessible TreeSelect API with controlled values, multiple selection, disabled nodes, and native form attributes.
- Added architecture regression coverage for curated package exports, canonical symbol ownership including type-only exports, exact root-union compatibility, real TypeScript dependency direction, direct internal imports, product-policy leakage, catch-all implementation modules, theme ownership, and Gouno layout aliases.
- Added `docs/architecture.md` as the executable ownership and dependency contract.
- Added focused Toast tests covering one backend, nested-provider inheritance and the declarative bridge.
- Added `AGENTS.md` with the Core, Theme, Patterns, Gouno, primitives, Showcase and dependency-DAG architecture rules.

### Changed

- Completed named Props coverage for all currently exported public JSX components; thin wrappers use type-only runtime-derived aliases so the formal contract cannot drift from implementation.
- Curated package exports to the formal root, Core, Patterns, Gouno, and Theme entry points instead of exposing source directories through wildcard subpaths.
- Converted all four formal layer entry points to explicit symbol manifests; the root remains the sole compatibility umbrella and is verified as the exact layer union plus `cn`.
- Enforced single component ownership: Core owns Tabs/Pagination/Form layout/TableDensity, Theme owns ThemeProvider/useTheme/ThemeToggle, and Patterns no longer reimplements or re-exports those APIs.
- Split Pattern feedback responsibilities into focused Feedback, AsyncState and Toast modules.
- Kept DataTable as one public Pattern while moving sorting/filtering/pagination/selection/expansion state and derivation to a private model module; DataTable no longer re-exports Core Table primitives or its internal types.
- Unified ToastProvider, `useToast` and the declarative Toast bridge on one Sonner-backed orchestration path instead of maintaining a second local toast state/timer stack.
- Added named public Props for Gouno navigation groups and page-template components.
- Made `BulkActionBar` product-agnostic; product actions such as AI assistance are caller-composed children rather than dedicated Pattern props.
- Split unrelated Core implementation catch-alls: Spinner, Progress, AspectRatio, Kbd, App, FloatButton, Anchor, Spin, DateRangePicker, TimePicker, ColorPicker, Statistic, and Timeline now have focused modules; generic Typography is grouped with the typography family.
- Converted Gouno `layout.tsx` into a pure export barrel and split Panel, Page, DefinitionList, and ListStack families into focused modules.
- Clarified the Core, Theme, Patterns and Gouno ownership boundaries while preserving the package root as a convenience aggregate entry.
- Standardized `TableCaption` and `DataTable` on `captionSide`; removed the former `captionPosition`, `position`, and `TableCaptionPosition` aliases.
- Widened the desktop and mobile Showcase navigation surfaces and reserved flexible label space so progress badges never cover long component names.
- Replaced status-pill uses of Badge in Showcase product scenarios and data examples with the semantically correct Tag component.
- Expanded Showcase Data Display examples to cover DataTable behavior and selection state.
- Expanded Showcase Form examples to cover validation, horizontal responsive layout, read-only, disabled, and loading states.
- Rebuilt the Button Showcase page as the documentation reference with variant, size, icon, loading, disabled, shape, block, link semantics, per-demo source, and complete API examples.
- Split Core Showcase documents into General, Layout, Data Entry, Navigation, Data Display, Feedback, and Other registries.
- Split Blog, Blog Admin, and Gosso Admin scenarios into focused product demo modules.
- Reduced `showcase/main.tsx` to application shell, routing, navigation, theme, and viewport responsibilities.
- Lazy-load Core documentation to reduce the initial Showcase bundle.

### Fixed

- Nested `ToastProvider` instances now inherit the existing provider instead of creating an invisible second notification state.
- Restored a visible separator between `DataTable` captions and table content in both top and bottom positions.
- Prevented vertical Space from stretching inline Badge and CheckableTag children to the full container width; `align="stretch"` remains available for intentional full-width layouts.
- Kept code syntax colors synchronized with the active light, dark, system, and brand theme tokens instead of using a fixed editor theme.
- Centered single-icon buttons by removing empty label spans and applying the shared icon wrapper geometry.
- Made every Button Showcase demo interactive and aligned each displayed source block with its rendered example.
- Updated the external ButtonLink example to the Gouno UI GitHub repository.
- Keep the active Showcase navigation item visible after hash navigation and style selection from `aria-current="page"`.

### Removed

- Removed inert `ConfigProvider`, `useConfig`, and `UIConfig` APIs because no public component consumed their `componentSize` or `direction` values.
- Removed source-directory wildcard public subpaths (`@gouno/ui/core/*`, `@gouno/ui/patterns/*`, `@gouno/ui/gouno/*`).
- Removed duplicate Patterns Tabs/Pagination implementations and the `SubnavTabs` alias.
- Removed dead, non-public feedback exports and the duplicate local ToastProvider state/timer implementation.
- Removed Gouno `WorkspacePanel` and `AdminPageHeader` synonym aliases; use `Panel` and `PageHeader`.
- Removed product-specific `onAIAssist`/`aiLabel` policy from `BulkActionBar`.
- Removed obsolete overview, placeholder category, combined overlay, and superseded demo pages.

## [0.1.0] - 2026-09-05

### Added

- Initial standalone `@gouno/ui` package with semantic themes, local fonts, accessible Radix-based primitives, Core components, reusable Patterns, Gouno product templates, and a static Showcase.
