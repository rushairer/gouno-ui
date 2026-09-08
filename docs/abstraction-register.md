# Abstraction Evidence Register

Status: living decision log for product-driven Gouno UI evolution.

This register records why abstractions were accepted, rejected, deferred or changed. It is evidence, not a second API specification. Read `docs/product-driven-development.md` for admission, `docs/architecture.md` for ownership, and `docs/api-specification.md` for public API rules.

## Baseline decisions

### PD-001 — Product-driven evolution
- **Status:** accepted
- **Owner:** repository process
- **Decision:** real product semantics/interactions create design-system demand; catalog completeness and legacy file boundaries do not.

### PD-002 — Single implementation line, multi-product validation
- **Status:** accepted
- **Owner:** repository process
- **Decision:** migrate Gosso Admin one real page at a time. Use Blog Admin and relevant Blog pages as mandatory prior-art/validation corpora before admitting shared abstractions.

### PD-003 — Core maturity posture
- **Status:** accepted
- **Owner:** Core governance
- **Decision:** Core breadth is sufficient for product pressure-testing, but individual APIs remain open to evidence-driven correction. Do not add Core components merely for library parity.

### PD-004 — Initial product-structure baseline
- **Status:** accepted
- **Owner:** Gouno
- **Decision:** the validation phase started with `AppShell`, `PageContainer`, `NavigationGroup`, `navigationItemClass` as the minimum pre-admitted structure.

### PD-005 — Legacy is evidence, never precedent
- **Status:** accepted
- **Owner:** Pattern/Gouno governance
- **Decision:** pre-validation Pattern/Gouno implementations are quarantined under `src/legacy`, not compiled/published/shown/imported. Re-admission requires current product evidence and a clean implementation.

## Migration evidence

### PD-006 — Gosso Admin Overview stays Core-first
- **Status:** accepted
- **Owner:** Product-local
- **Evidence:** Gosso Admin `/`, administrator and regular-user paths.
- **Decision:** the page is expressible with Core plus local composition. Three QuickCard data instances on one page do not justify a public component.
- **API impact:** none.

### PD-007 — Canonical/Legacy separation and neutral shell naming
- **Status:** accepted
- **Owner:** repository process / Gouno
- **Evidence:** first real product migration exposed confusion between historical exports and admitted APIs.
- **Decision:** quarantine unverified Pattern/Gouno APIs; clear simulated product pages; rename `AdminShell → AppShell` and `AdminPage → PageContainer` because the responsibilities are not admin-specific.
- **API impact:** canonical shell/container names changed; Legacy has no public path.

### PD-008 — Account Settings stays Core-first across five workflows
- **Status:** accepted
- **Owner:** Product-local
- **Evidence:** Gosso Admin `/account-settings/:tab`: Profile, Password, MFA, Passkeys, Sessions.
- **Cross-product/Legacy review:** historical Panel/DefinitionList/Feedback/ListStack/AsyncState/DataTable/StatusBadge/Toast/confirm helpers reviewed.
- **Decision:** Core `Card`, `Tabs`, form controls, `Modal`, `QRCode`, `Empty`, `Table` and local composition are sufficient. Sessions does not prove DataTable. Confirmation remains local.
- **API impact:** none.

### PD-009 — Showcase is supporting evidence, not a demand source
- **Status:** accepted
- **Owner:** repository process
- **Evidence:** Showcase `CodeBlock`, API tables, demo framing, viewport simulation and canonical shell usage.
- **Decision:** Showcase should dogfood admitted APIs but tooling-only repetition cannot create a public abstraction. Evidence strength: cross-product real pages > repeated same-product real pages > Showcase/tests/tooling.
- **API impact:** none. Showcase `CodeBlock` remains private.
- **Follow-up:** when Blog article rendering independently needs read-only highlighted/copyable code, compare it with Showcase `CodeBlock`; if semantics match and admission passes, create canonical Core `CodeBlock` and migrate Showcase to it.

