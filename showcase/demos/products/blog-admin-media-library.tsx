import { useMemo, useState, type ReactNode } from "react";
import { Copy, ImagePlus, Link2, Pencil, Search, Sparkles, Trash2, X } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Drawer,
  Empty,
  FormField,
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
type MediaReference = { postId: number; title: string };
type MediaFixture = {
  id: number;
  filename: string;
  url: string;
  altText: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
  usageCount: number;
  references: MediaReference[];
};
type DeleteTarget = { kind: "single"; id: number } | { kind: "batch" } | null;

type FeedbackState = { type: "success" | "error"; text: string } | null;

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "错误" },
] as const;

function mediaSvg(label: string, seed: number) {
  const hue = (seed * 47) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="hsl(${hue} 35% 22%)"/><circle cx="650" cy="90" r="120" fill="hsl(${hue} 60% 48% / .55)"/><path d="M0 380 180 210l120 95 120-145 190 220Z" fill="hsl(${(hue + 60) % 360} 45% 62% / .72)"/><text x="40" y="70" fill="white" font-size="34" font-family="system-ui,sans-serif">${label.replace(/[<>&]/g, "")}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const initialAssets: readonly MediaFixture[] = [
  {
    id: 701,
    filename: "oauth-bff-flow.svg",
    url: mediaSvg("OAuth BFF", 1),
    altText: "OAuth BFF 浏览器与后端会话流程图",
    contentType: "image/svg+xml",
    sizeBytes: 18432,
    createdAt: "2026-09-08 09:50",
    usageCount: 2,
    references: [
      { postId: 101, title: "OAuth 2.0 BFF 实践" },
      { postId: 102, title: "浏览器 Session 边界" },
    ],
  },
  {
    id: 702,
    filename: "design-system-cover.png",
    url: mediaSvg("Design System", 2),
    altText: "设计系统文章封面",
    contentType: "image/png",
    sizeBytes: 126240,
    createdAt: "2026-09-07 22:10",
    usageCount: 0,
    references: [],
  },
  {
    id: 703,
    filename: "kafka-backpressure.webp",
    url: mediaSvg("Kafka", 3),
    altText: "Kafka 消费者背压与队列示意图",
    contentType: "image/webp",
    sizeBytes: 88420,
    createdAt: "2026-09-07 18:32",
    usageCount: 1,
    references: [{ postId: 103, title: "Kafka 消费者背压设计" }],
  },
  {
    id: 704,
    filename: "site-favicon.ico",
    url: mediaSvg("IO84", 4),
    altText: "",
    contentType: "image/x-icon",
    sizeBytes: 6912,
    createdAt: "2026-09-06 15:20",
    usageCount: 0,
    references: [],
  },
  {
    id: 705,
    filename: "go-worker-architecture.svg",
    url: mediaSvg("Go Workers", 5),
    altText: "Go 分布式 Worker 架构图",
    contentType: "image/svg+xml",
    sizeBytes: 24690,
    createdAt: "2026-09-05 11:05",
    usageCount: 0,
    references: [],
  },
];

function typeLabel(contentType: string) {
  return contentType
    .replace("image/", "")
    .replace("svg+xml", "SVG")
    .replace("x-icon", "ICO")
    .toUpperCase();
}

function LoadingMedia() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" role="status" aria-label="媒体加载中" aria-live="polite">
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index} padding="none" className="overflow-hidden">
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function BlogAdminMediaLibraryDemo() {
  const [assets, setAssets] = useState<MediaFixture[]>(() => [...initialAssets]);
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [blockedReferences, setBlockedReferences] = useState<MediaReference[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadAlt, setUploadAlt] = useState("");
  const [editAssetId, setEditAssetId] = useState<number | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAlt, setAiAlt] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiGenerated, setAiGenerated] = useState<MediaFixture | null>(null);
  const [workflowOpen, setWorkflowOpen] = useState(false);

  const sourceAssets = scenario === "empty" ? [] : assets;
  const contentTypes = useMemo(() => [...new Set(assets.map((asset) => asset.contentType))], [assets]);
  const visibleAssets = useMemo(() => sourceAssets.filter((asset) => {
    const normalized = query.trim().toLowerCase();
    if (normalized && !`${asset.filename} ${asset.altText}`.toLowerCase().includes(normalized)) return false;
    if (type && asset.contentType !== type) return false;
    return true;
  }), [sourceAssets, query, type]);
  const selectedAssets = useMemo(() => assets.filter((asset) => selected.includes(asset.id)), [assets, selected]);
  const hasFilters = Boolean(query || type);

  const clearOperationFeedback = () => {
    setFeedback(null);
    setBlockedReferences([]);
  };

  const openAltEditor = (asset: MediaFixture) => {
    setEditAssetId(asset.id);
    setEditAlt(asset.altText);
    clearOperationFeedback();
  };

  const saveAltText = () => {
    if (editAssetId === null) return;
    const value = editAlt.trim();
    setAssets((current) => current.map((asset) => asset.id === editAssetId ? { ...asset, altText: value } : asset));
    setEditAssetId(null);
    setFeedback({ type: "success", text: "替代文本已更新（Showcase 模拟）。" });
  };

  const upload = () => {
    const file = uploadFiles[0];
    if (!file) {
      setFeedback({ type: "error", text: "请选择要上传的图片。" });
      return;
    }
    const id = Math.max(0, ...assets.map((asset) => asset.id)) + 1;
    const extension = file.name.split(".").pop()?.toLowerCase() || "image";
    const contentType = file.type || (extension === "ico" ? "image/x-icon" : `image/${extension}`);
    const next: MediaFixture = {
      id,
      filename: file.name,
      url: mediaSvg(file.name, id),
      altText: uploadAlt.trim(),
      contentType,
      sizeBytes: file.size,
      createdAt: "2026-09-08 10:45",
      usageCount: 0,
      references: [],
    };
    setAssets((current) => [next, ...current]);
    setUploadFiles([]);
    setUploadAlt("");
    setUploadOpen(false);
    setFeedback({ type: "success", text: "图片已上传（Showcase 模拟）。" });
  };

  const generateImage = () => {
    const prompt = aiPrompt.trim();
    if (!prompt) {
      setAiError("请输入生图提示词。");
      return;
    }
    const id = Math.max(0, ...assets.map((asset) => asset.id)) + 1;
    const next: MediaFixture = {
      id,
      filename: `ai-generated-${id}.png`,
      url: mediaSvg("AI Generated", id),
      altText: aiAlt.trim() || "AI 媒体插图",
      contentType: "image/png",
      sizeBytes: 97280,
      createdAt: "2026-09-08 10:46",
      usageCount: 0,
      references: [],
    };
    setAssets((current) => [next, ...current]);
    setAiGenerated(next);
    setAiError("");
    setFeedback({ type: "success", text: "图片已由 AI 生成并自动存入媒体库（Showcase 模拟）。" });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === "single") {
      const asset = assets.find((item) => item.id === deleteTarget.id);
      setDeleteTarget(null);
      if (!asset) return;
      if (asset.references.length > 0) {
        setBlockedReferences(asset.references);
        setFeedback({ type: "error", text: "该媒体仍被文章引用，移除引用后才能删除。" });
        return;
      }
      setAssets((current) => current.filter((item) => item.id !== asset.id));
      setSelected((current) => current.filter((id) => id !== asset.id));
      setFeedback({ type: "success", text: `媒体“${asset.filename}”已删除（Showcase 模拟）。` });
      return;
    }

    const candidates = assets.filter((asset) => selected.includes(asset.id));
    const failed = candidates.filter((asset) => asset.references.length > 0);
    const removed = candidates.filter((asset) => asset.references.length === 0);
    const removedIds = removed.map((asset) => asset.id);
    const failedIds = failed.map((asset) => asset.id);
    setAssets((current) => current.filter((asset) => !removedIds.includes(asset.id)));
    setSelected(failedIds);
    setDeleteTarget(null);
    setBlockedReferences(failed.flatMap((asset) => asset.references));
    if (failed.length > 0) {
      setFeedback({
        type: "error",
        text: `已删除 ${removed.length} 个媒体；${failed.length} 个未删除：可能仍被文章引用。`,
      });
    } else {
      setFeedback({ type: "success", text: `已删除 ${removed.length} 个媒体（Showcase 模拟）。` });
    }
  };

  const deleteDescription: ReactNode = deleteTarget?.kind === "batch"
    ? `确认永久删除选中的 ${selected.length} 个媒体？仍被文章引用的媒体将保留。`
    : deleteTarget?.kind === "single"
      ? `确认永久删除“${assets.find((asset) => asset.id === deleteTarget.id)?.filename ?? "该媒体"}”？`
      : null;

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route="/admin/medialibrary"
        note="保留真实媒体 Card Grid、上传/AI/Alt Text Drawers、引用感知删除、批量部分失败和 AI Workflow 语义；Fixture 不请求 media API。"
        controls={(
          <Segmented<FixtureScenario>
            aria-label="媒体库 Fixture 状态"
            options={scenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              setSelected([]);
              clearOperationFeedback();
              setDeleteTarget(null);
            }}
            block
          />
        )}
      />

      <PageHeader
        title="媒体库"
        description="上传、检索和复用全站内容中的图片资源，支持 AI 直接文生图入库。"
        actions={(
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              icon={<Sparkles />}
              onClick={() => {
                setAiDrawerOpen(true);
                setAiPrompt("");
                setAiAlt("");
                setAiError("");
                setAiGenerated(null);
              }}
            >
              AI 文生图
            </Button>
            <Button
              variant="solid"
              color="primary"
              icon={<ImagePlus />}
              onClick={() => {
                setUploadFiles([]);
                setUploadAlt("");
                setUploadOpen(true);
                clearOperationFeedback();
              }}
            >
              上传图片
            </Button>
          </div>
        )}
      />

      {feedback ? (
        <Alert
          type={feedback.type}
          showIcon
          title={feedback.text}
          closable={{ onClose: clearOperationFeedback }}
        >
          {blockedReferences.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-1 text-sm">
              {blockedReferences.map((reference) => (
                <li key={`${reference.postId}-${reference.title}`}>
                  <button
                    type="button"
                    className="text-left font-medium text-primary underline-offset-4 hover:underline"
                    onClick={() => setFeedback({ type: "success", text: `将进入 /admin/posts/${reference.postId}/edit（Showcase 模拟）。` })}
                  >
                    {reference.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </Alert>
      ) : null}

      <Card padding="base" className="shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <Input
              aria-label="搜索媒体"
              prefix={<Search className="size-4" />}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索文件名或替代文本"
            />
          </div>
          <div className="min-w-0 lg:w-44 lg:shrink-0">
            <Select aria-label="媒体类型" value={type} onChange={(value) => setType(String(value))}>
              <option value="">全部类型</option>
              {contentTypes.map((contentType) => (
                <option key={contentType} value={contentType}>{typeLabel(contentType)}</option>
              ))}
            </Select>
          </div>
          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <Text size="sm" tone="muted" className="whitespace-nowrap">{visibleAssets.length} / {assets.length}</Text>
            {hasFilters ? (
              <Button
                size="small"
                variant="text"
                icon={<X />}
                onClick={() => {
                  setQuery("");
                  setType("");
                }}
              >
                清除
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      {selected.length > 0 ? (
        <BulkActionBar selectionLabel={`已选择 ${selected.length} 个媒体`} onCancel={() => setSelected([])}>
          <Button size="small" icon={<Sparkles />} onClick={() => setWorkflowOpen(true)}>交给 AI</Button>
          <Button size="small" color="error" icon={<Trash2 />} onClick={() => {
            clearOperationFeedback();
            setDeleteTarget({ kind: "batch" });
          }}>
            删除
          </Button>
        </BulkActionBar>
      ) : null}

      {scenario === "error" ? (
        <Alert
          type="error"
          showIcon
          title="媒体加载失败"
          description="无法读取媒体库。真实产品会保留当前筛选上下文并允许重新请求。"
          action={<Button size="small" onClick={() => setScenario("data")}>重新载入</Button>}
        />
      ) : scenario === "loading" ? (
        <LoadingMedia />
      ) : visibleAssets.length === 0 ? (
        <Card padding="lg">
          <Empty
            icon={<ImagePlus className="size-7 text-muted-foreground" />}
            title={hasFilters ? "没有符合条件的媒体资源。" : "还没有媒体资源"}
            description={hasFilters ? "调整文件名、替代文本或媒体类型筛选后重试。" : "上传图片或使用 AI 文生图创建第一张媒体资源。"}
            action={hasFilters ? (
              <Button onClick={() => { setQuery(""); setType(""); }}>清除筛选</Button>
            ) : (
              <Button variant="solid" color="primary" icon={<ImagePlus />} onClick={() => setUploadOpen(true)}>上传图片</Button>
            )}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" role="list" aria-label="媒体资源">
          {visibleAssets.map((asset) => (
            <Card key={asset.id} padding="none" role="listitem" className="group overflow-hidden transition-all hover:border-primary/40 hover:shadow-sm">
              <div className="relative aspect-video overflow-hidden border-b bg-muted/40">
                <div className="absolute left-2 top-2 z-10 rounded-md bg-background/85 p-1 shadow-sm backdrop-blur">
                  <Checkbox
                    aria-label={`选择媒体 ${asset.filename}`}
                    checked={selected.includes(asset.id)}
                    onChange={(event) => setSelected((current) => event.target.checked
                      ? [...new Set([...current, asset.id])]
                      : current.filter((id) => id !== asset.id))}
                  />
                </div>
                <img src={asset.url} alt={asset.altText || asset.filename} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <strong className="min-w-0 truncate text-sm font-semibold" title={asset.filename}>{asset.filename}</strong>
                  <Tag>{typeLabel(asset.contentType)}</Tag>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
                  <span>{Math.max(1, Math.ceil(asset.sizeBytes / 1024))} KB</span>
                  <time>{asset.createdAt}</time>
                  {asset.usageCount > 0 ? <span className="font-sans text-primary">引用 {asset.usageCount}</span> : null}
                </div>
                <Text size="xs" tone="muted" className="truncate" title={asset.altText || undefined}>
                  Alt Text：{asset.altText || <span className="italic opacity-70">未设置</span>}
                </Text>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/20 p-2">
                <div className="flex flex-wrap items-center gap-1">
                  <Button size="small" variant="text" icon={<Link2 />} aria-label={`复制相对地址 ${asset.filename}`} onClick={() => setFeedback({ type: "success", text: `已复制 /media/${asset.filename}（Showcase 模拟）。` })}>相对地址</Button>
                  <Button size="small" variant="text" icon={<Copy />} aria-label={`复制 Markdown ${asset.filename}`} onClick={() => setFeedback({ type: "success", text: `已复制 ${asset.filename} 的 Markdown（Showcase 模拟）。` })}>Markdown</Button>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <Button size="small" variant="text" icon={<Pencil />} aria-label={`编辑替代文本 ${asset.filename}`} onClick={() => openAltEditor(asset)}>Alt Text</Button>
                  <Button size="small" variant="text" color="error" icon={<Trash2 />} aria-label={`删除媒体 ${asset.filename}`} onClick={() => {
                    clearOperationFeedback();
                    setDeleteTarget({ kind: "single", id: asset.id });
                  }}>删除</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Drawer
        open={uploadOpen}
        title="上传图片"
        description="选择图片并补充替代文本，便于内容复用与无障碍阅读。"
        width={460}
        onClose={() => setUploadOpen(false)}
        footer={(
          <>
            <Button onClick={() => setUploadOpen(false)}>取消</Button>
            <Button variant="solid" color="primary" onClick={upload}>上传图片</Button>
          </>
        )}
      >
        <div className="flex flex-col gap-5">
          <FormField label="图片文件" required>
            <Upload
              aria-label="媒体文件"
              files={uploadFiles}
              onFiles={setUploadFiles}
              accept="image/*,.svg,.ico"
              maxCount={1}
              drag
            >
              点击或拖放图片到这里
            </Upload>
          </FormField>
          <FormField label="替代文本" hint="用于图片无法显示时以及屏幕阅读器描述。">
            <Input aria-label="上传图片替代文本" value={uploadAlt} onChange={(event) => setUploadAlt(event.target.value)} placeholder="描述图片主要内容" />
          </FormField>
        </div>
      </Drawer>

      <Drawer
        open={aiDrawerOpen}
        title="AI 文生图"
        description="输入创意描述，让 AI 一键绘制插画并直接存入媒体库。"
        width={480}
        onClose={() => setAiDrawerOpen(false)}
        footer={(
          <>
            <Button onClick={() => setAiDrawerOpen(false)}>关闭</Button>
            <Button variant="solid" color="primary" icon={<Sparkles />} onClick={generateImage}>生成并入库</Button>
          </>
        )}
      >
        <div className="flex flex-col gap-5">
          {aiError ? <Alert type="error" showIcon title={aiError} /> : null}
          <FormField label="生图提示词" required>
            <Textarea aria-label="AI 生图提示词" rows={5} value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder="例如：极简技术架构图，深色背景，清晰的数据流…" />
          </FormField>
          <FormField label="替代文本">
            <Input aria-label="AI 图片替代文本" value={aiAlt} onChange={(event) => setAiAlt(event.target.value)} placeholder="留空时使用默认描述" />
          </FormField>
          {aiGenerated ? (
            <Card padding="sm" className="overflow-hidden">
              <img src={aiGenerated.url} alt={aiGenerated.altText} className="aspect-video w-full rounded-md object-cover" />
              <div className="flex items-center justify-between gap-3">
                <Text size="xs" tone="muted">{aiGenerated.filename} 已自动存入媒体库</Text>
                <Button size="small" variant="text" icon={<Copy />} onClick={() => setFeedback({ type: "success", text: "生成图片 Markdown 已复制（Showcase 模拟）。" })}>复制 Markdown</Button>
              </div>
            </Card>
          ) : null}
        </div>
      </Drawer>

      <Drawer
        open={editAssetId !== null}
        title="编辑替代文本"
        description="修改图片的替代文本（Alt Text），便于内容复用与无障碍阅读。"
        width={440}
        onClose={() => setEditAssetId(null)}
        footer={(
          <>
            <Button onClick={() => setEditAssetId(null)}>取消</Button>
            <Button variant="solid" color="primary" onClick={saveAltText}>保存修改</Button>
          </>
        )}
      >
        <FormField label="替代文本">
          <Textarea aria-label="编辑替代文本" rows={4} value={editAlt} onChange={(event) => setEditAlt(event.target.value)} />
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
        <Text size="sm" tone="muted">仍被文章引用的媒体必须先移除引用；批量删除时失败项会继续保持选中。</Text>
      </Modal>

      <Modal
        open={workflowOpen}
        title="将所选媒体交给 AI"
        description="真实产品会以 media_asset resource keys 启动 WorkflowLauncher。"
        onClose={() => setWorkflowOpen(false)}
        onOk={() => {
          const count = selected.length;
          setWorkflowOpen(false);
          setFeedback({ type: "success", text: `已将 ${count} 个媒体交给 AI 工作流（Showcase 模拟）。` });
        }}
        okText="启动工作流"
        okButtonProps={{ variant: "solid", color: "primary" }}
      >
        <div className="flex flex-col gap-3">
          <Text size="sm" tone="muted">本次将处理 {selectedAssets.length} 个媒体：</Text>
          <div className="flex flex-wrap gap-2">
            {selectedAssets.map((asset) => <Tag key={asset.id}>{asset.filename}</Tag>)}
          </div>
        </div>
      </Modal>
    </div>
  );
}
