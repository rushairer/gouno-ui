import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GossoCallbackDemo } from "../showcase/demos/products/gosso-admin/auth/callback";

afterEach(() => {
  cleanup();
});

describe("Gosso callback loading semantics", () => {
  it("uses one localized parent status while Spinner stays decorative", () => {
    const { container } = render(<GossoCallbackDemo />);

    const statuses = screen.getAllByRole("status");
    expect(statuses).toHaveLength(1);
    expect(statuses[0]?.textContent).toContain(
      "正在验证 OAuth 2.0 Authorization Code + PKCE 回调…",
    );

    const spinner = container.querySelector('[data-slot="spinner"]') as HTMLSpanElement;
    expect(spinner).toBeTruthy();
    expect(spinner.getAttribute("aria-hidden")).toBe("true");
    expect(spinner.getAttribute("role")).toBeNull();
    expect(spinner.getAttribute("aria-label")).toBeNull();
    expect(container.textContent).not.toContain("Loading");
  });
});
