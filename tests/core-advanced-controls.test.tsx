import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Cascader, Menu, Mentions, Transfer, Tree } from "../src/core";

describe("additional Core controls", () => {
  it("reveals the next cascader level", () => {
    render(
      <Cascader
        options={[
          {
            value: "a",
            label: "A",
            children: [{ value: "b", label: "B" }],
          },
        ]}
      />,
    );
    fireEvent.change(screen.getByLabelText("Level 1"), {
      target: { value: "a" },
    });
    expect(screen.getByLabelText("Level 2")).toBeTruthy();
  });

  it("moves selected transfer entries", () => {
    render(<Transfer dataSource={[{ key: "1", title: "One" }]} />);
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "→" }));
    expect(screen.getByText("One")).toBeTruthy();
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
