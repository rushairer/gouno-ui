# Gouno UI Design Language

Status: binding visual-composition contract for canonical Gouno UI and migrated product surfaces.

This document is the durable specification for cross-component visual composition. It governs design decisions that are too stable to leave as page-local taste but are not themselves public React API contracts.

- `docs/product-driven-development.md` decides when real product evidence requires design-system work.
- `docs/architecture.md` decides layer ownership and dependency direction.
- `docs/api-specification.md` decides public API naming, state and behavior.
- This document defines binding composition invariants such as hierarchy, surfaces, spacing ownership, alignment, elevation and interaction geometry.
- `docs/product-surface-elevation-audit.md` records the current business-page elevation classification and explicit raised-surface whitelist.
- `docs/abstraction-register.md` records the evidence and decision history behind material changes.

## Foundation model

Gouno UI should not accumulate visual rules only after screenshots expose defects. New pages and components start from the following system model, and product-validation findings refine that model rather than replacing it with one-off fixes.

### F-01 — Semantic hierarchy before decoration

Hierarchy is established in this order:

1. information architecture and heading level;
2. spacing and grouping;
3. surface/background/border separation;
4. semantic state color;
5. elevation only when actual visual depth needs to be communicated.

Do not use shadow, saturated color, extra borders or oversized radius to compensate for an unclear information hierarchy.

### F-02 — One screen has an attention budget

Every strong visual cue spends attention: primary color, destructive color, large typography, heavy border, shadow, animation and persistent floating chrome all compete for focus.

A surface should not become “important” merely by stacking several strong treatments. Prefer one primary emphasis mechanism and let peer content stay quieter. In particular, do not combine strong tint + strong border + strong shadow + exaggerated radius on ordinary application content.

### F-03 — Depth is semantic, not decorative

Visual depth answers a structural question: is this surface on the page, intentionally raised above the page, or temporarily over another surface? Shadow size is an implementation detail of that semantic role.

Normal page content is flat by default. Raised and overlay depth are scarce resources.

### F-04 — Interaction state must preserve geometry

Hover, selected, unread, count, error, loading and permission states may change appearance but should not unexpectedly change the component's outer geometry. State changes must not make sibling controls jump, change row heights, or detach active indicators from their owning boundary unless reflow is an explicit behavior of that component.

### F-05 — Light and dark themes express the same roles, not the same raw values

Theme parity means that semantic hierarchy survives in both themes. Dark mode must not depend on a shadow that is visually indistinguishable from the background; raised/overlay surfaces may therefore use a different neutral surface tone as well as a shadow.

Validate roles (`default`, `raised`, `overlay`, semantic feedback) rather than assuming one numeric color/shadow recipe works in both themes.

## External reference basis

Gouno does not copy another library's API or aesthetics, but mature systems are used to challenge our assumptions:

- **Atlassian Design System — Elevation:** default surfaces are flat; raised/overlay elevations pair surface and shadow tokens; raised elevation should be used intentionally because excessive elevation creates visual noise; dark mode relies on surface differences as well as shadows.
- **Carbon Design System — Layering:** layer/contextual tokens model nested surface hierarchy instead of relying on decorative shadow. This reinforces the separation between surface level and shadow effect.
- **Carbon Design System — Tabs:** line tabs use deterministic component heights (for example 40px for the medium text tab), reinforcing geometry-stable navigation.
- **WAI-ARIA Tabs pattern:** the active `tabpanel` is labelled by its owning `tab`; a second visible heading that merely repeats the tab label is not required to identify the panel.
- **Ant Design — Shadow:** height is modeled as semantic UI layers; ground-level elements such as inputs do not require shadow.

These references are evidence, not authorities. Gouno's binding choices still require current product evidence and compatibility with the repository's API/design rules.

## DL-01 — One semantic region, one dominant surface boundary

A semantic section or collection should expose one dominant perceivable boundary by default.

`Card`, bordered `Table`, and bordered/list-group containers are peer surface choices. Do not wrap a self-surfaced Table/List in another Card merely to create padding, alignment, radius or background.

