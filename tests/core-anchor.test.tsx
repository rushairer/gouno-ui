import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Anchor } from "../src/core";

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  vi.restoreAllMocks();
});

describe("Core Anchor", () => {
  it("preserves native hash links and standard navigation attributes by default", () => {
    const { container } = render(
      <Anchor
        aria-label="文章目录"
        className="toc"
        items={[
          { key: "overview", title: "概览" },
          { key: "security", title: <span className="pl-3">安全</span> },
        ]}
      />,
    );

    const navigation = screen.getByRole("navigation", { name: "文章目录" });
    expect(navigation.className).toContain("toc");
    expect(screen.getByRole("link", { name: "概览" }).getAttribute("href")).toBe("#overview");
    expect(screen.getByRole("link", { name: "安全" }).getAttribute("href")).toBe("#security");
    expect(container.querySelector('[data-slot="anchor"]')).toBeTruthy();
  });

  it("calculates a local hash target offset instead of scrolling to the offset itself", () => {
    const target = document.createElement("section");
    target.id = "details";
    document.body.appendChild(target);
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 420,
      top: 420,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0,
      toJSON: () => ({}),
    });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 180 });
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

    render(<Anchor aria-label="目录" offset={96} items={[{ key: "details", title: "详情" }]} />);
    fireEvent.click(screen.getByRole("link", { name: "详情" }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 504, behavior: "smooth" });
    expect(window.location.hash).toBe("#details");
    target.remove();
  });

  it("does not intercept external or missing targets when offset is configured", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    render(
      <Anchor
        offset={80}
        items={[
          { key: "external", title: "外部", href: "https://example.com/#docs" },
          { key: "missing", title: "缺失章节" },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("link", { name: "缺失章节" }));
    expect(scrollTo).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "外部" }).getAttribute("href")).toBe("https://example.com/#docs");
  });
});