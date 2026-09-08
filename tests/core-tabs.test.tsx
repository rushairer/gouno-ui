import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tabs, Tag } from "../src/core";

afterEach(cleanup);

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
    expect(root.className).toContain("gap-5");
    expect(list.getAttribute("data-variant")).toBe("default");
    expect(list.className).toContain("border-r");
    expect(list.className).toContain("overflow-x-hidden");

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Advanced" }), { button: 0 });
    expect(onChange).toHaveBeenCalledWith("advanced");
    expect(screen.getByRole("tab", { name: "General" }).getAttribute("aria-selected")).toBe("true");
  });

  it("keeps line indicators inside the tab-list scroll boundary and leaves content padding to consumers", () => {
    const { container } = render(
      <Tabs
        ariaLabel="Line tabs"
        items={[
          { key: "one", label: "One", children: "One panel" },
          { key: "two", label: "Two", children: "Two panel" },
        ]}
      />,
    );
    const trigger = screen.getByRole("tab", { name: "One" });
    const list = screen.getByRole("tablist", { name: "Line tabs" });
    const panel = container.querySelector('[data-slot="tabs-content"]') as HTMLElement;

    expect(trigger.className).toContain("group-data-[variant=line]/tabs-list:!border-0");
    expect(trigger.className).toContain("group-data-[variant=line]/tabs-list:after:bg-primary");
    expect(list.getAttribute("data-variant")).toBe("line");
    expect(list.className).toContain("overflow-y-hidden");
    expect(panel.className).not.toContain("pt-5");
    expect(panel.className).toContain("min-w-0");
  });

  it("keeps tab block-size stable when labels contain badges or other metadata", () => {
    render(
      <Tabs
        ariaLabel="Operations"
        items={[
          { key: "overview", label: "概览", children: "Overview" },
          {
            key: "inbox",
            label: <span className="inline-flex items-center gap-2">待我处理 <Tag color="warning">6</Tag></span>,
            children: "Inbox",
          },
        ]}
      />,
    );

    const normal = screen.getByRole("tab", { name: "概览" });
    const withMetadata = screen.getByRole("tab", { name: /待我处理/ });
    expect(normal.className).toContain("!h-10");
    expect(withMetadata.className).toContain("!h-10");
    expect(normal.className).toContain("!py-0");
    expect(withMetadata.className).toContain("!py-0");
  });

  it("maps fixed heights across all public sizes", () => {
    const item = [{ key: "one", label: "One", children: "Panel" }] as const;
    const { rerender } = render(<Tabs ariaLabel="Sized tabs" size="small" items={item} />);
    expect(screen.getByRole("tab", { name: "One" }).className).toContain("!h-8");

    rerender(<Tabs ariaLabel="Sized tabs" size="middle" items={item} />);
    expect(screen.getByRole("tab", { name: "One" }).className).toContain("!h-10");

    rerender(<Tabs ariaLabel="Sized tabs" size="large" items={item} />);
    expect(screen.getByRole("tab", { name: "One" }).className).toContain("!h-11");
  });

  it("maps bottom/right positions without pushing the indicator outside the list", () => {
    const { rerender } = render(
      <Tabs
        ariaLabel="Bottom tabs"
        tabPosition="bottom"
        items={[{ key: "one", label: "One", children: "Panel" }]}
      />,
    );
    expect(screen.getByRole("tab", { name: "One" }).className).toContain("[&::after]:!top-0");
    expect(screen.getByRole("tablist", { name: "Bottom tabs" }).className).toContain("border-t");

    rerender(
      <Tabs
        ariaLabel="Right tabs"
        tabPosition="right"
        items={[{ key: "one", label: "One", children: "Panel" }]}
      />,
    );
    expect(screen.getByRole("tab", { name: "One" }).className).toContain("[&::after]:!left-0");
    expect(screen.getByRole("tablist", { name: "Right tabs" }).className).toContain("border-l");
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