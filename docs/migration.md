# Migration guide

The package keeps existing Gouno names as compatibility exports while organizing implementations by domain under `src/components`.

```ts
import { Button, Input, Modal, DataTable } from "@gouno/ui";
```

The `components/primitives` directory is an internal Radix/shadcn behavior layer. New consumers should choose an explicit public layer:

- `@gouno/ui/core` for pure controls and visual primitives.
- `@gouno/ui/patterns` for reusable compound interactions.
- `@gouno/ui/gouno` for Gouno product shells and templates.
- `@gouno/ui/legacy` only while migrating existing applications.
