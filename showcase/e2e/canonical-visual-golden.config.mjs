import { defineConfig } from "@playwright/test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const testDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(testDir, "../..");

export default defineConfig({
  testDir,
  testMatch: "canonical-visual-golden.pw.mjs",
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  outputDir: resolve(root, "test-results/canonical-visual-golden"),
  snapshotPathTemplate: resolve(
    testDir,
    "canonical-visual-golden.pw.mjs-snapshots/{arg}{ext}",
  ),
  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: resolve(root, "playwright-report-canonical-visual-golden"),
        open: "never",
      },
    ],
  ],
  use: {
    baseURL: "http://127.0.0.1:4174",
    browserName: "chromium",
    locale: "zh-CN",
    timezoneId: "Asia/Shanghai",
    colorScheme: "light",
    deviceScaleFactor: 1,
  },
  webServer: {
    command: "npm run showcase:dev -- --host 127.0.0.1 --port 4174",
    cwd: root,
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
