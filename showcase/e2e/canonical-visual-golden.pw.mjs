import { expect, test } from "@playwright/test";

// Canonical baselines use an explicit refresh workflow; ordinary CI always compares.

const desktop = { width: 1440, height: 900 };
const narrow = { width: 782, height: 900 };
const mobile = { width: 390, height: 844 };

const scenarios = [
  {
    name: "blog-home-desktop-light",
    workspace: "blog",
    brand: "blog",
    fixture: "blog-home",
    viewport: desktop,
    ready: "#public-main",
  },
  {
    name: "blog-home-mobile-light",
    workspace: "blog",
    brand: "blog",
    fixture: "blog-home",
    viewport: mobile,
    ready: "#public-main",
  },
  {
    name: "blog-article-detail-desktop-light",
    workspace: "blog",
    brand: "blog",
    fixture: "blog-article-detail",
    viewport: desktop,
    ready: "#public-main",
  },
  {
    name: "blog-search-desktop-light",
    workspace: "blog",
    brand: "blog",
    fixture: "blog-search",
    viewport: desktop,
    ready: "#public-main",
  },
  {
    name: "blog-account-settings-desktop-light",
    workspace: "blog",
    brand: "blog",
    fixture: "blog-account-settings",
    viewport: desktop,
    ready: "#public-main",
  },
  {
    name: "blog-admin-dashboard-desktop-light",
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-dashboard",
    viewport: desktop,
    ready: "[data-slot=\"card\"]",
  },
  {
    name: "blog-admin-posts-desktop-light",
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-posts",
    viewport: desktop,
    ready: "[data-slot=\"card\"]",
  },
  {
    name: "blog-admin-posts-mobile-light",
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-posts",
    viewport: mobile,
    ready: "[data-slot=\"card\"]",
  },
  {
    name: "blog-admin-post-editor-desktop-light",
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-post-editor",
    viewport: desktop,
    ready: "[data-slot=\"card\"]",
  },
  {
    name: "gosso-overview-desktop-light",
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-overview",
    viewport: desktop,
    ready: "[data-slot=\"card\"]",
  },
  {
    name: "gosso-system-clients-desktop-light",
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-system-clients",
    viewport: desktop,
    ready: "table",
  },
  {
    name: "gosso-site-settings-desktop-light",
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-system-site-settings",
    viewport: desktop,
    ready: "[data-slot=\"card\"]",
  },
  {
    name: "gosso-site-settings-mobile-light",
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-system-site-settings",
    viewport: mobile,
    ready: "[data-slot=\"card\"]",
  },
  {
    name: "gosso-account-settings-desktop-light",
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-account-settings",
    viewport: desktop,
    ready: "[data-slot=\"card\"]",
  },
  {
    name: "gosso-login-desktop-light",
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-login",
    viewport: desktop,
    ready: "form",
  },
  {
    name: "gosso-login-mobile-light",
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-login",
    viewport: mobile,
    ready: "form",
  },
];

async function prepareLightFixture(page, scenario) {
  await page.setViewportSize(scenario.viewport);
  await page.addInitScript(() => {
    localStorage.setItem("gouno-ui-showcase:theme", "light");
  });

  await page.goto(
    `/?embedded=1&workspace=${scenario.workspace}&brand=${scenario.brand}#${scenario.fixture}`,
    { waitUntil: "networkidle" },
  );

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute("data-brand", scenario.brand);
  await expect(page.locator(scenario.ready).first()).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

async function prepareDarkFixture(page, scenario) {
  await page.setViewportSize(scenario.viewport);
  await page.addInitScript(() => {
    localStorage.setItem("gouno-ui-showcase:theme", "dark");
  });

  await page.goto(
    `/?embedded=1&workspace=${scenario.workspace}&brand=${scenario.brand}#${scenario.fixture}`,
    { waitUntil: "networkidle" },
  );

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-brand", scenario.brand);
  await expect(page.locator(scenario.ready).first()).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

async function expectNoHorizontalDocumentOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewport + 1);
}

