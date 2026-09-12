import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BlogAdminAIOperationsDemo } from "../showcase/demos/products/blog-admin/ai/operations";
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

describe("Blog Admin AI Operations overview/inbox migration modules", () => {
  it("preserves the decision-first overview and routes work to Inbox/Automation", () => {
    const onNavigate = vi.fn();
    render(<AIOpsOverviewPanel fixture={aiOpsDecisionFixture} onNavigate={onNavigate} />);

    expect(screen.getByRole("heading", { name: "从一件想改善的事开始" })).toBeTruthy();
    expect(screen.getByText("待审批变更")).toBeTruthy();
    expect(screen.getByText("内容建议")).toBeTruthy();
    expect(screen.getByText("图片任务")).toBeTruthy();
    expect(screen.getByText("有 6 项工作等你决定")).toBeTruthy();
    expect(screen.getByText("已启用 4 个自动化流程。")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /待审批变更/ }));
    expect(onNavigate).toHaveBeenCalledWith("inbox");
    fireEvent.click(screen.getByRole("button", { name: "查看自动化" }));
    expect(onNavigate).toHaveBeenCalledWith("automation");
  });

  it("renders a governed proposal as readable content while retaining raw JSON for audit", () => {
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

    expect(screen.getByRole("heading", { level: 3, name: "AI 每日资讯：模型、Agent 与工具链更新" })).toBeTruthy();
    expect(screen.getByText("汇总过去 24 小时经过核验的 AI 行业变化。")).toBeTruthy();
    expect(screen.getByText("今日重点")).toBeTruthy();
    expect(screen.getByText("• Agent 工具调用治理继续加强。")).toBeTruthy();

    const details = screen.getByText("查看技术详情").closest("details");
    expect(details).toBeTruthy();
    fireEvent.click(screen.getByText("查看技术详情"));
    expect(within(details!).getByText(/"slug": "ai-daily-briefing"/)).toBeTruthy();
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

    expect(screen.getByText("上次执行失败，提案未丢失")).toBeTruthy();
    expect(screen.getByText("column reference event_key is ambiguous")).toBeTruthy();
    expect(screen.getByText("Kafka 高吞吐陷阱：并发并不总能换来 QPS")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "重试批准并执行" }));
    expect(onReviewApproval).toHaveBeenCalledWith(
      expect.objectContaining({ id: 902, status: "failed" }),
      true,
    );
  });

  it("keeps a failed approval retry in Inbox until the same preserved proposal succeeds", () => {
    render(<BlogAdminAIOperationsDemo initialRoute={{ tab: "inbox", record: "workflow" }} />);
    fireEvent.click(screen.getByRole("button", { name: "打开 Fixture 控制" }));
    fireEvent.click(screen.getByRole("radio", { name: "审批重试失败" }));
    fireEvent.click(screen.getByRole("button", { name: /为文章 #103 准备标题候选/ }));

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

    expect(screen.getByText("Run #245 · hero-style")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "科技插画" }));
    expect(onResolveInteraction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 903, workflowRunId: 245 }),
      { option: "科技插画" },
    );
  });

  it("keeps suggestions, candidate sets, media candidates and editorial tasks as separate product domains", () => {
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

    expect(screen.getByText("运营建议")).toBeTruthy();
    expect(screen.getByText("内容候选")).toBeTruthy();
    expect(screen.getByText("图片任务", { selector: ".text-base" })).toBeTruthy();
    expect(screen.getByText("编辑任务")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /OAuth BFF 文章标题候选/ }));
    expect(onOpenOperation).toHaveBeenCalledWith("candidateSets", 920);
  });
});
