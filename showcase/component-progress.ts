// Showcase completion is reviewed evidence, not architecture status. Keep this
// list limited to canonical components whose API/examples/source/a11y/tests have
// been reviewed together. Product pages use their migration status directly.
const completedComponents = new Set([
  "core-button",
  "core-badge",
  "core-tag",
  "core-space",
  "core-input",
  "core-textarea",
  "core-input-number",
  "core-select",
  "core-form",
  "core-date-picker",
  "core-upload",
  "core-segmented",
  "core-checkbox",
  "core-radio",
  "core-switch",
  "core-table",
  "core-pagination",
  "core-tabs",
  "core-anchor",
  "core-code-block",
  "core-alert",
  "core-modal",
  "core-drawer",
  "core-card",
  "core-typography",
  "core-progress",
  "core-empty",
  "core-result",
  "core-skeleton",
  "core-qrcode",
  "core-statistic",
  "core-popover",
  "core-tooltip",
  "core-dropdown",
  "core-page-layout",
  "theme-system",
  "pattern-bulk-action-bar",
  "gouno-app-shell",
  "gouno-page-container",
  "gouno-page-header",
]);

const canonicalComponentId = /^(core|theme|pattern|gouno)-/;

export function componentProgress(id: string, fallback: number) {
  if (!canonicalComponentId.test(id)) return fallback;
  return completedComponents.has(id) ? 100 : Math.min(fallback, 99);
}
