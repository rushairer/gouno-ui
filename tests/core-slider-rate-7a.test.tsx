import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Rate, Slider } from "../src/core";
import { dataEntryDocuments } from "../showcase/demos/core/data-entry";

afterEach(cleanup);

describe("Core Slider and Rate 7A", () => {
  it("keeps Slider as a ref-safe native range input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Slider ref={ref} aria-label="Volume" min={0} max={100} defaultValue={25} />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(ref.current).toBe(slider);
    expect((slider as HTMLInputElement).type).toBe("range");
    expect(slider.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("adds vertical presentation and composes completion with standard events", () => {
    const onPointerUp = vi.fn();
    const onKeyUp = vi.fn();
    const onChangeComplete = vi.fn();
    render(
      <Slider
        aria-label="Brightness"
        orientation="vertical"
        defaultValue={65}
        onPointerUp={onPointerUp}
        onKeyUp={onKeyUp}
        onChangeComplete={onChangeComplete}
      />,
    );
    const slider = screen.getByRole("slider", { name: "Brightness" }) as HTMLInputElement;
    expect(slider.getAttribute("aria-orientation")).toBe("vertical");
    fireEvent.pointerUp(slider);
    expect(onPointerUp).toHaveBeenCalledTimes(1);
    expect(onChangeComplete).toHaveBeenLastCalledWith(65);
    slider.value = "70";
    fireEvent.keyUp(slider, { key: "ArrowRight" });
    expect(onKeyUp).toHaveBeenCalledTimes(1);
    expect(onChangeComplete).toHaveBeenLastCalledWith(70);
  });

  it("uses caller-owned Rate group/item accessible names instead of injected English copy", () => {
    render(
      <Rate
        aria-label="满意度"
        defaultValue={3}
        getItemLabel={(item) => `${item} 分`}
      />,
    );
    expect(screen.getByRole("radiogroup", { name: "满意度" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "4 分" })).toBeTruthy();
    expect(screen.queryByRole("radio", { name: "4 stars" })).toBeNull();
  });

  it("supports Rate keyboard movement and allowClear with native radios", () => {
    const onChange = vi.fn();
    render(<Rate aria-label="Priority" defaultValue={2} onChange={onChange} />);
    const two = screen.getByRole("radio", { name: "2" });
    fireEvent.keyDown(two, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith(3);
    const three = screen.getByRole("radio", { name: "3" });
    expect((three as HTMLInputElement).checked).toBe(true);
    fireEvent.click(three);
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("keeps controlled Rate caller-owned and preserves label as deprecated fallback", () => {
    const onChange = vi.fn();
    const { rerender } = render(<Rate label="Legacy rating" value={2} onChange={onChange} />);
    expect(screen.getByRole("radiogroup", { name: "Legacy rating" })).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "4" }));
    expect(onChange).toHaveBeenLastCalledWith(4);
    expect((screen.getByRole("radio", { name: "2" }) as HTMLInputElement).checked).toBe(true);

    rerender(<Rate aria-label="Canonical rating" label="Legacy rating" value={2} />);
    expect(screen.getByRole("radiogroup", { name: "Canonical rating" })).toBeTruthy();
  });

  it("supports canonical Rate sizes/custom characters and root ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Rate ref={ref} aria-label="Priority" size="large" character="◆" defaultValue={1} />,
    );
    expect(ref.current?.dataset.slot).toBe("rate");
    expect(ref.current?.dataset.size).toBe("large");
    expect(container.textContent).toContain("◆");
  });

  it("publishes same-source Slider and Rate demos plus complete API rows", () => {
    expect(dataEntryDocuments.slider.code).toContain('from "@gouno/ui/core"');
    expect(dataEntryDocuments.slider.code).toContain("onChangeComplete");
    expect(dataEntryDocuments.slider.demos?.[0]?.code).toContain('orientation="vertical"');
    expect(dataEntryDocuments.rate.code).toContain("getItemLabel");
    expect(dataEntryDocuments.rate.demos?.[0]?.code).toContain('character="●"');
    expect(dataEntryDocuments.rate.api?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["aria-label / aria-labelledby", "getItemLabel", "label", "ref"]),
    );
  });
});
