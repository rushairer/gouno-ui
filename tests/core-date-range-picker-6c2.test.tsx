import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DateRangePicker } from "../src/core";
import { componentProgress } from "../showcase/component-progress";
import { coreDocuments } from "../showcase/demos/core/registry";

afterEach(cleanup);

describe("Core DateRangePicker 6C2", () => {
  it("keeps each native input's identity and accessible name independent", () => {
    const rootRef = createRef<HTMLDivElement>();
    const startRef = createRef<HTMLInputElement>();
    const endRef = createRef<HTMLInputElement>();

    render(
      <DateRangePicker
        ref={rootRef}
        data-testid="range"
        start="2026-09-01"
        end="2026-09-06"
        startInputProps={{
          ref: startRef,
          id: "range-start",
          name: "startDate",
          "aria-label": "开始日期",
          min: "2026-08-01",
        }}
        endInputProps={{
          ref: endRef,
          id: "range-end",
          name: "endDate",
          "aria-label": "结束日期",
          max: "2026-10-01",
        }}
      />,
    );

    expect(rootRef.current).toBe(screen.getByTestId("range"));
    const start = screen.getByLabelText("开始日期") as HTMLInputElement;
    const end = screen.getByLabelText("结束日期") as HTMLInputElement;
    expect(startRef.current).toBe(start);
    expect(endRef.current).toBe(end);
    expect(start.id).toBe("range-start");
    expect(end.id).toBe("range-end");
    expect(start.name).toBe("startDate");
    expect(end.name).toBe("endDate");
    expect(start.min).toBe("2026-08-01");
    expect(end.max).toBe("2026-10-01");
    expect(start.value).toBe("2026-09-01");
    expect(end.value).toBe("2026-09-06");
  });

  it("reports the complete controlled range and normalizes cleared values", () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        start="2026-09-01"
        end="2026-09-06"
        onChange={onChange}
        startInputProps={{ "aria-label": "开始日期" }}
        endInputProps={{ "aria-label": "结束日期" }}
      />,
    );

    fireEvent.change(screen.getByLabelText("开始日期"), {
      target: { value: "2026-09-02" },
    });
    expect(onChange).toHaveBeenLastCalledWith({
      start: "2026-09-02",
      end: "2026-09-06",
    });

    fireEvent.change(screen.getByLabelText("结束日期"), {
      target: { value: "" },
    });
    expect(onChange).toHaveBeenLastCalledWith({
      start: "2026-09-01",
      end: undefined,
    });
  });

  it("shares size/status visual policy without inventing accessible copy", () => {
    const { container } = render(
      <DateRangePicker start="" end="" size="large" status="error" />,
    );

    const inputs = container.querySelectorAll<HTMLInputElement>('input[type="date"]');
    expect(inputs).toHaveLength(2);
    for (const input of inputs) {
      expect(input.className).toContain("h-11");
      expect(input.getAttribute("aria-invalid")).toBe("true");
      expect(input.hasAttribute("aria-label")).toBe(false);
    }
    expect(screen.queryByLabelText("Start date")).toBeNull();
    expect(screen.queryByLabelText("End date")).toBeNull();
  });

  it("documents the split input ownership model from executable source", () => {
    const document = coreDocuments["date-range-picker"];
    expect(document.code).toContain('from "@gouno/ui/core"');
    expect(document.code).toContain("startInputProps");
    expect(document.code).toContain("endInputProps");
    expect(document.api?.map((row) => row.name)).toEqual(
      expect.arrayContaining([
        "start",
        "end",
        "onChange",
        "size",
        "status",
        "startInputProps",
        "endInputProps",
        "separator",
        "ref",
      ]),
    );
    expect(componentProgress("core-date-range-picker", 0)).toBe(100);
  });
});
