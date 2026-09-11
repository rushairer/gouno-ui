import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const changelogPath = "CHANGELOG.md";
let changelog = readFileSync(changelogPath, "utf8");
const changelogEntry = '- Feedback 6E1: hardened Core `Popconfirm` around one local confirmation lifecycle. Confirmation and cancellation labels are now explicitly caller-owned with no injected English defaults; the trigger child is no longer cloned or overwritten, while the wrapper composes natural bubbling and lets child/root `preventDefault` veto opening. Async confirmation exposes `aria-busy`, locks cancellation/Escape while pending, closes on success, and preserves context after rejection. Standard span DOM/ref ownership is retained without adding controlled-open, permission, MFA, or product feedback orchestration.\n';
if (!changelog.includes("Feedback 6E1:")) {
  const anchor = "### Changed\n\n";
  if (!changelog.includes(anchor)) throw new Error("CHANGELOG Changed anchor missing");
  changelog = changelog.replace(anchor, anchor + changelogEntry);
  writeFileSync(changelogPath, changelog);
}

const apiPath = "docs/api-conformance.md";
let api = readFileSync(apiPath, "utf8");
const apiRow = '| API-043 | Core `Popconfirm` 完成 reviewed 100：`title`、`okText`、`cancelText` 与业务回调均由 caller 显式拥有，不再注入 `Confirm/Cancel` 英文默认；trigger child 保持原事件合同，不再通过 `cloneElement` 改写，包装 span 仅接收自然冒泡并组合标准 root `onClick`，child/root 的 `preventDefault` 都可 veto 打开。`disabled` 只阻止确认框打开而不篡改 child；异步 `onConfirm` pending 时内容标记 `aria-busy` 并锁住取消/Escape，成功后关闭、拒绝后保持上下文且恢复操作。组件提供真实 `HTMLSpanElement` ref、标准 span DOM/ARIA/data/event ownership；受控 open、权限/MFA、删除状态和全局反馈编排继续由产品拥有。 | same-source Showcase/API docs + `core-popconfirm-6e1` focused tests + main runs 345/346 / PD-067 |';
if (!api.includes("| API-043 |")) {
  const anchor = "\n\n## 当前破坏式迁移说明";
  if (!api.includes(anchor)) throw new Error("API conformance anchor missing");
  api = api.replace(anchor, "\n" + apiRow + anchor);
  writeFileSync(apiPath, api);
}

const registerPath = "docs/abstraction-register.md";
let register = readFileSync(registerPath, "utf8");
const decision = `\n\n### PD-067 — Popconfirm owns one local confirmation lifecycle, not product action orchestration\n\n- **Status:** accepted / Core hardening\n- **Owner:** Core / Feedback family\n- **Evidence:** \`Popconfirm\` is a retained Core confirmation primitive with no current Gosso Admin, Blog Admin or Blog public product consumer requiring a broader contract. The pre-6E1 implementation injected English \`Confirm/Cancel\` copy, cloned the trigger child to overwrite \`onClick\`, and had an under-specified async busy/dismiss lifecycle. Those are primitive-level debts rather than evidence for a controlled business workflow abstraction.\n- **Decision:** keep one local, internally-owned open state. The caller explicitly supplies title and both action labels. The trigger child keeps its own event behavior; a real wrapper span observes natural bubbling, composes its standard \`onClick\`, and opens only when the event was not prevented and the primitive is enabled. Async confirmation locks cancellation and Escape while pending, closes after fulfillment, and remains open after rejection so the caller can surface product-owned failure feedback without losing context.\n- **API impact:** \`PopconfirmProps\` is implementation-owned and exported directly from Core. Standard span DOM/ARIA/data/event props plus a real \`HTMLSpanElement\` ref belong to the trigger wrapper. \`disabled\` blocks Popconfirm opening without mutating the child. No Core default language remains for confirmation or cancellation.\n- **Scope boundary:** no controlled \`open/onOpenChange\`, permission policy, MFA/step-up flow, mutation state machine, retry policy, business error rendering or global message orchestration is admitted without independent product evidence. Those concerns stay in product composition.\n- **Validation:** the 6E1 runtime, same-source Showcase, focused tests and reviewed completion passed the complete publish gate at main run 345. The final event-composition correction and direct Props ownership were then validated in the complete typecheck/test/build/pack/artifact/Pages gate at main run 346.\n- **Abstraction impact:** no Popconfirm-oriented Pattern/Gouno abstraction is admitted; it remains a narrow Core confirmation primitive.\n`;
if (!register.includes("### PD-067 —")) {
  register = register.trimEnd() + decision;
  writeFileSync(registerPath, register);
}

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-popconfirm-governance.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", "CHANGELOG.md", "docs/api-conformance.md", "docs/abstraction-register.md", "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "docs(core): record Popconfirm 6E1 decision"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
