import { readFileSync, writeFileSync } from "node:fs";

function read(path) {
  return readFileSync(path, "utf8");
}

function write(path, content) {
  writeFileSync(path, content);
}

function replaceExact(path, before, after) {
  const source = read(path);
  const first = source.indexOf(before);
  const second = first === -1 ? -1 : source.indexOf(before, first + before.length);
  if (first === -1 || second !== -1) {
    throw new Error(`${path}: expected exactly one match for replacement`);
  }
  write(path, `${source.slice(0, first)}${after}${source.slice(first + before.length)}`);
}

function replaceRegex(path, expression, after) {
  const source = read(path);
  const matches = source.match(expression);
  if (!matches) throw new Error(`${path}: regex replacement did not match`);
  const next = source.replace(expression, after);
  if (next === source) throw new Error(`${path}: regex replacement made no change`);
  write(path, next);
}

function replaceRegion(path, startMarker, endMarker, replacement) {
  const source = read(path);
  const start = source.indexOf(startMarker);
  if (start === -1) throw new Error(`${path}: start marker not found`);
  const end = source.indexOf(endMarker, start);
  if (end === -1) throw new Error(`${path}: end marker not found`);
  write(path, `${source.slice(0, start)}${replacement}${source.slice(end)}`);
}

const catalog = "showcase/catalog/index.tsx";
replaceExact(
  catalog,
  '    item("pattern-bulk-action-bar", "BulkActionBar", "批量操作栏", 100, <ListChecks />),\n',
  '    item("pattern-bulk-action-bar", "BulkActionBar", "批量操作栏", 100, <ListChecks />),\n    item("pattern-markdown-editor", "MarkdownEditor", "Markdown 编辑器", 100, <FileText />),\n',
);

const router = "showcase/app/page-router.tsx";
replaceExact(
  router,
  'const PatternBulkActionBarDemo = lazy(() =>\n  import("../demos/patterns/bulk-action-bar").then((module) => ({ default: module.PatternBulkActionBarDemo })),\n);\n',
  'const PatternBulkActionBarDemo = lazy(() =>\n  import("../demos/patterns/bulk-action-bar").then((module) => ({ default: module.PatternBulkActionBarDemo })),\n);\nconst PatternMarkdownEditorDemo = lazy(() =>\n  import("../demos/patterns/markdown-editor").then((module) => ({ default: module.PatternMarkdownEditorDemo })),\n);\n',
);
replaceExact(
  router,
  '    case "pattern-bulk-action-bar":\n      return <Suspense fallback={loading}><PatternBulkActionBarDemo /></Suspense>;\n',
  '    case "pattern-bulk-action-bar":\n      return <Suspense fallback={loading}><PatternBulkActionBarDemo /></Suspense>;\n    case "pattern-markdown-editor":\n      return <Suspense fallback={loading}><PatternMarkdownEditorDemo /></Suspense>;\n',
);

