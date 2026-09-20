# Gouno UI Canonical Showcase Audit

Status: **active**
Program id: **CSA-001**
Started: 2026-09-20

## Why this exists

FI-001 certified the design-system foundations and automated evidence chain. That is necessary, but it does not prove that every composed Showcase surface is a good canonical product/design reference.

CSA-001 therefore audits the **rendered Showcase itself** before additional Consumer reverse migration is allowed to propagate. The authority order is:

```text
Foundation / Core authority
        ↓
Pattern / Gouno composition
        ↓
Rendered Showcase manual review
        ↓
Canonical Reference
        ↓
Consumer reverse migration + parity
```

Automated checks support the review; they do not replace it.

## Current migration policy

Consumer expansion is paused while CSA-001 establishes the reviewed Canonical baseline.

Existing verified Consumer certifications remain evidence, not automatic proof that the corresponding Showcase composition is globally canonical. If CSA-001 changes a canonical path covered by a verified Consumer, follow the recertification protocol in `AGENTS.md` before landing the change.

## Review states

| State | Meaning |
| --- | --- |
| `implemented` | Surface exists and may have automated coverage, but has not passed this manual browser-render review. |
| `manual-reviewed` | Actual rendered output and meaningful states/interactions have been inspected. Findings are classified and no unresolved acceptance blocker remains. |
| `canonical` | Manual review passed, ownership/rules are explicit, and regression evidence exists for discovered systemic risks. |
| `reopened` | A later rendered defect invalidated prior Canonical acceptance. |
| `blocked` | Review cannot complete because required rendered/state evidence is unavailable or broken. |

## Mandatory review dimensions

Review each applicable dimension directly in rendered browser evidence:

- information hierarchy and semantic heading/title ownership;
- Typography role, line-height, wrapping and title/description rhythm;
- spacing and vertical rhythm;
- page/container/surface edge alignment;
- Card/Table/List/section boundary ownership;
- grid/flex geometry and visual balance;
- form density and field/action relationships;
- loading/empty/error/success/privileged state placement;
- Drawer/Modal/Popup geometry and overlay stacking;
- scroll ownership, reset behavior and sticky regions;
- interaction feedback and meaningful click/keyboard paths;
- desktop/mobile responsive composition;
- consistency with sibling surfaces in the same family.

## Execution order

### CSA-0 — Stabilize the prior work

- stop new Consumer reverse-migration scope;
- close obsolete Consumer branches/PRs instead of keeping parallel historical implementations alive;
- finish only already-reviewed, merge-ready Consumer checkpoints;
- do not treat Consumer green checks as a substitute for Showcase review.

### CSA-1 — Foundation presentation sanity pass

Review representative rendered evidence for Typography, Spacing/Layout/Density, Surface/Elevation, Responsive, Overlay and Interaction State. This is a sanity pass over FI-001 results, not an automatic Foundation reopening.

A Foundation is reopened only when the rendered evidence demonstrates that its current authority is wrong/incomplete.

### CSA-2 — Core component real-browser pass

Operate representative components in Showcase, including meaningful state/overlay/keyboard paths. Prioritize components with browser-only failure history and components that establish composition geometry.

### CSA-3 — Pattern/Gouno composition pass

Review page-level composition contracts such as Tab Panel Lead, Dedicated Editor, Editor Form, Collection, Record Detail, Master-Detail, PageHeader/Toolbar/Filter families and privileged-operation presentation.

### CSA-4 — Product Showcase page pass

Walk Gosso Admin, Blog Admin and Blog fixtures as rendered products. Pages are reviewed family-by-family rather than by isolated DOM marker.

### CSA-5 — Canonical freeze and Consumer resume

- publish the accepted Canonical matrix;
- resume Consumer reverse migration only from accepted surfaces;
- Consumer parity remains manual-first plus automated regression evidence.

## Initial rendered evidence reviewed

The 2026-09-20 Blog Showcase Parity browser artifact was inspected directly as a rendered source, not inferred from test status.

### Blog Admin / Categories — initial sanity sample

Evidence inspected:

- light desktop collection;
- light Categories Drawer;
- Product counterpart for both surfaces.

Initial finding:

- page title/subtitle rhythm, table edge alignment, primary action placement, Drawer width, field rhythm and footer action geometry are visually coherent in the inspected sample;
- Product shell/navigation copy differs intentionally, while the content axis and editor composition remain comparable;
- no Foundation reopening is justified by this sample.

Classification: **sanity evidence only**. This does not promote the entire Blog Admin workspace or the entire Foundation set to `canonical` under CSA-001.

### Blog Admin / AI Settings — initial sanity sample

Rendered Showcase evidence inspected for the Tools and Agents tabs.

Initial finding:

- the top-level AI Settings hierarchy is stable across the inspected tabs;
- Tabs-to-panel rhythm and the panel lead area are visually consistent in these samples;
- the previous class of “tab subtitle height/rhythm drift” is not visible in these two captured states;
- this remains a sample, not a full family acceptance. Dedicated editors, Drawers, Knowledge/Provider/Connector states and responsive states still require explicit CSA review.

## Progress

| Phase | Status | Notes |
| --- | --- | --- |
| CSA-0 Stabilize | in progress | Obsolete Blog AI reverse-migration PR closed; final Core Wave 2 checkpoint is being completed. |
| CSA-1 Foundation sanity | started | First rendered samples inspected; no Foundation reopened yet. |
| CSA-2 Core browser pass | planned | Starts after CSA-0 checkpoint lands. |
| CSA-3 Pattern/Gouno pass | planned | |
| CSA-4 Product Showcase pages | planned | |
| CSA-5 Canonical freeze / Consumer resume | planned | |

## Rule for future progress claims

Do not report “Showcase aligned”, “Canonical”, “finished”, or equivalent solely from static checks, source markers, CI success, visual-diff thresholds or parity scripts.

A completion claim must name the manually reviewed rendered scope and the unresolved/reopened findings, if any.
