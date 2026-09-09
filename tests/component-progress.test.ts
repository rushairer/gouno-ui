import { describe, expect, it } from "vitest";
import { componentProgress } from "../showcase/component-progress";

describe("audited batch completion", () => {
  it("reports complete only for the reviewed Core component batch", () => {
    for (const id of [
      "core-tag",
      "core-input",
      "core-textarea",
      "core-input-number",
      "core-select",
      "core-form",
      "core-date-picker",
      "core-upload",
      "core-checkbox",
      "core-radio",
      "core-switch",
      "core-table",
      "core-pagination",
      "core-modal",
      "core-drawer",
    ]) {
      expect(componentProgress(id, 0), id).toBe(100);
    }
  });

  it("reports the completed same-source demo batch as complete", () => {
    for (const id of ["core-space", "core-card", "core-typography", "core-progress"]) {
      expect(componentProgress(id, 0), id).toBe(100);
    }
  });

  it("reports admitted Patterns complete only after focused review", () => {
    expect(componentProgress("pattern-bulk-action-bar", 0)).toBe(100);
  });

  it("does not let unaudited canonical entries claim 100 percent", () => {
    for (const id of ["core-unreviewed", "theme-unreviewed", "pattern-unreviewed", "gouno-unreviewed"]) {
      expect(componentProgress(id, 100), id).toBe(99);
    }
  });

  it("leaves real product migration progress untouched", () => {
    expect(componentProgress("blog-admin-posts", 100)).toBe(100);
    expect(componentProgress("gosso-overview", 100)).toBe(100);
  });
});
