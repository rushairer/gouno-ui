# Product-Driven Component Evolution Contract

Status: binding development-process contract for public abstraction and product migration.

This document complements, rather than replaces, the other repository contracts:

- `docs/product-driven-development.md` decides **whether a shared abstraction should exist** and what evidence is required before it becomes public.
- `docs/architecture.md` decides **which layer owns an admitted abstraction** and which dependency directions are legal.
- `docs/api-specification.md` decides **how an admitted public API is named, typed, composed and behaved**.
- `docs/abstraction-register.md` records the durable evidence and decisions produced while real products validate the system.

No product task may use this document to bypass architecture or API governance. Existing product code and `src/legacy` are evidence, not authority.

## 1. Current phase

Gouno UI has enough Core breadth to begin real product validation. This does **not** mean Core is complete or every Core API is mature. Product usage is now the primary pressure test for Core API quality.

Do not expand Core merely to reach parity with Ant Design, shadcn/ui, another catalog or an imagined future application. Add or extend Core when a real product page demonstrates a product-agnostic capability gap.

The migration strategy is:

- **Primary migration line:** Gosso Admin, one page at a time.
- **Cross-product evidence corpus:** Gouno Blog Admin and Gouno Blog.
- **Execution model:** single-line implementation, multi-product validation. Do not migrate all products in parallel merely to discover abstractions.

During this phase, Core and Theme are the baseline foundation. The minimum pre-admitted Gouno product structure is `AppShell`, `PageContainer`, `NavigationGroup` and `navigationItemClass`.

Pre-validation Pattern/Gouno implementations have been quarantined under `src/legacy`. They are available for prior-art review only and may not be imported into canonical code or Showcase.

## 2. Real pages are the source of demand

Build the design system from real product behavior inward.

When migrating a page into Showcase:

1. Preserve the page's user intent, information hierarchy, important states, interactions, responsive behavior and accessibility semantics.
2. Treat legacy product component names, file boundaries and wrapper hierarchy as implementation history, not as the target design system.
3. Rebuild with Gouno UI Core, Theme, the minimum admitted Gouno structure, local JSX and local Tailwind composition first.
4. Do not copy a product-local or Legacy component into a canonical layer merely because it already exists.
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

Use the Rule of Three as a discovery trigger, not an automatic extraction rule:

- First occurrence: implement locally.
- Second occurrence: note the similarity, but prefer local duplication while the contract is uncertain.
- Third semantically equivalent occurrence: stop and perform an abstraction review.

Three occurrences do not prove a shared component is correct; they create enough evidence to require review.

Earlier extraction is allowed when a real page exposes an obviously generic missing primitive/capability, or duplicated behavior is sufficiently complex/safety-sensitive that local repetition is a larger risk. The change must still pass the admission checklist and record evidence.

## 5. Compare semantics, not legacy names

Before deciding that two product blocks are the same or different, ignore their existing component/file names. Compare at least:

- user task and intent;
- state model and controlled/uncontrolled ownership;
- interaction lifecycle and events;
- loading, empty, error, disabled and destructive states;
- keyboard, focus and ARIA behavior;
- responsive/layout constraints;
- content/data slots and action policy;
- persistence, URL or form serialization when relevant.

Two blocks may deserve one abstraction even when Gosso Admin and Blog Admin use different component trees. Conversely, visually identical blocks may need to remain separate when their semantics/behavior differ.

Do not let legacy product boundaries cause single-product overfitting.

## 6. Mandatory cross-product prior-art review

Before introducing any new public Pattern, new public Gouno component or material new Core capability, search the available evidence corpus:

- canonical Gouno UI;
- `src/legacy` for historical prior art;
- Gosso Admin;
- Gouno Blog Admin;
- Gouno Blog when relevant to the public site.

The purpose is not to migrate all matching pages at once. It is to test whether the proposed semantics already exist elsewhere under another name/structure and whether another product provides a conflicting case.

Never import Legacy to solve the page. Review it, then design from current evidence.

## 7. Public abstraction admission checklist

A new public component or material public API expansion must answer all of the following:

1. Which real product page or pages require this capability?
2. Why is direct composition from existing Core insufficient or materially worse?
3. Would extending an existing canonical component be clearer than creating a new component?
4. Which canonical, Legacy and cross-product prior art was checked?
5. Is the repeated contract semantic/behavioral, or only visual/markup similarity?
6. Why is the owner Core, Pattern, Gouno or product-local?
7. What is the smallest coherent public API satisfying the proven cases?
8. Does that API comply with `docs/api-specification.md` without aliases, naming exceptions or duplicate write paths?
9. Which Showcase scenarios and focused tests prove the contract?
10. Does the new abstraction make another canonical abstraction redundant, overlapping or incorrectly owned?

If these questions cannot be answered from evidence, keep the code local and continue migration.

## 8. Ownership guide after admission

### Core

