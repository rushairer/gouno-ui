import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AutoComplete, Collapse, Rate, Segmented, Slider } from "../src/core";

describe("Core data entry controls", () => {
  it("changes segmented selection", () => { render(<Segmented options={["Day", "Week"]} defaultValue="Day" />); fireEvent.click(screen.getByRole("radio", { name: "Week" })); expect(screen.getByRole("radio", { name: "Week" }).getAttribute("aria-checked")).toBe("true"); });
  it("supports rating selection", () => { render(<Rate defaultValue={2} />); fireEvent.click(screen.getByRole("radio", { name: "4 stars" })); expect(screen.getByRole("radio", { name: "4 stars" }).getAttribute("aria-checked")).toBe("true"); });
  it("filters autocomplete options", () => { render(<AutoComplete aria-label="City" options={["Beijing", "Shanghai"]} />); const input = screen.getByRole("combobox"); fireEvent.focus(input); fireEvent.change(input, { target: { value: "Bei" } }); expect(screen.getByRole("option", { name: "Beijing" })).toBeTruthy(); });
  it("expands collapse content and exposes slider semantics", () => { render(<><Collapse items={[{ key: "a", label: "Details", children: "Content" }]} /><Slider aria-label="Volume" defaultValue={25} /></>); fireEvent.click(screen.getByRole("button", { name: /Details/ })); expect(screen.getByText("Content")).toBeTruthy(); expect(screen.getByRole("slider", { name: "Volume" })).toBeTruthy(); });
});