### PD-010 — Tabs uses Ant-style high-level semantics with Radix composition
- **Status:** accepted
- **Owner:** Core
- **Evidence:** Account Settings and System Management are independent route-backed tab families; previous public state names leaked Radix-style primitives.
- **Reference review:** mature Ant Design high-level API plus Radix/shadcn accessibility/composition.
- **Decision:** canonical high-level API is `activeKey`, `defaultActiveKey`, `items[].key`, `onChange`, plus `type`, `size`, `tabPosition`, `centered`, `tabBarExtraContent`. Default visual style is clean line/ink-bar; `card` is explicit. Radix remains the behavior/a11y basis.
- **API impact:** temporary pre-reset `value/defaultValue/items[].value` compatibility is accepted only during migration and is not canonical documentation; remove before the next stable package release.

### PD-011 — PageHeader is re-admitted as Gouno product-family structure
- **Status:** accepted
- **Owner:** Gouno
- **Evidence:** Gosso Admin System Management Clients/Users/Audit/Site/System sections all require a page title + description + page-level actions; Blog Admin Posts and Users independently use the same page-level semantic contract.
- **Cross-product/Legacy review:** Blog Admin `Posts.tsx` and `Users.tsx`; Legacy `gouno/page.tsx` historical PageHeader.
- **Reasoning:** this is repeated product-family page presentation policy, not merely duplicated markup. It is smaller and more stable than the historical page utility bundle. `PageHeader` owns only title, optional description and one canonical `actions` slot.
- **API impact:** add `PageHeader`/`PageHeaderProps` to `@gouno/ui/gouno`. Do **not** restore historical `action`/`actions` synonyms, `ActionGroup`, `FilterBar`, `TableContainer` or other page helpers.
- **Follow-up:** Blog Admin migration must challenge the title/description/actions contract before any further PageHeader capability is added.

### PD-012 — System Management triggers DataTable review but not re-admission
- **Status:** accepted / defer extraction
- **Owner:** Product-local with Pattern candidate under review
- **Evidence:** Gosso Admin `/system-management/:tab` Clients, Users and Audit all use tabular resource management; Users/Audit add pagination/filtering. Blog Admin Posts and Users independently show table/list, filtering, selection, responsive and action needs.
- **Cross-product/Legacy review:** Gosso Clients/Users/Audit, Blog Admin Posts/Users, Legacy `patterns/data-table.tsx`.
- **Reasoning:** there is now enough evidence to review a shared resource-table interaction, but not enough semantic convergence to freeze one API. Legacy DataTable is a broad feature bag combining loading/error/empty, columns, selection, sorting, filtering, pagination, expansion, toolbar and batch actions. Re-admitting it now would force unrelated product requirements into one contract.
- **API impact:** none. Pattern layer remains empty. System Management uses Core `Table`/`Pagination` plus product-local filters/actions/state.
- **Follow-up:** later Gosso and Blog Admin list pages should reveal the smallest stable interaction contract. Only then design a new Pattern from evidence rather than moving Legacy back.

### PD-013 — Gosso authentication surfaces remain product-local and standalone
- **Status:** accepted / reject public extraction
- **Owner:** Product-local / Showcase tooling
- **Evidence:** Gosso Admin `/login`, `/forgot-password`, `/reset-password`, `/callback` share a centered identity surface but are intentionally outside the real application's `AdminLayout`; Login itself contains password, MFA, passkey and Sudo/step-up states.
- **Cross-product review:** Blog and Blog Admin consume GOSSO identity rather than owning an equivalent local authentication surface. Repetition therefore exists inside one identity product, not across product-family presentation policy.
- **Reasoning:** four same-product occurrences are sufficient to trigger the Rule-of-Three review, but they prove only a Gosso-local identity surface. A product-local `AuthSurface` helper is appropriate for the Showcase fixture; creating public `AuthShell`, `LoginCard` or an authentication Pattern would leak one product's identity policy into the shared design system. Showcase must also preserve the real route distinction: these pages render standalone instead of being artificially wrapped in `AppShell`.
- **API impact:** none. Add only Showcase-local `presentation="standalone"` catalog metadata; it is documentation tooling, not Gouno UI public API.
- **Follow-up:** reconsider only if another independently owned real product surface proves the same authentication shell semantics. GOSSO-specific authentication state and security policy should otherwise remain in Gosso.

