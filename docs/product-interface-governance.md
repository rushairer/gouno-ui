# Gouno Product Interface Governance

Status: binding companion to `docs/design-language.md` for product navigation depth, tabbed-page composition and corpus-level UI consistency.

This document exists because some interface defects are neither a public component API problem nor a page-local styling choice. They sit one level above components: product information architecture, route-family boundaries and the way persistent navigation composes with content surfaces.

Read this together with:

- `docs/design-language.md` for visual hierarchy, surfaces, spacing, elevation and control geometry;
- `docs/product-surface-elevation-audit.md` for the current Showcase business-surface depth classification;
- `docs/product-driven-development.md` for evidence and stop-the-line workflow;
- `docs/abstraction-register.md` for material architecture decisions;
- `docs/api-specification.md` for public React API contracts.

These rules do **not** create new public Pattern/Gouno components. Product IA can be binding while implementation remains product-local.

## External evidence basis

Gouno uses mature systems as evidence, not as an authority:

- Carbon Tabs groups related information within the same context and explicitly says vertical Tabs must not replace navigation. Carbon also recommends other navigation patterns, such as side navigation, when a tab set becomes too large or overloaded.
- Carbon UI Shell defines the left panel as product navigation and uses it for frequently switched secondary destinations. Its guidance separates product navigation depth from page-local Tabs.
- Carbon's documentation navigation guidance notes that a single page-specific tab set can be less discoverable than menu items when those destinations have durable page identity.
- Atlassian Tabs describes Tabs as grouping similar information on the same page.
- WAI-ARIA Tabs establishes that the active `tabpanel` is labelled by its owning `tab`, so a duplicate visible heading is not required merely to identify the panel.
- Ant Design separates layout background from container surfaces and defines shadow levels by UI height rather than by ad-hoc component taste.
- Atlassian Elevation pairs surface tone and shadow, limits raised/overlay depth to intentional hierarchy, and treats overflow shadows separately from object elevation.

Reference pages:

- https://carbondesignsystem.com/components/tabs/usage/
- https://carbondesignsystem.com/components/UI-shell-left-panel/usage/
- https://gatsby.carbondesignsystem.com/guides/navigation/tabs/
- https://atlassian.design/components/tabs
- https://ant.design/docs/spec/shadow/
- https://ant.design/docs/react/customize-theme
- https://atlassian.design/foundations/elevation

## PI-01 — Product navigation has a depth budget

Normal application pages get **one persistent page-local Tabs layer**. A second persistent Tabs row is a stop-the-line information-architecture signal, not a styling problem to normalize.

Promote an inner tab family to product/sidebar navigation when most of the following are true:

- its destinations have durable names users can understand independently of the parent page;
- users may want to enter or bookmark those destinations directly;
- the destinations are administration/configuration domains rather than transient views of one task;
- permissions, ownership, status or lifecycle can differ by destination;
- users switch among them repeatedly outside one short workflow;
- the inner tab family remains useful even if the outer tab is removed.

Example:

```text
Avoid
AI 运营
└─ 高级设置 Tab
   └─ Agents | Skills | Tools | 知识库 | 模型连接 | Sandbox 连接器

Prefer
AI Automation
├─ AI 运营
│  └─ 概览 | 待我处理 | 自动化 | 运行中心
└─ AI 设置
   └─ Agents | Skills | Tools | 知识库 | 模型连接 | Sandbox 连接器
```

### Blog Admin Knowledge Workspace contract

`AI 设置 → 知识库` is a product-local canonical composition, not a generic Core component. The visible workspace must preserve this order:

1. **索引概览** — indexed posts, chunks, queue/failure health and retrieval latency.
2. **已索引内容** — concrete published posts, synchronization state, chunk count and last indexed time.
3. **检索验证** — a user-entered query with matched evidence snippets, Citation ID, semantic score, lexical score and combined score.
4. **Embedding 配置** — profile lifecycle and connection management, visually separated from knowledge content and retrieval evidence.

Do not collapse this surface back into an infrastructure-only “three counters + Embedding profiles” panel. Product consumers may bind richer real data, but must retain the same semantic hierarchy.

