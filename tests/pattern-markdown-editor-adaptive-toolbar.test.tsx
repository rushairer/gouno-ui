import { createRef, useState } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MarkdownEditor, type MarkdownEditorRef } from "../src/patterns";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

type ResizeObserverHarness = {
  notify: (target: Element, width: number) => void;
};

function installResizeObserverMock(): ResizeObserverHarness {
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

    unobserve(target: Element) {
      this.state.observed.delete(target);
    }

    disconnect() {
      this.state.observed.clear();
    }
  }

  vi.stubGlobal("ResizeObserver", ResizeObserverMock as unknown as typeof ResizeObserver);

  return {
    notify(target, width) {
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

function installToolbarGeometry(
  toolbar: HTMLElement,
  root: HTMLElement,
  getWidth: () => number,
  fixedWidth = 320,
  iconOnlyFixedWidth = 220,
) {
  Object.defineProperty(toolbar, "clientWidth", {
    configurable: true,
    get: getWidth,
  });
  Object.defineProperty(toolbar, "scrollWidth", {
    configurable: true,
    get: () => {
      const visiblePrimary = root.querySelectorAll('[data-slot="markdown-editor-primary-command"]').length;
      const currentFixedWidth =
        toolbar.getAttribute("data-adaptive-density") === "icon" ? iconOnlyFixedWidth : fixedWidth;
      return currentFixedWidth + visiblePrimary * 48;
    },
  });
}

describe("MarkdownEditor adaptive toolbar", () => {
  it("moves lower-priority built-in commands into More before product actions or view modes wrap", async () => {
    const resize = installResizeObserverMock();
    const editorRef = createRef<MarkdownEditorRef>();

    function Fixture() {
      const [value, setValue] = useState("alpha beta");
      return (
        <MarkdownEditor
          ref={editorRef}
          value={value}
          onChange={setValue}
          toolbarActions={
            <>
              <button type="button">AI 写作</button>
              <button type="button">插图</button>
            </>
          }
          textareaAriaLabel="自适应 Markdown"
        />
      );
    }

    const { container } = render(<Fixture />);
    const toolbar = container.querySelector('[data-slot="markdown-editor-toolbar"]') as HTMLElement;
    let width = 329;
    installToolbarGeometry(toolbar, container, () => width);

    await act(async () => {
      resize.notify(toolbar, width);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(container.querySelectorAll('[data-slot="markdown-editor-primary-command"]')).toHaveLength(2);
    });

    expect(screen.getByRole("button", { name: "加粗" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "斜体" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "插入链接" })).toBeNull();
    expect(screen.queryByRole("button", { name: "行内代码" })).toBeNull();
    expect(screen.getByRole("button", { name: "AI 写作" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "插图" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "编辑" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "预览" })).toBeTruthy();
    expect(toolbar.getAttribute("data-adaptive-density")).toBe("icon");
    expect(toolbar.getAttribute("data-adaptive-wrap")).toBe("false");

    editorRef.current?.setSelection(6, 10);
    fireEvent.pointerDown(screen.getByRole("button", { name: "更多格式" }), {
      button: 0,
      ctrlKey: false,
    });
    expect(screen.getByRole("menuitem", { name: "插入链接" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "行内代码" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "删除线" })).toBeTruthy();

    fireEvent.click(screen.getByRole("menuitem", { name: "插入链接" }));
    await act(async () => Promise.resolve());
    expect((screen.getByLabelText("自适应 Markdown") as HTMLTextAreaElement).value).toBe(
      "alpha [beta](https://example.com)",
    );
    expect(editorRef.current?.getSelection().text).toBe("https://example.com");

    width = 900;
    await act(async () => {
      resize.notify(toolbar, width);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(container.querySelectorAll('[data-slot="markdown-editor-primary-command"]')).toHaveLength(4);
      expect(toolbar.getAttribute("data-adaptive-density")).toBe("full");
    });
    expect(screen.getByRole("button", { name: "插入链接" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "行内代码" })).toBeTruthy();
  });

  it("uses deterministic icon density for fixed actions at narrow editor widths", async () => {
    const resize = installResizeObserverMock();
    const { container } = render(
      <MarkdownEditor
        value="body"
        onChange={() => undefined}
        toolbarActions={({ compact }) => (
          <button type="button" aria-label="产品动作">{compact ? null : "产品动作"}</button>
        )}
        textareaAriaLabel="窄 Markdown"
      />,
    );

    const toolbar = container.querySelector('[data-slot="markdown-editor-toolbar"]') as HTMLElement;
    let width = 600;
    installToolbarGeometry(toolbar, container, () => width, 320, 220);

    await act(async () => {
      resize.notify(toolbar, width);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(toolbar.getAttribute("data-adaptive-density")).toBe("icon");
      expect(toolbar.getAttribute("data-adaptive-wrap")).toBe("false");
    });

    const modeSwitcher = container.querySelector('[data-slot="markdown-editor-mode-switcher"]') as HTMLElement;
    expect(modeSwitcher.getAttribute("data-icon-only")).toBe("true");
    expect(screen.getByRole("button", { name: "产品动作" }).textContent).toBe("");
    expect(screen.getByRole("button", { name: "编辑" }).textContent).toBe("");
    expect(screen.getByRole("button", { name: "预览" }).textContent).toBe("");

    width = 900;
    await act(async () => {
      resize.notify(toolbar, width);
      await Promise.resolve();
    });
    await waitFor(() => {
      expect(toolbar.getAttribute("data-adaptive-density")).toBe("full");
      expect(container.querySelectorAll('[data-slot="markdown-editor-primary-command"]')).toHaveLength(4);
    });
    expect(screen.getByRole("button", { name: "产品动作" }).textContent).toBe("产品动作");

    width = 700;
    await act(async () => {
      resize.notify(toolbar, width);
      await Promise.resolve();
    });
    await waitFor(() => {
      expect(toolbar.getAttribute("data-adaptive-density")).toBe("icon");
    });
    expect(screen.getByRole("button", { name: "产品动作" }).textContent).toBe("");
  });

  it("uses wrapping only after icon-only fixed actions still cannot fit", async () => {
    const resize = installResizeObserverMock();
    const { container } = render(
      <MarkdownEditor
        value="body"
        onChange={() => undefined}
        toolbarActions={({ compact }) => (
          <button type="button" aria-label="产品动作">{compact ? null : "产品动作"}</button>
        )}
        textareaAriaLabel="极窄 Markdown"
      />,
    );

    const toolbar = container.querySelector('[data-slot="markdown-editor-toolbar"]') as HTMLElement;
    const width = 180;
    installToolbarGeometry(toolbar, container, () => width, 320, 220);

    await act(async () => {
      resize.notify(toolbar, width);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(container.querySelectorAll('[data-slot="markdown-editor-primary-command"]')).toHaveLength(0);
      expect(toolbar.getAttribute("data-adaptive-density")).toBe("icon");
      expect(toolbar.getAttribute("data-adaptive-wrap")).toBe("true");
    });

    fireEvent.pointerDown(screen.getByRole("button", { name: "更多格式" }), {
      button: 0,
      ctrlKey: false,
    });
    expect(screen.getByRole("menuitem", { name: "加粗" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "斜体" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "插入链接" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "行内代码" })).toBeTruthy();
  });
});
