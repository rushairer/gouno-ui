import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Sizing Foundation conformance", () => {
  it("defines one canonical ControlSize outer-height scale", () => {
    const tokens = source("src/tokens.css");

    expect(tokens).toContain("--control-height-small: 2rem;");
    expect(tokens).toContain("--control-height-middle: 2.25rem;");
    expect(tokens).toContain("--control-height-large: 2.75rem;");

    for (const size of ["small", "middle", "large"]) {
      expect(tokens).toContain(`.control-height-${size}`);
      expect(tokens).toContain(`.control-square-${size}`);
      expect(tokens).toContain(`.control-inset-height-${size}`);
    }
  });

  it("keeps standard controls, Button, OTP and Segmented on that authority", () => {
    const controlTypes = source("src/core/control-types.ts");
    const coreButton = source("src/core/button.tsx");
    const primitiveButton = source("src/components/primitives/button.tsx");
    const otp = source("src/core/input-otp.tsx");
    const segmented = source("src/core/segmented.tsx");

    expect(controlTypes).toContain('small: "control-height-small text-sm"');
    expect(controlTypes).toContain('middle: "control-height-middle text-sm"');
    expect(controlTypes).toContain('large: "control-height-large text-base"');
    expect(controlTypes).not.toMatch(/\bh-(?:8|9|11)\b/);

    expect(coreButton).toContain("export type ButtonSize = ControlSize;");
    expect(primitiveButton).toContain('sm: "control-height-small');
    expect(primitiveButton).toContain('default: "control-height-middle');
    expect(primitiveButton).toContain('lg: "control-height-large');
    expect(primitiveButton).not.toContain('lg: "h-10');

    expect(otp).toContain('small: "control-square-small');
    expect(otp).toContain('middle: "control-square-middle');
    expect(otp).toContain('large: "control-square-large');

    expect(segmented).toContain('small: "control-inset-height-small');
    expect(segmented).toContain('middle: "control-inset-height-middle');
    expect(segmented).toContain('large: "control-inset-height-large');
  });
});
