from pathlib import Path

root = Path('.')


def replace_once(path: str, old: str, new: str) -> None:
    file = root / path
    text = file.read_text()
    if new in text:
        return
    if old not in text:
        raise SystemExit(f'missing replacement anchor in {path}: {old[:120]!r}')
    file.write_text(text.replace(old, new, 1))


def write(path: str, content: str) -> None:
    file = root / path
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(content)


write('showcase/demos/patterns/examples/ai-suggestion-picker.tsx', '''import { useState } from "react";
import { Button, Field, Input, Text } from "../../../../src/core";
import { AISuggestionPicker, type AISuggestionOption } from "../../../../src/patterns";

const primaryOptions: readonly AISuggestionOption[] = [
  {
    value: "Agent 工作流可观测性：从运行记录到人工审批",
    description: "强调生产化后的运行证据与审批边界。",
  },
  {
    value: "AI 自动化进入生产后，为什么运行证据比生成结果更重要",
    description: "更偏观点型标题，突出生产治理判断。",
  },
  {
    value: "从生成到治理：Agent 自动化真正缺的是什么",
    description: "更短、更适合首页卡片与社交分享。",
  },
];

export default function AISuggestionPickerExample() {
  const [options, setOptions] = useState<readonly AISuggestionOption[]>(primaryOptions);
  const [value, setValue] = useState<string | null>(primaryOptions[0]?.value ?? null);
  const [applied, setApplied] = useState("每日 AI 资讯：Agent 工作流进入可观测阶段");
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/10">
        <Button
          onClick={() => {
            setOptions(primaryOptions);
            setValue(primaryOptions[0]?.value ?? null);
            setVisible(true);
          }}
        >
          重新打开 AI 建议
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Field label="当前标题">
        <Input aria-label="当前标题" value={applied} readOnly />
      </Field>

      <AISuggestionPicker
        aria-label="标题 AI 建议"
        heading="标题候选"
        description="候选结果先选择，再通过一个明确动作写回业务字段。"
        groupLabel="标题候选列表"
        options={options}
        value={value}
        onValueChange={setValue}
        onDismiss={() => setVisible(false)}
        onRegenerate={() => {
          const regenerated = [...primaryOptions].reverse();
          setOptions(regenerated);
          setValue(regenerated[0]?.value ?? null);
        }}
        onApply={(next) => setApplied(next)}
      />

      <Text size="xs" tone="muted">
        Pattern 只拥有候选选择与确认语义；模型调用、字段写入和业务校验仍由消费者负责。
      </Text>
    </div>
  );
}
''')

