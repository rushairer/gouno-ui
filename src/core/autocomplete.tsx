import { useId, useState, type InputHTMLAttributes, type KeyboardEvent } from "react";
import { cn } from "../lib/utils";

export interface AutoCompleteProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  options: readonly string[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  emptyText?: string;
}

export function AutoComplete({ options, value, defaultValue = "", onChange, emptyText = "No options", className, ...props }: AutoCompleteProps) {
  const [inner, setInner] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const id = useId();
  const current = value ?? inner;
  const matches = options.filter((option) => option.toLowerCase().includes(current.toLowerCase()));
  const update = (next: string) => { if (value === undefined) setInner(next); onChange?.(next); };
  const choose = (option: string) => { update(option); setOpen(false); setHighlighted(0); };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); setHighlighted((index) => Math.min(index + 1, Math.max(matches.length - 1, 0))); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setOpen(true); setHighlighted((index) => Math.max(index - 1, 0)); }
    else if (event.key === "Enter" && open && matches[highlighted]) { event.preventDefault(); choose(matches[highlighted]); }
    else if (event.key === "Escape") { setOpen(false); }
  };
  return <div className="relative">
    <input {...props} role="combobox" aria-expanded={open} aria-controls={id} aria-autocomplete="list" aria-activedescendant={open && matches[highlighted] ? `${id}-option-${highlighted}` : undefined} value={current} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 100)} onKeyDown={onKeyDown} onChange={(event) => { update(event.target.value); setHighlighted(0); setOpen(true); }} className={cn("h-9 w-full rounded-md border bg-input px-3 text-sm", className)} />
    {open && <ul id={id} role="listbox" className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">{matches.length ? matches.map((option, index) => <li id={`${id}-option-${index}`} key={option} role="option" aria-selected={option === current} className={cn("cursor-pointer rounded px-2 py-1.5 text-sm hover:bg-accent", index === highlighted && "bg-accent")} onMouseDown={() => choose(option)}>{option}</li>) : <li className="px-2 py-1.5 text-sm text-muted-foreground">{emptyText}</li>}</ul>}
  </div>;
}
