import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NavigationGroup } from "../src/gouno/app-shell";

describe("NavigationGroup", () => {
  it("owns spacing for both labeled and unlabeled navigation sections", () => {
    const { rerender } = render(
      <NavigationGroup label="系统管理">
        <a href="/system-management/clients">OAuth2 客户端</a>
      </NavigationGroup>,
    );

    const labeled = screen
      .getByRole("link", { name: "OAuth2 客户端" })
      .closest('[data-slot="navigation-group"]');
    expect(labeled?.tagName).toBe("SECTION");
    expect(labeled?.className).toContain("mb-6");
    expect(screen.getByRole("heading", { level: 2, name: "系统管理" })).toBeTruthy();

    rerender(
      <NavigationGroup>
        <a href="/">概览</a>
      </NavigationGroup>,
    );

    const unlabeled = screen
      .getByRole("link", { name: "概览" })
      .closest('[data-slot="navigation-group"]');
    expect(unlabeled?.tagName).toBe("DIV");
    expect(unlabeled?.className).toContain("mb-6");
    expect(screen.queryByRole("heading")).toBeNull();
  });
});
