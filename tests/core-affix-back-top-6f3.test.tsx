import * as React from "react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Affix, BackTop } from "../src/core";
import { componentProgress } from "../showcase/component-progress";
import { otherDocuments } from "../showcase/demos/core/other";

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    writable: true,
    value,
  });
}

afterEach(() => {
  cleanup();
  setScrollY(0);
  vi.restoreAllMocks();
});

describe("Affix and BackTop 6F3", () => {
  it("keeps Affix a standard top-sticky div with a real root ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <Affix
        ref={ref}
        offsetTop={16}
        data-probe="affix"
        style={{ position: "static", top: 999, zIndex: 88 }}
      >
        <span>固定内容</span>
      </Affix>,
    );

    const root = container.querySelector<HTMLElement>('[data-slot="affix"]')!;
    expect(root.tagName).toBe("DIV");
    expect(root.getAttribute("data-probe")).toBe("affix");
    expect(root.style.position).toBe("sticky");
    expect(root.style.top).toBe("16px");
    expect(root.style.zIndex).toBe("88");
    expect(ref.current).toBe(root);
  });

  it("normalizes a non-finite Affix offset to zero", () => {
    const { container } = render(
      <Affix offsetTop={Number.NaN}>固定内容</Affix>,
    );
    const root = container.querySelector<HTMLElement>('[data-slot="affix"]')!;
    expect(root.style.top).toBe("0px");
  });

  it("hides BackTop below its threshold and reveals it after window scroll", async () => {
    setScrollY(0);
    render(<BackTop visibilityHeight={100} aria-label="回到顶部" />);
    expect(screen.queryByRole("button", { name: "回到顶部" })).toBeNull();

    setScrollY(120);
    fireEvent.scroll(window);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "回到顶部" })).toBeTruthy();
    });
  });

  it("smooth-scrolls to top and exposes the real button ref once visible", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const ref = React.createRef<HTMLButtonElement>();
    setScrollY(1);
    render(
      <BackTop ref={ref} visibilityHeight={0} aria-label="回到顶部" data-probe="back-top" />,
    );

    const button = await screen.findByRole("button", { name: "回到顶部" });
    expect(button.getAttribute("data-probe")).toBe("back-top");
    expect(ref.current).toBe(button);
    fireEvent.click(button);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("lets caller onClick prevent the default scroll action", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    setScrollY(1);
    render(
      <BackTop
        visibilityHeight={0}
        aria-label="回到顶部"
        onClick={(event) => event.preventDefault()}
      />,
    );

    fireEvent.click(await screen.findByRole("button", { name: "回到顶部" }));
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("removes injected English copy and closes both components with same-source reviewed docs", () => {
    const source = readFileSync("src/core/affix.tsx", "utf8");
    const affixNames = otherDocuments.affix.api?.map((row) => row.name) ?? [];
    const backTopNames = otherDocuments["back-top"].api?.map((row) => row.name) ?? [];

    expect(source).not.toContain('aria-label="Back to top"');
    expect(source).toContain('window.addEventListener("scroll"');
    expect(otherDocuments.affix.code).toContain("<Affix");
    expect(otherDocuments["back-top"].code).toContain('aria-label="回到顶部"');
    expect(affixNames).toEqual(expect.arrayContaining(["offsetTop", "children", "ref"]));
    expect(backTopNames).toEqual(
      expect.arrayContaining(["aria-label", "visibilityHeight", "onClick", "ref"]),
    );
    expect(componentProgress("core-affix", 62)).toBe(100);
    expect(componentProgress("core-back-top", 68)).toBe(100);
  });
});
