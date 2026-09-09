import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogArticleIndexDemo } from "../showcase/demos/products/blog-article-index";
import { ThemeProvider } from "../src/theme";

afterEach(cleanup);

function renderIndex(
  mode: "articles" | "search" | "tag" | "category" = "articles",
  initialScenario: "data" | "loading" | "empty" | "error" = "data",
) {
  return render(
    <ThemeProvider brand="blog" storageKey={`blog-article-index-${mode}-theme`}>
      <BlogArticleIndexDemo mode={mode} initialScenario={initialScenario} />
    </ThemeProvider>,
  );
}

describe("Blog public ArticleIndex product migration fixture", () => {
  it("preserves article listing, filters and canonical Pagination behavior", () => {
    renderIndex("articles");

    expect(screen.getByRole("heading", { level: 1, name: "全部文章" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "筛选" })).toBeTruthy();
    expect(screen.getByRole("searchbox", { name: "搜索文章" })).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "文章分页" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Page 2" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(screen.getByRole("heading", { name: /Kafka 15 分区为什么不是 15 个 goroutine 就最快/ })).toBeTruthy();
  });

  it("keeps Search as a route intent of the same ArticleIndex implementation", () => {
    renderIndex("search");

    expect(screen.getByRole("heading", { level: 1, name: "“OAuth2”的搜索结果" })).toBeTruthy();
    expect(screen.getByText("2 篇文章，持续记录问题、选择与实现。")).toBeTruthy();

    const search = screen.getByRole("searchbox", { name: "搜索文章" });
    fireEvent.change(search, { target: { value: "Kafka" } });
    fireEvent.submit(search.closest("form")!);

    expect(screen.getByRole("heading", { level: 1, name: "“Kafka”的搜索结果" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Kafka 背压实践/ })).toBeTruthy();
  });

  it("preserves loading, empty and error states without a real Blog API", () => {
    const loading = renderIndex("articles", "loading");
    expect(screen.getByRole("status", { name: "文章列表加载中" })).toBeTruthy();
    loading.unmount();

    const empty = renderIndex("articles", "empty");
    expect(screen.getByText("没有找到符合条件的文章。")).toBeTruthy();
    expect(screen.getByRole("button", { name: "浏览归档" })).toBeTruthy();
    empty.unmount();

    renderIndex("articles", "error");
    expect(screen.getByText("文章载入失败")).toBeTruthy();
    expect(screen.getByRole("button", { name: "重试" })).toBeTruthy();
  });

  it("keeps discovery composition product-local and mode-driven", () => {
    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/products/blog-article-index.tsx"),
      "utf8",
    );

    expect(source).toContain('type ArticleIndexMode = "articles" | "search" | "tag" | "category"');
    expect(source).toContain("BlogPublicShellFixture");
    expect(source).toContain("BlogArticleTeaser");
    expect(source).toContain("Pagination");
    expect(source).not.toContain('../../../src/gouno');
    expect(source).not.toContain("AppShell");
  });
});
