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
4. **Dangerous / privileged confirmation is action-specific.** Generic confirmation labels such as `继续` are not acceptable when the action deletes, suspends, revokes, rotates, resets or otherwise changes security-sensitive state. Use `确认删除`, `确认暂停`, `确认轮换`, `重新生成`, etc.
5. **Persistent load recovery and mutation retry are distinct.** For canonical page/document/collection load failures use `重新载入`; use `重试` for retrying a failed mutation or transient operation. Do not mix the two meanings on the same surface family.
6. **Cross-product handoff wording is stable.** For a control that opens the GOSSO administration product, use `打开 GOSSO Admin`; supporting prose may still describe it as the identity management center.
7. **Terminology is canonical.** Within the Gouno product family use `账户设置` for account settings. Product-specific domain nouns may remain richer than Showcase when they carry real business meaning.
8. **Localized products must localize accessible names too.** Hard-coded English `label` / `aria-label` strings in otherwise localized Chinese product surfaces are parity defects unless the term is intentionally English product/domain vocabulary.
9. **Business-domain wording may flow Product → Showcase.** When the real product has a more precise domain label (for example `成员显示昵称 / 备注名` instead of a generic `显示名称`), keep the richer Product language and update the Showcase fixture rather than flattening Product semantics.
10. **AI action icons follow action semantics.** Controls whose primary action invokes AI assistance/generation or hands selected resources to an AI Workflow use `Sparkles`; `Bot` is reserved for Agent/AI entity identity or status. Sibling Collection pages must not use different icons for the same `交给 AI` action.

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
- GOSSO handoff: `打开 GOSSO Admin`
- selected-resource AI Workflow handoff: `交给 AI` uses the `Sparkles` action icon across Posts, Pages, Categories, Tags, Comments and Media
- member identity copy stays adjacent to the account ID; the dense operation column is reserved for member/permission mutations
- member editor uses the product-accurate `成员显示昵称 / 备注名`, `Blog 角色分配（单选）`, and `保存设置` vocabulary

### GOSSO Admin

- high-risk confirmations must name the action; `继续` is not canonical for destructive/privileged confirmation;
- profile/password accessibility controls must follow the active locale;
- persistent load recovery uses `重新载入`, while transient operation retry uses `重试`;
- account terminology uses `账户设置`.

The contract should grow only when a rule represents a reusable design-language decision, not to freeze every sentence of product prose.