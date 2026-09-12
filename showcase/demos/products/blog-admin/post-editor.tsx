import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Eye,
  History,
  Image as ImageIcon,
  List,
  Save,
  Send,
  Sparkles,
} from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Field,
  Input,
  Modal,
  Segmented,
  Select,
  Skeleton,
  Tabs,
  Text,
  Textarea,
} from "../../../../src/core";
import { FixtureDock } from "../../../components/fixture-dock";

type EditorRoute = "edit" | "new" | "readonly";
type FixtureScenario = "ready" | "loading" | "error" | "conflict";
type PostStatus = "draft" | "published" | "scheduled";
type EditorMode = "markdown" | "preview";
type AIPanel = "writing" | "image" | null;

type PostFixture = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  categoryId: number | null;
  status: PostStatus;
  scheduledAt: string;
  coverUrl: string;
  coverAlt: string;
  seoTitle: string;
  seoDescription: string;
};

type VersionFixture = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

const categories = [
  { id: 1, name: "AI" },
  { id: 2, name: "后端架构" },
  { id: 3, name: "前端工程" },
];

const versions: readonly VersionFixture[] = [
  {
    id: 42,
    title: "每日 AI 资讯：Agent 工作流进入可观测阶段",
    content: "## 背景\n\n上一版重点讨论 Agent 运行记录。\n\n## 结论\n\n先把执行证据做完整，再扩大自动化范围。",
    createdAt: "2026-09-08 18:32",
  },
  {
    id: 41,
    title: "每日 AI 资讯：从生成走向治理",
    content: "## 今日变化\n\nAI 产品正在从单次生成转向长期运行治理。",
    createdAt: "2026-09-08 15:10",
  },
];

const existingPost: PostFixture = {
  id: 5,
  title: "每日 AI 资讯：Agent 工作流进入可观测阶段",
  slug: "daily-ai-agent-observability",
  summary: "从 Agent 运行记录、人工审批与自动化边界看 AI 产品如何进入可运营阶段。",
  content:
    "## 为什么现在要谈可观测性\n\n当 Agent 从一次性生成走向长期自动化，真正困难的部分不再只是模型效果，而是执行证据。\n\n## 运行记录应该回答什么\n\n每次运行至少要能回答：谁触发、用了什么输入、调用了哪些工具、哪里需要人工确认，以及最终产出了什么。\n\n### 先保留人工边界\n\n高风险写入仍需要审批，失败运行要能回看和重试。\n\n## 小结\n\n先让系统可解释、可回放，再扩大自动化范围。",
  tags: ["AI", "Agent", "可观测性"],
  categoryId: 1,
  status: "draft",
  scheduledAt: "",
  coverUrl: "/media/ai-agent-observability.webp",
  coverAlt: "AI Agent 工作流运行记录与人工审批示意图",
  seoTitle: "Agent 工作流可观测性：从运行记录到人工审批",
  seoDescription: "分析 Agent 自动化进入生产阶段后，运行证据、审批边界与失败回放为什么成为核心能力。",
};

const emptyPost: PostFixture = {
  id: 0,
  title: "",
  slug: "",
  summary: "",
  content: "",
  tags: [],
  categoryId: null,
  status: "draft",
  scheduledAt: "",
  coverUrl: "",
  coverAlt: "",
  seoTitle: "",
  seoDescription: "",
};

const routeOptions = [
  { value: "edit", label: "编辑文章" },
  { value: "new", label: "新建文章" },
  { value: "readonly", label: "只读文章" },
] as const;

const scenarioOptions = [
  { value: "ready", label: "正常" },
  { value: "loading", label: "加载中" },
  { value: "error", label: "读取失败" },
  { value: "conflict", label: "409 冲突" },
] as const;

function seedPost(route: EditorRoute): PostFixture {
  return route === "new" ? { ...emptyPost, tags: [] } : { ...existingPost, tags: [...existingPost.tags] };
}

function outlineFrom(content: string) {
  return content
    .split("\n")
    .map((line) => line.match(/^(#{1,3})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match, index) => ({
      id: `section-${index + 1}`,
      level: match[1].length,
      text: match[2],
    }));
}

function InspectorSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="border-b py-4 last:border-b-0">
      <summary className="cursor-pointer select-none text-sm font-semibold">{title}</summary>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </details>
  );
}

