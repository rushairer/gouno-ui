import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();

describe("dead migration hook regressions", () => {
  it("does not restore the no-op FormActions surface hook", () => {
    const form = readFileSync(resolve(repoRoot, "src/core/form.tsx"), "utf8");
    expect(form).not.toContain("form-actions--surface");
    expect(form).not.toContain("surface?: boolean");
  });
});
