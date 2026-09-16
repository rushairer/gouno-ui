import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MarkdownEditor } from "../src/patterns";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function installResizeObserverMock() {
  const instances: Array<{
    callback: ResizeObserverCallback;
    observed: Set<Element>;
  }> = [];

  class ResizeObserverMock {
    private readonly state: (typeof instances)[number];

    constructor(callback: ResizeObserverCallback) {
      this.state = { callback, observed: new Set<Element>() };
      instances.push(this.state);
    }

    observe(target: Element) {
      this.state.observed.add(target);
    }

    disconnect() {
      this.state.observed.clear();
    }
  }

  vi.stubGlobal("ResizeObserver", ResizeObserverMock as unknown as typeof ResizeObserver);

  return {
    notify(target: Element, width: number) {
      const entry = {
        target,
        contentRect: { width },
      } as unknown as ResizeObserverEntry;
      instances.forEach((instance) => {
        if (!instance.observed.has(target)) return;
        instance.callback([entry], instance as unknown as ResizeObserver);
      });
    },
  };
}

function rect(left: number, right: number): DOMRect {
  return {
    x: left,
    y: 0,
    left,
    right,
    top: 0,
    bottom: 44,
    width: right - left,
    height: 44,
    toJSON: () => ({}),
  } as DOMRect;
}

describe("MarkdownEditor visual overflow detection", () => {
  it("collapses format commands when scrollWidth misses a rendered child crossing the toolbar edge", async () => {
    const resize = installResizeObserverMock();
    const { container } = render(
      <MarkdownEditor
        value="body"
        onChange={() => undefined}
        toolbarActions={({ compact }) => (
          <button type="button" aria-label="产品动作">{compact ? null : "产品动作"}</button>
        )}
      />,
    );

    const toolbar = container.querySelector('[data-slot="markdown-editor-toolbar"]') as HTMLDivElement;
    const formatTools = container.querySelector(
      '[data-slot="markdown-editor-format-tools"]',
    ) as HTMLDivElement;
    const modeSwitcher = container.querySelector(
      '[data-slot="markdown-editor-mode-switcher"]',
    ) as HTMLDivElement;

    Object.defineProperty(toolbar, "clientWidth", {
      configurable: true,
      get: () => 280,
    });
    Object.defineProperty(toolbar, "scrollWidth", {
      configurable: true,
      get: () => 280,
    });
    toolbar.getBoundingClientRect = () => rect(0, 280);
    formatTools.getBoundingClientRect = () => {
      const visiblePrimary = container.querySelectorAll(
        '[data-slot="markdown-editor-primary-command"]',
      ).length;
      return visiblePrimary > 0 ? rect(0, 330) : rect(0, 190);
    };
    modeSwitcher.getBoundingClientRect = () => rect(220, 278);

    resize.notify(toolbar, 279);

    await waitFor(() => {
      expect(container.querySelectorAll('[data-slot="markdown-editor-primary-command"]')).toHaveLength(0);
      expect(toolbar.getAttribute("data-adaptive-density")).toBe("icon");
      expect(toolbar.getAttribute("data-adaptive-wrap")).toBe("false");
      expect(modeSwitcher.getAttribute("data-icon-only")).toBe("true");
    });
  });
});
