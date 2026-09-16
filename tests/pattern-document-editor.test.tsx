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
    const actions = container.querySelector('[data-slot="markdown-editor-actions"]');
    const productAction = screen.getByRole("button", { name: "产品动作" });
    expect(actions?.contains(productAction)).toBe(true);

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

  it("keeps lower-frequency Markdown commands in a compact overflow menu without losing selection", async () => {
    const editorRef = createRef<MarkdownEditorRef>();

    function Fixture() {
      const [value, setValue] = useState("alpha\nbeta");
      return <MarkdownEditor ref={editorRef} value={value} onChange={setValue} textareaAriaLabel="扩展 Markdown" />;
    }

    const runMoreCommand = async (name: string) => {
      fireEvent.pointerDown(screen.getByRole("button", { name: "更多格式" }), {
        button: 0,
        ctrlKey: false,
      });
      fireEvent.click(screen.getByRole("menuitem", { name }));
      await act(async () => Promise.resolve());
    };

    render(<Fixture />);
    expect(screen.queryByRole("button", { name: "删除线" })).toBeNull();

    editorRef.current?.setSelection(0, 5);
    await runMoreCommand("删除线");
    expect((screen.getByLabelText("扩展 Markdown") as HTMLTextAreaElement).value).toBe("~~alpha~~\nbeta");

    editorRef.current?.setSelection(0, (screen.getByLabelText("扩展 Markdown") as HTMLTextAreaElement).value.length);
    await runMoreCommand("无序列表");
    expect((screen.getByLabelText("扩展 Markdown") as HTMLTextAreaElement).value).toBe("- ~~alpha~~\n- beta");

    editorRef.current?.setSelection(2, 11);
    await runMoreCommand("代码块");
    expect((screen.getByLabelText("扩展 Markdown") as HTMLTextAreaElement).value).toContain("```text\n~~alpha~~\n```");
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

  it("converts the current block between paragraph and configured heading levels without losing the target line", async () => {
    const editorRef = createRef<MarkdownEditorRef>();

    function Fixture() {
      const [value, setValue] = useState("first line\nsecond line");
      return (
        <MarkdownEditor
          ref={editorRef}
          value={value}
          onChange={setValue}
          headingLevels={[2, 3, 4, 5, 6]}
          textareaAriaLabel="块级 Markdown"
        />
      );
    }

    render(<Fixture />);
    editorRef.current?.setSelection(13);

    const openHeadingMenu = (buttonName: string) => {
      fireEvent.pointerDown(screen.getByRole("button", { name: buttonName }), {
        button: 0,
        ctrlKey: false,
      });
    };

    openHeadingMenu("段落样式：正文");
    expect(screen.queryByRole("menuitem", { name: /一级标题/ })).toBeNull();
    expect(screen.getByRole("menuitem", { name: /二级标题/ })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: /六级标题/ })).toBeTruthy();
    fireEvent.click(screen.getByRole("menuitem", { name: /三级标题/ }));
    await act(async () => Promise.resolve());

    expect((screen.getByLabelText("块级 Markdown") as HTMLTextAreaElement).value).toBe("first line\n### second line");
    expect(screen.getByRole("button", { name: "段落样式：H3" })).toBeTruthy();

    openHeadingMenu("段落样式：H3");
    fireEvent.click(screen.getByRole("menuitem", { name: "正文" }));
    await act(async () => Promise.resolve());

    expect((screen.getByLabelText("块级 Markdown") as HTMLTextAreaElement).value).toBe("first line\nsecond line");
    expect(screen.getByRole("button", { name: "段落样式：正文" })).toBeTruthy();
  });

  it("can opt into the full H1-H6 heading range for standalone Markdown documents", () => {
    render(
      <MarkdownEditor
        value="standalone document"
        onChange={() => undefined}
        headingLevels={[1, 2, 3, 4, 5, 6]}
        textareaAriaLabel="完整标题 Markdown"
      />,
    );

    fireEvent.pointerDown(screen.getByRole("button", { name: "段落样式：正文" }), {
      button: 0,
      ctrlKey: false,
    });
    expect(screen.getByRole("menuitem", { name: /一级标题/ })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: /六级标题/ })).toBeTruthy();
  });

  it("applies quote commands to the current line instead of corrupting inline text", async () => {
    const editorRef = createRef<MarkdownEditorRef>();

    function Fixture() {
      const [value, setValue] = useState("first line\n## second line");
      return <MarkdownEditor ref={editorRef} value={value} onChange={setValue} textareaAriaLabel="引用 Markdown" />;
    }

    render(<Fixture />);
    editorRef.current?.setSelection(13);
    fireEvent.pointerDown(screen.getByRole("button", { name: "更多格式" }), {
      button: 0,
      ctrlKey: false,
    });
    fireEvent.click(screen.getByRole("menuitem", { name: "引用" }));
    await act(async () => Promise.resolve());
    expect((screen.getByLabelText("引用 Markdown") as HTMLTextAreaElement).value).toBe("first line\n> ## second line");
  });
});