write('showcase/demos/patterns/ai-suggestion-picker.tsx', '''import { Heading, Tag, Text } from "../../../src/core";
import { ApiTable, type ApiRow } from "../../components/api-table";
import { DemoSection } from "../../components/demo-section";
import { canonicalExampleSource } from "../shared/example-source";
import AISuggestionPickerExample from "./examples/ai-suggestion-picker";
import AISuggestionPickerExampleSource from "./examples/ai-suggestion-picker.tsx?raw";

const propsApi: ApiRow[] = [
  { name: "options", type: "readonly AISuggestionOption[]", description: "候选结果列表。Pattern 不负责生成这些内容。" },
  { name: "value", type: "string | null", description: "当前选中的候选值。" },
  { name: "onValueChange", type: "(value: string) => void", description: "用户切换候选时触发。" },
  { name: "onApply", type: "(value: string) => void", description: "点击统一确认动作时触发，由消费者决定如何写回业务字段。" },
  { name: "heading", type: "ReactNode", description: "建议区标题。", defaultValue: '\"AI 建议\"' },
  { name: "description", type: "ReactNode", description: "建议区辅助说明；不传时显示候选数量。" },
  { name: "groupLabel", type: "string", description: "RadioGroup accessible name。", defaultValue: '\"AI 建议候选\"' },
  { name: "onDismiss", type: "() => void", description: "可选取消 / 关闭入口。" },
  { name: "onRegenerate", type: "() => void", description: "可选重新生成入口；生成逻辑仍由消费者拥有。" },
  { name: "applyLabel", type: "string", description: "统一确认动作文案。", defaultValue: '\"使用所选\"' },
  { name: "className", type: "string", description: "扩展 Pattern 外层 surface。" },
];

const optionApi: ApiRow[] = [
  { name: "value", type: "string", description: "候选的主文本，同时作为选择值。" },
  { name: "description", type: "ReactNode", description: "可选候选解释或差异说明。" },
  { name: "monospace", type: "boolean", description: "路径、代码等机器可读候选使用等宽展示。", defaultValue: "false" },
];

export function PatternAISuggestionPickerDemo() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Pattern · @gouno/ui/patterns
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>AISuggestionPicker AI 候选选择器</Heading>
          <Tag color="success">Admitted</Tag>
        </div>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          用于“一个业务字段对应多个互斥 AI 候选”的场景。Pattern 提供真实 Radio 选择、重新生成、取消与一个明确的确认动作；它不拥有模型、Prompt、持久化或字段校验。
        </Text>
      </header>

      <DemoSection
        title="候选选择后统一应用"
        description="Preview 与 Code 使用同一份示例源码。选择候选只改变选中态，只有点击“使用所选”才把结果写回示例字段。"
        code={canonicalExampleSource(AISuggestionPickerExampleSource)}
      >
        <AISuggestionPickerExample />
      </DemoSection>

      <section className="space-y-4">
        <Heading level={3}>Props API</Heading>
        <ApiTable rows={propsApi} />
      </section>

      <section className="space-y-4">
        <Heading level={3}>AISuggestionOption</Heading>
        <ApiTable rows={optionApi} />
      </section>
    </div>
  );
}
''')

write('showcase/demos/patterns/examples/ai-suggestion-review.tsx', '''import { useMemo, useState } from "react";
import { Text } from "../../../../src/core";
import { AISuggestionReview, type AISuggestionReviewItem } from "../../../../src/patterns";

const suggestions: readonly AISuggestionReviewItem[] = [
  { key: "slug", label: "Slug", value: "agent-workflow-observability", monospace: true },
  { key: "seo-title", label: "SEO 标题", value: "Agent 工作流可观测性：运行证据、审批与失败回放" },
  { key: "seo-description", label: "SEO 描述", value: "拆解 Agent 自动化进入生产后需要保留的执行证据、人工审批边界与失败回放能力。" },
];

export default function AISuggestionReviewExample() {
  const [selectedKeys, setSelectedKeys] = useState(suggestions.map((item) => item.key));
  const [appliedKeys, setAppliedKeys] = useState<string[]>([]);

  const appliedLabel = useMemo(
    () => appliedKeys.length ? `最近应用：${appliedKeys.join("、")}` : "尚未应用建议",
    [appliedKeys],
  );

  return (
    <div className="flex flex-col gap-4">
      <AISuggestionReview
        aria-label="路径与 SEO AI 建议"
        heading="路径与 SEO 建议"
        description="可以取消任意一项，再一次性应用剩余修改。"
        groupLabel="路径与 SEO 建议列表"
        items={suggestions}
        selectedKeys={selectedKeys}
        onSelectedKeysChange={setSelectedKeys}
        onCancel={() => setSelectedKeys([])}
        onRegenerate={() => setSelectedKeys(suggestions.map((item) => item.key))}
        onApply={() => setAppliedKeys(selectedKeys)}
      />
      <Text size="xs" tone="muted">{appliedLabel}</Text>
    </div>
  );
}
''')

