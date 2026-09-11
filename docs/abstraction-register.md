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
- **API impact:** none. Pattern layer remains empty at this decision point. System Management uses Core `Table`/`Pagination` plus product-local filters/actions/state.
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
- **API impact:** none at this decision point. `PageHeader` evidence is strengthened; DataTable/filter/bulk/responsive-list candidates remain deferred.
- **Follow-up:** migrate representative Blog Admin collection pages one at a time. If a smaller interaction contract repeats, review that contract independently from the surrounding collection feature bag.

### PD-023 — Single Surface + Shared Edge Inset
- **Status:** accepted
- **Owner:** design-language governance
- **Evidence:** Gosso Account Settings Passkeys/Sessions and System Management tables exposed double-surface framing and inconsistent first/last content axes across Card, Table and List surfaces.
- **Decision:** one semantic region should normally expose one dominant surface boundary. Normal application Card/List/bordered Table surfaces align their first/last primary content to the shared 24px edge axis while preserving denser internal Table columns. Card is not a generic padding shim around an already complete surface.
- **Implementation impact:** remove redundant outer Cards around self-surfaced Passkey/Sessions collections; align bordered Table first/last edges to the normal 24px axis; migrate completed Gosso application surfaces away from accidental 20px/32px horizontal insets.
- **API impact:** no new Pattern/Gouno abstraction. This is a binding composition rule in `docs/design-language.md`.

### PD-024 — Surface Edge Ownership + Full-Bleed Anatomy
- **Status:** accepted
- **Owner:** design-language governance / Product-local validation
- **Evidence:** Gosso System Management Site Settings used a sticky save region with `-mx-6 -mb-6` to escape a padded Card. While sticky, the region looked acceptable; at its natural resting position its square child background competed with the parent's rounded bottom corners and coupled the implementation to one padding value.
- **Decision:** the outer surface owner owns its outer border, radius and clipping. Internal full-bleed regions use explicit anatomy (`Card padding="none"` + independently padded `CardContent`/`CardFooter`) rather than negative-margin escape hacks. Sticky changes scroll behavior only; it does not create a second surface or take ownership of the parent's outer corners.
- **Implementation impact:** Site Settings uses a clipped outer Card, 24px `CardContent`, and a full-bleed sticky `CardFooter`; `overflow: clip` is preferred here because clipping is needed without creating a new scroll container.
- **API impact:** none. Existing Core `CardContent`/`CardFooter` are sufficient; do not introduce `StickyFormFooter`, `SaveBar` or a Pattern from this single product case.
- **Follow-up:** if Blog Admin editor/settings pages independently prove the same sticky-save lifecycle and interaction semantics, review a shared Pattern then. Until then, keep the composition product-local and reuse only the design-language rule.

### PD-025 — Dense Table row actions preserve row geometry
- **Status:** accepted
- **Owner:** design-language governance
- **Evidence:** Blog Admin Posts/Members and Gosso Admin Users/OAuth Clients independently exposed the same failure mode: mixed outline/ghost/filled row-action controls plus wrapping action clusters created visual inconsistency and width-dependent row heights.
- **Decision:** repeated desktop Table row actions use one compact structural control family, remain single-line and let Core Table horizontal overflow own width pressure. The current row-action family is `IconButton variant="ghost"`; semantic danger may change `color` but not the control structure. If a real action set becomes too wide, lower-frequency actions move behind an overflow/dropdown interaction rather than wrapping.
- **Implementation impact:** migrate the governed Blog/Gosso action clusters to `min-w-max flex-nowrap`, normalize sibling controls to ghost IconButtons, and protect the corpus through `tests/design-language-conformance.test.ts`.
- **API impact:** none. This is DL-09, not evidence for public `RowActions`, `ActionGroup` or DataTable APIs.

### PD-026 — Cross-product sticky settings surfaces still do not justify a SaveBar Pattern
- **Status:** accepted / defer extraction
- **Owner:** Core composition / Product-local validation
- **Evidence:** Gosso System Management Site Settings and Blog Admin Site Settings independently require a padded settings body plus a full-bleed sticky save region inside one rounded surface.
- **Decision:** the repeated stable contract is the Card anatomy and edge-ownership rule already captured by PD-024, not a new interaction component. `Card padding="none"` + `CardContent` + `CardFooter` expresses the invariant without hiding product-specific dirty state, validation, save lifecycle, secondary actions or authorization policy.
- **Reasoning:** a `StickyFormFooter` or `SaveBar` would currently mostly wrap class names while forcing different product save semantics behind one API. Cross-product repetition therefore strengthens the design-language rule but does not automatically promote the composition to Pattern.
- **API impact:** none. Existing Core Card anatomy is sufficient.
- **Follow-up:** reconsider only when another real workflow proves additional stable behavior beyond surface anatomy, such as shared unsaved-change orchestration, submit ownership or navigation blocking.

### PD-027 — Blog privileged-edit gate passes Rule-of-Three review but remains product-local
- **Status:** reviewed / defer extraction
- **Owner:** Product-local security interaction
- **Evidence:** real Blog Members, Site Settings and advanced/AI administration all protect high-privilege operations with recent MFA/Sudo policy; Members and Site Settings now exercise distinct migrated Showcase workflows.
- **Decision:** do not admit `SudoGate` as a public Pattern yet. All current evidence belongs to one Blog product family and is coupled to GOSSO step-up/MFA semantics, a roughly 10-minute elevated window and Blog-specific authorization boundaries.
- **Reasoning:** Rule of Three triggers mandatory abstraction review, not automatic promotion. A generic visual lock overlay would discard the security semantics that make this interaction meaningful, while a GOSSO-aware public Pattern would leak one product integration policy into the shared UI layer.
- **API impact:** none. Keep the gate product-local and compose it from Core surfaces/actions.
- **Follow-up:** revisit if an independently owned product proves the same privileged-action lifecycle with a product-agnostic contract.

### PD-028 — BulkActionBar becomes the first admitted Pattern
- **Status:** accepted
- **Owner:** Patterns
- **Evidence:** three independently rebuilt Blog Admin workflows now converge on the same interaction despite different collection presentations: Posts uses responsive Table/mobile cards, Comments uses a moderation Card/List queue, and Categories uses a taxonomy Table plus create/edit Drawer. Each requires a visible selected-context label, an accessible bulk-action toolbar, arbitrary batch actions, a canonical cancel-selection affordance and sticky bottom visibility. Real Blog prior art additionally shows the same concept in Tags, Pages, Notifications, Media Library and Operations Workspace.
- **Legacy review:** `src/legacy/patterns/bulk-action-bar.tsx` and the Blog package implementation were reviewed only as prior art. Their existence did not decide admission.
- **Decision:** admit a new canonical `BulkActionBar` Pattern because the stable contract is now an interaction, not merely repeated styling. The Pattern owns `role="toolbar"`, the default accessible name, sticky surface presentation, selected-context presentation and cancel affordance. The product continues to own selection state and every domain action.
- **API impact:** add `BulkActionBar`/`BulkActionBarProps` to `@gouno/ui/patterns` with the minimal API `selectionLabel`, `onCancel`, optional `cancelLabel`, arbitrary `children`, standard `aria-label` and normal HTML/className extension. Do not restore product-specific convenience props such as `onAIAssist`, and do not add a non-standard `ariaLabel` alias.
- **Migration impact:** Posts, Comments and Categories adopt the canonical Pattern. This does not re-admit `DataTable`, `FilterBar`, `AsyncState` or a collection feature bag; it demonstrates the intended strategy of extracting a smaller stable interaction from heterogeneous pages.
- **Validation:** the Gouno UI Patterns workspace gains a dedicated Showcase page with live demo, example code and API table; focused tests cover toolbar semantics, custom accessible naming, cancel behavior and product-owned actions.
- **Follow-up:** migrate another real Blog Admin page such as Tags and use it to challenge the Pattern without expanding its API by default. If a later workflow cannot fit this contract cleanly, revise or shrink the Pattern rather than creating aliases.

