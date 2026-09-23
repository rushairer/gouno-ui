// Showcase completion is reviewed evidence, not architecture status. Keep this
// list limited to canonical components whose API/examples/source/a11y/tests have
// been reviewed together. Product pages keep migration progress separate; CSA-4 certification uses productReviews.
const completedComponents = new Set([
  "core-config-provider",
  "core-button",
  "core-icon",
  "core-kbd",
  "core-badge",
  "core-tag",
  "core-avatar",
  "core-space",
  "core-flex",
  "core-grid",
  "core-separator",
  "core-splitter",
  "core-input",
  "core-textarea",
  "core-input-number",
  "core-select",
  "core-form",
  "core-date-picker",
  "core-date-range-picker",
  "core-time-picker",
  "core-color-picker",
  "core-upload",
  "core-autocomplete",
  "core-slider",
  "core-rate",
  "core-input-otp",
  "core-mentions",
  "core-transfer",
  "core-cascader",
  "core-tree-select",
  "core-segmented",
  "core-checkbox",
  "core-radio",
  "core-switch",
  "core-table",
  "core-pagination",
  "core-tabs",
  "core-anchor",
  "core-breadcrumb",
  "core-steps",
  "core-collapse",
  "core-menu",
  "core-code-block",
  "core-alert",
  "core-modal",
  "core-drawer",
  "core-popconfirm",
  "core-message",
  "core-notification",
  "core-tour",
  "core-card",
  "core-typography",
  "core-progress",
  "core-empty",
  "core-result",
  "core-skeleton",
  "core-spin",
  "core-qrcode",
  "core-float-button",
  "core-watermark",
  "core-affix",
  "core-back-top",
  "core-statistic",
  "core-popover",
  "core-tooltip",
  "core-dropdown",
  "core-page-layout",
  "core-list",
  "core-descriptions",
  "core-image",
  "core-timeline",
  "core-calendar",
  "core-carousel",
  "core-tree",
  "theme-system",
  "pattern-bulk-action-bar",
  "pattern-ai-suggestion-picker",
  "pattern-ai-suggestion-review",
  "pattern-markdown-editor",
  "pattern-dedicated-editor",
  "pattern-editor-form-composition",
  "pattern-collection-composition",
  "pattern-record-detail-composition",
  "pattern-master-detail-composition",
  "pattern-settings-composition",
  "pattern-data-summary-composition",
  "gouno-app-shell",
  "gouno-page-container",
  "gouno-page-header",
  "gouno-page-skeleton",
]);

export interface ComponentReview {
  status: "reviewed" | "reopened";
  scope: string;
  evidence: readonly string[];
  baseline: string;
}

// Historic reviewed scope is retained; a later defect can reopen a family without
// removing its catalog entry or pretending that its previous review never existed.
export const componentReviews: Record<string, ComponentReview> = Object.fromEntries(
  [...completedComponents].map((id) => [id, {
    status: "reviewed",
    scope: "Previously reviewed API, examples and focused product scope; not exhaustive compatibility certification.",
    evidence: ["docs/abstraction-register.md", "docs/api-conformance.md"],
    baseline: "0e6fecf",
  }]),
);
for (const id of ["core-config-provider", "core-input", "core-select", "core-date-picker", "core-input-number", "core-upload", "core-pagination"]) {
  componentReviews[id] = {
    status: "reviewed",
    scope: "PD-074: component localization and audited control interactions; product rendering matrix tracked separately.",
    evidence: ["docs/component-localization.md", "tests/core-localization.test.tsx", "tests/core-select-interaction.test.tsx"],
    baseline: "PD-074 / 2026-09-12",
  };
}
componentReviews["gouno-page-skeleton"] = {
  status: "reviewed",
  scope: "PD-076: initial-loading page data-region skeleton layouts validated across completed Gosso Admin and Blog corpora.",
  evidence: ["docs/page-skeleton.md", "tests/gouno-page-skeleton.test.tsx"],
  baseline: "PD-076 / 2026-09-14",
};
componentReviews["pattern-ai-suggestion-picker"] = {
  status: "reviewed",
  scope: "Single-field AI candidate selection with explicit radio semantics, optional regenerate/dismiss controls and one apply action.",
  evidence: ["showcase/demos/patterns/ai-suggestion-picker.tsx", "tests/pattern-ai-suggestions.test.tsx"],
  baseline: "2026-09-17",
};
componentReviews["pattern-ai-suggestion-review"] = {
  status: "reviewed",
  scope: "Related-field AI change review with explicit checkbox selection and one counted apply action.",
  evidence: ["showcase/demos/patterns/ai-suggestion-review.tsx", "tests/pattern-ai-suggestions.test.tsx"],
  baseline: "2026-09-17",
};
componentReviews["pattern-markdown-editor"] = {
  status: "reviewed",
  scope: "Shared Markdown edit/split/preview, formatting commands, cursor/selection ref API, and product-owned toolbar extension slot.",
  evidence: ["showcase/demos/patterns/markdown-editor.tsx", "tests/pattern-document-editor.test.tsx"],
  baseline: "2026-09-16",
};

