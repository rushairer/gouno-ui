from pathlib import Path


def read(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    Path(path).write_text(content, encoding="utf-8")


# API-033: append directly after API-032 and refuse silent renumbering/concurrent edits.
api_path = "docs/api-conformance.md"
api = read(api_path)
if "| API-033 |" in api:
    raise SystemExit("API-033 already exists")
lines = api.splitlines()
indices = [i for i, line in enumerate(lines) if line.startswith("| API-032 |")]
if len(indices) != 1:
    raise SystemExit(f"expected exactly one API-032 row, found {len(indices)}")
api_row = (
    "| API-033 | Core `Splitter` 完成 reviewed 100：canonical 组合为 `Splitter` + `Splitter.Panel`，"
    "支持两个及以上 Panel、`sizes/defaultSizes` 完整尺寸向量、Panel `defaultSize/min/max/resizable` 约束、"
    "pointer 与 Arrow/Home/End 键盘调整，以及 `onSizesChange/onResizeStart/onResizeEnd` 生命周期。"
    "每个 resize handle 使用真实 `separator` 语义并公开 orientation/value ARIA；`resizable=false` 会禁用相邻 handle。"
    "既有 `first/second/defaultSize/min/max/onResize(number)` 二面板 API 继续作为 deprecated compatibility 保留，"
    "不得因 canonical compound API 成熟而直接删除；`orientation` 是唯一轴向命名，不再引入 `layout` 同义入口。"
    " | same-source Showcase/API docs + `core-splitter-6b2` focused tests + main run 295 / PD-057 |"
)
lines.insert(indices[0] + 1, api_row)
write(api_path, "\n".join(lines) + "\n")

# PD-057: durable abstraction/certification decision.
pd_path = "docs/abstraction-register.md"
pd = read(pd_path)
if "### PD-057" in pd:
    raise SystemExit("PD-057 already exists")
if "### PD-056" not in pd:
    raise SystemExit("PD-056 baseline missing")
pd_entry = r'''

### PD-057 — Splitter 6B2 reaches reviewed 100 through compound multi-panel hardening

- **Status:** accepted / Core hardening
- **Owner:** Core / Layout family
- **Evidence:** Splitter is an established generic Core family protected by the retention policy. Its pre-6B2 surface only supported a fixed `first/second` pair with one first-panel percentage, while mature design-system practice demonstrates durable value in compound panels, multiple resizable regions, per-panel constraints, controlled sizing and resize lifecycle. The implementation branch passed Node 24 typecheck, 565 tests, package build and Showcase build. Exact-main run 295 for `32f73e1a4d6998f493684836a8671e6ebb7063c0` passed Verify, package packing, artifact upload and Pages publication; `gh-pages` then published `c41f36ec2fb58fbb2a2aed280727ed248da9683f` with deployment source `32f73e1a4d6998f493684836a8671e6ebb7063c0`.
- **Decision:** certify `core-splitter` at reviewed 100 for the deliberate Gouno scope. Canonical composition is `Splitter` with direct `Splitter.Panel` children. Root `sizes/defaultSizes` owns the complete normalized size vector; Panel owns `defaultSize/min/max/resizable`; pointer and keyboard interaction share the same adjacent-panel constraint model; standard separator ARIA exposes axis and current bounds; root and Panel retain standard DOM/ref extension.
- **Compatibility:** the established `first`, `second`, `defaultSize`, `min`, `max` and `onResize(number)` contract remains accepted only as deprecated compatibility. New code should migrate to `Splitter.Panel` and `onSizesChange`, but lack of migration is not grounds for deleting the old path without explicit maintainer approval. `orientation` remains the single axis term; no duplicate `layout` alias is admitted.
- **Scope boundary:** 6B2 does not copy every current Ant Design Splitter feature. Collapsible/lazy/destroy-on-hidden/animation configuration remains outside the certified scope until independently justified. Product orchestration and persistence of layout sizes remain caller-owned.
- **Consequence:** Splitter can now serve general editor/admin/workbench layouts without product-specific wrappers. Its 100 score means runtime, public typing, same-source demos, API documentation, accessibility, focused behavior tests and exact-main publication are coherent for this scope—not parity with another library's entire historical surface.
'''
write(pd_path, pd.rstrip() + pd_entry + "\n")

# Migration guide: recommended, not forced, because the old path remains compatible.
migration_path = "docs/migration.md"
migration = read(migration_path)
if "## Splitter 6B2 compound migration" in migration:
    raise SystemExit("Splitter migration section already exists")
marker = "## Steps and Menu navigation alignment"
if marker not in migration:
    raise SystemExit("Steps/Menu migration marker missing")
splitter_migration = r'''## Splitter 6B2 compound migration

`Splitter` now has a canonical compound API for multiple resizable regions. Existing two-panel call sites remain valid during the 0.2.x compatibility window, so this is a recommended migration rather than a forced source rewrite.

Legacy-compatible form:

```tsx
<Splitter
  first={<Navigation />}
  second={<Workspace />}
  defaultSize={36}
  min={20}
  max={70}
  onResize={(firstSize) => saveFirstSize(firstSize)}
/>
```

Canonical form:

```tsx
<Splitter
  defaultSizes={[36, 64]}
  onSizesChange={(sizes) => saveLayout(sizes)}
>
  <Splitter.Panel min={20} max={70}>
    <Navigation />
  </Splitter.Panel>
  <Splitter.Panel>
    <Workspace />
  </Splitter.Panel>
</Splitter>
```

For three or more regions, add more `Splitter.Panel` children and manage the complete `sizes` / `defaultSizes` vector. A Panel with `resizable={false}` disables both adjacent handles. Resize handles are keyboard reachable and support Arrow keys plus Home/End; products should not add a second keyboard-resize implementation around the component.

Migration mapping:

```text
first / second       → Splitter.Panel children
defaultSize          → defaultSizes or Splitter.Panel.defaultSize
min / max            → Splitter.Panel.min / Splitter.Panel.max
onResize(number)     → onSizesChange(readonly number[])
```

The old names above are deprecated compatibility, not a second canonical model. `orientation="horizontal|vertical"` remains the single axis API; do not introduce a `layout` synonym in product wrappers. Persistence, collapse policy, editor state and product-specific panel identities remain caller-owned.

'''
write(migration_path, migration.replace(marker, splitter_migration + marker, 1))

# Changelog: record the non-breaking hardening at the top of Unreleased/Changed.
changelog_path = "CHANGELOG.md"
changelog = read(changelog_path)
entry = (
    "- Layout 6B2: hardened Core `Splitter` around canonical `Splitter.Panel` compound composition with multiple panels, "
    "controlled/uncontrolled size vectors, per-panel constraints, pointer/keyboard resizing, resize lifecycle and separator ARIA; "
    "the established two-panel `first/second/defaultSize/min/max/onResize(number)` path remains deprecated-compatible rather than removed.\n"
)
if entry.strip() in changelog:
    raise SystemExit("Splitter changelog entry already exists")
changed_marker = "## [Unreleased]\n\n### Changed\n\n"
if changed_marker not in changelog:
    raise SystemExit("Unreleased Changed marker missing")
write(changelog_path, changelog.replace(changed_marker, changed_marker + entry, 1))
