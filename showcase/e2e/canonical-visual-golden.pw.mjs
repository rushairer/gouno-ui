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

async function captureCanonicalAuditEvidence(page, testInfo, name) {
  await page.screenshot({
    path: testInfo.outputPath(`csa-${name}.png`),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
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

test("border-semantic-width-geometry", async ({ page }) => {
  await prepareLightFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-operations",
    viewport: desktop,
    ready: '[role="tablist"]',
  });

  await page.getByRole("tab", { name: "运行中心" }).click();
  const selectedRun = page
    .locator('[data-slot="ops-rail"] button[aria-pressed="true"]')
    .first();
  await expect(selectedRun).toBeVisible();
  expect(
    await selectedRun.evaluate(
      (element) => getComputedStyle(element).borderInlineStartWidth,
    ),
  ).toBe("2px");

  await prepareLightFixture(page, {
    workspace: "blog",
    brand: "blog",
    fixture: "blog-article-detail",
    viewport: desktop,
    ready: "#public-main",
  });

  const readingQuote = page.locator("#public-main blockquote").first();
  await expect(readingQuote).toBeVisible();
  expect(
    await readingQuote.evaluate(
      (element) => getComputedStyle(element).borderInlineStartWidth,
    ),
  ).toBe("4px");
});

for (const mode of ["light", "dark"]) {
  test(`color-browser-theme-meta-${mode}`, async ({ page }) => {
    const scenario = {
      workspace: "blog",
      brand: "blog",
      fixture: "blog-home",
      viewport: desktop,
      ready: "#public-main",
    };

    if (mode === "light") {
      await prepareLightFixture(page, scenario);
    } else {
      await prepareDarkFixture(page, scenario);
    }

    const colors = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        meta:
          document
            .querySelector('meta[name="theme-color"]')
            ?.getAttribute("content") ?? "",
        background: getComputedStyle(root)
          .getPropertyValue("--background")
          .trim(),
      };
    });

    expect(colors.background).not.toBe("");
    expect(colors.meta).toBe(colors.background);
  });
}

test("focus-canonical-fallback-and-component-ring", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-button",
    viewport: desktop,
    ready: '[data-slot="button"]:visible',
  });

  const owned = page.locator('[data-slot="button"]:visible').first();
  const restingBoxShadow = await owned.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );

  await page.keyboard.press("Tab");
  await owned.focus();
  const ownedStyle = await owned.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      focusVisible: element.matches(":focus-visible"),
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      boxShadow: style.boxShadow,
    };
  });

  expect(ownedStyle.focusVisible).toBe(true);
  expect(ownedStyle.outlineStyle).toBe("none");
  expect(ownedStyle.boxShadow).not.toBe(restingBoxShadow);
  await captureCanonicalAuditEvidence(
    page,
    testInfo,
    "core-focus-component-owned",
  );

  await page.evaluate(() => {
    const probe = document.createElement("button");
    probe.id = "focus-foundation-fallback";
    probe.type = "button";
    probe.textContent = "Focus fallback probe";
    probe.style.position = "fixed";
    probe.style.right = "24px";
    probe.style.bottom = "24px";
    document.body.appendChild(probe);
  });

  const fallback = page.locator("#focus-foundation-fallback");
  await fallback.focus();
  const fallbackStyle = await fallback.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      focusVisible: element.matches(":focus-visible"),
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      outlineOffset: style.outlineOffset,
    };
  });

  expect(fallbackStyle.focusVisible).toBe(true);
  expect(fallbackStyle.outlineStyle).toBe("solid");
  expect(fallbackStyle.outlineWidth).toBe("2px");
  expect(fallbackStyle.outlineOffset).toBe("2px");

  await captureCanonicalAuditEvidence(
    page,
    testInfo,
    "core-focus-fallback",
  );
});

test("overlay-semantic-modal-popup-ordering", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-modal",
    viewport: desktop,
    ready: '[data-slot="button"]:visible',
  });

  await page.getByRole("button", { name: "打开嵌套层级示例" }).click();
  const dialog = page.getByRole("dialog", { name: "Modal 内嵌浮层" });
  await expect(dialog).toBeVisible();

  const overlay = page.locator('[data-slot="dialog-overlay"]').last();
  await expect(overlay).toBeVisible();

  const modalLayers = await Promise.all([
    dialog.evaluate((element) => Number(getComputedStyle(element).zIndex)),
    overlay.evaluate((element) => Number(getComputedStyle(element).zIndex)),
  ]);
  expect(modalLayers).toEqual([50, 50]);

  await dialog
    .getByRole("button", { name: "打开 Modal 内 Popover" })
    .click();
  const popover = page.locator('[data-slot="popover-content"]').last();
  await expect(popover).toBeVisible();

  const popupLayer = await popover.evaluate((element) =>
    Number(getComputedStyle(element).zIndex),
  );
  expect(popupLayer).toBe(60);
  expect(popupLayer).toBeGreaterThan(modalLayers[0]);

  await captureCanonicalAuditEvidence(
    page,
    testInfo,
    "core-modal-nested-popover",
  );
});

