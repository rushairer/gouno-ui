import { useMemo, useState, type ReactNode } from "react";
import { Bot, Edit2, Plus, Sparkles, Trash2 } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Drawer,
  Empty,
  FormField,
  IconButton,
  Input,
  InputNumber,
  Modal,
  Segmented,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  Textarea,
} from "../../../../src/core";
import { PageHeader } from "../../../../src/gouno";
import { BulkActionBar } from "../../../../src/patterns";
import { FixtureDock } from "../../../components/fixture-dock";
import { BlogAdminWorkflowLauncherFixture } from "./workflow-launcher-fixture";

type FixtureScenario = "data" | "loading" | "empty" | "error" | "partial-failure";
type DeleteTarget = { kind: "single"; id: number } | { kind: "batch" } | null;
type EditorState = { mode: "create" } | { mode: "edit"; id: number } | null;

type CategoryFixture = {
  id: number;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  postCount: number;
};

type CategoryDraft = Omit<CategoryFixture, "id" | "postCount">;

const initialCategories: readonly CategoryFixture[] = [
  { id: 31, name: "工程实践", slug: "engineering-practice", description: "设计系统、研发流程与工程化实践。", sortOrder: 10, postCount: 18 },
  { id: 32, name: "身份安全", slug: "identity-security", description: "OAuth、OIDC、SSO 与应用安全。", sortOrder: 20, postCount: 12 },
  { id: 33, name: "前端", slug: "frontend", description: "React、Tailwind CSS 与交互设计。", sortOrder: 30, postCount: 24 },
  { id: 34, name: "后端架构", slug: "backend-architecture", description: "Go、Kafka 与分布式系统。", sortOrder: 40, postCount: 31 },
];

const emptyDraft: CategoryDraft = { name: "", slug: "", description: "", sortOrder: 0 };

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "错误" },
  { value: "partial-failure", label: "批量部分失败" },
] as const;

const taxonomyWorkflows = [
  { id: 77, name: "分类与标签整理", description: "联合分析手选分类与标签的结构质量。" },
] as const;

