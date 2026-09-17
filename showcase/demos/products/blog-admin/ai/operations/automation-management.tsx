import { useMemo, useState, type ReactNode } from "react";
import {
  Clock3,
  Edit2,
  GitBranch,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  Input,
  Modal,
  Select,
  Tag,
  Text,
} from "../../../../../../src/core";
import { TabPanelLead } from "../../../../../components/tab-panel-lead";
import type {
  WorkflowFixture,
  WorkflowRunFixture,
  WorkflowRunStatus,
} from "./automation-records-fixtures";
import { WorkflowEditor } from "./workflow-editor";
import { OpsMeta, OpsObjectRow, OpsRegionHeading } from "./canonical-patterns";

const stepLabels: Record<WorkflowFixture["steps"][number]["type"], string> = {
  resource_query: "资源筛选",
  model: "Agent",
  for_each: "逐项处理",
  approval_gate: "审批",
  human_interaction: "人工交互",
  output: "输出",
};

function runStatusLabel(status?: WorkflowRunStatus) {
  if (!status) return "暂无运行";
  if (status === "failed") return "失败";
  if (status === "waiting_for_user") return "等待用户";
  if (status === "awaiting_approval") return "等待审批";
  if (status === "running") return "运行中";
  if (status === "queued") return "已排队";
  if (status === "cancelled") return "已取消";
  return "成功";
}

function runStatusTag(status?: WorkflowRunStatus) {
  if (!status) return <Tag>暂无运行</Tag>;
  if (status === "failed") return <Tag color="error">失败</Tag>;
  if (["waiting_for_user", "awaiting_approval"].includes(status)) {
    return <Tag color="warning">{runStatusLabel(status)}</Tag>;
  }
  if (["running", "queued"].includes(status)) {
    return <Tag color="primary">{runStatusLabel(status)}</Tag>;
  }
  if (status === "succeeded") return <Tag color="success">成功</Tag>;
  return <Tag>已取消</Tag>;
}

function workflowSuccessRate(workflow: WorkflowFixture) {
  if (!workflow.metrics.runs) return 0;
  return Math.round(
    ((workflow.metrics.runs - workflow.metrics.failures) /
      workflow.metrics.runs) *
      100,
  );
}

function runDuration(run: WorkflowRunFixture) {
  const duration = run.steps.reduce((sum, step) => sum + step.durationMs, 0);
  if (duration < 1000) return `${duration} ms`;
  return `${(duration / 1000).toFixed(duration >= 10000 ? 0 : 1)} s`;
}

function WorkflowRail({
  workflows,
  selected,
  query,
  status,
  onQueryChange,
  onStatusChange,
  onSelect,
}: {
  workflows: WorkflowFixture[];
  selected: WorkflowFixture | null;
  query: string;
  status: "all" | "enabled" | "disabled";
  onQueryChange: (value: string) => void;
  onStatusChange: (value: "all" | "enabled" | "disabled") => void;
  onSelect?: (workflow: WorkflowFixture) => void;
}) {
  return (
    <aside
      data-slot="ops-rail"
      className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border bg-background"
      aria-label="Workflow 导航"
    >
      <div className="shrink-0 border-b bg-muted/20 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <strong className="text-sm">Workflows</strong>
            <Text size="xs" tone="muted" className="mt-0.5">
              {workflows.length} 项自动化资产
            </Text>
          </div>
          <Tag>
            {workflows.filter((workflow) => workflow.enabled).length} 已启用
          </Tag>
        </div>
        <div className="flex flex-col gap-2">
          <Input
            aria-label="搜索 Workflow"
            prefix={<Search className="size-4" />}
            placeholder="搜索 Workflow"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          <Select
            aria-label="按状态筛选 Workflow"
            value={status}
            onChange={(value) =>
              onStatusChange(String(value) as "all" | "enabled" | "disabled")
            }
          >
            <option value="all">全部状态</option>
            <option value="enabled">已启用</option>
            <option value="disabled">已停用</option>
          </Select>
        </div>
      </div>

      <div
        data-slot="ops-rail-body"
        role="list"
        aria-label="Workflow 列表"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        {workflows.length ? (
          workflows.map((workflow) => (
            <div key={workflow.id} role="listitem">
              <OpsObjectRow
                leading={<GitBranch className="size-4" />}
                title={workflow.name}
                status={
                  <Tag color={workflow.enabled ? "success" : undefined}>
                    {workflow.enabled ? "已启用" : "已停用"}
                  </Tag>
                }
                meta={`${workflow.schedule} · v${workflow.currentVersion}`}
                summary={workflow.description}
                signals={
                  <>
                    <OpsMeta>下次 {workflow.nextRunAt}</OpsMeta>
                    <OpsMeta>
                      最近 {runStatusLabel(workflow.latestRun?.status)}
                    </OpsMeta>
                  </>
                }
                selected={selected?.id === workflow.id}
                onClick={() => onSelect?.(workflow)}
                ariaLabel={`打开 Workflow：${workflow.name}`}
              />
            </div>
          ))
        ) : (
          <div className="p-6">
            <Text tone="muted">没有符合条件的 Workflow。</Text>
          </div>
        )}
      </div>
    </aside>
  );
}

