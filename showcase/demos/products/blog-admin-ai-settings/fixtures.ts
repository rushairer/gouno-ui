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
  system: boolean;
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
  executionMode: "advisory" | "approval";
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
  providerType: string;
  model: string;
  baseUrl: string;
  apiKeyLast4: string;
  enabled: boolean;
  defaultWriting: boolean;
  defaultImage: boolean;
};

export type EmbeddingProfileFixture = {
  id: number;
  name: string;
  model: string;
  baseUrl: string;
  dimensions: number;
  apiKeyLast4: string;
  enabled: boolean;
};

export type ConnectorFixture = {
  id: number;
  name: string;
  kind: string;
  status: "connected" | "degraded" | "disabled";
  scope: string;
  sandbox: boolean;
  hasCredential: boolean;
  lastChecked: string;
};

export type ConnectorOutboxStatus =
  | "awaiting_approval"
  | "approved"
  | "delivered"
  | "failed"
  | "revoked";

export type ConnectorOutboxFixture = {
  id: number;
  connectorId: number;
  idempotencyKey: string;
  status: ConnectorOutboxStatus;
  error?: string;
};

export type AISettingsFixture = {
  agents: AgentFixture[];
  skills: SkillFixture[];
  tools: ToolFixture[];
  knowledge: {
    profiles: EmbeddingProfileFixture[];
    index: {
      queued: number;
      failed: number;
      chunks: number;
      lastRebuiltAt: string;
    };
  };
  providers: ProviderFixture[];
  connectors: ConnectorFixture[];
  connectorOutbox: ConnectorOutboxFixture[];
};

export const aiSettingsFixture: AISettingsFixture = {
  agents: [
    {
      id: 81,
      name: "Daily Briefing Writer",
      description: "根据已核验来源生成候选稿，不直接发布。",
      enabled: true,
      system: true,
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
      system: true,
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
      system: false,
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
      executionMode: "approval",
      updatedAt: "2026-09-08 08:12",
    },
    {
      id: 72,
      name: "Old Content Maintenance",
      version: 4,
      summary: "发现过期内容并生成维护建议。",
      capabilities: ["search_posts", "read_post", "query_events"],
      system: true,
      executionMode: "approval",
      updatedAt: "2026-09-07 16:30",
    },
    {
      id: 73,
      name: "SEO Review - Custom",
      version: 2,
      summary: "团队自定义的 SEO 复核能力副本。",
      capabilities: ["read_post", "citation_check"],
      system: false,
      executionMode: "advisory",
      updatedAt: "2026-09-06 11:20",
    },
    {
      id: 74,
      name: "Media Briefing",
      version: 2,
      summary: "把文章内容转换为图片生成前的可审核 brief。",
      capabilities: ["read_post", "create_media_candidate"],
      system: true,
      executionMode: "approval",
      updatedAt: "2026-09-05 09:00",
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
        baseUrl: "https://api.openai.com/v1",
        dimensions: 3072,
        apiKeyLast4: "4821",
        enabled: true,
      },
      {
        id: 62,
        name: "Source Archive",
        model: "text-embedding-3-small",
        baseUrl: "https://api.openai.com/v1",
        dimensions: 1536,
        apiKeyLast4: "4821",
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
      providerType: "openai-compatible",
      model: "gpt-5.6-sol",
      baseUrl: "https://api.openai.com/v1",
      apiKeyLast4: "4821",
      enabled: true,
      defaultWriting: true,
      defaultImage: false,
    },
    {
      id: 52,
      name: "Image Gateway",
      providerType: "image",
      model: "gpt-image-2",
      baseUrl: "https://images.example.internal/v1",
      apiKeyLast4: "1397",
      enabled: true,
      defaultWriting: false,
      defaultImage: true,
    },
    {
      id: 53,
      name: "Fallback Writer",
      providerType: "openai-compatible",
      model: "backup-model",
      baseUrl: "https://fallback.example.internal/v1",
      apiKeyLast4: "9026",
      enabled: false,
      defaultWriting: false,
      defaultImage: false,
    },
  ],
  connectors: [
    {
      id: 41,
      name: "Web Research Sandbox",
      kind: "search_console",
      status: "connected",
      scope: "只读公网研究",
      sandbox: true,
      hasCredential: true,
      lastChecked: "2026-09-08 21:40",
    },
    {
      id: 42,
      name: "Media Sandbox",
      kind: "webhook",
      status: "connected",
      scope: "仅媒体候选与生成产物",
      sandbox: true,
      hasCredential: true,
      lastChecked: "2026-09-08 21:38",
    },
    {
      id: 43,
      name: "Source Archive",
      kind: "newsletter",
      status: "degraded",
      scope: "历史引用归档",
      sandbox: true,
      hasCredential: false,
      lastChecked: "2026-09-08 21:35",
    },
  ],
  connectorOutbox: [
    {
      id: 301,
      connectorId: 42,
      idempotencyKey: "run-702-media-preview",
      status: "awaiting_approval",
    },
    {
      id: 302,
      connectorId: 43,
      idempotencyKey: "run-698-source-sync",
      status: "failed",
      error: "Sandbox mock timeout",
    },
    {
      id: 303,
      connectorId: 41,
      idempotencyKey: "run-690-search-console",
      status: "delivered",
    },
  ],
};