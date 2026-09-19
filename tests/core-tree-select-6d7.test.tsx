import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TreeSelect } from "../src/core";
import { componentProgress } from "../showcase/catalog/component-progress";
import { treeSelectReviewDocuments } from "../showcase/demos/core/data-entry-review-6d7";

const treeData = [
  {
    value: "docs",
    title: "Docs",
    children: [
      { value: "guide", title: "Guide" },
      { value: "api", title: "API" },
    ],
  },
  {
    value: "admin",
    title: "Admin",
    children: [{ value: "audit", title: "Audit", disabled: true }],
  },
] as const;

afterEach(cleanup);

describe("TreeSelect 6D7", () => {
  it("renders a Gouno-owned tree popup and keeps placeholder copy caller-owned", async () => {
    const { rerender } = render(
      <TreeSelect
        aria-label="Section"
        treeData={treeData}
        placeholder="请选择"
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Section" });
    expect(trigger.textContent).toContain("请选择");
    expect(trigger.getAttribute("aria-haspopup")).toBe("tree");
    await userEvent.click(trigger);
    expect(screen.getByRole("tree", { name: "Section" })).toBeTruthy();
    expect(screen.queryByText("Please select")).toBeNull();

    rerender(<TreeSelect aria-label="Section" treeData={treeData} />);
    expect(screen.queryByText("Please select")).toBeNull();
  });

  it("keeps controlled single selection caller-owned and preserves disabled tree nodes", async () => {
    const onChange = vi.fn();
    const renderControlled = () => (
      <TreeSelect
        aria-label="Section"
        treeData={treeData}
        value="guide"
        onChange={onChange}
      />
    );
    const { rerender } = render(renderControlled());
    const trigger = screen.getByRole("combobox", { name: "Section" });

    expect(trigger.textContent).toContain("Guide");
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("button", { name: "Admin" }));
    expect(
      screen.getByRole("treeitem", { name: /Audit/ }).getAttribute(
        "aria-disabled",
      ),
    ).toBe("true");

    await userEvent.click(screen.getByRole("treeitem", { name: /API/ }));
    expect(onChange).toHaveBeenLastCalledWith("api");
    rerender(renderControlled());
    expect(screen.getByRole("combobox", { name: "Section" }).textContent).toContain(
      "Guide",
    );
  });

  it("uses checkable tree semantics for multiple selection and returns a string array", async () => {
    const onChange = vi.fn();
    render(
      <TreeSelect
        aria-label="Topics"
        treeData={treeData}
        multiple
        defaultValue={["guide", "api"]}
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Topics" });
    expect(trigger.textContent).toContain("Guide");
    expect(trigger.textContent).toContain("API");
    await userEvent.click(trigger);
    const api = screen.getByRole("checkbox", { name: "API" });
    expect((api as HTMLInputElement).checked).toBe(true);
    await userEvent.click(api);
    expect(onChange).toHaveBeenLastCalledWith(["guide"]);
  });

  it("keeps native form/ref compatibility hidden while hierarchy metadata stays stable", () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(
      <TreeSelect
        ref={ref}
        aria-label="Section"
        data-testid="tree-select"
        name="section"
        required
        treeData={treeData}
        size="large"
        status="error"
      />,
    );

    const native = screen.getByTestId("tree-select") as HTMLSelectElement;
    const api = native.querySelector(
      'option[data-slot="tree-select-option"][value="api"]',
    );
    const trigger = screen.getByRole("combobox", { name: "Section" });
    const control = trigger.closest('[data-slot="tree-select-control"]');
    expect(ref.current).toBe(native);
    expect(native.getAttribute("data-slot")).toBe("tree-select");
    expect(native.getAttribute("name")).toBe("section");
    expect(native.hasAttribute("required")).toBe(true);
    expect(native.getAttribute("aria-invalid")).toBe("true");
    expect(native.getAttribute("aria-hidden")).toBe("true");
    expect(api?.textContent).toBe("API");
    expect(api?.getAttribute("data-depth")).toBe("1");
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
    expect(control?.className).toContain("h-[var(--control-height-large)]");
  });

  it("keeps whole-control disabled semantics on both visible trigger and native bridge", () => {
    render(
      <TreeSelect
        aria-label="Section"
        data-testid="tree-select"
        treeData={treeData}
        disabled
      />,
    );
    expect(
      (screen.getByRole("combobox", { name: "Section" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect((screen.getByTestId("tree-select") as HTMLSelectElement).disabled).toBe(
      true,
    );
  });

  it("expands every ancestor needed by a deeply nested controlled value", async () => {
    render(
      <TreeSelect
        aria-label="Deep section"
        value="leaf"
        treeData={[
          {
            value: "root",
            title: "Root",
            children: [
              {
                value: "branch",
                title: "Branch",
                children: [{ value: "leaf", title: "Leaf" }],
              },
            ],
          },
        ]}
      />,
    );

    await userEvent.click(
      screen.getByRole("combobox", { name: "Deep section" }),
    );
    expect(screen.getByRole("treeitem", { name: /Leaf/ })).toBeTruthy();
  });

  it("keeps Preview/Code executable and marks the reviewed family complete", () => {
    const document = treeSelectReviewDocuments["tree-select"];
    expect(document.code).toContain("<TreeSelect");
    expect(document.code).toContain('aria-label="主分区"');
    expect(document.code).toContain('placeholder="请选择"');
    expect(componentProgress("core-tree-select", 84)).toBe(100);
  });
});
