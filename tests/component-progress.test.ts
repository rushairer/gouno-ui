import { describe, expect, it } from "vitest";
import { componentProgress } from "../showcase/catalog/component-progress";

describe("audited batch completion", () => {
  it("reports complete only for the reviewed Core component batch", () => {
    for (const id of [
      "core-button",
      "core-icon",
      "core-kbd",
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

  it("reports the completed same-source and reading-evidence Core batch as complete", () => {
    for (const id of [
      "core-avatar",
      "core-separator",
      "core-splitter",
      "core-card",
      "core-progress",
      "core-code-block",
      "core-anchor",
      "core-qrcode",
      "core-statistic",
    ]) {
      expect(componentProgress(id, 0), id).toBe(100);
    }
  });

  it("reports Theme complete only after persistence and browser-side effects are reviewed", () => {
    expect(componentProgress("theme-system", 0)).toBe(100);
  });

  it("reports admitted Patterns complete only after focused review", () => {
    for (const id of ["pattern-bulk-action-bar", "pattern-markdown-editor"]) {
      expect(componentProgress(id, 0), id).toBe(100);
    }
  });

  it("reports admitted Gouno structure complete only after family API and behavior review", () => {
    for (const id of [
      "gouno-app-shell",
      "gouno-page-skeleton",
    ]) {
      expect(componentProgress(id, 0), id).toBe(100);
    }
  });

  it("keeps Foundation-reopened component reviews below certified completion", () => {
    for (const id of [
      "core-typography",
      "gouno-page-header",
      "pattern-dedicated-editor",
      "gouno-page-container",
      "core-space",
      "core-flex",
      "core-grid",
    ]) {
      expect(componentProgress(id, 0), id).toBeLessThan(100);
    }
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
