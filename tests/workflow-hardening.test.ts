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

  it("packs and uploads the exact verified package before Pages publication", () => {
    const source = workflow();
    const verifyIndex = source.indexOf("Verify package and Showcase");
    const packIndex = source.indexOf("Pack verified package");
    const uploadIndex = source.indexOf("Upload verified package artifact");
    const publishIndex = source.indexOf("Publish static Showcase to gh-pages");

    expect(packIndex).toBeGreaterThan(verifyIndex);
    expect(uploadIndex).toBeGreaterThan(packIndex);
    expect(publishIndex).toBeGreaterThan(uploadIndex);
    expect(source).toContain("npm pack --pack-destination package-artifacts");
    expect(source).toContain("name: gouno-ui-package-${{ github.sha }}");
    expect(source).toContain("path: package-artifacts/*.tgz");
    expect(source).toContain("if-no-files-found: error");
  });
});