### PD-029 — Tags validates BulkActionBar across a Card Grid without API expansion
- **Status:** accepted validation
- **Owner:** Patterns / Product-local
- **Evidence:** real Blog Admin `/admin/tags` uses a responsive Card Grid rather than a Table or moderation queue, while preserving selection, batch deletion and AI workflow entry. It additionally requires product-local rename/merge semantics and partial batch failure where unsuccessful resources remain selected for retry.
- **Decision:** canonical `BulkActionBar` fits this fourth independent workflow unchanged. The Pattern continues to own toolbar semantics, selected-context presentation, sticky visibility and cancel-selection; Tags owns rename/merge, batch result handling, retained failed selections and WorkflowLauncher resource semantics.
- **API impact:** none. Do not add `onAIAssist`, resource-type, partial-failure, retry or collection-presentation props to `BulkActionBar`.
- **Architectural impact:** Card Grid validation further demonstrates that the stable shared interaction is smaller than the surrounding collection presentation and continues to reject restoration of broad Legacy `DataTable`, `ResponsiveList` or `AsyncState` feature bags.
- **Validation:** the migrated Tags fixture covers Card Grid presentation, rename/merge, canonical BulkActionBar, single/batch delete, partial-failure retention and loading/error/empty states; the complete main gate and Showcase publish pass.
- **Follow-up:** migrate Pages `/admin/pages`; use its responsive Table/mobile list, filters and pagination to challenge the Pattern again without expanding its API by default.

### PD-030 — Pages revalidates responsive collection grammar without DataTable extraction
- **Status:** accepted validation
- **Owner:** Patterns / Product-local
- **Evidence:** real Blog Admin `/admin/pages` combines search/status filtering, desktop Table, mobile list presentation, path/template/navigation metadata, selection/batch deletion, pagination, destructive confirmation and AI Workflow resource keys.
- **Decision:** Pages reuses canonical `BulkActionBar` unchanged while keeping filter state, pagination, responsive presentation and page-domain actions product-local. Its similarity to Posts is useful composition evidence but still does not justify a broad `DataTable`, `ResponsiveList` or `FilterBar` Pattern because the stable shared interaction remains smaller than the collection feature set.
- **API impact:** none. `BulkActionBar` receives no domain props; no collection Pattern is admitted.
- **Design-language impact:** Pages joins the DL-07 application-surface corpus and DL-09 dense Table row-action corpus; desktop actions remain one-line ghost `IconButton`s while Core Table owns horizontal width pressure.
- **Validation:** the migrated Pages fixture covers search/status filters, filtered/unfiltered empty states, desktop/mobile presentation, metadata/actions, canonical BulkActionBar, pagination, single/batch deletion, AI workflow entry and loading/error states; main CI and Showcase publish pass.
- **Follow-up:** migrate Notifications `/admin/notifications` and challenge the Pattern with a non-CRUD state-machine action set.

### PD-031 — Notifications validates product-owned action semantics inside the same Pattern
- **Status:** accepted validation
- **Owner:** Patterns / Product-local
- **Evidence:** real Blog Admin `/admin/notifications` is a Card-based notification queue with status/type filtering, unread/read state transitions, per-item destinations, selected-item mark-read, batch deletion, global mark-all-read and clear-read/clear-all operations. Its selected actions are materially different from Posts, Tags and Pages.
- **Decision:** canonical `BulkActionBar` remains unchanged and intentionally ignorant of notification semantics. Notifications supplies `标为已读` and `批量删除` as arbitrary child actions while retaining read-state transitions, destinations, filter counts and global cleanup behavior in product code.
- **API impact:** none. Do not add action-type, read-state, resource-type or workflow-specific props to `BulkActionBar`.
- **Architectural impact:** the notification Card queue further rejects a broad collection/`AsyncState` feature bag: shared state orchestration is not stable enough to own publicly, while the already-admitted selection toolbar remains stable across heterogeneous product surfaces.
- **Validation:** the migrated Notifications fixture covers notification presentation types, status/type filters, read transitions, canonical BulkActionBar, single/batch delete, clear-read/clear-all confirmation and loading/error/empty states; main CI and Showcase publish pass.
- **Follow-up:** migrate Media Library `/admin/media`; use upload/AI/edit Drawers, reference-aware deletion and partial batch failure as the next stronger Core/Pattern pressure test.

### PD-032 — Media Library validates Core overlays and BulkActionBar without API expansion
- **Status:** accepted validation
- **Owner:** Core / Patterns / Product-local
- **Evidence:** real Blog Admin `/admin/media` combines a responsive media Card Grid, search/type filtering, canonical upload supporting `image/*,.svg,.ico`, upload Drawer, AI text-to-image Drawer, Alt Text editing Drawer, reference-aware destructive deletion, partial batch failure with failed assets retained selected, and AI Workflow resource semantics.
- **Decision:** existing Core `Upload`, `Drawer`, `Modal`, `Alert`, form controls and canonical `BulkActionBar` express the stable UI contracts without new public APIs. Media-reference lookup, generated-asset insertion, upload/AI lifecycle state, partial-failure accounting and retained failed selections remain product-owned.
- **API impact:** none. Do not add `onAIAssist`, media resource props, reference-awareness, upload lifecycle or partial-failure semantics to `BulkActionBar`; do not add media-domain convenience props to Core Upload/Drawer.
- **Architectural impact:** Media is a stronger counterexample to feature-bag extraction: substantial workflow complexity can be composed from mature Core surfaces plus one small admitted selection Pattern while domain orchestration remains local.
- **Validation:** the migrated Media Library fixture covers metadata/search/type filters, canonical BulkActionBar, reference-blocked deletion, Promise.allSettled-style partial batch deletion, SVG/ICO-compatible Upload, Alt Text editing, AI generation/insertion and loading/error/empty states. `main@b44d2e9` passed the full gate; the FixtureDock route was then corrected to the real `/admin/media` route and `main@0e2beb8` repassed Verify and `gh-pages`.
- **Follow-up:** migrate Dashboard `/admin/dashboard`; use metric cards, traffic trend, content-health summaries, top-post data and AI failure alerts to validate read-dominant dashboard composition before considering any dashboard-specific Pattern.

### PD-033 — Dashboard stays Core-first without dashboard-specific Pattern extraction
- **Status:** accepted validation
- **Owner:** Core / Product-local
- **Evidence:** real Blog Admin `/admin/dashboard` is a read-dominant operational overview with permission-aware primary actions, four KPI cards, a 30-day traffic trend, content-governance health metrics, AI failure alerts and a Top Posts table with product destinations.
- **Decision:** existing Core `Statistic`, `Card`, `Tag`, `Alert`, `Table` and `IconButton` plus product-local metric/trend composition are sufficient. Repetition among four cards on one page is local presentation reuse, not evidence for a public dashboard abstraction.
- **API impact:** none. Do not add `MetricCard`, `ChartCard`, `DashboardGrid` or a dashboard-specific Pattern from this page.
- **Design-language impact:** Dashboard joins the DL-07 normal application-surface corpus and its Top Posts table joins DL-09; the real product's older 20px (`p-5`) metric surfaces are intentionally normalized to the current 24px surface axis instead of being copied as precedent.
- **Validation:** the migrated Dashboard fixture covers metric values/destinations, permission-dependent header actions, traffic trend, governance health, AI failure destinations and mark-all-read, Top Posts actions, plus isolated loading/empty/error states. `main@46b1986` passed Verify, the full test/build gate and `gh-pages` publication.
- **Follow-up:** migrate AI Operations `/admin/ai-ops` as a route family. Preserve `tab`, `record`, `run` and `workflow` URL semantics, and split the large workspace into coherent sub-stages rather than hiding its heterogeneous behavior behind one new public feature-bag Pattern.