test("accessibility-form-select-and-overlay-ownership", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-form",
    viewport: desktop,
    ready: '[data-slot="select"]',
  });

  const status = page.getByRole("combobox", { name: "发布状态" });
  await expect(status).toHaveAttribute("aria-required", "true");
  await expect(status).toHaveAttribute("aria-labelledby", /-label(?:\s|$)/);
  await expect(status).toHaveAttribute("aria-describedby", /-hint/);

  await status.click();
  await captureCanonicalAuditEvidence(
    page,
    testInfo,
    "core-form-select-open",
  );
  await page.getByRole("option", { name: "已发布" }).click();
  await expect(status).toContainText("已发布");

  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-modal",
    viewport: desktop,
    ready: 'button:has-text("打开 Modal")',
  });

  const trigger = page.getByRole("button", { name: "打开 Modal" });
  await trigger.focus();
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "编辑资料" });
  await expect(dialog).toBeVisible();
  await captureCanonicalAuditEvidence(
    page,
    testInfo,
    "core-modal-focus-trap",
  );

  await expect
    .poll(() =>
      dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    )
    .toBe(true);

  for (let index = 0; index < 5; index += 1) {
    await page.keyboard.press("Tab");
    await expect
      .poll(() =>
        dialog.evaluate((element) =>
          element.contains(document.activeElement),
        ),
      )
      .toBe(true);
  }

  const close = dialog.getByRole("button", { name: "关闭" });
  await expect(close).toBeVisible();
  await close.click();

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("accessibility-app-shell-skip-link-and-landmarks", async ({ page }) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "gouno-app-shell",
    viewport: desktop,
    ready: '[data-slot="app-shell"]',
  });

  const shell = page.locator('[data-slot="app-shell"]').first();
  const navigation = shell.getByRole("navigation", {
    name: "示例应用导航",
  });
  await expect(navigation).toBeVisible();

  const skip = shell
    .locator('a[href^="#app-shell-main-"]')
    .filter({ hasText: "跳至主要内容" })
    .first();
  const href = await skip.getAttribute("href");
  expect(href).toMatch(/^#app-shell-main-/);

  const main = shell.locator(href).first();
  await expect(main).toHaveAttribute("tabindex", "-1");

  await skip.focus();
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(main).toBeFocused();
});

test("showcase-config-provider-visibly-proves-locale-ownership", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-config-provider",
    viewport: desktop,
    ready: '[data-slot="card"]',
  });

  await expect(page.getByText("zh-CN Provider", { exact: true })).toBeVisible();
  await expect(page.getByText("en-US Provider", { exact: true })).toBeVisible();

  const zhSelect = page.getByRole("combobox", {
    name: "中文 Provider 默认 Select",
  });
  const enSelect = page.getByRole("combobox", {
    name: "English provider default Select",
  });
  await expect(zhSelect).toContainText("请选择");
  await expect(enSelect).toContainText("Please select");

  await expect(page.getByRole("button", { name: "上一页" })).toContainText(
    "上一页",
  );
  await expect(page.getByRole("button", { name: "Previous" })).toContainText(
    "Previous",
  );

  await expect(
    page.getByRole("combobox", { name: "中文 Provider 业务覆盖 Select" }),
  ).toContainText("业务自定义占位文案");
  await expect(
    page.getByRole("combobox", {
      name: "English provider product override Select",
    }),
  ).toContainText("Product-owned placeholder");

  const localeSection = page
    .getByRole("heading", {
      name: "中英文 Provider 可见对照与显式覆盖",
    })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  await expect(localeSection).toBeVisible();
  await localeSection.screenshot({
    path: testInfo.outputPath("csa-core-config-provider-locales.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("interaction-carousel-arrows-remain-clickable-while-draggable", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-carousel",
    viewport: desktop,
    ready: '[data-slot="carousel"]',
  });

  const carousel = page.locator('[data-slot="carousel"]').first();
  const dots = carousel.locator('[data-slot="carousel-dot"]');
  await expect(dots).toHaveCount(3);
  await expect(dots.nth(0)).toHaveAttribute("aria-selected", "true");

  await carousel.locator('[data-slot="carousel-next-arrow"]').click();
  await expect(dots.nth(1)).toHaveAttribute("aria-selected", "true");
  await captureCanonicalAuditEvidence(
    page,
    testInfo,
    "core-carousel-after-next",
  );

  await carousel.locator('[data-slot="carousel-prev-arrow"]').click();
  await expect(dots.nth(0)).toHaveAttribute("aria-selected", "true");
});

