import { useId, type HTMLAttributes, type ReactNode } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { Button } from "../core/button";
import { Checkbox, Radio } from "../core/selection-controls";
import { cn } from "../lib/utils";

export interface AISuggestionOption {
  value: string;
  description?: ReactNode;
  monospace?: boolean;
}

export interface AISuggestionPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  heading?: ReactNode;
  description?: ReactNode;
  groupLabel?: string;
  options: readonly AISuggestionOption[];
  value: string | null;
  onValueChange: (value: string) => void;
  onApply: (value: string) => void;
  onDismiss?: () => void;
  onRegenerate?: () => void;
  applyLabel?: string;
}

export interface AISuggestionReviewItem {
  key: string;
  label: string;
  value: ReactNode;
  monospace?: boolean;
}

export interface AISuggestionReviewProps extends HTMLAttributes<HTMLDivElement> {
  heading?: ReactNode;
  description?: ReactNode;
  groupLabel?: string;
  items: readonly AISuggestionReviewItem[];
  selectedKeys: readonly string[];
  onSelectedKeysChange: (keys: string[]) => void;
  onApply: () => void;
  onCancel?: () => void;
  onRegenerate?: () => void;
}

function SuggestionHeader({
  heading,
  description,
  countLabel,
  onRegenerate,
}: {
  heading: ReactNode;
  description?: ReactNode;
  countLabel: ReactNode;
  onRegenerate?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles aria-hidden="true" className="size-4 text-primary" />
          <span>{heading}</span>
        </div>
        <div className="mt-1 text-xs leading-5 text-muted-foreground">
          {description ?? countLabel}
        </div>
      </div>
      {onRegenerate ? (
        <Button
          type="button"
          size="small"
          variant="text"
          icon={<RefreshCw />}
          onClick={onRegenerate}
        >
          重新生成
        </Button>
      ) : null}
    </div>
  );
}

export function AISuggestionPicker({
  heading = "AI 建议",
  description,
  groupLabel = "AI 建议候选",
  options,
  value,
  onValueChange,
  onApply,
  onDismiss,
  onRegenerate,
  applyLabel = "使用所选",
  className,
  ...props
}: AISuggestionPickerProps) {
  const name = useId();

  return (
    <div
      {...props}
      data-slot="ai-suggestion-picker"
      className={cn("rounded-lg border bg-muted/20 p-3", className)}
    >
      <SuggestionHeader
        heading={heading}
        description={description}
        countLabel={`${options.length} 个候选，选择后统一应用。`}
        onRegenerate={onRegenerate}
      />

      <div
        className="mt-3 overflow-hidden rounded-md border bg-background"
        role="radiogroup"
        aria-label={groupLabel}
        data-slot="ai-suggestion-list"
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                "grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-start gap-3 border-b px-3 py-2.5 text-sm last:border-b-0",
                "transition-colors hover:bg-muted/40",
                selected && "bg-primary/[0.06]",
              )}
              data-selected={selected ? "true" : "false"}
            >
              <Radio
                className="mt-0.5"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onValueChange(option.value)}
                aria-label={option.value}
              />
              <span className="min-w-0">
                <span
                  className={cn(
                    "block whitespace-normal break-words leading-5 text-foreground",
                    option.monospace && "break-all font-mono text-xs",
                  )}
                >
                  {option.value}
                </span>
                {option.description ? (
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        {onDismiss ? (
          <Button type="button" size="small" variant="text" onClick={onDismiss}>
            取消
          </Button>
        ) : null}
        <Button
          type="button"
          size="small"
          variant="solid"
          color="primary"
          disabled={!value}
          onClick={() => value && onApply(value)}
        >
          {applyLabel}
        </Button>
      </div>
    </div>
  );
}

export function AISuggestionReview({
  heading = "AI 建议",
  description,
  groupLabel = "AI 建议选择",
  items,
  selectedKeys,
  onSelectedKeysChange,
  onApply,
  onCancel,
  onRegenerate,
  className,
  ...props
}: AISuggestionReviewProps) {
  const selected = new Set(selectedKeys);
  const toggle = (key: string, checked: boolean) => {
    onSelectedKeysChange(
      checked
        ? [...selectedKeys, key].filter(
            (candidate, index, all) => all.indexOf(candidate) === index,
          )
        : selectedKeys.filter((candidate) => candidate !== key),
    );
  };

  return (
    <div
      {...props}
      data-slot="ai-suggestion-review"
      className={cn("rounded-lg border bg-muted/20 p-3", className)}
    >
      <SuggestionHeader
        heading={heading}
        description={description}
        countLabel={`${selectedKeys.length}/${items.length} 项建议已选择。`}
        onRegenerate={onRegenerate}
      />

      <div
        className="mt-3 overflow-hidden rounded-md border bg-background"
        role="group"
        aria-label={groupLabel}
        data-slot="ai-suggestion-review-list"
      >
        {items.map((item) => {
          const checked = selected.has(item.key);
          return (
            <label
              key={item.key}
              className={cn(
                "grid cursor-pointer grid-cols-[auto_5rem_minmax(0,1fr)] items-start gap-2 border-b px-3 py-2.5 text-xs last:border-b-0",
                "transition-colors hover:bg-muted/40",
                checked && "bg-primary/[0.04]",
              )}
            >
              <Checkbox
                className="mt-0.5"
                checked={checked}
                onChange={(event) => toggle(item.key, event.target.checked)}
                aria-label={`应用 ${item.label} 建议`}
              />
              <span className="font-medium text-muted-foreground">{item.label}</span>
              <span
                className={cn(
                  "min-w-0 break-words text-foreground",
                  item.monospace && "break-all font-mono",
                )}
              >
                {item.value}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        {onCancel ? (
          <Button type="button" size="small" variant="text" onClick={onCancel}>
            取消
          </Button>
        ) : null}
        <Button
          type="button"
          size="small"
          variant="solid"
          color="primary"
          disabled={selectedKeys.length === 0}
          onClick={onApply}
        >
          应用 {selectedKeys.length} 项建议
        </Button>
      </div>
    </div>
  );
}
