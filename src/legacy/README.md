# Legacy Quarantine

`src/legacy` is a non-canonical source museum for abstractions that existed before the current product-driven validation phase but have **not** been re-admitted as public Gouno UI contracts.

Rules:

- Legacy is not a fifth architectural layer.
- Legacy is excluded from TypeScript build output and package publication.
- `src/core`, `src/theme`, `src/patterns`, `src/gouno` and `showcase` must never import Legacy.
- Legacy has no package export path and no Showcase navigation.
- Do not fix, extend, refactor or add features to Legacy in normal product work.
- Historical relative imports inside quarantined snapshots may refer to their former source location; these files are intentionally non-executable.
- Use Legacy only for prior-art review when a real product page exposes a possible shared abstraction.
- A Legacy idea returns to a canonical layer only after passing `docs/product-driven-development.md`, receiving a canonical owner, conforming to `docs/api-specification.md`, gaining Showcase evidence/tests, and being recorded in `docs/abstraction-register.md`.

Candidates are **not** created under `src/legacy` or a separate incubator directory. Until admitted, candidate abstractions stay as product-local code plus evidence in `docs/abstraction-register.md`.
