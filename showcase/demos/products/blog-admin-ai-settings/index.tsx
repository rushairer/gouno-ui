import { useState } from "react";
import {
  Bot,
  DatabaseZap,
  GitBranch,
  KeyRound,
  ListChecks,
  LockKeyhole,
} from "lucide-react";
import { Alert, Tabs } from "../../../../src/core";
import { PageHeader } from "../../../../src/gouno";
import { FixtureDock } from "../../../components/fixture-dock";
import {
  aiSettingsFixture,
  type AgentFixture,
  type AISettingsFixture,
  type AISettingsSection,
  type ProviderFixture,
  type SkillFixture,
} from "./fixtures";
import { AISettingsSectionPanel } from "./sections";

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
  };
}

export function BlogAdminAISettingsDemo({
  initialSection = "agents",
}: {
  initialSection?: AISettingsSection;
}) {
  const [section, setSection] = useState<AISettingsSection>(initialSection);
  const [fixture, setFixture] = useState(cloneFixture);
  const [notice, setNotice] = useState("");

  const changeSection = (next: AISettingsSection) => {
    setSection(next);
    setNotice("");
  };

  const toggleAgent = (agent: AgentFixture) => {
    setFixture((current) => ({
      ...current,
      agents: current.agents.map((item) => item.id === agent.id ? { ...item, enabled: !item.enabled } : item),
    }));
    setNotice(`${agent.name} 已${agent.enabled ? "停用" : "启用"}。`);
  };

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route={formatAISettingsRoute(section)}
        note="AI 设置是独立的管理路由族；Showcase 仅模拟配置状态，不保存模型凭证或调用真实 Agent API。"
      />
      <PageHeader
        title="AI 设置"
        description="管理 Agent、Skill、Tool、知识索引、模型连接与 Sandbox 连接器。"
      />
      <Tabs<AISettingsSection>
        activeKey={section}
        items={tabs}
        onChange={changeSection}
        ariaLabel="AI 设置栏目"
      />
      {notice ? <Alert type="success" showIcon title={notice} /> : null}
      <AISettingsSectionPanel
        fixture={fixture}
        section={section}
        onRunAgent={(agent) => setNotice(`${agent.name} 已排队运行；运行证据会进入 AI 运营的运行中心。`)}
        onToggleAgent={toggleAgent}
        onCopySkill={(skill: SkillFixture) => setNotice(`${skill.name} v${skill.version} 已创建自定义副本。`)}
        onRetryIndex={() => setNotice("失败索引任务已重新排队。")}
        onRebuildIndex={() => setNotice("知识索引已请求全量重建。")}
        onTestProvider={(provider: ProviderFixture) => setNotice(`${provider.name}：连接测试成功。`)}
      />
    </div>
  );
}

export { aiSettingsFixture };
