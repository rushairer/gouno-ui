import { useState } from "react";
import {
  ActionGroup, Button, EditorWorkspaceTemplate, Feedback, Field, Input,
  PageHeader, Panel, PanelHeader, Select,
} from "../../../src";
import { StateControls, StatePanel, type DemoState } from "../../scenarios";

export function EditorDemo() {
  const [state, setState] = useState<DemoState>("ready");
  const [preview, setPreview] = useState(false);
  const [saveState, setSaveState] = useState<"dirty" | "saved" | "failed" | "conflict">(
    "dirty",
  );
  return (
    <>
      <PageHeader
        title="文章编辑器模板"
        description="命令栏、编辑画布、Inspector、预览和保存状态。"
        actions={
          <ActionGroup>
            <Button variant="outline" onClick={() => setPreview(!preview)}>
              切换预览
            </Button>
            <Button variant="solid" color="primary" onClick={() => setSaveState("saved")}>
              保存草稿
            </Button>
          </ActionGroup>
        }
      />
      <StateControls state={state} setState={setState} />
      {state === "ready" ? (
      <EditorWorkspaceTemplate
        outline={
          <>
          <PanelHeader title="大纲" description="文章结构" />
          <nav className="flex flex-col gap-2 text-sm">
            <a
              className="rounded-md bg-accent px-3 py-2 text-accent-foreground"
              href="#editor-title"
            >
              标题
            </a>
            <a
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted"
              href="#editor-body"
            >
              正文
            </a>
            <a
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted"
              href="#editor-meta"
            >
              元信息
            </a>
          </nav>
          </>
        }
        canvas={
        <Panel className="min-h-[520px]">
          <PanelHeader
            title={preview ? "预览" : "编辑内容"}
            description="Markdown、代码块和表格内容在画布内滚动。"
          />
          {saveState === "saved" ? (
            <Feedback type="success" className="mb-4">
              草稿已保存 · 刚刚
            </Feedback>
          ) : null}
          {saveState === "failed" ? (
            <Feedback type="error" className="mb-4">
              保存失败，请检查必填字段后重试。
            </Feedback>
          ) : null}
          {preview ? (
              <article className="prose max-w-none">
                <h2>设计系统迁移计划</h2>
                <p>这是静态预览，用来验证阅读宽度、标题层级和内容间距。</p>
                <pre className="max-h-48 overflow-auto rounded-md bg-muted p-4">
                  const density = "default";{`\n`}renderTable(density);
                </pre>
              </article>
            ) : (
              <div className="flex flex-col gap-4">
                <Field
                  label="标题"
                  id="editor-title"
                  hint="建议控制在 60 个字符以内。"
                >
                  <Input defaultValue="设计系统迁移计划" />
                </Field>
                <Field
                  label="正文"
                  id="editor-body"
                  hint="支持 Markdown 和富文本粘贴。"
                >
                  <textarea
                    className="min-h-64 w-full rounded-md border bg-input p-3 text-sm leading-7"
                    defaultValue="页面级 Demo 让每一个间距和状态都可以被直接评审。"
                  />
                </Field>
                <div id="editor-meta" className="grid gap-4 sm:grid-cols-2">
                  <Field label="摘要">
                    <Input defaultValue="统一页面视觉语言" />
                  </Field>
                  <Field label="作者">
                    <Select defaultValue="owner">
                      <option value="owner">Gouno Owner</option>
                      <option value="editor">Editorial Team</option>
                    </Select>
                  </Field>
                </div>
                <div className="max-h-40 overflow-auto rounded-md border bg-muted/40 p-4 text-sm">
                  <div className="mb-2 font-medium">Markdown 表格预览内容</div>
                  <code className="whitespace-pre">{`| 状态 | 数量 |\n| --- | ---: |\n| 已发布 | 126 |\n| 草稿 | 32 |`}</code>
                </div>
              </div>
          )}
        </Panel>
        }
        inspector={
        <Panel>
          <PanelHeader title="Inspector" description="页面设置和发布选项。" />
          <div className="flex flex-col gap-4">
            <Field label="状态">
              <Select defaultValue="draft">
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
              </Select>
            </Field>
            <Field label="摘要">
              <Input defaultValue="统一页面视觉语言" />
            </Field>
            <Feedback
              type={
                saveState === "dirty"
                  ? "warning"
                  : saveState === "failed"
                    ? "error"
                    : "success"
              }
            >
              {saveState === "dirty"
                ? "有未保存的修改。"
                : saveState === "failed"
                  ? "保存失败，修改仍保留在本地。"
                  : saveState === "conflict"
                    ? "检测到版本冲突，提交已暂停。"
                    : "所有修改都已保存。"}
            </Feedback>
            <ActionGroup>
              <Button
                size="small"
                variant="ghost"
                onClick={() => setSaveState("dirty")}
              >
                标记未保存
              </Button>
              <Button
                size="small"
                variant="solid" color="error"
                onClick={() => setSaveState("failed")}
              >
                模拟保存失败
              </Button>
              <Button size="small" variant="outline" onClick={() => setSaveState("conflict")}>
                模拟版本冲突
              </Button>
            </ActionGroup>
          </div>
        </Panel>
        }
      />
      ) : (
        <Panel>
          <StatePanel state={state} onRetry={() => setState("ready")} />
        </Panel>
      )}
    </>
  );
}