Prefer:

```text
PageHeader

┌──────── standalone Table / List ────────┐
│ content                                 │
├─────────────────────────────────────────┤
│ content                                 │
└─────────────────────────────────────────┘
```

Avoid without additional semantics:

```text
PageHeader

┌──────── Card ───────────────────────────┐
│  ┌──── bordered Table / List ────────┐ │
│  │ content                           │ │
│  └───────────────────────────────────┘ │
└────────────────────────────────────────┘
```

A nested surface is justified only when the outer surface owns additional semantic structure such as its own section header, explanatory body, persistent actions/footer, independent state or visually meaningful grouping. Even then, prefer full-bleed inner content or a single shared boundary over two adjacent borders/radii when the inner collection is the main body.

## DL-02 — Surface boundary and content alignment are separate concerns

Do not add a container boundary just to align content.

Normal product/admin surfaces share a common edge inset for their first and last primary content. The current base edge inset is `24px` (`spacing-6`). This is the visual axis used by normal `Card` content and normal bordered collection surfaces.

Compact surfaces may use `16px` (`spacing-4`) when density is an explicit compact mode.

The edge inset governs the distance from the outer surface boundary to the first/last meaningful content. It does **not** require every internal gap or table column to use the same value.

A landing/dashboard composition may differ in typography, elevation, background treatment and vertical rhythm without inventing a different horizontal content axis. A normal application-surface Hero therefore uses the same base edge inset unless a genuinely different spacious reading/result surface is intentionally documented.

## DL-03 — Preserve data density inside aligned Tables

Table edge alignment and internal column density are separate axes.

For normal/touch bordered Tables:

- first column left edge: `24px`;
- last column right edge: `24px`;
- intermediate cell horizontal padding remains the Table density default (`16px` today).

For compact bordered Tables:

- first/last surface edge inset: `16px`;
- intermediate cell horizontal padding remains compact (`12px` today).

Do not increase every Table cell to 24px merely to align the outer content axis. This would reduce useful data density without improving the surface boundary relationship.

Unbordered/open Tables are allowed to follow their local/open-layout density because no explicit surface boundary exists to align against.

## DL-04 — Standalone list rows follow the same edge axis

When a List is itself the surface (border/radius/background/dividers), its rows should place the first and last primary content on the same edge inset as peer normal surfaces: `24px` by default, `16px` for an explicitly compact surface.

A self-surfaced list should not acquire an outer Card solely to obtain this inset. Put the inset on the rows/list anatomy that owns it.

## DL-05 — Cards express grouping, not generic page padding

`Card` is a semantic visual grouping surface. Its default/base padding (`24px`) establishes the normal surface content axis.

Use a Card when its boundary communicates meaningful grouping. Do not use Card as a generic replacement for page gutters or as an alignment shim around another complete surface.

Task-page `PageHeader` remains outside content surfaces unless the title is genuinely card-local. Open layouts, direct Table/List surfaces and Cards may coexist as peer children under one page composition.

`Card padding="lg"` is a deliberate spacious-surface choice, not the default for an application page. Use it only when a larger inset is part of the semantic presentation (for example, an intentionally spacious standalone/result/reading surface). Do not use it merely because a page is visually important.

## DL-06 — Structural spacing versus content spacing

PD-020 remains binding: compound components own structural spacing between their semantic regions; content regions own their own internal content rhythm.

This rule and the surface rules are complementary:

- page/container gutter aligns peer regions at the page level;
- surface edge inset aligns content inside a boundary;
- compound structural gap separates semantic slots;
- content spacing arranges business content inside a slot.

Do not solve a defect in one level by adding arbitrary margin/padding at another level.

## DL-07 — Binding design changes require corpus conformance

A new or changed binding design-language rule is not complete when only the triggering page is fixed. The change must be migrated through the existing product evidence corpus before normal page migration continues.

For every binding visual-composition change:

