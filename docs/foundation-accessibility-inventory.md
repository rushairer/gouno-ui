# Accessibility Foundation Inventory

Status: FI-001 Phase 5 working inventory.
Updated: 2026-09-19

## Scope

Accessibility is a Foundation contract over semantic ownership, not a layer of ARIA added after visual implementation.

Canonical rules:

- prefer native HTML semantics before recreating them with ARIA;
- the element that owns an interaction must also own its accessible name, state and relationships;
- visible form labels, hints and errors must bind to the actual interactive semantic owner, including composite controls;
- icon-only actions require a stable accessible name;
- disclosure/tree/menu/tab/listbox state uses the role-specific ARIA relationship rather than generic status text;
- decorative nodes stay out of the accessibility tree and must not remain keyboard-focusable;
- modal/drawer surfaces require a usable name, keyboard focus containment/return and a named close affordance when one is rendered;
- document headings, tables, lists and landmarks preserve semantic structure independently of visual styling;
- transient announcements are explicit and owned by the workflow that changes state;
- interactive descendants must never be nested inside another native interactive element.

Accessibility consumes the already-certified Typography, Focus, Interaction State, Responsive, Motion, Color and Sizing authorities. It introduces no parallel visual token scale.

## Audited families

### Forms and composite inputs

`FormField` owns visible label/hint/error composition. Native inputs already receive `htmlFor/id`, required, `aria-describedby` and `aria-invalid`. Composite controls must expose the same relationships on their visible semantic owner rather than only on a hidden compatibility form element.

### Disclosure and tree controls

Collapse and Tree already expose expanded/current/selected state. Their icon-only switchers must be named by the visible item/panel label; injected generic English action names are neither contextual nor locale-safe.

### Overlays

Modal and Drawer use Radix Dialog primitives for focus containment, Escape handling and focus return. The rendered close control must receive a localized/context-appropriate accessible name, and title-less surfaces must use a neutral dialog/drawer fallback rather than naming the surface after the close action.

### Tags and nested interaction

A checkable Tag is itself an interactive checkbox-like control. A closable Tag contains a separate close action. Combining both on the same native button creates invalid nested interactive markup; the public contract must make the two interaction models mutually exclusive unless a future product proves a sibling-control composition is required.

### Product corpus

Canonical Blog, Blog Admin and Gosso Admin fixtures are scanned for:
- non-semantic clickable `div/span/li` controls;
- product images missing `alt`;
- focusable `aria-hidden` nodes;
- raw heading bypasses already covered by Typography;
- direct icon-only action reconstruction where Core already owns naming.

## Confirmed defects

### A11Y-D001 — FormField labels the hidden Select instead of the visible combobox

`FormField` binds `htmlFor` to the child's `id`. Core Select places that id on its hidden native select while the visible button owns `role=combobox`. A `FormField label=...` around Select can therefore leave the actual interactive combobox without the visible field name. Required state is similarly present on the hidden select but not expressed as `aria-required` on the visible combobox.

Resolution:
- give the visible Field label a stable id;
- when a child has no explicit accessible name, bind that Field label to the actual interactive owner;
- when a child already owns an explicit `aria-label`, `aria-labelledby` or component-level `label`, preserve that child-owned name and use the outer Field label as group context instead of overriding it;
- move Select's public `id` to the visible combobox and give the hidden native form select an internal id, so `label[for]`, focus and ARIA all resolve to the same interactive owner;
- expose Select `required` as `aria-required` on the visible combobox.

### A11Y-D002 — Collapse icon-only disclosure buttons have duplicate generic names

Icon-only Collapse uses `Expand panel / Collapse panel` for every item. With multiple panels, controls are not contextually distinguishable and the copy is injected English.

Resolution: name the disclosure button with the actual panel label via `aria-labelledby`; `aria-expanded` already communicates state.

### A11Y-D003 — Tree switchers inject generic English names

Tree switchers use `Expand / Collapse` despite already having a stable visible node-title id.

Resolution: name the switcher from the node title via `aria-labelledby`; `aria-expanded` communicates state.

### A11Y-D004 — Modal/Drawer close affordances bypass product language

Internal Dialog/Sheet primitive close buttons hard-code the screen-reader text `Close`. Core Modal/Drawer already know the active document language for fallback text but did not pass that ownership to the close affordance. Modal also used the close-action copy as the fallback dialog title.

Resolution:
- let internal Dialog/Sheet content accept a close label;
- Core Modal/Drawer pass the localized close label;
- title-less Modal/Drawer use neutral localized surface names rather than the close action.

### A11Y-D005 — checkable + closable Tag admits nested buttons

A checkable Tag renders a native button. Its closable content renders another native button inside it. No canonical product requires this combination.

Resolution: preserve the existing admitted combination without nesting: when both behaviors are requested, the visual Tag becomes a neutral wrapper containing a checkbox-like selection button and an independent close button as sibling interactive owners. Each action keeps its own accessible name/state and focus treatment.

## Acceptance

Accessibility can be certified only when:

1. composite form controls inherit missing Field naming/description/error/required semantics on the real interactive owner without erasing an explicit child-owned accessible name;
2. icon-only disclosure/switcher controls have contextual names without injected generic English copy;
3. Modal/Drawer retain dialog naming, focus containment/return and locale-correct close naming;
4. Core Tag never nests native interactive elements; combined check + close behavior uses sibling semantic owners;
5. product corpus non-semantic click targets, focusable `aria-hidden` nodes and unlabelled product images are zero or explicitly documented;
6. representative keyboard/browser tests prove form naming, overlay focus/close and composite interaction;
7. heading/table/list/landmark structure remains covered by existing semantic contracts and representative product checks;
8. Blog/Gosso reciprocal consumer parity passes.
