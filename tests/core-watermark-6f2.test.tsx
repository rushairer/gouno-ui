import * as React from "react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Watermark } from "../src/core";
import { componentProgress } from "../showcase/component-progress";
import { otherDocuments } from "../showcase/demos/core/other";

afterEach(cleanup);

function decodedWatermark(root: HTMLElement) {
  const value = root.style.backgroundImage;
  const prefix = "data:image/svg+xml,";
  const start = value.indexOf(prefix);
  if (start < 0) throw new Error("watermark data URL missing");

  let encoded = value.slice(start + prefix.length);
  if (encoded.endsWith('\")')) encoded = encoded.slice(0, -2);
  else if (encoded.endsWith(")")) encoded = encoded.slice(0, -1);
  return decodeURIComponent(encoded);
}

describe("Watermark 6F2", () => {
  it("forwards standard root props and the real div ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <Watermark
        ref={ref}
        content="评审"
        data-probe="watermark"
        className="custom-watermark"
      >
        <span>正文</span>
      </Watermark>,
    );

    const root = container.querySelector<HTMLElement>('[data-slot="watermark"]')!;
    expect(root.tagName).toBe("DIV");
    expect(root.getAttribute("data-probe")).toBe("watermark");
    expect(root.className).toContain("custom-watermark");
    expect(ref.current).toBe(root);
    expect(root.textContent).toContain("正文");
  });

  it("escapes caller content as XML text before encoding the SVG background", () => {
    const { container } = render(
      <Watermark content="<draft & review>">
        <span>正文</span>
      </Watermark>,
    );
    const root = container.querySelector<HTMLElement>('[data-slot="watermark"]')!;
    const svg = decodedWatermark(root);

    expect(svg).toContain("&lt;draft &amp; review&gt;");
    expect(svg).not.toContain("<draft & review>");
  });

  it("normalizes unsafe numeric inputs to a finite tile, rotation, and opacity", () => {
    const { container } = render(
      <Watermark content="评审" gap={-5} rotate={Number.NaN} opacity={7}>
        <span>正文</span>
      </Watermark>,
    );
    const root = container.querySelector<HTMLElement>('[data-slot="watermark"]')!;
    const svg = decodedWatermark(root);

    expect(svg).toContain('width="32"');
    expect(svg).toContain('height="32"');
    expect(svg).toContain("rotate(-22 16 16)");
    expect(svg).toContain("rgba(0,0,0,1)");
  });

  it("allows an explicit caller style to override the generated background", () => {
    const { container } = render(
      <Watermark content="评审" style={{ backgroundImage: "none" }}>
        <span>正文</span>
      </Watermark>,
    );
    const root = container.querySelector<HTMLElement>('[data-slot="watermark"]')!;
    expect(root.style.backgroundImage).toBe("none");
  });

  it("removes the Gouno brand default and keeps Preview/Code reviewed from executable source", () => {
    const source = readFileSync("src/core/watermark.tsx", "utf8");
    const document = otherDocuments.watermark;
    const names = document.api?.map((row) => row.name) ?? [];

    expect(source).not.toContain('content = "Gouno"');
    expect(document.code).toContain('content="仅供内部评审"');
    expect(document.code).toContain("<Watermark");
    expect(names).toEqual(
      expect.arrayContaining([
        "content",
        "children",
        "rotate",
        "gap",
        "opacity",
        "ref",
      ]),
    );
    expect(componentProgress("core-watermark", 70)).toBe(100);
  });
});
