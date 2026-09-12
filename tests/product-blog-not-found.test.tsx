import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogNotFoundDemo } from "../showcase/demos/products/blog/not-found";
import { ThemeProvider } from "../src/theme";

afterEach(cleanup);

describe("Blog public NotFound migration", () => {
  it("preserves the standalone public 404 result and recovery destinations", () => {
    render(
      <ThemeProvider brand="blog" storageKey="blog-public-not-found-theme">
        <BlogNotFoundDemo />
      </ThemeProvider>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "页面未找到" })).toBeTruthy();
    expect(screen.getByText(/地址不存在、已经移动/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "返回首页" }));
    expect(screen.getByText(/将进入 \/（Showcase 模拟）/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "浏览文章" }));
    expect(screen.getByText(/\/articles/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "搜索内容" }));
    expect(screen.getByText(/\/search/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "返回上一页" }));
    expect(screen.getByText("将返回浏览器上一页（Showcase 模拟）。")).toBeTruthy();
  });

  it("keeps 404 as a PublicShell result rather than a second document or application shell", () => {
    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/products/blog/not-found.tsx"),
      "utf8",
    );

    expect(source).toContain("BlogPublicShellFixture");
    expect(source).toContain("<Result");
    expect(source).toContain('headingLevel={1}');
    expect(source).toContain('padding="none"');
    expect(source).not.toContain("subTitle=");
    expect(source).not.toContain('src/patterns');
    expect(source).not.toContain('src/gouno');
    expect(source).not.toMatch(/<(?:AppShell|PageContainer|PageHeader)\b/);
    expect(source).not.toMatch(/\b(?:DocumentPage|MarkdownPage|NotFoundShell)\b/);
    expect(source).not.toMatch(/\bfetch\s*\(|\baxios\b|XMLHttpRequest|WebSocket/);
    expect(source).not.toMatch(/shadow-(?:md|lg|xl|2xl|raised|overlay|modal)/);
  });
});