### PD-034 — AI Operations validates complex route-family composition without a feature-bag Pattern
- **Status:** accepted validation
- **Owner:** Core / Product-local / repository validation
- **Evidence:** real Blog Admin `/admin/ai-ops` spans five top-level surfaces—Overview, Inbox, Automation, Records and Advanced—while preserving URL-backed `tab`, `record`, `workflow` and `run` state. The route family additionally contains governed proposal review, failed-approval retry, human workflow interactions, preflight/dry-run/input/version rollback, workflow/agent execution evidence, and six Advanced governance domains: Agents, Skills, Tools, knowledge, providers and sandbox connectors.
- **Decision:** existing Core `Tabs`, `Card`, `Alert`, `Button`, `Select`, `Input`, `Tag`, `Skeleton` plus Gouno `PageHeader` are sufficient. Route state, agent/workflow governance, execution evidence, approval semantics and Advanced configuration remain product-local. Do not admit `AIOpsWorkspace`, `WorkflowWorkspace`, `RunRecords`, `AdvancedWorkspace`, a generic approval inbox or any AI feature-bag Pattern from this single heterogeneous route family.
- **API impact:** none. AI Operations did not require a new Core, Pattern or Gouno public surface.
- **Tabs/layout impact:** both top-level and Advanced navigation reuse canonical controlled-key Tabs. Tabs owns navigation and the structural TabBar↔content gap; product content owns its own padding/rhythm. The migration also revalidated the existing Radix-backed activation path used by `core-tabs.test.tsx`; the product shell required no Core API change.
- **Validation:** Overview/Inbox passed the full gate at `main@ee5a564`; Automation/Records passed at `main@d1d247c`; the complete Advanced/route-shell/catalog/conformance integration passed Verify and `gh-pages` on `main@909b4ce`.
- **Corpus impact:** every top-level Blog Admin route family is now represented in Showcase. The remaining Admin routes are the editor families `/admin/posts/new|:id/edit` and `/admin/pages/new|:id/edit`.
- **Follow-up:** migrate PostEditor first as the editor pressure sample while keeping editor composition product-local. Then migrate PageEditor as an independent second sample before considering any shared Editor Pattern.

### PD-035 — PostEditor validates editor-workspace grammar and hardens description-only Modal
- **Status:** accepted validation / Core correction
- **Owner:** Core / Product-local / repository validation
- **Evidence:** real Blog Admin `/admin/posts/new` and `/admin/posts/:id/edit` use a dedicated editor workspace rather than the normal `PageHeader → content surfaces` page grammar. The migrated fixture preserves command bar, outline/version history, Markdown/preview canvas, metadata inspector, dirty/save state, draft/publish/scheduled intent, 409 conflict retention, version restore, other-author read-only behavior and product-owned AI metadata/writing/image flows.
- **Decision:** keep the editor workspace product-local. One PostEditor proves that the grammar is real, but it does not prove a public `EditorShell`, `ContentEditorFrame`, `EditorCommandBar`, `EditorInspector`, autosave/navigation guard Pattern or AI editor feature bag. PageEditor must independently challenge the boundary before extraction.
- **Core correction:** PostEditor exposed that `Modal` incorrectly required `children` even when `description` plus actions formed a complete confirmation dialog. Canonical `ModalProps.children` is now optional; when neither `children` nor `loading` exists, Modal omits the body region entirely instead of rendering an empty padded slot. Description-only confirmations remain fully accessible and avoid meaningless `children={null}` call sites.
- **API impact:** `ModalProps.children` changes from required to optional. No new Modal alias or convenience confirmation component is added; runtime, regression tests, Showcase demo and API documentation are synchronized.
- **Design-language impact:** PostEditor joins the DL-07 application-surface corpus while remaining an intentional editor composition exception to normal route-level `PageHeader` grammar. Markdown/preview Tabs continue PD-020: Tabs owns navigation/structural spacing and the editor canvas owns content padding and horizontal overflow for wide preview content.
- **Validation:** PostEditor feature integration landed at `main@3067984`; the product-triggered Modal correction landed at `main@049fb01`; native Vitest assertions completed the focused suite. `main@7f88493` passed typecheck, all 259 tests, package build, Showcase build and `gh-pages` publication.
- **Follow-up:** migrate PageEditor `/admin/pages/new|:id/edit` as the independent second editor sample. Compare only stable semantic responsibilities after both editors are green; do not promote shared editor composition merely because their three-column layouts look similar.

### PD-036 — PageEditor completes editor validation without an Editor Pattern
- **Status:** accepted validation / defer extraction
- **Owner:** Product-local / Patterns governance / repository validation
- **Evidence:** real Blog Admin `/admin/pages/new` and `/admin/pages/:id/edit` independently prove an editor-family surface with a command bar, Markdown/preview canvas, metadata inspector, dirty/save lifecycle and product-owned AI assistance. Unlike PostEditor, PageEditor is a two-column canvas/inspector workspace with no outline or version history; it requires both title and Slug before persistence, has only draft/published states, saves before frontsite preview, and owns page-template, main-navigation and sort-order semantics.
- **Cross-sample comparison:** PostEditor adds outline/version history, scheduled publishing, other-author read-only mode, version restore, categories/tags/cover metadata and different publish validation. PageEditor instead owns Slug as a hard save invariant, template selection, navigation visibility/order and preview-before-save behavior. The repeated command-bar/canvas/inspector anatomy is real, but the state machines and inspector responsibilities are not stable enough to define one public editor contract.
- **Decision:** do not admit `EditorShell`, `EditorFrame`, `ContentEditorFrame`, `EditorCommandBar`, `EditorInspector`, autosave/navigation-guard Pattern or AI editor feature bag. Keep both editors product-local and continue composing them from mature Core primitives. Shared visual anatomy may guide same-product consistency, but layout similarity is not sufficient abstraction evidence.
- **API impact:** none. PageEditor required no new Core, Pattern or Gouno public API and did not expand the PostEditor-triggered Modal correction.
- **Design-language impact:** PageEditor joins the DL-07 application-surface corpus as the second intentional editor composition exception to normal `PageHeader → content surfaces` grammar. Both editors preserve PD-020 for Markdown/preview Tabs and keep business-content padding/overflow owned by the editor canvas. No new binding cross-product editor rule is added from two same-product samples.
- **Validation:** PageEditor integration landed at `main@a3e83a1`; a one-line local setter typo was corrected at `main@13fb707`; the final accessibility-aware Checkbox assertion landed at `main@968d0ac`. Exact-head CI on `968d0ac` passed typecheck, all 50 test files / 266 tests, package build, Showcase build and `gh-pages` publication.
- **Corpus impact:** the current Blog Admin route corpus is now fully represented in Showcase, including both editor families. This closes the Blog Admin route-level migration milestone without inflating the public abstraction surface.
- **Follow-up:** use the completed Gosso Admin + Blog Admin corpora as evidence for the next real product/page family. Revisit editor extraction only when an independently owned product proves the same interaction contract, or when a smaller stable interaction emerges beyond shared layout anatomy.

### PD-037 — Design-language hardening owns elevation, tab hierarchy and state geometry
- **Status:** accepted design-language hardening / no new public abstraction
- **Owner:** Core design-language governance / Product-local migration / repository validation
- **Evidence:** the completed Gosso Admin + Blog Admin corpus exposed three cross-cutting defects that were easy to miss in dark mode or component-isolated review: light-theme shadows were assigned by ad-hoc size utilities across primitives, Patterns, Showcase tooling and product fixtures; Gosso Account/System tab families and Blog Admin tab families had diverged page-title ordering; and a count Tag inside AI Operations could enlarge one Tab and detach sibling ink bars from the TabList edge. Follow-up review also showed that mechanically converting Gosso to `H1 → Tabs → repeated H2` solved ordering while creating visible label echo and unnecessary heading density.
- **Governance gap:** earlier rules covered surface boundaries, edge insets, compound spacing and row actions, but did not define semantic elevation ownership, dual-theme depth review, route-family/tab hierarchy, duplicate tab-label heading policy, or the invariant that state decoration must preserve control geometry. Existing tests therefore had no gate capable of rejecting these forms of visual drift.
- **Reference review:** Atlassian elevation guidance, Carbon layering and fixed-height Tabs, Ant Design semantic shadow layering, and the WAI-ARIA Tabs pattern were used to challenge the current implementation. External systems are evidence only; Gouno retains its own API and visual vocabulary.
- **Decision:** normal document-flow surfaces remain ground-level by default; canonical depth is expressed through semantic `raised`, `overlay` and `modal` roles rather than page-local shadow sizes. Normal route-family task/settings pages use one stable `PageHeader` before Tabs. The active Tab already labels its `tabpanel`, so an immediate visible H2 must not merely repeat the active Tab label; panels may instead expose a compact description/status/action lead, while genuinely distinct internal concepts use real H2 headings. Public Tab sizes have deterministic block heights so badges/counts/status metadata cannot alter sibling geometry or indicator alignment.
- **Implementation impact:** semantic elevation tokens and component ownership replace visible `shadow-md/lg/xl` usage in canonical runtime; ordinary Card/Table/navigation surfaces return to ground elevation; Gosso Account Settings and System Management adopt `PageHeader → Tabs → compact panel lead/content` without duplicate Tab-label headings; meaningful System Status and MFA subsections retain the document hierarchy as H2; Tabs owns fixed heights and in-boundary indicators.
- **API/abstraction impact:** no new `TabbedPage`, `TabPanelHeader`, `PanelLead`, `Elevation`, `RowActions` or other public Pattern/Gouno abstraction is admitted. The Tabs change is a Core layout-contract correction, semantic shadows are theme/component implementation roles, and Gosso panel-lead helpers remain product-local Showcase composition.
- **Regression policy:** `docs/design-language.md` now treats elevation, page/tab hierarchy, label echo, state geometry and dual-theme semantics as binding rules. Source/runtime tests protect semantic shadow naming, flat normal surfaces, PageHeader-before-Tabs ordering, fixed Tab geometry and the absence of repeated tab-label headings in the migrated Gosso families. DL-07 requires the already-migrated corpus to be checked whenever these binding rules change.
- **Validation gate:** acceptance requires exact-head typecheck, the complete test suite, package build, Showcase build and `gh-pages` publication. Visual parity that cannot be proven by source/runtime tests remains a light + dark render-review obligation in an environment with an interactive browser.
- **Follow-up:** resume ordinary product work only after the exact-head gate is green. Future migrations should start from the hardened design-language model rather than waiting for screenshots to reveal the same classes of drift again.