componentReviews["pattern-editor-form-composition"] = {
  status: "reviewed",
  scope: "Showcase-only cross-surface editor-form composition contract for Modal, Drawer and Dedicated Editor internals; standardizes field, section, feedback and action rhythm without adding a public runtime API.",
  evidence: [
    "docs/patterns/editor-form-composition.md",
    "showcase/demos/patterns/editor-form-composition.tsx",
    "tests/pattern-editor-form-composition.test.tsx",
  ],
  baseline: "2026-09-18",
};
for (const id of [
  "pattern-collection-composition",
  "pattern-record-detail-composition",
  "pattern-master-detail-composition",
  "pattern-settings-composition",
  "pattern-data-summary-composition",
]) {
  componentReviews[id] = {
    status: "reviewed",
    scope: "Showcase-only Blog Admin / Gosso Admin data composition contract; standardizes semantic ordering, spacing ownership and state placement without admitting a public page-level runtime API.",
    evidence: [
      "docs/patterns/admin-data-composition.md",
      "showcase/demos/patterns/admin-data-composition.tsx",
      "tests/pattern-admin-data-composition.test.tsx",
    ],
    baseline: "2026-09-18",
  };
}

componentReviews["core-typography"] = {
  status: "reviewed",
  scope: "FI-001 certified: semantic HTML heading level is decoupled from visual role, canonical Typography owns metric authority, and the completed product corpus is guarded against raw typography bypasses.",
  evidence: ["docs/foundation-integrity-program.md", "foundation-integrity.json", "tests/typography-foundation-conformance.test.ts", "scripts/check-foundation-integrity.mjs"],
  baseline: "FI-001 certified / 2026-09-18",
};
componentReviews["gouno-page-header"] = {
  status: "reviewed",
  scope: "FI-001 certified: PageHeader keeps route-level H1 semantics while consuming the canonical page-title visual role without local text-size authority.",
  evidence: ["foundation-integrity.json", "src/gouno/page-header.tsx", "tests/typography-foundation-conformance.test.ts"],
  baseline: "FI-001 certified / 2026-09-18",
};
componentReviews["theme-system"] = {
  status: "reviewed",
  scope: "FI-001 Radius certified: Theme owns the canonical numeric radius scale; compatibility/control aliases no longer duplicate 6px authority.",
  evidence: ["foundation-integrity.json", "src/tokens.css", "tests/radius-foundation-conformance.test.ts", "scripts/check-foundation-integrity.mjs"],
  baseline: "FI-001 Radius certified / 2026-09-18",
};
componentReviews["core-checkbox"] = {
  status: "reviewed",
  scope: "FI-001 Radius certified: Checkbox consumes the semantic small radius instead of a raw 4px value.",
  evidence: ["foundation-integrity.json", "src/components/primitives/checkbox.tsx", "tests/radius-foundation-conformance.test.ts"],
  baseline: "FI-001 Radius certified / 2026-09-18",
};

for (const id of ["core-button", "core-segmented", "core-input-otp"]) {
  componentReviews[id] = {
    status: "reviewed",
    scope: "FI-001 Sizing certified: shared ControlSize semantics resolve through one 32/36/44px token authority while preserving caller height overrides.",
    evidence: ["foundation-integrity.json", "docs/foundation-geometry-inventory.md", "tests/sizing-foundation-conformance.test.ts", "scripts/check-foundation-integrity.mjs"],
    baseline: "FI-001 Sizing certified / 2026-09-18",
  };
}

for (const id of ["core-space", "core-flex", "core-grid"]) {
  componentReviews[id] = {
    status: "reviewed",
    scope: "FI-001 Spacing certified: Space, Flex and Grid share one named semantic gap scale while numeric gaps remain an explicit precision escape hatch.",
    evidence: ["foundation-integrity.json", "docs/foundation-geometry-inventory.md", "src/core/layout.tsx", "scripts/check-foundation-integrity.mjs"],
    baseline: "FI-001 Spacing certified / 2026-09-18",
  };
}

componentReviews["gouno-page-container"] = {
  status: "reviewed",
  scope: "FI-001 Layout certified: PageContainer consumes the semantic page-track authority for canonical width and page-stack rhythm without local geometry literals.",
  evidence: ["foundation-integrity.json", "docs/foundation-geometry-inventory.md", "src/gouno/page-container.tsx", "tests/gouno-structure.test.tsx", "scripts/check-foundation-integrity.mjs"],
  baseline: "FI-001 Layout certified / 2026-09-18",
};

