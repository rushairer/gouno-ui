import { useMemo, useState, type ReactNode } from "react";
import { Bot, Merge, Save, Trash2 } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Empty,
  FormField,
  Input,
  Modal,
  Segmented,
  Skeleton,
  Tag,
  Text,
} from "../../../../src/core";
import { PageHeader } from "../../../../src/gouno";
import { BulkActionBar } from "../../../../src/patterns";
import { FixtureDock } from "../../../components/fixture-dock";
import { BlogAdminWorkflowLauncherFixture } from "./workflow-launcher-fixture";

type FixtureScenario = "data" | "loading" | "empty" | "error" | "partial-failure";
type TagEdit = { name: string; mode: "rename" | "merge" } | null;
type DeleteTarget = { kind: "single"; name: string } | { kind: "batch" } | null;

type TagFixture = {
  name: string;
  postCount: number;
};

const initialTags: readonly TagFixture[] = [
  { name: "React", postCount: 34 },
  { name: "OAuth", postCount: 21 },
  { name: "Go", postCount: 18 },
  { name: "Kafka", postCount: 13 },
  { name: "Swift", postCount: 11 },
  { name: "Design System", postCount: 9 },
];

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "错误" },
  { value: "partial-failure", label: "批量部分失败" },
] as const;

const taxonomyWorkflows = [
  {
    id: 77,
    name: "分类与标签整理",
    description: "联合分析手选分类与标签的结构质量。",
  },
] as const;

