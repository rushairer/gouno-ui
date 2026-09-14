import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageSkeleton } from "../src/gouno";

describe("PageSkeleton", () => {
  it("renders collection geometry as one named busy region", () => {
    const { container } = render(
      <PageSkeleton
        layout="collection"
        aria-label="资源列表加载中"
        rows={3}
        columns={4}
        pagination
      />,
    );

    const region = screen.getByRole("status", { name: "资源列表加载中" });
    expect(region.getAttribute("aria-live")).toBe("polite");
    expect(region.getAttribute("aria-busy")).toBe("true");
    expect(region.getAttribute("data-layout")).toBe("collection");
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(8);
    expect(container.querySelectorAll("thead th")).toHaveLength(4);
    expect(screen.queryByRole("columnheader")).toBeNull();
  });

  it("renders form geometry without owning form state or controls", () => {
    const { container } = render(
      <PageSkeleton layout="form" aria-label="设置加载中" fields={4} />,
    );

    expect(screen.getByRole("status", { name: "设置加载中" }).getAttribute("data-layout")).toBe(
      "form",
    );
    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBe(10);
  });

  it("renders dashboard statistics and sections as presentation-only placeholders", () => {
    const { container } = render(
      <PageSkeleton
        layout="dashboard"
        aria-label="概览加载中"
        statistics={3}
        sections={2}
      />,
    );

    expect(screen.getByRole("status", { name: "概览加载中" }).getAttribute("data-layout")).toBe(
      "dashboard",
    );
    expect(container.querySelectorAll('[data-slot="card"]')).toHaveLength(5);
  });
});
