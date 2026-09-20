# Responsive Foundation Inventory

Status: certified; CSA-D001 re-certified `core-steps` on 2026-09-20.
Updated: 2026-09-20

## Canonical breakpoint authority

Gouno UI uses one responsive tier scale:

| tier | minimum width |
| --- | ---: |
| `sm` | 40rem / 640px |
| `md` | 48rem / 768px |
| `lg` | 64rem / 1024px |
| `xl` | 80rem / 1280px |
| `2xl` | 96rem / 1536px |

The Tailwind v4 breakpoint variables in `src/tokens.css` are the named authority. CSS media queries that cannot directly consume a custom-property breakpoint must mirror these exact rem values and are machine-guarded against drift.

## Confirmed defect

Core `Steps responsive={true}` was the only source/product responsive rule using an arbitrary variant:

`max-[531px]:flex-col max-[531px]:overflow-visible`

The public API and Showcase documentation only promised that horizontal Steps stack on narrow screens; they did not define 531/532px as a compatibility contract. No canonical product fixture currently uses Steps, so there is no product dependency on that hidden threshold.

Current Steps behavior uses canonical `md = 48rem` as the automatic stack threshold. Below `md`, the complete horizontal composition becomes vertical; at and above `md`, horizontal items retain a readable `min-w-44` track and the root `overflow-x-auto` owns constrained-container width pressure. This uses only canonical tiers and does not introduce an arbitrary breakpoint.

## Existing canonical consumers

The same scale governs:

- Row/Col responsive span/offset/order CSS;
- horizontal Form collapse below `md`;
- mobile minimum touch target treatment below `md`;
- standard Tailwind responsive composition in Core, Gouno, Patterns and product fixtures;
- responsive typography changes at `sm` / `md`.

Base CSS uses range media queries with the canonical rem values because CSS media conditions cannot consume runtime custom properties.

## Responsive behavior versus component sizing

Responsive Foundation owns **when composition changes because viewport/container space changes**. It does not redefine:

- `ControlSize`;
- named Spacing values;
- Density modes;
- product information hierarchy.

A component may expose `responsive={false}` to opt out of its documented automatic adaptation. That opt-out does not create a new breakpoint authority.

## Exceptions

Behavior-specific thresholds outside the canonical tier scale are not forbidden in principle, but they require all of:

1. a named product/component behavior reason;
2. durable inventory evidence;
3. a regression test at both sides of the threshold;
4. no equivalent canonical tier that satisfies the contract.

There are currently no admitted arbitrary responsive breakpoint exceptions in Core/Gouno/Product code.

## 2026-09-19 reopening — Steps composition geometry

FI-D001 showed that the original Responsive certification proved only the root axis switch. At widths below `sm`, a horizontal Steps root became `flex-col`, but the child item width/flex policy, title-placement layout and connector axis were still derived from the desktop `orientation="horizontal"` prop.

The same audit also exposed two non-responsive local geometry defects in the same owner:

- horizontal default connectors started at the marker and visually ran behind the title/copy lane;
- vertical dot connectors reused small/middle marker offsets instead of the dot marker's actual center.

The correction keeps the canonical breakpoint authority unchanged. At `max-sm`, the **entire** horizontal Steps composition switches to a vertical lane: full-width items, marker + copy in a row, and a connector centered under the marker. Above `sm`, horizontal title-inline Steps place the connector after title/subtitle copy; horizontal stacked-title Steps keep a marker-centered horizontal connector. Explicit vertical Steps use a marker-centered vertical connector, with dot-specific geometry.

This is therefore a Responsive component-implementation reopening, not a new breakpoint, Layout, Spacing or Sizing authority. Browser evidence must now validate connector/copy geometry on both sides of `sm`, not only `flex-direction`.

## Acceptance

Responsive can be certified only when:

1. the canonical tier scale is explicit and guarded;
2. Base CSS media widths match the same scale;
3. arbitrary `min-[...]:` / `max-[...]:` responsive variants are zero unless admitted;
4. Steps stacks below `sm` and remains horizontal above `sm`;
5. representative mobile/desktop product goldens remain stable;
6. Blog/Gosso reciprocal consumer parity passes.

Re-certification evidence (2026-09-19): CI #568 passed the expanded Responsive guard with zero arbitrary responsive variants and zero px-width media queries; Canonical Visual Golden Smoke #485 passed the strengthened Steps geometry/browser contract (60/60); Blog parity #546 and Gosso parity #541 passed.


## 2026-09-20 CSA-001 reopening — intermediate-width readability

CSA-001 added human-reviewable browser captures to the existing geometry assertions. The first capture exposed a gap that the previous FI-D001 proof did not cover: at a 700px viewport, responsive horizontal Steps had already crossed the `sm` threshold and returned to a four-column horizontal lane. The geometry remained mathematically valid, but the second title rendered as `S...` and the copy lane became visibly cramped.

Classification: **local Responsive implementation defect in `core-steps`**. The canonical breakpoint scale remains correct; no arbitrary breakpoint is introduced.

Correction target:

- below canonical `md` (48rem / 768px), the complete horizontal Steps composition stays in the vertical responsive lane;
- at `md` and above, horizontal Steps use the desktop inline connector/copy composition;
- explicit vertical Steps and `responsive={false}` keep their existing semantics;
- visual evidence must separately show mobile/intermediate stacking, desktop inline layout, and vertical-dot geometry.

Responsive is reopened only for `core-steps` until exact-head CI, Canonical Visual Golden, Blog Consumer Parity, Gosso Admin Consumer Parity, and manual screenshot review all pass.


### CSA-D001 resolution / re-certification

The final correction supersedes the earlier `sm` Steps threshold for current behavior:

- below canonical `md` (48rem / 768px), the entire responsive Steps composition remains vertical;
- at and above `md`, horizontal items keep a readable `min-w-44` track;
- when an AppShell/sidebar or other container leaves less horizontal space than the track set requires, the Steps root owns horizontal overflow rather than truncating ordinary titles;
- explicit vertical Steps and `responsive={false}` are unchanged.

Human review accepted the exact-head rendered evidence for 700px stacked layout, 800px horizontal layout, 1024px AppShell-constrained horizontal overflow, vertical-dot geometry, and the related Focus evidence.

Re-certification evidence:

- CI run `35500169813` — success;
- Canonical Visual Golden Smoke run `35500170014` — success;
- Golden artifact `10601014647` — manually reviewed;
- Blog Consumer Parity run `35500169770` — success;
- Gosso Admin Consumer Parity run `35500169802` — success.

Responsive is re-certified. The canonical breakpoint scale itself was never changed by CSA-D001.
