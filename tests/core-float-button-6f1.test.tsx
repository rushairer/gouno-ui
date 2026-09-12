import * as React from "react";
import { readFileSync } from "node:fs";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FloatButton } from "../src/core";
import { componentProgress } from "../showcase/catalog/component-progress";
import { otherDocuments } from "../showcase/demos/core/other";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => vi.stubGlobal("ResizeObserver", ResizeObserverStub));
afterAll(() => vi.unstubAllGlobals());
afterEach(cleanup);

describe("FloatButton 6F1", () => {
  it("uses real button semantics, standard DOM props, native event data, and the real root ref", () => {
    const ref = React.createRef<HTMLButtonElement | HTMLAnchorElement>();
    let clickedTag = "";
    render(
      <FloatButton
        ref={ref}
        icon={<span data-testid="float-icon">+</span>}
        aria-label="新建内容"
        data-probe="button"
        onClick={(event) => {
          clickedTag = event.currentTarget.tagName;
        }}
      />,
    );

    const button = screen.getByRole("button", { name: "新建内容" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("data-slot")).toBe("float-button");
    expect(button.getAttribute("data-probe")).toBe("button");
    expect(ref.current).toBe(button);
    expect(screen.getByTestId("float-icon").parentElement?.getAttribute("aria-hidden")).toBe("true");

    fireEvent.click(button);
    expect(clickedTag).toBe("BUTTON");
  });

  it("switches href mode to a real anchor and preserves navigation attributes", () => {
    const ref = React.createRef<HTMLButtonElement | HTMLAnchorElement>();
    render(
      <FloatButton
        ref={ref}
        icon={<span>↗</span>}
        href="#details"
        target="_self"
        rel="nofollow"
        download="details.txt"
        aria-label="查看详情"
      />,
    );

    const link = screen.getByRole("link", { name: "查看详情" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("#details");
    expect(link.getAttribute("target")).toBe("_self");
    expect(link.getAttribute("rel")).toBe("nofollow");
    expect(link.getAttribute("download")).toBe("details.txt");
    expect(ref.current).toBe(link);
  });

  it("maps disabled link mode to aria-disabled and blocks navigation callbacks", () => {
    const onClick = vi.fn();
    render(
      <FloatButton
        icon={<span>↗</span>}
        href="#details"
        disabled
        aria-label="查看详情"
        onClick={onClick}
      />,
    );

    const link = screen.getByRole("link", { name: "查看详情" });
    expect(link.getAttribute("aria-disabled")).toBe("true");
    expect(link.getAttribute("tabindex")).toBe("-1");
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders ReactNode tooltip content without using it as an implicit accessible name", async () => {
    render(
      <FloatButton
        icon={<span>?</span>}
        aria-label="帮助"
        tooltip={<span>查看帮助说明</span>}
      />,
    );

    const button = screen.getByRole("button", { name: "帮助" });
    fireEvent.focus(button);
    await waitFor(() => {
      expect(screen.getByRole("tooltip").textContent).toContain("查看帮助说明");
    });
  });

  it("does not inject a BackTop arrow into the generic component", () => {
    const source = readFileSync("src/core/float-button.tsx", "utf8");
    expect(source).not.toContain('"↑"');
    expect(source).not.toContain("icon ||");
  });

  it("keeps Preview/Code executable, documents the owned API, and marks reviewed complete", () => {
    const document = otherDocuments["float-button"];
    const names = document.api?.map((row) => row.name) ?? [];

    expect(document.code).toContain("<FloatButton");
    expect(document.code).toContain('aria-label="新建内容"');
    expect(document.code).toContain('href="#float-button-target"');
    expect(names).toEqual(
      expect.arrayContaining([
        "icon",
        "tooltip",
        "href",
        "target",
        "rel",
        "download",
        "disabled",
        "type",
        "ref",
      ]),
    );
    expect(componentProgress("core-float-button", 65)).toBe(100);
  });
});
