import { useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { Bold, Code2, Heading2, Italic, Link2, Quote } from "lucide-react";
import { Button } from "../core/button";
import { Textarea } from "../core/textarea";
import { cn } from "../lib/utils";

export type MarkdownEditorMode = "edit" | "split" | "preview";
export type MarkdownEditorCommand = "heading" | "bold" | "italic" | "quote" | "code" | "link";

export interface MarkdownEditorSelection {
  start: number;
  end: number;
  text: string;
}

export interface MarkdownEditorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  mode?: MarkdownEditorMode;
  defaultMode?: MarkdownEditorMode;
  onModeChange?: (mode: MarkdownEditorMode) => void;
  onSelectionChange?: (selection: MarkdownEditorSelection) => void;
  renderPreview?: (value: string) => ReactNode;
  toolbarActions?: ReactNode;
  placeholder?: string;
  readOnly?: boolean;
  textareaAriaLabel?: string;
  previewAriaLabel?: string;
  editorClassName?: string;
}

const modeLabels: Record<MarkdownEditorMode, string> = {
  edit: "编辑",
  split: "分屏",
  preview: "预览",
};

const commandMeta: readonly {
  command: MarkdownEditorCommand;
  label: string;
  icon: ReactNode;
}[] = [
  { command: "heading", label: "二级标题", icon: <Heading2 /> },
  { command: "bold", label: "加粗", icon: <Bold /> },
  { command: "italic", label: "斜体", icon: <Italic /> },
  { command: "quote", label: "引用", icon: <Quote /> },
  { command: "code", label: "行内代码", icon: <Code2 /> },
  { command: "link", label: "链接", icon: <Link2 /> },
];

function transformSelection(command: MarkdownEditorCommand, selected: string) {
  switch (command) {
    case "heading":
      return { value: `## ${selected || "标题"}`, offset: 3, suffixLength: 0 };
    case "bold":
      return { value: `**${selected || "重点内容"}**`, offset: 2, suffixLength: 2 };
    case "italic":
      return { value: `*${selected || "强调内容"}*`, offset: 1, suffixLength: 1 };
    case "quote":
      return { value: `> ${selected || "引用内容"}`, offset: 2, suffixLength: 0 };
    case "code":
      return { value: `\`${selected || "code"}\``, offset: 1, suffixLength: 1 };
    case "link":
      return { value: `[${selected || "链接文本"}](https://)`, offset: 1, suffixLength: 11 };
  }
}

export function MarkdownEditor({
  value,
  onChange,
  mode,
  defaultMode = "edit",
  onModeChange,
  onSelectionChange,
  renderPreview,
  toolbarActions,
  placeholder = "输入 Markdown 内容…",
  readOnly = false,
  textareaAriaLabel = "Markdown 正文",
  previewAriaLabel = "Markdown 预览",
  editorClassName,
  className,
  ...props
}: MarkdownEditorProps) {
  const [internalMode, setInternalMode] = useState<MarkdownEditorMode>(defaultMode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeMode = mode ?? internalMode;

  const changeMode = (next: MarkdownEditorMode) => {
    if (mode === undefined) setInternalMode(next);
    onModeChange?.(next);
  };

  const emitSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;
    onSelectionChange?.({ start, end, text: value.slice(start, end) });
  };

  const runCommand = (command: MarkdownEditorCommand) => {
    const textarea = textareaRef.current;
    if (!textarea || readOnly) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;
    const transformed = transformSelection(command, value.slice(start, end));
    const next = `${value.slice(0, start)}${transformed.value}${value.slice(end)}`;
    onChange(next);

    queueMicrotask(() => {
      const target = textareaRef.current;
      if (!target) return;
      const selectionStart = start + transformed.offset;
      const selectionEnd = start + transformed.value.length - transformed.suffixLength;
      target.focus();
      target.setSelectionRange(selectionStart, selectionEnd);
      onSelectionChange?.({
        start: selectionStart,
        end: selectionEnd,
        text: next.slice(selectionStart, selectionEnd),
      });
    });
  };

  const editor = (
    <Textarea
      ref={textareaRef}
      aria-label={textareaAriaLabel}
      className={cn("min-h-[30rem] resize-y border-0 font-mono shadow-none focus-visible:ring-0", editorClassName)}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onSelect={emitSelection}
      onKeyUp={emitSelection}
      placeholder={placeholder}
      disabled={readOnly}
      readOnly={readOnly}
    />
  );

  const preview = (
    <div
      aria-label={previewAriaLabel}
      className="min-h-[30rem] min-w-0 overflow-auto p-5 text-sm leading-7"
      data-slot="markdown-editor-preview"
    >
      {renderPreview ? (
        renderPreview(value)
      ) : (
        <pre className="whitespace-pre-wrap font-sans text-sm leading-7">{value || "开始写作后，预览会出现在这里。"}</pre>
      )}
    </div>
  );

  return (
    <div
      {...props}
      className={cn("min-w-0 overflow-hidden rounded-lg border bg-background", className)}
      data-slot="markdown-editor"
      data-mode={activeMode}
    >
      <div
        className="flex min-h-11 flex-wrap items-center gap-1 border-b bg-muted/20 px-2 py-1.5"
        role="toolbar"
        aria-label="Markdown 编辑工具栏"
        data-slot="markdown-editor-toolbar"
      >
        {!readOnly && activeMode !== "preview" ? (
          <div className="flex flex-wrap items-center gap-0.5" aria-label="Markdown 格式工具">
            {commandMeta.map((item) => (
              <Button
                key={item.command}
                type="button"
                size="small"
                variant="text"
                icon={item.icon}
                aria-label={item.label}
                title={item.label}
                onClick={() => runCommand(item.command)}
              >
                <span className="sr-only">{item.label}</span>
              </Button>
            ))}
          </div>
        ) : null}

        {toolbarActions ? (
          <div className="ml-1 flex flex-wrap items-center gap-1 border-l pl-2" data-slot="markdown-editor-actions">
            {toolbarActions}
          </div>
        ) : null}

        <div className="ml-auto flex items-center gap-0.5 rounded-md bg-muted/60 p-0.5" aria-label="编辑器视图">
          {(["edit", "split", "preview"] as const).map((nextMode) => (
            <Button
              key={nextMode}
              type="button"
              size="small"
              variant={activeMode === nextMode ? "solid" : "text"}
              color={activeMode === nextMode ? "primary" : undefined}
              aria-pressed={activeMode === nextMode}
              onClick={() => changeMode(nextMode)}
            >
              {modeLabels[nextMode]}
            </Button>
          ))}
        </div>
      </div>

      {activeMode === "preview" ? preview : null}
      {activeMode === "edit" ? <div className="min-w-0 p-1">{editor}</div> : null}
      {activeMode === "split" ? (
        <div className="grid min-w-0 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0" data-slot="markdown-editor-split">
          <div className="min-w-0 p-1">{editor}</div>
          {preview}
        </div>
      ) : null}
    </div>
  );
}
