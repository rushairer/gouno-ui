# Showcase Product Surface & Elevation Audit

Status: binding evidence snapshot for the completed Showcase business-page corpus. Read together with `docs/design-language.md` DL-10 and `docs/product-interface-governance.md` PI-04.

This audit exists to prevent shadow decisions from drifting back into page-local taste. It classifies actual product surfaces after the completed Gosso Admin + Blog Admin migration corpus rather than assuming either “everything should be flat” or “every box should float”.

## Evidence used to challenge the previous flat model

The previous audit intentionally minimized shadow, but that became too coarse once light-theme pages exposed three problems: bounded content could disappear into a white page, standalone result/auth surfaces did not always share the same hierarchy, and tangible controls lost useful low-cost depth.

The revised model was checked against mature systems:

- Ant Design Shadow: https://ant.design/docs/spec/shadow/ — inputs sit at layer 0; card interaction uses a low level; dropdowns use a medium level; dialogs use a high level.
- Ant Design Theme: https://ant.design/docs/react/customize-theme — `colorBgLayout` is a dedicated layout background (`#f5f5f5` by default), providing a separate canvas beneath container surfaces.
- Ant Design Button: https://ant.design/components/button/ — default, primary and danger Buttons have deliberately tiny shadow tokens rather than being uniformly flat.
- Atlassian Elevation: https://atlassian.design/foundations/elevation — elevation pairs surfaces and shadows, raised/overlay roles are intentional, dark mode also changes surface tone, and overflow shadows are a separate semantic cue.

Gouno adopts the hierarchy principles, not those systems' literal values.

## Revised decision rule

Classify the object before choosing a shadow:

1. **Canvas** — Is this the lowest application backdrop or open content region?
2. **Control** — Is this a bounded tactile control whose affordance benefits from micro-depth?
3. **Surface** — Is this a persistent top-level bounded container that must read clearly against the application canvas?
4. **Raised** — Is this a deliberately promoted focal/standalone task, or a peer surface temporarily lifting because interaction itself is being communicated?
5. **Overlay / modal** — Does it actually sit above another UI layer?
6. **Overflow** — Is the shadow only indicating clipped/scrollable content?

A border or rounded box is evidence for a boundary, not automatically for `raised`. Conversely, a normal top-level Box no longer has to be completely shadowless: on the semantic application canvas it may use the much weaker `surface` level.

## Current semantic ladder

| Level | Token / contract | Current meaning |
| --- | --- | --- |
| Canvas / 0 | `bg-canvas` | application layout backdrop; no ambient shadow |
| Control / micro | `shadow-control` | tiny depth on tangible Buttons and selected Segmented item |
| Surface / 1 | `shadow-surface` | persistent bounded Card / bordered Table separated from canvas |
| Raised / 2 | `bg-raised` + `shadow-raised` | focal/standalone surface or explicit interactive lift |
| Overlay / 3 | popover tone + `shadow-overlay` | dropdown/popover/floating UI above peer content |
| Modal / 4 | mask + `shadow-modal` | blocking Dialog/Drawer/AlertDialog layer |
| Overflow | directional inset cue | scroll/clipping hint, not object height |

## Current product corpus classification

| Product surface | Classification | Current decision | Rationale |
| --- | --- | --- | --- |
| AppShell main canvas | canvas | `bg-canvas` | faint layout plane separates page chrome and bounded application surfaces |
| Blog Admin Dashboard Cards | surface | default Card owns `shadow-surface` | peer persistent dashboard boxes need separation from canvas, not focal raised depth |
| Blog Admin Posts / Pages / Categories filters | surface | default Card | top-level persistent filter boxes |
| Blog Admin bordered Tables | surface | bordered Table owns `shadow-surface` | collection itself is the bounded content surface |
| `BulkActionBar` | contextual ground | **no shadow** | sticky access does not make it a new layer; primary border + opaque surface already communicates selection context |
| Blog Admin Comments / Notifications | surface where Card owns a row/card; state remains tint/border | default Card; no state-specific extra shadow | unread/selected does not change height level |
| Blog Admin Tags / Media Library / Members | surface | default Card / bordered Table | peer bounded application content |
| Blog Admin Site Settings / AI Settings | surface for actual Cards; panel lead remains open | default Card | settings Cards are persistent boxes; route/Tab lead remains outside |
| Blog Admin AI Operations | surface | default Cards / bordered collections | operational panels remain persistent application content, not overlays |
| Blog Admin PostEditor / PageEditor outer frames | surface | default Card | editor workspace is a bounded persistent work surface |
| Gosso Account Settings / System Management Cards and bordered Tables | surface | Core-owned default depth | normal task/settings surfaces on canvas |
| Gosso embedded compact bordered lists inside an existing panel | ground/border-only | no page-local shadow | nested grouping should not recursively manufacture elevation |
| Gosso Overview quick links | surface → raised on hover | `shadow-surface`, `hover:shadow-raised` | repeated peer navigation cards rest quietly and lift only when interaction is communicated |
| Gosso Overview focal Hero | raised | `Card variant="elevated"` | one intentionally promoted route-level focal region |
| Gosso standalone authentication card | raised | `Card variant="elevated"` | centered primary task detached from open standalone background |
| Gosso Not Found result card | raised | `Card variant="elevated"` | standalone centered result is the sole task surface and should share the auth/result hierarchy rather than looking accidentally flatter |

