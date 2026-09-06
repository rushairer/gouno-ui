import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CodeBlock } from "../showcase/components/code-block";

describe("Showcase CodeBlock", () => {
  it("highlights TSX and copies the exact displayed source", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    const code = '<Button variant="primary" onClick={save}>保存</Button>';
    const { container } = render(<CodeBlock code={code} />);
    expect(container.querySelector(".syntax-tag")).toBeTruthy();
    expect(container.querySelector(".syntax-attr-name")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "复制代码" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(code));
    expect(screen.getByRole("button", { name: "代码已复制" })).toBeTruthy();
  });
});
