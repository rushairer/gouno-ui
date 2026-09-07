# Product-Driven Component Evolution Contract

Status: binding development-process contract for public abstraction and product migration.

This document complements, rather than replaces, the other repository contracts:

- `docs/product-driven-development.md` decides **whether a shared abstraction should exist** and what evidence is required before it becomes public.
- `docs/architecture.md` decides **which layer owns an admitted abstraction** and which dependency directions are legal.
- `docs/api-specification.md` decides **how an admitted public API is named, typed, composed and behaved**.
- `docs/abstraction-register.md` records the durable evidence and decisions produced while real products validate the system.

No product task may use this document to bypass the architecture or API specification. Existing implementation is evidence, not authority.

## 1. Current phase

Gouno UI has enough Core breadth to begin real product validation. That does **not** mean Core is complete or that every existing Core API is mature. From this phase onward, product usage is the primary pressure test for Core API quality.

Do not expand Core merely to reach parity with Ant Design, shadcn/ui, another catalog, or an imagined future application. Add or extend Core when a real product page demonstrates a product-agnostic capability gap.

The current migration strategy is:

- **Primary migration line:** Gosso Admin, one page at a time.
- **Cross-product evidence corpus:** Gouno Blog Admin and Gouno Blog.
- **Execution model:** single-line implementation, multi-product validation. Do not migrate all products in parallel merely to discover abstractions.

During this validation phase, the existing Core and Theme layers are available as the baseline foundation. The minimum pre-accepted Gouno product-space scaffolding is `AdminShell`, `AdminPage`, `NavigationGroup` and `navigationItemClass`. Existing Pattern and Gouno APIs outside that minimum shell are not automatic precedent: a migrated page may use, modify, merge or remove them only after the same evidence review required for a new abstraction.

## 2. Real pages are the source of demand

Build the design system from real product behavior inward.

When migrating a page into Showcase:

1. Preserve the page's user intent, information hierarchy, important states, interactions, responsive behavior and accessibility semantics.
2. Treat the legacy product's component names, file boundaries and wrapper hierarchy as implementation history, not as the target design system.
3. Rebuild with Gouno UI Core, Theme, the minimum product shell, local JSX and local Tailwind composition first.
4. Do not copy a product-local component into Gouno UI simply because it already exists in Gosso Admin or Blog Admin.
5. Accept small amounts of repeated JSX while the design is still being discovered.

The goal is not to minimize line count. The goal is to discover stable semantic, behavioral and design contracts.

## 3. Core-first decision order

When a migrated page exposes a need, evaluate it in this order:

1. **Can existing Core components compose the result clearly?** If yes, keep the composition local.
2. **Is an existing Core component missing one genuinely product-agnostic capability?** Prefer a coherent extension of that Core API over creating a synonym wrapper.
3. **Is there a repeated compound interaction with shared state/behavior but no Gouno product policy?** It may be a Pattern candidate.
4. **Is there a repeated Gouno product-family shell, page semantic or product presentation policy?** It may be a Gouno candidate.
5. **Is the behavior specific to one route, resource, business rule or product?** Keep it product-local.

Do not create a public component merely to replace a short `div` plus utility classes. Repetition of markup is not by itself evidence of a reusable abstraction.

## 4. Default Rule of Three

Use the Rule of Three as a discovery trigger, not as an automatic extraction rule:

- First occurrence: implement locally.
- Second occurrence: note the similarity, but prefer local duplication while the contract is still uncertain.
- Third semantically equivalent occurrence: stop and perform an abstraction review.

Three occurrences do not prove that a shared component is correct; they only create enough evidence to require review.

Earlier extraction is allowed when a real page exposes an obviously generic missing primitive/capability, or when duplicated behavior is sufficiently complex or safety-sensitive that local repetition is a larger risk. The change must still pass the admission checklist below and record its evidence.

## 5. Compare semantics, not legacy component names

Before deciding that two product blocks are the same or different, ignore their current component and file names. Compare at least:

- user task and intent;
- state model and controlled/uncontrolled ownership;
- interaction lifecycle and events;
- loading, empty, error, disabled and destructive states;
- keyboard, focus and ARIA behavior;
- responsive/layout constraints;
- content/data slots and action policy;
- persistence, URL or form-serialization behavior when relevant.

Two blocks may deserve one abstraction even when Gosso Admin and Blog Admin currently use different component trees. Conversely, two blocks may need to stay separate even when their DOM and Tailwind classes look nearly identical.

Do not let legacy product boundaries cause single-product overfitting.

## 6. Mandatory cross-product prior-art review

Before introducing any new public Pattern, new public Gouno component, or material new Core capability, search the available product corpus:

- Gouno UI itself;
- Gosso Admin;
- Gouno Blog Admin;
- Gouno Blog when the interaction is relevant to the public site.

The purpose is not to migrate all matching pages at once. The purpose is to test whether the proposed semantics already exist elsewhere under another name or structure.

If another product contains a materially similar case, compare both cases before fixing the shared API. If another product contains a conflicting case, either keep the behavior local or design a contract that is proven by both cases. Do not add product-specific aliases to make one shared component imitate two legacy APIs.

