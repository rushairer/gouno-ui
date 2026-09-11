import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const publicPropsPath = "src/core/public-props.ts";
const indexPath = "src/core/index.ts";

let publicProps = readFileSync(publicPropsPath, "utf8");
const importLine = 'import type { Affix, BackTop } from "./affix";\n';
const affixAlias = 'export type AffixProps = ComponentProps<typeof Affix>;\n';
const backTopAlias = 'export type BackTopProps = ComponentProps<typeof BackTop>;\n';
if (
  !publicProps.includes(importLine) ||
  !publicProps.includes(affixAlias) ||
  !publicProps.includes(backTopAlias)
) {
  throw new Error("Affix/BackTop public-props anchors missing");
}
publicProps = publicProps
  .replace(importLine, "")
  .replace(affixAlias, "")
  .replace(backTopAlias, "");
writeFileSync(publicPropsPath, publicProps);

let index = readFileSync(indexPath, "utf8");
const exportLine = 'export { Affix, BackTop } from "./affix";';
if (!index.includes(exportLine)) throw new Error("Affix/BackTop index export anchor missing");
index = index.replace(
  exportLine,
  'export { Affix, BackTop, type AffixProps, type BackTopProps } from "./affix";',
);
for (const reexportLine of ["  AffixProps,\n", "  BackTopProps,\n"]) {
  if (!index.includes(reexportLine)) {
    throw new Error(`Affix/BackTop public-props re-export anchor missing: ${reexportLine.trim()}`);
  }
  index = index.replace(reexportLine, "");
}
writeFileSync(indexPath, index);

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-affix-back-top-ownership.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", publicPropsPath, indexPath, "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "refactor(core): let Affix and BackTop own public props"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