### PD-038 — Blog article rendering admits Core CodeBlock without a syntax-engine dependency
- **Status:** accepted / Core admission
- **Owner:** Core / Showcase integration / Blog public validation
- **Evidence:** the real `gouno-blog` `/articles/:slug` path renders Markdown through `MarkdownRenderer`; block code is read-only, syntax-highlighted, horizontally scrollable and copyable with a success state. Showcase independently exercised the same code-frame/copy interaction through a Prism-based private `CodeBlock`. The two consumers use different syntax pipelines (`rehype-highlight` in Blog, `prism-react-renderer` in Showcase), proving that the stable shared contract is smaller than either highlighter implementation.
- **Decision:** admit canonical Core `CodeBlock`. Core owns the read-only frame, horizontal overflow, optional language label, clipboard action/feedback and one canonical `code` source. Syntax tokenization/highlighting remains caller-owned through `renderCode(code)`, which receives the exact canonical `code` string and is presentation-only. Do not expose Prism/rehype language types, ASTs, token structures or a second source/value/children write path.
- **API impact:** add `CodeBlock` / `CodeBlockProps` with `code`, optional `language`, `copyable`, `copyLabel`, `copiedLabel`, `renderCode` and normal root HTML/className extension. `code` is both the default displayed text and clipboard payload. No highlighter package becomes a Core runtime dependency.
- **Design-language impact:** CodeBlock is a nested reading/content grouping surface, not a raised product surface. It uses border/background separation and owns its own internal toolbar/pre anatomy without raw or semantic raised/overlay/modal shadows.
- **Showcase impact:** the existing Showcase CodeBlock becomes a thin Prism rendering adapter around Core; Prism remains a development-only Showcase dependency. Preview/code documentation for Core CodeBlock comes from one executable example source.
- **Validation:** focused Core tests cover single-source render/copy behavior, language presentation, localized copy feedback and non-copyable read-only mode; existing Showcase Prism/copy coverage continues through the adapter. API-020 records the one-source/no-highlighter-coupling contract.
- **Follow-up:** resume Blog public `/articles/:slug` migration and use Core CodeBlock there while independently validating reading typography, heading anchors/TOC, media, related navigation and community behavior before admitting any additional reading abstraction.

### PD-039 — Blog article TOC hardens Core Anchor without a navigation feature bag
- **Status:** accepted validation / Core correction
- **Owner:** Core / Blog public validation
- **Evidence:** the real Blog article detail renders a semantic table-of-contents `<nav>` with real `href="#heading-id"` links; Markdown headings own stable IDs plus `scroll-mt-24` so the sticky public header does not cover directly visited hash targets. Review of the existing Core `Anchor` found two canonical defects before ArticleDetail migration: `aria-label` was hard-coded to English, and `offset` called `window.scrollTo({ top: offset })` instead of calculating the selected target's document position. Current Ant Design Anchor provides explicit target-offset behavior as benchmark evidence, while platform CSS `scroll-margin-top` provides the preferable native-hash solution when the target is under product control.
- **Decision:** keep Anchor deliberately small. It renders real anchor elements, accepts standard nav HTML/ARIA/className props, and defaults `offset=0` so browsers retain native hash/history/keyboard semantics. Product headings should own sticky-header spacing through `scroll-margin-top`. When a caller explicitly supplies `offset` and clicks a resolvable local hash, Anchor computes `scrollY + target.getBoundingClientRect().top - offset`, smooth-scrolls to that document position, and updates the hash; external URLs or missing targets are not intercepted.
- **API impact:** `AnchorProps` now extends `HTMLAttributes<HTMLElement>` and therefore supports standard `aria-label`, className and nav attributes. Existing `items` and `offset` names remain; no `ariaLabel`, `offsetTop`, `targetOffset`, scrollspy, affix, direction, bounds or other compatibility/feature-bag aliases are added. `AnchorItem.title` remains `ReactNode`, which is sufficient for product-local indentation/presentation without adding a heading-level API.
- **Design/accessibility impact:** native hash navigation is the default because it preserves copied deep links and direct URL entry. Sticky-header spacing belongs to the target heading when possible, not to a JavaScript navigation workaround. The Anchor itself is a ground-level navigation region and does not introduce elevation.
- **Showcase/validation:** Anchor now has an executable same-source Preview/Code example, localized accessible navigation name and focused tests for native hrefs, standard props, correct target-offset math and non-interception of missing/external targets. `core-anchor` joins the certified completion set; the previously admitted Core CodeBlock is also synchronized into that set after its Stage 1A audit.
- **Follow-up:** resume `/articles/:slug` as a product-local public reading composition using canonical `PageHeader`, `Anchor` and `CodeBlock`. Do not admit `ArticleShell`, `MarkdownRenderer`, `TableOfContents` or a reading Pattern from this single product page.

### PD-040 — ArticleDetail validates public reading composition without a Reading Pattern
- **Status:** accepted validation / defer extraction
- **Owner:** Product-local / Core + Gouno validation / repository process
- **Evidence:** the real `gouno-blog` `/articles/:slug` route combines the public document shell with article cover/title/summary, author/date/read/view/like metadata, Markdown headings and deep links, sticky TOC, rich body content, code copy, media, related reading, preview/loading/error/not-found states, then a separate community interaction tail. The first migrated ArticleDetail pass reproduces the reading/document responsibilities while deliberately deferring likes/comments/replies/reporting state machines to the next stage.
- **Decision:** keep the reading composition product-local. `BlogPublicShellFixture` remains a Blog-only shell; canonical `PageHeader` expresses the real document title + summary contract without implying `AppShell`; Core `Anchor` owns native-hash TOC links while heading IDs/scroll-margin stay content-owned; Core `CodeBlock` owns the read-only code/copy frame while syntax tokenization remains caller-owned; related reading reuses the same-product `BlogArticleTeaser`. Do not admit `ArticleShell`, `ReadingLayout`, `MarkdownRenderer`, `TableOfContents`, `ArticleMeta`, `RelatedReading` or a generic Reading Pattern from one public content product.
- **Surface/design impact:** the article uses one dominant ground-level reading boundary with a full-bleed cover and one internal content track. Its `p-6 sm:p-8` content rhythm is a semantic reading/document measure exception, not precedent for changing the normal application-shell 24px edge axis. The sticky TOC is a ground-level aside; sticky positioning does not create overlay elevation. Nested CodeBlock/table/figure regions own only their local boundaries and overflow responsibilities.
- **API impact:** none. ArticleDetail validates existing `PageHeader`, hardened `Anchor` and newly admitted `CodeBlock` without extending their contracts. No new runtime dependency, Pattern or Gouno public surface is added.
- **Fidelity scope:** this stage covers article identity, reading hierarchy, metadata, real heading IDs/deep links, representative paragraph/list/blockquote/table/code/figure content, related navigation, scroll-progress presentation, admin-preview banner, loading, fatal error/retry and not-found. Community behavior remains explicitly incomplete until the next Reading stage.
- **Validation:** focused product tests assert H1/metadata, native TOC hrefs plus `scroll-mt-24`, canonical PageHeader/Anchor/CodeBlock usage, related navigation, preview/loading/error/not-found behavior, standalone catalog registration and the absence of AppShell/PageContainer/MarkdownRenderer/TableOfContents/elevation leakage. Acceptance still requires exact-main typecheck, complete tests, package build, Showcase build and Pages publication.
- **Follow-up:** migrate the community tail independently: like state, comments, reply/report flows, comment form and report Modal. Use that state-machine evidence to decide whether any smaller interaction deserves extraction; default to product-local behavior rather than treating ArticleDetail layout similarity as admission evidence.

