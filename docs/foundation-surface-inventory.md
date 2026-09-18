# Surface Foundation Inventory

Status: FI-001 Phase 3 working inventory.
Updated: 2026-09-18

## Canonical authority

Surface answers **what kind of bounded visual region this is**. It is distinct from:

- Color, which owns semantic tones such as `canvas`, `card`, `raised`, `popover` and `muted`;
- Border, which owns boundary width/color roles;
- Elevation, which owns depth roles such as `surface`, `raised`, `overlay` and `modal`;
- Spacing, which owns named layout rhythm.

A canonical Surface composes those Foundations through an owning component rather than asking product pages to reproduce the bundle.

The primary persistent business-surface owners are:

- `Card variant="default"` — normal bounded level-1 content surface;
- `Card variant="subtle"` — low-emphasis grouped region;
- `Card variant="elevated"` — audited raised/focal surface;
- bordered `Table` — collection surface with its own boundary/elevation contract;
- overlay/modal primitives — transient surfaces owned by Popover/Dialog/Sheet/etc.

## Confirmed defect

Gosso Overview Quick Links were semantic links but manually reproduced the complete default Card surface:

- radius;
- border;
- `bg-card`;
- card foreground;
- `shadow-surface`;
- interactive hover lift to `shadow-raised`.

That made a product fixture a second authority for the canonical level-1 surface treatment.

The remediation keeps the semantic `<a>` as the navigation/focus owner and places `Card interactive padding="none"` inside it as the visual Surface owner. No new `LinkCard` abstraction is admitted and Card's public host API is not widened merely for this one composition.

## Nested region classification

Not every `rounded + border + bg-*` rectangle is a top-level Surface.

The following remain valid local composition when they do **not** claim a separate surface/elevation level:

- border-only lists inside an existing Card;
- neutral/subtle grouped fields;
- previews and generated-media frames;
- small icon wells;
- code/value boxes;
- local state tint on an owning Card/Table row.

These regions must not gain `shadow-surface`, `shadow-raised`, `shadow-overlay` or `shadow-modal` in product code.

## Corpus policy

Canonical product fixtures may:

- choose Core surface variants;
- tune content layout inside a Surface;
- apply semantic state tint/border to an already-owned Surface;
- use border-only/subtle nested grouping.

Canonical product fixtures may not:

- reproduce Core surface depth through direct semantic shadow utilities;
- copy the full default Card treatment as page-local `rounded + border + bg-card + shadow-surface`;
- create a persistent raised surface without the Elevation whitelist;
- treat `sticky`, `fixed` or `absolute` positioning as evidence for a new Surface layer.

## Acceptance

Surface can be certified only when:

1. Card/Table/transient-layer owners still expose the canonical anatomy.
2. Gosso Overview Quick Links consume `Card interactive` rather than manual surface classes.
3. Product semantic-shadow bypasses are zero.
4. The corpus guard does not falsely outlaw legitimate nested border-only/subtle regions.
5. Canonical visual goldens and reciprocal Blog/Gosso consumer parity pass after the ownership migration.
