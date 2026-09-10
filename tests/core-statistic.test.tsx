import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Statistic } from "../src/core/statistic";

afterEach(() => {
  cleanup();
});

describe("Core Statistic", () => {
  it("forwards standard root props and the semantic root ref", () => {
    const ref = createRef<HTMLDivElement>();
    const view = render(
      <Statistic
        ref={ref}
        title="文章总数"
        value={86}
        aria-label="文章总数 86"
        data-state="ready"
        className="min-w-0"
      />,
    );

    const root = view.getByLabelText("文章总数 86");
    expect(ref.current).toBe(root);
    expect(root.getAttribute("data-slot")).toBe("statistic");
    expect(root.getAttribute("data-state")).toBe("ready");
    expect(root.className).toContain("min-w-0");
    expect(root.querySelector('[data-slot="statistic-title"]')?.textContent).toBe(
      "文章总数",
    );
    expect(root.querySelector('[data-slot="statistic-value"]')?.textContent).toBe(
      "86",
    );
  });

  it("keeps zero values plus prefix and suffix caller-owned", () => {
    render(<Statistic title="增长" value={0} prefix="+" suffix="%" />);

    expect(screen.getByText("增长")).toBeTruthy();
    expect(screen.getByText("+0%")).toBeTruthy();
  });

  it("does not invent live-region or surface semantics", () => {
    const { container } = render(<Statistic title="待审批变更" value={3} />);
    const root = container.querySelector('[data-slot="statistic"]')!;

    expect(root.getAttribute("role")).toBeNull();
    expect(root.getAttribute("aria-live")).toBeNull();
    expect(root.className).not.toMatch(/border|shadow|rounded/);
  });
});