const postEditor = "showcase/demos/products/blog-admin/post-editor.tsx";
replaceExact(
  postEditor,
  'import { FixtureNotification } from "./fixture-notification";\n',
  'import { FixtureNotification } from "./fixture-notification";\nimport { MarkdownPreview } from "../../../components/markdown-preview";\n',
);
replaceRegex(
  postEditor,
  /function renderPostPreview\(value: string\) \{[\s\S]*?\n\}\n\n(?=export function BlogAdminPostEditorDemo)/,
  'function renderPostPreview(value: string) {\n  return <MarkdownPreview value={value} data-slot="post-markdown-preview" />;\n}\n\n',
);
replaceExact(
  postEditor,
  '      setGeneratedContent(null);\n      setNotice("已替换所选正文。");\n',
  '      setGeneratedContent(null);\n      setAIPanel(null);\n      setNotice("已替换所选正文。");\n',
);
replaceExact(
  postEditor,
  '    setGeneratedContent(null);\n    setNotice(mode === "replace" ? "已替换文章正文。" : "已将生成内容追加到文末。");\n',
  '    setGeneratedContent(null);\n    setAIPanel(null);\n    setNotice(mode === "replace" ? "已替换文章正文。" : "已将生成内容追加到文末。");\n',
);
replaceExact(
  postEditor,
  '      setNotice("已在编辑位置插入 AI 插图。");\n',
  '      setAIPanel(null);\n      setNotice("已在编辑位置插入 AI 插图。");\n',
);
replaceRegion(
  postEditor,
  '          {aiPanel === "writing" && !readOnly ? (',
  '        </div>\n      </DocumentEditorShell>',
  `          <Modal
            open={aiPanel === "writing" && !readOnly}
            title="AI 写作助手"
            description={editorSelection?.text ? \`当前作用域：已选 \${editorSelection.text.length} 个字符\` : "当前作用域：正文"}
            size="lg"
            onOpenChange={(open) => {
              if (!open) {
                setAIPanel(null);
                setGeneratedContent(null);
              }
            }}
            footer={null}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 lg:flex-row">
                <Input
                  aria-label="AI 写作提示词"
                  value={writingPrompt}
                  onChange={(event) => setWritingPrompt(event.target.value)}
                  placeholder="输入写作或修改指令"
                />
                <Button
                  variant="solid"
                  color="primary"
                  disabled={!writingPrompt.trim()}
                  onClick={() => setGeneratedContent(
                    "## 生产化之后的新问题\\n\\nAgent 自动化扩大后，团队首先需要的不是更多按钮，而是能解释每一步执行证据。\\n\\n## 三个治理抓手\\n\\n1. 记录输入与工具调用。\\n2. 高风险写入保留人工审批。\\n3. 失败运行可以回放与重试。",
                  )}
                >
                  生成 / 执行
                </Button>
              </div>
              {generatedContent ? (
                <div className="rounded-md border bg-background p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Text className="font-semibold">生成结果预览</Text>
                    <div className="flex flex-wrap gap-2">
                      {editorSelection?.text ? (
                        <Button size="small" variant="solid" color="primary" onClick={() => applyGeneratedContent("replace-selection")}>替换所选</Button>
                      ) : (
                        <Button size="small" variant="solid" color="primary" onClick={() => applyGeneratedContent("replace")}>替换全文</Button>
                      )}
                      <Button size="small" onClick={() => applyGeneratedContent("append")}>追加到末尾</Button>
                      <Button size="small" variant="text" onClick={() => setGeneratedContent(null)}>放弃</Button>
                    </div>
                  </div>
                  <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-sm">{generatedContent}</pre>
                </div>
              ) : null}
            </div>
          </Modal>

          <Modal
            open={aiPanel === "image" && !readOnly}
            title="AI 生成图片"
            description="生成后可插入当前编辑位置，或设为文章封面。"
            size="lg"
            onOpenChange={(open) => {
              if (!open) {
                setAIPanel(null);
                setGeneratedImage(false);
              }
            }}
            footer={null}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Button size="small" onClick={() => setImagePrompt("Clean editorial illustration of an AI agent workflow with evidence timeline and human approval checkpoint")}>结合文章构思</Button>
                <Button size="small" onClick={() => setImagePrompt("Isometric architecture diagram of AI workflow components and approval gates")}>架构图解</Button>
                <Button size="small" onClick={() => setImagePrompt("Minimal editorial vector illustration about AI workflow governance")}>科技插画</Button>
              </div>
              <Input
                aria-label="生图提示词"
                value={imagePrompt}
                onChange={(event) => setImagePrompt(event.target.value)}
                placeholder="输入生图提示词"
              />
              <div className="flex flex-col gap-2 lg:flex-row">
                <Input
                  aria-label="图片描述 Alt"
                  value={imageAlt}
                  onChange={(event) => setImageAlt(event.target.value)}
                  placeholder="图片描述 (Alt)"
                />
                <Button variant="solid" color="primary" disabled={!imagePrompt.trim()} onClick={() => setGeneratedImage(true)}>开始生图</Button>
              </div>
              {generatedImage ? (
                <div className="grid gap-4 rounded-md border bg-background p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                  <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed bg-muted/30 text-center text-sm text-muted-foreground">
                    AI 生成插图预览
                  </div>
                  <div className="flex min-w-0 flex-col gap-3">
                    <code className="overflow-x-auto rounded bg-muted px-3 py-2 text-xs">![{imageAlt || "文章插图"}](/media/ai-generated-agent-workflow.webp)</code>
                    <div className="flex flex-wrap gap-2">
                      <Button size="small" variant="solid" color="primary" onClick={insertGeneratedImageAtCursor}>插入光标位置</Button>
                      <Button size="small" onClick={() => {
                        updatePost("coverUrl", "/media/ai-generated-agent-workflow.webp");
                        updatePost("coverAlt", imageAlt || "文章插图");
                        setAIPanel(null);
                        setNotice("已将 AI 图片设为文章封面。");
                      }}>设为文章封面</Button>
                      <Button size="small" variant="text" onClick={() => setGeneratedImage(false)}>放弃</Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Modal>

`,
);

