import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Button } from "./button";
import { cn } from "../lib/utils";

export interface TransferItem {
  key: string;
  title: ReactNode;
  disabled?: boolean;
}

export interface TransferProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  dataSource: readonly TransferItem[];
  targetKeys?: readonly string[];
  defaultTargetKeys?: readonly string[];
  onChange?: (keys: string[]) => void;
  titles?: readonly [ReactNode, ReactNode];
  operations?: readonly [string, string];
  disabled?: boolean;
}

const compatibilityOperations = ["→", "←"] as const;

export const Transfer = forwardRef<HTMLDivElement, TransferProps>(
  function Transfer(
    {
      dataSource,
      targetKeys,
      defaultTargetKeys = [],
      onChange,
      titles,
      operations = compatibilityOperations,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) {
    const [inner, setInner] = useState<readonly string[]>(defaultTargetKeys);
    const [selected, setSelected] = useState<string[]>([]);
    const sourceLabelId = useId();
    const targetLabelId = useId();
    const current = targetKeys ?? inner;
    const targetKeySet = useMemo(() => new Set(current), [current]);
    const itemByKey = useMemo(
      () => new Map(dataSource.map((item) => [item.key, item])),
      [dataSource],
    );

    const sourceItems = dataSource.filter((item) => !targetKeySet.has(item.key));
    const targetItems = dataSource.filter((item) => targetKeySet.has(item.key));
    const movableSourceKeys = selected.filter((key) => {
      const item = itemByKey.get(key);
      return item && !item.disabled && !targetKeySet.has(key);
    });
    const movableTargetKeys = selected.filter((key) => {
      const item = itemByKey.get(key);
      return item && !item.disabled && targetKeySet.has(key);
    });

    const commit = (keys: string[], movedKeys: readonly string[]) => {
      if (targetKeys === undefined) setInner(keys);
      onChange?.(keys);
      const moved = new Set(movedKeys);
      setSelected((previous) => previous.filter((key) => !moved.has(key)));
    };

    const toggle = (key: string, checked: boolean) => {
      setSelected((previous) =>
        checked
          ? previous.includes(key)
            ? previous
            : [...previous, key]
          : previous.filter((value) => value !== key),
      );
    };

    const renderList = (
      items: readonly TransferItem[],
      side: "source" | "target",
      labelId: string,
      title: ReactNode | undefined,
    ) => {
      const labelled = title !== undefined && title !== null;
      return (
        <div
          role={labelled ? "group" : undefined}
          aria-labelledby={labelled ? labelId : undefined}
          data-slot={`transfer-${side}`}
          className="min-w-0 rounded-md border bg-background"
        >
          {labelled ? (
            <div
              id={labelId}
              data-slot="transfer-title"
              className="border-b px-3 py-2 text-sm font-medium"
            >
              {title}
            </div>
          ) : null}
          <div data-slot="transfer-list" className="max-h-48 overflow-auto p-2">
            {items.map((item) => (
              <label
                key={item.key}
                data-slot="transfer-item"
                className={cn(
                  "flex items-center gap-2 rounded p-1 text-sm",
                  !disabled && !item.disabled && "hover:bg-accent",
                  (disabled || item.disabled) && "opacity-50",
                )}
              >
                <input
                  type="checkbox"
                  disabled={disabled || item.disabled}
                  checked={selected.includes(item.key)}
                  onChange={(event) => toggle(item.key, event.target.checked)}
                />
                <span>{item.title}</span>
              </label>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div
        {...props}
        ref={ref}
        data-slot="transfer"
        data-disabled={disabled || undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          "grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center",
          className,
        )}
      >
        {renderList(sourceItems, "source", sourceLabelId, titles?.[0])}
        <div
          data-slot="transfer-operations"
          className="flex justify-center gap-2 sm:flex-col"
        >
          <Button
            size="small"
            disabled={disabled || movableSourceKeys.length === 0}
            onClick={() =>
              commit(
                [
                  ...current,
                  ...movableSourceKeys.filter((key) => !targetKeySet.has(key)),
                ],
                movableSourceKeys,
              )
            }
          >
            {operations[0]}
          </Button>
          <Button
            size="small"
            disabled={disabled || movableTargetKeys.length === 0}
            onClick={() =>
              commit(
                current.filter((key) => !movableTargetKeys.includes(key)),
                movableTargetKeys,
              )
            }
          >
            {operations[1]}
          </Button>
        </div>
        {renderList(targetItems, "target", targetLabelId, titles?.[1])}
      </div>
    );
  },
);
