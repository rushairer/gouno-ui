import { readFile, writeFile } from "node:fs/promises";

async function edit(path, transform) {
  const before = await readFile(path, "utf8");
  const after = transform(before);
  if (after === before) throw new Error(`${path}: hardening produced no changes`);
  await writeFile(path, after);
}

function replaceOnce(source, from, to, label) {
  const index = source.indexOf(from);
  if (index < 0) throw new Error(`missing ${label}`);
  if (source.indexOf(from, index + from.length) >= 0) {
    throw new Error(`ambiguous ${label}`);
  }
  return source.slice(0, index) + to + source.slice(index + from.length);
}

function insertAfter(source, marker, addition, label) {
  const index = source.indexOf(marker);
  if (index < 0) throw new Error(`missing ${label}`);
  return source.slice(0, index + marker.length) + addition + source.slice(index + marker.length);
}

await edit(
  "showcase/demos/products/blog-admin/ai/operations/automation-management.tsx",
  (source) => {
    source = replaceOnce(
      source,
      '<aside className="min-w-0 overflow-hidden rounded-xl border bg-background" aria-label="Workflow 导航">',
      '<aside data-slot="ops-rail" className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border bg-background" aria-label="Workflow 导航">',
      "adaptive Workflow rail",
    );
    source = replaceOnce(
      source,
      '<div className="border-b bg-muted/20 p-4">',
      '<div className="shrink-0 border-b bg-muted/20 p-4">',
      "Workflow rail header",
    );
    source = replaceOnce(
      source,
      '<div role="list" aria-label="Workflow 列表" className="max-h-[44rem] overflow-y-auto">',
      '<div data-slot="ops-rail-body" role="list" aria-label="Workflow 列表" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">',
      "Workflow rail body",
    );
    source = replaceOnce(
      source,
      '<div className="grid min-w-0 gap-5 xl:grid-cols-[21rem_minmax(0,1fr)]">',
      '<div data-slot="ops-master-detail" className="grid min-w-0 items-stretch gap-5 xl:grid-cols-[21rem_minmax(0,1fr)]">',
      "Workflow master-detail",
    );
    source = replaceOnce(
      source,
      '<div className="flex min-w-0 flex-col gap-5">\n          <section className="overflow-hidden rounded-xl border bg-background" aria-label={`${selected.name} Workflow 概览`}>',
      '<div data-slot="ops-detail-stack" className="flex min-w-0 flex-col gap-5">\n          <section className="overflow-hidden rounded-xl border bg-background" aria-label={`${selected.name} Workflow 概览`}>',
      "Workflow detail stack",
    );
    return source;
  },
);

await edit(
  "showcase/demos/products/blog-admin/ai/operations/overview-inbox.tsx",
  (source) => {
    source = replaceOnce(
      source,
      '<div className="grid min-h-[34rem] overflow-hidden rounded-lg border bg-background xl:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.55fr)]">',
      '<div data-slot="ops-master-detail" className="grid min-h-[34rem] items-stretch overflow-hidden rounded-lg border bg-background xl:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.55fr)]">',
      "Decision master-detail",
    );
    source = replaceOnce(
      source,
      '<section className="border-b xl:border-b-0 xl:border-r" aria-label="Decision Queue">',
      '<section data-slot="ops-rail" className="flex min-h-0 min-w-0 flex-col border-b xl:border-b-0 xl:border-r" aria-label="Decision Queue">',
      "Decision rail",
    );
    source = replaceOnce(
      source,
      '<div className="border-b px-[18px] py-4"><div className="flex items-center justify-between gap-3">',
      '<div className="shrink-0 border-b px-[18px] py-4"><div className="flex items-center justify-between gap-3">',
      "Decision rail header",
    );
    source = replaceOnce(
      source,
      '<div className="max-h-[42rem] overflow-y-auto">',
      '<div data-slot="ops-rail-body" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">',
      "Decision rail body",
    );
    return source;
  },
);

