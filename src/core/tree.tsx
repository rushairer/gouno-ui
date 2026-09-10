import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Spinner } from "./spinner";

export interface TreeNode {
  key: Key;
  title: ReactNode;
  children?: readonly TreeNode[];
  disabled?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  disableCheckbox?: boolean;
  icon?: ReactNode | ((info: TreeNodeRenderInfo) => ReactNode);
  isLeaf?: boolean;
}

export interface TreeNodeRenderInfo {
  node: TreeNode;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  halfChecked: boolean;
  loading: boolean;
  disabled: boolean;
}

export interface TreeExpandInfo {
  expanded: boolean;
  node: TreeNode;
}

export interface TreeSelectInfo {
  selected: boolean;
  selectedNodes: TreeNode[];
  node: TreeNode;
  nativeEvent: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>;
}

export interface TreeCheckInfo {
  checked: boolean;
  checkedNodes: TreeNode[];
  halfCheckedKeys: Key[];
  node: TreeNode;
  nativeEvent: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLDivElement>;
}

export type TreeCheckedKeys =
  | readonly Key[]
  | {
      checked: readonly Key[];
      halfChecked: readonly Key[];
    };

export type TreeSemantic =
  | "root"
  | "item"
  | "switcher"
  | "checkbox"
  | "icon"
  | "title"
  | "group";

export interface TreeSemanticInfo {
  props: Readonly<{
    checkable: boolean;
    multiple: boolean;
    disabled: boolean;
    showLine: boolean;
    blockNode: boolean;
  }>;
}

export type TreeClassNames =
  | Partial<Record<TreeSemantic, string>>
  | ((info: TreeSemanticInfo) => Partial<Record<TreeSemantic, string>>);
export type TreeStyles =
  | Partial<Record<TreeSemantic, CSSProperties>>
  | ((info: TreeSemanticInfo) => Partial<Record<TreeSemantic, CSSProperties>>);

export interface TreeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onLoad" | "onSelect"> {
  treeData: readonly TreeNode[];
  expandedKeys?: readonly Key[];
  defaultExpandedKeys?: readonly Key[];
  defaultExpandAll?: boolean;
  selectedKeys?: readonly Key[];
  defaultSelectedKeys?: readonly Key[];
  checkedKeys?: TreeCheckedKeys;
  defaultCheckedKeys?: readonly Key[];
  loadedKeys?: readonly Key[];
  checkable?: boolean;
  checkStrictly?: boolean;
  multiple?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  blockNode?: boolean;
  showIcon?: boolean;
  showLine?: boolean;
  icon?: ReactNode | ((info: TreeNodeRenderInfo) => ReactNode);
  switcherIcon?: ReactNode | ((info: TreeNodeRenderInfo) => ReactNode);
  switcherLoadingIcon?: ReactNode;
  titleRender?: (node: TreeNode) => ReactNode;
  filterTreeNode?: (node: TreeNode) => boolean;
  loadData?: (node: TreeNode) => Promise<void>;
  onExpand?: (expandedKeys: Key[], info: TreeExpandInfo) => void;
  onSelect?: (selectedKeys: Key[], info: TreeSelectInfo) => void;
  onCheck?: (checkedKeys: TreeCheckedKeys, info: TreeCheckInfo) => void;
  onLoad?: (loadedKeys: Key[], info: { node: TreeNode }) => void;
  classNames?: TreeClassNames;
  styles?: TreeStyles;
  ref?: Ref<HTMLDivElement>;
}

interface TreeEntry {
  node: TreeNode;
  parentKey?: Key;
  level: number;
  index: number;
}

function keyToken(key: Key) {
  return `${typeof key === "number" ? "n" : "s"}:${String(key)}`;
}

function keyIncludes(keys: readonly Key[], key: Key) {
  return keys.some((candidate) => candidate === key);
}

function flattenAll(
  nodes: readonly TreeNode[],
  parentKey?: Key,
  level = 1,
): TreeEntry[] {
  return nodes.flatMap((node, index) => [
    { node, parentKey, level, index },
    ...flattenAll(node.children ?? [], node.key, level + 1),
  ]);
}

