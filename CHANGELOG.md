# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added
- Core locale-only ConfigProvider, English and Simplified Chinese packs, and typed local copy overrides for Input, DatePicker, InputNumber, Select, Upload and Pagination.

### Fixed
- Checkbox and Radio native inputs now establish a block formatting box so embedded selection controls do not inherit inline baseline whitespace inside product overlays and cards.
- Select clear and tag-removal keyboard actions, focus return, generated listbox IDs and searchable active-descendant ownership.
- Input suffix/clear spacing and Pagination ReactNode navigation labels.
- Showcase Fixture controls reserve tooling space instead of covering product actions; standalone page navigation starts collapsed.

### Changed
- Participating controls use English fallback consistently. Configure zhCN to retain Chinese defaults; existing explicit text remains authoritative. See [migration](docs/component-localization.md).
- Review completion retains scope/evidence and can reopen after a defect instead of requiring every catalog entry to remain permanently at 100.

## [0.3.4] - 2026-09-13

### Fixed

- Bound the npm release job to the `npm` GitHub Environment so configured npm Trusted Publishing can authenticate tag-driven releases with provenance.

## [0.3.3] - 2026-09-13

### Changed

- Switched the release path to npm Trusted Publishing with GitHub Actions provenance after publisher configuration was completed.

## [0.3.2] - 2026-09-13

### Fixed

- Fixed the tag-driven npm release workflow to publish the generated local tarball path correctly, preserving npm provenance and Trusted Publishing support.

## [0.3.1] - 2026-09-13

### Added

- Added standard public npm distribution metadata for `@gouno/ui`, including immutable registry release metadata and the MIT license.
- Added package-surface validation through `package:check` and `release:check`, with CI release gates covering the published entry points and archive contents.
- Added tag-driven npm publishing with npm provenance / Trusted Publishing support and GitHub Release artifact creation.
- Added release documentation describing immutable versions, exact release identity, npm authentication and consumer upgrades.


## [0.3.0] - 2026-09-12

### Changed

