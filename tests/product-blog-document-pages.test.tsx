import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  BlogAboutDemo,
  BlogCustomPageDemo,
} from "../showcase/demos/products/blog-document-pages";
import { ThemeProvider } from "../src/theme";

afterEach(cleanup);

function renderCustom(initialScenario: "data" | "loading" | "error" | "not-found" = "data") {
  return render(
    <ThemeProvider brand="blog" storageKey={`blog-custom-page-${initialScenario}-theme`}>
      <BlogCustomPageDemo initialScenario={initialScenario} />
    </ThemeProvider>,
  );
}

function renderAbout() {
  return render(
    <ThemeProvider brand="blog" storageKey="blog-about-theme">
      <BlogAboutDemo />
    </ThemeProvider>,
  );
}

describe("Blog public document page migrations", () => {
  it("preserves a dynamic custom page as a standalone Markdown-reading document", () => {
    const { container } = renderCustom();

    expect(screen.getByRole("heading", { level: 1, name: "Gouno UI 设计系统说明" })).toBeTruthy();
    expect(screen.getByText("最后更新：2026-09-09")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "为什么单页仍然是产品内容" })).toBeTruthy();
    expect(container.querySelector('[data-slot="page-header"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="code-block"]')).toBeTruthy();
  });

  it("preserves CustomPage loading, error/retry and not-found lifecycle independently", () => {
    const loading = renderCustom("loading");
    expect(screen.getByRole("status", { name: "自定义单页加载中" })).toBeTruthy();
    loading.unmount();

    const error = renderCustom("error");
    expect(screen.getByText("页面载入失败")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "重试" }));
    expect(screen.getByRole("heading", { level: 1, name: "Gouno UI 设计系统说明" })).toBeTruthy();
    error.unmount();

    renderCustom("not-found");
    expect(screen.getByText("页面不存在或已下线")).toBeTruthy();
  });

  it("keeps About as a fixed public document without inheriting CustomPage async state", () => {
    renderAbout();

    expect(screen.getByRole("heading", { level: 1, name: "关于 Gouno Blog" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "主要内容" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "写作原则" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "继续了解" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "GitHub" }));
    expect(screen.getByText("将打开 GitHub（Showcase 模拟）。")).toBeTruthy();
  });

  it("shares only a product-local document frame and does not promote a document feature bag", () => {
    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/products/blog-document-pages.tsx"),
      "utf8",
    );

    expect(source).toContain("function BlogDocumentSurface");
    expect(source).toContain('import { PageHeader } from "../../../src/gouno"');
    expect(source).toContain("BlogPublicShellFixture");
    expect(source).not.toContain('src/patterns');
    expect(source).not.toMatch(/import\s+\{[^}]*\b(?:AppShell|PageContainer)\b[^}]*\}\s+from\s+["'][^"']+["']/s);
    expect(source).not.toMatch(/<(?:AppShell|PageContainer)\b/);
    expect(source).not.toMatch(/\b(?:DocumentPage|MarkdownPage|MarkdownRenderer|DocumentShell)\b/);
    expect(source).not.toMatch(/\bfetch\s*\(|\baxios\b|XMLHttpRequest|WebSocket/);
    expect(source).not.toMatch(/shadow-(?:md|lg|xl|2xl|raised|overlay|modal)/);
  });
});
