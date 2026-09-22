# Changelog

All notable changes to this project are documented here.

## [Unreleased]

## [0.4.9] - 2026-09-22

### Fixed
- Select and TreeSelect multi-value triggers keep the shared picker chevron anchored to the trailing edge instead of letting selected tags consume the trigger width.
- Preserve canonical single-value Select, TreeSelect and Cascader trigger geometry while adding focused unit and browser regression coverage for picker alignment.

## [0.4.8] - 2026-09-19

### Fixed
- Modal and Drawer now recognize Gouno-owned transient popup portals as nested interaction rather than backdrop interaction, so choosing a Select/Popover/Dropdown option no longer dismisses the owning blocking surface.
- Select remains a non-modal popup and keeps surrounding page controls accessible while open; regression coverage protects both existing Select behavior and nested Drawer interaction.

## [0.4.7] - 2026-09-19

### Added
- Accessibility Foundation ownership and executable guards for Field/composite controls, visible Select naming, contextual Tree/Collapse disclosure names, localized overlay close labels, and landmark/live-region behavior.
- Private picker control infrastructure shared by visible picker surfaces, plus a regression contract preventing Core pickers from silently reverting to OS-native visible menus.
- Semantic Layer and logical-edge utilities used by canonical product surfaces instead of raw global z-index and physical left-border ownership.

### Changed
- Cascader now renders one Gouno-owned combobox trigger with a multi-column cascading popup instead of visible native selects.
- TreeSelect now renders a real Tree popup for single/multiple selection while keeping an aria-hidden native select only as a form/ref compatibility bridge.
- Pagination page-size selection now reuses canonical Core Select.
- Select, Field, Modal, Drawer, Dialog, Sheet, Tree, Collapse, Tag, AppShell, PageContainer and related primitives consume the certified Foundation contracts for accessibility, focus, state, geometry, motion, surface and overlay ownership.

### Fixed
- Steps connector/copy geometry, Carousel arrow interaction ownership, ConfigProvider locale proof, and Tag close/check interactive ownership.
- Select accessible-name/id ownership and required/error state now belong to the visible combobox without duplicate hidden-control semantics.
- Deep controlled TreeSelect values expand their complete ancestor path, and visible picker interaction remains source-compatible with established value/callback contracts.

## [0.4.6] - 2026-09-18

### Changed
- Canonical Showcase composition helpers now consume semantic Typography props and roles directly, including TabPanelLead, Dedicated Editor, Editor Form, Admin Data Composition, and Data Summary surfaces.
- Foundation integrity checks now guard canonical composition helpers in addition to product corpora so Showcase patterns cannot reintroduce raw heading or text-metric authority.

### Fixed
- Preserve caller-owned `data-slot` values through Core `Heading`, `Text`, and `Typography` composition so wrappers such as `Result` retain stable structural selectors instead of being overwritten by the inner Typography primitive.
- Re-certified canonical visual goldens after composition-helper Typography closure across responsive light/dark representatives.


## [0.4.5] - 2026-09-18

### Added
- Foundation Integrity Program with machine-readable seven-gate certification, CI enforcement, and explicit review reopening when a Foundation is not certified.
- Semantic Typography roles for page/task/section/compact headings, metric values, body emphasis, font families, relaxed reading rhythm, and Public Blog reading surfaces.
- `Text` semantic `weight`, `family`, and `leading` controls plus `Result.titleVariant` so visual hierarchy is independent from HTML heading level.

### Changed
- `PageHeader`, Dedicated Editor, Result, Statistic, Empty, Descriptions, Blog Admin, Gosso Admin, and Public Blog canonical fixtures now resolve typography through governed roles instead of page-local size/weight/line-height utilities.
- Canonical Product Corpus now reports and blocks raw heading/Text/native typography metric bypasses across Public Blog, Blog Admin, and Gosso Admin.
- Canonical visual goldens were re-certified after the Typography Foundation migration across light/dark and responsive representatives.