- Other 6F3: hardened Core `Affix` as a standard top-sticky container and `BackTop` as a window-scroll threshold control with real visibility behavior, caller-owned accessible copy, cancellable smooth-scroll action, standard DOM/event/ref passthrough, same-source Showcase examples, and focused regressions.
- Other 6F2: hardened Core `Watermark` with caller-owned required content, XML-safe SVG text encoding, normalized tile/rotation/opacity inputs, and standard div DOM/ARIA/style/ref passthrough. Core no longer injects the Gouno brand into generic watermarks.
- Other 6F1: hardened Core `FloatButton` as a generic icon-only floating action with caller-owned icon/accessibility copy, real button-or-anchor semantics, standard DOM/event/ref passthrough, working ReactNode Tooltip rendering, and explicit disabled-link behavior. The BackTop-style default arrow and string-only pseudo-tooltip bridge are removed from the generic action contract.
- Feedback 6E4: hardened Core `Tour` as a controlled modal walkthrough with caller-owned navigation copy, a controlled/uncontrolled normalized step index, canonical Dialog focus containment/Escape close/focus return, and visible step titles as the dialog accessible name. The never-implemented `TourStep.target` hook and injected English `Product tour` / `Previous` / `Next` / `Finish` copy are removed; target highlighting/positioning and product onboarding orchestration remain outside Core.
- Feedback 6E3: hardened Core `NotificationProvider` as a finite-lived local notification queue. Provider-local monotonic IDs replace time/random keys, removal timers are tracked and cleared on unmount, and each notice owns one atomic `status` region instead of nesting under an additional outer `aria-live`. `NotificationNotice` is now an explicit public type; notice duration accepts finite positive milliseconds and otherwise falls back to 4500ms, removing the old `duration=0` uncloseable-persistence sentinel. Persistent notification centers, read state, manual close/update/destroy, and cross-root singleton behavior remain product-owned.
- Feedback 6E2: hardened Core `MessageProvider` as a local transient queue. Message IDs are now deterministic per Provider, removal timers are tracked and cleared on unmount, and each message owns its `status`/`alert` live-region semantics instead of stacking those roles under a second outer `aria-live`. The existing `open/info/success/warning/error` hook surface is retained, `duration` only controls automatic removal, and global singleton, manual key/update/destroy, Promise orchestration, and product notification-center behavior remain out of Core.
- Feedback 6E1: hardened Core `Popconfirm` around one local confirmation lifecycle. Confirmation and cancellation labels are now explicitly caller-owned with no injected English defaults; the trigger child is no longer cloned or overwritten, while the wrapper composes natural bubbling and lets child/root `preventDefault` veto opening. Async confirmation exposes `aria-busy`, locks cancellation/Escape while pending, closes on success, and preserves context after rejection. Standard span DOM/ref ownership is retained without adding controlled-open, permission, MFA, or product feedback orchestration.
- Data Entry 6D7: hardened Core `TreeSelect` around its actual native-select implementation. Hierarchical data is now readonly, `title` is explicitly string text instead of a ReactNode that could stringify to `[object Object]`, single/multiple values retain native selection semantics, placeholder copy is caller-owned, hierarchy indentation is non-verbal whitespace, and the component now forwards the real select ref with canonical size/status, disabled and standard DOM/form/ARIA ownership. Search, async tree loading, checkbox selection, popup-tree behavior and custom node rendering remain out of scope.
- Data Entry 6D6: hardened Core `Cascader` while preserving its native per-level select architecture. `value/defaultValue/onChange` now form one path-state contract, clearing a level truncates the path instead of storing an empty key, root naming is caller-owned through standard group ARIA, and each native select uses a language-neutral numeric level name. English `Please select` / `Select` / `Level N` defaults were removed; placeholder copy is caller-owned. The component now supports readonly option trees, canonical control sizing/status, disabled semantics, stable slots and a real root ref without adding search, async loading or custom-panel feature bags.
- Data Entry 6D5: hardened Core `Transfer` around one target-key state contract with stable item keys, caller-owned list/operation labels, disabled-item protection, preserved opposite-side selection, grouped list semantics, standard root DOM/ARIA/ref ownership and same-source Showcase coverage. The documented canonical path always provides `titles`/`operations`; pre-6D5 omitted labels remain a narrow compatibility bridge that injects no English list copy. Search, pagination, remote data and business collection rules remain product-owned.
- Data Entry 6D4: hardened Core `Mentions` while preserving native multiline textarea/textbox semantics. `value/defaultValue/onChange` now form one string-state contract; literal prefixes drive local option filtering; suggestions are associated through standard autocomplete/listbox ARIA and support ArrowUp/ArrowDown/Enter/Escape selection. The component forwards the real textarea ref and reuses canonical Textarea sizing, validation status, count and native form/ARIA behavior. Remote search, debounce, user-resource loading and rich-token orchestration remain caller-owned.
- Data Entry 6D3: hardened Core `InputOTP` around one digit-string value contract with caller-owned group naming, language-neutral numeric slot names, real root ref, canonical `small/middle/large` sizing, explicit `error/warning` status, digit sanitization, multi-digit paste distribution, automatic forward focus, empty-slot Backspace retreat and Arrow/Home/End positional navigation. Business verification, resend timers and completion policy remain product-owned.
- Data Entry 6D2: hardened Core `Slider` and `Rate` without expanding them into feature bags. Slider remains a thin native `input[type=range]` control and now exposes the real input ref, stable slot and governed focus treatment while preserving platform range/form/keyboard semantics. Rate now uses caller-owned standard ARIA on its `radiogroup`, language-neutral numeric radio names, real root ref, stable slots, click-to-clear behavior and one roving-focus Arrow/Home/End keyboard selection model.
- Data Entry 6D1: hardened Core `AutoComplete` around an accessible combobox/listbox contract with string shorthand or explicit `{ value, label, disabled }` options, caller-owned empty-state content, canonical `small/middle/large` sizing, explicit `error/warning` status, composed native input events, disabled-option keyboard skipping, real input ref and stable semantic slots. The existing `value/defaultValue/onChange` text state remains the single input value contract; `onSelect` reports confirmed suggestions without replacing `onChange`.
- Data Entry 6C2: hardened Core `DateRangePicker` as a two-native-input compound control. The root now owns only range composition/layout while `startInputProps` and `endInputProps` independently own each date input's native attributes, form identity, ARIA naming, constraints and optional ref; canonical `size/status`, root ref, stable slots and same-source Showcase/tests are included without changing the established controlled `start/end/onChange` state model.
- Data Entry 6C1: hardened Core `TimePicker` and `ColorPicker` while preserving native `input[type=time]` / `input[type=color]` semantics; both now share canonical `small/middle/large` control sizing, explicit `error/warning` status, standard DOM/ARIA extension, real input refs, stable `data-slot` anatomy, same-source Showcase examples and focused certification tests.
- Layout 6B2: hardened Core `Splitter` around canonical `Splitter.Panel` compound composition with multiple panels, controlled/uncontrolled size vectors, per-panel constraints, pointer/keyboard resizing, resize lifecycle and separator ARIA; the established two-panel `first/second/defaultSize/min/max/onResize(number)` path remains deprecated-compatible rather than removed.
- General/Layout 6B1: hardened Core `Avatar` and `Grid`; Avatar now follows canonical `small/middle/large | number` sizing while retaining deprecated `sm/default/lg` compatibility, exposes Group/Badge/Count compound anatomy, and Grid retains its simple helper while adding responsive 24-column `Row`/`Col`.
- General/Layout 6A: hardened Core `Icon`, `Kbd`, `Flex` and `Separator` with ref-safe native contracts, standard ARIA, mature layout/line capabilities, semantic slots, same-source Showcase examples and focused certification tests.
- Core reviewed-completion continues independently from runtime-family coverage; no established Core family is removed merely to raise completion percentages.

