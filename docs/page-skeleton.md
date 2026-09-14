# PageSkeleton Contract

Status: accepted Gouno product-family presentation policy (PD-076, 2026-09-14).

## Why this is Gouno

`PageSkeleton` belongs to `@gouno/ui/gouno`, not Core or Patterns. It expresses stable page-level presentation policy shared by Gouno products: how an unresolved **initial page data region** preserves a recognizable collection, form/settings, or dashboard silhouette. It is not a product-agnostic primitive and it does not coordinate an interaction lifecycle.

Core continues to own the visual `Skeleton` blocks. Products continue to own data fetching, refresh, error, empty, authorization, retry and mutation state. Patterns continue to be reserved for admitted reusable compound interactions.

## Evidence

The completed real-product corpora independently contain the same page-data loading responsibility:

- Gosso Admin has product-local `SystemCollectionLoading`, `SiteSettingsLoading` and `SystemStatusLoading` compositions, while mutations and refresh actions still use control-level busy state.
- Blog Admin has collection/dashboard loading compositions such as Members and Dashboard while buttons own their own mutation/refresh loading state.
- Blog public uses structural page loading for predictable content such as Home and reading/list surfaces.

Ant Design Pro's page-shaped Skeleton family is supporting prior art only. It confirms that page anatomy can be a useful loading abstraction, but Gouno's public contract is derived from its own products and remains intentionally smaller.

## Public contract

```tsx
import { PageSkeleton } from "@gouno/ui/gouno";

<PageSkeleton layout="collection" aria-label="成员列表加载中" />
<PageSkeleton layout="form" aria-label="站点设置加载中" />
<PageSkeleton layout="dashboard" aria-label="数据概览加载中" />
```

The admitted layouts are exactly:

- `collection` — responsive desktop collection/table silhouette plus mobile collection cards and optional pagination geometry.
- `form` — ordinary settings/form field geometry and action footer.
- `dashboard` — statistic cards plus larger read-dominant content sections.

The first public API intentionally exposes only small geometry controls: `rows`, `columns`, `pagination`, `fields`, `statistics` and `sections`. These are presentation hints, not business schema.

## Loading ownership

`PageSkeleton` does **not** accept `loading`, `data`, `error`, `empty`, `retry`, request promises or mutation callbacks. The product decides whether the state is initial loading and renders the skeleton explicitly:

```tsx
<PageHeader title="成员与权限" />
{initialLoading ? (
  <PageSkeleton layout="collection" aria-label="成员目录加载中" />
) : (
  <MembersContent />
)}
```

Stable route chrome, `PageHeader`, route-family Tabs and already-known structure remain visible outside the skeleton whenever the product already knows them.

If useful data is already rendered and a refresh starts, keep that data visible. Mark the affected region busy when appropriate and use the initiating control's loading/disabled state instead of replacing the page with `PageSkeleton`.

Independent data islands may still own smaller local structural skeletons. A dashboard does not need to block every section behind one page skeleton when its data sources resolve independently.

## Accessibility

`PageSkeleton` owns one named loading region:

- `role="status"`
- `aria-live="polite"`
- `aria-busy="true"`
- required localized `aria-label`

The nested Core `Skeleton` blocks remain decorative and hidden from the accessibility tree. Callers cannot create a second `role` / `aria-live` / `aria-busy` write path through `PageSkeleton` props.

## Scope boundary

PD-076 does **not** re-admit Legacy `AsyncState`, `LoadingState`, `DataTable`, `ResponsiveList` or a universal page loader. It also does not admit editor, article/reading, media-workspace, AI-workspace or authentication skeleton types. Those shapes remain product-local until independent evidence proves another stable page-family contract.

Showcase React lazy-chunk loading is a separate infrastructure concern and uses a private lightweight Spinner fallback rather than `PageSkeleton`.

## Validation

Admission requires:

- canonical runtime/type export from `@gouno/ui/gouno`;
- same-source Gouno Showcase examples for all three layouts;
- focused accessibility/layout tests;
- representative product-fixture dogfooding without forcing mismatched pages into the abstraction;
- exact-main typecheck, complete tests, package build, Showcase build and Pages publication.
