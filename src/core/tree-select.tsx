import {
  forwardRef,
  type SelectHTMLAttributes,
} from "react";
import { cn } from "../lib/utils";
import { controlSizeClass, type ControlSize } from "./control-types";

export interface TreeSelectNode {
  value: string;
  title: string;
  disabled?: boolean;
  children?: readonly TreeSelectNode[];
}

interface FlattenedTreeSelectNode extends TreeSelectNode {
  depth: number;
}

function flatten(
  nodes: readonly TreeSelectNode[],
  depth = 0,
): FlattenedTreeSelectNode[] {
  return nodes.flatMap((node) => [
    { ...node, depth },
    ...flatten(node.children ?? [], depth + 1),
  ]);
}

export interface TreeSelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size" | "value" | "defaultValue" | "multiple" | "onChange"
> {
  treeData: readonly TreeSelectNode[];
  value?: string | readonly string[];
  defaultValue?: string | readonly string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  size?: ControlSize;
  status?: "error" | "warning";
}

export const TreeSelect = forwardRef<HTMLSelectElement, TreeSelectProps>(
  function TreeSelect(
    {
      treeData,
      value,
      defaultValue,
      onChange,
      placeholder,
      disabled = false,
      multiple = false,
      size = "middle",
      status,
      className,
      ...props
    },
    ref,
  ) {
    const nodes = flatten(treeData);
    const invalid = status === "error" ? true : props["aria-invalid"];

    return (
      <select
        {...props}
        ref={ref}
        multiple={multiple}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        aria-disabled={disabled || props["aria-disabled"] || undefined}
        aria-invalid={invalid}
        data-slot="tree-select"
        data-status={status}
        onChange={(event) =>
          onChange?.(
            multiple
              ? Array.from(
                  event.currentTarget.selectedOptions,
                  (option) => option.value,
                )
              : event.currentTarget.value,
          )
        }
        className={cn(
          "rounded-md border border-border bg-input px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          controlSizeClass(size),
          multiple && "h-auto min-h-24 py-2",
          status === "error" &&
            "border-destructive focus-visible:ring-destructive",
          status === "warning" &&
            "border-warning focus-visible:ring-warning",
          className,
        )}
      >
        {!multiple && placeholder !== undefined ? (
          <option value="" disabled data-slot="tree-select-placeholder">
            {placeholder}
          </option>
        ) : null}
        {nodes.map((node) => (
          <option
            key={node.value}
            value={node.value}
            disabled={node.disabled}
            data-slot="tree-select-option"
            data-depth={node.depth}
          >
            {`${"\u00A0\u00A0".repeat(node.depth)}${node.title}`}
          </option>
        ))}
      </select>
    );
  },
);
