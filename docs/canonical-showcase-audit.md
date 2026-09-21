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
| CSA-2 Core browser pass | complete | Waves A–J manually accepted across the full Core catalog. Wave J closes the final residual families; Modal is normalized from Wave A accepted nested-overlay and focus-trap evidence. |
| CSA-3 Pattern/Gouno pass | complete | Waves K–M manually accepted across all 15 Pattern/Gouno catalog families. TabPanelLead and PrivilegedAccessGate are also accepted as non-catalog cross-product composition contracts. |
| CSA-4 Product Showcase pages | in progress | Waves N–O accepted: the complete Blog Admin Product Showcase family is manually reviewed. Wave P will audit Gosso Admin product pages. |
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


## CSA-2 Wave C acceptance — navigation / disclosure family

Wave C is accepted as **manual-reviewed rendered evidence**.

Exact-head evidence for implementation head `ff53706553734c538ce7a72bc9f741e5b8e6c1c4`:

- CI `35504322987` — success;
- Canonical Visual Golden Smoke `35504322968` — success;
- Blog Consumer Parity `35504322951` — success;
- Gosso Admin Consumer Parity `35504323051` — success;
- rendered artifact `10603377374` inspected directly.

Accepted rendered/browser states:

- Tabs — changed from 概览 to 报告; selected indicator, icon/text rhythm and owned panel content remain coherent;
- Menu — Workspace submenu remains expanded while Roles is the selected leaf; hierarchy, disabled item and divider/action grouping remain legible;
- Collapse — accordion moves from Public API to Interaction behavior; expanded body, extra Docs action and disabled panel retain clear ownership;
- Pagination — base demo transitions from page 6 to page 7, with `aria-current=page`, selected-page emphasis, ellipsis geometry and neighboring navigation preserved;
- Breadcrumb — Projects menu opens as an attached navigation popup without disrupting breadcrumb separator rhythm;
- Anchor — clicking 交互契约 updates the real hash and reaches the target section without fixed-header obstruction.

The first two Pagination browser attempts failed because the evidence locator incorrectly assumed visible page-number text was the localized accessible name. Core Pagination was not changed: implementation and existing focused tests already proved `aria-current=page`. The evidence was corrected to scope the canonical 基础用法 Card and use the visible page-number target while retaining the semantic post-click assertion.

Manual review found **no Foundation reopening** in Wave C. Anchor acceptance is intentionally split: browser assertions prove hash/target behavior, while the rendered capture proves the target landing position; the screenshot alone is not treated as proof of Anchor state.

This acceptance is family-scoped. CSA-2 remains in progress for the remaining Core catalog.


## CSA-2 Wave D — feedback / status family

Status: **accepted / manual-reviewed**

Wave D targets rendered feedback/state surfaces where semantic correctness alone is insufficient:

- Alert — four semantic tones plus closable lifecycle/reset;
- Popconfirm — destructive confirmation overlay and action hierarchy;
- Message — simultaneous success/error transient feedback;
- Notification — mixed success/error/persistent queue composition;
- Empty — contained empty-state rhythm, copy and action ownership;
- Result — success end-state hierarchy and recovery/next action;
- Spin — busy overlay, retained underlying content and tip relationship.

The initial candidate changes only browser evidence and audit guards. No Core runtime behavior is changed before manual inspection. Wave D can be accepted only after exact-head CI, Golden, Blog/Gosso reciprocal parity and direct review of the generated Chromium artifact.


### CSA-D002 — Showcase tooling occludes global notice overlays

Status: **resolved / accepted 2026-09-20**

Direct inspection of Golden artifact `10603448285` found a rendered defect that automated success did not catch:

- the first Message item was partially clipped behind the top Showcase Fixture tooling strip;
- the first Notification item was likewise hidden underneath the tooling strip;
- later queue items remained visible, which made the defect easy to miss from DOM/role assertions alone.

Classification: **Showcase Fixture integration defect**, not a Core Message/Notification runtime or Layer Foundation defect. Core correctly owns a viewport-level `top-4` notice inset. Fixture tooling is intentionally outside the runtime layer scale and already publishes `--showcase-tools-inset-top` for portaled Sheet safe-area correction.

Correction contract:

- in Fixture mode only, Message and Notification regions start at `showcase tools inset + 1rem`;
- Core runtime files must not learn about Showcase tooling;
- Fixture contract tests guard both notice-region selectors and the safe-area expression;
- Chromium evidence asserts rendered notice-region geometry is fully below the Showcase tools strip before screenshots are accepted.

No Foundation is reopened by CSA-D002. Wave D remains blocked until fresh exact-head CI, Golden, Blog/Gosso parity and direct artifact review confirm the correction.


### CSA-D002 resolution

CSA-D002 is resolved without changing Core Message or Notification.

The fix remains Showcase-owned:

- `FixtureTools` continues to publish the measured `--showcase-tools-inset-top`;
- Showcase CSS offsets `message-region` and `notification-region` to `tools inset + 1rem` only while a product preview is mounted;
- `tests/showcase-fixture-dock.test.tsx` guards the integration contract;
- Playwright verifies the rendered queue region is geometrically below the tooling strip before accepting screenshots.

Fresh exact-head evidence for implementation head `85d7580551469633ab15c2371b6356d5f2a81c5b`:

- CI `35505470539` — success;
- Canonical Visual Golden Smoke `35505470593` — success;
- Golden artifact `10603845661` — directly inspected;
- Blog Consumer Parity `35505470549` — success;
- Gosso Admin Consumer Parity `35505470579` — success.

Manual re-review confirmed that both Message items and all three Notification items are fully visible below Showcase tooling. No Layer/Foundation authority was changed or reopened.

## CSA-2 Wave D acceptance — feedback / status family

Wave D is accepted as **manual-reviewed rendered evidence**.

Accepted rendered/browser states:

- Alert — success/info/warning/error tones remain distinguishable without changing component geometry; closable Alert keeps action/close/reset ownership coherent;
- Popconfirm — destructive confirmation keeps modal depth, title/description hierarchy and cancel/delete action order clear while Showcase tooling stays outside the product mask;
- Message — simultaneous success/error feedback is fully visible, vertically ordered and no longer clipped by Fixture tooling;
- Notification — success/error/persistent notices remain fully visible, preserve semantic icon/tone and close affordances, and maintain consistent queue spacing;
- Empty — contained empty state keeps icon/title/description/action rhythm with the surrounding Card owning the surface;
- Result — success terminal state keeps icon/title/description/action hierarchy without introducing a competing surface;
- Spin — busy overlay keeps prior content legible beneath the active spinner/tip state.

The initial all-green Wave D artifact was deliberately rejected after direct visual review exposed CSA-D002. Acceptance happened only after owner classification, Showcase-only safe-area correction, static integration protection, rendered geometry assertions, fresh reciprocal consumer parity, and a second direct artifact review.

No Foundation is reopened by Wave D. This acceptance is family-scoped; CSA-2 remains active for the remaining Core catalog.


## CSA-2 Wave E — remaining Feedback family

Status: **accepted / manual-reviewed**

Wave E completes the remaining Feedback-family surfaces that still lack dedicated human-reviewable CSA browser evidence:

- Progress — real 64% → 74% state transition, fill geometry and adjacent status/action rhythm;
- Skeleton — two-Card loading structure, decorative placeholder ownership and visual density;
- Tooltip — keyboard-focus opening, bottom-start anchoring and popup depth;
- Tour — real two-step modal walkthrough, progress/action hierarchy and focus return after completion.

The initial candidate changes only browser evidence, the durable CSA evidence guard and this audit entry. Core runtime behavior is not modified before direct rendered inspection.

Acceptance requires all of the following on the same exact head:

- CI;
- Canonical Visual Golden;
- Blog Consumer Parity;
- Gosso Admin Consumer Parity;
- direct inspection of the rendered Wave E artifact.

Any visual/interaction defect discovered by the manual pass must be classified and fixed at its owning layer before Wave E can be accepted.


## CSA-2 Wave E acceptance — remaining Feedback family

Wave E is accepted as **manual-reviewed rendered evidence**.

Exact-head evidence for implementation head `9558a73579ed94e3123880a324773f31d014030d`:

- CI `35506209175` — success;
- Canonical Visual Golden Smoke `35506209152` — success;
- Blog Consumer Parity `35506209186` — success;
- Gosso Admin Consumer Parity `35506209177` — success;
- rendered artifact `10604550138` inspected directly.

Accepted rendered/browser states:

- Progress — clicking 增加 moves the canonical state from 64% to 74%; the visual fill, accessible value, localized status text and neighboring controls stay coherent;
- Skeleton — two loading Cards retain equal structure and density while all eight Skeleton blocks remain decorative; surrounding Card owns the surface;
- Tooltip — keyboard focus opens the real Tooltip below the trigger with visible trigger focus, aligned popup/arrow geometry and canonical popup depth;
- Tour — the walkthrough renders step 1 and step 2 as distinct modal states, keeps progress and navigation hierarchy clear, starts its product mask below Showcase tooling, and returns focus to 开始引导 after completion.

Direct review found **no Wave E defect requiring Foundation or Core reopening**. The Tour review respects its current admitted contract: it is a modal walkthrough and does not imply target spotlight/anchoring capability that Core does not implement.

With Wave E accepted, the Feedback family now has dedicated CSA browser evidence across Alert, Progress, Skeleton, Modal, Drawer, Popover, Tooltip, Popconfirm, Message, Notification, Empty, Result, Spin and Tour. CSA-2 remains active for the remaining Core catalog.


## CSA-2 Wave F — selection / direct-input controls

Status: **candidate / awaiting machine + rendered review**

Wave F extends the Core browser pass to interaction states that are easy to over-credit from static API coverage alone:

- Checkbox — checked → unchecked lifecycle plus disabled peer;
- Radio — mutually exclusive plan selection plus disabled peer;
- Switch — on → off state plus disabled peer;
- Segmented — real radio-group selection change;
- Slider — native keyboard step transition with synchronized visible value;
- Rate — explicit score transition with radiogroup state;
- InputOTP — focus progression and six-digit entry with disabled masked peer.

Candidate evidence names are guarded by `scripts/check-canonical-showcase-audit.mjs`.
No component is promoted by this commit. Wave F is accepted only after exact-head CI, Canonical Golden, reciprocal Blog/Gosso parity, and manual inspection of the generated rendered evidence.


### Wave F evidence-target correction

The first Wave F Golden run on `b2866632` passed CI plus both reciprocal consumer parity jobs, but the Canonical Golden browser job rejected two evidence interactions:

- Switch evidence clicked the visually hidden native checkbox instead of its visible label surface;
- Segmented evidence clicked the visually hidden native radio instead of the visible segmented item surface.

The browser reported pointer interception by the visible labels. This is classified as an **evidence-driver defect**, not a Core component defect: the canonical controls intentionally use visually hidden native inputs behind visible label-owned hit targets. The candidate is corrected to exercise the actual visible interaction surfaces. No Foundation/API review is reopened by this finding.

## CSA-2 Wave G — complex input / assisted-entry controls

Status: **candidate / batched with Wave F**

Wave G adds real-browser evidence for:

- InputNumber — controlled formatted value and keyboard step transition;
- DatePicker — controlled value plus explicit clear lifecycle;
- DateRangePicker — start-date update while preserving the end-date contract;
- TimePicker — native time value update plus warning state;
- ColorPicker — browser-native color value, keyboard focus and warning state;
- Upload — controlled image selection and rendered file-list ownership;
- AutoComplete — filtered popup, disabled option and keyboard confirmation;
- Mentions — active mention popup, keyboard highlight and selection commit;
- Transfer — source selection, operation enablement and real item movement.

ColorPicker intentionally does not attempt to automate the operating-system color dialog; CSA evidence owns the web-visible input/focus/state surface while the browser/OS owns the native picker chrome.

Wave G is **not accepted by source or test existence**. The batch must pass one exact-head CI/Canonical Golden/Blog parity/Gosso parity cycle, then the generated Wave F and Wave G rendered evidence must be inspected family-by-family.


## CSA-2 Waves F-G acceptance

Status: **accepted / manual-reviewed**

Accepted implementation head: `0db47f095792aa58e4742eaa05697398781b67d7`.

Exact-head machine evidence:

- CI `35522972664` — success;
- Canonical Visual Golden Smoke `35522972649` — success;
- Blog Consumer Parity `35522972674` — success;
- Gosso Admin Consumer Parity `35522972659` — success;
- rendered Golden artifact `10609207461` inspected directly.

Wave F accepted rendered states:

- Checkbox — checked-to-unchecked lifecycle plus disabled peer;
- Radio — mutually exclusive selection transition plus disabled peer;
- Switch — visible label-owned hit target, on-to-off transition and disabled checked peer;
- Segmented — visible item-owned hit target and real radiogroup selection transition;
- Slider — native keyboard step from 40 to 45 plus disabled peer;
- Rate — score transition to 5 with radiogroup state plus disabled example;
- InputOTP — sequential six-digit entry, focus progression and disabled masked peer.

Wave G accepted rendered states:

- InputNumber — formatted controlled value and keyboard step to 1380;
- DatePicker — controlled date cleared to the explicit empty state;
- DateRangePicker — start date changed while the end date remained stable;
- TimePicker — native time update plus warning-state peer;
- ColorPicker — browser-native value, visible keyboard focus and warning-state peer;
- Upload — controlled image selection and caller-owned rendered file list;
- AutoComplete — filtered popup with active enabled option and disabled option, followed by keyboard commit;
- Mentions — active mention popup, keyboard highlight movement and committed mention;
- Transfer — source selection, enabled add operation and visible item movement into the target list.

Manual review found no Foundation/Core defect requiring reopening. The first Wave F Golden failure is retained as evidence of an **evidence-driver defect**: Playwright initially targeted visually hidden native bridges instead of visible label-owned hit targets. The corrected evidence exercises the same surfaces a user clicks.

Native Date/Time/Color browser chrome is platform-owned. CSA acceptance covers the Gouno-owned web input geometry, state/focus treatment, value contract and composition; it does not attempt to restyle or automate operating-system picker chrome.

This acceptance remains family-scoped. **CSA-2 is still in progress** for the remaining Core catalog.


## CSA-2 Wave H — Data Display

Status: **accepted / manual-reviewed**

Wave H audits the Data Display family as composed browser surfaces rather than treating prior API/foundation coverage as sufficient:

- List — localized Empty, active loading overlay and explicit Load More composition;
- Descriptions — bordered vertical layout, long-value wrapping and single-column responsive collapse at 600px;
- Calendar — controlled selected date, week-number column and real date-selection transition;
- Image — deterministic fallback image, controlled preview overlay and zoom/rotate transform toolbar;
- Table — selected/disabled row treatment, caption/footer ownership and compact/touch/sticky density variants;
- Statistic — caller-owned label/value/suffix hierarchy without manufacturing a Card;
- Timeline — alternate vertical and reversed horizontal layout semantics;
- Tree — controlled selection plus check state on an expanded hierarchy.

The Image browser evidence intercepts the remote demo image with deterministic SVG bytes. The audit therefore reviews Gouno preview/overlay/transform composition without making Canonical acceptance depend on a third-party image host.

No component is promoted by this candidate. Open the PR only after the complete Wave H evidence/ledger batch is prepared so intermediate branch commits do not repeatedly run CI/Golden/reciprocal parity. Acceptance still requires exact-head CI, Canonical Visual Golden, Blog Consumer Parity, Gosso Admin Consumer Parity, and direct manual inspection of every generated Wave H screenshot.


### CSA-D003 — Image preview action occlusion

The first Wave H Golden run on `6391ecda` produced a real component defect in Image preview rather than an evidence-driver failure.

Observed after the canonical controlled preview was opened, zoomed and rotated:

- the transformed preview image expanded into the action-bar region;
- the toolbar and Close control remained visibly rendered;
- pointer hit-testing landed on the transformed `img`, so a real click on Close was intercepted;
- the same transformed image could therefore obstruct other preview actions despite the controls appearing available.

Classification: **Core Image interaction/local-stacking defect**. `core-image` is reopened for CSA-D003. The global Overlay/Layering Foundation is **not** reopened because this conflict is entirely inside one modal surface; the Overlay inventory explicitly classifies component-internal 1/2/10/20 stacking as local rather than application-global Layer authority.

Candidate correction:

