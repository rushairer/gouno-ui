import { useState } from "react";
import { ArrowLeft, FileText, Save } from "lucide-react";
import {
  Alert,
  Button,
  Field,
  Form,
  FormGrid,
  Heading,
  Input,
  Segmented,
  Select,
  Switch,
  Tag,
  Text,
  Textarea,
} from "../../../src/core";
import { DocumentEditorShell } from "../../../src/patterns";
import {
  DedicatedEditorActions,
  DedicatedEditorLayout,
  DedicatedEditorLead,
  DedicatedEditorSection,
} from "../../components/patterns/dedicated-editor";

type EditorSubtype = "configuration" | "workspace";
type EditorMode = "create" | "edit";
type EditorState = "ready" | "saving" | "error" | "readonly";

const subtypeOptions = [
  { label: "Configuration", value: "configuration" },
  { label: "Workspace", value: "workspace" },
] as const;

const modeOptions = [
  { label: "Create", value: "create" },
  { label: "Edit", value: "edit" },
] as const;

const stateOptions = [
  { label: "Ready", value: "ready" },
  { label: "Saving", value: "saving" },
  { label: "Error", value: "error" },
  { label: "Read only", value: "readonly" },
] as const;

function ConfigurationEditorPreview({
  mode,
  state,
}: {
  mode: EditorMode;
  state: EditorState;
}) {
  const readOnly = state === "readonly";
  const saving = state === "saving";
  const title = mode === "create" ? "创建自动化资产" : "编辑自动化资产：内容维护";
  const description =
    mode === "create"
      ? "创建是一个独立任务上下文：定义资产身份、执行计划、能力边界与治理规则。"
      : "编辑保持完整上下文宽度；保存后返回资产详情，取消则回到进入编辑器之前的上下文。";

  return (
    <Form onFinish={() => undefined}>
      <div data-pattern="dedicated-list-editor" className="flex flex-col gap-5">
        <DedicatedEditorLead
          title={title}
          description={description}
          backLabel={mode === "create" ? "返回资产列表" : "返回资产详情"}
          onBack={() => undefined}
          status={readOnly ? <Tag>只读</Tag> : mode === "edit" ? <Tag color="success">已启用</Tag> : null}
        />

        {state === "error" ? (
          <Alert
            type="error"
            showIcon
            title="保存失败"
            description="保留当前编辑内容和页面骨架，用户可以修正后直接重试。"
          />
        ) : null}

        <DedicatedEditorLayout
          primary={(
            <>
              <DedicatedEditorSection
                title="基础信息"
                description="名称、说明与启停状态定义资产的业务身份。"
              >
                <div className="flex flex-col gap-5">
                  <FormGrid columns={2}>
                    <Field label="名称" required>
                      <Input
                        name="name"
                        defaultValue={mode === "edit" ? "内容维护" : undefined}
                        placeholder="自动化资产名称"
                        disabled={readOnly}
                      />
                    </Field>
                    <Field label="状态">
                      <Switch
                        name="enabled"
                        defaultChecked={mode === "edit"}
                        label="启用资产"
                        disabled={readOnly}
                      />
                    </Field>
                  </FormGrid>
                  <Field label="说明">
                    <Textarea
                      name="description"
                      rows={4}
                      defaultValue={mode === "edit" ? "持续执行内容维护与治理任务。" : undefined}
                      disabled={readOnly}
                    />
                  </Field>
                </div>
              </DedicatedEditorSection>

              <DedicatedEditorSection
                title="能力配置"
                description="把主任务定义集中在主列，不把深度配置塞进窄 Drawer。"
              >
                <div className="flex flex-col gap-5">
                  <Field label="执行能力">
                    <Select name="capability" defaultValue="content-maintenance" disabled={readOnly}>
                      <option value="content-maintenance">Content Maintenance</option>
                      <option value="seo-review">SEO Review</option>
                    </Select>
                  </Field>
                  <Field label="输入契约">
                    <Textarea
                      name="schema"
                      rows={6}
                      className="font-mono"
                      defaultValue={'{\n  "topic": "string",\n  "days": "integer"\n}'}
                      disabled={readOnly}
                    />
                  </Field>
                </div>
              </DedicatedEditorSection>
            </>
          )}
          secondary={(
            <>
              <DedicatedEditorSection
                title="执行计划"
                description="辅助列承载窄而独立的运行配置。"
              >
                <div className="flex flex-col gap-5">
                  <Field label="触发方式">
                    <Select name="trigger" defaultValue="cron" disabled={readOnly}>
                      <option value="manual">手动触发</option>
                      <option value="cron">Cron 定时</option>
                    </Select>
                  </Field>
                  <Field label="Cron">
                    <Input name="cron" defaultValue="30 8 * * *" disabled={readOnly} />
                  </Field>
                </div>
              </DedicatedEditorSection>

              <DedicatedEditorSection
                title="治理边界"
                description="成本、安全与权限限制始终属于同一编辑任务。"
              >
                <div className="flex flex-col gap-5">
                  <Field label="日运行上限">
                    <Input name="dailyLimit" type="number" defaultValue="10" disabled={readOnly} />
                  </Field>
                  <Field label="审批策略">
                    <Select name="approval" defaultValue="required" disabled={readOnly}>
                      <option value="required">高风险写入需要审批</option>
                      <option value="advisory">仅分析建议</option>
                    </Select>
                  </Field>
                </div>
              </DedicatedEditorSection>
            </>
          )}
        />

        <DedicatedEditorActions>
          <Button type="button" variant="outline">取消</Button>
          <Button
            type="submit"
            variant="solid"
            color="primary"
            icon={<Save />}
            loading={saving}
            disabled={readOnly}
          >
            {saving ? "保存中" : "保存"}
          </Button>
        </DedicatedEditorActions>
      </div>
    </Form>
  );
}

