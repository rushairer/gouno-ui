import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MarkdownPreview } from "../showcase/components/markdown-preview";

afterEach(cleanup);

describe("Showcase MarkdownPreview", () => {
  it("renders inline emphasis, strong text, code and links instead of exposing Markdown markers", () => {
    render(
      <MarkdownPreview value={"普通 **加粗**、*斜体*、`code` 和 [链接](https://example.com)。"} />,
    );

    expect(screen.getByText("加粗").tagName).toBe("STRONG");
    expect(screen.getByText("斜体").tagName).toBe("EM");
    expect(screen.getByText("code").tagName).toBe("CODE");
    const link = screen.getByRole("link", { name: "链接" });
    expect(link.getAttribute("href")).toBe("https://example.com");
  });

  it("renders headings, quotes, lists, code blocks and images for editor product previews", () => {
    const { container } = render(
      <MarkdownPreview
        value={"## 标题\n\n> 引用\n\n- 第一项\n- 第二项\n\n```ts\nconst ok = true;\n```\n\n![架构图](/media/diagram.webp)"}
      />,
    );

    expect(screen.getByRole("heading", { name: "标题", level: 2 })).toBeTruthy();
    expect(container.querySelector("blockquote")?.textContent).toContain("引用");
    expect(screen.getByRole("list")).toBeTruthy();
    expect(screen.getByText("const ok = true;").tagName).toBe("CODE");
    expect(screen.getByRole("img", { name: "架构图" }).getAttribute("src")).toBe("/media/diagram.webp");
  });

  it("does not emit unsafe javascript links or image sources", () => {
    render(<MarkdownPreview value={"[危险链接](javascript:alert(1))\n\n![危险图](javascript:alert(1))"} />);

    expect(screen.getByRole("link", { name: "危险链接" }).getAttribute("href")).toBe("#");
    expect(screen.queryByRole("img", { name: "危险图" })).toBeNull();
  });
});
