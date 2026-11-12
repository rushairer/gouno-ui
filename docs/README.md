# Gouno UI documentation map

The [Showcase](https://rushairer.github.io/gouno-ui/) is the rendered consumer of the current design system, not proof of certification by itself. Current components, exports and theme behavior are defined by **source and tests**; this index distinguishes binding contracts from historical review evidence.

## Canonical contracts (current)

- [Architecture ownership](architecture.md): Core/Theme/Patterns/Gouno, public package boundaries.
- [API specification](api-specification.md), [conformance](api-conformance.md), [design language](design-language.md), [product interface governance](product-interface-governance.md).
- [Canonical Showcase audit](canonical-showcase-audit.md) and [Showcase structure](showcase-structure.md). Manual rendered validation remains required.
- [Product-driven development](product-driven-development.md), [abstraction decision register](abstraction-register.md), [component retention policy](core-component-retention.md) and [Parity maintenance](parity-maintenance.md).
- [Release rules](releasing.md), [migration guidance](migration.md), [localization](component-localization.md), and design patterns under [patterns/](patterns/).

## Closed programs, dated studies and proposals (retain as evidence)

- [Foundation Integrity program](foundation-integrity-program.md) is **completed / maintenance mode**. Its machine-readable ledger is `foundation-integrity.json` at repository root; the resolved findings have moved into [closed defect history](history/foundation-integrity-closed-defects-2026-09.md), not an active “open defects” queue.
- `foundation-*-inventory.md` files record certification/inventory work; do not infer unfinished tasks from preserved imperative investigation text.
- Blog Admin AI design documents, source audits, `product-surface-elevation-audit.md` and `quality/*` are contextual decision evidence. A historical proposal is not approved as a changed canonical API without corresponding tests, rendered review and consumer certification.
- The three first-product corpora (GOSSO Admin, Blog Admin, Public Blog) are completed historical comparison evidence. There is **no automatic fourth-product migration line**; changes to certified components must respect reciprocal consumer and manual-first recertification gates.

## Documentation changes

Keep new canonical docs under `docs/`, versioned with the implementation that owns the decision. Do not create competing “final” API specifications or remove historical records just to shrink file count. When a decision is superseded, add a clear supersession pointer. For any change affecting source/Showcase or current consumer-certified paths, follow [AGENTS.md](../AGENTS.md) and obtain required review before merging.
