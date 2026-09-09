# Migration guide

The package has four formal public owners: `@gouno/ui/core`, `@gouno/ui/theme`, `@gouno/ui/patterns`, `@gouno/ui/gouno`. `src/legacy` is not public API and has no import path.

## Root compatibility umbrella

`@gouno/ui` remains available for existing consumers but is not a fifth owner. New code should prefer canonical formal entry points. Gouno UI implementation and Showcase must not depend on the root umbrella.

## Product-validation reset

Pre-validation Pattern/Gouno implementations were removed from canonical public entries and preserved only as source snapshots under `src/legacy`. Do not import Legacy. When a real page needs similar behavior, rebuild Core-first and run `docs/product-driven-development.md` admission.

Typical quarantined historical concepts include DataTable, Toast orchestration, Feedback/AsyncState, ConfirmDialog, BulkActionBar, SectionNav, Panel families, status tags and page templates.

## Gouno structure migrations

```text
AdminShell → AppShell
AdminPage  → PageContainer
```

`PageHeader` has since been re-admitted from fresh cross-product evidence, but with a smaller canonical contract:

```tsx
<PageHeader
  title="OAuth2 客户端"
  description="管理客户端注册与授权配置。"
  actions={<Button>注册客户端</Button>}
/>
```

Historical `action`/`actions` synonyms are not restored. Use `actions` only. `ActionGroup`, `FilterBar`, `TableContainer` and the rest of the old page utility bundle remain non-canonical.

## Tabs high-level API alignment

Canonical Tabs uses mature high-level naming while retaining Radix-backed behavior/composition:

```tsx
<Tabs
  activeKey={activeKey}
  defaultActiveKey="profile"
  items={[
    { key: "profile", label: "Profile" },
    { key: "security", label: "Security" },
  ]}
  onChange={setActiveKey}
/>
```

Migrate pre-reset call sites as touched:

```text
value              → activeKey
defaultValue       → defaultActiveKey
items[].value      → items[].key
onValueChange      → onChange
```

`type="line"` is default; `type="card"` is explicit. `size` uses `small/middle/large`; `tabPosition` uses `top/right/bottom/left`.

Pre-reset `value/defaultValue/items[].value` input is temporarily accepted only during this migration sequence. It is not a second canonical API and must be removed before the next stable package release.

For custom composition, use `Tabs` with `TabList`, `Tab`, `TabPanel`; do not create another active-state write path.

## Alert high-level API alignment

Alert no longer exposes the underlying shadcn primitive contract as public API. Semantic status and visual form are separate:

```tsx
<Alert
  type="warning"
  showIcon
  title="High privilege scope"
  description="Only assign admin to trusted clients."
/>
```

Migrate old primitive-style call sites:

```text
variant="destructive" → type="error"
variant="default"     → type="info" (or the actual success/warning semantic)
```

`variant` now means only `outlined | filled`. The canonical high-level surface follows current Ant Design semantics: `title`, `description`, `type`, `showIcon`, `icon`, `action`, `closable`, `banner`, `variant`, `classNames`, `styles`, plus `Alert.ErrorBoundary`.

The current Ant Design aliases that are already deprecated there are deliberately not introduced here: `message`, top-level `onClose`, `afterClose`, `closeIcon`, and `closeText`. Put close lifecycle/configuration under `closable` instead:

```tsx
<Alert
  title="Closable"
  closable={{
    "aria-label": "Dismiss alert",
    onClose: () => console.log("closing"),
    afterClose: () => console.log("closed"),
  }}
/>
```

`children` remains a standard React composition slot for additional custom body content after `title/description`; it is not a second title write path.

## Empty content and surface ownership

Canonical `Empty` is a ground-level empty-state content block, not a Card replacement or an automatic live region. Product evidence across Gosso Admin, Blog Admin and the public Blog converged on four stable slots only: caller-owned `title`, optional `description`, optional `icon` and optional `action`.

The component therefore no longer invents the English `"No data"` message, a dashed/rounded border, or `role="status"`. Surface boundaries belong to the surrounding Card/Table/List/route composition. Standard div/ARIA attributes remain available when a particular product state needs them.

```tsx
<Card padding="lg">
  <Empty
    title="没有匹配结果"
    description="调整筛选条件后重试。"
    action={<Button>清除筛选</Button>}
  />
</Card>
```

For a dynamically replaced result that genuinely needs assistive-technology announcement, opt in explicitly:

```tsx
<Empty
  role="status"
  aria-live="polite"
  title="没有匹配结果"
/>
```

Migrate touched call sites as follows:

```text
<Empty /> relying on "No data"        → provide product-local title/description
Empty's implicit dashed border        → let the surrounding semantic surface own its boundary
Empty's implicit role="status"        → add role/aria-live only for states that should be announced
```

Do not add `variant`, `bordered`, product copy presets or a second live-region convenience prop merely to recreate the old defaults.

## DataTable status

System Management plus Blog Admin list-page prior art is enough to trigger DataTable review, but not enough to re-admit the historical feature-bag API. Current migrations use Core `Table`/`Pagination` plus product-local filter/action/state composition. See PD-012.

## Curated subpaths

```ts
import { Alert, Button, Table, Pagination, Tabs } from "@gouno/ui/core";
import { ThemeProvider, ThemeToggle } from "@gouno/ui/theme";
import { AppShell, PageContainer, PageHeader } from "@gouno/ui/gouno";
```

Do not use source wildcard or Legacy paths.

## Showcase meaning

Product workspace navigation represents real migration only. Gouno UI workspace documents canonical APIs only. Showcase-local documentation utilities are not public-abstraction evidence by themselves; see PD-009.

Standalone product fixtures may add Showcase-only navigation chrome around the real page surface. That navigation is tooling and must not be promoted into `AppShell` or authentication product API merely because it is useful inside the documentation environment.

## Compatibility assessment

The product-validation reset and canonical renames are breaking changes for consumers that update to the next package artifact. Alert's primitive-to-high-level API correction is also breaking for consumers that used `variant="destructive|default"` as semantic colors. Empty hardening is behaviorally breaking for consumers that relied on its previous English default copy, implicit dashed surface or automatic `role="status"`; migrate those responsibilities explicitly as described above. Treat publication accordingly under SemVer/release notes. Existing products fixed to older immutable vendored archives can migrate page-by-page rather than mechanically replacing old wrappers with new ones.