write('showcase/demos/patterns/ai-suggestion-review.tsx', '''import { Heading, Tag, Text } from "../../../src/core";
import { ApiTable, type ApiRow } from "../../components/api-table";
import { DemoSection } from "../../components/demo-section";
import { canonicalExampleSource } from "../shared/example-source";
import AISuggestionReviewExample from "./examples/ai-suggestion-review";
import AISuggestionReviewExampleSource from "./examples/ai-suggestion-review.tsx?raw";

const propsApi: ApiRow[] = [
  { name: "items", type: "readonly AISuggestionReviewItem[]", description: "需要用户审阅的一组关联字段修改。" },
  { name: "selectedKeys", type: "readonly string[]", description: "当前准备应用的建议 key。" },
  { name: "onSelectedKeysChange", type: "(keys: string[]) => void", description: "勾选状态变化回调。" },
  { name: "onApply", type: "() => void", description: "点击“应用 N 项建议”时触发；实际写回由消费者负责。" },
  { name: "heading", type: "ReactNode", description: "建议区标题。", defaultValue: '\"AI 建议\"' },
  { name: "description", type: "ReactNode", description: "审阅说明；不传时显示已选择数量。" },
  { name: "groupLabel", type: "string", description: "建议列表 accessible name。", defaultValue: '\"AI 建议选择\"' },
  { name: "onCancel", type: "() => void", description: "可选取消入口。" },
  { name: "onRegenerate", type: "() => void", description: "可选重新生成入口；Pattern 不负责生成逻辑。" },
  { name: "className", type: "string", description: "扩展 Pattern 外层 surface。" },
];

const itemApi: ApiRow[] = [
  { name: "key", type: "string", description: "稳定建议标识，用于 selectedKeys。" },
  { name: "label", type: "string", description: "字段或修改项标签。" },
  { name: "value", type: "ReactNode", description: "建议的新值或修改摘要。" },
  { name: "monospace", type: "boolean", description: "路径、代码等机器可读内容使用等宽展示。", defaultValue: "false" },
];

export function PatternAISuggestionReviewDemo() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Pattern · @gouno/ui/patterns
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>AISuggestionReview AI 建议审阅器</Heading>
          <Tag color="success">Admitted</Tag>
        </div>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          用于“一次 AI 操作会修改多个相关字段”的场景。Pattern 用 Checkbox 明确哪些修改将被采用，并把提交收敛到一个“应用 N 项建议”动作，避免静默覆盖。
        </Text>
      </header>

      <DemoSection
        title="多字段建议先审阅再提交"
        description="Preview 与 Code 使用同一份示例源码。取消某些建议后，确认动作会实时反映最终应用数量。"
        code={canonicalExampleSource(AISuggestionReviewExampleSource)}
      >
        <AISuggestionReviewExample />
      </DemoSection>

      <section className="space-y-4">
        <Heading level={3}>Props API</Heading>
        <ApiTable rows={propsApi} />
      </section>

      <section className="space-y-4">
        <Heading level={3}>AISuggestionReviewItem</Heading>
        <ApiTable rows={itemApi} />
      </section>
    </div>
  );
}
''')

replace_once(
    'showcase/app/page-router.tsx',
    '''const PatternBulkActionBarDemo = lazy(() =>
  import("../demos/patterns/bulk-action-bar").then((module) => ({ default: module.PatternBulkActionBarDemo })),
);
const PatternMarkdownEditorDemo = lazy(() =>''',
    '''const PatternBulkActionBarDemo = lazy(() =>
  import("../demos/patterns/bulk-action-bar").then((module) => ({ default: module.PatternBulkActionBarDemo })),
);
const PatternAISuggestionPickerDemo = lazy(() =>
  import("../demos/patterns/ai-suggestion-picker").then((module) => ({ default: module.PatternAISuggestionPickerDemo })),
);
const PatternAISuggestionReviewDemo = lazy(() =>
  import("../demos/patterns/ai-suggestion-review").then((module) => ({ default: module.PatternAISuggestionReviewDemo })),
);
const PatternMarkdownEditorDemo = lazy(() =>''',
)
replace_once(
    'showcase/app/page-router.tsx',
    '''    case "pattern-bulk-action-bar":
      return <Suspense fallback={loading}><PatternBulkActionBarDemo /></Suspense>;
    case "pattern-markdown-editor":''',
    '''    case "pattern-bulk-action-bar":
      return <Suspense fallback={loading}><PatternBulkActionBarDemo /></Suspense>;
    case "pattern-ai-suggestion-picker":
      return <Suspense fallback={loading}><PatternAISuggestionPickerDemo /></Suspense>;
    case "pattern-ai-suggestion-review":
      return <Suspense fallback={loading}><PatternAISuggestionReviewDemo /></Suspense>;
    case "pattern-markdown-editor":''',
)

