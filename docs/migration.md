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

## Result terminal-state semantics

Canonical `Result` represents a completed/terminal result and recovery or next-step actions. It keeps a semantic `status`, but page heading level, surrounding Surface and announcement policy remain caller-owned.

Use the canonical `description` name rather than the historical `subTitle`. Embedded results default to an H2; a page-level 404/error result explicitly sets `headingLevel={1}`. `Result` owns its internal centered `p-8` result rhythm, so a Card used only as its outer boundary/elevation wrapper should use `padding="none"` rather than stacking another inset.

```tsx
<Card padding="none" variant="subtle">
  <Result
    status="info"
    headingLevel={1}
    title="页面未找到"
    description="你访问的地址不存在或已经移动。"
    extra={<Button>返回首页</Button>}
  />
</Card>
```

Static initial result pages are not forced into a live region. For a dynamic operation result that genuinely needs announcement, opt into standard ARIA semantics:

```tsx
<Result
  status="error"
  role="alert"
  title="保存失败"
  description="修改仍保留在当前页面。"
/>
```

Migrate touched call sites as follows:

```text
subTitle                              → description
fixed internal H2                    → default H2; page-level result uses headingLevel={1}
implicit role="status"               → explicit role/aria-live only when announcement is required
<Card><Result ... /></Card>           → <Card padding="none"><Result ... /></Card> when Result owns the content inset
```

Do not add a `subTitle` alias, custom status-color aliases, `variant`, `size`, or a Result-owned Card/elevation API. Status icons are decorative; semantic meaning remains in the visible title/description and the caller-selected ARIA role when needed.

## Skeleton structural loading semantics

Canonical `Skeleton` is a visual structural placeholder, not a loading-state or async-state component. Repeated Blog public and Blog Admin loading screens use groups of skeleton blocks to preserve layout while the containing region owns the actual loading state and accessible name. Gosso callback flows independently use `Spinner` for indeterminate task execution, confirming that these are different feedback responsibilities.

Individual Skeleton blocks are now decorative by default with `aria-hidden="true"`. Put `role="status"`, `aria-label`, `aria-live` or other state semantics on the parent region that can describe what is loading as one coherent unit:

```tsx
<div role="status" aria-label="文章列表加载中">
  <Skeleton className="h-7 w-4/5" />
  <Skeleton className="mt-3 h-4 w-full" />
</div>
```

Touched call sites normally need no visual migration. If a previous consumer intentionally exposed an individual Skeleton to assistive technology, it can explicitly use the standard `aria-hidden={false}` override, but this should be exceptional. Dimensions, shape and spacing remain normal `className` composition rather than a new `size`, `shape`, `avatar`, `paragraph` or preset API.

Reduced-motion behavior continues to be owned globally by `src/base.css`; do not duplicate a second Skeleton-specific motion policy.

## QRCode canvas and accessible-name semantics

Canonical `QRCode` renders a real canvas and now follows standard React/HTML accessibility and DOM-extension rules. The encoded value and renderer options remain the same narrow Core responsibility: `value`, `size`, `color`, `background` and `errorLevel`. `size` owns both canvas dimensions so consumers do not get a second `width`/`height` write path.

Accessible copy is product-owned and localized. Replace the historical non-standard prop with a standard ARIA naming path:

```text
ariaLabel="TOTP 设置二维码" → aria-label="TOTP 设置二维码"
```

`aria-labelledby` is equally valid when visible nearby text already names the image:

```tsx
<span id="mfa-qr-label">TOTP 设置二维码</span>
<QRCode
  value={otpauthUrl}
  size={180}
  aria-labelledby="mfa-qr-label"
/>
```

`QRCode` no longer invents the English accessible name `"QR code"`. Standard canvas attributes such as `id`, `data-*`, `className`, `style` and ARIA attributes pass through to the canvas, and `ref` resolves to the actual `HTMLCanvasElement`.

Do not add `ariaLabel` as a compatibility alias, and do not expand QRCode into status/refresh/icon/bordered/type workflows merely because mature QR libraries expose those features. Those capabilities require independent product evidence.

The real `gosso-admin` currently consumes `@gouno/ui` from `file:vendor/gouno-ui-0.1.0.tgz`. Its `MFAPanel` still uses `ariaLabel` because that immutable vendored artifact exposes the old type. Change the product call site to standard `aria-label` in the same change that refreshes the vendored Gouno UI artifact; changing only the product source first would intentionally create a type-incompatible half migration.

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

The product-validation reset and canonical renames are breaking changes for consumers that update to the next package artifact. Alert's primitive-to-high-level API correction is also breaking for consumers that used `variant="destructive|default"` as semantic colors. Empty hardening is behaviorally breaking for consumers that relied on its previous English default copy, implicit dashed surface or automatic `role="status"`. Result hardening is breaking for consumers that use `subTitle`, rely on its fixed H2 or automatic `role="status"`, or expect a padded parent Card to compose without a double inset. Skeleton hardening changes accessibility-tree behavior by hiding individual visual placeholders by default; parent loading regions should own any required status/name semantics. QRCode hardening is breaking for consumers that use `ariaLabel` or rely on the previous English default accessible name; migrate to standard `aria-label`/`aria-labelledby` together with the updated package artifact. Migrate those responsibilities explicitly as described above. Treat publication accordingly under SemVer/release notes. Existing products fixed to older immutable vendored archives can migrate page-by-page rather than mechanically replacing old wrappers with new ones.
