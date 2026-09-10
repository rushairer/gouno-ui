import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { Breadcrumb, Collapse } from "../src/core";

afterEach(() => {
  cleanup();
});

describe("Core Breadcrumb", () => {
  it("resolves cumulative paths, params and current-page semantics", () => {
    render(
      <Breadcrumb
        params={{ projectId: "gouno-ui" }}
        items={[
          { key: "home", title: "Home", path: "" },
          { key: "projects", title: "Projects", path: "projects" },
          { key: "project", title: "Gouno UI", path: ":projectId" },
          { key: "components", title: "Components", path: "components" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "Projects" }).getAttribute("href")).toBe("/projects");
    expect(screen.getByRole("link", { name: "Gouno UI" }).getAttribute("href")).toBe("/projects/gouno-ui");
    const current = screen.getByRole("link", { name: "Components" });
    expect(current.getAttribute("href")).toBe("/projects/gouno-ui/components");
    expect(current.getAttribute("aria-current")).toBe("page");
  });

  it("lets an explicit separator replace the automatic separator at that position", () => {
    render(
      <Breadcrumb
        separator="/"
        items={[
          { key: "home", title: "Home", href: "/" },
          { key: "special", type: "separator", separator: "·" },
          { key: "library", title: "Library", href: "/library" },
          { key: "detail", title: "Detail" },
        ]}
      />,
    );

    const separators = document.querySelectorAll('[data-slot="breadcrumb-separator"]');
    expect(separators).toHaveLength(2);
    expect(Array.from(separators).map((node) => node.textContent)).toEqual(["·", "/"]);
  });

  it("opens route menus and dispatches menu actions", () => {
    const onChoose = vi.fn();
    render(
      <Breadcrumb
        items={[
          { key: "home", title: "Home", href: "/" },
          {
            key: "projects",
            title: "Projects",
            menu: {
              "aria-label": "Choose project",
              items: [{ key: "gouno", title: "Gouno UI", onClick: onChoose }],
            },
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Choose project" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Gouno UI" }));
    expect(onChoose).toHaveBeenCalledTimes(1);
  });

  it("passes resolved routing context into itemRender", () => {
    const contexts: Array<{ href?: string; paths: readonly string[]; isLast: boolean }> = [];
    render(
      <Breadcrumb
        params={{ id: 42 }}
        items={[
          { key: "projects", title: "Projects", path: "projects" },
          { key: "detail", title: "Detail", path: ":id" },
        ]}
        itemRender={({ item, href, paths, isLast }) => {
          contexts.push({ href, paths, isLast });
          return <span>{item.title}</span>;
        }}
      />,
    );

    expect(contexts).toEqual([
      { href: "/projects", paths: ["projects"], isLast: false },
      { href: "/projects/42", paths: ["projects", "42"], isLast: true },
    ]);
  });
});

describe("Core Collapse", () => {
  it("supports accordion state and reports scalar active keys", () => {
    const onChange = vi.fn();
    render(
      <Collapse
        accordion
        defaultActiveKey="one"
        onChange={onChange}
        items={[
          { key: "one", label: "One", children: "First" },
          { key: "two", label: "Two", children: "Second" },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "One" }).getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Two" }));
    expect(screen.getByRole("button", { name: "One" }).getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByRole("button", { name: "Two" }).getAttribute("aria-expanded")).toBe("true");
    expect(onChange).toHaveBeenLastCalledWith("two");

    fireEvent.click(screen.getByRole("button", { name: "Two" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("limits icon-only panels to the disclosure control", () => {
    render(
      <Collapse
        items={[
          {
            key: "icon",
            label: "Icon only",
            children: "Hidden content",
            collapsible: "icon",
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByText("Icon only"));
    expect(screen.queryByText("Hidden content")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Expand panel" }));
    expect(screen.getByText("Hidden content")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Collapse panel" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("honors lazy mount, destroyOnHidden and forceRender", () => {
    render(
      <Collapse
        destroyOnHidden
        items={[
          { key: "lazy", label: "Lazy", children: "Lazy body" },
          {
            key: "eager",
            label: "Eager",
            children: "Eager body",
            forceRender: true,
          },
        ]}
      />,
    );

    expect(screen.queryByText("Lazy body")).toBeNull();
    const eagerBody = screen.getByText("Eager body").closest('[role="region"]');
    expect(eagerBody?.hasAttribute("hidden")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Lazy" }));
    const lazyBody = screen.getByText("Lazy body").closest('[role="region"]');
    expect(lazyBody?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(lazyBody?.hasAttribute("hidden")).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Lazy" }));
    expect(screen.queryByText("Lazy body")).toBeNull();
    expect(screen.getByText("Eager body")).toBeTruthy();
  });

  it("keeps extra actions independent from panel toggling", () => {
    const onExtra = vi.fn();
    render(
      <Collapse
        items={[
          {
            key: "panel",
            label: "Panel",
            children: "Panel body",
            extra: <button onClick={onExtra}>Extra</button>,
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Extra" }));
    expect(onExtra).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Panel" }).getAttribute("aria-expanded")).toBe("false");
  });
});
