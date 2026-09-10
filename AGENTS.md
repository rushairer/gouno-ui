# @gouno/ui Architecture and Delivery Rules

## Read first

Before changing public components, product pages, ownership or API contracts, read in order:

1. this file;
2. `docs/architecture.md`;
3. `docs/design-language.md`;
4. `docs/product-interface-governance.md`;
5. `docs/product-surface-elevation-audit.md` when changing business surfaces, shadows or elevation;
6. `docs/core-component-retention.md` before removing, de-admitting, renaming away or otherwise contracting an established Core runtime component;
7. `docs/api-specification.md`;
8. `docs/product-driven-development.md`;
9. `docs/abstraction-register.md`;
10. `docs/api-conformance.md` when an existing public contract changes.

Repository contracts are the durable source of truth. Do not reconstruct decisions from chat history or legacy component names.

## Formal public layers

```text
src/components/primitives + src/lib
                 ↓
              src/core
                 ↓
             src/theme
                 ↓
           src/patterns
                 ↓
             src/gouno
```

A layer may depend on itself or a lower layer, never a higher layer.

- `src/core`: pure product-agnostic components; no product/auth/API/route policy.
- `src/theme`: theme state, persistence and controls; may compose Core.
- `src/patterns`: only admitted reusable compound interactions; may be empty.
- `src/gouno`: admitted Gouno product-family structure/policy. Current runtime surface: `AppShell`, `PageContainer`, `PageHeader`, `NavigationGroup`, `navigationItemClass`.
- `src/components/primitives` and `src/lib`: internal foundations, not product domains.
- `showcase`: canonical integration consumer + static-fixture validation laboratory; never imports Legacy or the root umbrella at runtime.

## Legacy quarantine

`src/legacy` is prior-art source, not a fifth layer or compatibility API.

- excluded from builds/publication;
- no package export and no Showcase navigation;
- canonical layers and Showcase never import it;
- do not maintain/refactor/extend it during normal work;
- consult it only after a real product need creates an abstraction question;
- re-create admitted ideas cleanly in the canonical layer after evidence review;
- do not create `src/candidates`; candidates stay product-local plus decision evidence.

## Public ownership and source organization

- Every canonical public symbol, including types, has exactly one owner.
- Every PascalCase public runtime component exports `ComponentNameProps` from the same owner.
- Formal entries use explicit manifests; no layer-level `export *`.
- The package root is an external compatibility umbrella equal to Core + Theme + Patterns + Gouno + `cn`; new library/Showcase code imports canonical owners instead.
- One public component or tightly coupled family per focused file; no catch-all public implementation modules.
- Internal implementation imports concrete modules, not package root/formal barrels.
- Public providers exist only when canonical components consume them with documented precedence/tests.
- Use semantic tokens and `cn`; product-specific styling/business semantics do not enter Core.
- Core is a reusable component-library catalog, not merely the intersection of components used by the current product corpus. Lack of current product usage is never sufficient grounds to remove an established Core runtime component.
- Removing, de-admitting, renaming away or otherwise eliminating an established Core runtime component requires explicit maintainer/user confirmation **before implementation**. An audit result, low completion percentage, native-HTML alternative or absence of imports does not constitute that confirmation. See `docs/core-component-retention.md`.

## Product-driven evolution

Gouno UI currently has **three completed real-product comparison corpora and no selected fourth-product migration line**.