## 7. Public abstraction admission checklist

A new public component or material public API expansion must be able to answer all of the following:

1. Which real product page or pages require this capability?
2. Why is direct composition from existing Core insufficient or materially worse?
3. Would extending an existing canonical component be clearer than creating a new component?
4. Which repository-wide and cross-product prior art was checked?
5. Is the repeated contract semantic/behavioral, or only visual/markup similarity?
6. Why is the owner Core, Pattern, Gouno or product-local?
7. What is the smallest coherent public API that satisfies the proven cases?
8. Does that API comply with `docs/api-specification.md` without aliases, naming exceptions or duplicate write paths?
9. Which Showcase scenarios and focused tests prove the contract?
10. Does the new abstraction make an existing public abstraction redundant, overlapping or incorrectly owned?

If these questions cannot be answered from evidence, keep the code local and continue migration.

## 8. Ownership guide after admission

Use architecture ownership only after the abstraction has passed the existence test:

### Core

Choose Core when the capability is product-agnostic, useful independently, and free of Gouno page/business policy. Core may own controls, layout primitives, data entry, display, navigation, feedback and overlay behavior.

### Pattern

Choose Pattern for a reusable compound interaction that coordinates multiple Core/Theme capabilities, state or lifecycle behavior and remains meaningful outside a specific Gouno product policy.

### Gouno

Choose Gouno for product-family shells, stable admin/page semantics and presentation policies intentionally shared by Gouno products.

### Product-local

Keep code in the product when it describes one business resource, route workflow, permission policy, API contract or one-off presentation rule. Product-local code is not a design-system failure.

### Theme

Theme owns only theme state, persistence contracts and theme controls. It is not a general-purpose application provider layer.

## 9. API evolution guardrails

Product-driven evolution may extend existing components, but real product demand does not authorize API drift.

- `docs/api-specification.md` remains binding for names, values, state models, events, refs, slots, accessibility and public types.
- A legacy Gosso or Blog prop name is not a naming precedent.
- Do not create product-prefixed aliases for one shared semantic capability.
- A semantic configuration gets one canonical public write path.
- Prefer explicit composition/slots over generic configuration bags designed to accommodate imagined future products.
- Keep a product-specific rule local until evidence shows that the rule itself is shared.
- Compatibility changes require the existing migration and conformance process; product validation is not permission for silent breakage.

Core APIs are therefore **stable enough to use, but still subject to evidence-driven correction**. Product validation should refine them, not freeze mistakes and not fork synonyms.

## 10. Single migration line, multi-product validation

The default sequence is:

```text
Gosso Admin real page
        ↓
Rebuild in Showcase with Core + minimum shell
        ↓
A capability gap or repeated semantic block appears
        ↓
Search Gouno UI + Gosso Admin + Blog Admin + relevant Blog pages
        ↓
Compare semantics/state/interaction, ignoring legacy component names
        ↓
Keep local OR extend Core OR admit Pattern/Gouno abstraction
        ↓
Record the evidence and decision
        ↓
Validate the decision on later migrated pages
```

Do not split attention by migrating Gosso Admin and Blog Admin page-for-page in parallel. Blog Admin and Blog act as comparison corpora while Gosso Admin is the implementation mainline. After Gosso Admin provides representative coverage, Blog Admin becomes the next active validation stage and is expected to challenge earlier abstractions.

An abstraction is allowed to shrink, move layers, merge with another abstraction or disappear when later product evidence disproves it.

## 11. Existing Pattern/Gouno code is provisional evidence

Source code that predates this process can be useful prior art, but its mere existence does not prove that the abstraction is necessary.

For existing Pattern/Gouno APIs outside the minimum product shell:

- do not use them merely because they are already exported;
- compare them against the current page need and available Core composition;
- revalidate their semantics against cross-product evidence;
- remove, merge, simplify or relocate them when the evidence supports doing so, with compatibility assessment where required.

This rule prevents the product-driven phase from becoming a mechanical migration onto abstractions that were originally designed speculatively.

## 12. Per-page completion rule

A product page migrated into Showcase is complete for this process when:

- the user-visible structure and important interaction states are represented with static fixtures;
- the page uses Core and the minimum product shell before introducing new public abstractions;
- any new/expanded public abstraction passed the cross-product prior-art review;
- its API, owning layer, Showcase documentation and focused tests are synchronized with the repository contracts;
- the associated evidence/decision is recorded in `docs/abstraction-register.md`;
- later pages remain free to challenge the abstraction rather than treating it as permanent precedent.

## 13. Agent/session handoff rule

A new AI session or agent working on product migration, component extraction or public API evolution must read, in order:

1. `AGENTS.md`;
2. `docs/architecture.md`;
3. `docs/api-specification.md`;
4. this document;
5. `docs/abstraction-register.md`;
6. `docs/api-conformance.md` when changing an existing public contract.

Do not reconstruct the development philosophy from chat history. The repository documents are the durable source of truth.

Change this contract only as an explicit process/architecture decision. Do not weaken it incidentally to make a single product migration easier.
