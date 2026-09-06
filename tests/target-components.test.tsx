import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DatePicker, Drawer, Form, Input, InputNumber, Modal, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea, Upload } from "../src/core";
import { DataTable } from "../src/patterns";
import { componentProgress } from "../showcase/component-progress";

describe("audited target components", () => {
  it("supports clearable input and textarea count", () => {
    const onClear = vi.fn();
    render(<><Input aria-label="Name" value="Gouno" allowClear onClear={onClear} /><Textarea aria-label="Description" defaultValue="abc" showCount maxLength={5} /></>);
    fireEvent.click(screen.getByRole("button", { name: "Clear input" }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.getByText("3 / 5")).toBeTruthy();
  });

  it("supports InputNumber keyboard stepping and precision", () => {
    const onChange = vi.fn();
    render(<InputNumber aria-label="Amount" defaultValue={1} step={0.25} precision={2} onChange={onChange} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith(1.25);
    expect((input as HTMLInputElement).value).toBe("1.25");
  });

  it("supports select loading and date clearing", () => {
    render(<><Select aria-label="Status" loading><option value="ready">Ready</option></Select><DatePicker aria-label="Date" defaultValue="2026-09-06" /></>);
    expect((screen.getByRole("combobox") as HTMLSelectElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Clear date" }));
    expect((screen.getByLabelText("Date") as HTMLInputElement).value).toBe("");
  });

  it("submits FormData and parsed values, and reports invalid forms", () => {
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();
    render(<Form onFinish={onFinish} onFinishFailed={onFinishFailed}><Input name="title" required defaultValue="Gouno" /><button type="submit">Submit</button></Form>);
    fireEvent.submit(document.querySelector("form")!);
    expect(onFinish.mock.calls[0][0]).toBeInstanceOf(FormData);
    expect(onFinish.mock.calls[0][1]).toEqual({ title: "Gouno" });
    fireEvent.change(document.querySelector('input[name="title"]')!, { target: { value: "" } });
    fireEvent.submit(document.querySelector("form")!);
    expect(onFinishFailed).toHaveBeenCalledOnce();
  });

  it("keeps modal and drawer uncontrolled APIs usable", () => {
    render(<><Modal defaultOpen title="Modal" onClose={() => undefined}>Body</Modal><Drawer defaultOpen title="Drawer" onClose={() => undefined}>Body</Drawer></>);
    expect(screen.getByText("Modal")).toBeTruthy();
    expect(screen.getByText("Drawer")).toBeTruthy();
  });

  it("supports table options and expandable DataTable rows", () => {
    render(<><Table bordered fixed stickyHeader><TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Gouno</TableCell></TableRow></TableBody></Table><DataTable rowKey="id" dataSource={[{ id: "a", name: "Alpha" }]} columns={[{ key: "name", title: "Name", dataIndex: "name" }]} expandedRowRender={(row) => <span>{row.name} details</span>} /></>);
    fireEvent.click(screen.getByRole("button", { name: "展开行" }));
    expect(screen.getByText("Alpha details")).toBeTruthy();
    expect(document.querySelector('[data-sticky-header="true"]')).toBeTruthy();
  });

  it("exposes complete audit progress for the target batch", () => {
    for (const id of ["core-input", "core-textarea", "core-input-number", "core-select", "core-form", "core-date-picker", "core-upload", "core-table", "core-data-table", "core-modal", "core-drawer"]) expect(componentProgress(id, 0)).toBe(100);
  });
});