function WorkspaceEditorPreview({ state }: { state: EditorState }) {
  const readOnly = state === "readonly";
  const saving = state === "saving";

  return (
    <DocumentEditorShell
      aria-label="Workspace Editor 示例"
      header={(
        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Button size="small" variant="ghost" icon={<ArrowLeft />}>返回内容列表</Button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Heading level={2}>编辑内容文档</Heading>
                {readOnly ? <Tag>只读</Tag> : <Tag color="success">草稿</Tag>}
              </div>
              <Text size="xs" tone="muted">Workspace Editor 用专用 Shell 承载画布、导航和 Inspector。</Text>
            </div>
          </div>
          <Button variant="solid" color="primary" icon={<Save />} loading={saving} disabled={readOnly}>
            {saving ? "保存中" : "保存"}
          </Button>
        </div>
      )}
      navigator={(
        <nav className="flex flex-col gap-2" aria-label="文档大纲">
          <Text size="xs" tone="muted">文档结构</Text>
          <Button block variant="ghost" className="justify-start">概述</Button>
          <Button block variant="ghost" className="justify-start">实现</Button>
          <Button block variant="ghost" className="justify-start">验收</Button>
        </nav>
      )}
      inspector={(
        <div className="flex flex-col gap-5">
          <Field label="状态">
            <Select defaultValue="draft" disabled={readOnly}>
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </Select>
          </Field>
          <Field label="Slug">
            <Input defaultValue="content-document" disabled={readOnly} />
          </Field>
        </div>
      )}
    >
      <div className="flex flex-col gap-5">
        {state === "error" ? (
          <Alert type="error" showIcon title="保存失败" description="内容仍保留在编辑画布中，可直接重试。" />
        ) : null}
        <Field label="标题">
          <Input defaultValue="内容文档" disabled={readOnly} />
        </Field>
        <Field label="正文">
          <Textarea
            rows={14}
            defaultValue={"这里是 Workspace Editor 的主画布。\n\n它适合文章、单页或其他需要导航、画布和 Inspector 同时存在的编辑任务。"}
            disabled={readOnly}
          />
        </Field>
      </div>
    </DocumentEditorShell>
  );
}

export function PatternDedicatedEditorDemo() {
  const [subtype, setSubtype] = useState<EditorSubtype>("configuration");
  const [mode, setMode] = useState<EditorMode>("edit");
  const [state, setState] = useState<EditorState>("ready");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Composition Pattern · Showcase contract
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>Dedicated Editor 专用编辑器</Heading>
          <Tag color="success">Canonical</Tag>
          <Tag>Showcase-only</Tag>
        </div>
        <Text tone="muted" className="max-w-4xl leading-relaxed">
          Dedicated Editor 是页面组合契约，不是公开 React 组件。它统一进入编辑任务后的身份、返回路径、反馈位置、内容分区、响应式布局和保存动作；产品仍负责真实字段、权限、状态和业务绑定。
        </Text>
      </header>

      <section className="flex flex-col gap-4 rounded-xl border bg-muted/[0.08] p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2">
            <Text size="xs" tone="muted">Subtype</Text>
            <Segmented<EditorSubtype>
              aria-label="Dedicated Editor 类型"
              options={subtypeOptions}
              value={subtype}
              onChange={setSubtype}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Text size="xs" tone="muted">Mode</Text>
            <Segmented<EditorMode>
              aria-label="Dedicated Editor 模式"
              options={modeOptions}
              value={mode}
              onChange={setMode}
              disabled={subtype === "workspace"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Text size="xs" tone="muted">State</Text>
            <Segmented<EditorState>
              aria-label="Dedicated Editor 状态"
              options={stateOptions}
              value={state}
              onChange={setState}
            />
          </div>
        </div>
      </section>

      <section aria-label="Dedicated Editor Canonical Preview">
        {subtype === "configuration"
          ? <ConfigurationEditorPreview mode={mode} state={state} />
          : <WorkspaceEditorPreview state={state} />}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border p-5">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-primary" aria-hidden="true" />
            <Heading level={3}>Configuration Editor</Heading>
          </div>
          <Text size="sm" tone="muted" className="mt-2 leading-relaxed">
            用于 Agent、Skill、Workflow 这类深度资产配置。统一使用 Back → Editor Lead → Feedback → Body → Actions；内容可以双栏，但进入窄屏后自然收敛为单列。
          </Text>
        </div>
        <div className="rounded-xl border p-5">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-primary" aria-hidden="true" />
            <Heading level={3}>Workspace Editor</Heading>
          </div>
          <Text size="sm" tone="muted" className="mt-2 leading-relaxed">
            用于文章、单页等持续创作任务。它可以使用 DocumentEditorShell 这样的专用工作区组件，但仍遵守明确返回、稳定身份、反馈不漂移和进入任务后归顶的 Dedicated Editor 上层契约。
          </Text>
        </div>
      </section>
    </div>
  );
}
