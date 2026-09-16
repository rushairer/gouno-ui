import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminPostEditorDemo } from "../showcase/demos/products/blog-admin/post-editor";

afterEach(cleanup);

describe("Blog Admin MarkdownEditor formatting integration", () => {
  it("keeps italic markers bound to the active selection and renders them as emphasis", () => {
    render(<BlogAdminPostEditorDemo />);
    const textarea = screen.getByLabelText("文章正文 Markdown") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "alpha beta" } });
    textarea.focus();
    textarea.setSelectionRange(6, 10);
    fireEvent.select(textarea);

    const italic = screen.getByRole("button", { name: "斜体" });
    fireEvent.mouseDown(italic);
    fireEvent.click(italic);

    expect(textarea.value).toBe("alpha *beta*");

    fireEvent.click(screen.getByRole("button", { name: "预览" }));
    const preview = screen.getByLabelText("文章预览");
    expect(within(preview).getByText("beta").tagName).toBe("EM");
  });

  it("inserts a valid Markdown link and renders an interactive anchor", () => {
    render(<BlogAdminPostEditorDemo />);
    const textarea = screen.getByLabelText("文章正文 Markdown") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "alpha link" } });
    textarea.focus();
    textarea.setSelectionRange(6, 10);
    fireEvent.select(textarea);

    const linkButton = screen.getByRole("button", { name: "插入链接" });
    fireEvent.mouseDown(linkButton);
    fireEvent.click(linkButton);

    expect(textarea.value).toBe("alpha [link](https://example.com)");

    fireEvent.click(screen.getByRole("button", { name: "预览" }));
    const preview = screen.getByLabelText("文章预览");
    expect(within(preview).getByRole("link", { name: "link" }).getAttribute("href")).toBe("https://example.com");
  });
});
