# Migration guide

The package keeps existing Gouno names as compatibility exports while organizing implementations by layer under `src/core`, `src/patterns`, and `src/gouno`.

```ts
import { Button, Input, Modal, DataTable } from "@gouno/ui";
```

The `components/primitives` directory is an internal Radix/shadcn behavior layer. New consumers should choose an explicit public layer:

- `@gouno/ui/core` for pure controls and visual primitives.
- `@gouno/ui/patterns` for reusable compound interactions.
- `@gouno/ui/gouno` for Gouno product shells and templates.
- `@gouno/ui/legacy` remains a package-level alias for older consumers; new code should use the explicit layers above.
