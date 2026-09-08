import { useState, type ReactNode } from "react";
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
  Field,
  Input,
  Modal,
  Segmented,
  Select,
  Skeleton,
  Tabs,
  Text,
  Textarea,
} from "../../../src/core";
import { FixtureDock } from "../../components/fixture-dock";

type EditorRoute = "edit" | "new";
type FixtureScenario = "ready" | "loading" | "error" | "conflict";
type PageStatus = "draft" | "published";
type EditorMode = "markdown" | "preview";
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

function InspectorSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="border-b py-4 last:border-b-0">
      <summary className="cursor-pointer select-none text-sm font-semibold">{title}</summary>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </details>
  );
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
  const [editorMode, setEditorMode] = useState<EditorMode>("markdown");
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const [aiPanel, setAIPanel] = useState<AIPanel>(null);
  const [titleCandidates, setTitleCandidates] = useState<string[]>([]);
  const [summaryCandidates, setSummaryCandidates] = useState<string[]>([]);
  const [slugCandidates, setSlugCandidates] = useState<string[]>([]);
  const [writingPrompt, setWritingPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(false);

  const route = routeMode === "new" ? "/admin/pages/new" : `/admin/pages/${page.id || 3}/edit`;

  const resetTransientState = () => {
    setEditorMode("markdown");
    setDirty(false);
    setSavedAt(null);
    setNotice(null);
    setError(null);
    setExitOpen(false);
    setAIPanel(null);
    setTitleCandidates([]);
    setSummaryCandidates([]);
    setSlugCandidates([]);
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

  const fillMetadata = () => {
    if (!page.title.trim() && !page.content.trim()) {
      setError("请先填写标题或正文，AI 才能提炼全套元数据。");
      return;
    }
    setPage((current) => ({
      ...current,
      summary: current.summary || "介绍团队背景、技术方向、长期目标与联系入口。",
      slug: current.slug || "about-us",
      seoTitle: current.seoTitle || "关于我们 - 深度技术博客",
      seoDescription: current.seoDescription || "了解团队背景、技术方向、长期愿景与开放技术实践。",
    }));
    setDirty(true);
    setSavedAt(null);
    setNotice("AI 已补全摘要、Slug 与 SEO（Showcase 模拟）。");
  };

  const fillSeo = () => {
    if (!page.title.trim() && !page.content.trim()) {
      setError("请先填写标题或正文，以便 AI 分析生成 SEO。");
      return;
    }
    setPage((current) => ({
      ...current,
      slug: current.slug || "about-us",
      seoTitle: "关于我们：团队、技术方向与长期愿景",
      seoDescription: "介绍团队背景、技术栈、开放技术实践与长期目标。",
    }));
    setDirty(true);
    setSavedAt(null);
    setNotice("SEO 标题、描述与 Slug 已自动生成！");
  };

  const applyGeneratedContent = (mode: "replace" | "append") => {
    if (!generatedContent) return;
    updatePage(
      "content",
      mode === "replace"
        ? generatedContent
        : page.content
          ? `${page.content.trim()}\n\n${generatedContent}`
          : generatedContent,
    );
    setGeneratedContent(null);
    setNotice(mode === "replace" ? "已替换单页正文。" : "已将生成内容追加到单页正文末尾。");
  };

  const fixtureControls = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Text size="sm" className="font-medium">路由状态</Text>
        <Segmented<EditorRoute>
          aria-label="PageEditor 路由状态"
          options={routeOptions}
          value={routeMode}
          onChange={changeRoute}
          block
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Text size="sm" className="font-medium">请求状态</Text>
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
          note="PageEditor 使用 command bar / canvas / inspector 两列工作区；Fixture 不请求真实 Blog API。"
          controls={fixtureControls}
        />
        <Card padding="base" aria-label="单页编辑器加载中">
          <div className="flex flex-col gap-5" role="status" aria-live="polite">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-9 w-64" />
            </div>
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
              <Skeleton className="h-[34rem] w-full" />
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

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route={route}
        note="保留新建/编辑、保存发布、预览前持久化、Markdown/预览、模板/导航/排序、AI 写作/插图与 SEO Inspector；Fixture 不调用真实 Blog API。"
        controls={fixtureControls}
      />

      {notice ? <Alert type="success" showIcon title={notice} closable={{ onClose: () => setNotice(null) }} /> : null}
      {error ? <Alert type="error" showIcon title={error} closable={{ onClose: () => setError(null) }} /> : null}

      <Card padding="none" className="gap-0 overflow-clip shadow-sm" aria-label="单页编辑器">
        <header className="flex flex-col gap-3 border-b px-6 py-4 lg:flex-row lg:items-center">
          <Button
            variant="text"
            icon={<ArrowLeft />}
            onClick={() => dirty ? setExitOpen(true) : setNotice("将返回 /admin/pages（Showcase 模拟）。")}
          >
            返回单页列表
          </Button>

          <div className="flex min-w-0 flex-1 items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
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
        </header>

        <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_19rem]">
          <main className="min-w-0 border-b p-6 xl:border-b-0" aria-label="单页编辑画布">
            <div className="flex min-w-0 flex-col gap-5">
              <Field label="标题" required>
                <Textarea
                  aria-label="标题"
                  rows={2}
                  value={page.title}
                  onChange={(event) => updatePage("title", event.target.value)}
                  placeholder="写一个清晰、具体的单页标题"
                />
                <div className="mt-2 flex flex-col gap-2">
                  <Button
                    size="small"
                    variant="text"
                    icon={<Sparkles />}
                    onClick={() => setTitleCandidates(["关于我们：技术、产品与长期主义", "认识我们：从工程实践到开放技术"])}
                  >
                    生成标题候选
                  </Button>
                  {titleCandidates.length ? (
                    <div className="flex flex-col gap-2" aria-label="标题候选">
                      {titleCandidates.map((candidate) => (
                        <button
                          key={candidate}
                          type="button"
                          className="rounded-md border px-3 py-2 text-left text-sm hover:bg-muted"
                          onClick={() => {
                            updatePage("title", candidate);
                            setTitleCandidates([]);
                          }}
                        >
                          {candidate} <strong className="ml-1">应用</strong>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Field>

              <Field label="摘要 / 描述" hint={`${page.summary.length}/300`}>
                <Textarea
                  aria-label="摘要 / 描述"
                  rows={3}
                  maxLength={300}
                  value={page.summary}
                  onChange={(event) => updatePage("summary", event.target.value)}
                  placeholder="用一两句话说明单页内容"
                />
                <div className="mt-2 flex flex-col gap-2">
                  <Button
                    size="small"
                    variant="text"
                    icon={<Sparkles />}
                    onClick={() => setSummaryCandidates(["介绍团队背景、技术方向、产品理念与长期目标。"])}
                  >
                    根据正文生成摘要
                  </Button>
                  {summaryCandidates.length ? (
                    <div className="flex flex-col gap-2" aria-label="摘要候选">
                      {summaryCandidates.map((candidate) => (
                        <button
                          key={candidate}
                          type="button"
                          className="rounded-md border px-3 py-2 text-left text-sm hover:bg-muted"
                          onClick={() => {
                            updatePage("summary", candidate);
                            setSummaryCandidates([]);
                          }}
                        >
                          {candidate} <strong className="ml-1">应用</strong>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Field>

              <div className="flex flex-col gap-3 border-b pb-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0 flex-1">
                  <Tabs<EditorMode>
                    ariaLabel="编辑模式"
                    activeKey={editorMode}
                    onChange={setEditorMode}
                    items={[
                      { key: "markdown", label: "Markdown" },
                      { key: "preview", label: "预览" },
                    ]}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="small"
                    variant={aiPanel === "writing" ? "solid" : "text"}
                    color={aiPanel === "writing" ? "primary" : undefined}
                    icon={<Sparkles />}
                    onClick={() => setAIPanel((current) => current === "writing" ? null : "writing")}
                  >
                    {aiPanel === "writing" ? "收起 AI 写作" : "AI 写作与润色"}
                  </Button>
                  <Button
                    size="small"
                    variant={aiPanel === "image" ? "solid" : "text"}
                    color={aiPanel === "image" ? "primary" : undefined}
                    icon={<ImageIcon />}
                    onClick={() => setAIPanel((current) => current === "image" ? null : "image")}
                  >
                    {aiPanel === "image" ? "收起 AI 插图" : "AI 文生图插画"}
                  </Button>
                </div>
              </div>

              {aiPanel === "writing" ? (
                <Card variant="subtle" padding="base" aria-label="AI 写作与润色">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      <Button size="small" onClick={() => setWritingPrompt("基于单页标题和摘要撰写结构严谨的完整单页初稿")}>📄 一键起草单页初稿</Button>
                      <Button size="small" onClick={() => setWritingPrompt("保持原意，优化段落连贯性、语言流畅度与 Markdown 排版")}>✨ 润色与排版</Button>
                      <Button size="small" onClick={() => setWritingPrompt("扩写单页，补充背景、服务介绍与案例")}>➕ 扩充内容细节</Button>
                    </div>
                    <div className="flex flex-col gap-2 lg:flex-row">
                      <Input
                        aria-label="AI 写作提示词"
                        value={writingPrompt}
                        onChange={(event) => setWritingPrompt(event.target.value)}
                        placeholder="输入写作或修改提示词"
                      />
                      <Button
                        variant="solid"
                        color="primary"
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
                          <Text className="font-semibold">生成结果预览</Text>
                          <div className="flex flex-wrap gap-2">
                            <Button size="small" variant="solid" color="primary" onClick={() => applyGeneratedContent("replace")}>替换全文</Button>
                            <Button size="small" onClick={() => applyGeneratedContent("append")}>追加到末尾</Button>
                            <Button size="small" variant="text" onClick={() => setGeneratedContent(null)}>放弃</Button>
                          </div>
                        </div>
                        <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-sm">{generatedContent}</pre>
                      </div>
                    ) : null}
                  </div>
                </Card>
              ) : null}

              {aiPanel === "image" ? (
                <Card variant="subtle" padding="base" aria-label="AI 文生图插画">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      <Button size="small" icon={<Sparkles />} onClick={() => setImagePrompt("Modern clean editorial illustration for an About page, engineering team and open technology")}>结合页面智能构思画面</Button>
                      <Button size="small" onClick={() => setImagePrompt("Isometric architecture diagram for a modern technology team About page")}>📊 架构图解风</Button>
                      <Button size="small" onClick={() => setImagePrompt("Minimal editorial vector illustration for a technology team About page")}>🖼️ 科技插画风</Button>
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
                      <Button variant="solid" color="primary" onClick={() => setGeneratedImage(true)}>开始生图</Button>
                    </div>
                    {generatedImage ? (
                      <div className="grid gap-4 rounded-md border bg-background p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                        <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed bg-muted/30 text-center text-sm text-muted-foreground">
                          AI 生成插图预览
                        </div>
                        <div className="flex min-w-0 flex-col gap-3">
                          <code className="overflow-x-auto rounded bg-muted px-3 py-2 text-xs">![{imageAlt || "单页插图"}](/media/ai-generated-page.webp)</code>
                          <div className="flex flex-wrap gap-2">
                            <Button size="small" variant="solid" color="primary" onClick={() => setNotice("Markdown 图片代码已复制（Showcase 模拟）。")}>复制 Markdown</Button>
                            <Button size="small" onClick={() => updatePage("content", `${page.content.trimEnd()}\n\n![${imageAlt || "单页插图"}](/media/ai-generated-page.webp)\n`)}>插入到正文末尾</Button>
                            <Button size="small" variant="text" onClick={() => setGeneratedImage(false)}>放弃</Button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Card>
              ) : null}

              {editorMode === "preview" ? (
                <div className="min-w-0 rounded-md border bg-background p-6" aria-label="单页预览">
                  <h2 className="text-xl font-semibold">{page.title || "单页标题"}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{page.summary || "开始写作后，预览会出现在这里。"}</p>
                  <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 text-xs">{page.content || "## 页面正文"}</pre>
                </div>
              ) : (
                <Textarea
                  aria-label="单页正文 Markdown"
                  className="min-h-[28rem] font-mono"
                  value={page.content}
                  onChange={(event) => updatePage("content", event.target.value)}
                  placeholder={"## 页面正文\n\n在此输入 Markdown 内容…"}
                />
              )}
            </div>
          </main>

          <aside className="min-w-0 p-6 xl:border-l" aria-label="单页元数据 Inspector">
            <Button
              className="w-full"
              variant="solid"
              color="primary"
              icon={<Sparkles />}
              onClick={fillMetadata}
              disabled={!page.title.trim() && !page.content.trim()}
            >
              AI 一键补全元数据
            </Button>

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

            <InspectorSection title="路径与 SEO">
              <Button size="small" variant="text" icon={<Sparkles />} onClick={fillSeo}>
                智能生成整套 SEO 配置
              </Button>
              <Field label="访问路径 (Slug)" required hint="访问路径为 /<slug>">
                <Input
                  aria-label="访问路径 (Slug)"
                  className="font-mono"
                  value={page.slug}
                  onChange={(event) => updatePage("slug", event.target.value)}
                  placeholder="about"
                />
                <div className="mt-2 flex flex-col gap-2">
                  <Button
                    size="small"
                    variant="text"
                    icon={<Sparkles />}
                    onClick={() => setSlugCandidates(["about-us", "team-and-vision"])}
                  >
                    生成 Slug 候选
                  </Button>
                  {slugCandidates.length ? (
                    <div className="flex flex-col gap-2" aria-label="Slug 候选">
                      {slugCandidates.map((candidate) => (
                        <button
                          key={candidate}
                          type="button"
                          className="rounded-md border px-3 py-2 text-left font-mono text-sm hover:bg-muted"
                          onClick={() => {
                            updatePage("slug", candidate);
                            setSlugCandidates([]);
                          }}
                        >
                          {candidate} <strong className="ml-1 font-sans">应用</strong>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
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
          </aside>
        </div>
      </Card>

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
