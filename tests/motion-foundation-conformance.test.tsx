import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Anchor, BackTop, Carousel } from "../src/core";
import { REDUCED_MOTION_QUERY } from "../src/lib/motion";

const originalMatchMedia = Object.getOwnPropertyDescriptor(window, "matchMedia");

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

function installMotionPreference(initial: boolean) {
  let matches = initial;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const query = {
    media: REDUCED_MOTION_QUERY,
    get matches() {
      return matches;
    },
    onchange: null,
    addEventListener(type: string, listener: (event: MediaQueryListEvent) => void) {
      if (type === "change") listeners.add(listener);
    },
    removeEventListener(type: string, listener: (event: MediaQueryListEvent) => void) {
      if (type === "change") listeners.delete(listener);
    },
    addListener(listener: (event: MediaQueryListEvent) => void) {
      listeners.add(listener);
    },
    removeListener(listener: (event: MediaQueryListEvent) => void) {
      listeners.delete(listener);
    },
    dispatchEvent() {
      return true;
    },
  } as unknown as MediaQueryList;

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn(() => query),
  });

  return {
    change(next: boolean) {
      matches = next;
      const event = { matches: next, media: REDUCED_MOTION_QUERY } as MediaQueryListEvent;
      act(() => {
        for (const listener of listeners) listener(event);
      });
    },
  };
}

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    writable: true,
    value,
  });
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  setScrollY(0);
  document.querySelectorAll("[data-motion-test-target]").forEach((node) => node.remove());

  if (originalMatchMedia) {
    Object.defineProperty(window, "matchMedia", originalMatchMedia);
  } else {
    Reflect.deleteProperty(window, "matchMedia");
  }
});

describe("Motion Foundation conformance", () => {
  it("keeps one cross-runtime reduced-motion authority", () => {
    const base = source("src/base.css");
    const anchor = source("src/core/anchor.tsx");
    const affix = source("src/core/affix.tsx");
    const carousel = source("src/core/carousel.tsx");
    const hook = source("src/hooks/use-reduced-motion.ts");
    const motion = source("src/lib/motion.ts");

    expect(base).toContain("@media (prefers-reduced-motion: reduce)");
    expect(base).toContain("animation-duration: 0s !important;");
    expect(base).toContain("transition-duration: 0s !important;");
    expect(base).toContain("scroll-behavior: auto !important;");

    expect(motion).toContain('REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"');
    expect(anchor).toContain("behavior: preferredScrollBehavior()");
    expect(affix).toContain("behavior: preferredScrollBehavior()");
    expect(hook).toContain("window.matchMedia(REDUCED_MOTION_QUERY)");
    expect(carousel).toContain("useReducedMotionPreference()");
    expect(carousel.match(/transitionDuration: reducedMotion \? "0ms"/g)).toHaveLength(2);

    expect(anchor).not.toContain('behavior: "smooth"');
    expect(affix).not.toContain('behavior: "smooth"');
  });

  it("uses automatic Anchor scrolling under reduced motion", () => {
    installMotionPreference(true);
    const target = document.createElement("section");
    target.id = "motion-details";
    target.dataset.motionTestTarget = "true";
    document.body.appendChild(target);
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 300,
      top: 300,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0,
      toJSON: () => ({}),
    });
    setScrollY(100);
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

    render(
      <Anchor
        aria-label="目录"
        offset={80}
        items={[{ key: "motion-details", title: "详情" }]}
      />,
    );
    fireEvent.click(screen.getByRole("link", { name: "详情" }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 320, behavior: "auto" });
  });

  it("uses automatic BackTop scrolling under reduced motion", async () => {
    installMotionPreference(true);
    setScrollY(1);
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

    render(<BackTop visibilityHeight={0} aria-label="回到顶部" />);
    fireEvent.click(await screen.findByRole("button", { name: "回到顶部" }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });

  it("completes Carousel changes immediately and removes inline movement under reduced motion", () => {
    installMotionPreference(true);
    const afterChange = vi.fn();

    const { container } = render(
      <Carousel
        arrows
        infinite={false}
        speed={500}
        autoplay={{ dotDuration: true }}
        items={[<div key="a">Alpha</div>, <div key="b">Beta</div>]}
        afterChange={afterChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));

    expect(afterChange).toHaveBeenCalledWith(1);
    expect(
      container.querySelector<HTMLElement>('[data-slot="carousel-track"]')?.style
        .transitionDuration,
    ).toBe("0ms");
    expect(container.querySelector('[data-slot="carousel-dot"] > span')).toBeNull();
  });

  it("stops Carousel autoplay when the system switches to reduced motion", () => {
    vi.useFakeTimers();
    const preference = installMotionPreference(false);
    const onChange = vi.fn();

    render(
      <Carousel
        autoplay
        autoplaySpeed={1000}
        speed={0}
        items={[<div key="a">Alpha</div>, <div key="b">Beta</div>]}
        onChange={onChange}
      />,
    );

    preference.change(true);
    act(() => vi.advanceTimersByTime(2500));

    expect(onChange).not.toHaveBeenCalled();
  });
});