### PD-014 — Gosso Admin reaches route-level Showcase coverage
- **Status:** accepted milestone
- **Owner:** repository process
- **Evidence:** migrated route families now cover Overview, Account Settings, System Management, Login, Forgot Password, Reset Password, OAuth callback and Not Found, including nested Account/System tab states as static fixtures.
- **Reasoning:** Showcase now represents every user-facing Gosso Admin route family without copying API/auth/session implementation. This is a migration milestone, not proof that every local block deserves a design-system abstraction.
- **API impact:** none beyond separately admitted decisions PD-010/PD-011.
- **Follow-up:** use the completed Gosso Admin corpus as primary evidence while moving to Blog Admin. Blog Admin should challenge PageHeader, DataTable-related candidates and other assumptions instead of mechanically copying Gosso structure.

### PD-015 — Alert replaces primitive leakage with a canonical feedback contract
- **Status:** accepted
- **Owner:** Core
- **Evidence:** Gosso Login, Callback, password reset, account settings and system management all use persistent in-flow feedback. The shadcn primitive grid assumed dedicated child slots, while product pages commonly supplied direct text, producing a zero-width text column and visibly broken vertical wrapping in standalone pages.
- **Reference review:** HTML/ARIA alert semantics, current Ant Design Alert high-level API and semantic DOM customization; deprecated Ant aliases were explicitly excluded under NAME-01/COMP-02.
- **Reasoning:** the defect is not a product styling problem; Core exposed an implementation primitive instead of a stable design-system contract. Semantic severity must be `type`, while `variant` remains a pure visual dimension. Close lifecycle belongs under one `closable` configuration surface. `children` remains standard React composition for additional custom body content and is not treated as a title alias.
- **API impact:** canonical Alert adds `title`, `description`, `type`, `showIcon`, `icon`, `action`, `closable`, `banner`, `variant=outlined|filled`, semantic `classNames/styles`, and `Alert.ErrorBoundary`. Remove public `variant=default|destructive` semantics and do not introduce deprecated `message/onClose/afterClose/closeIcon/closeText` aliases.
- **Follow-up:** Blog Admin should validate real notification/error density and whether the chosen outlined/filled visual treatment remains appropriate across products without expanding semantic type names.

### PD-016 — Account Settings adopts the shared PageHeader page grammar
- **Status:** accepted
- **Owner:** Gouno validation / Product-local
- **Evidence:** Account Settings originally put each tab title/description inside its only large Card, while System Management used the re-admitted `PageHeader` outside content surfaces. Both are route-backed Gosso Admin settings/management pages under the same `AppShell` content track.
- **Reasoning:** this was visual drift created by migration order, not two intentionally different product concepts. The stable page grammar is `fixture context → route Tabs → PageHeader → content surfaces`. Cards group content; they do not own the route-level page title. This also revalidates PD-011 on a second major Gosso page family.
- **API impact:** none beyond existing `PageHeader`; Account Settings switches its Tabs call site to canonical `activeKey/items[].key` while touched.
- **Follow-up:** Blog Admin migration should challenge the same grammar. If a real page intentionally needs a contained card title, keep that as card-local content rather than extending PageHeader.

### PD-017 — Product migration uses a stop-the-line validation loop
- **Status:** accepted
- **Owner:** repository process / component governance
- **Evidence:** Gosso migration repeatedly exposed issues that component-only review had not surfaced: Tabs visual/API drift, Alert primitive leakage, Account/System page-grammar divergence and mistaken Input affix naming. Resolving these immediately produced a cleaner canonical API than either “finish every page first” or “design the full library first”.
- **Decision:** product migration and component hardening form one Product Validation Loop. Continue page migration until a real page exposes a canonical defect, accessibility issue, material product-agnostic API gap, duplicate semantic write path or Showcase/canonical mismatch; then stop the line, harden the component using standards + mature-library benchmarks + Gouno API rules + real product evidence, synchronize Showcase/examples/tests, validate back on the triggering page, and resume migration.
- **Benchmark rule:** Ant Design is an important high-level API/demo benchmark, not the authority. Do not copy deprecated aliases, compatibility baggage or APIs that conflict with Gouno naming/state/composition rules.
- **Completion rule:** “100%” means coherent completion for the proven Gouno scope across runtime, public types, demos, example code, accessibility, focused tests and real product validation—not 100% parity with another library.
- **Cadence:** after a significant page family or roughly 2–4 representative pages, run a short retrospective for Core defects, spreading local workarounds, abstraction candidates, challenged Gouno/Pattern assumptions, Showcase drift and API-governance gaps.
- **Delivery:** a pushed commit is not a completed phase. Latest `main` CI must be `completed/success`; when Showcase output changes, the publish step and `gh-pages` deploy for the expected main SHA must also be confirmed before reporting completion.

