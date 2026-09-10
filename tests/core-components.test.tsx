import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  Breadcrumb,
  Calendar,
  Carousel,
  InputNumber,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Steps,
  Card,
  CardHeader,
  Progress,
} from "../src/core";

describe("core components", () => {
  it("supports controlled InputNumber changes", () => {
    const onChange = (value: number | null) => {
      void value;
    };
    render(
      <InputNumber
        defaultValue={2}
        onChange={onChange}
        aria-label="quantity"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect((screen.getByRole("spinbutton") as HTMLInputElement).value).toBe(
      "3",
    );
  });
  it("supports compositional table headers and semantic spans", () => {
    render(
      <Table bordered>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" colSpan={2}>
              Metrics
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead scope="row">Views</TableHead>
            <TableCell>42</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(
      screen
        .getByRole("columnheader", { name: "Metrics" })
        .getAttribute("colspan"),
    ).toBe("2");
    expect(screen.getByRole("rowheader", { name: "Views" })).toBeTruthy();
  });
  it("exposes breadcrumb semantics", () => {
    render(
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Current" }]}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    expect(screen.getByText("Current").getAttribute("aria-current")).toBe(
      "page",
    );
  });
  it("paginates with disabled boundaries", () => {
    const onChange = (page: number) => {
      void page;
    };
    render(
      <Pagination page={1} total={25} pageSize={10} onChange={onChange} />,
    );
    expect(
      (screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(screen.getByText("1 / 3")).toBeTruthy();
  });
  it("renders steps and calendar grid", () => {
    render(
      <>
        <Steps current={1} items={[{ title: "One" }, { title: "Two" }]} />
        <Calendar value={new Date(2026, 0, 15)} />
      </>,
    );
    expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
    expect(screen.getByRole("grid")).toBeTruthy();
  });
  it("preserves zero and empty string card header slots", () => {
    render(<Card><CardHeader title={0} description="" /></Card>);
    expect(screen.getByText("0")).toBeTruthy();
    expect(document.querySelector('[data-slot="card-description"]')).toBeTruthy();
  });
  it("normalizes invalid progress bounds without invalid ARIA values", () => {
    render(<Progress value={Number.NaN} max={0} data-testid="progress" />);
    const progress = screen.getByTestId("progress");
    expect(progress.getAttribute("aria-valuenow")).toBe("0");
    expect(progress.getAttribute("aria-valuemax")).toBe("100");
    expect(progress.querySelector('[data-slot="progress-indicator"]')?.getAttribute("style")).toContain("width: 0%");
  });
});

describe("core composite controls", () => {
  it("supports carousel button navigation with canonical tab state", () => {
    render(
      <Carousel arrows items={[<span key="a">A</span>, <span key="b">B</span>]} />,
    );
    const dots = screen.getAllByRole("tab");
    expect(dots[0].getAttribute("aria-selected")).toBe("true");
    expect(dots[1].getAttribute("aria-selected")).toBe("false");

    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));

    expect(dots[0].getAttribute("aria-selected")).toBe("false");
    expect(dots[1].getAttribute("aria-selected")).toBe("true");
  });
});