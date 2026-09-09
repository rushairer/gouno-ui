import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Empty } from "../src/core";

afterEach(cleanup);

describe("Core Empty", () => {
  it("renders caller-owned content and action without inventing product copy", () => {
    const onCreate = vi.fn();
    const { container } = render(
      <Empty
        icon={<span data-testid="empty-icon">icon</span>}
        title="还没有记录"
        description={<span>创建第一条记录后会显示在这里。</span>}
        action={<button onClick={onCreate}>新建</button>}
      />,
    );

    expect(screen.getByText("还没有记录")).toBeTruthy();
    expect(screen.getByText("创建第一条记录后会显示在这里。")).toBeTruthy();
    expect(screen.getByTestId("empty-icon")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "新建" }));
    expect(onCreate).toHaveBeenCalledOnce();
    expect(container.querySelector('[data-slot="empty"]')).toBeTruthy();
  });

  it("has no default user-facing copy or live-region semantics", () => {
    const { container } = render(<Empty />);
    const empty = container.querySelector('[data-slot="empty"]') as HTMLElement;

    expect(empty).toBeTruthy();
    expect(empty.getAttribute("role")).toBeNull();
    expect(screen.queryByText("No data")).toBeNull();
    expect(empty.textContent).toBe("");
  });

  it("does not create a second surface boundary by default", () => {
    const { container } = render(<Empty title="暂无数据" />);
    const empty = container.querySelector('[data-slot="empty"]') as HTMLElement;

    expect(empty.className).not.toMatch(/\bborder(?:-|\b)/);
    expect(empty.className).not.toMatch(/\brounded(?:-|\b)/);
    expect(empty.className).not.toMatch(/\bshadow(?:-|\b)/);
  });

  it("passes standard div, ARIA, data and className props to the root", () => {
    render(
      <Empty
        id="results-empty"
        className="product-empty"
        role="status"
        aria-live="polite"
        aria-label="筛选结果为空"
        data-state="filtered"
        title="没有匹配结果"
      />,
    );

    const empty = screen.getByRole("status", { name: "筛选结果为空" });
    expect(empty.id).toBe("results-empty");
    expect(empty.className).toContain("product-empty");
    expect(empty.getAttribute("aria-live")).toBe("polite");
    expect(empty.getAttribute("data-state")).toBe("filtered");
  });
});
