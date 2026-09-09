import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Result } from "../src/core";

afterEach(cleanup);

describe("Core Result", () => {
  it("uses caller-owned result content with an H2 default", () => {
    render(
      <Result
        status="success"
        title="Saved"
        description="Changes are persisted."
        extra={<button type="button">Continue</button>}
      >
        <span>Reference: 42</span>
      </Result>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Saved" })).toBeTruthy();
    expect(screen.getByText("Changes are persisted.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Continue" })).toBeTruthy();
    expect(screen.getByText("Reference: 42")).toBeTruthy();
  });

  it("does not force live-region semantics and supports page-level headings", () => {
    const { container } = render(
      <Result
        status="info"
        headingLevel={1}
        title="Page not found"
        description="Choose another destination."
      />,
    );

    const result = container.querySelector('[data-slot="result"]');
    expect(result?.getAttribute("role")).toBeNull();
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeTruthy();
  });

  it("allows callers to opt into standard announcement semantics", () => {
    const { container } = render(
      <Result
        role="alert"
        aria-live="assertive"
        aria-label="Save result"
        data-state="failed"
        className="custom-result"
        status="error"
        title="Save failed"
      />,
    );

    const result = container.querySelector('[data-slot="result"]');
    expect(result?.getAttribute("role")).toBe("alert");
    expect(result?.getAttribute("aria-live")).toBe("assertive");
    expect(result?.getAttribute("aria-label")).toBe("Save result");
    expect(result?.getAttribute("data-state")).toBe("failed");
    expect(result?.className).toContain("custom-result");
  });

  it("keeps status icons decorative and the root surface-neutral", () => {
    const { container } = render(
      <Result status="warning" title="Needs attention" />,
    );

    const result = container.querySelector('[data-slot="result"]');
    const icon = container.querySelector('[data-slot="result-icon"]');
    expect(result?.getAttribute("data-status")).toBe("warning");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    expect(icon?.textContent).toBe("");
    expect(result?.className).not.toMatch(/border|rounded|shadow/);
  });

  it("renders numeric zero descriptions instead of treating them as absent", () => {
    render(<Result title="Count" description={0} />);
    expect(screen.getByText("0")).toBeTruthy();
  });
});
