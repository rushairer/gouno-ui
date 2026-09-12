import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const showcaseRoot = resolve(process.cwd(), "showcase");
const demosRoot = resolve(showcaseRoot, "demos");
const productsRoot = resolve(demosRoot, "products");

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
});