- **Completed first corpus:** Gosso Admin route-level Showcase coverage plus product-language convergence.
- **Completed second corpus:** Blog Admin route-level coverage plus behavior/detail fidelity hardening.
- **Completed third corpus:** Gouno Blog public-site PublicShell/Home, discovery, reading, document, account and final NotFound route-family validation.
- **Active migration line:** none selected. Do not invent a fourth product/workspace merely to keep migration moving.
- Completed corpora remain mandatory prior art. Reopen a completed fixture only when a real new product/page family or a later audit exposes a genuine cross-product defect, missing fidelity evidence or canonical API problem.
- New real product work still starts with Core + Theme + admitted Gouno structure + product-local JSX/Tailwind. Do not force public-site pages into `AppShell` when their semantics are a document/public-content shell.
- Initial shell baseline remains `AppShell`, `PageContainer`, `NavigationGroup`, `navigationItemClass` for application-shell products only.
- `PageHeader` is additionally admitted from cross-product page evidence (PD-011); public content pages may validate it where route semantics match, but must not use it merely for visual consistency.
- Existing Legacy implementations are evidence, never automatic precedent.
- First semantic occurrence stays local; second similarity is noted; third semantically equivalent occurrence triggers review, not automatic extraction.
- Compare intent, state, lifecycle, accessibility, responsive behavior and content/action policy—not old names or DOM similarity.
- Before any Pattern/Gouno addition or material Core extension, search canonical Gouno UI, Legacy and all completed real-product corpora.
- If evidence is insufficient for a **new** abstraction, keep code product-local. Do not apply this rule as a deletion test for an already-established Core component; retention follows `docs/core-component-retention.md`.
- Record durable accept/reject/defer/merge/move/remove/API decisions in `docs/abstraction-register.md`.
- Follow the Product Validation Loop in `docs/product-driven-development.md`: a real page or a completed-corpus audit may stop further work when it exposes a canonical component defect, accessibility problem, material API gap or semantic API split. Harden the component, synchronize Showcase/docs/tests, validate it back on the triggering product evidence, then continue.
- **API-valid composition is necessary but not sufficient for page acceptance.** Before a migrated page is marked complete, run a composition-level conformance pass against every applicable binding rule in `docs/design-language.md` and `docs/product-interface-governance.md`, then compare the page with already-migrated members of the same surface family for spacing, action hierarchy, navigation depth, responsive behavior, feedback semantics and state presentation.
- If that pass exposes a missing shared visual/composition/IA constraint, stop the line before migrating another page: add or refine the binding rule, scan/fix the governed migrated corpus, and add or extend conformance coverage where practical. Do not hide the gap with page-local styling or change a Core default when the rule is context-specific.
- When a binding rule in `docs/design-language.md` or `docs/product-interface-governance.md` is added or materially changed, stop ordinary product work until the completed governed corpora have been scanned. Fix stale occurrences, document intentional exceptions and add source/runtime regression coverage where practical.
- Ant Design and other mature systems are benchmarks during hardening and legitimate prior art for established generic Core catalog breadth. They do not automatically authorize new APIs or historical compatibility baggage; platform semantics, accessibility, Gouno API governance and real product evidence still decide the final contract.

## Showcase evidence rule

Showcase has two roles:

1. dogfood already-admitted canonical APIs;
2. own documentation/development tooling such as code preview, API tables, demo framing, viewport simulation and `FixtureDock`.

Showcase-only repetition does **not** count as sufficient public-abstraction evidence. Evidence order:

1. independent cross-product real pages;
2. repeated semantically equivalent pages in one real product;
3. Showcase/tests/tooling as supporting evidence only.

Example: `CodeBlock` remained Showcase-private under PD-009 until the real Blog article renderer independently required the same read-only code/highlight/copy behavior. PD-038 admits the code-frame/copy contract to Core; Showcase now keeps only its Prism presentation adapter private, and that adapter remains zero abstraction-admission evidence.

`FixtureDock` is likewise Showcase-private. Route labels, static-fixture markers and scenario controls stay outside normal product layout and never count toward Pattern/Gouno admission evidence.

## Showcase information architecture

- Workspaces: `Gouno UI`, `Gosso Admin`, `Blog Admin`, `Blog`.
- Gouno UI is grouped by owner: `Core`, `Theme`, `Patterns`, `Gouno`.
- Core keeps usage categories; other owners use semantic categories appropriate to them.
- Only canonical APIs appear in Gouno UI.
- Product workspaces show only genuinely migrated pages; no simulated placeholders.
- Gosso Admin, Blog Admin and Blog are currently completed comparison corpora. None is the active page-by-page implementation line.
- Patterns may visibly remain empty.
- Normal product routes get one persistent page-local Tabs layer. If a second persistent Tab family is independently nameable/configurable/navigation-worthy, stop and apply PI-01 instead of nesting it. Editor view-state Tabs remain an explicit exception.

