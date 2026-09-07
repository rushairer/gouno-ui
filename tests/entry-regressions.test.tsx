import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import {
  DatePicker,
  Input,
  Select,
  Textarea,
  Form,
  Upload,
  InputNumber,
} from "../src/core";

afterEach(cleanup);
describe("entry state regressions", () => {
  it("notifies controlled onChange on clear and keeps focus and suffix", () => {
    const cleared = vi.fn();
    function Example() {
      const [value, setValue] = useState("Gouno");
      return (
        <Input
          aria-label="name"
          value={value}
          suffix=".com"
          allowClear
          onClear={cleared}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    }
    render(<Example />);
    expect(screen.getByText(".com")).toBeTruthy();
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.click(screen.getByRole("button", { name: "Clear input" }));
    expect(input.value).toBe("");
    expect(document.activeElement).toBe(input);
    expect(cleared).toHaveBeenCalledOnce();
    fireEvent.change(input, { target: { value: "new" } });
    expect(screen.getByRole("textbox")).toBe(input);
  });
  it("updates count when an external controlled value changes", () => {
    const { rerender } = render(<Textarea value="a" readOnly showCount />);
    expect(screen.getByText("1")).toBeTruthy();
    rerender(<Textarea value="abcdef" readOnly showCount />);
    expect(screen.getByText("6")).toBeTruthy();
  });
  it("reports invalid submission and focuses the failing field", () => {
    const failed = vi.fn();
    const finished = vi.fn();
    render(
      <Form onFinish={finished} onFinishFailed={failed}>
        <Input name="email" required type="email" aria-label="Email" />
        <button>Save</button>
      </Form>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(failed).toHaveBeenCalledOnce();
    expect(finished).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });
  it("respects noValidate and prevents disabled submissions", () => {
    const finished = vi.fn();
    const { rerender } = render(
      <Form noValidate onFinish={finished}>
        <Input name="name" required />
        <button>Save</button>
      </Form>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(finished).toHaveBeenCalledOnce();
    rerender(
      <Form disabled onFinish={finished}>
        <Input name="name" />
        <button>Save</button>
      </Form>,
    );
    fireEvent.submit(document.querySelector("form")!);
    expect(finished).toHaveBeenCalledOnce();
  });
});

it("prevents selecting, dropping and removing files in a read-only Upload", () => {
  const file = new File(["hello"], "hello.txt", { type: "text/plain" });
  const changed = vi.fn();
  const removed = vi.fn();
  render(
    <Upload
      readOnly
      drag
      defaultFiles={[file]}
      onFiles={changed}
      onRemove={removed}
    />,
  );
  fireEvent.change(document.querySelector('input[type="file"]')!, {
    target: { files: [file] },
  });
  fireEvent.drop(screen.getByText("点击或拖放文件到这里"), {
    dataTransfer: { files: [file] },
  });
  fireEvent.click(screen.getByRole("button", { name: "移除 hello.txt" }));
  expect(changed).not.toHaveBeenCalled();
  expect(removed).not.toHaveBeenCalled();
  expect(screen.getByText("hello.txt")).toBeTruthy();
});

it("keeps decimal and negative drafts editable and formats on blur", () => {
  const changed = vi.fn();
  render(<InputNumber defaultValue={1} onChange={changed} precision={2} />);
  const input = screen.getByRole("spinbutton") as HTMLInputElement;
  fireEvent.change(input, { target: { value: "-" } });
  expect(input.value).toBe("-");
  fireEvent.change(input, { target: { value: "-1." } });
  expect(input.value).toBe("-1.");
  fireEvent.change(input, { target: { value: "-1.25" } });
  expect(changed).toHaveBeenLastCalledWith(-1.25);
  fireEvent.blur(input);
  expect(input.value).toBe("-1.25");
});
it("clamps invalid precision without throwing and rejects nonfinite values", () => {
  const { rerender } = render(
    <InputNumber defaultValue={1.2} precision={-5} />,
  );
  expect((screen.getByRole("spinbutton") as HTMLInputElement).value).toBe("1");
  rerender(<InputNumber precision={Infinity} />);
  fireEvent.change(screen.getByRole("spinbutton"), {
    target: { value: "1e999" },
  });
  fireEvent.blur(screen.getByRole("spinbutton"));
  expect((screen.getByRole("spinbutton") as HTMLInputElement).value).not.toBe(
    "Infinity",
  );
});

it("supports controlled Select and DatePicker clearing", () => {
  const selectChange = vi.fn();
  const dateChange = vi.fn();
  const { rerender } = render(
    <>
      <Select aria-label="Status" value="ready" onChange={selectChange}>
        <option value="ready">Ready</option>
        <option value="done">Done</option>
      </Select>
      <DatePicker
        aria-label="Date"
        value="2026-09-06"
        allowClear
        onChange={dateChange}
      />
    </>,
  );
  fireEvent.click(screen.getByRole("combobox", { name: "Status" }));
  fireEvent.click(screen.getByRole("option", { name: "Done" }));
  expect(selectChange).toHaveBeenLastCalledWith("done", { value: "done", label: "Done" });
  fireEvent.click(screen.getByRole("button", { name: "Clear date" }));
  expect(dateChange).toHaveBeenLastCalledWith("", null);
  rerender(
    <Select aria-label="Status" loading>
      <option value="ready">Ready</option>
    </Select>,
  );
  expect(
    (screen.getByRole("combobox", { name: "Status" }) as HTMLButtonElement)
      .disabled,
  ).toBe(true);
});
