import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const replaceRequired = (text, from, to, label) => {
  if (!text.includes(from)) throw new Error(`${label} anchor missing`);
  return text.replace(from, to);
};

const propsPath = "src/core/public-props.ts";
let props = readFileSync(propsPath, "utf8");
props = replaceRequired(
  props,
  'import type { Tour } from "./tour";\n',
  "",
  "Tour props import",
);
props = replaceRequired(
  props,
  'export type TourProps = ComponentProps<typeof Tour>;\n',
  "",
  "Tour derived props",
);
writeFileSync(propsPath, props);

const indexPath = "src/core/index.ts";
let index = readFileSync(indexPath, "utf8");
index = replaceRequired(
  index,
  'export { Tour, type TourStep } from "./tour";',
  'export { Tour, type TourProps, type TourStep } from "./tour";',
  "Tour direct export",
);
index = replaceRequired(
  index,
  '  TourProps,\n',
  "",
  "Tour public-props re-export",
);
writeFileSync(indexPath, index);

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-tour-ownership.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", "src/core/public-props.ts", "src/core/index.ts", "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "refactor(core): let Tour own its public props"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
