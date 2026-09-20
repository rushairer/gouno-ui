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

## CSA-1 manual browser sanity evidence — batch 1

The following surfaces were inspected from actual Chromium/Playwright rendered captures. Automated parity status was not used as the acceptance decision.

### AI Settings — Dedicated Agent editor

Reviewed rendered state: create Agent.

Observed:

- the page-level `AI 设置` title remains the top information level;
- `创建 Agent` is visually subordinate while still reading as the task title;
- the back action is separated from task identity rather than competing with the title;
- section Cards use a consistent title/description/body rhythm;
- the two-column desktop composition has a clear primary/secondary relationship and does not reintroduce equal-size H1/H2 behavior.

Decision: no Typography/Layout Foundation reopening. The Dedicated Editor pattern remains **manual-reviewed for this state only**, not yet Canonical for the full family.

### AI Settings — Dedicated Skill editor

Reviewed rendered state: create Skill.

Observed:

- task-title hierarchy matches the Agent editor rather than defining a second page-title grammar;
- section-header typography and field density remain consistent between left/right regions;
- action/field grouping is coherent and no page-local spacing anomaly is visible in the captured state.

Decision: no Foundation reopening. This state strengthens the Dedicated Editor family evidence but does not yet complete the family.

### AI Settings — Provider Drawer

Reviewed rendered state: add model connection.

Observed:

- the Drawer starts below the Showcase tooling strip and owns its own overlay layer correctly;
- Drawer header, content and footer have clear boundaries;
- contextual editor Cards retain a shared field rhythm;
- the fixed footer actions remain visually separated from form content;
- the underlying page is dimmed without losing the modal/overlay depth relationship.

Decision: no Overlay/Surface/Layout Foundation reopening. Drawer composition remains **manual-reviewed for this state only**.

### Post Editor — mobile

Reviewed rendered state: 390px-class mobile editor capture.

Observed:

- shell navigation collapses before editor content;
- command actions remain reachable without horizontal overflow;
- outline/history navigation, editor metadata and fields stack onto one content axis;
- the mobile composition does not merely shrink the desktop grid.

Decision: no Responsive/Layout Foundation reopening from this state. The complete editor family still requires explicit interactive/scroll review before Canonical acceptance.

## CSA-1 batch-1 conclusion

The first sanity batch supports the existing FI-001 authorities for Typography, Layout, Surface, Overlay and Responsive behavior. **No Foundation is reopened.**

This is deliberately weaker than a global Showcase certification. The reviewed states are evidence inputs for CSA-2/CSA-3; they do not authorize resuming Consumer expansion yet.

## Progress

| Phase | Status | Notes |
| --- | --- | --- |
| CSA-0 Stabilize | complete | Obsolete Blog AI reverse-migration PR closed; Blog Core Wave 2 merged to `gouno-blog/main` at `5e20df79`; Consumer expansion is frozen at this checkpoint. |
| CSA-1 Foundation sanity | in progress | Batch 1 covers Categories, AI Settings tab leads, Dedicated Agent/Skill editors, Provider Drawer and mobile Post Editor; no Foundation reopened. |
| CSA-2 Core browser pass | in progress | Wave A manually accepted for Focus, Modal/Popover, Form/Select, ConfigProvider, Carousel and Steps; additional Core families remain. |
| CSA-3 Pattern/Gouno pass | planned | |
| CSA-4 Product Showcase pages | planned | |
| CSA-5 Canonical freeze / Consumer resume | planned | |

## Rule for future progress claims

Do not report “Showcase aligned”, “Canonical”, “finished”, or equivalent solely from static checks, source markers, CI success, visual-diff thresholds or parity scripts.

A completion claim must name the manually reviewed rendered scope and the unresolved/reopened findings, if any.


## CSA-2 Wave A manual finding — Core Steps

Source evidence: Canonical Visual Golden Smoke run `35499388006`, artifact `10601489776`.

Human review of the first dedicated Core evidence batch found that the 700px Steps state is **not acceptable as Canonical** even though the Playwright geometry test passed:

- the horizontal composition resumes immediately above `sm`;
- the second step title `Security` truncates visibly to `S...`;
- four title/content lanes are cramped at this intermediate width;
- therefore the test proved geometry, but not readable product composition.

Classification: `core-steps` Responsive implementation defect. Responsive is reopened only for this component; the canonical breakpoint scale is not reopened.

Planned correction already in the candidate branch: keep the complete responsive stack below canonical `md`, validate 700px remains vertical and 800px is horizontal, and capture separate stacked / desktop-inline / vertical-dot evidence.

The same manual pass also found two **evidence-quality defects**, not component defects:

- Focus evidence captured only the fallback probe after focus had left the real Button;
- ConfigProvider evidence did not frame the localized comparison region clearly enough for human review.

Both evidence captures are being corrected before Wave A can be accepted.


### CSA-D001 iteration 2 — breakpoint-only correction was insufficient