for (const id of ["theme-system", "core-table"]) {
  componentReviews[id] = {
    status: "reviewed",
    scope: "FI-001 Density certified: Theme publishes the global comfortable/compact fallback policy, density-aware Tables consume it only in local default mode, and explicit compact/touch modes remain authoritative.",
    evidence: ["foundation-integrity.json", "docs/foundation-geometry-inventory.md", "tests/density-foundation-conformance.test.ts", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "FI-001 Density certified / 2026-09-18",
  };
}

for (const id of ["core-spin", "core-timeline", "core-steps", "core-table"]) {
  componentReviews[id] = {
    status: "reviewed",
    scope: "FI-001 Border certified: ordinary boundaries remain 1px semantic borders, 2px indicator/emphasis geometry resolves through edge-* roles, and stronger 4px reading accents are explicitly classified rather than encoded as raw numeric widths.",
    evidence: ["foundation-integrity.json", "docs/design-language.md", "docs/foundation-geometry-inventory.md", "tests/border-foundation-conformance.test.ts", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "FI-001 Border certified / 2026-09-18",
  };
}

for (const id of ["theme-system", "core-alert", "core-image"]) {
  componentReviews[id] = {
    status: "reviewed",
    scope: "FI-001 Color certified: application UI color consumes semantic Theme roles, browser theme-color follows computed background, overlay copy uses overlay-foreground, and fixed/caller-owned color exceptions are explicitly classified and guarded.",
    evidence: ["foundation-integrity.json", "docs/foundation-color-inventory.md", "docs/design-language.md", "tests/color-foundation-conformance.test.ts", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "FI-001 Color certified / 2026-09-18",
  };
}

for (const id of ["theme-system", "core-grid"]) {
  componentReviews[id] = {
    status: "reviewed",
    scope: "FI-001 Responsive certified: Theme owns the canonical sm/md/lg/xl/2xl scale, Base CSS mirrors the same rem tiers under guard, Row/Col stays aligned, and Steps responsive stacking resolves through canonical max-sm with no arbitrary breakpoint exception.",
    evidence: ["foundation-integrity.json", "docs/foundation-responsive-inventory.md", "docs/design-language.md", "tests/responsive-foundation-conformance.test.tsx", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "FI-001 Responsive certified / 2026-09-18",
  };
}

for (const id of ["core-anchor", "core-back-top", "core-carousel"]) {
  componentReviews[id] = {
    status: "reviewed",
    scope: "FI-001 Motion certified: CSS and JavaScript share one reduced-motion authority; Anchor/BackTop resolve imperative scroll through that policy, and Carousel collapses autoplay/inline transition/lifecycle motion while reacting to live preference changes.",
    evidence: ["foundation-integrity.json", "docs/foundation-motion-inventory.md", "docs/design-language.md", "tests/motion-foundation-conformance.test.tsx", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "FI-001 Motion certified / 2026-09-18",
  };
}

for (const id of ["core-button","core-input","core-textarea","core-checkbox","core-radio","core-switch","core-tabs","core-badge","core-select","core-modal","core-drawer"]) {
  componentReviews[id] = {
    status: "reviewed",
    scope: "FI-001 Focus certified: Base fallback and component-owned focus share canonical 2px geometry, owned rings suppress duplicate outlines, and Dialog/Sheet close controls use keyboard-visible focus semantics.",
    evidence: ["foundation-integrity.json", "docs/foundation-focus-inventory.md", "docs/design-language.md", "tests/focus-foundation-conformance.test.ts", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "FI-001 Focus certified / 2026-09-18",
  };
}

for (const id of ["theme-system","gouno-app-shell","pattern-bulk-action-bar","core-affix","core-back-top","core-float-button","core-modal","core-drawer","core-popconfirm","core-popover","core-tooltip","core-dropdown","core-select","core-menu","core-autocomplete","core-mentions","core-message","core-notification"]) {
  componentReviews[id] = {
    status: "reviewed",
    scope: "FI-001 Overlay certified: semantic sticky/shell/floating/modal/popup/notice Layer roles own application-global stacking, nested popup portals are deterministically above modal surfaces, caller zIndex keeps mask/content aligned, and Showcase tooling is isolated.",
    evidence: ["foundation-integrity.json", "docs/foundation-overlay-inventory.md", "docs/design-language.md", "tests/overlay-foundation-conformance.test.tsx", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "FI-001 Overlay certified / 2026-09-18",
  };
}

for (const [id, scope] of Object.entries({
  "core-select": "CSA-2 Wave B manual-reviewed: real browser evidence confirms the visible self-rendered popup, focus/option states and form-compatible trigger surface.",
  "core-cascader": "CSA-2 Wave B manual-reviewed: the final registered canonical demo renders a real multi-column hierarchy with active-path state; legacy simple snippets are not canonical evidence.",
  "core-tree-select": "CSA-2 Wave B manual-reviewed: single and multiple modes render real tree popups with branch, selection, tag and checkbox hierarchy.",
  "core-dropdown": "CSA-2 Wave B manual-reviewed: real browser evidence confirms anchored action-menu hierarchy including destructive action treatment.",
  "core-popover": "CSA-2 Wave B manual-reviewed: contextual popup remains visually and semantically distinct from modal/drawer surfaces.",
  "core-drawer": "CSA-2 Wave B manual-reviewed: real browser evidence confirms Showcase-tooling offset, overlay layering, header/close ownership and focused form content.",
})) {
  componentReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-2 Wave B manual-reviewed / 2026-09-20",
  };
}

componentReviews["core-steps"] = {
  status: "reviewed",
  scope: "CSA-D001 certified: manual browser review now proves the complete responsive stack below canonical md, readable min-w-44 horizontal tracks above md, constrained-container overflow ownership, and separate vertical-dot geometry without title truncation.",
  evidence: ["foundation-integrity.json", "docs/foundation-responsive-inventory.md", "docs/canonical-showcase-audit.md", "src/core/steps.tsx", "tests/responsive-foundation-conformance.test.tsx", "showcase/e2e/canonical-visual-golden.pw.mjs"],
  baseline: "CSA-D001 certified / 2026-09-20",
};

componentReviews["core-tag"] = {
  status: "reviewed",
  scope: "FI-D004 certified: Tag close interaction feedback derives from current/semantic foreground instead of a raw palette color; Color and Interaction State exact-head guards/consumer parity are green.",
  evidence: ["foundation-integrity.json", "docs/foundation-state-inventory.md", "docs/foundation-color-inventory.md", "src/core/tag.tsx", "tests/color-foundation-conformance.test.ts", "tests/state-foundation-conformance.test.tsx"],
  baseline: "FI-D004 certified / 2026-09-19",
};

componentReviews["core-carousel"] = {
  status: "reviewed",
  scope: "FI-D002 certified: draggable Carousel preserves nested interactive pointer ownership, prev/next semantic slots are present on the real controls, and Playwright proves arrows navigate the canonical draggable Showcase.",
  evidence: ["foundation-integrity.json", "docs/foundation-state-inventory.md", "src/core/carousel.tsx", "tests/state-foundation-conformance.test.tsx", "showcase/e2e/canonical-visual-golden.pw.mjs"],
  baseline: "FI-D002 certified / 2026-09-19",
};

componentReviews["core-config-provider"] = {
  status: "reviewed",
  scope: "FI-D003 certified: canonical Showcase visibly proves simultaneous zh-CN/en-US Provider effects on Select/Pagination and explicit caller-copy precedence; focused DOM and real-browser contracts protect the evidence.",
  evidence: ["docs/component-localization.md", "showcase/demos/core/config-provider/localized.tsx", "tests/core-localization.test.tsx", "tests/showcase-config-provider-demo.test.tsx", "showcase/e2e/canonical-visual-golden.pw.mjs"],
  baseline: "FI-D003 certified / 2026-09-19",
};


for (const [id, scope] of Object.entries({
  "core-form": "FI-001 Accessibility certified: Field preserves native/control-owned naming, groups independently named controls only when needed, and propagates hint/error/required semantics without duplicate accessible owners.",
  "core-select": "FI-001 Accessibility certified: the visible combobox owns public id/name/state/relationships while the hidden native select is form-serialization compatibility only.",
  "core-collapse": "FI-001 Accessibility certified: icon-only disclosure controls derive contextual names from their visible panel labels and retain role-specific expanded/controls semantics.",
  "core-tree": "FI-001 Accessibility certified: tree switchers derive contextual names from node titles while treeitem state and keyboard ownership remain canonical.",
  "core-modal": "FI-001 Accessibility certified: dialog surfaces have neutral/localized names, localized close affordances, focus containment and deterministic focus return.",
  "core-drawer": "FI-001 Accessibility certified: drawer surfaces have neutral/localized names, localized close affordances, focus containment and deterministic focus return.",
  "core-tag": "FI-001 Accessibility certified: checkable + closable tags use sibling interactive owners rather than nested native buttons, with separate names and state.",
})) {
  componentReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["foundation-integrity.json", "docs/foundation-accessibility-inventory.md", "docs/design-language.md", "tests/accessibility-foundation-conformance.test.tsx", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "FI-001 Accessibility certified / 2026-09-19",
  };
}

componentReviews["pattern-dedicated-editor"] = {
  status: "reviewed",
  scope: "FI-001 certified: Dedicated Editor explicitly separates nested/standalone heading semantics from task-title visual hierarchy and stays under the canonical Typography guard.",
  evidence: ["foundation-integrity.json", "docs/patterns/dedicated-editor.md", "showcase/components/patterns/dedicated-editor.tsx", "tests/typography-foundation-conformance.test.ts"],
  baseline: "FI-001 certified / 2026-09-18",
};

for (const [id, scope] of Object.entries({
  "core-tabs": "CSA-2 Wave C manual-reviewed: real browser evidence confirms active-tab transition, selected indicator and panel ownership in the canonical Tabs demo.",
  "core-menu": "CSA-2 Wave C manual-reviewed: inline hierarchy preserves submenu expansion, selected-leaf emphasis and disabled/action separation without visual ambiguity.",
  "core-collapse": "CSA-2 Wave C manual-reviewed: accordion transition, expanded disclosure state, extra action placement and disabled panel treatment were inspected in Chromium.",
  "core-pagination": "CSA-2 Wave C manual-reviewed: real page transition proves aria-current ownership and the selected-page visual state while preserving page-density/ellipsis geometry.",
  "core-breadcrumb": "CSA-2 Wave C manual-reviewed: attached navigation menu preserves breadcrumb hierarchy, separator rhythm and popup anchoring in the rendered canonical demo.",
  "core-anchor": "CSA-2 Wave C manual-reviewed: native hash navigation reaches the real target without fixed-header obstruction; browser assertions own hash/target correctness.",
})) {
  componentReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-2 Wave C manual-reviewed / 2026-09-20",
  };
}

for (const [id, scope] of Object.entries({
  "core-alert": "CSA-2 Wave D manual-reviewed: four semantic Alert tones, closable lifecycle/reset, action placement and visible feedback hierarchy were inspected in Chromium.",
  "core-popconfirm": "CSA-2 Wave D manual-reviewed: destructive confirmation renders as a focused alertdialog with clear title/description ownership and cancel/destructive action hierarchy.",
  "core-message": "CSA-2 Wave D manual-reviewed: simultaneous success/error transient messages remain legible as a notice queue; Fixture safe-area integration is guarded without leaking Showcase tooling into Core.",
  "core-notification": "CSA-2 Wave D manual-reviewed: mixed success/error/persistent notifications preserve semantic icon/tone, close ownership and queue rhythm; Fixture safe-area integration is browser-guarded.",
  "core-empty": "CSA-2 Wave D manual-reviewed: contained Empty state preserves centered icon/title/description/action rhythm without manufacturing its own outer surface.",
  "core-result": "CSA-2 Wave D manual-reviewed: success Result preserves terminal-state icon/title/description/action hierarchy and caller-owned page/surface context.",
  "core-spin": "CSA-2 Wave D manual-reviewed: busy overlay keeps retained content visible underneath while spinner/tip own the active refresh state.",
})) {
  componentReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs", "tests/showcase-fixture-dock.test.tsx"],
    baseline: "CSA-2 Wave D manual-reviewed / 2026-09-20",
  };
}

for (const [id, scope] of Object.entries({
  "core-progress": "CSA-2 Wave E manual-reviewed: real browser evidence confirms a 64% → 74% state transition, fill geometry, localized value copy and adjacent decrement/increment action rhythm.",
  "core-skeleton": "CSA-2 Wave E manual-reviewed: two-card loading structure preserves decorative placeholder ownership, consistent density and caller-owned surface boundaries.",
  "core-tooltip": "CSA-2 Wave E manual-reviewed: keyboard focus opens the canonical tooltip with visible trigger focus, bottom-start anchoring, arrow geometry and popup depth.",
  "core-tour": "CSA-2 Wave E manual-reviewed: the canonical two-step modal walkthrough preserves step/progress/action hierarchy, Fixture-safe modal depth and focus return after completion.",
})) {
  componentReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-2 Wave E manual-reviewed / 2026-09-20",
  };
}


for (const [id, scope] of Object.entries({
  "core-checkbox": "CSA-2 Wave F manual-reviewed: real browser evidence confirms visible Checkbox state transition and disabled-state composition.",
  "core-radio": "CSA-2 Wave F manual-reviewed: real browser evidence confirms mutually exclusive Radio selection and disabled-state composition.",
  "core-switch": "CSA-2 Wave F manual-reviewed: the visible label owns the hit target while native switch semantics preserve checked/disabled state.",
  "core-segmented": "CSA-2 Wave F manual-reviewed: visible segmented items drive the native radiogroup selection transition without hidden-input interaction leakage.",
  "core-slider": "CSA-2 Wave F manual-reviewed: native keyboard stepping updates both range value and visible value copy while disabled state remains distinct.",
  "core-rate": "CSA-2 Wave F manual-reviewed: score transition, radiogroup state and disabled example remain visually coherent.",
  "core-input-otp": "CSA-2 Wave F manual-reviewed: sequential digit entry, focus progression and disabled masked peer were inspected in Chromium.",
  "core-input-number": "CSA-2 Wave G manual-reviewed: formatted controlled value and keyboard step transition preserve focus, controls and visible value ownership.",
  "core-date-picker": "CSA-2 Wave G manual-reviewed: controlled date and explicit clear lifecycle preserve input/action geometry and empty-state copy.",
  "core-date-range-picker": "CSA-2 Wave G manual-reviewed: paired native dates preserve range geometry while start-date updates leave the end-date contract stable.",
  "core-time-picker": "CSA-2 Wave G manual-reviewed: native time update plus warning-state peer preserve Gouno sizing/state treatment around platform-owned chrome.",
  "core-color-picker": "CSA-2 Wave G manual-reviewed: native color value, keyboard focus and warning-state peer preserve Gouno-owned geometry/state around platform chrome.",
  "core-upload": "CSA-2 Wave G manual-reviewed: controlled selection renders a coherent drag target and owned file list with remove affordance.",
  "core-autocomplete": "CSA-2 Wave G manual-reviewed: filtered popup preserves active/disabled option hierarchy and keyboard confirmation.",
  "core-mentions": "CSA-2 Wave G manual-reviewed: active mention popup, keyboard highlight movement and committed mention preserve textbox/listbox ownership.",
  "core-transfer": "CSA-2 Wave G manual-reviewed: source selection enables the intended operation and visibly moves the item into the target list.",
})) {
  componentReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-2 Waves F-G manual-reviewed / 2026-09-21",
  };
}


for (const [id, scope] of Object.entries({
  "core-list": "CSA-2 Wave H manual-reviewed: localized Empty, active loading overlay and explicit Load More composition preserve caller-owned list structure.",
  "core-descriptions": "CSA-2 Wave H manual-reviewed: bordered vertical descriptions collapse to one readable column at 600px while long values wrap without product-specific wrappers.",
  "core-calendar": "CSA-2 Wave H manual-reviewed: controlled selected-date state, ISO week-number column and a real September 10 → September 18 selection transition were inspected in Chromium.",
  "core-image": "CSA-2 Wave H / CSA-D003 certified: preview zoom/rotation keeps transformed media interactive while the local action bar remains visually and pointer-wise above it; ordinary Close click succeeds after transforms.",
  "core-table": "CSA-2 Wave H manual-reviewed: selected/disabled rows, footer/caption ownership and compact/touch/sticky density variants preserve canonical table hierarchy.",
  "core-statistic": "CSA-2 Wave H manual-reviewed: label/value/suffix hierarchy remains compact and caller-owned without manufacturing a Card or trend policy.",
  "core-timeline": "CSA-2 Wave H manual-reviewed: alternate vertical and reversed horizontal timelines preserve item/rail alignment and readable title/content ownership.",
  "core-tree": "CSA-2 Wave H manual-reviewed: expanded hierarchy, controlled selection and checkbox state remain coherent after real select/check transitions.",
})) {
  componentReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-2 Wave H manual-reviewed / 2026-09-21",
  };
}


for (const [id, scope] of Object.entries({
  "core-icon": "CSA-2 Wave I manual-reviewed: decorative/named semantics, semantic sizing, loading rotation and explicit pixel/rotation geometry were inspected in Chromium.",
  "core-typography": "CSA-2 Wave I manual-reviewed: document heading level remains independent from visual role; H1/H2 task-role metrics match while page/section hierarchy remains visually distinct.",
  "core-kbd": "CSA-2 Wave I manual-reviewed: native kbd tokens preserve compact shortcut rhythm without introducing a second shortcut grammar.",
  "core-badge": "CSA-2 Wave I manual-reviewed: zero, overflow, text, dot/status and size/offset variants remain coherent, and real count state transitions from 5 to 6.",
  "core-tag": "CSA-2 Wave I manual-reviewed: closable lifecycle, disabled close affordance and uncontrolled checkable transitions remain visually and semantically distinct.",
  "core-avatar": "CSA-2 Wave I manual-reviewed: small/middle/large/custom size geometry and circle/square shape contracts render consistently with deterministic image evidence.",
  "core-space": "CSA-2 Wave I manual-reviewed: wrap/split composition preserves token-owned spacing and parent-owned outer rhythm.",
  "core-flex": "CSA-2 Wave I manual-reviewed: row-reverse, wrap-reverse and numeric gap preserve direct-child layout without wrapper leakage.",
  "core-grid": "CSA-2 Wave I manual-reviewed: 24-column responsive layout renders one column at 600px, two columns at 820px and four columns at 1100px.",
  "core-separator": "CSA-2 Wave I manual-reviewed: horizontal titled line variants and semantic vertical separator preserve line/content ownership and surrounding spacing.",
  "core-card": "CSA-2 Wave I manual-reviewed: default-to-elevated transition changes surface depth while header/content/footer hierarchy and action placement remain stable.",
  "core-splitter": "CSA-2 Wave I manual-reviewed: keyboard resize changes the canonical 36/64 split to 37/63 with visible focused separator ownership and readable panels.",
  "core-page-layout": "CSA-2 Wave I manual-reviewed: Header/Sider/Content/Footer semantic regions preserve canonical admin-shell geometry including the 240px Sider.",
})) {
  componentReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-2 Wave I manual-reviewed / 2026-09-21",
  };
}


