const importRewrites = [
  ["../../../src/core", "@gouno/ui/core"],
  ["../../../src/theme", "@gouno/ui/theme"],
  ["../../../src/patterns", "@gouno/ui/patterns"],
  ["../../../src/gouno", "@gouno/ui/gouno"],
] as const;

/**
 * Preserve one example source for both Preview and Code. The only transformation
 * is replacing repository-relative imports with the public package entrypoints
 * consumers should copy.
 */
export function canonicalExampleSource(source: string) {
  let canonical = source;
  for (const [from, to] of importRewrites) {
    canonical = canonical.replaceAll(from, to);
  }
  return canonical.trim();
}
