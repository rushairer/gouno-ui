# Showcase font delivery correction — 2026-11-06

Status: implementation and supplemental browser review complete; CI/golden and
reciprocal consumer acceptance required before merge. This record is not a
maintainer's GOSSO Admin/Blog certification or Staging approval.

## Observed failure and owner

Public Pages on main `b706b6c25c6252c7f55500b69eb08e17c1de554b` requested Inter
and JetBrains Mono under `https://rushairer.github.io/src/fonts/`, returned 404,
and reported both FontFace statuses as error. Source base.css refers to sibling
fonts that the npm build copies to dist/fonts. Showcase imports source CSS;
Tailwind rebases those URLs relative to showcase/styles before Vite resolves
them. Compilation and existing golden/geometry checks did not verify delivery.

The owner is Showcase asset resolution. Its Vite config now resolves both source
and rebased font URLs to the already-locked Fontsource dependency files. Vite
emits hashed assets with the repository's Pages base. No src component, CSS
contract, package version, dependency, frozen ID or acceptance anchor changes.
@gouno/ui remains 0.4.9; this does not require npm 0.4.10.

## Real browser evidence

Native Chromium opened both the development server and a preview of the
GITHUB_ACTIONS=true production build served under /gouno-ui/. Both font requests
returned 200 and both faces reported loaded. The Pages build uses:

- /gouno-ui/assets/inter-latin-wght-normal-Dx4kXJAl.woff2
- /gouno-ui/assets/jetbrains-mono-latin-400-normal-V6pRDFza.woff2

Supplemental captures re-rendered 36 Product/Showcase cases: Admin System Status
including scrolled capabilities/security, and Blog AI Settings/Operations tabs,
at desktop light and mobile dark widths. No font error or document overflow was
observed in those captures. Selected rendered surfaces were inspected for the
intended font, hierarchy, table/form wrapping and lower panels. This is partial
assistant review with deterministic Product API fixtures, not a maintainer's
complete manual-first review, live service mutation or operational acceptance.
Evidence is retained outside Git in the release workspace's
`docs/quality/final-evidence-2026-11/font-repair/` directory.

The canonical browser helper now explicitly loads both faces and asserts loaded
statuses. Waiting only for document.fonts.ready also resolves after font errors,
so it cannot establish successful font delivery.

## Preserved gates

Run the full verify/package checks, unchanged visual comparison and both
reciprocal consumer suites. No golden file, screenshot threshold, scenario,
certification status or required CI job was altered to conceal a difference.
If the existing goldens encode fallback-font rendering, retain their failing
comparison evidence and use the explicitly guarded review/refresh process;
never silently accept or regenerate them. Admin/Blog manual certification and
real Staging/backup/rollback acceptance still independently block releases.
