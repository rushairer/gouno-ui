# Focus Foundation Inventory

Status: FI-001 Phase 4 working inventory.
Updated: 2026-09-18

## Problem statement

Focus is a system-level interaction contract. A component may choose where focus lands, but it must not invent its own focus-indicator geometry.

The current repository has three overlapping authorities:

1. `src/base.css` provides a global `:focus-visible` fallback using a 2px outline with a 3px offset.
2. Most reviewed Core components independently encode `focus-visible:ring-2`, with optional ring offsets.
3. Several Radix/shadcn-derived primitives independently encode a 3px ring, focus border and outline combination.

That split means reviewed components can remain visually inconsistent even when each component is individually accessible.

## Read-only audit evidence

Repository code search on the 2026-09-18 Motion-certified baseline found:

- 45 files containing explicit `focus-visible` styling.
- 28 captured `focus-visible:ring-2` occurrences.
- 9 captured `focus-visible:ring-[3px]` occurrences.
- 8 captured `focus-visible:ring-offset-2` occurrences.
- composite-control `focus-within` ring ownership in DatePicker, Upload, Select, InputNumber and Image.
- Dialog and Sheet close controls using `focus:` ring behavior instead of `focus-visible:`.
- a product Showcase Quick Link anchor directly owning ring geometry.

These counts are inventory evidence, not the final acceptance metric. The Foundation guard will compute the corpus metric after remediation.

## Confirmed defects

### Split 2px / 3px focus geometry

Core controls predominantly use 2px rings while primitive Button/Input/Tabs/Select/Textarea/Checkbox/Radio/Switch/Badge use 3px rings. Focus thickness is therefore dependent on implementation family instead of design-system policy.

### Pointer focus leaks on modal close controls

Dialog and Sheet close buttons use `focus:ring-2` rather than `focus-visible:ring-2`. Pointer activation can therefore display keyboard-focus treatment.

### Global fallback and owned focus geometry are not bound

The global fallback outline and component-owned ring geometry encode their numeric values independently. A later change can drift one without failing the other.

### Product composition can own raw focus metrics

The Gosso Overview Quick Link anchor directly encodes ring width/offset instead of selecting a named Focus role.

## Canonical Focus roles

Focus Foundation will own four semantic roles:

- **fallback** — global visible focus for unowned/native focusables.
- **control** — normal buttons, fields, menu items and compact interactive controls.
- **standalone** — floating controls or clickable surfaces that need separation from surrounding pixels.
- **inset** — dense grid/cell interactions where an outward indicator would clip or disturb adjacent geometry.
- **within** — composite controls whose owning container receives focus treatment when a child is focused.

The role chooses geometry. Component state may still choose semantic border/color feedback, but must not choose ring thickness or offset.

## Authority target

The canonical geometry authority will live in `src/tokens.css` as named Focus utilities and in the global fallback rule in `src/base.css`.

Core, Gouno, Patterns and product Showcase code must not directly encode:

- `focus-visible:ring-2`;
- `focus-visible:ring-[3px]`;
- `focus-visible:ring-offset-2`;
- `focus:ring-*` for ordinary visible-focus behavior;
- `focus-within:ring-2` outside the semantic within role.

Local ring **color** remains legal when it represents a semantic validation/action state; geometry does not.

## Acceptance

Focus can be certified only when:

1. one named semantic vocabulary owns focus geometry;
2. the global fallback and owned Focus roles agree on the canonical thickness;
3. Dialog/Sheet close affordances use visible-focus semantics rather than generic focus;
4. raw focus-geometry bypasses are zero in Core/Gouno/Patterns/product Showcase;
5. focused controls retain keyboard visibility in browser evidence;
6. canonical visual Golden smoke passes;
7. reciprocal Blog and Gosso consumer parity passes.
