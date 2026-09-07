# Product Page Migration Fixtures

This directory contains only product pages genuinely migrated under the product-driven process.

Follow `docs/product-driven-development.md` rather than copying historical abstractions. New migrated pages should begin with Core + Theme + the minimum admitted Gouno structure supplied by the Showcase shell, keep uncertain composition product-local, and record durable abstraction decisions in `docs/abstraction-register.md`.

Current Gosso Admin migration line:

1. `gosso-overview.tsx` — Overview `/`; establishes the Core-first page reconstruction baseline without speculative Pattern/Gouno extraction.
2. `gosso-account-settings.tsx` — Account Settings `/account-settings/:tab`; covers Profile, Password, MFA, Passkeys and Sessions with static fixtures while deliberately keeping former Panel/DefinitionList/Feedback/ListStack/AsyncState/DataTable/confirm abstractions out of the canonical surface.

Blog Admin and Blog remain empty product workspaces until their own real pages are migrated.
