import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const blogAdminRoot = resolve(
  repoRoot,
  "showcase/demos/products/blog-admin",
);

function sourceFiles(path: string): string[] {
  if (!existsSync(path)) return [];
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path).flatMap((entry) =>
    sourceFiles(resolve(path, entry)),
  );
}

const applicationFiles = sourceFiles(blogAdminRoot).filter(
  (file) =>
    /\.tsx$/.test(file) &&
    !file.endsWith("fixture-notification.tsx") &&
    !file.includes("/fixtures/"),
);

describe("Blog Admin Showcase parity contract", () => {
  it("provides canonical Notification ownership to embedded fixtures", () => {
    const main = readFileSync(resolve(repoRoot, "showcase/main.tsx"), "utf8");
    expect(main).toContain("NotificationProvider");
    expect(main).toContain("<NotificationProvider>");
  });

  it("does not render transient fixture notice state as page Alert", () => {
    for (const file of applicationFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toMatch(
        /\bnotice\s*(?:\?|&&)[\s\S]{0,240}<Alert\b/,
      );

      if (/\bsetNotice\s*\(/.test(source)) {
        expect(source).toContain("<FixtureNotification");
      }
    }
  });

  it("routes fixture notifications through the canonical hook without recreating an overlay", () => {
    const adapter = readFileSync(
      resolve(blogAdminRoot, "fixture-notification.tsx"),
      "utf8",
    );
    expect(adapter).toContain("useNotification");
    expect(adapter).toContain("open({");
    expect(adapter).not.toMatch(/\bfixed\b/);
    expect(adapter).not.toMatch(/\bz-\d+\b/);
    expect(adapter).not.toMatch(/shadow-(?:sm|md|lg|xl|2xl)/);
  });
});