for (const [id, scope] of Object.entries({
  "core-input": "CSA-2 Wave J manual-reviewed: controlled allowClear lifecycle clears the value, preserves focus and keeps prefix/status ownership coherent without locale-dependent evidence.",
  "core-textarea": "CSA-2 Wave J manual-reviewed: controlled edit updates the live 10 / 60 character count while the textarea retains the canonical aria-describedby relationship.",
  "core-code-block": "CSA-2 Wave J manual-reviewed: copy action writes the exact displayed canonical source to the clipboard and exposes copied feedback without changing code-surface ownership.",
  "core-float-button": "CSA-2 Wave J manual-reviewed: button and anchor modes preserve native semantics while keyboard focus opens the real Tooltip without replacing the accessible name.",
  "core-qrcode": "CSA-2 Wave J manual-reviewed: named 180px canvas renders actual dark QR modules and retains caller-owned accessibility semantics.",
  "core-watermark": "CSA-2 Wave J manual-reviewed: generated SVG watermark tile remains decorative while the content region keeps caller-owned semantics and readable content hierarchy.",
  "core-affix": "CSA-2 Wave J manual-reviewed: real scrolling inside the demo overflow ancestor proves sticky containment and canonical top-offset behavior.",
  "core-back-top": "CSA-2 Wave J manual-reviewed: with a genuinely scrollable window, ordinary activation returns scrollY to 0 under reduced-motion preference without changing the component contract.",
})) {
  componentReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-2 Wave J manual-reviewed / 2026-09-21",
  };
}