### PD-018 — Gosso Admin converges product language before cross-product validation
- **Status:** accepted milestone
- **Owner:** Product-local / repository validation
- **Evidence:** full Gosso Admin route corpus after PD-014, including Overview, Account Settings, System Management, standalone authentication routes and Not Found.
- **Decision:** perform a product-level convergence pass before using Gosso as a comparison baseline for Blog Admin. Gosso intentionally keeps two surface families rather than one universal template: application-shell pages and standalone identity pages. Within each family, align heading hierarchy, route/fixture controls, content-surface ownership, feedback semantics, status terminology, action prominence and responsive behavior. Overview remains a deliberate landing-page exception; Not Found uses card-local heading semantics rather than nesting `PageHeader` inside a result Card.
- **Implementation evidence:** standalone fixture controls are anchored through product-local `AuthSurface.fixtureControl`; authentication titles are real H1 headings; Overview restricted-access notice uses canonical Alert; audit empty results use Core Empty; user/system statuses use the product locale; protocol vocabulary remains exact where technically useful; redundant Table overflow framing is removed where Core already owns it.
- **API impact:** none. No Pattern/Gouno abstraction is created from this convergence pass. `AuthSurface` and fixture chrome remain Showcase/product-local.
- **Follow-up:** Blog Admin should compare against the now internally coherent Gosso corpus, but must challenge rather than copy its product-local surface grammar.

### PD-019 — Segmented uses native radio semantics and canonical Gouno naming
- **Status:** accepted
- **Owner:** Core
- **Evidence:** Gosso Overview role preview, Login and Callback fixture controls, Account Settings MFA state preview, and Theme mode switching all independently use a compact mutually exclusive selector. The previous Core implementation simulated radio semantics with buttons and exposed non-standard `ariaLabel`, which failed the Product Validation Loop accessibility/API review.
- **Reference review:** native HTML radio-group behavior and current Ant Design Segmented high-level API. Mature capabilities used as evidence include controlled/uncontrolled values, string/number options, `block`, orientation, size, shape, option icons/disabled state and a shared radio `name`.
- **Decision:** canonical Segmented uses real `input[type=radio]` controls sharing one generated or explicit `name`, preserving browser radio semantics and keyboard behavior. Public naming follows standard React/HTML ARIA props (`aria-label`) rather than `ariaLabel`. `orientation` is the sole direction write path; no deprecated `vertical` synonym is admitted. Size reuses Gouno `ControlSize` (`small | middle | large`) rather than importing Ant Design v6's `medium` spelling.
- **API impact:** Segmented accepts `string | number` values/options; option objects may provide `value`, `label`, `icon`, `disabled`, `className`; root API adds `block`, `orientation`, `size`, `shape`, `name`, standard HTML/ARIA props and forwarded root ref. Existing `value/defaultValue/onChange` semantics remain canonical. No compatibility alias is added for `ariaLabel`.
- **Completion:** runtime, public Props extraction, Showcase demos/example code/API table, native-radio accessibility behavior, focused tests and the triggering Gosso/Theme call sites are synchronized; this is 100% for the proven Gouno scope, not parity with every Ant Design extension such as tooltip or semantic classNames/styles.
- **Follow-up:** Blog Admin may challenge density or feature needs, but new Segmented capabilities require independent product evidence rather than catalog parity.

