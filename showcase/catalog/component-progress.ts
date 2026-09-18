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

componentReviews["pattern-dedicated-editor"] = {
  status: "reviewed",
  scope: "FI-001 certified: Dedicated Editor explicitly separates nested/standalone heading semantics from task-title visual hierarchy and stays under the canonical Typography guard.",
  evidence: ["foundation-integrity.json", "docs/patterns/dedicated-editor.md", "showcase/components/patterns/dedicated-editor.tsx", "tests/typography-foundation-conformance.test.ts"],
  baseline: "FI-001 certified / 2026-09-18",
};

export function reviewedProgress(review: ComponentReview | undefined, fallback: number) {
  return review?.status === "reviewed" ? 100 : Math.min(fallback, 99);
}

const canonicalComponentId = /^(core|theme|pattern|gouno)-/;
export function componentProgress(id: string, fallback: number) {
  if (!canonicalComponentId.test(id)) return fallback;
  return reviewedProgress(componentReviews[id], fallback);
}