const knownSlugCandidates: Record<string, string[]> = {
  工程实践: ["engineering-practice", "engineering-notes", "product-engineering"],
  身份安全: ["identity-security", "oauth-security", "identity-platform"],
  前端: ["frontend", "frontend-engineering", "web-ui"],
  后端架构: ["backend-architecture", "distributed-backend", "backend-systems"],
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function LoadingCategories() {
  return (
    <Card padding="base" aria-label="分类加载中">
      <div className="flex flex-col gap-4" role="status" aria-live="polite">
        <Text size="sm" tone="muted">正在加载分类…</Text>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="grid gap-3 border-t pt-4 first:border-t-0 first:pt-0 md:grid-cols-[4rem_minmax(0,1fr)_10rem_6rem]">
            <Skeleton className="h-4 w-10" />
            <div className="space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-2/3" /></div>
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function CategoryActions({
  category,
  onEdit,
  onDelete,
}: {
  category: CategoryFixture;
  onEdit: (category: CategoryFixture) => void;
  onDelete: (category: CategoryFixture) => void;
}) {
  return (
    <div className="flex min-w-max flex-nowrap items-center justify-end gap-1">
      <IconButton label={`编辑分类 ${category.name}`} icon={<Edit2 />} variant="ghost" onClick={() => onEdit(category)} />
      <IconButton label={`删除分类 ${category.name}`} icon={<Trash2 />} variant="ghost" color="error" onClick={() => onDelete(category)} />
    </div>
  );
}

export function BlogAdminCategoriesDemo() {
  const [categories, setCategories] = useState<CategoryFixture[]>(() => [...initialCategories]);
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [selected, setSelected] = useState<number[]>([]);
  const [editor, setEditor] = useState<EditorState>(null);
  const [draft, setDraft] = useState<CategoryDraft>(emptyDraft);
  const [slugCandidates, setSlugCandidates] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [aiOpen, setAIOpen] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);

  const visibleCategories = scenario === "empty" ? [] : categories;
  const allSelected = visibleCategories.length > 0 && visibleCategories.every((category) => selected.includes(category.id));
  const selectedCategories = useMemo(
    () => categories.filter((category) => selected.includes(category.id)),
    [categories, selected],
  );

  const clearSelection = () => setSelected([]);

  const openCreate = () => {
    setDraft(emptyDraft);
    setSlugCandidates([]);
    setEditor({ mode: "create" });
  };

  const openEdit = (category: CategoryFixture) => {
    setDraft({ name: category.name, slug: category.slug, description: category.description, sortOrder: category.sortOrder });
    setSlugCandidates([]);
    setEditor({ mode: "edit", id: category.id });
  };

  const requestSlug = () => {
    if (!draft.name.trim()) {
      setNotice({ type: "error", text: "请先填写分类名称，再生成 Slug 候选。" });
      return;
    }
    const known = knownSlugCandidates[draft.name.trim()];
    const fallback = slugify(draft.name);
    const candidates = known ?? [fallback || "category", `${fallback || "category"}-notes`, `${fallback || "category"}-topic`];
    setSlugCandidates([...new Set(candidates)]);
  };

  const applySlug = (slug: string) => {
    setDraft((current) => ({ ...current, slug }));
    setSlugCandidates([]);
  };

  const saveCategory = () => {
    const name = draft.name.trim();
    const slug = draft.slug.trim().toLowerCase();
    if (!name || !slug) {
      setNotice({ type: "error", text: "分类名称和 Slug 都不能为空。" });
      return;
    }

    if (editor?.mode === "edit") {
      setCategories((current) => current.map((category) => category.id === editor.id
        ? { ...category, ...draft, name, slug }
        : category));
      setNotice({ type: "success", text: `分类“${name}”已更新（Showcase 模拟）。` });
    } else {
      const id = Math.max(0, ...categories.map((category) => category.id)) + 1;
      setCategories((current) => [...current, { id, ...draft, name, slug, postCount: 0 }]);
      setNotice({ type: "success", text: `分类“${name}”已创建（Showcase 模拟）。` });
    }
    setEditor(null);
    setSlugCandidates([]);
  };

  const setSelection = (id: number, checked: boolean) => {
    setSelected((current) => checked ? [...new Set([...current, id])] : current.filter((item) => item !== id));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.kind === "batch") {
      const failed = scenario === "partial-failure" && selected.length > 1 ? [selected[selected.length - 1]] : [];
      const removed = selected.filter((id) => !failed.includes(id));
      setCategories((current) => current.filter((category) => !removed.includes(category.id)));
      setSelected(failed);
      setDeleteTarget(null);
      setNotice(failed.length > 0
        ? { type: "error", text: `已删除 ${removed.length} 个分类；${failed.length} 个未删除：模拟 API 拒绝删除，失败项继续保持选中。` }
        : { type: "success", text: `已删除 ${removed.length} 个分类，相关文章将进入未分类（Showcase 模拟）。` });
      return;
    }

    setCategories((current) => current.filter((category) => category.id !== deleteTarget.id));
    setSelected((current) => current.filter((id) => id !== deleteTarget.id));
    setDeleteTarget(null);
    setNotice({ type: "success", text: "分类已删除，相关文章将进入未分类（Showcase 模拟）。" });
  };

  const deleteDescription: ReactNode = deleteTarget?.kind === "batch"
    ? `确认删除选中的 ${selected.length} 个分类？相关文章会移至未分类。`
    : deleteTarget?.kind === "single"
      ? `删除分类“${categories.find((category) => category.id === deleteTarget.id)?.name ?? "该分类"}”？相关文章会移至未分类。`
      : null;

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route="/admin/categories"
        note="保留真实分类数据与操作语义，并用桌面 Table / 移动 Card 双呈现承载响应式布局；批量部分失败保留选择、Drawer 编辑、AI Slug 与 category WorkflowLauncher 均保持一致。Fixture 不请求真实 Blog/AI API。"
        controls={(
          <Segmented<FixtureScenario>
            aria-label="分类页 Fixture 状态"
            options={scenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              clearSelection();
              setNotice(null);
              setAIOpen(false);
            }}
            block
          />
        )}
      />

      <PageHeader
        title="分类"
        description="建立长期稳定的内容脉络与主题结构。"
        actions={<Button variant="solid" color="primary" icon={<Plus />} onClick={openCreate}>新建分类</Button>}
      />

      {notice ? <Alert type={notice.type} showIcon title={notice.text} closable={{ onClose: () => setNotice(null) }} /> : null}

      {selected.length > 0 ? (
        <BulkActionBar selectionLabel={`已选择 ${selected.length} 个分类`} onCancel={clearSelection}>
          <Button size="small" icon={<Bot />} onClick={() => setAIOpen(true)}>交给 AI</Button>
          <Button size="small" color="error" icon={<Trash2 />} onClick={() => setDeleteTarget({ kind: "batch" })}>删除</Button>
        </BulkActionBar>
      ) : null}

      {scenario === "error" ? (
        <Alert type="error" showIcon title="分类加载失败" description="无法读取分类列表。真实产品会保留当前页面并允许重新请求。" action={<Button size="small" onClick={() => setScenario("data")}>重新载入</Button>} />
      ) : scenario === "loading" ? (
        <LoadingCategories />
      ) : visibleCategories.length === 0 ? (
        <Card padding="lg">
          <Empty title="还没有分类" description="创建第一个分类来组织长期主题。" action={<Button variant="solid" color="primary" icon={<Plus />} onClick={openCreate}>创建分类</Button>} />
        </Card>
      ) : (
        <>
          <div className="hidden md:block">
            <Table density="compact" bordered>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">
                    <Checkbox
                      aria-label="选择全部分类"
                      checked={allSelected}
                      onChange={(event) => {
                        const ids = visibleCategories.map((category) => category.id);
                        setSelected((current) => event.target.checked ? [...new Set([...current, ...ids])] : current.filter((id) => !ids.includes(id)));
                      }}
                    />
                  </TableHead>
                  <TableHead className="w-20">排序</TableHead>
                  <TableHead>分类名称与描述</TableHead>
                  <TableHead className="w-48">Slug 标识</TableHead>
                  <TableHead className="w-24 text-right">文章数</TableHead>
                  <TableHead className="w-28 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleCategories.map((category) => (
                  <TableRow key={category.id} data-state={selected.includes(category.id) ? "selected" : undefined}>
                    <TableCell className="text-center">
                      <Checkbox aria-label={`选择分类 ${category.name}`} checked={selected.includes(category.id)} onChange={(event) => setSelection(category.id, event.target.checked)} />
                    </TableCell>
                    <TableCell><span className="font-mono text-xs text-muted-foreground">{category.sortOrder}</span></TableCell>
                    <TableCell className="min-w-72 whitespace-normal">
                      <div className="flex flex-col gap-1">
                        <strong className="text-sm font-semibold text-foreground">{category.name}</strong>
                        <span className="text-xs leading-relaxed text-muted-foreground">{category.description}</span>
                      </div>
                    </TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{category.slug}</code></TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">{category.postCount}</TableCell>
                    <TableCell>
                      <CategoryActions
                        category={category}
                        onEdit={openEdit}
                        onDelete={(item) => setDeleteTarget({ kind: "single", id: item.id })}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 md:hidden" role="list" aria-label="分类列表">
            {visibleCategories.map((category) => (
              <Card
                key={category.id}
                padding="base"
                role="listitem"
                className={selected.includes(category.id) ? "border-primary/40 bg-accent/20" : undefined}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <Checkbox aria-label={`选择分类 ${category.name}`} checked={selected.includes(category.id)} onChange={(event) => setSelection(category.id, event.target.checked)} />
                    <div className="min-w-0 flex-1">
                      <strong className="block text-sm font-semibold text-foreground">{category.name}</strong>
                      <Text size="xs" tone="muted" className="mt-1 leading-relaxed">{category.description}</Text>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 rounded-md bg-muted/35 p-3 text-xs">
                    <div>
                      <Text as="div" size="xs" tone="muted">排序</Text>
                      <span className="mt-1 block font-mono text-foreground">{category.sortOrder}</span>
                    </div>
                    <div>
                      <Text as="div" size="xs" tone="muted">文章数</Text>
                      <span className="mt-1 block font-mono text-foreground">{category.postCount}</span>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <Text as="div" size="xs" tone="muted">Slug 标识</Text>
                      <code className="mt-1 block break-all font-mono text-xs text-foreground">{category.slug}</code>
                    </div>
                  </div>
                  <div className="flex justify-end border-t pt-3">
                    <CategoryActions
                      category={category}
                      onEdit={openEdit}
                      onDelete={(item) => setDeleteTarget({ kind: "single", id: item.id })}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <Drawer
        open={editor !== null}
        title={editor?.mode === "edit" ? "编辑分类" : "新建分类"}
        description={editor?.mode === "edit" ? "更新名称、URL 标识、描述与排序。" : "创建一个可长期复用的内容主题。"}
        width={440}
        onClose={() => setEditor(null)}
        footer={(
          <>
            <Button onClick={() => setEditor(null)}>取消</Button>
            <Button variant="solid" color="primary" onClick={saveCategory}>{editor?.mode === "edit" ? "保存修改" : "创建分类"}</Button>
          </>
        )}
      >
        <div className="flex flex-col gap-5">
          <FormField label="分类名称" required>
            <Input aria-label="分类名称" required value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
          </FormField>
          <FormField label="Slug 标识" required hint="用于分类 URL，建议使用稳定的英文短语。">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input aria-label="Slug 标识" required value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} />
                <Button size="small" icon={<Sparkles />} onClick={requestSlug}>AI 生成</Button>
              </div>
              {slugCandidates.length > 0 ? (
                <div className="flex flex-wrap gap-2" aria-label="Slug 候选">
                  {slugCandidates.map((candidate) => <Button key={candidate} size="small" variant="text" onClick={() => applySlug(candidate)}>{candidate}</Button>)}
                </div>
              ) : null}
            </div>
          </FormField>
          <FormField label="分类描述">
            <Textarea aria-label="分类描述" rows={4} value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
          </FormField>
          <FormField label="排序">
            <InputNumber aria-label="分类排序" min={0} value={draft.sortOrder} onChange={(value) => setDraft((current) => ({ ...current, sortOrder: value ?? 0 }))} />
          </FormField>
        </div>
      </Drawer>

      <Modal
        open={deleteTarget !== null}
        title={deleteTarget?.kind === "batch" ? "批量删除分类" : "删除分类"}
        description={deleteDescription}
        onClose={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        okText="确认删除"
        okButtonProps={{ variant: "solid", color: "error" }}
      >
        <Text size="sm" tone="muted">删除分类不会删除文章，但相关文章需要重新归类。</Text>
      </Modal>

      <BlogAdminWorkflowLauncherFixture
        open={aiOpen}
        title="将所选分类交给 AI"
        description="只显示 input schema 声明 category resource 的已启用 Workflow，并把本次手选分类写入资源字段。"
        resourceLabel="分类"
        resources={selectedCategories.map((category) => ({ key: category.id, label: category.name, detail: `/${category.slug} · ${category.postCount} 篇文章` }))}
        workflows={taxonomyWorkflows}
        runIdBase={261}
        onClose={() => setAIOpen(false)}
        onNavigate={(route) => {
          setAIOpen(false);
          setNotice({ type: "info", text: `将进入 ${route}（Showcase 模拟）。` });
        }}
      />
    </div>
  );
}