for (const scenario of scenarios) {
  test(scenario.name, async ({ page }) => {
    await prepareLightFixture(page, scenario);

    await expect(page).toHaveScreenshot(`${scenario.name}.png`, {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.002,
    });
  });
}

test("density-global-compact-default-table-geometry", async ({ page }) => {
  const scenario = {
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-system-clients",
    viewport: desktop,
    ready: "table",
  };
  await prepareLightFixture(page, scenario);

  const html = page.locator("html");
  const table = page
    .locator('[data-slot="table-container"][data-density="default"]')
    .first();
  const firstHead = table.locator('[data-slot="table-head"]').nth(0);
  const secondHead = table.locator('[data-slot="table-head"]').nth(1);

  await expect(html).toHaveAttribute("data-density", "comfortable");

  const measure = async () => ({
    first: await firstHead.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        block: style.paddingTop,
        inlineStart: style.paddingLeft,
      };
    }),
    second: await secondHead.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        block: style.paddingTop,
        inlineStart: style.paddingLeft,
      };
    }),
  });

  expect(await measure()).toEqual({
    first: { block: "12px", inlineStart: "24px" },
    second: { block: "12px", inlineStart: "16px" },
  });

  await html.evaluate((element) => {
    element.dataset.density = "compact";
  });
  await expect(html).toHaveAttribute("data-density", "compact");

  await expect
    .poll(measure)
    .toEqual({
      first: { block: "8px", inlineStart: "16px" },
      second: { block: "8px", inlineStart: "12px" },
    });
});

const darkScenarios = [
  {
    name: "blog-home-desktop-dark",
    workspace: "blog",
    brand: "blog",
    fixture: "blog-home",
    viewport: desktop,
    ready: "#public-main",
  },
  {
    name: "blog-home-mobile-dark",
    workspace: "blog",
    brand: "blog",
    fixture: "blog-home",
    viewport: mobile,
    ready: "#public-main",
  },
  {
    name: "blog-admin-dashboard-desktop-dark",
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-dashboard",
    viewport: desktop,
    ready: '[data-slot="card"]',
  },
  {
    name: "blog-admin-posts-desktop-dark",
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-posts",
    viewport: desktop,
    ready: '[data-slot="card"]',
  },
  {
    name: "blog-admin-posts-mobile-dark",
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-posts",
    viewport: mobile,
    ready: '[data-slot="card"]',
  },
  {
    name: "blog-admin-post-editor-desktop-dark",
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-post-editor",
    viewport: desktop,
    ready: '[data-slot="markdown-editor"]',
  },
  {
    name: "gosso-site-settings-desktop-dark",
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-system-site-settings",
    viewport: desktop,
    ready: '[data-slot="card"]',
  },
  {
    name: "gosso-site-settings-mobile-dark",
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-system-site-settings",
    viewport: mobile,
    ready: '[data-slot="card"]',
  },
  {
    name: "gosso-login-desktop-dark",
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-login",
    viewport: desktop,
    ready: "form",
  },
  {
    name: "gosso-login-mobile-dark",
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-login",
    viewport: mobile,
    ready: "form",
  },
];

for (const scenario of darkScenarios) {
  test(scenario.name, async ({ page }) => {
    await prepareDarkFixture(page, scenario);
    await expectNoHorizontalDocumentOverflow(page);

    await expect(page).toHaveScreenshot(`${scenario.name}.png`, {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.002,
    });
  });
}