function WorkflowMetric({
  label,
  value,
  detail,
  progress,
}: {
  label: string;
  value: string;
  detail: string;
  progress?: number;
}) {
  return (
    <div className="rounded-lg border bg-muted/[0.18] p-4">
      <Text size="xs" tone="muted">
        {label}
      </Text>
      <strong className="mt-2 block text-2xl font-semibold tracking-tight">
        {value}
      </strong>
      {progress !== undefined ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
          />
        </div>
      ) : null}
      <Text size="xs" tone="muted" className="mt-2">
        {detail}
      </Text>
    </div>
  );
}

function ScheduleFact({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="min-w-0 px-4 py-4 first:pl-0 last:pr-0">
      <Text size="xs" tone="muted">
        {label}
      </Text>
      <strong className="mt-1 block text-sm">{value}</strong>
      <Text size="xs" tone="muted" className="mt-1">
        {detail}
      </Text>
    </div>
  );
}

export function AutomationManagement({
  workflows,
  workflowRuns = [],
  selectedWorkflowId,
  detailContent,
  onSave,
  onDelete,
  onToggle,
  onSelect,
  onOpenRecords,
  onOpenRun,
}: {
  workflows: WorkflowFixture[];
  workflowRuns?: WorkflowRunFixture[];
  selectedWorkflowId?: number;
  detailContent?: ReactNode;
  onSave: (workflow: WorkflowFixture) => void;
  onDelete: (workflow: WorkflowFixture) => void;
  onToggle: (workflow: WorkflowFixture) => void;
  onSelect?: (workflow: WorkflowFixture) => void;
  onOpenRecords?: (workflow: WorkflowFixture) => void;
  onOpenRun?: (run: WorkflowRunFixture) => void;
}) {
  const [editing, setEditing] = useState<WorkflowFixture | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkflowFixture | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "enabled" | "disabled">("all");

  const nextId =
    workflows.reduce((highest, item) => Math.max(highest, item.id), 0) + 1;
  const useListRoute = selectedWorkflowId === undefined && Boolean(onSelect);
  const selected = selectedWorkflowId
    ? (workflows.find((item) => item.id === selectedWorkflowId) ?? null)
    : useListRoute
      ? null
      : (workflows[0] ?? null);
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return workflows.filter((workflow) => {
      if (status === "enabled" && !workflow.enabled) return false;
      if (status === "disabled" && workflow.enabled) return false;
      if (!normalized) return true;
      return `${workflow.name} ${workflow.description} ${workflow.templateKey || ""}`
        .toLowerCase()
        .includes(normalized);
    });
  }, [query, status, workflows]);

  if (editing) {
    return (
      <div className="flex flex-col gap-5">
        <TabPanelLead
          title="编辑自动化"
          description="编辑 Workflow 的输入契约、流程定义、执行计划与运行边界；保存形成新版本，运行证据继续进入运行中心。"
        />
        <WorkflowEditor
          value={editing}
          nextId={nextId}
          onCancel={() => setEditing(null)}
          onSave={(workflow) => {
            onSave(workflow);
            setEditing(null);
          }}
        />
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="flex flex-col gap-5">
        <TabPanelLead
          title="自动化资产"
          description="Workflow 是持续运行的版本化自动化资产。先从列表判断状态与最近结果，再进入定义、边界和人工执行。"
          actions={
            <Button
              size="small"
              variant="solid"
              color="primary"
              icon={<Plus />}
              onClick={() => setEditing("new")}
            >
              创建 Workflow
            </Button>
          }
        />

        {workflows.length ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <Input
                  aria-label="搜索 Workflow"
                  prefix={<Search className="size-4" />}
                  placeholder="搜索名称、目标或模板"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="lg:w-44">
                <Select
                  aria-label="按状态筛选 Workflow"
                  value={status}
                  onChange={(value) =>
                    setStatus(String(value) as "all" | "enabled" | "disabled")
                  }
                >
                  <option value="all">全部状态</option>
                  <option value="enabled">已启用</option>
                  <option value="disabled">已停用</option>
                </Select>
              </div>
            </div>

            <div
              role="list"
              aria-label="Workflow 列表"
              className="overflow-hidden rounded-xl border bg-background"
            >
              {visible.length ? (
                visible.map((workflow) => (
                  <div key={workflow.id} role="listitem">
                    <OpsObjectRow
                      leading={<GitBranch className="size-4" />}
                      title={workflow.name}
                      status={
                        <Tag color={workflow.enabled ? "success" : undefined}>
                          {workflow.enabled ? "已启用" : "已停用"}
                        </Tag>
                      }
                      meta={`${workflow.schedule} · ${workflow.timezone} · 下次 ${workflow.nextRunAt}`}
                      summary={
                        workflow.latestRun?.summary || workflow.description
                      }
                      signals={
                        <>
                          <OpsMeta>v{workflow.currentVersion}</OpsMeta>
                          <OpsMeta>{workflow.steps.length} 个步骤</OpsMeta>
                          <OpsMeta>
                            最近：{runStatusLabel(workflow.latestRun?.status)}
                          </OpsMeta>
                          <OpsMeta>
                            {workflow.metrics.runs} 次运行 ·{" "}
                            {workflow.metrics.failures} 次失败
                          </OpsMeta>
                        </>
                      }
                      onClick={() => onSelect?.(workflow)}
                      ariaLabel={`打开 Workflow：${workflow.name}`}
                    />
                  </div>
                ))
              ) : (
                <div className="p-6">
                  <Text tone="muted">没有符合条件的 Workflow。</Text>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Card padding="base">
            <Text tone="muted">还没有 Workflow，请先创建一项自动化。</Text>
          </Card>
        )}
      </div>
    );
  }

  const recentRuns = workflowRuns
    .filter((run) => run.workflowId === selected.id)
    .slice(0, 5);
  const successRate = workflowSuccessRate(selected);

  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead
        description="Workflow 是持续运行的版本化自动化资产。左侧选择资产，右侧直接查看健康度、调度、运行记录、定义与人工执行。"
        actions={
          <Button
            size="small"
            variant="solid"
            color="primary"
            icon={<Plus />}
            onClick={() => setEditing("new")}
          >
            创建 Workflow
          </Button>
        }
      />

      <div
        data-slot="ops-master-detail"
        className="grid min-w-0 items-stretch gap-5 xl:grid-cols-[21rem_minmax(0,1fr)]"
      >
        <WorkflowRail
          workflows={visible}
          selected={selected}
          query={query}
          status={status}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
          onSelect={onSelect}
        />

        <div
          data-slot="ops-detail-stack"
          className="flex min-w-0 flex-col gap-5"
        >
          <section
            className="overflow-hidden rounded-xl border bg-background"
            aria-label={`${selected.name} Workflow 概览`}
          >
            <div className="flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.08] text-primary">
                  <GitBranch className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-tight">
                      {selected.name}
                    </h2>
                    <Tag color={selected.enabled ? "success" : undefined}>
                      {selected.enabled ? "已启用" : "已停用"}
                    </Tag>
                    <Tag>v{selected.currentVersion}</Tag>
                  </div>
                  <Text className="mt-1 max-w-3xl" tone="muted">
                    {selected.description}
                  </Text>
                </div>
              </div>
              <div
                className="flex flex-wrap items-center gap-2"
                data-slot="workflow-management-actions"
              >
                {onOpenRecords ? (
                  <Button
                    size="small"
                    variant="outline"
                    icon={<Clock3 />}
                    onClick={() => onOpenRecords(selected)}
                  >
                    运行记录
                  </Button>
                ) : null}
                <Button
                  size="small"
                  variant="outline"
                  icon={<Edit2 />}
                  onClick={() => setEditing(selected)}
                >
                  编辑
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton
                      label="更多 Workflow 操作"
                      size="small"
                      variant="outline"
                      icon={<MoreHorizontal />}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onToggle(selected)}>
                      {selected.enabled ? "停用 Workflow" : "启用 Workflow"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => setDeleteTarget(selected)}
                    >
                      <span className="flex items-center gap-2 text-destructive">
                        <Trash2 className="size-4" />
                        删除 Workflow
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid gap-3 p-6 sm:grid-cols-2 2xl:grid-cols-4">
              <WorkflowMetric
                label="成功率"
                value={`${successRate}%`}
                detail={`${selected.metrics.runs} 次运行中的完成率`}
                progress={successRate}
              />
              <WorkflowMetric
                label="累计运行"
                value={String(selected.metrics.runs)}
                detail={`最近 ${runStatusLabel(selected.latestRun?.status)}`}
              />
              <WorkflowMetric
                label="失败次数"
                value={String(selected.metrics.failures)}
                detail={
                  selected.metrics.failures
                    ? "可在运行中心追溯失败证据"
                    : "暂无失败记录"
                }
              />
              <WorkflowMetric
                label="Token 消耗"
                value={selected.metrics.tokens.toLocaleString()}
                detail="累计 Workflow Run"
              />
            </div>

            <div className="mx-6 grid border-t sm:grid-cols-2 xl:grid-cols-4 xl:divide-x">
              <ScheduleFact
                label="下次运行"
                value={selected.nextRunAt}
                detail={
                  selected.enabled ? "Scheduler 已启用" : "Workflow 已停用"
                }
              />
              <ScheduleFact
                label="执行计划"
                value={selected.schedule}
                detail={selected.timezone}
              />
              <ScheduleFact
                label="当前版本"
                value={`v${selected.currentVersion}`}
                detail={selected.templateKey || "自定义 Workflow"}
              />
              <ScheduleFact
                label="流程规模"
                value={`${selected.steps.length} 个步骤`}
                detail={`${selected.inputFields.length} 项运行输入`}
              />
            </div>
          </section>

          <section
            className="overflow-hidden rounded-xl border bg-background"
            aria-label="最近运行"
          >
            <div className="border-b px-6 py-4">
              <OpsRegionHeading
                title="最近运行"
                description="先看最近执行结果，需要完整步骤、资源与人工交互证据时进入运行中心。"
                action={
                  onOpenRecords ? (
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => onOpenRecords(selected)}
                    >
                      查看全部
                    </Button>
                  ) : undefined
                }
              />
            </div>
            {recentRuns.length ? (
              <div className="divide-y">
                {recentRuns.map((run) => (
                  <Button
                    key={run.id}
                    type="button"
                    variant="ghost"
                    block
                    className="grid h-auto w-full min-w-0 grid-cols-1 gap-3 whitespace-normal rounded-none px-6 py-3.5 text-left font-normal transition-colors hover:bg-muted/35 sm:grid-cols-[7rem_7rem_minmax(7rem,0.7fr)_6rem_minmax(0,1.5fr)] sm:items-center [&>span]:contents"
                    onClick={() => onOpenRun?.(run)}
                    aria-label={`打开最近 Run #${run.id}`}
                  >
                    <strong className="text-sm">Run #{run.id}</strong>
                    <span>{runStatusTag(run.status)}</span>
                    <Text size="xs" tone="muted">
                      {run.startedAt}
                    </Text>
                    <Text size="xs" tone="muted">
                      {runDuration(run)}
                    </Text>
                    <span className="min-w-0">
                      <Text size="sm" className="truncate">
                        {run.errorMessage ||
                          run.outputSummary ||
                          run.steps[run.steps.length - 1]?.detail ||
                          "运行证据已记录"}
                      </Text>
                      <Text size="xs" tone="muted" className="mt-0.5">
                        {run.tokenUsage.toLocaleString()} Token
                        {run.dryRun ? " · Dry-run" : ""}
                      </Text>
                    </span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="p-6">
                <Text tone="muted">这个 Workflow 暂无运行记录。</Text>
              </div>
            )}
          </section>

          <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
            <section
              className="overflow-hidden rounded-xl border bg-background"
              aria-label="Workflow 流程定义"
            >
              <div className="border-b px-6 py-4">
                <OpsRegionHeading
                  title="流程定义"
                  description={`${selected.steps.length} 个步骤，按实际执行顺序排列。定义说明“会做什么”，运行证据在运行中心查看。`}
                  action={
                    selected.templateKey ? (
                      <Tag>{selected.templateKey}</Tag>
                    ) : undefined
                  }
                />
              </div>
              <ol className="divide-y">
                {selected.steps.map((step, index) => (
                  <li key={step.id} className="flex gap-4 px-6 py-4">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-sm">{step.name}</strong>
                        <Tag>{stepLabels[step.type]}</Tag>
                      </div>
                      <Text size="xs" tone="muted" className="mt-1">
                        {step.agent ? `${step.agent} · ` : ""}
                        {step.detail || step.id}
                      </Text>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <div className="flex min-w-0 flex-col gap-5">
              <section
                className="rounded-xl border bg-background p-6"
                aria-label="Workflow 运行边界"
              >
                <OpsRegionHeading
                  title="运行边界"
                  description="决定 Workflow 可以发现什么、哪些对象可以成为目标，以及空查询时如何结束。"
                />
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Scope</dt>
                    <dd className="mt-1 font-medium">
                      {selected.scopeMode === "strict"
                        ? "严格限制目标资源"
                        : "Unscoped 兼容模式"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Discovery tools
                    </dt>
                    <dd className="mt-1 font-medium">
                      {selected.discoveryTools.length
                        ? selected.discoveryTools.join(" · ")
                        : "无额外发现工具"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      资源查询为空
                    </dt>
                    <dd className="mt-1 font-medium">
                      {selected.resourceQueryEmptyPolicy === "succeed"
                        ? "正常结束，不产生后续动作"
                        : "视为运行失败"}
                    </dd>
                  </div>
                  {selected.resourceQueryLastCount !== undefined ? (
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        最近资源命中
                      </dt>
                      <dd className="mt-1 font-medium">
                        {selected.resourceQueryLastCount} 项 ·{" "}
                        {selected.resourceQueryLastRunAt}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </section>

              <section
                className="rounded-xl border bg-background p-6"
                aria-label="Workflow 输入契约"
              >
                <OpsRegionHeading
                  title="运行输入契约"
                  description="人工执行可以覆盖默认值，但不会因此改写当前 Workflow Version。"
                />
                <div className="mt-4 divide-y">
                  {selected.inputFields.map((field) => (
                    <div key={field.key} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-sm">{field.label}</strong>
                        <Text size="xs" tone="muted">
                          {field.type}
                          {field.required ? " · 必填" : ""}
                        </Text>
                      </div>
                      <Text size="xs" tone="muted" className="mt-1">
                        默认：{String(field.defaultValue ?? "—")}
                        {field.description ? ` · ${field.description}` : ""}
                      </Text>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {detailContent}
        </div>
      </div>

      <Modal
        open={Boolean(deleteTarget)}
        title="确认删除 Workflow"
        description="删除属于高风险操作；真实 Blog Admin 还会经过权限、Recent MFA 与审计链路。"
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onOk={() => {
          if (!deleteTarget) return;
          onDelete(deleteTarget);
          setDeleteTarget(null);
        }}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ variant: "solid", color: "error" }}
        closeOnBackdrop
      >
        <Text>确定删除「{deleteTarget?.name}」吗？</Text>
      </Modal>
    </div>
  );
}
