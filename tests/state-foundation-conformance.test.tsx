import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button, ChoiceButton, Input, Select } from "../src/core";

const root = resolve(process.cwd());
const source = (path: string) => readFileSync(resolve(root, path), "utf8");

afterEach(cleanup);

describe("Interaction State Foundation", () => {
  it("keeps action loading/selection semantics on the owning control", () => {
    render(
      <>
        <Button loading>Save</Button>
        <ChoiceButton selected>Preview</ChoiceButton>
      </>,
    );

    const save = screen.getByRole("button", { name: "Save" });
    expect((save as HTMLButtonElement).disabled).toBe(true);
    expect(save.getAttribute("aria-busy")).toBe("true");

    const preview = screen.getByRole("button", { name: "Preview" });
    expect(preview.getAttribute("aria-pressed")).toBe("true");
  });

  it("maps validation errors to aria-invalid without treating warnings as errors", () => {
    const { rerender } = render(<Input aria-label="Title" status="error" />);
    expect(
      screen.getByRole("textbox", { name: "Title" }).getAttribute("aria-invalid"),
    ).toBe("true");

    rerender(<Input aria-label="Title" status="warning" />);
    expect(
      screen.getByRole("textbox", { name: "Title" }).hasAttribute("aria-invalid"),
    ).toBe(false);
  });

  it("keeps Select state semantics on combobox/options", async () => {
    render(
      <Select aria-label="Status" defaultValue="draft" loading>
        <option value="draft">Draft</option>
        <option value="ready">Ready</option>
      </Select>,
    );

    const combobox = screen.getByRole("combobox", { name: "Status" });
    expect((combobox as HTMLButtonElement).disabled).toBe(true);
    expect(combobox.getAttribute("aria-busy")).toBe("true");
  });

  it("protects interactive descendants from Carousel drag pointer capture", () => {
    const carousel = source("src/core/carousel.tsx");
    expect(carousel).toContain("isInteractivePointerTarget(event.target)");
    expect(carousel).toContain("event.button !== 0");
    expect(carousel).toContain("!event.isPrimary");
    expect(carousel).toContain("releasePointerCapture(event.pointerId)");
    expect(carousel).toContain("onLostPointerCapture");
  });

  it("keeps Tag close hover on semantic/current foreground color", () => {
    const tag = source("src/core/tag.tsx");
    expect(tag).toContain("hover:bg-current/10");
    expect(tag).not.toMatch(/hover:bg-(?:black|white)\//);
  });

  it("does not encode state-specific outer geometry utilities in governed primitives", () => {
    const files = [
      "src/components/primitives/button.tsx",
      "src/components/primitives/checkbox.tsx",
      "src/components/primitives/radio-group.tsx",
      "src/components/primitives/switch.tsx",
      "src/components/primitives/tabs.tsx",
      "src/components/primitives/table.tsx",
      "src/core/button.tsx",
      "src/core/input.tsx",
      "src/core/select.tsx",
      "src/core/segmented.tsx",
      "src/core/tag.tsx",
    ];

    const stateGeometry =
      /(?:disabled|aria-invalid|data-\[state=[^\]]+\]|peer-checked|peer-disabled):(?:h-|w-|min-h-|min-w-|max-h-|max-w-|p[trblxyse]?-|m[trblxyse]?-|border-(?:[2-9]|\[[^\]]+\]))/;

    for (const path of files) {
      expect(source(path), path).not.toMatch(stateGeometry);
    }
  });
});