componentReviews["core-modal"] = {
  status: "reviewed",
  scope: "CSA-2 Modal ledger normalization: Wave A already manually accepted nested Modal + Popover layering and Modal focus-trap behavior on exact-head Chromium evidence; Wave J records that accepted browser coverage without manufacturing redundant captures.",
  evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
  baseline: "CSA-2 Wave A evidence normalized / 2026-09-21",
};


for (const [id, scope] of Object.entries({
  "pattern-bulk-action-bar": "CSA-3 Wave K manual-reviewed: selected-context ownership, real 3 → 2 selection transition, caller-owned archive feedback, cancel disappearance and selection restoration preserve one canonical collection-action grammar.",
  "gouno-page-container": "CSA-3 Wave K manual-reviewed: the rendered content track consumes the canonical 90rem max-width and 24px page-stack rhythm without page-local geometry authority.",
  "gouno-page-header": "CSA-3 Wave K manual-reviewed: route-level page H1, description and action group remain one desktop row and collapse to a readable single-axis mobile composition below md.",
  "gouno-page-skeleton": "CSA-3 Wave K manual-reviewed: status/busy semantics remain stable while collection loading changes from desktop table geometry to mobile Card geometry; form/dashboard variants remain sibling loading contracts.",
  "gouno-app-shell": "CSA-3 Wave K manual-reviewed: desktop shell owns header/288px navigation/main regions, mobile owns a real Sheet navigation path, and closing through navigation returns focus to the trigger.",
})) {
  componentReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-3 Wave K manual-reviewed / 2026-09-21",
  };
}


