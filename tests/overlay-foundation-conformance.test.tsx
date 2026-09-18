import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Drawer, Modal } from "../src/core";

const root = resolve(process.cwd());
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

afterEach(cleanup);

describe("Overlay / Layering Foundation", () => {
  it("defines one semantic application-global Layer scale", () => {
    const tokens = read("src/tokens.css");

    for (const marker of [
      "--layer-sticky: 20;",
      "--layer-shell: 30;",
      "--layer-floating: 40;",
      "--layer-modal: 50;",
      "--layer-popup: 60;",
      "--layer-notice: 100;",
      "@utility layer-sticky",
      "@utility layer-shell",
      "@utility layer-floating",
      "@utility layer-modal",
      "@utility layer-popup",
      "@utility layer-notice",
    ]) {
      expect(tokens).toContain(marker);
    }
  });

  it("keeps governed global surfaces on semantic Layer roles", () => {
    const expectations: Record<string, string[]> = {
      "src/components/primitives/dialog.tsx": ["layer-modal"],
      "src/components/primitives/sheet.tsx": ["layer-modal"],
      "src/components/primitives/alert-dialog.tsx": ["layer-modal"],
      "src/components/primitives/popover.tsx": ["layer-popup"],
      "src/components/primitives/dropdown-menu.tsx": ["layer-popup"],
      "src/components/primitives/tooltip.tsx": ["layer-popup"],
      "src/components/primitives/select.tsx": ["layer-popup"],
      "src/core/menu.tsx": ["layer-popup"],
      "src/core/autocomplete.tsx": ["layer-popup"],
      "src/core/mentions.tsx": ["layer-popup"],
      "src/core/message.tsx": ["layer-notice"],
      "src/core/notification.tsx": ["layer-notice"],
      "src/core/affix.tsx": ["layer-sticky", "layer-floating"],
      "src/core/float-button.tsx": ["layer-floating"],
      "src/gouno/app-shell.tsx": ["layer-shell", "layer-popup"],
      "src/patterns/bulk-action-bar.tsx": ["layer-sticky"],
      "showcase/demos/products/blog/public-shell.tsx": ["layer-shell"],
      "showcase/demos/products/blog/article-detail.tsx": ["layer-shell"],
    };

    for (const [path, roles] of Object.entries(expectations)) {
      const source = read(path);
      for (const role of roles) expect(source, `${path}: ${role}`).toContain(role);
      expect(source, path).not.toMatch(/\bz-(?:30|40|50|\[100\])\b/);
    }
  });

  it("keeps Carousel z-20 explicitly local instead of treating it as a global layer", () => {
    const carousel = read("src/core/carousel.tsx");
    const inventory = read("docs/foundation-overlay-inventory.md");
    expect(carousel).toContain("absolute inset-0 z-20");
    expect(inventory).toContain("component-internal stacking");
  });

  it("lets explicit Modal/Drawer zIndex override mask and content together", () => {
    for (const Component of [Modal, Drawer]) {
      cleanup();
      render(
        <Component open title="Layer override" zIndex={1200}>
          Body
        </Component>,
      );

      const dialog = screen.getByRole("dialog") as HTMLElement;
      const overlay = document.querySelector(
        Component === Modal
          ? '[data-slot="dialog-overlay"]'
          : '[data-slot="sheet-overlay"]',
      ) as HTMLElement | null;

      expect(dialog.style.zIndex).toBe("1200");
      expect(overlay?.style.zIndex).toBe("1200");
    }

    expect(read("src/core/modal.tsx")).not.toContain("zIndex = 50");
    expect(read("src/core/drawer.tsx")).not.toContain("zIndex = 50");
  });

  it("keeps Showcase tooling outside the runtime Layer scale", () => {
    const fixtureTools = read("showcase/components/fixture-tools.tsx");
    const standaloneNavigation = read("showcase/components/standalone-navigation.tsx");
    const styles = read("showcase/styles/showcase.css");

    expect(fixtureTools).toContain("showcase-layer-tools");
    expect(standaloneNavigation).toContain("showcase-layer-tools");
    expect(styles).toContain("--showcase-layer-tools: 1000;");
    expect(styles).toContain("z-index: var(--showcase-layer-tools);");
  });
});
