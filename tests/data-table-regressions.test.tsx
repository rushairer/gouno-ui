import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DataTable } from "../src/patterns/data-table";
import { TableRow, TableCell } from "../src/core";

afterEach(cleanup);
const rows = [
  { id: "a", score: 10 },
  { id: "b", score: 2 },
  { id: "c", score: 30 },
];
const columns = [
  { key: "score", title: "Score", dataIndex: "score" as const, sorter: true },
];

describe("DataTable state contracts", () => {
  it("preserves keys across sorting and numeric sort is numeric", () => {
    const select = vi.fn();
    render(
      <DataTable
        columns={columns}
        dataSource={rows}
        selectable
        onSelectionChange={select}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Score" }));
    expect(screen.getAllByRole("cell")[1].textContent).toBe("2");
    fireEvent.click(screen.getByRole("checkbox", { name: "选择第 2 行" }));
    expect(select).toHaveBeenLastCalledWith(["1"], [rows[1]]);
    expect(
      (screen.getByRole("checkbox", { name: "全选当前页" }) as HTMLInputElement)
        .indeterminate,
    ).toBe(true);
  });
  it("renders supplied server page without slicing it again", () => {
    const change = vi.fn();
    render(
      <DataTable
        rowKey="id"
        columns={columns}
        dataSource={[rows[2]]}
        pagination={{
          mode: "server",
          page: 3,
          pageSize: 1,
          total: 100,
          onChange: change,
        }}
      />,
    );
    expect(screen.getByText("30")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "下一页" }));
    expect(change).toHaveBeenCalledWith(4, 1);
  });
  it("supports controlled clearing of sort and filters out hidden columns", () => {
    const { rerender } = render(
      <DataTable
        columns={columns}
        dataSource={rows}
        defaultSort={{ key: "score", direction: "descend" }}
      />,
    );
    expect(screen.getAllByRole("cell")[0].textContent).toBe("30");
    rerender(
      <DataTable
        columns={[...columns, { key: "secret", title: "Hidden", hidden: true }]}
        dataSource={rows}
        sort={null}
      />,
    );
    expect(screen.getAllByRole("cell")[0].textContent).toBe("10");
    expect(screen.queryByText("Hidden")).toBeNull();
  });
  it("keeps the header in loading, error and empty states", () => {
    const { rerender } = render(<DataTable columns={columns} loading />);
    expect(screen.getByRole("columnheader", { name: "Score" })).toBeTruthy();
    expect(screen.getByRole("status")).toBeTruthy();
    rerender(<DataTable columns={columns} error="Could not load" />);
    expect(screen.getByRole("alert").textContent).toBe("Could not load");
    rerender(<DataTable columns={columns} emptyState="No results" />);
    expect(screen.getByText("No results")).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "Score" })).toBeTruthy();
  });
  it("renders summaries, row callbacks and clears selection from batch actions", () => {
    const clicked = vi.fn();
    render(
      <DataTable
        columns={columns}
        rowKey="id"
        dataSource={rows}
        selectable
        onRow={() => ({ onDoubleClick: clicked })}
        summary={(data) => (
          <TableRow>
            <TableCell>
              Total {data.reduce((sum, row) => sum + row.score, 0)}
            </TableCell>
          </TableRow>
        )}
        batchActions={(keys, clear) => (
          <button onClick={clear}>Clear {keys.length}</button>
        )}
      />,
    );
    expect(screen.getByText("Total 42")).toBeTruthy();
    fireEvent.doubleClick(screen.getByText("10"));
    expect(clicked).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("checkbox", { name: "全选当前页" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear 3" }));
    expect(screen.queryByRole("button", { name: "Clear 3" })).toBeNull();
  });
});

it("preserves explicit nested pagination labels and size-change callbacks", () => {
  const onSizeChange = vi.fn();
  render(
    <DataTable
      columns={[{ key: "id", title: "ID", dataIndex: "id" }]}
      dataSource={Array.from({ length: 12 }, (_, id) => ({ id }))}
      pagination={{
        prevText: "Earlier",
        nextText: "Later",
        pageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: [5, 10],
        onShowSizeChange: onSizeChange,
      }}
    />,
  );
  expect(screen.getByRole("button", { name: "Later" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Earlier" })).toBeTruthy();
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "10" } });
  expect(onSizeChange).toHaveBeenCalledWith(1, 10);
});
