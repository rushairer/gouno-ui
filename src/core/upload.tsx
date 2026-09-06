import { useId, useState, type ChangeEvent, type DragEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "../lib/utils";

export interface UploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "multiple" | "accept" | "value" | "defaultValue"> {
  children?: ReactNode;
  files?: File[];
  defaultFiles?: File[];
  onFiles?: (files: File[]) => void;
  onRemove?: (file: File) => void;
  multiple?: boolean;
  accept?: string;
  maxCount?: number;
  maxSize?: number;
  error?: ReactNode;
  showFileList?: boolean;
  drag?: boolean;
  beforeSelect?: (file: File, files: File[]) => boolean;
  onReject?: (file: File, reason: "type" | "size" | "beforeSelect" | "maxCount") => void;
}

export function Upload({
  children,
  files,
  defaultFiles = [],
  onFiles,
  onRemove,
  multiple = false,
  accept,
  maxCount,
  maxSize,
  disabled,
  error,
  showFileList = true,
  drag = false,
  beforeSelect,
  onReject,
  id,
  className,
  ...props
}: UploadProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [internalFiles, setInternalFiles] = useState<File[]>(defaultFiles);
  const currentFiles = files ?? internalFiles;
  const update = (next: File[]) => {
    if (files === undefined) setInternalFiles(next);
    onFiles?.(next);
  };
  const acceptTokens = accept?.split(",").map((token) => token.trim()).filter(Boolean) ?? [];
  const accepts = (file: File) => acceptTokens.length === 0 || acceptTokens.some((token) => token.startsWith(".") ? file.name.toLowerCase().endsWith(token.toLowerCase()) : token.endsWith("/*") ? file.type.startsWith(token.slice(0, -1)) : file.type === token);
  const select = (incoming: File[]) => {
    const selected = incoming.filter((file) => {
      if (!accepts(file)) { onReject?.(file, "type"); return false; }
      if (maxSize !== undefined && file.size > maxSize) { onReject?.(file, "size"); return false; }
      if (beforeSelect && !beforeSelect(file, incoming)) { onReject?.(file, "beforeSelect"); return false; }
      return true;
    });
    const combined = multiple ? [...currentFiles, ...selected] : selected.slice(0, 1);
    if (maxCount !== undefined && combined.length > maxCount) combined.slice(maxCount).forEach((file) => onReject?.(file, "maxCount"));
    update(maxCount === undefined ? combined : combined.slice(0, maxCount));
  };
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    select(Array.from(event.target.files ?? []));
    event.target.value = "";
  };
  const remove = (file: File) => {
    update(currentFiles.filter((candidate) => candidate !== file));
    onRemove?.(file);
  };
  const descriptionId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn("space-y-3", className)} data-disabled={disabled || undefined}>
      <input
        {...props}
        id={inputId}
        type="file"
        className="sr-only"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={descriptionId}
        onChange={change}
      />
      <label
        htmlFor={inputId}
        onDragOver={drag ? (event) => event.preventDefault() : undefined}
        onDrop={drag ? (event: DragEvent<HTMLLabelElement>) => { event.preventDefault(); if (!disabled) select(Array.from(event.dataTransfer.files)); } : undefined}
        className={cn(
          "inline-flex min-h-9 cursor-pointer items-center rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring",
          drag && "flex min-h-36 w-full flex-col justify-center gap-2 border-dashed text-center",
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
        )}
      >
        {drag ? <UploadCloud aria-hidden="true" className="size-7 text-muted-foreground" /> : null}
        {children ?? (drag ? "点击或拖放文件到这里" : "Choose file")}
      </label>
      {showFileList && currentFiles.length > 0 ? (
        <ul className="space-y-1" aria-label="已选择文件">
          {currentFiles.map((file, index) => (
            <li key={`${file.name}-${file.size}-${index}`} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
              <span className="min-w-0 truncate">{file.name}</span>
              <button type="button" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={`移除 ${file.name}`} disabled={disabled} onClick={() => remove(file)}>
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? <div id={descriptionId} role="alert" className="text-sm text-destructive">{error}</div> : null}
    </div>
  );
}
