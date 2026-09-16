import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
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

export interface MarkdownEditorInsertOptions {
  replaceSelection?: boolean;
  selectInserted?: boolean;
}

export interface MarkdownEditorRef {
  focus: () => void;
  getSelection: () => MarkdownEditorSelection;
  setSelection: (start: number, end?: number) => void;
  insertText: (text: string, options?: MarkdownEditorInsertOptions) => void;
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
  { command: "link", label: "插入链接", icon: <Link2 /> },
];

type CommandTransform = {
  replaceStart: number;
  replaceEnd: number;
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

function clampSelection(value: string, start: number, end = start): MarkdownEditorSelection {
  const safeStart = Math.max(0, Math.min(start, value.length));
  const safeEnd = Math.max(safeStart, Math.min(end, value.length));
  return {
    start: safeStart,
    end: safeEnd,
    text: value.slice(safeStart, safeEnd),
  };
}

function lineBounds(value: string, start: number, end: number) {
  const replaceStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  const nextBreak = value.indexOf("\n", end);
  const replaceEnd = nextBreak === -1 ? value.length : nextBreak;
  return { replaceStart, replaceEnd };
}

function transformCommand(
  command: MarkdownEditorCommand,
  value: string,
  start: number,
  end: number,
): CommandTransform {
  const selected = value.slice(start, end);

  if (command === "heading" || command === "quote") {
    const { replaceStart, replaceEnd } = lineBounds(value, start, end);
    const block = value.slice(replaceStart, replaceEnd);
    const lines = block.split("\n");
    const nextLines = command === "heading"
      ? lines.map((line) => `## ${line.replace(/^#{1,6}\s+/, "") || "标题"}`)
      : lines.every((line) => line.startsWith("> "))
        ? lines.map((line) => line.slice(2))
        : lines.map((line) => `> ${line}`);
    const nextBlock = nextLines.join("\n");
    const firstPrefix = command === "heading" ? 3 : nextLines[0]?.startsWith("> ") ? 2 : 0;

    return {
      replaceStart,
      replaceEnd,
      value: nextBlock,
      selectionStart: replaceStart + firstPrefix,
      selectionEnd: replaceStart + nextBlock.length,
    };
  }

  if (command === "link") {
    const label = selected || "链接文本";
    const url = "https://example.com";
    const nextValue = `[${label}](${url})`;
    const urlStart = start + label.length + 3;
    return {
      replaceStart: start,
      replaceEnd: end,
      value: nextValue,
      selectionStart: urlStart,
      selectionEnd: urlStart + url.length,
    };
  }

  const meta = {
    bold: { open: "**", close: "**", placeholder: "重点内容" },
    italic: { open: "*", close: "*", placeholder: "强调内容" },
    code: { open: "`", close: "`", placeholder: "code" },
  }[command];
  const body = selected || meta.placeholder;
  const nextValue = `${meta.open}${body}${meta.close}`;

  return {
    replaceStart: start,
    replaceEnd: end,
    value: nextValue,
    selectionStart: start + meta.open.length,
    selectionEnd: start + meta.open.length + body.length,
  };
}

export const MarkdownEditor = forwardRef<MarkdownEditorRef, MarkdownEditorProps>(
  function MarkdownEditor(
    {
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
    },
    ref,
  ) {
    const [internalMode, setInternalMode] = useState<MarkdownEditorMode>(defaultMode);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const activeMode = mode ?? internalMode;

    const changeMode = (next: MarkdownEditorMode) => {
      if (mode === undefined) setInternalMode(next);
      onModeChange?.(next);
    };

    const currentSelection = () => {
      const textarea = textareaRef.current;
      if (!textarea) return clampSelection(value, value.length);
      return clampSelection(
        value,
        textarea.selectionStart ?? value.length,
        textarea.selectionEnd ?? textarea.selectionStart ?? value.length,
      );
    };

    const applySelection = (selection: MarkdownEditorSelection) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(selection.start, selection.end);
      onSelectionChange?.(selection);
    };

    const emitSelection = () => {
      onSelectionChange?.(currentSelection());
    };

    const insertText = (text: string, options: MarkdownEditorInsertOptions = {}) => {
      if (readOnly) return;
      const selection = currentSelection();
      const replaceSelection = options.replaceSelection ?? true;
      const insertionEnd = replaceSelection ? selection.end : selection.start;
      const next = `${value.slice(0, selection.start)}${text}${value.slice(insertionEnd)}`;
      onChange(next);

      queueMicrotask(() => {
        const nextStart = options.selectInserted ? selection.start : selection.start + text.length;
        const nextEnd = selection.start + text.length;
        applySelection(clampSelection(next, nextStart, nextEnd));
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        focus: () => textareaRef.current?.focus(),
        getSelection: currentSelection,
        setSelection: (start, end = start) => applySelection(clampSelection(value, start, end)),
        insertText,
      }),
    );

    const runCommand = (command: MarkdownEditorCommand) => {
      const textarea = textareaRef.current;
      if (!textarea || readOnly) return;

      const start = textarea.selectionStart ?? 0;
      const end = textarea.selectionEnd ?? start;
      const transformed = transformCommand(command, value, start, end);
      const next = `${value.slice(0, transformed.replaceStart)}${transformed.value}${value.slice(transformed.replaceEnd)}`;
      onChange(next);

      queueMicrotask(() => {
        applySelection(clampSelection(next, transformed.selectionStart, transformed.selectionEnd));
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
                  onMouseDown={(event) => event.preventDefault()}
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
                className={nextMode === "split" ? "hidden md:inline-flex" : undefined}
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
          <div className="grid min-w-0 divide-y md:grid-cols-2 md:divide-x md:divide-y-0" data-slot="markdown-editor-split">
            <div className="min-w-0 p-1">{editor}</div>
            {preview}
          </div>
        ) : null}
      </div>
    );
  },
);