export function BlogAdminPostEditorDemo({
  initialRoute = "edit",
  initialScenario = "ready",
}: {
  initialRoute?: EditorRoute;
  initialScenario?: FixtureScenario;
}) {
  const [routeMode, setRouteMode] = useState<EditorRoute>(initialRoute);
  const [scenario, setScenario] = useState<FixtureScenario>(initialScenario);
  const [post, setPost] = useState<PostFixture>(() => seedPost(initialRoute));
  const [publishIntent, setPublishIntent] = useState<PostStatus>(() => seedPost(initialRoute).status);
  const [editorMode, setEditorMode] = useState<EditorMode>("markdown");
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<VersionFixture | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const [aiPanel, setAIPanel] = useState<AIPanel>(null);
  const [titleCandidates, setTitleCandidates] = useState<string[]>([]);
  const [summaryCandidate, setSummaryCandidate] = useState<string | null>(null);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [categorySuggestion, setCategorySuggestion] = useState<string | null>(null);
  const [writingPrompt, setWritingPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(false);

  const readOnly = routeMode === "readonly";
  const route = routeMode === "new" ? "/admin/posts/new" : `/admin/posts/${post.id || 5}/edit`;
  const outline = useMemo(() => outlineFrom(post.content), [post.content]);

  const resetTransientState = () => {
    setDirty(false);
    setSavedAt(null);
    setNotice(null);
    setError(null);
    setShowVersions(false);
    setRestoreTarget(null);
    setExitOpen(false);
    setAIPanel(null);
    setTitleCandidates([]);
    setSummaryCandidate(null);
    setTagSuggestions([]);
    setCategorySuggestion(null);
    setGeneratedContent(null);
    setGeneratedImage(false);
  };

  const changeRoute = (next: EditorRoute) => {
    setRouteMode(next);
    const nextPost = seedPost(next);
    setPost(nextPost);
    setPublishIntent(nextPost.status);
    setEditorMode("markdown");
    resetTransientState();
  };

  const updatePost = <K extends keyof PostFixture>(key: K, value: PostFixture[K]) => {
    if (readOnly) return;
    setPost((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setSavedAt(null);
    setError(null);
  };

  const save = (status: PostStatus) => {
    if (readOnly) return;
    if (!post.title.trim()) {
      setError("请先填写文章标题。");
      return;
    }
    if (status !== "draft" && !post.content.trim()) {
      setError("发布前需要填写正文。");
      return;
    }
    if (status === "scheduled" && !post.scheduledAt) {
      setError("定时发布需要选择发布时间。");
      return;
    }
    if (scenario === "conflict") {
      setError("内容已被其他编辑者更新（409 冲突）");
      return;
    }

    setPost((current) => ({ ...current, id: current.id || 9, status }));
    setPublishIntent(status);
    setDirty(false);
    setSavedAt("22:48");
    setError(null);
    setNotice(
      status === "published"
        ? "文章已成功发布！"
        : status === "scheduled"
          ? "文章已成功安排发布！"
          : "草稿已保存。",
    );
    if (routeMode === "new") setRouteMode("edit");
  };

  const primaryStatus: PostStatus =
    publishIntent === "scheduled" ? "scheduled" : publishIntent === "draft" ? "draft" : "published";
  const primaryLabel =
    publishIntent === "scheduled"
      ? "安排发布"
      : publishIntent === "draft"
        ? post.status === "published"
          ? "下架为草稿"
          : "保存草稿"
        : post.status === "published"
          ? "更新文章"
          : "发布";

  const fillMetadata = () => {
    updatePost("summary", "从运行证据、人工审批与失败回放三个层面解释 Agent 可观测性为什么成为生产能力。");
    setPost((current) => ({
      ...current,
      slug: "agent-workflow-observability",
      tags: [...new Set([...current.tags, "Workflow", "治理"])],
      categoryId: 1,
      coverAlt: current.coverAlt || "Agent 工作流运行证据与审批边界示意图",
      seoTitle: "Agent 工作流可观测性：运行证据、审批与失败回放",
      seoDescription: "拆解 Agent 自动化进入生产后需要保留的执行证据、人工审批边界与失败回放能力。",
    }));
    setDirty(true);
    setNotice("AI 已补全摘要、Slug、分类、标签、Alt 与 SEO（Showcase 模拟）。");
  };

  const applyGeneratedContent = (mode: "replace" | "append") => {
    if (!generatedContent) return;
    updatePost(
      "content",
      mode === "replace"
        ? generatedContent
        : post.content
          ? `${post.content.trim()}\n\n${generatedContent}`
          : generatedContent,
    );
    setGeneratedContent(null);
    setNotice(mode === "replace" ? "已替换文章正文。" : "已将生成内容追加到文末。");
  };

  const restoreVersion = () => {
    if (!restoreTarget) return;
    setPost((current) => ({ ...current, title: restoreTarget.title, content: restoreTarget.content }));
    setPublishIntent("draft");
    setDirty(false);
    setSavedAt("22:42");
    setRestoreTarget(null);
    setShowVersions(false);
    setNotice("已成功恢复历史版本。");
  };

  const fixtureControls = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Text size="sm" className="font-medium">路由状态</Text>
        <Segmented<EditorRoute>
          aria-label="PostEditor 路由状态"
          options={routeOptions}
          value={routeMode}
          onChange={changeRoute}
          block
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Text size="sm" className="font-medium">请求状态</Text>
        <Segmented<FixtureScenario>
          aria-label="PostEditor Fixture 状态"
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
          note="PostEditor 使用独立 command bar / outline / canvas / inspector 工作区；Fixture 不请求真实 Blog API。"
          controls={fixtureControls}
        />
        <Card padding="base" aria-label="文章编辑器加载中">
          <div className="flex flex-col gap-5" role="status" aria-live="polite">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-9 w-64" />
            </div>
            <div className="grid gap-5 xl:grid-cols-[13rem_minmax(0,1fr)_19rem]">
              <Skeleton className="h-72 w-full" />
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
          note="模拟真实 AdminPageState 的无权限/文章不存在读取失败，不进入编辑工作区。"
          controls={fixtureControls}
        />
        <Alert
          type="error"
          showIcon
          title="无法编辑文章"
          description="无权限或文章不存在。真实产品会保留管理端鉴权边界并返回文章列表。"
          action={<Button icon={<ArrowLeft />} onClick={() => setScenario("ready")}>返回文章列表</Button>}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route={route}
        note="保留新建/编辑/只读、保存发布、版本恢复、Markdown/预览、AI 写作/插图与元数据 Inspector；Fixture 不调用真实 Blog API。"
        controls={fixtureControls}
      />

      {notice ? (
        <Alert type="success" showIcon title={notice} closable={{ onClose: () => setNotice(null) }} />
      ) : null}
      {error ? (
        <Alert type="error" showIcon title={error} closable={{ onClose: () => setError(null) }} />
      ) : null}

      <Card padding="none" className="gap-0 overflow-clip" aria-label="文章编辑器">
        <header className="flex flex-col gap-3 border-b px-6 py-4 lg:flex-row lg:items-center">
          <Button variant="text" icon={<ArrowLeft />} onClick={() => dirty ? setExitOpen(true) : setNotice("将返回 /admin/posts（Showcase 模拟）。") }>
            返回文章列表
          </Button>

          <div className="flex min-w-0 flex-1 items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
            {readOnly ? (
              <><Eye className="size-4" /> 只读模式（他人文章）</>
            ) : savedAt ? (
              <><Check className="size-4" /> 已于 {savedAt} 保存</>
            ) : dirty ? (
              "有未保存的更改"
            ) : (
              "所有更改已保存"
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <Button
              variant="outline"
              icon={<ExternalLink />}
              onClick={() => setNotice(`将打开 /articles/${post.slug || post.id || "preview"}?preview=true（Showcase 模拟）。`)}
            >
              预览前台页面
            </Button>
            {!readOnly && post.status !== "published" && publishIntent !== "draft" ? (
              <Button variant="outline" icon={<Save />} onClick={() => save("draft")}>保存草稿</Button>
            ) : null}
            {!readOnly ? (
              <Button variant="solid" color="primary" icon={<Send />} onClick={() => save(primaryStatus)}>
                {primaryLabel}
              </Button>
            ) : null}
          </div>
        </header>

        <div className="grid min-w-0 xl:grid-cols-[13rem_minmax(0,1fr)_19rem]">
          <aside className="min-w-0 border-b p-6 xl:border-b-0 xl:border-r" aria-label="编辑器导航">
            <div className="flex items-start justify-between gap-2 xl:flex-col">
              <div className="flex flex-col gap-1">
                <Text className="font-semibold">{showVersions ? "版本历史" : "文档大纲"}</Text>
                <Text size="xs" tone="muted">{showVersions ? `${versions.length} 个历史版本` : `${outline.length} 个标题节点`}</Text>
              </div>
              <Button
                size="small"
                variant="text"
                icon={showVersions ? <List /> : <History />}
                onClick={() => setShowVersions((current) => !current)}
              >
                {showVersions ? "查看大纲" : `版本历史 (${versions.length})`}
              </Button>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              {showVersions ? (
                versions.map((version) => (
                  <button
                    key={version.id}
                    type="button"
                    className="rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                    onClick={() => setRestoreTarget(version)}
                  >
                    <span className="block font-medium">{version.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{version.createdAt} · 恢复</span>
                  </button>
                ))
              ) : outline.length ? (
                outline.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="truncate text-left text-sm text-muted-foreground hover:text-foreground"
                    style={{ paddingLeft: `${Math.max(0, item.level - 2) * 12}px` }}
                    onClick={() => setEditorMode("preview")}
                  >
                    {item.text}
                  </button>
                ))
              ) : (
                <Text size="sm" tone="muted">在正文中添加 Markdown 标题后，大纲会自动生成。</Text>
              )}
            </div>
          </aside>

          <main className="min-w-0 border-b p-6 xl:border-b-0" aria-label="文章编辑画布">
            <div className="flex min-w-0 flex-col gap-5">
              <Field label="标题" required>
                <Textarea
                  aria-label="标题"
                  rows={2}
                  value={post.title}
                  onChange={(event) => updatePost("title", event.target.value)}
                  placeholder="写一个清晰、具体的标题"
                  disabled={readOnly}
                  readOnly={readOnly}
                />
                {!readOnly ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <Button
                      size="small"
                      variant="text"
                      icon={<Sparkles />}
                      onClick={() => setTitleCandidates([
                        "Agent 工作流可观测性：从运行记录到人工审批",
                        "AI 自动化进入生产后，为什么运行证据比生成结果更重要",
                      ])}
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
                              updatePost("title", candidate);
                              setTitleCandidates([]);
                            }}
                          >
                            {candidate} <strong className="ml-1">应用</strong>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </Field>

              <Field label="摘要" hint={`${post.summary.length}/300`}>
                <Textarea
                  aria-label="摘要"
                  rows={3}
                  maxLength={300}
                  value={post.summary}
                  onChange={(event) => updatePost("summary", event.target.value)}
                  placeholder="用两三句话说明文章解决的问题"
                  disabled={readOnly}
                  readOnly={readOnly}
                />
                {!readOnly ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <Button
                      size="small"
                      variant="text"
                      icon={<Sparkles />}
                      onClick={() => setSummaryCandidate("从运行证据、人工审批和失败回放三个层面解释 Agent 自动化进入生产后的治理要求。")}
                    >
                      根据正文生成摘要
                    </Button>
                    {summaryCandidate ? (
                      <button
                        type="button"
                        className="rounded-md border px-3 py-2 text-left text-sm hover:bg-muted"
                        onClick={() => {
                          updatePost("summary", summaryCandidate);
                          setSummaryCandidate(null);
                        }}
                      >
                        {summaryCandidate} <strong className="ml-1">应用</strong>
                      </button>
                    ) : null}
                  </div>
                ) : null}
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
                {!readOnly ? (
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
                ) : null}
              </div>

              {aiPanel === "writing" ? (
                <Card variant="subtle" padding="base" aria-label="AI 写作与润色">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      <Button size="small" onClick={() => setWritingPrompt("基于标题和摘要撰写结构严谨的完整文章初稿")}>✍️ 一键起草初稿</Button>
                      <Button size="small" onClick={() => setWritingPrompt("保持原意，优化段落连贯性、语言流畅度与 Markdown 排版")}>✨ 润色与排版</Button>
                      <Button size="small" onClick={() => setWritingPrompt("扩写正文，补充背景、技术细节与实践案例")}>➕ 扩充细节</Button>
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
                          "## 生产化之后的新问题\n\nAgent 自动化扩大后，团队首先需要的不是更多按钮，而是能解释每一步执行证据。\n\n## 三个治理抓手\n\n1. 记录输入与工具调用。\n2. 高风险写入保留人工审批。\n3. 失败运行可以回放与重试。",
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
                      <Button size="small" icon={<Sparkles />} onClick={() => setImagePrompt("Clean editorial illustration of an AI agent workflow with evidence timeline and human approval checkpoint")}>结合文章智能构思画面</Button>
                      <Button size="small" onClick={() => setImagePrompt("Isometric architecture diagram of AI workflow components and approval gates")}>📊 架构图解风</Button>
                      <Button size="small" onClick={() => setImagePrompt("Minimal editorial vector illustration about AI workflow governance")}>🖼️ 科技插画风</Button>
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
                          <code className="overflow-x-auto rounded bg-muted px-3 py-2 text-xs">![{imageAlt || "文章插图"}](/media/ai-generated-agent-workflow.webp)</code>
                          <div className="flex flex-wrap gap-2">
                            <Button size="small" variant="solid" color="primary" onClick={() => setNotice("Markdown 图片代码已复制（Showcase 模拟）。")}>复制 Markdown</Button>
                            <Button size="small" onClick={() => updatePost("content", `${post.content.trimEnd()}\n\n![${imageAlt || "文章插图"}](/media/ai-generated-agent-workflow.webp)\n`)}>插入到正文末尾</Button>
                            <Button size="small" onClick={() => {
                              updatePost("coverUrl", "/media/ai-generated-agent-workflow.webp");
                              updatePost("coverAlt", imageAlt || "文章插图");
                            }}>设为文章封面</Button>
                            <Button size="small" variant="text" onClick={() => setGeneratedImage(false)}>放弃</Button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Card>
              ) : null}

              {editorMode === "preview" ? (
                <div className="min-w-0 rounded-md border bg-background p-6" aria-label="文章预览">
                  <h2 className="text-xl font-semibold">为什么现在要谈可观测性</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    当 Agent 从一次性生成走向长期自动化，真正困难的部分不再只是模型效果，而是执行证据。
                  </p>
                  <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 text-xs">workflow.run({`{ evidence: true, approval: "required" }`})</pre>
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-[34rem] text-sm">
                      <thead><tr className="border-b"><th className="px-3 py-2 text-left">阶段</th><th className="px-3 py-2 text-left">证据</th></tr></thead>
                      <tbody><tr><td className="px-3 py-2">Tool call</td><td className="px-3 py-2">输入、输出、耗时、错误</td></tr></tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <Textarea
                  aria-label="文章正文 Markdown"
                  className="min-h-[28rem] font-mono"
                  value={post.content}
                  onChange={(event) => updatePost("content", event.target.value)}
                  placeholder={"## 从问题开始\n\n写下背景、约束、判断与实现…"}
                  disabled={readOnly}
                  readOnly={readOnly}
                />
              )}
            </div>
          </main>

          <aside className="min-w-0 p-6 xl:border-l" aria-label="文章元数据 Inspector">
            <fieldset disabled={readOnly} className="min-w-0 border-0 p-0">
              {!readOnly ? (
                <Button
                  className="w-full"
                  variant="solid"
                  color="primary"
                  icon={<Sparkles />}
                  onClick={fillMetadata}
                  disabled={!post.title.trim() && !post.content.trim()}
                >
                  AI 一键补全元数据
                </Button>
              ) : null}

              <InspectorSection title="发布设置">
                <Field label="状态">
                  <Select
                    aria-label="状态"
                    value={publishIntent}
                    onChange={(value) => {
                      setPublishIntent(String(value) as PostStatus);
                      setDirty(true);
                      setSavedAt(null);
                    }}
                  >
                    <option value="draft">草稿</option>
                    <option value="published">立即发布</option>
                    <option value="scheduled">定时发布</option>
                  </Select>
                </Field>
                {publishIntent === "scheduled" ? (
                  <Field label="发布时间">
                    <Input
                      aria-label="发布时间"
                      type="datetime-local"
                      value={post.scheduledAt}
                      onChange={(event) => updatePost("scheduledAt", event.target.value)}
                    />
                  </Field>
                ) : null}
              </InspectorSection>

              <InspectorSection title="分类与标签">
                <Field label="分类">
                  <Select
                    aria-label="分类"
                    value={post.categoryId === null ? "" : String(post.categoryId)}
                    onChange={(value) => updatePost("categoryId", value ? Number(value) : null)}
                  >
                    <option value="">未分类</option>
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </Select>
                  <div className="mt-2">
                    {categorySuggestion ? (
                      <Button size="small" variant="text" icon={<Sparkles />} onClick={() => {
                        const match = categories.find((category) => category.name === categorySuggestion);
                        if (match) updatePost("categoryId", match.id);
                        setCategorySuggestion(null);
                      }}>
                        推荐: {categorySuggestion}（点击应用）
                      </Button>
                    ) : (
                      <Button size="small" variant="text" icon={<Sparkles />} onClick={() => setCategorySuggestion("AI")}>推荐最佳分类</Button>
                    )}
                  </div>
                </Field>
                <Field label="标签" hint="使用逗号分隔。">
                  <Input
                    aria-label="标签"
                    value={post.tags.join(", ")}
                    onChange={(event) => updatePost("tags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))}
                    placeholder="Go, OIDC, 安全"
                  />
                  <div className="mt-2 flex flex-col gap-2">
                    <Button size="small" variant="text" icon={<Sparkles />} onClick={() => setTagSuggestions(["Workflow", "治理", "可观测性"])}>提取推荐标签</Button>
                    {tagSuggestions.length ? (
                      <div className="flex flex-wrap gap-1.5" aria-label="推荐标签">
                        {tagSuggestions.map((tag) => {
                          const added = post.tags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              className="rounded-full border px-2 py-1 text-xs disabled:opacity-50"
                              disabled={added}
                              onClick={() => updatePost("tags", [...post.tags, tag])}
                            >
                              {added ? "✓" : "+"} {tag}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </Field>
              </InspectorSection>

              <InspectorSection title="封面与摘要">
                <Field label="封面 URL">
                  <Input aria-label="封面 URL" value={post.coverUrl} onChange={(event) => updatePost("coverUrl", event.target.value)} placeholder="/media/cover.webp" />
                </Field>
                <Field label="替代文本">
                  <Input aria-label="替代文本" value={post.coverAlt} onChange={(event) => updatePost("coverAlt", event.target.value)} placeholder="描述封面图场景与主题" />
                </Field>
              </InspectorSection>

              <InspectorSection title="路径与 SEO">
                <Button size="small" variant="text" icon={<Sparkles />} onClick={() => {
                  updatePost("slug", "agent-workflow-observability");
                  setPost((current) => ({
                    ...current,
                    seoTitle: "Agent 工作流可观测性：运行证据、审批与失败回放",
                    seoDescription: "拆解 Agent 自动化进入生产后需要保留的执行证据、审批边界与失败回放能力。",
                  }));
                  setDirty(true);
                }}>
                  智能生成整套 SEO 配置
                </Button>
                <Field label="访问路径 (Slug)" required hint="访问路径为 /articles/<slug>">
                  <Input aria-label="访问路径 (Slug)" className="font-mono" value={post.slug} onChange={(event) => updatePost("slug", event.target.value)} />
                </Field>
                <Field label="SEO 标题" hint={`${post.seoTitle.length}/60`}>
                  <Input aria-label="SEO 标题" maxLength={60} value={post.seoTitle} onChange={(event) => updatePost("seoTitle", event.target.value)} placeholder="留空时默认使用标题" />
                </Field>
                <Field label="SEO 描述" hint={`${post.seoDescription.length}/160`}>
                  <Textarea aria-label="SEO 描述" rows={4} maxLength={160} value={post.seoDescription} onChange={(event) => updatePost("seoDescription", event.target.value)} placeholder="留空时默认使用摘要" />
                </Field>
              </InspectorSection>
            </fieldset>
          </aside>
        </div>
      </Card>

      <Modal
        open={restoreTarget !== null}
        title="恢复历史版本"
        description={restoreTarget ? `恢复 ${restoreTarget.createdAt} 的版本？当前内容会先保留为历史版本。` : ""}
        onOpenChange={(open) => { if (!open) setRestoreTarget(null); }}
        footer={(
          <>
            <Button onClick={() => setRestoreTarget(null)}>取消</Button>
            <Button variant="solid" color="primary" onClick={restoreVersion}>恢复版本</Button>
          </>
        )}
      />

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
              setNotice("已放弃更改，将返回 /admin/posts（Showcase 模拟）。");
            }}>放弃并离开</Button>
          </>
        )}
      />
    </div>
  );
}