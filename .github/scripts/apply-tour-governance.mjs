import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const changelogPath = "CHANGELOG.md";
const apiPath = "docs/api-conformance.md";
const registerPath = "docs/abstraction-register.md";

const changedEntry = "- Feedback 6E4: hardened Core `Tour` as a controlled modal walkthrough with caller-owned navigation copy, a controlled/uncontrolled normalized step index, canonical Dialog focus containment/Escape close/focus return, and visible step titles as the dialog accessible name. The never-implemented `TourStep.target` hook and injected English `Product tour` / `Previous` / `Next` / `Finish` copy are removed; target highlighting/positioning and product onboarding orchestration remain outside Core.\n";
const breakingEntry = "- `TourStep.target` is removed because Core never implemented target positioning/highlighting. `Tour` now requires caller-owned `previousText`, `nextText`, and `finishText` instead of injecting English copy; the visible step title names the modal dialog.\n";
const apiEntry = "| API-046 | Core `Tour` 完成 reviewed 100：保持受控 `open`，并以 `current/onChange` 支持可受控/非受控的规范化步骤索引；复用 canonical Dialog 的 modal/focus/Escape/focus-return 行为，当前可见 `title` 直接提供 dialog accessible name，`previousText/nextText/finishText` 全由 caller 本地化提供。旧 `TourStep.target` 从未被 runtime 实现，因此不作为虚假公共能力保留；目标定位/高亮、产品 onboarding 状态与跨路由编排继续由产品拥有。 | same-source Showcase/API docs + `core-tour-6e4` focused tests + main run 360 / PD-070 |";
const decision = `\n\n### PD-070 — Tour stays a modal walkthrough instead of claiming target-positioning behavior\n\n- **Status:** accepted / Core hardening\n- **Owner:** Core / Feedback family\n- **Evidence:** the established Core Tour already modeled a finite sequence of titled steps, but the old \`TourStep.target\` was never consumed by runtime while the implementation rendered a fixed modal with injected English \`Product tour\`, \`Previous\`, \`Next\`, and \`Finish\` copy. The completed product corpus does not provide evidence for a reusable target-highlighting/positioning engine.\n- **Decision:** retain Tour as a controlled modal walkthrough. \`open\` remains caller-owned; \`current/onChange\` form the optional controlled step-index path while an omitted \`current\` uses local state normalized to the current readonly step collection and resets after close. Reuse the canonical Dialog primitive for modal focus containment and Escape handling. Because Tour is opened by an external controlled action rather than a nested DialogTrigger, capture that active element before Dialog autofocus and restore it when the Tour closes. Use the visible current step title as the dialog accessible name.\n- **Content/accessibility impact:** navigation labels are explicit caller-owned \`previousText\`, \`nextText\`, and \`finishText\`; Core injects no English tour name or action copy. An empty step collection renders no Tour. No target DOM lookup, spotlight, anchor placement, scroll orchestration or route progression is implied by this contract.\n- **API impact:** \`TourProps\` and \`TourStep\` are implementation-owned and exported directly from Core. \`TourStep.target\` is removed because it was a non-functional promise rather than a compatibility contract; adding target positioning later requires independent evidence and a separately tested public design.\n- **Validation:** 6E4 same-source Showcase and six focused regression tests cover accessible naming/localized copy, controlled and uncontrolled index behavior, normalized callbacks, canonical Dialog Escape plus explicit external-trigger focus return, reset after close, real content ref, and removal of the fake target API. Exact-head main run 360 passed the complete typecheck/test/build/pack/artifact/Pages gate.\n- **Abstraction impact:** no Tour-oriented Pattern/Gouno onboarding abstraction is admitted; onboarding policy, target discovery, persistence, routing and business completion state remain product-owned.\n`;

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
if (!api.includes("| API-046 |")) {
  const lines = api.split("\n");
  const index = lines.findIndex((line) => line.startsWith("| API-045 |"));
  if (index < 0) throw new Error("API-045 anchor missing");
  lines.splice(index + 1, 0, apiEntry);
  api = lines.join("\n");
  writeFileSync(apiPath, api);
}

let register = readFileSync(registerPath, "utf8");
if (!register.includes("### PD-070 —")) {
  register = register.trimEnd() + decision + "\n";
  writeFileSync(registerPath, register);
}

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-tour-governance.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", changelogPath, apiPath, registerPath, "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "docs(core): record Tour 6E4 governance"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
