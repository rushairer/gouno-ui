import { useComponentLocale } from "./config-provider";
import type { SelectLocale } from "./locale";
import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "../components/primitives/popover";
import { cn } from "../lib/utils";
import { controlSizeClass, type ControlSize } from "./control-types";

export type SelectMode = "single" | "multiple" | "tags";
export interface SelectOption { value: string; label: React.ReactNode; disabled?: boolean; }
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "value" | "defaultValue" | "onChange" | "multiple"> {
  locale?: Partial<SelectLocale>;
  size?: ControlSize;
  status?: "error" | "warning";
  loading?: boolean;
  placeholder?: string;
  allowClear?: boolean;
  onClear?: () => void;
  mode?: SelectMode;
  showSearch?: boolean;
  optionFilterProp?: "label" | "value";
  maxTagCount?: number;
  value?: string | readonly string[];
  defaultValue?: string | readonly string[];
  onChange?: (value: string | string[], option: SelectOption | SelectOption[]) => void;
  onSearch?: (value: string) => void;
}

function readOptions(children: React.ReactNode): SelectOption[] {
  const options: SelectOption[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const childProps = child.props as { children?: React.ReactNode; value?: unknown; disabled?: boolean };
    if (child.type === React.Fragment) { options.push(...readOptions(childProps.children)); return; }
    if (typeof child.type === "string" && child.type === "option") {
      options.push({ value: String(childProps.value ?? childProps.children ?? ""), label: childProps.children, disabled: childProps.disabled });
      return;
    }
    if (typeof child.type === "string" && child.type === "optgroup") options.push(...readOptions(childProps.children));
  });
  return options;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { locale, size = "middle", status, loading = false, placeholder, allowClear = false, onClear, mode = "single", showSearch = false, optionFilterProp = "label", maxTagCount, value, defaultValue, onChange, onSearch, name, id, required, disabled, children, className, ...props },
  ref,
) {
  const text = useComponentLocale("select", locale);
  const generatedId = React.useId();
  const baseId = id ?? `select-${generatedId}`;
  const listboxId = `${baseId}-listbox`;
  const searchRef = React.useRef<HTMLInputElement>(null);
  const searchable = showSearch || mode === "tags";
  const options = React.useMemo(() => readOptions(children), [children]);
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const initial = defaultValue === undefined ? (mode === "single" ? "" : []) : defaultValue;
  const [innerValue, setInnerValue] = React.useState<string | readonly string[]>(initial);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  React.useImperativeHandle(ref, () => selectRef.current!);
  const selected = value === undefined ? innerValue : value;
  const selectedValues = Array.isArray(selected) ? [...selected] : selected ? [selected] : [];
  const selectedOptions: SelectOption[] = selectedValues.map((item) => options.find((option) => option.value === item) ?? { value: item, label: item });
  const filteredOptions = options.filter((option) => {
    if (!search) return true;
    const target = optionFilterProp === "value" ? option.value : String(option.label ?? "");
    return target.toLowerCase().includes(search.toLowerCase());
  });
  React.useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(0, filteredOptions.length - 1)));
  }, [search, filteredOptions.length]);
  const moveActive = (direction: 1 | -1) => {
    if (!filteredOptions.length) return;
    setActiveIndex((current) => {
      for (let offset = 1; offset <= filteredOptions.length; offset += 1) {
        const next = (current + direction * offset + filteredOptions.length) % filteredOptions.length;
        if (!filteredOptions[next].disabled) return next;
      }
      return current;
    });
  };
  const multi = mode !== "single";
  const commit = (next: string | string[], option: SelectOption | SelectOption[]) => { if (value === undefined) setInnerValue(next); onChange?.(next, option); };
  const choose = (option: SelectOption) => {
    if (option.disabled || loading || disabled) return;
    if (multi) {
      const next = selectedValues.includes(option.value) ? selectedValues.filter((item) => item !== option.value) : [...selectedValues, option.value];
      commit(next, next.map((item) => options.find((entry) => entry.value === item) ?? { value: item, label: item }));
      if (mode === "multiple") setSearch("");
      return;
    }
    commit(option.value, option); setOpen(false); setSearch("");
  };
  const clear = () => { if (disabled || loading) return; commit(multi ? [] : "", []); onClear?.(); setSearch(""); setOpen(false); triggerRef.current?.focus(); };
  const addTag = () => { const trimmed = search.trim(); if (!trimmed || selectedValues.includes(trimmed)) return; const option = { value: trimmed, label: trimmed }; commit([...selectedValues, trimmed], [...selectedOptions, option]); setSearch(""); };
  const hasValue = selectedValues.length > 0;
  const canClear = allowClear && hasValue && !disabled && !loading;
  const display = multi ? null : selectedOptions[0]?.label;
  const hiddenValue = multi ? selectedValues : selectedValues[0] ?? "";
  const activeOptionId = open && filteredOptions[activeIndex] ? `${baseId}-option-${activeIndex}` : undefined;
  const remove = (option: SelectOption) => {
    if (disabled || loading || option.disabled) return;
    commit(selectedValues.filter((item) => item !== option.value), selectedOptions.filter((item) => item.value !== option.value));
    triggerRef.current?.focus();
  };
  const selectActive = () => { const option = filteredOptions[activeIndex]; if (option) choose(option); };
  const resolvedPlaceholder = placeholder ?? text.placeholder;
  return <div className="relative min-w-0" data-slot="select">
    <select {...props} id={id} name={name} required={required} disabled={disabled || loading} multiple={multi} value={hiddenValue} onChange={() => undefined} ref={selectRef} aria-hidden="true" tabIndex={-1} className="pointer-events-none absolute inset-0 h-full w-full opacity-0">{children}{selectedValues.filter((item) => !options.some((option) => option.value === item)).map((item) => <option key={item} value={item}>{item}</option>)}</select>
    <Popover open={open} onOpenChange={(next) => { if (!disabled && !loading) setOpen(next); }}>
      <PopoverAnchor asChild>
        <div data-slot="select-control" className={cn("flex w-full min-w-0 items-center gap-2 rounded-md border border-border bg-input px-3 text-foreground focus-within:ring-2 focus-within:ring-ring", controlSizeClass(size), multi && "h-auto min-h-9 py-1", status === "error" && "border-destructive focus-within:ring-destructive", status === "warning" && "border-warning focus-within:ring-warning", (disabled || loading) && "cursor-not-allowed opacity-50", className)}>
          {multi && hasValue ? <div className="flex min-w-0 flex-1 flex-wrap gap-1" data-slot="select-tags">
            {selectedOptions.slice(0, maxTagCount).map((option) => <span key={option.value} className="inline-flex max-w-full items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-xs">
              <span className="truncate">{option.label}</span>
              <button type="button" disabled={disabled || loading || option.disabled} aria-label={text.removeLabel(typeof option.label === "string" || typeof option.label === "number" ? String(option.label) : option.value)} className="shrink-0 rounded outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none" onClick={() => remove(option)}><X aria-hidden="true" className="size-3" /></button>
            </span>)}
            {maxTagCount !== undefined && selectedOptions.length > maxTagCount ? <span className="text-xs text-muted-foreground">+{selectedOptions.length - maxTagCount}</span> : null}
          </div> : null}
          <PopoverTrigger asChild>
            <button ref={triggerRef} type="button" id={`${baseId}-trigger`} role="combobox" aria-haspopup="listbox" aria-label={props["aria-label"]} aria-labelledby={props["aria-labelledby"]} aria-describedby={props["aria-describedby"]} aria-expanded={open} aria-controls={listboxId} aria-activedescendant={!searchable ? activeOptionId : undefined} aria-invalid={status === "error" || props["aria-invalid"] || undefined} aria-busy={loading || undefined} disabled={disabled || loading}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); if (!open) setOpen(true); else moveActive(event.key === "ArrowDown" ? 1 : -1); }
                else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); if (open) selectActive(); else setOpen(true); }
                else if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false); }
              }}
              className={cn("flex min-w-0 items-center gap-2 self-stretch text-left outline-none disabled:cursor-not-allowed", multi && hasValue ? "shrink-0" : "flex-1")}>
              <span className={cn("min-w-0 flex-1 truncate", !hasValue && "text-muted-foreground", multi && hasValue && "sr-only")}>{multi && hasValue ? selectedOptions.map((option) => typeof option.label === "string" ? option.label : option.value).join(", ") : display ?? resolvedPlaceholder}</span>
              <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          {canClear ? <button type="button" aria-label={text.clearLabel} className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring" onClick={clear}><X aria-hidden="true" className="size-3.5" /></button> : null}
        </div>
      </PopoverAnchor>
      <PopoverContent role="presentation" placement="bottom-start" className="w-[var(--radix-popover-trigger-width)] min-w-48 p-1" onOpenAutoFocus={(event) => { event.preventDefault(); if (searchable) searchRef.current?.focus(); else triggerRef.current?.focus(); }} onCloseAutoFocus={(event) => { event.preventDefault(); triggerRef.current?.focus(); }}>
        {searchable ? <div className="p-1"><input ref={searchRef} role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={listboxId} aria-activedescendant={activeOptionId} value={search} onChange={(event) => { setSearch(event.target.value); setActiveIndex(0); onSearch?.(event.target.value); }} onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); moveActive(event.key === "ArrowDown" ? 1 : -1); }
          else if (event.key === "Enter") { event.preventDefault(); if (mode === "tags" && search.trim() && !filteredOptions.length) addTag(); else selectActive(); }
          else if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
        }} placeholder={text.searchPlaceholder} aria-label={text.searchLabel} className="h-8 w-full rounded border border-border bg-input px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div> : null}
        <div id={listboxId} role="listbox" aria-label={props["aria-label"] ?? text.searchLabel} aria-labelledby={props["aria-labelledby"]} aria-multiselectable={multi || undefined} className="max-h-60 overflow-y-auto" data-slot="select-list">
          {filteredOptions.map((option, optionIndex) => { const checked = selectedValues.includes(option.value); const active = optionIndex === activeIndex; return <div key={option.value} id={`${baseId}-option-${optionIndex}`} role="option" aria-selected={checked} aria-disabled={option.disabled || undefined} onMouseDown={(event) => event.preventDefault()} onMouseEnter={() => { if (!option.disabled) setActiveIndex(optionIndex); }} onClick={() => choose(option)} className={cn("flex w-full cursor-default items-center gap-2 rounded px-2 py-1.5 text-left text-sm", !option.disabled && "hover:bg-accent", option.disabled && "opacity-50", active && "bg-accent", checked && "bg-accent/60")}>{multi ? <span className={cn("flex size-4 items-center justify-center rounded border", checked && "border-primary bg-primary text-primary-foreground")}>{checked ? <Check aria-hidden="true" className="size-3" /> : null}</span> : null}<span className="min-w-0 flex-1 truncate">{option.label}</span></div>; })}
        </div>
        {filteredOptions.length === 0 ? <div role="status" className="px-2 py-3 text-center text-sm text-muted-foreground">{text.emptyText}</div> : null}
      </PopoverContent>
    </Popover>
  </div>;
});