The second form gives operations and governance different route-family identities and removes a persistent two-dimensional navigation path.

### Allowed lower-level switching

A lower-level switch is allowed when it is **view state inside one bounded task**, not product navigation. Examples include Markdown/Preview in an editor, a table/list view switch, or an inspector mode. Such controls must not masquerade as a second product route family.

Editor workspaces remain an explicit exception under PD-035/PD-036 because their Tabs switch editor views rather than application destinations.

## PI-02 — Tabs name the panel; the panel lead adds context

For a normal route-family task/settings page, use:

```text
PageHeader (route-family H1)
Tabs
Active TabPanel
├─ open lead: description / active-panel actions
├─ optional panel feedback: Alert / status that applies to the whole Tab
└─ content surfaces
```

The active Tab is already the panel identity. Therefore:

- do not immediately repeat the Tab label as a visible H2;
- do not wrap the repeated Tab label + description inside the first Card just to make the Card look complete;
- place concise panel context in an **open lead outside Card/Table/List boundaries**;
- keep active-panel actions in that lead when they apply to the whole panel;
- omit the lead entirely when it adds no information;
- keep one-line lead geometry stable when actions appear or disappear; sibling panels use the same description typography and action alignment;
- put Tab-wide feedback immediately after the lead and before the first content surface; keep record/form/task-local feedback with the region that owns it.

The lead and feedback positions are presentation grammar, not public component contracts. Showcase may use a private helper to enforce the grammar; real products may compose it directly.

## PI-03 — Surface-local titles must name surface-local concepts

A Card/Table/List title is valid only when the surface itself owns a distinct concept beneath the active Tab.

Valid:

```text
系统状态 Tab

查看身份服务健康探针……     ← open panel lead

┌ 基础设施健康 ───────────┐  ← H2 belongs to this Card
│ PostgreSQL / Redis       │
└─────────────────────────┘

┌ OpenID Connect 配置 ────┐  ← another distinct H2
│ ...                      │
└─────────────────────────┘
```

Invalid:

```text
基础信息 Tab

┌ 基础信息 ───────────────┐  ← label echo
│ 站点名称、内容定位……    │
│ form fields              │
└─────────────────────────┘
```

A title that merely restates route/Tab identity belongs to navigation, not to the surface. Moving it inside a border does not create a new semantic section.

## PI-04 — Visible elevation uses semantic roles only

Product code does not choose shadow blur/alpha. It classifies the surface and lets the design system own the treatment.

The ladder is:

- **canvas:** application layout backdrop; no ambient shadow;
- **control:** tiny tactile depth for bounded Buttons/selected Segmented; this is not a page layer;
- **surface:** persistent top-level bounded content such as default Card and bordered Table;
- **raised:** focal/standalone task surface or an audited interaction transition;
- **overlay:** temporary UI that actually occupies a layer above another UI;
- **modal:** blocking high-depth UI;
- **overflow:** directional clipping/scroll cue, not height.

### Choosing `surface`

Use a normal surface when the region is a persistent bounded peer on the application canvas. Examples: dashboard Cards, filter Cards, settings Cards, editor frames and bordered Tables.

Do **not** add `shadow-surface` in page code when Core Card/Table already owns it. Product pages select semantics through the existing component/variant, not utility duplication.

A manual bordered list nested inside an existing surface can remain border-only. A rectangle is not automatically another surface layer.

### Choosing `raised`

Persistent raised depth is intentionally scarce. It is valid when the whole surface is the page's focal/standalone task or when explicit product hierarchy requires promotion.

Current persistent raised whitelist:

- Gosso Overview Hero;
- Gosso standalone authentication surface;
- Gosso standalone Not Found result surface.

Gosso Overview Quick Links are not persistently raised: they rest at `surface` and move to `raised` on hover because the depth transition communicates interactivity among peer cards.

Adding another persistent raised product surface requires a corpus-level review and update to `docs/product-surface-elevation-audit.md` plus conformance tests.

### Choosing `control`

