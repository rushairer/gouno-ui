import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Sizing Foundation conformance", () => {
  it("defines one canonical ControlSize outer-height token scale", () => {
    const tokens = source("src/tokens.css");

    expect(tokens).toContain("--control-height-small: 2rem;");
    expect(tokens).toContain("--control-height-middle: 2.25rem;");
    expect(tokens).toContain("--control-height-large: 2.75rem;");
    expect(tokens).not.toContain(".control-height-small");
    expect(tokens).not.toContain(".control-square-small");
    expect(tokens).not.toContain(".control-inset-height-small");
  });

  it("keeps standard controls, Button, OTP and Segmented on merge-aware token references", () => {
    const controlTypes = source("src/core/control-types.ts");
    const coreButton = source("src/core/button.tsx");
    const primitiveButton = source("src/components/primitives/button.tsx");
    const otp = source("src/core/input-otp.tsx");
    const segmented = source("src/core/segmented.tsx");

    expect(controlTypes).toContain('small: "h-[var(--control-height-small)] text-sm"');
    expect(controlTypes).toContain('middle: "h-[var(--control-height-middle)] text-sm"');
    expect(controlTypes).toContain('large: "h-[var(--control-height-large)] text-base"');
    expect(controlTypes).not.toMatch(/\bh-(?:8|9|11)\b/);

    expect(coreButton).toContain("export type ButtonSize = ControlSize;");
    expect(primitiveButton).toContain('sm: "h-[var(--control-height-small)]');
    expect(primitiveButton).toContain('default: "h-[var(--control-height-middle)]');
    expect(primitiveButton).toContain('lg: "h-[var(--control-height-large)]');
    expect(primitiveButton).toContain('icon: "size-[var(--control-height-middle)]"');
    expect(primitiveButton).not.toContain('lg: "h-10');

    expect(otp).toContain('small: "size-[var(--control-height-small)]');
    expect(otp).toContain('middle: "size-[var(--control-height-middle)]');
    expect(otp).toContain('large: "size-[var(--control-height-large)]');

    expect(segmented).toContain(
      'small: "h-[calc(var(--control-height-small)-0.25rem)]',
    );
    expect(segmented).toContain(
      'middle: "h-[calc(var(--control-height-middle)-0.25rem)]',
    );
    expect(segmented).toContain(
      'large: "h-[calc(var(--control-height-large)-0.25rem)]',
    );
  });
});
