import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = (path) => readFileSync(path, "utf8");

const changelogPath = "CHANGELOG.md";
let changelog = read(changelogPath);
const changelogEntry = "- Data Entry 6D5: hardened Core `Transfer` around one target-key state contract with stable item keys, caller-owned list/operation labels, disabled-item protection, preserved opposite-side selection, grouped list semantics, standard root DOM/ARIA/ref ownership and same-source Showcase coverage. The documented canonical path always provides `titles`/`operations`; pre-6D5 omitted labels remain a narrow compatibility bridge that injects no English list copy. Search, pagination, remote data and business collection rules remain product-owned.\n";
if (!changelog.includes("- Data Entry 6D5:")) {
  const anchor = "### Changed\n\n";
  if (!changelog.includes(anchor)) throw new Error("CHANGELOG Changed anchor missing");
  changelog = changelog.replace(anchor, anchor + changelogEntry);
  writeFileSync(changelogPath, changelog);
}

const apiPath = "docs/api-conformance.md";
let api = read(apiPath);
const apiRow = "| API-040 | Core `Transfer` 完成 reviewed 100：`dataSource[].key` 提供稳定条目标识，`targetKeys/defaultTargetKeys/onChange` 是唯一目标集合状态；canonical 调用由 caller-owned `titles` / `operations` 提供左右列表标题和可访问操作名，disabled 条目不可选择或移动，单向移动只清除实际 moved keys 并保留另一侧选择。根节点拥有标准 div/ARIA/data/event/ref，两侧在有标题时使用 `role=group` + `aria-labelledby`。pre-6D5 省略 `titles/operations` 仅作为窄 compatibility bridge 暂留，不注入英文 `Source/Target`，也不作为 Showcase canonical 写法。搜索、分页、远程数据与业务集合规则继续由产品拥有。 | same-source Showcase/API docs + `core-transfer-6d5` focused tests + main run 320 / PD-064 |\n";
if (!api.includes("| API-040 |")) {
  const lines = api.split(/(?<=\n)/);
  const index = lines.findIndex((line) => line.startsWith("| API-039 |"));
  if (index < 0) throw new Error("API-039 anchor missing");
  lines.splice(index + 1, 0, apiRow);
  writeFileSync(apiPath, lines.join(""));
}

const registerPath = "docs/abstraction-register.md";
let register = read(registerPath);
const decision = `

### PD-064 — Transfer keeps dual-list movement narrow and makes labels caller-owned

- **Status:** accepted / Core hardening
- **Owner:** Core / Data Entry family
- **Evidence:** \`Transfer\` is an established retained Core control, but there are no current Gosso Admin, Blog Admin or Blog public product consumers that justify expanding it into a collection-management feature bag. The pre-6D5 implementation injected English \`Source\` / \`Target\` list titles, exposed arrow-only operations as the only action copy, did not expose a standard root DOM/ref contract and cleared selection too broadly after a one-direction move. Core retention policy requires correcting the established contract rather than deleting it merely because current product usage is absent.
- **Decision:** keep Transfer as a bounded two-collection movement primitive. \`dataSource[].key\` is stable item identity; \`targetKeys/defaultTargetKeys/onChange\` is the single controlled/uncontrolled target-set contract. Core owns local checkbox selection, disabled-item protection and moving selected keys between the source and target views. Moving one direction clears only the keys that actually moved so selection on the opposite side remains intact. Canonical callers own both visible list titles and operation labels; titled lists expose \`role="group"\` associated through \`aria-labelledby\`.
- **API impact:** \`TransferProps\` is owned directly by \`transfer.tsx\` and the root forwards standard div/ARIA/data/event attributes plus the real \`HTMLDivElement\` ref. Canonical Showcase/API documentation always supplies \`titles\` and \`operations\`. To avoid breaking pre-6D5 callers solely during this 0.x convergence line, those two properties remain optional as a narrow compatibility bridge: omitted titles render no injected English heading/group name, and omitted operations retain the historical symbol buttons. This bridge is not a second canonical API and must not be used as evidence for future feature expansion.
- **Scope boundary:** no search field, filtering, pagination, remote loading, virtualisation, select-all policy, ordering, drag-and-drop, domain rendering or batch business rules are admitted. Those remain product-owned until independent product evidence proves a smaller stable contract.
- **Validation:** the 6D5 runtime, direct Props ownership, same-source Showcase/API documentation, reviewed completion and focused regression coverage landed at \`main@e29c214\`. Exact-head run 319 correctly stopped at typecheck because one older Showcase base example still used the pre-6D5 unlabeled shape. The narrow compatibility correction landed at \`main@47885e7\`; exact-head run 320 then passed typecheck, the complete test suite, package build, Showcase build, package pack/artifact and Pages publication. Workflow restoration was independently revalidated by exact-head run 324 before this governance record was finalized.
- **Abstraction impact:** no Transfer-oriented Pattern/Gouno abstraction is admitted. Transfer remains Core infrastructure; resource search, assignment policy, permissions and collection workflows stay product-owned.
`;
if (!register.includes("### PD-064 —")) {
  writeFileSync(registerPath, register.trimEnd() + decision + "\n");
}

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-transfer-governance.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", ["add", "-A", "CHANGELOG.md", "docs/api-conformance.md", "docs/abstraction-register.md", "package.json", ".github/scripts"], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "docs(core): record Transfer 6D5 decision"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
