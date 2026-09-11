import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Input as PrimitiveInput } from "../components/primitives/input";
import { cn } from "../lib/utils";
import { controlSizeClass, type ControlSize } from "./control-types";

type AutoCompleteOption =
  | string
  | {
      value: string;
      label?: string;
      disabled?: boolean;
    };

type NormalizedAutoCompleteOption = {
  value: string;
  label: string;
  disabled: boolean;
};

export interface AutoCompleteProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "size"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onSelect"
  | "role"
  | "aria-expanded"
  | "aria-controls"
  | "aria-activedescendant"
  | "aria-autocomplete"
> {
  options: readonly AutoCompleteOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: string, option: NormalizedAutoCompleteOption) => void;
  emptyText?: ReactNode;
  size?: ControlSize;
  status?: "error" | "warning";
}

function normalizeOptions(
  options: readonly AutoCompleteOption[],
): NormalizedAutoCompleteOption[] {
  return options.map((option) =>
    typeof option === "string"
      ? { value: option, label: option, disabled: false }
      : {
          value: option.value,
          label: option.label ?? option.value,
          disabled: option.disabled ?? false,
        },
  );
}

function filterOptions(
  options: readonly NormalizedAutoCompleteOption[],
  input: string,
) {
  const query = input.toLocaleLowerCase();
  return options.filter(
    (option) =>
      option.value.toLocaleLowerCase().includes(query) ||
      option.label.toLocaleLowerCase().includes(query),
  );
}

function firstEnabledIndex(options: readonly NormalizedAutoCompleteOption[]) {
  return options.findIndex((option) => !option.disabled);
}

function lastEnabledIndex(options: readonly NormalizedAutoCompleteOption[]) {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) return index;
  }
  return -1;
}

function moveEnabledIndex(
  options: readonly NormalizedAutoCompleteOption[],
  current: number,
  delta: 1 | -1,
) {
  if (options.length === 0) return -1;
  let index = current;
  for (let offset = 0; offset < options.length; offset += 1) {
    index = (index + delta + options.length) % options.length;
    if (!options[index]?.disabled) return index;
  }
  return -1;
}

export const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>(
  function AutoComplete(
    {
      options,
      value,
      defaultValue = "",
      onChange,
      onSelect,
      emptyText,
      size = "middle",
      status,
      className,
      disabled,
      readOnly,
      onFocus,
      onBlur,
      onKeyDown,
      ...props
    },
    ref,
  ) {
    const [inner, setInner] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(-1);
    const listboxId = useId();
    const current = value ?? inner;
    const normalized = normalizeOptions(options);
    const matches = filterOptions(normalized, current);
    const fallbackIndex = firstEnabledIndex(matches);
    const activeIndex =
      highlighted >= 0 &&
      highlighted < matches.length &&
      !matches[highlighted]?.disabled
        ? highlighted
        : fallbackIndex;
    const popupOpen =
      open && !disabled && !readOnly && (matches.length > 0 || emptyText != null);

    const update = (next: string) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    };

    const choose = (option: NormalizedAutoCompleteOption) => {
      if (option.disabled || disabled || readOnly) return;
      update(option.value);
      onSelect?.(option.value, option);
      setOpen(false);
      setHighlighted(-1);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled || readOnly) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlighted(fallbackIndex);
        } else {
          setHighlighted(moveEnabledIndex(matches, activeIndex, 1));
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlighted(lastEnabledIndex(matches));
        } else {
          setHighlighted(moveEnabledIndex(matches, activeIndex, -1));
        }
      } else if (event.key === "Home" && open) {
        event.preventDefault();
        setHighlighted(firstEnabledIndex(matches));
      } else if (event.key === "End" && open) {
        event.preventDefault();
        setHighlighted(lastEnabledIndex(matches));
      } else if (event.key === "Enter" && popupOpen && activeIndex >= 0) {
        event.preventDefault();
        const option = matches[activeIndex];
        if (option) choose(option);
      } else if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        setHighlighted(-1);
      }
    };

    return (
      <div data-slot="auto-complete" className="relative min-w-0">
        <PrimitiveInput
          {...props}
          ref={ref}
          data-slot="auto-complete-input"
          role="combobox"
          aria-expanded={popupOpen}
          aria-controls={popupOpen ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={
            popupOpen && activeIndex >= 0
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          aria-invalid={
            status === "error" ? true : props["aria-invalid"] || undefined
          }
          data-status={status}
          value={current}
          disabled={disabled}
          readOnly={readOnly}
          onFocus={(event) => {
            onFocus?.(event);
            if (!event.defaultPrevented && !disabled && !readOnly) {
              setOpen(true);
              setHighlighted(fallbackIndex);
            }
          }}
          onBlur={(event) => {
            onBlur?.(event);
            setOpen(false);
            setHighlighted(-1);
          }}
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            const next = event.target.value;
            update(next);
            setOpen(true);
            setHighlighted(firstEnabledIndex(filterOptions(normalized, next)));
          }}
          className={cn(
            "bg-input text-foreground placeholder:text-muted-foreground",
            controlSizeClass(size),
            status === "warning" &&
              "border-warning focus-visible:ring-warning/30",
            className,
          )}
        />
        {popupOpen ? (
          <ul
            id={listboxId}
            role="listbox"
            data-slot="auto-complete-popup"
            className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-overlay"
          >
            {matches.length > 0
              ? matches.map((option, index) => (
                  <li
                    id={`${listboxId}-option-${index}`}
                    key={`${option.value}-${index}`}
                    role="option"
                    aria-selected={option.value === current}
                    aria-disabled={option.disabled || undefined}
                    data-slot="auto-complete-option"
                    data-highlighted={index === activeIndex || undefined}
                    className={cn(
                      "cursor-pointer rounded px-2 py-1.5 text-sm",
                      index === activeIndex && "bg-accent text-accent-foreground",
                      option.disabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-accent hover:text-accent-foreground",
                    )}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      choose(option);
                    }}
                  >
                    {option.label}
                  </li>
                ))
              : emptyText != null && (
                  <li
                    role="presentation"
                    data-slot="auto-complete-empty"
                    className="px-2 py-1.5 text-sm text-muted-foreground"
                  >
                    {emptyText}
                  </li>
                )}
          </ul>
        ) : null}
      </div>
    );
  },
);