test("motion-reduced-preference-collapses-carousel-movement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-carousel",
    viewport: desktop,
    ready: '[data-slot="carousel"]',
  });

  const carousels = page.locator('[data-slot="carousel"]');
  await expect(carousels).toHaveCount(2);

  const scrollTrack = carousels
    .nth(0)
    .locator('[data-slot="carousel-track"]');
  const fadeSlides = carousels
    .nth(1)
    .locator('[data-slot="carousel-slide"]');
  const autoplayTabs = carousels
    .nth(1)
    .locator('[data-slot="carousel-dot"]');

  expect(
    await scrollTrack.evaluate(
      (element) => getComputedStyle(element).transitionDuration,
    ),
  ).toBe("0s");
  expect(
    await fadeSlides
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe("0s");

  const selectedBefore = await autoplayTabs.evaluateAll((nodes) =>
    nodes.findIndex((node) => node.getAttribute("aria-selected") === "true"),
  );
  expect(selectedBefore).toBeGreaterThanOrEqual(0);
  await page.waitForTimeout(4200);
  const selectedAfter = await autoplayTabs.evaluateAll((nodes) =>
    nodes.findIndex((node) => node.getAttribute("aria-selected") === "true"),
  );
  expect(selectedAfter).toBe(selectedBefore);
  await expect(
    carousels.nth(1).locator('[data-slot="carousel-dot"] > span'),
  ).toHaveCount(0);
});

