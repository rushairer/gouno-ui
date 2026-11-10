# Showcase development dependency security, 2026-11-10

This candidate repairs the full development dependency audit; it does not publish a new UI package or certify a Product.

The unchanged source lock previously reported three High and two Moderate affected package records: Vite, Vitest, @vitest/mocker, source-map-js and undici. All changed package records remain development-only. Root lock metadata also reconciles the pre-existing @types/qrcode range drift to unchanged package.json. Public package metadata and version 0.4.9, runtime dependency records, component sources, canonical fixtures and visual baselines are unchanged.

Resolved versions: Vite 8.3.7, Vitest/mocker 4.1.12, source-map-js 1.2.2 and undici 7.30.2, with their compatible development transitive closure. No forced major upgrade, audit suppression, test deletion, coverage reduction or visual threshold change is used.

Local Node 24.18.0: npm ci and full npm audit report zero vulnerabilities; npm run verify passes including typecheck, tests, package build and Showcase build. Exact candidate CI, normal Canonical Visual Golden, reciprocal Admin/Blog parity and final-main Pages must complete successfully before delivery is accepted. Review the PR checks for their exact SHA and URLs; a local audit alone is not delivery acceptance.

Admin and Blog manual-first ledgers and actual Staging/operator gates remain separate. These development security repairs do not promote either ledger or authorize a production deployment.
