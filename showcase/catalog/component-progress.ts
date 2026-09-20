// Showcase completion is reviewed evidence, not architecture status. Keep this
// list limited to canonical components whose API/examples/source/a11y/tests have
// been reviewed together. Product pages use their migration status directly.
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

export function reviewedProgress(review: ComponentReview | undefined, fallback: number) {
  return review?.status === "reviewed" ? 100 : Math.min(fallback, 99);
}

const canonicalComponentId = /^(core|theme|pattern|gouno)-/;
export function componentProgress(id: string, fallback: number) {
  if (!canonicalComponentId.test(id)) return fallback;
  return reviewedProgress(componentReviews[id], fallback);
}
