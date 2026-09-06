# Migration guide

The package keeps existing Gouno names as compatibility exports while organizing implementations by domain under `src/components`.

```ts
import { Button, Input, Modal, DataTable } from "@gouno/ui";
```

The `components/primitives` directory is an internal Radix/shadcn behavior layer. Consumers should prefer public component categories.
