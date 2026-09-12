import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogDiscoveryIndexDemo } from "../showcase/demos/products/blog/discovery-indexes";
import { ThemeProvider } from "../src/theme";

afterEach(cleanup);

function renderIndex(
  page: "categories" | "tags" | "archive",
  initialScenario: "data" | "loading" | "empty" = "data",
) {
  return render(
    <ThemeProvider brand="blog" storageKey={`blog-discovery-${page}-theme`}>
      <BlogDiscoveryIndexDemo page={page} initialScenario={initialScenario} />
    </ThemeProvider>,
  );
}

describe("Blog public discovery index migrations", () => {
  it("preserves category cards and public category navigation", () => {
    renderIndex("categories");

    expect(screen.getByRole("heading", { level: 1, name: "分类" })).toBeTruthy();
    expect(screen.getByText("CATEGORY INDEX")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "工程实践" })).toBeTruthy();
    expect(screen.getByText("6 篇文章")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /架构与安全/ }));
    expect(screen.getByText(/\/categories\/architecture-security/)).toBeTruthy();
  });

  it("preserves count-ranked tag navigation", () => {
    renderIndex("tags");

    expect(screen.getByRole("heading", { level: 1, name: "标签" })).toBeTruthy();

    const goTag = screen.getByText("Go").closest("button");
    const oauthTag = screen.getByText("OAuth2").closest("button");
    expect(goTag?.textContent).toContain("3 篇");
    expect(oauthTag?.textContent).toContain("2 篇");

    fireEvent.click(oauthTag!);
    expect(screen.getByText(/\/tags\/OAuth2/)).toBeTruthy();
  });

  it("preserves month-grouped archive reading paths", () => {
    renderIndex("archive");

    expect(screen.getByRole("heading", { level: 1, name: "归档" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /2026年9月/ })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /2026年8月/ })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /OAuth2 BFF 到产品体验/ }));
    expect(screen.getByText(/\/articles\/oauth2-bff-product-experience/)).toBeTruthy();
  });

  it("preserves loading and empty states across simple public indexes", () => {
    const loading = renderIndex("categories", "loading");
    expect(screen.getByRole("status", { name: "分类加载中" })).toBeTruthy();
    loading.unmount();

    const tagsEmpty = renderIndex("tags", "empty");
    expect(screen.getByText("暂无标签内容")).toBeTruthy();
    tagsEmpty.unmount();

    renderIndex("archive", "empty");
    expect(screen.getByText("暂无归档内容")).toBeTruthy();
  });

  it("validates PageHeader on a standalone public-content family without expanding Gouno shell usage", () => {
    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/products/blog/discovery-indexes.tsx"),
      "utf8",
    );

    expect(source).toContain('import { PageHeader } from "../../../../src/gouno"');
    expect(source).toContain("BlogPublicShellFixture");
    expect(source).not.toContain("AppShell");
    expect(source).not.toContain("PageContainer");
  });
});
