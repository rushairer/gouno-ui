# @gouno/ui Architecture and Delivery Rules

## Read first

Before changing public components, product pages, ownership or API contracts, read in order:

1. this file;
2. `docs/architecture.md`;
3. `docs/api-specification.md`;
4. `docs/product-driven-development.md`;
5. `docs/abstraction-register.md`;
6. `docs/api-conformance.md` when an existing public contract changes.

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

Gouno UI is in second-product validation mode.

- **Completed comparison corpus:** Gosso Admin route-level Showcase coverage, including its product-language convergence pass.
- **Active migration line:** Blog Admin, one real page/page-family at a time, beginning with `/admin/posts`.
- **Additional cross-product corpus:** relevant Gouno Blog public-site pages when their semantics overlap.
- Start pages with Core + Theme + admitted Gouno structure + product-local JSX/Tailwind.
- Initial shell baseline: `AppShell`, `PageContainer`, `NavigationGroup`, `navigationItemClass`.
- `PageHeader` is additionally admitted from cross-product page evidence (PD-011) and must continue to be challenged by Blog Admin rather than treated as untouchable precedent.
- Existing Legacy implementations are evidence, never automatic precedent.
- First semantic occurrence stays local; second similarity is noted; third semantically equivalent occurrence triggers review, not automatic extraction.
- Compare intent, state, lifecycle, accessibility, responsive behavior and content/action policy—not old names or DOM similarity.
- Before any Pattern/Gouno addition or material Core extension, search canonical Gouno UI, Legacy, Gosso Admin, Blog Admin and relevant Blog pages.
- If evidence is insufficient, keep code product-local.
- Record durable accept/reject/defer/merge/move/remove/API decisions in `docs/abstraction-register.md`.
- Follow the Product Validation Loop in `docs/product-driven-development.md`: real pages may stop further migration when they expose a canonical component defect, accessibility problem, material API gap or semantic API split. Harden the component, synchronize Showcase/docs/tests, validate it back on the triggering product page, then continue migration.
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

## API and quality

- `docs/api-specification.md` is binding; legacy product APIs are not naming precedents.
- Do not introduce undocumented aliases or duplicate semantic write paths.
- API migrations require compatibility assessment and migration instructions.
- Synchronize exported types, Showcase API/docs/examples, accessibility behavior and focused tests.
- Prefer composition/explicit slots over speculative configuration bags.
- Preserve controlled/uncontrolled semantics where meaningful and native interoperability where useful.
- A Showcase Preview and displayed Code sample must represent the same implementation.
- Completion percentages are audit evidence, not architecture scores.
- A component is `100%` only for its proven Gouno scope after runtime API, exported types, representative demos, example code, accessibility behavior, focused tests and real product validation agree. It never means blindly copying another library's historical surface.
- Compound components own structural spacing between their semantic slots; content regions own their own internal padding/rhythm. Do not fix canonical slot-spacing defects with page-local margins (PD-020).

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
