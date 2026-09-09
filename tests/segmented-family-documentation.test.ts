import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { segmentedDocuments } from "../showcase/demos/core/segmented";

describe("Segmented family documentation", () => {
  it("binds every Segmented Preview to a same-stem raw source module", () => {
    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/core/segmented.tsx"),
      "utf8",
    );
    const rawImports = [
      ...source.matchAll(
        /import\s+(\w+Source)\s+from\s+"(\.\/segmented\/[^\"]+)\.tsx\?raw";/g,
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

  it("shows controlled state, labels and numeric form semantics exactly as rendered", () => {
    const demos = new Map(
      segmentedDocuments.segmented.demos?.map((demo) => [demo.title, demo.code]) ?? [],
    );

    expect(demos.get("受控状态与图标")).toContain("const viewOptions");
    expect(demos.get("受控状态与图标")).toContain("当前值：{value}");
    expect(demos.get("尺寸与圆角")).toContain('aria-label="大尺寸圆角"');
    expect(demos.get("Block 与垂直方向")).toContain('aria-label="垂直导航"');
    expect(demos.get("数字值与表单 name")).toContain('name="page-size"');
    expect(demos.get("数字值与表单 name")).toContain("defaultValue={20}");
  });
});