A tiny control shadow is allowed for tangible bounded actions: primary/default, destructive, outline and secondary Buttons, plus selected Segmented items. Ghost/text/link actions stay flat. Inputs stay level 0 with border/focus-ring affordance.

Do not use control depth to decorate labels, badges, navigation items or generic bordered boxes.

### Positioning is not depth

`sticky`, `fixed` and `absolute` describe layout behavior; they do **not** by themselves establish `overlay`.

`BulkActionBar` remains the proof: it is sticky for access during selection but is still contextual ground. Border + opaque surface communicate selection context without manufacturing an ambient shadow. A future truly detached toolbar that covers unrelated content must be admitted explicitly.

### Raw shadow utilities are forbidden in canonical/product vocabulary

All raw size aliases (`shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`) intentionally resolve to no visible shadow for compatibility. Canonical/product source must not use them as new vocabulary. Arbitrary box-shadow values and page-local shadow colors are also forbidden.

Historical Legacy implementations in Git history are evidence, not current design precedent; `src/legacy/**` no longer exists in the current source tree.

## PI-05 — New binding rules require a corpus pass, not screenshot patching

A binding rule is adopted only after the governed corpus has been classified and the invariant has automated coverage where practical.

For every new interface-governance rule:

1. fix the triggering page;
2. enumerate all route families and components governed by the same rule;
3. classify each occurrence as conforming, stale or an intentional exception;
4. migrate stale occurrences before continuing normal product work;
5. record exceptions next to the rule or migration evidence;
6. add source/runtime regression coverage for properties that can be mechanically checked;
7. run the complete typecheck/test/package/Showcase gate on exact `main`;
8. review light and dark rendering for rules that source tests cannot prove.

Current automated checks should cover at least:

- one persistent page-local Tabs layer for normal tabbed route families;
- PageHeader-before-Tabs ordering;
- no immediate Tab-label heading echo in governed settings/management pages;
- open panel leads outside Card boundaries where a lead is used;
- semantic canvas/control/surface/raised/overlay/modal ownership;
- the explicit persistent raised-product whitelist and audited manual raised-hover exception;
- flat raw shadow compatibility aliases and no raw/product-local shadow utilities;
- sticky product surfaces remaining ground unless a real layer relationship is admitted;
- dense Table action geometry;
- surface edge/radius/padding ownership.

## PI-06 — Master-detail is a task pattern, not a generic list/detail default

Use a persistent master-detail layout only when the list remains operationally important while the user inspects one item.

Prefer master-detail when most of these are true:

- users repeatedly switch among many peer objects in one session;
- the selected detail is comparatively short or inspection-oriented;
- keeping list position, filters or queue context visible materially improves the task;
- the detail can remain legible without sacrificing the width required by its primary content.

Prefer a list route followed by a dedicated detail route when most of these are true:

- the object is an asset/configuration entity rather than an inbox item;
- entering detail starts a deeper management, editing, execution or troubleshooting task;
- the detail contains multiple dense regions, wide tables/grids or long-form controls;
- the list no longer contributes meaningful context after an object is selected.

Do not introduce a permanent rail merely because both a list and a detail exist.

Current canonical examples:

- **AI Operations / 待我处理** may use master-detail because users process a queue and repeatedly move between decisions.
- **AI Operations / 自动化 / Workflow** uses `Workflow list → dedicated Workflow detail`; the detail owns the full content width and links to Run evidence in 运行中心.
- **AI Operations / 运行中心** keeps master-detail for Workflow/Agent Run evidence because rapid evidence-to-evidence inspection is the task itself.

A dedicated detail route should preserve stable deep-link state and an explicit return path to its parent list. Do not replace this with hidden local-only selection state.

## PI-07 — List-triggered create/edit uses complexity-based editor surfaces

Create/edit interactions launched from collections must use a predictable surface chosen by task complexity, not by whichever overlay a page author happens to prefer.

Use three editor classes:

1. **Modal — lightweight mutation**
   - one focused decision or a compact form;
   - usually a few fields;
   - little or no need to inspect the list while editing;
   - the task should complete without scrolling through multiple conceptual sections.

