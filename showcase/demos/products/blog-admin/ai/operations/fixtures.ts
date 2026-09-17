export type AIOpsTab = "overview" | "inbox" | "automation" | "records";

export type ApprovalStatus = "pending" | "failed" | "approved" | "rejected";

export type ApprovalFixture = {
  id: number;
  runId: number;
  actionType: "create_draft" | "create_content_candidates" | "create_media_candidate";
  targetType: "post" | "page";
  targetId?: number;
  targetLabel?: string;
  createdAt?: string;
  expiresAt?: string;
  status: ApprovalStatus;
  reviewNote?: string;
  beforeSnapshot?: Record<string, unknown>;
  proposal: {
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    field?: "title" | "summary";
    suggestions?: string[];
    prompt?: string;
  };
};

export type InteractionFixture = {
  id: number;
  workflowRunId: number;
  workflowName?: string;
  stepId: string;
  type: "approval" | "choice" | "input" | "preview_confirm";
  title: string;
  reason?: string;
  targetLabel?: string;
  createdAt?: string;
  expiresAt?: string;
  options?: string[];
};

export type SuggestionFixture = {
  id: number;
  title: string;
  description: string;
  status: "new" | "accepted" | "deferred" | "converted" | "resolved";
  priority: "low" | "medium" | "high";
  sourceLabel: string;
  targetLabel?: string;
  createdAt: string;
  evidence: string[];
};

export type CandidateSetFixture = {
  id: number;
  title: string;
  status: "pending" | "selected" | "expired";
  postId: number;
  sourceRunId: number;
  fieldType: "title" | "summary" | "cover_alt";
  beforeValue: string;
  createdAt: string;
  candidates: Array<{
    id: number;
    value: string;
    rationale: string;
  }>;
};

export type MediaCandidateFixture = {
  id: number;
  title: string;
  status: "brief_ready" | "ready_to_generate" | "generating" | "generated" | "failed";
  postId: number;
  workflowRunId?: number;
  headline: string;
  brief: string;
  placement: "cover" | "inline";
  safetyStatus: string;
  copyrightStatus: string;
  createdAt: string;
  errorMessage?: string;
};

export type EditorialTaskFixture = {
  id: number;
  title: string;
  description: string;
  status: "open" | "done" | "cancelled";
  priority: "low" | "medium" | "high";
  sourceLabel: string;
  createdAt: string;
};

export type OperationsFixture = {
  suggestions: SuggestionFixture[];
  candidateSets: CandidateSetFixture[];
  mediaCandidates: MediaCandidateFixture[];
  editorialTasks: EditorialTaskFixture[];
};

export type AIOpsDecisionFixture = {
  approvals: ApprovalFixture[];
  interactions: InteractionFixture[];
  operations: OperationsFixture;
  enabledWorkflowCount: number;
};

