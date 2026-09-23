import { useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Image as ImageIcon,
  Save,
  Send,
  Sparkles,
} from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Field,
  Input,
  Modal,
  Segmented,
  Select,
  Skeleton,
  Text,
  Textarea,
} from "../../../../src/core";
import {
  AISuggestionPicker,
  AISuggestionReview,
  DocumentEditorShell,
  MarkdownEditor,
  type MarkdownEditorMode,
  type MarkdownEditorRef,
  type MarkdownEditorToolbarActionsContext,
  type MarkdownEditorSelection,
} from "../../../../src/patterns";
import { FixtureDock } from "../../../components/fixture-dock";
import { FixtureNotification } from "./fixture-notification";
import { MarkdownPreview } from "../../../components/markdown-preview";
import { copyText } from "../../../lib/copy-text";

type EditorRoute = "edit" | "new";
type FixtureScenario = "ready" | "loading" | "error" | "conflict";
type PageStatus = "draft" | "published";
type AIPanel = "writing" | "image" | null;
type PageTemplate =
  | "default"
  | "about"
  | "links"
  | "timeline"
  | "projects"
  | "focus"
  | "faq"
  | "blank";

type PageFixture = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  template: PageTemplate;
  status: PageStatus;
  showInNav: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
};

const existingPage: PageFixture = {
  id: 3,
  title: "关于我们",
  slug: "about-us",
  summary: "本站与团队介绍页面",
  content:
    "## 关于我们\n\n欢迎来到我们的博客。这里记录团队背景、技术方向和长期目标。\n\n## 我们在做什么\n\n持续分享工程实践、AI 产品与开放技术。",
  template: "about",
  status: "draft",
  showInNav: true,
  sortOrder: 10,
  seoTitle: "关于我们 - 深度技术博客",
  seoDescription: "了解团队背景、技术方向与长期愿景。",
};

const emptyPage: PageFixture = {
  id: 0,
  title: "",
  slug: "",
  summary: "",
  content: "",
  template: "default",
  status: "draft",
  showInNav: false,
  sortOrder: 0,
  seoTitle: "",
  seoDescription: "",
};

const routeOptions = [
  { value: "edit", label: "编辑单页" },
  { value: "new", label: "新建单页" },
] as const;

const scenarioOptions = [
  { value: "ready", label: "正常" },
  { value: "loading", label: "加载中" },
  { value: "error", label: "读取失败" },
  { value: "conflict", label: "409 冲突" },
] as const;

const pageTitleSuggestions = [
  "关于我们：技术、产品与长期主义",
  "认识我们：从工程实践到开放技术",
] as const;

const pageSummarySuggestions = [
  "介绍团队背景、技术方向、产品理念与长期目标。",
  "用一个页面说明我们是谁、长期关注什么，以及为什么持续分享工程实践与开放技术。",
] as const;

const pageSeoSuggestions = [
  { key: "slug", label: "Slug", value: "about-us", monospace: true },
  { key: "seo-title", label: "SEO 标题", value: "关于我们：团队、技术方向与长期愿景" },
  { key: "seo-description", label: "SEO 描述", value: "介绍团队背景、技术栈、开放技术实践与长期目标。" },
] as const;

const templateLabels: Record<PageTemplate, string> = {
  default: "默认标准排版 (Default)",
  about: "关于页专用模板 (About)",
  links: "友情链接模板 (Links)",
  timeline: "时间轴与历程 (Timeline)",
  projects: "项目与作品集 (Projects)",
  focus: "极简专注阅读 (Focus)",
  faq: "问答与指南 (FAQ)",
  blank: "全宽纯净模板 (Blank)",
};

function seedPage(route: EditorRoute): PageFixture {
  return route === "new" ? { ...emptyPage } : { ...existingPage };
}

function InspectorSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <details open className="relative border-b py-4 last:border-b-0">
      <summary className="cursor-pointer select-none pe-12 type-body-sm type-weight-semibold">{title}</summary>
      {action ? <div className="absolute end-0 top-2.5 z-10">{action}</div> : null}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </details>
  );
}