1. fix the triggering page/component;
2. identify the already-migrated product surfaces governed by the same rule;
3. scan the completed comparison corpus and the currently migrated pages in the active product line;
4. classify each occurrence as conforming, stale, or an intentional exception;
5. fix stale occurrences in the same hardening phase;
6. document intentional exceptions where a future agent will encounter them (this document or the product migration README);
7. add an automated regression check when the invariant is reasonably detectable from source or runtime structure;
8. only then resume ordinary page migration.

A rule that exists only in documentation while completed product fixtures still violate it is not considered fully adopted.

Current Gosso Admin and Blog Admin application surfaces form the completed Admin comparison corpus. Standalone identity, editor workspaces and contained result surfaces may intentionally use different composition, but the exception must be semantic and internally consistent rather than accidental migration history.

New migrated pages start from the current contract. Do not introduce 20px/32px normal application-surface insets and rely on a future cleanup pass.

## DL-08 — The outer surface owns edge geometry

The component that owns a surface boundary also owns that boundary's outer border, outer radius and clipping. Internal regions such as headers, content bodies, tables or sticky action footers must compose *inside* that geometry rather than redefining it.

When an internal region needs to run full-bleed to a Card edge, prefer explicit Card anatomy:

```text
Card (padding: none, owns border/radius/clipping)
├─ CardContent (owns its own 24px inset)
└─ CardFooter  (full-bleed edge region, owns its own inset)
```

Do not make a padded Card full-bleed by using negative margins such as `-mx-*` / `-mb-*` merely to escape the parent's padding. Negative-margin edge hacks couple the child to one padding value, make radius behavior fragile and can expose square child backgrounds across rounded parent corners.

For a full-bleed sticky footer/action region:

- keep the footer in normal document flow so it still reserves layout space;
- let `position: sticky` change only its scroll behavior, not its ownership;
- keep the footer's outer bottom corners visually owned by the parent surface;
- clip edge-reaching child backgrounds to the parent radius;
- prefer `overflow: clip` when the goal is only visual clipping and the current browser baseline supports it, because it does not create a scroll container the way `overflow: hidden/auto` can;
- use `overflow: hidden/auto` only when scrolling/clipping semantics themselves are required.

Do not add a second Card or second outer radius around a footer simply to solve the corner problem. The footer is a semantic region of the parent surface, not a sibling floating surface.

This is a design-language rule, not evidence for a new `StickyFormFooter`, `SaveBar` or Pattern. Keep the composition product-local until repeated real product behavior proves a shared interaction contract.

## DL-09 — Dense Table row actions stay single-line and structurally uniform

Desktop Table row-action cells optimize for stable row geometry. A row's action cluster should use one compact structural control family, remain on one line, and contribute its full intrinsic width to Table layout.

- Prefer icon-only `IconButton` controls for repeated Table row actions when each icon has a clear accessible `label`/tooltip.
- Within one action cluster, keep one structural variant. Dense row actions currently use `ghost`; semantic danger/success may change `color`, but severity alone must not switch a sibling into a filled or rectangular control.
- Use `flex-nowrap` plus a max-content minimum for the action group. Do not use `flex-wrap` to make a desktop Table fit.
- Let the Table's horizontal overflow own width pressure. Stable rows are preferable to different row heights caused by action wrapping.
- If a real action set later exceeds a reasonable single-line width, move lower-frequency actions into an overflow/dropdown interaction rather than permitting wrap.
- Mobile Card/List surfaces are separate responsive presentations and may choose a different action arrangement.
- A one-action cell may use an explicit text Button when that is semantically clearer. This rule primarily forbids mixed sibling structures and wrapped desktop row-action groups.

This is a visual-composition rule, not evidence for a public `RowActions`, `ActionGroup` or DataTable abstraction.

## DL-10 — Elevation is a semantic role owned by the design system

Elevation is not a page-local decoration knob. Canonical depth roles are:

| Role | Meaning | Typical surfaces | Shadow |
| --- | --- | --- | --- |
| **ground/default** | normal content in document flow | page, normal Card, bordered Table/List, filters, form controls, selected navigation/Tabs, contextual sticky bars, in-flow feedback | none |
| **raised** | deliberately promoted focal surface that is visually detached from peer page content | explicitly audited `Card variant="elevated"` focal/standalone surface | `shadow-raised` + raised surface tone |
| **overlay** | temporary/floating UI that actually occupies a layer above other content | Select/Dropdown/Popover menus, floating notifications/tooling | `shadow-overlay` + overlay/popover surface |
| **modal** | blocking high-depth overlay | Dialog/Modal, AlertDialog, Drawer/Sheet | `shadow-modal` + modal/overlay surface |
| **overflow** | indicates clipped/scrollable content, not object height | table/scroll edge cue | directional/inset edge shadow only when a border is insufficient |

Binding rules:

- Normal Cards, bordered Tables, inputs, filters, lists, editor frames, dashboard tiles and ordinary navigation do not receive ambient shadow merely to look “finished”. Border, spacing and surface tone should carry ground-level grouping.
- A white/neutral box, border, radius, empty page, selected state, unread state or semantic grouping is **not** an elevation signal by itself.
- CSS positioning is not elevation semantics. `sticky`, `fixed` and `absolute` describe layout behavior; visible depth is allowed only when the surface actually establishes a layer above peer content.
- `BulkActionBar` is sticky for contextual access but remains ground-level by default. Its border and opaque surface communicate selection context without an ambient shadow. A future truly detached/floating toolbar requires an explicit product/Pattern contract rather than inheriting `shadow-overlay` from `sticky`.
- Product/Showcase fixture code must not create **non-zero** elevation with raw size utilities such as `shadow-md`/`shadow-lg`, arbitrary box-shadow values, or page-local custom shadow colors. Request a semantic component variant/role or document a genuine exception.
- `shadow-xs` and `shadow-sm` are temporary flat compatibility aliases in the theme. They intentionally produce no visible elevation and must not be used as new design vocabulary; product-fixture remnants should be removed so source code communicates the intended flatness directly.
- Canonical component code should migrate toward `shadow-raised`, `shadow-overlay` and `shadow-modal`; size aliases remain compatibility implementation paths, not design-language vocabulary.
- A raised/overlay surface must remain legible in dark mode even when its shadow is hard to see. Pair the semantic shadow with an appropriate surface tone/border rather than increasing black alpha without limit.
- Do not promote a surface on hover unless that depth change itself communicates interaction. For small controls and ordinary navigation, background/border/color changes are preferred to elevation animation.
- Visible `raised` elevation in business pages is whitelist-governed. The current audited product whitelist is the Gosso Overview focal hero and the standalone Gosso authentication card, recorded in `docs/product-surface-elevation-audit.md` and enforced by conformance tests.

Ownership is therefore split cleanly: **Theme tokens define depth values; Core/Pattern/Gouno components own when depth is structurally appropriate; product pages own only the business reason for choosing an existing semantic variant; the product elevation audit owns the current business-surface whitelist.**

## DL-11 — Route-family identity precedes page-local Tabs without label echo

For normal task/settings pages where Tabs switch peer sections within one route family, the stable anatomy is:

```text
PageHeader (one route-family H1)
Tabs (page-local navigation)
Active panel (already labelled by the active Tab)
├─ optional compact lead: description / active-panel actions
└─ optional H2 only for a distinct subsection or task concept
```

Rules:

