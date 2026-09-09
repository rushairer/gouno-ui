import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogArticleDetailDemo } from "../showcase/demos/products/blog-article-detail";
import { ThemeProvider } from "../src/theme";

afterEach(cleanup);

function renderDetail(initialScenario: "data" | "preview" | "loading" | "error" | "not-found" = "data") {
  return render(
    <ThemeProvider brand="blog" storageKey={`blog-article-detail-${initialScenario}-theme`}>
      <BlogArticleDetailDemo initialScenario={initialScenario} />
    </ThemeProvider>,
  );
}

describe("Blog public ArticleDetail migration", () => {
  it("preserves the reading hierarchy, metadata and native TOC deep links", () => {
    const { container } = renderDetail();

    expect(screen.getByRole("heading", { level: 1, name: /从 OAuth2 BFF 到产品体验/ })).toBeTruthy();
    expect(screen.getByText("Paw")).toBeTruthy();
    expect(screen.getByText("1,284 阅读")).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "文章目录" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "先画边界，再谈组件" }).getAttribute("href")).toBe("#boundary-first");
    expect(screen.getByRole("link", { name: "代码展示也需要单一来源" }).getAttribute("href")).toBe("#single-source-code");
    expect(document.getElementById("boundary-first")?.className).toContain("scroll-mt-24");
    expect(document.getElementById("single-source-code")?.className).toContain("scroll-mt-24");
    expect(container.querySelector('[data-slot="code-block"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="page-header"]')).toBeTruthy();
  });

  it("keeps reading navigation and related content product-local", () => {
    renderDetail();

    fireEvent.click(screen.getByRole("button", { name: "OAuth2" }));
    expect(screen.getByText(/\/tags\/OAuth2/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Gouno UI：用真实产品反推设计系统/ }));
    expect(screen.getByText(/\/articles\/gouno-ui-product-driven/)).toBeTruthy();
  });

  it("preserves preview, loading, error and not-found states without a real Blog API", () => {
    const preview = renderDetail("preview");
    expect(screen.getByText("管理员预览模式")).toBeTruthy();
    preview.unmount();

    const loading = renderDetail("loading");
    expect(screen.getByRole("status", { name: "文章详情加载中" })).toBeTruthy();
    loading.unmount();

    const error = renderDetail("error");
    expect(screen.getByText("文章载入失败")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "重试" }));
    expect(screen.getByRole("heading", { level: 1, name: /从 OAuth2 BFF 到产品体验/ })).toBeTruthy();
    error.unmount();

    renderDetail("not-found");
    expect(screen.getByText("文章不存在或已下线")).toBeTruthy();
  });

  it("uses canonical reading primitives without promoting a public reading shell", () => {
    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/products/blog-article-detail.tsx"),
      "utf8",
    );

    expect(source).toContain('CodeBlock,');
    expect(source).toContain('Anchor,');
    expect(source).toContain('import { PageHeader } from "../../../src/gouno"');
    expect(source).toContain("BlogPublicShellFixture");
    expect(source).not.toContain("AppShell");
    expect(source).not.toContain("PageContainer");
    expect(source).not.toContain("MarkdownRenderer");
    expect(source).not.toContain("TableOfContents");
    expect(source).not.toMatch(/shadow-(?:md|lg|xl|2xl|raised|overlay|modal)/);
  });
});