import { useEffect, useState } from "react";
import { Clock3, Edit2, Plus, Power, Trash2 } from "lucide-react";
import { Button, Card, Modal, Select, Tag, Text } from "../../../../../../src/core";
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
  onSave,
  onDelete,
  onToggle,
  onSelect,
  onOpenRecords,
}: {
  workflows: WorkflowFixture[];
  onSave: (workflow: WorkflowFixture) => void;
  onDelete: (workflow: WorkflowFixture) => void;
  onToggle: (workflow: WorkflowFixture) => void;
  onSelect?: (workflow: WorkflowFixture) => void;
  onOpenRecords?: (workflow: WorkflowFixture) => void;
}) {
  const [selectedId, setSelectedId] = useState(workflows[0]?.id ?? 0);
  const [editing, setEditing] = useState<WorkflowFixture | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkflowFixture | null>(null);

  useEffect(() => {
    if (!workflows.some((item) => item.id === selectedId)) setSelectedId(workflows[0]?.id ?? 0);
  }, [selectedId, workflows]);

  const selected = workflows.find((item) => item.id === selectedId) ?? workflows[0] ?? null;
  const nextId = workflows.reduce((highest, item) => Math.max(highest, item.id), 0) + 1;

  const selectWorkflow = (id: number) => {
    const workflow = workflows.find((item) => item.id === id);
    setSelectedId(id);
    if (workflow) onSelect?.(workflow);
  };

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
            setSelectedId(workflow.id);
            setEditing(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead
        description="Workflow 是持续运营目标的版本化定义；先审阅输入、步骤与边界，再从同一上下文试运行或正式执行。"
        actions={(
          <Button
            size="small"
            variant="solid"
            color="primary"
            icon={<Plus />}
            onClick={() => setEditing("new")}
          >
            创建 Workflow
          </Button>
        )}
      />

      {selected ? (
        <Card padding="base">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <Text size="xs" tone="muted">Workflow 定义</Text>
                <div className="mt-2 max-w-xl">
                  <Select
                    aria-label="选择要管理的 Workflow"
                    value={String(selected.id)}
                    onChange={(value) => selectWorkflow(Number(value))}
                  >
                    {workflows.map((workflow) => (
                      <option key={workflow.id} value={String(workflow.id)}>
                        {workflow.name} · v{workflow.currentVersion}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Tag color={selected.enabled ? "success" : undefined}>{selected.enabled ? "已启用" : "已停用"}</Tag>
                  <Text size="xs" tone="muted">{selected.description}</Text>
                </div>
              </div>

              <div
                className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end"
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
                <Button size="small" variant="outline" icon={<Edit2 />} onClick={() => setEditing(selected)}>
                  编辑
                </Button>
                <Button size="small" variant="ghost" icon={<Power />} onClick={() => onToggle(selected)}>
                  {selected.enabled ? "停用" : "启用"}
                </Button>
                <Button
                  size="small"
                  variant="ghost"
                  color="error"
                  icon={<Trash2 />}
                  onClick={() => setDeleteTarget(selected)}
                >
                  删除
                </Button>
              </div>
            </div>

            <div className="border-t pt-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <strong className="text-sm">流程定义</strong>
                  <Text size="xs" tone="muted">{selected.steps.length} 个步骤，按实际执行顺序排列。</Text>
                </div>
                {selected.templateKey ? <Tag>{selected.templateKey}</Tag> : null}
              </div>
              <div className="mt-4 divide-y rounded-md border">
                {selected.steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <strong className="block text-sm">{step.name}</strong>
                      <Text size="xs" tone="muted">
                        {step.agent ? `${step.agent} · ` : ""}{step.detail || step.id}
                      </Text>
                    </div>
                    <Tag>{stepLabels[step.type]}</Tag>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card padding="base"><Text tone="muted">还没有 Workflow，请先创建一项自动化。</Text></Card>
      )}

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
