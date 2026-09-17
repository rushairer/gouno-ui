import { useEffect, useState } from "react";
import { Clock3, Edit2, Plus, Power, Trash2 } from "lucide-react";
import { Button, Card, Modal, Select, Tag, Text } from "../../../../../../src/core";
import { TabPanelLead } from "../../../../../components/tab-panel-lead";
import type { WorkflowFixture } from "./automation-records-fixtures";
import { WorkflowEditor } from "./workflow-editor";

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
        <TabPanelLead description="把 Workflow 定义按基础信息、执行计划、运行边界和默认输入分组；保存形成新版本，运行证据仍进入运行中心。" />
        <WorkflowEditor
          value={editing}
          nextId={nextId}
          onCancel={() => setEditing(null)}
          onSave={(workflow) => {
            onSave(workflow);
            setSelectedId(workflow.id);
            onSelect?.(workflow);
            setEditing(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead
        description="选择一个 Workflow 后在同一上下文中管理定义、执行和运行证据；高频执行动作与低频配置操作保持清晰层级。"
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
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <Text size="xs" tone="muted">当前 Workflow</Text>
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
                className="flex w-full flex-wrap items-center gap-2 xl:w-auto xl:justify-end"
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

            <div className="grid border-t pt-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="min-w-0 py-2 pr-4 sm:border-r">
                <Text size="xs" tone="muted">执行计划</Text>
                <strong className="mt-1 block text-sm">{selected.schedule}</strong>
                <Text size="xs" tone="muted">{selected.timezone}</Text>
              </div>
              <div className="min-w-0 py-2 px-0 sm:px-4 xl:border-r">
                <Text size="xs" tone="muted">下次运行</Text>
                <strong className="mt-1 block text-sm">{selected.nextRunAt}</strong>
              </div>
              <div className="min-w-0 py-2 pr-4 sm:border-r sm:pl-0 xl:pl-4">
                <Text size="xs" tone="muted">运行 / 失败 / Token</Text>
                <strong className="mt-1 block text-sm">
                  {selected.metrics.runs} / {selected.metrics.failures} / {selected.metrics.tokens}
                </strong>
              </div>
              <div className="min-w-0 py-2 sm:pl-4">
                <Text size="xs" tone="muted">运行边界</Text>
                <strong className="mt-1 block text-sm">
                  {selected.scopeMode === "strict" ? "严格限制所选资源" : "兼容模式"}
                </strong>
                <Text size="xs" tone="muted">
                  {selected.discoveryTools.length ? `允许发现：${selected.discoveryTools.join(", ")}` : "无额外 discovery tools"}
                </Text>
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
