export type AIOpsTab = "overview" | "inbox" | "automation" | "records";

export type ApprovalStatus = "pending" | "failed" | "approved" | "rejected";

export type ApprovalFixture = {
  id: number;
  runId: number;
  actionType: "create_draft" | "create_content_candidates" | "create_media_candidate";
  targetType: "post" | "page";
  targetId?: number;
  status: ApprovalStatus;
  reviewNote?: string;
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
  stepId: string;
  type: "choice" | "preview_confirm";
  title: string;
  options?: string[];
};

export type OperationsFixture = {
  suggestions: Array<{ id: number; title: string; status: "new" | "accepted" | "deferred" }>;
  candidateSets: Array<{ id: number; title: string; status: "pending" | "selected" }>;
  mediaCandidates: Array<{ id: number; title: string; status: "ready_to_generate" | "generated" }>;
  editorialTasks: Array<{ id: number; title: string; status: "open" | "done" }>;
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
      status: "failed",
      reviewNote: "column reference event_key is ambiguous",
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
      stepId: "hero-style",
      type: "choice",
      title: "为技术架构文章选择封面方向",
      options: ["极简架构图", "科技插画", "深色数据流"],
    },
  ],
  operations: {
    suggestions: [
      { id: 910, title: "3 篇旧文超过 180 天未更新", status: "new" },
      { id: 911, title: "2 篇文章缺少 SEO Description", status: "new" },
    ],
    candidateSets: [
      { id: 920, title: "OAuth BFF 文章标题候选", status: "pending" },
    ],
    mediaCandidates: [
      { id: 930, title: "Kafka 背压示意图", status: "ready_to_generate" },
    ],
    editorialTasks: [
      { id: 940, title: "复核 AI Daily Briefing 引用来源", status: "open" },
    ],
  },
  enabledWorkflowCount: 4,
};