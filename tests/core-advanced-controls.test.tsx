import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Cascader, Menu, Mentions, Transfer, Tree } from "../src/core";
import { DataTable } from "../src/patterns";

describe("additional Core controls", () => {
  it("reveals the next cascader level", () => { render(<Cascader options={[{ value:"a", label:"A", children:[{value:"b",label:"B"}]}]} />); fireEvent.change(screen.getByLabelText("Level 1"), { target:{ value:"a" } }); expect(screen.getByLabelText("Level 2")).toBeTruthy(); });
  it("moves selected transfer entries", () => { render(<Transfer dataSource={[{key:"1",title:"One"}]} />); fireEvent.click(screen.getByRole("checkbox")); fireEvent.click(screen.getByRole("button", {name:"→"})); expect(screen.getByText("One")).toBeTruthy(); });
  it("shows mention suggestions", () => { render(<Mentions aria-label="Comment" options={["alice"]} />); fireEvent.change(screen.getByLabelText("Comment"), { target:{ value:"@a" } }); expect(screen.getByRole("option", {name:"@alice"})).toBeTruthy(); });
  it("expands tree nodes and exposes menu semantics", () => { render(<><Tree data={[{key:"r",title:"Root",children:[{key:"c",title:"Child"}]}]} /><Menu items={[{key:"home",label:"Home"}]} /></>); fireEvent.click(screen.getByRole("button", {name:"Expand"})); expect(screen.getByText("Child")).toBeTruthy(); expect(screen.getByRole("menuitem", {name:"Home"})).toBeTruthy(); });
  it("sorts, selects, filters, and paginates data table rows", () => {
    const onSelectionChange = vi.fn();
    render(<DataTable
      rowKey="id"
      dataSource={[{ id: "a", name: "Alpha", score: 2 }, { id: "b", name: "Beta", score: 1 }, { id: "c", name: "Gamma", score: 3 }]}
      columns={[{ key: "name", title: "Name", dataIndex: "name", sorter: true }, { key: "score", title: "Score", dataIndex: "score", sorter: true }]}
      selectable
      onSelectionChange={onSelectionChange}
      filter={(row) => row.score >= 2}
      pagination={{ pageSize: 1 }}
    />);
    fireEvent.click(screen.getByRole("button", { name: /Name/ }));
    expect(screen.getAllByRole("cell")[1].textContent).toContain("Alpha");
    fireEvent.click(screen.getByRole("checkbox", { name: "选择第 1 行" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["a"], [{ id: "a", name: "Alpha", score: 2 }]);
    fireEvent.click(screen.getByRole("button", { name: "下一页" }));
    expect(screen.getByText("Gamma")).toBeTruthy();
  });
});
