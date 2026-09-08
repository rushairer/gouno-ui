import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Segmented } from "../src/core";

afterEach(cleanup);

describe("Core Segmented", () => {
  it("uses native radios and selects the first enabled option by default", () => {
    render(
      <Segmented
        aria-label="周期"
        options={[
          { value: "day", label: "日", disabled: true },
          { value: "week", label: "周" },
          { value: "month", label: "月" },
        ]}
      />,
    );

    const group = screen.getByRole("radiogroup", { name: "周期" });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(group.getAttribute("aria-orientation")).toBe("horizontal");
    expect(radios[0].disabled).toBe(true);
    expect(radios[1].checked).toBe(true);
    expect(radios.every((radio) => radio.type === "radio")).toBe(true);
    expect(new Set(radios.map((radio) => radio.name)).size).toBe(1);
  });

  it("supports controlled numeric values and emits the original value type", () => {
    const onChange = vi.fn();
    render(<Segmented aria-label="每页数量" name="page-size" options={[10, 20, 50]} value={20} onChange={onChange} />);

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios.map((radio) => radio.name)).toEqual(["page-size", "page-size", "page-size"]);
    expect((screen.getByRole("radio", { name: "20" }) as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole("radio", { name: "50" }));
    expect(onChange).toHaveBeenCalledWith(50);
  });

  it("supports block, orientation, size, shape, icons and disabled items", () => {
    render(
      <Segmented
        aria-label="布局"
        block
        orientation="vertical"
        size="large"
        shape="round"
        options={[
          { value: "list", label: "列表", icon: <span data-testid="list-icon">L</span> },
          { value: "board", label: "看板", disabled: true },
        ]}
      />,
    );

    const group = screen.getByRole("radiogroup", { name: "布局" });
    expect(group.getAttribute("data-orientation")).toBe("vertical");
    expect(group.getAttribute("data-size")).toBe("large");
    expect(group.getAttribute("data-shape")).toBe("round");
    expect(group.className.includes("w-full")).toBe(true);
    expect(screen.getByTestId("list-icon")).toBeTruthy();
    expect((screen.getByRole("radio", { name: "看板" }) as HTMLInputElement).disabled).toBe(true);
  });

  it("forwards the root ref and standard HTML/ARIA props", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Segmented ref={ref} aria-label="视图" data-testid="segmented" options={["列表", "网格"]} />);
    expect(ref.current).toBe(screen.getByTestId("segmented"));
    expect(ref.current?.getAttribute("aria-label")).toBe("视图");
  });
});