### PD-041 — ArticleDetail community behavior stays product-local
- **Status:** accepted validation / defer extraction
- **Owner:** Product-local / Core validation
- **Evidence:** the completed Blog public ArticleDetail community tail exercises optimistic like state, signed-in and guest comments, one-level replies, empty discussion, non-fatal interaction failure, report validation and canonical Modal lifecycle.
- **Decision:** keep community orchestration product-local. Compose existing Core `Button`, `Badge`, `Card`, `Empty`, `Field`, `Input`, `Textarea`, `Alert` and `Modal`; the page owns identity mode, comment tree shape, like counts, reply policy, report payload and success/error state.
- **API/abstraction impact:** none. Do not admit `CommentThread`, `CommentComposer`, `LikeButton`, `ReportDialog`, `CommunityPanel` or a generic Community/Reading Pattern from this single content product.
- **Validation:** focused tests cover reversible `aria-pressed` like state, guest validation, first-comment empty-state transition, root-only replies, report reason validation, Modal close/success behavior and non-fatal community errors while reading remains available.

### PD-042 — About and CustomPage validate document composition without a Document Pattern
- **Status:** accepted validation / defer extraction
- **Owner:** Product-local / Core + Gouno validation
- **Evidence:** real Blog public `/about` is a fixed introduction page while dynamic `/:slug` CustomPage owns managed content plus loading/error/not-found lifecycle. Both are standalone document surfaces under the Blog public shell but their data/state responsibilities differ.
- **Decision:** share only a Blog product-local document surface for route/document header plus readable content. Keep CustomPage async/resource lifecycle local and About static. Reuse existing `PageHeader` and `CodeBlock` where semantics match.
- **API/abstraction impact:** none. Do not admit `DocumentPage`, `MarkdownPage`, `DocumentShell`, a public `MarkdownRenderer` or a generic Reading/Document Pattern from same-product document layout similarity.
- **Design impact:** document content may own a spacious reading measure, but that remains a public-content semantic exception rather than application-shell spacing precedent.

### PD-043 — Public account pages preserve the GOSSO identity boundary
- **Status:** accepted validation / defer extraction
- **Owner:** Product-local / security-boundary validation
- **Evidence:** real Blog public `/account/notifications` and `/account/settings` require authenticated task surfaces. Notifications owns site interaction/reminder state; Settings owns Blog-local display name, public bio and notification preferences while identity credentials and high-assurance account operations belong to GOSSO.
- **Decision:** Blog owns notification read/filter transitions and Blog-local profile/preference state only. Password, MFA, Passkey, identity session and login forms remain outside Blog and route to GOSSO account management. Compatibility `/notifications` and `/settings` remain redirects rather than duplicate page families.
- **API/abstraction impact:** none. Do not admit `AccountShell`, `NotificationCenter`, `NotificationList`, `ProfileSettings`, `PreferencePanel` or an Account Pattern from these two related product pages.
- **Security impact:** public Blog fixtures must not imply browser-owned token exchange/refresh/userinfo/revoke or a Blog-owned login form; static Showcase account scenarios make no real identity/API request.

### PD-044 — Blog public reaches route-level Showcase coverage with a product-local NotFound
- **Status:** accepted milestone
- **Owner:** repository process / Product-local
- **Evidence:** cross-checking the real public router yields Home, ArticleIndex, ArticleDetail, category/tag index and detail modes, Archive, About, Search, Account Notifications/Settings, compatibility redirects, dynamic CustomPage and a final unresolved-route fallback.
- **Decision:** represent each canonical public page family exactly once in Showcase. Keep category/tag detail as ArticleIndex modes, keep compatibility paths as route policy, and keep the final NotFound as a `BlogPublicShellFixture` + Core `Result` recovery surface rather than a second document/application shell.
- **API/abstraction impact:** none. Do not admit `NotFoundShell`, `ResultPage`, `PublicShell` or another public page wrapper from route closure.
- **Validation:** the route-closure guard protects canonical standalone registrations, mode ownership, compatibility redirects, absence of AppShell/PageContainer and absence of real service calls in public fixtures.

### PD-045 — Third-product validation corpus closes with no active fourth migration line
- **Status:** accepted milestone / process transition
- **Owner:** repository process
- **Evidence:** Gosso Admin is the completed first comparison corpus, Blog Admin the completed second, and the real Gouno Blog public router plus its migrated Showcase fixtures now form the completed third corpus. The closure audit also corrected a prior bookkeeping drift where several completed Blog public fixtures existed in source/tests but had not been registered in Catalog/Router and process documents still called Blog the active line.
- **Decision:** close Gouno Blog public as the third completed comparison corpus and select no fourth product migration line. Completed corpora remain live regression/prior-art evidence. Future page-by-page migration begins only after selecting a real independently owned next product/page family; completed fixtures may be reopened when later evidence exposes a genuine canonical defect or missing fidelity.
- **API/abstraction impact:** none. Closure does not admit `PublicShell`, Reading, Community, Document, Account or NotFound feature-bag abstractions.
- **Governance impact:** `AGENTS.md`, README, architecture, product-driven-development, fixture documentation, Catalog/Router and regression tests must all agree with this state before component convergence work is considered the next phase.

### PD-046 — Empty converges on caller-owned content, surface and live-region semantics
- **Status:** accepted / Core correction
- **Owner:** Core / design-language governance / completed-corpus validation
- **Evidence:** Gosso Admin uses Empty for Passkeys, Sessions and collection fallbacks; Blog Admin uses it across Table/Card/Grid collection states; the public Blog uses it for Home, ArticleIndex, discovery indexes, account notifications and article community. Across all three completed corpora, the product consistently owns the actual copy and next action. Some Empty blocks already sit inside an existing Card/collection surface while others are open public-content states, and only a subset represents a dynamic state change that should be announced to assistive technology.
- **Decision:** keep `Empty` as a narrow ground-level content primitive. Canonical slots remain caller-owned `title`, optional `description`, optional `icon` and optional `action`; the root accepts standard div/ARIA attributes. Remove the English `"No data"` default, the built-in dashed/rounded surface boundary and the unconditional `role="status"`. Callers that need a live region opt in with standard `role` / `aria-live`; callers that need a bounded surface compose Empty inside the semantic Card/Table/List/route surface that actually owns that boundary.
- **API impact:** `EmptyProps` becomes an explicit same-owner interface extending `Omit<HTMLAttributes<HTMLDivElement>, "title">` so the business `title: ReactNode` slot does not collide with the native string `title` attribute. The public slots do not expand beyond `title/description/icon/action` plus standard DOM extension. This is behaviorally breaking for consumers that relied on the old default copy, border/radius or automatic status role; no compatibility aliases or `variant/bordered/live` convenience props are added.
- **Design/accessibility impact:** Empty itself does not establish a new elevation/surface layer and therefore must not add border, radius or shadow by default. Static initial empty states are not forced into a live region; filter/result transitions that genuinely need announcement can explicitly opt in without creating a second component API.
- **Showcase/validation:** two executable same-source Preview/Code examples cover ordinary surface ownership and explicit dynamic announcement. Focused tests protect caller-owned copy/action, absence of default user-facing copy/live-region semantics, absence of a second surface boundary and standard DOM/ARIA passthrough. API documentation is compiler-checked against `EmptyProps`, and `core-empty` joins the certified completion set only with those guards present.
- **Follow-up:** review Core `Result` independently. Do not infer that Result should copy Empty's exact semantics merely because both are feedback components; standalone terminal-result routes have different heading, status and focal-surface responsibilities that require their own corpus audit.

