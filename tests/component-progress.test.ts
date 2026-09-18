import { describe, expect, it } from "vitest";
import { componentProgress, componentReviews } from "../showcase/catalog/component-progress";

describe("audited batch completion", () => {
  const expectReviewProgress = (id: string) => {
    const review = componentReviews[id];
    expect(review, id).toBeDefined();
    expect(componentProgress(id, 0), id).toBe(
      review?.status === "reviewed" ? 100 : 0,
    );
  };

  it("reports complete only for the reviewed Core component batch", () => {
    for (const id of [
      "core-icon",
      "core-kbd",
      "core-typography",
      "core-tag",
      "core-input-number",
      "core-form",
      "core-date-picker",
      "core-upload",
      "core-table",
      "core-input-otp",
      "core-segmented",
      "core-pagination",
      "core-alert",
    ]) {
      expectReviewProgress(id);
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
      expectReviewProgress(id);
    }
  });

  it("reports Focus-owned reviews complete only after certification", () => {
    for (const id of ["core-button","core-input","core-textarea","core-checkbox","core-radio","core-switch","core-tabs","core-badge","core-select","core-modal","core-drawer"]) {
      expectReviewProgress(id);
    }
  });

  it("reports Responsive-owned reviews complete only after certification", () => {
    for (const id of ["theme-system", "core-steps", "core-grid"]) {
      expectReviewProgress(id);
    }
  });

  it("reports Motion-owned reviews complete only after certification", () => {
    for (const id of ["core-anchor", "core-back-top", "core-carousel"]) {
      expectReviewProgress(id);
    }
  });

  it("reports admitted Patterns complete only after focused review", () => {
    for (const id of [
      "pattern-bulk-action-bar",
      "pattern-markdown-editor",
      "pattern-dedicated-editor",
    ]) {
      expectReviewProgress(id);
    }
  });

  it("reports admitted Gouno structure complete only after family API and behavior review", () => {
    for (const id of [
      "gouno-app-shell",
      "gouno-page-header",
      "gouno-page-container",
      "gouno-page-skeleton",
    ]) {
      expectReviewProgress(id);
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
