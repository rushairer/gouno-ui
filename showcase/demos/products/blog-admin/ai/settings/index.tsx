import { useState } from "react";
import {
  Bot,
  DatabaseZap,
  GitBranch,
  KeyRound,
  ListChecks,
  LockKeyhole,
} from "lucide-react";
import { Alert, Modal, Segmented, Tabs, Text } from "../../../../../../src/core";
import { PageHeader } from "../../../../../../src/gouno";
import { FixtureDock } from "../../../../../components/fixture-dock";
import { AISettingsEditor, type AISettingsEditorResult, type AISettingsEditorState } from "./editors";
import {
  aiSettingsFixture,
  type AgentFixture,
  type AISettingsFixture,
  type AISettingsSection,
  type ConnectorOutboxFixture,
  type ConnectorFixture,
  type EmbeddingProfileFixture,
  type ProviderFixture,
  type SkillFixture,
} from "./fixtures";
import { AISettingsSectionPanel, type AISettingsSectionActions } from "./sections";

const validSections = new Set<AISettingsSection>([
  "agents",
  "skills",
  "tools",
  "knowledge",
  "providers",
  "connectors",
]);

const tabs = [
  { key: "agents", label: "Agents", icon: <Bot aria-hidden="true" className="size-4" /> },
  { key: "skills", label: "Skills", icon: <ListChecks aria-hidden="true" className="size-4" /> },
  { key: "tools", label: "Tools", icon: <GitBranch aria-hidden="true" className="size-4" /> },
  { key: "knowledge", label: "知识库", icon: <DatabaseZap aria-hidden="true" className="size-4" /> },
  { key: "providers", label: "模型连接", icon: <KeyRound aria-hidden="true" className="size-4" /> },
  { key: "connectors", label: "Sandbox 连接器", icon: <LockKeyhole aria-hidden="true" className="size-4" /> },
] as const;

type Notice = { type: "success" | "warning" | "info" | "error"; text: string } | null;
type MutationScenario = "success" | "save-error" | "delete-error" | "connection-error";
type DeleteTarget =
  | { kind: "agent"; value: AgentFixture }
  | { kind: "skill"; value: SkillFixture }
  | { kind: "provider"; value: ProviderFixture }
  | { kind: "embedding"; value: EmbeddingProfileFixture }
  | null;

const mutationOptions = [
  { value: "success", label: "操作成功" },
  { value: "save-error", label: "保存失败" },
  { value: "delete-error", label: "删除失败" },
  { value: "connection-error", label: "连接测试失败" },
] as const;

export function parseAISettingsRoute(value: string): AISettingsSection {
  const query = value.includes("?") ? value.slice(value.indexOf("?") + 1) : value.replace(/^\?/, "");
  const requested = new URLSearchParams(query).get("section") as AISettingsSection | null;
  return requested && validSections.has(requested) ? requested : "agents";
}

export function formatAISettingsRoute(section: AISettingsSection): string {
  return section === "agents" ? "/admin/ai-settings" : `/admin/ai-settings?section=${section}`;
}

function cloneFixture(): AISettingsFixture {
  return {
    ...aiSettingsFixture,
    agents: aiSettingsFixture.agents.map((item) => ({ ...item, capabilities: [...item.capabilities] })),
    skills: aiSettingsFixture.skills.map((item) => ({ ...item, capabilities: [...item.capabilities] })),
    tools: aiSettingsFixture.tools.map((item) => ({ ...item, surfaces: [...item.surfaces] })),
    knowledge: {
      profiles: aiSettingsFixture.knowledge.profiles.map((item) => ({ ...item })),
      index: { ...aiSettingsFixture.knowledge.index },
    },
    providers: aiSettingsFixture.providers.map((item) => ({ ...item })),
    connectors: aiSettingsFixture.connectors.map((item) => ({ ...item })),
    connectorOutbox: aiSettingsFixture.connectorOutbox.map((item) => ({ ...item })),
  };
}

function nextId(items: readonly { id: number }[]) {
  return items.reduce((highest, item) => Math.max(highest, item.id), 0) + 1;
}