The first candidate moved the automatic stack threshold from canonical `sm` to `md`. Fresh artifact `10601841164` from Golden run `35499670227` proved that 700px now stayed vertical, but human review of the 800px horizontal state still showed `Security` truncated as `Sec...`.

This rules out a viewport-threshold-only fix. AppShell also restores its 288px sidebar at `lg`, so viewport width cannot reliably stand in for the actual Steps content track.

The revised Core contract is:

- below `md`: use the complete vertical responsive composition;
- at/above `md`: each horizontal Step owns a readable `min-w-44` track;
- the existing root `overflow-x-auto` absorbs constrained-container width pressure instead of sacrificing ordinary title readability;
- explicitly verify 700px stacked, 800px horizontal, and 1024px AppShell/sidebar-constrained states;
- keep the vertical-dot geometry evidence separate.

Focus fallback evidence is also changed back to a full-page capture after moving the probe away from navigation, because a tight locator screenshot clipped the actual outline and was not independently reviewable.


## CSA-2 Wave A acceptance

Wave A is accepted as **manual-reviewed evidence**, not as completion of the entire Core catalog.

Final exact-head machine evidence:

- CI `35500169813` — success;
- Canonical Visual Golden Smoke `35500170014` — success;
- Blog Consumer Parity `35500169770` — success;
- Gosso Admin Consumer Parity `35500169802` — success.

Final artifact `10601014647` was inspected directly. Accepted rendered states include:

- component-owned Button focus and Base fallback focus;
- nested Modal + Popover layering;
- Form + open Select;
- Modal focus-trap state;
- ConfigProvider zh-CN / en-US visible comparison and caller override;
- Carousel after real next-arrow interaction;
- Steps 600px mobile stack, 700px intermediate stack, 800px horizontal inline composition, 1024px AppShell-constrained overflow ownership, and explicit vertical-dot geometry.

The manual pass found CSA-D001, rejected the first breakpoint-only correction, and accepted the second correction only after `Security` remained readable at 800px and 1024px. Responsive/core-steps is therefore re-certified.

Wave A does **not** authorize claiming all Core components are Canonical. CSA-2 remains in progress and continues family-by-family.


## CSA-2 Wave B — picker / popup / overlay family

Status: **in progress**

Wave B targets browser-rendered interaction families whose correctness cannot be established from source/API review alone:

- Select visible self-rendered popup versus hidden native form bridge;
- Cascader multi-column hierarchy;
- TreeSelect single and multiple tree popup;
- Dropdown action menu;
- Popover contextual surface;
- Drawer overlay composition.

The first inspection of source registration found that the legacy/simple `data-entry.tsx` snippets are **not** the active Cascader/TreeSelect canonical demos: the final registry overrides them with `data-entry-review-6d6/6d7`, backed by real multi-level demos. Therefore no defect is recorded for the legacy snippet itself.

Wave B adds explicit Chromium evidence captures for the final registered surfaces. No component is accepted merely because the DOM/ARIA assertions pass; the generated artifact must be inspected manually before Wave B acceptance.


## CSA-2 Wave B acceptance — picker / popup / overlay family

Wave B is accepted as **manual-reviewed rendered evidence**.

Exact-head machine evidence before acceptance:

- CI `35501490513` — success;
- Canonical Visual Golden Smoke `35501490432` — success;
- Blog Consumer Parity `35501490415` — success;
- Gosso Admin Consumer Parity `35501490441` — success;
- rendered artifact `10602856830` inspected directly.

Accepted rendered states:

- Select — visible self-rendered listbox popup, focus ring and option highlight;
- Cascader — three-column hierarchical popup with active-path highlighting and aligned column boundaries;
- TreeSelect single — tree popup with expanded branch, selected item and trigger relationship;
- TreeSelect multiple — checkable tree popup with selected tags and branch/checkbox hierarchy;
- Dropdown — action menu with label/action/destructive hierarchy;
- Popover — contextual surface anchored to its trigger without pretending to be Modal/Drawer;
- Drawer — right-side modal surface, Showcase tooling offset, overlay depth, header/close ownership and focused input.

Manual review found **no Foundation reopening** in this wave. The active final Cascader/TreeSelect registry entries are the reviewed multi-level implementations; legacy simple snippets are not treated as canonical evidence.

This acceptance is family-scoped. CSA-2 remains in progress for the remaining Core catalog.


## CSA-2 Wave C — navigation / disclosure family

Status: **in progress**

Wave C targets interactive navigation/disclosure surfaces that were historically reviewed but did not yet have dedicated human-reviewable Canonical Golden states:

- Tabs — real active-tab transition and panel ownership;
- Menu — inline hierarchy, submenu expanded state and selected leaf;
- Collapse — accordion transition and disclosure state;
- Pagination — real page transition and current-page state;
- Breadcrumb — real attached navigation menu;
- Anchor — native hash navigation to a real target section.

No component behavior is changed in the initial candidate. The generated Chromium artifact must be inspected manually before any Wave C family is promoted to CSA manual-reviewed evidence.
