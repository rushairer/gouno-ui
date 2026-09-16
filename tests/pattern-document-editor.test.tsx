import { createRef, useState } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  DocumentEditorShell,
  MarkdownEditor,
  type MarkdownEditorRef,
} from "../src/patterns";

afterEach(cleanup);

describe("Document editor patterns", () => {
  it("keeps command bar, navigator, canvas and inspector as stable workspace regions", () => {
    const { container } = render(
      <DocumentEditorShell
        aria-label="测试文档编辑器"
        header={<span>Command bar</span>}
        navigator={<span>Outline</span>}
        inspector={<span>Inspector</span>}
        canvasAriaLabel="测试画布"
      >
        <span>Canvas</span>
      </DocumentEditorShell>,
    );

    expect(screen.getByLabelText("测试文档编辑器")).toBeTruthy();
    expect(screen.getByLabelText("文档导航")).toBeTruthy();
    expect(screen.getByLabelText("测试画布")).toBeTruthy();
    expect(screen.getByLabelText("文档属性")).toBeTruthy();
    expect(container.querySelector('[data-slot="document-editor-command-bar"]')).toBeTruthy();
  });

  it("keeps Markdown value while switching edit, split and preview modes", () => {
    function Fixture() {
      const value = "## 标题\n\n正文";
      return (
        <MarkdownEditor
          value={value}
          onChange={() => undefined}
          renderPreview={(markdown) => <article>{markdown}</article>}
          textareaAriaLabel="测试 Markdown"
          previewAriaLabel="测试预览"
        />
      );
    }

    const { container } = render(<Fixture />);
    expect(screen.getByLabelText("测试 Markdown")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "分屏" }));
    expect(container.querySelector('[data-slot="markdown-editor-split"]')).toBeTruthy();
    expect(screen.getByLabelText("测试 Markdown")).toBeTruthy();
    expect(screen.getByLabelText("测试预览")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "预览" }));
    expect(screen.queryByLabelText("测试 Markdown")).toBeNull();
    expect(screen.getByLabelText("测试预览")).toBeTruthy();
  });

  it("exposes selection and insertion commands without owning product actions", () => {
    const editorRef = createRef<MarkdownEditorRef>();

    function Fixture() {
      const [value, setValue] = useState("hello world");
      return (
        <MarkdownEditor
          ref={editorRef}
          value={value}
          onChange={setValue}
          toolbarActions={<button type="button">产品动作</button>}
          textareaAriaLabel="命令 Markdown"
        />
      );
    }

    const { container } = render(<Fixture />);
    editorRef.current?.setSelection(6, 11);
    expect(editorRef.current?.getSelection().text).toBe("world");
    expect(container.querySelector('[data-slot="markdown-editor-actions"]')).toContainElement(
      screen.getByRole("button", { name: "产品动作" }),
    );

    act(() => editorRef.current?.insertText("Gouno"));
    expect((screen.getByLabelText("命令 Markdown") as HTMLTextAreaElement).value).toBe("hello Gouno");
  });

  it("wraps the active selection in italic markers", async () => {
    const editorRef = createRef<MarkdownEditorRef>();

    function Fixture() {
      const [value, setValue] = useState("alpha beta");
      return <MarkdownEditor ref={editorRef} value={value} onChange={setValue} textareaAriaLabel="斜体 Markdown" />;
    }

    render(<Fixture />);
    editorRef.current?.setSelection(6, 10);

    await act(async () => {
      fireEvent.mouseDown(screen.getByRole("button", { name: "斜体" }));
      fireEvent.click(screen.getByRole("button", { name: "斜体" }));
      await Promise.resolve();
    });

    expect((screen.getByLabelText("斜体 Markdown") as HTMLTextAreaElement).value).toBe("alpha *beta*");
    expect(editorRef.current?.getSelection().text).toBe("beta");
  });

  it("inserts a complete Markdown link and selects the URL for immediate editing", async () => {
    const editorRef = createRef<MarkdownEditorRef>();

    function Fixture() {
      const [value, setValue] = useState("alpha beta");
      return <MarkdownEditor ref={editorRef} value={value} onChange={setValue} textareaAriaLabel="链接 Markdown" />;
    }

    render(<Fixture />);
    editorRef.current?.setSelection(6, 10);

    await act(async () => {
      fireEvent.mouseDown(screen.getByRole("button", { name: "插入链接" }));
      fireEvent.click(screen.getByRole("button", { name: "插入链接" }));
      await Promise.resolve();
    });

    expect((screen.getByLabelText("链接 Markdown") as HTMLTextAreaElement).value).toBe(
      "alpha [beta](https://example.com)",
    );
    expect(editorRef.current?.getSelection().text).toBe("https://example.com");
  });

  it("applies heading and quote commands to the current line instead of corrupting inline text", async () => {
    const editorRef = createRef<MarkdownEditorRef>();

    function Fixture() {
      const [value, setValue] = useState("first line\nsecond line");
      return <MarkdownEditor ref={editorRef} value={value} onChange={setValue} textareaAriaLabel="块级 Markdown" />;
    }

    render(<Fixture />);
    editorRef.current?.setSelection(13);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "二级标题" }));
      await Promise.resolve();
    });
    expect((screen.getByLabelText("块级 Markdown") as HTMLTextAreaElement).value).toBe("first line\n## second line");

    editorRef.current?.setSelection(13);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "引用" }));
      await Promise.resolve();
    });
    expect((screen.getByLabelText("块级 Markdown") as HTMLTextAreaElement).value).toBe("first line\n> ## second line");
  });
});
