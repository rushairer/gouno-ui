import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  Upload,
} from "../src/core";
import { DataTable } from "../src/patterns";
import { componentProgress } from "../showcase/component-progress";
import { dataEntryDocuments } from "../showcase/demos/core/data-entry";
import { dataDisplayDocuments } from "../showcase/demos/core/data-display";
import { feedbackDocuments } from "../showcase/demos/core/feedback";
import { paginationDocument } from "../showcase/demos/core/pagination";

describe("audited target components", () => {
  it("supports clearable input and textarea count", () => {
    const onClear = vi.fn();
    render(
      <>
        <Input aria-label="Name" value="Gouno" allowClear onClear={onClear} />
        <Textarea
          aria-label="Description"
          defaultValue="abc"
          showCount
          maxLength={5}
        />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear input" }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.getByText("3 / 5")).toBeTruthy();
  });

  it("supports InputNumber keyboard stepping and precision", () => {
    const onChange = vi.fn();
    render(
      <InputNumber
        aria-label="Amount"
        defaultValue={1}
        step={0.25}
        precision={2}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("spinbutton");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith(1.25);
    expect((input as HTMLInputElement).value).toBe("1.25");
  });

  it("supports select loading and date clearing", () => {
    render(
      <>
        <Select aria-label="Status" loading>
          <option value="ready">Ready</option>
        </Select>
        <DatePicker aria-label="Date" defaultValue="2026-09-06" />
      </>,
    );
    expect((screen.getByRole("combobox") as HTMLSelectElement).disabled).toBe(
      true,
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear date" }));
    expect((screen.getByLabelText("Date") as HTMLInputElement).value).toBe("");
  });

  it("submits FormData and parsed values, and reports invalid forms", () => {
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();
    render(
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Input name="title" required defaultValue="Gouno" />
        <button type="submit">Submit</button>
      </Form>,
    );
    fireEvent.submit(document.querySelector("form")!);
    expect(onFinish.mock.calls[0][0]).toBeInstanceOf(FormData);
    expect(onFinish.mock.calls[0][1]).toEqual({ title: "Gouno" });
    fireEvent.change(document.querySelector('input[name="title"]')!, {
      target: { value: "" },
    });
    fireEvent.submit(document.querySelector("form")!);
    expect(onFinishFailed).toHaveBeenCalledOnce();
  });

  it("keeps modal and drawer uncontrolled APIs usable", () => {
    render(
      <>
        <Modal defaultOpen title="Modal" onClose={() => undefined}>
          Body
        </Modal>
        <Drawer defaultOpen title="Drawer" onClose={() => undefined}>
          Body
        </Drawer>
      </>,
    );
    expect(screen.getByText("Modal")).toBeTruthy();
    expect(screen.getByText("Drawer")).toBeTruthy();
  });

  it("applies drawer dimensions", () => {
    render(
      <>
        <Drawer defaultOpen title="Drawer" placement="right" width={480}>
          Body
        </Drawer>
        <Form>
          <Input name="title" />
          <button type="submit">Submit</button>
        </Form>
      </>,
    );
    const drawer = screen.getByRole("dialog", { name: "Drawer" });
    expect((drawer as HTMLElement).style.width).toBe("480px");
  });

  it("uses a bounded Ant-style default drawer size", () => {
    render(
      <Drawer defaultOpen title="Default drawer">
        Body
      </Drawer>,
    );
    const drawer = screen.getByRole("dialog", { name: "Default drawer" });
    expect((drawer as HTMLElement).style.width).toBe("378px");
  });

  it("supports table options and expandable DataTable rows", () => {
    render(
      <>
        <Table bordered fixed stickyHeader>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Gouno</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <DataTable
          rowKey="id"
          dataSource={[{ id: "a", name: "Alpha" }]}
          columns={[{ key: "name", title: "Name", dataIndex: "name" }]}
          expandedRowRender={(row) => <span>{row.name} details</span>}
        />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "展开行" }));
    expect(screen.getByText("Alpha details")).toBeTruthy();
    expect(document.querySelector('[data-sticky-header="true"]')).toBeTruthy();
  });

  it("supports controlled and boundary pagination", () => {
    const onChange = vi.fn();
    render(
      <Pagination page={1} total={25} pageSize={10} onChange={onChange} />,
    );
    expect(
      (screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onChange).toHaveBeenCalledWith(2, 10);
  });

  it("reports 100% only for the completed and reviewed batch", () => {
    for (const id of [
      "core-input",
      "core-textarea",
      "core-input-number",
      "core-select",
      "core-form",
      "core-date-picker",
      "core-upload",
      "core-table",
      "core-data-table",
      "core-pagination",
      "core-modal",
      "core-drawer",
    ]) {
      expect(componentProgress(id, 0)).toBe(100);
    }
    expect(componentProgress("core-button", 0)).toBeLessThan(100);
  });

  it("keeps audited API rows atomic and demo source readable", () => {
    const documents = [
      dataEntryDocuments.input,
      dataEntryDocuments.textarea,
      dataEntryDocuments.select,
      dataEntryDocuments.form,
      dataEntryDocuments["input-number"],
      dataEntryDocuments["date-picker"],
      dataEntryDocuments.upload,
      dataDisplayDocuments.table,
      dataDisplayDocuments["data-table"],
      feedbackDocuments.modal,
      feedbackDocuments.drawer,
      paginationDocument,
    ];
    for (const document of documents) {
      for (const row of document.api ?? [])
        expect(row.name).not.toMatch(/\s\/\s/);
      const examples = [document, ...(document.demos ?? [])];
      expect(new Set(examples.map((demo) => demo.code)).size).toBe(
        examples.length,
      );
      for (const demo of examples) {
        expect(demo.code).not.toContain("...");
        expect(demo.code.split("\n").length).toBeGreaterThan(1);
        expect(demo.code).not.toMatch(/\.\.\/.*src/);
        expect(
          Math.max(...demo.code.split("\n").map((line) => line.length)),
        ).toBeLessThan(200);
      }
    }
  });
});
