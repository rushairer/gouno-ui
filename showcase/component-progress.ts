// Showcase completion is reviewed evidence, not architecture status. Keep this
// list limited to canonical components whose API/examples/source/a11y/tests have
// been reviewed together. Product pages use their migration status directly.
const completedComponents = new Set([
  "core-badge",
  "core-space",
  "core-input",
  "core-textarea",
  "core-input-number",
  "core-select",
  "core-form",
  "core-date-picker",
  "core-upload",
  "core-table",
  "core-pagination",
  "core-tabs",
  "core-alert",
  "core-modal",
  "core-drawer",
  "core-card",
  "core-typography",
  "core-progress",
]);

export function componentProgress(id: string, fallback: number) {
  return completedComponents.has(id) ? 100 : fallback;
}
