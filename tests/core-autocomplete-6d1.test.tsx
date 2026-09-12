import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AutoComplete } from "../src/core";
import { componentProgress } from "../showcase/catalog/component-progress";
import { autoCompleteReviewDocuments } from "../showcase/demos/core/data-entry-review-6d1";

afterEach(cleanup);

describe("Core AutoComplete 6D1", () => {
  it("forwards the real input ref and aligns size/status with other controls", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <AutoComplete
        ref={ref}
        aria-label="城市"
        options={["北京", "上海"]}
        size="large"
        status="error"
        data-testid="city-autocomplete"
      />,
    );

    const input = screen.getByRole("combobox", { name: "城市" });
    expect(ref.current).toBe(input);
    expect(input.getAttribute("data-slot")).toBe("auto-complete-input");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.className).toContain("h-11");
    expect(input.getAttribute("data-testid")).toBe("city-autocomplete");
  });

  it("does not inject English empty copy and keeps empty content caller-owned", () => {
    const { rerender } = render(
      <AutoComplete aria-label="空集合" options={[]} />,
    );
    const input = screen.getByRole("combobox", { name: "空集合" });
    fireEvent.focus(input);

    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("No options")).toBeNull();
    expect(screen.queryByRole("listbox")).toBeNull();

    rerender(
      <AutoComplete aria-label="空集合" options={[]} emptyText="没有匹配项" />,
    );
    fireEvent.focus(screen.getByRole("combobox", { name: "空集合" }));
    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(screen.getByText("没有匹配项")).toBeTruthy();
  });

  it("supports explicit option labels/disabled state and skips disabled options", () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    render(
      <AutoComplete
        aria-label="城市"
        options={[
          { value: "beijing", label: "北京", disabled: true },
          { value: "shanghai", label: "上海" },
          { value: "shenzhen", label: "深圳" },
        ]}
        onChange={onChange}
        onSelect={onSelect}
      />,
    );

    const input = screen.getByRole("combobox", { name: "城市" });
    fireEvent.focus(input);
    expect(
      screen.getByRole("option", { name: "北京" }).getAttribute("aria-disabled"),
    ).toBe("true");

    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith("shanghai");
    expect(onSelect).toHaveBeenLastCalledWith("shanghai", {
      value: "shanghai",
      label: "上海",
      disabled: false,
    });
  });

  it("preserves consumer focus/blur/keyboard handlers and closes synchronously on blur", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <AutoComplete
        aria-label="成员"
        options={["Alice", "Bob"]}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />,
    );

    const input = screen.getByRole("combobox", { name: "成员" });
    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalledOnce();
    expect(screen.getByRole("listbox")).toBeTruthy();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onKeyDown).toHaveBeenCalledOnce();

    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledOnce();
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("keeps Preview/Code on executable source and marks the reviewed family complete", () => {
    const document = autoCompleteReviewDocuments.autocomplete;
    expect(document.code).toContain("<AutoComplete");
    expect(document.code).toContain("onSelect");
    expect(document.code).toContain("emptyText");
    expect(document.api?.map((row) => row.name)).toEqual(
      expect.arrayContaining([
        "options",
        "value",
        "defaultValue",
        "onChange",
        "onSelect",
        "emptyText",
        "size",
        "status",
        "...input props",
        "ref",
      ]),
    );
    expect(componentProgress("core-autocomplete", 86)).toBe(100);
  });
});
