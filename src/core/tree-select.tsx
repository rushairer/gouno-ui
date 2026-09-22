import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type SelectHTMLAttributes,
} from "react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../components/primitives/popover";
import { cn } from "../lib/utils";
import type { ControlSize } from "./control-types";
import {
  PickerChevron,
  pickerControlClass,
  pickerTriggerClass,
} from "./picker-internals";
import { Tree, type TreeCheckedKeys, type TreeNode } from "./tree";

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

function toTreeNodes(nodes: readonly TreeSelectNode[]): TreeNode[] {
  return nodes.map((node) => ({
    key: node.value,
    title: node.title,
    disabled: node.disabled,
    children: node.children?.length ? toTreeNodes(node.children) : undefined,
  }));
}

function ancestorKeys(
  nodes: readonly TreeSelectNode[],
  selectedValues: readonly string[],
): string[] {
  const selected = new Set(selectedValues);
  const expanded = new Set<string>();

  const visit = (
    items: readonly TreeSelectNode[],
    parentPath: readonly string[],
  ): boolean => {
    let subtreeSelected = false;

    for (const item of items) {
      const path = [...parentPath, item.value];
      const childSelected = item.children?.length
        ? visit(item.children, path)
        : false;
      const containsSelection = selected.has(item.value) || childSelected;

      if (item.children?.length && containsSelection) {
        for (const key of path) expanded.add(key);
      }
      subtreeSelected ||= containsSelection;
    }

    return subtreeSelected;
  };

  visit(nodes, []);
  return [...expanded];
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
      name,
      id,
      required,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      ...props
    },
    ref,
  ) {
    const nodes = useMemo(() => flatten(treeData), [treeData]);
    const treeNodes = useMemo(() => toTreeNodes(treeData), [treeData]);
    const generatedId = useId();
    const baseId = id ?? `tree-select-${generatedId}`;
    const nativeSelectId = `${baseId}-native`;
    const popupId = `${baseId}-tree`;
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const initial =
      defaultValue === undefined ? (multiple ? [] : "") : defaultValue;
    const [innerValue, setInnerValue] = useState<string | readonly string[]>(
      initial,
    );
    const [open, setOpen] = useState(false);
    const selected = value === undefined ? innerValue : value;
    const selectedValues = Array.isArray(selected)
      ? [...selected]
      : selected
        ? [selected]
        : [];
    const selectedNodes = selectedValues
      .map((selectedValue) =>
        nodes.find((node) => node.value === selectedValue),
      )
      .filter(
        (node): node is FlattenedTreeSelectNode => node !== undefined,
      );
    const invalid = status === "error" ? true : ariaInvalid;
    const expandedKeys = useMemo(
      () => ancestorKeys(treeData, selectedValues),
      [treeData, selectedValues],
    );

    const commit = (next: string | string[]) => {
      if (value === undefined) setInnerValue(next);
      onChange?.(next);
    };

    const checkedValues = (checked: TreeCheckedKeys) =>
      ("checked" in checked ? checked.checked : checked).map(String);

    return (
      <div className="relative min-w-0" data-slot="tree-select-root">
        <select
          {...props}
          id={nativeSelectId}
          name={name}
          required={required}
          disabled={disabled}
          multiple={multiple}
          value={multiple ? selectedValues : selectedValues[0] ?? ""}
          onChange={() => undefined}
          ref={ref}
          aria-hidden="true"
          aria-disabled={disabled || undefined}
          aria-invalid={invalid}
          tabIndex={-1}
          data-slot="tree-select"
          data-status={status}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
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
              {node.title}
            </option>
          ))}
        </select>

        <Popover
          open={open}
          onOpenChange={(next) => {
            if (!disabled) setOpen(next);
          }}
        >
          <PopoverAnchor asChild>
            <div
              data-slot="tree-select-control"
              className={cn(
                pickerControlClass({
                  size,
                  status,
                  disabled,
                  flexible: multiple && selectedValues.length > 0,
                }),
                className,
              )}
            >
              {multiple && selectedNodes.length ? (
                <div
                  data-slot="tree-select-tags"
                  className="flex min-w-0 flex-1 flex-wrap gap-1"
                >
                  {selectedNodes.map((node) => (
                    <span
                      key={node.value}
                      className="inline-flex max-w-full items-center rounded bg-secondary px-1.5 py-0.5 text-xs"
                    >
                      <span className="truncate">{node.title}</span>
                    </span>
                  ))}
                </div>
              ) : null}

              <PopoverTrigger asChild>
                <button
                  ref={triggerRef}
                  type="button"
                  id={baseId}
                  role="combobox"
                  aria-haspopup="tree"
                  aria-expanded={open}
                  aria-controls={popupId}
                  aria-label={ariaLabel}
                  aria-labelledby={ariaLabelledBy}
                  aria-describedby={ariaDescribedBy}
                  aria-invalid={invalid}
                  aria-required={required || ariaRequired || undefined}
                  disabled={disabled}
                  className={pickerTriggerClass({
                    fill: !(multiple && selectedValues.length),
                  })}
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowDown" ||
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      if (!open) setOpen(true);
                    } else if (event.key === "Escape" && open) {
                      event.preventDefault();
                      setOpen(false);
                    }
                  }}
                >
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate",
                      !selectedNodes.length && "text-muted-foreground",
                      multiple && selectedNodes.length && "sr-only",
                    )}
                  >
                    {multiple && selectedNodes.length
                      ? selectedNodes.map((node) => node.title).join(", ")
                      : selectedNodes[0]?.title || placeholder || "—"}
                  </span>
                  <PickerChevron />
                </button>
              </PopoverTrigger>
            </div>
          </PopoverAnchor>

          <PopoverContent
            ref={contentRef}
            id={popupId}
            role="presentation"
            placement="bottom-start"
            className="w-[var(--radix-popover-trigger-width)] min-w-56 p-1"
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              queueMicrotask(() => {
                contentRef.current
                  ?.querySelector<HTMLElement>(
                    '[role="treeitem"][tabindex="0"]',
                  )
                  ?.focus();
              });
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              triggerRef.current?.focus();
            }}
          >
            <Tree
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              treeData={treeNodes}
              blockNode
              disabled={disabled}
              defaultExpandedKeys={expandedKeys}
              selectedKeys={multiple ? [] : selectedValues}
              checkedKeys={multiple ? selectedValues : undefined}
              checkable={multiple}
              checkStrictly={multiple}
              selectable={!multiple}
              onSelect={(_keys, info) => {
                const next = String(info.node.key);
                commit(next);
                setOpen(false);
              }}
              onCheck={(checked) => {
                if (!multiple) return;
                commit(checkedValues(checked));
              }}
              className="max-h-72 overflow-y-auto p-1"
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
