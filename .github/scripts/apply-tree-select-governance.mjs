import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = (path) => readFileSync(path, "utf8");

const changelogPath = "CHANGELOG.md";
let changelog = read(changelogPath);
const changelogEntry = "- Data Entry 6D7: hardened Core `TreeSelect` around its actual native-select implementation. Hierarchical data is now readonly, `title` is explicitly string text instead of a ReactNode that could stringify to `[object Object]`, single/multiple values retain native selection semantics, placeholder copy is caller-owned, hierarchy indentation is non-verbal whitespace, and the component now forwards the real select ref with canonical size/status, disabled and standard DOM/form/ARIA ownership. Search, async tree loading, checkbox selection, popup-tree behavior and custom node rendering remain out of scope.\n";
if (!changelog.includes("- Data Entry 6D7:")) {
  const anchor = "### Changed\n\n";
  if (!changelog.includes(anchor)) throw new Error("CHANGELOG Changed anchor missing");
  writeFileSync(changelogPath, changelog.replace(anchor, anchor + changelogEntry));
}

const apiPath = "docs/api-conformance.md";
let api = read(apiPath);
const apiRow = "| API-042 | Core `TreeSelect` 完成 reviewed 100：保留 native `select` 实现，readonly `treeData` 仅稳定展平为 native options；`TreeSelectNode.title` 收紧为 string，避免 ReactNode 经 `String()` 退化为 `[object Object]`。single/multiple 继续使用浏览器原生选择语义，`value/defaultValue/onChange` 接受 string / readonly string[] 输入并在 multiple change 时回传 string[]；`placeholder` 完全 caller-owned，不再注入 `Please select`。支持真实 `HTMLSelectElement` ref、标准 select DOM/form/ARIA、canonical `ControlSize`、error/warning status、disabled 与稳定 slot/depth metadata；不扩展搜索、异步加载、checkbox/tree-popup 或 custom renderer。 | same-source Showcase/API docs + `core-tree-select-6d7` focused tests + main runs 341/342 / PD-066 |\n";
if (!api.includes("| API-042 |")) {
  const lines = api.split(/(?<=\n)/);
  const index = lines.findIndex((line) => line.startsWith("| API-041 |"));
  if (index < 0) throw new Error("API-041 anchor missing");
  lines.splice(index + 1, 0, apiRow);
  writeFileSync(apiPath, lines.join(""));
}

const registerPath = "docs/abstraction-register.md";
let register = read(registerPath);
const decision = `

### PD-066 — TreeSelect stays a native flattened tree selector instead of becoming a Tree popup

- **Status:** accepted / Core hardening
- **Owner:** Core / Data Entry family
- **Evidence:** \`TreeSelect\` is an established retained Core control with no current Gosso Admin, Blog Admin or Blog public product consumer that would justify a larger composite picker. The pre-6D7 implementation already used one native \`<select>\`; its debt was semantic/API drift: mutable tree arrays, injected \`Please select\`, no ref/canonical size-status contract and \`title: ReactNode\` even though native \`<option>\` content was forced through \`String(...)\`, which can degrade to \`[object Object]\`.
- **Decision:** preserve the native-select architecture. Core recursively flattens readonly hierarchy data while retaining stable \`value\`, disabled state and depth metadata. Node \`title\` is string text because that is the native option contract. Single and multiple selection stay browser-native; no second custom selection state is introduced. Placeholder text is caller-owned and only exists when supplied.
- **API impact:** \`TreeSelectProps\` remains implementation-owned and is exported from Core. \`treeData\`, controlled value arrays and default arrays accept readonly inputs; multiple change emits a mutable string[] snapshot. The real \`HTMLSelectElement\` ref and standard select ARIA/data/form/event props are forwarded. Custom \`ControlSize\` replaces the conflicting native numeric \`size\` prop; \`error/warning\` status follows other Data Entry controls and error drives \`aria-invalid\`.
- **Scope boundary:** no popup tree, checkbox selection, search/filtering, async child loading, virtualisation, custom node rendering or business hierarchy model is admitted without independent product evidence. Rich tree behavior belongs to \`Tree\` or product composition.
- **Validation:** 6D7 runtime, same-source Showcase, direct Props contract, focused regression coverage and reviewed completion landed at \`main@d5cd5fc\`. Exact-head run 341 passed typecheck and all seven focused TreeSelect tests, then correctly exposed one pre-existing \`core-entry-controls\` test-isolation leak because a native \`API\` option from the earlier TreeSelect case remained in \`document.body\` and collided with a later unscoped Select role query. The isolation-only fix landed at \`main@0941a27\`; exact-head run 342 then passed the complete typecheck/test/build/pack/artifact/Pages gate without any TreeSelect runtime change.
- **Abstraction impact:** no TreeSelect Pattern/Gouno abstraction is admitted; it remains a narrow Core native hierarchical selector.
`;
if (!register.includes("### PD-066 —")) {
  writeFileSync(registerPath, register.trimEnd() + decision + "\n");
}

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-tree-select-governance.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", "CHANGELOG.md", "docs/api-conformance.md", "docs/abstraction-register.md", "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "docs(core): record TreeSelect 6D7 decision"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
