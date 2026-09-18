# Interaction State Foundation Inventory

Status: FI-001 Phase 4 working inventory.
Updated: 2026-09-19

## Scope

Interaction State owns the contract between a component's semantic state, its DOM/ARIA expression, its interaction lock/unlock behavior, and the visual state transition. It does **not** create a second color, border, focus, sizing or motion system.

Canonical state vocabulary is semantic, not a universal prop bag:

- **disabled / unavailable** — native `disabled` where the host supports it; otherwise `aria-disabled` plus blocked activation.
- **busy / loading / pending** — `aria-busy` on the semantic owner, with activation blocked only when the component contract requires it.
- **selected / current / pressed / checked** — choose the platform/ARIA state that matches the interaction model: `aria-selected`, `aria-current`, `aria-pressed`, `aria-checked` or native checked state.
- **open / expanded** — `aria-expanded` and the owning popup/disclosure state machine.
- **validation** — error maps to `aria-invalid`; warning is visual unless the caller provides a semantic message.
- **active pointer/gesture ownership** — draggable/resize gestures must not steal pointer ownership from interactive descendants.

State appearance consumes the already-certified semantic Color, Border, Focus, Sizing, Radius, Motion and Surface authorities. State is not permission to introduce page-local palette colors, new geometry, or competing transition scales.

## Audited owner families

### Action controls

- Core Button / ButtonLink: disabled + loading; loading drives `aria-busy` and suppresses activation.
- ChoiceButton: binary selection maps to `aria-pressed`.
- Popconfirm: asynchronous confirmation owns a pending lock while preserving the open context on rejection.

### Selection controls

- Checkbox / Radio / Switch: native/Radix checked state plus disabled state.
- Segmented: radio semantics with `aria-checked` and component/option disabled state.
- Tag checkable mode: checkbox semantics with `aria-checked`; closable action has its own disabled/hover state.
- Select: open, active option, selected option(s), loading, disabled, error/warning and clear/remove states.
- Tabs: active tab and disabled tab state.

### Validation and form state

- Input and picker family: error/warning visual state; error maps to `aria-invalid`.
- Form: disabled/loading fieldset state; loading drives `aria-busy`.
- Spin: busy state is owned by the containing region rather than the decorative spinner.

### Collection/navigation state

- Table Row: selected/expanded state consumes canonical row styling without changing row geometry.
- Menu/Tree/Calendar/Steps: selected/current/open/checked/disabled state is exposed through the role-specific ARIA contract rather than a generic selected prop.

### Carousel / gesture state

Carousel combines current slide, dots/arrows, autoplay pause, animation lock and optional drag gesture ownership. Interactive descendants inside a draggable viewport must retain their own pointer/click lifecycle.

## Confirmed defects

### FI-D002 — draggable Carousel steals arrow pointer ownership

The canonical Carousel demo enables both `arrows` and `draggable`. Before this workstream the viewport called `setPointerCapture` for every pointerdown that bubbled from inside it, including arrow buttons. The JSDOM click-only unit test did not model this browser pointer lifecycle.

Resolution direction:

- begin drag only from non-interactive descendants;
- ignore non-primary / non-left-button pointer sequences;
- release/clear pointer capture deterministically;
- protect the behavior with a real-browser arrow navigation contract.

### FI-D004 — Tag close hover bypasses certified Color authority

Core Tag's close affordance uses raw `hover:bg-black/10`. The close affordance is UI chrome, not the documented caller-owned custom Tag color exception.

This is a cross-Foundation regression discovered by Interaction State. Color must be reopened for `core-tag`, the hover state must derive from the current/semantic foreground, and Color guard coverage must expand so this class cannot return.

## State geometry policy

F-04 remains binding: state changes must not unexpectedly alter outer geometry or sibling alignment.

Allowed examples:

- border/background/foreground/ring changes that preserve box metrics;
- opacity changes for disabled state;
- selected indicator opacity/color transitions within an already-owned slot;
- explicit content changes requested by the caller, such as a supplied `loadingText`.

Disallowed examples:

- adding a thicker border only in selected/error state;
- changing control height/padding because loading or error is active;
- moving active indicators to a page-local wrapper;
- pointer capture on a gesture container that disables nested buttons/links.

## Token decision

Interaction State introduces no new numeric state token scale. Visual state values resolve through existing semantic authorities:

- Color roles for selected/error/warning/disabled emphasis;
- Border emphasis roles where anatomy requires an indicator;
- Focus geometry for keyboard-visible focus;
- ControlSize/Density/Layout for stable box geometry;
- Motion policy for state transitions.

The State Foundation's token gate therefore means proving that state visuals consume these existing roles rather than inventing a parallel state-token system.

## Acceptance

Interaction State can be certified only when:

1. the semantic state-to-DOM/ARIA mapping above is documented and guarded;
2. draggable/gesture owners preserve nested interactive ownership;
3. disabled/loading/pending states suppress only the interactions they own;
4. error state maps to `aria-invalid` where appropriate while warning remains non-invalid by default;
5. selected/current/pressed/checked states use role-correct semantics;
6. state transitions preserve canonical component geometry unless reflow is an explicit API behavior;
7. state appearance introduces no raw palette/border/size bypasses;
8. representative browser tests cover pointer, selection and loading/disabled behavior;
9. Blog/Gosso reciprocal consumer parity remains green.
