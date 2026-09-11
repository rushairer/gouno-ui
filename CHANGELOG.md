# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Changed

- Layout 6B2: hardened Core `Splitter` around canonical `Splitter.Panel` compound composition with multiple panels, controlled/uncontrolled size vectors, per-panel constraints, pointer/keyboard resizing, resize lifecycle and separator ARIA; the established two-panel `first/second/defaultSize/min/max/onResize(number)` path remains deprecated-compatible rather than removed.
- General/Layout 6B1: hardened Core `Avatar` and `Grid`; Avatar now follows canonical `small/middle/large | number` sizing while retaining deprecated `sm/default/lg` compatibility, exposes Group/Badge/Count compound anatomy, and Grid retains its simple helper while adding responsive 24-column `Row`/`Col`.
- General/Layout 6A: hardened Core `Icon`, `Kbd`, `Flex` and `Separator` with ref-safe native contracts, standard ARIA, mature layout/line capabilities, semantic slots, same-source Showcase examples and focused certification tests.
- Core reviewed-completion continues independently from runtime-family coverage; no established Core family is removed merely to raise completion percentages.

### Breaking

- `Icon.label` is replaced by the standard `aria-label` / `aria-labelledby` accessible-name path.

## [0.2.0] - 2026-09-10

`0.2.0` is the first product-validated release after the initial standalone package. It intentionally contains pre-1.0 breaking API corrections. See [`docs/migration.md`](docs/migration.md) for consumer migration details.

### Added

- Added the completed Gosso Admin, Blog Admin and Gouno Blog public Showcase corpora as live regression and abstraction evidence rather than simulated product demos.
- Added canonical Core `CodeBlock` after independent Blog article and Showcase evidence converged on the same read-only code/copy contract; syntax highlighting remains caller-owned.
- Added canonical Pattern `BulkActionBar` after multiple independent Blog Admin collection workflows proved one stable selection-toolbar interaction. It is the only currently admitted Pattern.
- Added product-driven governance for abstraction admission, API conformance, design language, Core retention and runtime-family coverage.
- Added a zero-pending Core runtime-family gate: every PascalCase Core runtime export must map to a visible Core Showcase family and cannot remain `needs-review` or `unassigned`.
- Added focused behavior, accessibility, API-documentation, architecture, product-fixture and source-trust regression coverage across the validated component surface.

### Changed

- Formalized the public dependency/ownership chain as `Core -> Theme -> Patterns -> Gouno`; the package root remains a compatibility umbrella rather than a fifth owner.
- Curated package entry points and explicit symbol manifests; canonical implementation and Showcase consume formal layer entry points rather than source-directory wildcards or the root umbrella.
- Quarantined `src/legacy` outside canonical builds, publication, Showcase and dependency flow. Legacy is prior art only, not a compatibility layer or naming precedent.
- Re-admitted only evidence-backed Gouno structure: `AppShell`, `PageContainer`, `PageHeader`, `NavigationGroup` and `navigationItemClass`.
- Hardened Tabs around one high-level state contract: `activeKey`, `defaultActiveKey`, `items[].key`, `onChange`. Primitive `Tab` / `TabPanel value` remains only the composition key. Standard `aria-label` / `aria-labelledby` is canonical; `ariaLabel` remains temporarily as an explicit deprecated bridge for atomic real-product artifact upgrades.
- Hardened `Steps` and `Menu` around stable keys, explicit selection/expansion state, hierarchical navigation and keyboard/accessibility behavior without compatibility feature bags or injected English accessible copy.
- Hardened `Empty`, `Result`, `Skeleton`, `QRCode`, `Statistic`, `Spin` and `Spinner` so product copy, live-region policy, surface/elevation and standard DOM/ARIA ownership stay explicit rather than being injected as hidden defaults.
- Hardened `Segmented`, `Anchor`, `Alert`, `Modal`, `Card`, Table row-action composition and other Core families from real product pressure tests while keeping domain orchestration product-owned.
- Standardized compound spacing and surface ownership: parents own structural spacing between semantic slots; content regions own internal padding/rhythm; Tabs indicators stay inside the TabList scroll boundary.
- Standardized semantic elevation roles and product-surface rules, replacing ad-hoc page-level shadow-size decisions with governed `control`, `surface`, `raised`, `overlay` and `modal` responsibilities.
- Assigned retained convenience/compound APIs to canonical families without deleting them merely for low usage: `SearchField -> Input`, `CheckboxField -> Checkbox`, `AvatarImage`/`AvatarFallback -> Avatar`, `Divider -> Separator`, `App`/`Container`/`AspectRatio -> Page Layout`, `Stack -> Flex`.
- Upgraded the verification/publish baseline to Node.js 24 with immutable SHA-pinned GitHub Actions; main must pass typecheck, the complete test suite, package build and Showcase build before Pages publication.

### Removed / Breaking

- Removed speculative public Pattern/Gouno surfaces that were not re-proven by real products, including the historical broad DataTable/Toast/Feedback/AsyncState/page-utility feature bags. Their Legacy snapshots remain non-public prior art only.
- Removed inert global configuration APIs such as `ConfigProvider`, `useConfig` and `UIConfig` when no canonical component consumed their configuration.
- Removed public source-directory wildcard subpaths and duplicate ownership/re-export paths.
- Removed duplicate Pattern-level Tabs/Pagination implementations and `SubnavTabs`; Core is the single owner.
- Removed high-level Tabs `value`, `defaultValue`, `items[].value` and `onValueChange` compatibility paths. Consumers must use the canonical keyed contract.
- Removed or renamed non-canonical compatibility inputs as documented in the migration guide, including affected Alert, Empty, Result, QRCode, Steps and Menu contracts. No aliases are added merely to preserve historical Gouno/Legacy naming.

### Delivery

- The three completed product corpora remain in Showcase as comparison/regression evidence; there is intentionally no fabricated fourth-product migration line.
- Main validation now treats a phase as complete only after exact-head CI passes and the matching Showcase commit is published to `gh-pages`.

## [0.1.0] - 2026-09-05

### Added

- Initial standalone `@gouno/ui` package with semantic themes, local fonts, accessible Radix-based primitives, Core components, reusable Patterns, Gouno product templates, and a static Showcase.
