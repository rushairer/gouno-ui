import { createRef } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  Calendar,
  Carousel,
  Timeline,
  type CarouselRef,
} from "../src/core";

describe("advanced Core Data Display behavior", () => {
  beforeEach(() => {
    document.documentElement.lang = "en";
  });

  it("renders Timeline modes from stable keyed items and reverses without losing semantics", () => {
    const { rerender } = render(
      <Timeline
        mode="alternate"
        variant="filled"
        items={[
          { key: "a", title: "09:00", content: "Created" },
          { key: "b", title: "09:15", content: "Building", loading: true },
          { key: "c", title: "09:30", content: "Published" },
        ]}
      />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(document.querySelector('[data-slot="timeline"]')?.getAttribute("data-mode")).toBe(
      "alternate",
    );
    expect(document.querySelector('[data-slot="spinner"]')).toBeTruthy();

    rerender(
      <Timeline
        orientation="horizontal"
        reverse
        items={[
          { key: "a", content: "Created" },
          { key: "b", content: "Building" },
          { key: "c", content: "Published" },
        ]}
      />,
    );

    expect(screen.getAllByRole("listitem")[0].textContent).toContain("Published");
    expect(document.querySelector('[data-slot="timeline"]')?.getAttribute("data-orientation")).toBe(
      "horizontal",
    );
  });

  it("renders a complete 6x7 Calendar month matrix and reports selection source", () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    render(
      <Calendar
        defaultValue={new Date(2026, 8, 10)}
        showWeek
        validRange={[new Date(2026, 8, 5), new Date(2026, 9, 20)]}
        onChange={onChange}
        onSelect={onSelect}
      />,
    );

    expect(screen.getAllByRole("gridcell")).toHaveLength(42);
    expect(screen.getAllByRole("rowheader")).toHaveLength(6);

    const september18 = screen.getByRole("button", { name: /September 18, 2026/ });
    fireEvent.click(september18);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenLastCalledWith(
      expect.any(Date),
      expect.objectContaining({ source: "date" }),
    );

    const september1 = screen.getByRole("button", { name: /September 1, 2026/ });
    expect((september1 as HTMLButtonElement).disabled).toBe(true);
  });

  it("switches Calendar year view into a selected month and supports custom header rendering", () => {
    const onPanelChange = vi.fn();
    const onSelect = vi.fn();
    render(
      <Calendar
        defaultValue={new Date(2026, 0, 15)}
        defaultMode="year"
        fullscreen={false}
        onPanelChange={onPanelChange}
        onSelect={onSelect}
        headerRender={({ value }) => <strong>Year {value.getFullYear()}</strong>}
      />,
    );

    expect(screen.getByText("Year 2026")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "September" }));
    expect(onSelect).toHaveBeenCalledWith(
      expect.any(Date),
      expect.objectContaining({ source: "month" }),
    );
    expect(onPanelChange).toHaveBeenLastCalledWith(expect.any(Date), "month");
  });

  it("navigates Carousel with finite arrows and emits ordered lifecycle callbacks", () => {
    const beforeChange = vi.fn();
    const onChange = vi.fn();
    const afterChange = vi.fn();
    vi.useFakeTimers();

    render(
      <Carousel
        arrows
        infinite={false}
        speed={100}
        items={[<div key="a">Alpha</div>, <div key="b">Beta</div>]}
        beforeChange={beforeChange}
        onChange={onChange}
        afterChange={afterChange}
      />,
    );

    const next = screen.getByRole("button", { name: "Next slide" });
    fireEvent.click(next);
    expect(beforeChange).toHaveBeenCalledWith(0, 1);
    expect(onChange).toHaveBeenCalledWith(1);
    act(() => vi.advanceTimersByTime(100));
    expect(afterChange).toHaveBeenCalledWith(1);
    expect((next as HTMLButtonElement).disabled).toBe(true);

    vi.useRealTimers();
  });

  it("exposes Carousel goTo/next/prev through its imperative ref", () => {
    const ref = createRef<CarouselRef>();
    const onChange = vi.fn();
    render(
      <Carousel
        ref={ref}
        speed={0}
        items={[<div key="a">Alpha</div>, <div key="b">Beta</div>, <div key="c">Gamma</div>]}
        onChange={onChange}
      />,
    );

    act(() => ref.current?.goTo(2, true));
    expect(onChange).toHaveBeenLastCalledWith(2);
    act(() => ref.current?.prev());
    expect(onChange).toHaveBeenLastCalledWith(1);
    act(() => ref.current?.next());
    expect(onChange).toHaveBeenLastCalledWith(2);
  });
});
