import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Tour, type TourStep } from "../src/core";
import { componentProgress } from "../showcase/catalog/component-progress";
import { tourReviewDocuments } from "../showcase/demos/core/feedback-review-6e4";

const steps = [
  { title: "第一步", description: "开始配置" },
  { title: "第二步", description: "检查结果" },
] as const satisfies readonly TourStep[];

const labels = {
  previousText: "上一步",
  nextText: "下一步",
  finishText: "完成",
} as const;

afterEach(cleanup);

describe("Tour 6E4", () => {
  it("uses the visible step title as the dialog name and caller-owned action copy", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Tour
        ref={ref}
        open
        steps={steps}
        onClose={vi.fn()}
        className="custom-tour"
        {...labels}
      />,
    );

    const dialog = screen.getByRole("dialog", { name: "第一步" });
    expect(dialog.getAttribute("data-slot")).toBe("tour-content");
    expect(dialog.className).toContain("custom-tour");
    expect(ref.current).toBe(dialog);
    expect(screen.getByRole("button", { name: "下一步" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Next" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Finish" })).toBeNull();
  });

  it("advances and retreats the uncontrolled step index with normalized callbacks", () => {
    const onChange = vi.fn();
    render(
      <Tour open steps={steps} onChange={onChange} onClose={vi.fn()} {...labels} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "下一步" }));
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole("dialog", { name: "第二步" })).toBeTruthy();
    expect(screen.getByText("2 / 2")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "上一步" }));
    expect(onChange).toHaveBeenLastCalledWith(0);
    expect(screen.getByRole("dialog", { name: "第一步" })).toBeTruthy();
  });

  it("reports navigation without mutating a controlled current index", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Tour
        open
        current={0}
        steps={steps}
        onChange={onChange}
        onClose={vi.fn()}
        {...labels}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "下一步" }));
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole("dialog", { name: "第一步" })).toBeTruthy();

    rerender(
      <Tour
        open
        current={1}
        steps={steps}
        onChange={onChange}
        onClose={vi.fn()}
        {...labels}
      />,
    );
    expect(screen.getByRole("dialog", { name: "第二步" })).toBeTruthy();
  });

  it("closes with Escape and restores focus through the canonical dialog primitive", async () => {
    function Probe() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>开始</button>
          <Tour
            open={open}
            steps={steps}
            onClose={() => setOpen(false)}
            {...labels}
          />
        </>
      );
    }

    render(<Probe />);
    const trigger = screen.getByRole("button", { name: "开始" });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "第一步" })).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("resets an uncontrolled tour after close before the next open", async () => {
    function Probe() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>开始</button>
          <Tour
            open={open}
            steps={steps}
            onClose={() => setOpen(false)}
            {...labels}
          />
        </>
      );
    }

    render(<Probe />);
    const trigger = screen.getByRole("button", { name: "开始" });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "下一步" }));
    expect(screen.getByRole("dialog", { name: "第二步" })).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "第一步" })).toBeTruthy();
  });

  it("keeps Preview/Code executable, removes the fake target API, and marks reviewed complete", () => {
    const document = tourReviewDocuments.tour;
    expect(document.code).toContain("<Tour");
    expect(document.code).toContain('nextText="下一步"');
    expect(document.api?.some((row) => row.name === "target")).toBe(false);
    expect(
      document.apiSections
        ?.flatMap((section) => section.rows)
        .some((row) => row.name === "target"),
    ).toBe(false);
    expect(componentProgress("core-tour", 68)).toBe(100);
  });
});