- keep transformed media draggable and interactive;
- give the preview action-bar wrapper explicit component-local stacking above transformed media;
- keep the action bar shrink-stable at the bottom of the dialog;
- retain the existing real-browser regression path: open controlled preview → zoom → rotate → click Close without force-click or DOM bypass.

The correction is not accepted until a fresh exact-head Golden proves the ordinary user click reaches Close after transforms and the rendered evidence is inspected manually.


## CSA-2 Wave H acceptance

Status: **accepted / manual-reviewed**

Accepted implementation head: `5692dff41f524a131f3b15d9a467ac3bc4a4dc30`.

Exact-head machine evidence:

- CI `35524048564` — success;
- Canonical Visual Golden Smoke `35524048559` — success;
- Blog Consumer Parity `35524048556` — success;
- Gosso Admin Consumer Parity `35524048585` — success;
- rendered Golden artifact `10608284046` — inspected directly.

Manual rendered review accepted:

- List — localized Empty and the loading/Load More composition remain legible without manufacturing another page surface;
- Descriptions — at 600px the bordered vertical example collapses to a single readable column and the long Notes value wraps correctly;
- Calendar — September 18 becomes the actual selected date while week numbers and today/selection distinction remain readable;
- Image — after fallback load, controlled preview, zoom and rotate, the transformed image no longer pointer-occludes the visible action bar; toolbar and Close remain clearly usable;
- Table — compact/touch density examples preserve table structure and selected/disabled/footer/caption treatment remains coherent;
- Statistic — title/value/unit hierarchy remains compact and does not smuggle dashboard-card semantics into Core;
- Timeline — alternate vertical and reversed horizontal variants retain clear rail/node/title alignment;
- Tree — expanded hierarchy, selected Theme node and checked file state remain visually distinguishable.

### CSA-D003 certification

CSA-D003 is **certified** at `5692dff4`.

The defect was not suppressed with `force` clicking or a test-only bypass. Core Image now gives the preview action-bar wrapper explicit component-local stacking above transformed preview media. The regression path performs the ordinary user sequence:

`open controlled preview → zoom → rotate → ordinary Close click`.

That path passes in Chromium and the resulting transformed-preview screenshot was inspected manually. Because the fix is local to a single modal surface, FI-001 global Overlay/Layering authority remains closed; no application-global z-index policy was reopened.

Wave H acceptance remains family-scoped. **CSA-2 is still in progress** for the remaining Core catalog.


## CSA-2 Wave I — General + Layout

Status: **accepted / manual-reviewed**

Wave I groups the remaining General and Layout surfaces because they jointly define the visual grammar that page/product compositions inherit. The batch is prepared completely before opening a PR so intermediate commits do not repeatedly consume CI/Golden/parity runs.

General evidence:

- Icon — decorative versus named semantics, semantic sizes, loading rotation and explicit pixel/rotation geometry;
- Typography — document heading level remains independent from visual role; H1/H2 using `task` must render with identical typography metrics while `page` remains visually distinct;
- Kbd — shortcut-token rhythm and native `kbd` ownership;
- Badge — zero/overflow/status variants plus a real count update;
- Tag — closable lifecycle, disabled close affordance and non-controlled checkable state;
- Avatar — small/middle/large/custom size geometry plus square/circle shape behavior using deterministic image bytes.

Layout evidence:

- Space — wrapping/split composition and token-owned spacing;
- Flex — row-reverse + wrap-reverse + numeric gap without child wrappers;
- Grid — responsive 24-column behavior at 600 / 820 / 1100 viewport widths;
- Separator — horizontal title/line variants and semantic vertical separator;
- Card — real default → elevated transition while header/content/footer ownership remains stable;
- Splitter — real keyboard resize with `aria-valuenow` transition;
- Page Layout — Header/Sider/Content/Footer region semantics and canonical 240px Sider geometry.

This candidate does **not** promote components by test existence. Acceptance requires one exact-head CI + Canonical Visual Golden + Blog Consumer Parity + Gosso Admin Consumer Parity cycle followed by direct human review of all Wave I rendered evidence. Any defect discovered by rendering must be fixed at its owning layer before acceptance.


### Wave I Badge evidence-name correction

The first Wave I Golden run on `e0dca147` executed 12 of 13 new Wave I tests successfully and failed only the Badge evidence locator.

Root cause: Playwright role-name matching is substring-based unless `exact: true` is supplied. The evidence query for status name `99+` therefore matched both the real `99+` overflow badge and `999+`.

Classification: **evidence-driver defect**, not a Core Badge defect. The rendered Badge API deliberately exposes both overflow examples, and the ambiguity exists only in the test locator. The correction keeps the same user-visible states and requires exact accessible-name matching for 5 / 0 / 99+ / 999+ / 6.

The 12 successful Wave I rendered captures from artifact `10616039018` were pre-reviewed directly; no Core/Foundation defect was identified in those captures. Wave I still requires a fresh exact-head run and a complete artifact including Badge before acceptance.


The second Wave I Golden run on `c41a8c8e` passed every new Wave I case except the same Badge evidence path, after exact accessible-name matching had been corrected.

The remaining failure was again evidence-only: the test derived its Demo Card locator from the transient text `当前计数：5`. The real Badge state update succeeded, but after the click that text disappeared, so Playwright's live locator could no longer resolve the ancestor Card when checking `当前计数：6`.

Correction: anchor the Badge evidence scope to the persistent `增加计数` action, then resolve its enclosing canonical Demo Card. This preserves strict same-demo ownership before and after the state transition and avoids any page-global fallback lookup. Core Badge remains unchanged and is not reopened.


## CSA-2 Wave I acceptance

Status: **accepted / manual-reviewed**

Accepted implementation head: `41f83284407f815976ff089f446c3bd84da03720`.

Exact-head machine evidence:

- CI `35551508518` — success;
- Canonical Visual Golden Smoke `35551508552` — success;
- Blog Consumer Parity `35551508534` — success;
- Gosso Admin Consumer Parity `35551508645` — success;
- rendered Golden artifact `10618407856` — inspected directly.

Accepted rendered/browser scope:

- Icon — decorative versus named semantics, small/middle/large and explicit 24px sizing, loading spin and 45-degree rotation;
- Typography — page/task/section roles preserve visual hierarchy while H1/H2 using the same `task` role render with identical typography metrics;
- Kbd — paired keyboard tokens remain compact, aligned and native-semantic;
- Badge — count 5 → 6, zero, 99+/999+ overflow, text, dot/status and offset/size variants remain readable without collisions;
- Tag — Release close lifecycle, disabled close affordance and uncontrolled TypeScript checked → unchecked state preserve interaction hierarchy;
- Avatar — small/middle/large/custom 48px sizing and square/circle geometry remain consistent;
- Space — wrap/split example keeps action rhythm and separator ownership;
- Flex — row-reverse + wrap-reverse + 10px numeric gap remains legible and wrapper-free;
- Grid — responsive Col evidence renders 1 column at 600px, 2 columns at 820px and 4 columns at 1100px;
- Separator — horizontal centered/start/end line variants and named vertical separator retain clear line/content rhythm;
- Card — switching to elevated changes depth without changing header/content/footer composition;
- Splitter — keyboard ArrowRight changes the horizontal split from 36/64 to 37/63 while the focused separator remains usable and visible;
- Page Layout — Header/Sider/Content/Footer semantic regions preserve expected shell hierarchy and 240px Sider geometry.

### Wave I evidence-driver history

Wave I required two Badge evidence corrections before acceptance. Neither was a Core Badge defect:

1. the first run used substring accessible-name matching, so `99+` also matched `999+`;
2. the second run derived the Demo Card from transient `当前计数：5`, so the live locator invalidated itself after the real state update.

The accepted evidence uses exact accessible names and anchors same-demo ownership to the persistent `增加计数` action. No page-global fallback or force interaction is used.

Direct artifact review found **no General/Layout Core or Foundation defect requiring reopening**. Wave I acceptance is family-scoped; CSA-2 remains active only for the residual Core catalog.


## CSA-2 Wave J — residual Core closure

Status: **accepted / manual-reviewed**

Wave J is intentionally the final residual Core browser batch. It adds new rendered evidence only where CSA-2 still has a genuine gap:

- Input — controlled value and real allowClear lifecycle with focus retention;
- Textarea — controlled edit plus live character-count relationship;
- CodeBlock — real copy action, copied feedback and clipboard bytes equal to the displayed canonical source;
- FloatButton — button versus anchor semantics plus keyboard-focus Tooltip;
- QRCode — 180px named canvas plus proof that QR modules were actually rasterized, not merely an empty canvas;
- Watermark — generated SVG tile is present while content-region semantics remain caller-owned;
- Affix — real scrolling inside the demo's overflow ancestor proves sticky containment;
- BackTop — real window scroll followed by ordinary click returns to scrollY=0 under reduced-motion preference.

`core-modal` receives no redundant new capture in Wave J. Wave A already accepted two stronger browser paths on exact-head evidence: nested Modal + Popover layer ordering and Modal focus trapping. Wave J will normalize that accepted evidence into the component review ledger rather than pretending the family was never manually reviewed.

Acceptance requires the same exact-head gate as prior waves: CI, Canonical Visual Golden, Blog Consumer Parity, Gosso Admin Consumer Parity, and direct review of every newly generated Wave J screenshot. A defect found here must be repaired at its owning layer before CSA-2 can complete.


### Wave J evidence-environment correction

The first Wave J Golden run on `32569313` passed 6 of the 8 newly added residual-Core cases and failed only Input clear plus BackTop.

Both failures are classified as **evidence-environment defects**, not Core defects:

- **Input:** embedded Gouno UI fixtures intentionally inherit the default `enUS` component locale, while the first test hard-coded the Chinese accessible name `清除输入`. The corrected evidence scopes to the same canonical `input-group`, requires exactly one clear action with a non-empty accessible label, clicks it normally, and still verifies value clearing plus focus retention. Runtime localization remains unchanged.
- **BackTop:** the canonical embedded Showcase shell is exactly viewport-height and does not naturally create a scrollable `window`, while BackTop's documented contract intentionally listens to `window.scrollY`. The corrected browser evidence adds inert document height inside the test environment, performs a real `window.scrollTo`, then activates BackTop and requires `scrollY === 0`. The component is not changed to observe the Showcase's internal navigation scroller.

Textarea, CodeBlock, FloatButton, QRCode, Watermark and Affix all passed on the first Wave J browser run. No runtime/Core change is justified by these two evidence failures.


## CSA-2 Wave J acceptance and Core completion

Status: **accepted / manual-reviewed**

Accepted implementation head: `0e7de36152cd6e5ce0bf0f764dae6e42d7c7e87c`.

Final exact-head machine evidence:

- CI `35553995914` — success;
- Canonical Visual Golden Smoke `35553996005` — success;
- Blog Consumer Parity `35553995916` — success;
- Gosso Admin Consumer Parity `35553995912` — success;
- rendered Golden artifact `10618943468` — inspected directly.

New Wave J browser evidence accepted:

- Input — controlled `allowClear` clears `Gouno UI` to empty, returns/retains focus on the input and leaves prefix/value-copy geometry coherent;
- Textarea — real edit to ten characters updates the visible `10 / 60` count while preserving the described-by relationship;
- CodeBlock — real copy action changes feedback to `代码已复制`, and clipboard bytes equal the exact displayed canonical source;
- FloatButton — native button and anchor modes remain distinct, and keyboard focus opens the actual Tooltip without replacing ARIA naming;
- QRCode — the named canvas is 180 × 180 CSS/device geometry and contains actual dark rasterized QR modules;
- Watermark — the generated SVG data-URL tile is visible while caller content and region semantics remain readable;
- Affix — real scrolling of the demo overflow ancestor leaves the operation surface sticky at the intended top offset;
- BackTop — after adding inert document height to make the Showcase test window genuinely scrollable, ordinary activation returns `window.scrollY` to zero under reduced-motion preference.

### Wave J evidence-environment history

The first Wave J run on `32569313` passed Textarea, CodeBlock, FloatButton, QRCode, Watermark and Affix but rejected Input and BackTop evidence for test-environment reasons:

- Input hard-coded the Chinese clear label even though embedded `gouno-ui` fixtures intentionally inherit `enUS`;
- BackTop was asked to scroll a viewport-height Showcase document whose `window` had no natural overflow.

The accepted correction does not alter runtime components. Input evidence is scoped to the same canonical `input-group`, requires exactly one labeled clear action, and clicks it normally. BackTop evidence supplies inert document height in the browser test, performs a real window scroll, then clicks the real component. No force-click, page-global fallback or product-specific runtime workaround is used.

### Modal evidence normalization

`core-modal` is also marked manual-reviewed without generating redundant new screenshots. Wave A final evidence already accepted:

- nested Modal + Popover layer ordering;
- Modal focus-trap state.

That evidence came from exact-head Golden run `35500170014`, artifact `10601014647`, alongside CI `35500169813`, Blog parity `35500169770` and Gosso parity `35500169802`. Wave J simply normalizes the already-reviewed Modal family into the component ledger.

## CSA-2 completion

With Wave J accepted, **every Core catalog family now has explicit real-browser manual review evidence or an explicitly normalized prior accepted browser path**. CSA-2 Core component real-browser pass is therefore complete.

This does **not** mean the entire Showcase is Canonical. The next gate is CSA-3 Pattern/Gouno composition: page-level composition contracts such as Tab Panel Lead, Dedicated Editor, Editor Form, Collection, Record Detail, Master-Detail, PageHeader/Toolbar/Filter families and privileged-operation presentation still require family-by-family rendered review before CSA-4 Product page certification or Consumer resume.


## CSA-3 Wave K — page frame and collection actions

Status: **accepted / manual-reviewed**

CSA-3 does not inherit an older `reviewed` flag as proof of rendered composition quality. Historic API tests, FI-001 certification and focused product evidence remain useful inputs, but this phase requires direct browser inspection of the actual page-composition contract.

Wave K starts with the frame that later Pattern/Product families depend on:

- **AppShell** — desktop header/sidebar/main composition, canonical 288px navigation track, embedded PageContainer, mobile navigation trigger, real Sheet navigation and focus return after closing through a navigation action;
- **PageContainer** — the semantic `layout-page-container` track consumes the 90rem maximum-width and 1.5rem page-stack gap authority rather than reintroducing page-local geometry;
- **PageHeader** — route-level H1/description/actions stay one row at desktop width and stack into a clear single content axis below `md`;
- **PageSkeleton** — collection/form/dashboard loading regions retain status/busy semantics; the collection skeleton switches from desktop table geometry to mobile Cards rather than shrinking a table;
- **BulkActionBar** — real selection count changes, business-action feedback, cancel-selection disappearance and restoration verify that the Pattern owns selected-context/action rhythm while callers retain selection/business state.

This first CSA-3 batch is deliberately limited to five foundational families. Admin data compositions will follow as Wave L; Editor/AI/Tab-panel/privileged-operation compositions follow as Wave M. No family is promoted by source markers or historic tests alone.

Acceptance requires one exact-head CI, Canonical Visual Golden, Blog Consumer Parity and Gosso Admin Consumer Parity cycle plus direct manual inspection of all eight Wave K captures.


### Wave K PageContainer evidence-scope correction

The first Wave K Golden run on `83b7f762` passed BulkActionBar, PageHeader, PageSkeleton and AppShell browser evidence and failed only the PageContainer evidence locator.

Classification: **evidence-driver defect**, not a Gouno PageContainer defect.

The first locator filtered every `[data-slot="page-container"]` by descendant text. Because the embedded Showcase outer shell itself wraps the demo inside a PageContainer, both the outer Showcase track and the inner canonical PageContainer example contain `PageContainer content track` and therefore matched.

The example already exposes a stronger caller-owned DOM contract: `data-page="settings"`. The corrected evidence targets `[data-slot="page-container"][data-page="settings"]` exactly and keeps all semantic geometry assertions unchanged: 24px page-stack gap, 1440px maximum-width authority and width containment.

The seven rendered captures produced by the first run were pre-reviewed directly; no Pattern/Gouno/Foundation defect was identified in those passing states. Wave K still requires a fresh exact-head run and complete PageContainer capture before acceptance.


## CSA-3 Wave K acceptance

Status: **accepted / manual-reviewed**

Accepted implementation head: `8de5e2f28d8fc460679a9a94b2c47ec8777af5c3`.

Exact-head machine evidence:

- CI `35555236319` — success;
- Canonical Visual Golden Smoke `35555236414` — success;
- Blog Consumer Parity `35555236370` — success;
- Gosso Admin Consumer Parity `35555236326` — success;
- rendered Golden artifact `10619874205` — inspected directly.

Accepted composition evidence:

- **BulkActionBar** — selection changes 3 → 2 without the Pattern owning product state; archive feedback remains caller-owned; cancel removes the toolbar and restoring selection recreates the same canonical action grammar;
- **PageContainer** — the actual `data-page="settings"` example renders a centered semantic content track with computed 24px page-stack gap and 1440px maximum-width authority;
- **PageHeader** — desktop title/description/actions preserve one top-aligned composition; at 600px the action group moves below the description rather than compressing the title axis;
- **PageSkeleton** — collection skeleton uses table geometry on desktop and four Card rows on mobile while retaining the same named busy region; form/dashboard remain sibling loading contracts;
- **AppShell** — desktop nested demo renders header, 288px sidebar, navigation and main/PageContainer ownership; at mobile width the sidebar disappears, the real left Sheet opens, navigation remains usable, and choosing a navigation item closes the Sheet and returns focus to the trigger.

### Wave K evidence-driver history

The first Golden run on `83b7f762` passed four of the five Wave K families and failed only PageContainer scope resolution. The embedded Showcase outer shell also uses PageContainer and contains the demo text, so text-descendant filtering matched both outer and inner tracks.

The accepted evidence targets the demo's explicit caller-owned `data-page="settings"` contract instead. Geometry assertions were not weakened. The seven passing captures from first-run artifact `10619913436` were pre-reviewed, and the final PageContainer capture from artifact `10619874205` completed the family review.

No Pattern/Gouno or Foundation defect requires reopening from Wave K. Historic API/FI `reviewed` flags have not been treated as a substitute for this browser-render acceptance.


## CSA-3 Wave L — Admin data composition

Status: **accepted / manual-reviewed**

Wave L upgrades the five Showcase-only Admin data composition contracts from static ownership tests to rendered browser acceptance. These are intentionally not public runtime APIs; they are canonical composition references that keep product pages from rebuilding the same page-level grammar differently.

Browser evidence covers:

- **Collection** — summary → toolbar → data → pagination geometry, real search narrowing 3 rows to 1, then a no-result Empty state without moving pagination or rebuilding the outer composition;
- **Record Detail** — identity → record-wide feedback → summary → sections vertical ownership, with Run-wide warning and summary remaining above record evidence sections;
- **Master-Detail** — real D-31 → D-30 peer switching, desktop master/detail width ownership and 600px stacked composition;
- **Settings** — feedback → semantic sections → one task action boundary, a real public-access Switch transition, and narrow-screen field stacking;
- **Data Summary** — metric role ownership and responsive 4 / 2 / 1-column geometry at 1440 / 800 / 600 widths.

This batch is deliberately composition-level: it does not promote Table, Input, Switch or Card again. Core behavior was completed under CSA-2; Wave L asks whether those Core pieces are being combined into one repeatable admin-page grammar.

Acceptance requires one exact-head CI, Canonical Visual Golden, Blog Consumer Parity and Gosso Admin Consumer Parity cycle plus direct manual inspection of all nine Wave L captures.


### Wave L Settings switch evidence-state correction

The first Wave L Golden run on `18883ede` passed Collection, Record Detail, Master-Detail and Data Summary and failed only the Settings switch state assertion.

Classification: **evidence-driver defect**, not a Core Switch or Settings composition defect.

The canonical Core Switch deliberately renders a native checkbox input with `role="switch"`. Its checked state is the native DOM `checked` property; it does not duplicate that state into an `aria-checked` attribute. The failed evidence incorrectly asserted the latter.

The corrected browser evidence uses Playwright's native-state-aware `toBeChecked()`, performs an ordinary click, and then requires `not.toBeChecked()`. All Settings composition order, responsive field geometry and screenshot assertions remain unchanged. No runtime component or composition implementation is modified.


The second Wave L Golden run on `0722cf03` confirmed the native checked-state assertion but failed when the evidence attempted a pointer click on the visually hidden `sr-only` switch input. The visible label/track is the intended user hit target; clicking the hidden input directly caused pointer interception by surrounding Card content.

Classification remains **evidence-driver defect**. The accepted interaction path must click the visible `允许公开访问` label text in the same Settings composition, then verify the underlying native switch becomes unchecked. This is stricter user-path evidence than a force-click and requires no runtime change.


## CSA-3 Wave L acceptance

Status: **accepted / manual-reviewed**

Accepted implementation head: `3d254251182fbd9433921f89b2378f86e0346369`.

Exact-head machine evidence:

- CI `35558937369` — success;
- Canonical Visual Golden Smoke `35558937341` — success;
- Blog Consumer Parity `35558937285` — success;
- Gosso Admin Consumer Parity `35558937270` — success;
- rendered Golden artifact `10621277995` — inspected directly.

Accepted rendered/browser scope:

- **Collection** — summary → toolbar → data → pagination geometry remains stable while search narrows the data set from 3 rows to 1 and then to an Empty state; pagination remains in its canonical slot;
- **Record Detail** — identity, Run-wide warning, four-metric summary and record evidence sections remain one readable vertical ownership chain;
- **Master-Detail** — selecting D-30 updates the detail without losing queue context; at 1440px the detail track is wider than the master track, while at 600px the two tracks stack on one axis;
- **Settings** — feedback remains above two semantic Sections and one bottom action boundary; the public-access Switch transitions through its visible label hit target; the 600px state stacks fields without collapsing Section/action ownership;
- **Data Summary** — four metric cells render one row at 1440px, two rows of two at 800px and four single-column rows at 600px while retaining the compact metric typography role.

### Wave L evidence-driver history

Two Golden iterations corrected the Settings evidence without changing runtime:

1. the first evidence incorrectly expected a native checkbox/switch to duplicate checked state into an `aria-checked` attribute; the canonical implementation correctly uses the native `checked` property;
2. the second evidence clicked the visually hidden `sr-only` input directly; the accepted path clicks the visible `允许公开访问` label text, then verifies the native switch becomes unchecked.

No force-click, DOM state mutation or product-specific workaround is used. Collection, Record Detail, Master-Detail and Data Summary passed every Wave L browser iteration.

Direct review of all nine Wave L captures found **no Pattern/Foundation defect requiring reopening**. The five Showcase-only Admin data compositions are now explicitly CSA-3 manual-reviewed; their older static/API review flags are no longer the basis for acceptance.


## CSA-3 Wave M — editor, AI and privileged-operation composition

Status: **accepted / manual-reviewed**

Wave M is the final planned CSA-3 composition batch. It deliberately re-reviews historically `reviewed` editor/AI Pattern entries in a real browser rather than treating older API/static checks as current rendered acceptance.

Browser evidence covers:

- **Dedicated Editor** — configuration subtype task-title semantics, primary/secondary desktop geometry, Error feedback, 600px single-axis collapse, Workspace subtype, navigator/canvas/inspector ownership and Read-only action state;
- **Editor Form composition** — identity → form-wide feedback → Sections → task actions ordering, surface-context switching, feedback hide/show lifecycle and narrow-screen field stacking;
- **MarkdownEditor** — real selection replacement through the product-owned AI toolbar action, Edit → Split → Preview state changes, rendered preview ownership and 600px adaptive toolbar without horizontal overflow;
- **AISuggestionPicker** — radio candidate selection, one explicit Apply boundary, regenerate selection reset and dismiss/reopen lifecycle;
- **AISuggestionReview** — checkbox review of related changes, counted two-item Apply boundary and dismiss/reopen lifecycle;
- **TabPanelLead + privileged-operation presentation** — validated inside the real Blog Admin AI Settings fixture rather than an isolated mock: provider actions, locked MFA gate with inert content, normal unlock, expiring state, and mobile lead/action stacking.

Wave M intentionally does not promote every Blog Admin AI Settings page. The product fixture here is evidence for two cross-page composition contracts—TabPanelLead and PrivilegedAccessGate. Full product-page family certification remains CSA-4.

