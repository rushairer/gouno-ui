import { useState, type ReactNode } from "react";
import { DatabaseZap, KeyRound, LockKeyhole } from "lucide-react";
import {
  Button,
  Checkbox,
  Field,
  Form,
  FormActions,
  FormGrid,
  Heading,
  Input,
  Select,
  Switch,
  Text,
  Textarea,
} from "../../../../../../src/core";
import type {
  AgentFixture,
  AISettingsFixture,
  ConnectorFixture,
  ConnectorKind,
  EmbeddingProfileFixture,
  ProviderFixture,
  SkillFixture,
} from "./fixtures";
import {
  DedicatedEditorActions,
  DedicatedEditorLayout,
  DedicatedEditorSection,
} from "../../../../../components/patterns/dedicated-editor";
import { EditorFormSurfaceSection } from "../../../../../components/patterns/editor-form-composition";

export type AISettingsEditorState =
  | { kind: "agent"; value: AgentFixture | "new" }
  | { kind: "skill"; value: SkillFixture | "new" }
  | { kind: "provider"; value: ProviderFixture | "new" }
  | { kind: "embedding"; value: EmbeddingProfileFixture | "new" }
  | { kind: "connector"; value: ConnectorFixture | "new" }
  | null;

export type AISettingsEditorResult =
  | { kind: "agent"; id?: number; value: Omit<AgentFixture, "id"> }
  | { kind: "skill"; id?: number; value: Omit<SkillFixture, "id"> }
  | { kind: "provider"; id?: number; value: Omit<ProviderFixture, "id"> }
  | { kind: "embedding"; id?: number; value: Omit<EmbeddingProfileFixture, "id"> }
  | { kind: "connector"; id?: number; value: Omit<ConnectorFixture, "id"> };

export type AISettingsEditorSurface = "page" | "drawer";

export function getAISettingsEditorPresentation(editor: Exclude<AISettingsEditorState, null>) {
  const name = editor.value === "new" ? undefined : editor.value.name;
  switch (editor.kind) {
    case "agent":
      return {
        title: name ? `编辑 Agent：${name}` : "创建 Agent",
        description: "Agent 只绑定稳定的模型与 Skill Version；调度、预算和限制覆盖属于运行治理，不复制 Skill 的安全边界。",
        submitLabel: "保存 Agent",
        formId: "ai-settings-agent-editor",
      };
    case "skill":
      return {
        title: name ? `编辑 Skill：${name}` : "创建 Skill",
        description: "Skill Version 是行为与安全边界的稳定合同：固定指令、Tool 授权、发布策略、触发器和默认治理限制都在这里定义。",
        submitLabel: "保存 Skill",
        formId: "ai-settings-skill-editor",
      };
    case "provider":
      return {
        title: name ? `编辑模型连接：${name}` : "添加模型连接",
        description: "配置模型协议、端点、凭据状态与启停状态。",
        submitLabel: "保存模型连接",
        formId: "ai-settings-provider-editor",
      };
    case "embedding":
      return {
        title: name ? `编辑 Embedding：${name}` : "添加 Embedding 模型",
        description: "配置知识索引使用的模型、端点、向量维度与凭据状态。",
        submitLabel: "保存 Embedding",
        formId: "ai-settings-embedding-editor",
      };
    case "connector":
      return {
        title: name ? `编辑 Connector：${name}` : "添加 Connector Profile",
        description: "配置 Connector 的产品身份、授权范围、Sandbox 与凭据状态。",
        submitLabel: "保存 Connector",
        formId: "ai-settings-connector-editor",
      };
  }
}

