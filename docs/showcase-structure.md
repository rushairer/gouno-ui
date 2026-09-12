# Showcase Ownership Structure

Showcase is a consumer and validation laboratory for the canonical Core → Theme → Patterns → Gouno stack. Its filesystem should make ownership visible instead of encoding ownership repeatedly in flat filename prefixes.

## Directory contract

```text
showcase/
├── app/                    # Showcase application/router infrastructure
├── catalog/                # catalog and progress metadata
├── components/             # Showcase-private tooling components
├── demos/
│   ├── core/               # Core demonstrations
│   ├── theme/              # Theme demonstrations
│   ├── patterns/           # admitted Pattern demonstrations
│   ├── gouno/              # Gouno structure demonstrations
│   ├── shared/             # Showcase-private demo utilities
│   └── products/
│       ├── blog/           # Gouno Blog comparison corpus
│       ├── blog-admin/     # Blog Admin comparison corpus
│       └── gosso-admin/    # Gosso Admin comparison corpus
└── styles/                 # Showcase-only styles
```

Product identity is a directory boundary. Files inside `products/blog`, `products/blog-admin`, and `products/gosso-admin` describe the surface they implement and do not repeat the product name as a filename prefix.

AI subfamilies that belong to Blog Admin remain under `products/blog-admin/ai/`; they are not independent product roots.

## Stable semantic identity

Filesystem paths and Showcase semantic IDs are separate contracts.

Moving a fixture into an ownership directory may change its import path, but it must not silently change workspace names, page IDs, route IDs, fixture scenario IDs, or other product-facing identifiers. For example, page IDs such as `blog-admin-ai-operations` and `blog-admin-ai-settings` remain stable even though their source files live below `products/blog-admin/ai/`.

## Retired flat layout

Do not recreate the former flat ownership layout, including:

- `showcase/catalog.tsx`, `showcase/component-progress.ts`, or `showcase/core-family-coverage.ts`;
- `showcase/showcase.css`;
- top-level demo-family files such as `core-components.tsx`, `theme-system.tsx`, `gouno-components.tsx`, and `pattern-bulk-action-bar.tsx`;
- the generic `showcase/demos/examples/` bucket;
- flat `blog-*`, `blog-admin-*`, or `gosso-*` TypeScript files directly under `showcase/demos/products/`;
- `blog-admin-ai-operations/` or `blog-admin-ai-settings/` as product-root directories.

`tests/showcase-directory-structure.test.ts` seals these ownership rules. When a new product comparison corpus is added, give it a dedicated product directory and extend the invariant deliberately rather than returning to prefix-based flat storage.