## Why Not Found is raised but ordinary Empty states are not

The distinction is not the 404 wording or the fact that a Card is centered.

- A **standalone Not Found route** has one primary result/task surface on an otherwise open page; the surface itself is the page's focal object.
- An **Empty state inside Posts/Pages/etc.** belongs to an existing application route and collection context. Its Card is only a normal level-1 surface and should not compete with the route hierarchy.

This makes standalone result/auth pages consistent without promoting every empty box.

## Control-depth classification

`shadow-control` is intentionally smaller than `shadow-surface` and does not establish a page layer.

Current tangible controls:

- solid/default Button;
- destructive Button;
- outline Button;
- secondary Button;
- selected Segmented item.

Current flat controls:

- ghost Button;
- text/link Button;
- navigation/Tabs selected state;
- input/textarea/select trigger at rest (border/focus ring own the affordance).

Do not spread `shadow-control` to every bordered element. It is a tactile cue, not a generic border enhancement.

## Interaction-layer classification

The following shadows belong to reusable interaction layers rather than business-page decoration:

- **overlay:** Select/Dropdown/Popover menus, suggestions, floating messages/notifications, floating buttons and Showcase-only floating tooling;
- **modal:** Dialog/Modal, AlertDialog, Drawer/Sheet and other blocking overlays;
- **overflow:** the directional inset Table edge cues; these communicate hidden content/boundaries rather than object height.

Product fixtures must not reproduce overlay/modal shadows locally.

## Persistent raised-surface whitelist

Persistent business-product `Card variant="elevated"` is intentionally scarce and currently limited to:

1. `showcase/demos/products/gosso-overview.tsx` — one focal overview Hero;
2. `showcase/demos/products/gosso-auth/shared.tsx` — standalone authentication shell;
3. `showcase/demos/products/gosso-auth/not-found.tsx` — standalone Not Found result surface.

Manual `shadow-raised` in product fixtures is currently allowed only in `gosso-overview.tsx`, where a peer Quick Link transitions from `surface` to `raised` on hover.

Adding another persistent raised surface or page-local raised utility is a corpus-level design decision and must update this audit and automated conformance.

## Nested surface rule

A default Card is a level-1 surface when it is itself a meaningful bounded product region. That does **not** mean every nested rectangle should become another surface.

When already inside a Card/surface, prefer in this order:

1. open content/spacing;
2. divider or border-only list;
3. neutral/subtle background (`Card variant="subtle"` where appropriate);
4. another level-1 surface only if it represents an independently bounded region with its own semantic ownership.

Do not create repeated shadow-on-shadow nesting merely for visual texture.

## Sticky does not imply overlay

`position: sticky` is a layout/scrolling behavior, not a depth level.

Current examples:

- Site Settings sticky save footer remains part of its owning surface and does not get a second independent shadow.
- `BulkActionBar` stays contextual ground and has no default shadow.

A future toolbar that genuinely covers unrelated content may use an explicit floating/overlay contract, but it must be admitted based on behavior rather than `sticky` syntax.

## Raw shadow compatibility vocabulary

Raw size aliases (`shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`) intentionally resolve to zero in Theme for compatibility. The canonical runtime and Showcase product corpus must not carry them as design vocabulary.

Historical Legacy implementations remain available through Git history and may contain old classes; `src/legacy/**` no longer exists in the current source tree and historical code must not be used as proof for current design decisions.

## Acceptance rule

A future change passes the elevation audit only when:

- application body content starts from the semantic canvas instead of relying on one all-white plane;
- normal top-level bounded Cards/Tables obtain low depth through canonical `surface` behavior, not page-local classes;
- nested grouping does not recursively manufacture unnecessary surface shadows;
- any persistent `raised` product surface is on the explicit whitelist with a product-level reason;
- any manual product `shadow-raised` use is explicitly audited and interaction-driven;
- overlays/modals obtain depth from canonical Core behavior;
- raw size shadow utilities and arbitrary/page-local box shadows do not return to canonical/product source;
- `sticky`/`fixed`/`absolute` are not treated as automatic elevation;
- Button/control micro-depth remains weaker than surface depth and absent from ghost/text/link controls;
- light and dark themes preserve the same hierarchy with matching surface-tone semantics;
- the full conformance/typecheck/test/package/Showcase gate remains green.
