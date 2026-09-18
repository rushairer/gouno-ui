import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  Collapse,
  Drawer,
  FormField,
  Modal,
  Select,
  Tag,
  Tree,
} from "../src/core";
import { AppShell, PageSkeleton } from "../src/gouno";

const root = resolve(process.cwd());
const source = (path: string) => readFileSync(resolve(root, path), "utf8");

function collectTsx(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTsx(path);
    return entry.isFile() && path.endsWith(".tsx") ? [path] : [];
  });
}

afterEach(() => {
  cleanup();
  document.documentElement.lang = "";
});

describe("Accessibility Foundation", () => {
  it("binds Field label, required, hint and error to the visible Select combobox", () => {
    render(
      <FormField label="状态" hint="请选择状态" error="状态无效" required>
        <Select defaultValue="draft">
          <option value="draft">草稿</option>
          <option value="published">已发布</option>
        </Select>
      </FormField>,
    );

    const combobox = screen.getByRole("combobox", { name: "状态" });
    expect(combobox.id).toMatch(/^field-/);
    const fieldLabel = screen.getByText("状态");
    expect(fieldLabel.getAttribute("for")).toBe(combobox.id);
    const hiddenSelect = document.querySelector(
      '[data-slot="select"] select[aria-hidden="true"]',
    );
    expect(hiddenSelect?.id).toBe(`${combobox.id}-native`);
    expect(hiddenSelect?.id).not.toBe(combobox.id);
    expect(combobox.getAttribute("aria-required")).toBe("true");
    expect(combobox.getAttribute("aria-invalid")).toBe("true");
    const describedBy = combobox.getAttribute("aria-describedby")?.split(" ") ?? [];
    expect(describedBy).toContain(screen.getByText("请选择状态").id);
    expect(describedBy).toContain(screen.getByRole("alert").id);
  });

  it("uses contextual visible labels for icon-only Collapse and Tree switchers", () => {
    const collapse = render(
      <Collapse
        items={[
          {
            key: "security",
            label: "Security",
            children: "Security settings",
            collapsible: "icon",
          },
        ]}
      />,
    );
    const disclosure = screen.getByRole("button", { name: "Security" });
    expect(disclosure.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("button", { name: "Expand panel" })).toBeNull();
    collapse.unmount();

    render(
      <Tree
        treeData={[
          {
            key: "src",
            title: "src",
            children: [{ key: "index", title: "index.ts", isLeaf: true }],
          },
        ]}
      />,
    );
    const switcher = screen.getByRole("button", { name: "src" });
    expect(switcher.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("button", { name: "Expand" })).toBeNull();
  });

  it("localizes overlay close affordances and never names a surface after the close action", () => {
    document.documentElement.lang = "zh-CN";

    const modal = render(<Modal open>Modal content</Modal>);
    expect(screen.getByRole("dialog", { name: "对话框" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "关闭" })).toBeTruthy();
    modal.unmount();

    render(<Drawer open>Drawer content</Drawer>);
    expect(screen.getByRole("dialog", { name: "抽屉" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "关闭" })).toBeTruthy();
  });

  it("keeps Tag selection and close actions as sibling interactive owners", () => {
    render(
      <Tag checkable closable>
        Release
      </Tag>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Release" });
    const close = screen.getByRole("button", { name: "关闭 Release" });
    expect(checkbox.contains(close)).toBe(false);
    expect(checkbox.parentElement).toBe(close.parentElement);
    expect(checkbox.parentElement?.querySelector("button button")).toBeNull();
  });

  it("keeps AppShell landmarks and skip target semantically connected", () => {
    render(
      <AppShell
        brand="Admin"
        navigationLabel="Primary navigation"
        navigation={() => <a href="#one">One</a>}
      >
        <h1>Dashboard</h1>
      </AppShell>,
    );

    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeTruthy();

    const main = screen.getByRole("main");
    expect(main.id).toMatch(/^app-shell-main-/);
    expect(main.getAttribute("tabindex")).toBe("-1");

    const skip = screen.getByRole("link", { name: "跳至主要内容" });
    expect(skip.getAttribute("href")).toBe(`#${main.id}`);
  });

  it("keeps PageSkeleton as one named busy live region while placeholders stay decorative", () => {
    const { container } = render(
      <PageSkeleton layout="collection" aria-label="资源列表加载中" />,
    );

    const status = screen.getByRole("status", { name: "资源列表加载中" });
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.getAttribute("aria-busy")).toBe("true");
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
    expect(screen.queryByRole("columnheader")).toBeNull();
  });

  it("keeps core semantic source contracts explicit", () => {
    const field = source("src/core/field.tsx");
    const select = source("src/core/select.tsx");
    const collapse = source("src/core/collapse.tsx");
    const tree = source("src/core/tree.tsx");
    const modal = source("src/core/modal.tsx");
    const drawer = source("src/core/drawer.tsx");
    const dialog = source("src/components/primitives/dialog.tsx");
    const sheet = source("src/components/primitives/sheet.tsx");
    const table = source("src/components/primitives/table.tsx");

    expect(field).toContain('id={labelId}');
    expect(field).toContain("childOwnsAccessibleName");
    expect(field).toContain("htmlFor={childOwnsAccessibleName ? undefined : controlId}");
    expect(select).toContain("const nativeSelectId =");
    expect(select).toContain("id={nativeSelectId}");
    expect(select).toContain("id={baseId} role=\"combobox\"");
    expect(select).toContain('aria-required={required || props["aria-required"] || undefined}');

    expect(collapse).toContain("aria-labelledby={labelId}");
    expect(collapse).not.toContain('"Expand panel"');
    expect(collapse).not.toContain('"Collapse panel"');

    expect(tree).toContain("aria-labelledby={nodeTitleId}");
    expect(tree).not.toContain('aria-label={expanded ? "Collapse" : "Expand"}');

    expect(modal).toContain("closeLabel={closeText()}");
    expect(modal).toContain('localizedText("Dialog", "对话框")');
    expect(drawer).toContain("closeLabel={closeText()}");
    expect(drawer).toContain('localizedText("Drawer", "抽屉")');
    expect(dialog).not.toContain('<span className="sr-only">Close</span>');
    expect(sheet).not.toContain('<span className="sr-only">Close</span>');

    expect(table).toContain("<table");
    expect(table).toContain("<th");
    expect(table).toContain("<td");
  });

  it("keeps canonical product fixtures free of basic semantic bypasses", () => {
    const files = [
      ...collectTsx(resolve(root, "showcase/demos/products/blog")),
      ...collectTsx(resolve(root, "showcase/demos/products/blog-admin")),
      ...collectTsx(resolve(root, "showcase/demos/products/gosso-admin")),
    ];

    const nonSemanticClickTargets: string[] = [];
    const missingAltImages: string[] = [];
    const focusableAriaHidden: string[] = [];

    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (/<(?:div|span|li)\b[^>]*\bonClick\s*=/g.test(text)) {
        nonSemanticClickTargets.push(file);
      }

      const imageTags = text.match(/<img\b[^>]*>/g) ?? [];
      if (imageTags.some((tag) => !/\balt\s*=/.test(tag))) {
        missingAltImages.push(file);
      }

      const hiddenTags =
        text.match(/<[^>]+\baria-hidden\s*=\s*(?:"true"|'true'|\{true\})[^>]*>/g) ??
        [];
      if (
        hiddenTags.some((tag) => {
          if (/\btabIndex\s*=\s*(?:\{\s*-1\s*\}|"-1"|'\-1')/.test(tag)) {
            return false;
          }
          if (/^<(?:button|input|select|textarea)\b/.test(tag)) return true;
          if (/^<a\b/.test(tag) && /\bhref\s*=/.test(tag)) return true;
          return /\btabIndex\s*=\s*(?:\{\s*[0-9]+\s*\}|"[0-9]+"|'[0-9]+')/.test(
            tag,
          );
        })
      ) {
        focusableAriaHidden.push(file);
      }
    }

    expect(nonSemanticClickTargets).toEqual([]);
    expect(missingAltImages).toEqual([]);
    expect(focusableAriaHidden).toEqual([]);
  });
});