### Breaking

- `BackTop` now requires caller-owned `aria-label` and actually remains unrendered until `window.scrollY` reaches `visibilityHeight`; Core no longer injects the English `Back to top` label.
- `Watermark.content` is now required; Core no longer defaults generic watermarks to `Gouno`.
- `FloatButton` now requires `icon` and no longer injects a default `↑` glyph. Accessible names should be supplied with standard `aria-label` / `aria-labelledby`; `tooltip` renders visual Tooltip content and is not an implicit naming API.
- `TourStep.target` is removed because Core never implemented target positioning/highlighting. `Tour` now requires caller-owned `previousText`, `nextText`, and `finishText` instead of injecting English copy; the visible step title names the modal dialog.
- `Icon.label` is replaced by the standard `aria-label` / `aria-labelledby` accessible-name path.
- `TimePicker.size` and `ColorPicker.size` now mean canonical Gouno control size (`small | middle | large`) rather than the native numeric input `size` attribute; the native numeric attribute is not meaningful for these picker controls and is intentionally excluded from the public contract.
- `DateRangePicker` no longer copies one top-level set of input attributes to both date inputs or injects English `Start date` / `End date` accessible names. Per-input `id`, `name`, ARIA, constraints, events and refs belong under `startInputProps` / `endInputProps`; the root accepts normal div attributes. Existing `start`, `end` and `onChange` remain the range state contract.

### Deprecated

- `Splitter`'s legacy two-panel props (`first`, `second`, `defaultSize`, `min`, `max`, numeric `onResize`) remain supported as a compatibility bridge; new work should compose `Splitter.Panel` children.
- Avatar `size="sm" | "default" | "lg"` remains supported as a compatibility bridge for one release cycle; new code should use `small | middle | large`.
- Legacy lower-case aliases such as `tiny`, `mini` and `compact` remain compatibility-only around canonical small sizing; new code should use `small | middle | large`.
