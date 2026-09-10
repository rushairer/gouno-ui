import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Menu, Steps, type MenuNode } from "../src/core";

afterEach(() => {
  cleanup();
});

describe("Core Steps", () => {
  it("uses stable keyed items and reports interactive step changes", () => {
    const onChange = vi.fn();
    render(
      <Steps
        current={0}
        onChange={onChange}
        items={[
          { key: "one", title: "One", content: "First" },
          { key: "two", title: "Two", content: "Second" },
          { key: "three", title: "Three", disabled: true },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: /One/ }).getAttribute("aria-current")).toBe("step");
    fireEvent.click(screen.getByRole("button", { name: /Two/ }));
    expect(onChange).toHaveBeenLastCalledWith(1);

    fireEvent.click(screen.getByRole("button", { name: /Three/ }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("normalizes percent and exposes progress semantics only for the current process step", () => {
    render(
      <Steps
        current={1}
        percent={140}
        items={[
          { key: "one", title: "One" },
          { key: "two", title: "Two" },
          { key: "three", title: "Three" },
        ]}
      />,
    );

    const progress = screen.getByRole("progressbar");
    expect(progress.getAttribute("aria-valuenow")).toBe("100");
    expect(document.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
  });

  it("collapses long workflows with explicit ellipsis slots while preserving the current window", () => {
    render(
      <Steps
        current={2}
        maxCount={4}
        items={[
          { key: "one", title: "One" },
          { key: "two", title: "Two" },
          { key: "three", title: "Three" },
          { key: "four", title: "Four" },
          { key: "five", title: "Five" },
          { key: "six", title: "Six" },
        ]}
      />,
    );

    expect(document.querySelectorAll('[data-ellipsis="true"]')).toHaveLength(2);
    expect(screen.getByText("Three")).toBeTruthy();
    expect(screen.queryByText("Six")).toBeNull();
  });
});

describe("Core Menu", () => {
  const nestedItems: readonly MenuNode[] = [
    { key: "home", label: "Home" },
    {
      key: "workspace",
      type: "submenu",
      label: "Workspace",
      children: [
        { key: "members", label: "Members" },
        { key: "roles", label: "Roles" },
      ],
    },
    { key: "divider", type: "divider" },
    {
      key: "admin",
      type: "group",
      label: "Administration",
      children: [{ key: "settings", label: "Settings" }],
    },
  ];

  it("dispatches root-to-leaf key paths and selection state from nested items", () => {
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <Menu
        aria-label="Application navigation"
        mode="inline"
        defaultOpenKeys={["workspace"]}
        items={nestedItems}
        onClick={onClick}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole("menuitem", { name: "Members" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].keyPath).toEqual(["workspace", "members"]);
    expect(onSelect.mock.calls[0][0].selectedKeys).toEqual(["members"]);
    expect(screen.getByRole("menuitem", { name: "Members" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("separator")).toBeTruthy();
    expect(screen.getByText("Administration")).toBeTruthy();
  });

  it("keeps controlled open state caller-owned", () => {
    const onOpenChange = vi.fn();
    render(
      <Menu
        mode="inline"
        openKeys={[]}
        onOpenChange={onOpenChange}
        items={nestedItems}
      />,
    );

    fireEvent.click(screen.getByRole("menuitem", { name: "Workspace" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(["workspace"]);
    expect(screen.queryByRole("menuitem", { name: "Members" })).toBeNull();
  });

  it("uses menuitemcheckbox semantics and deselection in multiple mode", () => {
    const onDeselect = vi.fn();
    render(
      <Menu
        multiple
        defaultSelectedKeys={["a"]}
        onDeselect={onDeselect}
        items={[
          { key: "a", label: "Alpha" },
          { key: "b", label: "Beta" },
        ]}
      />,
    );

    const alpha = screen.getByRole("menuitemcheckbox", { name: "Alpha" });
    expect(alpha.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(alpha);
    expect(onDeselect.mock.calls[0][0].selectedKeys).toEqual([]);
    expect(alpha.getAttribute("aria-checked")).toBe("false");
  });

  it("supports roving keyboard focus and returns focus to a closing parent submenu", () => {
    render(<Menu mode="inline" items={nestedItems} />);

    const home = screen.getByRole("menuitem", { name: "Home" });
    home.focus();
    fireEvent.keyDown(home, { key: "ArrowDown" });

    const workspace = screen.getByRole("menuitem", { name: "Workspace" });
    expect(document.activeElement).toBe(workspace);

    fireEvent.keyDown(workspace, { key: "ArrowRight" });
    expect(workspace.getAttribute("aria-expanded")).toBe("true");

    fireEvent.keyDown(workspace, { key: "ArrowDown" });
    const members = screen.getByRole("menuitem", { name: "Members" });
    expect(document.activeElement).toBe(members);

    fireEvent.keyDown(members, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(workspace);
    expect(workspace.getAttribute("aria-expanded")).toBe("false");
  });

  it("exposes menubar semantics for horizontal mode", () => {
    render(<Menu mode="horizontal" items={nestedItems.slice(0, 2)} />);
    expect(screen.getByRole("menubar")).toBeTruthy();
  });
});
