import {
  Check,
  Copy,
  DatabaseZap,
  Download,
  Edit2,
  KeyRound,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  ShieldOff,
  TestTube2,
  Trash2,
  Upload,
} from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Heading,
  IconButton,
  Select,
  Tag,
  Text,
} from "../../../../src/core";
import { TabPanelLead } from "../../../components/tab-panel-lead";
import type {
  AgentFixture,
  AISettingsFixture,
  AISettingsSection,
  ConnectorFixture,
  ConnectorOutboxFixture,
  ConnectorOutboxStatus,
  EmbeddingProfileFixture,
  ProviderFixture,
  SkillFixture,
} from "./fixtures";

export interface AISettingsSectionActions {
  onCreateAgent: () => void;
  onEditAgent: (agent: AgentFixture) => void;
  onDeleteAgent: (agent: AgentFixture) => void;
  onRunAgent: (agent: AgentFixture) => void;
  onToggleAgent: (agent: AgentFixture) => void;
  onImportSkill: () => void;
  onCreateSkill: () => void;
  onExportSkill: (skill: SkillFixture) => void;
  onCopySkill: (skill: SkillFixture) => void;
  onEditSkill: (skill: SkillFixture) => void;
  onDeleteSkill: (skill: SkillFixture) => void;
  onRetryIndex: () => void;
  onRebuildIndex: () => void;
  onCreateEmbedding: () => void;
  onTestEmbedding: (profile: EmbeddingProfileFixture) => void;
  onEditEmbedding: (profile: EmbeddingProfileFixture) => void;
  onDeleteEmbedding: (profile: EmbeddingProfileFixture) => void;
  onExportProviders: () => void;
  onImportProviders: () => void;
  onCreateProvider: () => void;
  onSetDefaultProvider: (id: number, usage: "writing" | "image") => void;
  onTestProvider: (provider: ProviderFixture) => void;
  onEditProvider: (provider: ProviderFixture) => void;
  onDeleteProvider: (provider: ProviderFixture) => void;
  onCreateConnector: () => void;
  onEditConnector: (connector: ConnectorFixture) => void;
  onStartConnectorOAuth: (connector: ConnectorFixture) => void;
  onQueueOutbox: () => void;
  onOutboxAction: (item: ConnectorOutboxFixture, action: "approve" | "deliver" | "retry" | "revoke") => void;
}

