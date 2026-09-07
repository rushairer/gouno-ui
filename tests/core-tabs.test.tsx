import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "../src/core";

describe("Core Tabs", () => {
  it("uses Ant-style key semantics and selects the first enabled item by default", () => {
    const onChange = vi.fn();
    render(
      <Tabs
        ariaLabel="Sections"
        items={[
          { key: "disabled", label: "Disabled", disabled: true, children: "Disabled panel" },
          { key: "overview", label: "Overview", children: "Overview panel" },
          { key: "security", label: "Security", children: "Security panel" },
        ]}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole("tab", { name: "Overview" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Overview panel")).toBeTruthy();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Security" }), { button: 0 });
    expect(onChange).toHaveBeenCalledWith("security");
    expect(screen.getByText("Security panel")).toBeTruthy();
  });

  it("keeps activeKey controlled and exposes card/placement/size semantics", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Tabs
        ariaLabel="Settings"
        activeKey="general"
        items={[
          { key: "general", label: "General", children: "General panel" },
          { key: "advanced", label: "Advanced", children: "Advanced panel" },
        ]}
        onChange={onChange}
        type="card"
        tabPosition="left"
        size="small"
      />,
    );

    const root = container.querySelector('[data-slot="tabs"]') as HTMLElement;
    const list = screen.getByRole("tablist", { name: "Settings" });
    expect(root.dataset.tabPosition).toBe("left");
    expect(root.dataset.tabType).toBe("card");
    expect(root.dataset.tabSize).toBe("small");
    expect(root.style.flexDirection).toBe("row");
    expect(list.getAttribute("data-variant")).toBe("default");

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Advanced" }), { button: 0 });
    expect(onChange).toHaveBeenCalledWith("advanced");
    expect(screen.getByRole("tab", { name: "General" }).getAttribute("aria-selected")).toBe("true");
  });

  it("keeps line tabs visually borderless at the trigger level", () => {
    render(
      <Tabs
        ariaLabel="Line tabs"
        items={[
          { key: "one", label: "One" },
          { key: "two", label: "Two" },
        ]}
      />,
    );
    const trigger = screen.getByRole("tab", { name: "One" });
    expect(trigger.className).toContain("group-data-[variant=line]/tabs-list:!border-0");
    expect(screen.getByRole("tablist", { name: "Line tabs" }).getAttribute("data-variant")).toBe("line");
  });

  it("temporarily accepts the pre-reset value/item.value fixture shape", () => {
    render(
      <Tabs
        ariaLabel="Legacy fixture"
        value="old-b"
        items={[
          { value: "old-a", label: "Old A" },
          { value: "old-b", label: "Old B" },
        ]}
      />,
    );
    expect(screen.getByRole("tab", { name: "Old B" }).getAttribute("aria-selected")).toBe("true");
  });
});
