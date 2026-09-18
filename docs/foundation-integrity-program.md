# Gouno UI Foundation Integrity Program

Status: active, binding remediation program.
Program id: **FI-001**
Started: 2026-09-18

This program exists because a component can have an API, Showcase demo, tests and historical review evidence while still failing to own the corresponding design-system decision. Foundation completion therefore cannot be inferred from component completion.

The machine-readable source of progress is `foundation-integrity.json`. Chat history and screenshots are evidence inputs, not the progress ledger.

## Objective

Re-certify the Gouno UI foundation from the bottom up:

```text
Theme / Tokens
      ↓
Core primitives
      ↓
Gouno structure + admitted Patterns
      ↓
Canonical Showcase corpus
      ↓
Blog / Blog Admin / Gosso Admin consumers
```

A Foundation is complete only when design authority is explicit, bypasses are audited, the corpus conforms, regression guards exist, representative visuals are certified, and real consumers remain compatible.

## Seven mandatory gates

| Gate | Question |
| --- | --- |
| Inventory | Have owners, public APIs, tokens, direct utility bypasses and product usages been enumerated? |
| Tokens | Are stable semantic values owned by Theme/tokens rather than page-local literals? |
| Authority | Is there one canonical API/role for the decision, with extension points that cannot silently erase the invariant? |
| Corpus | Have Showcase product fixtures been migrated or explicitly classified as intentional exceptions? |
| Guard | Can static/runtime tests prevent the known bypass or regression class from returning? |
| Visual | Are representative Light/Dark and responsive cases certified where the rule is visual? |
| Consumers | Do reciprocal Blog/Gosso checks pass after the canonical change? |

Only **7/7** permits `certified`. Any discovered Foundation defect reopens affected reviews immediately.

## Foundation workstreams

Typography, Spacing, Sizing, Radius, Color, Elevation, Surface, Border, Layout, Responsive behavior, Density, Motion, Focus, Overlay/layering, Interaction state, Accessibility.

Existing Design Language rules are evidence, not automatic certification. A rule can be correct while its authority or corpus is still incomplete.

## Execution order

### Phase 0 — Governance and measurable progress

- create this durable program and `foundation-integrity.json`;
- add `lint:foundation` to `npm run verify`;
- prevent a non-certified Foundation from leaving affected component reviews marked `reviewed`;
- report passed gates / total gates on every verification run.

Exit: progress ledger is machine checked on every main push.

### Phase 1 — Typography Foundation

1. Define semantic visual roles independently from HTML heading levels.
2. Add typography tokens for size, line-height, weight and tracking.
3. Redesign Core `Heading` / `Text` authority without breaking semantic host control.
4. Remove `PageHeader` heading-size override.
5. Define nested vs standalone Dedicated Editor heading semantics.
6. Align Card/section/panel title roles and audit Public Blog reading exceptions.
7. Migrate raw product heading utilities or document deliberate reading exceptions.
8. Add static corpus guards.
9. Refresh representative Goldens.
10. Require Blog/Gosso parity.

Exit: Typography 7/7, affected reviews re-certified.

### Phase 2 — Geometry Foundations

Audit and harden Spacing, Sizing, Radius, Border, Layout and Density. No page-local utility may redefine a canonical control/surface geometry contract.

### Phase 3 — Visual Semantic Foundations

Audit and harden Color, Elevation and Surface. Existing DL-10/DL-16 evidence is re-validated rather than grandfathered.

### Phase 4 — Interaction Foundations

Audit Responsive behavior, Motion, Focus, Overlay/layering and Interaction state, including keyboard/focus geometry and reduced-motion behavior.

### Phase 5 — Accessibility Foundation

Re-certify semantic structure, naming, focus, forms, tables, overlays and heading outlines across representative product corpora.

### Phase 6 — Corpus and consumer re-certification

Run corpus-wide guards, Golden matrix, Blog Consumer Parity and Gosso Admin Consumer Parity. No Foundation may be declared complete with consumer regressions outstanding.

## Progress rules

- `foundation-integrity.json` is the sole numeric progress source.
- A gate becomes `passed` only with repository evidence.
- `in_progress` is not counted as passed.
- `blocked` must name blocking evidence/work.
- A Foundation may be `planned`, `reopened`, `in_progress` or `certified`.
- `certified` requires every gate `passed`.
- A non-certified Foundation with `affectedComponentReviews` requires those review entries to be explicitly `reopened`.
- Stage commits update the ledger in the same phase that changes evidence.

## Current execution

Phase 1 Typography is certified 7/7.

Phase 2 Geometry is fully certified:

