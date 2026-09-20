# Foundation Integrity Open Defects

Updated: 2026-09-19

This queue records defects discovered while the Foundation Integrity Program is active. A defect does not silently remain under a `reviewed` component entry. It is either resolved in the relevant Foundation or explicitly carried into the final defect sweep.

## FI-D001 — Steps connector / copy geometry

**Status:** resolved / certified 2026-09-19  
**Component:** `core-steps`  
**Observed evidence:** Showcase Steps variant screenshot, 2026-09-18.

The horizontal and vertical connector geometry does not maintain a convincing spatial relationship to the marker/title/content block. In the current implementation the connector is absolutely positioned from the marker while the title/content remain transparent siblings above it, which allows connector geometry to visually compete with text.

Next action:

- verify horizontal and vertical layouts in browser;
- determine whether this is a local Steps composition defect or evidence of a broader Layout/Spacing authority gap;
- if local, fix Steps and add geometry/browser regression evidence;
- if systemic, reopen the owning Foundation before recertification.

Finding: this is a local Steps connector-geometry defect plus a Responsive implementation gap. Responsive is reopened only for `core-steps`; canonical breakpoint/Layout/Spacing authority remains unchanged. The source fix gives horizontal copy an independent connector lane, gives dot markers their own offsets, and converts the complete max-sm item/body/connector composition rather than only the root flex direction.

Resolution evidence: CI #568 reports zero arbitrary responsive variants and zero px-width media queries with 168/168 test files and 866/866 tests passing. Canonical Visual Golden Smoke #485 passed the strengthened Steps geometry contract and all 60 browser tests. Blog parity #546 and Gosso parity #541 are green. Responsive is re-certified.

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

**Status:** resolved / certified 2026-09-19  
**Component:** `core-config-provider`  
**Observed evidence:** Showcase review, 2026-09-18.

The implementation has localization unit coverage, but the current demo mostly renders controls whose localized copy is hidden behind icon accessible labels, opened portals or secondary interactions. A viewer cannot immediately tell what ConfigProvider changed.

Next action:

- redesign the localized demo so English and Chinese effects are simultaneously or clearly observably different;
- expose visible localized component copy/states without requiring source inspection;
- preserve explicit local override precedence in the example;
- add Showcase contract coverage for the visible proof.

Implementation: the localized demo now renders zh-CN and en-US Providers simultaneously. An empty Select visibly shows `请选择` versus `Please select`; Pagination visibly shows localized previous/next/page-size/jump copy; a second Select proves an explicit product `placeholder` overrides Provider defaults. `tests/showcase-config-provider-demo.test.tsx` guards these visible differences.

Resolution evidence: focused Showcase tests pass in CI #568, and Canonical Visual Golden Smoke #485 directly exercises `showcase-config-provider-visibly-proves-locale-ownership` in a real browser. Blog parity #546 and Gosso parity #541 are green.


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


## CSA-D001 — Steps intermediate-width readability

**Status:** open / Responsive reopened 2026-09-20  
**Component:** `core-steps`  
**Observed evidence:** CSA-001 Canonical Visual Golden run `35499388006`, artifact `10601489776`, 700px Steps capture.

The prior FI-D001 browser contract proved connector geometry and the complete `max-sm` composition, but manual review of the rendered 700px state showed that the horizontal lane resumed too early. `Security` was visibly truncated to `S...`, and four content columns became cramped even while all geometry assertions remained green.

Resolution target:

- use canonical `md` rather than `sm` as the automatic horizontal/vertical Steps threshold;
- keep the entire item/body/connector composition on the same responsive threshold;
- give horizontal items a readable `min-w-44` track and let the root horizontal overflow own constrained-container pressure;
- preserve `responsive={false}`;
- capture separate human-reviewable evidence for 700px stacked, 800px desktop-inline, 1024px shell-constrained, and vertical-dot layouts;
- re-certify Responsive/core-steps only after exact-head CI, Golden, Blog/Gosso reciprocal parity and manual screenshot review succeed.
