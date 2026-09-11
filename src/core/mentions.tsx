import {
  forwardRef,
  useId,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "../lib/utils";
import { Textarea, type TextareaProps } from "./textarea";

export interface MentionsProps extends Omit<
  TextareaProps,
  | "value"
  | "defaultValue"
  | "onChange"
  | "onSelect"
  | "role"
  | "aria-autocomplete"
  | "aria-controls"
  | "aria-activedescendant"
  | "aria-haspopup"
  | "aria-expanded"
> {
  options: readonly string[];
  prefix?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
}

type ActiveMention = {
  start: number;
  query: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findActiveMention(value: string, prefix: string): ActiveMention | null {
  if (!prefix) return null;
  const match = value.match(new RegExp(`${escapeRegExp(prefix)}([^\\s]*)$`, "u"));
  if (!match || match.index === undefined) return null;
  return { start: match.index, query: match[1] ?? "" };
}

export const Mentions = forwardRef<HTMLTextAreaElement, MentionsProps>(
  function Mentions(
    {
      options,
      prefix = "@",
      value,
      defaultValue = "",
      onChange,
      onSelect,
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
    const [focused, setFocused] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [highlighted, setHighlighted] = useState(0);
    const listboxId = useId();
    const current = value ?? inner;
    const activeMention = findActiveMention(current, prefix);
    const query = activeMention?.query.toLocaleLowerCase() ?? "";
    const matches = activeMention
      ? options.filter((option) => option.toLocaleLowerCase().includes(query))
      : [];
    const activeIndex =
      matches.length === 0
        ? -1
        : Math.min(Math.max(highlighted, 0), matches.length - 1);
    const popupOpen =
      focused &&
      !dismissed &&
      Boolean(activeMention) &&
      matches.length > 0 &&
      !disabled &&
      !readOnly;

    const update = (next: string) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    };

    const choose = (option: string) => {
      if (!activeMention || disabled || readOnly) return;
      const next = `${current.slice(0, activeMention.start)}${prefix}${option} `;
      update(next);
      onSelect?.(option);
      setDismissed(true);
      setHighlighted(0);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled || readOnly) return;

      if (event.key === "ArrowDown" && activeMention && matches.length > 0) {
        event.preventDefault();
        if (!popupOpen) {
          setDismissed(false);
          setHighlighted(0);
        } else {
          setHighlighted((activeIndex + 1) % matches.length);
        }
      } else if (
        event.key === "ArrowUp" &&
        focused &&
        activeMention &&
        matches.length > 0
      ) {
        event.preventDefault();
        if (!popupOpen) {
          setDismissed(false);
          setHighlighted(matches.length - 1);
        } else {
          setHighlighted((activeIndex - 1 + matches.length) % matches.length);
        }
      } else if (event.key === "Enter" && popupOpen && activeIndex >= 0) {
        event.preventDefault();
        const option = matches[activeIndex];
        if (option !== undefined) choose(option);
      } else if (event.key === "Escape" && popupOpen) {
        event.preventDefault();
        setDismissed(true);
        setHighlighted(0);
      }
    };

    return (
      <div data-slot="mentions" className="relative min-w-0">
        <Textarea
          {...props}
          ref={ref}
          data-slot="mentions-input"
          value={current}
          disabled={disabled}
          readOnly={readOnly}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls={popupOpen ? listboxId : undefined}
          aria-activedescendant={
            popupOpen && activeIndex >= 0
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          onFocus={(event) => {
            onFocus?.(event);
            if (!event.defaultPrevented && !disabled && !readOnly) {
              setFocused(true);
              setDismissed(false);
              setHighlighted(0);
            }
          }}
          onBlur={(event) => {
            onBlur?.(event);
            setFocused(false);
            setDismissed(false);
            setHighlighted(0);
          }}
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            update(event.target.value);
            setDismissed(false);
            setHighlighted(0);
          }}
          className={cn("min-h-24", className)}
        />
        {popupOpen ? (
          <ul
            id={listboxId}
            role="listbox"
            data-slot="mentions-popup"
            className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-overlay"
          >
            {matches.map((option, index) => (
              <li
                id={`${listboxId}-option-${index}`}
                key={`${option}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                data-slot="mentions-option"
                data-highlighted={index === activeIndex || undefined}
                className={cn(
                  "cursor-pointer rounded px-2 py-1.5 text-sm",
                  index === activeIndex && "bg-accent text-accent-foreground",
                  "hover:bg-accent hover:text-accent-foreground",
                )}
                onMouseEnter={() => setHighlighted(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(option);
                }}
              >
                {prefix}
                {option}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  },
);