function flattenVisible(
  nodes: readonly TreeNode[],
  expanded: readonly Key[],
  parentKey?: Key,
  level = 1,
): TreeEntry[] {
  return nodes.flatMap((node, index) => {
    const entry = { node, parentKey, level, index };
    return [
      entry,
      ...(keyIncludes(expanded, node.key)
        ? flattenVisible(node.children ?? [], expanded, node.key, level + 1)
        : []),
    ];
  });
}

function branchKeys(nodes: readonly TreeNode[]) {
  return flattenAll(nodes)
    .filter(({ node }) => Boolean(node.children?.length) || node.isLeaf === false)
    .map(({ node }) => node.key);
}

function uniqueKeys(keys: readonly Key[]) {
  return Array.from(new Set(keys));
}

function isStrictCheckedKeys(
  value: TreeCheckedKeys,
): value is { checked: readonly Key[]; halfChecked: readonly Key[] } {
  return !Array.isArray(value);
}

function rawCheckedKeys(value: TreeCheckedKeys | undefined) {
  if (!value) return [];
  return isStrictCheckedKeys(value) ? value.checked : value;
}

function checkedNodesFor(keys: readonly Key[], entries: readonly TreeEntry[]) {
  const set = new Set(keys);
  return entries.filter(({ node }) => set.has(node.key)).map(({ node }) => node);
}

function resolveNodeIcon(
  source: TreeNode["icon"] | TreeProps["icon"],
  info: TreeNodeRenderInfo,
) {
  return typeof source === "function" ? source(info) : source;
}

function resolveSwitcherIcon(
  source: TreeProps["switcherIcon"],
  info: TreeNodeRenderInfo,
) {
  if (source) return typeof source === "function" ? source(info) : source;
  return info.expanded ? (
    <ChevronDown aria-hidden="true" />
  ) : (
    <ChevronRight aria-hidden="true" />
  );
}

function titleId(key: Key, level: number, index: number) {
  const safeKey = keyToken(key).replace(/[^a-zA-Z0-9_-]/g, "-");
  return `gouno-tree-title-${level}-${index}-${safeKey}`;
}

