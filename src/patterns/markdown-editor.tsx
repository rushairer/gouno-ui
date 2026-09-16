import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  Bold,
  ChevronDown,
  Code2,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  MoreHorizontal,
  Quote,
  Strikethrough,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/primitives/dropdown-menu";
import { Button } from "../core/button";
import { Textarea } from "../core/textarea";
import { cn } from "../lib/utils";

export type MarkdownEditorMode = "edit" | "split" | "preview";
export type MarkdownHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type MarkdownEditorCommand =
  | "heading"
  | "bold"
  | "italic"
  | "strikethrough"
  | "quote"
  | "unordered-list"
  | "ordered-list"
  | "task-list"
  | "code"
  | "code-block"
  | "link"
  | "horizontal-rule";

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
  headingLevels?: readonly MarkdownHeadingLevel[];
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

const defaultHeadingLevels = [2, 3, 4, 5, 6] as const satisfies readonly MarkdownHeadingLevel[];
const headingLevelLabels: Record<MarkdownHeadingLevel, string> = {
  1: "一级标题",
  2: "二级标题",
  3: "三级标题",
  4: "四级标题",
  5: "五级标题",
  6: "六级标题",
};

type CommandItem = {
  command: MarkdownEditorCommand;
  label: string;
  icon: ReactNode;
};

const primaryCommands: readonly CommandItem[] = [
  { command: "bold", label: "加粗", icon: <Bold /> },
  { command: "italic", label: "斜体", icon: <Italic /> },
  { command: "link", label: "插入链接", icon: <Link2 /> },
  { command: "code", label: "行内代码", icon: <Code2 /> },
];

const moreCommands: readonly CommandItem[] = [
  { command: "strikethrough", label: "删除线", icon: <Strikethrough /> },
  { command: "quote", label: "引用", icon: <Quote /> },
  { command: "unordered-list", label: "无序列表", icon: <List /> },
  { command: "ordered-list", label: "有序列表", icon: <ListOrdered /> },
  { command: "task-list", label: "任务列表", icon: <ListChecks /> },
  { command: "code-block", label: "代码块", icon: <Code2 /> },
  { command: "horizontal-rule", label: "分隔线", icon: <Minus /> },
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

function headingLevelAt(value: string, position: number): MarkdownHeadingLevel | null {
  const { replaceStart, replaceEnd } = lineBounds(value, position, position);
  const match = value.slice(replaceStart, replaceEnd).match(/^\s{0,3}(#{1,6})\s+/);
  if (!match) return null;
  return match[1].length as MarkdownHeadingLevel;
}

function stripListPrefix(line: string) {
  return line
    .replace(/^\s*[-*+]\s+\[[ xX]\]\s+/, "")
    .replace(/^\s*[-*+]\s+/, "")
    .replace(/^\s*\d+[.)]\s+/, "");
}

function transformHeading(
  value: string,
  start: number,
  end: number,
  level: MarkdownHeadingLevel | null,
): CommandTransform {
  const { replaceStart, replaceEnd } = lineBounds(value, start, end);
  const block = value.slice(replaceStart, replaceEnd);
  const lines = block.split("\n");
  const prefix = level ? `${"#".repeat(level)} ` : "";
  const nextLines = lines.map((line) => {
    const body = line.replace(/^\s{0,3}#{1,6}\s+/, "");
    if (!level) return body;
    if (!body && lines.length > 1) return "";
    return `${prefix}${body || "标题"}`;
  });
  const nextBlock = nextLines.join("\n");

  return {
    replaceStart,
    replaceEnd,
    value: nextBlock,
    selectionStart: replaceStart + prefix.length,
    selectionEnd: replaceStart + nextBlock.length,
  };
}

function transformLineCommand(
  command: "quote" | "unordered-list" | "ordered-list" | "task-list",
  value: string,
  start: number,
  end: number,
): CommandTransform {
  const { replaceStart, replaceEnd } = lineBounds(value, start, end);
  const block = value.slice(replaceStart, replaceEnd);
  const lines = block.split("\n");
  let nextLines: string[];

  if (command === "quote") {
    nextLines = lines.every((line) => /^>\s?/.test(line))
      ? lines.map((line) => line.replace(/^>\s?/, ""))
      : lines.map((line) => `> ${line}`);
  } else if (command === "unordered-list") {
    nextLines = lines.every(
      (line) => /^\s*[-*+]\s+/.test(line) && !/^\s*[-*+]\s+\[[ xX]\]\s+/.test(line),
    )
      ? lines.map((line) => line.replace(/^\s*[-*+]\s+/, ""))
      : lines.map((line) => `- ${stripListPrefix(line) || "列表项"}`);
  } else if (command === "ordered-list") {
    nextLines = lines.every((line) => /^\s*\d+[.)]\s+/.test(line))
      ? lines.map((line) => line.replace(/^\s*\d+[.)]\s+/, ""))
      : lines.map((line, index) => `${index + 1}. ${stripListPrefix(line) || "列表项"}`);
  } else {
    nextLines = lines.every((line) => /^\s*[-*+]\s+\[[ xX]\]\s+/.test(line))
      ? lines.map((line) => line.replace(/^\s*[-*+]\s+\[[ xX]\]\s+/, ""))
      : lines.map((line) => `- [ ] ${stripListPrefix(line) || "任务项"}`);
  }

  const nextBlock = nextLines.join("\n");
  const firstLine = nextLines[0] ?? "";
  const firstPrefix =
    command === "quote"
      ? firstLine.startsWith("> ")
        ? 2
        : 0
      : command === "ordered-list"
        ? firstLine.match(/^\d+[.)]\s+/)?.[0].length ?? 0
        : command === "task-list"
          ? firstLine.match(/^[-*+]\s+\[[ xX]\]\s+/)?.[0].length ?? 0
          : firstLine.match(/^[-*+]\s+/)?.[0].length ?? 0;

  return {
    replaceStart,
    replaceEnd,
    value: nextBlock,
    selectionStart: replaceStart + firstPrefix,
    selectionEnd: replaceStart + nextBlock.length,
  };
}

