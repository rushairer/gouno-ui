import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { Select, Input } from "../src/core";

afterEach(cleanup);
const options = <><option value="a">Alpha</option><option value="b">Beta</option></>;

describe("Select independent actions and focus", () => {
  it.each(["{Enter}", " "])("clears once with keyboard %s, without opening, and restores trigger focus", async (key) => {
    const user = userEvent.setup(); const change = vi.fn(); const clear = vi.fn();
    render(<Select aria-label="State" allowClear defaultValue="a" onChange={change} onClear={clear}>{options}</Select>);
    const action = screen.getByRole("button", { name: "Clear selection" });
    expect(action.parentElement?.closest("button")).toBeNull();
    action.focus(); await user.keyboard(key);
    expect(change).toHaveBeenCalledExactlyOnceWith("", []);
    expect(clear).toHaveBeenCalledTimes(1);
    const trigger = screen.getByRole("combobox", { name: "State" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("requests controlled clearing but does not change the caller's value", async () => {
    const change = vi.fn(); const ref = createRef<HTMLSelectElement>();
    render(<Select ref={ref} aria-label="State" value="a" allowClear onChange={change}>{options}</Select>);
    await userEvent.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(ref.current?.value).toBe("a");
    expect(change).toHaveBeenCalledWith("", []);
  });

  it("removes a tag by keyboard and protects disabled actions", async () => {
    const { rerender } = render(<Select aria-label="Teams" mode="multiple" defaultValue={["a", "b"]}>{options}</Select>);
    const remove = screen.getByRole("button", { name: "Remove Alpha" });
    remove.focus(); await userEvent.keyboard("{Enter}");
    expect(screen.queryByRole("button", { name: "Remove Alpha" })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("combobox", { name: "Teams" }));
    rerender(<Select aria-label="Teams" mode="multiple" value={["a"]} disabled allowClear>{options}</Select>);
    expect(screen.getByRole("button", { name: "Remove Alpha" }).hasAttribute("disabled")).toBe(true);
    expect(screen.queryByRole("button", { name: "Clear selection" })).toBeNull();
  });

  it("generates unique stable associations and puts active-descendant on the focused search input", async () => {
    render(<><Select aria-label="First">{options}</Select><Select aria-label="Second" showSearch>{options}</Select></>);
    const first = screen.getByRole("combobox", { name: "First" });
    const second = screen.getByRole("combobox", { name: "Second" });
    expect(first.getAttribute("aria-controls")).not.toBe(second.getAttribute("aria-controls"));
    await userEvent.click(first);
    expect(document.getElementById(first.getAttribute("aria-activedescendant")!)?.textContent).toContain("Alpha");
    await userEvent.keyboard("{Escape}");
    await userEvent.click(second);
    const search = screen.getByRole("combobox", { name: "Search options" });
    expect(document.activeElement).toBe(search);
    expect(second.getAttribute("aria-activedescendant")).toBeNull();
    fireEvent.change(search, { target: { value: "Beta" } });
    const target = document.getElementById(search.getAttribute("aria-activedescendant")!);
    expect(target?.textContent).toContain("Beta");
    expect(target?.closest('[role="listbox"]')?.id).toBe(search.getAttribute("aria-controls"));
    await userEvent.keyboard("{Enter}");
    expect(second.textContent).toContain("Beta");
    expect(document.activeElement).toBe(second);
  });

  it("keeps Input suffix content when clearing and returns focus to the native input", async () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} allowClear suffix="characters" defaultValue="A very long title" aria-label="Title" />);
    await userEvent.click(screen.getByRole("button", { name: "Clear input" }));
    expect(ref.current?.value).toBe("");
    expect(screen.getByText("characters")).toBeTruthy();
    expect(document.activeElement).toBe(ref.current);
  });
});
