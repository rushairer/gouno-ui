# Markdown Rendering Ownership

## Status

Accepted for the current Gouno UI / Gouno Blog architecture.

## Context

Markdown now appears in two different responsibilities:

1. `@gouno/ui/patterns` exposes `MarkdownEditor`, which owns authoring mechanics, selection/cursor behavior, formatting commands, edit/split/preview view state, and product extension slots. It deliberately accepts `renderPreview` instead of choosing a Markdown parser.
2. `gouno-blog/blog-frontend` already owns a real `MarkdownRenderer` based on `react-markdown`, `remark-gfm`, and `rehype-highlight`. That renderer also owns Blog-specific reading typography, heading anchors, external-link behavior, image policy, localized code-copy labels, and the public article reading contract.

The Showcase also has a private `MarkdownPreview` used to exercise editor behavior. It is validation/demo infrastructure, not a public package API.

## Decision

### Keep Markdown parsing/rendering product-owned for now

Do **not** promote a public `MarkdownRenderer` into `@gouno/ui` yet.

`@gouno/ui` continues to own reusable UI responsibilities that Markdown rendering consumes:

- `CodeBlock` frame, overflow and copy interaction;
- theme/tokens/typography primitives;
- `MarkdownEditor` authoring mechanics;
- `renderPreview` as the injection boundary between editing and rendering.

`gouno-blog` owns the actual Markdown rendering stack and policy:

- parser and GFM extensions;
- syntax-highlighting engine;
- HTML handling policy;
- link/image policy;
- heading-id generation and article TOC compatibility;
- public-reading typography and localization.

### Reuse one Blog renderer across Blog surfaces

Within `gouno-blog`, the product-local `MarkdownRenderer` should become the canonical renderer for every surface that needs production Markdown semantics, including:

- public article/page reading;
- Blog Admin preview;
- editor split/preview through `MarkdownEditor.renderPreview`;
- any future Blog-owned content preview that must match public output.

This removes the risk that the editor preview accepts syntax or renders typography differently from the published article.

### Showcase renderer remains private

`showcase/components/markdown-preview.tsx` may remain a small, dependency-light renderer for component demonstrations and visual contracts. It must not be presented as the implementation consumers should copy into production.

When Blog Admin is reverse-migrated, production preview parity should be proven against `gouno-blog`'s canonical renderer rather than by promoting the Showcase helper into package API.

## Why not put `react-markdown` in `@gouno/ui` now?

Promoting the renderer today would make a UI/design-system package own dependencies and policies that are not yet proven product-neutral:

- `react-markdown` / remark / rehype bundle and version lifecycle;
- content sanitization and raw-HTML policy;
- URL and image security policy;
- heading-anchor and TOC semantics;
- syntax-highlighting implementation;
- localized copy labels and public-reading rhythm.

Those choices are content-platform concerns, not primitive UI concerns.

## Promotion trigger

Revisit a public Markdown rendering package only when a second non-Blog product independently needs materially the same parsing and rendering contract.

At that point, prefer a dedicated optional surface such as `@gouno/markdown` or a narrowly scoped `@gouno/ui/markdown` entrypoint over adding parser/highlighter dependencies to the default `@gouno/ui` bundle.

The promoted contract should still keep syntax engines and product-only policies replaceable where practical.

## Heading authoring policy

`MarkdownEditor` supports a configurable heading menu through `headingLevels`.

- Default document-body profile: `H2–H6`, with `H1` reserved for the surrounding page/document title.
- Standalone Markdown documents may opt into `H1–H6` explicitly.
- The menu includes `正文` so heading conversion is reversible instead of only prefixing Markdown markers.
- The trigger reflects the current cursor block (`正文`, `H1`, `H2`, …) and preserves the selection captured before the menu takes focus.
