import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MessageProvider, useMessage } from "../src/core";
import { componentProgress } from "../showcase/component-progress";
import { messageReviewDocuments } from "../showcase/demos/core/feedback-review-6e2";

function MessageProbe() {
  const message = useMessage();
  return (
    <div>
      <button onClick={() => message.open("普通消息")}>Open</button>
      <button onClick={() => message.success("保存成功")}>Success</button>
      <button onClick={() => message.error("保存失败")}>Error</button>
      <button onClick={() => message.info("重复")}>Repeat</button>
    </div>
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Message 6E2", () => {
  it("lets each message own its live-region role without a duplicate outer aria-live", () => {
    render(
      <MessageProvider>
        <MessageProbe />
      </MessageProvider>,
    );

    const region = document.querySelector('[data-slot="message-region"]')!;
    expect(region.getAttribute("aria-live")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Success" }));
    expect(screen.getByRole("status").textContent).toBe("保存成功");
    expect(screen.getByRole("status").getAttribute("aria-atomic")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Error" }));
    expect(screen.getByRole("alert").textContent).toBe("保存失败");
    expect(screen.getByRole("alert").getAttribute("data-tone")).toBe("error");
  });

  it("keeps duplicate messages as distinct queue entries without time/random keys", () => {
    render(
      <MessageProvider>
        <MessageProbe />
      </MessageProvider>,
    );

    const trigger = screen.getByRole("button", { name: "Repeat" });
    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(screen.getAllByText("重复")).toHaveLength(2);
  });

  it("uses open as info by default and auto-removes after the configured duration", () => {
    vi.useFakeTimers();
    render(
      <MessageProvider duration={100}>
        <MessageProbe />
      </MessageProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("status").getAttribute("data-tone")).toBe("info");

    act(() => vi.advanceTimersByTime(99));
    expect(screen.getByText("普通消息")).toBeTruthy();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText("普通消息")).toBeNull();
  });

  it("clears pending removal timers when the provider unmounts", () => {
    vi.useFakeTimers();
    const clearTimer = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(
      <MessageProvider duration={1000}>
        <MessageProbe />
      </MessageProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Success" }));
    unmount();
    expect(clearTimer).toHaveBeenCalled();
  });

  it("keeps Preview/Code executable and marks the reviewed family complete", () => {
    const document = messageReviewDocuments.message;
    expect(document.code).toContain("<MessageProvider");
    expect(document.code).toContain("useMessage");
    expect(componentProgress("core-message", 75)).toBe(100);
  });
});
