# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added

- Added a reusable DataTable data-source mode with column definitions, sorting, filtering, pagination, row selection, loading, empty, and density states, plus a dedicated Showcase page.
- Added a first-class Form wrapper with vertical/horizontal layouts, native FormData submission, disabled/loading fieldsets, and `onFinish` support.
- Added Overlay behavior coverage for Modal and Drawer Escape handling, focus restoration, placement metadata, and responsive direction semantics.
- Added keyboard navigation to AutoComplete and a typed, accessible TreeSelect API with controlled values, multiple selection, disabled nodes, and native form attributes.
- Added the Core Icon API, Form alias, DateRangePicker, Splitter, Layout regions, InputOTP, Popconfirm, Message, Notification, Tour, Cascader, TreeSelect, Transfer, Mentions, Tree, Menu, QRCode, Watermark, Affix, BackTop, Slider, Rate, Segmented, AutoComplete, Collapse, Popover, Tooltip, and DropdownMenu.
- Added hash-addressable Showcase documentation for each Core component with live Preview, source Code, usage guidance, and API tables.
- Added multi-example documentation support and detailed Form, Select, Upload, and Table state examples.
- Added controlled and uncontrolled Upload file lists, count and size limits, removal callbacks, errors, and accessible error relationships.
- Added a dedicated Showcase TypeScript project so `npm run typecheck` validates the component documentation and product scenarios.
- Added Core tests for state, boundaries, ARIA semantics, keyboard behavior, and Upload list management.
- Added `AGENTS.md` with the Core, Patterns, Gouno, primitives, and Showcase architecture rules.

### Changed

- Expanded Showcase Data Display examples to cover DataTable behavior and selection state.
- Expanded Showcase Form examples to cover validation, horizontal responsive layout, read-only, disabled, and loading states.
- Expanded data-entry tests for AutoComplete keyboard selection and TreeSelect controlled behavior.
- Split Core Showcase documents into General, Layout, Data Entry, Navigation, Data Display, Feedback, and Other registries.
- Split Blog, Blog Admin, and Gosso Admin scenarios into focused product demo modules.
- Reduced `showcase/main.tsx` to application shell, routing, navigation, theme, and viewport responsibilities.
- Lazy-load Core documentation to reduce the initial Showcase bundle.
- Exported `TableDensity` from the public Patterns API.

### Fixed

- Keep the active Showcase navigation item visible after hash navigation and style selection from `aria-current="page"`.

### Removed

- Removed obsolete overview, placeholder category, combined overlay, and superseded demo pages.

## [0.1.0] - 2026-09-05

### Added

- Initial standalone `@gouno/ui` package with semantic themes, local fonts, accessible Radix-based primitives, Core components, reusable Patterns, Gouno product templates, and a static Showcase.
