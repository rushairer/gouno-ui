from pathlib import Path


def insert_before(path: str, marker: str, content: str, guard: str) -> None:
    target = Path(path)
    text = target.read_text(encoding="utf-8")
    if guard in text:
        return
    if marker not in text:
        raise SystemExit(f"missing marker in {path}: {marker!r}")
    target.write_text(text.replace(marker, content + marker, 1), encoding="utf-8")


api_row = (
    "\n| API-032 | Core `Avatar` / `Grid` 完成 reviewed 100：Avatar 的 canonical `size` 使用 Gouno "
    "`small/middle/large | number`，`sm/default/lg` 仅保留为 deprecated 0.2.x 兼容桥；`shape` 使用 "
    "`circle/square`，Image/Fallback/Badge/Group/GroupCount 属于同一 compound family，Group `max` 只拥有"
    "可见槽位和溢出计数，业务状态与可访问名称继续由调用方拥有。现有简单 `Grid(columns/gap)` 必须保留，"
    "同 family 增量提供 24 栅格 `Row/Col`；Row 拥有 gutter/align/justify/wrap，Col 拥有 "
    "span/offset/order/push/pull/flex 与 xs/sm/md/lg/xl/xxl 逐级继承响应式覆盖。不得用 24 栅格替换或删除"
    "现有 Grid helper。 | same-source Showcase/API docs + `core-avatar-grid-6b1` focused tests + main run 293 / PD-056 |"
)
insert_before(
    "docs/api-conformance.md",
    "\n\n## 当前破坏式迁移说明",
    api_row,
    "| API-032 |",
)

register = Path("docs/abstraction-register.md")
register_text = register.read_text(encoding="utf-8")
if "### PD-056 —" not in register_text:
    pd = """

### PD-056 — Avatar and Grid 6B1 reach reviewed 100 by extending established families

- **Status:** accepted / Core hardening
- **Owner:** Core / General + Layout families
- **Evidence:** Avatar and Grid are established generic Core families protected by the retention policy. The existing Avatar surface already exposed Root/Image/Fallback while the primitive layer contained Group/Badge/GroupCount; the existing Grid helper already served simple CSS Grid layouts. Mature design-system review confirms avatar grouping and 24-column responsive layout as durable component-library capabilities, but Gouno's existing `ControlSize`, DOM/ARIA and compatibility rules remain authoritative. Branch Node 24 verification passed typecheck, 559 tests, package build and Showcase build; exact-main run 293 then passed Verify, pack, artifact upload and Pages publication, and `gh-pages` deployed `10500d84917bab2e643824314a67ec85d8c1a876`.
- **Decision:** certify `core-avatar` and `core-grid` at reviewed 100 for their deliberate Gouno scope. Avatar canonicalizes `small/middle/large | number`, adds `circle/square`, and exposes Image/Fallback/Badge/Group/GroupCount as one compound family. `AvatarGroup.max` owns only bounded visual slots and overflow count; localized member/business semantics and accessible naming stay caller-owned. Grid retains the established `Grid(columns, gap)` helper and adds `Row`/`Col` as the 24-column responsive layer rather than replacing the helper.
- **Compatibility:** `Avatar size="sm|default|lg"` remains accepted as a deprecated bridge and normalizes to canonical size semantics; this batch does not delete it. Existing `Grid` call sites keep their component and props. Removal of either established compatibility surface would require a separate migration assessment and, where it means deleting an established Core capability, explicit maintainer approval under the retention rule.
- **Responsive contract:** `Col` supports span/offset/order/push/pull/flex plus xs/sm/md/lg/xl/xxl overrides; unspecified fields inherit from the previous breakpoint. The breakpoints follow the existing Gouno/Tailwind 640/768/1024/1280/1536 system. Row owns horizontal/vertical gutter composition and alignment/wrapping; Col owns its grid sizing and responsive CSS-variable projection.
- **Consequence:** reviewed completion continues family by family; reaching 100 for Avatar/Grid does not authorize pruning lower-priority Core families. The next Layout hardening target is Splitter, which must preserve the established Splitter family while resolving composition, controlled sizing, keyboard accessibility and compatibility before certification.
"""
    register.write_text(register_text.rstrip() + pd, encoding="utf-8")

migration_section = """

## Avatar and Grid 6B1 compatibility

Avatar now uses the repository-wide canonical size vocabulary `small | middle | large` and also accepts an explicit pixel number. Existing `sm | default | lg` values remain accepted as deprecated 0.2.x compatibility aliases and normalize to the canonical semantics; this batch does not require an immediate consumer rewrite. New code should use the canonical names.

`AvatarImage` and `AvatarFallback` remain available, while `AvatarBadge`, `AvatarGroup` and `AvatarGroupCount` extend the same compound family. `AvatarGroup.max` is a visual overflow bound only; member data, localized overflow wording when customized, online/offline meaning and accessible names remain caller-owned.

The existing `Grid columns/gap` helper is retained unchanged in ownership and remains appropriate for simple CSS Grid composition. `Row` / `Col` are additive 24-column layout APIs for responsive spans, offsets, ordering and gutters. Do not migrate a working `Grid` call site merely to use Row/Col; choose the layer that matches the layout semantics.
"""
insert_before(
    "docs/migration.md",
    "\n## Steps and Menu navigation alignment",
    migration_section,
    "## Avatar and Grid 6B1 compatibility",
)

changelog = Path("CHANGELOG.md")
changelog_text = changelog.read_text(encoding="utf-8")
if "General/Layout 6B1:" not in changelog_text:
    marker = "### Changed\n\n"
    line = (
        "- General/Layout 6B1: hardened Core `Avatar` and `Grid`; Avatar now follows canonical "
        "`small/middle/large | number` sizing while retaining deprecated `sm/default/lg` compatibility, exposes "
        "Group/Badge/Count compound anatomy, and Grid retains its simple helper while adding responsive 24-column "
        "`Row`/`Col`.\n"
    )
    if marker not in changelog_text:
        raise SystemExit("missing Unreleased Changed marker")
    changelog.write_text(changelog_text.replace(marker, marker + line, 1), encoding="utf-8")
