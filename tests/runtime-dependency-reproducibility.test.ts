import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type PackageManifest = {
  dependencies?: Record<string, string>;
};

type PackageLock = {
  packages?: Record<string, { dependencies?: Record<string, string> }>;
};

function readJson<T>(filename: string): T {
  return JSON.parse(readFileSync(new URL(`../${filename}`, import.meta.url), "utf8")) as T;
}

function isFloatingRuntimeSpec(spec: string): boolean {
  const normalized = spec.trim();
  const bareDistTag = /^[A-Za-z][A-Za-z0-9._-]*$/;
  const wildcardRange = /(^|[.\s])(?:x|X|\*)($|[.\s])/;

  return normalized.length === 0 || bareDistTag.test(normalized) || wildcardRange.test(normalized);
}

describe("runtime dependency reproducibility", () => {
  const manifest = readJson<PackageManifest>("package.json");
  const packageLock = readJson<PackageLock>("package-lock.json");
  const runtimeDependencies = manifest.dependencies ?? {};
  const lockedRuntimeDependencies = packageLock.packages?.[""]?.dependencies ?? {};

  it("does not publish floating dist-tags or wildcard runtime ranges", () => {
    const offenders = Object.entries(runtimeDependencies)
      .filter(([, spec]) => isFloatingRuntimeSpec(spec))
      .map(([name, spec]) => `${name}@${spec}`)
      .sort();

    expect(offenders).toEqual([]);
  });

  it("keeps package.json and package-lock.json runtime specs identical", () => {
    expect(lockedRuntimeDependencies).toEqual(runtimeDependencies);
  });
});
