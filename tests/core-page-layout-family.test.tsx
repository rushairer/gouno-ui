import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSider,
} from "../src/core";
import { layoutDocuments } from "../showcase/demos/core/layout";

describe("Core Layout family", () => {
  it("keeps semantic regions while forwarding native attributes", () => {
    render(
      <Layout data-testid="layout" data-layout="workspace" className="custom-layout">
        <LayoutHeader data-testid="header" data-region="header">
          Header
        </LayoutHeader>
        <LayoutSider data-testid="sider" aria-label="Section navigation">
          Sider
        </LayoutSider>
        <LayoutContent data-testid="content" data-region="content">
          Content
        </LayoutContent>
        <LayoutFooter data-testid="footer" data-region="footer">
          Footer
        </LayoutFooter>
      </Layout>,
    );

    const layout = screen.getByTestId("layout");
    expect(layout.tagName).toBe("DIV");
    expect(layout.getAttribute("data-layout")).toBe("workspace");
    expect(layout.className).toContain("custom-layout");

    expect(screen.getByTestId("header").tagName).toBe("HEADER");
    expect(screen.getByTestId("sider").tagName).toBe("ASIDE");
    expect(screen.getByTestId("content").tagName).toBe("MAIN");
    expect(screen.getByTestId("footer").tagName).toBe("FOOTER");
    expect(
      screen.getByLabelText("Section navigation").getAttribute("data-testid"),
    ).toBe("sider");
  });

  it("documents the same complete Layout tree rendered by the Preview", () => {
    const document = layoutDocuments["page-layout"];
    expect(document.code).toContain('from "@gouno/ui/core"');
    expect(document.code).toContain("<LayoutHeader");
    expect(document.code).toContain("<LayoutSider");
    expect(document.code).toContain("<LayoutContent");
    expect(document.code).toContain("<LayoutFooter");
    expect(document.code).toContain('data-layout="admin-shell"');
    expect(document.render).toBeTypeOf("function");
  });

  it("documents every public Layout region as one family", () => {
    const document = layoutDocuments["page-layout"];
    const sections = new Map(
      document.apiSections?.map((section) => [section.title, section.rows]) ?? [],
    );

    expect(document.api?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["children", "className", "...div props"]),
    );
    expect([...sections.keys()]).toEqual([
      "LayoutHeader API",
      "LayoutSider API",
      "LayoutContent API",
      "LayoutFooter API",
    ]);
    expect(sections.get("LayoutHeader API")?.map((row) => row.name)).toContain(
      "...header props",
    );
    expect(sections.get("LayoutSider API")?.map((row) => row.name)).toContain(
      "...aside props",
    );
    expect(sections.get("LayoutContent API")?.map((row) => row.name)).toContain(
      "...main props",
    );
    expect(sections.get("LayoutFooter API")?.map((row) => row.name)).toContain(
      "...footer props",
    );
  });
});
