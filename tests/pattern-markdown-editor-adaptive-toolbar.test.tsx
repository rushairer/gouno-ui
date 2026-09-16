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
) {
  Object.defineProperty(toolbar, "clientWidth", {
    configurable: true,
    get: getWidth,
  });
  Object.defineProperty(toolbar, "scrollWidth", {
    configurable: true,
    get: () => {
      const visiblePrimary = root.querySelectorAll('[data-slot="markdown-editor-primary-command"]').length;
      return fixedWidth + visiblePrimary * 48;
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
    let width = 425;
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

    width = 600;
    await act(async () => {
      resize.notify(toolbar, width);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(container.querySelectorAll('[data-slot="markdown-editor-primary-command"]')).toHaveLength(4);
    });
    expect(screen.getByRole("button", { name: "插入链接" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "行内代码" })).toBeTruthy();
  });

  it("uses wrapping only as the final fallback after every primary command has moved into More", async () => {
    const resize = installResizeObserverMock();
    const { container } = render(
      <MarkdownEditor
        value="body"
        onChange={() => undefined}
        toolbarActions={<button type="button">产品动作</button>}
        textareaAriaLabel="极窄 Markdown"
      />,
    );

    const toolbar = container.querySelector('[data-slot="markdown-editor-toolbar"]') as HTMLElement;
    const width = 280;
    installToolbarGeometry(toolbar, container, () => width, 320);

    await act(async () => {
      resize.notify(toolbar, width);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(container.querySelectorAll('[data-slot="markdown-editor-primary-command"]')).toHaveLength(0);
      expect(toolbar.getAttribute("data-adaptive-wrap")).toBe("true");
    });

    expect(screen.getByRole("button", { name: "产品动作" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "编辑" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "预览" })).toBeTruthy();

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