function AgentList({ fixture, actions }: { fixture: AISettingsFixture; actions: AISettingsSectionActions }) {
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead
        description="Skill Version + 模型连接 + 运行计划组成可审计的执行单元。"
        actions={<Button size="small" variant="solid" color="primary" icon={<Plus />} onClick={actions.onCreateAgent}>创建 Agent</Button>}
      />
      {fixture.providers.length === 0 ? (
        <Alert type="warning" showIcon title="先添加模型连接" description="保存首个可用模型连接后再创建 Agent。" />
      ) : null}
      <Card padding="none" className="overflow-hidden">
        <CardContent className="divide-y p-0">
          {fixture.agents.map((agent) => (
            <div key={agent.id} className="flex flex-col gap-4 p-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>{agent.name}</strong>
                  <Tag color={agent.enabled ? "success" : "default"}>{agent.enabled ? "已启用" : "已停用"}</Tag>
                  {agent.system ? <Tag color="primary">默认能力</Tag> : <Tag>自定义</Tag>}
                </div>
                <Text size="sm" tone="muted">{agent.description}</Text>
                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
                  <span>Provider: {agent.provider}</span>
                  <span>Skill: {agent.skill} v{agent.skillVersion}</span>
                  <span>{agent.schedule} · {agent.timezone}</span>
                  <span>{agent.latestRun}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((capability) => <Tag key={capability}>{capability}</Tag>)}
                </div>
              </div>
              <div className="flex min-w-max shrink-0 flex-nowrap items-center gap-1">
                <IconButton label={`运行 ${agent.name}`} icon={<Play />} variant="ghost" disabled={!agent.enabled} onClick={() => actions.onRunAgent(agent)} />
                <IconButton label={`编辑 ${agent.name}`} icon={<Edit2 />} variant="ghost" onClick={() => actions.onEditAgent(agent)} />
                <Button size="small" variant="ghost" onClick={() => actions.onToggleAgent(agent)}>{agent.enabled ? "停用" : "启用"}</Button>
                {!agent.system ? <IconButton label={`删除 ${agent.name}`} icon={<Trash2 />} variant="ghost" color="error" onClick={() => actions.onDeleteAgent(agent)} /> : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SkillList({ skills, actions }: { skills: SkillFixture[]; actions: AISettingsSectionActions }) {
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead
        description="管理可复用、可版本化的 AI 能力定义；系统 Skill 与团队副本保持清晰边界。"
        actions={(
          <>
            <Button size="small" variant="outline" icon={<Upload />} onClick={actions.onImportSkill}>导入 Skill</Button>
            <Button size="small" variant="solid" color="primary" icon={<Plus />} onClick={actions.onCreateSkill}>创建 Skill</Button>
          </>
        )}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {skills.map((skill) => (
          <Card key={skill.id} padding="base">
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <strong>{skill.name}</strong>
                    <Tag color={skill.system ? "primary" : "default"}>{skill.system ? "系统 Skill" : "自定义"}</Tag>
                    <Tag color={skill.executionMode === "approval" ? "warning" : "default"}>{skill.executionMode === "approval" ? "审批模式" : "建议模式"}</Tag>
                  </div>
                  <Text size="xs" tone="muted">v{skill.version} · {skill.updatedAt}</Text>
                </div>
              </div>
              <Text size="sm" tone="muted">{skill.summary}</Text>
              <div className="flex flex-wrap gap-2">
                {skill.capabilities.map((capability) => <Tag key={capability}>{capability}</Tag>)}
              </div>
              <div className="mt-auto flex flex-wrap gap-2 border-t pt-4">
                <Button size="small" variant="ghost" icon={<Download />} onClick={() => actions.onExportSkill(skill)}>导出</Button>
                <Button size="small" variant="ghost" icon={<Copy />} onClick={() => actions.onCopySkill(skill)}>复制</Button>
                <Button size="small" variant="ghost" icon={<Edit2 />} onClick={() => actions.onEditSkill(skill)}>编辑</Button>
                {!skill.system ? <Button size="small" variant="ghost" color="error" icon={<Trash2 />} onClick={() => actions.onDeleteSkill(skill)}>删除</Button> : null}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ToolList({ fixture }: { fixture: AISettingsFixture }) {
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead description="由代码发布的受控能力目录；Workflow 不直接调用 Tool，必须经过 Skill/Agent 授权。" />
      <Card padding="none" className="overflow-hidden">
        <CardContent className="divide-y p-0">
          {fixture.tools.map((tool) => (
            <div key={tool.name} className="grid gap-3 p-6 md:grid-cols-[minmax(0,1fr)_minmax(8rem,0.3fr)_auto] md:items-center">
              <div><strong className="font-mono text-sm">{tool.name}</strong><Text size="xs" tone="muted">{tool.description}</Text></div>
              <Text size="sm">{tool.surfaces.join(", ")}</Text>
              <Tag color={tool.risk === "high" ? "error" : tool.risk === "medium" ? "warning" : "success"}>{tool.risk === "high" ? "高风险" : tool.risk === "medium" ? "中风险" : "低风险"}</Tag>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function KnowledgePanel({ fixture, actions }: { fixture: AISettingsFixture["knowledge"]; actions: AISettingsSectionActions }) {
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead
        description="仅索引已发布文章；Embedding Profile 负责把内容转换为可检索知识库。"
        actions={(
          <>
            <Button size="small" variant="outline" icon={<RefreshCw />} onClick={actions.onRetryIndex}>重试失败任务</Button>
            <Button size="small" variant="outline" icon={<DatabaseZap />} onClick={actions.onRebuildIndex}>全量重建</Button>
            <Button size="small" variant="solid" color="primary" icon={<Plus />} onClick={actions.onCreateEmbedding}>添加 Embedding 模型</Button>
          </>
        )}
      />
      <Alert type="info" showIcon title="敏感配置需要近期 MFA" description="真实产品中添加、编辑、删除 Embedding 配置和全量重建需要近期多因素认证；Showcase 仅展示解锁后的配置面。" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card padding="base"><Text size="xs" tone="muted">分段</Text><Heading level={2}>{fixture.index.chunks}</Heading></Card>
        <Card padding="base"><Text size="xs" tone="muted">队列</Text><Heading level={2}>{fixture.index.queued}</Heading></Card>
        <Card padding="base"><Text size="xs" tone="muted">失败</Text><Heading level={2}>{fixture.index.failed}</Heading></Card>
      </div>
      {fixture.index.failed ? <Alert type="warning" showIcon title="知识索引存在失败任务" description="优先重试失败项；只有索引结构变化或一致性异常时才执行全量重建。" /> : null}
      <Card padding="none" className="overflow-hidden">
        <CardContent className="divide-y p-0">
          {fixture.profiles.map((profile) => (
            <div key={profile.id} className="flex flex-col gap-4 p-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><strong>{profile.name}</strong><Tag color={profile.enabled ? "success" : "default"}>{profile.enabled ? "已启用" : "已停用"}</Tag></div>
                <Text size="xs" tone="muted">{profile.model} · {profile.dimensions} dimensions</Text>
                <Text size="xs" tone="muted" className="break-all">{profile.baseUrl} · API Key •••• {profile.apiKeyLast4}</Text>
              </div>
              <div className="flex min-w-max flex-nowrap items-center gap-1">
                <IconButton label={`测试 ${profile.name}`} icon={<TestTube2 />} variant="ghost" onClick={() => actions.onTestEmbedding(profile)} />
                <IconButton label={`编辑 ${profile.name}`} icon={<Edit2 />} variant="ghost" onClick={() => actions.onEditEmbedding(profile)} />
                <IconButton label={`删除 ${profile.name}`} icon={<Trash2 />} variant="ghost" color="error" onClick={() => actions.onDeleteEmbedding(profile)} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Text size="xs" tone="muted">最近重建：{fixture.index.lastRebuiltAt}</Text>
    </div>
  );
}

function ProviderList({ providers, actions }: { providers: ProviderFixture[]; actions: AISettingsSectionActions }) {
  const writing = providers.find((item) => item.defaultWriting)?.id;
  const image = providers.find((item) => item.defaultImage)?.id;
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead
        description="管理模型连接、密钥状态以及文本与图片生成的默认用途。"
        actions={(
          <>
            <Button size="small" variant="outline" icon={<Download />} onClick={actions.onExportProviders}>导出模型连接</Button>
            <Button size="small" variant="outline" icon={<Upload />} onClick={actions.onImportProviders}>导入模型连接</Button>
            <Button size="small" variant="solid" color="primary" icon={<Plus />} onClick={actions.onCreateProvider}>添加模型连接</Button>
          </>
        )}
      />
      <Alert type="info" showIcon title="模型连接与密钥保护" description="真实产品中添加、修改、导出或删除模型连接需要近期 MFA；真实 API Key 不进入 Showcase。" />
      <Card padding="base">
        <div className="flex flex-col gap-4">
          <div><Heading level={2} className="text-base">默认用途</Heading><Text size="sm" tone="muted">决定编辑器、运营分析与图片生成默认使用的模型。</Text></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2"><Text size="sm">文本模型</Text><Select value={writing ? String(writing) : ""} onChange={(value) => actions.onSetDefaultProvider(Number(value), "writing")}><option value="">未设置</option>{providers.filter((item) => item.enabled).map((provider) => <option key={provider.id} value={String(provider.id)}>{provider.name} · {provider.model}</option>)}</Select></div>
            <div className="flex flex-col gap-2"><Text size="sm">图片生成</Text><Select value={image ? String(image) : ""} onChange={(value) => actions.onSetDefaultProvider(Number(value), "image")}><option value="">未设置</option>{providers.filter((item) => item.enabled).map((provider) => <option key={provider.id} value={String(provider.id)}>{provider.name} · {provider.model}</option>)}</Select></div>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {providers.map((provider) => (
          <Card key={provider.id} padding="base">
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-start justify-between gap-3"><div><strong>{provider.name}</strong><Text size="xs" tone="muted">{provider.providerType} · {provider.model}</Text></div><Tag color={provider.enabled ? "success" : "default"}>{provider.enabled ? "可用" : "停用"}</Tag></div>
              <Text size="xs" tone="muted" className="break-all">{provider.baseUrl}</Text>
              <Text size="xs" tone="muted">API Key •••• {provider.apiKeyLast4}</Text>
              <div className="flex flex-wrap gap-2">{provider.defaultWriting ? <Tag color="primary">默认文本模型</Tag> : null}{provider.defaultImage ? <Tag color="primary">默认图片模型</Tag> : null}</div>
              <div className="mt-auto flex flex-wrap gap-2 border-t pt-4">
                <Button size="small" variant="ghost" icon={<TestTube2 />} disabled={!provider.enabled} onClick={() => actions.onTestProvider(provider)}>测试连接</Button>
                <Button size="small" variant="ghost" icon={<Edit2 />} onClick={() => actions.onEditProvider(provider)}>编辑</Button>
                <Button size="small" variant="ghost" color="error" icon={<Trash2 />} onClick={() => actions.onDeleteProvider(provider)}>删除</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function outboxLabel(status: ConnectorOutboxStatus) {
  return { awaiting_approval: "待审批", approved: "已批准", delivered: "已模拟投递", failed: "失败，可重试", revoked: "已撤销" }[status];
}

function OutboxActions({ item, onAction }: { item: ConnectorOutboxFixture; onAction: AISettingsSectionActions["onOutboxAction"] }) {
  return (
    <div className="flex min-w-max flex-nowrap items-center gap-1">
      {item.status === "awaiting_approval" ? <IconButton label={`批准 ${item.idempotencyKey}`} icon={<Check />} variant="ghost" onClick={() => onAction(item, "approve")} /> : null}
      {item.status === "approved" ? <IconButton label={`Mock 投递 ${item.idempotencyKey}`} icon={<Play />} variant="ghost" onClick={() => onAction(item, "deliver")} /> : null}
      {item.status === "failed" ? <IconButton label={`重试 ${item.idempotencyKey}`} icon={<RotateCcw />} variant="ghost" onClick={() => onAction(item, "retry")} /> : null}
      {["awaiting_approval", "approved", "failed"].includes(item.status) ? <IconButton label={`撤销 ${item.idempotencyKey}`} icon={<ShieldOff />} variant="ghost" color="error" onClick={() => onAction(item, "revoke")} /> : null}
    </div>
  );
}

function ConnectorList({ fixture, actions }: { fixture: AISettingsFixture; actions: AISettingsSectionActions }) {
  const connectorMap = new Map(fixture.connectors.map((item) => [item.id, item]));
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead
        description="管理 Agent 可访问的 Sandbox 外部能力、OAuth 边界与 Outbox 审批链路。"
        actions={<Button size="small" variant="solid" color="primary" icon={<Plus />} onClick={actions.onCreateConnector}>添加 Connector Profile</Button>}
      />
      <Alert type="info" showIcon title="Sandbox connector 边界" description="Showcase 只模拟 Profile、OAuth 状态和 Outbox 状态迁移；不保存真实凭据，也不执行真实网络投递。" />
      <Card padding="none" className="overflow-hidden">
        <CardContent className="divide-y p-0">
          {fixture.connectors.map((connector) => (
            <div key={connector.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div><div className="flex flex-wrap items-center gap-2"><strong>{connector.name}</strong><Tag color={connector.status === "connected" ? "success" : connector.status === "degraded" ? "warning" : "default"}>{connector.status === "connected" ? "已连接" : connector.status === "degraded" ? "降级" : "已停用"}</Tag></div><Text size="xs" tone="muted">{connector.kind} · {connector.sandbox ? "sandbox" : "read-only OAuth"} · {connector.scope}</Text><Text size="xs" tone="muted">{connector.hasCredential ? "凭据已配置" : "未配置凭据"} · {connector.lastChecked}</Text></div>
              <div className="flex min-w-max flex-nowrap gap-1"><IconButton label={`OAuth ${connector.name}`} icon={<KeyRound />} variant="ghost" onClick={() => actions.onStartConnectorOAuth(connector)} /><IconButton label={`编辑 ${connector.name}`} icon={<Edit2 />} variant="ghost" onClick={() => actions.onEditConnector(connector)} /></div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card padding="base">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><Heading level={2} className="text-base">Outbox 沙箱</Heading><Text size="sm" tone="muted">先审批，再进行不可外发的 Mock 投递；幂等键避免重复入队。</Text></div><Button size="small" variant="outline" icon={<Plus />} onClick={actions.onQueueOutbox}>加入 Outbox</Button></div>
          <div className="divide-y">
            {fixture.connectorOutbox.map((item) => {
              const connector = connectorMap.get(item.connectorId);
              return <div key={item.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><div><strong>#{item.id} · {item.idempotencyKey}</strong><Text size="xs" tone="muted">{connector?.name || "未知 Profile"} · {outboxLabel(item.status)}{item.error ? ` · ${item.error}` : ""}</Text></div><OutboxActions item={item} onAction={actions.onOutboxAction} /></div>;
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function AISettingsSectionPanel({ fixture, section, actions }: { fixture: AISettingsFixture; section: AISettingsSection; actions: AISettingsSectionActions }) {
  switch (section) {
    case "agents": return <AgentList fixture={fixture} actions={actions} />;
    case "skills": return <SkillList skills={fixture.skills} actions={actions} />;
    case "tools": return <ToolList fixture={fixture} />;
    case "knowledge": return <KnowledgePanel fixture={fixture.knowledge} actions={actions} />;
    case "providers": return <ProviderList providers={fixture.providers} actions={actions} />;
    case "connectors": return <ConnectorList fixture={fixture} actions={actions} />;
  }
}