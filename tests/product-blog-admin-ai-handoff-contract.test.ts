import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const productsRoot = resolve(repoRoot, "showcase/demos/products/blog-admin");
const collectionFiles = [
  "posts.tsx",
  "pages.tsx",
  "categories.tsx",
  "tags.tsx",
  "comments.tsx",
  "media-library.tsx",
] as const;

describe("Blog Admin selected-resource AI handoff contract", () => {
  it("uses Sparkles for the same 交给 AI action across sibling Collections", () => {
    for (const path of collectionFiles) {
      const source = readFileSync(resolve(productsRoot, path), "utf8");
      const labelIndex = source.indexOf("交给 AI");
      expect(labelIndex, path).toBeGreaterThanOrEqual(0);

      const buttonStart = source.lastIndexOf("<Button", labelIndex);
      const buttonEnd = source.indexOf("</Button>", labelIndex);
      expect(buttonStart, path).toBeGreaterThanOrEqual(0);
      expect(buttonEnd, path).toBeGreaterThan(labelIndex);

      const buttonSource = source.slice(buttonStart, buttonEnd + "</Button>".length);
      expect(buttonSource, path).toContain("icon={<Sparkles />}");
      expect(buttonSource, path).not.toContain("icon={<Bot />}");
    }
  });

  it("keeps the semantic icon rule documented", () => {
    const grammar = readFileSync(
      resolve(repoRoot, "docs/microcopy-action-grammar.md"),
      "utf8",
    );

    expect(grammar).toContain("AI action icons follow action semantics");
    expect(grammar).toContain("交给 AI");
    expect(grammar).toContain("Sparkles");
    expect(grammar).toContain("Bot");
  });
});
