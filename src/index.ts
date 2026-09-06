export * from "./components";
export * from "./theme/provider";
export * from "./lib/utils";
// Compatibility exports for consumers that imported low-level primitives directly.
export * from "./components/primitives/dialog";
export * from "./components/primitives/dropdown-menu";
export * from "./components/primitives/tooltip";
export * from "./components/primitives/popover";
export * from "./components/primitives/separator";
export * from "./components/primitives/avatar";
export * from "./components/layout/primitives";
export { cn as classes } from "./lib/utils";
// Layered public APIs
export { ConfirmDialog, useConfirm } from "./patterns/confirm-dialog";
export type { ConfirmDialogProps, ConfirmOptions } from "./patterns/confirm-dialog";