await edit(
  "showcase/demos/products/blog-admin/ai/operations/automation-records.tsx",
  (source) => {
    source = replaceOnce(
      source,
      '<div className="grid gap-6 xl:grid-cols-[19rem_minmax(0,1fr)]">\n            <section className="overflow-hidden rounded-lg border bg-background" aria-label="Workflow Runs">\n              <div className="border-b px-[18px] py-4"><strong className="text-sm">Workflow Runs</strong><Text size="xs" tone="muted">{workflowRuns.length} 条运行记录</Text></div>\n              <div className="max-h-[46rem] overflow-y-auto">',
      '<div data-slot="ops-master-detail" className="grid items-stretch gap-6 xl:grid-cols-[19rem_minmax(0,1fr)]">\n            <section data-slot="ops-rail" className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border bg-background" aria-label="Workflow Runs">\n              <div className="shrink-0 border-b px-[18px] py-4"><strong className="text-sm">Workflow Runs</strong><Text size="xs" tone="muted">{workflowRuns.length} 条运行记录</Text></div>\n              <div data-slot="ops-rail-body" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">',
      "Workflow Run master-detail rail",
    );
    return source;
  },
);

await edit(
  "showcase/demos/products/blog-admin/ai/operations/workflow-execution.tsx",
  (source) => {
    source = replaceOnce(
      source,
      '<section className="rounded-lg border bg-background p-6" aria-label="运行当前 Workflow">\n        <OpsRegionHeading',
      '<section data-slot="workflow-run-surface" className="overflow-hidden rounded-xl border bg-background" aria-label="运行当前 Workflow">\n        <div className="border-b p-6">\n          <OpsRegionHeading',
      "Workflow execution surface header",
    );
    source = replaceOnce(
      source,
      '          action={<Tag color={workflow.enabled ? "success" : undefined}>{workflow.enabled ? "可运行" : "已停用"}</Tag>}\n        />\n\n        <div className="mt-5 border-t pt-5">',
      '          action={<Tag color={workflow.enabled ? "success" : undefined}>{workflow.enabled ? "可运行" : "已停用"}</Tag>}\n          />\n        </div>\n\n        <div className="p-6">',
      "Workflow execution input region",
    );
    source = replaceOnce(
      source,
      '<div className="mt-5 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">',
      '<div className="flex flex-col gap-3 border-t px-6 py-5 sm:flex-row sm:items-center sm:justify-between">',
      "Workflow execution action region",
    );
    source = replaceOnce(
      source,
      '<div className="mt-5">\n            <Alert',
      '<div className="border-t p-6">\n            <Alert',
      "Workflow execution feedback region",
    );
    return source;
  },
);

await edit("tests/product-blog-admin-responsive.test.tsx", (source) => {
  const marker = '  it("allows Workflow management actions to wrap inside narrow cards", () => {';
  if (!source.includes(marker)) throw new Error("missing responsive Workflow test marker");
  const addition = `\n  it("keeps Workflow navigation height content-driven instead of capped by a magic max-height", () => {\n    render(\n      <AutomationManagement\n        workflows={aiOpsAutomationRecordsFixture.workflows}\n        onSave={() => {}}\n        onDelete={() => {}}\n        onToggle={() => {}}\n      />,\n    );\n\n    const list = screen.getByRole("list", { name: "Workflow 列表" });\n    const rail = list.closest('[data-slot="ops-rail"]');\n    expect(rail).toBeTruthy();\n    expect(rail?.className).toContain("flex");\n    expect(rail?.className).toContain("min-h-0");\n    expect(list.className).toContain("flex-1");\n    expect(list.className).toContain("overflow-y-auto");\n    expect(list.className).not.toContain("max-h-[");\n  });\n`;
  return insertAfter(source, "afterEach(cleanup);\n", addition, "responsive test insertion");
});

