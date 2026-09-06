import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Modal, Drawer, Input } from "../src/core";

afterEach(cleanup);
describe("overlay retention and actions", () => {
  for (const Component of [Modal, Drawer]) {
    it(`${Component.name} preserves or destroys input state according to policy`, async () => {
      const { rerender } = render(
        <Component open title="Editor" destroyOnClose={false}>
          <Input defaultValue="initial" aria-label="Draft" />
        </Component>,
      );
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "edited" },
      });
      rerender(
        <Component open={false} title="Editor" destroyOnClose={false}>
          <Input defaultValue="initial" aria-label="Draft" />
        </Component>,
      );
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
      rerender(
        <Component open title="Editor" destroyOnClose={false}>
          <Input defaultValue="initial" aria-label="Draft" />
        </Component>,
      );
      expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe(
        "edited",
      );
      rerender(
        <Component open={false} title="Editor" destroyOnClose>
          <Input defaultValue="initial" aria-label="Draft" />
        </Component>,
      );
      rerender(
        <Component open title="Editor" destroyOnClose>
          <Input defaultValue="initial" aria-label="Draft" />
        </Component>,
      );
      expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe(
        "initial",
      );
    });
  }
  it("provides action events, busy states, mask policy and z-index", () => {
    const ok = vi.fn();
    const cancel = vi.fn();
    const { rerender } = render(
      <Modal
        open
        title="Actions"
        onOk={ok}
        onCancel={cancel}
        zIndex={1200}
        mask={false}
      >
        Body
      </Modal>,
    );
    expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeNull();
    expect((screen.getByRole("dialog") as HTMLElement).style.zIndex).toBe(
      "1200",
    );
    fireEvent.click(screen.getByRole("button", { name: "确定" }));
    expect(ok).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "取消" }));
    expect(cancel).toHaveBeenCalledOnce();
    rerender(
      <Modal open title="Actions" onOk={ok} confirmLoading>
        Body
      </Modal>,
    );
    expect(
      (screen.getByRole("button", { name: "确定" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });
});

for (const Component of [Modal, Drawer]) {
  it(`${Component.name} only notifies lifecycle when visibility changes`, () => {
    const notify = vi.fn();
    const { rerender } = render(
      <Component
        open
        title="Lifecycle"
        afterOpenChange={(next) => notify(next)}
      >
        Body
      </Component>,
    );
    expect(notify).toHaveBeenCalledTimes(1);
    rerender(
      <Component
        open
        title="Updated title"
        afterOpenChange={(next) => notify(next)}
      >
        Updated body
      </Component>,
    );
    expect(notify).toHaveBeenCalledTimes(1);
    rerender(
      <Component
        open={false}
        title="Lifecycle"
        afterOpenChange={(next) => notify(next)}
      >
        Body
      </Component>,
    );
    expect(notify).toHaveBeenLastCalledWith(false);
    expect(notify).toHaveBeenCalledTimes(2);
  });
}
