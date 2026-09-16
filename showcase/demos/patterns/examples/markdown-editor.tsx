import { useRef, useState, type ReactNode } from "react";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "../../../../src/core";
import {
  MarkdownEditor,
  type MarkdownEditorRef,
  type MarkdownHeadingLevel,
} from "../../../../src/patterns";

const headingLevels = [1, 2, 3, 4, 5, 6] as const satisfies readonly MarkdownHeadingLevel[];

const initialValue = [
  "## MarkdownEditor",
  "",
  "这是一个 **加粗**、*斜体*、~~删除线~~、`inline code` 和 [链接](https://example.com) 的示例。",
  "",
  "> toolbarActions 只提供扩展槽，AI 写作、插图等业务由产品自己注入。",
  "",
  "- [x] 编辑 / 分屏 / 预览",
  "- [ ] 接入产品自己的保存与发布流程",
  "",
  "| 能力 | 归属 |",
  "| --- | --- |",
  "| Markdown 命令 | MarkdownEditor |",
  "| AI / 媒体 | 产品扩展 |",
  "",
  "```ts",
  "const editor = { mode: \"split\", ready: true };",
  "```",
].join("\n");

export interface MarkdownEditorExampleProps {
  renderPreview?: (markdown: string) => ReactNode;
}

export default function MarkdownEditorExample({ renderPreview }: MarkdownEditorExampleProps) {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef<MarkdownEditorRef>(null);

  return (
    <MarkdownEditor
      ref={editorRef}
      value={value}
      onChange={setValue}
      headingLevels={headingLevels}
      renderPreview={renderPreview ?? ((markdown) => (
        <pre className="whitespace-pre-wrap font-sans text-sm leading-7">{markdown}</pre>
      ))}
      toolbarActions={(
        <>
          <Button
            type="button"
            size="small"
            variant="text"
            icon={<Sparkles />}
            onClick={() => editorRef.current?.insertText("AI 生成内容", { replaceSelection: true })}
          >
            AI 写作
          </Button>
          <Button
            type="button"
            size="small"
            variant="text"
            icon={<ImageIcon />}
            onClick={() => editorRef.current?.insertText("![插图](/image.webp)", { replaceSelection: false })}
          >
            插图
          </Button>
        </>
      )}
      textareaAriaLabel="MarkdownEditor Demo 正文"
      previewAriaLabel="MarkdownEditor Demo 预览"
    />
  );
}