### Fixed
- Removed the previous H1/H2 visual collision where different semantic heading levels could resolve to the same local `text-2xl` size.
- Eliminated product-local arbitrary 10px/11px metadata sizing and ungoverned `font-*`, `leading-*`, `tracking-*`, and raw text-size overrides from the certified Showcase product corpus.


## [0.4.4] - 2026-09-17

### Added
- Canonical Blog Admin AI Operations Showcase grounded in the real Blog Admin workflow, Run, approval, interaction, media and evidence capabilities.
- Product-level Workflow master-detail, Decision Workbench and Run Evidence compositions with responsive and visual-golden coverage.

### Changed
- AI Settings Showcase now groups Agent, Skill, Provider, Embedding and Connector governance around explicit product semantics instead of flat configuration fields.
- Workflow automation surfaces now use a consistent list-item anatomy, operational summary hierarchy and source-grounded Fixture scenarios.

### Fixed
- Recent Workflow Run rows preserve desktop column semantics inside Gouno Button composition and collapse cleanly on narrow viewports.
- Workflow selection, filtered Run detail and failed/Dry-run evidence stay synchronized across the AI Operations workspace.

## [0.4.3] - 2026-09-17

### Added
- Document editor patterns for canonical Showcase-to-product adoption: `DocumentEditorShell`, `MarkdownEditor`, `AISuggestionPicker` and `AISuggestionReview`.
- Responsive Markdown authoring with edit, split and preview modes, adaptive formatting tools, and icon-only AI regeneration actions.

### Changed
- Standardized AI suggestion selection and multi-field review semantics so users explicitly choose suggestions before applying them.

## [0.4.2] - 2026-09-16

### Fixed
- Resolve `ButtonLink` and `IconButtonLink` visual classes before Radix `Slot` composition so semantic link buttons no longer retain conflicting base radius or color utilities; circular icon links now preserve the same canonical shape as `IconButton`.

## [0.4.1] - 2026-09-15

### Added
- Core `Notification` now supports caller-owned `type` (`info` / `success` / `warning` / `error`), accessible manual dismissal through `closable`, and explicit `persistent: true` notices that must remain user-closeable.

### Changed
- Notification severity now owns its status icon and `status`/`alert` live-region role while retaining the opaque `bg-popover` + `shadow-overlay` surface. Transient notices keep the finite 4500ms fallback for omitted, invalid or non-positive duration values.


## [0.4.0] - 2026-09-14

### Added
- `PageSkeleton`, a deliberately low-fidelity Gouno page-loading primitive with `collection`, `form` and `dashboard` layouts for ordinary product loading states.
- Core locale-only ConfigProvider, English and Simplified Chinese packs, and typed local copy overrides for Input, DatePicker, InputNumber, Select, Upload and Pagination.

### Fixed
- Select clear and tag-removal keyboard actions, focus return, generated listbox IDs and searchable active-descendant ownership.
- Input suffix/clear spacing and Pagination ReactNode navigation labels.
- Showcase Fixture controls reserve tooling space instead of covering product actions; standalone page navigation starts collapsed.

### Changed
- Showcase product routes and Fixtures now use the same loading anatomy: common administrative pages use `PageSkeleton`, while editorial, feed and other specialized pages retain product-local loaders.
- Participating controls use English fallback consistently. Configure zhCN to retain Chinese defaults; existing explicit text remains authoritative. See [migration](docs/component-localization.md).
- Review completion retains scope/evidence and can reopen after a defect instead of requiring every catalog entry to remain permanently at 100.

## [0.3.5] - 2026-09-13

### Added

- Published the canonical Gouno family product marks through `@gouno/ui/brand-icons/*` so product shells and Showcase can share the exact same SVG assets.

### Fixed

- Normalized native Checkbox and Radio layout to a block formatting box so embedded selection controls no longer reserve inline baseline whitespace in cards and overlays.
