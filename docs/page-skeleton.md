# PageSkeleton Contract

Status: accepted Gouno product-family presentation policy (PD-076, revised 2026-09-14).

## Why this is Gouno

`PageSkeleton` belongs to `@gouno/ui/gouno`, not Core or Patterns. It provides a small set of low-fidelity page silhouettes shared by Gouno products so loading feels like the destination page is already taking shape.

It is intentionally not a page schema, DataTable contract or async-state coordinator. Core continues to own the visual `Skeleton` blocks. Products continue to own data fetching, refresh, error, empty, authorization, retry and mutation state.

## Design principle

The skeleton should be recognizably similar to the destination page, not structurally exact.

Gouno admits exactly three common presets:

- `collection` — generic table/list geometry plus optional pagination.
- `form` — generic field geometry and an action footer.
- `dashboard` — generic statistic cards plus larger content blocks.

The preset does not know product field names, filter definitions, toolbar actions, table headings, data keys or responsive business rules. Those details belong to the real page.

Shared application chrome such as the Showcase workspace shell can remain visible while a page loads. Inside the page region, callers may replace the whole unresolved surface with a preset skeleton instead of preserving every already-known header, filter or table heading.

## Public contract

```tsx
import { PageSkeleton } from "@gouno/ui/gouno";

<PageSkeleton layout="collection" aria-label="成员列表加载中" />
<PageSkeleton layout="form" aria-label="站点设置加载中" />
<PageSkeleton layout="dashboard" aria-label="数据概览加载中" />
```

Optional geometry controls stay deliberately small:

- `collection`: `rows`, `columns`, `pagination`
- `form`: `fields`
- `dashboard`: `statistics`, `sections`

They tune the rough silhouette only. They must not grow into business metadata. In particular, `PageSkeleton` does not accept real column headings or product-owned column definitions.

## Loading ownership

`PageSkeleton` does not accept `loading`, `data`, `error`, `empty`, `retry`, promises or mutation callbacks.

Products decide when a skeleton is appropriate and render it explicitly. Typical uses include both unresolved initial data and route/chunk fallbacks when the destination page family is already known:

```tsx
<Suspense fallback={<PageSkeleton layout="collection" aria-label="页面加载中" />}>
  <MembersPage />
</Suspense>
```

If useful data is already visible and a same-query refresh starts, keep that data visible and let the initiating control own loading state rather than replacing useful content with a page skeleton.

Specialized surfaces such as editors, article readers, media workspaces, authentication flows or AI workspaces can keep local loading UI when the three presets are a poor visual fit.

## Accessibility

`PageSkeleton` owns one named loading region:

- `role="status"`
- `aria-live="polite"`
- `aria-busy="true"`
- required localized `aria-label`

All placeholder geometry inside the region is decorative and hidden from the accessibility tree.

## Product dogfooding

Representative product fixtures validate the three layouts without teaching `PageSkeleton` product semantics:

- **collection — Gosso Admin Audit Logs:** generic collection geometry.
- **form — Gosso Admin Account Settings / Profile:** generic settings-form geometry.
- **dashboard — Gosso Admin System Status:** generic dashboard geometry.

Blog Admin collection/dashboard fixtures and Showcase route fallbacks should use the same presets where the visual family is clear. Specialized loaders remain local when the preset would be misleading.

## Scope boundary

PD-076 does not re-admit Legacy `AsyncState`, `LoadingState`, `DataTable`, `ResponsiveList` or a universal page loader. It also does not admit editor, article/reading, media-workspace, AI-workspace or authentication skeleton types.

The goal is deliberately modest: three good fake-page silhouettes are preferable to a skeleton framework that tries to model the destination page exactly.

## Validation

Changes require:

- canonical runtime/type export from `@gouno/ui/gouno`;
- same-source Gouno Showcase examples for all three layouts;
- focused accessibility/layout tests;
- representative product-fixture dogfooding;
- exact-main typecheck, complete tests, package build, Showcase build and Pages publication.
