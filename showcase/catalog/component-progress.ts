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
  "gouno-app-shell",
  "gouno-page-container",
  "gouno-page-header",
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

export function reviewedProgress(review: ComponentReview | undefined, fallback: number) {
  return review?.status === "reviewed" ? 100 : Math.min(fallback, 99);
}

const canonicalComponentId = /^(core|theme|pattern|gouno)-/;
export function componentProgress(id: string, fallback: number) {
  if (!canonicalComponentId.test(id)) return fallback;
  return reviewedProgress(componentReviews[id], fallback);
}
