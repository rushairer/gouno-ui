import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = (path) => readFileSync(path, "utf8");

const changelogPath = "CHANGELOG.md";
let changelog = read(changelogPath);
const changelogEntry = "- Data Entry 6D6: hardened Core `Cascader` while preserving its native per-level select architecture. `value/defaultValue/onChange` now form one path-state contract, clearing a level truncates the path instead of storing an empty key, root naming is caller-owned through standard group ARIA, and each native select uses a language-neutral numeric level name. English `Please select` / `Select` / `Level N` defaults were removed; placeholder copy is caller-owned. The component now supports readonly option trees, canonical control sizing/status, disabled semantics, stable slots and a real root ref without adding search, async loading or custom-panel feature bags.\n";
if (!changelog.includes("- Data Entry 6D6:")) {
  const anchor = "### Changed\n\n";
  if (!changelog.includes(anchor)) throw new Error("CHANGELOG Changed anchor missing");
  writeFileSync(changelogPath, changelog.replace(anchor, anchor + changelogEntry));
}

const apiPath = "docs/api-conformance.md";
let api = read(apiPath);
const apiRow = "| API-041 | Core `Cascader` 完成 reviewed 100：保留逐级原生 `select` 架构，`value/defaultValue/onChange` 是唯一路径状态；清空第 N 级会截断该级及更深路径而不是写入空 key。根节点使用 caller-owned 标准 `aria-label/aria-labelledby` 的 `role=group`，各级 select 只使用语言无关数字位置名；不再注入 `Please select` / `Select` / `Level N` 英文文案，`placeholder` 文案由调用方拥有。支持 readonly option tree、disabled、canonical `ControlSize`、`error/warning` status、标准 root DOM/ref 与稳定 slots；不扩展搜索、异步加载、自定义面板或业务地址模型。 | same-source Showcase/API docs + `core-cascader-6d6` focused tests + main runs 336/338 / PD-065 |\n";
if (!api.includes("| API-041 |")) {
  const lines = api.split(/(?<=\n)/);
  const index = lines.findIndex((line) => line.startsWith("| API-040 |"));
  if (index < 0) throw new Error("API-040 anchor missing");
  lines.splice(index + 1, 0, apiRow);
  writeFileSync(apiPath, lines.join(""));
}

const registerPath = "docs/abstraction-register.md";
let register = read(registerPath);
const decision = `

### PD-065 — Cascader stays native-select based and makes hierarchy semantics language-neutral

- **Status:** accepted / Core hardening
- **Owner:** Core / Data Entry family
- **Evidence:** \`Cascader\` is an established retained Core control with no current Gosso Admin, Blog Admin or Blog public product consumer that would justify a larger picker framework. The pre-6D6 implementation injected \`Please select\`, \`Select\` and \`Level N\`, exposed no composite root DOM/ref contract, used mutable option arrays and wrote an empty string into the path when a level was cleared.
- **Decision:** preserve one native \`<select>\` per visible hierarchy level. \`value/defaultValue/onChange\` is the only path-state contract; selecting a node replaces that level and truncates deeper selections, while choosing the empty option truncates the path before that level. The composite root owns \`role="group"\` and caller-provided standard accessible naming; each native select uses only its language-neutral numeric position name within that group. Visible placeholder copy belongs to the caller.
- **API impact:** \`CascaderProps\` is owned directly by \`cascader.tsx\` and exported from Core. Root standard div/ARIA/data/event properties and real \`HTMLDivElement\` ref are supported. Option trees and incoming paths accept readonly arrays. Canonical \`ControlSize\` and \`error/warning\` status align native selects with other data-entry controls; error status drives \`aria-invalid\`.
- **Scope boundary:** no search input, remote loading, async child resolution, custom popup/listbox, tag/multiple selection, domain address model or custom node rendering is admitted without independent product evidence.
- **Validation:** 6D6 runtime/same-source Showcase/focused tests and reviewed completion reached \`main@7951a19\`; exact-head run 336 passed full typecheck/tests/build/pack/artifact/Pages. Direct props ownership landed at \`main@4543dfd\`; exact-head run 338 also passed the complete publish gate.
- **Abstraction impact:** no Cascader-oriented Pattern/Gouno abstraction is admitted; it remains a narrow Core hierarchical native-select primitive.
`;
if (!register.includes("### PD-065 —")) {
  writeFileSync(registerPath, register.trimEnd() + decision + "\n");
}

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-cascader-governance.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", "CHANGELOG.md", "docs/api-conformance.md", "docs/abstraction-register.md", "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "docs(core): record Cascader 6D6 decision"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
