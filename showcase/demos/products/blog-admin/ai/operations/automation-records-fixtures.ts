export type WorkflowInputFieldFixture = {
  key: string;
  label: string;
  type: "string" | "integer" | "number" | "boolean";
  required: boolean;
  defaultValue?: string | number | boolean;
  description?: string;
};

export type WorkflowStepFixture = {
  id: string;
  name: string;
  type: "resource_query" | "model" | "for_each" | "approval_gate" | "human_interaction" | "output";
  agent?: string;
  detail?: string;
};

export type WorkflowFixture = {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  currentVersion: number;
  schedule: string;
  timezone: string;
  nextRunAt: string;
  templateKey?: string;
  scopeMode: "strict" | "unscoped";
  discoveryTools: string[];
  resourceQueryEmptyPolicy: "succeed" | "fail";
  resourceQueryLastCount?: number;
  resourceQueryLastRunAt?: string;
  inputFields: WorkflowInputFieldFixture[];
  steps: WorkflowStepFixture[];
  input: {
    topic: string;
    days: number;
  };
  metrics: {
    runs: number;
    failures: number;
    tokens: number;
  };
  latestRun?: {
    id: number;
    status: WorkflowRunStatus;
    at: string;
    summary: string;
  };
  versions: Array<{
    version: number;
    createdAt: string;
    note: string;
  }>;
};

export type WorkflowRunStatus =
  | "queued"
  | "running"
  | "awaiting_approval"
  | "waiting_for_user"
  | "succeeded"
  | "failed"
  | "cancelled";

export type WorkflowRunFixture = {
  id: number;
  workflowId: number;
  workflowName: string;
  workflowVersion?: number;
  status: WorkflowRunStatus;
  dryRun: boolean;
  startedAt: string;
  finishedAt?: string;
  inputTokens?: number;
  outputTokens?: number;
  tokenUsage: number;
  triggeredBy?: string;
  outputSummary?: string;
  errorCode?: string;
  errorMessage?: string;
  steps: Array<{
    id: string;
    name: string;
    type?: WorkflowStepFixture["type"];
    status: WorkflowRunStatus;
    durationMs: number;
    detail: string;
    iteration?: number;
    errorMessage?: string;
  }>;
  resources: Array<{
    type: string;
    label: string;
    source?: "manual" | "query" | "discovery";
    accessLevel?: "target" | "read";
  }>;
  interactions: Array<{
    id?: number;
    type: "approval" | "choice" | "input" | "preview_confirm";
    label: string;
    status: "pending" | "resolved";
    stepId?: string;
    options?: string[];
    expiresAt?: string;
  }>;
  events: Array<{
    type: string;
    message: string;
    createdAt?: string;
  }>;
  mediaCandidates: Array<{
    id: number;
    title: string;
    status: "brief_ready" | "ready_to_generate" | "generating" | "generated" | "failed" | "cancelled";
    postId?: number;
    brief?: string;
    placement?: "cover" | "inline";
    selected?: boolean;
    safetyStatus?: string;
    copyrightStatus?: string;
    errorMessage?: string;
  }>;
};

export type AgentRunFixture = {
  id: number;
  agentName: string;
  status: "succeeded" | "failed" | "running";
  startedAt: string;
  finishedAt?: string;
  provider?: "openai" | "anthropic" | "gemini";
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  tokenUsage: number;
  summary: string;
  errorCode?: string;
  errorMessage?: string;
  citations?: Array<{
    title: string;
    status: "validated" | "unsupported";
    score?: number;
  }>;
  toolCalls: Array<{
    tool: string;
    status: "requested" | "executed" | "rejected" | "failed" | "succeeded";
    riskLevel?: "read" | "propose" | "write";
    detail: string;
    resultSummary?: string;
  }>;
};

export type AIOpsAutomationRecordsFixture = {
  workflows: WorkflowFixture[];
  workflowRuns: WorkflowRunFixture[];
  agentRuns: AgentRunFixture[];
};