### PD-020 — Compound components separate structural spacing from content spacing
- **Status:** accepted
- **Owner:** Core design-language governance
- **Evidence:** Tabs line/card and top/left/right/bottom layouts exposed two defects at once: the primitive active indicator was painted outside the TabList scroll boundary, while `TabPanel` hard-coded top padding, so top Tabs had a gap and side Tabs did not. Product pages then risked compensating with local margins.
- **Decision:** a compound parent owns spacing between its semantic regions; content inside a region owns its own padding/rhythm. For Tabs, the root owns one direction-aware TabBar↔Panel structural gap, `TabPanel` injects no business-content padding, and all placements preserve the same spacing responsibility. Active indicators/borders/focus decoration stay inside the component scroll/visual boundary unless overflow is an explicit public behavior.
- **API impact:** no new Tabs prop. This is a layout-contract correction: remove `TabPanel`'s top-only padding, use root structural gap for every position, keep line/card edge treatment orientation-aware, and keep the active indicator inside TabList so scrollbars represent real tab overflow only.
- **Documentation impact:** the general rule is binding in `docs/product-driven-development.md`; Tabs Showcase demonstrates content-owned Card padding rather than implying that Tabs pads arbitrary panel content.
- **Follow-up:** apply the same ownership test when Card, Modal, Drawer, Collapse or future compound components expose slot-spacing inconsistencies. Do not add page-local margins to hide a canonical structural-spacing defect.

### PD-021 — Showcase fixture metadata stays outside product layout
- **Status:** accepted
- **Owner:** Showcase tooling
- **Evidence:** Gosso Overview scenario strip, Account/System route banners, MFA preview switcher and authentication route footer were useful while migrating, but they occupied normal product layout space and made the Showcase preview look like the real product owned those surfaces.
- **Decision:** route labels, static-fixture markers and scenario-only controls belong to a compact Showcase-private `FixtureDock` outside normal document flow. The dock may expose a popover for route, notes and scenario controls, but real product page hierarchy must remain visually untouched when the tooling is closed.
- **Abstraction impact:** none. `FixtureDock` is documentation/development tooling under PD-009, not Core, Pattern or Gouno; its reuse cannot count toward public Rule-of-Three evidence.
- **Product impact:** Gosso Overview, Account Settings, System Management and standalone identity pages remove in-flow fixture banners/footers. Real product feedback remains in-flow and continues to use canonical components such as Alert.
- **Follow-up:** Blog Admin fixtures should use the same Showcase-private dock instead of inventing product-local route banners, while still treating the dock as zero public-abstraction evidence.

### PD-022 — Blog Admin Posts starts second-product validation without restoring collection Patterns
- **Status:** accepted / defer extraction
- **Owner:** Product-local + Gouno validation
- **Evidence:** real Blog Admin `/admin/posts`, compared with Gosso System Management Clients/Users/Audit and Legacy DataTable/FilterBar/BulkActionBar/ResponsiveList-related prior art.
- **Decision:** Blog Admin becomes the active migration line and Gosso Admin becomes the completed first-product comparison corpus. Posts independently revalidates `PageHeader(title, description, actions)` without expanding its API. Search/status/category/tag filtering, desktop Table/mobile list presentation, selection/batch actions, loading/error/empty orchestration, pagination and destructive confirmation remain product-local.
- **Reasoning:** cross-product evidence now clearly proves that resource-management pages repeat across products, but it still does not prove that one public DataTable feature bag is the correct boundary. Gosso management tables and Blog Posts share some mechanics while Blog Posts also requires content metadata, responsive alternate presentation and different batch workflows. Restoring Legacy DataTable/BulkActionBar/FilterBar/ResponsiveList now would freeze accidental coupling rather than a stable semantic contract.
- **API impact:** none. Pattern remains intentionally empty. `PageHeader` evidence is strengthened; DataTable/filter/bulk/responsive-list candidates remain deferred.
- **Follow-up:** migrate the next representative Blog Admin list pages (for example Users, Categories or Comments) one at a time. If a smaller interaction contract repeats or a canonical component defect becomes clear, stop the line immediately and review it rather than waiting for full Blog Admin migration.