function transformCommand(
  command: MarkdownEditorCommand,
  value: string,
  start: number,
  end: number,
): CommandTransform {
  const selected = value.slice(start, end);

  switch (command) {
    case "heading":
      return transformHeading(value, start, end, 2);
    case "quote":
    case "unordered-list":
    case "ordered-list":
    case "task-list":
      return transformLineCommand(command, value, start, end);
    case "link": {
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
    case "code-block": {
      const body = selected || "code";
      const nextValue = `\`\`\`text\n${body}\n\`\`\``;
      const bodyStart = start + 8;
      return {
        replaceStart: start,
        replaceEnd: end,
        value: nextValue,
        selectionStart: bodyStart,
        selectionEnd: bodyStart + body.length,
      };
    }
    case "horizontal-rule": {
      const nextValue = "\n\n---\n\n";
      return {
        replaceStart: start,
        replaceEnd: end,
        value: nextValue,
        selectionStart: start + nextValue.length,
        selectionEnd: start + nextValue.length,
      };
    }
    case "bold":
    case "italic":
    case "strikethrough":
    case "code": {
      const meta = {
        bold: { open: "**", close: "**", placeholder: "重点内容" },
        italic: { open: "*", close: "*", placeholder: "强调内容" },
        strikethrough: { open: "~~", close: "~~", placeholder: "删除内容" },
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
  }
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
      headingLevels = defaultHeadingLevels,
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
    const [activeHeadingLevel, setActiveHeadingLevel] = useState<MarkdownHeadingLevel | null>(() =>
      headingLevelAt(value, 0),
    );
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const headingSelectionRef = useRef<MarkdownEditorSelection | null>(null);
    const overflowSelectionRef = useRef<MarkdownEditorSelection | null>(null);
    const activeMode = mode ?? internalMode;
    const activeBlockLabel = activeHeadingLevel ? `H${activeHeadingLevel}` : "正文";
    const showAuthoringTools = !readOnly && activeMode !== "preview";

    const changeMode = (next: MarkdownEditorMode) => {
      if (mode === undefined) setInternalMode(next);
      onModeChange?.(next);
    };

    const currentSelection = (source = value) => {
      const textarea = textareaRef.current;
      if (!textarea) return clampSelection(source, source.length);
      return clampSelection(
        source,
        textarea.selectionStart ?? source.length,
        textarea.selectionEnd ?? textarea.selectionStart ?? source.length,
      );
    };

    const syncSelection = (selection: MarkdownEditorSelection, source = value) => {
      setActiveHeadingLevel(headingLevelAt(source, selection.start));
      onSelectionChange?.(selection);
    };

    const applySelection = (selection: MarkdownEditorSelection, source = value) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(selection.start, selection.end);
      syncSelection(selection, source);
    };

    const emitSelection = () => {
      const selection = currentSelection();
      syncSelection(selection);
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
        applySelection(clampSelection(next, nextStart, nextEnd), next);
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

    const applyTransform = (transformed: CommandTransform) => {
      const next = `${value.slice(0, transformed.replaceStart)}${transformed.value}${value.slice(transformed.replaceEnd)}`;
      onChange(next);
      queueMicrotask(() => {
        applySelection(clampSelection(next, transformed.selectionStart, transformed.selectionEnd), next);
      });
    };

    const runCommand = (command: MarkdownEditorCommand, savedSelection?: MarkdownEditorSelection | null) => {
      if (!textareaRef.current || readOnly) return;
      const selection = savedSelection ?? currentSelection();
      applyTransform(transformCommand(command, value, selection.start, selection.end));
    };

    const runHeading = (
      level: MarkdownHeadingLevel | null,
      savedSelection?: MarkdownEditorSelection | null,
    ) => {
      if (!textareaRef.current || readOnly) return;
      const selection = savedSelection ?? currentSelection();
      applyTransform(transformHeading(value, selection.start, selection.end, level));
    };

    const editor = (
      <Textarea
        ref={textareaRef}
        aria-label={textareaAriaLabel}
        className={cn("min-h-[30rem] resize-y border-0 font-mono shadow-none focus-visible:ring-0", editorClassName)}
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next);
          syncSelection(
            clampSelection(next, event.target.selectionStart, event.target.selectionEnd),
            next,
          );
        }}
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
          <pre className="whitespace-pre-wrap font-sans text-sm leading-7">
            {value || "开始写作后，预览会出现在这里。"}
          </pre>
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
          {showAuthoringTools ? (
            <div className="flex shrink-0 items-center gap-0.5" aria-label="Markdown 格式工具">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="small"
                    variant="text"
                    icon={<ChevronDown aria-hidden="true" className="size-3.5 opacity-60" />}
                    iconPlacement="end"
                    className="gap-1 px-2"
                    aria-label={`段落样式：${activeBlockLabel}`}
                    title="段落与标题级别"
                    onPointerDown={() => {
                      headingSelectionRef.current = currentSelection();
                    }}
                  >
                    {activeBlockLabel}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem
                    className={activeHeadingLevel === null ? "font-medium text-primary" : undefined}
                    onSelect={() => {
                      runHeading(null, headingSelectionRef.current);
                      headingSelectionRef.current = null;
                    }}
                  >
                    正文
                  </DropdownMenuItem>
                  {headingLevels.map((level) => (
                    <DropdownMenuItem
                      key={level}
                      className={activeHeadingLevel === level ? "font-medium text-primary" : undefined}
                      onSelect={() => {
                        runHeading(level, headingSelectionRef.current);
                        headingSelectionRef.current = null;
                      }}
                    >
                      <span className="mr-2 w-6 font-mono text-xs text-muted-foreground">H{level}</span>
                      {headingLevelLabels[level]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {primaryCommands.map((item) => (
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="small"
                    variant="text"
                    icon={<MoreHorizontal />}
                    aria-label="更多格式"
                    title="更多格式"
                    onPointerDown={() => {
                      overflowSelectionRef.current = currentSelection();
                    }}
                  >
                    <span className="sr-only">更多格式</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {moreCommands.map((item) => (
                    <DropdownMenuItem
                      key={item.command}
                      onSelect={() => {
                        runCommand(item.command, overflowSelectionRef.current);
                        overflowSelectionRef.current = null;
                      }}
                    >
                      <span className="mr-2 inline-flex size-4 items-center justify-center">{item.icon}</span>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}

          {toolbarActions && showAuthoringTools ? (
            <div
              className="ml-1 flex shrink-0 items-center gap-1 border-l pl-2"
              data-slot="markdown-editor-actions"
            >
              {toolbarActions}
            </div>
          ) : null}

          <div
            className="ml-auto flex shrink-0 items-center gap-0.5 rounded-md bg-muted/60 p-0.5"
            aria-label="编辑器视图"
          >
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
          <div
            className="grid min-w-0 divide-y md:grid-cols-2 md:divide-x md:divide-y-0"
            data-slot="markdown-editor-split"
          >
            <div className="min-w-0 p-1">{editor}</div>
            {preview}
          </div>
        ) : null}
      </div>
    );
  },
);
