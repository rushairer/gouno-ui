# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Changed

- Data Entry 6D2: hardened Core `Slider` and `Rate` without expanding them into feature bags. Slider remains a thin native `input[type=range]` control and now exposes the real input ref, stable slot and governed focus treatment while preserving platform range/form/keyboard semantics. Rate now uses caller-owned standard ARIA on its `radiogroup`, language-neutral numeric radio names, real root ref, stable slots, click-to-clear behavior and one roving-focus Arrow/Home/End keyboard selection model.
- Data Entry 6D1: hardened Core `AutoComplete` around an accessible combobox/listbox contract with string shorthand or explicit `{ value, label, disabled }` options, caller-owned empty-state content, canonical `small/middle/large` sizing, explicit `error/warning` status, composed native input events, disabled-option keyboard skipping, real input ref and stable semantic slots. The existing `value/defaultValue/onChange` text state remains the single input value contract; `onSelect` reports confirmed suggestions without replacing `onChange`.
- Data Entry 6C2: hardened Core `DateRangePicker` as a two-native-input compound control. The root now owns only range composition/layout while `startInputProps` and `endInputProps` independently own each date input's native attributes, form identity, ARIA naming, constraints and optional ref; canonical `size/status`, root ref, stable slots and same-source Showcase/tests are included without changing the established controlled `start/end/onChange` state model.
- Data Entry 6C1: hardened Core `TimePicker` and `ColorPicker` while preserving native `input[type=time]` / `input[type=color]` semantics; both now share canonical `small/middle/large` control sizing, explicit `error/warning` status, standard DOM/ARIA extension, real input refs, stable `data-slot` anatomy, same-source Showcase examples and focused certification tests.
- Layout 6B2: hardened Core `Splitter` around canonical `Splitter.Panel` compound composition with multiple panels, controlled/uncontrolled size vectors, per-panel constraints, pointer/keyboard resizing, resize lifecycle and separator ARIA; the established two-panel `first/second/defaultSize/min/max/onResize(number)` path remains deprecated-compatible rather than removed.
- General/Layout 6B1: hardened Core `Avatar` and `Grid`; Avatar now follows canonical `small/middle/large | number` sizing while retaining deprecated `sm/default/lg` compatibility, exposes Group/Badge/Count compound anatomy, and Grid retains its simple helper while adding responsive 24-column `Row`/`Col`.
- General/Layout 6A: hardened Core `Icon`, `Kbd`, `Flex` and `Separator` with ref-safe native contracts, standard ARIA, mature layout/line capabilities, semantic slots, same-source Showcase examples and focused certification tests.
- Core reviewed-completion continues independently from runtime-family coverage; no established Core family is removed merely to raise completion percentages.

### Breaking

- `Icon.label` is replaced by the standard `aria-label` / `aria-labelledby` accessible-name path.
- `TimePicker.size` and `ColorPicker.size` now mean canonical Gouno control size (`small | middle | large`) rather than the native numeric input `size` attribute; the native numeric attribute is not meaningful for these picker controls and is intentionally excluded from the public contract.
- `DateRangePicker` no longer copies one top-level set of input attributes to both date inputs or injects English `Start date` / `End date` accessible names. Per-input `id`, `name`, ARIA, constraints, events and refs belong under `startInputProps` / `endInputProps`; the root accepts normal div attributes. Existing `start`, `end` and `onChange` remain the range state contract.
- `AutoComplete` no longer injects `No options` or reuses the native numeric input `size` attribute. Empty-state copy is opt-in through `emptyText`; `size` now follows Gouno `ControlSize`. The component-owned suggestion `onSelect(value, option)` intentionally replaces the native text-selection event of the same React prop name; consumers needing text-selection behavior should handle it through their surrounding input workflow rather than a second `onSelect` meaning.
- `Rate.label` and injected English item names such as `"4 stars"` are removed. Name the rating group with standard `aria-label` / `aria-labelledby`; each radio now exposes its language-neutral numeric value within that named group. This avoids Core-owned locale copy while retaining one `value/defaultValue/onChange` rating state contract.

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
- Assigned retained convenience/compound APIs to canonical families without deleting them merely for low usage: `SearchField -> Input`, `CheckboxField -> Checkbox`, `AvatarImage`/`AvatarFallback -> Avatar`, `Divider -> Separator`, `App`/`Container`/`AspectRatio`/`Stack` remain retained and assigned to their canonical Layout/Flex families.
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
