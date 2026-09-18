# Editor Form Composition

Status: binding Showcase-only composition contract for create/edit forms across Modal, Drawer and Dedicated Editor surfaces.

This contract answers a narrower question than PI-07. PI-07 selects the **task surface**. Editor Form Composition standardizes the **inside of the form** after that surface is selected.

It is deliberately not exported from `src/patterns`. Repeated layout grammar is not, by itself, evidence for a public slot-heavy runtime component.

## Canonical anatomy

```text
Editor identity / overlay header
├─ optional Form-wide Feedback
├─ Form Body
│  ├─ Section
│  │  ├─ optional Section Lead
│  │  └─ Field Stack
│  └─ Section
└─ Action Boundary
```

The same semantic order applies to all three editor classes:

| Surface | Outer owner | Action boundary |
| --- | --- | --- |
| Modal | Modal header/body geometry | Modal action area |
| Drawer | Drawer header/body scrolling | Drawer footer |
| Dedicated Editor | page/editor shell | terminal editor actions |

The outer surface can differ. The internal field and section rhythm does not.

## Rhythm

- normal peer form regions: `gap-5` / 20px;
- normal field stack: `gap-5` / 20px;
- section content inset: normal 24px edge axis;
- compact repeated rows may use a denser local rhythm only when the repeated-row pattern owns that density;
- `Field` owns label/help/error spacing;
- `FormGrid` owns responsive columns but does not change the vertical rhythm around itself.

Avoid compensating `mt-*`, `mb-*` or nested padding whose only purpose is to make one editor resemble another.

## Feedback ownership

Form-wide feedback appears after the editor identity/header and before the editable body.

A message that applies only to one section stays inside that section. A failed inline operation stays with the operation. Do not hoist every Alert to the form top.

## Actions

One form has one terminal save/cancel boundary. The surface decides how that boundary is rendered, not whether it exists.

- Modal: action area.
- Drawer: footer.
- Dedicated Editor: terminal page-level action row.

Do not leave a second save button inside an arbitrary section unless that section is independently persisted and explicitly behaves as a separate form.

## Showcase-private helpers

`showcase/components/patterns/editor-form-composition.tsx` provides private helpers used to keep canonical fixtures honest:

- `EditorFormStack`
- `EditorFieldStack`
- `EditorFormSurfaceSection`
- `EditorFormActions`

They are test/composition infrastructure, not package API.

## Product evidence

Current evidence includes:

- Blog Admin AI Settings Agent / Skill Dedicated Editors;
- Blog Admin AI Settings Provider / Embedding / Connector Drawers;
- Blog Admin AI Operations Workflow Dedicated Editor;
- Blog Admin Categories Drawer;
- Gosso Admin OAuth2 Clients Modal.

When these products disagree on field rhythm or action placement, compare task semantics first, then converge the weaker composition. Do not mechanically copy one product's markup.

## Acceptance checklist

1. Is the editor surface selected by task complexity under PI-07?
2. Does form-wide feedback precede the editable body?
3. Do ordinary field stacks use one shared rhythm?
4. Do Sections rely on parent-owned gaps rather than bottom margins?
5. Does the surface own outer padding/scroll/footer behavior?
6. Is there exactly one terminal action boundary for the form?
7. Do create and edit variants preserve the same section order?
8. Are dense repeated-row exceptions local and explicit?
9. Does narrow layout collapse columns without changing semantic order?
10. Is the composition kept Showcase-only unless independent product evidence proves a reusable runtime interaction?
