# Focus Foundation Inventory

Status: FI-001 Phase 4 working inventory.
Updated: 2026-09-18

## Canonical geometry

Gouno UI uses one focus geometry contract:

- focus indicator width: 2px;
- focus separation/offset: 2px when an external offset is needed;
- focus color: semantic `ring`;
- keyboard-visible focus: `:focus-visible`.

There are two legal rendering mechanisms because component anatomy differs:

1. **Global fallback outline** — native/focusable elements that do not own a component focus treatment receive the Base `:focus-visible` outline.
2. **Component-owned semantic ring** — controls/composites that suppress native/global outline may render a 2px semantic ring. Composite wrappers may use `focus-within` or peer focus when the focusable node is visually represented by another node.

The mechanisms may not stack on the same visual control.

## Confirmed defects

The pre-audit corpus had three competing focus geometries/trigger policies:

- Base fallback: 2px outline with 3px offset.
- Core controls: predominantly 2px focus ring.
- Primitive controls: a second 3px focus ring convention.

Additional defects:

- primitive Tabs rendered both a 3px ring and a 1px outline;
- primitive Badge could render its component ring without suppressing the global outline;
- Dialog/Sheet close controls used `focus:` instead of `focus-visible:`, so mouse focus could receive the keyboard focus treatment.

## Policy

Direct focusable component owners must follow one of these paths:

- consume the global fallback without adding a second focus ring; or
- suppress the global outline and render the canonical 2px semantic ring.

Allowed structural variants:

- `focus-within:ring-2` for composite controls whose wrapper owns the visual boundary;
- `peer-focus-visible:ring-2` when a hidden/native peer owns focus and its visible sibling owns the indicator;
- semantic error/warning ring-color overrides that preserve geometry.

Not admitted:

- `focus-visible:ring-[3px]`;
- focus-specific 1px outline layered on top of a ring;
- direct `focus:ring-*` for keyboard focus indication where `focus-visible` is appropriate;
- explicit focus ring plus unsuppressed global outline on the same visual control.

## Acceptance

Focus can be certified only when:

1. Base fallback geometry is 2px/2px and uses semantic `ring`.
2. Primitive and Core direct focus rings use 2px geometry.
3. 3px focus rings and Tabs double indicators are eliminated.
4. Dialog/Sheet close controls use `focus-visible`.
5. corpus guards reject reintroduction of split geometry.
6. browser evidence verifies both global-fallback and component-owned focus paths.
7. reciprocal Blog/Gosso consumer parity passes.