Acceptance requires one exact-head CI, Canonical Visual Golden, Blog Consumer Parity and Gosso Admin Consumer Parity cycle plus direct manual review of all eleven Wave M captures. If accepted, the Pattern/Gouno composition scope named by CSA-3 will be complete and the program can advance to CSA-4 Product Showcase pages.


### Wave M first-run evidence-scope corrections

The first Wave M Golden run on `bdc6582a` passed the Dedicated Editor and MarkdownEditor cases and failed four evidence paths without exposing a runtime defect.

Classification: **evidence-driver defects**.

- **Editor Form:** the evidence tried to resolve the Name input through visible Field text even though the low-level Field contract does not manufacture a label/input association. The canonical example already owns a stable `name="name"`; mobile geometry now targets that real input.
- **AI Picker / Review:** each Pattern page intentionally renders both a standard-width and a narrow-container instance from the same example source. Page-wide `data-slot` locators merged both independent examples (6 radios instead of 3; duplicate checkboxes). Evidence now explicitly scopes to the first canonical example instance.
- **Privileged operation:** the security-state Segmented control lives inside the Fixture Dock Popover. The failed evidence attempted to operate it while the Popover was closed. The corrected user path opens Fixture controls, selects the visible state label, closes the Fixture overlay, then interacts with the real product Gate; expiring state reopens Fixture controls the same way.

No force click, hidden-control mutation or runtime change is introduced. The failing evidence is tightened to the actual visible UI ownership instead.


The second Wave M Golden run on `05cd607c` confirmed the PrivilegedAccessGate/TabPanelLead path and left only three evidence-scope issues:

- **Editor Form:** the example intentionally leaves low-level Input naming to the consumer and therefore has no `name="name"` attribute. Responsive geometry must target the actual first text input inside the first canonical Editor Form Section rather than inventing a business attribute.
- **AI Picker / Review lifecycle:** scoping to `.first()` solved duplicate-state assertions, but after the first example dismissed itself the live page-wide locator retargeted to the still-visible narrow-container example. The accepted evidence must scope to the stable DemoSection Card by its canonical example heading, so dismiss/reopen assertions remain attached to the same React example instance.

The Privileged operation path passed after opening the Fixture Dock through its visible trigger, selecting the visible Segmented labels, closing Fixture tooling, and interacting with the real product Gate. Dedicated Editor and MarkdownEditor also remained stable. No runtime change is justified by this run.


The third Wave M Golden run on `92f27531` passed 145/146 tests. Dedicated Editor, MarkdownEditor, AI Picker, AI Review and the real AI Settings TabPanelLead/PrivilegedAccessGate path all passed. Only Editor Form mobile geometry remained.

Classification: **evidence-driver defect**.

The evidence used `input[type="text"]`, but HTML's default text input does not require an explicit serialized `type="text"` attribute. The corrected locator stays inside the first canonical Editor Form Section and selects its first non-Switch input: `input:not([role="switch"])`. This preserves the intended responsive geometry assertion while avoiding a DOM-serialization assumption. No runtime or composition code changes.


## CSA-3 Wave M acceptance

Status: **accepted / manual-reviewed**

Accepted implementation head: `aee10e6c0742a477c78b8bfb6b4751ef3c7155c2`.

Exact-head machine evidence:

- CI `35565816030` — success;
- Canonical Visual Golden Smoke `35565816055` — success;
- Blog Consumer Parity `35565816014` — success;
- Gosso Admin Consumer Parity `35565815994` — success;
- rendered Golden artifact `10623968378` — inspected directly.

Accepted rendered/browser scope:

- **Dedicated Editor** — Configuration subtype keeps the task title independent from document heading level, places Error feedback above the body, preserves primary/secondary desktop ownership and collapses into one 600px axis; Workspace subtype proves the real DocumentEditorShell navigator/canvas/inspector contract and read-only action state;
- **Editor Form composition** — identity → form-wide feedback → Sections → task actions remains stable while the Fixture changes surface context, feedback hides/restores normally, and the first two fields stack vertically at 600px without changing section/action ownership;
- **MarkdownEditor** — selecting the demo body and invoking the product-owned `AI 写作` action replaces the selection, Split renders editor + preview, 600px toolbar stays within its own width with Split hidden, and Preview retains the inserted content;
- **AISuggestionPicker** — the first canonical example owns exactly three mutually exclusive radio candidates, selection changes without committing, one `使用所选` action writes back the chosen value, regenerate resets selection and dismiss/reopen remains attached to the same example instance;
- **AISuggestionReview** — related field changes stay explicit checkboxes, deselecting one changes the commit boundary to `应用 2 项建议`, Apply records exactly those two keys, and dismiss/reopen retains the same example lifecycle;
- **TabPanelLead + PrivilegedAccessGate** — in the real Blog Admin AI Settings fixture, provider actions remain enabled when unlocked, locked state hides privileged content behind inert ownership and exposes one Step-Up action, unlock restores content/actions, expiring state uses the same Gate grammar, and 600px TabPanelLead moves actions below the description without duplicating a panel title.

### Wave M evidence-driver history

Wave M required several evidence corrections before acceptance, but none exposed a runtime defect:

1. page-wide AI suggestion locators merged the normal and narrow canonical examples; evidence was scoped to the exact DemoSection Card;
2. dismissing the first AI example caused a live page-wide locator to retarget the still-visible narrow example; the stable DemoSection owner now anchors the lifecycle;
3. PrivilegedAccess state controls live inside Fixture Dock tooling; evidence now opens the visible Fixture controls, changes state there, closes tooling, then interacts with the real product Gate;
4. Editor Form evidence initially assumed a label/input association and later an explicit serialized `type="text"`; the accepted mobile geometry stays inside the first canonical Section and targets its first non-Switch input, which matches the actual low-level Field/Input contract.

No force-click, hidden state mutation, page-global fallback or runtime workaround is used in the accepted paths.

Direct review of all eleven Wave M captures found **no Editor/AI/TabPanelLead/PrivilegedAccess Pattern or Foundation defect requiring reopening**.

## CSA-3 completion

With Waves K, L and M accepted, **all 15 Pattern/Gouno catalog families now have explicit CSA-3 rendered browser acceptance**:

- Wave K — AppShell, PageContainer, PageHeader, PageSkeleton, BulkActionBar;
- Wave L — Collection, Record Detail, Master-Detail, Settings, Data Summary;
- Wave M — Dedicated Editor, Editor Form, MarkdownEditor, AI Suggestion Picker, AI Suggestion Review.

TabPanelLead and PrivilegedAccessGate are also accepted as Showcase composition contracts because they govern repeated product-page structure even though they are not independent catalog entries.

CSA-3 Pattern/Gouno composition pass is therefore complete. The next gate is **CSA-4 Product Showcase page certification**: Blog Admin, Gosso Admin and Public Blog page families must be inspected as product compositions using the now-certified Foundation/Core/Pattern grammar before Consumer reverse migration can resume as a final product-parity operation.


## CSA-4 Wave N — Blog Admin content-management pages

Status: **accepted / manual-reviewed**

CSA-4 changes the unit of review from Component/Pattern to the **actual product page**. Core and Pattern behaviors remain prerequisites from CSA-2/CSA-3; a product page is accepted only when those authorities are composed coherently in the real Showcase route, including page hierarchy, state placement, responsive behavior and task interaction.

Wave N covers nine Blog Admin content-management pages:

- **Dashboard** — route-level PageHeader, four-metric operating summary, traffic visualization and create permission action;
- **Posts** — search/status/category/tag filter grammar, real row selection, BulkActionBar ownership and desktop table → mobile list transition without losing selection context;
- **Categories** — Collection composition into the real New Category Drawer, including Editor Form anatomy and field-scoped Slug AI affordance;
- **Tags** — card-grid resource management with real tag selection and canonical AI/delete bulk action grammar;
- **Pages** — collection filters, single-page selection and canonical AI/delete bulk action grammar;
- **Comments** — moderation filter ownership, real comment selection, then reported-only filtering clearing stale selection context;
- **Notifications** — independent notification list, status/type filtering, real selection and successful bulk mark-read mutation returning the page to unselected state;
- **Media Library** — media collection/search/type grammar into the real Upload Drawer with Upload and Alt Text task fields;
- **Users** — member directory into the real role editor, preserving the boundary between Blog product roles and external GOSSO identity/account management.

