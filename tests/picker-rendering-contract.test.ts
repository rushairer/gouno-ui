import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const source = (path: string) =>
  readFileSync(resolve(root, path), "utf8");

describe("visible picker rendering contract", () => {
  it("keeps Cascader and Pagination free of visible native select popups", () => {
    expect(source("src/core/cascader.tsx")).not.toContain("<select");
    expect(source("src/core/pagination.tsx")).not.toContain("<select");
  });

  it("limits native select to hidden compatibility bridges", () => {
    for (const path of ["src/core/select.tsx", "src/core/tree-select.tsx"]) {
      const text = source(path);
      expect(text).toContain("<select");
      expect(text).toContain('aria-hidden="true"');
      expect(text).toContain("pointer-events-none");
      expect(text).toContain("opacity-0");
    }
  });

  it("keeps picker infrastructure private", () => {
    expect(source("src/core/index.ts")).not.toContain("picker-internals");
  });
});
