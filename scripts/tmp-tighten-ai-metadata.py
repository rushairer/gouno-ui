from pathlib import Path

post = Path("showcase/demos/products/blog-admin/post-editor.tsx")
text = post.read_text()
old = 'const postTaxonomyTags = ["AI", "Agent", "可观测性", "AI 治理", "自动化"] as const;'
new = 'const postTaxonomyTags = ["AI 治理", "自动化"] as const;'
if old not in text:
    raise SystemExit("taxonomy tag anchor missing")
post.write_text(text.replace(old, new, 1))

review = Path("showcase/demos/patterns/examples/ai-suggestion-review.tsx")
text = review.read_text()
text = text.replace(
    '  const [appliedKeys, setAppliedKeys] = useState<string[]>([]);',
    '  const [appliedKeys, setAppliedKeys] = useState<string[]>([]);\n  const [visible, setVisible] = useState(true);',
    1,
)
text = text.replace(
    '  return (\n    <div className="flex flex-col gap-4">',
    '''  if (!visible) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/10">
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm font-medium"
          onClick={() => {
            setSelectedKeys(suggestions.map((item) => item.key));
            setVisible(true);
          }}
        >
          重新打开 AI 建议
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">''',
    1,
)
text = text.replace(
    '        onCancel={() => setSelectedKeys([])}',
    '        onCancel={() => setVisible(false)}',
    1,
)
review.write_text(text)

test = Path("tests/product-blog-admin-post-editor-metadata-ai.test.tsx")
text = test.read_text()
old = '''    expect((screen.getByLabelText("标签") as HTMLInputElement).value).toContain("AI 治理");
    expect((screen.getByLabelText("标签") as HTMLInputElement).value).toContain("自动化");'''
new = '''    expect((screen.getByLabelText("标签") as HTMLInputElement).value).toBe("AI 治理, 自动化");'''
if old not in text:
    raise SystemExit("taxonomy test anchor missing")
test.write_text(text.replace(old, new, 1))
