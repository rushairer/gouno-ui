import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  Form,
  FormActions,
  FormGrid,
  IconButton,
  Input,
  Select,
  Switch,
  Tag,
  Text,
  Textarea,
} from "../../../../../../src/core";
import type {
  WorkflowFixture,
  WorkflowInputFieldFixture,
  WorkflowStepFixture,
} from "./automation-records-fixtures";

const stepTypeLabels: Record<WorkflowStepFixture["type"], string> = {
  resource_query: "动态资源筛选",
  model: "Agent 模型步骤",
  for_each: "逐项处理",
  approval_gate: "人工审批",
  human_interaction: "人工交互",
  output: "输出",
};

function cloneInputFields(value?: WorkflowInputFieldFixture[]) {
  return value?.map((field) => ({ ...field })) ?? [
    {
      key: "topic",
      label: "主题",
      type: "string" as const,
      required: true,
      defaultValue: "AI",
      description: "本次运行关注的业务主题。",
    },
    {
      key: "days",
      label: "时间范围（天）",
      type: "integer" as const,
      required: true,
      defaultValue: 1,
    },
  ];
}

function cloneSteps(value?: WorkflowStepFixture[]) {
  return value?.map((step) => ({ ...step })) ?? [
    {
      id: "model",
      name: "执行受控 Agent",
      type: "model" as const,
      agent: "",
      detail: "包含受控上下文",
    },
    {
      id: "approval_gate",
      name: "人工审批",
      type: "approval_gate" as const,
      detail: "需要人工确认后继续",
    },
    {
      id: "result",
      name: "输出结果",
      type: "output" as const,
      detail: "/steps",
    },
  ];
}

function nextUniqueKey(prefix: string, existing: readonly string[]) {
  if (!existing.includes(prefix)) return prefix;
  let index = 2;
  while (existing.includes(`${prefix}_${index}`)) index += 1;
  return `${prefix}_${index}`;
}