### PD-047 — Result separates terminal semantics from page, surface and live-region ownership
- **Status:** accepted / Core correction
- **Owner:** Core / design-language governance / completed-corpus validation
- **Evidence:** Gosso NotFound already required a standalone H1 inside an elevated focal Card, while Blog public NotFound, CustomPage error/not-found and ArticleDetail error/not-found used Core `Result` as the route's terminal replacement. Those Blog call sites also exposed a composition defect: a default padded Card wrapped a Result that already owned `p-8`, producing double inset. The old Core contract additionally used non-canonical `subTitle`, fixed every title to H2, forced `role="status"` on static 404 pages and rendered status meaning as readable punctuation/text glyphs.
- **Decision:** keep `Result` as a narrow terminal-result primitive rather than a page/surface feature bag. Canonical content is `status`, required `title`, optional `description`, optional `extra`, optional `children` and one `headingLevel` write path. `description` replaces `subTitle` under NAME-01 and no alias is retained. Embedded results default to H2; a route-level result explicitly chooses H1. Result accepts standard section/ARIA attributes but declares no live region by default; dynamic outcomes opt into `role="status"` or `role="alert"` according to product semantics. Default status icons are decorative and visible text carries the result meaning.
- **API impact:** `ResultProps` becomes an explicit same-owner interface extending `Omit<HTMLAttributes<HTMLElement>, "title">`; `ResultStatus` is exported from the same owner. `headingLevel?: HeadingLevel` defaults to 2. The breaking `subTitle → description`, fixed-H2 correction and removed automatic `role="status"` receive migration guidance instead of compatibility aliases. No custom icon, `variant`, `size`, status-color alias or Result-owned Card API is added.
- **Design impact:** Result owns its centered internal result rhythm (`p-8`) but not the surrounding boundary/elevation. A Card whose only responsibility is to bound/elevate Result therefore uses `padding="none"`; Gosso chooses `elevated`, Blog chooses `subtle`, and Core Result remains neutral. This preserves PD-023/PD-024 single-surface and edge-ownership rules rather than manufacturing a second inset or elevation layer.
- **Showcase/validation:** three executable same-source Preview/Code examples cover default embedded success, page-level H1 + Card boundary ownership, and explicit alert semantics. Focused tests protect H2 default/H1 opt-in, caller-owned content/actions/details, absence of implicit live-region and surface classes, decorative icons, standard DOM/ARIA passthrough and numeric-zero descriptions. Gosso NotFound and the Blog terminal-result routes validate the contract in real product corpora; `core-result` joins the certified completion set only with API documentation/source-trust/product tests synchronized.
- **Follow-up:** continue component convergence one capability at a time from the completed three-product corpus. Do not generalize `ResultPage`, error-page routing, recovery navigation or product-specific elevation into a new Pattern/Gouno abstraction without independent evidence.

### PD-048 — Skeleton separates structural placeholder visuals from loading-state semantics
- **Status:** accepted / Core correction
- **Owner:** Core / accessibility governance / completed-corpus validation
- **Evidence:** Blog public Home, ArticleIndex, ArticleDetail, CustomPage and Account surfaces plus many Blog Admin collection/dashboard routes repeatedly use groups of Skeleton blocks to preserve layout during structural loading. These products already place the meaningful loading state on a containing region. Gosso independently uses `Spinner` for indeterminate task execution such as OAuth callback processing, providing counter-evidence against turning Skeleton into a generic Loading/AsyncState abstraction.
- **Decision:** keep `Skeleton` as a visual structural placeholder. Individual Skeleton blocks default to `aria-hidden=true`; the parent loading region owns `role`, the accessible loading name and any live-region policy. Standard div attributes remain available, including an explicit `aria-hidden={false}` override for exceptional cases. Dimensions, shape and spacing remain caller-owned through `className` rather than `size`, `shape`, `avatar`, `paragraph` or preset props.
- **API impact:** no new public prop surface. `SkeletonProps` remains the existing runtime-derived type-only manifest for the thin Core wrapper, so the accessibility correction does not create a second Props owner or compatibility alias. The wrapper only changes the default value of the standard `aria-hidden` attribute.
- **Motion/design impact:** Skeleton keeps the existing visual primitive and does not create a surface/elevation role. Reduced-motion behavior remains globally governed by `src/base.css`; no Skeleton-specific motion policy is introduced.
- **Showcase/validation:** one executable same-source Preview/Code example demonstrates a parent `role="status"` / `aria-label` around multiple decorative placeholders. Focused tests protect default `aria-hidden`, parent-owned loading semantics, standard div/ARIA override behavior and className-owned shape/dimensions. `core-skeleton` joins the reviewed completion set only with source-trust and target-component certification synchronized.
- **Abstraction impact:** do not restore Legacy `LoadingState`, `AsyncState` or a loading feature bag from this evidence. Structural placeholders, indeterminate task progress and product async orchestration remain separate responsibilities.

### PD-049 — QRCode converges on standard canvas, ARIA and ref ownership
- **Status:** accepted / Core correction
- **Owner:** Core / accessibility governance / completed-corpus validation
- **Evidence:** Gosso Account Settings MFA is a real consumer of Core `QRCode` for TOTP enrollment and requires a localized accessible name. Both the migrated Gouno UI Gosso fixture and the real `gosso-admin` source exposed the same canonical defect: QRCode accepted a non-standard `ariaLabel`, injected the English fallback `"QR code"`, exposed no normal canvas/ARIA/data/className surface and did not forward the semantic canvas ref. The real product is still pinned to a vendored `@gouno/ui` 0.1.0 artifact, so its source cannot safely change naming before that artifact is refreshed.
- **Decision:** keep `QRCode` as a narrow value-to-canvas renderer. Preserve `value`, `size`, `color`, `background` and `errorLevel`; make standard canvas attributes the extension surface, default only `role="img"`, and let the product provide an actual localized accessible name through `aria-label` or `aria-labelledby`. `size` remains the sole width/height write path. Ref points to the real canvas. Do not keep `ariaLabel` as an alias and do not add status/refresh/icon/bordered/type workflow features without independent product evidence.
- **API impact:** `QRCodeProps` becomes an explicit same-owner interface over `CanvasHTMLAttributes<HTMLCanvasElement>` while excluding `children`, native `color`, `width` and `height` conflicts. `QRCodeErrorLevel` is a named finite union. The previous runtime-derived `QRCodeProps` alias is removed from `public-props.ts`; Core exports the component and both owned types from `qrcode.tsx`. This is breaking for `ariaLabel` consumers and for consumers that relied on the implicit English name.
- **Product migration impact:** the Gouno UI Gosso MFA fixture immediately migrates to standard `aria-label` and validates the canonical contract. Real `gosso-admin` must migrate `ariaLabel → aria-label` in the same change that replaces `file:vendor/gouno-ui-0.1.0.tgz`; do not create a half-migrated product source against the old immutable artifact.
- **Showcase/validation:** one executable same-source Core Preview/Code example documents localized naming and the existing renderer options. Focused Core tests cover standard canvas/ARIA passthrough, caller-owned accessible naming, real canvas ref, defaults/custom renderer options and redraw on value change. A Gosso MFA product test validates the role/name and 180px renderer path. API-documentation, target-component and automatic 100% source-trust guards certify the page together.
- **Abstraction impact:** QR code generation remains Core rendering infrastructure, not MFA policy and not a generic QR workflow. Authentication enrollment, secret lifecycle, recovery and step-up behavior stay product-owned.