Wave N intentionally does **not** certify Post/Page Editors, AI Operations/Settings or Site Settings; those high-depth task pages are Wave O. It also does not re-certify BulkActionBar, Editor Form, PageHeader or other Pattern/Gouno families already accepted under CSA-3.

Acceptance requires exact-head CI, Canonical Visual Golden, Blog Consumer Parity and Gosso Admin Consumer Parity plus direct manual inspection of all ten Wave N captures. Any visual/composition defect found here must be repaired at the owning Product/Pattern/Foundation layer instead of weakening the browser evidence.


## CSA-4 Wave N acceptance

Status: **accepted / manual-reviewed**

Accepted implementation head: `d0cd27ae879c4146a1d6797f85c95a5bc3d27b91`.

Exact-head machine evidence:

- CI `35568761005` — success;
- Canonical Visual Golden Smoke `35568761320` — success;
- Blog Consumer Parity `35568761106` — success;
- Gosso Admin Consumer Parity `35568761029` — success;
- rendered Golden artifact `10625101996` — inspected directly.

Accepted product-page scope:

- **Dashboard** — PageHeader, create permission action, four KPI cards, traffic visualization and downstream operating sections retain a clear route-level hierarchy;
- **Posts** — four-filter toolbar, single-row selection, canonical BulkActionBar and 600px table → Card-list transition preserve the same selected-resource context without horizontal overflow;
- **Categories** — New Category opens the real Drawer, which uses canonical Editor Form anatomy and keeps Slug AI attached to the Slug field rather than creating page-global AI noise;
- **Tags** — card-grid selection exposes the same AI/delete bulk action language used elsewhere;
- **Pages** — filter/selection/bulk grammar matches other managed-content collections;
- **Comments** — selecting a comment creates one bulk boundary; switching to reported-only intentionally clears stale selection and leaves the moderation list as the active context;
- **Notifications** — status/type filtering, selection and successful bulk mark-read mutation return to an unselected list and surface explicit product feedback;
- **Media Library** — media grid and page actions remain behind the Upload Drawer; upload and Alt Text fields form one focused task without Drawer/header overlap;
- **Users** — the member role editor keeps Blog role assignment inside the product while the surrounding copy/actions continue to route identity/account responsibility to GOSSO.

All ten Wave N captures were manually inspected. No product, Pattern/Gouno or Foundation defect required reopening, and the first exact-head Golden run passed without evidence-driver correction.

Wave N acceptance does not certify the remaining Blog Admin deep-task pages. Post Editor, Page Editor, AI Operations, AI Settings and Site Settings remain the explicit Wave O scope.


### Wave N product-review ledger boundary correction

The first Wave N acceptance-ledger head `29a3eb11` correctly passed the already-accepted product browser evidence but CI rejected its governance placement: the acceptance commit inserted `blog-admin-*` IDs into `componentReviews`.

That rejection is **intentional architecture protection**, not a test to weaken. `componentReviews` is sealed to the canonical Core/Theme/Pattern/Gouno catalog. Product pages have separate migration progress and must not become pseudo-components merely because CSA-4 reviews them.

The corrected governance model adds a separate `productReviews` ledger:

- `componentReviews` remains exactly aligned to canonical component-family catalog IDs;
- `productReviews` may contain only real Product Showcase IDs (`blog-*`, `blog-admin-*`, `gosso-*`);
- CSA-4 product review status does not alter product migration progress through `componentProgress`;
- a new sealing assertion verifies product-review IDs exist in the Product catalog, never overlap `componentReviews`, retain evidence/baseline, and leave product migration progress unchanged.

Wave N's rendered acceptance conclusions are unchanged. This correction only places that evidence in the correct governance layer.


## CSA-4 Wave O — Blog Admin deep-task pages

Status: **accepted / manual-reviewed**

Wave O completes the Blog Admin Product Showcase family by reviewing the five high-depth task pages that Wave N intentionally excluded.

Dedicated browser evidence covers:

- **Post Editor** — full DocumentEditorShell ownership, real History tab and version dialog, restore mutation returning to Outline, then 600px canvas/inspector stacking without horizontal overflow;
- **Page Editor** — page-specific no-navigator editor grammar, Inspector-owned template/navigation/Slug settings, real AI title candidate application, then 600px canvas/inspector stacking;
- **AI Operations** — all four workspace tabs exist, Automation opens a real Workflow detail, and Run Center remains an evidence workspace rather than becoming a second configuration page. Existing Golden coverage in the same run also retains Workflow detail/editor mobile baselines;
- **AI Settings** — six section tabs remain one product route, Skill editing uses the Dedicated Editor product path, and Model Connections return to the privileged-operation/TabPanelLead composition instead of inventing a second settings grammar;
- **Site Settings** — real "save when MFA expires" flow preserves dirty draft state through lock → Step-Up → restore, remains usable at 600px, then commits and returns to synchronized state.

Wave O does not re-certify DocumentEditorShell, MarkdownEditor, Dedicated Editor, TabPanelLead or PrivilegedAccessGate as abstractions; those were accepted under CSA-3. The question here is whether the complete Blog Admin products compose them correctly through real task transitions.

Acceptance requires one exact-head CI, Canonical Visual Golden, Blog Consumer Parity and Gosso Admin Consumer Parity cycle plus direct manual review of all nine dedicated Wave O captures. Existing AI Operations mobile visual baselines may be used as supplemental product evidence, but cannot replace review of the new Run Center capture.


### Wave O first-run evidence-scope corrections

The first Wave O Golden run on `904b9e7c` passed **158/160** tests. Post Editor, AI Settings and Site Settings dedicated product evidence passed; Page Editor and AI Operations failed only at locator scope.

Classification: **evidence-driver defects**, not Product/Pattern/Foundation defects.

- **Page Editor:** the title candidate surface is rendered inside the editor and already owns the explicit accessible label `标题 AI 建议`. The first evidence unnecessarily used a cross-scoped `filter({ has: editor.getByRole(...) })`, so the relative descendant test never matched. The corrected path targets the real labeled Picker directly and separately verifies its `标题候选` radiogroup.
- **AI Operations:** `运行中心` is intentionally both the active Tabs panel name and an inner region label. A page-wide `getByLabel("运行中心")` therefore produced a strict-mode double match. The corrected path targets the semantic `tabpanel[name="运行中心"]` and verifies evidence-center copy inside that panel.

All interaction, responsive geometry and product ownership assertions remain unchanged. No runtime source is modified.


## CSA-4 Wave O acceptance

Status: **accepted / manual-reviewed**

Accepted implementation head: `36a856ac4ee423c2d89bf3131cd22cd47ade73c7`.

Exact-head machine evidence:

- CI `35579698480` — success;
- Canonical Visual Golden Smoke `35579698495` — success;
- Blog Consumer Parity `35579698429` — success;
- Gosso Admin Consumer Parity `35579698442` — success;
- rendered Golden artifact `10629558838` — inspected directly.

Accepted product-page scope:

- **Post Editor** — History opens the real version-detail dialog, Restore mutates the document and returns to Outline, success feedback remains page-level, and the 600px restored state keeps editor ownership readable without horizontal overflow;
- **Page Editor** — the page-specific editor keeps canvas content and Inspector responsibilities distinct, the real title AI candidate is applied through the field-scoped picker, and the 600px state stacks the product into one readable axis;
- **AI Operations** — the route preserves one four-tab operational workspace, Automation enters real Workflow detail, and Run Center remains an evidence/trace center with run facts, execution steps and resource/interaction evidence rather than becoming a second settings page;
- **AI Settings** — the six section tabs remain under one route-level PageHeader; Skill editing uses the accepted Dedicated Editor composition while Model Connections use the same privileged-operation Gate/TabPanelLead grammar accepted under CSA-3;
- **Site Settings** — a dirty site-name draft survives simulated MFA expiry, Step-Up and privilege restoration, remains actionable at 600px, and the final save returns the page to synchronized state without losing tab/section ownership.

All nine Wave O captures were manually inspected. No Product, Pattern/Gouno or Foundation defect required reopening.

### Wave O evidence-driver history

The first Wave O Golden run on `904b9e7c` passed 158/160 tests and exposed only two locator-scope issues:

1. Page Editor over-scoped the already labeled `标题 AI 建议` picker through a relative descendant filter;
2. AI Operations used page-wide `运行中心` labeling, which intentionally matches both the active tabpanel and the inner evidence region.

