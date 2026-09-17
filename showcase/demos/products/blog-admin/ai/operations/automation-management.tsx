import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronRight, Clock3, Edit2, Plus, Power, Search, Trash2 } from "lucide-react";
import { Button, Card, Input, Modal, Select, Tag, Text } from "../../../../../../src/core";
import { TabPanelLead } from "../../../../../components/tab-panel-lead";
import type { WorkflowFixture } from "./automation-records-fixtures";
import { WorkflowEditor } from "./workflow-editor";

const stepLabels: Record<WorkflowFixture["steps"][number]["type"], string> = {
  resource_query: "资源筛选",
  model: "Agent",
  for_each: "逐项处理",
  approval_gate: "审批",
  output: "输出",
};

export function AutomationManagement({
  workflows,
  selectedWorkflowId,
  detailContent,
  onSave,
  onDelete,
  onToggle,
  onSelect,
  onBack,
  onOpenRecords,
}: {
  workflows: WorkflowFixture[];
  selectedWorkflowId?: number;
  detailContent?: ReactNode;
  onSave: (workflow: WorkflowFixture) => void;
  onDelete: (workflow: WorkflowFixture) => void;
  onToggle: (workflow: WorkflowFixture) => void;
  onSelect?: (workflow: WorkflowFixture) => void;
  onBack?: () => void;
  onOpenRecords?: (workflow: WorkflowFixture) => void;
}) {
  const [editing, setEditing] = useState<WorkflowFixture | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkflowFixture | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "enabled" | "disabled">("all");

  const nextId = workflows.reduce((highest, item) => Math.max(highest, item.id), 0) + 1;
  const useListRoute = selectedWorkflowId === undefined && Boolean(onSelect);
  const selected = selectedWorkflowId
    ? workflows.find((item) => item.id === selectedWorkflowId) ?? null
    : useListRoute
      ? null
      : workflows[0] ?? null;
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return workflows.filter((workflow) => {
      if (status === "enabled" && !workflow.enabled) return false;
      if (status === "disabled" && workflow.enabled) return false;
      if (!normalized) return true;
      return `${workflow.name} ${workflow.description} ${workflow.templateKey || ""}`.toLowerCase().includes(normalized);
    });
  }, [query, status, workflows]);

  if (editing) {
    return (
      <div className="flex flex-col gap-5">
        <TabPanelLead description="编辑 Workflow 的输入契约、流程定义、执行计划与运行边界；保存形成新版本，运行证据仍进入运行中心。" />
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
          description="Workflow 是持续运营目标的版本化定义；从列表进入某个流程后，再审阅定义、试运行或正式执行。"
          actions={(
            <Button size="small" variant="solid" color="primary" icon={<Plus />} onClick={() => setEditing("new")}>
              创建 Workflow
            </Button>
          )}
        />

        {workflows.length ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <Input
                  aria-label="搜索 Workflow"
                  prefix={<Search className="size-4" />}
                  placeholder="按名称、说明或模板搜索"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="lg:w-44">
                <Select
                  aria-label="按状态筛选 Workflow"
                  value={status}
                  onChange={(value) => setStatus(String(value) as "all" | "enabled" | "disabled")}
                >
                  <option value="all">全部状态</option>
                  <option value="enabled">已启用</option>
                  <option value="disabled">已停用</option>
                </Select>
              </div>
            </div>

            <Card padding="none" className="overflow-hidden">
              <div role="list" aria-label="Workflow 列表" className="divide-y">
                {visible.length ? visible.map((workflow) => (
                  <div key={workflow.id} role="listitem" className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      onClick={() => onSelect?.(workflow)}
                    >
                      <span className="flex flex-wrap items-center gap-2">
                        <strong className="text-sm">{workflow.name}</strong>
                        <Tag color={workflow.enabled ? "success" : undefined}>{workflow.enabled ? "已启用" : "已停用"}</Tag>
                        <Tag>v{workflow.currentVersion}</Tag>
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{workflow.description}</span>
                      <span className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
                        <span>{workflow.schedule} · {workflow.timezone}</span>
                        <span>下次：{workflow.nextRunAt}</span>
                        <span>{workflow.steps.length} 个步骤</span>
                        <span>运行 / 失败：{workflow.metrics.runs} / {workflow.metrics.failures}</span>
                      </span>
                    </button>
                    <Button size="small" variant="ghost" icon={<ChevronRight />} onClick={() => onSelect?.(workflow)}>
                      进入详情 / 运行
                    </Button>
                  </div>
                )) : (
                  <div className="p-6"><Text tone="muted">没有符合条件的 Workflow。</Text></div>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <Card padding="base"><Text tone="muted">还没有 Workflow，请先创建一项自动化。</Text></Card>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        {onBack ? (
          <Button size="small" variant="ghost" icon={<ArrowLeft />} onClick={onBack}>
            返回 Workflow 列表
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">{selected.name}</h2>
            <Tag color={selected.enabled ? "success" : undefined}>{selected.enabled ? "已启用" : "已停用"}</Tag>
            <Tag>v{selected.currentVersion}</Tag>
          </div>
          <Text className="mt-1" tone="muted">{selected.description}</Text>
        </div>
        <div
          className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end"
          data-slot="workflow-management-actions"
        >
          {onOpenRecords ? (
            <Button size="small" variant="outline" icon={<Clock3 />} onClick={() => onOpenRecords(selected)}>
              运行记录
            </Button>
          ) : null}
          <Button size="small" variant="outline" icon={<Edit2 />} onClick={() => setEditing(selected)}>
            编辑
          </Button>
          <Button size="small" variant="ghost" icon={<Power />} onClick={() => onToggle(selected)}>
            {selected.enabled ? "停用" : "启用"}
          </Button>
          <Button size="small" variant="ghost" color="error" icon={<Trash2 />} onClick={() => setDeleteTarget(selected)}>
            删除
          </Button>
        </div>
      </div>

      <Card padding="base">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div>
              <strong className="text-sm">流程定义</strong>
              <Text size="xs" tone="muted">{selected.steps.length} 个步骤，按实际执行顺序排列；定义与运行证据保持分离。</Text>
            </div>
            {selected.templateKey ? <Tag>{selected.templateKey}</Tag> : null}
          </div>
          <div className="divide-y rounded-md border">
            {selected.steps.map((step, index) => (
              <div key={step.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <strong className="block text-sm">{step.name}</strong>
                  <Text size="xs" tone="muted">{step.agent ? `${step.agent} · ` : ""}{step.detail || step.id}</Text>
                </div>
                <Tag>{stepLabels[step.type]}</Tag>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {detailContent}

      <Modal
        open={Boolean(deleteTarget)}
        title="确认删除 Workflow"
        description="Showcase 只删除当前静态 Workflow；真实产品仍由后端权限与审计链路约束。"
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
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
