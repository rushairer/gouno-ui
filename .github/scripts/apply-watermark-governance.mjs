import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const changelogPath = "CHANGELOG.md";
const apiPath = "docs/api-conformance.md";
const registerPath = "docs/abstraction-register.md";

const changedEntry = "- Other 6F2: hardened Core `Watermark` with caller-owned required content, XML-safe SVG text encoding, normalized tile/rotation/opacity inputs, and standard div DOM/ARIA/style/ref passthrough. Core no longer injects the Gouno brand into generic watermarks.\n";
const breakingEntry = "- `Watermark.content` is now required; Core no longer defaults generic watermarks to `Gouno`.\n";
const apiEntry = "| API-048 | Core `Watermark` 完成 reviewed 100：`content` 改为 caller-owned 必填，Core 不再注入 Gouno 品牌；SVG text 在 data URL 编码前做 XML 转义，`gap/rotate/opacity` 对非有限/越界输入做稳定归一化。根 div 透传标准 DOM/ARIA/className/style/ref，`WatermarkProps` 由实现文件直接拥有。 | same-source Showcase/API docs + `core-watermark-6f2` focused tests + exact-head main certification / PD-072 |";
const decision = [
  "",
  "",
  "### PD-072 — Watermark keeps caller-owned content and decorative background semantics",
  "",
  "- **Status:** accepted / Core hardening",
  "- **Owner:** Core / Other family",
  "- **Evidence:** the established Core Watermark is retained by the Core baseline, but the previous implementation silently defaulted generic content to the Gouno brand, removed XML-significant characters instead of escaping text, accepted unsafe numeric values unchanged, and exposed no standard root DOM/ref contract. No product evidence justifies anti-tamper, observer-based or brand-policy behavior in Core.",
  "- **Decision:** keep Watermark as a passive repeated text background around ordinary content. `content` is caller-owned and required. Escape XML text before encoding the SVG data URL; normalize non-finite `rotate/gap/opacity`, enforce a minimum tile size and clamp opacity to 0..1. The root remains a normal div with standard DOM/ARIA/className/style props and a real ref. Caller style may intentionally override the generated background image.",
  "- **Content/accessibility impact:** the repeated watermark is decorative CSS background and is not announced as duplicate text. If the content region itself needs a name, callers use standard ARIA on the root. Core injects no Gouno/product brand and no locale copy.",
  "- **API impact:** `WatermarkProps` is implementation-owned and exported directly from Core. `content` becomes required; `children`, `rotate`, `gap`, `opacity`, standard div props and real root ref describe the actual contract.",
  "- **Validation:** 6F2 same-source Preview/Code and focused regression tests cover standard root props/ref, XML-safe text, finite/clamped numeric normalization, explicit caller style override, brand-default removal and reviewed completion. The exact-head certification after ownership must pass the complete typecheck/test/build/pack/artifact/Pages gate.",
  "- **Abstraction impact:** no anti-tamper overlay, ResizeObserver repair loop, document-wide watermark, product branding policy or export/security guarantee is admitted into Core.",
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
if (!api.includes("| API-048 |")) {
  const lines = api.split("\n");
  const index = lines.findIndex((line) => line.startsWith("| API-047 |"));
  if (index < 0) throw new Error("API-047 anchor missing");
  lines.splice(index + 1, 0, apiEntry);
  api = lines.join("\n");
  writeFileSync(apiPath, api);
}

let register = readFileSync(registerPath, "utf8");
if (!register.includes("### PD-072 —")) {
  register = register.trimEnd() + decision + "\n";
  writeFileSync(registerPath, register);
}

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-watermark-governance.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", changelogPath, apiPath, registerPath, "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "docs(core): record Watermark 6F2 governance"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
