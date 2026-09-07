import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { Toast, ToastProvider, useToast } from "../src/patterns/toast";

vi.mock("sonner", () => ({
  Toaster: () => null,
  toast: {
    custom: vi.fn(() => 1),
    dismiss: vi.fn(),
  },
}));

function Trigger() {
  const { showSuccess } = useToast();
  return <button onClick={() => showSuccess("Saved")}>Notify</button>;
}

beforeEach(() => {
  vi.mocked(toast.custom).mockClear();
  vi.mocked(toast.dismiss).mockClear();
});

afterEach(cleanup);

describe("Toast pattern", () => {
  it("routes context notifications through the single toast backend", () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(toast.custom).toHaveBeenCalledTimes(1);
  });

  it("inherits an existing provider instead of creating a second notification state", () => {
    render(
      <ToastProvider>
        <ToastProvider>
          <Trigger />
        </ToastProvider>
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(toast.custom).toHaveBeenCalledTimes(1);
  });

  it("uses the same backend for the declarative Toast bridge", () => {
    const { unmount } = render(<Toast toast={{ message: "Saved", type: "success" }} />);
    expect(toast.custom).toHaveBeenCalledTimes(1);
    unmount();
    expect(toast.dismiss).toHaveBeenCalledWith(1);
  });
});
