# Admin Data Composition Contracts

These contracts standardize recurring Blog Admin / Gosso Admin page composition without introducing public page-level runtime components.

They are **composition contracts**: reusable design decisions, ordering rules, ownership boundaries, state placement and responsive behavior. Product code keeps its own data, routing, permissions and business state.

## Contract family

```text
Admin Data Composition
├─ Collection
├─ Record Detail
├─ Master-Detail
├─ Settings
└─ Data Summary
```

The canonical Showcase lives under `Patterns → Composition Contracts`.

## 1. Collection

Use for searchable/filterable collections such as Blog Posts / Pages / Categories and Gosso Users / Clients / Audit Logs.

Canonical order:

```text
Page or Panel Lead
        ↓
Collection Feedback?
        ↓
Collection Summary?
        ↓
Collection Toolbar
├─ Search
├─ Filters
├─ View controls?
└─ Result count / secondary actions?
        ↓
Selection Context / Bulk Action?
        ↓
Data View
├─ Table
├─ List
└─ Grid
        ↓
Pagination?
```

Rules:

- The collection owns search, filters, view state, result count and pagination.
- Table/List/Grid renders data; it does not own page-level filters.
- Empty replaces the Data View while keeping collection identity and relevant toolbar context.
- Loading keeps the outer composition stable when filters or route identity remain meaningful.
- Page-level read failure appears before the toolbar/data view and must not render stale editable data.
- Pagination belongs to the collection, not to an arbitrary Card or table row.
- Bulk actions belong to current selection context, not the ordinary toolbar; when present they sit between the ordinary toolbar and the data view they act on.
- Responsive Table → List/Card adaptation may change the renderer, not the semantic order.

Corpus evidence:
- Blog Admin Posts / Pages / Categories
- Gosso Admin Users / OAuth2 Clients / Audit Logs

## 2. Record Detail

Use when one selected record becomes the primary reading/action context without entering an editor.

Canonical order:

```text
Record Identity
├─ Back / parent context?
├─ Title
├─ Status
└─ Primary actions?
        ↓
Record Feedback?
        ↓
Record Summary / Facts
        ↓
Record Sections
├─ Evidence / attributes
├─ Related resources
└─ Activity / history?
        ↓
Local destructive / privileged actions?
```

Rules:

- Record identity appears once.
- Facts and metrics must not masquerade as a second page header.
- Related data is grouped by semantic ownership, not by visual convenience.
- Record-wide feedback appears before record sections.
- Operation-specific feedback stays with the local operation.
- Destructive confirmation remains Modal even when the record detail is full width.

Corpus evidence:
- AI Operations Workflow Detail
- Workflow Run / Agent Run evidence
- Gosso Audit Event detail

## 3. Master-Detail

Use only when keeping peer context visible materially improves repeated inspection or processing.

Canonical order:

```text
Panel Lead
        ↓
Panel Feedback?
        ↓
Master-Detail Frame
├─ Master
│  ├─ Search / filter?
│  └─ Peer list / queue
└─ Detail
   ├─ Selected identity
   ├─ Selected feedback?
   └─ Selected content
```

Rules:

- Follow PI-06: master-detail is a task pattern, not a generic list/detail default.
- The master owns peer navigation; the detail owns the selected record.
- Do not duplicate the selected record title in both the panel lead and detail identity.
- Master and detail may have independent inner scrolling only when the task requires continuous peer switching and the scroll ownership is explicit.
- On narrow viewports, collapse to one active pane with an explicit return path to the master.
- If the detail becomes a deep management task, use list → dedicated detail instead.

Corpus evidence:
- AI Operations 待我处理
- AI Operations 运行中心

## 4. Settings

Use for persistent product/account configuration grouped into semantic sections.

Canonical order:

```text
Page Header
        ↓
Tabs? / Settings navigation
        ↓
Active Panel Lead
        ↓
Panel Feedback?
        ↓
Settings Sections
├─ Section identity
├─ Fields
└─ Local help / local feedback?
        ↓
Save / Apply boundary
```

Rules:

- Tabs name the settings domain; the panel lead adds context and must not echo the tab name as another title.
- Page- or panel-wide feedback appears before editable sections.
- One settings section owns its internal field spacing.
- Save actions belong to the settings task boundary, not to individual fields.
- Sticky save actions are allowed only when the settings body is long enough to justify persistent commit controls.
- Loading/error/empty states preserve the same outer panel grammar when route identity remains.

Corpus evidence:
- Blog Admin Site Settings
- Gosso Admin Account Settings
- Blog Admin AI Settings

## 5. Data Summary

Use for compact decision-oriented metrics that summarize a larger data/task context.

Canonical order:

```text
Summary Context
        ↓
Metric Group
├─ Metric label
├─ Primary value
└─ Supporting detail / status
        ↓
Breakdown / trend? 
```

Rules:

- A summary is not a decorative KPI strip; every metric must answer a decision or status question.
- Metrics in one group share geometry, label hierarchy and value alignment.
- Summary belongs before the detailed data it summarizes.
- Avoid mixing unrelated business domains in one metric group.
- Status/attention counts should use semantic meaning, not color alone.
- Responsive collapse preserves metric reading order.
- A Data Summary may be absent; do not reserve an empty region merely for visual symmetry.

Corpus evidence:
- AI Operations overview summary
- Workflow asset summary and Workflow detail metrics
- Blog Admin Dashboard status summaries

## Ownership principle

The central rule is:

> The semantic owner controls spacing and state placement.

Examples:

- Collection owns Toolbar → Data View → Pagination spacing.
- Settings Panel owns Lead → Feedback → Sections spacing.
- Master owns peer navigation; Detail owns record sections.
- Data Summary owns metric-to-metric rhythm.
- Child components do not compensate for missing parent spacing with arbitrary margins.

## Public API admission

These contracts are intentionally Showcase-only.

Do not create public `CollectionPage`, `RecordDetail`, `MasterDetail`, `SettingsPage` or `DataSummary` components merely because the composition repeats.

A public runtime abstraction requires separate Rule-of-Three evidence proving shared **runtime behavior**, not just shared layout grammar.
