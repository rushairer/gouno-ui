import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ColorPicker, TimePicker } from "../src/core";
import { componentProgress } from "../showcase/catalog/component-progress";
import { coreDocuments } from "../showcase/demos/core/registry";

afterEach(cleanup);

describe("Core native pickers 6C1", () => {
  it("keeps TimePicker native while adding Gouno size, status and a real input ref", () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();

    render(
      <TimePicker
        ref={ref}
        data-testid="time-picker"
        aria-label="开始时间"
        defaultValue="09:30"
        min="08:00"
        max="18:00"
        step={300}
        size="large"
        status="error"
        onChange={onChange}
      />,
    );

    const input = screen.getByTestId("time-picker") as HTMLInputElement;
    expect(ref.current).toBe(input);
    expect(input.type).toBe("time");
    expect(input.value).toBe("09:30");
    expect(input.min).toBe("08:00");
    expect(input.max).toBe("18:00");
    expect(input.step).toBe("300");
    expect(input.getAttribute("data-slot")).toBe("time-picker");
    expect(input.getAttribute("data-status")).toBe("error");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.className).toContain("h-11");

    fireEvent.change(input, { target: { value: "10:15" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("keeps accessible naming caller-owned and warning separate from invalid state", () => {
    render(
      <TimePicker
        data-testid="warning-time"
        aria-label="发布时间"
        status="warning"
      />,
    );

    const input = screen.getByTestId("warning-time");
    expect(input.getAttribute("aria-label")).toBe("发布时间");
    expect(input.hasAttribute("aria-invalid")).toBe(false);
  });

  it("keeps ColorPicker native while forwarding standard props and the real input ref", () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();

    render(
      <ColorPicker
        ref={ref}
        data-testid="color-picker"
        aria-label="品牌色"
        defaultValue="#1677ff"
        name="brandColor"
        size="small"
        status="error"
        onChange={onChange}
      />,
    );

    const input = screen.getByTestId("color-picker") as HTMLInputElement;
    expect(ref.current).toBe(input);
    expect(input.type).toBe("color");
    expect(input.value).toBe("#1677ff");
    expect(input.name).toBe("brandColor");
    expect(input.getAttribute("data-slot")).toBe("color-picker");
    expect(input.getAttribute("data-status")).toBe("error");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.className).toContain("h-8");

    fireEvent.change(input, { target: { value: "#ff0000" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("publishes source-trusted Showcase documents and reviewed progress for both families", () => {
    const timeDocument = coreDocuments["time-picker"];
    const colorDocument = coreDocuments["color-picker"];

    expect(timeDocument.code).toContain('from "@gouno/ui/core"');
    expect(timeDocument.code).toContain('size="large"');
    expect(timeDocument.api?.map((row) => row.name)).toContain("size");
    expect(timeDocument.api?.map((row) => row.name)).toContain("ref");

    expect(colorDocument.code).toContain('from "@gouno/ui/core"');
    expect(colorDocument.code).toContain('aria-label="品牌色"');
    expect(colorDocument.api?.map((row) => row.name)).toContain("status");
    expect(colorDocument.api?.map((row) => row.name)).toContain("ref");

    expect(componentProgress("core-time-picker", 0)).toBe(100);
    expect(componentProgress("core-color-picker", 0)).toBe(100);
  });
});