replace_once(
    'showcase/catalog/index.tsx',
    '''  Stamp,
  Star,
  StretchHorizontal,''',
    '''  Stamp,
  Sparkles,
  Star,
  StretchHorizontal,''',
)
replace_once(
    'showcase/catalog/index.tsx',
    '''    item("pattern-bulk-action-bar", "BulkActionBar", "批量操作栏", 100, <ListChecks />),
    item("pattern-markdown-editor", "MarkdownEditor", "Markdown 编辑器", 100, <FileText />),''',
    '''    item("pattern-bulk-action-bar", "BulkActionBar", "批量操作栏", 100, <ListChecks />),
    item("pattern-ai-suggestion-picker", "AISuggestionPicker", "AI 候选选择器", 100, <Sparkles />),
    item("pattern-ai-suggestion-review", "AISuggestionReview", "AI 建议审阅器", 100, <SquareCheckBig />),
    item("pattern-markdown-editor", "MarkdownEditor", "Markdown 编辑器", 100, <FileText />),''',
)

replace_once(
    'showcase/catalog/component-progress.ts',
    '''  "pattern-bulk-action-bar",
  "pattern-markdown-editor",''',
    '''  "pattern-bulk-action-bar",
  "pattern-ai-suggestion-picker",
  "pattern-ai-suggestion-review",
  "pattern-markdown-editor",''',
)
replace_once(
    'showcase/catalog/component-progress.ts',
    '''componentReviews["pattern-markdown-editor"] = {''',
    '''componentReviews["pattern-ai-suggestion-picker"] = {
  status: "reviewed",
  scope: "Single-field AI candidate selection with explicit radio semantics, optional regenerate/dismiss controls and one apply action.",
  evidence: ["showcase/demos/patterns/ai-suggestion-picker.tsx", "tests/pattern-ai-suggestions.test.tsx"],
  baseline: "2026-09-17",
};
componentReviews["pattern-ai-suggestion-review"] = {
  status: "reviewed",
  scope: "Related-field AI change review with explicit checkbox selection and one counted apply action.",
  evidence: ["showcase/demos/patterns/ai-suggestion-review.tsx", "tests/pattern-ai-suggestions.test.tsx"],
  baseline: "2026-09-17",
};
componentReviews["pattern-markdown-editor"] = {''',
)

replace_once(
    'scripts/package-check.mjs',
    '''  ["patterns", patterns, ["BulkActionBar"]],''',
    '''  ["patterns", patterns, ["BulkActionBar", "DocumentEditorShell", "MarkdownEditor", "AISuggestionPicker", "AISuggestionReview"]],''',
)

replace_once(
    'docs/architecture.md',
    '''- `patterns` owns only admitted reusable compound interactions. Current canonical runtime surface: `BulkActionBar`, `DocumentEditorShell` and `MarkdownEditor`.''',
    '''- `patterns` owns only admitted reusable compound interactions. Current canonical runtime surface: `BulkActionBar`, `DocumentEditorShell`, `MarkdownEditor`, `AISuggestionPicker` and `AISuggestionReview`.''',
)

post_path = root / 'showcase/demos/products/blog-admin/post-editor.tsx'
post = post_path.read_text()


def post_replace(old: str, new: str) -> None:
    global post
    if new in post:
        return
    if old not in post:
        raise SystemExit(f'missing PostEditor anchor: {old[:160]!r}')
    post = post.replace(old, new, 1)