2. **Drawer — contextual CRUD**
   - the edited object still belongs clearly to the current list;
   - preserving list context is useful;
   - the form is medium complexity but still one bounded object;
   - the form may scroll vertically, but should not require a wide multi-column workspace.

3. **Dedicated editor — deep asset configuration**
   - the object has multiple conceptual sections, governance rules, schemas, workflow definitions, permissions, budgets or execution boundaries;
   - the editor benefits from full content width;
   - creation/editing becomes a distinct task context rather than a quick list mutation;
   - the editor must provide an explicit return path and should reset the product viewport to the top when entered.

Rules:

- Create and edit for the same object family use the same editor class.
- Do not use inline page replacement as an accidental fourth pattern. If the collection disappears and a deep editor takes over the content area, treat it explicitly as a dedicated editor with its own lead, return action and state transition.
- Do not put large multi-section editors inside narrow Modals or Drawers merely for consistency.
- Do not promote small CRUD forms to full-page editors merely because another object family is complex.
- Destructive confirmation remains a Modal even when creation/editing uses Drawer or Dedicated Editor.
- Row-level toggles and tiny reversible actions may remain inline when no additional form is required.
- The list itself should stay mounted behind a Drawer, but a Dedicated Editor replaces the collection as a new task context.

Current canonical examples:

- Blog Admin Categories: contextual CRUD → Drawer.
- Gosso Admin OAuth2 Clients: bounded CRUD → Modal.
- Blog Admin AI Settings Agent / Skill: deep configuration → Dedicated Editor.
- Blog Admin AI Settings Provider / Embedding / Connector: contextual configuration → Drawer.
- Blog Admin AI Operations Workflow: deep asset configuration → Dedicated Editor.

Dedicated Editor has two governed subtypes:

- **Configuration Editor** — deep asset configuration such as Agent, Skill and Workflow. Use one editor identity region, explicit Back, optional task-level feedback, canonical section/layout rhythm and one action boundary.
- **Workspace Editor** — sustained creation/editing such as Post and Page. A purpose-built workspace shell may own navigator/canvas/inspector, but the upper-level Dedicated Editor responsibilities remain: explicit return path, stable task identity, predictable feedback and entry scroll reset.

The canonical contract and Showcase-only helper composition are documented in `docs/patterns/dedicated-editor.md`. This does **not** admit a public `DedicatedEditor` runtime component.

## PI-08 — Common admin data blocks use governed composition contracts

Blog Admin and Gosso Admin repeat the same semantic data arrangements often enough that component-level consistency is insufficient.

The governed composition family is:

- **Collection** — lead/feedback/summary/toolbar/selection/data/pagination.
- **Record Detail** — identity/feedback/summary/sections/local actions.
- **Master-Detail** — peer navigation + selected detail for repeated inspection/processing.
- **Settings** — active panel lead/feedback/sections/save boundary.
- **Data Summary** — compact decision-oriented metrics before the detailed data they summarize.

Rules:

- Use the semantic contract that matches the task, not whichever product page happens to look similar.
- The parent composition owns spacing between peer blocks. Child components must not compensate with arbitrary outer margins.
- Page- or panel-wide read errors appear before toolbar/data surfaces and must not leave stale editable data visible.
- Selection actions belong to the current collection selection context and sit between the normal toolbar and the data view they affect.
- Empty and loading states replace the data region while preserving meaningful route/filter context.
- Settings feedback appears after the active panel lead and before editable sections.
- Data Summary is optional and must answer a decision/status question; do not add KPI strips for visual symmetry.
- Record-wide feedback belongs before record sections; operation-local feedback remains local.
- Master-Detail continues to obey PI-06 and must collapse to an explicit single-pane navigation model on narrow viewports.
- These contracts are Showcase composition contracts, not public page-level runtime components.

The canonical contract is documented in `docs/patterns/admin-data-composition.md`.

## PI-09 — Editor forms share one cross-surface composition grammar

Modal, Drawer and Dedicated Editor choose different task surfaces under PI-07, but once an editor form begins they share one internal grammar. The surface choice must not cause every product team to reinvent field rhythm, feedback placement or save/cancel boundaries.

