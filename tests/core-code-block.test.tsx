import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "../src/core";

afterEach(cleanup);

describe("Core CodeBlock", () => {
  it("uses code as the single display/copy source while allowing presentation rendering", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    const renderCode = vi.fn((source: string) => <span data-testid="rendered-code">{source}</span>);
    const code = "const answer = 42;";

    const { container } = render(
      <CodeBlock code={code} language="ts" renderCode={renderCode} />,
    );

    expect(renderCode).toHaveBeenCalledWith(code);
    expect(screen.getByTestId("rendered-code").textContent).toBe(code);
    expect(container.querySelector('[data-slot="code-block-language"]')?.textContent).toBe("ts");

    fireEvent.click(screen.getByRole("button", { name: "复制代码" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(code));
    expect(screen.getByRole("button", { name: "代码已复制" })).toBeTruthy();
  });

  it("supports localized copy labels and a non-copyable read-only presentation", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });

    const localized = render(
      <CodeBlock code="go test ./..." copyLabel="Copy" copiedLabel="Copied" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy());
    localized.unmount();

    const { container } = render(<CodeBlock code="plain text" copyable={false} />);
    expect(container.querySelector('[data-slot="code-block-toolbar"]')).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector('[data-slot="code-block-code"]')?.textContent).toBe("plain text");
  });
});
