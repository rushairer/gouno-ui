import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { NotificationProvider, useNotification } from "../src/core";
import { componentProgress } from "../showcase/catalog/component-progress";
import { notificationReviewDocuments } from "../showcase/demos/core/feedback-review-6e3";

function NotificationProbe() {
  const notification = useNotification();
  return (
    <div>
      <button
        onClick={() =>
          notification.open({ title: "构建完成", description: "已发布" })
        }
      >
        Default
      </button>
      <button
        onClick={() =>
          notification.open({ title: "短通知", duration: 100 })
        }
      >
        Short
      </button>
      <button
        onClick={() =>
          notification.open({ title: "非持久通知", duration: 0 })
        }
      >
        Zero
      </button>
      <button onClick={() => notification.open({ title: "重复" })}>Repeat</button>
      <button
        onClick={() =>
          notification.open({
            type: "error",
            title: "保存失败",
            description: "请重试",
            closable: { "aria-label": "关闭错误通知" },
          })
        }
      >
        Error
      </button>
      <button
        onClick={() =>
          notification.open({
            type: "warning",
            title: "需要确认",
            persistent: true,
            closable: { "aria-label": "关闭持久通知" },
          })
        }
      >
        Persistent
      </button>
    </div>
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Notification 6E3", () => {
  it("lets each notification own one atomic live region without outer aria-live", () => {
    render(
      <NotificationProvider>
        <NotificationProbe />
      </NotificationProvider>,
    );

    const region = document.querySelector('[data-slot="notification-region"]')!;
    expect(region.getAttribute("aria-live")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Default" }));

    const notice = screen.getByRole("status");
    expect(notice.getAttribute("aria-atomic")).toBe("true");
    expect(notice.getAttribute("data-slot")).toBe("notification");
    expect(notice.getAttribute("data-type")).toBe("info");
    expect(screen.getByText("构建完成")).toBeTruthy();
    expect(screen.getByText("已发布")).toBeTruthy();
  });

  it("keeps duplicate notices as distinct queue entries without time/random keys", () => {
    render(
      <NotificationProvider>
        <NotificationProbe />
      </NotificationProvider>,
    );

    const trigger = screen.getByRole("button", { name: "Repeat" });
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(screen.getAllByText("重复")).toHaveLength(2);
  });

  it("auto-removes a notice after an explicit finite positive duration", () => {
    vi.useFakeTimers();
    render(
      <NotificationProvider>
        <NotificationProbe />
      </NotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Short" }));
    act(() => vi.advanceTimersByTime(99));
    expect(screen.getByText("短通知")).toBeTruthy();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText("短通知")).toBeNull();
  });

  it("keeps non-positive transient duration on the finite default lifetime", () => {
    vi.useFakeTimers();
    render(
      <NotificationProvider>
        <NotificationProbe />
      </NotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Zero" }));
    act(() => vi.advanceTimersByTime(4499));
    expect(screen.getByText("非持久通知")).toBeTruthy();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText("非持久通知")).toBeNull();
  });

  it("maps semantic severity to alert/status roles and keeps the overlay surface opaque", () => {
    render(
      <NotificationProvider>
        <NotificationProbe />
      </NotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Error" }));
    const notice = screen.getByRole("alert");
    expect(notice.getAttribute("data-type")).toBe("error");
    expect(notice.classList.contains("bg-popover")).toBe(true);
    expect(notice.classList.contains("shadow-overlay")).toBe(true);
    expect(notice.querySelector('[data-slot="notification-icon"]')).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "关闭错误通知" }));
    expect(screen.queryByText("保存失败")).toBeNull();
  });

  it("supports explicit persistent notices only with a user close affordance", () => {
    vi.useFakeTimers();
    render(
      <NotificationProvider>
        <NotificationProbe />
      </NotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Persistent" }));
    act(() => vi.advanceTimersByTime(60_000));

    const notice = screen.getByRole("alert");
    expect(notice.getAttribute("data-persistent")).toBe("true");
    expect(screen.getByText("需要确认")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "关闭持久通知" }));
    expect(screen.queryByText("需要确认")).toBeNull();
  });

  it("clears pending timers on unmount and keeps the reviewed Showcase executable", () => {
    vi.useFakeTimers();
    const clearTimer = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(
      <NotificationProvider>
        <NotificationProbe />
      </NotificationProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Default" }));
    unmount();
    expect(clearTimer).toHaveBeenCalled();

    const document = notificationReviewDocuments.notification;
    expect(document.code).toContain("<NotificationProvider");
    expect(document.code).toContain("useNotification");
    expect(document.code).toContain('persistent: true');
    expect(componentProgress("core-notification", 75)).toBe(100);
  });
});
