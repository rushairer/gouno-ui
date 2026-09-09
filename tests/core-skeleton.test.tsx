import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Skeleton } from "../src/core";

afterEach(cleanup);

describe("Core Skeleton", () => {
  it("is decorative by default and leaves loading semantics to its parent region", () => {
    const { container } = render(
      <div role="status" aria-label="Content loading">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>,
    );

    expect(screen.getByRole("status", { name: "Content loading" })).toBeTruthy();
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons).toHaveLength(2);
    for (const skeleton of skeletons) {
      expect(skeleton.getAttribute("aria-hidden")).toBe("true");
      expect(skeleton.getAttribute("role")).toBeNull();
    }
  });

  it("preserves standard div attributes and allows an explicit aria-hidden override", () => {
    const { container } = render(
      <Skeleton
        aria-hidden={false}
        aria-label="Custom placeholder"
        data-state="loading"
        className="h-8 rounded-full"
      />,
    );

    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton?.getAttribute("aria-hidden")).toBe("false");
    expect(skeleton?.getAttribute("aria-label")).toBe("Custom placeholder");
    expect(skeleton?.getAttribute("data-state")).toBe("loading");
    expect(skeleton?.className).toContain("h-8");
    expect(skeleton?.className).toContain("rounded-full");
  });

  it("keeps shape and dimensions caller-owned through className", () => {
    const { container } = render(
      <>
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-4 w-full rounded-none" />
      </>,
    );

    const [avatar, line] = Array.from(
      container.querySelectorAll('[data-slot="skeleton"]'),
    );
    expect(avatar?.className).toContain("size-10");
    expect(avatar?.className).toContain("rounded-full");
    expect(line?.className).toContain("h-4");
    expect(line?.className).toContain("rounded-none");
  });
});