for (const [name, viewport] of [
  ["narrow", narrow],
  ["mobile", mobile],
]) {
  test(`blog-admin-post-editor-${name}-preview-edit-roundtrip`, async ({ page }) => {
    await prepareLightFixture(page, {
      workspace: "blog-admin",
      brand: "blog-admin",
      fixture: "blog-admin-post-editor",
      viewport: desktop,
      ready: '[data-slot="markdown-editor"]',
    });

    const editor = page.locator('[data-slot="markdown-editor"]').first();
    const toolbar = editor.locator('[data-slot="markdown-editor-toolbar"]');
    const modeSwitcher = editor.locator('[data-slot="markdown-editor-mode-switcher"]');

    await page.setViewportSize(viewport);
    await page.waitForTimeout(100);

    await modeSwitcher.getByRole("button", { name: "预览" }).click();
    await expect(editor).toHaveAttribute("data-mode", "preview");
    await modeSwitcher.getByRole("button", { name: "编辑" }).click();
    await expect(editor).toHaveAttribute("data-mode", "edit");

    await expect(toolbar).toHaveAttribute("data-adaptive-density", "icon");
    await expect(toolbar).toHaveAttribute("data-adaptive-wrap", "false");

    const [toolbarBox, modeBox] = await Promise.all([
      toolbar.boundingBox(),
      modeSwitcher.boundingBox(),
    ]);
    expect(toolbarBox).toBeTruthy();
    expect(modeBox).toBeTruthy();
    expect(modeBox.x + modeBox.width).toBeLessThanOrEqual(toolbarBox.x + toolbarBox.width + 1);
  });
}

test("blog-admin-ai-operations-overview-visual-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-operations",
    viewport: desktop,
    ready: '[role="tablist"]',
  });

  await expect(page.getByText(/先处理失败与等待人工的运行/)).toBeVisible();
  await expect(page.getByRole("region", { name: "需要关注" })).toBeVisible();
  await expect(page.getByRole("region", { name: "自动化健康度" })).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-operations-overview-desktop.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
  await expect(page).toHaveScreenshot("blog-admin-ai-operations-overview-desktop-light.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.002,
  });
});

test("blog-admin-ai-operations-inbox-visual-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-operations",
    viewport: desktop,
    ready: '[role="tablist"]',
  });

  await page.getByRole("tab", { name: /待我处理/ }).click();
  await expect(page.getByText("决策队列", { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Decision Workbench" })).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-operations-inbox-desktop.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
  await expect(page).toHaveScreenshot("blog-admin-ai-operations-inbox-desktop-light.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.002,
  });
});

test("blog-admin-ai-operations-workflow-list-visual-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-operations",
    viewport: desktop,
    ready: '[role="tablist"]',
  });

  await page.getByRole("tab", { name: "自动化" }).click();
  await expect(page.getByRole("list", { name: "Workflow 列表" })).toBeVisible();
  await expect(page.getByRole("button", { name: "创建 Workflow" })).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-operations-workflow-list-desktop.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
  await expect(page).toHaveScreenshot("blog-admin-ai-operations-workflow-list-desktop-light.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.002,
  });
});

test("blog-admin-ai-operations-workflow-detail-visual-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-operations",
    viewport: desktop,
    ready: '[role="tablist"]',
  });

  await page.getByRole("tab", { name: "自动化" }).click();
  await page.getByRole("button", { name: "打开 Workflow：旧文维护" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "旧文维护" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "流程定义" })).toBeVisible();
  await expect(page.getByText("运行当前 Workflow")).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-operations-workflow-detail-desktop.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
  await expect(page).toHaveScreenshot("blog-admin-ai-operations-workflow-detail-desktop-light.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.002,
  });
});

test("blog-admin-ai-operations-workflow-detail-mobile-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-operations",
    viewport: mobile,
    ready: '[role="tablist"]',
  });

  await page.getByRole("tab", { name: "自动化" }).click();
  await page.getByRole("button", { name: "打开 Workflow：旧文维护" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "旧文维护" })).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-operations-workflow-detail-mobile.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
  await expect(page).toHaveScreenshot("blog-admin-ai-operations-workflow-detail-mobile-light.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.002,
  });
});

test("blog-admin-ai-operations-workflow-editor-visual-golden", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-operations",
    viewport: desktop,
    ready: '[role="tablist"]',
  });

  await page.getByRole("tab", { name: "自动化" }).click();
  await page.getByRole("button", { name: "打开 Workflow：旧文维护" }).click();
  await page.getByRole("button", { name: "编辑", exact: true }).click();
  await expect(page.getByText("基础信息", { exact: true })).toBeVisible();
  await expect(page.getByText("运行输入契约", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "保存 Workflow" })).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-operations-workflow-editor-desktop.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
  await expect(page).toHaveScreenshot("blog-admin-ai-operations-workflow-editor-desktop-light.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.002,
  });
});

