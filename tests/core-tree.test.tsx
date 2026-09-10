import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Tree, type TreeNode } from "../src/core";

afterEach(() => {
  cleanup();
});

const treeData: TreeNode[] = [
  {
    key: "root",
    title: "Root",
    children: [
      { key: "alpha", title: "Alpha", isLeaf: true },
      { key: "beta", title: "Beta", isLeaf: true },
    ],
  },
];

function itemNamed(name: string) {
  return screen.getByText(name).closest('[role="treeitem"]') as HTMLElement;
}

function checkboxNamed(name: string) {
  return screen.getByRole("checkbox", { name }) as HTMLInputElement;
}

describe("Core Tree", () => {
  it("expands, selects and exposes hierarchical ARIA metadata", () => {
    const onSelect = vi.fn();
    render(<Tree treeData={treeData} onSelect={onSelect} />);

    const root = itemNamed("Root");
    expect(root.getAttribute("aria-level")).toBe("1");
    expect(root.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(screen.getByRole("button", { name: "Expand" }));

    expect(itemNamed("Root").getAttribute("aria-expanded")).toBe("true");
    const alpha = itemNamed("Alpha");
    expect(alpha.getAttribute("aria-level")).toBe("2");
    expect(alpha.getAttribute("aria-posinset")).toBe("1");
    expect(alpha.getAttribute("aria-setsize")).toBe("2");

    fireEvent.click(alpha);
    expect(alpha.getAttribute("aria-selected")).toBe("true");
    expect(onSelect).toHaveBeenLastCalledWith(
      ["alpha"],
      expect.objectContaining({
        selected: true,
        node: expect.objectContaining({ key: "alpha" }),
      }),
    );
  });

  it("conducts checks through descendants and exposes mixed parents", () => {
    const onCheck = vi.fn();
    render(
      <Tree
        treeData={treeData}
        defaultExpandedKeys={["root"]}
        checkable
        onCheck={onCheck}
      />,
    );

    fireEvent.click(checkboxNamed("Root"));
    const checked = onCheck.mock.calls.at(-1)?.[0] as string[];
    expect(checked).toEqual(["root", "alpha", "beta"]);
    expect(checkboxNamed("Root").checked).toBe(true);
    expect(checkboxNamed("Alpha").checked).toBe(true);
    expect(checkboxNamed("Beta").checked).toBe(true);

    fireEvent.click(checkboxNamed("Alpha"));

    const root = itemNamed("Root");
    const rootCheckbox = checkboxNamed("Root");
    expect(root.getAttribute("aria-checked")).toBe("mixed");
    expect(rootCheckbox.indeterminate).toBe(true);
    expect(onCheck.mock.calls.at(-1)?.[1]).toEqual(
      expect.objectContaining({ halfCheckedKeys: ["root"] }),
    );
  });

  it("keeps strict checks independent", () => {
    const onCheck = vi.fn();
    render(
      <Tree
        treeData={treeData}
        defaultExpandedKeys={["root"]}
        defaultCheckedKeys={["alpha"]}
        checkable
        checkStrictly
        onCheck={onCheck}
      />,
    );

    expect(checkboxNamed("Alpha").checked).toBe(true);
    expect(checkboxNamed("Root").checked).toBe(false);

    fireEvent.click(checkboxNamed("Beta"));
    expect(onCheck).toHaveBeenLastCalledWith(
      { checked: ["alpha", "beta"], halfChecked: [] },
      expect.objectContaining({ checked: true, halfCheckedKeys: [] }),
    );
  });

  it("supports roving keyboard navigation and keyboard checking", async () => {
    render(
      <Tree
        treeData={treeData}
        defaultExpandedKeys={["root"]}
        checkable
      />,
    );

    const root = itemNamed("Root");
    root.focus();
    fireEvent.keyDown(root, { key: "ArrowDown" });
    await waitFor(() => expect(document.activeElement).toBe(itemNamed("Alpha")));

    fireEvent.keyDown(itemNamed("Alpha"), { key: " " });
    expect(checkboxNamed("Alpha").checked).toBe(true);
    expect(itemNamed("Root").getAttribute("aria-checked")).toBe("mixed");

    fireEvent.keyDown(itemNamed("Alpha"), { key: "ArrowLeft" });
    await waitFor(() => expect(document.activeElement).toBe(itemNamed("Root")));
  });

  it("loads an asynchronous branch once and reports loadedKeys", async () => {
    let resolveLoad!: () => void;
    const loadData = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveLoad = resolve;
        }),
    );
    const onLoad = vi.fn();
    render(
      <Tree
        treeData={[{ key: "remote", title: "Remote", isLeaf: false }]}
        loadData={loadData}
        onLoad={onLoad}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Expand" }));
    expect(itemNamed("Remote").getAttribute("aria-busy")).toBe("true");

    resolveLoad();
    await waitFor(() =>
      expect(onLoad).toHaveBeenCalledWith(["remote"], expect.anything()),
    );
    expect(loadData).toHaveBeenCalledTimes(1);
    expect(itemNamed("Remote").getAttribute("aria-busy")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Collapse" }));
    fireEvent.click(screen.getByRole("button", { name: "Expand" }));
    expect(loadData).toHaveBeenCalledTimes(1);
  });
});