- **Spacing 7/7** — named Space/Flex/Grid gaps share one semantic scale; numeric gaps remain an explicit precision escape hatch.
- **Sizing 7/7** — public ControlSize resolves to one 32/36/44px token authority, including Button, InputOTP and Segmented, while Tailwind-compatible classes preserve caller overrides such as `h-auto`.
- **Radius 7/7** — the numeric radius scale owns values; compatibility/control aliases no longer duplicate 6px authority; Checkbox consumes `rounded-sm`; the Tooltip arrow is the documented local-shape exception.
- **Border 7/7** — ordinary boundaries retain the canonical 1px substrate, 2px indicators/separators consume semantic `edge-*` emphasis roles, and long-form Public Blog blockquotes use the explicit 4px reading-accent role. Product corpus raw numeric-width and hard-coded-neutral-color bypasses are both zero.
- **Layout 7/7** — canonical PageContainer width and page-stack rhythm are owned by the semantic page-track contract.
- **Density 7/7** — Theme `comfortable | compact` is an application-level default policy for density-aware components; Table `default` follows it while explicit `compact | touch` remains local authority.

Phase 3 Visual Semantic Foundations is fully certified:

- **Color 7/7** — semantic Theme roles own application UI color, browser `theme-color` follows computed background, overlay copy uses `overlay-foreground`, and fixed/generated-media color exceptions are classified and guarded.
- **Elevation 7/7** — `control / surface / raised / overlay / modal` are the only runtime depth roles; raw size aliases remain flat compatibility vocabulary; direct product semantic-shadow ownership is zero.
- **Surface 7/7** — Card/Table/transient-layer components own canonical surface anatomy. Gosso Overview Quick Links retain link semantics while `Card interactive` owns surface/elevation; the product-side reverse migration is verified by Gosso CI/browser/parity and reciprocal Gouno UI parity.

Phase 2/3 exits are backed by exact-head CI, canonical visual browser checks and reciprocal Blog/Gosso consumer parity rather than historical completion claims.

Phase 4 — Interaction Foundations is active:

- **Responsive 7/7 (re-certified after FI-D001)** — canonical breakpoint authority remains unchanged; Steps now converts the complete max-sm composition and keeps connector geometry separate from copy across desktop horizontal and vertical-dot layouts.
- **Motion 7/7** — CSS and JavaScript share one reduced-motion policy across imperative scrolling and Carousel lifecycle/autoplay.
- **Focus 7/7** — Base fallback and component-owned focus share canonical 2px geometry, 3px/direct-`focus:ring`/double-outline bypasses are zero, browser focus ownership is executable, and Blog/Gosso reciprocal consumer parity is green.
- **Overlay/layering 7/7** — semantic `sticky / shell / floating / modal / popup / notice` roles own application-global stacking; nested popup portals are deterministically above modal surfaces; raw global layer bypasses are zero; Showcase tooling is isolated outside the product Layer scale.
- **Interaction state 7/7** — semantic state/ARIA ownership, geometry preservation and gesture ownership are guarded. FI-D002 Carousel nested pointer ownership plus missing arrow semantic slots are fixed and proven in a real browser.
- **Color re-certified after FI-D004** — Tag close hover now derives from current/semantic foreground; raw product palette bypasses remain zero under the expanded guard.

The post-Foundation component defect sweep is complete: FI-D001 Steps, FI-D002 Carousel, FI-D003 ConfigProvider and FI-D004 Tag are all resolved and their component reviews are restored to certified/reviewed state.

Phase 5 — Accessibility Foundation is active. The semantic-owner audit has identified and corrected five Core defects: FormField → composite Select naming/required propagation, contextual Collapse switcher naming, contextual Tree switcher naming, localized Modal/Drawer surface + close naming, and Tag checkable+closable nested interaction. Landmark/skip-link, PageSkeleton live-region, native Table semantics and real-browser overlay focus containment are now part of the certification evidence.

Focus certification is backed by CI run 35360452646 (#544), Canonical Visual Golden Smoke run 35360452819 (#461), Blog Consumer Parity run 35360452821 (#522), and Gosso Admin Consumer Parity run 35360452653 (#517).

Overlay certification is backed by CI run 35364329607 (#555), Canonical Visual Golden Smoke run 35364330737 (#472), Blog Consumer Parity run 35364330586 (#533), and Gosso Admin Consumer Parity run 35364329528 (#528).

Interaction State certification and FI-D004 Color re-certification are backed by CI run 35367064494 (#562), Canonical Visual Golden Smoke run 35367064504 (#479), Blog Consumer Parity run 35367064487 (#540), and Gosso Admin Consumer Parity run 35367064636 (#535).

FI-D001 Responsive re-certification and FI-D003 ConfigProvider Showcase certification are backed by CI run 35370575584 (#568), Canonical Visual Golden Smoke run 35370575666 (#485), Blog Consumer Parity run 35370575614 (#546), and Gosso Admin Consumer Parity run 35370575622 (#541).
