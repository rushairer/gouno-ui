# Foundation Integrity Open Defects

Updated: 2026-09-19

This queue records defects discovered while the Foundation Integrity Program is active. A defect does not silently remain under a `reviewed` component entry. It is either resolved in the relevant Foundation or explicitly carried into the final defect sweep.

## FI-D001 — Steps connector / copy geometry

**Status:** fix implemented; Responsive re-certification pending  
**Component:** `core-steps`  
**Observed evidence:** Showcase Steps variant screenshot, 2026-09-18.

The horizontal and vertical connector geometry does not maintain a convincing spatial relationship to the marker/title/content block. In the current implementation the connector is absolutely positioned from the marker while the title/content remain transparent siblings above it, which allows connector geometry to visually compete with text.

Next action:

- verify horizontal and vertical layouts in browser;
- determine whether this is a local Steps composition defect or evidence of a broader Layout/Spacing authority gap;
- if local, fix Steps and add geometry/browser regression evidence;
- if systemic, reopen the owning Foundation before recertification.

Finding: this is a local Steps connector-geometry defect plus a Responsive implementation gap. Responsive is reopened only for `core-steps`; canonical breakpoint/Layout/Spacing authority remains unchanged. The source fix gives horizontal copy an independent connector lane, gives dot markers their own offsets, and converts the complete max-sm item/body/connector composition rather than only the root flex direction.

## FI-D002 — Carousel arrows do not navigate in the real Showcase

**Status:** resolved / certified 2026-09-19  
**Component:** `core-carousel`  
**Observed evidence:** Showcase Carousel screenshot and manual click report, 2026-09-18.

Unit tests currently call `fireEvent.click` and pass, but the real Showcase has `draggable` enabled. The Carousel viewport captures pointer input during `pointerdown`; arrow buttons live inside that viewport. This creates a credible browser-only event-ownership defect that JSDOM click tests do not exercise.

Next action:

- reproduce through Playwright pointer/click behavior;
- ensure drag gesture ownership ignores interactive descendants or otherwise separates arrow hit targets from draggable pointer capture;
- restore the documented `carousel-prev-arrow` / `carousel-next-arrow` semantic slots on the real buttons;
- add a browser contract proving previous/next buttons change the active slide;
- close during Interaction State Foundation at the latest.

Resolution evidence: Carousel now ignores interactive descendants when beginning drag capture, restores `carousel-prev-arrow` / `carousel-next-arrow` on the real buttons, and Canonical Visual Golden Smoke #479 passed the real-browser click contract (59/59 suite). CI #562, Blog parity #540 and Gosso parity #535 are green.

## FI-D003 — ConfigProvider Showcase does not visibly prove localization

**Status:** open  
**Component:** `core-config-provider`  
**Observed evidence:** Showcase review, 2026-09-18.

The implementation has localization unit coverage, but the current demo mostly renders controls whose localized copy is hidden behind icon accessible labels, opened portals or secondary interactions. A viewer cannot immediately tell what ConfigProvider changed.

Next action:

- redesign the localized demo so English and Chinese effects are simultaneously or clearly observably different;
- expose visible localized component copy/states without requiring source inspection;
- preserve explicit local override precedence in the example;
- add Showcase contract coverage for the visible proof.


## FI-D004 — Tag close hover bypasses semantic Color

**Status:** resolved / certified 2026-09-19  
**Component:** `core-tag`  
**Foundation impact:** Interaction State + reopened Color.

Interaction State inventory exposed `hover:bg-black/10` on Tag's close action. That close action is UI chrome; it is not covered by the caller-owned arbitrary Tag background-color exception.

Resolution:

- derive hover feedback from `currentColor` instead of a fixed raw palette color;
- expand the Color guard and focused conformance test to cover Tag close hover;
- keep `core-tag` reopened until exact-head CI/visual/consumer gates confirm the correction.

Resolution evidence: `hover:bg-current/10` is guarded by Color and State conformance; CI #562 reports zero raw product palette bypasses and zero state-geometry bypasses, Golden #479 is green, and Blog/Gosso parity #540/#535 passed.
