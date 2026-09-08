import { useMemo, useState, type ReactNode } from "react";
import {
  Bot,
  Copy,
  ImageIcon,
  ImagePlus,
  Link2,
  Pencil,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
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
  Modal,
  Segmented,
  Select,
  Skeleton,
  Tag,
  Text,
  Textarea,
  Upload,
} from "../../../src/core";
import { PageHeader } from "../../../src/gouno";
import { BulkActionBar } from "../../../src/patterns";
import { FixtureDock } from "../../components/fixture-dock";

type FixtureScenario = "data" | "loading" | "empty" | "error";
type DeleteTarget = { kind: "single"; id: number } | { kind: "batch" } | null;
type EditorState = { kind: "upload" } | { kind: "generate" } | { kind: "alt"; id: number } | null;

type MediaReferenceFixture = {
  postId: number;
  postTitle: string;
};

type MediaFixture = {
  id: number;
  filename: string;
  url: string;
  contentType: string;
  sizeKb: number;
  createdAt: string;
  altText: string;
  references: readonly MediaReferenceFixture[];
};

const initialMedia: readonly MediaFixture[] = [
  {
    id: 501,
    filename: "design-system-cover.webp",
    url: "/uploads/design-system-cover.webp",
    contentType: "image/webp",
    sizeKb: 486,
    createdAt: "2026-09-08 09:18",
    altText: "Gouno UI 设计系统组件层级封面",
    references: [],
  },
  {
    id: 502,
    filename: "oauth-bff-flow.png",
    url: "/uploads/oauth-bff-flow.png",
    contentType: "image/png",
    sizeKb: 312,
    createdAt: "2026-09-07 22:41",
    altText: "OAuth 2.0 Authorization Code + PKCE BFF 流程图",
    references: [
      { postId: 102, postTitle: "OAuth 2.0 Authorization Code + PKCE 的 BFF 实践" },
      { postId: 108, postTitle: "浏览器与 BFF 的 Session 边界" },
    ],
  },
  {
    id: 503,
    filename: "kafka-backpressure.svg",
    url: "/uploads/kafka-backpressure.svg",
    contentType: "image/svg+xml",
    sizeKb: 128,
    createdAt: "2026-09-06 16:08",
    altText: "Kafka 消费背压与并发边界示意图",
    references: [{ postId: 105, postTitle: "Kafka 高吞吐消费场景中的背压与并发边界" }],
  },
  {
    id: 504,
    filename: "teamverse-night.jpg",
    url: "/uploads/teamverse-night.jpg",
    contentType: "image/jpeg",
    sizeKb: 652,
    createdAt: "2026-09-05 11:27",
    altText: "TeamVerse 夜间办公室封面",
    references: [],
  },
  {
    id: 505,
    filename: "favicon.svg",
    url: "/uploads/favicon.svg",
    contentType: "image/svg+xml",
    sizeKb: 12,
    createdAt: "2026-09-04 18:53",
    altText: "Gouno Blog 站点图标",
    references: [],
  },
  {
    id: 506,
    filename: "distributed-task.png",
    url: "/uploads/distributed-task.png",
    contentType: "image/png",
    sizeKb: 438,
    createdAt: "2026-09-03 14:36",
    altText: "分布式任务调度数据交换流程",
    references: [],
  },
];

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "错误" },
] as const;

function typeLabel(contentType: string) {
  return contentType.replace("image/", "").replace("svg+xml", "svg").toUpperCase();
}

function MediaPreview({ asset }: { asset: MediaFixture }) {
  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden border-b bg-muted/40">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-transparent to-primary/10" aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-2 text-muted-foreground">
        <ImageIcon className="size-8" aria-hidden="true" />
        <span className="max-w-[80%] truncate font-mono text-[11px]">{asset.filename}</span>
      </div>
    </div>
  );
}

