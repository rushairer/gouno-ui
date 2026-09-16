import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DocumentEditorShell, MarkdownEditor } from "../src/patterns";

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
});
