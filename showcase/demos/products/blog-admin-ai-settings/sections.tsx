import {
  Copy,
  DatabaseZap,
  Play,
  RefreshCw,
  TestTube2,
} from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Heading,
  Tag,
  Text,
} from "../../../../src/core";
import { TabPanelLead } from "../../../components/tab-panel-lead";
import type {
  AgentFixture,
  AISettingsFixture,
  AISettingsSection,
  ConnectorFixture,
  ProviderFixture,
  SkillFixture,
  ToolFixture,
} from "./fixtures";

function AgentList({
  agents,
  onRun,
  onToggle,
}: {
  agents: AgentFixture[];
  onRun: (agent: AgentFixture) => void;
  onToggle: (agent: AgentFixture) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead description="Skill Version + 模型连接 + 运行计划组成可审计的执行单元。" />
      <Card padding="none" className="overflow-hidden">
        <CardContent className="divide-y p-0">
          {agents.map((agent) => (
            <div key={agent.id} className="flex flex-col gap-4 p-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>{agent.name}</strong>
                  <Tag color={agent.enabled ? "success" : "default"}>{agent.enabled ? "已启用" : "已停用"}</Tag>
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
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button size="small" variant="outline" onClick={() => onToggle(agent)}>
                  {agent.enabled ? "停用" : "启用"}
                </Button>
                <Button size="small" variant="solid" color="primary" icon={<Play />} disabled={!agent.enabled} onClick={() => onRun(agent)}>
                  运行
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SkillList({ skills, onCopy }: { skills: SkillFixture[]; onCopy: (skill: SkillFixture) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead description="管理可复用、可版本化的 AI 能力定义；系统 Skill 与团队副本保持清晰边界。" />
      <div className="grid gap-4 lg:grid-cols-2">
        {skills.map((skill) => (
          <Card key={skill.id} padding="base">
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <strong>{skill.name}</strong>
                    <Tag color={skill.system ? "primary" : "default"}>{skill.system ? "系统 Skill" : "自定义"}</Tag>
                  </div>
                  <Text size="xs" tone="muted">v{skill.version} · {skill.updatedAt}</Text>
                </div>
                <Button size="small" variant="ghost" icon={<Copy />} onClick={() => onCopy(skill)}>复制</Button>
              </div>
              <Text size="sm" tone="muted">{skill.summary}</Text>
              <div className="mt-auto flex flex-wrap gap-2">
                {skill.capabilities.map((capability) => <Tag key={capability}>{capability}</Tag>)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ToolList({ tools }: { tools: ToolFixture[] }) {
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead description="由代码发布的受控能力目录；Workflow 不直接调用 Tool，必须经过 Skill/Agent 授权。" />
      <Card padding="none" className="overflow-hidden">
        <CardContent className="divide-y p-0">
          {tools.map((tool) => (
            <div key={tool.name} className="grid gap-3 p-6 md:grid-cols-[minmax(0,1fr)_minmax(8rem,0.3fr)_auto] md:items-center">
              <div>
                <strong className="font-mono text-sm">{tool.name}</strong>
                <Text size="xs" tone="muted">{tool.description}</Text>
              </div>
              <Text size="sm">{tool.surfaces.join(", ")}</Text>
              <Tag color={tool.risk === "high" ? "error" : tool.risk === "medium" ? "warning" : "success"}>
                {tool.risk === "high" ? "高风险" : tool.risk === "medium" ? "中风险" : "低风险"}
              </Tag>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function KnowledgePanel({
  fixture,
  onRetry,
  onRebuild,
}: {
  fixture: AISettingsFixture["knowledge"];
  onRetry: () => void;
  onRebuild: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead
        description="查看知识索引健康、Embedding Profile 与重建状态。"
        actions={(
          <>
            <Button size="small" variant="outline" icon={<RefreshCw />} onClick={onRetry}>重试失败索引</Button>
            <Button size="small" variant="outline" icon={<DatabaseZap />} onClick={onRebuild}>重建索引</Button>
          </>
        )}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card padding="base"><Text size="xs" tone="muted">待处理</Text><Heading level={2}>{fixture.index.queued}</Heading></Card>
        <Card padding="base"><Text size="xs" tone="muted">失败</Text><Heading level={2}>{fixture.index.failed}</Heading></Card>
        <Card padding="base"><Text size="xs" tone="muted">Chunks</Text><Heading level={2}>{fixture.index.chunks}</Heading></Card>
      </div>
      {fixture.index.failed ? (
        <Alert type="warning" showIcon title="知识索引存在失败任务" description="先重试失败项；只有在索引结构变化或一致性异常时才执行全量重建。" />
      ) : null}
      <Card padding="base">
        <div className="mb-4 flex flex-col gap-1">
          <Heading level={2} className="text-base">Embedding Profiles</Heading>
          <Text size="xs" tone="muted">最近重建：{fixture.index.lastRebuiltAt}</Text>
        </div>
        <div className="divide-y">
          {fixture.profiles.map((profile) => (
            <div key={profile.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div><strong>{profile.name}</strong><Text size="xs" tone="muted">{profile.model} · {profile.dimensions} dimensions</Text></div>
              <Tag color={profile.enabled ? "success" : "default"}>{profile.enabled ? "已启用" : "已停用"}</Tag>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ProviderList({ providers, onTest }: { providers: ProviderFixture[]; onTest: (provider: ProviderFixture) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead description="管理默认模型、服务端连接地址与可用状态；真实凭证不进入 Showcase。" />
      <Alert type="info" showIcon title="模型连接属于受控配置" description="默认模型、凭证和连接测试属于管理员配置面；Showcase 不保存任何真实密钥。" />
      <div className="grid gap-4 lg:grid-cols-2">
        {providers.map((provider) => (
          <Card key={provider.id} padding="base">
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div><strong>{provider.name}</strong><Text size="xs" tone="muted">{provider.model}</Text></div>
                <Tag color={provider.enabled ? "success" : "default"}>{provider.enabled ? "可用" : "停用"}</Tag>
              </div>
              <Text size="xs" tone="muted" className="break-all">{provider.baseUrl}</Text>
              <div className="flex flex-wrap gap-2">
                {provider.defaultWriting ? <Tag color="primary">默认写作</Tag> : null}
                {provider.defaultImage ? <Tag color="primary">默认图片</Tag> : null}
              </div>
              <div className="mt-auto">
                <Button size="small" variant="outline" icon={<TestTube2 />} disabled={!provider.enabled} onClick={() => onTest(provider)}>测试连接</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ConnectorList({ connectors }: { connectors: ConnectorFixture[] }) {
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead description="管理 Agent 可访问的 Sandbox 外部能力、授权范围与连接状态。" />
      <Alert type="info" showIcon title="Sandbox connector 边界" description="连接器只向 Agent 暴露明确授权的外部能力；状态和作用域必须可见，不把外部系统隐式混进普通产品操作。" />
      <Card padding="none" className="overflow-hidden">
        <CardContent className="divide-y p-0">
          {connectors.map((connector) => (
            <div key={connector.id} className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div><strong>{connector.name}</strong><Text size="xs" tone="muted">{connector.kind} · {connector.scope} · {connector.lastChecked}</Text></div>
              <Tag color={connector.status === "connected" ? "success" : connector.status === "degraded" ? "warning" : "default"}>
                {connector.status === "connected" ? "已连接" : connector.status === "degraded" ? "降级" : "已停用"}
              </Tag>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function AISettingsSectionPanel({
  fixture,
  section,
  onRunAgent,
  onToggleAgent,
  onCopySkill,
  onRetryIndex,
  onRebuildIndex,
  onTestProvider,
}: {
  fixture: AISettingsFixture;
  section: AISettingsSection;
  onRunAgent: (agent: AgentFixture) => void;
  onToggleAgent: (agent: AgentFixture) => void;
  onCopySkill: (skill: SkillFixture) => void;
  onRetryIndex: () => void;
  onRebuildIndex: () => void;
  onTestProvider: (provider: ProviderFixture) => void;
}) {
  switch (section) {
    case "agents":
      return <AgentList agents={fixture.agents} onRun={onRunAgent} onToggle={onToggleAgent} />;
    case "skills":
      return <SkillList skills={fixture.skills} onCopy={onCopySkill} />;
    case "tools":
      return <ToolList tools={fixture.tools} />;
    case "knowledge":
      return <KnowledgePanel fixture={fixture.knowledge} onRetry={onRetryIndex} onRebuild={onRebuildIndex} />;
    case "providers":
      return <ProviderList providers={fixture.providers} onTest={onTestProvider} />;
    case "connectors":
      return <ConnectorList connectors={fixture.connectors} />;
  }
}