The canonical order is:

```text
Editor identity / overlay header
├─ optional EditorFeedback
├─ EditorFormBody
│  ├─ EditorFormSection
│  │  ├─ optional SectionLead
│  │  └─ FieldStack
│  └─ EditorFormSection
└─ EditorActions
```

Rules:

- The owning editor surface controls outer padding, scrolling and footer behavior; fields do not repair those responsibilities with arbitrary outer margin.
- Normal field stacks use one 20px vertical rhythm (`gap-5`) unless a compact repeated-row editor explicitly owns a denser local grammar.
- Section-to-section rhythm is owned by the form body or Dedicated Editor layout, not by bottom margins on individual sections.
- Field label/help/error geometry stays inside `Field`; business pages do not add a second label-spacing system around it.
- Form-wide feedback appears after the editor identity/header and before the editable body. Section- or operation-local feedback stays with the owning section.
- Save/cancel actions use one terminal action boundary. Drawer may render that boundary in its footer; Modal may use its action area; Dedicated Editor uses the page-level action boundary. The semantic order remains the same.
- Create and edit variants of one object family keep the same section order and field rhythm. Optional fields may collapse without changing unrelated gaps.
- A responsive multi-column `FormGrid` changes columns, not the vertical field rhythm around the grid.
- Compact repeated editors such as dynamic Workflow step rows may own an explicit dense row grammar, but the exception must be local and must not leak into ordinary form sections.
- This is a Showcase composition contract. Do not add a public `EditorForm`, `FormSection` or `FieldStack` API solely to encode layout grammar.

The canonical contract is documented in `docs/patterns/editor-form-composition.md`.

## Review checklist

Before accepting a normal Admin page or route family, ask:

1. Is each persistent navigation layer actually navigation, or is a view-state control being confused with navigation?
2. Does the page contain more than one persistent Tabs layer? If yes, should the inner destinations become sidebar/product routes?
3. Does the active Tab already say the same thing as the first visible heading?
4. Is explanatory copy an open panel lead, or has it been trapped inside a Card only because the Card needed a header?
5. Does every Card-local heading name a concept owned by that Card rather than the route/Tab?
6. Is this region canvas, control, surface, raised, overlay/modal, or merely an overflow cue?
7. If it is a top-level bounded peer on the application canvas, is Core already giving it the normal surface treatment?
8. If it is nested inside another surface, can border/divider/subtle tone communicate the grouping without another shadow?
9. If it is persistently raised, is it on the audited whitelist and genuinely focal/standalone rather than simply a Box someone wanted to emphasize?
10. Is elevation being inferred merely from `sticky`/`fixed`/`absolute`? If yes, stop and classify the actual layer relationship.
11. If a semantic overlay has a shadow, does it actually cover or float above peer content?
12. Has the same rule been scanned across Gosso Admin + Blog Admin rather than fixed only where a screenshot exposed it?
13. Is a master-detail layout actually supporting repeated peer switching, or is it stealing width from a deep asset-management task?
14. If the detail is a dedicated route, does it preserve a deep link and an explicit return path to the parent list?
15. Does each list-triggered create/edit flow use Modal, Drawer or Dedicated Editor according to task complexity rather than page-local preference?
16. Do create and edit for one object family use the same editor class?
17. If a Dedicated Editor replaces the collection, does it have an explicit return path and reset the product viewport on entry?
18. Does the page map to Collection, Record Detail, Master-Detail, Settings or Data Summary composition instead of inventing a page-local block order?
19. Is page/panel-wide feedback positioned before toolbar/data/settings sections according to its semantic scope?
20. Does the semantic parent own spacing between peer data blocks rather than child components adding compensating margins?
21. Is there a regression gate for the invariant, or a documented reason why only visual review can prove it?
22. Does every create/edit form use the shared Editor Form order and field/section rhythm regardless of whether it lives in Modal, Drawer or Dedicated Editor?
23. Does the owning editor surface control outer padding/footer behavior instead of fields or sections compensating with page-local margins?

A page that passes component API tests but fails these questions is not interface-conformant.
