import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Transfer } from "../src/core";
import { componentProgress } from "../showcase/component-progress";
import { transferReviewDocuments } from "../showcase/demos/core/data-entry-review-6d5";

afterEach(cleanup);

const dataSource = [
  { key: "a", title: "Alpha" },
  { key: "b", title: "Beta" },
  { key: "locked", title: "Locked", disabled: true },
];

const labels = {
  titles: ["Available", "Assigned"] as const,
  operations: ["Add", "Remove"] as const,
};

describe("Transfer 6D5", () => {
  it("uses caller-owned list and operation labels with grouped list semantics", () => {
    render(<Transfer dataSource={dataSource} {...labels} />);

    expect(screen.getByRole("group", { name: "Available" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Assigned" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Remove" })).toBeTruthy();
    expect(screen.queryByText("Source")).toBeNull();
    expect(screen.queryByText("Target")).toBeNull();
  });

  it("moves selected source entries and reports the next target keys", () => {
    const onChange = vi.fn();
    render(<Transfer dataSource={dataSource} onChange={onChange} {...labels} />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Alpha" }));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(onChange).toHaveBeenLastCalledWith(["a"]);
    expect(screen.getByRole("group", { name: "Assigned" }).textContent).toContain("Alpha");
  });

  it("keeps controlled targetKeys caller-owned", () => {
    const onChange = vi.fn();
    render(
      <Transfer
        dataSource={dataSource}
        targetKeys={[]}
        onChange={onChange}
        {...labels}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Alpha" }));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(onChange).toHaveBeenCalledWith(["a"]);
    expect(screen.getByRole("group", { name: "Available" }).textContent).toContain("Alpha");
    expect(screen.getByRole("group", { name: "Assigned" }).textContent).not.toContain("Alpha");
  });

  it("never selects or moves disabled items", () => {
    render(<Transfer dataSource={dataSource} {...labels} />);
    const locked = screen.getByRole("checkbox", { name: "Locked" });
    expect((locked as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Add" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("preserves selection on the opposite side when one direction moves", () => {
    render(
      <Transfer
        dataSource={dataSource}
        defaultTargetKeys={["b"]}
        {...labels}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Alpha" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Beta" }));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect((screen.getByRole("checkbox", { name: "Beta" }) as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(screen.getByRole("group", { name: "Available" }).textContent).toContain("Beta");
  });

  it("forwards root refs, DOM props and disabled semantics", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Transfer
        ref={ref}
        dataSource={dataSource}
        data-testid="transfer"
        aria-label="Assignment transfer"
        disabled
        {...labels}
      />,
    );

    const root = screen.getByTestId("transfer");
    expect(ref.current).toBe(root);
    expect(root.getAttribute("data-slot")).toBe("transfer");
    expect(root.getAttribute("aria-label")).toBe("Assignment transfer");
    expect(root.getAttribute("aria-disabled")).toBe("true");
    expect(screen.getAllByRole("checkbox").every((node) => (node as HTMLInputElement).disabled)).toBe(true);
  });

  it("keeps Preview/Code executable and marks the reviewed family complete", () => {
    const document = transferReviewDocuments.transfer;
    expect(document.code).toContain("<Transfer");
    expect(document.code).toContain("titles=");
    expect(document.code).toContain("operations=");
    expect(componentProgress("core-transfer", 68)).toBe(100);
  });
});