- `PageHeader` identifies the route-family page and therefore appears before page-local Tabs.
- A tab change must not replace the route-family H1 with a different H1.
- The active Tab already names and accessibly labels its `tabpanel`. Do **not** mechanically repeat the same wording as an immediate visible H2 (`系统管理 → 用户管理 Tab → 用户管理 H2`, for example). That is label echo, not useful hierarchy.
- A panel may place a concise description/status/action lead below Tabs when it adds active-section context. The lead should not invent another title merely to justify actions.
- Use a visible H2 when it names a real concept *inside* the active panel, differs materially from the Tab label, or divides the panel into meaningful subsections. If the repeated panel H2 is removed, those real subsections may be H2 directly under the route H1; the Tab is navigation/tabpanel labelling, not a document-outline heading.
- Tab-local actions that truly belong only to the active section stay with the panel lead or the relevant local section instead of being hoisted into the route-level `PageHeader`.
- Tabs that are themselves the primary route-family switch still follow the same visual order even when the URL segment/query changes with the active key.
- Do not choose `Tabs → PageHeader` on one product and `PageHeader → Tabs` on another merely because each local implementation was migrated at a different time.
- Editor workspaces are an explicit exception: PD-035/PD-036 intentionally use command-bar/editor grammar instead of normal `PageHeader → Tabs → content` composition.
- Standalone identity surfaces are a separate surface family and are not forced into this task-page grammar.

This rule standardizes hierarchy and information density, not implementation. It does not create a `TabbedPage`, `TabPanelHeader` or `PanelLead` public Pattern.

## DL-12 — Stateful decoration must not change control geometry

Reusable controls own their outer block size. Auxiliary content such as icons, counts, status dots, badges or metadata may fit *inside* that geometry but must not silently enlarge one sibling control.

For Tabs specifically:

- public Tab sizes have deterministic block heights;
- line indicators remain attached to the TabList edge;
- adding a count/status label to one Tab must not increase TabList height or leave other active indicators floating above the list boundary;
- if auxiliary content cannot fit within the supported Tab size, the content composition is invalid and should be redesigned rather than allowing one Tab to redefine the row geometry.

Apply the same test to Buttons, segmented controls, toolbar items, table rows and navigation items: state should not cause accidental layout shift.

## DL-13 — Emphasis uses the weakest sufficient signal

Choose the weakest signal that communicates the semantic difference clearly:

1. spacing/grouping;
2. typography weight/size;
3. neutral surface or border;
4. semantic tint/color;
5. elevation;
6. motion.

Do not reach immediately for shadow or saturated brand color. This keeps admin/product screens calm enough that destructive actions, warnings, focus rings and true overlays remain obvious when they matter.

## DL-14 — Binding visual rules are dual-theme contracts

Any new binding rule involving color, border, surface, elevation, focus or state contrast must be reviewed in both light and dark themes.

- A treatment that only “works” because dark mode hides its shadow is not accepted.
- A dark-mode fix that destroys light-mode hierarchy is not accepted.
- Prefer semantic role tokens over one theme's literal values.
- Where automated source/runtime checks cannot prove visual parity, the migration acceptance record must explicitly call for light + dark visual verification in an environment that can render the page.

## Review checklist

When a page looks inconsistent, ask in this order:

1. Is the information hierarchy correct before styling (single route H1, Tabs at the right level, and no duplicate Tab-label heading unless it adds new meaning)?
2. Is this boundary communicating a real semantic grouping, or only adding padding?
3. Is the child already a complete surface?
4. Are peer surfaces aligned by edge inset rather than by extra wrappers?
5. Can Table/List preserve internal density while aligning only its outer content edges?
6. Is the discrepancy actually page gutter, surface inset, compound structural gap, content spacing, or edge geometry ownership?
7. If an internal region reaches the parent edge, does the parent still own border/radius/clipping without negative-margin hacks?
8. Would removing one border/radius make the hierarchy clearer without losing meaning?
9. Is a shadow communicating a real Z-axis relationship, or is it being inferred from a box, border, white background, empty page or CSS positioning?
10. If a product surface is raised, is it on the audited whitelist with a reason that remains valid in both light and dark themes?
11. If a Table has repeated row actions, do they remain one structural family on one line while Table overflow owns width pressure?
12. Can selected/count/error/loading state change without altering sibling control geometry?
13. If this rule just changed, have all already-migrated governed surfaces been scanned and migrated or explicitly documented as intentional exceptions?

These rules are design-language invariants, not permission to create new Pattern/Gouno components. Public abstraction still requires the product-driven admission process.
