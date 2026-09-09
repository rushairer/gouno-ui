import { useEffect, useMemo, useState } from "react";
import { Alert, Button, FormField, Modal, Select, Text } from "../../../src/core";

export type BlogAdminWorkflowResourceFixture = {
  key: string | number;
  label: string;
  detail?: string;
};

export type BlogAdminWorkflowOptionFixture = {
  id: number;
  name: string;
  description: string;
};

type BlogAdminWorkflowLauncherFixtureProps = {
  open: boolean;
  title: string;
  description: string;
  resourceLabel: string;
  resources: readonly BlogAdminWorkflowResourceFixture[];
  workflows: readonly BlogAdminWorkflowOptionFixture[];
  runIdBase?: number;
  onClose: () => void;
  onNavigate?: (route: string) => void;
};

/**
 * Showcase-only mirror of the real Blog WorkflowLauncher interaction contract.
 * Resource schemas and run semantics remain product-local and must not become a
 * public Gouno UI Pattern API without independent product evidence.
 */
export function BlogAdminWorkflowLauncherFixture({
  open,
  title,
  description,
  resourceLabel,
  resources,
  workflows,
  runIdBase = 260,
  onClose,
  onNavigate,
}: BlogAdminWorkflowLauncherFixtureProps) {
  const workflowSignature = workflows.map((workflow) => `${workflow.id}:${workflow.name}`).join("|");
  const [workflowID, setWorkflowID] = useState(() => String(workflows[0]?.id ?? ""));
  const [removedKeys, setRemovedKeys] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ runID: number; text: string } | null>(null);
  const [nextRunID, setNextRunID] = useState(runIdBase);

  useEffect(() => {
    if (!open) return;
    setWorkflowID(String(workflows[0]?.id ?? ""));
    setRemovedKeys([]);
    setFeedback(null);
  }, [open, workflowSignature]);

  const activeResources = useMemo(
    () => resources.filter((resource) => !removedKeys.includes(String(resource.key))),
    [removedKeys, resources],
  );
  const activeWorkflow = workflows.find((workflow) => String(workflow.id) === workflowID) ?? null;

  const run = () => {
    if (!activeWorkflow || activeResources.length === 0) return;
    const runID = nextRunID;
    setNextRunID((current) => current + 1);
    setFeedback({
      runID,
      text: `Workflow 已提交（Run #${runID}）。范围已锁定到本次选择的 ${activeResources.length} 项资源。`,
    });
  };

  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      onOk={run}
      okText="运行"
      cancelText="关闭"
      okButtonProps={{
        variant: "solid",
        color: "primary",
        disabled: !activeWorkflow || activeResources.length === 0,
      }}
    >
      <div className="flex flex-col gap-4">
        {workflows.length > 0 ? (
          <FormField label="Workflow">
            <Select
              aria-label="Workflow"
              value={workflowID}
              onChange={(value) => {
                setWorkflowID(String(value));
                setFeedback(null);
              }}
            >
              {workflows.map((workflow) => (
                <option key={workflow.id} value={workflow.id}>{workflow.name}</option>
              ))}
            </Select>
          </FormField>
        ) : (
          <Alert
            type="warning"
            showIcon
            title="没有兼容 Workflow"
            description="真实产品只显示 input schema 声明了当前资源类型的已启用 Workflow。"
          />
        )}

        {activeWorkflow ? <Text size="xs" tone="muted">{activeWorkflow.description}</Text> : null}

        <div className="flex flex-col gap-2">
          <Text size="sm" className="font-medium">{resourceLabel}</Text>
          {activeResources.length > 0 ? (
            <div className="flex flex-col gap-2 rounded-lg border p-3">
              {activeResources.map((resource) => (
                <div key={String(resource.key)} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Text size="sm" className="truncate">{resource.label}</Text>
                    {resource.detail ? <Text size="xs" tone="muted">{resource.detail}</Text> : null}
                  </div>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => {
                      setRemovedKeys((current) => [...current, String(resource.key)]);
                      setFeedback(null);
                    }}
                  >
                    移除
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Alert type="warning" showIcon title={`至少保留 1 个${resourceLabel}资源才能运行。`} />
          )}
        </div>

        {feedback && activeWorkflow ? (
          <Alert
            type="success"
            showIcon
            title={feedback.text}
            action={(
              <Button
                size="small"
                variant="text"
                onClick={() => onNavigate?.(`/admin/ai-ops?tab=records&record=workflow&workflow=${activeWorkflow.id}&run=${feedback.runID}`)}
              >
                打开运行中心
              </Button>
            )}
          />
        ) : null}
      </div>
    </Modal>
  );
}
