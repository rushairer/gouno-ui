import { describe, expect, it } from "vitest";
import { showcaseCatalog } from "../showcase/catalog";
import { componentProgress } from "../showcase/catalog/component-progress";

describe("AI suggestion Pattern Showcase registration", () => {
  it("publishes both admitted AI suggestion Patterns as reviewed Showcase pages", () => {
    const ids = showcaseCatalog
      .filter((group) => group.workspace === "gouno-ui" && group.layer === "patterns")
      .flatMap((group) => group.items.map((item) => item.id));

    expect(ids).toContain("pattern-ai-suggestion-picker");
    expect(ids).toContain("pattern-ai-suggestion-review");
    expect(componentProgress("pattern-ai-suggestion-picker", 0)).toBe(100);
    expect(componentProgress("pattern-ai-suggestion-review", 0)).toBe(100);
  });
});
