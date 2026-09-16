/**
 * Canonical reusable compound interaction patterns admitted through
 * docs/product-driven-development.md evidence review.
 */
export { BulkActionBar, type BulkActionBarProps } from "./bulk-action-bar";
export {
  AISuggestionPicker,
  AISuggestionReview,
  type AISuggestionOption,
  type AISuggestionPickerProps,
  type AISuggestionReviewItem,
  type AISuggestionReviewProps,
} from "./ai-suggestions";
export {
  DocumentEditorShell,
  type DocumentEditorShellProps,
} from "./document-editor-shell";
export {
  MarkdownEditor,
  type MarkdownEditorCommand,
  type MarkdownEditorInsertOptions,
  type MarkdownEditorMode,
  type MarkdownEditorProps,
  type MarkdownEditorRef,
  type MarkdownEditorSelection,
  type MarkdownEditorToolbarActions,
  type MarkdownEditorToolbarActionsContext,
  type MarkdownHeadingLevel,
} from "./markdown-editor";