# Dedicated Editor Composition Contract

Dedicated Editor is a **composition pattern**, not a public `@gouno/ui` runtime component.

It standardizes the task transition from a collection/detail context into a deep editing context while leaving product-specific fields, permissions, state and persistence in the product binding.

## Why this is a Pattern instead of a component

A Dedicated Editor spans page structure, navigation semantics, feedback placement, responsive layout and task lifecycle. Those semantics repeat across products, but the actual editor bodies differ too much to justify a single large component API.

Do not add `DedicatedEditor` to `src/patterns` merely to remove JSX repetition.

The canonical evidence lives in:

- `showcase/demos/patterns/dedicated-editor.tsx`
- `showcase/components/patterns/dedicated-editor.tsx`
- Blog Admin Agent / Skill / Workflow bindings
- Blog Admin Post / Page workspace editors

The Showcase helper components are intentionally private. They encode the current canonical composition without creating package API.

## Subtypes

### Configuration Editor

Use for deep asset configuration such as Agent, Skill and Workflow.

Canonical order:

```text
Parent context / Tabs
        ↓
Dedicated Editor Lead
├─ Back action
├─ Editor identity / title
├─ Description
├─ Status?
└─ Secondary actions?
        ↓
Editor Feedback
        ↓
Editor Body
├─ Primary column
│  └─ Editor Sections
└─ Secondary column?
   └─ Editor Sections
        ↓
Editor Actions
├─ Cancel
└─ Save
```

Rules:

- The editor has exactly one identity/header region.
- Do not stack a TabPanel lead and a second product-local EditorHeader that repeat title/description.
- Create and edit for one object family use the same composition.
- Entering the editor resets the product viewport to the top.
- The editor provides an explicit return path to the exact parent context: list for create, detail/list as appropriate for edit.
- The primary body owns deep configuration; do not compress these forms into Drawer or Modal.
- The canonical two-column layout collapses naturally to one column on narrow viewports.
- Feedback that applies to the whole edit task appears between Lead and Body.
- Field validation remains with the field/form region that owns it.
- Destructive confirmation remains a Modal and is not part of the editor body.
- Save actions remain after the body and do not float over unrelated content unless a later evidence review admits a sticky action contract.

### Workspace Editor

Use for sustained creation workflows such as Post and Page editing where a canvas, navigation and inspector coexist.

The subtype may use a dedicated workspace shell such as `DocumentEditorShell`.

Canonical responsibilities remain:

- explicit return path;
- stable editor identity;
- one command/identity region;
- task-level feedback in a predictable location;
- canvas/navigation/inspector ownership;
- no accidental nested page headers;
- product viewport reset when entering a new editor task.

Workspace Editor does **not** have to share the Configuration Editor's Card-section layout.

## Relationship to list-triggered CRUD

Follow PI-07 in `docs/product-interface-governance.md`:

- Modal: lightweight mutation;
- Drawer: contextual CRUD;
- Dedicated Editor: deep configuration or sustained workspace.

Dedicated Editor is selected because of task depth, not because an object happens to have an edit button.

## Public API admission

Dedicated Editor remains Showcase-only until independent evidence proves a stable public runtime API.

A future public admission requires a separate Rule-of-Three review and must answer:

1. Which products need the same runtime behavior rather than only the same visual composition?
2. Why are Core + private composition helpers insufficient?
3. What is the smallest stable API that does not become a slot-heavy universal page component?
4. How does that API interact with routing, focus, scroll restoration and unsaved-change protection?
5. Which independent product corpus proves the contract?

Until then, the canonical Showcase and conformance tests are the source of truth.
