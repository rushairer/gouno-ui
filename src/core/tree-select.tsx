import type { ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface TreeSelectNode { value: string; title: ReactNode; disabled?: boolean; children?: TreeSelectNode[]; }
function flatten(nodes: TreeSelectNode[], depth = 0): Array<TreeSelectNode & { depth: number }> { return nodes.flatMap((node) => [{ ...node, depth }, ...flatten(node.children ?? [], depth + 1)]); }
export interface TreeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "defaultValue" | "multiple" | "onChange"> {
  treeData: TreeSelectNode[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
}
export function TreeSelect({ treeData, value, defaultValue, onChange, placeholder = "Please select", disabled, multiple = false, className, id, ...props }: TreeSelectProps) {
  const nodes = flatten(treeData);
  return <select {...props} id={id} multiple={multiple} disabled={disabled} value={value} defaultValue={defaultValue} aria-disabled={disabled || undefined} onChange={(event) => onChange?.(multiple ? Array.from(event.currentTarget.selectedOptions, (option) => option.value) : event.currentTarget.value)} className={cn("min-h-9 rounded-md border bg-input px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", className)}>
    {!multiple ? <option value="" disabled>{placeholder}</option> : null}
    {nodes.map((node) => <option key={node.value} value={node.value} disabled={node.disabled}>{`${"— ".repeat(node.depth)}${String(node.title)}`}</option>)}
  </select>;
}
