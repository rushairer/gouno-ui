import { useRef, useState } from "react";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "../../../../src/core";
import { MarkdownEditor, type MarkdownEditorRef } from "../../../../src/patterns";
import { MarkdownPreview } from "../../../components/markdown-preview";

const initialValue = `## MarkdownEditor

这是一个 **加粗**、*斜体* 和 [链接](https://example.com) 都能正确预览的示例。

> toolbarActions 只提供扩展槽，AI、插入等业务由产品自己注入。`;

export default function MarkdownEditorExample() {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef<MarkdownEditorRef>(null);

  return (
    <MarkdownEditor
      ref={editorRef}
      value={value}
      onChange={setValue}
      renderPreview={(markdown) => <MarkdownPreview value={markdown} />}
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
