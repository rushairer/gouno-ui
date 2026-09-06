import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { Pagination } from "../src/core/pagination";

afterEach(cleanup);
describe("Pagination", () => {
  it("navigates numbers and five-page jumps without generating thousands of buttons", () => {
    render(<Pagination total={1000000} defaultPage={50} />);
    expect(screen.getAllByRole("button").length).toBeLessThan(15);
    expect(screen.getByRole("button", { name: "Page 50" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(screen.getByRole("button", { name: "Jump forward" }));
    expect(screen.getByRole("button", { name: "Page 55" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(screen.getByRole("button", { name: "Page 56" }));
    expect(screen.getByRole("button", { name: "Page 56" }).getAttribute("aria-current")).toBe("page");
  });
  it("updates uncontrolled size, clamps page and reports callbacks and ranges", () => {
    const changed = vi.fn(); const sized = vi.fn();
    render(<Pagination total={86} defaultPage={9} showSizeChanger onChange={changed} onShowSizeChange={sized} showTotal={(total, range) => `${range.join('-')} of ${total}`} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "50" } });
    expect(changed).toHaveBeenLastCalledWith(2, 50);
    expect(sized).toHaveBeenLastCalledWith(2, 50);
    expect(screen.getByText("51-86 of 86")).toBeTruthy();
  });
  it("does not mutate controlled page or size", () => {
    const changed = vi.fn();
    render(<Pagination page={2} pageSize={10} total={90} onChange={changed} showSizeChanger />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(changed).toHaveBeenLastCalledWith(3, 10);
    expect(screen.getByRole("button", { name: "Page 2" }).getAttribute("aria-current")).toBe("page");
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "20" } });
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("10");
  });
  it("clamps quick jumps and does not submit an enclosing form", () => {
    const submit = vi.fn(); const changed = vi.fn();
    render(<form onSubmit={submit}><Pagination total={86} showQuickJumper onChange={changed} /></form>);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "999" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(changed).toHaveBeenLastCalledWith(9, 10);
    expect(submit).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: "-8" } });
    fireEvent.blur(input);
    expect(changed).toHaveBeenLastCalledWith(1, 10);
  });
  it("disables every control and supports hiding empty/single pages", () => {
    const changed = vi.fn();
    const { rerender } = render(<Pagination total={100} disabled showQuickJumper showSizeChanger onChange={changed} />);
    for (const control of screen.getAllByRole("button")) expect((control as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("combobox") as HTMLSelectElement).disabled).toBe(true);
    expect((screen.getByRole("spinbutton") as HTMLInputElement).disabled).toBe(true);
    expect(changed).not.toHaveBeenCalled();
    rerender(<Pagination total={0} hideOnSinglePage />);
    expect(screen.queryByRole("navigation")).toBeNull();
  });
  it("handles invalid inputs, simple layout and custom labels accessibly", () => {
    render(<Pagination total={-1} pageSize={0} page={Infinity} simple itemRender={(_page, type, original) => type === "prev" ? "上一页" : original} showTotal={(total, range) => `${range.join('-')} of ${total}`} />);
    expect(screen.getByText("1 / 1")).toBeTruthy();
    expect(screen.getByText("0-0 of 0")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Previous" }).textContent).toContain("上一页");
  });
});
