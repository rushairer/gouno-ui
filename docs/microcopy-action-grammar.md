# Microcopy & Action Grammar Contract

Status: canonical product-family contract.

This contract complements visual, structural and state parity. A page is not considered Showcase-parity complete merely because its DOM, primitives, geometry and states match: user-visible action language and accessible action names must also remain coherent.

## Ownership

- Showcase is the canonical reference for reusable composition and established product vocabulary.
- Real Product remains authoritative for domain semantics and security/state-machine behavior.
- When Product and Showcase disagree, do not mechanically copy either direction. Compare task meaning, safety, clarity and information density, then move the weaker side toward the stronger wording.
- Fixture-only language such as scenario labels, simulated routes and FixtureDock notes is excluded from Product parity.

## Action grammar

1. **Visible labels stay short and task-oriented.** Dense action rows should prefer the shortest unambiguous label, for example `相对地址`, `Markdown`, `Alt Text`, `删除`.
2. **Accessible names carry full intent and object context.** Icon or compact actions should expose the verb and target, for example `复制相对地址 hero.png` or `删除媒体 hero.png`.
3. **Navigation uses an action plus a destination.** Prefer `返回首页`, `浏览文章`, `搜索内容`, `返回上一页` over noun-only destinations when the control is a CTA.
4. **Dangerous / privileged confirmation is action-specific.** Generic confirmation labels such as `继续` are not acceptable when the action deletes, suspends, revokes, rotates, resets or otherwise changes security-sensitive state. Use `确认删除`, `确认暂停`, `轮换客户端密钥`, `重新生成备用代码`, etc.
5. **Persistent load recovery and mutation retry are not silently conflated.** A product may choose `重新载入` for page/collection reload and `重试` for an operation retry; whichever vocabulary is chosen for a surface family must remain consistent within that family.
6. **Cross-product handoff wording is stable.** The same handoff action should use the same product/task name across pages.
7. **Terminology is canonical.** Within the Gouno product family use `账户设置` for account settings. Product-specific domain nouns may remain richer than Showcase when they carry real business meaning.
8. **Localized products must localize accessible names too.** Hard-coded English `label` / `aria-label` strings in otherwise localized Chinese product surfaces are parity defects unless the term is intentionally English product/domain vocabulary.

## Guard expectations

Consumer parity should cover two layers:

- rendered/structural parity: DOM, primitive ownership, computed style, geometry and state ownership;
- action parity: PageHeader/Tabs vocabulary, visible Buttons/ButtonLinks/MenuItems, Empty/Alert actions, Modal confirmation CTA, and accessible names for dense/icon actions.

Static guards should reject known ambiguous action patterns before browser tests run. Browser acceptance should then exercise representative action flows rather than only asserting that a page rendered.

## Canonical examples currently guarded

### Blog Public / Account

- `账户设置`
- 404 CTA: `返回首页`, `浏览文章`, `搜索内容`, `返回上一页`
- notification actions: `全部标为已读`, `查看`, `标为已读`

### Blog Admin

- Media dense actions: `相对地址`, `Markdown`, `Alt Text`, `删除`
- persistent collection load recovery: `重新载入`
- GOSSO handoff: `前往 GOSSO 管理`

### GOSSO Admin

- high-risk confirmations must name the action; `继续` is not canonical for destructive/privileged confirmation;
- profile/password accessibility controls must follow the active locale;
- account terminology uses `账户设置`.

The contract should grow only when a rule represents a reusable design-language decision, not to freeze every sentence of product prose.