test("blog-admin-ai-operations-run-center-visual-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-operations",
    viewport: desktop,
    ready: '[role="tablist"]',
  });

  await page.getByRole("tab", { name: "运行中心" }).click();
  await expect(page.getByText("Workflow Runs")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /Run #246/ })).toBeVisible();
  await expect(page.getByText("执行过程")).toBeVisible();
  await expect(page.getByText("资源证据")).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-operations-run-center-desktop.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
  await expect(page).toHaveScreenshot("blog-admin-ai-operations-run-center-desktop-light.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.002,
  });
});

test("blog-admin-ai-operations-agent-run-visual-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-operations",
    viewport: desktop,
    ready: '[role="tablist"]',
  });

  await page.getByRole("tab", { name: "运行中心" }).click();
  await page.getByRole("button", { name: "Agent 运行" }).click();
  await expect(page.getByRole("heading", { level: 2, name: /Run #702/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tool Calls" })).toBeVisible();
  await expect(page.getByText("引用证据")).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-operations-agent-run-desktop.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
});

test("blog-admin-ai-operations-failed-run-visual-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-operations",
    viewport: desktop,
    ready: '[role="tablist"]',
  });

  await page.getByRole("button", { name: "打开 Fixture 控制" }).click();
  const failureScenario = page.getByRole("radio", { name: "运行失败" });
  await failureScenario.check({ force: true });
  await expect(failureScenario).toBeChecked();
  await page.keyboard.press("Escape");
  await page.getByRole("tab", { name: "自动化" }).click();
  await page.getByRole("button", { name: "打开 Workflow：旧文维护" }).click();
  await page.getByRole("button", { name: "运行", exact: true }).click();
  const runFailureAlert = page.getByRole("alert");
  await expect(runFailureAlert).toContainText("运行失败");
  await page.getByRole("button", { name: /查看 Run #/ }).last().click();
  await expect(page.getByRole("heading", { level: 2, name: /Run #/ })).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("运行失败");
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-operations-failed-run-desktop.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
});

test("blog-admin-ai-settings-skill-editor-visual-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-settings",
    viewport: desktop,
    ready: '[role="tablist"]',
  });

  await page.getByRole("tab", { name: "Skills" }).click();
  await page.getByRole("button", { name: "编辑" }).first().click();
  await expect(page.getByRole("heading", { level: 2, name: /编辑 Skill/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tool 授权" })).toBeVisible();
  const governanceHeading = page.getByRole("heading", { name: "默认治理限制" });
  await expect(governanceHeading).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-settings-skill-editor-desktop.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });

  await governanceHeading.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-settings-skill-governance-desktop.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
});


test("blog-admin-ai-operations-inbox-desktop-dark", async ({ page }) => {
  await prepareDarkFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-operations",
    viewport: desktop,
    ready: '[role="tablist"]',
  });
  await page.getByRole("tab", { name: /待我处理/ }).click();
  await expect(page.getByRole("region", { name: "Decision Workbench" })).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await expect(page).toHaveScreenshot("blog-admin-ai-operations-inbox-desktop-dark.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.002,
  });
});

for (const scenario of [
  {
    name: "blog-admin-ai-operations-workflow-detail-desktop-dark",
    viewport: desktop,
    theme: "dark",
  },
  {
    name: "blog-admin-ai-operations-workflow-detail-mobile-dark",
    viewport: mobile,
    theme: "dark",
  },
]) {
  test(scenario.name, async ({ page }) => {
    await prepareDarkFixture(page, {
      workspace: "blog-admin",
      brand: "blog-admin",
      fixture: "blog-admin-ai-operations",
      viewport: scenario.viewport,
      ready: '[role="tablist"]',
    });
    await page.getByRole("tab", { name: "自动化" }).click();
    await page.getByRole("button", { name: "打开 Workflow：旧文维护" }).click();
    await expect(page.getByRole("heading", { level: 2, name: "旧文维护" })).toBeVisible();
    await expectNoHorizontalDocumentOverflow(page);
    await expect(page).toHaveScreenshot(`${scenario.name}.png`, {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.002,
    });
  });
}

