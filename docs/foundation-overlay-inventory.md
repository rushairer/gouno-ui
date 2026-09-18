# Overlay / Layering Foundation Inventory

Status: FI-001 Phase 4 working inventory.
Updated: 2026-09-18

## Problem statement

The repository already has a de-facto stacking model, but it is encoded as raw `z-*` literals in individual components instead of one Layer authority.

That is enough for isolated demos, but it is fragile when portals, sticky shell chrome, floating controls, nested popovers and notices coexist.

## Observed layer corpus

The current implementation exposes these global or quasi-global values:

- **20** — Affix and sticky BulkActionBar.
- **30** — Gouno AppShell sticky header.
- **40** — BackTop and FloatButton.
- **50** — Dialog, Sheet, AlertDialog, Popover, DropdownMenu, Tooltip, Select portal, Menu popup, AutoComplete popup and Mentions popup.
- **100** — Message and Notification regions.
- **60 / 100** in Showcase tooling — Fixture toolbar and standalone navigation; these are tooling chrome outside the product viewport and must not become product Layer authority.
- **1 / 2 / 10 / 20 inside components** — Steps marker/body, Carousel fade/arrows and similar local stacking. These are local stacking contexts and must remain distinguishable from application-global layers.

## Confirmed structural defects

### Global values are implicit

There is no canonical Layer token/role vocabulary. Components directly encode `z-20`, `z-30`, `z-40`, `z-50` and `z-[100]`.

A future component can therefore select an arbitrary value without violating any guard.

### Modal and transient portal overlays collide at 50

Modal/Drawer/AlertDialog and nested transient portals such as Tooltip/Popover/Dropdown/Select all use the same global `z-50` value.

Today many combinations work because Radix portals are appended later in DOM order. DOM insertion order is not a durable layer contract.

Nested transient overlays need a semantic layer that is deterministically above modal surfaces without requiring each component to invent a larger number.

### Notices use an unowned emergency number

Message and Notification both use `z-[100]`. Their precedence above ordinary overlays is intentional, but the value is not semantic or guarded.

### Showcase chrome is mixed with product layer numbers

Fixture toolbar `z-[60]` and standalone navigation `z-[100]` intentionally sit outside the product viewport. They need an explicit tooling exception/authority so product overlay changes cannot accidentally cover Showcase controls or cause tooling values to leak into runtime components.

### Modal/Drawer custom zIndex is a legitimate escape hatch

Core Modal/Drawer accept a numeric `zIndex`. The current implementation forwards the same value to mask and content, so the custom layer does not split the modal pair.

This API is not itself a defect. The default must use the canonical modal layer, while an explicit caller override remains an intentional precision escape hatch and must continue to keep mask/content aligned.

## Target semantic model

The existing hierarchy should be promoted into named roles rather than replaced by unrelated values:

- **local** — component-internal stacking only; never compared globally.
- **sticky** — application sticky bars / shell chrome.
- **floating** — BackTop / FloatButton class controls.
- **modal** — blocking mask + Dialog/Sheet/AlertDialog surfaces.
- **popup** — portal popup surfaces that may appear from within a modal: Popover, Dropdown, Tooltip, Select.
- **notice** — Message / Notification regions.
- **tooling** — Showcase-only chrome outside the product viewport.

The exact numeric values are an implementation detail of these roles; components consume role classes/tokens.

## Acceptance

Overlay / Layering can be certified only when:

1. semantic Layer tokens/roles own all application-global z-index values;
2. modal mask and modal content remain on one coordinated layer for both defaults and explicit `zIndex` overrides;
3. popup portals deterministically render above their owning modal/drawer instead of relying on DOM order at equal z-index;
4. Message/Notification consume the notice role rather than raw `z-[100]`;
5. local component stacking remains explicitly excluded from the global Layer corpus;
6. Showcase tooling layers are isolated as tooling-only authority;
7. raw global layer bypasses are zero in governed runtime/product code;
8. browser evidence covers nested Modal/Drawer + popup behavior;
9. Blog and Gosso reciprocal consumer parity remain green.