export function Tree({
  treeData,
  expandedKeys,
  defaultExpandedKeys = [],
  defaultExpandAll = false,
  selectedKeys,
  defaultSelectedKeys = [],
  checkedKeys,
  defaultCheckedKeys = [],
  loadedKeys,
  checkable = false,
  checkStrictly = false,
  multiple = false,
  selectable = true,
  disabled = false,
  blockNode = false,
  showIcon = false,
  showLine = false,
  icon,
  switcherIcon,
  switcherLoadingIcon,
  titleRender,
  filterTreeNode,
  loadData,
  onExpand,
  onSelect,
  onCheck,
  onLoad,
  classNames,
  styles,
  className,
  style,
  ref,
  ...props
}: TreeProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const allEntries = useMemo(() => flattenAll(treeData), [treeData]);
  const entryByKey = useMemo(
    () => new Map(allEntries.map((entry) => [entry.node.key, entry])),
    [allEntries],
  );
  const orderByKey = useMemo(
    () => new Map(allEntries.map((entry, index) => [entry.node.key, index])),
    [allEntries],
  );

  const [internalExpandedKeys, setInternalExpandedKeys] = useState<Key[]>(() =>
    uniqueKeys(
      defaultExpandAll
        ? [...branchKeys(treeData), ...defaultExpandedKeys]
        : defaultExpandedKeys,
    ),
  );
  const activeExpandedKeys = expandedKeys ?? internalExpandedKeys;

  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Key[]>(() =>
    uniqueKeys(defaultSelectedKeys),
  );
  const activeSelectedKeys = selectedKeys ?? internalSelectedKeys;

  const [internalCheckedKeys, setInternalCheckedKeys] = useState<Key[]>(() =>
    uniqueKeys(defaultCheckedKeys),
  );
  const incomingCheckedKeys = checkedKeys
    ? rawCheckedKeys(checkedKeys)
    : internalCheckedKeys;

  const [internalLoadedKeys, setInternalLoadedKeys] = useState<Key[]>([]);
  const activeLoadedKeys = loadedKeys ?? internalLoadedKeys;
  const [loadingKeys, setLoadingKeys] = useState<Key[]>([]);

  const semanticInfo: TreeSemanticInfo = {
    props: { checkable, multiple, disabled, showLine, blockNode },
  };
  const semanticClassNames =
    typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles =
    typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});

  const conductedCheckedKeys = useMemo(() => {
    if (checkStrictly) return uniqueKeys(incomingCheckedKeys);
    const checked = new Set<Key>();

    const addDescendants = (node: TreeNode) => {
      if (!node.disabled && !node.disableCheckbox && node.checkable !== false) {
        checked.add(node.key);
      }
      for (const child of node.children ?? []) addDescendants(child);
    };

    for (const key of incomingCheckedKeys) {
      const entry = entryByKey.get(key);
      if (entry) addDescendants(entry.node);
    }

    for (const { node } of [...allEntries].reverse()) {
      if (node.disabled || node.disableCheckbox || node.checkable === false) continue;
      const eligibleChildren = (node.children ?? []).filter(
        (child) =>
          !child.disabled && !child.disableCheckbox && child.checkable !== false,
      );
      if (
        eligibleChildren.length &&
        eligibleChildren.every((child) => checked.has(child.key))
      ) {
        checked.add(node.key);
      }
    }

    return allEntries
      .filter(({ node }) => checked.has(node.key))
      .map(({ node }) => node.key);
  }, [allEntries, checkStrictly, entryByKey, incomingCheckedKeys]);

  const halfCheckedKeys = useMemo(() => {
    if (checkStrictly) {
      return checkedKeys && isStrictCheckedKeys(checkedKeys)
        ? [...checkedKeys.halfChecked]
        : [];
    }
    const checked = new Set(conductedCheckedKeys);
    const half = new Set<Key>();
    for (const { node } of [...allEntries].reverse()) {
      if (checked.has(node.key)) continue;
      const children = (node.children ?? []).filter(
        (child) =>
          !child.disabled && !child.disableCheckbox && child.checkable !== false,
      );
      if (
        children.some((child) => checked.has(child.key) || half.has(child.key))
      ) {
        half.add(node.key);
      }
    }
    return allEntries
      .filter(({ node }) => half.has(node.key))
      .map(({ node }) => node.key);
  }, [allEntries, checkStrictly, checkedKeys, conductedCheckedKeys]);

  const visibleEntries = useMemo(
    () => flattenVisible(treeData, activeExpandedKeys),
    [activeExpandedKeys, treeData],
  );
  const initialFocusKey =
    activeSelectedKeys.find((key) =>
      visibleEntries.some(({ node }) => node.key === key),
    ) ?? visibleEntries[0]?.node.key;
  const [focusKey, setFocusKey] = useState<Key | undefined>(initialFocusKey);

  const setRootRef = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const focusNode = (key: Key | undefined) => {
    if (key === undefined) return;
    setFocusKey(key);
    queueMicrotask(() => {
      const token = keyToken(key);
      const candidates =
        rootRef.current?.querySelectorAll<HTMLElement>("[data-tree-key]") ?? [];
      Array.from(candidates)
        .find((element) => element.dataset.treeKey === token)
        ?.focus();
    });
  };

  const sortKeys = (keys: Iterable<Key>) =>
    Array.from(new Set(keys)).sort(
      (a, b) =>
        (orderByKey.get(a) ?? Number.MAX_SAFE_INTEGER) -
        (orderByKey.get(b) ?? Number.MAX_SAFE_INTEGER),
    );

  const requestLoad = async (node: TreeNode) => {
    if (
      !loadData ||
      node.isLeaf === true ||
      keyIncludes(activeLoadedKeys, node.key) ||
      keyIncludes(loadingKeys, node.key)
    ) {
      return;
    }
    setLoadingKeys((keys) => uniqueKeys([...keys, node.key]));
    try {
      await loadData(node);
      const nextLoadedKeys = sortKeys([...activeLoadedKeys, node.key]);
      if (loadedKeys === undefined) setInternalLoadedKeys(nextLoadedKeys);
      onLoad?.(nextLoadedKeys, { node });
    } finally {
      setLoadingKeys((keys) => keys.filter((key) => key !== node.key));
    }
  };

  const setExpanded = (node: TreeNode, expanded: boolean) => {
    const nextKeys = expanded
      ? sortKeys([...activeExpandedKeys, node.key])
      : activeExpandedKeys.filter((key) => key !== node.key);
    if (expandedKeys === undefined) setInternalExpandedKeys(nextKeys);
    onExpand?.(nextKeys, { expanded, node });
    if (expanded) void requestLoad(node);
  };

  const selectNode = (
    node: TreeNode,
    event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>,
  ) => {
    const nodeDisabled = disabled || node.disabled;
    if (nodeDisabled || !selectable || node.selectable === false) return;

    const currentlySelected = keyIncludes(activeSelectedKeys, node.key);
    const additive = multiple && (event.metaKey || event.ctrlKey);
    const nextKeys =
      !multiple || !additive
        ? currentlySelected && multiple
          ? []
          : [node.key]
        : currentlySelected
          ? activeSelectedKeys.filter((key) => key !== node.key)
          : sortKeys([...activeSelectedKeys, node.key]);

    if (selectedKeys === undefined) setInternalSelectedKeys(nextKeys);
    onSelect?.(nextKeys, {
      selected: keyIncludes(nextKeys, node.key),
      selectedNodes: checkedNodesFor(nextKeys, allEntries),
      node,
      nativeEvent: event,
    });
  };

  const setChecked = (
    node: TreeNode,
    nextChecked: boolean,
    event: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLDivElement>,
  ) => {
    const nodeDisabled =
      disabled || node.disabled || node.disableCheckbox || node.checkable === false;
    if (nodeDisabled || !checkable) return;

    const current = new Set(conductedCheckedKeys);
    if (checkStrictly) {
      if (nextChecked) current.add(node.key);
      else current.delete(node.key);
    } else {
      const descendants = flattenAll([node]).map(({ node: child }) => child);
      for (const child of descendants) {
        if (child.disabled || child.disableCheckbox || child.checkable === false) {
          continue;
        }
        if (nextChecked) current.add(child.key);
        else current.delete(child.key);
      }

      let parentKey = entryByKey.get(node.key)?.parentKey;
      while (parentKey !== undefined) {
        current.delete(parentKey);
        parentKey = entryByKey.get(parentKey)?.parentKey;
      }

      for (const { node: candidate } of [...allEntries].reverse()) {
        if (
          candidate.disabled ||
          candidate.disableCheckbox ||
          candidate.checkable === false
        ) {
          continue;
        }
        const children = (candidate.children ?? []).filter(
          (child) =>
            !child.disabled && !child.disableCheckbox && child.checkable !== false,
        );
        if (children.length && children.every((child) => current.has(child.key))) {
          current.add(candidate.key);
        }
      }
    }

    const nextKeys = sortKeys(current);
    if (checkedKeys === undefined) setInternalCheckedKeys(nextKeys);
    const nextHalfKeys = checkStrictly
      ? checkedKeys && isStrictCheckedKeys(checkedKeys)
        ? [...checkedKeys.halfChecked]
        : []
      : (() => {
          const checked = new Set(nextKeys);
          const half = new Set<Key>();
          for (const { node: candidate } of [...allEntries].reverse()) {
            if (checked.has(candidate.key)) continue;
            const children = (candidate.children ?? []).filter(
              (child) =>
                !child.disabled &&
                !child.disableCheckbox &&
                child.checkable !== false,
            );
            if (
              children.some(
                (child) => checked.has(child.key) || half.has(child.key),
              )
            ) {
              half.add(candidate.key);
            }
          }
          return sortKeys(half);
        })();

    const output: TreeCheckedKeys = checkStrictly
      ? { checked: nextKeys, halfChecked: nextHalfKeys }
      : nextKeys;
    onCheck?.(output, {
      checked: nextChecked,
      checkedNodes: checkedNodesFor(nextKeys, allEntries),
      halfCheckedKeys: nextHalfKeys,
      node,
      nativeEvent: event,
    });
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    entry: TreeEntry,
  ) => {
    const { node, parentKey } = entry;
    const visibleIndex = visibleEntries.findIndex(
      ({ node: visibleNode }) => visibleNode.key === node.key,
    );
    const expanded = keyIncludes(activeExpandedKeys, node.key);
    const hasChildren =
      Boolean(node.children?.length) || (Boolean(loadData) && node.isLeaf !== true);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusNode(
        visibleEntries[Math.min(visibleEntries.length - 1, visibleIndex + 1)]
          ?.node.key,
      );
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusNode(visibleEntries[Math.max(0, visibleIndex - 1)]?.node.key);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      focusNode(visibleEntries[0]?.node.key);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      focusNode(visibleEntries.at(-1)?.node.key);
      return;
    }
    if (event.key === "ArrowRight" && hasChildren) {
      event.preventDefault();
      if (!expanded) setExpanded(node, true);
      else focusNode(node.children?.[0]?.key);
      return;
    }
    if (event.key === "ArrowLeft") {
      if (expanded && hasChildren) {
        event.preventDefault();
        setExpanded(node, false);
      } else if (parentKey !== undefined) {
        event.preventDefault();
        focusNode(parentKey);
      }
      return;
    }
    if (
      event.key === " " &&
      checkable &&
      node.checkable !== false &&
      !node.disableCheckbox
    ) {
      event.preventDefault();
      setChecked(node, !keyIncludes(conductedCheckedKeys, node.key), event);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectNode(node, event);
    }
  };

  const renderNodes = (
    nodes: readonly TreeNode[],
    parentKey?: Key,
    level = 1,
  ): ReactNode => (
    <ul
      role={level === 1 ? "none" : "group"}
      data-slot={level === 1 ? "tree-list" : "tree-group"}
      className={cn(
        "m-0 flex list-none flex-col gap-0 p-0",
        level > 1 && (showLine ? "ml-3 border-l pl-3" : "pl-6"),
        level > 1 && semanticClassNames.group,
      )}
      style={level > 1 ? semanticStyles.group : undefined}
    >
      {nodes.map((node, index) => {
        const entry: TreeEntry = { node, parentKey, level, index };
        const nodeDisabled = disabled || Boolean(node.disabled);
        const expanded = keyIncludes(activeExpandedKeys, node.key);
        const selected = keyIncludes(activeSelectedKeys, node.key);
        const checked = keyIncludes(conductedCheckedKeys, node.key);
        const halfChecked = keyIncludes(halfCheckedKeys, node.key);
        const loading = keyIncludes(loadingKeys, node.key);
        const hasChildren =
          Boolean(node.children?.length) ||
          (Boolean(loadData) && node.isLeaf !== true);
        const nodeInfo: TreeNodeRenderInfo = {
          node,
          expanded,
          selected,
          checked,
          halfChecked,
          loading,
          disabled: nodeDisabled,
        };
        const resolvedIcon = showIcon
          ? resolveNodeIcon(node.icon ?? icon, nodeInfo)
          : null;
        const title = titleRender ? titleRender(node) : node.title;
        const matched = Boolean(filterTreeNode?.(node));
        const tabbable =
          focusKey === undefined ? node.key === initialFocusKey : node.key === focusKey;
        const nodeTitleId = titleId(node.key, level, index);

        return (
          <li key={node.key} role="none" className="min-w-0">
            <div
              role="treeitem"
              tabIndex={tabbable ? 0 : -1}
              data-tree-key={keyToken(node.key)}
              data-slot="tree-item"
              data-selected={selected || undefined}
              data-filter-match={matched || undefined}
              aria-expanded={hasChildren ? expanded : undefined}
              aria-selected={
                selectable && node.selectable !== false ? selected : undefined
              }
              aria-checked={
                checkable && node.checkable !== false
                  ? halfChecked
                    ? "mixed"
                    : checked
                  : undefined
              }
              aria-disabled={nodeDisabled || undefined}
              aria-busy={loading || undefined}
              aria-level={level}
              aria-posinset={index + 1}
              aria-setsize={nodes.length}
              onFocus={() => setFocusKey(node.key)}
              onClick={(event) => selectNode(node, event)}
              onKeyDown={(event) => handleKeyDown(event, entry)}
              className={cn(
                "flex min-w-0 items-center gap-1 rounded-md px-1 py-0.5 text-sm outline-none transition-colors",
                blockNode ? "w-full" : "w-fit max-w-full",
                !nodeDisabled &&
                  "hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
                selected && "bg-accent text-accent-foreground",
                matched && "font-medium",
                nodeDisabled && "cursor-not-allowed opacity-50",
                semanticClassNames.item,
              )}
              style={semanticStyles.item}
            >
              {hasChildren ? (
                <Button
                  variant="text"
                  shape="circle"
                  size="small"
                  tabIndex={-1}
                  aria-label={expanded ? "Collapse" : "Expand"}
                  aria-expanded={expanded}
                  disabled={nodeDisabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    setExpanded(node, !expanded);
                  }}
                  className={cn(
                    "size-6 min-h-0 shrink-0 p-0",
                    semanticClassNames.switcher,
                  )}
                  style={semanticStyles.switcher}
                >
                  {loading
                    ? switcherLoadingIcon ?? <Spinner />
                    : resolveSwitcherIcon(switcherIcon, nodeInfo)}
                </Button>
              ) : (
                <span
                  aria-hidden="true"
                  data-slot="tree-switcher-placeholder"
                  className={cn(
                    "size-6 shrink-0",
                    semanticClassNames.switcher,
                  )}
                  style={semanticStyles.switcher}
                />
              )}

              {checkable && node.checkable !== false ? (
                <input
                  ref={(input) => {
                    if (input) input.indeterminate = halfChecked;
                  }}
                  type="checkbox"
                  tabIndex={-1}
                  checked={checked}
                  disabled={nodeDisabled || node.disableCheckbox}
                  aria-labelledby={nodeTitleId}
                  aria-checked={halfChecked ? "mixed" : checked}
                  data-indeterminate={halfChecked || undefined}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => {
                    event.stopPropagation();
                    setChecked(node, event.currentTarget.checked, event);
                  }}
                  className={cn(
                    "size-4 shrink-0 accent-primary",
                    semanticClassNames.checkbox,
                  )}
                  style={semanticStyles.checkbox}
                />
              ) : null}

              {resolvedIcon ? (
                <span
                  data-slot="tree-icon"
                  aria-hidden="true"
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center",
                    semanticClassNames.icon,
                  )}
                  style={semanticStyles.icon}
                >
                  {resolvedIcon}
                </span>
              ) : null}

              <span
                id={nodeTitleId}
                data-slot="tree-title"
                className={cn(
                  "min-w-0 break-words",
                  semanticClassNames.title,
                )}
                style={semanticStyles.title}
              >
                {title}
              </span>
            </div>

            {expanded && node.children?.length
              ? renderNodes(node.children, node.key, level + 1)
              : null}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div
      {...props}
      ref={setRootRef}
      role="tree"
      aria-multiselectable={multiple || undefined}
      aria-disabled={disabled || undefined}
      data-slot="tree"
      data-checkable={checkable || undefined}
      data-show-line={showLine || undefined}
      className={cn("min-w-0", semanticClassNames.root, className)}
      style={{ ...semanticStyles.root, ...style }}
    >
      {renderNodes(treeData)}
    </div>
  );
}