for (const scenario of [
  {
    name: "blog-admin-ai-operations-workflow-editor-mobile-light",
    viewport: mobile,
    theme: "light",
  },
  {
    name: "blog-admin-ai-operations-workflow-editor-desktop-dark",
    viewport: desktop,
    theme: "dark",
  },
  {
    name: "blog-admin-ai-operations-workflow-editor-mobile-dark",
    viewport: mobile,
    theme: "dark",
  },
]) {
  test(scenario.name, async ({ page }) => {
    const prepare = scenario.theme === "dark" ? prepareDarkFixture : prepareLightFixture;
    await prepare(page, {
      workspace: "blog-admin",
      brand: "blog-admin",
      fixture: "blog-admin-ai-operations",
      viewport: scenario.viewport,
      ready: '[role="tablist"]',
    });
    await page.getByRole("tab", { name: "自动化" }).click();
    await page.getByRole("button", { name: "打开 Workflow：旧文维护" }).click();
    await page.getByRole("button", { name: "编辑", exact: true }).click();
    await expect(page.getByText("基础信息", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "保存 Workflow" })).toBeVisible();
    await expectNoHorizontalDocumentOverflow(page);
    await expect(page).toHaveScreenshot(`${scenario.name}.png`, {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.002,
    });
  });
}

for (const scenario of [
  { name: "blog-admin-categories-drawer-desktop-light", theme: "light" },
  { name: "blog-admin-categories-drawer-desktop-dark", theme: "dark" },
]) {
  test(scenario.name, async ({ page }) => {
    const prepare = scenario.theme === "dark" ? prepareDarkFixture : prepareLightFixture;
    await prepare(page, {
      workspace: "blog-admin",
      brand: "blog-admin",
      fixture: "blog-admin-categories",
      viewport: desktop,
      ready: "table",
    });
    await page.getByRole("button", { name: "新建分类" }).click();
    await expect(page.getByRole("dialog", { name: "新建分类" })).toBeVisible();
    await expectNoHorizontalDocumentOverflow(page);
    await expect(page).toHaveScreenshot(`${scenario.name}.png`, {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.002,
    });
  });
}

for (const scenario of [
  { name: "gosso-system-clients-modal-desktop-light", theme: "light" },
  { name: "gosso-system-clients-modal-desktop-dark", theme: "dark" },
]) {
  test(scenario.name, async ({ page }) => {
    const prepare = scenario.theme === "dark" ? prepareDarkFixture : prepareLightFixture;
    await prepare(page, {
      workspace: "gosso-admin",
      brand: "gosso-admin",
      fixture: "gosso-system-clients",
      viewport: desktop,
      ready: "table",
    });
    await page.getByRole("button", { name: "注册客户端" }).first().click();
    await expect(page.getByRole("dialog", { name: "注册 OAuth2 客户端" })).toBeVisible();
    await expectNoHorizontalDocumentOverflow(page);
    await expect(page).toHaveScreenshot(`${scenario.name}.png`, {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.002,
    });
  });
}

test("gosso-account-settings-mfa-tab-interaction", async ({ page }) => {
  const scenario = scenarios.find(
    ({ name }) => name === "gosso-account-settings-desktop-light",
  );
  expect(scenario).toBeTruthy();
  await prepareLightFixture(page, scenario);

  const profileTab = page.getByRole("tab", { name: /个人资料/ });
  const mfaTab = page.getByRole("tab", { name: /MFA/ });
  await expect(profileTab).toHaveAttribute("aria-selected", "true");
  await mfaTab.click();
  await expect(mfaTab).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-slot="card"]').first()).toBeVisible();
});
