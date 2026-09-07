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
