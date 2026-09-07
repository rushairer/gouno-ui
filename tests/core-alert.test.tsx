import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Alert } from "../src/core";

afterEach(() => {
  vi.useRealTimers();
});

describe("Core Alert", () => {
  it("renders canonical semantic types without the old zero-width text grid", () => {
    const { container } = render(<Alert type="warning" title="High privilege scope" />);
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("data-type")).toBe("warning");
    expect(alert.getAttribute("data-variant")).toBe("outlined");
    expect(screen.getByText("High privilege scope")).toBeTruthy();
    expect(container.querySelector('[data-slot="alert-section"]')?.className).toContain("flex-1");
  });

  it("supports title, description, icons, action and filled visual variant", () => {
    render(<Alert type="success" variant="filled" showIcon title="Saved" description="Changes are durable." action={<button type="button">Undo</button>} />);
    expect(screen.getByText("Saved")).toBeTruthy();
    expect(screen.getByText("Changes are durable.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
    expect(document.querySelector('[data-slot="alert-icon"]')).toBeTruthy();
    expect(screen.getByRole("alert").getAttribute("data-variant")).toBe("filled");
  });

  it("applies banner defaults for warning type and icon", () => {
    render(<Alert banner title="Maintenance" />);
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("data-type")).toBe("warning");
    expect(alert.getAttribute("data-banner")).toBe("true");
    expect(document.querySelector('[data-slot="alert-icon"]')).toBeTruthy();
  });

  it("runs the closable lifecycle and removes the alert", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const afterClose = vi.fn();
    render(<Alert title="Closable" closable={{ "aria-label": "Dismiss alert", onClose, afterClose }} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss alert" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("alert")).toBeTruthy();
    act(() => vi.advanceTimersByTime(160));
    expect(afterClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("applies semantic classNames and styles without DOM-selector coupling", () => {
    render(<Alert type="info" title="Semantic" description="Stable slots" classNames={{ title: "fixture-title" }} styles={{ description: { maxWidth: 321 } }} />);
    expect(screen.getByText("Semantic").className).toContain("fixture-title");
    expect((screen.getByText("Stable slots") as HTMLElement).style.maxWidth).toBe("321px");
  });

  it("keeps children as a distinct custom body slot rather than a title alias", () => {
    render(<Alert title="Title">Custom body</Alert>);
    expect(screen.getByText("Title")).toBeTruthy();
    expect(screen.getByText("Custom body")).toBeTruthy();
  });

  it("exposes Alert.ErrorBoundary for local render failures", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    function Broken(): never {
      throw new Error("fixture render failure");
    }
    render(<Alert.ErrorBoundary title="Module failed"><Broken /></Alert.ErrorBoundary>);
    expect(screen.getByRole("alert").getAttribute("data-type")).toBe("error");
    expect(screen.getByText("Module failed")).toBeTruthy();
    expect(screen.getByText("fixture render failure")).toBeTruthy();
    error.mockRestore();
  });
});