export const aiOpsAutomationRecordsFixture: AIOpsAutomationRecordsFixture = {
  workflows: [
    {
      id: 42,
      name: "旧文维护",
      description: "发现超过维护周期但仍有访问价值的文章，生成维护建议并保留人工审批边界。",
      enabled: true,
      currentVersion: 4,
      schedule: "0 9 * * 1",
      timezone: "Asia/Shanghai",
      nextRunAt: "2026-09-21 09:00",
      templateKey: "old-content-maintenance",
      scopeMode: "strict",
      discoveryTools: ["search_posts", "read_post"],
      resourceQueryEmptyPolicy: "succeed",
      resourceQueryLastCount: 3,
      resourceQueryLastRunAt: "2026-09-07 15:12",
      inputFields: [
        {
          key: "topic",
          label: "维护主题",
          type: "string",
          required: true,
          defaultValue: "AI Agent",
          description: "限制本次维护关注的主题。",
        },
        {
          key: "days",
          label: "距今未更新天数",
          type: "integer",
          required: true,
          defaultValue: 180,
          description: "只处理超过该维护周期的文章。",
        },
      ],
      steps: [
        {
          id: "select_resources",
          name: "筛选超过维护周期的文章",
          type: "resource_query",
          detail: "post · updated_before_days · max 20",
        },
        {
          id: "write_suggestion",
          name: "生成维护建议",
          type: "model",
          agent: "Content Maintainer",
          detail: "读取目标文章快照，输出维护建议",
        },
        {
          id: "approval_gate",
          name: "人工审批维护建议",
          type: "approval_gate",
          detail: "内容写入前必须确认",
        },
        {
          id: "result",
          name: "输出维护候选",
          type: "output",
          detail: "/steps",
        },
      ],
      input: { topic: "AI Agent", days: 180 },
      metrics: { runs: 31, failures: 2, tokens: 128400 },
      latestRun: {
        id: 244,
        status: "succeeded",
        at: "2026-09-07 15:12",
        summary: "Dry-run 命中 3 篇旧文，生成 3 组维护建议，未写入内容。",
      },
      versions: [
        { version: 4, createdAt: "2026-09-07", note: "增加引用来源检查" },
        { version: 3, createdAt: "2026-08-29", note: "收紧旧文发现范围" },
        { version: 2, createdAt: "2026-08-18", note: "加入人工审批步骤" },
      ],
    },
    {
      id: 43,
      name: "AI 每日资讯",
      description: "按主题收集近 24 小时信息，核验引用，生成候选稿和封面任务，不自动发布。",
      enabled: true,
      currentVersion: 6,
      schedule: "30 8 * * *",
      timezone: "Asia/Shanghai",
      nextRunAt: "2026-09-18 08:30",
      templateKey: "daily-briefing",
      scopeMode: "strict",
      discoveryTools: ["web_research", "citation_check"],
      resourceQueryEmptyPolicy: "succeed",
      inputFields: [
        {
          key: "topic",
          label: "资讯主题",
          type: "string",
          required: true,
          defaultValue: "AI",
        },
        {
          key: "days",
          label: "时间范围（天）",
          type: "integer",
          required: true,
          defaultValue: 1,
        },
      ],
      steps: [
        {
          id: "discover",
          name: "发现近 24 小时资讯",
          type: "model",
          agent: "Daily Briefing Writer",
          detail: "使用已授权的只读研究 Tool",
        },
        {
          id: "verify",
          name: "核验引用与时间",
          type: "model",
          agent: "Citation Verifier",
          detail: "校验来源发布日期与正文陈述",
        },
        {
          id: "hero-style",
          name: "选择封面方向",
          type: "human_interaction",
          detail: "等待人工选择视觉方向后继续",
        },
        {
          id: "approval_gate",
          name: "人工确认候选稿",
          type: "approval_gate",
          detail: "候选内容不会自动发布",
        },
        {
          id: "result",
          name: "输出候选稿",
          type: "output",
          detail: "/steps",
        },
      ],
      input: { topic: "AI", days: 1 },
      metrics: { runs: 58, failures: 4, tokens: 421900 },
      latestRun: {
        id: 245,
        status: "waiting_for_user",
        at: "2026-09-08 08:30",
        summary: "资讯与引用核验完成，正在等待人工选择封面方向。",
      },
      versions: [
        { version: 6, createdAt: "2026-09-08", note: "强化 citation verification" },
        { version: 5, createdAt: "2026-09-03", note: "调整候选稿结构" },
      ],
    },
    {
      id: 44,
      name: "运营周报",
      description: "汇总站点与内容变化，形成可追踪的运营建议，不直接修改内容。",
      enabled: false,
      currentVersion: 2,
      schedule: "0 10 * * 1",
      timezone: "Asia/Shanghai",
      nextRunAt: "—",
      templateKey: "weekly-operations",
      scopeMode: "unscoped",
      discoveryTools: [],
      resourceQueryEmptyPolicy: "fail",
      inputFields: [
        {
          key: "topic",
          label: "汇总范围",
          type: "string",
          required: true,
          defaultValue: "site",
        },
        {
          key: "days",
          label: "统计周期（天）",
          type: "integer",
          required: true,
          defaultValue: 7,
        },
      ],
      steps: [
        {
          id: "collect",
          name: "汇总运营信号",
          type: "model",
          agent: "Content Maintainer",
          detail: "只读数据上下文",
        },
        {
          id: "result",
          name: "输出运营建议",
          type: "output",
          detail: "/steps",
        },
      ],
      input: { topic: "site", days: 7 },
      metrics: { runs: 8, failures: 1, tokens: 38600 },
      latestRun: {
        id: 230,
        status: "failed",
        at: "2026-08-31 10:00",
        summary: "Provider 请求超时，未形成周报建议。",
      },
      versions: [
        { version: 2, createdAt: "2026-08-30", note: "增加趋势摘要" },
        { version: 1, createdAt: "2026-08-12", note: "初始版本" },
      ],
    },
    {
      id: 45,
      name: "SEO / 分类修正",
      description: "扫描元数据和分类异常，先生成修正预览，再由人工确认写入范围。",
      enabled: true,
      currentVersion: 3,
      schedule: "15 7 * * 2,5",
      timezone: "Asia/Shanghai",
      nextRunAt: "2026-09-18 07:15",
      templateKey: "seo-taxonomy-maintenance",
      scopeMode: "strict",
      discoveryTools: ["search_posts", "content_audit"],
      resourceQueryEmptyPolicy: "succeed",
      resourceQueryLastCount: 6,
      resourceQueryLastRunAt: "2026-09-08 09:12",
      inputFields: [
        {
          key: "topic",
          label: "扫描范围",
          type: "string",
          required: true,
          defaultValue: "published",
        },
        {
          key: "days",
          label: "最近发布天数",
          type: "integer",
          required: true,
          defaultValue: 30,
        },
      ],
      steps: [
        {
          id: "audit",
          name: "检查 SEO 与分类元数据",
          type: "resource_query",
          detail: "published posts · last 30 days",
        },
        {
          id: "propose",
          name: "生成修正预览",
          type: "model",
          agent: "Content Maintainer",
          detail: "只生成候选变更",
        },
        {
          id: "confirm-scope",
          name: "确认修正范围",
          type: "human_interaction",
          detail: "人工确认目标文章后再继续",
        },
        {
          id: "result",
          name: "输出已确认修正",
          type: "output",
          detail: "/steps",
        },
      ],
      input: { topic: "published", days: 30 },
      metrics: { runs: 19, failures: 0, tokens: 74220 },
      latestRun: {
        id: 246,
        status: "waiting_for_user",
        at: "2026-09-08 09:12",
        summary: "发现 6 篇分类异常文章，等待确认修正范围。",
      },
      versions: [
        { version: 3, createdAt: "2026-09-08", note: "增加 preview confirm 交互" },
        { version: 2, createdAt: "2026-09-02", note: "加入内容质量检查" },
      ],
    },
  ],
  workflowRuns: [
    {
      id: 246,
      workflowId: 45,
      workflowName: "SEO / 分类修正",
      workflowVersion: 3,
      status: "waiting_for_user",
      dryRun: false,
      startedAt: "2026-09-08 09:12:31",
      inputTokens: 2840,
      outputTokens: 920,
      tokenUsage: 3760,
      triggeredBy: "schedule",
      outputSummary: "6 篇文章存在分类或 SEO 元数据异常，等待确认修正范围。",
      steps: [
        {
          id: "audit",
          name: "检查 SEO 与分类元数据",
          type: "resource_query",
          status: "succeeded",
          durationMs: 1960,
          detail: "扫描 42 篇最近发布文章，命中 6 篇需要处理。",
        },
        {
          id: "propose",
          name: "生成修正预览",
          type: "model",
          status: "succeeded",
          durationMs: 4120,
          detail: "生成 6 组分类与 SEO 修正预览。",
        },
        {
          id: "confirm-scope",
          name: "确认修正范围",
          type: "human_interaction",
          status: "waiting_for_user",
          durationMs: 0,
          detail: "等待人工确认本次允许写入的文章范围。",
        },
      ],
      resources: [
        { type: "post", label: "6 篇分类待修正文章", source: "query", accessLevel: "target" },
        { type: "category", label: "当前分类树", source: "discovery", accessLevel: "read" },
      ],
      interactions: [
        {
          id: 904,
          type: "preview_confirm",
          label: "确认 6 篇文章的分类修正范围",
          status: "pending",
          stepId: "confirm-scope",
          expiresAt: "2026-09-09 09:12:44",
        },
      ],
      events: [
        { type: "run_started", message: "Run #246 queued by schedule", createdAt: "2026-09-08 09:12:31" },
        { type: "interaction_created", message: "confirm-scope preview confirmation created", createdAt: "2026-09-08 09:12:44" },
      ],
      mediaCandidates: [],
    },
    {
      id: 245,
      workflowId: 43,
      workflowName: "AI 每日资讯",
      workflowVersion: 6,
      status: "waiting_for_user",
      dryRun: false,
      startedAt: "2026-09-08 08:30:02",
      inputTokens: 8820,
      outputTokens: 3660,
      tokenUsage: 12480,
      triggeredBy: "schedule",
      outputSummary: "7 条资讯已完成来源核验，等待封面方向后继续媒体生成。",
      steps: [
        {
          id: "discover",
          name: "发现近 24 小时资讯",
          type: "model",
          status: "succeeded",
          durationMs: 3240,
          detail: "读取 18 条候选来源，保留 7 条进入核验。",
        },
        {
          id: "verify",
          name: "核验引用与时间",
          type: "model",
          status: "succeeded",
          durationMs: 4810,
          detail: "7 条来源均通过发布日期与引用一致性检查。",
        },
        {
          id: "hero-style",
          name: "选择封面方向",
          type: "human_interaction",
          status: "waiting_for_user",
          durationMs: 0,
          detail: "等待人工选择封面风格后继续。",
        },
      ],
      resources: [
        { type: "post", label: "AI Daily Briefing draft", source: "manual", accessLevel: "target" },
        { type: "source", label: "7 verified references", source: "discovery", accessLevel: "read" },
      ],
      interactions: [
        {
          id: 903,
          type: "choice",
          label: "为技术架构文章选择封面方向",
          status: "pending",
          stepId: "hero-style",
          options: ["极简架构图", "科技插画", "深色数据流"],
          expiresAt: "2026-09-08 20:30:10",
        },
      ],
      events: [
        { type: "run_started", message: "Run #245 queued by schedule", createdAt: "2026-09-08 08:30:02" },
        { type: "step_completed", message: "verify completed", createdAt: "2026-09-08 08:30:10" },
        { type: "interaction_created", message: "hero-style choice created", createdAt: "2026-09-08 08:30:10" },
      ],
      mediaCandidates: [
        {
          id: 931,
          title: "AI Daily Briefing hero",
          status: "brief_ready",
          postId: 118,
          brief: "等待人工选择视觉方向后生成封面候选。",
          placement: "cover",
          safetyStatus: "clear",
          copyrightStatus: "clear",
        },
      ],
    },
    {
      id: 244,
      workflowId: 42,
      workflowName: "旧文维护",
      workflowVersion: 4,
      status: "succeeded",
      dryRun: true,
      startedAt: "2026-09-07 15:12:10",
      finishedAt: "2026-09-07 15:12:18",
      inputTokens: 2480,
      outputTokens: 940,
      tokenUsage: 3420,
      triggeredBy: "admin",
      outputSummary: "命中 3 篇超过 180 天未维护文章，生成 3 组建议；Dry-run 未写入产品数据。",
      steps: [
        {
          id: "search",
          name: "发现旧文",
          type: "resource_query",
          status: "succeeded",
          durationMs: 2180,
          detail: "命中 3 篇超过 180 天未维护的文章。",
        },
        {
          id: "suggest",
          name: "生成维护建议",
          type: "model",
          status: "succeeded",
          durationMs: 5160,
          detail: "生成 3 组建议，Dry-run 未写入产品数据。",
        },
      ],
      resources: [
        { type: "post", label: "Kafka 高吞吐陷阱", source: "query", accessLevel: "target" },
        { type: "post", label: "OAuth BFF 实战", source: "query", accessLevel: "target" },
        { type: "post", label: "Kubernetes 入门指南", source: "query", accessLevel: "target" },
      ],
      interactions: [],
      events: [
        { type: "run_started", message: "Dry-run requested by admin", createdAt: "2026-09-07 15:12:10" },
        { type: "run_succeeded", message: "No writes applied", createdAt: "2026-09-07 15:12:18" },
      ],
      mediaCandidates: [],
    },
    {
      id: 243,
      workflowId: 43,
      workflowName: "AI 每日资讯",
      workflowVersion: 6,
      status: "failed",
      dryRun: false,
      startedAt: "2026-09-07 08:30:02",
      finishedAt: "2026-09-07 08:30:36",
      inputTokens: 3820,
      outputTokens: 0,
      tokenUsage: 3820,
      triggeredBy: "schedule",
      errorCode: "provider_timeout",
      errorMessage: "provider request failed after 3 attempts: context deadline exceeded",
      outputSummary: "资讯发现阶段完成，生成候选稿时 Provider 超时。",
      steps: [
        {
          id: "discover",
          name: "发现近 24 小时资讯",
          type: "model",
          status: "succeeded",
          durationMs: 3280,
          detail: "发现 11 条候选来源。",
        },
        {
          id: "draft",
          name: "生成候选稿",
          type: "model",
          status: "failed",
          durationMs: 30210,
          detail: "Provider 请求超时，未产生候选稿。",
          errorMessage: "context deadline exceeded",
        },
      ],
      resources: [{ type: "source", label: "11 candidate references", source: "discovery", accessLevel: "read" }],
      interactions: [],
      events: [
        { type: "run_started", message: "Run #243 queued by schedule", createdAt: "2026-09-07 08:30:02" },
        { type: "run_failed", message: "Provider timeout during draft", createdAt: "2026-09-07 08:30:36" },
      ],
      mediaCandidates: [],
    },
    {
      id: 241,
      workflowId: 43,
      workflowName: "AI 每日资讯",
      workflowVersion: 5,
      status: "awaiting_approval",
      dryRun: false,
      startedAt: "2026-09-06 08:30:01",
      finishedAt: "2026-09-06 08:30:14",
      inputTokens: 8120,
      outputTokens: 3700,
      tokenUsage: 11820,
      triggeredBy: "schedule",
      outputSummary: "候选稿已生成并保留，等待内容审批。",
      steps: [
        {
          id: "draft",
          name: "生成候选稿",
          type: "model",
          status: "succeeded",
          durationMs: 7440,
          detail: "候选稿已生成，未发布。",
        },
        {
          id: "approval",
          name: "等待内容审批",
          type: "approval_gate",
          status: "awaiting_approval",
          durationMs: 0,
          detail: "等待人工批准候选稿。",
        },
      ],
      resources: [{ type: "draft", label: "AI 每日资讯候选稿", source: "manual", accessLevel: "target" }],
      interactions: [
        { id: 901, type: "approval", label: "确认应用候选稿", status: "pending", stepId: "approval" },
      ],
      events: [
        { type: "approval_created", message: "Approval #901 created", createdAt: "2026-09-06 08:30:14" },
      ],
      mediaCandidates: [],
    },
  ],
  agentRuns: [
    {
      id: 702,
      agentName: "Citation Verifier",
      status: "succeeded",
      startedAt: "2026-09-08 08:31:14",
      finishedAt: "2026-09-08 08:31:19",
      provider: "anthropic",
      model: "claude-sonnet",
      inputTokens: 1640,
      outputTokens: 540,
      tokenUsage: 2180,
      summary: "核验 7 条引用，全部通过时间与来源一致性检查。",
      citations: [
        { title: "Agent 工具调用治理更新", status: "validated", score: 0.94 },
        { title: "多模型路由失败恢复实践", status: "validated", score: 0.91 },
      ],
      toolCalls: [
        { tool: "fetch_source", status: "executed", riskLevel: "read", detail: "7 sources fetched", resultSummary: "7 个来源均可访问" },
        { tool: "verify_date", status: "executed", riskLevel: "read", detail: "7 publication dates verified", resultSummary: "发布日期均符合 24 小时窗口" },
      ],
    },
    {
      id: 701,
      agentName: "Content Maintainer",
      status: "failed",
      startedAt: "2026-09-07 15:11:40",
      finishedAt: "2026-09-07 15:11:45",
      provider: "anthropic",
      model: "claude-sonnet",
      inputTokens: 920,
      outputTokens: 0,
      tokenUsage: 920,
      summary: "读取运营事件时查询失败，未生成维护建议。",
      errorCode: "tool_execution_failed",
      errorMessage: "query_events failed: column reference event_key is ambiguous",
      toolCalls: [
        { tool: "query_events", status: "failed", riskLevel: "read", detail: "column reference event_key is ambiguous" },
      ],
    },
  ],
};