for (const [id, scope] of Object.entries({
  "pattern-collection-composition": "CSA-3 Wave L manual-reviewed: summary, toolbar, data view and pagination keep stable ownership through real 3 → 1 → 0-result filtering without rebuilding the outer collection grammar.",
  "pattern-record-detail-composition": "CSA-3 Wave L manual-reviewed: identity, record-wide feedback, summary and evidence sections preserve one vertical ownership order with Run-wide state above record-local content.",
  "pattern-master-detail-composition": "CSA-A004 corrected: peer switching preserves selected context; desktop remains dual-pane, tablet stacks both panes, and mobile uses one active pane with an explicit return path to master.",
  "pattern-settings-composition": "CSA-3 Wave L manual-reviewed: feedback, semantic sections and one task action boundary stay ordered across desktop/mobile while the visible Switch label drives the real checked-state transition.",
  "pattern-data-summary-composition": "CSA-3 Wave L manual-reviewed: semantic metric roles preserve 4 / 2 / 1-column responsive geometry at 1440 / 800 / 600 widths and remain ahead of detailed data.",
})) {
  componentReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-3 Wave L manual-reviewed / 2026-09-21",
  };
}


for (const [id, scope] of Object.entries({
  "pattern-dedicated-editor": "CSA-3 Wave M manual-reviewed: Configuration and Workspace subtypes preserve task-title hierarchy, feedback placement, desktop primary/secondary ownership, 600px collapse, DocumentEditorShell navigator/canvas/inspector ownership and read-only action state.",
  "pattern-editor-form-composition": "CSA-3 Wave M manual-reviewed: identity, form-wide feedback, semantic Sections and one task action boundary stay ordered across surface context changes, feedback lifecycle and mobile single-axis field stacking.",
  "pattern-markdown-editor": "CSA-3 Wave M manual-reviewed: product-owned AI toolbar insertion, Edit/Split/Preview transitions, preview ownership and 600px adaptive icon toolbar work without horizontal overflow.",
  "pattern-ai-suggestion-picker": "CSA-3 Wave M manual-reviewed: mutually exclusive radio candidates, one explicit Apply boundary, regenerate reset and dismiss/reopen lifecycle remain attached to the same canonical example instance.",
  "pattern-ai-suggestion-review": "CSA-3 Wave M manual-reviewed: checkbox review of related field changes, counted Apply boundary and dismiss/reopen lifecycle preserve explicit human review before commit.",
})) {
  componentReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-3 Wave M manual-reviewed / 2026-09-21",
  };
}


