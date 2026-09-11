import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Cascader } from "../src/core";
import { componentProgress } from "../showcase/component-progress";
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
  it("uses caller-owned group naming and language-neutral level names", () => {
    render(
      <Cascader
        aria-label="地区"
        options={options}
        placeholder="请选择"
      />,
    );

    expect(screen.getByRole("group", { name: "地区" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "1" })).toBeTruthy();
    expect(screen.queryByLabelText("Level 1")).toBeNull();
    expect(screen.queryByText("Please select")).toBeNull();
    expect(screen.queryByText("Select")).toBeNull();
  });

  it("expands levels and truncates the path when a level is cleared", () => {
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

    expect(screen.getByRole("combobox", { name: "3" })).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", { name: "2" }), {
      target: { value: "" },
    });

    expect(onChange).toHaveBeenLastCalledWith(
      ["china"],
      [expect.objectContaining({ value: "china" })],
    );
    expect(screen.queryByRole("combobox", { name: "3" })).toBeNull();
  });

  it("keeps controlled value caller-owned", () => {
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

    fireEvent.change(screen.getByRole("combobox", { name: "2" }), {
      target: { value: "beijing" },
    });

    expect(onChange).toHaveBeenCalledWith(
      ["china", "beijing"],
      [
        expect.objectContaining({ value: "china" }),
        expect.objectContaining({ value: "beijing" }),
      ],
    );
    rerender(renderControlled());
    expect(
      (screen.getByRole("combobox", { name: "2" }) as HTMLSelectElement).value,
    ).toBe("");
  });

  it("preserves native disabled option and whole-control disabled semantics", () => {
    const { rerender } = render(
      <Cascader aria-label="地区" options={options} placeholder="请选择" />,
    );
    const locked = screen.getByRole("option", { name: "不可选" });
    expect((locked as HTMLOptionElement).disabled).toBe(true);

    rerender(
      <Cascader
        aria-label="地区"
        options={options}
        placeholder="请选择"
        disabled
      />,
    );
    expect(
      screen
        .getAllByRole("combobox")
        .every((node) => (node as HTMLSelectElement).disabled),
    ).toBe(true);
    expect(
      screen.getByRole("group", { name: "地区" }).getAttribute("aria-disabled"),
    ).toBe("true");
  });

  it("forwards the root ref and standard root DOM/ARIA props", () => {
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
    const select = screen.getByRole("combobox", { name: "1" });
    expect(ref.current).toBe(root);
    expect(root.getAttribute("data-slot")).toBe("cascader");
    expect(root.getAttribute("aria-invalid")).toBe("true");
    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(select.className).toContain("h-11");
  });

  it("keeps the empty placeholder caller-owned", () => {
    render(<Cascader aria-label="地区" options={options} />);
    const first = screen.getByRole("combobox", { name: "1" });
    expect(first.textContent).not.toContain("Please select");
    expect(first.textContent).not.toContain("Select");
  });

  it("keeps Preview/Code executable and marks the reviewed family complete", () => {
    const document = cascaderReviewDocuments.cascader;
    expect(document.code).toContain("<Cascader");
    expect(document.code).toContain('aria-label="地区"');
    expect(document.code).toContain('placeholder="请选择"');
    expect(componentProgress("core-cascader", 65)).toBe(100);
  });
});
