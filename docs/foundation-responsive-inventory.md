# Responsive Foundation Inventory

Status: FI-001 Phase 4 certified inventory.
Updated: 2026-09-19

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

Steps now uses `max-sm`. This makes the public responsive behavior resolve through the same `sm = 40rem` Foundation tier used elsewhere.

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
