import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BlogAdminAIOperationsDemo } from "../showcase/demos/products/blog-admin/ai/operations";
import { aiOpsAutomationRecordsFixture } from "../showcase/demos/products/blog-admin/ai/operations/automation-records-fixtures";
import {
  AIOpsInboxPanel,
  AIOpsOverviewPanel,
} from "../showcase/demos/products/blog-admin/ai/operations/overview-inbox";
import {
  aiOpsDecisionFixture,
  type ApprovalFixture,
  type InteractionFixture,
  type OperationsFixture,
} from "../showcase/demos/products/blog-admin/ai/operations/fixtures";

afterEach(cleanup);

describe("Blog Admin AI Operations overview/inbox canonical modules", () => {
  it("prioritizes operational attention and routes work to Inbox or Automation", () => {
    const onNavigate = vi.fn();
    render(
      <AIOpsOverviewPanel
        fixture={aiOpsDecisionFixture}
        automation={aiOpsAutomationRecordsFixture}
        onNavigate={onNavigate}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "今天需要关注什么" })).toBeTruthy();
    expect(screen.getByText("执行中")).toBeTruthy();
    expect(screen.getByText("失败运行")).toBeTruthy();
    expect(screen.getByText("等待人工")).toBeTruthy();
    expect(screen.getByText("Fixture Token")).toBeTruthy();
    expect(screen.getByText("需要关注")).toBeTruthy();
    expect(screen.getByText("自动化健康度")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /待我处理/ }));
    expect(onNavigate).toHaveBeenCalledWith("inbox");
    fireEvent.click(screen.getByRole("button", { name: "查看自动化" }));
    expect(onNavigate).toHaveBeenCalledWith("automation");
  });

  it("renders a governed proposal as readable decision content", () => {
    render(
      <AIOpsInboxPanel
        fixture={aiOpsDecisionFixture}
        selectedApprovalId={901}
        onSelectApproval={vi.fn()}
        onReviewApproval={vi.fn()}
        onResolveInteraction={vi.fn()}
        onOpenOperation={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "AI 每日资讯：模型、Agent 与工具链更新" })).toBeTruthy();
    expect(screen.getByText("汇总过去 24 小时经过核验的 AI 行业变化。")).toBeTruthy();
    expect(screen.getByText(/今日重点/)).toBeTruthy();
    expect(screen.getByText(/Agent 工具调用治理继续加强/)).toBeTruthy();
    expect(screen.getByText("批准后会发生什么")).toBeTruthy();
    expect(screen.getByText("不会发生什么")).toBeTruthy();
  });

  it("keeps failed approvals actionable and retries the same preserved proposal", () => {
    const onReviewApproval = vi.fn<(approval: ApprovalFixture, approved: boolean) => void>();
    render(
      <AIOpsInboxPanel
        fixture={aiOpsDecisionFixture}
        selectedApprovalId={902}
        onSelectApproval={vi.fn()}
        onReviewApproval={onReviewApproval}
        onResolveInteraction={vi.fn()}
        onOpenOperation={vi.fn()}
      />,
    );

    expect(screen.getByText("上次批准后的执行失败")).toBeTruthy();
    expect(screen.getByText("column reference event_key is ambiguous")).toBeTruthy();
    expect(screen.getByText("Kafka 高吞吐陷阱：并发并不总能换来 QPS")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "重试批准并执行" }));
    expect(onReviewApproval).toHaveBeenCalledWith(
      expect.objectContaining({ id: 902, status: "failed" }),
      true,
    );
  });

  it("keeps a failed approval retry in Inbox until the preserved proposal succeeds", () => {
    render(<BlogAdminAIOperationsDemo initialRoute={{ tab: "inbox", record: "workflow" }} />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "审批重试失败" }));
    fireEvent.click(screen.getByRole("button", { name: /为Kafka 消费者背压准备标题候选/ }));

    expect(screen.getByText("Kafka 高吞吐陷阱：并发并不总能换来 QPS")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "重试批准并执行" }));
    expect(screen.getByText("审批 #902 执行失败；提案未丢失，仍可从待我处理重试。")).toBeTruthy();
    expect(screen.getByText("下游执行失败；审批提案已保留，可修正后再次重试。")).toBeTruthy();
    expect(screen.getByRole("button", { name: "重试批准并执行" })).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "操作成功" }));
    fireEvent.click(screen.getByRole("button", { name: "重试批准并执行" }));
    expect(screen.getByText("审批 #902 已批准，后续执行仍受 Workflow 运行状态约束。")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "重试批准并执行" })).toBeNull();
  });

  it("keeps rejection as a distinct human decision path", () => {
    const onReviewApproval = vi.fn<(approval: ApprovalFixture, approved: boolean) => void>();
    render(
      <AIOpsInboxPanel
        fixture={aiOpsDecisionFixture}
        selectedApprovalId={901}
        onSelectApproval={vi.fn()}
        onReviewApproval={onReviewApproval}
        onResolveInteraction={vi.fn()}
        onOpenOperation={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "拒绝此建议" }));
    expect(onReviewApproval).toHaveBeenCalledWith(
      expect.objectContaining({ id: 901 }),
      false,
    );
  });

  it("preserves workflow interactions and resumes the source run with a structured response", () => {
    const onResolveInteraction = vi.fn<(task: InteractionFixture, response: unknown) => void>();
    render(
      <AIOpsInboxPanel
        fixture={aiOpsDecisionFixture}
        selectedApprovalId={901}
        onSelectApproval={vi.fn()}
        onReviewApproval={vi.fn()}
        onResolveInteraction={onResolveInteraction}
        onOpenOperation={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /为技术架构文章选择封面方向/ }));
    expect(screen.getByText("AI 每日资讯 · Run #245 · AI 每日资讯候选稿")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "科技插画" }));
    expect(onResolveInteraction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 903, workflowRunId: 245 }),
      { option: "科技插画" },
    );
  });

  it("keeps suggestions, candidate sets, media candidates and editorial tasks as separate decision types", () => {
    const onOpenOperation = vi.fn<(kind: keyof OperationsFixture, id: number) => void>();
    render(
      <AIOpsInboxPanel
        fixture={aiOpsDecisionFixture}
        selectedApprovalId={901}
        onSelectApproval={vi.fn()}
        onReviewApproval={vi.fn()}
        onResolveInteraction={vi.fn()}
        onOpenOperation={onOpenOperation}
      />,
    );

    expect(screen.getByRole("button", { name: /3 篇旧文超过 180 天未更新/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /为 OAuth BFF 文章选择标题/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Kafka 背压示意图/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /复核 AI Daily Briefing 引用来源/ })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /为 OAuth BFF 文章选择标题/ }));
    expect(screen.getByText("当前值：浏览器与 BFF 绑定关系")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "选择此项" })[0]);
    expect(onOpenOperation).toHaveBeenCalledWith("candidateSets", 920);
  });
});