post_replace(
    'type AIPanel = "writing" | "image" | null;',
    'type AIPanel = "writing" | "image" | "cover-image" | null;',
)

post_replace(
    '''const postSeoSuggestions = [
  { key: "slug", label: "Slug", value: "agent-workflow-observability", monospace: true },
  { key: "seo-title", label: "SEO 标题", value: "Agent 工作流可观测性：运行证据、审批与失败回放" },
  { key: "seo-description", label: "SEO 描述", value: "拆解 Agent 自动化进入生产后需要保留的执行证据、人工审批边界与失败回放能力。" },
] as const;''',
    '''const postSeoSuggestions = [
  { key: "slug", label: "Slug", value: "agent-workflow-observability", monospace: true },
  { key: "seo-title", label: "SEO 标题", value: "Agent 工作流可观测性：运行证据、审批与失败回放" },
  { key: "seo-description", label: "SEO 描述", value: "拆解 Agent 自动化进入生产后需要保留的执行证据、人工审批边界与失败回放能力。" },
] as const;

const postTaxonomySuggestions = [
  { key: "category", label: "分类", value: "AI" },
  { key: "tags", label: "标签补充", value: "AI 治理、自动化" },
] as const;

const postTaxonomyTags = ["AI", "Agent", "可观测性", "AI 治理", "自动化"] as const;''',
)

post_replace(
    '''  const [metadataSuggestionsOpen, setMetadataSuggestionsOpen] = useState(false);
  const [metadataSelection, setMetadataSelection] = useState<string[]>([]);
  const [writingPrompt, setWritingPrompt] = useState("");''',
    '''  const [metadataSuggestionsOpen, setMetadataSuggestionsOpen] = useState(false);
  const [metadataSelection, setMetadataSelection] = useState<string[]>([]);
  const [taxonomySuggestionsOpen, setTaxonomySuggestionsOpen] = useState(false);
  const [taxonomySelection, setTaxonomySelection] = useState<string[]>([]);
  const [writingPrompt, setWritingPrompt] = useState("");''',
)

post_replace(
    '''    setMetadataSuggestionsOpen(false);
    setMetadataSelection([]);
    setGeneratedContent(null);''',
    '''    setMetadataSuggestionsOpen(false);
    setMetadataSelection([]);
    setTaxonomySuggestionsOpen(false);
    setTaxonomySelection([]);
    setGeneratedContent(null);''',
)

post_replace(
    '''  setNotice(`已应用 ${metadataSelection.length} 项 AI 路径与 SEO 建议（Showcase 模拟）。`);
};

  const openWritingAssistant = (prompt: string) => {''',
    '''  setNotice(`已应用 ${metadataSelection.length} 项 AI 路径与 SEO 建议（Showcase 模拟）。`);
};

  const applyTaxonomySuggestions = () => {
    const selected = new Set(taxonomySelection);
    setPost((current) => ({
      ...current,
      categoryId: selected.has("category") ? 1 : current.categoryId,
      tags: selected.has("tags")
        ? Array.from(new Set([...current.tags, ...postTaxonomyTags]))
        : current.tags,
    }));
    setDirty(true);
    setSavedAt(null);
    setTaxonomySuggestionsOpen(false);
    setNotice(`已应用 ${taxonomySelection.length} 项 AI 分类与标签建议（Showcase 模拟）。`);
  };

  const applyCoverSource = (source: "library" | "upload") => {
    const nextCover = source === "library"
      ? {
          url: "/media/ai-agent-observability-cover.webp",
          alt: "AI Agent 工作流运行证据与人工审批主题封面",
        }
      : {
          url: "/media/uploads/agent-governance-cover.webp",
          alt: "Agent 工作流治理文章封面",
        };

    setPost((current) => ({
      ...current,
      coverUrl: nextCover.url,
      coverAlt: nextCover.alt,
    }));
    setDirty(true);
    setSavedAt(null);
    setError(null);
    setNotice(source === "library" ? "已从媒体库选择文章封面。" : "已上传并设置文章封面。");
  };

  const openCoverGenerator = () => {
    setImagePrompt("");
    setImageAlt(post.coverAlt || (post.title.trim() ? `${post.title.trim()}封面` : "文章封面"));
    setGeneratedImage(false);
    setAIPanel("cover-image");
  };

  const openWritingAssistant = (prompt: string) => {''',
)

