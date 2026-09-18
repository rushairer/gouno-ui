import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { showcaseCatalog } from "../showcase/catalog";
import { componentProgress, componentReviews } from "../showcase/catalog/component-progress";
import { PatternDedicatedEditorDemo } from "../showcase/demos/patterns/dedicated-editor";

afterEach(cleanup);

describe("Dedicated Editor composition pattern", () => {
  it("keeps the Showcase composition contract visible while Foundation review is reopened", () => {
    const ids = showcaseCatalog
      .filter((group) => group.workspace === "gouno-ui" && group.layer === "patterns")
      .flatMap((group) => group.items.map((item) => item.id));
    const publicPatterns = readFileSync(resolve(process.cwd(), "src/patterns/index.ts"), "utf8");

    expect(ids).toContain("pattern-dedicated-editor");
    expect(componentReviews["pattern-dedicated-editor"]?.status).toBe("reopened");
    expect(componentProgress("pattern-dedicated-editor", 0)).toBeLessThan(100);
    expect(publicPatterns).not.toContain("DedicatedEditor");
  });

  it("shows Configuration Editor as the canonical deep asset editor", () => {
    const { container } = render(<PatternDedicatedEditorDemo />);

    expect(screen.getByRole("heading", { level: 1, name: "Dedicated Editor 专用编辑器" })).toBeTruthy();
    expect(screen.getByText("Showcase-only")).toBeTruthy();
    expect(container.querySelector('[data-pattern="dedicated-editor-lead"]')).toBeTruthy();
    expect(container.querySelector('[data-pattern="dedicated-editor-layout"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-pattern="dedicated-editor-section"]').length).toBeGreaterThanOrEqual(4);
    expect(screen.getByRole("button", { name: "返回资产详情" })).toBeTruthy();
  });

  it("demonstrates Workspace Editor as a distinct Dedicated Editor subtype", () => {
    const { container } = render(<PatternDedicatedEditorDemo />);

    fireEvent.click(screen.getByRole("radio", { name: "Workspace" }));
    expect(container.querySelector('[data-slot="document-editor-shell"]')).toBeTruthy();
    expect(screen.getByRole("button", { name: "返回内容列表" })).toBeTruthy();
    expect(screen.getByRole("main", { name: "文档编辑画布" })).toBeTruthy();
    expect(screen.getByRole("complementary", { name: "文档属性" })).toBeTruthy();
  });

  it("keeps create/edit state and feedback inside the canonical Configuration skeleton", () => {
    render(<PatternDedicatedEditorDemo />);

    fireEvent.click(screen.getByRole("radio", { name: "Create" }));
    expect(screen.getByRole("heading", { level: 2, name: "创建自动化资产" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "返回资产列表" })).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "Error" }));
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("保存失败")).toBeTruthy();
  });
});
