# Canonical golden proposals through review branches

Normal Canonical Visual Golden Smoke remains a comparison-only gate. No
threshold, scenario or required check is changed by this proposal workflow.
The existing explicitly guarded main refresh is unchanged.

When a real reviewed source correction invalidates accepted images, use
`Propose Canonical Visual Goldens` to prepare evidence without changing main:

1. Preserve the ordinary failing comparison and explain the source correction.
2. Dispatch the proposal workflow with the existing non-default review branch
   and its exact SHA. The workflow rejects main/master and moved branch heads.
3. Independently download and hash the artifact. Its images are **proposed**,
   not approved. Inspect original expected/actual/diff images and the actual
   rendered surfaces, including affected typography, wrapping and interactions.
4. Only after that review, import the accepted PNG files in the source-correction
   PR and record the source SHA, artifact/hash, reviewer type and findings. Never
   claim assistant inspection is a required maintainer's personal approval.
5. Require the unchanged ordinary comparison, full CI and reciprocal consumer
   suites on the resulting PR head. Review/merge through repository governance.

The generator has read-only repository permissions and no persisted checkout
credentials. It uploads evidence only; it cannot push, merge, publish or certify.
A successful generator is not a passing comparison or certification. No
snapshot may be replaced to hide an unexplained layout, interaction or API
regression. Consumer manual-first and operational release gates still apply.
