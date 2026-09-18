# Responsive Foundation Inventory

Status: FI-001 Phase 4 working inventory.
Updated: 2026-09-18

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

## Acceptance

Responsive can be certified only when:

1. the canonical tier scale is explicit and guarded;
2. Base CSS media widths match the same scale;
3. arbitrary `min-[...]:` / `max-[...]:` responsive variants are zero unless admitted;
4. Steps stacks below `sm` and remains horizontal above `sm`;
5. representative mobile/desktop product goldens remain stable;
6. Blog/Gosso reciprocal consumer parity passes.
