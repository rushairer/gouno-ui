import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Popconfirm } from "../src/core";
import { componentProgress } from "../showcase/component-progress";
import { popconfirmReviewDocuments } from "../showcase/demos/core/feedback-review-6e1";

afterEach(cleanup);

describe("Popconfirm 6E1", () => {
  const renderBasic = (
    props: Partial<React.ComponentProps<typeof Popconfirm>> = {},
  ) =>
    render(
      <Popconfirm
        title="确认删除？"
        okText="删除"
        cancelText="取消"
        {...props}
      >
        <button>删除项目</button>
      </Popconfirm>,
    );

  it("uses caller-owned action labels without English defaults", () => {
    renderBasic();
    fireEvent.click(screen.getByRole("button", { name: "删除项目" }));

    expect(screen.getByRole("alertdialog")).toBeTruthy();
    expect(screen.getByRole("button", { name: "删除" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "取消" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Confirm" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  });

  it("does not overwrite child click behavior and respects preventDefault", () => {
    const childClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    });
    render(
      <Popconfirm title="确认？" okText="确认" cancelText="取消">
        <button onClick={childClick}>触发</button>
      </Popconfirm>,
    );

    fireEvent.click(screen.getByRole("button", { name: "触发" }));
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("lets the root click contract veto opening and forwards the trigger ref", () => {
    const ref = React.createRef<HTMLSpanElement>();
    const rootClick = vi.fn((event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
    });
    render(
      <Popconfirm
        ref={ref}
        data-testid="popconfirm-trigger"
        className="custom-trigger"
        title="确认？"
        okText="确认"
        cancelText="取消"
        onClick={rootClick}
      >
        <button>触发</button>
      </Popconfirm>,
    );

    fireEvent.click(screen.getByRole("button", { name: "触发" }));
    const root = screen.getByTestId("popconfirm-trigger");
    expect(rootClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(ref.current).toBe(root);
    expect(root.getAttribute("data-slot")).toBe("popconfirm-trigger");
    expect(root.className).toContain("custom-trigger");
  });

  it("blocks opening when disabled without mutating the child click contract", () => {
    const childClick = vi.fn();
    render(
      <Popconfirm
        title="确认？"
        okText="确认"
        cancelText="取消"
        disabled
      >
        <button onClick={childClick}>触发</button>
      </Popconfirm>,
    );

    fireEvent.click(screen.getByRole("button", { name: "触发" }));
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(
      screen.getByRole("button", { name: "触发" }).parentElement?.getAttribute(
        "aria-disabled",
      ),
    ).toBe("true");
  });

  it("closes on explicit cancel and reports the cancellation", async () => {
    const onCancel = vi.fn();
    renderBasic({ onCancel });
    fireEvent.click(screen.getByRole("button", { name: "删除项目" }));
    fireEvent.click(screen.getByRole("button", { name: "取消" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
  });

  it("locks cancel and Escape while async confirmation is pending", async () => {
    let resolveConfirm!: () => void;
    const pending = new Promise<void>((resolve) => {
      resolveConfirm = resolve;
    });
    const onConfirm = vi.fn(() => pending);
    renderBasic({ onConfirm });

    fireEvent.click(screen.getByRole("button", { name: "删除项目" }));
    fireEvent.click(screen.getByRole("button", { name: "删除" }));

    const dialog = screen.getByRole("alertdialog");
    expect(dialog.getAttribute("aria-busy")).toBe("true");
    expect(
      (screen.getByRole("button", { name: "取消" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("alertdialog")).toBeTruthy();

    await act(async () => {
      resolveConfirm();
      await pending;
    });
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("keeps the dialog open and releases busy state when confirmation rejects", async () => {
    renderBasic({
      onConfirm: () => Promise.reject(new Error("delete failed")),
    });
    fireEvent.click(screen.getByRole("button", { name: "删除项目" }));
    fireEvent.click(screen.getByRole("button", { name: "删除" }));

    await waitFor(() =>
      expect(screen.getByRole("alertdialog").getAttribute("aria-busy")).toBeNull(),
    );
    expect(screen.getByRole("alertdialog")).toBeTruthy();
    expect(
      (screen.getByRole("button", { name: "取消" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
  });

  it("keeps Preview/Code executable and marks the reviewed family complete", () => {
    const document = popconfirmReviewDocuments.popconfirm;
    expect(document.code).toContain("<Popconfirm");
    expect(document.code).toContain('okText="删除"');
    expect(document.code).toContain('cancelText="取消"');
    expect(componentProgress("core-popconfirm", 78)).toBe(100);
  });
});
