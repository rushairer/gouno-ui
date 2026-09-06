import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Badge, CheckableTag, Tag } from "../src/core";

afterEach(cleanup);

describe("Core Badge", () => {
  it("caps numeric counts and keeps custom content", () => {
    render(<><Badge count={100} /><Badge count={1000} overflowCount={999} /><Badge count="New" /></>);
    expect(screen.getByRole("status", { name: "99+" }).textContent).toBe("99+");
    expect(screen.getByRole("status", { name: "999+" }).textContent).toBe("999+");
    expect(screen.getByRole("status", { name: "New" }).textContent).toBe("New");
  });

  it("hides zero by default and shows it when requested", () => {
    const { rerender } = render(<Badge count={0} />);
    expect(screen.queryByRole("status")).toBeNull();
    rerender(<Badge count={0} showZero />);
    expect(screen.getByRole("status", { name: "0" })).toBeTruthy();
  });

  it("renders dots, semantic status text and custom colors", () => {
    const { container } = render(<><Badge dot title="Unread" /><Badge status="processing" text="Processing" /><Badge color="#7c3aed" text="Custom" /></>);
    expect(screen.getByRole("status", { name: "Unread" })).toBeTruthy();
    expect(screen.getByText("Processing").previousElementSibling?.className).toContain("animate-pulse");
    expect((screen.getByText("Custom").previousElementSibling as HTMLElement).style.backgroundColor).toBe("rgb(124, 58, 237)");
    expect(container.querySelectorAll("[aria-hidden='true']")).toHaveLength(2);
  });
});

describe("Core Tag", () => {
  it("renders tones, custom colors, icons and borderless styling", () => {
    const { container } = render(<><Tag tone="success">Stable</Tag><Tag color="#1677ff">Blue</Tag><Tag icon={<span data-testid="icon" />} bordered={false}>Icon</Tag></>);
    expect(screen.getByText("Stable").parentElement?.className).toContain("bg-success-subtle");
    expect((screen.getByText("Blue").parentElement as HTMLElement).style.backgroundColor).toBe("rgb(22, 119, 255)");
    expect(screen.getByTestId("icon")).toBeTruthy();
    expect(screen.getByText("Icon").parentElement?.className.split(" ")).not.toContain("border");
    expect(container.querySelectorAll("span").length).toBeGreaterThan(3);
  });

  it("fires close actions and blocks them while disabled", () => {
    const onClose = vi.fn();
    const onDisabledClose = vi.fn();
    render(<><Tag closable onClose={onClose}>Release</Tag><Tag closable disabled onClose={onDisabledClose}>Disabled</Tag></>);
    fireEvent.click(screen.getByRole("button", { name: "关闭 Release" }));
    fireEvent.click(screen.getByRole("button", { name: "关闭 Disabled" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onDisabledClose).not.toHaveBeenCalled();
  });

  it("supports uncontrolled and controlled checkable tags", () => {
    const onChange = vi.fn();
    const { rerender } = render(<CheckableTag defaultChecked onChange={onChange}>TypeScript</CheckableTag>);
    const tag = screen.getByRole("checkbox", { name: "TypeScript" });
    expect(tag.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(tag);
    expect(tag.getAttribute("aria-checked")).toBe("false");
    expect(onChange).toHaveBeenLastCalledWith(false);

    rerender(<CheckableTag checked={false} onChange={onChange}>TypeScript</CheckableTag>);
    fireEvent.click(screen.getByRole("checkbox", { name: "TypeScript" }));
    expect(screen.getByRole("checkbox", { name: "TypeScript" }).getAttribute("aria-checked")).toBe("false");
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it("prevents changes while disabled", () => {
    const onChange = vi.fn();
    render(<CheckableTag disabled defaultChecked onChange={onChange}>Disabled</CheckableTag>);
    const tag = screen.getByRole("checkbox", { name: "Disabled" }) as HTMLButtonElement;
    expect(tag.disabled).toBe(true);
    fireEvent.click(tag);
    expect(onChange).not.toHaveBeenCalled();
    expect(tag.getAttribute("aria-checked")).toBe("true");
  });
});
