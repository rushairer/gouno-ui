# Core Component Retention Policy

Status: binding public-API governance for established Core components.

## Purpose

Gouno UI is a reusable UI component library, not merely the intersection of components currently exercised by Gosso Admin, Blog Admin, and Blog. Real-product usage remains an important hardening signal, but temporary lack of usage is not evidence that an established Core component has no library value.

Core breadth may legitimately include product-agnostic components whose usefulness has already been demonstrated by mature design systems such as Ant Design, provided the component has a clear provenance and a coherent Gouno implementation.

## Retention rule

Once a Core runtime component has entered the canonical public API with a clear and legitimate component-library provenance, retain it by default.

The following are **not sufficient grounds** for de-admission, removal, or renaming:

- no current Gosso Admin consumer;
- no current Blog Admin consumer;
- no current Blog public consumer;
- no current Showcase product fixture consuming the component;
- an equivalent task currently being implemented with native HTML or local composition;
- the component being less frequently used than another Core family.

Lack of current usage may lower review priority or leave a component below `100%` hardening completion, but it does not by itself justify API contraction.

## Existing components versus new components

These are intentionally different decisions.

### New Core admission

Continue to be conservative. A new component must have a clear product-agnostic purpose, a credible source/benchmark, a coherent API, and must not duplicate an existing canonical capability.

### Established Core retention

Be conservative about removal. Mature-library precedent is valid evidence that an already-established generic component can belong in the catalog even before a current Gouno product uses it.

When an established component is weak, prefer one of these actions before removal:

1. leave it implemented but mark/document it as needing review;
2. harden its API, semantics, accessibility, or implementation;
3. merge it into an existing family while preserving the public capability when that can be done compatibly;
4. deprecate a problematic API path while retaining the component until an explicitly approved migration is complete.

## Removal approval gate

Removing, de-admitting, renaming away, or otherwise eliminating an established Core runtime component is a breaking public-API decision and **requires explicit maintainer/user confirmation before code changes are made**.

An automated agent must not infer this approval from:

- a completed-product audit;
- lack of imports;
- a low Showcase completion percentage;
- a native-HTML alternative;
- an abstraction review that only concludes the current implementation is imperfect.

A proposed removal should instead be reported with the concrete defect, overlap, maintenance cost, compatibility impact, and alternatives. Implementation begins only after explicit confirmation.

## Valid removal candidates after confirmation

Removal may still be appropriate when there is a concrete reason such as:

- the component is a duplicate or synonym of another canonical API;
- the abstraction is semantically incorrect or product-specific rather than generic;
- the public contract is fundamentally misleading or unsafe;
- maintaining two overlapping components creates material long-term API ambiguity;
- the capability has a clearly approved replacement and migration path.

Even in these cases, the approval gate above still applies for an established Core component.

## Restored components and superseded rationale

The 2026-09-10 de-admissions of `Image`, `List`, and `Descriptions` were based primarily on the absence of current real-product consumers. That rationale is superseded by this policy, and those components are restored to the canonical Core API and Showcase catalog.

The unmerged `Timeline` de-admission work is likewise superseded and must not be merged on the basis of current-product non-usage.

Relevant superseded commits:

- `c0172b1bbd3e0c75f7db3076be0aa742a924cbea` — Image de-admission;
- `479aec9b0172a45f2482d480f2f24afa3841cc26` — List de-admission;
- `160e7a74a206b7eeffe746077ccd656ab7326fb6` — Descriptions de-admission.

## Relationship to product-driven development

Product-driven validation still governs **hardening, API correction, Pattern/Gouno extraction, and new speculative capability**. It no longer means that established generic Core catalog breadth must shrink to match only the current product corpus.

Real products answer: “How should this component behave in Gouno?”

They do not alone answer: “May this established generic component continue to exist at all?”
