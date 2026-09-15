import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

const publicFixtureFiles = [
  "showcase/demos/products/blog/public-shell.tsx",
  "showcase/demos/products/blog/home.tsx",
  "showcase/demos/products/blog/public-content.tsx",
  "showcase/demos/products/blog/article-index.tsx",
  "showcase/demos/products/blog/discovery-indexes.tsx",
  "showcase/demos/products/blog/article-detail.tsx",
  "showcase/demos/products/blog/article-community.tsx",
  "showcase/demos/products/blog/document-pages.tsx",
  "showcase/demos/products/blog/account-pages.tsx",
  "showcase/demos/products/blog/not-found.tsx",
] as const;

describe("Blog Public canonical fixture contracts", () => {
  it("keeps Admin shell grammar out of public fixtures", () => {
    for (const file of publicFixtureFiles) {
      const content = source(file);
      expect(content, file).not.toMatch(
        /import\s+\{[^}]*\b(?:AppShell|PageContainer)\b[^}]*\}\s+from\s+["'][^"']+["']/s,
      );
      expect(content, file).not.toMatch(/<(?:AppShell|PageContainer)\b/);
    }
  });

  it("keeps editorial and discovery navigation semantic", () => {
    for (const file of [
      "showcase/demos/products/blog/public-shell.tsx",
      "showcase/demos/products/blog/home.tsx",
      "showcase/demos/products/blog/public-content.tsx",
      "showcase/demos/products/blog/discovery-indexes.tsx",
      "showcase/demos/products/blog/article-detail.tsx",
    ]) {
      expect(source(file), file).not.toMatch(/<button\b/);
    }
  });

  it("keeps ArticleDetail as the complete reading plus community contract", () => {
    const detail = source("showcase/demos/products/blog/article-detail.tsx");
    const community = source("showcase/demos/products/blog/article-community.tsx");

    expect(detail).toContain("<Anchor");
    expect(detail).toContain("<CodeBlock");
    expect(detail).toContain("<BlogArticleCommunity />");
    expect(community).toContain('aria-labelledby="article-community"');
    expect(community).toContain("<Card");
  });

  it("models Discovery Error separately from Empty", () => {
    const discovery = source(
      "showcase/demos/products/blog/discovery-indexes.tsx",
    );

    expect(discovery).toContain('type DiscoveryScenario = "data" | "loading" | "empty" | "error"');
    expect(discovery).toContain('scenario === "error"');
    expect(discovery).toContain("<Alert");
    expect(discovery).toContain("<Empty");
  });

  it("does not invent Blog-local identity security forms", () => {
    const account = source("showcase/demos/products/blog/account-pages.tsx");
    const settingsSource = account.slice(account.indexOf("export function BlogAccountSettingsDemo"));

    expect(settingsSource).not.toContain("<Input");
    expect(settingsSource).not.toContain("<Textarea");
    expect(settingsSource).not.toContain("<Switch");
    expect(settingsSource).not.toContain('role="switch"');
    expect(settingsSource).toContain("账户安全由 GOSSO Admin 管理");
  });
});
