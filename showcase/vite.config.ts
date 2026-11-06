import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  root: path.resolve(import.meta.dirname),
  // GitHub Pages serves this repository below /gouno-ui/ while local Vite
  // development continues to use the root path.
  base: process.env.GITHUB_ACTIONS ? "/gouno-ui/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(import.meta.dirname, "../src") },
      // Tailwind rebases base.css URLs into ../../src/fonts when importing it.
      // Bundle the same installed assets as the package's dist/fonts delivery.
      {
        find: /^(?:\.{1,2}\/)*(?:src\/)?fonts\/inter-latin-wght-normal\.woff2$/,
        replacement: path.resolve(
          import.meta.dirname,
          "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
        ),
      },
      {
        find: /^(?:\.{1,2}\/)*(?:src\/)?fonts\/jetbrains-mono-latin-400-normal\.woff2$/,
        replacement: path.resolve(
          import.meta.dirname,
          "../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
        ),
      },
    ],
  },
  css: { postcss: {} },
});
