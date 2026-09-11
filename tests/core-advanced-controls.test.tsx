import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Cascader, Menu, Mentions, Transfer, Tree } from "../src/core";

describe("additional Core controls", () => {
  it("reveals the next cascader level", () => {
    render(
      <Cascader
        aria-label="Location"
        placeholder="Choose"
        options={[
          {
            value: "a",
            label: "A",
            children: [{ value: "b", label: "B" }],
          },
        ]}
      />,
    );
    fireEvent.change(screen.getByRole("combobox", { name: "1" }), {
      target: { value: "a" },
    });
    expect(screen.getByRole("combobox", { name: "2" })).toBeTruthy();
  });

  it("moves selected transfer entries", () => {
    render(
      <Transfer
        dataSource={[{ key: "1", title: "One" }]}
        titles={["Available", "Assigned"]}
        operations={["Add", "Remove"]}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "One" }));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByRole("group", { name: "Assigned" }).textContent).toContain("One");
  });

  it("shows mention suggestions while the multiline textbox is focused", () => {
    render(<Mentions aria-label="Comment" options={["alice"]} />);
    const textbox = screen.getByLabelText("Comment");
    fireEvent.focus(textbox);
    fireEvent.change(textbox, {
      target: { value: "@a" },
    });
    expect(screen.getByRole("option", { name: "@alice" })).toBeTruthy();
  });

  it("expands tree nodes and exposes menu semantics", () => {
    render(
      <>
        <Tree
          treeData={[
            {
              key: "r",
              title: "Root",
              children: [{ key: "c", title: "Child" }],
            },
          ]}
        />
        <Menu items={[{ key: "home", label: "Home" }]} />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Expand" }));
    expect(screen.getByText("Child")).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Home" })).toBeTruthy();
  });
});
