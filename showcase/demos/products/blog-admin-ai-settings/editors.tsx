import type { ReactNode } from "react";
import { Bot, DatabaseZap, KeyRound, ListChecks, LockKeyhole } from "lucide-react";
import {
  Button,
  Card,
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
} from "../../../../src/core";
import type {
  AgentFixture,
  AISettingsFixture,
  ConnectorFixture,
  EmbeddingProfileFixture,
  ProviderFixture,
  SkillFixture,
} from "./fixtures";

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

function text(values: Record<string, FormDataEntryValue>, key: string, fallback = "") {
  const value = values[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function checked(values: Record<string, FormDataEntryValue>, key: string) {
  return values[key] === "on";
}

function EditorHeader({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <Heading level={2} className="text-lg">{title}</Heading>
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
    <Card padding="base">
      <Form
        onFinish={(_, values) => {
          const providerName = text(values, "provider", defaultProvider);
          const skillName = text(values, "skill", defaultSkill);
          const skill = fixture.skills.find((item) => item.name === skillName);
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
            },
          });
        }}
      >
        <EditorHeader
          title={initial ? `编辑 Agent：${initial.name}` : "创建 Agent"}
          description="配置模型连接、Skill Version、调度与启停状态；Showcase 只保存当前静态会话。"
          icon={<Bot />}
        />
        <FormGrid columns={2}>
          <Field label="Agent 名称" required>
            <Input name="name" defaultValue={initial?.name} placeholder="Content Maintainer" />
          </Field>
          <Field label="模型连接" required>
            <Select name="provider" defaultValue={defaultProvider}>
              {fixture.providers.filter((item) => item.enabled).map((provider) => (
                <option key={provider.id} value={provider.name}>{provider.name} · {provider.model}</option>
              ))}
            </Select>
          </Field>
          <Field label="Skill" required>
            <Select name="skill" defaultValue={defaultSkill}>
              {fixture.skills.map((skill) => (
                <option key={skill.id} value={skill.name}>{skill.name} · v{skill.version}</option>
              ))}
            </Select>
          </Field>
          <Field label="运行计划">
            <Input name="schedule" defaultValue={initial?.schedule || "手动"} placeholder="30 8 * * *" />
          </Field>
          <Field label="时区">
            <Input name="timezone" defaultValue={initial?.timezone || "Asia/Shanghai"} />
          </Field>
          <Field label="状态">
            <Switch name="enabled" defaultChecked={initial?.enabled ?? false} label="启用 Agent" />
          </Field>
        </FormGrid>
        <Field label="描述">
          <Textarea name="description" defaultValue={initial?.description} rows={3} />
        </Field>
        <FormActions>
          <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
          <Button type="submit" variant="solid" color="primary">保存 Agent</Button>
        </FormActions>
      </Form>
    </Card>
  );
}

