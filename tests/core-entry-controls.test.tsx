import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AutoComplete, Collapse, Rate, Segmented, Slider, Upload } from "../src/core";

describe("Core data entry controls", () => {
  it("changes segmented selection", () => { render(<Segmented options={["Day", "Week"]} defaultValue="Day" />); fireEvent.click(screen.getByRole("radio", { name: "Week" })); expect(screen.getByRole("radio", { name: "Week" }).getAttribute("aria-checked")).toBe("true"); });
  it("supports rating selection", () => { render(<Rate defaultValue={2} />); fireEvent.click(screen.getByRole("radio", { name: "4 stars" })); expect(screen.getByRole("radio", { name: "4 stars" }).getAttribute("aria-checked")).toBe("true"); });
  it("filters autocomplete options", () => { render(<AutoComplete aria-label="City" options={["Beijing", "Shanghai"]} />); const input = screen.getByRole("combobox"); fireEvent.focus(input); fireEvent.change(input, { target: { value: "Bei" } }); expect(screen.getByRole("option", { name: "Beijing" })).toBeTruthy(); });
  it("expands collapse content and exposes slider semantics", () => { render(<><Collapse items={[{ key: "a", label: "Details", children: "Content" }]} /><Slider aria-label="Volume" defaultValue={25} /></>); fireEvent.click(screen.getByRole("button", { name: /Details/ })); expect(screen.getByText("Content")).toBeTruthy(); expect(screen.getByRole("slider", { name: "Volume" })).toBeTruthy(); });
  it("maintains an upload list, enforces limits, and removes files", () => {
    const onFiles = vi.fn();
    render(<Upload aria-label="Files" multiple maxCount={1} maxSize={4} onFiles={onFiles}>Choose</Upload>);
    const small = new File(["ok"], "small.txt", { type: "text/plain" });
    const large = new File(["too large"], "large.txt", { type: "text/plain" });
    fireEvent.change(screen.getByLabelText("Files"), { target: { files: [small, large] } });
    expect(screen.getByText("small.txt")).toBeTruthy();
    expect(screen.queryByText("large.txt")).toBeNull();
    expect(onFiles).toHaveBeenLastCalledWith([small]);
    fireEvent.click(screen.getByRole("button", { name: "移除 small.txt" }));
    expect(onFiles).toHaveBeenLastCalledWith([]);
  });
});
