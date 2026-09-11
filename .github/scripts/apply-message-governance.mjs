import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const changelogPath = "CHANGELOG.md";
let changelog = readFileSync(changelogPath, "utf8");
const changelogEntry = '- Feedback 6E2: hardened Core `MessageProvider` as a local transient queue. Message IDs are now deterministic per Provider, removal timers are tracked and cleared on unmount, and each message owns its `status`/`alert` live-region semantics instead of stacking those roles under a second outer `aria-live`. The existing `open/info/success/warning/error` hook surface is retained, `duration` only controls automatic removal, and global singleton, manual key/update/destroy, Promise orchestration, and product notification-center behavior remain out of Core.\n';
if (!changelog.includes("Feedback 6E2:")) {
  const anchor = "### Changed\n\n";
  if (!changelog.includes(anchor)) throw new Error("CHANGELOG Changed anchor missing");
  changelog = changelog.replace(anchor, anchor + changelogEntry);
  writeFileSync(changelogPath, changelog);
}

const apiPath = "docs/api-conformance.md";
let api = readFileSync(apiPath, "utf8");
const apiRow = '| API-044 | Core `MessageProvider` 完成 reviewed 100：Provider 只拥有当前 React 子树内的 transient message queue 与 `duration` 自动移除策略；`useMessage().open/info/success/warning/error` 保持既有调用合同。队列 key 改为 Provider 内单调 ID，不依赖时间/随机数；自动移除 timer 被显式跟踪并在触发或 Provider 卸载时清理。每条消息自己使用 `status`（info/success/warning）或 `alert`（error）并声明 `aria-atomic`，外层 message region 不再叠加第二个 `aria-live`，避免重复播报。`MessageProviderProps` 由实现文件直接 ownership/export；全局 singleton、跨 root manager、手动 key/update/destroy、Promise 生命周期和业务通知中心继续由产品拥有。 | same-source Showcase/API docs + `core-message-6e2` focused tests + main run 349 / PD-068 |';
if (!api.includes("| API-044 |")) {
  const anchor = "\n\n## 当前破坏式迁移说明";
  if (!api.includes(anchor)) throw new Error("API conformance anchor missing");
  api = api.replace(anchor, "\n" + apiRow + anchor);
  writeFileSync(apiPath, api);
}

const registerPath = "docs/abstraction-register.md";
let register = readFileSync(registerPath, "utf8");
const decision = `\n\n### PD-068 — Message remains a local transient queue, not a global feedback manager\n\n- **Status:** accepted / Core hardening\n- **Owner:** Core / Feedback family\n- **Evidence:** \`MessageProvider/useMessage\` is a retained Core feedback primitive with no current Gosso Admin, Blog Admin or Blog public product consumer requiring cross-root or persistent orchestration. The pre-6E2 implementation used \`Date.now()+Math.random()\` keys, left raw removal timers unmanaged on Provider teardown, and combined an outer \`aria-live=polite\` region with per-item \`status/alert\` roles, creating avoidable nondeterminism and overlapping live-region ownership.\n- **Decision:** keep the existing Provider-scoped \`open/info/success/warning/error\` API and one transient queue. IDs are monotonic inside each Provider; each scheduled removal is tracked and cleared when it fires or when the Provider unmounts. Each rendered message owns its own atomic live-region role: error uses alert, other tones use status. The outer positioning region is not a second live region.\n- **API impact:** \`MessageProviderProps\` is implementation-owned and exported directly from Core. \`children\` scopes the context and optional \`duration\` controls automatic removal, defaulting to 2500ms; content/tone continue to be caller-owned through \`useMessage\`. No new imperative global API is introduced.\n- **Scope boundary:** no singleton outside React context, cross-root manager, manual message key/update/destroy, promise-state helper, persistence, history, notification center or business retry/error policy is admitted without independent product evidence.\n- **Validation:** 6E2 runtime, same-source Showcase, five focused regression tests, reviewed completion and direct Props ownership passed the complete typecheck/test/build/pack/artifact/Pages gate at main run 349.\n- **Abstraction impact:** no Message-oriented Pattern/Gouno abstraction is admitted; it remains a narrow Core transient-feedback primitive.\n`;
if (!register.includes("### PD-068 —")) {
  register = register.trimEnd() + decision;
  writeFileSync(registerPath, register);
}

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-message-governance.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", "CHANGELOG.md", "docs/api-conformance.md", "docs/abstraction-register.md", "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "docs(core): record Message 6E2 decision"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
