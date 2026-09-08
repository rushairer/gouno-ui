export type AISettingsSection =
  | "agents"
  | "skills"
  | "tools"
  | "knowledge"
  | "providers"
  | "connectors";

export type AgentFixture = {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  provider: string;
  skill: string;
  skillVersion: number;
  capabilities: string[];
  schedule: string;
  timezone: string;
  latestRun: string;
};

export type SkillFixture = {
  id: number;
  name: string;
  version: number;
  summary: string;
  capabilities: string[];
  system: boolean;
  updatedAt: string;
};

export type ToolFixture = {
  name: string;
  description: string;
  surfaces: string[];
  risk: "low" | "medium" | "high";
};

export type ProviderFixture = {
  id: number;
  name: string;
  model: string;
  baseUrl: string;
  enabled: boolean;
  defaultWriting: boolean;
  defaultImage: boolean;
};

export type ConnectorFixture = {
  id: number;
  name: string;
  kind: string;
  status: "connected" | "degraded" | "disabled";
  scope: string;
  lastChecked: string;
};

export type AISettingsFixture = {
  agents: AgentFixture[];
  skills: SkillFixture[];
  tools: ToolFixture[];
  knowledge: {
    profiles: Array<{
      id: number;
      name: string;
      model: string;
      dimensions: number;
      enabled: boolean;
    }>;
    index: {
      queued: number;
      failed: number;
      chunks: number;
      lastRebuiltAt: string;
    };
  };
  providers: ProviderFixture[];
  connectors: ConnectorFixture[];
};

export const aiSettingsFixture: AISettingsFixture = {
  agents: [
    {
      id: 81,
      name: "Daily Briefing Writer",
      description: "根据已核验来源生成候选稿，不直接发布。",
      enabled: true,
      provider: "OpenAI GPT-5.6",
      skill: "Daily Briefing",
      skillVersion: 6,
      capabilities: ["web_research", "citation_check", "create_draft"],
      schedule: "30 8 * * *",
      timezone: "Asia/Shanghai",
      latestRun: "Run #702 · 成功",
    },
    {
      id: 82,
      name: "Content Maintainer",
      description: "发现旧文并生成维护建议，写入动作需要人工批准。",
      enabled: true,
      provider: "OpenAI GPT-5.6",
      skill: "Old Content Maintenance",
      skillVersion: 4,
      capabilities: ["search_posts", "read_post", "query_events"],
      schedule: "0 9 * * 1",
      timezone: "Asia/Shanghai",
      latestRun: "Run #701 · 失败",
    },
    {
      id: 83,
      name: "Hero Image Planner",
      description: "根据内容生成图片 brief，真正生成图片前保留人工确认。",
      enabled: false,
      provider: "Image Gateway",
      skill: "Media Briefing",
      skillVersion: 2,
      capabilities: ["read_post", "create_media_candidate"],
      schedule: "手动",
      timezone: "Asia/Shanghai",
      latestRun: "尚未运行",
    },
  ],
  skills: [
    {
      id: 71,
      name: "Daily Briefing",
      version: 6,
      summary: "发现、核验、归纳并生成每日资讯候选稿。",
      capabilities: ["web_research", "citation_check", "create_draft"],
      system: true,
      updatedAt: "2026-09-08 08:12",
    },
    {
      id: 72,
      name: "Old Content Maintenance",
      version: 4,
      summary: "发现过期内容并生成维护建议。",
      capabilities: ["search_posts", "read_post", "query_events"],
      system: true,
      updatedAt: "2026-09-07 16:30",
    },
    {
      id: 73,
      name: "SEO Review - Custom",
      version: 2,
      summary: "团队自定义的 SEO 复核能力副本。",
      capabilities: ["read_post", "citation_check"],
      system: false,
      updatedAt: "2026-09-06 11:20",
    },
  ],
  tools: [
    {
      name: "search_posts",
      description: "按受控条件发现 Blog 文章。",
      surfaces: ["agent"],
      risk: "low",
    },
    {
      name: "query_events",
      description: "读取站点事件用于内容维护判断。",
      surfaces: ["agent"],
      risk: "medium",
    },
    {
      name: "create_draft",
      description: "创建候选草稿；不允许直接发布。",
      surfaces: ["agent"],
      risk: "high",
    },
  ],
  knowledge: {
    profiles: [
      {
        id: 61,
        name: "Blog Knowledge",
        model: "text-embedding-3-large",
        dimensions: 3072,
        enabled: true,
      },
      {
        id: 62,
        name: "Source Archive",
        model: "text-embedding-3-small",
        dimensions: 1536,
        enabled: false,
      },
    ],
    index: {
      queued: 2,
      failed: 1,
      chunks: 14380,
      lastRebuiltAt: "2026-09-08 03:10",
    },
  },
  providers: [
    {
      id: 51,
      name: "OpenAI GPT-5.6",
      model: "gpt-5.6-sol",
      baseUrl: "https://api.openai.com/v1",
      enabled: true,
      defaultWriting: true,
      defaultImage: false,
    },
    {
      id: 52,
      name: "Image Gateway",
      model: "gpt-image-2",
      baseUrl: "https://images.example.internal/v1",
      enabled: true,
      defaultWriting: false,
      defaultImage: true,
    },
    {
      id: 53,
      name: "Fallback Writer",
      model: "backup-model",
      baseUrl: "https://fallback.example.internal/v1",
      enabled: false,
      defaultWriting: false,
      defaultImage: false,
    },
  ],
  connectors: [
    {
      id: 41,
      name: "Web Research Sandbox",
      kind: "web",
      status: "connected",
      scope: "只读公网研究",
      lastChecked: "2026-09-08 21:40",
    },
    {
      id: 42,
      name: "Media Sandbox",
      kind: "media",
      status: "connected",
      scope: "仅媒体候选与生成产物",
      lastChecked: "2026-09-08 21:38",
    },
    {
      id: 43,
      name: "Source Archive",
      kind: "knowledge",
      status: "degraded",
      scope: "历史引用归档",
      lastChecked: "2026-09-08 21:35",
    },
  ],
};