function normalizeDefault(type: WorkflowInputFieldFixture["type"], raw: string) {
  if (type === "integer") return Number.parseInt(raw || "0", 10) || 0;
  if (type === "number") return Number(raw || "0") || 0;
  if (type === "boolean") return raw === "true";
  return raw;
}

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
  const [inputFields, setInputFields] = useState<WorkflowInputFieldFixture[]>(() => cloneInputFields(initial?.inputFields));
  const [steps, setSteps] = useState<WorkflowStepFixture[]>(() => cloneSteps(initial?.steps));
  const [newStepType, setNewStepType] = useState<WorkflowStepFixture["type"]>("model");

  const updateInputField = (index: number, patch: Partial<WorkflowInputFieldFixture>) => {
    setInputFields((current) => current.map((field, item) => item === index ? { ...field, ...patch } : field));
  };

  const updateStep = (index: number, patch: Partial<WorkflowStepFixture>) => {
    setSteps((current) => current.map((step, item) => item === index ? { ...step, ...patch } : step));
  };

  const moveStep = (index: number, delta: number) => {
    setSteps((current) => {
      const nextIndex = index + delta;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      const resourceIndex = next.findIndex((step) => step.type === "resource_query");
      const firstExecutionIndex = next.findIndex((step) => step.type === "model" || step.type === "for_each");
      if (resourceIndex >= 0 && firstExecutionIndex >= 0 && resourceIndex > firstExecutionIndex) {
        const [resourceStep] = next.splice(resourceIndex, 1);
        next.unshift(resourceStep);
      }
      return next;
    });
  };

  const addStep = () => {
    setSteps((current) => {
      const id = nextUniqueKey(newStepType === "resource_query" ? "select_resources" : newStepType, current.map((step) => step.id));
      const next: WorkflowStepFixture = {
        id,
        name: stepTypeLabels[newStepType],
        type: newStepType,
        ...(newStepType === "model" ? { agent: "", detail: "包含受控上下文" } : {}),
        ...(newStepType === "resource_query" ? { detail: "post · max 20" } : {}),
        ...(newStepType === "approval_gate" ? { detail: "需要人工确认后继续" } : {}),
        ...(newStepType === "human_interaction" ? { detail: "等待人工选择、输入或确认后继续" } : {}),
        ...(newStepType === "output" ? { detail: "/steps" } : {}),
      };
      return newStepType === "resource_query"
        ? [next, ...current.filter((step) => step.type !== "resource_query")]
        : [...current, next];
    });
  };

  return (
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
        const resourceQueryEmptyPolicy = String(
          values.resourceQueryEmptyPolicy || initial?.resourceQueryEmptyPolicy || "succeed",
        ) as WorkflowFixture["resourceQueryEmptyPolicy"];
        const topicField = inputFields.find((field) => field.key === "topic");
        const daysField = inputFields.find((field) => field.key === "days");
        const topic = String(topicField?.defaultValue ?? initial?.input.topic ?? "AI");
        const daysValue = Number(daysField?.defaultValue ?? initial?.input.days ?? 1);
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
          templateKey: String(values.templateKey || initial?.templateKey || "").trim() || undefined,
          scopeMode,
          discoveryTools,
          resourceQueryEmptyPolicy,
          resourceQueryLastCount: initial?.resourceQueryLastCount,
          resourceQueryLastRunAt: initial?.resourceQueryLastRunAt,
          inputFields: inputFields.map((field) => ({ ...field })),
          steps: steps.map((step) => ({ ...step })),
          input: { topic, days: Number.isFinite(daysValue) && daysValue > 0 ? daysValue : 1 },
          metrics: initial?.metrics ?? { runs: 0, failures: 0, tokens: 0 },
          latestRun: initial?.latestRun ? { ...initial.latestRun } : undefined,
          versions: [
            { version: currentVersion, createdAt: "刚刚", note: initial ? "编辑保存" : "创建 Workflow" },
            ...(initial?.versions ?? []),
          ],
        });
      }}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <Card padding="none" className="overflow-hidden">
            <CardHeader className="border-b p-6">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">基础信息</CardTitle>
                <Text size="xs" tone="muted">名称和职责面向运营人员；模板标识只用于稳定的产品绑定，不承担执行状态。</Text>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-5">
                <FormGrid columns={2}>
                  <Field label="Workflow 名称" required>
                    <Input name="name" defaultValue={initial?.name} placeholder="内容维护 Workflow" />
                  </Field>
                  <Field label="运行状态">
                    <Switch name="enabled" defaultChecked={initial?.enabled ?? false} label="启用 Workflow" />
                  </Field>
                </FormGrid>
                <Field label="说明">
                  <Textarea name="description" defaultValue={initial?.description} rows={4} />
                </Field>
                <Field label="模板标识" hint="可选；用于识别稳定模板，不影响当前 Fixture 运行。">
                  <Input name="templateKey" defaultValue={initial?.templateKey} placeholder="daily-content-maintenance" />
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <CardHeader className="border-b p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <CardTitle className="text-base">运行输入契约</CardTitle>
                  <Text size="xs" tone="muted">输入字段定义运行表单和默认值；资源选择等复杂 Schema 在真实产品绑定层继续由业务实现。</Text>
                </div>
                <Button
                  type="button"
                  size="small"
                  variant="outline"
                  icon={<Plus />}
                  onClick={() => setInputFields((current) => [
                    ...current,
                    {
                      key: nextUniqueKey("input", current.map((field) => field.key)),
                      label: "新输入字段",
                      type: "string",
                      required: false,
                      defaultValue: "",
                    },
                  ])}
                >
                  添加字段
                </Button>
              </div>
            </CardHeader>
            <CardContent className="divide-y p-0">
              {inputFields.map((field, index) => (
                <div key={`${field.key}-${index}`} className="flex flex-col gap-4 p-6">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Field label="字段名">
                      <Input value={field.key} onChange={(event) => updateInputField(index, { key: event.target.value.trim() || field.key })} />
                    </Field>
                    <Field label="显示名称">
                      <Input value={field.label} onChange={(event) => updateInputField(index, { label: event.target.value })} />
                    </Field>
                    <Field label="类型">
                      <Select
                        value={field.type}
                        onChange={(next) => {
                          const type = String(next) as WorkflowInputFieldFixture["type"];
                          updateInputField(index, { type, defaultValue: type === "boolean" ? false : type === "string" ? "" : 0 });
                        }}
                      >
                        <option value="string">字符串</option>
                        <option value="integer">整数</option>
                        <option value="number">数字</option>
                        <option value="boolean">布尔</option>
                      </Select>
                    </Field>
                    <Field label="默认值">
                      {field.type === "boolean" ? (
                        <Select
                          value={String(Boolean(field.defaultValue))}
                          onChange={(next) => updateInputField(index, { defaultValue: String(next) === "true" })}
                        >
                          <option value="false">false</option>
                          <option value="true">true</option>
                        </Select>
                      ) : (
                        <Input
                          type={field.type === "string" ? "text" : "number"}
                          value={field.defaultValue === undefined ? "" : String(field.defaultValue)}
                          onChange={(event) => updateInputField(index, { defaultValue: normalizeDefault(field.type, event.target.value) })}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={field.required}
                        onChange={(event) => updateInputField(index, { required: event.target.checked })}
                      />
                      必填字段
                    </label>
                    <Button
                      type="button"
                      size="small"
                      variant="ghost"
                      color="error"
                      icon={<Trash2 />}
                      disabled={inputFields.length <= 1}
                      onClick={() => setInputFields((current) => current.filter((_, item) => item !== index))}
                    >
                      删除字段
                    </Button>
                  </div>
                  <Field label="说明">
                    <Input value={field.description || ""} onChange={(event) => updateInputField(index, { description: event.target.value })} />
                  </Field>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <CardHeader className="border-b p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <CardTitle className="text-base">流程定义</CardTitle>
                  <Text size="xs" tone="muted">步骤按实际执行顺序排列；动态资源筛选始终位于模型或逐项处理之前。</Text>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    aria-label="新增步骤类型"
                    value={newStepType}
                    onChange={(next) => setNewStepType(String(next) as WorkflowStepFixture["type"])}
                  >
                    {Object.entries(stepTypeLabels).map(([type, label]) => (
                      <option key={type} value={type}>{label}</option>
                    ))}
                  </Select>
                  <Button type="button" size="small" variant="outline" icon={<Plus />} onClick={addStep}>
                    添加步骤
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="divide-y p-0">
              {steps.map((step, index) => (
                <div key={`${step.id}-${index}`} className="flex gap-4 p-6">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(11rem,0.4fr)]">
                      <Field label="步骤名称">
                        <Input value={step.name} onChange={(event) => updateStep(index, { name: event.target.value })} />
                      </Field>
                      <Field label="步骤类型">
                        <Select
                          value={step.type}
                          onChange={(next) => updateStep(index, { type: String(next) as WorkflowStepFixture["type"] })}
                        >
                          {Object.entries(stepTypeLabels).map(([type, label]) => (
                            <option key={type} value={type}>{label}</option>
                          ))}
                        </Select>
                      </Field>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {step.type === "model" || step.type === "for_each" ? (
                        <Field label="绑定 Agent">
                          <Input
                            value={step.agent || ""}
                            onChange={(event) => updateStep(index, { agent: event.target.value })}
                            placeholder="Content Maintainer"
                          />
                        </Field>
                      ) : null}
                      <Field label="执行说明">
                        <Input value={step.detail || ""} onChange={(event) => updateStep(index, { detail: event.target.value })} />
                      </Field>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-1">
                      <Tag>{step.id}</Tag>
                      <IconButton label="上移步骤" icon={<ArrowUp />} variant="ghost" size="small" disabled={index === 0} onClick={() => moveStep(index, -1)} />
                      <IconButton label="下移步骤" icon={<ArrowDown />} variant="ghost" size="small" disabled={index === steps.length - 1} onClick={() => moveStep(index, 1)} />
                      <IconButton
                        label="删除步骤"
                        icon={<Trash2 />}
                        variant="ghost"
                        color="error"
                        size="small"
                        disabled={steps.length <= 1}
                        onClick={() => setSteps((current) => current.filter((_, item) => item !== index))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <Card padding="none" className="overflow-hidden">
            <CardHeader className="border-b p-6">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">执行计划</CardTitle>
                <Text size="xs" tone="muted">计划只决定何时进入 preflight；是否真正执行仍受启用状态和运行边界约束。</Text>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <FormGrid columns={2}>
                <Field label="执行计划" hint="支持 Cron 表达式；手动 Workflow 可填写“手动”。">
                  <Input name="schedule" defaultValue={initial?.schedule || "手动"} placeholder="30 8 * * *" />
                </Field>
                <Field label="时区">
                  <Input name="timezone" defaultValue={initial?.timezone || "Asia/Shanghai"} />
                </Field>
              </FormGrid>
              {initial ? (
                <div className="mt-5 border-t pt-5">
                  <Text size="xs" tone="muted">当前版本</Text>
                  <strong className="mt-1 block text-sm">v{initial.currentVersion}</strong>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <CardHeader className="border-b p-6">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">运行边界</CardTitle>
                <Text size="xs" tone="muted">明确资源选择、发现 Tool 和空结果策略，避免把“能发现”误解为“能修改”。</Text>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-5">
                <Field label="运行范围">
                  <Select name="scopeMode" defaultValue={initial?.scopeMode || "strict"}>
                    <option value="strict">严格限制所选资源</option>
                    <option value="unscoped">兼容模式</option>
                  </Select>
                </Field>
                <Field label="允许发现的 Tool" hint="只应选择绑定 Skill 已授权的只读发现能力。">
                  <Input name="discoveryTools" defaultValue={initial?.discoveryTools.join(", ")} placeholder="search_posts, read_post" />
                </Field>
                <Field label="空结果策略" hint="资源筛选为空时不调用 Agent。">
                  <Select name="resourceQueryEmptyPolicy" defaultValue={initial?.resourceQueryEmptyPolicy || "succeed"}>
                    <option value="succeed">成功并记录“无匹配资源”</option>
                    <option value="fail">失败并提醒管理员</option>
                  </Select>
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <CardHeader className="border-b p-6">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">默认运行输入</CardTitle>
                <Text size="xs" tone="muted">定时运行读取输入契约里的默认值；人工执行可在自动化工作区临时覆盖。</Text>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-3">
                {inputFields.map((field) => (
                  <div key={field.key} className="flex items-start justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="min-w-0">
                      <strong className="text-sm">{field.label}</strong>
                      <Text size="xs" tone="muted">{field.key} · {field.type}{field.required ? " · 必填" : ""}</Text>
                    </div>
                    <Text size="sm" className="max-w-[10rem] truncate text-right">{String(field.defaultValue ?? "—")}</Text>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <FormActions>
        <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
        <Button type="submit" variant="solid" color="primary" disabled={steps.length === 0 || inputFields.length === 0}>
          保存 Workflow
        </Button>
      </FormActions>
    </Form>
  );
}
