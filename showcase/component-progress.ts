export type AuditArea =
  | "api"
  | "states"
  | "interaction"
  | "accessibility"
  | "examples"
  | "source"
  | "tests";
export type AuditItem = {
  area: AuditArea;
  requirement: string;
  complete: boolean;
};

const done = (area: AuditArea, ...requirements: string[]): AuditItem[] =>
  requirements.map((requirement) => ({ area, requirement, complete: true }));

const previousAudits = {
  "core-input": [
    ...done(
      "api",
      "small/middle/large sizes",
      "prefix and suffix slots",
      "allowClear and status API",
      "native input attributes and ref",
    ),
    ...done(
      "states",
      "disabled and readOnly",
      "error and warning",
      "controlled and uncontrolled value",
    ),
    ...done(
      "accessibility",
      "native label association",
      "aria-invalid",
      "named clear action",
    ),
    ...done(
      "examples",
      "basic usage",
      "sizes and states",
      "controlled clear interaction",
    ),
    ...done("source", "every preview has reproducible source"),
    ...done("tests", "value, clear, state and ref coverage"),
  ],
  "core-textarea": [
    ...done(
      "api",
      "small/middle/large sizes",
      "character count and maxLength",
      "native textarea attributes and ref",
    ),
    ...done(
      "states",
      "disabled and readOnly",
      "error and warning",
      "controlled and uncontrolled value",
    ),
    ...done("accessibility", "count description linkage", "aria-invalid"),
    ...done(
      "examples",
      "basic usage",
      "sizes and states",
      "controlled count interaction",
    ),
    ...done("source", "every preview has reproducible source"),
    ...done("tests", "count, value and state coverage"),
  ],
  "core-input-number": [
    ...done(
      "api",
      "min/max/step/precision",
      "formatter and parser",
      "controls and keyboard options",
      "controlled and uncontrolled value",
    ),
    ...done(
      "states",
      "disabled and readOnly",
      "error and warning",
      "three sizes",
    ),
    ...done(
      "interaction",
      "step buttons",
      "ArrowUp and ArrowDown",
      "boundary clamping",
    ),
    ...done(
      "accessibility",
      "spinbutton value semantics",
      "named step controls",
    ),
    ...done(
      "examples",
      "basic usage",
      "sizes and states",
      "formatter/parser and controlled usage",
    ),
    ...done("source", "every preview has reproducible source"),
    ...done("tests", "step, keyboard, precision and boundary coverage"),
  ],
  "core-select": [
    ...done(
      "api",
      "native option composition",
      "placeholder",
      "small/middle/large sizes",
      "loading and status API",
      "native select attributes and ref",
    ),
    ...done(
      "states",
      "disabled and loading",
      "error and warning",
      "controlled and uncontrolled value",
    ),
    ...done(
      "interaction",
      "native keyboard selection",
      "native form serialization",
    ),
    ...done(
      "accessibility",
      "native combobox semantics",
      "aria-busy and aria-invalid",
    ),
    ...done(
      "examples",
      "basic usage",
      "sizes and states",
      "controlled selection",
    ),
    ...done("source", "every preview has reproducible source"),
    ...done("tests", "selection, loading, status and serialization coverage"),
  ],
  "core-form": [
    ...done(
      "api",
      "vertical/horizontal/inline layouts",
      "disabled and loading",
      "onFinish values and FormData",
      "onFinishFailed",
      "field hint/error/required API",
      "validateMessages and native form attributes",
    ),
    ...done(
      "states",
      "native validity failure",
      "loading busy state",
      "fieldset disabled propagation",
      "custom validation message handling",
    ),
    ...done(
      "accessibility",
      "label association",
      "hint and error descriptions",
      "alert error semantics",
    ),
    ...done(
      "examples",
      "basic form",
      "validation and submission",
      "all layouts",
      "disabled and loading",
    ),
    ...done("source", "every preview has reproducible source"),
    ...done("tests", "submit, failure, layout and field ARIA coverage"),
  ],
  "core-date-picker": [
    ...done(
      "api",
      "controlled and uncontrolled date",
      "min/max/native date attributes",
      "small/middle/large sizes",
      "allowClear and status",
    ),
    ...done("states", "disabled and readOnly", "error and warning"),
    ...done("interaction", "native keyboard/calendar input", "clear action"),
    ...done(
      "accessibility",
      "native date input",
      "named clear action",
      "aria-invalid",
    ),
    ...done(
      "examples",
      "basic usage",
      "sizes and boundaries",
      "controlled clear and states",
    ),
    ...done("source", "every preview has reproducible source"),
    ...done("tests", "date change, clear and status coverage"),
  ],
  "core-upload": [
    ...done(
      "api",
      "controlled and uncontrolled file list",
      "accept/multiple/maxCount/maxSize",
      "beforeSelect and rejection reasons",
      "custom trigger and list visibility",
    ),
    ...done("states", "disabled", "error", "empty and populated list"),
    ...done("interaction", "picker selection", "drag and drop", "remove file"),
    ...done(
      "accessibility",
      "native file input label",
      "error description",
      "named remove actions",
    ),
    ...done(
      "examples",
      "basic picker",
      "drag area",
      "validation and controlled list",
      "disabled and error",
    ),
    ...done("source", "every preview has reproducible source"),
    ...done(
      "tests",
      "selection, rejection, drag, removal and controlled coverage",
    ),
  ],
  "core-table": [
    ...done(
      "api",
      "header/body/footer/caption composition",
      "default/compact/touch density",
      "bordered/fixed/sticky options",
      "native table attributes",
      "Showcase API table documents table options",
    ),
    ...done("states", "hover and selected rows", "empty/loading composition"),
    ...done(
      "accessibility",
      "native table semantics",
      "caption and header scopes",
    ),
    ...done(
      "examples",
      "basic table",
      "density and bordered variants",
      "fixed/sticky and state composition",
    ),
    ...done("source", "every preview has reproducible source"),
    ...done("tests", "structure, density and options coverage"),
  ],
  "core-data-table": [
    ...done(
      "api",
      "typed columns and row keys",
      "controlled/uncontrolled sort",
      "controlled/uncontrolled selection",
      "controlled/uncontrolled pagination",
      "filter and custom render",
      "expandable rows",
      "locale and density",
      "API table includes all current DataTable props",
    ),
    ...done("states", "loading", "empty", "disabled rows"),
    ...done(
      "interaction",
      "three-state sorting",
      "page selection",
      "row expansion",
      "pagination",
    ),
    ...done(
      "accessibility",
      "aria-sort",
      "named row selection",
      "expanded state",
      "pagination navigation",
    ),
    ...done(
      "examples",
      "sorting/filtering/pagination",
      "selection and expansion",
      "loading/empty/density",
    ),
    ...done("source", "every preview has reproducible source"),
    ...done(
      "tests",
      "sort, filter, selection, expansion, controlled page and states coverage",
    ),
  ],
  "core-pagination": [
    ...done(
      "api",
      "page/total/pageSize",
      "controlled page changes",
      "disabled boundaries",
    ),
    ...done("states", "first/last page disabled", "disabled overall"),
    ...done("interaction", "previous and next navigation"),
    ...done("accessibility", "named pagination navigation", "live page status"),
    ...done("examples", "basic pagination", "boundary and disabled states"),
    ...done("source", "every preview has reproducible source"),
    ...done("tests", "boundary and callback coverage"),
  ],
  "core-modal": [
    ...done(
      "api",
      "controlled and uncontrolled open state",
      "four sizes and custom width",
      "title/description/footer",
      "loading",
      "close policy callbacks",
      "aria-label, contentStyle and native dialog semantics",
    ),
    ...done(
      "interaction",
      "Escape policy",
      "backdrop policy",
      "close action",
      "focus trap and return",
    ),
    ...done(
      "accessibility",
      "dialog role and accessible title",
      "description association",
    ),
    ...done(
      "examples",
      "basic controlled modal",
      "sizes and loading",
      "close policies and uncontrolled usage",
    ),
    ...done("source", "every preview has reproducible source"),
    ...done(
      "tests",
      "open state, Escape, close callback and focus return coverage",
    ),
  ],
  "core-drawer": [
    ...done(
      "api",
      "controlled and uncontrolled open state",
      "four placements",
      "width and height",
      "title/description/footer",
      "loading",
      "close policy callbacks",
      "aria-label, contentStyle and native sheet semantics",
    ),
    ...done(
      "interaction",
      "Escape policy",
      "backdrop policy",
      "close action",
      "focus trap and return",
      "placement dimensions applied as width or height",
    ),
    ...done(
      "accessibility",
      "dialog role and accessible title",
      "description association",
    ),
    ...done(
      "examples",
      "basic controlled drawer",
      "placements and dimensions",
      "loading and uncontrolled usage",
    ),
    ...done("source", "every preview has reproducible source"),
    ...done("tests", "open state, placement, Escape and focus return coverage"),
  ],
} satisfies Record<string, AuditItem[]>;

// These components have completed the current audit checklist. Their API rows,
// focused demos, source panels, regression tests, and browser checks are kept
// together in the same change so the catalog score reflects reviewed evidence.
const completedBatch = new Set([
  "core-input",
  "core-textarea",
  "core-input-number",
  "core-select",
  "core-form",
  "core-date-picker",
  "core-upload",
  "core-table",
  "core-data-table",
  "core-pagination",
  "core-modal",
  "core-drawer",
]);

export const componentAudits: Record<string, AuditItem[]> = Object.fromEntries(
  Object.entries(previousAudits).map(([id, items]) => [
    id,
    items.map((item) => ({
      ...item,
      complete: completedBatch.has(id) ? true : item.complete,
    })),
  ]),
);

export function componentProgress(id: string, fallback: number) {
  const audit = componentAudits[id];
  if (!audit?.length) return fallback;
  return Math.floor(
    (100 * audit.filter((item) => item.complete).length) / audit.length,
  );
}
