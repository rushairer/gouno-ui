import { describe, expect, it } from "vitest";
import { componentProgress } from "../showcase/catalog/component-progress";

describe("audited batch completion", () => {
  it("reports complete only for the reviewed Core component batch", () => {
    for (const id of [
      "core-icon",
      "core-kbd",
      "core-typography",
      "core-tag",
      "core-input",
      "core-textarea",
      "core-input-number",
      "core-select",
      "core-form",
      "core-date-picker",
      "core-upload",
      "core-table",
      "core-button",
      "core-input-otp",
      "core-segmented",
      "core-radio",
      "core-switch",
      "core-pagination",
      "core-alert",
      "core-modal",
      "core-drawer",
    ]) {
      expect(componentProgress(id, 0), id).toBe(100);
    }
  });

  it("reports the completed same-source and reading-evidence Core batch as complete", () => {
    for (const id of [
      "core-avatar",
      "core-space",
      "core-flex",
      "core-separator",
      "core-splitter",
      "core-card",
      "core-progress",
      "core-code-block",
      "core-anchor",
      "core-qrcode",
      "core-statistic",
      "core-image",
    ]) {
      expect(componentProgress(id, 0), id).toBe(100);
    }
  });

  it("reports Responsive-owned reviews complete only after certification", () => {
    for (const id of ["theme-system", "core-steps", "core-grid"]) {
      expect(componentProgress(id, 0), id).toBe(100);
    }
  });

  it("reports Motion-owned reviews complete only after certification", () => {
    for (const id of ["core-anchor", "core-back-top", "core-carousel"]) {
      expect(componentProgress(id, 0), id).toBe(100);
    }
  });

  it("reports admitted Patterns complete only after focused review", () => {
    for (const id of [
      "pattern-bulk-action-bar",
      "pattern-markdown-editor",
      "pattern-dedicated-editor",
    ]) {
      expect(componentProgress(id, 0), id).toBe(100);
    }
  });

  it("reports admitted Gouno structure complete only after family API and behavior review", () => {
    for (const id of [
      "gouno-app-shell",
      "gouno-page-header",
      "gouno-page-container",
      "gouno-page-skeleton",
    ]) {
      expect(componentProgress(id, 0), id).toBe(100);
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
