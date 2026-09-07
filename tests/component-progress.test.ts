import { describe, expect, it } from "vitest";
import { componentProgress } from "../showcase/component-progress";

describe("audited batch completion", () => {
  it("reports complete only for the reviewed component batch", () => {
    for (const id of [
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
    ]) {
      expect(componentProgress(id, 0), id).toBe(100);
    }
  });

  it("reports the completed same-source demo batch as complete", () => {
    for (const id of ["core-space", "core-card", "core-typography", "core-progress"]) {
      expect(componentProgress(id, 0), id).toBe(100);
    }
  });
});
