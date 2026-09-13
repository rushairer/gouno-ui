# Releasing @gouno/ui

`@gouno/ui` is distributed as an immutable public npm package. GitHub owns source, review, tags and releases; npm owns JavaScript package distribution.

## Release invariants

1. A published npm version is immutable. Never repack or overwrite the same version from a different source commit.
2. `package.json`, the root package entry in `package-lock.json`, the changelog release heading and the Git tag must describe the same version.
3. Release tags use `vX.Y.Z` (or an explicit SemVer prerelease such as `v0.4.0-next.0`). The tag must point at the exact reviewed release commit on `main`.
4. Consumers should depend on a registry version such as `"@gouno/ui": "0.3.1"`; canonical distribution must not rely on committed `.tgz` vendor copies.
5. `npm run release:check` must pass before a release tag is pushed.
6. The npm archive is built from `dist`; source, Showcase, docs, scripts and workflow files are intentionally excluded from the package.

## Normal release flow

From a clean, up-to-date `main`:

```bash
npm ci
npm version 0.3.1 --no-git-tag-version
```

Replace `0.3.1` with the intended SemVer. `npm version --no-git-tag-version` updates both `package.json` and the package version recorded in `package-lock.json` without creating a tag.

Move the appropriate entries from `CHANGELOG.md` `Unreleased` into a dated release heading:

```text
## [0.3.1] - YYYY-MM-DD
```

Then verify the exact package that will be released:

```bash
npm ci
npm run release:check
npm pack --dry-run
```

Commit the version/changelog change, push `main`, wait for the `Publish Showcase to GitHub Pages` workflow on that exact `main` commit to succeed, then tag that commit:

```bash
git tag -a v0.3.1 -m "@gouno/ui 0.3.1"
git push origin v0.3.1
```

The `Publish npm release` workflow validates that the tag, package version, lockfile version and changelog agree, rebuilds and checks the package, creates the exact `.tgz`, publishes it to the public npm registry with provenance, and creates a GitHub Release with the archive attached.

## npm authentication

Preferred long-term setup is npm Trusted Publishing for repository `rushairer/gouno-ui` and workflow `.github/workflows/release.yml`. The workflow has `id-token: write` specifically for npm provenance.

For bootstrapping the first public publication, or as a controlled fallback, the workflow also supports a repository Actions secret named `NPM_TOKEN`. Use a granular npm token scoped only to this package/organization and remove it after Trusted Publishing is configured if it is no longer required.

Do not commit npm tokens, `.npmrc` credentials or generated registry auth files.

## Prereleases

Use SemVer prereleases rather than mutable development archives:

```text
0.4.0-next.0
0.4.0-next.1
0.4.0-canary.<identifier>
```

Publish prereleases with an explicit npm dist-tag such as `next`; do not move `latest` until the stable release is ready. The current automated tag workflow is intended for stable `vX.Y.Z` releases. Prerelease publication should be performed deliberately until a dedicated prerelease workflow is added.

## Consumer upgrades

Gouno products should initially pin exact UI versions:

```json
{
  "dependencies": {
    "@gouno/ui": "0.3.1"
  }
}
```

Upgrade through a normal dependency PR, run the consumer's full CI/build/browser checks, and only then merge. Design-system changes can be visually material even when TypeScript APIs remain source-compatible.
