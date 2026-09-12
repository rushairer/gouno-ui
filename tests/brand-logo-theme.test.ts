import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(process.cwd());
const brandIcons = [
  "gouno.svg",
  "gouno-ui.svg",
  "gouno-blog.svg",
  "gosso.svg",
  "gosso-admin.svg",
] as const;

function read(path: string) {
  return readFileSync(resolve(repoRoot, path), "utf8");
}

describe("brand logo theme integration", () => {
  it("keeps every product mark color-agnostic", () => {
    for (const icon of brandIcons) {
      const source = read(`assets/brand-icons/${icon}`);
      expect(source).toContain("currentColor");
      expect(source).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    }
  });

  it("renders Showcase marks from the active theme color", () => {
    const brandMark = read("showcase/components/brand-mark.tsx");
    const main = read("showcase/main.tsx");
    const blogShell = read("showcase/demos/products/blog/public-shell.tsx");
    const gossoAuth = read("showcase/demos/products/gosso-admin/auth/shared.tsx");

    expect(brandMark).toContain("bg-current");
    expect(brandMark).toContain("WebkitMask");
    expect(main).toContain("<BrandMark");
    expect(main).toContain("text-primary");
    expect(blogShell).toContain("<BrandMark");
    expect(blogShell).toContain("text-primary");
    expect(gossoAuth).toContain("<BrandMark");
    expect(gossoAuth).toContain("text-primary");
  });
});
