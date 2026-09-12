export type WorkflowFixture = {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  currentVersion: number;
  schedule: string;
  timezone: string;
  nextRunAt: string;
  scopeMode: "strict" | "unscoped";
  discoveryTools: string[];
  input: {
    topic: string;
    days: number;
  };
  metrics: {
    runs: number;
    failures: number;
    tokens: number;
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
  | "failed";

export type WorkflowRunFixture = {
  id: number;
  workflowId: number;
  workflowName: string;
  status: WorkflowRunStatus;
  dryRun: boolean;
  startedAt: string;
  finishedAt?: string;
  tokenUsage: number;
  errorMessage?: string;
  steps: Array<{
    id: string;
    name: string;
    status: "succeeded" | "failed" | "waiting_for_user";
    durationMs: number;
    detail: string;
  }>;
  resources: Array<{
    type: string;
    label: string;
  }>;
  interactions: Array<{
    type: "approval" | "choice" | "preview_confirm";
    label: string;
    status: "pending" | "resolved";
  }>;
  events: Array<{
    type: string;
    message: string;
  }>;
  mediaCandidates: Array<{
    id: number;
    title: string;
    status: "brief_ready" | "generated" | "failed";
  }>;
};

export type AgentRunFixture = {
  id: number;
  agentName: string;
  status: "succeeded" | "failed" | "running";
  startedAt: string;
  finishedAt?: string;
  tokenUsage: number;
  summary: string;
  toolCalls: Array<{
    tool: string;
    status: "succeeded" | "failed";
    detail: string;
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
      description: "发现超过维护周期的文章，生成更新建议并保留人工审批边界。",
      enabled: true,
      currentVersion: 4,
      schedule: "0 9 * * 1",
      timezone: "Asia/Shanghai",
      nextRunAt: "2026-09-14 09:00",
      scopeMode: "strict",
      discoveryTools: ["search_posts", "read_post"],
      input: { topic: "AI Agent", days: 180 },
      metrics: { runs: 31, failures: 2, tokens: 128400 },
      versions: [
        { version: 4, createdAt: "2026-09-07", note: "增加引用来源检查" },
        { version: 3, createdAt: "2026-08-29", note: "收紧旧文发现范围" },
        { version: 2, createdAt: "2026-08-18", note: "加入人工审批步骤" },
      ],
    },
    {
      id: 43,
      name: "AI 每日资讯",
      description: "按主题收集近 24 小时信息，生成候选稿而不是自动发布。",
      enabled: true,
      currentVersion: 6,
      schedule: "30 8 * * *",
      timezone: "Asia/Shanghai",
      nextRunAt: "2026-09-09 08:30",
      scopeMode: "strict",
      discoveryTools: ["web_research", "citation_check"],
      input: { topic: "AI", days: 1 },
      metrics: { runs: 58, failures: 4, tokens: 421900 },
      versions: [
        { version: 6, createdAt: "2026-09-08", note: "强化 citation verification" },
        { version: 5, createdAt: "2026-09-03", note: "调整候选稿结构" },
      ],
    },
    {
      id: 44,
      name: "运营周报",
      description: "汇总站点数据和内容变化，形成运营建议。",
      enabled: false,
      currentVersion: 2,
      schedule: "0 10 * * 1",
      timezone: "Asia/Shanghai",
      nextRunAt: "—",
      scopeMode: "unscoped",
      discoveryTools: [],
      input: { topic: "site", days: 7 },
      metrics: { runs: 8, failures: 1, tokens: 38600 },
      versions: [
        { version: 2, createdAt: "2026-08-30", note: "增加趋势摘要" },
        { version: 1, createdAt: "2026-08-12", note: "初始版本" },
      ],
    },
  ],
  workflowRuns: [
    {
      id: 245,
      workflowId: 43,
      workflowName: "AI 每日资讯",
      status: "waiting_for_user",
      dryRun: false,
      startedAt: "2026-09-08 08:30:02",
      tokenUsage: 12480,
      steps: [
        {
          id: "discover",
          name: "发现近 24 小时资讯",
          status: "succeeded",
          durationMs: 3240,
          detail: "读取 18 条候选来源，保留 7 条进入核验。",
        },
        {
          id: "verify",
          name: "核验引用与时间",
          status: "succeeded",
          durationMs: 4810,
          detail: "7 条来源均通过发布日期与引用一致性检查。",
        },
        {
          id: "hero-style",
          name: "选择封面方向",
          status: "waiting_for_user",
          durationMs: 0,
          detail: "等待人工选择封面风格后继续。",
        },
      ],
      resources: [
        { type: "post", label: "AI Daily Briefing draft" },
        { type: "source", label: "7 verified references" },
      ],
      interactions: [
        { type: "choice", label: "为技术架构文章选择封面方向", status: "pending" },
      ],
      events: [
        { type: "run_started", message: "Run #245 queued by schedule" },
        { type: "step_completed", message: "verify completed" },
        { type: "interaction_created", message: "hero-style choice created" },
      ],
      mediaCandidates: [
        { id: 930, title: "AI Daily Briefing hero", status: "brief_ready" },
      ],
    },
    {
      id: 244,
      workflowId: 42,
      workflowName: "旧文维护",
      status: "succeeded",
      dryRun: true,
      startedAt: "2026-09-07 15:12:10",
      finishedAt: "2026-09-07 15:12:18",
      tokenUsage: 3420,
      steps: [
        {
          id: "search",
          name: "发现旧文",
          status: "succeeded",
          durationMs: 2180,
          detail: "命中 3 篇超过 180 天未维护的文章。",
        },
        {
          id: "suggest",
          name: "生成维护建议",
          status: "succeeded",
          durationMs: 5160,
          detail: "生成 3 组建议，dry-run 未写入产品数据。",
        },
      ],
      resources: [
        { type: "post", label: "Kafka 高吞吐陷阱" },
        { type: "post", label: "OAuth BFF 实战" },
      ],
      interactions: [],
      events: [
        { type: "run_started", message: "Dry-run requested by admin" },
        { type: "run_succeeded", message: "No writes applied" },
      ],
      mediaCandidates: [],
    },
    {
      id: 241,
      workflowId: 43,
      workflowName: "AI 每日资讯",
      status: "awaiting_approval",
      dryRun: false,
      startedAt: "2026-09-06 08:30:01",
      finishedAt: "2026-09-06 08:30:14",
      tokenUsage: 11820,
      steps: [
        {
          id: "draft",
          name: "生成候选稿",
          status: "succeeded",
          durationMs: 7440,
          detail: "候选稿已生成，未发布。",
        },
      ],
      resources: [{ type: "draft", label: "AI 每日资讯候选稿" }],
      interactions: [
        { type: "approval", label: "确认应用候选稿", status: "pending" },
      ],
      events: [
        { type: "approval_created", message: "Approval #901 created" },
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
      tokenUsage: 2180,
      summary: "核验 7 条引用，全部通过时间与来源一致性检查。",
      toolCalls: [
        { tool: "fetch_source", status: "succeeded", detail: "7 sources fetched" },
        { tool: "verify_date", status: "succeeded", detail: "7 publication dates verified" },
      ],
    },
    {
      id: 701,
      agentName: "Content Maintainer",
      status: "failed",
      startedAt: "2026-09-07 15:11:40",
      finishedAt: "2026-09-07 15:11:45",
      tokenUsage: 960,
      summary: "数据库事件查询失败，未产生任何内容写入。",
      toolCalls: [
        { tool: "search_posts", status: "succeeded", detail: "3 posts found" },
        { tool: "query_events", status: "failed", detail: "column reference event_key is ambiguous" },
      ],
    },
  ],
};
