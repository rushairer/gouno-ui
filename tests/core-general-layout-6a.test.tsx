import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { Flex, Icon, Kbd, Separator } from "../src/core";
import { coreDocuments } from "../showcase/demos/core/registry";

afterEach(() => {
  cleanup();
});

describe("Core General/Layout batch 6A", () => {
  it("keeps decorative Icon silent and promotes labelled Icon to img semantics", () => {
    const ref = createRef<SVGSVGElement>();
    const { rerender } = render(
      <Icon ref={ref} icon={<CircleCheck />} data-testid="icon" />,
    );

    const decorative = screen.getByTestId("icon");
    expect(ref.current).toBe(decorative);
    expect(decorative.dataset.slot).toBe("icon");
    expect(decorative.getAttribute("aria-hidden")).toBe("true");
    expect(decorative.getAttribute("role")).toBeNull();

    rerender(
      <Icon
        ref={ref}
        icon={<LoaderCircle style={{ transform: "scale(1.1)" }} />}
        data-testid="icon"
        aria-label="Loading"
        spin
        rotate={45}
        size={24}
      />,
    );

    const labelled = screen.getByRole("img", { name: "Loading" });
    expect(labelled).toBe(ref.current);
    expect(labelled.style.width).toBe("24px");
    expect(labelled.style.height).toBe("24px");
    expect(labelled.style.transform).toContain("scale(1.1)");
    expect(labelled.style.transform).toContain("rotate(45deg)");
    expect(labelled.classList.contains("animate-spin")).toBe(true);
  });

  it("keeps Kbd as a ref-safe native semantic element", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Kbd ref={ref} data-testid="kbd" aria-label="Command key">
        ⌘
      </Kbd>,
    );

    const kbd = screen.getByTestId("kbd");
    expect(ref.current).toBe(kbd);
    expect(kbd.tagName).toBe("KBD");
    expect(kbd.dataset.slot).toBe("kbd");
    expect(kbd.getAttribute("aria-label")).toBe("Command key");
  });

  it("maps Flex direction, wrap, gap and flex shorthand without child wrappers", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Flex
        ref={ref}
        direction="column-reverse"
        align="baseline"
        justify="space-evenly"
        wrap="wrap-reverse"
        gap={11}
        flex={1}
        data-testid="flex"
      >
        <span>First</span>
        <span>Second</span>
      </Flex>,
    );

    const root = screen.getByTestId("flex");
    expect(ref.current).toBe(root);
    expect(root.dataset.slot).toBe("flex");
    expect(root.dataset.direction).toBe("column-reverse");
    expect(root.dataset.wrap).toBe("wrap-reverse");
    expect(root.style.gap).toBe("11px");
    expect(root.style.flex).toBe("1");
    expect(root.classList.contains("flex-col-reverse")).toBe(true);
    expect(root.classList.contains("items-baseline")).toBe(true);
    expect(root.classList.contains("justify-evenly")).toBe(true);
    expect(root.classList.contains("flex-wrap-reverse")).toBe(true);
    expect(root.children).toHaveLength(2);
  });

  it("supports decorative and semantic Separator variants plus horizontal content", () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <Separator ref={ref} data-testid="separator" variant="dashed">
        Section
      </Separator>,
    );

    const decorative = screen.getByTestId("separator");
    expect(ref.current).toBe(decorative);
    expect(decorative.getAttribute("role")).toBe("presentation");
    expect(decorative.dataset.variant).toBe("dashed");
    expect(screen.getByText("Section").dataset.slot).toBe("separator-content");
    expect(decorative.querySelectorAll('[data-slot="separator-line"]')).toHaveLength(2);

    rerender(
      <Separator
        ref={ref}
        data-testid="separator"
        orientation="vertical"
        decorative={false}
        aria-label="Section boundary"
        variant="dotted"
      />,
    );

    const semantic = screen.getByRole("separator", { name: "Section boundary" });
    expect(semantic).toBe(ref.current);
    expect(semantic.getAttribute("aria-orientation")).toBe("vertical");
    expect(semantic.dataset.variant).toBe("dotted");
  });

  it("documents runtime fields and uses canonical package imports in examples", () => {
    const expectedApi = new Map([
      ["icon", ["icon", "size", "spin", "rotate", "aria-label", "aria-labelledby", "aria-hidden", "...svg props", "ref"]],
      ["kbd", ["children", "className", "...kbd props", "ref"]],
      ["flex", ["direction", "align", "justify", "gap", "wrap", "flex", "children", "className", "style", "...div props", "ref"]],
      ["separator", ["orientation", "decorative", "variant", "children", "titlePlacement", "classNames", "styles", "...div props", "ref"]],
    ] as const);

    for (const [id, names] of expectedApi) {
      const document = coreDocuments[id];
      expect(document.api?.map((row) => row.name)).toEqual(expect.arrayContaining([...names]));
      expect(document.code).toContain("@gouno/ui/core");
      expect(document.code).not.toContain("../../../src/core");
    }
  });
});
