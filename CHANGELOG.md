# Changelog

All notable changes to this project are documented here.

## [Unreleased]

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