function LoadingTags() {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      role="status"
      aria-label="标签加载中"
      aria-live="polite"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index} padding="sm" className="gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
          <div className="flex justify-end gap-2 border-t pt-3">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-12" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function BlogAdminTagsDemo() {
  const [tags, setTags] = useState<TagFixture[]>(() => [...initialTags]);
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [selected, setSelected] = useState<string[]>([]);
  const [tagEdit, setTagEdit] = useState<TagEdit>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [aiOpen, setAIOpen] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);

  const visibleTags = scenario === "empty" ? [] : tags;
  const selectedTags = useMemo(
    () => tags.filter((tag) => selected.includes(tag.name)),
    [tags, selected],
  );

  const clearSelection = () => setSelected([]);

  const setSelection = (name: string, checked: boolean) => {
    setSelected((current) => checked
      ? [...new Set([...current, name])]
      : current.filter((item) => item !== name));
  };

  const openEdit = (tag: TagFixture, mode: "rename" | "merge") => {
    setTagEdit({ name: tag.name, mode });
    setEditValue("");
    setNotice(null);
  };

  const saveTag = () => {
    if (!tagEdit) return;
    const value = editValue.trim();
    if (!value || value === tagEdit.name) {
      setNotice({ type: "error", text: "请输入不同于当前标签的有效名称。" });
      return;
    }

    if (tagEdit.mode === "rename") {
      if (tags.some((tag) => tag.name === value)) {
        setNotice({ type: "error", text: `标签“${value}”已经存在。` });
        return;
      }
      setTags((current) => current.map((tag) => tag.name === tagEdit.name ? { ...tag, name: value } : tag));
      setSelected((current) => current.map((name) => name === tagEdit.name ? value : name));
      setNotice({ type: "success", text: `标签“${tagEdit.name}”已重命名为“${value}”（Showcase 模拟）。` });
    } else {
      const source = tags.find((tag) => tag.name === tagEdit.name);
      const target = tags.find((tag) => tag.name === value);
      if (!source || !target) {
        setNotice({ type: "error", text: "目标标签必须是现有标签。" });
        return;
      }
      setTags((current) => current
        .filter((tag) => tag.name !== source.name)
        .map((tag) => tag.name === target.name ? { ...tag, postCount: tag.postCount + source.postCount } : tag));
      setSelected((current) => current.filter((name) => name !== source.name));
      setNotice({ type: "success", text: `标签“${source.name}”已合并至“${target.name}”（Showcase 模拟）。` });
    }

    setTagEdit(null);
    setEditValue("");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.kind === "batch") {
      const failed = scenario === "partial-failure" && selected.length > 1
        ? [selected[selected.length - 1]]
        : [];
      const removed = selected.filter((name) => !failed.includes(name));
      setTags((current) => current.filter((tag) => !removed.includes(tag.name)));
      setSelected(failed);
      setDeleteTarget(null);
      setNotice(failed.length > 0
        ? {
            type: "error",
            text: `已删除 ${removed.length} 个标签；${failed.length} 个未删除：模拟 API 拒绝删除，失败项继续保持选中。`,
          }
        : { type: "success", text: `已删除 ${removed.length} 个标签（Showcase 模拟）。` });
      return;
    }

    setTags((current) => current.filter((tag) => tag.name !== deleteTarget.name));
    setSelected((current) => current.filter((name) => name !== deleteTarget.name));
    setNotice({ type: "success", text: `标签“${deleteTarget.name}”已从文章中移除（Showcase 模拟）。` });
    setDeleteTarget(null);
  };

  const deleteDescription: ReactNode = deleteTarget?.kind === "batch"
    ? `确认删除选中的 ${selected.length} 个标签？这些标签会从文章中移除。`
    : deleteTarget?.kind === "single"
      ? `从所有文章中移除标签“${deleteTarget.name}”？`
      : null;

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route="/admin/tags"
        note="保留真实标签卡片网格、重命名/合并、批量清洗、部分失败保留选择，以及 tag resource 的真实 WorkflowLauncher 资源输入与 Run 反馈；Fixture 不请求真实 Blog/AI API。"
        controls={(
          <Segmented<FixtureScenario>
            aria-label="标签页 Fixture 状态"
            options={scenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              clearSelection();
              setNotice(null);
              setTagEdit(null);
              setDeleteTarget(null);
              setAIOpen(false);
            }}
            block
          />
        )}
      />

      <PageHeader
        title="标签"
        description="整理文章中的具体技术与概念信号，支持批量清洗与合并。"
      />

      {notice ? (
        <Alert
          type={notice.type}
          showIcon
          title={notice.text}
          closable={{ onClose: () => setNotice(null) }}
        />
      ) : null}

      {selected.length > 0 ? (
        <BulkActionBar selectionLabel={`已选择 ${selected.length} 个标签`} onCancel={clearSelection}>
          <Button size="small" icon={<Bot />} onClick={() => setAIOpen(true)}>交给 AI</Button>
          <Button size="small" color="error" icon={<Trash2 />} onClick={() => setDeleteTarget({ kind: "batch" })}>
            删除
          </Button>
        </BulkActionBar>
      ) : null}

      {scenario === "error" ? (
        <Alert
          type="error"
          showIcon
          title="标签加载失败"
          description="无法读取标签汇总。真实产品会保留页面并允许重新请求。"
          action={<Button size="small" onClick={() => setScenario("data")}>重新载入</Button>}
        />
      ) : scenario === "loading" ? (
        <LoadingTags />
      ) : visibleTags.length === 0 ? (
        <Card padding="lg">
          <Empty title="文章添加标签后会自动在这里汇总。" description="标签来自文章内容，无需在这里提前创建。" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleTags.map((tag) => (
            <Card
              key={tag.name}
              padding="sm"
              className="gap-0 transition-colors hover:border-primary/40"
              data-state={selected.includes(tag.name) ? "selected" : undefined}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Checkbox
                    aria-label={`选择标签 ${tag.name}`}
                    checked={selected.includes(tag.name)}
                    onChange={(event) => setSelection(tag.name, event.target.checked)}
                  />
                  <strong className="truncate text-sm font-semibold text-foreground">{tag.name}</strong>
                </div>
                <Tag color="default" className="shrink-0 font-mono">{tag.postCount} 篇</Tag>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-end gap-1 border-t pt-3" aria-label={`标签 ${tag.name} 操作`}>
                <Button
                  size="small"
                  variant="text"
                  icon={<Save />}
                  aria-label={`重命名标签 ${tag.name}`}
                  onClick={() => openEdit(tag, "rename")}
                >
                  重命名
                </Button>
                <Button
                  size="small"
                  variant="text"
                  icon={<Merge />}
                  aria-label={`合并标签 ${tag.name}`}
                  onClick={() => openEdit(tag, "merge")}
                >
                  合并
                </Button>
                <Button
                  size="small"
                  variant="text"
                  color="error"
                  icon={<Trash2 />}
                  aria-label={`删除标签 ${tag.name}`}
                  onClick={() => setDeleteTarget({ kind: "single", name: tag.name })}
                >
                  删除
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={tagEdit !== null}
        title={tagEdit?.mode === "merge" ? "合并标签" : "重命名标签"}
        description={tagEdit?.mode === "merge"
          ? `将“${tagEdit?.name ?? ""}”合并至现有目标标签。`
          : `为“${tagEdit?.name ?? ""}”输入新名称。`}
        onClose={() => setTagEdit(null)}
        onOk={saveTag}
        okText={tagEdit?.mode === "merge" ? "合并标签" : "保存名称"}
        okButtonProps={{ variant: "solid", color: "primary" }}
      >
        <FormField
          label={tagEdit?.mode === "merge" ? "目标标签" : "新标签名称"}
          required
          hint={tagEdit?.mode === "merge" ? "输入一个已经存在的标签名称。" : undefined}
        >
          <Input
            aria-label={tagEdit?.mode === "merge" ? "目标标签" : "新标签名称"}
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            autoFocus
          />
        </FormField>
      </Modal>

      <Modal
        open={deleteTarget !== null}
        title={deleteTarget?.kind === "batch" ? "批量删除标签" : "删除标签"}
        description={deleteDescription}
        onClose={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        okText="确认删除"
        okButtonProps={{ variant: "solid", color: "error" }}
      >
        <Text size="sm" tone="muted">删除只移除标签关联，不删除文章。</Text>
      </Modal>

      <BlogAdminWorkflowLauncherFixture
        open={aiOpen}
        title="将所选标签交给 AI"
        description="只显示 input schema 声明 tag resource 的已启用 Workflow，并把本次手选标签写入资源字段。"
        resourceLabel="标签"
        resources={selectedTags.map((tag) => ({
          key: tag.name,
          label: tag.name,
          detail: `${tag.postCount} 篇文章`,
        }))}
        workflows={taxonomyWorkflows}
        runIdBase={260}
        onClose={() => setAIOpen(false)}
        onNavigate={(route) => {
          setAIOpen(false);
          setNotice({ type: "info", text: `将进入 ${route}（Showcase 模拟）。` });
        }}
      />
    </div>
  );
}
