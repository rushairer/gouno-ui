import { useMemo, useState, type ReactNode } from "react";
import { Bot, Combine, Edit2, Tag as TagIcon, Trash2 } from "lucide-react";
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
  Select,
  Skeleton,
  Tag,
  Text,
} from "../../../src/core";
import { PageHeader } from "../../../src/gouno";
import { BulkActionBar } from "../../../src/patterns";
import { FixtureDock } from "../../components/fixture-dock";

type FixtureScenario = "data" | "loading" | "empty" | "error";
type EditorState = { kind: "rename"; id: number } | { kind: "merge"; id: number } | null;
type DeleteTarget = { kind: "single"; id: number } | { kind: "batch" } | null;

type TagFixture = {
  id: number;
  name: string;
  slug: string;
  postCount: number;
};

const initialTags: readonly TagFixture[] = [
  { id: 201, name: "React", slug: "react", postCount: 18 },
  { id: 202, name: "Design System", slug: "design-system", postCount: 14 },
  { id: 203, name: "OAuth", slug: "oauth", postCount: 11 },
  { id: 204, name: "Go", slug: "go", postCount: 26 },
  { id: 205, name: "Kafka", slug: "kafka", postCount: 9 },
  { id: 206, name: "Security", slug: "security", postCount: 16 },
];

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "错误" },
] as const;

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function LoadingTags() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="标签加载中" aria-live="polite">
      {Array.from({ length: 6 }, (_, index) => (
        <Card key={index} padding="base">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-4 w-36" />
            <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-8 w-24" /></div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function BlogAdminTagsDemo() {
  const [tags, setTags] = useState<TagFixture[]>(() => [...initialTags]);
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [selected, setSelected] = useState<number[]>([]);
  const [editor, setEditor] = useState<EditorState>(null);
  const [draftName, setDraftName] = useState("");
  const [mergeTarget, setMergeTarget] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [aiOpen, setAIOpen] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const visibleTags = scenario === "empty" ? [] : tags;
  const selectedTags = useMemo(() => tags.filter((tag) => selected.includes(tag.id)), [selected, tags]);
  const clearSelection = () => setSelected([]);

  const openRename = (tag: TagFixture) => {
    setDraftName(tag.name);
    setEditor({ kind: "rename", id: tag.id });
  };

  const openMerge = (tag: TagFixture) => {
    setMergeTarget("");
    setEditor({ kind: "merge", id: tag.id });
  };

  const setSelection = (id: number, checked: boolean) => {
    setSelected((current) => checked
      ? [...new Set([...current, id])]
      : current.filter((item) => item !== id));
  };

  const saveEditor = () => {
    if (!editor) return;
    const source = tags.find((tag) => tag.id === editor.id);
    if (!source) return;

    if (editor.kind === "rename") {
      const nextName = draftName.trim();
      if (!nextName) {
        setNotice({ type: "error", text: "标签名称不能为空。" });
        return;
      }
      setTags((current) => current.map((tag) => tag.id === source.id
        ? { ...tag, name: nextName, slug: slugify(nextName) || tag.slug }
        : tag));
      setNotice({ type: "success", text: `标签“${source.name}”已重命名为“${nextName}”（Showcase 模拟）。` });
    } else {
      const target = tags.find((tag) => tag.id === Number(mergeTarget));
      if (!target || target.id === source.id) {
        setNotice({ type: "error", text: "请选择另一个有效标签作为合并目标。" });
        return;
      }
      setTags((current) => current
        .filter((tag) => tag.id !== source.id)
        .map((tag) => tag.id === target.id ? { ...tag, postCount: tag.postCount + source.postCount } : tag));
      setSelected((current) => current.filter((id) => id !== source.id));
      setNotice({ type: "success", text: `标签“${source.name}”已合并到“${target.name}”（Showcase 模拟）。` });
    }
    setEditor(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const ids = deleteTarget.kind === "batch" ? selected : [deleteTarget.id];
    const count = ids.length;
    setTags((current) => current.filter((tag) => !ids.includes(tag.id)));
    setSelected((current) => current.filter((id) => !ids.includes(id)));
    setDeleteTarget(null);
    setNotice({ type: "success", text: count > 1 ? `已删除 ${count} 个标签（Showcase 模拟）。` : "标签已删除（Showcase 模拟）。" });
  };

  const launchAI = () => {
    const count = selected.length;
    setAIOpen(false);
    setNotice({ type: "success", text: `已将 ${count} 个标签交给 AI 工作流（Showcase 模拟）。` });
  };

  const deleteDescription: ReactNode = deleteTarget?.kind === "batch"
    ? `确认删除选中的 ${selected.length} 个标签？文章本身不会被删除。`
    : deleteTarget?.kind === "single"
      ? `确认删除标签“${tags.find((tag) => tag.id === deleteTarget.id)?.name ?? "该标签"}”？文章本身不会被删除。`
      : null;

  const editorSource = editor ? tags.find((tag) => tag.id === editor.id) : null;

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route="/admin/tags"
        note="保留真实标签卡片、批量工作流、重命名/合并和 AI 入口；Fixture 不请求真实 Blog API。"
        controls={(
          <Segmented<FixtureScenario>
            aria-label="标签页 Fixture 状态"
            options={scenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              clearSelection();
              setNotice(null);
            }}
            block
          />
        )}
      />

      <PageHeader
        title="标签"
        description="清理重复标签、合并语义相近的主题词，并保持文章标签体系简洁。"
      />

      {notice ? (
        <Alert type={notice.type} showIcon title={notice.text} closable={{ onClose: () => setNotice(null) }} />
      ) : null}

      {selected.length > 0 ? (
        <BulkActionBar selectionLabel={`已选择 ${selected.length} 个标签`} onCancel={clearSelection}>
          <Button size="small" icon={<Bot />} onClick={() => setAIOpen(true)}>交给 AI</Button>
          <Button size="small" color="error" icon={<Trash2 />} onClick={() => setDeleteTarget({ kind: "batch" })}>删除</Button>
        </BulkActionBar>
      ) : null}

      {scenario === "error" ? (
        <Alert
          type="error"
          showIcon
          title="标签加载失败"
          description="无法读取标签集合。真实产品会保留当前页面并允许重新请求。"
          action={<Button size="small" onClick={() => setScenario("data")}>重新载入</Button>}
        />
      ) : scenario === "loading" ? (
        <LoadingTags />
      ) : visibleTags.length === 0 ? (
        <Card padding="lg">
          <Empty
            icon={<TagIcon className="size-7 text-muted-foreground" />}
            title="还没有标签"
            description="标签通常在编辑文章时创建，之后可以在这里统一维护。"
          />
        </Card>
      ) : (
        <div role="list" aria-label="标签列表" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleTags.map((tag) => (
            <Card key={tag.id} padding="base" role="listitem" className={selected.includes(tag.id) ? "border-primary/40 bg-accent/20" : undefined}>
              <div className="flex h-full flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    aria-label={`选择标签 ${tag.name}`}
                    checked={selected.includes(tag.id)}
                    onChange={(event) => setSelection(tag.id, event.target.checked)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag color="info">{tag.name}</Tag>
                      <Text size="sm" tone="muted">{tag.postCount} 篇文章</Text>
                    </div>
                    <code className="mt-2 block break-all font-mono text-xs text-muted-foreground">/{tag.slug}</code>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-end gap-1.5 border-t pt-3">
                  <Button size="small" variant="ghost" icon={<Edit2 />} onClick={() => openRename(tag)}>重命名</Button>
                  <Button size="small" variant="ghost" icon={<Combine />} onClick={() => openMerge(tag)}>合并</Button>
                  <Button size="small" variant="ghost" color="error" icon={<Trash2 />} onClick={() => setDeleteTarget({ kind: "single", id: tag.id })}>删除</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={editor !== null}
        title={editor?.kind === "rename" ? "重命名标签" : "合并标签"}
        description={editor?.kind === "rename" ? "更新标签名称与 URL 标识。" : `将“${editorSource?.name ?? "该标签"}”合并到另一个标签。`}
        onClose={() => setEditor(null)}
        onOk={saveEditor}
        okText={editor?.kind === "rename" ? "保存修改" : "确认合并"}
        okButtonProps={{ variant: "solid", color: "primary" }}
      >
        {editor?.kind === "rename" ? (
          <FormField label="标签名称" required>
            <Input aria-label="标签名称" required value={draftName} onChange={(event) => setDraftName(event.target.value)} />
          </FormField>
        ) : (
          <FormField label="合并目标" required hint="源标签会被删除，文章将改用目标标签。">
            <Select aria-label="合并目标" value={mergeTarget} onChange={(value) => setMergeTarget(String(value))}>
              <option value="">请选择目标标签</option>
              {tags.filter((tag) => tag.id !== editor?.id).map((tag) => (
                <option key={tag.id} value={String(tag.id)}>{tag.name} · {tag.postCount} 篇</option>
              ))}
            </Select>
          </FormField>
        )}
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
        <Text size="sm" tone="muted">删除标签不会删除文章，但会移除文章上的标签关联。</Text>
      </Modal>

      <Modal
        open={aiOpen}
        title="将所选标签交给 AI"
        description="真实产品会把所选标签作为 tag 资源传给 WorkflowLauncher。"
        onClose={() => setAIOpen(false)}
        onOk={launchAI}
        okText="启动工作流"
        okButtonProps={{ variant: "solid", color: "primary" }}
      >
        <div className="space-y-3">
          <Text size="sm" tone="muted">本次将处理 {selectedTags.length} 个标签：</Text>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => <Tag key={tag.id}>{tag.name}</Tag>)}
          </div>
        </div>
      </Modal>
    </div>
  );
}
