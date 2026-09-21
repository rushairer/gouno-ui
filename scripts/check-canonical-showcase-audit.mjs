import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();

async function source(path) {
  return readFile(resolve(root, path), "utf8");
}

const [agents, audit, golden] = await Promise.all([
  source("AGENTS.md"),
  source("docs/canonical-showcase-audit.md"),
  source("showcase/e2e/canonical-visual-golden.pw.mjs"),
]);

const failures = [];

function requireText(content, text, message) {
  if (!content.includes(text)) failures.push(message);
}

for (const marker of [
  "Canonical Showcase acceptance rule",
  "Manual Browser Reviewed",
  "A green automated suite cannot promote a surface to `Canonical` by itself.",
]) {
  requireText(
    agents,
    marker,
    `AGENTS.md no longer preserves the manual-first Canonical Showcase rule: ${marker}`,
  );
}

for (const marker of [
  "Program id: **CSA-001**",
  "Consumer expansion is paused",
  "manual-reviewed",
  "canonical",
  "reopened",
  "blocked",
  "Do not report “Showcase aligned”",
]) {
  requireText(
    audit,
    marker,
    `Canonical Showcase audit ledger is missing governance marker: ${marker}`,
  );
}

for (const evidence of [
  "core-focus-component-owned",
  "core-focus-fallback",
  "core-modal-nested-popover",
  "core-form-select-open",
  "core-modal-focus-trap",
  "core-config-provider-locales",
  "core-carousel-after-next",
  "core-steps-mobile-stack",
  "core-steps-intermediate-stack",
  "core-steps-desktop-inline",
  "core-steps-shell-constrained",
  "core-steps-vertical-dot",
  "core-select-popup",
  "core-cascader-columns",
  "core-tree-select-single-popup",
  "core-tree-select-multiple-popup",
  "core-dropdown-popup",
  "core-popover-popup",
  "core-drawer-open",
  "core-tabs-reports-active",
  "core-menu-inline-selection",
  "core-collapse-accordion",
  "core-pagination-page-7",
  "core-breadcrumb-project-menu",
  "core-anchor-contract-hash",
  "core-alert-semantic-states",
  "core-alert-closable-reset",
  "core-popconfirm-danger-open",
  "core-message-success-error",
  "core-notification-mixed-stack",
  "core-empty-contained-state",
  "core-result-success-state",
  "core-spin-busy-overlay",
  "core-progress-after-increase",
  "core-skeleton-loading-grid",
  "core-tooltip-keyboard-open",
  "core-tour-step-1",
  "core-tour-step-2",
  "core-checkbox-unchecked",
  "core-radio-pro-selected",
  "core-switch-off",
  "core-segmented-month-selected",
  "core-slider-keyboard-45",
  "core-rate-five-selected",
  "core-input-otp-complete",
  "core-transfer-after-add",
  "core-tree-selected-checked",
  "core-timeline-layouts",
  "core-statistic-summary",
  "core-table-density-states",
  "core-image-preview-transformed",
  "core-calendar-september-18-selected",
  "core-descriptions-mobile-single-column",
  "core-list-empty-loading",
  "core-mentions-popup",
  "core-autocomplete-popup",
  "core-upload-file-list",
  "core-color-picker-focus",
  "core-time-picker-updated",
  "core-date-range-updated",
  "core-date-picker-cleared",
  "core-input-number-keyboard-step",
  "core-page-layout-regions",
  "core-back-top-returned",
  "core-affix-sticky",
  "core-watermark-tile",
  "core-qrcode-canvas",
  "core-float-button-tooltip",
  "core-code-block-copied",
  "core-textarea-count-10",
  "core-input-cleared",
  "core-splitter-keyboard-resized",
  "core-card-elevated-composition",
  "core-separator-vertical-semantic",
  "core-separator-horizontal-variants",
  "core-grid-responsive-1100",
  "core-grid-responsive-600",
  "core-flex-reverse-wrap",
  "core-space-wrap-split",
  "core-avatar-size-shape",
  "core-tag-checkable-state",
  "core-tag-closable-lifecycle",
  "core-badge-count-statuses",
  "core-kbd-shortcuts",
  "core-typography-semantic-hierarchy",
  "core-icon-semantic-sizes",
]) {
  requireText(
    golden,
    evidence,
    `Canonical visual browser suite is missing CSA evidence capture: ${evidence}`,
  );
}

if (failures.length) {
  process.stderr.write(
    "Canonical Showcase audit contract failed:\n" +
      failures.map((failure) => `- ${failure}`).join("\n") +
      "\n",
  );
  process.exit(1);
}

process.stdout.write(
  "Canonical Showcase audit contract: manual-first governance and Core browser evidence are preserved.\n",
);
