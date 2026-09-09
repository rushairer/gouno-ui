import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { alertDocuments } from "../showcase/demos/core/alert";

describe("Alert family documentation", () => {
  it("binds every Alert Preview to a same-stem raw source module", () => {
    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/core/alert.tsx"),
      "utf8",
    );
    const rawImports = [
      ...source.matchAll(
        /import\s+(\w+Source)\s+from\s+"(\.\/alert\/[^\"]+)\.tsx\?raw";/g,
      ),
    ];

    expect(rawImports).toHaveLength(6);
    expect(source).not.toContain("const basicCode");
    expect(source).not.toContain("const closableCode");
    expect(source).not.toContain("const boundaryCode");

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

  it("shows the exact interactive closable implementation in Code", () => {
    const closable = alertDocuments.alert.demos?.find(
      (demo) => demo.title === "操作与关闭生命周期",
    );
    expect(closable).toBeTruthy();
    expect(closable?.code).toContain("const [status, setStatus]");
    expect(closable?.code).toContain('onClose: () => setStatus("正在关闭")');
    expect(closable?.code).toContain('afterClose: () => setStatus("已关闭")');
    expect(closable?.code).toContain("重新显示");
  });

  it("keeps Banner, Semantic DOM and ErrorBoundary Code equal to their real demos", () => {
    const demos = new Map(
      alertDocuments.alert.demos?.map((demo) => [demo.title, demo.code]) ?? [],
    );

    expect(demos.get("Banner 与视觉变体")).toContain(
      'description="Filled 使用更明确的语义色背景。"',
    );
    expect(demos.get("自定义图标与 Semantic DOM")).toContain(
      'classNames={{ title: "font-mono", actions: "self-center" }}',
    );
    expect(demos.get("ErrorBoundary")).toContain("const [broken, setBroken]");
    expect(demos.get("ErrorBoundary")).toContain("<BrokenWidget />");
    expect(demos.get("ErrorBoundary")).toContain("重置边界");
  });
});