function upsert<T extends { id: number }>(items: T[], item: T, existingId?: number): T[] {
  return existingId === undefined ? [...items, item] : items.map((current) => current.id === existingId ? item : current);
}

function deleteName(target: DeleteTarget) {
  return target?.value.name ?? "";
}

export function BlogAdminAISettingsDemo({ initialSection = "agents" }: { initialSection?: AISettingsSection }) {
  const [section, setSection] = useState<AISettingsSection>(initialSection);
  const [fixture, setFixture] = useState(cloneFixture);
  const [notice, setNotice] = useState<Notice>(null);
  const [editor, setEditor] = useState<AISettingsEditorState>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [mutationScenario, setMutationScenario] = useState<MutationScenario>("success");

  const changeSection = (next: AISettingsSection) => {
    setSection(next);
    setNotice(null);
    setEditor(null);
    setDeleteTarget(null);
  };

  const saveEditor = (result: AISettingsEditorResult) => {
    if (mutationScenario === "save-error") {
      setNotice({
        type: "error",
        text: `${result.value.name} 保存失败；编辑内容与当前表单保持不变，可直接重试（Showcase 模拟）。`,
      });
      return;
    }

    setFixture((current) => {
      switch (result.kind) {
        case "agent": {
          const item = { id: result.id ?? nextId(current.agents), ...result.value };
          return { ...current, agents: upsert(current.agents, item, result.id) };
        }
        case "skill": {
          const item = { id: result.id ?? nextId(current.skills), ...result.value };
          return { ...current, skills: upsert(current.skills, item, result.id) };
        }
        case "provider": {
          const item = { id: result.id ?? nextId(current.providers), ...result.value };
          return { ...current, providers: upsert(current.providers, item, result.id) };
        }
        case "embedding": {
          const item = { id: result.id ?? nextId(current.knowledge.profiles), ...result.value };
          return { ...current, knowledge: { ...current.knowledge, profiles: upsert(current.knowledge.profiles, item, result.id) } };
        }
        case "connector": {
          const item = { id: result.id ?? nextId(current.connectors), ...result.value };
          return { ...current, connectors: upsert(current.connectors, item, result.id) };
        }
      }
    });
    setEditor(null);
    setNotice({ type: "success", text: `${result.value.name} 已保存到静态 Fixture。` });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const name = deleteName(deleteTarget);
    if (mutationScenario === "delete-error") {
      setNotice({
        type: "error",
        text: `${name} 删除失败；当前对象与确认窗口保持不变，可直接重试（Showcase 模拟）。`,
      });
      return;
    }

    setFixture((current) => {
      switch (deleteTarget.kind) {
        case "agent": return { ...current, agents: current.agents.filter((item) => item.id !== deleteTarget.value.id) };
        case "skill": return { ...current, skills: current.skills.filter((item) => item.id !== deleteTarget.value.id) };
        case "provider": return { ...current, providers: current.providers.filter((item) => item.id !== deleteTarget.value.id) };
        case "embedding": return { ...current, knowledge: { ...current.knowledge, profiles: current.knowledge.profiles.filter((item) => item.id !== deleteTarget.value.id) } };
      }
    });
    setDeleteTarget(null);
    setNotice({ type: "success", text: `${name} 已从静态 Fixture 删除。` });
  };

  const toggleAgent = (agent: AgentFixture) => {
    setFixture((current) => ({ ...current, agents: current.agents.map((item) => item.id === agent.id ? { ...item, enabled: !item.enabled } : item) }));
    setNotice({ type: "success", text: `${agent.name} 已${agent.enabled ? "停用" : "启用"}。` });
  };

  const setDefaultProvider = (id: number, usage: "writing" | "image") => {
    setFixture((current) => ({
      ...current,
      providers: current.providers.map((provider) => ({
        ...provider,
        defaultWriting: usage === "writing" ? provider.id === id : provider.defaultWriting,
        defaultImage: usage === "image" ? provider.id === id : provider.defaultImage,
      })),
    }));
    setNotice({ type: "success", text: `${usage === "writing" ? "默认文本模型" : "默认图片模型"}已更新。` });
  };

  const importSkill = () => {
    setFixture((current) => {
      const id = nextId(current.skills);
      return { ...current, skills: [...current.skills, { id, name: `Imported Skill ${id}`, version: 1, summary: "从静态 JSON Fixture 模拟导入。", capabilities: ["read_post"], system: false, executionMode: "advisory", updatedAt: "刚刚" }] };
    });
    setNotice({ type: "success", text: "已模拟导入一个 Skill JSON。" });
  };

  const importProviders = () => {
    setFixture((current) => {
      const id = nextId(current.providers);
      return { ...current, providers: [...current.providers, { id, name: `Imported Gateway ${id}`, providerType: "openai-compatible", model: "imported-model", baseUrl: "https://imported.example/v1", apiKeyLast4: "0000", enabled: false, defaultWriting: false, defaultImage: false }] };
    });
    setNotice({ type: "success", text: "已模拟导入模型连接配置；真实密钥不会进入 Showcase。" });
  };

  const copySkill = (skill: SkillFixture) => {
    setFixture((current) => ({ ...current, skills: [...current.skills, { ...skill, id: nextId(current.skills), name: `${skill.name} Copy`, system: false, version: 1, updatedAt: "刚刚", capabilities: [...skill.capabilities] }] }));
    setNotice({ type: "success", text: `${skill.name} 已创建自定义副本。` });
  };

  const startConnectorOAuth = (connector: ConnectorFixture) => {
    setFixture((current) => ({ ...current, connectors: current.connectors.map((item) => item.id === connector.id ? { ...item, status: "connected", hasCredential: true, lastChecked: "刚刚" } : item) }));
    setNotice({ type: "info", text: `${connector.name} 已模拟完成${connector.sandbox ? " Mock" : "只读"} OAuth 回调。` });
  };

  const queueOutbox = () => {
    const connector = fixture.connectors[0];
    if (!connector) {
      setNotice({ type: "warning", text: "请先添加 Connector Profile。" });
      return;
    }
    setFixture((current) => {
      const id = nextId(current.connectorOutbox);
      const item: ConnectorOutboxFixture = { id, connectorId: connector.id, idempotencyKey: `fixture-${id}`, status: "awaiting_approval" };
      return { ...current, connectorOutbox: [item, ...current.connectorOutbox] };
    });
    setNotice({ type: "success", text: "Outbox 项已加入待审批队列。" });
  };

  const actOnOutbox: AISettingsSectionActions["onOutboxAction"] = (item, action) => {
    const nextStatus = { approve: "approved", deliver: "delivered", retry: "awaiting_approval", revoke: "revoked" }[action] as ConnectorOutboxFixture["status"];
    setFixture((current) => ({ ...current, connectorOutbox: current.connectorOutbox.map((currentItem) => currentItem.id === item.id ? { ...currentItem, status: nextStatus, error: action === "retry" ? undefined : currentItem.error } : currentItem) }));
    setNotice({ type: "success", text: `Outbox #${item.id} 已更新为${nextStatus === "approved" ? "已批准" : nextStatus === "delivered" ? "已模拟投递" : nextStatus === "revoked" ? "已撤销" : "待审批"}。` });
  };

  const testConnection = (name: string, kind: "provider" | "embedding") => {
    if (mutationScenario === "connection-error") {
      setNotice({ type: "error", text: `${name}：连接测试失败；请检查 Base URL、模型名与凭证后重试（Showcase 模拟）。` });
      return;
    }
    setNotice({ type: "success", text: `${name}：${kind === "embedding" ? "Embedding " : ""}连接测试成功。` });
  };

  const actions: AISettingsSectionActions = {
    onCreateAgent: () => {
      if (!fixture.providers.some((item) => item.enabled)) {
        setNotice({ type: "warning", text: "请先配置一个可用的模型连接。" });
        setSection("providers");
        return;
      }
      setEditor({ kind: "agent", value: "new" });
    },
    onEditAgent: (agent) => setEditor({ kind: "agent", value: agent }),
    onDeleteAgent: (agent) => setDeleteTarget({ kind: "agent", value: agent }),
    onRunAgent: (agent) => setNotice({ type: "success", text: `${agent.name} 已排队运行；运行证据会进入 AI 运营的运行中心。` }),
    onToggleAgent: toggleAgent,
    onImportSkill: importSkill,
    onCreateSkill: () => setEditor({ kind: "skill", value: "new" }),
    onExportSkill: (skill) => setNotice({ type: "info", text: `${skill.name} v${skill.version} 的静态 JSON 已准备导出。` }),
    onCopySkill: copySkill,
    onEditSkill: (skill) => setEditor({ kind: "skill", value: skill }),
    onDeleteSkill: (skill) => setDeleteTarget({ kind: "skill", value: skill }),
    onRetryIndex: () => setNotice({ type: "success", text: "失败索引任务已重新排队。" }),
    onRebuildIndex: () => setNotice({ type: "warning", text: "已模拟通过近期 MFA 后请求全量重建知识索引。" }),
    onCreateEmbedding: () => setEditor({ kind: "embedding", value: "new" }),
    onTestEmbedding: (profile) => testConnection(profile.name, "embedding"),
    onEditEmbedding: (profile) => setEditor({ kind: "embedding", value: profile }),
    onDeleteEmbedding: (profile) => setDeleteTarget({ kind: "embedding", value: profile }),
    onExportProviders: () => setNotice({ type: "info", text: "已模拟通过近期 MFA 后导出模型连接配置；凭证保持掩码。" }),
    onImportProviders: importProviders,
    onCreateProvider: () => setEditor({ kind: "provider", value: "new" }),
    onSetDefaultProvider: setDefaultProvider,
    onTestProvider: (provider) => testConnection(provider.name, "provider"),
    onEditProvider: (provider) => setEditor({ kind: "provider", value: provider }),
    onDeleteProvider: (provider) => setDeleteTarget({ kind: "provider", value: provider }),
    onCreateConnector: () => setEditor({ kind: "connector", value: "new" }),
    onEditConnector: (connector) => setEditor({ kind: "connector", value: connector }),
    onStartConnectorOAuth: startConnectorOAuth,
    onQueueOutbox: queueOutbox,
    onOutboxAction: actOnOutbox,
  };

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route={formatAISettingsRoute(section)}
        note="AI 设置是独立的管理路由族；Showcase 模拟 CRUD、保存/删除/连接失败、MFA 后配置、OAuth 与 Outbox 状态，但不保存真实凭证或调用真实 Agent/Connector API。"
        controls={(
          <Segmented<MutationScenario>
            aria-label="AI 设置操作场景"
            options={mutationOptions}
            value={mutationScenario}
            onChange={(value) => { setMutationScenario(value); setNotice(null); }}
            block
          />
        )}
      />
      <PageHeader title="AI 设置" description="管理 Agent、Skill、Tool、知识索引、模型连接与 Sandbox 连接器。" />
      <Tabs<AISettingsSection> activeKey={section} items={tabs} onChange={changeSection} ariaLabel="AI 设置栏目" />
      {notice ? <Alert type={notice.type} showIcon title={notice.text} /> : null}
      {editor ? <AISettingsEditor editor={editor} fixture={fixture} onSave={saveEditor} onCancel={() => setEditor(null)} /> : <AISettingsSectionPanel fixture={fixture} section={section} actions={actions} />}
      <Modal
        open={Boolean(deleteTarget)}
        title="确认删除"
        description="此处只修改静态 Fixture；真实产品删除操作仍由后端权限、近期 MFA 与确认流程约束。"
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onOk={confirmDelete}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ variant: "solid", color: "error" }}
        closeOnBackdrop
      >
        <Text>确定删除「{deleteName(deleteTarget)}」吗？</Text>
      </Modal>
    </div>
  );
}

export { aiSettingsFixture };
