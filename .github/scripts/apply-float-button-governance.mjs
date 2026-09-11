import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const changelogPath = "CHANGELOG.md";
const apiPath = "docs/api-conformance.md";
const registerPath = "docs/abstraction-register.md";

const changedEntry = "- Other 6F1: hardened Core `FloatButton` as a generic icon-only floating action with caller-owned icon/accessibility copy, real button-or-anchor semantics, standard DOM/event/ref passthrough, working ReactNode Tooltip rendering, and explicit disabled-link behavior. The BackTop-style default arrow and string-only pseudo-tooltip bridge are removed from the generic action contract.\n";
const breakingEntry = "- `FloatButton` now requires `icon` and no longer injects a default `↑` glyph. Accessible names should be supplied with standard `aria-label` / `aria-labelledby`; `tooltip` renders visual Tooltip content and is not an implicit naming API.\n";
const apiEntry = "| API-047 | Core `FloatButton` 完成 reviewed 100：通用悬浮操作要求 caller-owned `icon`，不再默认注入 BackTop 箭头；无 `href` 使用原生 button，有 `href` 使用真实 anchor，并透传标准 DOM/ARIA/事件/ref。`tooltip` 现在承载真实 ReactNode Tooltip；disabled link 映射 `aria-disabled`、移出 tab order 并阻止导航。可访问名称由标准 `aria-label` / `aria-labelledby` 提供。 | same-source Showcase/API docs + `core-float-button-6f1` focused tests + main run 364 / PD-071 |";
const decision = [
  "",
  "",
  "### PD-071 — FloatButton stays a generic floating action instead of duplicating BackTop",
  "",
  "- **Status:** accepted / Core hardening",
  "- **Owner:** Core / Other family",
  "- **Evidence:** the established Core FloatButton is retained by the Core component baseline, but the old implementation mixed two unrelated contracts: it exposed a nominal ReactNode tooltip that only worked for strings, and it silently injected an up-arrow when no icon was supplied, effectively turning a generic floating action into a partial BackTop duplicate. No Gosso/Blog product evidence justifies a higher-level speed-dial/group abstraction.",
  "- **Decision:** keep FloatButton as one generic icon-only floating action. The caller owns `icon` and the accessible name. Without `href` it renders a native button with a safe default `type=\"button\"`; with `href` it renders a real anchor and preserves native navigation attributes. Standard DOM/ARIA/event props and a real button-or-anchor ref remain available under DOM-01. A disabled anchor maps to `aria-disabled`, leaves the tab order and blocks navigation/click callbacks.",
  "- **Content/accessibility impact:** `tooltip` now renders the canonical Tooltip and accepts real ReactNode content, but visual tooltip content is not treated as an implicit accessible-name API. Callers use `aria-label` or `aria-labelledby`; the icon wrapper is decorative. Core injects no locale copy and no default BackTop glyph.",
  "- **API impact:** `FloatButtonProps` remains implementation-owned and is exported directly from Core. `icon` becomes required; the legacy default arrow disappears. `href`, `target`, `rel`, `download`, `disabled`, button `type`, standard DOM props/events and real element ref describe the actual rendered root instead of a synthetic click-only surface.",
  "- **Validation:** 6F1 same-source Preview/Code and six focused regression tests cover native button semantics/event/ref, anchor navigation attributes, disabled-link behavior, ReactNode Tooltip rendering, removal of the default arrow and reviewed completion. Exact-head main run 364 passed the complete typecheck/test/build/pack/artifact/Pages gate.",
  "- **Abstraction impact:** no FloatButton Group, speed-dial menu, product action policy or BackTop behavior is admitted; those require independent evidence.",
  "",
].join("\n");

let changelog = readFileSync(changelogPath, "utf8");
if (!changelog.includes(changedEntry.trim())) {
  const anchor = "### Changed\n\n";
  if (!changelog.includes(anchor)) throw new Error("Changelog Changed anchor missing");
  changelog = changelog.replace(anchor, anchor + changedEntry);
}
if (!changelog.includes(breakingEntry.trim())) {
  const anchor = "### Breaking\n\n";
  if (!changelog.includes(anchor)) throw new Error("Changelog Breaking anchor missing");
  changelog = changelog.replace(anchor, anchor + breakingEntry);
}
writeFileSync(changelogPath, changelog);

let api = readFileSync(apiPath, "utf8");
if (!api.includes("| API-047 |")) {
  const lines = api.split("\n");
  const index = lines.findIndex((line) => line.startsWith("| API-046 |"));
  if (index < 0) throw new Error("API-046 anchor missing");
  lines.splice(index + 1, 0, apiEntry);
  api = lines.join("\n");
  writeFileSync(apiPath, api);
}

let register = readFileSync(registerPath, "utf8");
if (!register.includes("### PD-071 —")) {
  register = register.trimEnd() + decision + "\n";
  writeFileSync(registerPath, register);
}

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-float-button-governance.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", changelogPath, apiPath, registerPath, "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "docs(core): record FloatButton 6F1 governance"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
