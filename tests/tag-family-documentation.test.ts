import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { tagDocuments } from "../showcase/demos/core/tag";

describe("Tag family documentation", () => {
  it("binds every Tag Preview to a same-stem raw source module", () => {
    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/core/tag.tsx"),
      "utf8",
    );
    const rawImports = [
      ...source.matchAll(
        /import\s+(\w+Source)\s+from\s+"(\.\/tag\/[^\"]+)\.tsx\?raw";/g,
      ),
    ];

    expect(rawImports).toHaveLength(6);
    expect(source).not.toMatch(/code:\s*`/);

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
  });

  it("shows the exact controlled and uncontrolled Tag state implementations in Code", () => {
    const demos = new Map(
      tagDocuments.tag.demos?.map((demo) => [demo.title, demo.code]) ?? [],
    );

    expect(tagDocuments.tag.code).toContain('import { Space, Tag } from "@gouno/ui/core"');
    expect(demos.get("可关闭标签")).toContain("const [visible, setVisible]");
    expect(demos.get("可关闭标签")).toContain("已恢复 Release 标签");
    expect(demos.get("受控可选标签")).toContain("const topicOptions");
    expect(demos.get("受控可选标签")).toContain("setSelected((current)");
    expect(demos.get("非受控可选标签")).toContain("defaultChecked");
    expect(demos.get("非受控可选标签")).toContain('align="start"');
  });
});