function LoadingMedia() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="媒体加载中" aria-live="polite">
      {Array.from({ length: 8 }, (_, index) => (
        <Card key={index} padding="none" className="gap-0 overflow-clip">
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function BlogAdminMediaDemo() {
  const [assets, setAssets] = useState<MediaFixture[]>(() => [...initialMedia]);
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [editor, setEditor] = useState<EditorState>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadAlt, setUploadAlt] = useState("");
  const [altDraft, setAltDraft] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAlt, setAiAlt] = useState("");
  const [aiOpen, setAIOpen] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string; references?: readonly MediaReferenceFixture[] } | null>(null);

  const contentTypes = useMemo(() => [...new Set(assets.map((asset) => asset.contentType))].sort(), [assets]);
  const visibleAssets = useMemo(() => {
    if (scenario === "empty") return [];
    const normalized = query.trim().toLowerCase();
    return assets.filter((asset) => {
      if (normalized && !`${asset.filename} ${asset.altText}`.toLowerCase().includes(normalized)) return false;
      if (type && asset.contentType !== type) return false;
      return true;
    });
  }, [assets, query, scenario, type]);
  const selectedAssets = useMemo(() => assets.filter((asset) => selected.includes(asset.id)), [assets, selected]);
  const hasFilters = Boolean(query || type);

  const setSelection = (id: number, checked: boolean) => {
    setSelected((current) => checked ? [...new Set([...current, id])] : current.filter((item) => item !== id));
  };

  const clearFilters = () => {
    setQuery("");
    setType("");
    setSelected([]);
  };

  const openUpload = () => {
    setUploadFiles([]);
    setUploadAlt("");
    setEditor({ kind: "upload" });
  };

  const openGenerate = () => {
    setAiPrompt("");
    setAiAlt("");
    setEditor({ kind: "generate" });
  };

  const openAltEditor = (asset: MediaFixture) => {
    setAltDraft(asset.altText);
    setEditor({ kind: "alt", id: asset.id });
  };

  const upload = () => {
    const file = uploadFiles[0];
    if (!file) {
      setNotice({ type: "error", text: "请选择一张图片后再上传。" });
      return;
    }
    const id = Math.max(0, ...assets.map((asset) => asset.id)) + 1;
    const contentType = file.type || "image/png";
    const next: MediaFixture = {
      id,
      filename: file.name,
      url: `/uploads/${file.name}`,
      contentType,
      sizeKb: Math.max(1, Math.ceil(file.size / 1024)),
      createdAt: "2026-09-08 17:30",
      altText: uploadAlt.trim(),
      references: [],
    };
    setAssets((current) => [next, ...current]);
    setEditor(null);
    setNotice({ type: "success", text: `图片“${file.name}”已上传（Showcase 模拟）。` });
  };

  const generate = () => {
    const prompt = aiPrompt.trim();
    if (!prompt) {
      setNotice({ type: "error", text: "请输入生图提示词。" });
      return;
    }
    const id = Math.max(0, ...assets.map((asset) => asset.id)) + 1;
    const filename = `ai-generated-${id}.png`;
    setAssets((current) => [{
      id,
      filename,
      url: `/uploads/${filename}`,
      contentType: "image/png",
      sizeKb: 384,
      createdAt: "2026-09-08 17:31",
      altText: aiAlt.trim() || prompt,
      references: [],
    }, ...current]);
    setEditor(null);
    setNotice({ type: "success", text: "AI 图片已生成并自动存入媒体库（Showcase 模拟）。" });
  };

  const saveAlt = () => {
    if (editor?.kind !== "alt") return;
    setAssets((current) => current.map((asset) => asset.id === editor.id ? { ...asset, altText: altDraft.trim() } : asset));
    setEditor(null);
    setNotice({ type: "success", text: "替代文本已更新（Showcase 模拟）。" });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const ids = deleteTarget.kind === "batch" ? selected : [deleteTarget.id];
    const candidates = assets.filter((asset) => ids.includes(asset.id));
    const blocked = candidates.filter((asset) => asset.references.length > 0);
    const removable = candidates.filter((asset) => asset.references.length === 0);
    const removedIds = removable.map((asset) => asset.id);
    const failedIds = blocked.map((asset) => asset.id);

    setAssets((current) => current.filter((asset) => !removedIds.includes(asset.id)));
    setSelected(failedIds);
    setDeleteTarget(null);

    if (blocked.length > 0) {
      const references = blocked.flatMap((asset) => asset.references);
      setNotice({
        type: "error",
        text: `已删除 ${removable.length} 个媒体；${blocked.length} 个未删除：仍被文章引用。`,
        references,
      });
      return;
    }
    setNotice({ type: "success", text: removable.length > 1 ? `已删除 ${removable.length} 个媒体（Showcase 模拟）。` : "媒体已删除（Showcase 模拟）。" });
  };

  const launchAI = () => {
    const count = selected.length;
    setAIOpen(false);
    setNotice({ type: "success", text: `已将 ${count} 个媒体交给 AI 工作流（Showcase 模拟）。` });
  };

  const deleteDescription: ReactNode = deleteTarget?.kind === "batch"
    ? `确认永久删除选中的 ${selected.length} 个媒体？仍被文章引用的媒体将保留。`
    : "确认永久删除这个媒体？如果仍被文章引用，删除会被阻止。";

  const editingAsset = editor?.kind === "alt" ? assets.find((asset) => asset.id === editor.id) : null;

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route="/admin/media"
        note="保留真实媒体 Grid、过滤、上传/AI 生图、替代文本、引用保护和批量失败重试语义；Fixture 不请求真实 Blog API。"
        controls={(
          <Segmented<FixtureScenario>
            aria-label="媒体页 Fixture 状态"
            options={scenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              setSelected([]);
              setNotice(null);
            }}
            block
          />
        )}
      />

      <PageHeader
        title="媒体库"
        description="上传、检索和复用全站内容中的图片资源，支持 AI 直接文生图入库。"
        actions={(
          <div className="flex flex-wrap items-center gap-2">
            <Button icon={<Sparkles />} onClick={openGenerate}>AI 文生图</Button>
            <Button variant="solid" color="primary" icon={<ImagePlus />} onClick={openUpload}>上传图片</Button>
          </div>
        )}
      />

      {notice ? (
        <Alert
          type={notice.type}
          showIcon
          title={notice.text}
          description={notice.references?.length ? (
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {notice.references.map((reference) => <li key={`${reference.postId}-${reference.postTitle}`}>{reference.postTitle}</li>)}
            </ul>
          ) : undefined}
          closable={{ onClose: () => setNotice(null) }}
        />
      ) : null}

      <Card padding="base" className="shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <Input
              aria-label="搜索媒体"
              prefix={<Search className="size-4" />}
              value={query}
              onChange={(event) => { setQuery(event.target.value); setSelected([]); }}
              placeholder="搜索文件名或替代文本"
            />
          </div>
          <div className="min-w-0 lg:w-44">
            <Select aria-label="媒体类型" value={type} onChange={(value) => { setType(String(value)); setSelected([]); }}>
              <option value="">全部类型</option>
              {contentTypes.map((item) => <option key={item} value={item}>{typeLabel(item)}</option>)}
            </Select>
          </div>
          <Text size="sm" tone="muted" className="whitespace-nowrap">{visibleAssets.length} / {assets.length}</Text>
          {hasFilters ? <Button size="small" variant="text" icon={<X />} onClick={clearFilters}>清除</Button> : null}
        </div>
      </Card>

      {selected.length > 0 ? (
        <BulkActionBar selectionLabel={`已选择 ${selected.length} 个媒体`} onCancel={() => setSelected([])}>
          <Button size="small" icon={<Bot />} onClick={() => setAIOpen(true)}>交给 AI</Button>
          <Button size="small" color="error" icon={<Trash2 />} onClick={() => setDeleteTarget({ kind: "batch" })}>删除</Button>
        </BulkActionBar>
      ) : null}

      {scenario === "error" ? (
        <Alert
          type="error"
          showIcon
          title="媒体加载失败"
          description="无法读取媒体库。真实产品会保留筛选条件并允许重新请求。"
          action={<Button size="small" onClick={() => setScenario("data")}>重新载入</Button>}
        />
      ) : scenario === "loading" ? (
        <LoadingMedia />
      ) : visibleAssets.length === 0 ? (
        <Card padding="lg">
          <Empty
            icon={<ImageIcon className="size-7 text-muted-foreground" />}
            title={assets.length === 0 ? "媒体库还是空的" : "没有符合条件的媒体资源"}
            description={assets.length === 0 ? "上传图片或使用 AI 文生图创建第一个媒体资源。" : "调整或清除筛选条件后重试。"}
            action={hasFilters ? <Button onClick={clearFilters}>清除筛选</Button> : <Button variant="solid" color="primary" icon={<ImagePlus />} onClick={openUpload}>上传第一张图片</Button>}
          />
        </Card>
      ) : (
        <div role="list" aria-label="媒体资源" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleAssets.map((asset) => (
            <Card key={asset.id} padding="none" role="listitem" className="gap-0 overflow-clip shadow-sm">
              <div className="relative">
                <MediaPreview asset={asset} />
                <div className="absolute left-2 top-2 rounded-md bg-background/85 p-1 shadow-sm backdrop-blur">
                  <Checkbox
                    aria-label={`选择媒体 ${asset.filename}`}
                    checked={selected.includes(asset.id)}
                    onChange={(event) => setSelection(asset.id, event.target.checked)}
                  />
                </div>
              </div>
              <div className="flex min-h-36 flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <strong className="min-w-0 truncate text-sm font-semibold" title={asset.filename}>{asset.filename}</strong>
                  <Tag>{typeLabel(asset.contentType)}</Tag>
                </div>
                <Text size="sm" tone="muted" className="line-clamp-2 leading-relaxed">替代文本：{asset.altText || "未设置"}</Text>
                <div className="mt-auto flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-muted-foreground">
                  <span>{asset.sizeKb} KB</span>
                  <span>{asset.createdAt}</span>
                  {asset.references.length > 0 ? <span className="font-sans text-primary">引用 {asset.references.length}</span> : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/20 p-3">
                <div className="flex items-center gap-1">
                  <IconButton label={`复制相对地址 ${asset.filename}`} icon={<Link2 />} variant="ghost" onClick={() => setNotice({ type: "success", text: `已复制 ${asset.url}（Showcase 模拟）。` })} />
                  <IconButton label={`复制 Markdown ${asset.filename}`} icon={<Copy />} variant="ghost" onClick={() => setNotice({ type: "success", text: `已复制 ![${asset.altText || asset.filename}](${asset.url})（Showcase 模拟）。` })} />
                </div>
                <div className="flex items-center gap-1">
                  <IconButton label={`编辑替代文本 ${asset.filename}`} icon={<Pencil />} variant="ghost" onClick={() => openAltEditor(asset)} />
                  <IconButton label={`删除媒体 ${asset.filename}`} icon={<Trash2 />} variant="ghost" color="error" onClick={() => setDeleteTarget({ kind: "single", id: asset.id })} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Drawer
        open={editor?.kind === "upload"}
        title="上传图片"
        description="选择图片并补充替代文本，便于内容复用与无障碍阅读。"
        width={440}
        onClose={() => setEditor(null)}
        footer={(
          <>
            <Button onClick={() => setEditor(null)}>取消</Button>
            <Button variant="solid" color="primary" onClick={upload}>上传图片</Button>
          </>
        )}
      >
        <div className="flex flex-col gap-5">
          <FormField label="图片文件" required>
            <Upload
              aria-label="图片文件"
              files={uploadFiles}
              onFiles={setUploadFiles}
              accept="image/*,.svg,.ico"
              maxCount={1}
              drag
            >
              点击或拖放图片到这里
            </Upload>
          </FormField>
          <FormField label="替代文本" hint="描述图片内容，便于无障碍阅读和内容复用。">
            <Input aria-label="上传替代文本" value={uploadAlt} onChange={(event) => setUploadAlt(event.target.value)} />
          </FormField>
        </div>
      </Drawer>

      <Drawer
        open={editor?.kind === "generate"}
        title="AI 文生图"
        description="输入创意描述，让 AI 生成插画并直接存入媒体库。"
        width={480}
        onClose={() => setEditor(null)}
        footer={(
          <>
            <Button onClick={() => setEditor(null)}>取消</Button>
            <Button variant="solid" color="primary" icon={<Sparkles />} onClick={generate}>生成并入库</Button>
          </>
        )}
      >
        <div className="flex flex-col gap-5">
          <FormField label="生图提示词" required>
            <Textarea aria-label="生图提示词" rows={5} value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder="例如：深色技术博客中的分布式系统架构插图…" />
          </FormField>
          <FormField label="替代文本" hint="为空时使用提示词作为替代文本。">
            <Input aria-label="AI 图片替代文本" value={aiAlt} onChange={(event) => setAiAlt(event.target.value)} />
          </FormField>
        </div>
      </Drawer>

      <Drawer
        open={editor?.kind === "alt"}
        title="编辑替代文本"
        description={editingAsset ? `为 ${editingAsset.filename} 更新 Alt Text。` : undefined}
        width={440}
        onClose={() => setEditor(null)}
        footer={(
          <>
            <Button onClick={() => setEditor(null)}>取消</Button>
            <Button variant="solid" color="primary" onClick={saveAlt}>保存修改</Button>
          </>
        )}
      >
        <FormField label="替代文本">
          <Textarea aria-label="编辑替代文本" rows={5} value={altDraft} onChange={(event) => setAltDraft(event.target.value)} />
        </FormField>
      </Drawer>

      <Modal
        open={deleteTarget !== null}
        title={deleteTarget?.kind === "batch" ? "批量删除媒体" : "删除媒体"}
        description={deleteDescription}
        onClose={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        okText="永久删除"
        okButtonProps={{ variant: "solid", color: "error" }}
      >
        <Text size="sm" tone="muted">仍被文章引用的资源不会删除，并继续保持选中以便处理引用后重试。</Text>
      </Modal>

      <Modal
        open={aiOpen}
        title="将所选媒体交给 AI"
        description="真实产品会把所选媒体作为 media_asset 资源传给 WorkflowLauncher。"
        onClose={() => setAIOpen(false)}
        onOk={launchAI}
        okText="启动工作流"
        okButtonProps={{ variant: "solid", color: "primary" }}
      >
        <div className="space-y-3">
          <Text size="sm" tone="muted">本次将处理 {selectedAssets.length} 个媒体：</Text>
          <ul className="space-y-2 text-sm">
            {selectedAssets.map((asset) => <li key={asset.id} className="rounded-md border bg-muted/30 px-3 py-2">{asset.filename}</li>)}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