The accepted evidence targets the real labeled Picker directly and the semantic `tabpanel[name="运行中心"]` respectively. All product-state, responsive and ownership assertions remain unchanged, and no runtime source was modified.

## Blog Admin Product Showcase completion

With Waves N and O accepted, **the complete Blog Admin Showcase product family is now manually certified under CSA-4**:

- Wave N — Dashboard, Posts, Categories, Tags, Pages, Comments, Notifications, Media Library, Users;
- Wave O — Post Editor, Page Editor, AI Operations, AI Settings, Site Settings.

This does not complete CSA-4 globally. Gosso Admin and Public Blog product families still require the same product-level rendered review before Canonical freeze and Consumer reverse migration can resume.


## CSA-4 Wave P — Gosso Admin authenticated product pages

Status: **accepted / manual-reviewed**

Wave P begins Gosso Admin Product Showcase certification with the seven authenticated application and system-management pages. It intentionally excludes Login, Forgot Password, Reset Password, Auth Callback and Not Found; those standalone authentication/error surfaces form Wave Q.

Dedicated browser evidence covers:

- **Overview** — begins in the administrator product context, switches through the explicit Fixture control to the ordinary-user context, verifies the restricted-system notice and all three self-service quick-navigation targets;
- **Account Settings** — enters the real Active Sessions task, terminates a non-current iPhone Safari session through confirmation, and verifies both removal and explicit mutation feedback;
- **OAuth2 Clients** — opens the real registration editor, creates a confidential client and verifies the one-time client-secret disclosure surface;
- **Users** — opens the real role-management dialog for Content Editor, adds the auditor role, commits the mutation and verifies the updated role plus product feedback;
- **Audit Logs** — applies a real event filter, narrows to the expected OAuth client event and opens its event-detail modal;
- **Site Settings** — edits the product name, verifies the live login-page preview and dirty state, saves back to synchronized state, then validates 600px form/preview stacking;
- **System Status** — switches through degraded and unavailable health states, verifies Redis degradation and probe latency, then validates the unavailable 503 state at 600px.

Nine dedicated captures are produced: one each for Overview, Account Settings, OAuth2 Clients, Users and Audit Logs, two for Site Settings, and two for System Status. Wave P reuses already-certified Core/Pattern/Gouno abstractions and does not promote Gosso pages into component completion.

Acceptance requires exact-head CI, Canonical Visual Golden, Blog Consumer Parity and Gosso Admin Consumer Parity plus direct manual inspection of all nine dedicated Wave P captures.


### Wave P duplicate Message defect

The first Wave P Golden run on `2856b264` passed 166/167 browser tests and failed only the Gosso Admin Users role-update evidence because **two identical success Messages were actually rendered** after one role save.

This is a real Showcase product defect, not a locator ambiguity. The Showcase root runs under React `StrictMode`, and the System Management `FixtureMessageContent` adapter imperatively called `message.success(children)` from an effect. StrictMode replays that effect during development/browser verification, so one product mutation enqueued the same Message twice.

Ownership: the defect belongs to the Gosso System Management Showcase Message adapter. Core `MessageProvider` is not reopened: its imperative API correctly displays every explicit call it receives.

Correction:

- keep Message as the presentation owner rather than replacing it with Alert;
- make the fixture adapter idempotent for the same content within one mounted adapter instance;
- still emit again when the business status content genuinely changes or the adapter remounts for a later mutation;
- keep the existing exact browser assertion unchanged, so duplicate DOM messages continue to fail rather than being hidden with `.first()`.

No force-click or test-only suppression is used.


## CSA-4 Wave P acceptance

Status: **accepted / manual-reviewed**

Accepted implementation head: `ad088f1a7026fc10cd69e2dd657ee3dfb5d7bcf1`.

Exact-head machine evidence:

- CI `35588289635` — success;
- Canonical Visual Golden Smoke `35588289780` — success;
- Blog Consumer Parity `35588289761` — success;
- Gosso Admin Consumer Parity `35588289676` — success;
- rendered Golden artifact `10633581871` — all nine dedicated Wave P captures inspected directly.

Accepted product-page scope:

- **Overview** — administrator and ordinary-user contexts remain visibly distinct; restricted system-management ownership is explicit while account self-service navigation remains available and coherent;
- **Account Settings** — Active Sessions preserves one focused account-security task, terminates the selected non-current session through confirmation and returns to a stable table with explicit success feedback;
- **OAuth2 Clients** — confidential-client registration retains the collection behind the editor and exposes the generated secret exactly once in a dedicated disclosure modal;
- **Users** — role editing remains row-owned, persists the auditor role and now emits exactly one success Message after the StrictMode duplicate-feedback defect was corrected;
- **Audit Logs** — filtering and event detail preserve the relationship between the audit collection and the selected immutable evidence record;
- **Site Settings** — branding draft, live login preview, dirty/save lifecycle and 600px form→preview stacking remain one coherent settings task;
- **System Status** — degraded Redis health and unavailable 503 states preserve alert→summary→dependency ownership and remain readable at 600px.

All nine final Wave P captures were manually inspected. No remaining Product, Pattern/Gouno or Foundation defect requires reopening.

The first Golden run on `2856b264` exposed a real duplicate-Message defect in the Gosso System Management Showcase adapter. The corrected implementation keeps the strict Users assertion unchanged and also removes the duplicate success feedback visible in Client registration and Site Settings save evidence.

Wave P certifies the seven authenticated Gosso Admin product pages. Login, Forgot Password, Reset Password, Auth Callback and Not Found remain the explicit Wave Q scope.


## CSA-4 Wave Q — Gosso authentication and error surfaces

Status: **candidate / awaiting batched machine + rendered review**

Wave Q completes the Gosso Product Showcase family with the five standalone authentication and error surfaces that Wave P intentionally excluded: Login, Forgot Password, Reset Password, Auth Callback and Not Found.

Dedicated browser evidence covers:

- **Login** — performs a real password submit into MFA, completes the second factor and captures the successful authenticated state; the same route then switches through Fixture control into Sudo/step-up, completes strong authentication and validates the 600px composition;
- **Forgot Password** — proves the submit action is disabled until an email is present, exercises the neutral successful response that does not disclose whether an account exists, then switches to the service-failure state and validates the non-enumerating error copy at 600px;
- **Reset Password** — exercises minimum-length validation, mismatch validation and a successful reset before switching to an expired-link state where the reset form is unavailable; both successful and 600px expired states are captured;
- **Auth Callback** — starts in Authorization Code + PKCE processing, switches to the successful recovered-session state, then to callback failure at 600px and finally drives the retry action back to processing;
- **Not Found** — validates the standalone Result anatomy, requested path and both recovery actions at 600px, then uses the real “返回概览” action and requires navigation back to the Gosso Overview product page.

Nine dedicated captures are produced: two each for Login, Forgot Password, Reset Password and Auth Callback, plus one Not Found mobile capture. Wave Q reviews complete product-state composition; it does not re-certify AuthSurface, Alert, FormField, Result, Button or other already-reviewed Core/Pattern primitives.

Acceptance requires exact-head CI, Canonical Visual Golden, Blog Consumer Parity and Gosso Admin Consumer Parity plus direct manual inspection of all nine dedicated Wave Q captures.


### Wave Q first-run FormField locator correction

The first Wave Q Golden run on `7c3c295f` passed **169/172** browser tests. Callback and Not Found completed fully; Login, Forgot Password and Reset Password each timed out before their first field mutation.

Classification: **evidence-driver locator defect**, not a Product or Core FormField defect.

The failure snapshots prove that the rendered controls have the correct accessible names: `密码`, `邮箱`, `新密码` and `确认密码`. Core `FormField` also owns the expected `htmlFor` / `aria-labelledby` relationship. The failed evidence used Playwright `getByLabel(..., { exact: true })`, which matches the rendered label text; required fields also render a visual `*` marker, so exact label-text matching does not resolve even though the control's accessible name is correct.

The corrected evidence targets the control semantics directly with `getByRole("textbox", { name: ..., exact: true })`. The same correction is applied proactively to the required `动态验证码` fields in MFA and Sudo. No product implementation, Core FormField behavior, business-state assertion or interaction sequence is weakened.
