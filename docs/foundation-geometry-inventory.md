# Foundation Geometry Inventory

Status: active under FI-001 Foundation Integrity Program.

This inventory records Foundation-level geometry authority. It is not a ban on Tailwind spacing or sizing utilities. A local utility is a defect only when it creates a second authority for a semantic contract that should be canonical.

## Page track

Canonical application-page geometry is owned by:

- `--layout-page-max-width`
- `--layout-page-gap`
- `.layout-page-container`
- `PageContainer`

`PageContainer` must consume the semantic page track and must not independently encode its canonical maximum width or page-stack gap.

The previous state encoded `max-w-[1440px]` and `gap-6` directly in `PageContainer` while Theme also exposed an unrelated `--content-width: 1200px`. The canonical page behavior is now preserved at 1440px / 24px but has one named authority.

`--content-width` and `--reading-width` are not aliases for the application page track. They remain separate content/reading concepts until their own consumers are audited.

## Named spacing scale

Generic layout helpers share one named scale:

| name | value |
| --- | ---: |
| `xs` | 4px |
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |
| `xl` | 24px |

The scale is owned by `--space-*` tokens and `.gap-space-*` utilities.

Current consumers:

- `Space`
- `Flex`
- `Grid`

Before FI-001 Phase 2, `Space` and `Flex` mapped `md` to 12px / `lg` to 16px, while `Grid` mapped the same names to 16px / 24px. That ambiguity is removed.

Numeric `gap` remains an explicit precision escape hatch. It does not redefine the named scale.

## Sizing inventory

The existing generic form-control baseline is `ControlSize = small | middle | large`, with outer target heights:

- small: 32px
- middle: 36px
- large: 44px

`controlSizeClass` owns those heights for standard form controls.

The inventory found a real divergence: public `Button size="large"` resolved to 40px while `controlSizeClass("large")` and InputOTP resolved to 44px. Sizing is therefore reopened.

The canonical scale is now owned by `--control-height-small/middle/large`. Standard controls consume `controlSizeClass`; Button reuses `ControlSize`; InputOTP derives square cells from the same heights; Segmented derives its inner label height by subtracting the 4px total track inset. The resulting outer geometry remains 32 / 36 / 44px across these families.

Consumers reference those variables through Tailwind-recognized height/size utilities such as `h-[var(--control-height-middle)]` and `size-[var(--control-height-middle)]`. This is intentional: caller overrides such as `h-auto` must remain in the same Tailwind Merge conflict group. Bespoke classes like `control-height-middle` are forbidden because they can coexist with `h-auto` and silently win in CSS order, collapsing auto-height compound controls.

Different internal classes are acceptable only when they are mathematically derived from the same outer ControlSize authority and preserve normal caller override semantics.

## Border inventory

The Border audit found no arbitrary numeric 1px/2px product widths, no `border-4/8` geometry, and no hard-coded neutral border colors in the canonical product corpus. Ordinary surfaces already converge on the semantic `--border` color because `base.css` assigns that token as the default border color.

The actual split-authority risk was **2px emphasis width**. Before FI-001, several independent sites encoded `border-2`, `border-b-2` or `border-l-2` directly:

- Spinner ring;
- Timeline marker;
- Steps active navigation indicator;
- Table summary separator;
- Showcase DemoSection active tab indicator;
- Markdown blockquote lead;
- Blog Admin selected-record lead.

Those sites now resolve through `--border-width-emphasis: 2px` and semantic emphasis utilities. Directional emphasis uses logical block/inline directions, so selected/quote leads no longer assume a physical left side.

The ordinary 1px boundary stays intentionally compatible with Tailwind's standard `border` / directional `border-*` / `divide-*` substrate. `--border-width-boundary: 1px` records the Gouno invariant, while guards reject wider numeric/ad-hoc product borders. This avoids a mechanical rewrite of every ordinary boundary into a duplicate Gouno-specific alias.

Timeline's caller-owned dynamic item color remains an explicit color API exception; it does not own border width.

## Density inventory

The audit confirmed a functional defect rather than a naming-only inconsistency. `ThemeProvider` publicly exposes `Density = comfortable | compact` and writes it to `documentElement.dataset.density`, while the canonical Theme Showcase describes it as global interaction density. Before FI-001, no root density selector consumed that value, so changing the global density had no visual effect.

Table already owns a separate component-local vocabulary, `default | compact | touch`. These vocabularies serve different layers and are intentionally retained:

- Theme `comfortable | compact` is the application-level default policy.
- Table `default` inherits that policy.
- Table `compact | touch` are explicit local overrides.

Density does **not** redefine ControlSize or the named spacing scale. Table's stable geometry is owned by `--table-density-*` tokens, while CSS resolves the active policy from the root Theme density plus the Table's local `data-density` state. The Table implementation therefore no longer carries duplicate `density === ...` padding/height utility branches.

The comfortable baseline preserves the previous default Table geometry: 16px inline / 12px block cell padding, 40px header height, 48px footer height and 24px bordered edge inset. Compact remains 12px / 8px with 36px header, 40px footer and 16px edge inset. Touch remains a deliberate local mode with 16px block/inline cell padding, 48px header, 56px footer and 24px edge inset.

Product fixtures may select density through public component APIs but may not write the Foundation's `data-density` hook directly.

## Radius inventory

The Radius audit confirmed a split numeric authority: `--radius-md`, `--radius` and `--radius-control` all independently encoded 6px even though default control surfaces already resolved through the medium radius path.

The canonical numeric authority is now the Theme radius scale:

- `--radius-sm: 4px`
- `--radius-md: 6px`
- `--radius-lg: 10px`
- `--radius-xl: 10px`

`--radius` and `--radius-control` remain compatibility/semantic aliases, but both resolve to `var(--radius-md)` and therefore no longer own numeric values. Existing `rounded-md` consumers remain correct and do not need mechanical replacement.

The audit also found one real Core bypass: Checkbox encoded `rounded-[4px]` even though the semantic small radius already exists. Checkbox now consumes `rounded-sm` with no visual geometry change.

Arbitrary radii are not globally forbidden. The Tooltip arrow keeps `rounded-[2px]` as an explicit local shape exception: it is a rotated arrow primitive, not a control or surface radius contract. Product fixtures may not introduce arbitrary `rounded-[...]` values; new Foundation/Core exceptions require inventory review.

## Audit rules

1. Preserve resolved geometry unless a design-language correction explicitly requires a visual change.
2. Prefer semantic Foundation tokens for public named scales and canonical application structure.
3. Do not replace every local spacing utility mechanically.
4. Compound components own structural spacing; business content owns internal content rhythm.
5. Reopen affected component reviews before changing a previously certified Foundation contract.
6. Add static/runtime guards before recertifying a gate.
7. Consumer parity and visual evidence are required before a workstream is certified.
