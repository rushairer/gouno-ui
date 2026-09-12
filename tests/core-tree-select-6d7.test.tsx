import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
  it("keeps placeholder copy caller-owned and removes the English default", () => {
    const { rerender } = render(
      <TreeSelect
        aria-label="Section"
        treeData={treeData}
        placeholder="请选择"
      />,
    );

    expect(screen.getByRole("option", { name: "请选择" })).toBeTruthy();
    expect(screen.queryByText("Please select")).toBeNull();

    rerender(<TreeSelect aria-label="Section" treeData={treeData} />);
    expect(screen.queryByText("Please select")).toBeNull();
    expect(
      screen
        .getAllByRole("option")
        .some((option) => option.getAttribute("data-slot") === "tree-select-placeholder"),
    ).toBe(false);
  });

  it("keeps controlled single selection caller-owned and preserves disabled nodes", () => {
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
    const select = screen.getByRole("combobox", { name: "Section" });

    expect((select as HTMLSelectElement).value).toBe("guide");
    expect(
      (screen.getByRole("option", { name: /Audit/ }) as HTMLOptionElement)
        .disabled,
    ).toBe(true);

    fireEvent.change(select, { target: { value: "api" } });
    expect(onChange).toHaveBeenLastCalledWith("api");
    rerender(renderControlled());
    expect(
      (screen.getByRole("combobox", { name: "Section" }) as HTMLSelectElement)
        .value,
    ).toBe("guide");
  });

  it("preserves native multiple selection and returns a string array", () => {
    const onChange = vi.fn();
    render(
      <TreeSelect
        aria-label="Topics"
        treeData={treeData}
        multiple
        onChange={onChange}
      />,
    );

    const select = screen.getByRole("listbox", { name: "Topics" });
    const guide = screen.getByRole("option", { name: /Guide/ }) as HTMLOptionElement;
    const api = screen.getByRole("option", { name: /API/ }) as HTMLOptionElement;
    guide.selected = true;
    api.selected = true;
    fireEvent.change(select);

    expect(onChange).toHaveBeenLastCalledWith(["guide", "api"]);
    expect(select.className).toContain("h-auto");
  });

  it("uses string titles with stable depth metadata instead of stringifying React nodes", () => {
    render(<TreeSelect aria-label="Section" treeData={treeData} />);
    const api = screen.getByRole("option", { name: /API/ });
    expect(api.textContent).toContain("API");
    expect(api.textContent).not.toContain("[object Object]");
    expect(api.getAttribute("data-depth")).toBe("1");
    expect(api.getAttribute("data-slot")).toBe("tree-select-option");
  });

  it("forwards the native ref and standard select DOM/form attributes", () => {
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

    const select = screen.getByTestId("tree-select");
    expect(ref.current).toBe(select);
    expect(select.getAttribute("data-slot")).toBe("tree-select");
    expect(select.getAttribute("name")).toBe("section");
    expect(select.hasAttribute("required")).toBe(true);
    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(select.className).toContain("h-11");
  });

  it("keeps whole-control disabled semantics native", () => {
    render(
      <TreeSelect aria-label="Section" treeData={treeData} disabled />,
    );
    const select = screen.getByRole("combobox", { name: "Section" });
    expect((select as HTMLSelectElement).disabled).toBe(true);
    expect(select.getAttribute("aria-disabled")).toBe("true");
  });

  it("keeps Preview/Code executable and marks the reviewed family complete", () => {
    const document = treeSelectReviewDocuments["tree-select"];
    expect(document.code).toContain("<TreeSelect");
    expect(document.code).toContain('aria-label="主分区"');
    expect(document.code).toContain('placeholder="请选择"');
    expect(componentProgress("core-tree-select", 84)).toBe(100);
  });
});
