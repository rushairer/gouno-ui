import {
  Button,
  Card,
  Field,
  Form,
  FormActions,
  FormGrid,
  Input,
  Select,
  Switch,
  Textarea,
} from "../../../../../../src/core";
import type { WorkflowFixture } from "./automation-records-fixtures";

export function WorkflowEditor({
  value,
  nextId,
  onSave,
  onCancel,
}: {
  value: WorkflowFixture | "new";
  nextId: number;
  onSave: (workflow: WorkflowFixture) => void;
  onCancel: () => void;
}) {
  const initial = value === "new" ? undefined : value;
  return (
    <Card padding="base">
      <Form
        onFinish={(_, values) => {
          const name = String(values.name || initial?.name || "New Workflow").trim();
          const description = String(values.description || initial?.description || "自定义自动化流程。").trim();
          const schedule = String(values.schedule || initial?.schedule || "手动").trim();
          const timezone = String(values.timezone || initial?.timezone || "Asia/Shanghai").trim();
          const scopeMode = String(values.scopeMode || initial?.scopeMode || "strict") as WorkflowFixture["scopeMode"];
          const discoveryTools = String(values.discoveryTools || initial?.discoveryTools.join(", ") || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          const topic = String(values.topic || initial?.input.topic || "AI").trim();
          const daysValue = Number(values.days || initial?.input.days || 1);
          const currentVersion = initial ? initial.currentVersion + 1 : 1;
          onSave({
            id: initial?.id ?? nextId,
            name,
            description,
            enabled: values.enabled === "on",
            currentVersion,
            schedule,
            timezone,
            nextRunAt: values.enabled === "on" && schedule !== "手动" ? "待重新计算" : "—",
            scopeMode,
            discoveryTools,
            input: { topic, days: Number.isFinite(daysValue) && daysValue > 0 ? daysValue : 1 },
            metrics: initial?.metrics ?? { runs: 0, failures: 0, tokens: 0 },
            versions: [
              { version: currentVersion, createdAt: "刚刚", note: initial ? "编辑保存" : "创建 Workflow" },
              ...(initial?.versions ?? []),
            ],
          });
        }}
      >
        <FormGrid columns={2}>
          <Field label="Workflow 名称" required>
            <Input name="name" defaultValue={initial?.name} placeholder="内容维护 Workflow" />
          </Field>
          <Field label="运行状态">
            <Switch name="enabled" defaultChecked={initial?.enabled ?? false} label="启用 Workflow" />
          </Field>
          <Field label="执行计划">
            <Input name="schedule" defaultValue={initial?.schedule || "手动"} placeholder="30 8 * * *" />
          </Field>
          <Field label="时区">
            <Input name="timezone" defaultValue={initial?.timezone || "Asia/Shanghai"} />
          </Field>
          <Field label="运行范围">
            <Select name="scopeMode" defaultValue={initial?.scopeMode || "strict"}>
              <option value="strict">严格限制所选资源</option>
              <option value="unscoped">兼容模式</option>
            </Select>
          </Field>
          <Field label="允许发现的 Tool" hint="逗号分隔；这里只保存静态 Fixture。">
            <Input name="discoveryTools" defaultValue={initial?.discoveryTools.join(", ")} placeholder="search_posts, read_post" />
          </Field>
          <Field label="默认主题">
            <Input name="topic" defaultValue={initial?.input.topic || "AI"} />
          </Field>
          <Field label="默认时间范围（天）">
            <Input name="days" type="number" min={1} defaultValue={String(initial?.input.days || 1)} />
          </Field>
        </FormGrid>
        <Field label="说明">
          <Textarea name="description" defaultValue={initial?.description} rows={3} />
        </Field>
        <FormActions>
          <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
          <Button type="submit" variant="solid" color="primary">保存 Workflow</Button>
        </FormActions>
      </Form>
    </Card>
  );
}