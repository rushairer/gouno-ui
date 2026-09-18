import { useEffect, useState } from "react";
import { Clock3, History, Play, RotateCcw, TestTube2 } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Input,
  Tag,
  Text,
} from "../../../../../../src/core";
import type { AIOpsRecordsTarget } from "./automation-records";
import type { WorkflowFixture, WorkflowRunStatus } from "./automation-records-fixtures";
import { OpsRegionHeading } from "./canonical-patterns";

type RunFeedback = {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  runId?: number;
};

export function WorkflowExecutionPanel({
  workflow,
  onPreflight,
  onRun,
  onRollback,
  onOpenRecords,
}: {
  workflow: WorkflowFixture;
  onPreflight: (
    workflowId: number,
    dryRun: boolean,
    input: Record<string, unknown>,
  ) => Promise<{ ready: boolean; message?: string }>;
  onRun: (
    workflowId: number,
    dryRun: boolean,
    input: Record<string, unknown>,
  ) => Promise<{ id: number; status: WorkflowRunStatus }>;
  onRollback: (workflowId: number, version: number) => void;
  onOpenRecords: (target: AIOpsRecordsTarget) => void;
}) {
  const [input, setInput] = useState(() => ({ ...workflow.input }));
  const [running, setRunning] = useState<"run" | "dry" | null>(null);
  const [feedback, setFeedback] = useState<RunFeedback | null>(null);

  useEffect(() => {
    setInput({ ...workflow.input });
    setFeedback(null);
    setRunning(null);
  }, [workflow.id]);

  const execute = async (dryRun: boolean) => {
    setRunning(dryRun ? "dry" : "run");
    setFeedback(null);
    try {
      const preflight = await onPreflight(workflow.id, dryRun, input);
      if (!preflight.ready) {
        setFeedback({
          type: "error",
          title: "前置检查未通过",
          message: preflight.message || "请修正 Workflow 配置或输入后再运行。",
        });
        return;
      }
      const result = await onRun(workflow.id, dryRun, input);
      if (result.status === "failed") {
        setFeedback({
          type: "error",
          runId: result.id,
          title: `${dryRun ? "Dry-run" : "运行"}失败 · Run #${result.id}`,
          message: "失败证据已经持久化。进入运行中心查看失败步骤、资源与事件后再决定是否重试。",
        });
        return;
      }
      if (result.status === "awaiting_approval") {
        setFeedback({
          type: "success",
          runId: result.id,
          title: `Run #${result.id} 已执行到人工审批`,
          message: "本次运行没有自动应用内容变更；审批任务已经进入人工决策链路。",
        });
        return;
      }
      if (result.status === "waiting_for_user") {
        setFeedback({
          type: "success",
          runId: result.id,
          title: `Run #${result.id} 正在等待人工输入`,
          message: "运行证据已保留，完成选择、输入或预览确认后，后台 Worker 会从当前步骤继续。",
        });
        return;
      }
      setFeedback({
        type: "success",
        runId: result.id,
        title: `${dryRun ? "Dry-run" : "运行"}已创建 · Run #${result.id}`,
        message: dryRun
          ? "试运行只验证输入、范围和执行路径，不写入产品数据。"
          : "请求已经形成可追踪 Run；真实产品由后台 Worker 异步执行。",
      });
    } catch (reason) {
      setFeedback({
        type: "error",
        title: "无法创建运行",
        message: reason instanceof Error ? reason.message : "Workflow 运行请求失败。",
      });
    } finally {
      setRunning(null);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]" aria-label={`${workflow.name} 执行工作区`}>
      <Card padding="none" data-slot="workflow-run-surface" className="overflow-hidden" aria-label="运行当前 Workflow">
        <div className="border-b p-6">
          <OpsRegionHeading
          title="运行当前 Workflow"
          description="人工执行先做 Preflight，再创建持久化 Run。Run 由后台 Worker 异步推进，状态与证据统一进入运行中心。"
          action={<Tag color={workflow.enabled ? "success" : undefined}>{workflow.enabled ? "可运行" : "已停用"}</Tag>}
          />
        </div>

        <div className="p-6">
          <div>
            <strong className="text-sm">本次运行输入</strong>
            <Text size="xs" tone="muted" className="mt-1">默认值来自 Workflow 输入契约；这里只覆盖本次 Run，不形成新版本。</Text>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium">
              {workflow.inputFields.find((field) => field.key === "topic")?.label || "主题"}
              <Input
                aria-label="Workflow 主题"
                value={input.topic}
                onChange={(event) => setInput((current) => ({ ...current, topic: event.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              {workflow.inputFields.find((field) => field.key === "days")?.label || "时间范围（天）"}
              <Input
                aria-label="Workflow 时间范围"
                type="number"
                min={1}
                value={input.days}
                onChange={(event) => setInput((current) => ({ ...current, days: Number(event.target.value) || 1 }))}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Text size="xs" tone="muted">运行范围</Text>
            <strong className="mt-1 block text-sm">{workflow.scopeMode === "strict" ? "遵守 Workflow 严格资源边界" : "使用 Workflow 兼容范围"}</strong>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              icon={<TestTube2 />}
              disabled={Boolean(running)}
              onClick={() => void execute(true)}
            >
              {running === "dry" ? "Dry-run 中…" : "Dry-run"}
            </Button>
            <Button
              variant="solid"
              color="primary"
              icon={<Play />}
              disabled={!workflow.enabled || Boolean(running)}
              onClick={() => void execute(false)}
            >
              {running === "run" ? "提交运行…" : "运行"}
            </Button>
          </div>
        </div>

        {feedback ? (
          <div className="border-t p-6">
            <Alert
              type={feedback.type}
              showIcon
              title={feedback.title}
              description={feedback.message}
            />
            {feedback.runId ? (
              <div className="mt-3">
                <Button
                  size="small"
                  variant="ghost"
                  icon={<Clock3 />}
                  onClick={() => onOpenRecords({ record: "workflow", workflow: workflow.id, run: feedback.runId })}
                >
                  查看 Run #{feedback.runId}
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Card>

      <Card padding="none" className="overflow-hidden" aria-label="Workflow 版本历史">
        <div className="border-b px-5 py-4">
          <OpsRegionHeading
            title="版本历史"
            description="回滚改变当前 Workflow 定义；历史 Run 仍引用各自执行时的版本。"
            action={<History className="size-4 text-muted-foreground" />}
          />
        </div>
        <div className="divide-y">
          {workflow.versions.map((version) => (
            <div key={version.version} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <strong className="text-sm">v{version.version}</strong>
                  {version.version === workflow.currentVersion ? <Tag color="primary">当前版本</Tag> : null}
                </div>
                <Text size="xs" tone="muted" className="mt-1">{version.createdAt} · {version.note}</Text>
              </div>
              {version.version !== workflow.currentVersion ? (
                <Button
                  size="small"
                  variant="ghost"
                  icon={<RotateCcw />}
                  onClick={() => onRollback(workflow.id, version.version)}
                >
                  回滚到 v{version.version}
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
