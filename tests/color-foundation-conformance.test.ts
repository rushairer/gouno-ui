import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Color Foundation conformance", () => {
  it("owns browser chrome color through the semantic background token", () => {
    const provider = source("src/theme/provider.tsx");

    expect(provider).toContain('getPropertyValue("--background").trim()');
    expect(provider).toContain("syncBrowserThemeColor(root);");
    expect(provider).not.toContain('"#11151b"');
    expect(provider).not.toContain('"#ffffff"');
  });

  it("defines an overlay foreground role for copy rendered on the overlay", () => {
    const tokens = source("src/tokens.css");
    const image = source("src/core/image.tsx");

    expect(tokens).toContain("--color-overlay-foreground: var(--overlay-foreground);");
    expect(tokens).toContain("--overlay-foreground: #ffffff;");
    expect(image).toContain("text-overlay-foreground");
    expect(image).not.toContain("text-white");
  });

  it("uses semantic foreground alpha for Alert close hover", () => {
    const alert = source("src/core/alert.tsx");

    expect(alert).toContain("hover:bg-foreground/5");
    expect(alert).toContain("dark:hover:bg-foreground/10");
    expect(alert).not.toContain("hover:bg-black/");
    expect(alert).not.toContain("hover:bg-white/");
  });

  it("keeps fixed generated-media and caller-owned color APIs explicit", () => {
    const qrcode = source("src/core/qrcode.tsx");
    const tag = source("src/core/tag.tsx");
    const badge = source("src/core/badge.tsx");
    const timeline = source("src/core/timeline.tsx");

    expect(qrcode).toContain('color = "#000000"');
    expect(qrcode).toContain('background = "#ffffff"');
    expect(tag).toContain("backgroundColor: selected || semanticColor ? undefined : color");
    expect(badge).toContain("backgroundColor: color");
    expect(timeline).toContain('"--timeline-color": color');
  });
});