post_replace(
    '''      <InspectorSection title="分类与标签">
        <Field label="分类">
          <Select
            aria-label="分类"
            value={post.categoryId === null ? "" : String(post.categoryId)}
            onChange={(value) => updatePost("categoryId", value ? Number(value) : null)}
          >
            <option value="">未分类</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </Select>
        </Field>
        <Field label="标签" hint="使用逗号分隔。">
          <Input
            aria-label="标签"
            value={post.tags.join(", ")}
            onChange={(event) => updatePost("tags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))}
            placeholder="Go, OIDC, 安全"
          />
        </Field>
      </InspectorSection>''',
    '''      <InspectorSection
        title="分类与标签"
        action={!readOnly ? (
          <Button
            type="button"
            size="small"
            variant="text"
            icon={<Sparkles />}
            aria-label="AI 推荐分类与标签"
            title="AI 推荐分类与标签"
            className="size-8 px-0"
            disabled={!post.title.trim() && !post.summary.trim() && !post.content.trim()}
            onClick={() => {
              if (taxonomySuggestionsOpen) {
                setTaxonomySuggestionsOpen(false);
                return;
              }
              setTaxonomySelection(postTaxonomySuggestions.map((item) => item.key));
              setTaxonomySuggestionsOpen(true);
            }}
          />
        ) : undefined}
      >
        {taxonomySuggestionsOpen ? (
          <AISuggestionReview
            aria-label="AI 分类与标签建议"
            groupLabel="分类与标签建议"
            description="分类只从现有分类中推荐；标签建议以补充为主，不覆盖手工标签。"
            items={postTaxonomySuggestions}
            selectedKeys={taxonomySelection}
            onSelectedKeysChange={setTaxonomySelection}
            onCancel={() => setTaxonomySuggestionsOpen(false)}
            onApply={applyTaxonomySuggestions}
          />
        ) : null}
        <Field label="分类">
          <Select
            aria-label="分类"
            value={post.categoryId === null ? "" : String(post.categoryId)}
            onChange={(value) => updatePost("categoryId", value ? Number(value) : null)}
          >
            <option value="">未分类</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </Select>
        </Field>
        <Field label="标签" hint="使用逗号分隔。">
          <Input
            aria-label="标签"
            value={post.tags.join(", ")}
            onChange={(event) => updatePost("tags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))}
            placeholder="Go, OIDC, 安全"
          />
        </Field>
      </InspectorSection>''',
)

post_replace(
    '''      <InspectorSection title="封面">
        <Field label="封面 URL">
          <Input aria-label="封面 URL" value={post.coverUrl} onChange={(event) => updatePost("coverUrl", event.target.value)} placeholder="/media/cover.webp" />
        </Field>
        <Field label="替代文本">
          <Input aria-label="替代文本" value={post.coverAlt} onChange={(event) => updatePost("coverAlt", event.target.value)} placeholder="描述封面图场景与主题" />
        </Field>
      </InspectorSection>''',
    '''      <InspectorSection
        title="封面"
        action={!readOnly ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="small"
                variant={aiPanel === "cover-image" ? "solid" : "text"}
                color={aiPanel === "cover-image" ? "primary" : undefined}
                icon={<ImageIcon />}
                aria-label="选择文章封面"
                title="选择文章封面"
                className="size-8 px-0"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onSelect={() => applyCoverSource("library")}>从媒体库选择</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => applyCoverSource("upload")}>上传图片</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={openCoverGenerator}>AI 生成封面</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : undefined}
      >
        <Field label="封面 URL">
          <Input aria-label="封面 URL" value={post.coverUrl} onChange={(event) => updatePost("coverUrl", event.target.value)} placeholder="/media/cover.webp" />
        </Field>
        <Field label="替代文本">
          <Input aria-label="替代文本" value={post.coverAlt} onChange={(event) => updatePost("coverAlt", event.target.value)} placeholder="描述封面图场景与主题" />
        </Field>
      </InspectorSection>''',
)