## API and quality

- `docs/api-specification.md` is binding; legacy product APIs are not naming precedents.
- `docs/design-language.md` is binding for visual composition, surface boundaries, edge alignment, elevation and spacing ownership.
- `docs/product-interface-governance.md` is binding for product navigation depth, tab-panel lead placement, surface-local title semantics and corpus-level interface conformance.
- `docs/product-surface-elevation-audit.md` is binding evidence for current business-page elevation classification and the raised-product whitelist.
- `docs/core-component-retention.md` is binding for established Core runtime retention and its explicit approval gate.
- Do not introduce undocumented aliases or duplicate semantic write paths.
- API migrations require compatibility assessment and migration instructions.
- Synchronize exported types, Showcase API/docs/examples, accessibility behavior and focused tests.
- Prefer composition/explicit slots over speculative configuration bags.
- Preserve controlled/uncontrolled semantics where meaningful and native interoperability where useful.
- A Showcase Preview and displayed Code sample must represent the same implementation.
- Completion percentages are audit evidence, not architecture scores.
- A component is `100%` only for its proven Gouno scope after runtime API, exported types, representative demos, example code, accessibility behavior, focused tests and real product validation agree. It never means blindly copying another library's historical surface. A component below `100%` may still be an intentional retained Core component and must not be removed solely because it lacks current product validation.
- Compound components own structural spacing between their semantic slots; content regions own their own internal padding/rhythm. Do not fix canonical slot-spacing defects with page-local margins (PD-020).
- One semantic collection/section should normally expose one dominant surface boundary. Do not wrap a self-surfaced Table/List in Card merely to obtain padding/alignment. Normal bordered surfaces align first/last primary content to the shared 24px edge inset while preserving denser internal Table columns (PD-023 / `docs/design-language.md`).
- A landing/dashboard page may be structurally exceptional without using a different normal surface edge axis. In application-shell pages, `Card padding="lg"` or ad-hoc `p-5/p-8` must not be used as an accidental alignment substitute; any spacious exception must be semantic and documented.
- Dense desktop Table row actions follow DL-09: use one compact structural action family, keep the cluster single-line, and let Core Table horizontal overflow absorb width pressure. Semantic danger changes color rather than button structure; excessive low-frequency actions move behind an overflow interaction instead of wrapping.
- A design/interface hardening stage is incomplete until its corpus conformance pass has covered all completed comparison corpora relevant to the rule. Documentation-only adoption is not enough.
- Visible elevation must use semantic roles (`shadow-raised`, `shadow-overlay`, `shadow-modal`). Raw size shadow aliases are compatibility-only and intentionally flat. Business surfaces remain ground by default; a box, border, white/neutral background or CSS positioning does not justify elevation. `sticky` does not imply overlay, and `BulkActionBar` is a sticky contextual ground surface by default. New raised product surfaces must be added to the explicit audit whitelist with a product-level reason.

Current Tabs canonical high-level API follows PD-010: `activeKey`, `defaultActiveKey`, `items[].key`, `onChange`; pre-reset value-style names are temporary migration compatibility only. Tabs owns the TabBar↔TabPanel structural gap and keeps its active indicator inside the TabList scroll boundary.

## Delivery

At each coherent phase run/require:

```bash
npm run typecheck
npm test -- --run
npm run build
npm run showcase:build
```

Main CI uses Node.js 24 and must pass the same gate before Pages publication. External Actions remain pinned to immutable SHAs.

A pushed commit is not a completed phase. Do not claim CI/Showcase deployment success until the latest `main` workflow is `completed/success`. When Showcase output changed, also verify that the publish step succeeded and `gh-pages` contains a deploy commit for the expected `main` SHA. Pending, cancelled or failed runs are not completion.

Prefer one reviewable commit per coherent migration/hardening stage when practical. If CI reveals a defect, fix it in a focused follow-up commit and keep checking until the latest `main` run is green.

## Scope boundaries

This package contains no authentication, API access, connector behavior or application session state. Showcase fixtures are static and never call real services. Do not modify the old vendored UI package from this repository.
