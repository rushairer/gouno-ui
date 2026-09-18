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

The canonical scale is now owned by `--control-height-small/middle/large` and semantic height/square/inset utilities. Standard controls consume `controlSizeClass`; Button reuses `ControlSize`; InputOTP derives square cells from the same heights; Segmented derives its inner label height by subtracting the 4px total track inset. The resulting outer geometry remains 32 / 36 / 44px across these families.

Different internal classes are acceptable only when they are mathematically derived from the same outer ControlSize authority.

## Radius inventory

Current control surfaces predominantly use the medium radius path (`rounded-md` / 6px). `--radius-control` is also 6px and currently has a narrower explicit consumer in base control styling.

This is a split authority candidate, not yet a certified defect. Radius work must determine whether `radius-control` is the intended semantic owner and, if so, migrate controls without changing established geometry accidentally.

## Audit rules

1. Preserve resolved geometry unless a design-language correction explicitly requires a visual change.
2. Prefer semantic Foundation tokens for public named scales and canonical application structure.
3. Do not replace every local spacing utility mechanically.
4. Compound components own structural spacing; business content owns internal content rhythm.
5. Reopen affected component reviews before changing a previously certified Foundation contract.
6. Add static/runtime guards before recertifying a gate.
7. Consumer parity and visual evidence are required before a workstream is certified.