post_replace(
    '''            open={aiPanel === "image" && !readOnly}
            title="AI 配图"
            description="生成后可插入当前编辑位置，或设为文章封面。"''',
    '''            open={(aiPanel === "image" || aiPanel === "cover-image") && !readOnly}
            title={aiPanel === "cover-image" ? "AI 生成封面" : "AI 配图"}
            description={aiPanel === "cover-image"
              ? "生成单张封面；采用后会同时填写封面 URL 与替代文本。"
              : "生成后可插入当前编辑位置，或设为文章封面。"}''',
)

post_replace(
    '''                    AI 生成插图预览
                  </div>
                  <div className="flex min-w-0 flex-col gap-3">
                    <code className="overflow-x-auto rounded bg-muted px-3 py-2 text-xs">![{imageAlt || "文章插图"}](/media/ai-generated-agent-workflow.webp)</code>
                    <div className="flex flex-wrap gap-2">
                      <Button size="small" variant="solid" color="primary" onClick={insertGeneratedImageAtCursor}>插入光标位置</Button>
                      <Button size="small" onClick={() => {
                        updatePost("coverUrl", "/media/ai-generated-agent-workflow.webp");
                        updatePost("coverAlt", imageAlt || "文章插图");
                        setAIPanel(null);
                        setNotice("已将 AI 图片设为文章封面。");
                      }}>设为文章封面</Button>
                      <Button size="small" variant="text" onClick={() => setGeneratedImage(false)}>放弃</Button>
                    </div>
                  </div>''',
    '''                    {aiPanel === "cover-image" ? "AI 生成封面预览" : "AI 生成插图预览"}
                  </div>
                  <div className="flex min-w-0 flex-col gap-3">
                    <code className="overflow-x-auto rounded bg-muted px-3 py-2 text-xs">
                      {aiPanel === "cover-image"
                        ? "/media/ai-generated-agent-workflow.webp"
                        : `![${imageAlt || "文章插图"}](/media/ai-generated-agent-workflow.webp)`}
                    </code>
                    {aiPanel === "cover-image" ? (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="small"
                          variant="solid"
                          color="primary"
                          onClick={() => {
                            setPost((current) => ({
                              ...current,
                              coverUrl: "/media/ai-generated-agent-workflow.webp",
                              coverAlt: imageAlt || "文章封面",
                            }));
                            setDirty(true);
                            setSavedAt(null);
                            setAIPanel(null);
                            setNotice("已采用 AI 生成封面，并回填封面 URL 与替代文本。");
                          }}
                        >
                          使用此封面
                        </Button>
                        <Button size="small" variant="text" onClick={() => setGeneratedImage(false)}>放弃</Button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <Button size="small" variant="solid" color="primary" onClick={insertGeneratedImageAtCursor}>插入光标位置</Button>
                        <Button size="small" onClick={() => {
                          updatePost("coverUrl", "/media/ai-generated-agent-workflow.webp");
                          updatePost("coverAlt", imageAlt || "文章插图");
                          setAIPanel(null);
                          setNotice("已将 AI 图片设为文章封面。");
                        }}>设为文章封面</Button>
                        <Button size="small" variant="text" onClick={() => setGeneratedImage(false)}>放弃</Button>
                      </div>
                    )}
                  </div>''',
)

post_path.write_text(post)