export const aiOpsDecisionFixture: AIOpsDecisionFixture = {
  approvals: [
    {
      id: 901,
      runId: 241,
      actionType: "create_draft",
      targetType: "post",
      targetId: 118,
      targetLabel: "AI 每日资讯候选稿",
      createdAt: "2026-09-06 08:30:14",
      expiresAt: "2026-09-13 08:30:14",
      status: "pending",
      proposal: {
        title: "AI 每日资讯：模型、Agent 与工具链更新",
        slug: "ai-daily-briefing",
        summary: "汇总过去 24 小时经过核验的 AI 行业变化。",
        content: "## 今日重点\n\n- Agent 工具调用治理继续加强。\n- 多模型路由开始关注失败恢复与成本边界。",
      },
    },
    {
      id: 902,
      runId: 238,
      actionType: "create_content_candidates",
      targetType: "post",
      targetId: 103,
      targetLabel: "Kafka 消费者背压",
      createdAt: "2026-09-05 16:42:18",
      expiresAt: "2026-09-12 16:42:18",
      status: "failed",
      reviewNote: "column reference event_key is ambiguous",
      beforeSnapshot: {
        title: "Kafka 高吞吐陷阱：并发并不总能换来 QPS",
      },
      proposal: {
        field: "title",
        suggestions: [
          "Kafka 消费者背压：为什么 goroutine 越多反而越慢",
          "Kafka 高吞吐陷阱：并发并不总能换来 QPS",
        ],
      },
    },
  ],
  interactions: [
    {
      id: 903,
      workflowRunId: 245,
      workflowName: "AI 每日资讯",
      stepId: "hero-style",
      type: "choice",
      title: "为技术架构文章选择封面方向",
      reason: "Workflow 已完成资讯发现与引用核验，需要人工确定视觉方向后继续生成媒体候选。",
      targetLabel: "AI 每日资讯候选稿",
      createdAt: "2026-09-08 08:30:10",
      expiresAt: "2026-09-08 20:30:10",
      options: ["极简架构图", "科技插画", "深色数据流"],
    },
    {
      id: 904,
      workflowRunId: 246,
      workflowName: "SEO / 分类修正",
      stepId: "confirm-scope",
      type: "preview_confirm",
      title: "确认 6 篇文章的分类修正范围",
      reason: "AI 已生成预览，但分类写入属于内容变更，需要人工确认目标范围。",
      targetLabel: "6 篇分类待修正文章",
      createdAt: "2026-09-08 09:12:44",
      expiresAt: "2026-09-09 09:12:44",
    },
  ],
  operations: {
    suggestions: [
      {
        id: 910,
        title: "3 篇旧文超过 180 天未更新",
        description: "这些文章仍有稳定访问，但内容时间敏感，建议进入维护流程。",
        status: "new",
        priority: "high",
        sourceLabel: "旧文维护扫描",
        targetLabel: "3 篇文章",
        createdAt: "2026-09-08 07:40:12",
        evidence: ["最近 30 天累计 4,218 次浏览", "均超过 180 天未更新"],
      },
      {
        id: 911,
        title: "2 篇文章缺少 SEO Description",
        description: "内容质量检查发现元数据缺口，可创建编辑任务后补齐。",
        status: "new",
        priority: "medium",
        sourceLabel: "发布质量巡检",
        targetLabel: "2 篇文章",
        createdAt: "2026-09-08 07:42:03",
        evidence: ["seo_description 为空", "文章当前仍处于已发布状态"],
      },
    ],
    candidateSets: [
      {
        id: 920,
        title: "为 OAuth BFF 文章选择标题",
        status: "pending",
        postId: 106,
        sourceRunId: 237,
        fieldType: "title",
        beforeValue: "浏览器与 BFF 绑定关系",
        createdAt: "2026-09-07 18:20:05",
        candidates: [
          {
            id: 9201,
            value: "OAuth BFF：浏览器会话到底绑定了什么？",
            rationale: "把核心问题前置，同时保留 OAuth BFF 关键词。",
          },
          {
            id: 9202,
            value: "从 Cookie 到 Token：理解 OAuth BFF 的浏览器边界",
            rationale: "强调浏览器边界和会话模型，更适合架构文章。",
          },
        ],
      },
    ],
    mediaCandidates: [
      {
        id: 930,
        title: "Kafka 背压示意图",
        status: "ready_to_generate",
        postId: 103,
        workflowRunId: undefined,
        headline: "Kafka 消费者背压",
        brief: "以消费端、缓冲队列和处理 worker 的流向解释背压，不使用品牌化素材。",
        placement: "inline",
        safetyStatus: "clear",
        copyrightStatus: "clear",
        createdAt: "2026-09-07 16:44:31",
      },
    ],
    editorialTasks: [
      {
        id: 940,
        title: "复核 AI Daily Briefing 引用来源",
        description: "确认 7 条外部引用的发布日期与正文陈述保持一致。",
        status: "open",
        priority: "high",
        sourceLabel: "运营建议 #912",
        createdAt: "2026-09-08 08:31:20",
      },
    ],
  },
  enabledWorkflowCount: 4,
};