function SkillEditor({ value, onSave, onCancel }: { value: SkillFixture | "new"; onSave: (result: AISettingsEditorResult) => void; onCancel: () => void }) {
  const initial = value === "new" ? undefined : value;
  return (
    <Card padding="base">
      <Form
        onFinish={(_, values) => {
          const capabilities = text(values, "capabilities", initial?.capabilities.join(", ") || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          onSave({
            kind: "skill",
            id: initial?.id,
            value: {
              name: text(values, "name", initial?.name || "Custom Skill"),
              version: initial?.version ?? 1,
              summary: text(values, "summary", initial?.summary || "自定义 Skill。"),
              capabilities,
              system: initial?.system ?? false,
              executionMode: text(values, "executionMode", initial?.executionMode || "advisory") as SkillFixture["executionMode"],
              updatedAt: "刚刚",
            },
          });
        }}
      >
        <EditorHeader
          title={initial ? `编辑 Skill：${initial.name}` : "创建 Skill"}
          description="管理可版本化能力定义、执行模式与 Tool capability 边界。"
          icon={<ListChecks />}
        />
        <FormGrid columns={2}>
          <Field label="Skill 名称" required>
            <Input name="name" defaultValue={initial?.name} placeholder="SEO Review" />
          </Field>
          <Field label="执行模式">
            <Select name="executionMode" defaultValue={initial?.executionMode || "advisory"}>
              <option value="advisory">建议模式</option>
              <option value="approval">审批后执行</option>
            </Select>
          </Field>
        </FormGrid>
        <Field label="说明">
          <Textarea name="summary" defaultValue={initial?.summary} rows={3} />
        </Field>
        <Field label="Capabilities" hint="使用逗号分隔，与受控 Tool capability 名称保持一致。">
          <Input name="capabilities" defaultValue={initial?.capabilities.join(", ")} placeholder="read_post, citation_check" />
        </Field>
        <FormActions>
          <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
          <Button type="submit" variant="solid" color="primary">保存 Skill</Button>
        </FormActions>
      </Form>
    </Card>
  );
}

function ProviderEditor({ value, onSave, onCancel }: { value: ProviderFixture | "new"; onSave: (result: AISettingsEditorResult) => void; onCancel: () => void }) {
  const initial = value === "new" ? undefined : value;
  return (
    <Card padding="base">
      <Form
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
        <EditorHeader
          title={initial ? `编辑模型连接：${initial.name}` : "添加模型连接"}
          description="真实 API Key 由服务端加密保存；Showcase 只显示掩码和静态连接状态。"
          icon={<KeyRound />}
        />
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
          <Field label="Base URL" required>
            <Input name="baseUrl" defaultValue={initial?.baseUrl} placeholder="https://api.openai.com/v1" />
          </Field>
          <Field label="Model" required>
            <Input name="model" defaultValue={initial?.model} placeholder="gpt-5.6-sol" />
          </Field>
          <Field label="API Key 后四位" hint="仅用于展示密钥已保存状态；不输入真实凭证。">
            <Input name="apiKeyLast4" defaultValue={initial?.apiKeyLast4} maxLength={4} placeholder="1234" />
          </Field>
          <Field label="状态">
            <Switch name="enabled" defaultChecked={initial?.enabled ?? true} label="启用模型连接" />
          </Field>
        </FormGrid>
        <FormActions>
          <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
          <Button type="submit" variant="solid" color="primary">保存模型连接</Button>
        </FormActions>
      </Form>
    </Card>
  );
}

function EmbeddingEditor({ value, onSave, onCancel }: { value: EmbeddingProfileFixture | "new"; onSave: (result: AISettingsEditorResult) => void; onCancel: () => void }) {
  const initial = value === "new" ? undefined : value;
  return (
    <Card padding="base">
      <Form
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
        <EditorHeader
          title={initial ? `编辑 Embedding：${initial.name}` : "添加 Embedding 模型"}
          description="Embedding Profile 负责把已发布内容转换为可检索知识索引。"
          icon={<DatabaseZap />}
        />
        <FormGrid columns={2}>
          <Field label="Profile 名称" required>
            <Input name="name" defaultValue={initial?.name} />
          </Field>
          <Field label="Model" required>
            <Input name="model" defaultValue={initial?.model} />
          </Field>
          <Field label="Base URL" required>
            <Input name="baseUrl" defaultValue={initial?.baseUrl} />
          </Field>
          <Field label="向量维度">
            <Input name="dimensions" inputMode="numeric" defaultValue={String(initial?.dimensions || 1536)} />
          </Field>
          <Field label="API Key 后四位">
            <Input name="apiKeyLast4" defaultValue={initial?.apiKeyLast4} maxLength={4} placeholder="1234" />
          </Field>
          <Field label="状态">
            <Switch name="enabled" defaultChecked={initial?.enabled ?? true} label="启用 Embedding" />
          </Field>
        </FormGrid>
        <FormActions>
          <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
          <Button type="submit" variant="solid" color="primary">保存 Embedding</Button>
        </FormActions>
      </Form>
    </Card>
  );
}

function ConnectorEditor({ value, onSave, onCancel }: { value: ConnectorFixture | "new"; onSave: (result: AISettingsEditorResult) => void; onCancel: () => void }) {
  const initial = value === "new" ? undefined : value;
  return (
    <Card padding="base">
      <Form
        onFinish={(_, values) => {
          onSave({
            kind: "connector",
            id: initial?.id,
            value: {
              name: text(values, "name", initial?.name || "Sandbox Connector"),
              kind: text(values, "kind", initial?.kind || "newsletter"),
              status: initial?.status || "disabled",
              scope: text(values, "scope", initial?.scope || "Sandbox only"),
              sandbox: checked(values, "sandbox"),
              hasCredential: checked(values, "hasCredential"),
              lastChecked: "刚刚",
            },
          });
        }}
      >
        <EditorHeader
          title={initial ? `编辑 Connector：${initial.name}` : "添加 Connector Profile"}
          description="连接器只暴露显式授权能力；真实 OAuth、凭据和网络调用不进入 Showcase。"
          icon={<LockKeyhole />}
        />
        <FormGrid columns={2}>
          <Field label="Profile 名称" required>
            <Input name="name" defaultValue={initial?.name} placeholder="search-console" />
          </Field>
          <Field label="类型">
            <Select name="kind" defaultValue={initial?.kind || "newsletter"}>
              <option value="search_console">Search Console</option>
              <option value="newsletter">Newsletter</option>
              <option value="social">Social</option>
              <option value="webhook">Webhook</option>
            </Select>
          </Field>
          <Field label="授权范围">
            <Input name="scope" defaultValue={initial?.scope} placeholder="只读公网研究" />
          </Field>
          <Field label="运行模式">
            <div className="flex flex-col gap-3">
              <Switch name="sandbox" defaultChecked={initial?.sandbox ?? true} label="Sandbox" />
              <Switch name="hasCredential" defaultChecked={initial?.hasCredential ?? false} label="已配置凭据" />
            </div>
          </Field>
        </FormGrid>
        <FormActions>
          <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
          <Button type="submit" variant="solid" color="primary">保存 Connector</Button>
        </FormActions>
      </Form>
    </Card>
  );
}

export function AISettingsEditor({ editor, fixture, onSave, onCancel }: { editor: Exclude<AISettingsEditorState, null>; fixture: AISettingsFixture; onSave: (result: AISettingsEditorResult) => void; onCancel: () => void }) {
  switch (editor.kind) {
    case "agent":
      return <AgentEditor value={editor.value} fixture={fixture} onSave={onSave} onCancel={onCancel} />;
    case "skill":
      return <SkillEditor value={editor.value} onSave={onSave} onCancel={onCancel} />;
    case "provider":
      return <ProviderEditor value={editor.value} onSave={onSave} onCancel={onCancel} />;
    case "embedding":
      return <EmbeddingEditor value={editor.value} onSave={onSave} onCancel={onCancel} />;
    case "connector":
      return <ConnectorEditor value={editor.value} onSave={onSave} onCancel={onCancel} />;
  }
}