import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buttonDocuments } from "../showcase/demos/core/button";

describe("Button family documentation", () => {
  it("binds every Button family Preview to a same-stem raw source module", () => {
    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/core/button.tsx"),
      "utf8",
    );
    const rawImports = [
      ...source.matchAll(
        /import\s+(\w+Source)\s+from\s+"(\.\/button\/[^\"]+)\.tsx\?raw";/g,
      ),
    ];

    expect(rawImports).toHaveLength(5);
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

  it("shows the exact state, router adapter and choice implementations in Code", () => {
    expect(buttonDocuments.button.code).toContain("const [action, setAction]");
    expect(buttonDocuments.button.code).toContain("最近操作：{action}");

    const demos = new Map(
      buttonDocuments.button.demos?.map((demo) => [demo.title, demo.code]) ?? [],
    );
    expect(demos.get("尺寸、语义状态与布局")).toContain(
      "setLoading((value) => !value)",
    );
    expect(demos.get("IconButton 与 IconButtonLink")).toContain(
      'label="查看图标文档"',
    );
    expect(demos.get("真实链接与路由适配")).toContain(
      "function DemoRouterLink",
    );
    expect(demos.get("真实链接与路由适配")).toContain('data-route={to}');
    expect(demos.get("ChoiceButton 二态选择")).toContain(
      'const [selected, setSelected] = useState("preview")',
    );
  });
});
