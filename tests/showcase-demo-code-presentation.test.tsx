import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DemoSection } from "../showcase/components/demo-section";

describe("Showcase Demo + Code presentation", () => {
  it("switches a canonical example between preview and code", async () => {
    const user = userEvent.setup();
    render(
      <DemoSection title="Example" code={'<Button>Save</Button>'}>
        <span>Rendered preview</span>
      </DemoSection>,
    );

    expect(screen.getByText("Rendered preview")).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Preview" }).getAttribute("aria-selected")).toBe("true");

    await user.click(screen.getByRole("tab", { name: "Code" }));

    expect(screen.queryByText("Rendered preview")).toBeNull();
    expect(screen.getByRole("tab", { name: "Code" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("button", { name: "复制代码" })).toBeTruthy();
  });

  it.each([
    "showcase/components/component-page.tsx",
    "showcase/demos/theme-system.tsx",
    "showcase/demos/pattern-bulk-action-bar.tsx",
    "showcase/demos/gouno-components.tsx",
    "showcase/demos/gouno-page-header.tsx",
  ])("keeps %s on the shared DemoSection contract", (path) => {
    const source = readFileSync(resolve(process.cwd(), path), "utf8");
    expect(source).toContain("<DemoSection");
  });
});