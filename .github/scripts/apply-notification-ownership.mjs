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
  'import type { NotificationProvider } from "./notification";\n',
  "",
  "NotificationProvider props import",
);
props = replaceRequired(
  props,
  'export type NotificationProviderProps = ComponentProps<typeof NotificationProvider>;\n',
  "",
  "NotificationProvider derived props",
);
writeFileSync(propsPath, props);

const indexPath = "src/core/index.ts";
let index = readFileSync(indexPath, "utf8");
index = replaceRequired(
  index,
  'export { NotificationProvider, useNotification } from "./notification";',
  'export { NotificationProvider, useNotification, type NotificationProviderProps, type NotificationNotice } from "./notification";',
  "NotificationProvider direct export",
);
index = replaceRequired(
  index,
  '  NotificationProviderProps,\n',
  "",
  "NotificationProvider public-props re-export",
);
writeFileSync(indexPath, index);

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-notification-ownership.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", "src/core/public-props.ts", "src/core/index.ts", "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "refactor(core): let Notification own its public types"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
