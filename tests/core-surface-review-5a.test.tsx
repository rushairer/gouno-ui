import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import {
  Avatar,
  AvatarFallback,
  Checkbox,
  CheckboxField,
  Divider,
  SearchField,
} from "../src/core";
import { coreDocuments } from "../showcase/demos/core/registry";

afterEach(() => {
  cleanup();
});

describe("Core reviewed family siblings", () => {
  it("keeps SearchField in the Input family and forwards ref to the semantic input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<SearchField ref={ref} aria-label="搜索文章" />);

    const input = screen.getByRole("searchbox", { name: "搜索文章" });
    expect(ref.current).toBe(input);
    expect(input.getAttribute("type")).toBe("search");
    expect(input.closest('[data-slot="input-group"]')?.querySelector('[aria-hidden="true"]')).toBeTruthy();

    const demo = coreDocuments.input.demos?.find(
      (item) => item.title === "SearchField 搜索输入",
    );
    expect(demo?.code).toContain("<SearchField");
    expect(
      coreDocuments.input.apiSections?.find(
        (section) => section.title === "SearchField API",
      )?.rows.map((row) => row.name),
    ).toEqual(expect.arrayContaining(["...InputProps", "type", "ref"]));
  });

  it("keeps CheckboxField as label composition with a real label ref", () => {
    const ref = createRef<HTMLLabelElement>();
    render(
      <CheckboxField ref={ref} className="text-sm">
        <Checkbox name="reported-only" />
        <span>仅看被举报内容</span>
      </CheckboxField>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "仅看被举报内容" });
    expect(ref.current?.tagName).toBe("LABEL");
    expect(ref.current?.dataset.slot).toBe("checkbox-field");
    expect(ref.current?.contains(checkbox)).toBe(true);
    expect(
      coreDocuments.checkbox.apiSections?.find(
        (section) => section.title === "CheckboxField API",
      )?.rows.map((row) => row.name),
    ).toEqual(expect.arrayContaining(["children", "...label props", "ref"]));
  });

  it("documents AvatarImage and AvatarFallback as Avatar compound anatomy", () => {
    render(
      <Avatar>
        <AvatarFallback>GU</AvatarFallback>
      </Avatar>,
    );

    expect(screen.getByText("GU")).toBeTruthy();
    const sections = coreDocuments.avatar.apiSections?.map((section) => section.title) ?? [];
    expect(sections).toEqual(
      expect.arrayContaining(["AvatarImage API", "AvatarFallback API"]),
    );
    expect(coreDocuments.avatar.code).toContain("AvatarImage");
    expect(coreDocuments.avatar.code).toContain("AvatarFallback");
  });

  it("retains Divider as a ref-safe compatibility sibling of Separator", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Divider ref={ref} orientation="vertical" data-testid="divider" />);

    const divider = screen.getByTestId("divider");
    expect(ref.current).toBe(divider);
    expect(divider.getAttribute("role")).toBe("separator");
    expect(divider.getAttribute("aria-orientation")).toBe("vertical");
    expect(divider.dataset.slot).toBe("divider");
    expect(
      coreDocuments.separator.apiSections?.find(
        (section) => section.title === "Divider compatibility API",
      ),
    ).toBeTruthy();
  });
});
