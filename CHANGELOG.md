# Changelog

All notable changes to this project are documented here.

## [Unreleased]

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
