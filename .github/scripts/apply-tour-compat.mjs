import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const path = "showcase/demos/core/feedback.tsx";
const from = `      <Tour\n        open={open}\n        onClose={() => setOpen(false)}\n        steps={[`;
const to = `      <Tour\n        open={open}\n        onClose={() => setOpen(false)}\n        previousText="上一步"\n        nextText="下一步"\n        finishText="完成"\n        steps={[`;
let source = readFileSync(path, "utf8");
if (!source.includes(from)) throw new Error("legacy Tour demo anchor missing");
source = source.replace(from, to);
writeFileSync(path, source);

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-tour-compat.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", path, "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "fix(showcase): align legacy Tour demo with 6E4"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