### PD-050 — Statistic keeps metric display narrow while exposing the real DOM host
- **Status:** accepted / Core hardening
- **Owner:** Core / completed-corpus validation
- **Evidence:** Blog Admin Dashboard and AI Operations are independent route families that repeatedly need a compact metric label plus caller-supplied value. The real Dashboard source independently shows the same label/value/secondary-detail grammar, while the migrated corpus demonstrates that Card/link/button affordances and secondary explanatory copy vary by product context.
- **Decision:** keep `Statistic` as a narrow presentation primitive with required `title` and `value` plus optional `prefix`/`suffix`. Expose standard root div/ARIA/data/event properties and forward ref to that root under DOM-01. Do not invent a live region, Surface, formatting policy or trend semantics; the caller owns number/date/currency formatting, dynamic announcement, Card/elevation, navigation and secondary details.
- **API impact:** `StatisticProps` now extends `Omit<HTMLAttributes<HTMLDivElement>, "children" | "title">` so the business `title: ReactNode` does not collide with native `title`, while `children` cannot become a second value/content path. Existing `title/value/prefix/suffix` remain unchanged; this is additive for existing consumers. Stable `data-slot` markers identify root/title/value anatomy without adding styling APIs.
- **Showcase/validation:** one executable same-source Preview/Code example covers two product-style metrics. Focused tests protect standard DOM/ref passthrough, zero plus prefix/suffix rendering, no implicit live-region and no Surface classes. API-documentation, target-component and automatic reviewed source-trust checks gate `core-statistic` at 100%.
- **Abstraction impact:** Dashboard and AI Operations do not justify `MetricCard`, `KPI`, `TrendStatistic`, formatter/precision/prefix icon presets or a dashboard Pattern. Those responsibilities remain product-owned until independent evidence proves a smaller stable contract.

### PD-051 — Spin separates busy-region state from announcement ownership
- **Status:** accepted / Core accessibility hardening
- **Owner:** Core / accessibility governance / completed-corpus validation
- **Evidence:** Gosso OAuth callback is real product evidence for indeterminate task execution. The previous `Spinner` unconditionally created `role="status"` plus the English accessible name `"Loading"`, even when the product already rendered localized status copy; `Spin` separately placed `role="status"` on its overlay while exposing no standard root DOM/ref extension. PD-048 already established that structural Skeleton placeholders and task-execution feedback are separate responsibilities.
- **Decision:** keep `Spinner` as the visual rotating indicator and make it decorative by default with `aria-hidden=true`; standalone semantics opt in only through standard ARIA. Keep `Spin` as a wrapper around existing content whose `spinning` state is the single public busy-state write path and drives root `aria-busy`. The overlay and optional `tip` remain visual/content presentation and do not automatically become a live region. The caller or product owns one localized status region and any `aria-live` policy when announcement is actually required.
- **API impact:** `SpinnerProps` remains the standard span-attribute surface while its implementation now forwards the real span ref and removes implicit `role=status`/English naming. `SpinProps` extends standard div attributes while excluding `children` and `aria-busy`, forwards the real root div ref, and does not admit a second busy-state write path. This is behaviorally breaking for consumers that relied on Spinner's old implicit status/name. No `delay`, `fullscreen`, custom-indicator, LoadingState or AsyncState feature bag is admitted.
- **Product migration impact:** the Gosso callback fixture now gives its localized loading container the single `role="status"`; the nested Spinner remains decorative. Product regression coverage asserts exactly one status region and no injected `Loading` text.
- **Showcase/validation:** two executable same-source examples document Spin busy-region semantics and Spinner inside a caller-owned localized status region. Focused Core tests protect default decorative Spinner behavior, explicit standard-ARIA opt-in, real refs/DOM passthrough, `spinning → aria-busy`, overlay removal and the absence of Card-like surface styling. `core-spin` joins the reviewed completion set so dynamic source-trust and target-component certification apply.
- **Related correction:** PD-050's API-impact prose omitted the React RDFa `prefix` collision from its displayed `Omit` list. The canonical Statistic runtime already uses `Omit<HTMLAttributes<HTMLDivElement>, "children" | "prefix" | "title">`; this clarification supersedes only that stale type-detail sentence and does not change the Statistic decision or API behavior.
- **Abstraction impact:** do not restore Legacy `AsyncState`/`LoadingState`, invent a universal loading wrapper, or copy mature-library loading feature bags merely for parity. Structural placeholders, visual indeterminate indicators, busy-region state and product async orchestration remain separate responsibilities.
- **Follow-up:** resume evidence-driven Core convergence from the completed Gosso Admin, Blog Admin and Blog public corpora; select the next component only when those real usages expose a concrete canonical gap.

### PD-052 — Steps and Menu converge on stable keyed navigation without compatibility feature bags
- **Status:** accepted / Core navigation hardening
- **Owner:** Core / accessibility governance / completed-corpus validation
- **Evidence:** the completed Gosso Admin, Blog Admin and Blog public corpora repeatedly need ordered workflow progress, route/navigation collections, nested groups and predictable keyboard interaction, while the previous Core `Steps` and `Menu` were minimal shells: Steps relied on index identity and a narrow title/description shape; Menu exposed only a flat button list plus non-standard `ariaLabel` and item-level `danger`. Those contracts could not represent the proven product navigation semantics without product-local state and accessibility workarounds.
- **Reference review:** current Ant Design Steps/Menu capability was used as a breadth benchmark, while standard DOM/ARIA naming and Gouno `docs/api-specification.md` remained authoritative. Mature-library compatibility baggage was explicitly rejected: no `medium` size spelling, no `ariaLabel`, no Menu `theme`, no item-level `danger`, no localization feature bag and no duplicate state aliases.
- **Decision:** harden both families around stable keyed item models. Steps requires `StepItem.key`, uses `current` plus `onChange(index)` for the single interactive workflow position, separates `content` from optional compact `subTitle`, keeps disabled steps non-interactive, and supports only the proven orientation/type/variant/size/progress/maxCount/semantic-slot surface. Menu models `item | submenu | group | divider`, separates selection (`selectedKeys/defaultSelectedKeys`) from expansion (`openKeys/defaultOpenKeys`), supports single/multiple selection, vertical/horizontal/inline modes, inline collapse, click/hover submenu policy and roving keyboard focus with parent-return behavior.
- **Accessibility/content ownership:** Menu accepts standard root DOM/ARIA attributes and never injects the English accessible name `"Menu"`; products that need a named navigation landmark provide `aria-label` or `aria-labelledby`. Steps maxCount omission slots use a visible language-neutral ellipsis only and do not inject `"More steps"`. Disabled Steps remain non-button content with `aria-disabled`; Menu horizontal mode exposes menubar semantics and nested items use menu/menuitem semantics. Core behavior owns focus/navigation mechanics, while localized copy and product route/destructive-operation policy remain caller-owned.
- **API impact:** `StepsProps`, `MenuProps` and their support types are now exported directly from the implementation owners instead of runtime-derived proxy aliases in `public-props.ts`. This is breaking for Steps consumers without stable keys or using `items[].description`, and for Menu consumers using `ariaLabel`, `danger` or assumptions from the old flat-only surface. Migration guidance replaces compatibility aliases. No new Pattern/Gouno abstraction is admitted.
- **Showcase/validation:** Steps and Menu each use executable same-source demos and complete API tables. AST documentation gates require every declared prop to be represented and forbid the legacy names; focused behavior tests cover stable keys, disabled Steps, percent/maxCount, nested keyPath selection, controlled open state, multiple deselection, roving focus, submenu close/parent return, horizontal menubar semantics, caller-owned accessible naming and absence of injected English copy. Both families join the reviewed completion set only with these guards present.
- **Delivery:** Navigation Batch 4B implementation landed at `main@9ce2b360`; the one incorrect disabled-step test assumption was corrected at `main@8a8a967`; caller-owned a11y copy was sealed at `main@fe207afe`. Exact-head run 279 passed typecheck, the complete test suite, package build, Showcase build and Pages publication; `gh-pages` deployed `fe207afe21f6c8255275e8cad5816089f42c3541`.
- **Follow-up:** continue Core public-surface sealing from actual coverage gaps rather than expanding these families for parity. The next release audit should treat Steps/Menu changes as breaking pre-1.0 surface changes and keep product vendored-artifact upgrades atomic with source migrations.

