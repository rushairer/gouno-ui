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
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "../src") } },
  css: { postcss: {} },
});