export const productReviews: Record<string, ComponentReview> = {};

for (const [id, scope] of Object.entries({
  "blog-admin-dashboard": "CSA-4 Wave N manual-reviewed: route-level page hierarchy, four-metric operating summary, traffic visualization and create permission action compose coherently as the real Blog Admin Dashboard.",
  "blog-admin-posts": "CSA-4 Wave N manual-reviewed: search/status/category/tag filters, real row selection, BulkActionBar ownership and desktop table to 600px card-list transition preserve task context without horizontal overflow.",
  "blog-admin-categories": "CSA-4 Wave N manual-reviewed: Collection page flows into the real New Category Drawer using canonical Editor Form anatomy and a field-scoped Slug AI affordance.",
  "blog-admin-tags": "CSA-4 Wave N manual-reviewed: tag card-grid resource management preserves selection state and the shared AI/delete BulkActionBar grammar without page-local action drift.",
  "blog-admin-pages": "CSA-4 Wave N manual-reviewed: single-page collection filters and selection preserve the same AI/delete bulk task boundary as other managed content resources.",
  "blog-admin-comments": "CSA-4 Wave N manual-reviewed: moderation filter ownership, real selection and reported-only filtering correctly clear stale bulk-selection context while preserving the review list.",
  "blog-admin-notifications": "CSA-4 Wave N manual-reviewed: independent notification filtering and selection use canonical bulk actions; successful mark-read mutation clears selection and surfaces product feedback.",
  "blog-admin-media-library": "CSA-4 Wave N manual-reviewed: media collection/search/type grammar flows into the real Upload Drawer with Upload and Alt Text fields while page/card actions remain visually subordinate.",
  "blog-admin-users": "CSA-4 Wave N manual-reviewed: member directory flows into the role editor while keeping Blog product-role ownership distinct from external GOSSO identity/account management.",
})) {
  productReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-4 Wave N manual-reviewed / 2026-09-21",
  };
}


for (const [id, scope] of Object.entries({
  "blog-admin-post-editor": "CSA-4 Wave O manual-reviewed: real History/restore workflow returns to Outline, preserves DocumentEditorShell ownership, and stacks navigator/canvas/inspector coherently at 600px without horizontal overflow.",
  "blog-admin-page-editor": "CSA-4 Wave O manual-reviewed: page-specific editor keeps Inspector-owned template/navigation/Slug settings, applies a real title AI candidate, and stacks canvas/inspector cleanly at 600px.",
  "blog-admin-ai-operations": "CSA-4 Wave O manual-reviewed: Overview/Queue/Automation/Run Center remain one product workspace; Workflow detail opens from Automation and Run Center stays an evidence center rather than duplicating configuration.",
  "blog-admin-ai-settings": "CSA-4 Wave O manual-reviewed: six settings sections stay in one route; Skill editing uses the Dedicated Editor grammar and Model Connections reuse the canonical privileged-operation/TabPanelLead composition.",
  "blog-admin-site-settings": "CSA-4 Wave O manual-reviewed: dirty draft survives MFA expiry, Step-Up and privilege restore, remains usable at 600px, then commits and returns the product to synchronized state.",
})) {
  productReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-4 Wave O manual-reviewed / 2026-09-21",
  };
}


