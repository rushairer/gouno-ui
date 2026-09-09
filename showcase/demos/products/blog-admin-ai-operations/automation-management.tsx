import { useEffect, useState } from "react";
import { Edit2, Plus, Power, Trash2 } from "lucide-react";
import { Button, Card, Modal, Select, Tag, Text } from "../../../../src/core";
import { TabPanelLead } from "../../../components/tab-panel-lead";
import type { WorkflowFixture } from "./automation-records-fixtures";
import { WorkflowEditor } from "./workflow-editor";

export function AutomationManagement({
  workflows,
  onSave,
  onDelete,
  onToggle,
}: {
  workflows: WorkflowFixture[];
  onSave: (workflow: WorkflowFixture) => void;
  onDelete: (workflow: WorkflowFixture) => void;
  onToggle: (workflow: WorkflowFixture) => void;
}) {
  const [selectedId, setSelectedId] = useState(workflows[0]?.id ?? 0);
  const [editing, setEditing] = useState<WorkflowFixture | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkflowFixture | null>(null);

  useEffect(() => {
    if (!workflows.some((item) => item.id === selectedId)) setSelectedId(workflows[0]?.id ?? 0);
  }, [selectedId, workflows]);

  const selected = workflows.find((item) => item.id === selectedId) ?? workflows[0] ?? null;
  const nextId = workflows.reduce((highest, item) => Math.max(highest, item.id), 0) + 1;

  if (editing) {
    return (
      <div className="flex flex-col gap-5">
        <TabPanelLead description="创建或编辑 Workflow 时保留运行范围、计划与默认输入；运行证据仍由下方自动化工作区承载。" />
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
        description="持续运营 Workflow 可以创建、编辑、启停和删除；每次保存形成新的静态版本证据。"
        actions={<Button size="small" variant="solid" color="primary" icon={<Plus />} onClick={() => setEditing("new")}>创建 Workflow</Button>}
      />
      {selected ? (
        <Card padding="base">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <Text size="xs" tone="muted">管理 Workflow</Text>
              <div className="mt-2 max-w-xl">
                <Select aria-label="选择要管理的 Workflow" value={String(selected.id)} onChange={(value) => setSelectedId(Number(value))}>
                  {workflows.map((workflow) => <option key={workflow.id} value={String(workflow.id)}>{workflow.name} · v{workflow.currentVersion}</option>)}
                </Select>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Tag color={selected.enabled ? "success" : "default"}>{selected.enabled ? "已启用" : "已停用"}</Tag>
                <Text size="xs" tone="muted">{selected.schedule} · {selected.timezone}</Text>
              </div>
            </div>
            <div className="flex min-w-max flex-wrap items-center gap-2">
              <Button size="small" variant="outline" icon={<Edit2 />} onClick={() => setEditing(selected)}>编辑</Button>
              <Button size="small" variant="outline" icon={<Power />} onClick={() => onToggle(selected)}>{selected.enabled ? "停用" : "启用"}</Button>
              <Button size="small" variant="ghost" color="error" icon={<Trash2 />} onClick={() => setDeleteTarget(selected)}>删除</Button>
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