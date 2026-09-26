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
  triggerType?: "manual" | "cron";
  dailyRunLimit?: number;
  monthlyTokenBudget?: number;
  maxStepsOverride?: number;
  maxInputTokensOverride?: number;
  maxOutputTokensOverride?: number;
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
  systemPrompt?: string;
  contentPublishMode?: "approval" | "draft" | "publish";
  allowedTriggers?: Array<"manual" | "cron">;
  maxSteps?: number;
  maxInputTokens?: number;
  maxOutputTokens?: number;
  defaultDailyRunLimit?: number;
  defaultMonthlyTokenBudget?: number;
  inputSchema?: Record<string, unknown>;
};

export type ToolFixture = {
  name: string;
  description: string;
  surfaces: string[];
  risk: "low" | "medium" | "high";
};

export type ProviderVendor =
  | "openai"
  | "anthropic"
  | "google"
  | "deepseek"
  | "alibaba"
  | "volcengine"
  | "moonshot"
  | "tencent"
  | "zhipu"
  | "custom";

export type ProviderProtocol = "openai" | "anthropic" | "gemini";

export type ProviderFixture = {
  id: number;
  name: string;
  vendor: ProviderVendor;
  protocol: ProviderProtocol;
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

export type KnowledgeContentFixture = {
  postId: number;
  title: string;
  slug: string;
  chunks: number;
  status: "ready" | "pending";
  lastIndexedAt: string;
};

export type KnowledgeSearchResultFixture = {
  postId: number;
  title: string;
  slug: string;
  snippet: string;
  citationId: string;
  lexicalScore: number;
  semanticScore: number;
  score: number;
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
      indexedPosts: number;
      queued: number;
      failed: number;
      chunks: number;
      retrievalP95Ms24h: number;
      lastRebuiltAt: string;
    };
    content: KnowledgeContentFixture[];
    retrieval: {
      query: string;
      latencyMs: number;
      results: KnowledgeSearchResultFixture[];
    };
  };
  providers: ProviderFixture[];
  connectors: ConnectorFixture[];
  connectorOutbox: ConnectorOutboxFixture[];
};

const objectInputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  additionalProperties: false,
} as const;

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
      triggerType: "cron",
      dailyRunLimit: 10,
      monthlyTokenBudget: 1000000,
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
      triggerType: "cron",
      dailyRunLimit: 4,
      monthlyTokenBudget: 400000,
      maxStepsOverride: 5,
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
      triggerType: "manual",
      dailyRunLimit: 5,
      monthlyTokenBudget: 250000,
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
      systemPrompt: "只基于已核验且仍在时效范围内的来源生成候选稿；对不确定信息明确保留证据边界。",
      contentPublishMode: "approval",
      allowedTriggers: ["manual", "cron"],
      maxSteps: 8,
      maxInputTokens: 32000,
      maxOutputTokens: 8000,
      defaultDailyRunLimit: 20,
      defaultMonthlyTokenBudget: 2000000,
      inputSchema: { ...objectInputSchema },
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
      systemPrompt: "发现超过维护周期的文章，给出可核验的维护建议；任何内容写入必须进入审批。",
      contentPublishMode: "approval",
      allowedTriggers: ["manual", "cron"],
      maxSteps: 6,
      maxInputTokens: 16000,
      maxOutputTokens: 4000,
      defaultDailyRunLimit: 10,
      defaultMonthlyTokenBudget: 1000000,
      inputSchema: { ...objectInputSchema },
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
      systemPrompt: "分析标题、摘要、结构和引用完整性，只提供建议，不直接写入内容。",
      contentPublishMode: "approval",
      allowedTriggers: ["manual"],
      maxSteps: 4,
      maxInputTokens: 12000,
      maxOutputTokens: 3000,
      defaultDailyRunLimit: 20,
      defaultMonthlyTokenBudget: 500000,
      inputSchema: { ...objectInputSchema },
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
      systemPrompt: "从文章内容提炼图片 brief；生成前保留人工确认，不直接替换文章媒体资源。",
      contentPublishMode: "approval",
      allowedTriggers: ["manual", "cron"],
      maxSteps: 6,
      maxInputTokens: 16000,
      maxOutputTokens: 4000,
      defaultDailyRunLimit: 10,
      defaultMonthlyTokenBudget: 1000000,
      inputSchema: { ...objectInputSchema },
    },
  ],
  tools: [
    {
      name: "web_research",
      description: "读取公开来源并形成候选研究证据。",
      surfaces: ["agent"],
      risk: "low",
    },
    {
      name: "analytics.list_low_engagement_posts",
      description: "列出浏览量足够但互动率较低的已发布文章。",
      surfaces: ["agent"],
      risk: "low",
    },
    {
      name: "content.propose_distribution_draft",
      description: "生成外部分发渠道的候选文案草稿，提交前仍需人工确认。",
      surfaces: ["agent"],
      risk: "medium",
    },
    {
      name: "citation_check",
      description: "核验候选引用、时间与来源一致性。",
      surfaces: ["agent"],
      risk: "low",
    },
    {
      name: "search_posts",
      description: "按受控条件发现 Blog 文章。",
      surfaces: ["agent"],
      risk: "low",
    },
    {
      name: "read_post",
      description: "读取已授权文章内容与必要元数据。",
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
      name: "create_media_candidate",
      description: "创建媒体候选与生成前 brief，不直接替换正式资源。",
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
      indexedPosts: 128,
      queued: 2,
      failed: 1,
      chunks: 14380,
      retrievalP95Ms24h: 112,
      lastRebuiltAt: "2026-09-08 03:10",
    },
    content: [
      {
        postId: 201,
        title: "OAuth 2.1 与 PKCE：浏览器应用的安全边界",
        slug: "oauth-pkce-browser-security",
        chunks: 24,
        status: "ready",
        lastIndexedAt: "2026-09-08 09:42",
      },
      {
        postId: 198,
        title: "从 BFF 到业务会话：前端不持有 OAuth Token",
        slug: "bff-business-session",
        chunks: 18,
        status: "ready",
        lastIndexedAt: "2026-09-08 09:38",
      },
      {
        postId: 193,
        title: "内容发布后的 AI 审校与引用证据",
        slug: "ai-review-citation-evidence",
        chunks: 31,
        status: "ready",
        lastIndexedAt: "2026-09-08 09:35",
      },
    ],
    retrieval: {
      query: "PKCE code_verifier 为什么重要？",
      latencyMs: 84,
      results: [
        {
          postId: 201,
          title: "OAuth 2.1 与 PKCE：浏览器应用的安全边界",
          slug: "oauth-pkce-browser-security",
          snippet: "客户端生成高熵 code_verifier，并只在授权请求中发送其派生出的 code_challenge；令牌交换阶段再提交原始 verifier。",
          citationId: "kb_8a91d2c4",
          lexicalScore: 0.78,
          semanticScore: 0.94,
          score: 0.88,
        },
        {
          postId: 198,
          title: "从 BFF 到业务会话：前端不持有 OAuth Token",
          slug: "bff-business-session",
          snippet: "BFF 负责服务端完成 code exchange，浏览器只持有本域 Secure/HttpOnly 业务会话 Cookie，避免暴露 OAuth Token。",
          citationId: "kb_5d307c2e",
          lexicalScore: 0.52,
          semanticScore: 0.82,
          score: 0.72,
        },
      ],
    },
  },
  providers: [
    {
      id: 51,
      name: "OpenAI GPT-5.6",
      vendor: "openai",
      protocol: "openai",
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
      vendor: "custom",
      protocol: "openai",
      model: "gpt-image-2",
      baseUrl: "https://images.example.internal/v1",
      apiKeyLast4: "1397",
      enabled: true,
      defaultWriting: false,
      defaultImage: true,
    },
    {
      id: 53,
      name: "DeepSeek Fallback",
      vendor: "deepseek",
      protocol: "openai",
      model: "deepseek-chat",
      baseUrl: "https://api.deepseek.com",
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