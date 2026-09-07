# Product Page Migration Fixtures

This directory contains only product pages actually migrated under `docs/product-driven-development.md`.

Rules:

- Do not keep simulated/placeholder business pages here as if they were migration results.
- Begin each real page with Core + Theme + the minimum admitted Gouno structure supplied by Showcase.
- Keep uncertain composition page-local until evidence justifies a public abstraction.
- Preserve real product route intent in static fixtures, but do not invent Showcase destinations for pages that have not been migrated yet.
- Record durable abstraction/API decisions in `docs/abstraction-register.md`.

Current migrated fixture:

- `gosso-overview.tsx` — Gosso Admin `/` Overview, including administrator and regular-user states.

Blog Admin and Blog intentionally have no product fixture files until their real migration stages begin.
