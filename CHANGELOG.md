# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added

- Added separate Ant Design-style Badge and Tag APIs: Badge now covers counts, dots, overflow, zero visibility, statuses, colors, sizes, offsets, and dynamic values; Tag covers semantic and custom colors, icons, borders, closing, disabled behavior, and controlled or uncontrolled CheckableTag selection.
- Added dedicated Badge and Tag Showcase pages with interaction-complete examples, matching source code, and full API tables.
- Added theme-aware TSX syntax highlighting and an accessible copy action to every Showcase source-code block.
- Added a reusable DataTable data-source mode with column definitions, sorting, filtering, pagination, row selection, loading, empty, and density states, plus a dedicated Showcase page.
- Added a first-class Form wrapper with vertical/horizontal layouts, native FormData submission, disabled/loading fieldsets, and `onFinish` support.
- Added Overlay behavior coverage for Modal and Drawer Escape handling, focus restoration, placement metadata, and responsive direction semantics.
- Added keyboard navigation to AutoComplete and a typed, accessible TreeSelect API with controlled values, multiple selection, disabled nodes, and native form attributes.
- Expanded Button with dashed/text variants, Ant-style size aliases, round/circle shapes, block layout, loading text, and a fully navigable ButtonLink supporting `href`, router `to`, disabled, and loading states.
- Added the Core Icon API, Form alias, DateRangePicker, Splitter, Layout regions, InputOTP, Popconfirm, Message, Notification, Tour, Cascader, TreeSelect, Transfer, Mentions, Tree, Menu, QRCode, Watermark, Affix, BackTop, Slider, Rate, Segmented, AutoComplete, Collapse, Popover, Tooltip, and DropdownMenu.
- Added hash-addressable Showcase documentation for each Core component with live Preview, source Code, usage guidance, and API tables.
- Added multi-example documentation support and detailed Form, Select, Upload, and Table state examples.
- Added controlled and uncontrolled Upload file lists, count and size limits, removal callbacks, errors, and accessible error relationships.
- Added a dedicated Showcase TypeScript project so `npm run typecheck` validates the component documentation and product scenarios.
- Added Core tests for state, boundaries, ARIA semantics, keyboard behavior, and Upload list management.
- Added `AGENTS.md` with the Core, Patterns, Gouno, primitives, and Showcase architecture rules.

### Changed

- Replaced status-pill uses of Badge in Showcase product scenarios and data examples with the semantically correct Tag component.
- Expanded Showcase Data Display examples to cover DataTable behavior and selection state.
- Expanded Showcase Form examples to cover validation, horizontal responsive layout, read-only, disabled, and loading states.
- Expanded data-entry tests for AutoComplete keyboard selection and TreeSelect controlled behavior.
- Rebuilt the Button Showcase page as the documentation reference with variant, size, icon, loading, disabled, shape, block, link semantics, per-demo source, and complete API examples.
- Split Core Showcase documents into General, Layout, Data Entry, Navigation, Data Display, Feedback, and Other registries.
- Split Blog, Blog Admin, and Gosso Admin scenarios into focused product demo modules.
- Reduced `showcase/main.tsx` to application shell, routing, navigation, theme, and viewport responsibilities.
- Lazy-load Core documentation to reduce the initial Showcase bundle.
- Exported `TableDensity` from the public Patterns API.

### Fixed

- Prevented vertical Space from stretching inline Badge and CheckableTag children to the full container width; `align="stretch"` remains available for intentional full-width layouts.
- Kept code syntax colors synchronized with the active light, dark, system, and brand theme tokens instead of using a fixed editor theme.
- Centered single-icon buttons by removing empty label spans and applying the shared icon wrapper geometry.
- Made every Button Showcase demo interactive and aligned each displayed source block with its rendered example.
- Updated the external ButtonLink example to the Gouno UI GitHub repository.
- Keep the active Showcase navigation item visible after hash navigation and style selection from `aria-current="page"`.

### Removed

- Removed obsolete overview, placeholder category, combined overlay, and superseded demo pages.

## [0.1.0] - 2026-09-05

### Added

- Initial standalone `@gouno/ui` package with semantic themes, local fonts, accessible Radix-based primitives, Core components, reusable Patterns, Gouno product templates, and a static Showcase.
