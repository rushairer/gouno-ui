# Color Foundation Inventory

Status: FI-001 Phase 3 working inventory.
Updated: 2026-09-18

## Canonical authority

Gouno UI color authority is the semantic token set in `src/tokens.css`. Tailwind-facing names under `@theme inline` resolve to those variables; components and product fixtures consume semantic roles rather than owning palette values.

The current role families include:

- page/surface: `background`, `canvas`, `card`, `raised`, `popover`, `sidebar`, `editor`;
- content: `foreground`, `muted-foreground` and surface/overlay foreground roles;
- action/state: `primary`, `secondary`, `accent`, `destructive`, `success`, `warning`, `info` plus subtle/foreground companions;
- structure/focus: `border`, `input`, `ring`;
- transient layer: `overlay`, `overlay-foreground`;
- charts and syntax highlighting: dedicated Theme-owned tokens.

## Confirmed defects

The Phase 3 audit confirmed three Color defects:

1. `ThemeProvider` duplicated the light/dark `--background` literals as `#ffffff / #11151b` when updating browser `theme-color`.
2. Core Alert close hover encoded light/dark raw black/white alpha utilities instead of deriving the tint from semantic foreground.
3. Core Image cover used raw `text-white` on the semantic overlay without an overlay foreground role.

The implementation now reads browser theme color from computed `--background`, uses semantic foreground alpha for Alert hover, and defines/consumes `overlay-foreground`.

## Explicit non-Theme color APIs

These are not UI Theme bypasses:

- QRCode `color/background`: generated/scannable media, defaulting to black on white.
- Gosso MFA QR white wrapper: a fixed quiet-zone surface for scanning reliability.
- Tag custom `color`: caller-owned arbitrary tag background.
- Badge custom `color`: caller-owned indicator color.
- Timeline item `color`: caller-owned content/state color exposed by the component API.

These exceptions are narrow. They do not permit page-level raw palette utilities for application UI.

## Corpus policy

Canonical Blog, Blog Admin and Gosso Admin fixtures use semantic color utilities. The only admitted raw palette utility is the Gosso MFA QR `bg-white` quiet-zone wrapper. CI scans for additional raw palette/arbitrary color utilities and fails when new UI color bypasses appear.
