import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const changelogPath = "CHANGELOG.md";
const apiPath = "docs/api-conformance.md";
const registerPath = "docs/abstraction-register.md";

const changedEntry = "- Other 6F3: hardened Core `Affix` as a standard top-sticky container and `BackTop` as a window-scroll threshold control with real visibility behavior, caller-owned accessible copy, cancellable smooth-scroll action, standard DOM/event/ref passthrough, same-source Showcase examples, and focused regressions.\n";
const breakingEntry = "- `BackTop` now requires caller-owned `aria-label` and actually remains unrendered until `window.scrollY` reaches `visibilityHeight`; Core no longer injects the English `Back to top` label.\n";
const apiEntry = "| API-049 | Core `Affix` / `BackTop` 完成 reviewed 100：`Affix` 保持当前滚动祖先内的 top-sticky 容器，透传标准 div DOM/ARIA/style/ref；`BackTop` 真正按 `window.scrollY/visibilityHeight` 控制渲染，`aria-label` 由 caller 本地化，默认 smooth scroll 可由 `onClick.preventDefault()` 取消，并透传标准 button DOM/事件/ref。两者 Props 由实现文件直接拥有。 | same-source Showcase/API docs + `core-affix-back-top-6f3` focused tests + exact-head main certification / PD-073 |";
const decision = [
  "",
  "",
  "### PD-073 — Affix owns sticky placement; BackTop owns the window scroll threshold",
  "",
  "- **Status:** accepted / Core hardening",
  "- **Owner:** Core / Other family",
  "- **Evidence:** the retained Core Affix already represented a small sticky wrapper, while BackTop exposed `visibilityHeight` only as an inert data attribute, rendered continuously, and injected the English accessible label `Back to top`. No Gosso/Blog evidence justifies custom scroll-container discovery, portal placement or product navigation policy in Core.",
  "- **Decision:** keep Affix as a top-sticky container in its current scroll ancestor; `offsetTop` owns sticky `top` placement and non-finite values normalize to zero. Keep BackTop scoped to `window`: observe `window.scrollY`, render only when the normalized threshold is reached, and smooth-scroll to top on activation. A caller `onClick` may call `preventDefault()` to cancel the default scroll action.",
  "- **Content/accessibility impact:** BackTop requires standard caller-owned `aria-label`, so Core injects no locale copy. Its default ArrowUp is decorative and belongs to the specific BackTop affordance. Affix remains an ordinary div and callers add ARIA only when the sticky region itself requires naming.",
  "- **API impact:** `AffixProps` and `BackTopProps` are implementation-owned and exported directly from Core. Both expose standard DOM props and real element refs; BackTop retains native button behavior and a safe default `type=\"button\"`.",
  "- **Validation:** 6F3 same-source Preview/Code and focused regression tests cover sticky placement/ref, non-finite offset normalization, threshold hide/show, smooth-scroll activation/ref, preventDefault cancellation, locale leakage removal and reviewed completion. The exact-head certification after ownership must pass the complete typecheck/test/build/pack/artifact/Pages gate.",
  "- **Abstraction impact:** no custom scroll-container registry, portal/floating layout manager, navigation policy or product-level sticky pattern is admitted. Those require independent cross-product evidence.",
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
if (!api.includes("| API-049 |")) {
  const lines = api.split("\n");
  const index = lines.findIndex((line) => line.startsWith("| API-048 |"));
  if (index < 0) throw new Error("API-048 anchor missing");
  lines.splice(index + 1, 0, apiEntry);
  api = lines.join("\n");
  writeFileSync(apiPath, api);
}

let register = readFileSync(registerPath, "utf8");
if (!register.includes("### PD-073 —")) {
  register = register.trimEnd() + decision + "\n";
  writeFileSync(registerPath, register);
}

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-affix-back-top-governance.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", changelogPath, apiPath, registerPath, "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "docs(core): record Affix and BackTop 6F3 governance"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
