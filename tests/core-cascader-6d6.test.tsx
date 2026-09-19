import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cascader } from "../src/core";
import { componentProgress } from "../showcase/catalog/component-progress";
import { cascaderReviewDocuments } from "../showcase/demos/core/data-entry-review-6d6";

const options = [
  {
    value: "china",
    label: "中国",
    children: [
      {
        value: "beijing",
        label: "北京",
        children: [{ value: "chaoyang", label: "朝阳" }],
      },
      { value: "shanghai", label: "上海" },
    ],
  },
  { value: "locked", label: "不可选", disabled: true },
] as const;

afterEach(cleanup);

describe("Cascader 6D6", () => {
  it("uses a Gouno-owned combobox trigger and language-neutral popup levels", async () => {
    render(
      <Cascader
        aria-label="地区"
        options={options}
        placeholder="请选择"
      />,
    );

    expect(screen.getByRole("group", { name: "地区" })).toBeTruthy();
    const trigger = screen.getByRole("combobox", { name: "地区" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox");
    await userEvent.click(trigger);
    expect(screen.getByRole("listbox", { name: "1" })).toBeTruthy();
    expect(screen.queryByText("Please select")).toBeNull();
    expect(screen.queryByText("Select")).toBeNull();
  });

  it("expands popup columns and truncates the path when a level is cleared", async () => {
    const onChange = vi.fn();
    render(
      <Cascader
        aria-label="地区"
        options={options}
        defaultValue={["china", "beijing"]}
        placeholder="请选择"
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "地区" });
    expect(trigger.textContent).toContain("中国 / 北京");
    await userEvent.click(trigger);
    expect(screen.getByRole("listbox", { name: "3" })).toBeTruthy();

    await userEvent.click(
      within(screen.getByRole("listbox", { name: "2" })).getByRole("option", {
        name: "请选择",
      }),
    );

    expect(onChange).toHaveBeenLastCalledWith(
      ["china"],
      [expect.objectContaining({ value: "china" })],
    );
    expect(screen.queryByRole("listbox", { name: "3" })).toBeNull();
  });

  it("keeps controlled value caller-owned while requesting branch changes", async () => {
    const onChange = vi.fn();
    const renderControlled = () => (
      <Cascader
        aria-label="地区"
        options={options}
        value={["china"]}
        placeholder="请选择"
        onChange={onChange}
      />
    );
    const { rerender } = render(renderControlled());

    await userEvent.click(screen.getByRole("combobox", { name: "地区" }));
    await userEvent.click(
      within(screen.getByRole("listbox", { name: "2" })).getByRole("option", {
        name: "北京",
      }),
    );

    expect(onChange).toHaveBeenCalledWith(
      ["china", "beijing"],
      [
        expect.objectContaining({ value: "china" }),
        expect.objectContaining({ value: "beijing" }),
      ],
    );
    rerender(renderControlled());
    expect(screen.getByRole("combobox", { name: "地区" }).textContent).toContain(
      "中国",
    );
    expect(screen.getByRole("combobox", { name: "地区" }).textContent).not.toContain(
      "北京",
    );
  });

  it("preserves disabled option and whole-control disabled semantics", async () => {
    const { rerender } = render(
      <Cascader aria-label="地区" options={options} placeholder="请选择" />,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "地区" }));
    const locked = screen.getByRole("option", { name: "不可选" });
    expect((locked as HTMLButtonElement).disabled).toBe(true);

    rerender(
      <Cascader
        aria-label="地区"
        options={options}
        placeholder="请选择"
        disabled
      />,
    );
    expect(
      (screen.getByRole("combobox", { name: "地区" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(
      screen.getByRole("group", { name: "地区" }).getAttribute("aria-disabled"),
    ).toBe("true");
  });

  it("forwards the root ref and consumes canonical picker size/status geometry", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Cascader
        ref={ref}
        aria-label="地区"
        data-testid="cascader"
        options={options}
        placeholder="请选择"
        size="large"
        status="error"
      />,
    );

    const root = screen.getByTestId("cascader");
    const trigger = screen.getByRole("combobox", { name: "地区" });
    const control = trigger.closest('[data-slot="cascader-control"]');
    expect(ref.current).toBe(root);
    expect(root.getAttribute("data-slot")).toBe("cascader");
    expect(root.getAttribute("aria-invalid")).toBe("true");
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
    expect(control?.className).toContain("h-[var(--control-height-large)]");
  });

  it("supports horizontal hierarchy keyboard navigation without native popup behavior", async () => {
    const onChange = vi.fn();
    render(
      <Cascader
        aria-label="地区"
        options={options}
        placeholder="请选择"
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "地区" }));
    const china = screen.getByRole("option", { name: "中国" });
    china.focus();
    fireEvent.keyDown(china, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith(
      ["china"],
      [expect.objectContaining({ value: "china" })],
    );
    expect(screen.getByRole("listbox", { name: "2" })).toBeTruthy();
  });

  it("keeps Preview/Code executable and marks the reviewed family complete", () => {
    const document = cascaderReviewDocuments.cascader;
    expect(document.code).toContain("<Cascader");
    expect(document.code).toContain('aria-label="地区"');
    expect(document.code).toContain('placeholder="请选择"');
    expect(componentProgress("core-cascader", 65)).toBe(100);
  });
});
