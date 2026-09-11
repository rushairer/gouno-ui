import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Rate, Slider } from "../src/core";
import { componentProgress } from "../showcase/component-progress";
import { sliderRateReviewDocuments } from "../showcase/demos/core/data-entry-review-6d2";

afterEach(cleanup);

describe("Core Slider + Rate 6D2", () => {
  it("keeps Slider on the native range element and forwards its real ref", () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    render(
      <Slider
        ref={ref}
        aria-label="音量"
        name="volume"
        min={10}
        max={90}
        step={5}
        defaultValue={35}
        data-testid="volume-slider"
        onChange={onChange}
      />,
    );

    const slider = screen.getByRole("slider", { name: "音量" }) as HTMLInputElement;
    expect(ref.current).toBe(slider);
    expect(slider.type).toBe("range");
    expect(slider.name).toBe("volume");
    expect(slider.min).toBe("10");
    expect(slider.max).toBe("90");
    expect(slider.step).toBe("5");
    expect(slider.value).toBe("35");
    expect(slider.getAttribute("data-slot")).toBe("slider");
    expect(slider.getAttribute("data-testid")).toBe("volume-slider");

    fireEvent.change(slider, { target: { value: "40" } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(slider.value).toBe("40");
  });

  it("keeps Rate naming caller-owned and forwards the real radiogroup ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Rate ref={ref} aria-label="满意度" defaultValue={2} data-testid="rate" />);

    const group = screen.getByRole("radiogroup", { name: "满意度" });
    expect(ref.current).toBe(group);
    expect(group.getAttribute("data-slot")).toBe("rate");
    expect(group.getAttribute("data-testid")).toBe("rate");
    expect(screen.getByRole("radio", { name: "1" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "5" })).toBeTruthy();
    expect(screen.queryByText("Rating")).toBeNull();
    expect(screen.queryByLabelText("2 stars")).toBeNull();
  });

  it("preserves click-to-clear semantics without creating a second state path", () => {
    const onChange = vi.fn();
    render(<Rate aria-label="评分" defaultValue={2} onChange={onChange} />);

    fireEvent.click(screen.getByRole("radio", { name: "4" }));
    expect(screen.getByRole("radio", { name: "4" }).getAttribute("aria-checked")).toBe("true");
    expect(onChange).toHaveBeenLastCalledWith(4);

    fireEvent.click(screen.getByRole("radio", { name: "4" }));
    expect(screen.getByRole("radio", { name: "4" }).getAttribute("aria-checked")).toBe("false");
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("uses roving focus and arrow/Home/End keys as one radio-group selection model", () => {
    const onChange = vi.fn();
    render(<Rate aria-label="评分" defaultValue={2} onChange={onChange} />);

    const second = screen.getByRole("radio", { name: "2" }) as HTMLButtonElement;
    second.focus();
    expect(second.tabIndex).toBe(0);

    fireEvent.keyDown(second, { key: "ArrowRight" });
    const third = screen.getByRole("radio", { name: "3" }) as HTMLButtonElement;
    expect(third.getAttribute("aria-checked")).toBe("true");
    expect(document.activeElement).toBe(third);
    expect(third.tabIndex).toBe(0);
    expect(onChange).toHaveBeenLastCalledWith(3);

    fireEvent.keyDown(third, { key: "End" });
    const fifth = screen.getByRole("radio", { name: "5" }) as HTMLButtonElement;
    expect(fifth.getAttribute("aria-checked")).toBe("true");
    expect(document.activeElement).toBe(fifth);
    expect(onChange).toHaveBeenLastCalledWith(5);

    fireEvent.keyDown(fifth, { key: "ArrowRight" });
    const first = screen.getByRole("radio", { name: "1" }) as HTMLButtonElement;
    expect(first.getAttribute("aria-checked")).toBe("true");
    expect(document.activeElement).toBe(first);
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it("disables the complete Rate group without leaving tabbable radio items", () => {
    render(<Rate aria-label="锁定评分" defaultValue={3} disabled />);

    const group = screen.getByRole("radiogroup", { name: "锁定评分" });
    expect(group.getAttribute("aria-disabled")).toBe("true");
    for (const radio of screen.getAllByRole("radio")) {
      expect((radio as HTMLButtonElement).disabled).toBe(true);
      expect((radio as HTMLButtonElement).tabIndex).toBe(-1);
    }
  });

  it("keeps Preview/Code executable and marks both reviewed families complete", () => {
    expect(sliderRateReviewDocuments.slider.code).toContain("<Slider");
    expect(sliderRateReviewDocuments.rate.code).toContain("<Rate");
    expect(sliderRateReviewDocuments.rate.code).toContain('aria-label="满意度"');
    expect(componentProgress("core-slider", 72)).toBe(100);
    expect(componentProgress("core-rate", 68)).toBe(100);
  });
});
