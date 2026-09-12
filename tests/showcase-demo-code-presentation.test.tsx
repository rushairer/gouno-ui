import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DemoSection } from "../showcase/components/demo-section";
import { canonicalExampleSource } from "../showcase/demos/shared/example-source";

const pairedLayerDemoFiles = [
  "showcase/demos/theme/system.tsx",
  "showcase/demos/patterns/bulk-action-bar.tsx",
  "showcase/demos/gouno/components.tsx",
  "showcase/demos/gouno/page-header.tsx",
] as const;

describe("Showcase Demo + Code presentation", () => {
  it("switches a canonical example between preview and code", async () => {
    const user = userEvent.setup();
    render(
      <DemoSection title="Example" code={'<Button>Save</Button>'}>
        <span>Rendered preview</span>
      </DemoSection>,
    );

    expect(screen.getByText("Rendered preview")).toBeTruthy();
    expect(
      screen.getByRole("tab", { name: "Preview" }).getAttribute("aria-selected"),
    ).toBe("true");

    await user.click(screen.getByRole("tab", { name: "Code" }));

    expect(screen.queryByText("Rendered preview")).toBeNull();
    expect(
      screen.getByRole("tab", { name: "Code" }).getAttribute("aria-selected"),
    ).toBe("true");
    expect(screen.getByRole("button", { name: "复制代码" })).toBeTruthy();
  });

  it("rewrites only repository-relative example imports to public package entries", () => {
    const source = [
      'import { Button } from "../../../src/core";',
      'import { ThemeToggle } from "../../../src/theme";',
      'import { BulkActionBar } from "../../../src/patterns";',
      'import { PageHeader } from "../../../src/gouno";',
      "export default function Example() { return null; }",
    ].join("\n");

    expect(canonicalExampleSource(source)).toBe(
      [
        'import { Button } from "@gouno/ui/core";',
        'import { ThemeToggle } from "@gouno/ui/theme";',
        'import { BulkActionBar } from "@gouno/ui/patterns";',
        'import { PageHeader } from "@gouno/ui/gouno";',
        "export default function Example() { return null; }",
      ].join("\n"),
    );
  });

  it.each([
    "showcase/components/component-page.tsx",
    ...pairedLayerDemoFiles,
  ])("keeps %s on the shared DemoSection contract", (path) => {
    const source = readFileSync(resolve(process.cwd(), path), "utf8");
    expect(source).toContain("<DemoSection");
  });

  it.each(pairedLayerDemoFiles)(
    "pairs every Preview in %s with raw source from the same example module",
    (path) => {
      const source = readFileSync(resolve(process.cwd(), path), "utf8");
      const rawImports = [
        ...source.matchAll(
          /import\s+(\w+Source)\s+from\s+"(\.\/examples\/[^\"]+)\.tsx\?raw";/g,
        ),
      ];

      expect(rawImports.length).toBeGreaterThan(0);
      expect(source).toContain("canonicalExampleSource(");
      expect(source).not.toMatch(/const\s+\w*(?:Example)?Code\s*=\s*`/);

      for (const [, sourceIdentifier, moduleStem] of rawImports) {
        const componentIdentifier = sourceIdentifier.replace(/Source$/, "");
        expect(source).toContain(
          `import ${componentIdentifier} from "${moduleStem}";`,
        );
        expect(source).toMatch(
          new RegExp(`<${componentIdentifier}(?:\\s|\\/|>)`),
        );
        expect(source.split(sourceIdentifier).length - 1).toBeGreaterThanOrEqual(2);
      }
    },
  );
});