const pageEditor = "showcase/demos/products/blog-admin/page-editor.tsx";
replaceExact(
  pageEditor,
  'import { FixtureNotification } from "./fixture-notification";\n',
  'import { FixtureNotification } from "./fixture-notification";\nimport { MarkdownPreview } from "../../../components/markdown-preview";\n',
);
replaceRegex(
  pageEditor,
  /function renderPagePreview\(value: string\) \{[\s\S]*?\n\}\n\n(?=export function BlogAdminPageEditorDemo)/,
  'function renderPagePreview(value: string) {\n  return <MarkdownPreview value={value} data-slot="page-markdown-preview" />;\n}\n\n',
);
replaceExact(
  pageEditor,
  '      setGeneratedContent(null);\n      setNotice("已替换所选正文。");\n',
  '      setGeneratedContent(null);\n      setAIPanel(null);\n      setNotice("已替换所选正文。");\n',
);
replaceExact(
  pageEditor,
  '    setGeneratedContent(null);\n    setNotice(mode === "replace" ? "已替换单页正文。" : "已将生成内容追加到单页正文末尾。");\n',
  '    setGeneratedContent(null);\n    setAIPanel(null);\n    setNotice(mode === "replace" ? "已替换单页正文。" : "已将生成内容追加到单页正文末尾。");\n',
);
replaceExact(
  pageEditor,
  '      setNotice("已在编辑位置插入 AI 图片。");\n',
  '      setAIPanel(null);\n      setNotice("已在编辑位置插入 AI 图片。");\n',
);
replaceRegion(
  pageEditor,
  '          {aiPanel === "writing" ? (',
  '        </div>\n      </DocumentEditorShell>',
  `          <Modal
            open={aiPanel === "writing"}
            title="AI 写作助手"
            description={editorSelection?.text ? \`当前作用域：已选 \${editorSelection.text.length} 个字符\` : "当前作用域：正文"}
            size="lg"
            onOpenChange={(open) => {
              if (!open) {
                setAIPanel(null);
                setGeneratedContent(null);
              }
            }}
            footer={null}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 lg:flex-row">
                <Input
                  aria-label="AI 写作提示词"
                  value={writingPrompt}
                  onChange={(event) => setWritingPrompt(event.target.value)}
                  placeholder="输入写作或修改指令"
                />
                <Button
                  variant="solid"
                  color="primary"
                  disabled={!writingPrompt.trim()}
                  onClick={() => setGeneratedContent(
                    "## 我们是谁\\n\\n我们关注工程实践、AI 产品与开放技术。\\n\\n## 我们相信什么\\n\\n长期主义、可验证的结果，以及把复杂系统讲清楚。",
                  )}
                >
                  生成 / 执行
                </Button>
              </div>
              {generatedContent ? (
                <div className="rounded-md border bg-background p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Text className="font-semibold">生成结果预览</Text>
                    <div className="flex flex-wrap gap-2">
                      {editorSelection?.text ? (
                        <Button size="small" variant="solid" color="primary" onClick={() => applyGeneratedContent("replace-selection")}>替换所选</Button>
                      ) : (
                        <Button size="small" variant="solid" color="primary" onClick={() => applyGeneratedContent("replace")}>替换全文</Button>
                      )}
                      <Button size="small" onClick={() => applyGeneratedContent("append")}>追加到末尾</Button>
                      <Button size="small" variant="text" onClick={() => setGeneratedContent(null)}>放弃</Button>
                    </div>
                  </div>
                  <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-sm">{generatedContent}</pre>
                </div>
              ) : null}
            </div>
          </Modal>

          <Modal
            open={aiPanel === "image"}
            title="AI 生成图片"
            description="生成后插入当前编辑位置，不改变单页页面配置。"
            size="lg"
            onOpenChange={(open) => {
              if (!open) {
                setAIPanel(null);
                setGeneratedImage(false);
              }
            }}
            footer={null}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Button size="small" onClick={() => setImagePrompt("Modern clean editorial illustration for an About page, engineering team and open technology")}>结合页面构思</Button>
                <Button size="small" onClick={() => setImagePrompt("Isometric architecture diagram for a modern technology team About page")}>架构图解</Button>
                <Button size="small" onClick={() => setImagePrompt("Minimal editorial vector illustration for a technology team About page")}>科技插画</Button>
              </div>
              <Input
                aria-label="生图提示词"
                value={imagePrompt}
                onChange={(event) => setImagePrompt(event.target.value)}
                placeholder="输入生图提示词"
              />
              <div className="flex flex-col gap-2 lg:flex-row">
                <Input
                  aria-label="图片描述 Alt"
                  value={imageAlt}
                  onChange={(event) => setImageAlt(event.target.value)}
                  placeholder="图片描述 (Alt)"
                />
                <Button variant="solid" color="primary" disabled={!imagePrompt.trim()} onClick={() => setGeneratedImage(true)}>开始生图</Button>
              </div>
              {generatedImage ? (
                <div className="grid gap-4 rounded-md border bg-background p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                  <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed bg-muted/30 text-center text-sm text-muted-foreground">
                    AI 生成插图预览
                  </div>
                  <div className="flex min-w-0 flex-col gap-3">
                    <code className="overflow-x-auto rounded bg-muted px-3 py-2 text-xs">![{imageAlt || "单页插图"}](/media/ai-generated-page.webp)</code>
                    <div className="flex flex-wrap gap-2">
                      <Button size="small" variant="solid" color="primary" onClick={insertGeneratedImageAtCursor}>插入光标位置</Button>
                      <Button size="small" variant="text" onClick={() => setGeneratedImage(false)}>放弃</Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Modal>

`,
);

const demoPresentationTest = "tests/showcase-demo-code-presentation.test.tsx";
replaceExact(
  demoPresentationTest,
  '  "showcase/demos/patterns/bulk-action-bar.tsx",\n',
  '  "showcase/demos/patterns/bulk-action-bar.tsx",\n  "showcase/demos/patterns/markdown-editor.tsx",\n',
);

for (const path of [
  "tests/product-blog-admin-post-editor.test.tsx",
  "tests/product-blog-admin-page-editor.test.tsx",
]) {
  replaceExact(
    path,
    '    expect(screen.getByLabelText("AI 写作助手")).toBeTruthy();\n',
    '    expect(screen.getByRole("dialog", { name: "AI 写作助手" })).toBeTruthy();\n    expect(document.querySelector(\'[data-slot="dialog-overlay"]\')).toBeTruthy();\n',
  );
  replaceExact(
    path,
    '    expect(screen.getByLabelText("AI 图片生成器")).toBeTruthy();\n',
    '    expect(screen.getByRole("dialog", { name: "AI 生成图片" })).toBeTruthy();\n    expect(document.querySelector(\'[data-slot="dialog-overlay"]\')).toBeTruthy();\n',
  );
}

console.log("MarkdownEditor Showcase refactor applied.");