for (const [id, scope] of Object.entries({
  "gosso-overview": "CSA-4 Wave P manual-reviewed: administrator context switches to the ordinary-user account center with explicit permission boundaries and three coherent self-service navigation targets.",
  "gosso-account-settings": "CSA-4 Wave P manual-reviewed: the Active Sessions task terminates a non-current session through confirmation, removes the revoked session and surfaces one explicit product feedback message.",
  "gosso-system-clients": "CSA-4 Wave P manual-reviewed: OAuth2 client registration preserves client configuration ownership and confidential-client creation flows into a single one-time secret disclosure surface.",
  "gosso-system-users": "CSA-4 Wave P manual-reviewed: role management updates Content Editor through the dedicated modal, persists the auditor role and emits one non-duplicated success Message.",
  "gosso-system-audit-logs": "CSA-4 Wave P manual-reviewed: event filtering narrows the audit collection and the selected event opens a focused read-only evidence modal without losing collection context.",
  "gosso-system-site-settings": "CSA-4 Wave P manual-reviewed: branding edits update the live login preview, dirty/save state remains explicit, and the form/preview ownership stacks coherently at 600px.",
  "gosso-system-status": "CSA-4 Wave P manual-reviewed: degraded and unavailable health states preserve alert, metric and dependency ownership through the 503 mobile composition.",
})) {
  productReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-4 Wave P manual-reviewed / 2026-09-21",
  };
}


for (const [id, scope] of Object.entries({
  "gosso-login": "CSA-4 Wave Q manual-reviewed: password authentication advances through MFA into a terminal completion state, Sudo step-up also closes its challenge on success, and both flows preserve coherent desktop/mobile ownership.",
  "gosso-forgot-password": "CSA-4 Wave Q manual-reviewed: submission stays neutral about account existence, service failure preserves the same anti-enumeration boundary, and the mobile error state remains a focused recovery task.",
  "gosso-reset-password": "CSA-4 Wave Q manual-reviewed: length/mismatch validation, successful reset and expired-link recovery form one coherent password-reset state machine with the form removed after completion or expiry.",
  "gosso-callback": "CSA-4 Wave Q manual-reviewed: Authorization Code + PKCE processing resolves into distinct success/failure terminal states and the failure retry action cleanly returns to processing.",
  "gosso-not-found": "CSA-4 Wave Q manual-reviewed: the missing-route Result remains readable at 600px and its primary recovery action navigates back into the real Gosso Overview product context.",
})) {
  productReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-4 Wave Q manual-reviewed / 2026-09-21",
  };
}


for (const [id, scope] of Object.entries({
  "blog-home": "CSA-4 Wave R manual-reviewed: public reading/discovery hierarchy stays dominant, Featured Articles drives the all-articles intent, and the balanced Hero remains coherent across refreshed desktop/mobile light/dark baselines.",
  "blog-articles": "CSA-4 Wave R manual-reviewed: the full article index owns search/filter/pagination; a real Kubernetes query narrows to one result without converting the public collection into dashboard-style chrome.",
  "blog-search": "CSA-4 Wave R manual-reviewed: the route-owned OAuth2 query can be replaced by Kafka, updates the result heading and preserves both matching article results under the same public search composition.",
  "blog-article-detail": "CSA-4 Wave R manual-reviewed: administrator preview remains an explicit reading-state notice while article metadata, cover, TOC, code and long-form content compose without horizontal overflow at 600px.",
  "blog-categories": "CSA-4 Wave R manual-reviewed: category discovery preserves the public index hierarchy and a real architecture/security entry resolves to the expected category-detail navigation intent.",
  "blog-tags": "CSA-4 Wave R manual-reviewed: tag discovery remains a compact public index and the OAuth2 entry resolves to the expected tag-detail navigation intent.",
  "blog-archive": "CSA-4 Wave R manual-reviewed: chronological grouping remains the primary ownership model and a real archived entry resolves to its article-detail navigation intent.",
  "blog-about": "CSA-4 Wave R manual-reviewed: Blog-local document reading grammar keeps project context and principles readable while the continue-reading action resolves toward the article index.",
  "blog-custom-page": "CSA-4 Wave R manual-reviewed: the loaded CMS-style document and its not-found lifecycle share one Blog-local document route family; the 600px not-found recovery state remains clean after Showcase tooling is dismissed.",
})) {
  productReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-4 Wave R manual-reviewed / 2026-09-21",
  };
}


for (const [id, scope] of Object.entries({
  "blog-account-notifications": "CSA-4 Wave S manual-reviewed: unread filtering and mark-read mutations converge cleanly into the empty-unread state; mutation failure remains transient feedback while preserving the underlying notification list and unread count.",
  "blog-account-settings": "CSA-4 Wave S manual-reviewed: Blog keeps identity-security ownership with GOSSO rather than inventing local credential controls; the real GOSSO Admin handoff and missing-admin-URL recovery remain coherent through 600px.",
  "blog-not-found": "CSA-4 Wave S manual-reviewed: unknown public routes remain inside PublicShell with explicit home/article/search recovery actions; article recovery feedback and the 600px Result composition remain readable without horizontal overflow.",
})) {
  productReviews[id] = {
    status: "reviewed",
    scope,
    evidence: ["docs/canonical-showcase-audit.md", "showcase/e2e/canonical-visual-golden.pw.mjs"],
    baseline: "CSA-4 Wave S manual-reviewed / 2026-09-21",
  };
}


export function reviewedProgress(review: ComponentReview | undefined, fallback: number) {
  return review?.status === "reviewed" ? 100 : Math.min(fallback, 99);
}

const canonicalComponentId = /^(core|theme|pattern|gouno)-/;
export function componentProgress(id: string, fallback: number) {
  if (!canonicalComponentId.test(id)) return fallback;
  return reviewedProgress(componentReviews[id], fallback);
}