function text(values: Record<string, FormDataEntryValue>, key: string, fallback = "") {
  const value = values[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function checked(values: Record<string, FormDataEntryValue>, key: string) {
  return values[key] === "on";
}

function numberValue(values: Record<string, FormDataEntryValue>, key: string, fallback: number) {
  const value = values[key];
  if (typeof value !== "string" || !value.trim()) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function optionalNumber(values: Record<string, FormDataEntryValue>, key: string) {
  const value = values[key];
  if (typeof value !== "string" || !value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function objectSchema(values: Record<string, FormDataEntryValue>, key: string, fallback?: Record<string, unknown>) {
  const raw = text(values, key, "");
  if (!raw) return fallback ?? { type: "object", additionalProperties: false };
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : fallback ?? { type: "object", additionalProperties: false };
  } catch {
    return fallback ?? { type: "object", additionalProperties: false };
  }
}

function ContextualEditorHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <Heading level={2} variant="subsection">{title}</Heading>
        <Text size="sm" tone="muted">{description}</Text>
      </div>
    </div>
  );
}


function AgentEditor({
  value,
  fixture,
  onSave,
  onCancel,
}: {
  value: AgentFixture | "new";
  fixture: AISettingsFixture;
  onSave: (result: AISettingsEditorResult) => void;
  onCancel: () => void;
}) {
  const initial = value === "new" ? undefined : value;
  const defaultProvider = initial?.provider || fixture.providers.find((item) => item.defaultWriting)?.name || fixture.providers[0]?.name || "";
  const defaultSkill = initial?.skill || fixture.skills[0]?.name || "";

  return (
    <Form
      onFinish={(_, values) => {
        const providerName = text(values, "provider", defaultProvider);
        const skillName = text(values, "skill", defaultSkill);
        const skill = fixture.skills.find((item) => item.name === skillName);
        const triggerType = text(values, "triggerType", initial?.triggerType || "manual") as AgentFixture["triggerType"];
        onSave({
          kind: "agent",
          id: initial?.id,
          value: {
            name: text(values, "name", initial?.name || "New Agent"),
            description: text(values, "description", initial?.description || "自定义 Agent。"),
            enabled: checked(values, "enabled"),
            system: initial?.system ?? false,
            provider: providerName,
            skill: skillName,
            skillVersion: skill?.version ?? initial?.skillVersion ?? 1,
            capabilities: skill?.capabilities ? [...skill.capabilities] : [...(initial?.capabilities || [])],
            schedule: text(values, "schedule", initial?.schedule || "手动"),
            timezone: text(values, "timezone", initial?.timezone || "Asia/Shanghai"),
            latestRun: initial?.latestRun || "尚未运行",
            triggerType,
            dailyRunLimit: numberValue(values, "dailyRunLimit", initial?.dailyRunLimit ?? skill?.defaultDailyRunLimit ?? 10),
            monthlyTokenBudget: numberValue(values, "monthlyTokenBudget", initial?.monthlyTokenBudget ?? skill?.defaultMonthlyTokenBudget ?? 1000000),
            maxStepsOverride: optionalNumber(values, "maxStepsOverride"),
            maxInputTokensOverride: optionalNumber(values, "maxInputTokensOverride"),
            maxOutputTokensOverride: optionalNumber(values, "maxOutputTokensOverride"),
          },
        });
      }}
    >
      <div data-pattern="editor-form-composition" className="flex flex-col gap-5">

        <DedicatedEditorLayout
          primary={(
            <>
            <DedicatedEditorSection title="基础信息" description="名称、说明与启停状态表达这个 Agent 在运营中的职责。">
              <div className="flex flex-col gap-5">
                <Field label="Agent 名称" required>
                  <Input name="name" defaultValue={initial?.name} placeholder="Content Maintainer" />
                </Field>
                <Field label="描述">
                  <Textarea name="description" defaultValue={initial?.description} rows={4} />
                </Field>
                <Field label="状态">
                  <Switch name="enabled" defaultChecked={initial?.enabled ?? false} label="启用 Agent" />
                </Field>
              </div>
            </DedicatedEditorSection>

            <DedicatedEditorSection title="能力绑定" description="模型可以跟随默认连接；行为、Tool 授权、发布策略与安全上限由绑定的 Skill Version 固定。">
              <div className="flex flex-col gap-5">
                <FormGrid columns={2}>
                  <Field label="模型连接">
                    <Select name="provider" defaultValue={defaultProvider}>
                      <option value="">跟随系统默认文本模型</option>
                      {fixture.providers.filter((item) => item.enabled).map((provider) => (
                        <option key={provider.id} value={provider.name}>{provider.name} · {provider.model}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="绑定 Skill Version" required>
                    <Select name="skill" defaultValue={defaultSkill}>
                      {fixture.skills.map((skill) => (
                        <option key={skill.id} value={skill.name}>{skill.name} · v{skill.version}</option>
                      ))}
                    </Select>
                  </Field>
                </FormGrid>
                {initial ? (
                  <div className="rounded-md border bg-muted/20 p-4">
                    <Text size="xs" tone="muted">当前行为策略</Text>
                    <strong className="mt-1 block type-body-sm type-weight-semibold">{initial.skill} · v{initial.skillVersion}</strong>
                    <Text size="xs" tone="muted">已授权 {initial.capabilities.length} 个 Tool；限制覆盖只能比 Skill 默认值更严格。</Text>
                  </div>
                ) : null}
              </div>
            </DedicatedEditorSection>
            </>
          )}
          secondary={(
            <>
            <DedicatedEditorSection title="运行计划" description="触发方式决定何时发起运行；正式执行仍受权限、审批和运行状态约束。">
              <div className="flex flex-col gap-5">
                <Field label="触发方式">
                  <Select name="triggerType" defaultValue={initial?.triggerType || (initial?.schedule && initial.schedule !== "手动" ? "cron" : "manual")}>
                    <option value="manual">手动触发</option>
                    <option value="cron">Cron 定时</option>
                  </Select>
                </Field>
                <Field label="运行计划" hint="Cron 表达式；手动触发时保留“手动”。">
                  <Input name="schedule" defaultValue={initial?.schedule || "手动"} placeholder="30 8 * * *" />
                </Field>
                <Field label="时区">
                  <Input name="timezone" defaultValue={initial?.timezone || "Asia/Shanghai"} />
                </Field>
                {initial ? (
                  <div className="border-t pt-5">
                    <Text size="xs" tone="muted">最近运行</Text>
                    <strong className="mt-1 block type-body-sm type-weight-semibold">{initial.latestRun}</strong>
                  </div>
                ) : null}
              </div>
            </DedicatedEditorSection>

            <DedicatedEditorSection title="运行治理" description="Agent 可以设置运行次数和月度预算，并只允许把 Skill 的最大限制向下收紧。">
              <div className="flex flex-col gap-5">
                <FormGrid columns={2}>
                  <Field label="日运行上限">
                    <Input name="dailyRunLimit" type="number" min={1} defaultValue={String(initial?.dailyRunLimit ?? 10)} />
                  </Field>
                  <Field label="月 Token 预算">
                    <Input name="monthlyTokenBudget" type="number" min={1} defaultValue={String(initial?.monthlyTokenBudget ?? 1000000)} />
                  </Field>
                </FormGrid>
                <div className="border-t pt-5">
                  <Text size="xs" tone="muted">限制覆盖</Text>
                  <Text size="xs" tone="muted">留空继承 Skill；覆盖值只能更严格，不能放宽 Skill Version 的默认上限。</Text>
                </div>
                <FormGrid columns={2}>
                  <Field label="最大步数覆盖">
                    <Input name="maxStepsOverride" type="number" min={1} defaultValue={initial?.maxStepsOverride ? String(initial.maxStepsOverride) : undefined} />
                  </Field>
                  <Field label="最大输入 Token 覆盖">
                    <Input name="maxInputTokensOverride" type="number" min={1} defaultValue={initial?.maxInputTokensOverride ? String(initial.maxInputTokensOverride) : undefined} />
                  </Field>
                  <Field label="最大输出 Token 覆盖">
                    <Input name="maxOutputTokensOverride" type="number" min={1} defaultValue={initial?.maxOutputTokensOverride ? String(initial.maxOutputTokensOverride) : undefined} />
                  </Field>
                </FormGrid>
              </div>
            </DedicatedEditorSection>
            </>
          )}
        />

        <DedicatedEditorActions>
          <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
          <Button type="submit" variant="solid" color="primary">保存 Agent</Button>
        </DedicatedEditorActions>
      </div>
    </Form>
  );
}

function SkillEditor({
  value,
  fixture,
  onSave,
  onCancel,
}: {
  value: SkillFixture | "new";
  fixture: AISettingsFixture;
  onSave: (result: AISettingsEditorResult) => void;
  onCancel: () => void;
}) {
  const initial = value === "new" ? undefined : value;
  const triggers = initial?.allowedTriggers ?? ["manual", "cron"];
  const inputSchema = initial?.inputSchema ?? {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    additionalProperties: false,
  };

  return (
    <Form
      onFinish={(_, values) => {
        const capabilities = fixture.tools
          .filter((tool) => checked(values, `capability:${tool.name}`))
          .map((tool) => tool.name);
        const allowedTriggers = (["manual", "cron"] as const).filter((trigger) => checked(values, `trigger:${trigger}`));
        onSave({
          kind: "skill",
          id: initial?.id,
          value: {
            name: text(values, "name", initial?.name || "Custom Skill"),
            version: initial ? initial.version + 1 : 1,
            summary: text(values, "summary", initial?.summary || "自定义 Skill。"),
            capabilities,
            system: initial?.system ?? false,
            executionMode: text(values, "executionMode", initial?.executionMode || "advisory") as SkillFixture["executionMode"],
            updatedAt: "刚刚",
            systemPrompt: text(values, "systemPrompt", initial?.systemPrompt || "仅在明确授权范围内执行任务。"),
            contentPublishMode: text(values, "contentPublishMode", initial?.contentPublishMode || "approval") as SkillFixture["contentPublishMode"],
            allowedTriggers,
            maxSteps: numberValue(values, "maxSteps", initial?.maxSteps ?? 6),
            maxInputTokens: numberValue(values, "maxInputTokens", initial?.maxInputTokens ?? 16000),
            maxOutputTokens: numberValue(values, "maxOutputTokens", initial?.maxOutputTokens ?? 2000),
            defaultDailyRunLimit: numberValue(values, "defaultDailyRunLimit", initial?.defaultDailyRunLimit ?? 10),
            defaultMonthlyTokenBudget: numberValue(values, "defaultMonthlyTokenBudget", initial?.defaultMonthlyTokenBudget ?? 1000000),
            inputSchema: objectSchema(values, "inputSchema", inputSchema),
          },
        });
      }}
    >
      <div data-pattern="editor-form-composition" className="flex flex-col gap-5">

        <DedicatedEditorLayout
          primary={(
            <>
            <DedicatedEditorSection title="能力定义" description="先定义职责和固定指令，再决定允许它调用哪些 Tool。">
              <div className="flex flex-col gap-5">
                <Field label="Skill 名称" required>
                  <Input name="name" defaultValue={initial?.name} placeholder="SEO Review" />
                </Field>
                <Field label="说明">
                  <Input name="summary" defaultValue={initial?.summary} />
                </Field>
                <Field label="固定指令" hint="固定在 Skill Version 中；Agent 不能覆盖。">
                  <Textarea name="systemPrompt" defaultValue={initial?.systemPrompt} rows={7} className="type-family-mono" />
                </Field>
              </div>
            </DedicatedEditorSection>

            <DedicatedEditorSection title="Tool 授权" description="只勾选这项能力真正需要的 Tool；建议模式应避免写入型能力。">
              <div className="grid gap-3 sm:grid-cols-2">
                {fixture.tools.map((tool) => (
                  <label key={tool.name} className="flex min-w-0 items-start gap-3 rounded-md border p-4">
                    <Checkbox
                      name={`capability:${tool.name}`}
                      defaultChecked={initial?.capabilities.includes(tool.name) ?? false}
                    />
                    <span className="min-w-0 flex-1">
                      <strong className="block min-w-0 type-family-mono type-body-sm type-weight-semibold [overflow-wrap:anywhere]">{tool.name}</strong>
                      <Text size="xs" tone="muted">{tool.description}</Text>
                      <Text size="xs" tone="muted">风险：{tool.risk === "high" ? "高" : tool.risk === "medium" ? "中" : "低"}</Text>
                    </span>
                  </label>
                ))}
              </div>
            </DedicatedEditorSection>

            <DedicatedEditorSection title="输入契约" description="输入 Schema 是 Skill Version 的一部分，用来约束 Workflow 或人工运行传入的数据。">
              <Field label="输入 JSON Schema（Draft 2020-12）">
                <Textarea
                  name="inputSchema"
                  defaultValue={JSON.stringify(inputSchema, null, 2)}
                  rows={7}
                  className="type-family-mono"
                />
              </Field>
            </DedicatedEditorSection>
            </>
          )}
          secondary={(
            <>
            <DedicatedEditorSection title="执行与发布边界" description="执行模式、发布策略与允许触发器属于 Skill Version，不由 Agent 临时放宽。">
              <div className="flex flex-col gap-5">
                <Field label="执行模式">
                  <Select name="executionMode" defaultValue={initial?.executionMode || "advisory"}>
                    <option value="advisory">仅分析建议</option>
                    <option value="approval">生成审批提案</option>
                  </Select>
                </Field>
                <Field label="内容发布策略" hint="Agent 不能覆盖。">
                  <Select name="contentPublishMode" defaultValue={initial?.contentPublishMode || "approval"}>
                    <option value="approval">审批后创建</option>
                    <option value="draft">创建草稿</option>
                    <option value="publish">显式自动发布</option>
                  </Select>
                </Field>
                <div className="border-t pt-5">
                  <Text size="sm">允许触发器</Text>
                  <div className="mt-3 flex flex-col gap-3">
                    <label className="inline-flex items-center gap-2 type-body-sm type-weight-semibold">
                      <Checkbox name="trigger:manual" defaultChecked={triggers.includes("manual")} />
                      手动触发
                    </label>
                    <label className="inline-flex items-center gap-2 type-body-sm type-weight-semibold">
                      <Checkbox name="trigger:cron" defaultChecked={triggers.includes("cron")} />
                      Cron 定时
                    </label>
                  </div>
                </div>
                {initial ? (
                  <div className="grid grid-cols-2 gap-4 border-t pt-5">
                    <div><Text size="xs" tone="muted">当前版本</Text><strong className="mt-1 block type-body-sm type-weight-semibold">v{initial.version}</strong></div>
                    <div><Text size="xs" tone="muted">最近更新</Text><strong className="mt-1 block type-body-sm type-weight-semibold">{initial.updatedAt}</strong></div>
                  </div>
                ) : null}
              </div>
            </DedicatedEditorSection>

            <DedicatedEditorSection title="默认治理限制" description="这些是 Skill 的安全与成本上限；Agent 只能继承或进一步调低，不能放宽。">
              <div className="flex flex-col gap-5">
                <FormGrid columns={2}>
                  <Field label="Max steps">
                    <Input name="maxSteps" type="number" min={1} max={20} defaultValue={String(initial?.maxSteps ?? 6)} />
                  </Field>
                  <Field label="默认日运行上限">
                    <Input name="defaultDailyRunLimit" type="number" min={1} defaultValue={String(initial?.defaultDailyRunLimit ?? 10)} />
                  </Field>
                  <Field label="Max input tokens">
                    <Input name="maxInputTokens" type="number" min={1} defaultValue={String(initial?.maxInputTokens ?? 16000)} />
                  </Field>
                  <Field label="Max output tokens">
                    <Input name="maxOutputTokens" type="number" min={1} defaultValue={String(initial?.maxOutputTokens ?? 2000)} />
                  </Field>
                </FormGrid>
                <Field label="默认月 Token 预算">
                  <Input name="defaultMonthlyTokenBudget" type="number" min={1} defaultValue={String(initial?.defaultMonthlyTokenBudget ?? 1000000)} />
                </Field>
              </div>
            </DedicatedEditorSection>
            </>
          )}
        />

        <DedicatedEditorActions>
          <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
          <Button type="submit" variant="solid" color="primary">保存 Skill</Button>
        </DedicatedEditorActions>
      </div>
    </Form>
  );
}

function ProviderEditor({ value, onSave, onCancel, surface = "page" }: { value: ProviderFixture | "new"; onSave: (result: AISettingsEditorResult) => void; onCancel: () => void; surface?: AISettingsEditorSurface }) {
  const initial = value === "new" ? undefined : value;
  return (
    <Form
      id="ai-settings-provider-editor"
      onFinish={(_, values) => {
        onSave({
          kind: "provider",
          id: initial?.id,
          value: {
            name: text(values, "name", initial?.name || "Model Connection"),
            providerType: text(values, "providerType", initial?.providerType || "openai-compatible"),
            model: text(values, "model", initial?.model || "model-name"),
            baseUrl: text(values, "baseUrl", initial?.baseUrl || "https://api.example.com/v1"),
            apiKeyLast4: text(values, "apiKeyLast4", initial?.apiKeyLast4 || "••••"),
            enabled: checked(values, "enabled"),
            defaultWriting: initial?.defaultWriting ?? false,
            defaultImage: initial?.defaultImage ?? false,
          },
        });
      }}
    >
      <div data-pattern="editor-form-composition" className="flex flex-col gap-5">
        {surface === "page" ? (
          <ContextualEditorHeader
            title={initial ? `编辑模型连接：${initial.name}` : "添加模型连接"}
            description="连接身份、端点与凭据状态分组展示；真实 API Key 仍由服务端加密保存。"
            icon={<KeyRound />}
          />
        ) : null}
        <div className="grid gap-5 xl:grid-cols-2">
          <EditorFormSurfaceSection title="连接身份" description="定义这条模型连接在产品中的名称和协议类型。">
            <FormGrid columns={2}>
              <Field label="连接名称" required>
                <Input name="name" defaultValue={initial?.name} placeholder="OpenAI Production" />
              </Field>
              <Field label="Provider 类型">
                <Select name="providerType" defaultValue={initial?.providerType || "openai-compatible"}>
                  <option value="openai-compatible">OpenAI compatible</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="image">Image gateway</option>
                </Select>
              </Field>
            </FormGrid>
          </EditorFormSurfaceSection>
          <EditorFormSurfaceSection title="模型与端点" description="运行时请求只使用这里明确配置的端点和模型。">
            <div className="flex flex-col gap-5">
              <Field label="Base URL" required>
                <Input name="baseUrl" defaultValue={initial?.baseUrl} placeholder="https://api.openai.com/v1" />
              </Field>
              <Field label="Model" required>
                <Input name="model" defaultValue={initial?.model} placeholder="gpt-5.6-sol" />
              </Field>
            </div>
          </EditorFormSurfaceSection>
        </div>
        <EditorFormSurfaceSection title="凭据与状态" description="Showcase 只展示掩码与启停状态，不接触真实密钥。">
          <FormGrid columns={2}>
            <Field label="API Key 后四位" hint="仅用于展示密钥已保存状态；不输入真实凭证。">
              <Input name="apiKeyLast4" defaultValue={initial?.apiKeyLast4} maxLength={4} placeholder="1234" />
            </Field>
            <Field label="状态">
              <Switch name="enabled" defaultChecked={initial?.enabled ?? true} label="启用模型连接" />
            </Field>
          </FormGrid>
        </EditorFormSurfaceSection>
        {surface === "page" ? (
          <FormActions>
            <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
            <Button type="submit" variant="solid" color="primary">保存模型连接</Button>
          </FormActions>
        ) : null}
      </div>
    </Form>
  );
}

function EmbeddingEditor({ value, onSave, onCancel, surface = "page" }: { value: EmbeddingProfileFixture | "new"; onSave: (result: AISettingsEditorResult) => void; onCancel: () => void; surface?: AISettingsEditorSurface }) {
  const initial = value === "new" ? undefined : value;
  return (
    <Form
      id="ai-settings-embedding-editor"
      onFinish={(_, values) => {
        const dimensions = Number(text(values, "dimensions", String(initial?.dimensions || 1536)));
        onSave({
          kind: "embedding",
          id: initial?.id,
          value: {
            name: text(values, "name", initial?.name || "Blog Knowledge"),
            model: text(values, "model", initial?.model || "text-embedding-3-small"),
            baseUrl: text(values, "baseUrl", initial?.baseUrl || "https://api.openai.com/v1"),
            dimensions: Number.isFinite(dimensions) ? dimensions : 1536,
            apiKeyLast4: text(values, "apiKeyLast4", initial?.apiKeyLast4 || "••••"),
            enabled: checked(values, "enabled"),
          },
        });
      }}
    >
      <div data-pattern="editor-form-composition" className="flex flex-col gap-5">
        {surface === "page" ? (
          <ContextualEditorHeader
            title={initial ? `编辑 Embedding：${initial.name}` : "添加 Embedding 模型"}
            description="Embedding Profile 负责把已发布内容转换为可检索知识索引。"
            icon={<DatabaseZap />}
          />
        ) : null}
        <div className="grid gap-5 xl:grid-cols-2">
          <EditorFormSurfaceSection title="索引模型" description="明确 Profile、模型和向量维度，避免把索引参数与凭据混在一起。">
            <div className="flex flex-col gap-5">
              <Field label="Profile 名称" required><Input name="name" defaultValue={initial?.name} /></Field>
              <FormGrid columns={2}>
                <Field label="Model" required><Input name="model" defaultValue={initial?.model} /></Field>
                <Field label="向量维度"><Input name="dimensions" inputMode="numeric" defaultValue={String(initial?.dimensions || 1536)} /></Field>
              </FormGrid>
            </div>
          </EditorFormSurfaceSection>
          <EditorFormSurfaceSection title="连接与凭据" description="端点与凭据状态属于连接治理，不属于索引内容本身。">
            <div className="flex flex-col gap-5">
              <Field label="Base URL" required><Input name="baseUrl" defaultValue={initial?.baseUrl} /></Field>
              <FormGrid columns={2}>
                <Field label="API Key 后四位"><Input name="apiKeyLast4" defaultValue={initial?.apiKeyLast4} maxLength={4} placeholder="1234" /></Field>
                <Field label="状态"><Switch name="enabled" defaultChecked={initial?.enabled ?? true} label="启用 Embedding" /></Field>
              </FormGrid>
            </div>
          </EditorFormSurfaceSection>
        </div>
        {surface === "page" ? (
          <FormActions>
            <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
            <Button type="submit" variant="solid" color="primary">保存 Embedding</Button>
          </FormActions>
        ) : null}
      </div>
    </Form>
  );
}

function ConnectorEditor({ value, onSave, onCancel, surface = "page" }: { value: ConnectorFixture | "new"; onSave: (result: AISettingsEditorResult) => void; onCancel: () => void; surface?: AISettingsEditorSurface }) {
  const initial = value === "new" ? undefined : value;
  const [kind, setKind] = useState<ConnectorKind>(initial?.kind || "newsletter");
  const [sandbox, setSandbox] = useState(initial?.sandbox ?? true);

  return (
    <Form
      id="ai-settings-connector-editor"
      onFinish={(_, values) => {
        const credential = text(values, "credential");
        onSave({
          kind: "connector",
          id: initial?.id,
          value: {
            name: text(values, "name", initial?.name || "Sandbox Connector"),
            kind,
            enabled: checked(values, "enabled"),
            sandbox,
            configJson: text(values, "configJson", initial?.configJson || "{\n  \"rate_limit_per_minute\": 10\n}"),
            hasCredential: Boolean(credential || initial?.hasCredential),
            credentialLast4: credential ? credential.slice(-4) : initial?.credentialLast4,
          },
        });
      }}
    >
      <div data-pattern="editor-form-composition" className="flex flex-col gap-5">
        {surface === "page" ? (
          <ContextualEditorHeader
            title={initial ? `编辑 Connector：${initial.name}` : "添加 Connector Profile"}
            description="连接器只暴露显式授权能力；Fixture 使用假配置与假凭据，不执行真实 OAuth 或网络调用。"
            icon={<LockKeyhole />}
          />
        ) : null}
        <div className="grid gap-5 xl:grid-cols-2">
          <EditorFormSurfaceSection title="连接身份" description="定义 Connector 的产品名称、类型和启停状态；四种类型保持同一治理入口。">
            <div className="flex flex-col gap-5">
              <FormGrid columns={2}>
                <Field label="Profile 名称" required><Input name="name" defaultValue={initial?.name} placeholder="search-console" /></Field>
                <Field label="类型">
                  <Select
                    name="kind"
                    value={kind}
                    onChange={(value) => {
                      const next = (Array.isArray(value) ? value[0] : value) as ConnectorKind;
                      setKind(next || "newsletter");
                      if (next !== "search_console") setSandbox(true);
                    }}
                  >
                    <option value="search_console">Search Console</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="social">Social</option>
                    <option value="webhook">Webhook</option>
                  </Select>
                </Field>
              </FormGrid>
              <Field label="状态">
                <Switch name="enabled" defaultChecked={initial?.enabled ?? true} label="启用 Connector" />
              </Field>
            </div>
          </EditorFormSurfaceSection>
          <EditorFormSurfaceSection title="运行与凭据" description="Sandbox、配置 JSON 与凭据状态显式分离；只有 Search Console 可以切换到只读 Google OAuth。">
            <div className="flex flex-col gap-5">
              {kind === "search_console" ? (
                <Field label="连接模式">
                  <Switch
                    name="sandbox"
                    checked={sandbox}
                    onChange={(event) => setSandbox(event.currentTarget.checked)}
                    label="Sandbox（关闭后为只读 Google OAuth）"
                  />
                </Field>
              ) : (
                <Alert type="info" showIcon title="Sandbox only" description="Newsletter、Social 与 Webhook 在当前产品边界内只允许 Sandbox Mock，不执行真实外部写入。" />
              )}
              <Field label="配置 JSON">
                <Textarea
                  name="configJson"
                  className="type-family-mono"
                  defaultValue={initial?.configJson || "{\n  \"rate_limit_per_minute\": 10\n}"}
                  rows={6}
                  placeholder='{"client_id":"fixture-client","site_url":"sc-domain:example.com","rate_limit_per_minute":10}'
                />
              </Field>
              <Field
                label={sandbox ? "凭据（Fixture 可选）" : "Google OAuth Client Secret（Fixture 占位）"}
                hint={initial?.hasCredential ? `已配置凭据 •••• ${initial.credentialLast4 || "----"}；留空表示保留现有状态。` : "Showcase 永不保存真实凭据；输入值只用于模拟掩码状态。"}
              >
                <Input name="credential" type="password" autoComplete="off" placeholder={initial?.hasCredential ? "留空以保留" : "fixture-secret"} />
              </Field>
            </div>
          </EditorFormSurfaceSection>
        </div>
        {surface === "page" ? (
          <FormActions>
            <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
            <Button type="submit" variant="solid" color="primary">保存 Connector</Button>
          </FormActions>
        ) : null}
      </div>
    </Form>
  );
}

export function AISettingsEditor({ editor, fixture, onSave, onCancel, surface = "page" }: { editor: Exclude<AISettingsEditorState, null>; fixture: AISettingsFixture; onSave: (result: AISettingsEditorResult) => void; onCancel: () => void; surface?: AISettingsEditorSurface }) {
  switch (editor.kind) {
    case "agent":
      return <AgentEditor value={editor.value} fixture={fixture} onSave={onSave} onCancel={onCancel} />;
    case "skill":
      return <SkillEditor value={editor.value} fixture={fixture} onSave={onSave} onCancel={onCancel} />;
    case "provider":
      return <ProviderEditor value={editor.value} onSave={onSave} onCancel={onCancel} surface={surface} />;
    case "embedding":
      return <EmbeddingEditor value={editor.value} onSave={onSave} onCancel={onCancel} surface={surface} />;
    case "connector":
      return <ConnectorEditor value={editor.value} onSave={onSave} onCancel={onCancel} surface={surface} />;
  }
}
