# Showcase Product Surface & Elevation Audit

Status: binding evidence snapshot for the completed Showcase business-page corpus. Read together with `docs/design-language.md` DL-10 and `docs/product-interface-governance.md` PI-04.

This audit exists to prevent shadow decisions from drifting back into page-local taste. It classifies the actual migrated product surfaces rather than assuming that a `Card`, a white box, a border, or `position: sticky` should create depth.

## Decision rule

A visible shadow is allowed only when it communicates a real spatial relationship that border, surface tone and spacing cannot express as clearly.

Ask in this order:

1. Is the surface still ordinary content in the document flow?
2. Does it actually sit above or detach from peer content, rather than merely use `sticky`, `fixed` or `absolute` positioning?
3. Would removing the shadow make the user misunderstand which surface is above another?
4. Is the depth relationship stable in both light and dark themes?

If the answer to 1 is yes and 2/3 are no, the surface is **ground**. A border, white/neutral background, rounded box, selected state or independent semantic grouping does not by itself justify elevation.

## Current product corpus classification

| Product surface | Classification | Shadow decision | Rationale |
| --- | --- | --- | --- |
| Blog Admin Dashboard metric cards, trend card, governance card, alert card, Top Posts | ground | none | peer dashboard regions in normal document flow; hierarchy comes from grid, borders, headings and semantic state |
| Blog Admin Posts / Pages / Categories filters and collections | ground | none | filters, Tables and selection state are normal page content |
| `BulkActionBar` | contextual ground | **none by default** | sticky preserves access while scrolling but does not automatically detach the bar from the page; border + opaque card surface are sufficient |
| Blog Admin Comments / Notifications | ground | none | moderation/unread/selected states use tint, border and typography instead of height/elevation |
| Blog Admin Tags / Media Library / Members | ground | none | Card grids, media items and member collections are peer content surfaces |
| Blog Admin Site Settings / AI Settings | ground | none | tab panels, open leads, forms and configuration Cards stay in the route flow |
| Blog Admin AI Operations | ground | none | operational queues, records and automation panels are application content, not floating tools |
| Blog Admin PostEditor / PageEditor frames | ground | none | command bar, canvas and inspector are one workspace; actual Dialog/Drawer overlays inherit Core modal depth |
| Gosso Account Settings / System Management | ground | none | normal tabbed task/settings surfaces |
| Gosso Overview quick links | ground | none | repeated peer navigation cards must not all compete for elevation |
| Gosso Overview focal hero | raised | `shadow-raised` via `Card variant="elevated"` | one deliberately promoted route-level focal surface; elevation is scarce and not repeated across peer cards |
| Gosso standalone authentication card | raised | `shadow-raised` via `Card variant="elevated"` | centered detached primary task surface on an otherwise open full-viewport backdrop |
| Gosso Not Found result card | ground | none | centered presentation alone does not make an application result an elevated layer |

## Interaction-layer classification

The following visible shadows are not business-page decoration. They belong to reusable interaction layers:

- **overlay:** Select/Dropdown/Popover menus, suggestions, floating messages/notifications, floating buttons and Showcase-only floating tooling;
- **modal:** Dialog/Modal, AlertDialog, Drawer/Sheet and other blocking overlays;
- **overflow:** the two directional inset Table caption edge cues; these communicate a content boundary, not object height.

The product corpus must not reproduce these shadows locally with page-specific classes.

## Raised-surface whitelist

The current business-product whitelist for visible `raised` elevation is intentionally tiny:

1. `showcase/demos/products/gosso-overview.tsx` — the single focal overview hero;
2. `showcase/demos/products/gosso-auth/shared.tsx` — the standalone authentication card shell.

Adding another `variant="elevated"` product surface is a design-language change and must update this audit plus the automated conformance whitelist. “It is a Card”, “it has a border”, “the page is mostly white”, or “it looks too flat” are not sufficient reasons.

## Sticky does not imply overlay

`position: sticky` is a layout/scrolling behavior. It may keep a surface visible without making that surface a separate layer.

Current examples:

- Site Settings sticky save footer: remains part of its owning Card and has no independent elevation.
- `BulkActionBar`: remains a contextual selection surface in page flow and has no default shadow.

If a future product requires a genuinely detached toolbar that covers unrelated content while scrolling, that behavior must be proven explicitly and should use an explicit floating/overlay contract rather than silently inheriting elevation from `sticky`.

## Box / border / white-surface rule

The following are grouping signals, not elevation signals:

- `Card` or another boxed container;
- white/neutral surface on a white or neutral page;
- border and radius;
- selected/unread state;
- an isolated empty/result surface;
- a dashboard tile;
- a form section;
- an independently bordered Table/List.

Use border contrast, neutral surface tone, spacing, typography and semantic state color first. Add elevation only when there is an actual Z-axis relationship.

## Compatibility shadow aliases

`shadow-xs` / `shadow-sm` and the other raw size aliases still resolve to zero visible shadow in Theme only as external compatibility vocabulary. The migrated canonical runtime and Showcase product corpus no longer carry those raw shadow classes: source now expresses flatness directly, while automated conformance rejects their reintroduction. New visible depth continues to require the semantic `raised`, `overlay` or `modal` role owned by the appropriate component/layer.

## Acceptance rule

A future business-page change passes the elevation audit only when:

- ordinary product surfaces remain ground-level;
- any visible raised product surface is present in the explicit whitelist with a product-level reason;
- overlays/modals obtain depth from canonical Core behavior, not page-local shadow classes;
- raw `shadow-xs` / `shadow-sm` / `shadow-md` / `shadow-lg` / `shadow-xl` / `shadow-2xl` classes do not return to canonical runtime or product fixtures;
- `sticky`/`fixed`/`absolute` are not treated as automatic elevation;
- light and dark themes preserve the same hierarchy;
- the full migrated product corpus and conformance tests remain green.