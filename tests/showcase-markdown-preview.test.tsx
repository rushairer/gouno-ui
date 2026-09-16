import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MarkdownPreview } from "../showcase/components/markdown-preview";

afterEach(cleanup);

describe("Showcase MarkdownPreview", () => {
  it("renders inline emphasis, strong text, strikethrough, code and links instead of exposing Markdown markers", () => {
    render(
      <MarkdownPreview value={"普通 **加粗**、*斜体*、~~删除线~~、`code` 和 [链接](https://example.com)。"} />,
    );

    expect(screen.getByText("加粗").tagName).toBe("STRONG");
    expect(screen.getByText("斜体").tagName).toBe("EM");
    expect(screen.getByText("删除线").tagName).toBe("DEL");
    expect(screen.getByText("code").tagName).toBe("CODE");
    const link = screen.getByRole("link", { name: "链接" });
    expect(link.getAttribute("href")).toBe("https://example.com");
  });

  it("renders headings, quotes, lists, task lists, tables, dividers and images for editor product previews", () => {
    const { container } = render(
      <MarkdownPreview
        value={"#### 四级标题\n\n> 引用\n\n- 第一项\n- 第二项\n\n- [x] 已完成\n- [ ] 待处理\n\n| 能力 | 状态 |\n| --- | --- |\n| Markdown | 稳定 |\n\n---\n\n![架构图](/media/diagram.webp)"}
      />,
    );

    expect(screen.getByRole("heading", { name: "四级标题", level: 4 })).toBeTruthy();
    expect(container.querySelector("blockquote")?.textContent).toContain("引用");
    expect(screen.getAllByRole("list").length).toBeGreaterThanOrEqual(2);
    const tasks = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(tasks[0].checked).toBe(true);
    expect(tasks[1].checked).toBe(false);
    expect(screen.getByRole("table")).toBeTruthy();
    expect(container.querySelector("hr")).toBeTruthy();
    expect(screen.getByRole("img", { name: "架构图" }).getAttribute("src")).toBe("/media/diagram.webp");
  });

  it("syntax-highlights fenced code using the declared language", () => {
    const { container } = render(
      <MarkdownPreview value={"```ts\nconst ok = true;\nconst count = 3;\n```"} />,
    );

    const codeBlock = container.querySelector('[data-slot="code-block"]');
    expect(codeBlock?.getAttribute("data-language")).toBe("ts");
    expect(container.querySelector(".syntax-keyword")?.textContent).toContain("const");
    expect(container.querySelector(".syntax-boolean")?.textContent).toBe("true");
    expect(container.querySelector(".syntax-number")?.textContent).toBe("3");
  });

  it("does not break fenced code when the snippet contains blank lines", () => {
    const { container } = render(
      <MarkdownPreview value={"```ts\nconst first = true;\n\nconst second = false;\n```"} />,
    );

    const code = container.querySelector('[data-slot="code-block-code"]');
    expect(code?.textContent).toContain("const first = true;");
    expect(code?.textContent).toContain("const second = false;");
    expect(code?.textContent).toContain("\n\n");
  });

  it("does not emit unsafe javascript links or image sources", () => {
    render(<MarkdownPreview value={"[危险链接](javascript:alert(1))\n\n![危险图](javascript:alert(1))"} />);

    expect(screen.getByRole("link", { name: "危险链接" }).getAttribute("href")).toBe("#");
    expect(screen.queryByRole("img", { name: "危险图" })).toBeNull();
  });
});
