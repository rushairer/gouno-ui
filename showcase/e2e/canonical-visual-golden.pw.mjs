import { expect, test } from "@playwright/test";

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
    name: "gosso-account-settings-desktop-light",
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-account-settings",
    viewport: desktop,
    ready: "[data-slot=\"card\"]",
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
  await page.getByRole("button", { name: "进入详情 / 运行" }).first().click();
  await expect(page.getByRole("heading", { level: 2, name: "旧文维护" })).toBeVisible();
  await expect(page.getByText("流程定义")).toBeVisible();
  await expect(page.getByText("运行当前 Workflow")).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-operations-workflow-detail-desktop.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
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
  await page.getByRole("button", { name: "进入详情 / 运行" }).first().click();
  await expect(page.getByRole("heading", { level: 2, name: "旧文维护" })).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-operations-workflow-detail-mobile.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
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
  await expect(page.getByRole("heading", { level: 2, name: "运行中心" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: /Run #245/ })).toBeVisible();
  await expect(page.getByText("执行过程")).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-operations-run-center-desktop.png"),
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
  await expect(page.getByText("Tool 授权")).toBeVisible();
  await expect(page.getByText("默认治理限制")).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("blog-admin-ai-settings-skill-editor-desktop.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
});

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
