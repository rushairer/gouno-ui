import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AutoComplete, Collapse, Form, Input, Rate, Segmented, Select, Slider, TreeSelect, Upload } from "../src/core";

describe("Core data entry controls", () => {
  it("changes segmented selection", () => { render(<Segmented options={["Day", "Week"]} defaultValue="Day" />); fireEvent.click(screen.getByRole("radio", { name: "Week" })); expect(screen.getByRole("radio", { name: "Week" }).getAttribute("aria-checked")).toBe("true"); });
  it("supports rating selection", () => { render(<Rate defaultValue={2} />); fireEvent.click(screen.getByRole("radio", { name: "4 stars" })); expect(screen.getByRole("radio", { name: "4 stars" }).getAttribute("aria-checked")).toBe("true"); });
  it("filters autocomplete options", () => { render(<AutoComplete aria-label="City" options={["Beijing", "Shanghai"]} />); const input = screen.getByRole("combobox"); fireEvent.focus(input); fireEvent.change(input, { target: { value: "Bei" } }); expect(screen.getByRole("option", { name: "Beijing" })).toBeTruthy(); });
  it("supports autocomplete arrow navigation and Enter selection", () => { const onChange = vi.fn(); render(<AutoComplete aria-label="City" options={["Beijing", "Berlin"]} onChange={onChange} />); const input = screen.getAllByRole("combobox").at(-1)!; fireEvent.focus(input); fireEvent.keyDown(input, { key: "ArrowDown" }); fireEvent.keyDown(input, { key: "Enter" }); expect(onChange).toHaveBeenLastCalledWith("Berlin"); });
  it("supports controlled tree selection and disabled nodes", () => { const onChange = vi.fn(); render(<TreeSelect aria-label="Section" treeData={[{ value: "docs", title: "Docs", children: [{ value: "api", title: "API", disabled: true }] }]} value="docs" onChange={onChange} />); const select = screen.getByRole("combobox", { name: "Section" }); expect((select as HTMLSelectElement).value).toBe("docs"); expect(screen.getByRole("option", { name: /API/ }).hasAttribute("disabled")).toBe(true); fireEvent.change(select, { target: { value: "docs" } }); expect(onChange).toHaveBeenLastCalledWith("docs"); });
  it("supports Select clear behavior for uncontrolled and controlled values", () => {
    const onClear = vi.fn();
    render(<Select aria-label="Status" allowClear defaultValue="ready" onClear={onClear}><option value="">Choose</option><option value="ready">Ready</option></Select>);
    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
    expect((document.querySelector('select[aria-label="Status"]') as HTMLSelectElement).value).toBe("");
    expect(onClear).toHaveBeenCalledTimes(1);
  });
  it("renders searchable multi-select options as removable tags", () => {
    const onChange = vi.fn();
    render(<Select aria-label="Topics" mode="multiple" showSearch defaultValue={["ui"]} onChange={onChange}><option value="ui">UI</option><option value="api">API</option></Select>);
    fireEvent.click(screen.getByRole("combobox", { name: "Topics" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Search options" }), { target: { value: "API" } });
    fireEvent.click(screen.getByRole("option", { name: "API" }));
    expect(screen.getByRole("button", { name: "Remove API" })).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith(["ui", "api"], expect.any(Array));
  });
  it("supports Select option keyboard navigation and selection", () => {
    const onChange = vi.fn();
    render(<Select aria-label="Team" showSearch onChange={onChange}><option value="design">Design</option><option value="engineering">Engineering</option></Select>);
    const trigger = screen.getByRole("combobox", { name: "Team" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Search options" }), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Search options" }), { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith("engineering", { value: "engineering", label: "Engineering" });
  });
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
  it("serializes Form values onFinish and supports disabled loading state", () => {
    const onFinish = vi.fn();
    const { rerender } = render(<Form onFinish={onFinish}><Input name="title" defaultValue="Gouno" /><button type="submit">Submit</button></Form>);
    fireEvent.submit(document.querySelector("form")!);
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish.mock.calls[0][0].get("title")).toBe("Gouno");
    rerender(<Form disabled loading onFinish={onFinish}><Input name="title" defaultValue="Gouno" /><button type="submit">Submit</button></Form>);
    expect(document.querySelector("fieldset")?.hasAttribute("disabled")).toBe(true);
    expect(document.querySelector("form")?.getAttribute("aria-busy")).toBe("true");
  });
});
