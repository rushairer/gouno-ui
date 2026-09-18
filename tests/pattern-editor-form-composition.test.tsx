import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { showcaseCatalog } from "../showcase/catalog";
import { componentProgress } from "../showcase/catalog/component-progress";
import { PatternEditorFormCompositionDemo } from "../showcase/demos/patterns/editor-form-composition";

afterEach(cleanup);

describe("Editor Form composition contract", () => {
  it("publishes a reviewed Showcase-only contract without public runtime API", () => {
    const ids = showcaseCatalog
      .filter((group) => group.workspace === "gouno-ui" && group.layer === "patterns")
      .flatMap((group) => group.items.map((item) => item.id));
    const publicPatterns = readFileSync(resolve(process.cwd(), "src/patterns/index.ts"), "utf8");

    expect(ids).toContain("pattern-editor-form-composition");
    expect(componentProgress("pattern-editor-form-composition", 0)).toBe(100);
    expect(publicPatterns).not.toContain("EditorForm");
    expect(publicPatterns).not.toContain("FieldStack");
  });

  it("keeps form-wide feedback before sections and one terminal action boundary", () => {
    const { container } = render(<PatternEditorFormCompositionDemo />);
    const form = container.querySelector('[data-pattern="editor-form-composition"]');
    const alert = screen.getByRole("alert");
    const sections = container.querySelectorAll('[data-pattern="editor-form-section"]');
    const actions = container.querySelector('[data-pattern="editor-form-actions"]');

    expect(form).toBeTruthy();
    expect(sections).toHaveLength(2);
    expect(actions).toBeTruthy();
    expect(alert.compareDocumentPosition(sections[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(sections[1].compareDocumentPosition(actions!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("uses the same grammar when the fixture switches editor surface", () => {
    const { container } = render(<PatternEditorFormCompositionDemo />);
    fireEvent.click(screen.getByRole("radio", { name: "Dedicated" }));
    expect(screen.getByText(/Dedicated Editor/i)).toBeTruthy();
    expect(container.querySelectorAll('[data-pattern="editor-field-stack"]').length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector('[data-pattern="editor-form-actions"]')).toBeTruthy();
  });

  it("binds real product editor surfaces to the same form grammar", () => {
    const read = (path: string) =>
      readFileSync(resolve(process.cwd(), "showcase/demos/products", path), "utf8");
    const aiSettings = read("blog-admin/ai/settings/editors.tsx");
    const workflow = read("blog-admin/ai/operations/workflow-editor.tsx");
    const categories = read("blog-admin/categories.tsx");
    const clients = read("gosso-admin/system-management/clients.tsx");

    expect(aiSettings.match(/data-pattern="editor-form-composition"/g)).toHaveLength(5);
    expect(categories).toContain('data-pattern="editor-form-composition"');
    expect(clients).toContain('id="system-client-editor" data-pattern="editor-form-composition"');
    expect(workflow).toContain(
      '<div data-pattern="editor-form-composition" className="flex flex-col gap-5">',
    );

    const root = workflow.indexOf('data-pattern="editor-form-composition"');
    const layout = workflow.indexOf("<DedicatedEditorLayout", root);
    const actions = workflow.indexOf("<DedicatedEditorActions>", layout);
    expect(root).toBeGreaterThanOrEqual(0);
    expect(layout).toBeGreaterThan(root);
    expect(actions).toBeGreaterThan(layout);
  });

  it("documents the cross-surface ownership boundary", () => {
    const governance = readFileSync(resolve(process.cwd(), "docs/product-interface-governance.md"), "utf8");
    const design = readFileSync(resolve(process.cwd(), "docs/design-language.md"), "utf8");
    const contract = readFileSync(resolve(process.cwd(), "docs/patterns/editor-form-composition.md"), "utf8");

    expect(governance).toContain("## PI-09 — Editor forms share one cross-surface composition grammar");
    expect(design).toContain("## DL-16 — Bounded business sections use canonical surface anatomy");
    expect(contract).toContain("Modal");
    expect(contract).toContain("Drawer");
    expect(contract).toContain("Dedicated Editor");
  });
});
