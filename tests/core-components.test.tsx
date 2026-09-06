import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Breadcrumb, Calendar, InputNumber, Pagination, Steps } from "../src/core";

describe("core components", () => {
  it("supports controlled InputNumber changes", () => { const onChange = (value: number|null) => { void value; }; render(<InputNumber defaultValue={2} onChange={onChange} aria-label="quantity" />); fireEvent.click(screen.getByRole("button", { name: "Increase" })); expect((screen.getByRole("spinbutton") as HTMLInputElement).value).toBe("3"); });
  it("exposes breadcrumb semantics", () => { render(<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Current" }]} />); expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy(); expect(screen.getByText("Current").getAttribute("aria-current")).toBe("page"); });
  it("paginates with disabled boundaries", () => { const onChange = (page: number) => { void page; }; render(<Pagination page={1} total={25} pageSize={10} onChange={onChange} />); expect((screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement).disabled).toBe(true); expect(screen.getByText("1 / 3")).toBeTruthy(); });
  it("renders steps and calendar grid", () => { render(<><Steps current={1} items={[{ title: "One" }, { title: "Two" }]} /><Calendar value={new Date(2026, 0, 15)} /></>); expect(screen.getAllByRole("list").length).toBeGreaterThan(0); expect(screen.getByRole("grid")).toBeTruthy(); });
});
