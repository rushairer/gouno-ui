import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Descriptions, Image, List } from "../src/core";

describe("Core Data Display foundations", () => {
  beforeEach(() => {
    document.documentElement.lang = "en";
  });

  it("renders List with stable row keys, structural states and localized empty content", () => {
    const { rerender } = render(
      <List
        dataSource={[
          { id: 0, label: "Zero" },
          { id: 1, label: "One" },
        ]}
        rowKey="id"
        bordered
        header="Header"
        footer="Footer"
        renderItem={(item) => <span>{item.label}</span>}
      />,
    );

    expect(screen.getByText("Zero")).toBeTruthy();
    expect(screen.getByText("One")).toBeTruthy();
    expect(document.querySelectorAll('[data-slot="list-item"]')).toHaveLength(2);
    expect(document.querySelector('[data-slot="list"]')?.getAttribute("data-bordered")).toBe("true");

    rerender(
      <List<{ id: number; label: string }>
        dataSource={[]}
        rowKey="id"
        loading
        locale={{ emptyText: "Nothing queued" }}
        renderItem={(item) => <span>{item.label}</span>}
      />,
    );

    expect(screen.getByText("Nothing queued")).toBeTruthy();
    expect(document.querySelector('[data-slot="spin"]')?.getAttribute("aria-busy")).toBe("true");
  });

  it("rejects a List rowKey that does not resolve to a React key", () => {
    expect(() =>
      render(
        <List
          dataSource={[{ meta: { id: 1 } }]}
          rowKey="meta"
          renderItem={() => <span>Invalid</span>}
        />,
      ),
    ).toThrow(/rowKey/);
  });

  it("renders keyed responsive Descriptions without losing falsy values", () => {
    render(
      <Descriptions
        title="Build"
        extra="Stable"
        bordered
        column={{ xs: 1, md: 2 }}
        items={[
          { key: "count", label: "Count", children: 0 },
          {
            key: "note",
            label: "Note",
            children: "Full width",
            span: "filled",
          },
        ]}
      />,
    );

    expect(screen.getByText("Build")).toBeTruthy();
    expect(screen.getByText("Stable")).toBeTruthy();
    expect(screen.getByText("0")).toBeTruthy();
    expect(screen.getByText("Count").parentElement?.textContent).toContain(":");
    expect(screen.getByText("Full width").closest('[data-slot="descriptions-item"]')?.className).toContain("col-span-full");
  });

  it("uses Image fallback URL before exposing the terminal accessible failure state", () => {
    render(
      <Image
        src="/primary.png"
        fallback="/fallback.png"
        alt="Asset"
        preview={false}
      />,
    );

    const primary = screen.getByRole("img", { name: "Asset" }) as HTMLImageElement;
    expect(primary.getAttribute("src")).toBe("/primary.png");
    fireEvent.error(primary);

    const fallback = screen.getByRole("img", { name: "Asset" }) as HTMLImageElement;
    expect(fallback.getAttribute("src")).toBe("/fallback.png");
    fireEvent.error(fallback);

    expect(screen.getByRole("img", { name: "Asset" }).tagName).toBe("SPAN");
  });

  it("opens Image preview and reports toolbar transforms", () => {
    const onTransform = vi.fn();
    const { container } = render(
      <Image
        src="/preview.png"
        alt="Preview asset"
        preview={{ onTransform, maxScale: 4 }}
      />,
    );

    const thumbnail = screen.getByRole("img", { name: "Preview asset" });
    fireEvent.load(thumbnail);
    fireEvent.click(screen.getByRole("button", { name: "Preview Preview asset" }));

    expect(screen.getByRole("img", { name: "Preview asset" }).getAttribute("data-slot")).toBe(
      "image-preview-image",
    );
    expect(container.getAttribute("aria-hidden")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(onTransform).toHaveBeenLastCalledWith(
      expect.objectContaining({ action: "zoomIn" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Rotate right" }));
    expect(onTransform).toHaveBeenLastCalledWith(
      expect.objectContaining({ action: "rotateRight" }),
    );
  });
});
