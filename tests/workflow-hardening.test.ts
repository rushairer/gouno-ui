import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const workflowPath = resolve(
  process.cwd(),
  ".github/workflows/showcase-pages.yml",
);

function workflow() {
  return readFileSync(workflowPath, "utf8");
}

describe("delivery workflow hardening", () => {
  it("pins every action dependency to an immutable commit SHA", () => {
    const actionRefs = [...workflow().matchAll(/^\s*uses:\s+([^\s#]+)(?:\s+#.*)?$/gm)]
      .map((match) => match[1]);

    expect(actionRefs.length).toBeGreaterThan(0);
    for (const ref of actionRefs) {
      expect(ref).toMatch(/^[^@]+@[0-9a-f]{40}$/);
    }
  });

  it("runs verification on the supported Node 24 baseline", () => {
    expect(workflow()).toMatch(/^\s*node-version:\s*24\s*$/m);
  });

  it("keeps the full package and Showcase verification gate before publishing", () => {
    const source = workflow();
    for (const command of [
      "npm run typecheck",
      "npm test -- --run",
      "npm run build",
      "npm run showcase:build",
    ]) {
      expect(source).toContain(command);
    }
    expect(source.indexOf("npm run showcase:build")).toBeLessThan(
      source.indexOf("Publish static Showcase to gh-pages"),
    );
  });
});
