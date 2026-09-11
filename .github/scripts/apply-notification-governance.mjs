import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const changelogPath = "CHANGELOG.md";
let changelog = readFileSync(changelogPath, "utf8");
const changelogEntry = '- Feedback 6E3: hardened Core `NotificationProvider` as a finite-lived local notification queue. Provider-local monotonic IDs replace time/random keys, removal timers are tracked and cleared on unmount, and each notice owns one atomic `status` region instead of nesting under an additional outer `aria-live`. `NotificationNotice` is now an explicit public type; notice duration accepts finite positive milliseconds and otherwise falls back to 4500ms, removing the old `duration=0` uncloseable-persistence sentinel. Persistent notification centers, read state, manual close/update/destroy, and cross-root singleton behavior remain product-owned.\n';
if (!changelog.includes("Feedback 6E3:")) {
  const anchor = "### Changed\n\n";
  if (!changelog.includes(anchor)) throw new Error("CHANGELOG Changed anchor missing");
  changelog = changelog.replace(anchor, anchor + changelogEntry);
  writeFileSync(changelogPath, changelog);
}

const apiPath = "docs/api-conformance.md";
let api = readFileSync(apiPath, "utf8");
const apiRow = '| API-045 | Core `NotificationProvider` 完成 reviewed 100：Provider 只拥有当前 React 子树内的有限生命周期 transient notification queue；`useNotification().open(NotificationNotice)` 是唯一通知入口，`NotificationNotice` 显式公开 `title/description/duration`。队列 key 使用 Provider 内单调 ID，不依赖时间或随机数；自动移除 timer 被跟踪并在触发或 Provider 卸载时清理。每条通知自身使用 atomic `role=status`，外层定位 region 不再叠加 `aria-live`。`duration` 仅接受有限正毫秒，省略、非有限或非正值统一回到 4500ms，因此移除旧 `duration=0 => 永久驻留` 但无 close API 的不完整语义。`NotificationProviderProps` 与 `NotificationNotice` 均由实现文件直接 ownership/export；持久通知、已读状态、手动 close/update/destroy、跨 root singleton 和业务通知中心继续由产品拥有。 | same-source Showcase/API docs + `core-notification-6e3` focused tests + main run 352 / PD-069 |';
if (!api.includes("| API-045 |")) {
  const anchor = "\n\n## 当前破坏式迁移说明";
  if (!api.includes(anchor)) throw new Error("API conformance anchor missing");
  api = api.replace(anchor, "\n" + apiRow + anchor);
  writeFileSync(apiPath, api);
}

const registerPath = "docs/abstraction-register.md";
let register = readFileSync(registerPath, "utf8");
const decision = `\n\n### PD-069 — Notification stays finite-lived instead of pretending to be a persistent notification center\n\n- **Status:** accepted / Core hardening\n- **Owner:** Core / Feedback family\n- **Evidence:** \`NotificationProvider/useNotification\` is a retained Core notice primitive with no current Gosso Admin, Blog Admin or Blog public product consumer requiring persistence or notification-center behavior. The pre-6E3 implementation used time-plus-random keys, left removal timers unmanaged on teardown, wrapped notices in an outer \`aria-live=polite\`, and treated \`duration=0\` as permanent even though the API exposed no close/destroy operation. That last combination created an uncloseable state rather than a complete persistence contract.\n- **Decision:** keep one Provider-scoped transient queue. IDs are monotonic inside the Provider; removal timers are tracked and cleared on fire/unmount. Each notice owns one atomic status region and the outer positioning container is not another live region. A notice lifetime is always finite: a finite positive \`duration\` is honored, while omitted, non-finite or non-positive values fall back to 4500ms.\n- **API impact:** \`NotificationProviderProps\` and \`NotificationNotice\` are implementation-owned and exported directly from Core. \`useNotification().open(notice)\` remains the only runtime entry point, with title/description caller-owned and duration optional. The former zero-duration permanence sentinel is removed because Core has no matching close contract.\n- **Scope boundary:** no persistence, read/unread state, history, manual close/update/destroy keys, action routing, cross-root singleton, storage, permission policy or business notification center is admitted without independent product evidence.\n- **Validation:** 6E3 runtime, same-source Showcase, five focused regression tests, reviewed completion and direct type ownership passed the complete typecheck/test/build/pack/artifact/Pages gate at main run 352.\n- **Abstraction impact:** no Notification-oriented Pattern/Gouno abstraction is admitted; it remains a narrow Core transient-notice primitive.\n`;
if (!register.includes("### PD-069 —")) {
  register = register.trimEnd() + decision;
  writeFileSync(registerPath, register);
}

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-notification-governance.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", "CHANGELOG.md", "docs/api-conformance.md", "docs/abstraction-register.md", "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "docs(core): record Notification 6E3 decision"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
