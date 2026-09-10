import { createRef } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Spin, Spinner } from "../src/core";

afterEach(() => {
  cleanup();
});

describe("Core Spinner", () => {
  it("is decorative by default and forwards standard span props/ref", () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <Spinner
        ref={ref}
        data-state="saving"
        className="size-6"
      />,
    );

    const spinner = container.querySelector('[data-slot="spinner"]') as HTMLSpanElement;
    expect(ref.current).toBe(spinner);
    expect(spinner.getAttribute("aria-hidden")).toBe("true");
    expect(spinner.getAttribute("role")).toBeNull();
    expect(spinner.getAttribute("aria-label")).toBeNull();
    expect(spinner.getAttribute("data-state")).toBe("saving");
    expect(spinner.className).toContain("size-6");
  });

  it("allows explicit standalone semantics through standard ARIA only", () => {
    const { getByRole } = render(
      <Spinner
        aria-hidden={false}
        role="status"
        aria-label="正在保存"
      />,
    );

    const spinner = getByRole("status", { name: "正在保存" });
    expect(spinner.getAttribute("aria-hidden")).toBe("false");
  });
});

describe("Core Spin", () => {
  it("marks the semantic root busy without inventing a live region", () => {
    const ref = createRef<HTMLDivElement>();
    const { container, getByText } = render(
      <Spin
        ref={ref}
        spinning
        tip="正在刷新内容"
        data-state="refreshing"
        className="min-h-32"
      >
        <div>已有内容</div>
      </Spin>,
    );

    const root = container.querySelector('[data-slot="spin"]') as HTMLDivElement;
    const overlay = container.querySelector('[data-slot="spin-overlay"]') as HTMLDivElement;
    const spinner = overlay.querySelector('[data-slot="spinner"]') as HTMLSpanElement;

    expect(ref.current).toBe(root);
    expect(root.getAttribute("aria-busy")).toBe("true");
    expect(root.getAttribute("role")).toBeNull();
    expect(root.getAttribute("aria-live")).toBeNull();
    expect(root.getAttribute("data-state")).toBe("refreshing");
    expect(root.className).toContain("min-h-32");
    expect(overlay.getAttribute("role")).toBeNull();
    expect(spinner.getAttribute("aria-hidden")).toBe("true");
    expect(getByText("正在刷新内容")).toBeTruthy();
  });

  it("removes busy/overlay state when spinning is false", () => {
    const { container } = render(
      <Spin spinning={false} tip="不会显示">
        <div>内容保持可用</div>
      </Spin>,
    );

    const root = container.querySelector('[data-slot="spin"]') as HTMLDivElement;
    expect(root.getAttribute("aria-busy")).toBeNull();
    expect(container.querySelector('[data-slot="spin-overlay"]')).toBeNull();
    expect(root.textContent).toBe("内容保持可用");
  });

  it("does not create a Card-like surface on the root", () => {
    const { container } = render(<Spin><div>内容</div></Spin>);
    const root = container.querySelector('[data-slot="spin"]') as HTMLDivElement;

    expect(root.className).not.toMatch(/border|shadow|rounded/);
  });
});
