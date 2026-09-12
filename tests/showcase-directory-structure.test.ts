import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const showcaseRoot = resolve(repoRoot, "showcase");
const demosRoot = resolve(showcaseRoot, "demos");
const productsRoot = resolve(demosRoot, "products");

const retiredFlatPaths = [
  "showcase/catalog.tsx",
  "showcase/component-progress.ts",
  "showcase/core-family-coverage.ts",
  "showcase/showcase.css",
  "showcase/demos/core-components.tsx",
  "showcase/demos/gouno-components.tsx",
  "showcase/demos/gouno-page-header.tsx",
  "showcase/demos/pattern-bulk-action-bar.tsx",
  "showcase/demos/theme-system.tsx",
  "showcase/demos/example-source.ts",
  "showcase/demos/examples",
  "showcase/demos/products/blog-admin-ai-operations",
  "showcase/demos/products/blog-admin-ai-settings",
] as const;

describe("Showcase directory ownership", () => {
  it("keeps demo families out of the demos root", () => {
    const topLevelCode = readdirSync(demosRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name))
      .map((entry) => entry.name);
    expect(topLevelCode).toEqual([]);
  });

  it("uses product directories instead of filename prefixes", () => {
    const entries = readdirSync(productsRoot, { withFileTypes: true });
    const topLevelCode = entries
      .filter((entry) => entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name))
      .map((entry) => entry.name);
    const directories = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    expect(topLevelCode).toEqual([]);
    expect(directories).toEqual(
      expect.arrayContaining(["blog", "blog-admin", "gosso-admin"]),
    );
  });

  it("does not repeat the product name inside product-owned filenames", () => {
    const checks = [
      ["blog", /^blog-/],
      ["blog-admin", /^blog-admin-/],
      ["gosso-admin", /^gosso-/],
    ] as const;
    for (const [directory, forbiddenPrefix] of checks) {
      const filenames = readdirSync(resolve(productsRoot, directory), {
        withFileTypes: true,
      })
        .filter((entry) => entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name))
        .map((entry) => entry.name);
      expect(filenames.filter((name) => forbiddenPrefix.test(name))).toEqual(
        [],
      );
    }
  });

  it("does not reintroduce retired flat ownership paths", () => {
    for (const path of retiredFlatPaths) {
      expect(existsSync(resolve(repoRoot, path)), path).toBe(false);
    }
  });
});
