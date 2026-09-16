import { useRef, useState, type ReactNode } from "react";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "../../../../src/core";
import { MarkdownEditor, type MarkdownEditorRef } from "../../../../src/patterns";

const initialValue = `## MarkdownEditor

这是一个 **加粗**、*斜体* 和 [链接](https://example.com) 的示例。

> toolbarActions 只提供扩展槽，AI、插入等业务由产品自己注入。`;

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
            AI
          </Button>
          <Button
            type="button"
            size="small"
            variant="text"
            icon={<ImageIcon />}
            onClick={() => editorRef.current?.insertText("![插图](/image.webp)", { replaceSelection: false })}
          >
            插入
          </Button>
        </>
      )}
      textareaAriaLabel="MarkdownEditor Demo 正文"
      previewAriaLabel="MarkdownEditor Demo 预览"
    />
  );
}