function FieldActionHeader({
  label,
  actionLabel,
  onAction,
  disabled = false,
  required = false,
}: {
  label: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div className="mb-2 flex min-h-8 items-center justify-between gap-3">
      <div className="type-body-sm type-weight-medium">
        {label}{required ? <span aria-hidden="true" className="text-destructive">*</span> : null}
      </div>
      <Button
        type="button"
        size="small"
        variant="text"
        icon={<Sparkles />}
        onClick={onAction}
        disabled={disabled}
        aria-label={actionLabel}
        title={actionLabel}
        className="size-8 px-0"
      />
    </div>
  );
}

function renderPagePreview(value: string) {
  return <MarkdownPreview value={value} data-slot="page-markdown-preview" />;
}

export function BlogAdminPageEditorDemo({
  initialRoute = "edit",
  initialScenario = "ready",
}: {
  initialRoute?: EditorRoute;
  initialScenario?: FixtureScenario;
}) {
  const [routeMode, setRouteMode] = useState<EditorRoute>(initialRoute);
  const [scenario, setScenario] = useState<FixtureScenario>(initialScenario);
  const [page, setPage] = useState<PageFixture>(() => seedPage(initialRoute));
  const [publishIntent, setPublishIntent] = useState<PageStatus>(() => seedPage(initialRoute).status);
  const [editorMode, setEditorMode] = useState<MarkdownEditorMode>("edit");
  const [editorSelection, setEditorSelection] = useState<MarkdownEditorSelection | null>(null);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const [aiPanel, setAIPanel] = useState<AIPanel>(null);
  const [titleCandidates, setTitleCandidates] = useState<string[]>([]);
  const [selectedTitleCandidate, setSelectedTitleCandidate] = useState<string | null>(null);
  const [summaryCandidates, setSummaryCandidates] = useState<string[]>([]);
  const [selectedSummaryCandidate, setSelectedSummaryCandidate] = useState<string | null>(null);
  const [metadataSuggestionsOpen, setMetadataSuggestionsOpen] = useState(false);
  const [metadataSelection, setMetadataSelection] = useState<string[]>([]);
  const [writingPrompt, setWritingPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(false);
  const editorRef = useRef<MarkdownEditorRef>(null);

  const route = routeMode === "new" ? "/admin/pages/new" : `/admin/pages/${page.id || 3}/edit`;

  const resetTransientState = () => {
    setEditorMode("edit");
    setEditorSelection(null);
    setDirty(false);
    setSavedAt(null);
    setNotice(null);
    setError(null);
    setExitOpen(false);
    setAIPanel(null);
    setTitleCandidates([]);
    setSelectedTitleCandidate(null);
    setSummaryCandidates([]);
    setSelectedSummaryCandidate(null);
    setMetadataSuggestionsOpen(false);
    setMetadataSelection([]);
    setGeneratedContent(null);
    setGeneratedImage(false);
  };

  const changeRoute = (next: EditorRoute) => {
    const nextPage = seedPage(next);
    setRouteMode(next);
    setPage(nextPage);
    setPublishIntent(nextPage.status);
    resetTransientState();
  };

  const updatePage = <K extends keyof PageFixture>(key: K, value: PageFixture[K]) => {
    setPage((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setSavedAt(null);
    setError(null);
  };

  const validatePersistable = () => {
    if (!page.title.trim()) {
      setError("请先填写单页标题。");
      return false;
    }
    if (!page.slug.trim()) {
      setError("请填写单页访问路径 (Slug)。");
      return false;
    }
    return true;
  };

  const persist = (status: PageStatus, automatic = false) => {
    if (!validatePersistable()) return false;
    if (scenario === "conflict") {
      setError("单页已被其他编辑者更新（409 冲突）");
      return false;
    }

    setPage((current) => ({
      ...current,
      id: current.id || 7,
      title: current.title.trim(),
      slug: current.slug.trim().toLowerCase(),
      status,
    }));
    setPublishIntent(status);
    setDirty(false);
    setSavedAt("23:58");
    setError(null);
    if (!automatic) {
      setNotice(status === "published" ? "单页已成功发布！" : "单页草稿已保存。");
    }
    if (routeMode === "new") setRouteMode("edit");
    return true;
  };

  const openFrontsitePreview = () => {
    if (!validatePersistable()) return;
    if (dirty || !page.id) {
      if (!persist(page.status || "draft", true)) return;
      setNotice(`已先保存并打开 /${page.slug.trim().toLowerCase()}（Showcase 模拟）。`);
      return;
    }
    setNotice(`将打开 /${page.slug}（Showcase 模拟）。`);
  };

  const primaryStatus: PageStatus = publishIntent === "draft" ? "draft" : "published";
  const primaryLabel =
    publishIntent === "draft"
      ? page.status === "published"
        ? "下架为草稿"
        : "保存草稿"
      : page.status === "published"
        ? "更新单页"
        : "发布";

  const applyMetadataSuggestions = () => {
  const selected = new Set(metadataSelection);
  setPage((current) => ({
    ...current,
    slug: selected.has("slug") ? "about-us" : current.slug,
    seoTitle: selected.has("seo-title")
      ? "关于我们：团队、技术方向与长期愿景"
      : current.seoTitle,
    seoDescription: selected.has("seo-description")
      ? "介绍团队背景、技术栈、开放技术实践与长期目标。"
      : current.seoDescription,
  }));
  setDirty(true);
  setSavedAt(null);
  setMetadataSuggestionsOpen(false);
  setNotice(`已应用 ${metadataSelection.length} 项 AI 路径与 SEO 建议（Showcase 模拟）。`);
};

  const openWritingAssistant = (prompt: string) => {
    setWritingPrompt(prompt);
    setGeneratedContent(null);
    setAIPanel("writing");
  };

  const applyGeneratedContent = (mode: "replace-selection" | "replace" | "append") => {
    if (!generatedContent) return;

    if (mode === "replace-selection" && editorSelection && editorSelection.end > editorSelection.start) {
      const generated = generatedContent;
      const next = `${page.content.slice(0, editorSelection.start)}${generated}${page.content.slice(editorSelection.end)}`;
      const selectionStart = editorSelection.start;
      updatePage("content", next);
      setGeneratedContent(null);
      setAIPanel(null);
      setNotice("已替换所选正文。");
      queueMicrotask(() => {
        setEditorMode("edit");
        editorRef.current?.setSelection(selectionStart, selectionStart + generated.length);
      });
      return;
    }

    updatePage(
      "content",
      mode === "replace"
        ? generatedContent
        : page.content
          ? `${page.content.trim()}\n\n${generatedContent}`
          : generatedContent,
    );
    setGeneratedContent(null);
    setAIPanel(null);
    setNotice(mode === "replace" ? "已替换单页正文。" : "已将生成内容追加到单页正文末尾。");
  };

  const copyGeneratedContent = async () => {
    if (!generatedContent) return;
    const copied = await copyText(generatedContent);
    setNotice(copied ? "已复制 AI 生成内容。" : "复制失败，请手动选择生成结果。");
  };

  const insertGeneratedImageAtCursor = () => {
    const markdown = `![${imageAlt || "单页插图"}](/media/ai-generated-page.webp)`;
    setEditorMode("edit");
    queueMicrotask(() => {
      if (editorRef.current) {
        editorRef.current.insertText(`\n\n${markdown}\n`, { replaceSelection: false });
      } else {
        updatePage("content", `${page.content.trimEnd()}\n\n${markdown}\n`);
      }
      setAIPanel(null);
      setNotice("已在编辑位置插入 AI 图片。");
    });
  };

  const fixtureControls = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Text size="sm" weight="medium">路由状态</Text>
        <Segmented<EditorRoute>
          aria-label="PageEditor 路由状态"
          options={routeOptions}
          value={routeMode}
          onChange={changeRoute}
          block
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Text size="sm" weight="medium">请求状态</Text>
        <Segmented<FixtureScenario>
          aria-label="PageEditor Fixture 状态"
          options={scenarioOptions}
          value={scenario}
          onChange={(next) => {
            setScenario(next);
            setNotice(null);
            setError(null);
          }}
          block
        />
      </div>
    </div>
  );

  if (scenario === "loading") {
    return (
      <div className="flex flex-col gap-6">
        <FixtureDock
          route={route}
          note="PageEditor 使用 DocumentEditorShell / MarkdownEditor；Fixture 不请求真实 Blog API。"
          controls={fixtureControls}
        />
        <Card padding="base" aria-label="单页编辑器加载中">
          <div className="flex flex-col gap-5" role="status" aria-live="polite">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-9 w-64" />
            </div>
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
              <Skeleton className="h-[38rem] w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (scenario === "error") {
    return (
      <div className="flex flex-col gap-6">
        <FixtureDock
          route={route}
          note="模拟真实 AdminPageState 的无权限/单页不存在读取失败，不进入编辑工作区。"
          controls={fixtureControls}
        />
        <Alert
          type="error"
          showIcon
          title="无法编辑单页"
          description="无权限或单页不存在。真实产品会返回单页列表。"
          action={<Button icon={<ArrowLeft />} onClick={() => setScenario("ready")}>返回单页列表</Button>}
        />
      </div>
    );
  }

  const commandBar = (
    <>
      <Button
        variant="text"
        icon={<ArrowLeft />}
        onClick={() => dirty ? setExitOpen(true) : setNotice("将返回 /admin/pages（Showcase 模拟）。")}
      >
        返回单页列表
      </Button>

      <div className="flex min-w-0 flex-1 items-center gap-2 type-body-sm text-muted-foreground" role="status" aria-live="polite">
        {savedAt ? (
          <><Check className="size-4" /> 已于 {savedAt} 保存</>
        ) : dirty ? (
          "有未保存的更改"
        ) : (
          "所有更改已保存"
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <Button variant="outline" icon={<ExternalLink />} onClick={openFrontsitePreview}>
          预览前台页面
        </Button>
        {page.status !== "published" && publishIntent !== "draft" ? (
          <Button variant="outline" icon={<Save />} onClick={() => persist("draft")}>保存草稿</Button>
        ) : null}
        <Button variant="solid" color="primary" icon={<Send />} onClick={() => persist(primaryStatus)}>
          {primaryLabel}
        </Button>
      </div>
    </>
  );

  const aiToolbarActions = ({ compact }: MarkdownEditorToolbarActionsContext) => (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="small"
            variant={aiPanel === "writing" ? "solid" : "text"}
            color={aiPanel === "writing" ? "primary" : undefined}
            icon={<Sparkles />}
            aria-label="AI 写作"
            title={compact ? "AI 写作" : undefined}
            className={compact ? "size-8 px-0" : undefined}
          >
            {compact ? null : "AI 写作"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {editorSelection?.text ? (
            <>
              <DropdownMenuItem onSelect={() => openWritingAssistant("保持原意，润色当前选中的文字，提升连贯性和表达质量")}>润色所选</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openWritingAssistant("扩写当前选中的文字，补充必要背景、说明和例子")}>扩写所选</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openWritingAssistant("压缩当前选中的文字，保留核心事实和结论")}>缩写所选</DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onSelect={() => openWritingAssistant("基于单页标题和摘要撰写结构严谨的完整单页初稿")}>起草单页</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openWritingAssistant("延续当前正文继续写作，保持已有结构、语气和 Markdown 风格")}>继续写作</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openWritingAssistant("重构全文结构，减少重复，让页面信息层级更清晰")}>重构全文</DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => openWritingAssistant("")}>自定义指令…</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="small"
            variant={aiPanel === "image" ? "solid" : "text"}
            color={aiPanel === "image" ? "primary" : undefined}
            icon={<ImageIcon />}
            aria-label="插图"
            title={compact ? "插图" : undefined}
            className={compact ? "size-8 px-0" : undefined}
          >
            {compact ? null : "插图"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuItem onSelect={() => setNotice("将打开媒体库选择器（Showcase 模拟）。")}>从媒体库选择</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setNotice("将打开本地图片上传（Showcase 模拟）。")}>上传图片</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => {
            setAIPanel("image");
            setGeneratedImage(false);
          }}>AI 生成配图</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  const inspector = (
  <div className="min-w-0">
    <div className="min-h-9 border-b pb-3">
      <Text weight="semibold">属性</Text>
      <Text size="xs" tone="muted" className="mt-0.5 block">发布、页面配置、路径与 SEO。</Text>
    </div>

      <InspectorSection title="发布设置">
        <Field label="状态">
          <Select
            aria-label="状态"
            value={publishIntent}
            onChange={(value) => {
              setPublishIntent(String(value) as PageStatus);
              setDirty(true);
              setSavedAt(null);
            }}
          >
            <option value="draft">草稿</option>
            <option value="published">立即发布</option>
          </Select>
        </Field>
      </InspectorSection>

      <InspectorSection title="页面配置">
        <Field label="显示模板" hint="选择页面的预设布局结构">
          <Select
            aria-label="显示模板"
            value={page.template}
            onChange={(value) => updatePage("template", String(value) as PageTemplate)}
          >
            {(Object.keys(templateLabels) as PageTemplate[]).map((template) => (
              <option key={template} value={template}>{templateLabels[template]}</option>
            ))}
          </Select>
        </Field>
        <Field label="主导航栏联动">
          <Checkbox
            label="显示在顶部主导航栏"
            checked={page.showInNav}
            onChange={(event) => updatePage("showInNav", event.target.checked)}
          />
        </Field>
        {page.showInNav ? (
          <Field label="导航排序权重" hint="数字越小越靠前，如 10, 20">
            <Input
              aria-label="导航排序权重"
              type="number"
              value={page.sortOrder}
              onChange={(event) => updatePage("sortOrder", Number(event.target.value) || 0)}
            />
          </Field>
        ) : null}
      </InspectorSection>

      <InspectorSection
  title="路径与 SEO"
  action={(
    <Button
      type="button"
      size="small"
      variant="text"
      icon={<Sparkles />}
      aria-label="AI 优化路径与 SEO"
      title="AI 优化路径与 SEO"
      className="size-8 px-0"
      disabled={!page.title.trim() && !page.content.trim()}
      onClick={() => {
        if (metadataSuggestionsOpen) {
setMetadataSuggestionsOpen(false);
return;
        }
        setMetadataSelection(pageSeoSuggestions.map((item) => item.key));
        setMetadataSuggestionsOpen(true);
      }}
    />
  )}
>
  {metadataSuggestionsOpen ? (
    <AISuggestionReview
      aria-label="AI 路径与 SEO 建议"
      groupLabel="路径与 SEO 建议"
      description="审阅后只应用勾选的路径与 SEO 修改。"
      items={pageSeoSuggestions}
      selectedKeys={metadataSelection}
      onSelectedKeysChange={setMetadataSelection}
      onCancel={() => setMetadataSuggestionsOpen(false)}
      onRegenerate={() => {
        setMetadataSelection(pageSeoSuggestions.map((item) => item.key));
        setNotice("已重新生成 AI 路径与 SEO 建议（Showcase 模拟）。");
      }}
      onApply={applyMetadataSuggestions}
    />
  ) : null}
  <Field label="访问路径 (Slug)" required hint="访问路径为 /<slug>">
    <Input
      aria-label="访问路径 (Slug)"
      className="font-mono"
      value={page.slug}
      onChange={(event) => updatePage("slug", event.target.value)}
      placeholder="about"
    />
  </Field>
  <Field label="SEO 标题" hint={`${page.seoTitle.length}/60`}>
    <Input
      aria-label="SEO 标题"
      maxLength={60}
      value={page.seoTitle}
      onChange={(event) => updatePage("seoTitle", event.target.value)}
      placeholder="留空时默认使用标题"
    />
  </Field>
  <Field label="SEO 描述" hint={`${page.seoDescription.length}/160`}>
    <Textarea
      aria-label="SEO 描述"
      rows={4}
      maxLength={160}
      value={page.seoDescription}
      onChange={(event) => updatePage("seoDescription", event.target.value)}
      placeholder="留空时默认使用摘要"
    />
  </Field>
</InspectorSection>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route={route}
        note="PageEditor 使用统一 DocumentEditorShell + MarkdownEditor；AI 入口按字段、正文与属性作用域归位。"
        controls={fixtureControls}
      />

      <FixtureNotification notice={notice} onConsumed={() => setNotice(null)} />
      {error ? <Alert type="error" showIcon title={error} closable={{ onClose: () => setError(null) }} /> : null}

      <DocumentEditorShell
        data-pattern="dedicated-workspace-editor"
        aria-label="单页编辑器"
        header={commandBar}
        inspector={inspector}
        canvasAriaLabel="单页编辑画布"
        inspectorAriaLabel="单页元数据 Inspector"
      >
        <div className="flex min-w-0 flex-col gap-5">
  <div>
    <FieldActionHeader
      label="标题"
      required
      actionLabel="AI 生成标题候选"
      onAction={() => {
        const candidates = [...pageTitleSuggestions];
        setTitleCandidates(candidates);
        setSelectedTitleCandidate(candidates[0] ?? null);
      }}
    />
    <Field label="标题" required hideLabel>
      <Textarea
        aria-label="标题"
        rows={2}
        value={page.title}
        onChange={(event) => updatePage("title", event.target.value)}
        placeholder="写一个清晰、具体的单页标题"
      />
    </Field>
    {titleCandidates.length ? (
      <AISuggestionPicker
        className="mt-2"
        aria-label="标题 AI 建议"
        groupLabel="标题候选"
        description="选择一个候选，再统一应用到标题。"
        options={titleCandidates.map((candidate) => ({ value: candidate }))}
        value={selectedTitleCandidate}
        onValueChange={setSelectedTitleCandidate}
        onDismiss={() => {
setTitleCandidates([]);
setSelectedTitleCandidate(null);
        }}
        onRegenerate={() => {
const candidates = [...titleCandidates].reverse();
setTitleCandidates(candidates);
setSelectedTitleCandidate(candidates[0] ?? null);
setNotice("已重新生成标题候选（Showcase 模拟）。");
        }}
        onApply={(candidate) => {
updatePage("title", candidate);
setTitleCandidates([]);
setSelectedTitleCandidate(null);
        }}
      />
    ) : null}
  </div>

  <div>
    <FieldActionHeader
      label="摘要 / 描述"
      actionLabel="AI 根据正文生成摘要"
      onAction={() => {
        const candidates = [...pageSummarySuggestions];
        setSummaryCandidates(candidates);
        setSelectedSummaryCandidate(candidates[0] ?? null);
      }}
    />
    <Field label="摘要 / 描述" hint={`${page.summary.length}/300`} hideLabel>
      <Textarea
        aria-label="摘要 / 描述"
        rows={3}
        maxLength={300}
        value={page.summary}
        onChange={(event) => updatePage("summary", event.target.value)}
        placeholder="用一两句话说明单页内容"
      />
    </Field>
    {summaryCandidates.length ? (
      <AISuggestionPicker
        className="mt-2"
        aria-label="摘要 AI 建议"
        groupLabel="摘要候选"
        description="从候选摘要中选择一个，再应用到当前字段。"
        options={summaryCandidates.map((candidate) => ({ value: candidate }))}
        value={selectedSummaryCandidate}
        onValueChange={setSelectedSummaryCandidate}
        onDismiss={() => {
setSummaryCandidates([]);
setSelectedSummaryCandidate(null);
        }}
        onRegenerate={() => {
const candidates = [...summaryCandidates].reverse();
setSummaryCandidates(candidates);
setSelectedSummaryCandidate(candidates[0] ?? null);
setNotice("已重新生成摘要候选（Showcase 模拟）。");
        }}
        onApply={(candidate) => {
updatePage("summary", candidate);
setSummaryCandidates([]);
setSelectedSummaryCandidate(null);
        }}
      />
    ) : null}
  </div>

          <div>
            <div className="mb-2">
              <Text weight="medium">正文</Text>
              <Text size="xs" tone="muted" className="mt-1 block">Markdown 编辑、分屏与预览共用同一编辑器。</Text>
            </div>
            <MarkdownEditor
              ref={editorRef}
              value={page.content}
              onChange={(value) => updatePage("content", value)}
              mode={editorMode}
              onModeChange={setEditorMode}
              onSelectionChange={setEditorSelection}
              renderPreview={renderPagePreview}
              toolbarActions={aiToolbarActions}
              placeholder={"## 页面正文\n\n在此输入 Markdown 内容…"}
              textareaAriaLabel="单页正文 Markdown"
              previewAriaLabel="单页预览"
            />
          </div>

          <Modal
            open={aiPanel === "writing"}
            title="AI 写作"
            description={editorSelection?.text ? `当前作用域：已选 ${editorSelection.text.length} 个字符` : "当前作用域：正文"}
            size="lg"
            onOpenChange={(open) => {
              if (!open) {
                setAIPanel(null);
                setGeneratedContent(null);
              }
            }}
            footer={null}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 lg:flex-row">
                <Input
                  aria-label="AI 写作提示词"
                  value={writingPrompt}
                  onChange={(event) => setWritingPrompt(event.target.value)}
                  placeholder="输入写作或修改指令"
                />
                <Button
                  variant="solid"
                  color="primary"
                  disabled={!writingPrompt.trim()}
                  onClick={() => setGeneratedContent(
                    "## 我们是谁\n\n我们关注工程实践、AI 产品与开放技术。\n\n## 我们相信什么\n\n长期主义、可验证的结果，以及把复杂系统讲清楚。",
                  )}
                >
                  生成 / 执行
                </Button>
              </div>
              {generatedContent ? (
                <div className="rounded-md border bg-background p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Text weight="semibold">生成结果预览</Text>
                    <div className="flex flex-wrap gap-2">
                      {editorSelection?.text ? (
                        <Button size="small" variant="solid" color="primary" onClick={() => applyGeneratedContent("replace-selection")}>替换所选</Button>
                      ) : (
                        <Button size="small" variant="solid" color="primary" onClick={() => applyGeneratedContent("replace")}>替换全文</Button>
                      )}
                      <Button size="small" onClick={() => applyGeneratedContent("append")}>追加到末尾</Button>
                      <Button size="small" onClick={() => void copyGeneratedContent()}>复制</Button>
                      <Button size="small" variant="text" onClick={() => setGeneratedContent(null)}>放弃</Button>
                    </div>
                  </div>
                  <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap type-body-sm type-family-mono">{generatedContent}</pre>
                </div>
              ) : null}
            </div>
          </Modal>

          <Modal
            open={aiPanel === "image"}
            title="AI 配图"
            description="生成后插入当前编辑位置，不改变单页页面配置。"
            size="lg"
            onOpenChange={(open) => {
              if (!open) {
                setAIPanel(null);
                setGeneratedImage(false);
              }
            }}
            footer={null}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Button size="small" onClick={() => setImagePrompt("Modern clean editorial illustration for an About page, engineering team and open technology")}>结合页面构思</Button>
                <Button size="small" onClick={() => setImagePrompt("Isometric architecture diagram for a modern technology team About page")}>架构图解</Button>
                <Button size="small" onClick={() => setImagePrompt("Minimal editorial vector illustration for a technology team About page")}>科技插画</Button>
              </div>
              <Input
                aria-label="生图提示词"
                value={imagePrompt}
                onChange={(event) => setImagePrompt(event.target.value)}
                placeholder="输入生图提示词"
              />
              <div className="flex flex-col gap-2 lg:flex-row">
                <Input
                  aria-label="图片描述 Alt"
                  value={imageAlt}
                  onChange={(event) => setImageAlt(event.target.value)}
                  placeholder="图片描述 (Alt)"
                />
                <Button variant="solid" color="primary" disabled={!imagePrompt.trim()} onClick={() => setGeneratedImage(true)}>生成图片</Button>
              </div>
              {generatedImage ? (
                <div className="grid gap-4 rounded-md border bg-background p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                  <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed bg-muted/30 text-center type-body-sm text-muted-foreground">
                    AI 生成插图预览
                  </div>
                  <div className="flex min-w-0 flex-col gap-3">
                    <code className="overflow-x-auto rounded bg-muted px-3 py-2 type-family-mono type-caption">![{imageAlt || "单页插图"}](/media/ai-generated-page.webp)</code>
                    <div className="flex flex-wrap gap-2">
                      <Button size="small" variant="solid" color="primary" onClick={insertGeneratedImageAtCursor}>插入光标位置</Button>
                      <Button size="small" variant="text" onClick={() => setGeneratedImage(false)}>放弃</Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Modal>

        </div>
      </DocumentEditorShell>

      <Modal
        open={exitOpen}
        title="放弃未保存的更改？"
        description="离开编辑器后，尚未保存的内容会丢失。"
        onOpenChange={setExitOpen}
        footer={(
          <>
            <Button onClick={() => setExitOpen(false)}>继续编辑</Button>
            <Button color="error" variant="solid" onClick={() => {
              setExitOpen(false);
              setDirty(false);
              setNotice("已放弃更改，将返回 /admin/pages（Showcase 模拟）。");
            }}>放弃并离开</Button>
          </>
        )}
      />
    </div>
  );
}
