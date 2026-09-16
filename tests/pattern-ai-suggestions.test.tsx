import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AISuggestionPicker, AISuggestionReview } from "../src/patterns";

afterEach(cleanup);

describe("AI suggestion patterns", () => {
  it("presents field candidates as a radio list and applies only the selected value", () => {
    const onValueChange = vi.fn();
    const onApply = vi.fn();
    render(
      <AISuggestionPicker
        aria-label="标题 AI 建议"
        groupLabel="标题候选"
        options={[{ value: "候选 A" }, { value: "候选 B" }]}
        value="候选 A"
        onValueChange={onValueChange}
        onApply={onApply}
      />,
    );

    expect(screen.getByRole("radiogroup", { name: "标题候选" })).toBeTruthy();
    expect((screen.getByRole("radio", { name: "候选 A" }) as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole("radio", { name: "候选 B" }));
    expect(onValueChange).toHaveBeenCalledWith("候选 B");
    fireEvent.click(screen.getByRole("button", { name: "使用所选" }));
    expect(onApply).toHaveBeenCalledWith("候选 A");
  });

  it("reviews related field changes with checkboxes before one explicit apply", () => {
    const onSelectedKeysChange = vi.fn();
    const onApply = vi.fn();
    render(
      <AISuggestionReview
        aria-label="AI 路径与 SEO 建议"
        groupLabel="路径与 SEO 建议"
        items={[
{ key: "slug", label: "Slug", value: "about-us", monospace: true },
{ key: "seo-title", label: "SEO 标题", value: "关于我们" },
        ]}
        selectedKeys={["slug", "seo-title"]}
        onSelectedKeysChange={onSelectedKeysChange}
        onApply={onApply}
      />,
    );

    expect(screen.getByRole("group", { name: "路径与 SEO 建议" })).toBeTruthy();
    fireEvent.click(screen.getByRole("checkbox", { name: "应用 SEO 标题 建议" }));
    expect(onSelectedKeysChange).toHaveBeenCalledWith(["slug"]);
    fireEvent.click(screen.getByRole("button", { name: "应用 2 项建议" }));
    expect(onApply).toHaveBeenCalledTimes(1);
  });
});
