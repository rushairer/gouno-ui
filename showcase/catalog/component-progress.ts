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
for (const id of ["core-button", "core-segmented", "core-input-otp"]) {
  componentReviews[id] = {
    status: "reopened",
    scope: "FI-001 Phase 2: Sizing Foundation reopened because the shared small/middle/large ControlSize vocabulary did not resolve to one outer-height authority; Button large diverged from standard controls.",
    evidence: ["docs/foundation-integrity-program.md", "foundation-integrity.json", "docs/foundation-geometry-inventory.md", "src/tokens.css", "src/core/control-types.ts"],
    baseline: "FI-001 Phase 2 / 2026-09-18",
  };
}

for (const id of ["core-space", "core-flex", "core-grid"]) {
  componentReviews[id] = {
    status: "reopened",
    scope: "FI-001 Phase 2: Spacing Foundation reopened because generic named gap values were not governed by one semantic scale across Space, Flex and Grid.",
    evidence: ["docs/foundation-integrity-program.md", "foundation-integrity.json", "src/tokens.css", "src/core/layout.tsx"],
    baseline: "FI-001 Phase 2 / 2026-09-18",
  };
}

componentReviews["gouno-page-container"] = {
  status: "reopened",
  scope: "FI-001 Phase 2: PageContainer Layout Foundation reopened because canonical page width and vertical rhythm were encoded as local utility literals instead of a semantic geometry authority.",
  evidence: ["docs/foundation-integrity-program.md", "foundation-integrity.json", "src/tokens.css", "src/gouno/page-container.tsx", "tests/gouno-structure.test.tsx"],
  baseline: "FI-001 Phase 2 / 2026-09-18",
};

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