await edit("showcase/e2e/canonical-visual-golden.pw.mjs", (source) => {
  const addGolden = (text, evidenceName, baselineName) => {
    const marker = `  await page.screenshot({\n    path: testInfo.outputPath("${evidenceName}.png"),\n    fullPage: true,\n    animations: "disabled",\n    caret: "hide",\n  });`;
    const addition = `\n  await expect(page).toHaveScreenshot("${baselineName}.png", {\n    fullPage: true,\n    animations: "disabled",\n    caret: "hide",\n    maxDiffPixelRatio: 0.002,\n  });`;
    if (!text.includes(marker)) throw new Error(`missing visual evidence ${evidenceName}`);
    return text.replace(marker, marker + addition);
  };

  source = addGolden(source, "blog-admin-ai-operations-overview-desktop", "blog-admin-ai-operations-overview-desktop-light");
  source = addGolden(source, "blog-admin-ai-operations-inbox-desktop", "blog-admin-ai-operations-inbox-desktop-light");
  source = addGolden(source, "blog-admin-ai-operations-workflow-list-desktop", "blog-admin-ai-operations-workflow-list-desktop-light");
  source = addGolden(source, "blog-admin-ai-operations-workflow-detail-desktop", "blog-admin-ai-operations-workflow-detail-desktop-light");
  source = addGolden(source, "blog-admin-ai-operations-workflow-detail-mobile", "blog-admin-ai-operations-workflow-detail-mobile-light");
  source = addGolden(source, "blog-admin-ai-operations-run-center-desktop", "blog-admin-ai-operations-run-center-desktop-light");

  const runCenterMarker = 'test("blog-admin-ai-operations-run-center-visual-evidence", async ({ page }, testInfo) => {';
  if (!source.includes(runCenterMarker)) throw new Error("missing run center visual test marker");
  const editorTest = `test("blog-admin-ai-operations-workflow-editor-visual-golden", async ({ page }, testInfo) => {\n  await prepareLightFixture(page, {\n    workspace: "blog-admin",\n    brand: "blog-admin",\n    fixture: "blog-admin-ai-operations",\n    viewport: desktop,\n    ready: '[role="tablist"]',\n  });\n\n  await page.getByRole("tab", { name: "自动化" }).click();\n  await page.getByRole("button", { name: "打开 Workflow：旧文维护" }).click();\n  await page.getByRole("button", { name: "编辑", exact: true }).click();\n  await expect(page.getByText("基础信息", { exact: true })).toBeVisible();\n  await expect(page.getByText("运行输入契约", { exact: true })).toBeVisible();\n  await expect(page.getByRole("button", { name: "保存 Workflow" })).toBeVisible();\n  await expectNoHorizontalDocumentOverflow(page);\n  await page.screenshot({\n    path: testInfo.outputPath("blog-admin-ai-operations-workflow-editor-desktop.png"),\n    fullPage: true,\n    animations: "disabled",\n    caret: "hide",\n  });\n  await expect(page).toHaveScreenshot("blog-admin-ai-operations-workflow-editor-desktop-light.png", {\n    fullPage: true,\n    animations: "disabled",\n    caret: "hide",\n    maxDiffPixelRatio: 0.002,\n  });\n});\n\n`;
  source = source.replace(runCenterMarker, editorTest + runCenterMarker);
  return source;
});

await edit("scripts/check-parity-maintenance-contract.mjs", (source) => {
  const baselineMarker = '  "blog-admin-post-editor-desktop-light.png",\n';
  const aiBaselines = [
    "blog-admin-ai-operations-overview-desktop-light.png",
    "blog-admin-ai-operations-inbox-desktop-light.png",
    "blog-admin-ai-operations-workflow-list-desktop-light.png",
    "blog-admin-ai-operations-workflow-detail-desktop-light.png",
    "blog-admin-ai-operations-workflow-detail-mobile-light.png",
    "blog-admin-ai-operations-workflow-editor-desktop-light.png",
    "blog-admin-ai-operations-run-center-desktop-light.png",
  ].map((name) => `  "${name}",`).join("\n") + "\n";
  if (!source.includes(baselineMarker)) throw new Error("missing golden baseline insertion marker");
  source = source.replace(baselineMarker, baselineMarker + aiBaselines);

  const staticMarker = 'const goldenWorkflowPath = ".github/workflows/canonical-visual-golden.yml";';
  const staticChecks = `const aiOpsAdaptiveRailFiles = [\n  "showcase/demos/products/blog-admin/ai/operations/automation-management.tsx",\n  "showcase/demos/products/blog-admin/ai/operations/overview-inbox.tsx",\n  "showcase/demos/products/blog-admin/ai/operations/automation-records.tsx",\n];\nfor (const path of aiOpsAdaptiveRailFiles) {\n  const text = await source(path);\n  if (/max-h-\\[(?:42|44|46|48|56)rem\\]/.test(text)) {\n    failures.push(\n      \`${"${path}"}: AI Operations master-detail rails must be content-driven; fixed rem max-height is forbidden\`,\n    );\n  }\n  for (const marker of ['data-slot="ops-rail"', 'data-slot="ops-rail-body"']) {\n    requireText(\n      text,\n      marker,\n      \`${"${path}"}: missing adaptive master-detail rail marker ${"${marker}"}\`,\n    );\n  }\n}\n\n`;
  if (!source.includes(staticMarker)) throw new Error("missing parity static insertion marker");
  source = source.replace(staticMarker, staticChecks + staticMarker);
  return source;
});

console.log("AI Operations canonical layout hardening applied.");