Choose Core when the capability is product-agnostic, useful independently and free of Gouno page/business policy.

### Pattern

Choose Pattern for a reusable compound interaction coordinating multiple Core/Theme capabilities, state or lifecycle behavior, while remaining meaningful outside specific Gouno product policy.

The Pattern layer may remain empty until evidence justifies a public Pattern.

### Gouno

Choose Gouno for stable product-family application structure, page semantics or presentation policy intentionally shared by Gouno products.

Current admitted examples are `AppShell` and `PageContainer`. Their neutral names are intentional: shared structure should not carry `Admin` unless administration itself is the proven semantic contract.

### Product-local

Keep code in the product when it describes one business resource, route workflow, permission policy, API contract or one-off presentation rule. Product-local code is not a design-system failure.

### Theme

Theme owns only theme state, persistence contracts and theme controls. It is not a general-purpose application provider layer.

## 9. API evolution guardrails

Product-driven evolution may extend existing components, but real product demand does not authorize API drift.

- `docs/api-specification.md` remains binding for names, values, state models, events, refs, slots, accessibility and public types.
- A legacy Gosso/Blog prop name or Legacy component API is not a naming precedent.
- Do not create product-prefixed aliases for one shared semantic capability.
- A semantic configuration gets one canonical public write path.
- Prefer explicit composition/slots over generic configuration bags designed for imagined future products.
- Keep product-specific rules local until evidence shows the rule itself is shared.
- Compatibility changes require explicit migration assessment; product validation is not permission for silent breakage.

Core APIs are stable enough to use but subject to evidence-driven correction. Product validation should refine them, not freeze mistakes or fork synonyms.

## 10. Single migration line, multi-product validation

Default sequence:

```text
Gosso Admin real page
        ↓
Rebuild in Showcase with Core + Theme + minimum admitted Gouno structure
        ↓
A capability gap or repeated semantic block appears
        ↓
Search canonical Gouno UI + Legacy + Gosso Admin + Blog Admin + relevant Blog pages
        ↓
Compare semantics/state/interaction, ignoring legacy component names
        ↓
Keep local OR extend Core OR admit Pattern/Gouno abstraction
        ↓
Record evidence and decision
        ↓
Validate the decision on later migrated pages
```

Do not split attention by migrating Gosso Admin and Blog Admin page-for-page in parallel. Blog Admin and Blog act as comparison corpora while Gosso Admin is the implementation mainline. After representative Gosso Admin coverage, Blog Admin becomes the next active validation stage and should challenge earlier abstractions.

An abstraction may shrink, move layers, merge or disappear when later product evidence disproves it.

## 11. Legacy prior art

`src/legacy` preserves selected pre-validation Pattern/Gouno implementations so useful history is not confused with canonical API.

Rules:

- Legacy is not compiled, published or shown in Showcase.
- Canonical layers and Showcase never import Legacy.
- Do not add features or maintenance changes to Legacy in normal development.
- Review Legacy only after a real page creates an abstraction question.
- Re-admission creates a clean canonical implementation; it does not simply move a file back because it existed before.
- Candidate abstractions remain product-local plus register evidence until accepted. Do not create a candidate/incubator public directory.

This separation makes physical source organization reflect confidence: canonical directories mean admitted APIs; Legacy means historical evidence only.

## 12. Showcase product-space rule

Product workspaces are evidence of real migration, not catalogs of imagined pages.

- Gosso Admin contains only pages actually migrated under this process.
- Blog Admin and Blog remain empty until their pages are genuinely migrated.
- Old simulated product demos must not remain as if they were approved product pages.
- Empty workspaces show an explicit empty state.

The Gouno UI workspace is different: it documents canonical design-system APIs and is organized first by owner (`Core`, `Theme`, `Patterns`, `Gouno`), then by meaningful categories inside each owner. Core retains the familiar usage-oriented component categories; Pattern/Gouno are not forced into those categories.

## 13. Per-page completion rule

A product page migrated into Showcase is complete for this process when:

- its user-visible structure and important interaction states are represented with static fixtures;
- it uses Core/Theme/minimum Gouno structure before introducing new public abstractions;
- any new/expanded public abstraction passed cross-product prior-art review;
- its API, owner, Showcase documentation and focused tests are synchronized with repository contracts;
- associated evidence/decision is recorded in `docs/abstraction-register.md`;
- later pages remain free to challenge the abstraction rather than treating it as permanent precedent.

## 14. Agent/session handoff rule

A new AI session or agent working on product migration, extraction or public API evolution must read:

1. `AGENTS.md`;
2. `docs/architecture.md`;
3. `docs/api-specification.md`;
4. this document;
5. `docs/abstraction-register.md`;
6. `docs/api-conformance.md` when changing an existing public contract.

Do not reconstruct development philosophy from chat history. Repository documents are the durable source of truth.

Change this contract only as an explicit architecture/process decision. Do not weaken it incidentally to make one migration easier.
