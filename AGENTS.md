# @gouno/ui Architecture and Delivery Rules

## Read first

Before changing public components, product pages, ownership or API contracts, read in order:

1. this file;
2. `docs/architecture.md`;
3. `docs/design-language.md`;
4. `docs/product-interface-governance.md`;
5. `docs/product-surface-elevation-audit.md` when changing business surfaces, shadows or elevation;
6. `docs/api-specification.md`;
7. `docs/product-driven-development.md`;
8. `docs/abstraction-register.md`;
9. `docs/api-conformance.md` when an existing public contract changes.

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

## Product-driven evolution

Gouno UI is in third-product validation mode.

- **Completed comparison corpora:** Gosso Admin route-level Showcase coverage plus product-language convergence, and Blog Admin route-level coverage plus behavior/detail fidelity hardening.
- **Active migration line:** Gouno Blog public site, beginning with the real `PublicShell` + `/` Home surface, then discovery, reading and account page families.
- **Comparison corpus:** completed Gosso Admin and Blog Admin pages remain mandatory prior art when public Blog pages challenge existing abstractions.
- Start pages with Core + Theme + admitted Gouno structure + product-local JSX/Tailwind. Do not force public-site pages into `AppShell` when their semantics are a document/public-content shell.
- Initial shell baseline: `AppShell`, `PageContainer`, `NavigationGroup`, `navigationItemClass` for application-shell products only.
- `PageHeader` is additionally admitted from cross-product page evidence (PD-011); public Blog pages may validate it where route semantics match, but must not use it merely for visual consistency.
- Existing Legacy implementations are evidence, never automatic precedent.
- First semantic occurrence stays local; second similarity is noted; third semantically equivalent occurrence triggers review, not automatic extraction.
- Compare intent, state, lifecycle, accessibility, responsive behavior and content/action policy—not old names or DOM similarity.
- Before any Pattern/Gouno addition or material Core extension, search canonical Gouno UI, Legacy, Gosso Admin, Blog Admin and relevant Blog pages.
- If evidence is insufficient, keep code product-local.
- Record durable accept/reject/defer/merge/move/remove/API decisions in `docs/abstraction-register.md`.
- Follow the Product Validation Loop in `docs/product-driven-development.md`: real pages may stop further migration when they expose a canonical component defect, accessibility problem, material API gap or semantic API split. Harden the component, synchronize Showcase/docs/tests, validate it back on the triggering product page, then continue migration.
- **API-valid composition is necessary but not sufficient for page acceptance.** Before a migrated page is marked complete, run a composition-level conformance pass against every applicable binding rule in `docs/design-language.md` and `docs/product-interface-governance.md`, then compare the page with already-migrated members of the same surface family for spacing, action hierarchy, navigation depth, responsive behavior, feedback semantics and state presentation.
- If that pass exposes a missing shared visual/composition/IA constraint, stop the line before migrating another page: add or refine the binding rule, scan/fix the governed migrated corpus, and add or extend conformance coverage where practical. Do not hide the gap with page-local styling or change a Core default when the rule is context-specific.
- When a binding rule in `docs/design-language.md` or `docs/product-interface-governance.md` is added or materially changed, stop ordinary migration until the already-migrated governed corpus has been scanned. Fix stale occurrences, document intentional exceptions and add source/runtime regression coverage where practical.
- Ant Design and other mature systems are benchmarks during hardening, not automatic API authorities. Platform semantics, accessibility, Gouno API governance and real product evidence still decide the final contract.

## Showcase evidence rule

Showcase has two roles:

1. dogfood already-admitted canonical APIs;
2. own documentation/development tooling such as code preview, API tables, demo framing, viewport simulation and `FixtureDock`.

Showcase-only repetition does **not** count as sufficient public-abstraction evidence. Evidence order:

1. independent cross-product real pages;
2. repeated semantically equivalent pages in one real product;
3. Showcase/tests/tooling as supporting evidence only.

Example: Showcase `CodeBlock` stays private. If a real Blog article page later independently requires the same read-only code/highlight/copy behavior, run the normal admission review; if accepted, create Core `CodeBlock` and migrate Showcase to it.

`FixtureDock` is likewise Showcase-private. Route labels, static-fixture markers and scenario controls stay outside normal product layout and never count toward Pattern/Gouno admission evidence.

## Showcase information architecture

- Workspaces: `Gouno UI`, `Gosso Admin`, `Blog Admin`, `Blog`.
- Gouno UI is grouped by owner: `Core`, `Theme`, `Patterns`, `Gouno`.
- Core keeps usage categories; other owners use semantic categories appropriate to them.
- Only canonical APIs appear in Gouno UI.
- Product workspaces show only genuinely migrated pages; no simulated placeholders.
- Patterns may visibly remain empty.
- Normal product routes get one persistent page-local Tabs layer. If a second persistent Tab family is independently nameable/configurable/navigation-worthy, stop and apply PI-01 instead of nesting it. Editor view-state Tabs remain an explicit exception.

## API and quality

- `docs/api-specification.md` is binding; legacy product APIs are not naming precedents.
- `docs/design-language.md` is binding for visual composition, surface boundaries, edge alignment, elevation and spacing ownership.
- `docs/product-interface-governance.md` is binding for product navigation depth, tab-panel lead placement, surface-local title semantics and corpus-level interface conformance.
- `docs/product-surface-elevation-audit.md` is binding evidence for current business-page elevation classification and the raised-product whitelist.
- Do not introduce undocumented aliases or duplicate semantic write paths.