write('tests/pattern-ai-suggestion-showcase.test.ts', '''import { describe, expect, it } from "vitest";
import { showcaseCatalog } from "../showcase/catalog";
import { componentProgress } from "../showcase/catalog/component-progress";

describe("AI suggestion Pattern Showcase registration", () => {
  it("publishes both admitted AI suggestion Patterns as reviewed Showcase pages", () => {
    const ids = showcaseCatalog
      .filter((group) => group.workspace === "gouno-ui" && group.layer === "patterns")
      .flatMap((group) => group.items.map((item) => item.id));

    expect(ids).toContain("pattern-ai-suggestion-picker");
    expect(ids).toContain("pattern-ai-suggestion-review");
    expect(componentProgress("pattern-ai-suggestion-picker", 0)).toBe(100);
    expect(componentProgress("pattern-ai-suggestion-review", 0)).toBe(100);
  });
});
''')

write('tests/product-blog-admin-post-editor-metadata-ai.test.tsx', '''import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogAdminPostEditorDemo } from "../showcase/demos/products/blog-admin/post-editor";

afterEach(cleanup);

describe("Blog Admin PostEditor AI metadata and cover actions", () => {
  it("reviews classification and tag suggestions as one section-scoped AI action", () => {
    render(<BlogAdminPostEditorDemo />);

    fireEvent.click(screen.getByRole("button", { name: "AI 推荐分类与标签" }));
    expect(screen.getByLabelText("AI 分类与标签建议")).toBeTruthy();
    expect(screen.getByRole("group", { name: "分类与标签建议" })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "应用 分类 建议" })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "应用 标签补充 建议" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "应用 2 项建议" }));
    expect((screen.getByLabelText("分类") as HTMLSelectElement).value).toBe("1");
    expect((screen.getByLabelText("标签") as HTMLInputElement).value).toContain("AI 治理");
    expect((screen.getByLabelText("标签") as HTMLInputElement).value).toContain("自动化");
  });

  it("uses one cover-source menu and writes the chosen image into URL and alt fields", () => {
    render(<BlogAdminPostEditorDemo />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "选择文章封面" }), {
      button: 0,
      ctrlKey: false,
    });
    expect(screen.getByRole("menuitem", { name: "从媒体库选择" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "上传图片" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "AI 生成封面" })).toBeTruthy();
    fireEvent.click(screen.getByRole("menuitem", { name: "上传图片" }));

    expect((screen.getByLabelText("封面 URL") as HTMLInputElement).value).toBe("/media/uploads/agent-governance-cover.webp");
    expect((screen.getByLabelText("替代文本") as HTMLInputElement).value).toBe("Agent 工作流治理文章封面");
  });

  it("keeps AI cover generation single-purpose and fills both cover fields after acceptance", () => {
    render(<BlogAdminPostEditorDemo />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "选择文章封面" }), {
      button: 0,
      ctrlKey: false,
    });
    fireEvent.click(screen.getByRole("menuitem", { name: "AI 生成封面" }));
    expect(screen.getByRole("dialog", { name: "AI 生成封面" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "插入光标位置" })).toBeNull();

    fireEvent.change(screen.getByLabelText("生图提示词"), { target: { value: "Editorial cover for Agent workflow governance" } });
    fireEvent.change(screen.getByLabelText("图片描述 Alt"), { target: { value: "Agent 工作流治理封面" } });
    fireEvent.click(screen.getByRole("button", { name: "生成图片" }));
    expect(screen.getByText("AI 生成封面预览")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "使用此封面" }));

    expect((screen.getByLabelText("封面 URL") as HTMLInputElement).value).toBe("/media/ai-generated-agent-workflow.webp");
    expect((screen.getByLabelText("替代文本") as HTMLInputElement).value).toBe("Agent 工作流治理封面");
  });

  it("removes taxonomy and cover write actions in read-only mode", () => {
    render(<BlogAdminPostEditorDemo initialRoute="readonly" />);
    expect(screen.queryByRole("button", { name: "AI 推荐分类与标签" })).toBeNull();
    expect(screen.queryByRole("button", { name: "选择文章封面" })).toBeNull();
  });
});
''')
