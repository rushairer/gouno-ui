import { useEffect, useState } from "react";
import { History, Play, RotateCcw, TestTube2 } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Tag,
  Text,
} from "../../../../../../src/core";
import type {
  AIOpsRecordsTarget,
} from "./automation-records";
import type {
  WorkflowFixture,
  WorkflowRunStatus,
} from "./automation-records-fixtures";

type RunFeedback = {
  type: "success" | "error";
  message: string;
  runId?: number;
};

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="min-w-0 py-2">
      <Text size="xs" tone="muted">{label}</Text>
      <strong className="mt-1 block text-sm">{value}</strong>
      {detail ? <Text size="xs" tone="muted">{detail}</Text> : null}
    </div>
  );
}

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
        setFeedback({ type: "error", message: preflight.message || "运行前置检查未通过。" });
        return;
      }
      const result = await onRun(workflow.id, dryRun, input);
      if (result.status === "failed") {
        setFeedback({
          type: "error",
          runId: result.id,
          message: `${dryRun ? "Dry-run" : "运行"}失败（Run #${result.id}）。请修正后重试，运行证据已保留。`,
        });
        return;
      }
      setFeedback({
        type: "success",
        runId: result.id,
        message:
          result.status === "waiting_for_user"
            ? `Run #${result.id} 已进入等待用户状态，可从运行中心继续。`
            : result.status === "awaiting_approval"
              ? `Run #${result.id} 已等待审批，没有自动应用内容变更。`
              : `${dryRun ? "Dry-run" : "运行"}已创建 Run #${result.id}。`,
      });
    } catch (reason) {
      setFeedback({
        type: "error",
        message: reason instanceof Error ? reason.message : "Workflow 运行失败。",
      });
    } finally {
      setRunning(null);
    }
  };

  return (
    <div className="flex flex-col gap-5" aria-label={`${workflow.name} 执行工作区`}>
      <Card padding="base">
        <div className="flex flex-col gap-5">
          <div>
            <CardTitle className="text-base">运行当前 Workflow</CardTitle>
            <Text size="xs" tone="muted">先核对运行上下文，再试运行或正式执行；每次执行都会形成可追溯 Run。</Text>
          </div>

          <div className="grid border-y py-3 sm:grid-cols-2 xl:grid-cols-4 xl:divide-x">
            <div className="xl:pr-4"><Metric label="执行计划" value={workflow.schedule} detail={workflow.timezone} /></div>
            <div className="xl:px-4"><Metric label="下次运行" value={workflow.nextRunAt} /></div>
            <div className="xl:px-4"><Metric label="运行 / 失败 / Token" value={`${workflow.metrics.runs} / ${workflow.metrics.failures} / ${workflow.metrics.tokens}`} /></div>
            <div className="xl:pl-4">
              <Metric
                label="运行范围"
                value={workflow.scopeMode === "strict" ? "严格限制所选资源" : "兼容模式"}
                detail={workflow.discoveryTools.length ? `允许发现：${workflow.discoveryTools.join(", ")}` : "无额外 discovery tools"}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <strong className="text-sm">本次运行输入</strong>
              <Text size="xs" tone="muted">默认值来自运行输入契约；人工执行可临时覆盖，不修改 Workflow Version。</Text>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
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
                {running === "run" ? "运行中…" : "运行"}
              </Button>
            </div>
            {feedback ? (
              <Alert
                type={feedback.type}
                showIcon
                title={feedback.message}
                description={feedback.runId ? `运行记录：Run #${feedback.runId}` : undefined}
              />
            ) : null}
            {feedback?.runId ? (
              <div>
                <Button
                  variant="ghost"
                  onClick={() => onOpenRecords({ record: "workflow", workflow: workflow.id, run: feedback.runId })}
                >
                  查看 Run #{feedback.runId}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <CardHeader className="border-b p-6">
          <div className="flex items-center gap-2">
            <History className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">版本历史</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="divide-y p-0">
          {workflow.versions.map((version) => (
            <div key={version.version} className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <strong>v{version.version}</strong>
                <Text size="xs" tone="muted">{version.createdAt} · {version.note}</Text>
              </div>
              {version.version !== workflow.currentVersion ? (
                <Button
                  size="small"
                  variant="outline"
                  icon={<RotateCcw />}
                  onClick={() => onRollback(workflow.id, version.version)}
                >
                  回滚到 v{version.version}
                </Button>
              ) : <Tag color="primary">当前版本</Tag>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
