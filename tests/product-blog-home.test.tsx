import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogHomeDemo } from "../showcase/demos/products/blog-home";
import { ThemeProvider } from "../src/theme";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

afterEach(cleanup);

function renderHome(initialScenario: "data" | "loading" | "empty" | "error" = "data") {
  return render(
    <ThemeProvider brand="blog" storageKey="blog-home-test-theme">
      <BlogHomeDemo initialScenario={initialScenario} />
    </ThemeProvider>,
  );
}

describe("Blog public Home product migration fixture", () => {
  it("preserves the public shell and Home information hierarchy", () => {
    renderHome();

    expect(screen.getByRole("link", { name: "跳到正文" })).toHaveAttribute("href", "#blog-main");
    expect(screen.getByRole("navigation", { name: "主导航" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "blog-main");
    expect(
      screen.getByRole("heading", { level: 1, name: "把真实工程问题，写成可以长期复用的知识。" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "精选文章" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "主题索引" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "最新文章" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "订阅更新" })).toBeInTheDocument();
  });

  it("preserves empty and error states without a real Blog API", () => {
    const { unmount } = renderHome("empty");
    expect(screen.getByText("这里还没有文章")).toBeInTheDocument();
    unmount();

    renderHome("error");
    expect(screen.getByText("首页内容加载失败")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "重试" })).toBeInTheDocument();
  });

  it("keeps the public shell product-local instead of forcing AppShell", () => {
    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/products/blog-home.tsx"),
      "utf8",
    );

    expect(source).not.toContain('../../../src/gouno');
    expect(source).not.toContain("AppShell");
    expect(source).not.toContain("PageContainer");
    expect(source).toContain('../../../src/core');
    expect(source).toContain('../../../src/theme');
  });
});
