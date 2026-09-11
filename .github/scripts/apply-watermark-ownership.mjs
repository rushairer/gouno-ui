import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const publicPropsPath = "src/core/public-props.ts";
const indexPath = "src/core/index.ts";

let publicProps = readFileSync(publicPropsPath, "utf8");
const importLine = 'import type { Watermark } from "./watermark";\n';
const aliasLine = 'export type WatermarkProps = ComponentProps<typeof Watermark>;\n';
if (!publicProps.includes(importLine) || !publicProps.includes(aliasLine)) {
  throw new Error("Watermark public-props anchors missing");
}
publicProps = publicProps.replace(importLine, "").replace(aliasLine, "");
writeFileSync(publicPropsPath, publicProps);

let index = readFileSync(indexPath, "utf8");
const exportLine = 'export { Watermark } from "./watermark";';
if (!index.includes(exportLine)) throw new Error("Watermark index export anchor missing");
index = index.replace(
  exportLine,
  'export { Watermark, type WatermarkProps } from "./watermark";',
);
const reexportLine = "  WatermarkProps,\n";
if (!index.includes(reexportLine)) throw new Error("Watermark public-props re-export anchor missing");
index = index.replace(reexportLine, "");
writeFileSync(indexPath, index);

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-watermark-ownership.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", publicPropsPath, indexPath, "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "refactor(core): let Watermark own its public props"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