test("responsive-steps-canonical-md-stacking", async ({ page }, testInfo) => {
  const scenario = {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-steps",
    viewport: { width: 600, height: 900 },
    ready: '[data-slot="steps"]',
  };

  await prepareLightFixture(page, scenario);
  const steps = page.locator('[data-slot="steps"]').first();
  expect(
    await steps.evaluate((element) => getComputedStyle(element).flexDirection),
  ).toBe("column");

  const mobileItem = steps.locator('[data-slot="steps-item"]').first();
  const mobileMarker = mobileItem.locator('[data-slot="steps-marker"]');
  const mobileTitle = mobileItem.locator('[data-slot="steps-title"]');
  const mobileConnector = mobileItem.locator(
    '[data-slot="steps-connector"][data-layout="mobile-vertical"]:visible',
  );
  const [mobileMarkerBox, mobileTitleBox, mobileConnectorBox] =
    await Promise.all([
      mobileMarker.boundingBox(),
      mobileTitle.boundingBox(),
      mobileConnector.boundingBox(),
    ]);
  expect(mobileMarkerBox).not.toBeNull();
  expect(mobileTitleBox).not.toBeNull();
  expect(mobileConnectorBox).not.toBeNull();
  expect(
    Math.abs(
      mobileConnectorBox.x +
        mobileConnectorBox.width / 2 -
        (mobileMarkerBox.x + mobileMarkerBox.width / 2),
    ),
  ).toBeLessThanOrEqual(2);
  expect(mobileConnectorBox.y).toBeGreaterThanOrEqual(
    mobileMarkerBox.y + mobileMarkerBox.height,
  );
  expect(mobileTitleBox.x).toBeGreaterThan(
    mobileMarkerBox.x + mobileMarkerBox.width,
  );
  await captureCanonicalAuditEvidence(
    page,
    testInfo,
    "core-steps-mobile-stack",
  );

  await page.setViewportSize({ width: 700, height: 900 });
  await expect
    .poll(() =>
      steps.evaluate((element) => getComputedStyle(element).flexDirection),
    )
    .toBe("column");
  await expectNoHorizontalDocumentOverflow(page);
  await captureCanonicalAuditEvidence(
    page,
    testInfo,
    "core-steps-intermediate-stack",
  );

  await page.setViewportSize({ width: 800, height: 900 });
  await expect
    .poll(() =>
      steps.evaluate((element) => getComputedStyle(element).flexDirection),
    )
    .toBe("row");

  const securityTitle = steps
    .locator('[data-slot="steps-title"]')
    .filter({ hasText: "Security" });
  await expect(securityTitle).toHaveCount(1);
  expect(
    await securityTitle.evaluate(
      (element) => element.scrollWidth <= element.clientWidth + 1,
    ),
  ).toBe(true);

  const desktopItem = steps.locator('[data-slot="steps-item"]').first();
  const desktopMarker = desktopItem.locator('[data-slot="steps-marker"]');
  const desktopTitle = desktopItem.locator('[data-slot="steps-title"]');
  const desktopConnector = desktopItem.locator(
    '[data-slot="steps-connector"][data-layout="desktop-inline"]:visible',
  );
  const [desktopMarkerBox, desktopTitleBox, desktopConnectorBox] =
    await Promise.all([
      desktopMarker.boundingBox(),
      desktopTitle.boundingBox(),
      desktopConnector.boundingBox(),
    ]);
  expect(desktopMarkerBox).not.toBeNull();
  expect(desktopTitleBox).not.toBeNull();
  expect(desktopConnectorBox).not.toBeNull();
  expect(desktopConnectorBox.x).toBeGreaterThan(
    desktopTitleBox.x + desktopTitleBox.width,
  );
  expect(
    Math.abs(
      desktopConnectorBox.y +
        desktopConnectorBox.height / 2 -
        (desktopMarkerBox.y + desktopMarkerBox.height / 2),
    ),
  ).toBeLessThanOrEqual(2);
  await captureCanonicalAuditEvidence(
    page,
    testInfo,
    "core-steps-desktop-inline",
  );

  await page.setViewportSize({ width: 1024, height: 900 });
  await expect
    .poll(() =>
      steps.evaluate((element) => getComputedStyle(element).flexDirection),
    )
    .toBe("row");
  expect(
    await securityTitle.evaluate(
      (element) => element.scrollWidth <= element.clientWidth + 1,
    ),
  ).toBe(true);
  await steps.screenshot({
    path: testInfo.outputPath("csa-core-steps-shell-constrained.png"),
    animations: "disabled",
    caret: "hide",
  });

  const verticalDot = page.locator(
    '[data-slot="steps"][data-type="dot"][data-orientation="vertical"]',
  ).last();
  const dotItem = verticalDot.locator('[data-slot="steps-item"]').first();
  const dotMarker = dotItem.locator('[data-slot="steps-marker"]');
  const dotTitle = dotItem.locator('[data-slot="steps-title"]');
  const dotConnector = dotItem.locator(
    '[data-slot="steps-connector"][data-layout="vertical"]:visible',
  );
  const [dotMarkerBox, dotTitleBox, dotConnectorBox] = await Promise.all([
    dotMarker.boundingBox(),
    dotTitle.boundingBox(),
    dotConnector.boundingBox(),
  ]);
  expect(dotMarkerBox).not.toBeNull();
  expect(dotTitleBox).not.toBeNull();
  expect(dotConnectorBox).not.toBeNull();
  expect(
    Math.abs(
      dotConnectorBox.x +
        dotConnectorBox.width / 2 -
        (dotMarkerBox.x + dotMarkerBox.width / 2),
    ),
  ).toBeLessThanOrEqual(2);
  expect(dotConnectorBox.y).toBeGreaterThanOrEqual(
    dotMarkerBox.y + dotMarkerBox.height,
  );
  expect(dotTitleBox.x).toBeGreaterThan(dotMarkerBox.x + dotMarkerBox.width);

  await verticalDot.scrollIntoViewIfNeeded();
  await verticalDot.screenshot({
    path: testInfo.outputPath("csa-core-steps-vertical-dot.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("surface-gosso-overview-quick-link-card-ownership", async ({ page }) => {
  const scenario = {
    workspace: "gosso-admin",
    brand: "gosso-admin",
    fixture: "gosso-overview",
    viewport: desktop,
    ready: '[data-slot="card"]',
  };
  await prepareLightFixture(page, scenario);

  const link = page
    .getByText("客户端注册", { exact: true })
    .locator("xpath=ancestor::a[1]");
  const card = link.locator('[data-slot="card"]');

  const [linkStyle, cardStyle, linkBox, cardBox] = await Promise.all([
    link.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        borderTopWidth: style.borderTopWidth,
        boxShadow: style.boxShadow,
        display: style.display,
      };
    }),
    card.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        borderTopWidth: style.borderTopWidth,
        boxShadow: style.boxShadow,
        display: style.display,
      };
    }),
    link.boundingBox(),
    card.boundingBox(),
  ]);

  expect(linkStyle).toEqual({
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderTopWidth: "0px",
    boxShadow: "none",
    display: "block",
  });
  expect(cardStyle.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(cardStyle.borderTopWidth).toBe("1px");
  expect(cardStyle.boxShadow).not.toBe("none");
  expect(cardStyle.display).toBe("flex");

  expect(linkBox).not.toBeNull();
  expect(cardBox).not.toBeNull();
  expect(cardBox?.width).toBeCloseTo(linkBox?.width ?? 0, 1);
  expect(cardBox?.height).toBeCloseTo(linkBox?.height ?? 0, 1);
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