### PD-053 — Public runtime family sealing is retention-aware and leaves zero pending exports
- **Status:** accepted / Core public-surface sealing
- **Owner:** Core governance / Showcase documentation governance
- **Evidence:** after the completed three-product corpus and Navigation 4B, the runtime export audit still exposed five `needs-review` symbols (`SearchField`, `CheckboxField`, `AvatarImage`, `AvatarFallback`, `Divider`) plus four `unassigned` symbols (`App`, `AspectRatio`, `Container`, `Stack`). Real `gouno-blog` source independently consumes `SearchField` and `CheckboxField`; the remaining symbols are established Core APIs governed by `docs/core-component-retention.md`, so lack of current product calls alone is not deletion authorization.
- **Decision:** every PascalCase Core runtime export must map to a visible canonical Core Showcase family, and the coverage gate must reject any future `needs-review` or `unassigned` entry. Resolve the outstanding surface by family ownership rather than opportunistic deletion: `SearchField → Input`, `CheckboxField → Checkbox`, `AvatarImage/AvatarFallback → Avatar`, `Divider → Separator`, `App/Container/AspectRatio → Page Layout`, and `Stack → Flex`.
- **API/runtime impact:** `SearchField` and `CheckboxField` gain real semantic-element ref coverage; Avatar compound anatomy is explicitly documented; `Divider` stays a deprecated compatibility sibling of Separator rather than creating a separate family; `App`, `Container`, `AspectRatio`, and `Stack` keep their established names and gain stable root refs/`data-slot` anatomy where needed. No public API is removed in this sealing decision.
- **Retention rule:** family coverage is not a popularity score. An established Core component may later be de-admitted only through component-specific evidence and explicit approval; an empty usage search cannot by itself satisfy that bar. Conversely, a newly exported runtime component cannot remain undocumented or unreviewed merely because it compiles.
- **Validation:** 5A landed at `main@04b374f6` and exact-head run 281 passed the complete gate. 5B landed at `main@a6f84f8e`; its only initial failure was a CSS `aspect-ratio` serialization-specific test assertion, corrected without runtime change at `main@1dfc25fa`. Exact-head run 283 then passed typecheck, all tests, package build, Showcase build and Pages publication; `gh-pages` deployed `1dfc25fa11246e80463c1154258c5f1f4221a8fc`.
- **Follow-up:** treat the Core runtime family map as sealed release evidence. New Core additions or component-specific removals must update runtime ownership, Showcase family documentation and the zero-pending regression gate atomically.

### PD-054 — Tabs removes pre-reset high-level state aliases before the next package cut
- **Status:** accepted / Core breaking pre-release sealing
- **Owner:** Core / release governance
- **Evidence:** PD-010 intentionally allowed temporary high-level `value/defaultValue/items[].value` compatibility only during migration and required removal before the next stable package release. By the final public-surface pass, canonical product and Showcase state already used `activeKey/defaultActiveKey/items[].key/onChange`; keeping the old paths would preserve duplicate state ownership into the release. Real Gosso/Blog consumers are still pinned to immutable `0.1.0` vendored artifacts, and several source call sites still use the older non-standard `ariaLabel`, so that accessibility alias requires a different atomic product-upgrade boundary.
- **Decision:** remove high-level `TabsProps.value`, `TabsProps.defaultValue`, and `TabItem.value` compatibility completely. `onValueChange` remains hidden from the high-level API; state is only `activeKey/defaultActiveKey/items[].key/onChange`. Primitive `Tab` and `TabPanel` continue to use `value` as the Radix-backed composition key; that primitive key is not a second high-level state write path. Standard `aria-label` / `aria-labelledby` is canonical, while `ariaLabel` remains only as an explicit `@deprecated` migration alias until real products refresh their vendored package; standard ARIA wins if both are present.
- **Documentation impact:** all Core Tabs same-source examples now show standard ARIA and keyed high-level state. The API table records atomic standard `aria-label` rather than a combined alias row, and migration guidance states that old high-level state inputs are already removed rather than merely scheduled for removal.
- **Regression policy:** type/source/documentation tests assert that `TabsProps` cannot regain `value/defaultValue/onValueChange`, `TabItem` cannot regain `value`, executable high-level examples cannot show the removed state paths, and primitive composition remains explicitly separate. The deprecated `ariaLabel` bridge is intentionally visible so it cannot silently become canonical.
- **Validation:** sealing landed at `main@769fa769`. Exact-head run 284 found one documentation-only governance failure because the API table named a combined `aria-label / aria-labelledby` row; the row was made atomic without runtime change at `main@6b80b7e3`. Exact-head run 285 then passed typecheck, 548 tests, package build, Showcase build and Pages publication; `gh-pages` deployed `6b80b7e309c1be495948d80daabb130573e277b2`.
- **Product/release follow-up:** the next vendored-package rollout must migrate real product `ariaLabel → aria-label` call sites atomically with the artifact update. Do not reintroduce high-level state aliases to make that rollout easier; fix consumers against the sealed contract instead.

### PD-055 — General/Layout 6A reaches reviewed 100 without expanding product semantics

- **Status:** accepted / Core hardening
- **Owner:** Core / General + Layout families
- **Evidence:** Existing Icon, Kbd, Flex and Separator are established generic UI-library families; Ant Design 6.x confirms the continuing value of explicit icon semantics, flex layout and Divider-like separators, while Gouno binding rules require standard ARIA, `small/middle/large` sizing, semantic elevation and single-write-path APIs. Main run 291 passed typecheck, 554 tests, package build, Showcase build, npm pack and Pages publication.
- **Decision:** Certify `core-icon`, `core-kbd`, `core-flex` and `core-separator` at reviewed 100 for their deliberate Gouno scope. `Icon.label` is not retained as a second accessible-name path; standard `aria-label` / `aria-labelledby` own naming. Kbd remains a native ground-level element. Flex exposes direct CSS semantics without child wrappers or redundant vertical aliases. Separator owns line/content composition and standard separator semantics but not surrounding spacing or product copy.
- **Consequence:** Core reviewed completion is still not globally 100; remaining families continue through the same API + behavior + a11y + same-source Demo/code + tests gate. No established Core family was removed to improve the score.

### PD-056 — Avatar and Grid 6B1 reach reviewed 100 by extending established families

- **Status:** accepted / Core hardening
- **Owner:** Core / General + Layout families
- **Evidence:** Avatar and Grid are established generic Core families protected by the retention policy. The existing Avatar surface already exposed Root/Image/Fallback while the primitive layer contained Group/Badge/GroupCount; the existing Grid helper already served simple CSS Grid layouts. Mature design-system review confirms avatar grouping and 24-column responsive layout as durable component-library capabilities, but Gouno's existing `ControlSize`, DOM/ARIA and compatibility rules remain authoritative. Branch Node 24 verification passed typecheck, 559 tests, package build and Showcase build; exact-main run 293 then passed Verify, pack, artifact upload and Pages publication, and `gh-pages` deployed `10500d84917bab2e643824314a67ec85d8c1a876`.
- **Decision:** certify `core-avatar` and `core-grid` at reviewed 100 for their deliberate Gouno scope. Avatar canonicalizes `small/middle/large | number`, adds `circle/square`, and exposes Image/Fallback/Badge/Group/GroupCount as one compound family. `AvatarGroup.max` owns only bounded visual slots and overflow count; localized member/business semantics and accessible naming stay caller-owned. Grid retains the established `Grid(columns, gap)` helper and adds `Row`/`Col` as the 24-column responsive layer rather than replacing the helper.
- **Compatibility:** `Avatar size="sm|default|lg"` remains accepted as a deprecated bridge and normalizes to canonical size semantics; this batch does not delete it. Existing `Grid` call sites keep their component and props. Removal of either established compatibility surface would require a separate migration assessment and, where it means deleting an established Core capability, explicit maintainer approval under the retention rule.
- **Responsive contract:** `Col` supports span/offset/order/push/pull/flex plus xs/sm/md/lg/xl/xxl overrides; unspecified fields inherit from the previous breakpoint. The breakpoints follow the existing Gouno/Tailwind 640/768/1024/1280/1536 system. Row owns horizontal/vertical gutter composition and alignment/wrapping; Col owns its grid sizing and responsive CSS-variable projection.
- **Consequence:** reviewed completion continues family by family; reaching 100 for Avatar/Grid does not authorize pruning lower-priority Core families. The next Layout hardening target is Splitter, which must preserve the established Splitter family while resolving composition, controlled sizing, keyboard accessibility and compatibility before certification.
