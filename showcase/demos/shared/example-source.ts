const publicLayerEntries = new Set(["core", "theme", "patterns", "gouno"]);

/**
 * Preserve one example source for both Preview and Code. The only transformation
 * is replacing repository-relative imports with the public package entrypoints
 * consumers should copy. Example modules can live at different directory depths,
 * so normalize any ../ chain that targets src/<public-layer>.
 */
export function canonicalExampleSource(source: string) {
  return source
    .replace(/(?:\.\.\/)+src\/(core|theme|patterns|gouno)(?=["'])/g, (_, layer: string) => {
      if (!publicLayerEntries.has(layer)) return _;
      return `@gouno/ui/${layer}`;
    })
    .trim();
}
