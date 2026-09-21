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
  expect(
    await steps.evaluate(
      (element) => element.scrollWidth > element.clientWidth + 1,
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

test("csa-core-select-popup-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-select",
    viewport: desktop,
    ready: '[data-slot="select"]',
  });

  const baseDemo = page
    .getByRole("heading", { level: 3, name: "基础用法" })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const root = baseDemo.locator('[data-slot="select"]').first();
  const nativeSelect = root.locator('select[aria-hidden="true"]');
  await expect(nativeSelect).toHaveCount(1);
  expect(
    await nativeSelect.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        opacity: style.opacity,
        pointerEvents: style.pointerEvents,
      };
    }),
  ).toEqual({ opacity: "0", pointerEvents: "none" });

  const trigger = root.getByRole("combobox");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const list = page.locator('[data-slot="select-list"]:visible');
  await expect(list).toHaveCount(1);
  await expect(list.getByRole("option", { name: "选项一" })).toBeVisible();
  await expect(list.getByRole("option", { name: "选项二" })).toBeVisible();
  await captureCanonicalAuditEvidence(page, testInfo, "core-select-popup");
});

test("csa-core-cascader-popup-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-cascader",
    viewport: desktop,
    ready: '[data-slot="cascader"]',
  });

  const root = page.locator('[data-slot="cascader"]').first();
  await expect(root.locator("select")).toHaveCount(0);
  const trigger = root.getByRole("combobox", { name: "地区" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  const columns = page.locator('[data-slot="cascader-column"]');
  await expect(columns).toHaveCount(3);
  await page.getByRole("option", { name: "上海" }).click();
  await expect(page.getByRole("option", { name: "浦东" })).toBeVisible();
  await expect(columns).toHaveCount(3);
  await captureCanonicalAuditEvidence(page, testInfo, "core-cascader-columns");
});

test("csa-core-tree-select-popup-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-tree-select",
    viewport: desktop,
    ready: '[data-slot="tree-select-root"]',
  });

  const roots = page.locator('[data-slot="tree-select-root"]');
  await expect(roots).toHaveCount(2);

  const singleRoot = roots.nth(0);
  const singleNative = singleRoot.locator('select[aria-hidden="true"]');
  await expect(singleNative).toHaveCount(1);
  expect(
    await singleNative.evaluate((element) => getComputedStyle(element).opacity),
  ).toBe("0");

  const singleTrigger = singleRoot.getByRole("combobox", { name: "主分区" });
  await singleTrigger.click();
  await expect(singleTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("treeitem", { name: /文档/ })).toBeVisible();
  await expect(page.getByRole("treeitem", { name: /指南/ })).toBeVisible();
  await captureCanonicalAuditEvidence(
    page,
    testInfo,
    "core-tree-select-single-popup",
  );

  await page.keyboard.press("Escape");
  const multipleRoot = roots.nth(1);
  const multipleTrigger = multipleRoot.getByRole("combobox", {
    name: "关联主题",
  });
  await multipleTrigger.click();
  await expect(multipleTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("treeitem", { name: /API/ })).toBeVisible();
  await captureCanonicalAuditEvidence(
    page,
    testInfo,
    "core-tree-select-multiple-popup",
  );
});

test("csa-core-dropdown-popup-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-dropdown",
    viewport: desktop,
    ready: '[data-slot="dropdown-menu-trigger"]',
  });

  await page.getByRole("button", { name: "更多操作" }).click();
  const content = page.locator('[data-slot="dropdown-menu-content"]').last();
  await expect(content).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "编辑" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "删除" })).toBeVisible();
  await captureCanonicalAuditEvidence(page, testInfo, "core-dropdown-popup");
});

test("csa-core-popover-popup-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-popover",
    viewport: desktop,
    ready: '[data-slot="popover-trigger"]',
  });

  await page.getByRole("button", { name: "打开 Popover" }).click();
  const content = page.locator('[data-slot="popover-content"]').last();
  await expect(content).toBeVisible();
  await expect(content.getByText("批量操作说明", { exact: true })).toBeVisible();
  await captureCanonicalAuditEvidence(page, testInfo, "core-popover-popup");
});

test("csa-core-drawer-overlay-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-drawer",
    viewport: desktop,
    ready: 'button:has-text("打开 Drawer")',
  });

  const trigger = page.getByRole("button", { name: "打开 Drawer" }).first();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "筛选条件" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByPlaceholder("搜索")).toBeVisible();
  await expectNoHorizontalDocumentOverflow(page);
  await captureCanonicalAuditEvidence(page, testInfo, "core-drawer-open");
});

test("csa-core-tabs-interaction-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-tabs",
    viewport: desktop,
    ready: '[role="tablist"]',
  });

  const tablist = page.getByRole("tablist", { name: "工作区栏目" });
  const overview = tablist.getByRole("tab", { name: "概览" });
  const reports = tablist.getByRole("tab", { name: "报告" });
  await expect(overview).toHaveAttribute("aria-selected", "true");
  await reports.click();
  await expect(reports).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("浏览已生成的分析报告。", { exact: true })).toBeVisible();
  await captureCanonicalAuditEvidence(page, testInfo, "core-tabs-reports-active");
});

test("csa-core-menu-interaction-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-menu",
    viewport: desktop,
    ready: 'nav[aria-label="Workspace navigation"]',
  });

  const menu = page.getByRole("navigation", { name: "Workspace navigation" });
  const workspace = menu.getByRole("menuitem", { name: /Workspace/ });
  await expect(workspace).toHaveAttribute("aria-expanded", "true");
  const roles = menu.getByRole("menuitem", { name: "Roles" });
  await roles.click();
  await expect(roles).toHaveAttribute("aria-current", "page");
  await captureCanonicalAuditEvidence(page, testInfo, "core-menu-inline-selection");
});

test("csa-core-collapse-interaction-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-collapse",
    viewport: desktop,
    ready: '[data-slot="collapse"]',
  });

  const publicApi = page.getByRole("button", { name: /Public API/ });
  const behavior = page.getByRole("button", { name: /Interaction behavior/ });
  await expect(publicApi).toHaveAttribute("aria-expanded", "true");
  await behavior.click();
  await expect(behavior).toHaveAttribute("aria-expanded", "true");
  await expect(publicApi).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText("Accordion mode keeps exactly one panel active at a time.")).toBeVisible();
  await captureCanonicalAuditEvidence(page, testInfo, "core-collapse-accordion");
});

test("csa-core-pagination-interaction-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-pagination",
    viewport: desktop,
    ready: 'nav[aria-label="Pagination"]',
  });

  const baseDemo = page
    .getByRole("heading", { level: 3, name: "基础用法" })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const pagination = baseDemo.getByRole("navigation", { name: "Pagination" });
  const page6 = pagination.locator('button[aria-current="page"]');
  await expect(page6).toContainText("6");
  const page7 = pagination.locator("button").filter({ hasText: /^7$/ });
  await expect(page7).toHaveCount(1);
  await page7.click();
  await expect(page7).toHaveAttribute("aria-current", "page");
  await captureCanonicalAuditEvidence(page, testInfo, "core-pagination-page-7");
});

test("csa-core-breadcrumb-menu-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-breadcrumb",
    viewport: desktop,
    ready: 'nav[aria-label="Breadcrumb"]',
  });

  const trigger = page.getByRole("button", { name: "Choose project" });
  await trigger.click();
  await expect(page.getByRole("menuitem", { name: "Gouno UI" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Gosso" })).toBeVisible();
  await captureCanonicalAuditEvidence(page, testInfo, "core-breadcrumb-project-menu");
});

test("csa-core-anchor-hash-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-anchor",
    viewport: desktop,
    ready: 'nav[aria-label="示例文章目录"]',
  });

  const anchor = page.getByRole("navigation", { name: "示例文章目录" });
  const contract = anchor.getByRole("link", { name: "交互契约" });
  await expect(contract).toHaveAttribute("href", "#anchor-contract");
  await contract.click();
  await expect
    .poll(() => page.evaluate(() => window.location.hash))
    .toBe("#anchor-contract");
  await expect(page.locator("#anchor-contract")).toBeVisible();
  await captureCanonicalAuditEvidence(page, testInfo, "core-anchor-contract-hash");
});


test("csa-core-alert-feedback-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-alert",
    viewport: desktop,
    ready: '[data-slot="alert"]',
  });

  for (const title of [
    "操作成功",
    "有一条新的系统信息",
    "配置即将过期",
    "保存失败，请检查输入",
  ]) {
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  }

  const lifecycleCard = page
    .getByRole("heading", { level: 3, name: "操作与关闭生命周期" })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  await expect(lifecycleCard.getByText("可关闭通知", { exact: true })).toBeVisible();
  await captureCanonicalAuditEvidence(page, testInfo, "core-alert-semantic-states");

  await lifecycleCard.getByRole("button", { name: "关闭通知" }).click();
  await expect(lifecycleCard.getByText("已关闭", { exact: true })).toBeVisible();
  await lifecycleCard.getByRole("button", { name: "重新显示" }).click();
  await expect(lifecycleCard.getByText("可关闭通知", { exact: true })).toBeVisible();
  await lifecycleCard.screenshot({
    path: testInfo.outputPath("csa-core-alert-closable-reset.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-popconfirm-feedback-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-popconfirm",
    viewport: desktop,
    ready: 'button:has-text("删除版本")',
  });

  await page.getByRole("button", { name: "删除版本" }).click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("确认删除这个版本？", { exact: true })).toBeVisible();
  await expect(dialog.getByText("删除后无法恢复。", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "删除" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "取消" })).toBeVisible();
  await captureCanonicalAuditEvidence(page, testInfo, "core-popconfirm-danger-open");
});

test("csa-core-message-feedback-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-message",
    viewport: desktop,
    ready: 'button:has-text("成功")',
  });

  await page.getByRole("button", { name: "成功", exact: true }).click();
  await page.getByRole("button", { name: "错误", exact: true }).click();
  await expect(page.getByText("配置已保存", { exact: true })).toBeVisible();
  await expect(page.getByText("保存失败", { exact: true })).toBeVisible();

  const tools = page.getByRole("region", { name: "Showcase 工具" });
  const messageRegion = page.locator('[data-slot="message-region"]');
  const [toolsBox, messageBox] = await Promise.all([
    tools.boundingBox(),
    messageRegion.boundingBox(),
  ]);
  expect(toolsBox).not.toBeNull();
  expect(messageBox).not.toBeNull();
  expect(messageBox.y).toBeGreaterThanOrEqual(
    toolsBox.y + toolsBox.height + 15,
  );

  await captureCanonicalAuditEvidence(page, testInfo, "core-message-success-error");
});

test("csa-core-notification-feedback-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-notification",
    viewport: desktop,
    ready: 'button:has-text("成功通知")',
  });

  await page.getByRole("button", { name: "成功通知" }).click();
  await page.getByRole("button", { name: "错误通知" }).click();
  await page.getByRole("button", { name: "持久通知" }).click();
  await expect(page.getByText("构建完成", { exact: true })).toBeVisible();
  await expect(page.getByText("构建失败", { exact: true })).toBeVisible();
  await expect(page.getByText("需要人工确认", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "关闭持久通知" })).toBeVisible();

  const tools = page.getByRole("region", { name: "Showcase 工具" });
  const notificationRegion = page
    .locator('[data-slot="notification-region"]')
    .filter({ hasText: "构建完成" });
  await expect(notificationRegion).toHaveCount(1);
  const [toolsBox, notificationBox] = await Promise.all([
    tools.boundingBox(),
    notificationRegion.boundingBox(),
  ]);
  expect(toolsBox).not.toBeNull();
  expect(notificationBox).not.toBeNull();
  expect(notificationBox.y).toBeGreaterThanOrEqual(
    toolsBox.y + toolsBox.height + 15,
  );

  await captureCanonicalAuditEvidence(page, testInfo, "core-notification-mixed-stack");
});

test("csa-core-empty-feedback-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-empty",
    viewport: desktop,
    ready: '[data-slot="empty"]',
  });

  const empty = page.locator('[data-slot="empty"]').first();
  await expect(empty.getByText("暂无匹配内容", { exact: true })).toBeVisible();
  await expect(empty.getByText("调整筛选条件，或清除筛选后继续浏览。", { exact: true })).toBeVisible();
  await expect(empty.getByRole("button", { name: "清除筛选" })).toBeVisible();
  const card = empty.locator('xpath=ancestor::*[@data-slot="card"][1]');
  await card.screenshot({
    path: testInfo.outputPath("csa-core-empty-contained-state.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-result-feedback-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-result",
    viewport: desktop,
    ready: '[data-slot="result"]',
  });

  const result = page.locator('[data-slot="result"]').first();
  await expect(result).toHaveAttribute("data-status", "success");
  await expect(result.getByText("操作成功", { exact: true })).toBeVisible();
  await expect(result.getByText("数据已经保存，可以返回列表继续处理。", { exact: true })).toBeVisible();
  await expect(result.getByRole("button", { name: "返回列表" })).toBeVisible();
  await result.screenshot({
    path: testInfo.outputPath("csa-core-result-success-state.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-spin-feedback-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-spin",
    viewport: desktop,
    ready: '[data-slot="spin"]',
  });

  const spin = page.locator('[data-slot="spin"]').first();
  await expect(spin).toHaveAttribute("aria-busy", "true");
  await expect(spin.locator('[data-slot="spin-overlay"]')).toBeVisible();
  await expect(spin.getByText("正在刷新内容", { exact: true })).toBeVisible();
  await expect(spin.getByText("已有内容在后台刷新时仍保留。", { exact: true })).toBeVisible();
  await spin.screenshot({
    path: testInfo.outputPath("csa-core-spin-busy-overlay.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-progress-state-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-progress",
    viewport: desktop,
    ready: '[data-slot="progress"]',
  });

  const progress = page.getByRole("progressbar", { name: "上传进度" });
  await expect(progress).toHaveAttribute("aria-valuenow", "64");
  await expect(page.getByText("已完成 64%", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "增加" }).click();
  await expect(progress).toHaveAttribute("aria-valuenow", "74");
  await expect(page.getByText("已完成 74%", { exact: true })).toBeVisible();

  const indicator = progress.locator('[data-slot="progress-indicator"]');
  await expect(indicator).toHaveCSS("width", /.+/);

  const card = progress.locator('xpath=ancestor::*[@data-slot="card"][1]');
  await card.screenshot({
    path: testInfo.outputPath("csa-core-progress-after-increase.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-skeleton-loading-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-skeleton",
    viewport: desktop,
    ready: '[data-slot="skeleton"]',
  });

  const loading = page.getByRole("status", { name: "文章列表加载中" });
  await expect(loading).toBeVisible();
  await expect(loading.locator('[data-slot="card"]')).toHaveCount(2);

  const skeletons = loading.locator('[data-slot="skeleton"]');
  await expect(skeletons).toHaveCount(8);
  expect(
    await skeletons.evaluateAll((elements) =>
      elements.every((element) => element.getAttribute("aria-hidden") === "true"),
    ),
  ).toBe(true);

  await loading.screenshot({
    path: testInfo.outputPath("csa-core-skeleton-loading-grid.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-tooltip-keyboard-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-tooltip",
    viewport: desktop,
    ready: 'button:has-text("聚焦或悬停")',
  });

  const trigger = page.getByRole("button", { name: "聚焦或悬停" });
  await trigger.focus();
  await expect(trigger).toBeFocused();

  const tooltip = page.locator('[data-slot="tooltip-content"]');
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toContainText("补充说明");

  const [triggerBox, tooltipBox] = await Promise.all([
    trigger.boundingBox(),
    tooltip.boundingBox(),
  ]);
  expect(triggerBox).not.toBeNull();
  expect(tooltipBox).not.toBeNull();
  expect(tooltipBox.y).toBeGreaterThan(triggerBox.y + triggerBox.height);

  await captureCanonicalAuditEvidence(
    page,
    testInfo,
    "core-tooltip-keyboard-open",
  );
});

test("csa-core-tour-walkthrough-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-tour",
    viewport: desktop,
    ready: 'button:has-text("开始引导")',
  });

  const trigger = page.getByRole("button", { name: "开始引导" });
  await trigger.click();

  const first = page.getByRole("dialog", { name: "欢迎" });
  await expect(first).toBeVisible();
  await expect(first).toHaveAttribute("data-step-index", "0");
  await expect(first.getByText("这是第一步。", { exact: true })).toBeVisible();
  await expect(first.locator('[data-slot="tour-progress"]')).toHaveText("1 / 2");
  await expect(first.getByRole("button", { name: "下一步" })).toBeVisible();
  await captureCanonicalAuditEvidence(page, testInfo, "core-tour-step-1");

  await first.getByRole("button", { name: "下一步" }).click();
  const second = page.getByRole("dialog", { name: "组件目录" });
  await expect(second).toBeVisible();
  await expect(second).toHaveAttribute("data-step-index", "1");
  await expect(
    second.getByText("从左侧选择组件。", { exact: true }),
  ).toBeVisible();
  await expect(second.locator('[data-slot="tour-progress"]')).toHaveText("2 / 2");
  await expect(second.getByRole("button", { name: "上一步" })).toBeVisible();
  await expect(second.getByRole("button", { name: "完成" })).toBeVisible();
  await captureCanonicalAuditEvidence(page, testInfo, "core-tour-step-2");

  await second.getByRole("button", { name: "完成" }).click();
  await expect(second).toBeHidden();
  await expect(trigger).toBeFocused();
});


test("csa-core-checkbox-selection-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-checkbox",
    viewport: desktop,
    ready: 'input[type="checkbox"]',
  });

  const checkbox = page.getByRole("checkbox", { name: "接受条款" });
  await expect(checkbox).toBeChecked();
  await expect(page.getByText("当前：已接受", { exact: true })).toBeVisible();

  await checkbox.click();
  await expect(checkbox).not.toBeChecked();
  await expect(page.getByText("当前：未接受", { exact: true })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "已锁定选项" })).toBeDisabled();

  await captureCanonicalAuditEvidence(page, testInfo, "core-checkbox-unchecked");
});

test("csa-core-radio-selection-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-radio",
    viewport: desktop,
    ready: 'input[type="radio"]',
  });

  const basic = page.getByRole("radio", { name: "基础版" });
  const pro = page.getByRole("radio", { name: "专业版" });
  await expect(basic).toBeChecked();
  await expect(pro).not.toBeChecked();

  await pro.click();
  await expect(pro).toBeChecked();
  await expect(basic).not.toBeChecked();
  await expect(page.getByText("当前：专业版", { exact: true })).toBeVisible();
  await expect(page.getByRole("radio", { name: "旧套餐" })).toBeDisabled();

  await captureCanonicalAuditEvidence(page, testInfo, "core-radio-pro-selected");
});

test("csa-core-switch-selection-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-switch",
    viewport: desktop,
    ready: '[role="switch"]',
  });

  const notifications = page.getByRole("switch", { name: "启用通知" });
  await expect(notifications).toBeChecked();
  await expect(page.getByText("通知：开启", { exact: true })).toBeVisible();

  await notifications.locator("xpath=ancestor::label[1]").click();
  await expect(notifications).not.toBeChecked();
  await expect(page.getByText("通知：关闭", { exact: true })).toBeVisible();
  await expect(page.getByRole("switch", { name: "系统策略" })).toBeDisabled();

  await captureCanonicalAuditEvidence(page, testInfo, "core-switch-off");
});

test("csa-core-segmented-selection-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-segmented",
    viewport: desktop,
    ready: '[data-slot="segmented"]',
  });

  const group = page.getByRole("radiogroup", { name: "时间范围" });
  const weekly = group.getByRole("radio", { name: "周" });
  const monthly = group.getByRole("radio", { name: "月" });
  await expect(weekly).toBeChecked();
  await expect(monthly).not.toBeChecked();

  await monthly.locator("xpath=ancestor::label[1]").click();
  await expect(monthly).toBeChecked();
  await expect(weekly).not.toBeChecked();

  await captureCanonicalAuditEvidence(page, testInfo, "core-segmented-month-selected");
});

test("csa-core-slider-keyboard-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-slider",
    viewport: desktop,
    ready: '[data-slot="slider"]',
  });

  const volume = page.getByRole("slider", { name: "音量" });
  await expect(volume).toHaveValue("40");
  await expect(page.getByText("音量：40", { exact: true })).toBeVisible();

  await volume.focus();
  await volume.press("ArrowRight");
  await expect(volume).toHaveValue("45");
  await expect(page.getByText("音量：45", { exact: true })).toBeVisible();
  await expect(page.getByRole("slider", { name: "锁定范围" })).toBeDisabled();

  await captureCanonicalAuditEvidence(page, testInfo, "core-slider-keyboard-45");
});

test("csa-core-rate-selection-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-rate",
    viewport: desktop,
    ready: '[data-slot="rate"]',
  });

  const group = page.getByRole("radiogroup", { name: "满意度" });
  await expect(group.getByRole("radio", { name: "3" })).toHaveAttribute("aria-checked", "true");

  const five = group.getByRole("radio", { name: "5" });
  await five.click();
  await expect(five).toHaveAttribute("aria-checked", "true");
  await expect(page.getByText("当前：5", { exact: true })).toBeVisible();

  const disabled = page.getByRole("radiogroup", { name: "只读评分示例" });
  await expect(disabled).toHaveAttribute("aria-disabled", "true");

  await captureCanonicalAuditEvidence(page, testInfo, "core-rate-five-selected");
});

test("csa-core-input-otp-entry-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-input-otp",
    viewport: desktop,
    ready: '[data-slot="input-otp"]',
  });

  const group = page.getByRole("group", { name: "短信验证码" });
  const digits = group.locator('[data-slot="input-otp-input"]');
  await expect(digits).toHaveCount(6);
  await digits.nth(0).focus();
  await page.keyboard.type("123456");

  await expect(digits.nth(0)).toHaveValue("1");
  await expect(digits.nth(5)).toHaveValue("6");
  await expect(page.getByText("当前输入 6 / 6 位", { exact: true })).toBeVisible();

  const locked = page.getByRole("group", { name: "已锁定验证码" });
  await expect(locked).toHaveAttribute("aria-disabled", "true");

  await captureCanonicalAuditEvidence(page, testInfo, "core-input-otp-complete");
});


test("csa-core-input-number-keyboard-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-input-number",
    viewport: desktop,
    ready: '[data-slot="input-number"]',
  });

  const card = page
    .getByText("受控与格式化", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const input = card.getByRole("spinbutton");
  await expect(input).toHaveAttribute("aria-valuenow", "1280");
  await input.focus();
  await input.press("ArrowUp");
  await expect(input).toHaveAttribute("aria-valuenow", "1380");
  await expect(card.getByText("数值：1380", { exact: true })).toBeVisible();

  await card.screenshot({
    path: testInfo.outputPath("csa-core-input-number-keyboard-step.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-date-picker-clear-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-date-picker",
    viewport: desktop,
    ready: '[data-slot="date-picker"]',
  });

  const card = page
    .getByText("受控与清除", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const input = card.locator('input[type="date"]');
  await expect(input).toHaveValue("2026-09-06");
  const clear = card.locator('[data-slot="date-picker"] button');
  await expect(clear).toHaveCount(1);
  await expect(clear).toHaveAttribute("aria-label", /.+/);
  await clear.click();
  await expect(input).toHaveValue("");
  await expect(card.getByText("日期：未选择", { exact: true })).toBeVisible();

  await card.screenshot({
    path: testInfo.outputPath("csa-core-date-picker-cleared.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-date-range-picker-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-date-range-picker",
    viewport: desktop,
    ready: '[data-slot="date-range-picker"]',
  });

  const start = page.getByLabel("开始日期");
  const end = page.getByLabel("结束日期");
  await expect(start).toHaveValue("2026-09-01");
  await expect(end).toHaveValue("2026-09-06");
  await start.fill("2026-09-03");
  await expect(start).toHaveValue("2026-09-03");
  await expect(end).toHaveValue("2026-09-06");

  await captureCanonicalAuditEvidence(page, testInfo, "core-date-range-updated");
});

test("csa-core-time-picker-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-time-picker",
    viewport: desktop,
    ready: '[data-slot="time-picker"]',
  });

  const start = page.getByLabel("开始时间");
  await expect(start).toHaveValue("09:30");
  await start.fill("10:15");
  await expect(start).toHaveValue("10:15");

  const warning = page.getByLabel("提醒时间");
  await expect(warning).toHaveAttribute("data-status", "warning");
  await expect(warning).toHaveValue("18:00");

  await captureCanonicalAuditEvidence(page, testInfo, "core-time-picker-updated");
});

test("csa-core-color-picker-focus-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-color-picker",
    viewport: desktop,
    ready: '[data-slot="color-picker"]',
  });

  const brand = page.getByLabel("品牌色");
  await expect(brand).toHaveValue("#1677ff");
  await brand.focus();
  await expect(brand).toBeFocused();

  const warning = page.getByLabel("警告色");
  await expect(warning).toHaveValue("#faad14");
  await expect(warning).toHaveAttribute("data-status", "warning");

  await captureCanonicalAuditEvidence(page, testInfo, "core-color-picker-focus");
});

test("csa-core-upload-controlled-list-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-upload",
    viewport: desktop,
    ready: 'input[type="file"]',
  });

  const card = page
    .getByText("受控拖放区域", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const input = card.locator('input[type="file"]');
  await input.setInputFiles({
    name: "cover.png",
    mimeType: "image/png",
    buffer: Buffer.from("canonical-upload-evidence"),
  });
  await expect(card.getByText("cover.png", { exact: true })).toBeVisible();
  await expect(card.getByRole("button", { name: /cover\.png/ })).toBeVisible();

  await card.screenshot({
    path: testInfo.outputPath("csa-core-upload-file-list.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-autocomplete-popup-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-autocomplete",
    viewport: desktop,
    ready: '[data-slot="auto-complete-input"]',
  });

  const input = page.getByRole("combobox", { name: "城市" });
  await input.fill("Sh");
  const popup = page.locator('[data-slot="auto-complete-popup"]');
  await expect(popup).toBeVisible();
  await expect(popup.getByRole("option", { name: "上海 / Shanghai" })).toBeVisible();
  await expect(popup.getByRole("option", { name: "深圳 / Shenzhen" })).toHaveAttribute("aria-disabled", "true");

  await captureCanonicalAuditEvidence(page, testInfo, "core-autocomplete-popup");

  await input.press("Enter");
  await expect(input).toHaveValue("Shanghai");
  await expect(page.getByText("已选择：Shanghai", { exact: true })).toBeVisible();
});

test("csa-core-mentions-popup-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-mentions",
    viewport: desktop,
    ready: '[data-slot="mentions-input"]',
  });

  const input = page.getByRole("textbox", { name: "评论内容" });
  await input.fill("欢迎 @a");
  const popup = page.locator('[data-slot="mentions-popup"]');
  await expect(popup).toBeVisible();
  await expect(popup.getByRole("option", { name: "@alice" })).toBeVisible();
  await expect(popup.getByRole("option", { name: "@aben" })).toBeVisible();

  await input.press("ArrowDown");
  await captureCanonicalAuditEvidence(page, testInfo, "core-mentions-popup");

  await input.press("Enter");
  await expect(input).toHaveValue("欢迎 @aben ");
  await expect(page.getByText("最近选择：@aben", { exact: true })).toBeVisible();
});

test("csa-core-transfer-move-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-transfer",
    viewport: desktop,
    ready: '[data-slot="transfer"]',
  });

  const source = page.getByRole("group", { name: "可选成员" });
  const target = page.getByRole("group", { name: "已分配成员" });
  await expect(source.getByText("阿笨", { exact: true })).toBeVisible();
  await expect(target.getByText("Alice", { exact: true })).toBeVisible();

  await source.getByRole("checkbox", { name: "阿笨" }).check();
  const add = page.getByRole("button", { name: "添加" });
  await expect(add).toBeEnabled();
  await add.click();

  await expect(target.getByText("阿笨", { exact: true })).toBeVisible();
  await expect(source.getByRole("checkbox", { name: "只读成员" })).toBeDisabled();

  await captureCanonicalAuditEvidence(page, testInfo, "core-transfer-after-add");
});


test("csa-core-list-state-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-list",
    viewport: desktop,
    ready: '[data-slot="list"]',
  });

  const card = page
    .getByText("加载、空状态与 Load More", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const lists = card.locator('[data-slot="list"]');
  await expect(lists).toHaveCount(2);
  await expect(lists.nth(0).locator('[data-slot="list-empty"]')).toHaveText("暂无待处理项目");
  await expect(lists.nth(1).locator('[data-slot="spin"]')).toHaveAttribute("aria-busy", "true");
  await expect(lists.nth(1).getByText("正在校验构建产物", { exact: true })).toBeVisible();
  await expect(lists.nth(1).getByRole("button", { name: "加载更多" })).toBeVisible();

  await card.screenshot({
    path: testInfo.outputPath("csa-core-list-empty-loading.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-descriptions-responsive-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-descriptions",
    viewport: { width: 600, height: 900 },
    ready: '[data-slot="descriptions"]',
  });

  const card = page
    .getByText("带边框、尺寸与垂直布局", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const descriptions = card.locator('[data-slot="descriptions"]');
  await expect(descriptions).toHaveAttribute("data-bordered", "true");
  await expect(descriptions).toHaveAttribute("data-layout", "vertical");
  const body = descriptions.locator('[data-slot="descriptions-body"]');
  await expect(body).toHaveCSS("grid-template-columns", /.+/);
  const columns = await body.evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length
  );
  expect(columns).toBe(1);
  await expect(
    descriptions.getByText(
      "Responsive spans keep long values readable without product-specific wrappers.",
      { exact: true },
    ),
  ).toBeVisible();

  await card.screenshot({
    path: testInfo.outputPath("csa-core-descriptions-mobile-single-column.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-calendar-selection-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-calendar",
    viewport: desktop,
    ready: '[data-slot="calendar"]',
  });

  const calendar = page.locator('[data-slot="calendar"]').first();
  const september10 = calendar.locator('button[data-calendar-date="2026-8-10"]');
  const september18 = calendar.locator('button[data-calendar-date="2026-8-18"]');
  await expect(september10).toHaveAttribute("aria-selected", "true");
  await expect(calendar.locator('[data-slot="calendar-week-number"]')).toHaveCount(6);

  await expect(september18).toBeVisible();
  await september18.click();
  await expect(september18).toHaveAttribute("aria-selected", "true");
  await expect(september10).toHaveAttribute("aria-selected", "false");

  await calendar.screenshot({
    path: testInfo.outputPath("csa-core-calendar-september-18-selected.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-image-preview-transform-evidence", async ({ page }, testInfo) => {
  await page.route(/https:\/\/picsum\.photos\/.*/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="#d8dee9"/><circle cx="320" cy="180" r="84" fill="#64748b"/></svg>',
    });
  });

  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-image",
    viewport: desktop,
    ready: '[data-slot="image-root"]',
  });

  const card = page
    .getByText("Fallback、受控预览与 transform 事件", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  await card.getByRole("button", { name: "从外部打开预览" }).click();

  const dialog = page.getByRole("dialog", { name: "带备用地址的示例图片" });
  await expect(dialog).toBeVisible();
  const previewImage = dialog.locator('[data-slot="image-preview-image"]');
  await expect(previewImage).toBeVisible();
  await expect(dialog.locator('[data-slot="image-toolbar"]')).toBeVisible();

  await dialog.getByRole("button", { name: "放大" }).click();
  await expect(card.getByText("最近动作：zoomIn", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "向右旋转" }).click();
  await expect(card.getByText("最近动作：rotateRight", { exact: true })).toBeVisible();
  await expect(previewImage).toHaveCSS("transform", /matrix/);

  await dialog.screenshot({
    path: testInfo.outputPath("csa-core-image-preview-transformed.png"),
    animations: "disabled",
    caret: "hide",
  });

  await dialog.getByRole("button", { name: "关闭" }).click();
  await expect(dialog).toBeHidden();
});

test("csa-core-table-state-density-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-table",
    viewport: desktop,
    ready: '[data-slot="table-container"]',
  });

  const baseTable = page
    .getByText("组件状态与负责人", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="table-container"][1]');
  await expect(baseTable.locator('tr[data-state="selected"]')).toContainText("Gouno UI");
  await expect(baseTable.locator('tr[aria-disabled="true"]')).toContainText("Legacy");
  await expect(baseTable.getByText("总计", { exact: true })).toBeVisible();
  await expect(baseTable.getByText("3 项", { exact: true })).toBeVisible();

  const densityCard = page
    .getByText("密度、边框与滚动", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const densityTables = densityCard.locator('[data-slot="table-container"]');
  await expect(densityTables).toHaveCount(2);
  await expect(densityTables.nth(0)).toHaveAttribute("data-density", "compact");
  await expect(densityTables.nth(1)).toHaveAttribute("data-density", "touch");
  await expect(densityTables.nth(1)).toHaveAttribute("data-sticky-header", "true");

  await densityCard.screenshot({
    path: testInfo.outputPath("csa-core-table-density-states.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-statistic-summary-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-statistic",
    viewport: desktop,
    ready: '[data-slot="statistic"]',
  });

  const statistics = page.locator('[data-slot="statistic"]');
  await expect(statistics).toHaveCount(2);
  await expect(statistics.nth(0)).toContainText("文章总数");
  await expect(statistics.nth(0)).toContainText("86");
  await expect(statistics.nth(1)).toContainText("增长");
  await expect(statistics.nth(1)).toContainText("18.6");
  await expect(statistics.nth(1)).toContainText("%");

  const card = statistics.nth(0).locator('xpath=ancestor::*[@data-slot="card"][1]');
  await card.screenshot({
    path: testInfo.outputPath("csa-core-statistic-summary.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-timeline-layout-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-timeline",
    viewport: desktop,
    ready: '[data-slot="timeline"]',
  });

  const card = page
    .getByText("Alternate、Horizontal 与 Reverse", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const timelines = card.locator('[data-slot="timeline"]');
  await expect(timelines).toHaveCount(2);
  await expect(timelines.nth(0)).toHaveAttribute("data-mode", "alternate");
  await expect(timelines.nth(0)).toHaveAttribute("data-orientation", "vertical");
  await expect(timelines.nth(1)).toHaveAttribute("data-orientation", "horizontal");
  await expect(timelines.nth(1).locator('[data-slot="timeline-item"]').first()).toContainText("Verify");

  await card.screenshot({
    path: testInfo.outputPath("csa-core-timeline-layouts.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-tree-selection-check-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-tree",
    viewport: desktop,
    ready: '[data-slot="tree"]',
  });

  const tree = page.locator('[data-slot="tree"]').first();
  const initial = tree.getByRole("treeitem", { name: /tree\.tsx/ });
  await expect(initial).toHaveAttribute("aria-selected", "true");
  await expect(tree.getByRole("checkbox", { name: "button.tsx" })).toBeChecked();

  const theme = tree.getByRole("treeitem", { name: /theme/ });
  await theme.click();
  await expect(theme).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Selected: theme", { exact: true })).toBeVisible();

  const treeCheckbox = tree.getByRole("checkbox", { name: "tree.tsx" });
  await treeCheckbox.check();
  await expect(treeCheckbox).toBeChecked();

  const card = tree.locator('xpath=ancestor::*[@data-slot="card"][1]');
  await card.screenshot({
    path: testInfo.outputPath("csa-core-tree-selected-checked.png"),
    animations: "disabled",
    caret: "hide",
  });
});


test("csa-core-icon-semantics-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-icon",
    viewport: desktop,
    ready: '[data-slot="icon"]',
  });

  const card = page
    .getByText("Decorative", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const icons = card.locator('[data-slot="icon"]');
  await expect(icons).toHaveCount(4);
  await expect(icons.nth(0)).toHaveAttribute("aria-hidden", "true");
  await expect(card.getByRole("img", { name: "Completed" })).toBeVisible();
  await expect(card.getByRole("img", { name: "Loading" })).toHaveClass(/animate-spin/);

  const direction = card.getByRole("img", { name: "Direction" });
  const directionStyle = await direction.evaluate((element) => {
    const style = getComputedStyle(element);
    return { width: style.width, height: style.height, transform: element.style.transform };
  });
  expect(directionStyle.width).toBe("24px");
  expect(directionStyle.height).toBe("24px");
  expect(directionStyle.transform).toContain("rotate(45deg)");

  await card.screenshot({
    path: testInfo.outputPath("csa-core-icon-semantic-sizes.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-typography-role-hierarchy-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-typography",
    viewport: desktop,
    ready: '[data-typography-role]',
  });

  const card = page
    .getByText("语义宿主与原生属性", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const pageTitle = card.getByRole("heading", { level: 1, name: "页面主标题" });
  const nestedTask = card.getByRole("heading", { level: 2, name: "嵌套任务标题" });
  const standaloneTask = card.getByRole("heading", {
    level: 1,
    name: "独立任务标题（同一视觉 role，不同 document level）",
  });
  const section = card.getByRole("heading", { level: 3, name: "区块标题" });

  await expect(pageTitle).toHaveAttribute("data-typography-role", "page");
  await expect(nestedTask).toHaveAttribute("data-typography-role", "task");
  await expect(standaloneTask).toHaveAttribute("data-typography-role", "task");
  await expect(section).toHaveAttribute("data-typography-role", "section");

  const metrics = async (locator) =>
    locator.evaluate((element) => {
      const style = getComputedStyle(element);
      return { fontSize: style.fontSize, lineHeight: style.lineHeight, fontWeight: style.fontWeight };
    });
  expect(await metrics(standaloneTask)).toEqual(await metrics(nestedTask));
  expect((await metrics(pageTitle)).fontSize).not.toBe((await metrics(nestedTask)).fontSize);

  await card.screenshot({
    path: testInfo.outputPath("csa-core-typography-semantic-hierarchy.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-kbd-shortcut-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-kbd",
    viewport: desktop,
    ready: "kbd",
  });

  const card = page
    .getByText("Command palette", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const keys = card.locator("kbd");
  await expect(keys).toHaveCount(4);
  await expect(keys.nth(0)).toHaveText("⌘");
  await expect(keys.nth(1)).toHaveText("K");
  await expect(keys.nth(2)).toHaveText("⇧");
  await expect(keys.nth(3)).toHaveText("Tab");

  await card.screenshot({
    path: testInfo.outputPath("csa-core-kbd-shortcuts.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-badge-dynamic-state-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-badge",
    viewport: desktop,
    ready: '[role="status"]',
  });

  const card = page
    .getByRole("button", { name: "增加计数" })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  await expect(card.getByRole("status", { name: "5", exact: true })).toBeVisible();
  await expect(card.getByRole("status", { name: "0", exact: true })).toBeVisible();
  await expect(card.getByRole("status", { name: "99+", exact: true })).toBeVisible();
  await expect(card.getByRole("status", { name: "999+", exact: true })).toBeVisible();

  await card.getByRole("button", { name: "增加计数" }).click();
  await expect(card.getByText("当前计数：6", { exact: true })).toBeVisible();
  await expect(card.getByRole("status", { name: "6", exact: true })).toBeVisible();

  await card.screenshot({
    path: testInfo.outputPath("csa-core-badge-count-statuses.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-tag-interaction-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-tag",
    viewport: desktop,
    ready: '[data-slot="card"]',
  });

  const closableCard = page
    .getByText("可关闭标签", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  await closableCard.getByRole("button", { name: "关闭 Release" }).click();
  await expect(closableCard.getByText("Release", { exact: true })).toBeHidden();
  await expect(closableCard.getByText("已关闭 Release 标签", { exact: true })).toBeVisible();
  await expect(closableCard.getByRole("button", { name: "恢复标签" })).toBeVisible();
  await expect(closableCard.getByRole("button", { name: "关闭 Disabled" })).toBeDisabled();

  await closableCard.screenshot({
    path: testInfo.outputPath("csa-core-tag-closable-lifecycle.png"),
    animations: "disabled",
    caret: "hide",
  });

  const checkableCard = page
    .getByText("非受控可选标签", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const typescript = checkableCard.getByRole("checkbox", { name: "TypeScript" });
  await expect(typescript).toHaveAttribute("aria-checked", "true");
  await typescript.click();
  await expect(typescript).toHaveAttribute("aria-checked", "false");
  await expect(checkableCard.getByText("已取消 TypeScript", { exact: true })).toBeVisible();

  await checkableCard.screenshot({
    path: testInfo.outputPath("csa-core-tag-checkable-state.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-avatar-size-shape-evidence", async ({ page }, testInfo) => {
  await page.route("https://github.com/rushairer.png", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#cbd5e1"/><circle cx="48" cy="38" r="16" fill="#64748b"/><path d="M20 86c5-20 18-30 28-30s23 10 28 30" fill="#64748b"/></svg>',
    });
  });

  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-avatar",
    viewport: desktop,
    ready: '[data-slot="avatar"]',
  });

  const firstAvatar = page.locator('[data-slot="avatar"]').first();
  const card = firstAvatar.locator('xpath=ancestor::*[@data-slot="card"][1]');
  const avatars = card.locator('[data-slot="avatar"]');
  await expect(avatars).toHaveCount(4);
  await expect(avatars.nth(0)).toHaveAttribute("data-size", "small");
  await expect(avatars.nth(1)).toHaveAttribute("data-size", "middle");
  await expect(avatars.nth(2)).toHaveAttribute("data-size", "large");
  await expect(avatars.nth(2)).toHaveAttribute("data-shape", "square");
  await expect(avatars.nth(3)).toHaveAttribute("data-size", "custom");

  const customBox = await avatars.nth(3).boundingBox();
  expect(customBox?.width).toBeCloseTo(48, 0);
  expect(customBox?.height).toBeCloseTo(48, 0);

  await card.screenshot({
    path: testInfo.outputPath("csa-core-avatar-size-shape.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-space-wrap-split-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-space",
    viewport: { width: 600, height: 900 },
    ready: '[data-slot="space"]',
  });

  const card = page
    .getByText("换行与分隔内容", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const space = card.locator('[data-slot="space"]').first();
  await expect(space).toHaveAttribute("data-orientation", "horizontal");
  await expect(space.getByRole("button")).toHaveCount(4);
  await expect(space.getByText("·", { exact: true })).toHaveCount(3);

  await card.screenshot({
    path: testInfo.outputPath("csa-core-space-wrap-split.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-flex-reverse-wrap-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-flex",
    viewport: { width: 600, height: 900 },
    ready: '[data-slot="flex"]',
  });

  const card = page
    .getByText("反向、换行与数值 gap", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const flex = card.getByLabel("Flexible tags");
  await expect(flex).toHaveAttribute("data-direction", "row-reverse");
  await expect(flex).toHaveAttribute("data-wrap", "wrap-reverse");
  await expect(flex).toHaveCSS("gap", "10px");
  await expect(flex.getByText(/Item /)).toHaveCount(8);

  await card.screenshot({
    path: testInfo.outputPath("csa-core-flex-reverse-wrap.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-grid-responsive-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-grid",
    viewport: { width: 600, height: 900 },
    ready: '[data-slot="row"]',
  });

  const card = page
    .getByText("24 栅格与响应式 Col", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const cols = card.locator('[data-slot="col"]');
  await expect(cols).toHaveCount(4);

  const positions = async () =>
    Promise.all(
      [0, 1, 2, 3].map(async (index) => {
        const box = await cols.nth(index).boundingBox();
        if (!box) throw new Error("missing grid col " + index);
        return { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width) };
      }),
    );

  let boxes = await positions();
  expect(new Set(boxes.map((box) => box.y)).size).toBe(4);

  await card.screenshot({
    path: testInfo.outputPath("csa-core-grid-responsive-600.png"),
    animations: "disabled",
    caret: "hide",
  });

  await page.setViewportSize({ width: 820, height: 900 });
  boxes = await positions();
  expect(boxes[0].y).toBe(boxes[1].y);
  expect(boxes[2].y).toBe(boxes[3].y);
  expect(boxes[0].y).toBeLessThan(boxes[2].y);

  await page.setViewportSize({ width: 1100, height: 900 });
  boxes = await positions();
  expect(new Set(boxes.map((box) => box.y)).size).toBe(1);

  await card.screenshot({
    path: testInfo.outputPath("csa-core-grid-responsive-1100.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-separator-variants-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-separator",
    viewport: desktop,
    ready: '[data-slot="separator"]',
  });

  const basicCard = page
    .getByText("Centered section", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const horizontal = basicCard.locator('[data-slot="separator"]');
  await expect(horizontal).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    await expect(horizontal.nth(index)).toHaveAttribute("data-orientation", "horizontal");
  }

  await basicCard.screenshot({
    path: testInfo.outputPath("csa-core-separator-horizontal-variants.png"),
    animations: "disabled",
    caret: "hide",
  });

  const verticalCard = page
    .getByText("垂直与语义 Separator", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const semantic = verticalCard.getByRole("separator", { name: "Section separator" });
  await expect(semantic).toHaveAttribute("aria-orientation", "vertical");

  await verticalCard.screenshot({
    path: testInfo.outputPath("csa-core-separator-vertical-semantic.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-card-variant-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-card",
    viewport: desktop,
    ready: '[data-slot="card"]',
  });

  const elevatedButton = page.getByRole("button", { name: "elevated", exact: true });
  const demo = elevatedButton.locator('xpath=ancestor::*[@data-slot="card"][1]');
  const card = demo
    .getByText("Release 0.2.0", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');

  const beforeShadow = await card.evaluate((element) => getComputedStyle(element).boxShadow);
  await elevatedButton.click();
  const afterShadow = await card.evaluate((element) => getComputedStyle(element).boxShadow);
  expect(afterShadow).not.toBe(beforeShadow);
  await expect(card.getByText("Ready", { exact: true })).toBeVisible();
  await expect(card.getByRole("button", { name: "查看变更" })).toBeVisible();

  await demo.screenshot({
    path: testInfo.outputPath("csa-core-card-elevated-composition.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-splitter-keyboard-resize-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-splitter",
    viewport: desktop,
    ready: '[data-slot="splitter"]',
  });

  const splitter = page.locator('[data-slot="splitter"]').first();
  const handle = splitter.getByRole("separator");
  await expect(handle).toHaveAttribute("aria-orientation", "vertical");
  await expect(handle).toHaveAttribute("aria-valuenow", "36");

  await handle.focus();
  await handle.press("ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "37");

  const card = splitter.locator('xpath=ancestor::*[@data-slot="card"][1]');
  await card.screenshot({
    path: testInfo.outputPath("csa-core-splitter-keyboard-resized.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-page-layout-region-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-page-layout",
    viewport: desktop,
    ready: '[data-layout="admin-shell"]',
  });

  const layout = page.locator('[data-layout="admin-shell"]');
  await expect(layout.locator("header")).toContainText("Header / global actions");
  await expect(layout.getByRole("complementary", { name: "Section navigation" })).toContainText("Sider / navigation");
  await expect(layout.locator("main")).toContainText("Main content");
  await expect(layout.locator("footer")).toContainText("Footer / status");

  const siderBox = await layout.locator("aside").boundingBox();
  expect(siderBox?.width).toBeCloseTo(240, 0);

  const card = layout.locator('xpath=ancestor::*[@data-slot="card"][1]');
  await card.screenshot({
    path: testInfo.outputPath("csa-core-page-layout-regions.png"),
    animations: "disabled",
    caret: "hide",
  });
});


test("csa-core-input-clear-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-input",
    viewport: desktop,
    ready: '[data-slot="input-group"]',
  });

  const card = page
    .getByText("受控与清除", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const input = card.locator("input").first();
  await expect(input).toHaveValue("Gouno UI");
  await expect(card.getByText("当前值：Gouno UI", { exact: true })).toBeVisible();

  const clear = card.locator('[data-slot="input-group"] button');
  await expect(clear).toHaveCount(1);
  await expect(clear).toHaveAttribute("aria-label", /.+/);
  await clear.click();
  await expect(input).toHaveValue("");
  await expect(input).toBeFocused();
  await expect(card.getByText("当前值：（空）", { exact: true })).toBeVisible();

  await card.screenshot({
    path: testInfo.outputPath("csa-core-input-cleared.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-textarea-count-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-textarea",
    viewport: desktop,
    ready: "textarea",
  });

  const card = page
    .getByText("字符计数与受控值", { exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const textarea = card.locator("textarea").first();
  await textarea.fill("1234567890");
  await expect(textarea).toHaveValue("1234567890");
  await expect(card.getByText("10 / 60", { exact: true })).toBeVisible();
  const describedBy = await textarea.getAttribute("aria-describedby");
  expect(describedBy).toBeTruthy();

  await card.screenshot({
    path: testInfo.outputPath("csa-core-textarea-count-10.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-code-block-copy-evidence", async ({ page }, testInfo) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-code-block",
    viewport: desktop,
    ready: '[data-slot="code-block"]',
  });

  const codeBlock = page.locator('[data-slot="code-block"]').first();
  const card = codeBlock.locator('xpath=ancestor::*[@data-slot="card"][1]');
  await expect(codeBlock).toHaveAttribute("data-language", "tsx");
  const renderedCode = await codeBlock.locator('[data-slot="code-block-code"]').textContent();

  const copy = codeBlock.getByRole("button", { name: "复制代码", exact: true });
  await copy.click();
  await expect(codeBlock.getByRole("button", { name: "代码已复制", exact: true })).toBeVisible();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toBe(renderedCode);

  await card.screenshot({
    path: testInfo.outputPath("csa-core-code-block-copied.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-float-button-tooltip-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-float-button",
    viewport: desktop,
    ready: '[data-slot="float-button"]',
  });

  const button = page.getByRole("button", { name: "新建内容", exact: true });
  const link = page.getByRole("link", { name: "跳转到说明", exact: true });
  await expect(button).toBeVisible();
  await expect(link).toHaveAttribute("href", "#float-button-target");

  await button.focus();
  const tooltip = page.getByRole("tooltip");
  await expect(tooltip).toContainText("新建内容");

  await page.screenshot({
    path: testInfo.outputPath("csa-core-float-button-tooltip.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-qrcode-canvas-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-qrcode",
    viewport: desktop,
    ready: '[data-slot="qrcode"]',
  });

  const canvas = page.getByRole("img", { name: "Gouno MFA 配置二维码", exact: true });
  await expect(canvas).toHaveAttribute("width", "180");
  await expect(canvas).toHaveAttribute("height", "180");
  const box = await canvas.boundingBox();
  expect(box?.width).toBeCloseTo(180, 0);
  expect(box?.height).toBeCloseTo(180, 0);
  await expect.poll(() =>
    canvas.evaluate((element) => {
      const context = element.getContext("2d");
      if (!context) return false;
      const pixels = context.getImageData(0, 0, element.width, element.height).data;
      for (let index = 0; index < pixels.length; index += 4) {
        if (
          pixels[index] < 100 &&
          pixels[index + 1] < 100 &&
          pixels[index + 2] < 100 &&
          pixels[index + 3] > 0
        ) return true;
      }
      return false;
    }),
  ).toBe(true);

  const card = canvas.locator('xpath=ancestor::*[@data-slot="card"][1]');
  await card.screenshot({
    path: testInfo.outputPath("csa-core-qrcode-canvas.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-watermark-tile-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-watermark",
    viewport: desktop,
    ready: '[data-slot="watermark"]',
  });

  const watermark = page.locator('[data-slot="watermark"]').first();
  await expect(watermark).toHaveAttribute("aria-label", "评审内容区域");
  const backgroundImage = await watermark.evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(backgroundImage).toContain("data:image/svg+xml");
  await expect(watermark.getByText("发布前检查", { exact: true })).toBeVisible();

  const card = watermark.locator('xpath=ancestor::*[@data-slot="card"][1]');
  await card.screenshot({
    path: testInfo.outputPath("csa-core-watermark-tile.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-affix-container-scroll-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-affix",
    viewport: desktop,
    ready: '[data-slot="affix"]',
  });

  const affix = page.getByLabel("固定操作区");
  const scrollContainer = affix.locator('xpath=ancestor::div[contains(@class,"overflow-auto")][1]');
  const before = await affix.boundingBox();
  const scrollBox = await scrollContainer.boundingBox();
  if (!before || !scrollBox) throw new Error("missing Affix geometry");

  await scrollContainer.evaluate((element) => {
    element.scrollTop = 180;
  });
  await expect.poll(() => scrollContainer.evaluate((element) => element.scrollTop)).toBeGreaterThan(100);

  const after = await affix.boundingBox();
  if (!after) throw new Error("missing sticky Affix geometry");
  expect(after.y).toBeLessThan(before.y);
  expect(after.y).toBeGreaterThanOrEqual(scrollBox.y);
  expect(after.y).toBeLessThan(scrollBox.y + 40);

  await scrollContainer.screenshot({
    path: testInfo.outputPath("csa-core-affix-sticky.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-core-back-top-return-evidence", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "core-back-top",
    viewport: { width: 1000, height: 650 },
    ready: '[data-slot="back-top"]',
  });

  const button = page.getByRole("button", { name: "回到顶部", exact: true });
  await page.evaluate(() => {
    const spacer = document.createElement("div");
    spacer.dataset.csaBackTopSpacer = "true";
    spacer.style.height = "1600px";
    spacer.style.width = "1px";
    spacer.setAttribute("aria-hidden", "true");
    document.body.appendChild(spacer);
  });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight)).toBeGreaterThan(1000);
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await button.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  const card = button.locator('xpath=ancestor::*[@data-slot="card"][1]');
  await card.screenshot({
    path: testInfo.outputPath("csa-core-back-top-returned.png"),
    animations: "disabled",
    caret: "hide",
  });
});


test("csa-pattern-bulk-action-bar-lifecycle-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "pattern-bulk-action-bar",
    viewport: desktop,
    ready: '[data-slot="bulk-action-bar"]',
  });

  const toolbar = page.getByRole("toolbar", { name: "批量操作", exact: true });
  await expect(toolbar).toContainText("已选择 3 项");
  await expect(toolbar.locator('[data-slot="bulk-action-bar-actions"]')).toBeVisible();

  await page.getByRole("button", { name: "文章 C", exact: true }).click();
  await expect(toolbar).toContainText("已选择 2 项");
  await page.getByRole("button", { name: "归档", exact: true }).click();
  await expect(page.getByText("已归档 2 项。", { exact: true })).toBeVisible();

  const demo = toolbar.locator('xpath=ancestor::*[@data-slot="card"][1]');
  await demo.screenshot({
    path: testInfo.outputPath("csa-pattern-bulk-action-bar-two-selected.png"),
    animations: "disabled",
    caret: "hide",
  });

  await toolbar.getByRole("button", { name: "取消", exact: true }).click();
  await expect(toolbar).toBeHidden();
  const restore = page.getByRole("button", { name: "恢复选择", exact: true });
  await expect(restore).toBeVisible();
  await restore.click();
  await expect(page.getByRole("toolbar", { name: "批量操作", exact: true })).toContainText("已选择 3 项");
});

test("csa-gouno-page-container-track-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "gouno-page-container",
    viewport: desktop,
    ready: '[data-slot="page-container"]',
  });

  const container = page.locator('[data-slot="page-container"][data-page="settings"]');
  await expect(container).toHaveAttribute("data-page", "settings");
  const metrics = await container.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      gap: style.gap,
      maxWidth: style.maxWidth,
      width: element.getBoundingClientRect().width,
      parentWidth: element.parentElement?.getBoundingClientRect().width ?? 0,
    };
  });
  expect(metrics.gap).toBe("24px");
  expect(metrics.maxWidth).toBe("1440px");
  expect(metrics.width).toBeLessThanOrEqual(metrics.parentWidth);

  const card = container.locator('xpath=ancestor::*[@data-slot="card"][1]');
  await card.screenshot({
    path: testInfo.outputPath("csa-gouno-page-container-track.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-gouno-page-header-responsive-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "gouno-page-header",
    viewport: { width: 1100, height: 800 },
    ready: '[data-slot="page-header"]',
  });

  const header = page.locator('[data-slot="page-header"]').filter({ hasText: "OAuth2 客户端" }).first();
  const heading = header.getByRole("heading", { level: 1, name: "OAuth2 客户端", exact: true });
  const description = header.getByText("注册和维护身份平台客户端、回调地址与授权范围。", { exact: true });
  const refresh = header.getByRole("button", { name: "刷新", exact: true });
  const register = header.getByRole("button", { name: "注册客户端", exact: true });

  await expect(heading).toHaveAttribute("data-typography-role", "page");
  await expect(description).toBeVisible();
  await expect(refresh).toBeVisible();
  await expect(register).toBeVisible();

  const desktopBoxes = await Promise.all([heading.boundingBox(), refresh.boundingBox()]);
  if (!desktopBoxes[0] || !desktopBoxes[1]) throw new Error("missing PageHeader desktop geometry");
  expect(Math.abs(desktopBoxes[0].y - desktopBoxes[1].y)).toBeLessThan(24);

  await header.screenshot({
    path: testInfo.outputPath("csa-gouno-page-header-desktop.png"),
    animations: "disabled",
    caret: "hide",
  });

  await page.setViewportSize({ width: 600, height: 800 });
  const mobileDescription = await description.boundingBox();
  const mobileAction = await refresh.boundingBox();
  if (!mobileDescription || !mobileAction) throw new Error("missing PageHeader mobile geometry");
  expect(mobileAction.y).toBeGreaterThan(mobileDescription.y + mobileDescription.height);

  await header.screenshot({
    path: testInfo.outputPath("csa-gouno-page-header-mobile.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-gouno-page-skeleton-responsive-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "gouno-page-skeleton",
    viewport: { width: 1100, height: 1000 },
    ready: '[data-slot="page-skeleton"]',
  });

  const collection = page.getByRole("status", { name: "资源列表加载中", exact: true });
  const form = page.getByRole("status", { name: "设置表单加载中", exact: true });
  const dashboard = page.getByRole("status", { name: "数据概览加载中", exact: true });

  await expect(collection).toHaveAttribute("data-layout", "collection");
  await expect(collection).toHaveAttribute("aria-busy", "true");
  await expect(form).toHaveAttribute("data-layout", "form");
  await expect(dashboard).toHaveAttribute("data-layout", "dashboard");
  await expect(collection.locator("table")).toBeVisible();

  await collection.screenshot({
    path: testInfo.outputPath("csa-gouno-page-skeleton-collection-desktop.png"),
    animations: "disabled",
    caret: "hide",
  });

  await page.setViewportSize({ width: 600, height: 1000 });
  await expect(collection.locator("table")).toBeHidden();
  const mobileCards = collection.locator('[data-slot="card"]');
  await expect(mobileCards).toHaveCount(4);
  await expect(mobileCards.first()).toBeVisible();

  await collection.screenshot({
    path: testInfo.outputPath("csa-gouno-page-skeleton-collection-mobile.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-gouno-app-shell-responsive-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "gouno-app-shell",
    viewport: { width: 1280, height: 900 },
    ready: '[data-slot="app-shell"]',
  });

  const shell = page.getByText("Gouno Admin", { exact: true }).locator('xpath=ancestor::*[@data-slot="app-shell"][1]');
  await expect(shell.getByText("Gouno Admin", { exact: true })).toBeVisible();
  await expect(shell.getByRole("navigation", { name: "示例应用导航", exact: true })).toBeVisible();
  await expect(shell.locator("main")).toContainText("Main / children");
  await expect(shell.locator('[data-slot="page-container"]')).toBeVisible();
  await expect(shell.locator('a[href^="#app-shell-main-"]')).toHaveCount(1);

  const sider = shell.locator("aside");
  await expect(sider).toBeVisible();
  const siderBox = await sider.boundingBox();
  expect(siderBox?.width).toBeCloseTo(288, 0);

  await shell.screenshot({
    path: testInfo.outputPath("csa-gouno-app-shell-desktop.png"),
    animations: "disabled",
    caret: "hide",
  });

  await page.setViewportSize({ width: 600, height: 900 });
  await expect(sider).toBeHidden();
  const trigger = shell.getByRole("button", { name: "示例应用导航", exact: true });
  await expect(trigger).toBeVisible();
  await trigger.click();

  const dialog = page.getByRole("dialog").filter({ hasText: "Gouno Admin" });
  await expect(dialog).toBeVisible();
  const mobileNav = dialog.getByRole("navigation", { name: "示例应用导航", exact: true });
  await expect(mobileNav.getByText("OAuth2 客户端", { exact: true })).toBeVisible();

  await dialog.screenshot({
    path: testInfo.outputPath("csa-gouno-app-shell-mobile-navigation.png"),
    animations: "disabled",
    caret: "hide",
  });

  await mobileNav.getByText("概览", { exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});


test("csa-pattern-collection-composition-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "pattern-collection-composition",
    viewport: { width: 1440, height: 1000 },
    ready: '[data-pattern="collection-composition"]',
  });

  const collection = page.locator('[data-pattern="collection-composition"]');
  const summary = collection.locator('[data-slot="collection-summary"]');
  const toolbar = collection.locator('[data-slot="collection-toolbar"]');
  const data = collection.locator('[data-slot="collection-data-view"]');
  const pagination = collection.locator('[data-slot="collection-pagination"]');

  const orderedBoxes = await Promise.all([
    summary.boundingBox(),
    toolbar.boundingBox(),
    data.boundingBox(),
    pagination.boundingBox(),
  ]);
  if (orderedBoxes.some((box) => !box)) throw new Error("missing Collection composition geometry");
  expect(orderedBoxes[0].y).toBeLessThan(orderedBoxes[1].y);
  expect(orderedBoxes[1].y).toBeLessThan(orderedBoxes[2].y);
  expect(orderedBoxes[2].y).toBeLessThan(orderedBoxes[3].y);

  const search = collection.getByRole("textbox", { name: "搜索资产", exact: true });
  await search.fill("安全巡检");
  await expect(collection.getByText("1 / 3", { exact: true })).toBeVisible();
  await expect(collection.getByText("安全巡检", { exact: true })).toBeVisible();
  await expect(collection.getByText("内容维护", { exact: true })).toBeHidden();
  await expect(collection.getByText("SEO Review", { exact: true })).toBeHidden();

  await collection.screenshot({
    path: testInfo.outputPath("csa-pattern-collection-filtered.png"),
    animations: "disabled",
    caret: "hide",
  });

  await search.fill("__no_matching_asset__");
  await expect(collection.getByText("0 / 3", { exact: true })).toBeVisible();
  await expect(collection.getByText("没有符合条件的资产", { exact: true })).toBeVisible();
  await expect(pagination).toBeVisible();

  await collection.screenshot({
    path: testInfo.outputPath("csa-pattern-collection-empty.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-pattern-record-detail-composition-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "pattern-record-detail-composition",
    viewport: { width: 1200, height: 1000 },
    ready: '[data-pattern="record-detail-composition"]',
  });

  const detail = page.locator('[data-pattern="record-detail-composition"]');
  const identity = detail.locator('[data-slot="record-identity"]');
  const feedback = detail.locator('[data-slot="record-feedback"]');
  const summary = detail.locator('[data-slot="record-summary"]');
  const sections = detail.locator('[data-slot="record-sections"]');

  await expect(identity.getByRole("heading", { level: 2, name: "Run #248 · 内容维护", exact: true })).toBeVisible();
  await expect(feedback.getByText("存在 1 个待确认结果", { exact: true })).toBeVisible();
  await expect(summary.getByRole("region", { name: "数据摘要", exact: true })).toBeVisible();
  await expect(sections.getByText("执行事实", { exact: true })).toBeVisible();
  await expect(sections.getByText("资源证据", { exact: true })).toBeVisible();
  await expect(sections.getByText("步骤记录", { exact: true })).toBeVisible();

  const boxes = await Promise.all([
    identity.boundingBox(),
    feedback.boundingBox(),
    summary.boundingBox(),
    sections.boundingBox(),
  ]);
  if (boxes.some((box) => !box)) throw new Error("missing Record Detail composition geometry");
  expect(boxes[0].y).toBeLessThan(boxes[1].y);
  expect(boxes[1].y).toBeLessThan(boxes[2].y);
  expect(boxes[2].y).toBeLessThan(boxes[3].y);

  await detail.screenshot({
    path: testInfo.outputPath("csa-pattern-record-detail-order.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-pattern-master-detail-responsive-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "pattern-master-detail-composition",
    viewport: { width: 1440, height: 1000 },
    ready: '[data-pattern="master-detail-composition"]',
  });

  const composition = page.locator('[data-pattern="master-detail-composition"]');
  const master = composition.locator('[data-slot="master-detail-master"]');
  const detail = composition.locator('[data-slot="master-detail-detail"]');

  const first = master.getByRole("button", { name: /确认文章分类/ });
  const second = master.getByRole("button", { name: /批准外部写入/ });
  await expect(first).toHaveAttribute("aria-pressed", "true");
  await expect(second).toHaveAttribute("aria-pressed", "false");

  await second.click();
  await expect(second).toHaveAttribute("aria-pressed", "true");
  await expect(detail.getByRole("heading", { level: 2, name: "批准外部写入", exact: true })).toBeVisible();
  await expect(detail.getByText(/D-30 · 当前 Detail 只描述所选对象/)).toBeVisible();

  const desktop = await Promise.all([master.boundingBox(), detail.boundingBox()]);
  if (!desktop[0] || !desktop[1]) throw new Error("missing Master-Detail desktop geometry");
  expect(desktop[1].x).toBeGreaterThan(desktop[0].x + desktop[0].width - 2);
  expect(desktop[1].width).toBeGreaterThan(desktop[0].width);

  await composition.screenshot({
    path: testInfo.outputPath("csa-pattern-master-detail-desktop-selected.png"),
    animations: "disabled",
    caret: "hide",
  });

  await page.setViewportSize({ width: 600, height: 1100 });
  const mobile = await Promise.all([master.boundingBox(), detail.boundingBox()]);
  if (!mobile[0] || !mobile[1]) throw new Error("missing Master-Detail mobile geometry");
  expect(mobile[1].y).toBeGreaterThanOrEqual(mobile[0].y + mobile[0].height - 2);
  expect(Math.abs(mobile[1].width - mobile[0].width)).toBeLessThan(3);

  await composition.screenshot({
    path: testInfo.outputPath("csa-pattern-master-detail-mobile-stacked.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-pattern-settings-composition-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "pattern-settings-composition",
    viewport: { width: 1100, height: 1100 },
    ready: '[data-pattern="settings-composition"]',
  });

  const settings = page.locator('[data-pattern="settings-composition"]');
  const feedback = settings.locator('[data-slot="settings-feedback"]');
  const sections = settings.locator('[data-slot="settings-sections"]');
  const actions = settings.locator('[data-slot="settings-actions"]');

  await expect(feedback.getByText("设置会影响新请求", { exact: true })).toBeVisible();
  await expect(sections.locator('[data-pattern="settings-section"]')).toHaveCount(2);
  await expect(actions.getByRole("button", { name: "重置", exact: true })).toBeVisible();
  await expect(actions.getByRole("button", { name: "保存设置", exact: true })).toBeVisible();

  const boxes = await Promise.all([
    feedback.boundingBox(),
    sections.boundingBox(),
    actions.boundingBox(),
  ]);
  if (boxes.some((box) => !box)) throw new Error("missing Settings composition geometry");
  expect(boxes[0].y).toBeLessThan(boxes[1].y);
  expect(boxes[1].y).toBeLessThan(boxes[2].y);

  const publicAccess = settings.getByRole("switch", { name: "允许公开访问", exact: true });
  await expect(publicAccess).toBeChecked();
  await settings.getByText("允许公开访问", { exact: true }).click();
  await expect(publicAccess).not.toBeChecked();

  await settings.screenshot({
    path: testInfo.outputPath("csa-pattern-settings-toggle-off.png"),
    animations: "disabled",
    caret: "hide",
  });

  await page.setViewportSize({ width: 600, height: 1200 });
  const siteName = settings.getByLabel("站点名称", { exact: true });
  const switchBox = await publicAccess.boundingBox();
  const siteNameBox = await siteName.boundingBox();
  if (!switchBox || !siteNameBox) throw new Error("missing Settings mobile field geometry");
  expect(switchBox.y).toBeGreaterThan(siteNameBox.y);

  await settings.screenshot({
    path: testInfo.outputPath("csa-pattern-settings-mobile.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-pattern-data-summary-responsive-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "pattern-data-summary-composition",
    viewport: { width: 1440, height: 900 },
    ready: '[data-pattern="data-summary-composition"]',
  });

  const summary = page.locator('[data-pattern="data-summary-composition"]');
  const metrics = summary.locator(':scope > div');
  await expect(metrics).toHaveCount(4);
  await expect(summary.locator('[data-typography-role="metric-compact"]')).toHaveCount(4);

  const positions = async () =>
    Promise.all(
      [0, 1, 2, 3].map(async (index) => {
        const box = await metrics.nth(index).boundingBox();
        if (!box) throw new Error("missing Data Summary metric " + index);
        return { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width) };
      }),
    );

  let boxes = await positions();
  expect(new Set(boxes.map((box) => box.y)).size).toBe(1);

  await summary.screenshot({
    path: testInfo.outputPath("csa-pattern-data-summary-1440.png"),
    animations: "disabled",
    caret: "hide",
  });

  await page.setViewportSize({ width: 800, height: 900 });
  boxes = await positions();
  expect(boxes[0].y).toBe(boxes[1].y);
  expect(boxes[2].y).toBe(boxes[3].y);
  expect(boxes[2].y).toBeGreaterThan(boxes[0].y);

  await page.setViewportSize({ width: 600, height: 900 });
  boxes = await positions();
  expect(new Set(boxes.map((box) => box.y)).size).toBe(4);

  await summary.screenshot({
    path: testInfo.outputPath("csa-pattern-data-summary-600.png"),
    animations: "disabled",
    caret: "hide",
  });
});


test("csa-pattern-dedicated-editor-family-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "pattern-dedicated-editor",
    viewport: { width: 1440, height: 1100 },
    ready: '[aria-label="Dedicated Editor Canonical Preview"]',
  });

  const preview = page.locator('[aria-label="Dedicated Editor Canonical Preview"]');
  const lead = preview.locator('[data-pattern="dedicated-editor-lead"]');
  const layout = preview.locator('[data-pattern="dedicated-editor-layout"]');
  const taskTitle = lead.getByRole("heading", {
    level: 2,
    name: "编辑自动化资产：内容维护",
    exact: true,
  });

  await expect(taskTitle).toHaveAttribute("data-typography-role", "task");
  await expect(layout.locator("aside", { hasText: "执行计划" })).toBeVisible();

  const primary = layout.locator(":scope > div").first();
  const secondary = layout.locator(":scope > aside");
  const desktop = await Promise.all([primary.boundingBox(), secondary.boundingBox()]);
  if (!desktop[0] || !desktop[1]) throw new Error("missing Dedicated Editor desktop geometry");
  expect(desktop[1].x).toBeGreaterThan(desktop[0].x + desktop[0].width - 2);

  const stateGroup = page.getByRole("radiogroup", { name: "Dedicated Editor 状态", exact: true });
  const errorState = stateGroup.getByRole("radio", { name: "Error", exact: true });
  await errorState.locator("xpath=ancestor::label[1]").click();
  await expect(errorState).toBeChecked();
  await expect(preview.getByText("保存失败", { exact: true })).toBeVisible();

  await preview.screenshot({
    path: testInfo.outputPath("csa-pattern-dedicated-editor-error-desktop.png"),
    animations: "disabled",
    caret: "hide",
  });

  await page.setViewportSize({ width: 600, height: 1200 });
  const mobile = await Promise.all([primary.boundingBox(), secondary.boundingBox()]);
  if (!mobile[0] || !mobile[1]) throw new Error("missing Dedicated Editor mobile geometry");
  expect(mobile[1].y).toBeGreaterThanOrEqual(mobile[0].y + mobile[0].height - 2);
  expect(Math.abs(mobile[1].width - mobile[0].width)).toBeLessThan(3);

  await preview.screenshot({
    path: testInfo.outputPath("csa-pattern-dedicated-editor-mobile-stacked.png"),
    animations: "disabled",
    caret: "hide",
  });

  const subtypeGroup = page.getByRole("radiogroup", { name: "Dedicated Editor 类型", exact: true });
  const workspace = subtypeGroup.getByRole("radio", { name: "Workspace", exact: true });
  await workspace.locator("xpath=ancestor::label[1]").click();
  await expect(workspace).toBeChecked();

  const readOnly = stateGroup.getByRole("radio", { name: "Read only", exact: true });
  await readOnly.locator("xpath=ancestor::label[1]").click();
  await expect(readOnly).toBeChecked();

  const workspaceShell = preview.getByLabel("Workspace Editor 示例", { exact: true });
  await expect(workspaceShell).toBeVisible();
  await expect(workspaceShell.getByRole("navigation", { name: "文档大纲", exact: true })).toBeVisible();
  await expect(workspaceShell.getByLabel("文档属性", { exact: true })).toBeVisible();
  await expect(workspaceShell.getByRole("button", { name: "保存", exact: true })).toBeDisabled();

  await preview.screenshot({
    path: testInfo.outputPath("csa-pattern-dedicated-editor-workspace-readonly.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-pattern-editor-form-composition-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "pattern-editor-form-composition",
    viewport: { width: 1200, height: 1100 },
    ready: '[data-pattern="editor-form-composition"]',
  });

  const form = page.locator('[data-pattern="editor-form-composition"]');
  const identity = form.locator('[data-slot="editor-identity"]');
  const feedback = form.getByText("存在未保存变更", { exact: true }).locator('xpath=ancestor::*[@data-slot="alert"][1]');
  const sections = form.locator('[data-pattern="editor-form-section"]');
  const actions = form.locator('[data-pattern="editor-form-actions"]');

  await expect(sections).toHaveCount(2);
  await expect(feedback).toBeVisible();
  await expect(actions.getByRole("button", { name: "保存", exact: true })).toBeVisible();

  const order = await Promise.all([
    identity.boundingBox(),
    feedback.boundingBox(),
    sections.first().boundingBox(),
    sections.nth(1).boundingBox(),
    actions.boundingBox(),
  ]);
  if (order.some((box) => !box)) throw new Error("missing Editor Form composition geometry");
  expect(order[0].y).toBeLessThan(order[1].y);
  expect(order[1].y).toBeLessThan(order[2].y);
  expect(order[2].y).toBeLessThan(order[3].y);
  expect(order[3].y).toBeLessThan(order[4].y);

  const surfaceGroup = page.getByRole("radiogroup", { name: "编辑器 Surface", exact: true });
  const dedicated = surfaceGroup.getByRole("radio", { name: "Dedicated", exact: true });
  await dedicated.locator("xpath=ancestor::label[1]").click();
  await expect(dedicated).toBeChecked();
  await expect(page.getByText(/深度配置：页面拥有完整任务上下文与 Back/)).toBeVisible();

  await form.screenshot({
    path: testInfo.outputPath("csa-pattern-editor-form-dedicated.png"),
    animations: "disabled",
    caret: "hide",
  });

  await page.getByRole("button", { name: "隐藏反馈", exact: true }).click();
  await expect(form.getByText("存在未保存变更", { exact: true })).toBeHidden();
  await page.getByRole("button", { name: "显示反馈", exact: true }).click();
  await expect(form.getByText("存在未保存变更", { exact: true })).toBeVisible();

  await page.setViewportSize({ width: 600, height: 1300 });
  const nameInput = sections.first().locator('input[type="text"]').first();
  const statusLabel = form.getByText("启用资产", { exact: true });
  const mobileFields = await Promise.all([nameInput.boundingBox(), statusLabel.boundingBox()]);
  if (!mobileFields[0] || !mobileFields[1]) throw new Error("missing Editor Form mobile field geometry");
  expect(mobileFields[1].y).toBeGreaterThan(mobileFields[0].y);

  await form.screenshot({
    path: testInfo.outputPath("csa-pattern-editor-form-mobile.png"),
    animations: "disabled",
    caret: "hide",
  });
});

test("csa-pattern-markdown-editor-interaction-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "pattern-markdown-editor",
    viewport: { width: 1200, height: 1000 },
    ready: '[data-slot="markdown-editor"]',
  });

  const editor = page.locator('[data-slot="markdown-editor"]');
  const textarea = editor.getByRole("textbox", { name: "MarkdownEditor Demo 正文", exact: true });
  const toolbar = editor.getByRole("toolbar", { name: "Markdown 编辑工具栏", exact: true });

  await expect(editor).toHaveAttribute("data-mode", "edit");
  await textarea.selectText();
  await toolbar.getByRole("button", { name: "AI 写作", exact: true }).click();
  await expect(textarea).toHaveValue("AI 生成内容");

  await toolbar.getByRole("button", { name: "分屏", exact: true }).click();
  await expect(editor).toHaveAttribute("data-mode", "split");
  await expect(editor.locator('[data-slot="markdown-editor-split"]')).toBeVisible();
  await expect(editor.getByLabel("MarkdownEditor Demo 预览", { exact: true })).toContainText("AI 生成内容");

  await editor.screenshot({
    path: testInfo.outputPath("csa-pattern-markdown-editor-split.png"),
    animations: "disabled",
    caret: "hide",
  });

  await page.setViewportSize({ width: 600, height: 1000 });
  const toolbarGeometry = await toolbar.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    wrap: element.getAttribute("data-adaptive-wrap"),
  }));
  expect(toolbarGeometry.scrollWidth).toBeLessThanOrEqual(toolbarGeometry.clientWidth + 1);
  await expect(toolbar.getByRole("button", { name: "分屏", exact: true })).toBeHidden();

  await editor.screenshot({
    path: testInfo.outputPath("csa-pattern-markdown-editor-mobile-toolbar.png"),
    animations: "disabled",
    caret: "hide",
  });

  await toolbar.getByRole("button", { name: "预览", exact: true }).click();
  await expect(editor).toHaveAttribute("data-mode", "preview");
  await expect(textarea).toBeHidden();
  await expect(editor.getByLabel("MarkdownEditor Demo 预览", { exact: true })).toContainText("AI 生成内容");
});

test("csa-pattern-ai-suggestion-picker-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "pattern-ai-suggestion-picker",
    viewport: { width: 1000, height: 900 },
    ready: '[data-slot="ai-suggestion-picker"]',
  });

  const pickerDemo = page
    .getByRole("heading", { level: 3, name: "候选选择后统一应用", exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const picker = pickerDemo.locator('[data-slot="ai-suggestion-picker"]');
  const currentTitle = pickerDemo.getByRole("textbox", { name: "当前标题", exact: true });
  const group = picker.getByRole("radiogroup", { name: "标题候选列表", exact: true });
  const options = group.getByRole("radio");
  await expect(options).toHaveCount(3);
  await expect(options.nth(0)).toBeChecked();

  const second = options.nth(1);
  const secondValue = await second.getAttribute("aria-label");
  expect(secondValue).toBeTruthy();
  await second.click();
  await expect(second).toBeChecked();
  await picker.getByRole("button", { name: "使用所选", exact: true }).click();
  await expect(currentTitle).toHaveValue(secondValue);

  await picker.screenshot({
    path: testInfo.outputPath("csa-pattern-ai-picker-applied.png"),
    animations: "disabled",
    caret: "hide",
  });

  await picker.getByRole("button", { name: "重新生成 AI 建议", exact: true }).click();
  await expect(options.nth(0)).toBeChecked();
  await expect(options.nth(1)).not.toBeChecked();
  await expect(options.nth(2)).not.toBeChecked();

  await picker.getByRole("button", { name: "取消", exact: true }).click();
  await expect(pickerDemo.locator('[data-slot="ai-suggestion-picker"]')).toBeHidden();
  await pickerDemo.getByRole("button", { name: "重新打开 AI 建议", exact: true }).click();
  await expect(pickerDemo.locator('[data-slot="ai-suggestion-picker"]')).toBeVisible();
});

test("csa-pattern-ai-suggestion-review-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "gouno-ui",
    brand: "blog-admin",
    fixture: "pattern-ai-suggestion-review",
    viewport: { width: 1000, height: 900 },
    ready: '[data-slot="ai-suggestion-review"]',
  });

  const reviewDemo = page
    .getByRole("heading", { level: 3, name: "多字段建议先审阅再提交", exact: true })
    .locator('xpath=ancestor::*[@data-slot="card"][1]');
  const review = reviewDemo.locator('[data-slot="ai-suggestion-review"]');
  const slug = review.getByRole("checkbox", { name: "应用 Slug 建议", exact: true });
  const seoTitle = review.getByRole("checkbox", { name: "应用 SEO 标题 建议", exact: true });
  const seoDescription = review.getByRole("checkbox", { name: "应用 SEO 描述 建议", exact: true });

  await expect(slug).toBeChecked();
  await expect(seoTitle).toBeChecked();
  await expect(seoDescription).toBeChecked();
  await seoDescription.click();
  await expect(seoDescription).not.toBeChecked();

  const apply = review.getByRole("button", { name: "应用 2 项建议", exact: true });
  await expect(apply).toBeEnabled();
  await apply.click();
  await expect(reviewDemo.getByText("最近应用：slug、seo-title", { exact: true })).toBeVisible();

  await review.screenshot({
    path: testInfo.outputPath("csa-pattern-ai-review-two-applied.png"),
    animations: "disabled",
    caret: "hide",
  });

  await review.getByRole("button", { name: "取消", exact: true }).click();
  await expect(reviewDemo.locator('[data-slot="ai-suggestion-review"]')).toBeHidden();
  await reviewDemo.getByRole("button", { name: "重新打开 AI 建议", exact: true }).click();
  await expect(reviewDemo.locator('[data-slot="ai-suggestion-review"]')).toBeVisible();
});

test("csa-pattern-tab-lead-privileged-access-evidence", async ({ page }, testInfo) => {
  await prepareLightFixture(page, {
    workspace: "blog-admin",
    brand: "blog-admin",
    fixture: "blog-admin-ai-settings",
    viewport: { width: 1280, height: 1100 },
    ready: '[role="tablist"]',
  });

  await page.getByRole("tab", { name: "模型连接", exact: true }).click();

  const lead = page.locator('[data-pattern="tab-panel-lead"]').filter({
    hasText: "管理模型连接、密钥状态以及文本与图片生成的默认用途。",
  });
  await expect(lead).toBeVisible();
  const addProvider = lead.getByRole("button", { name: "添加模型连接", exact: true });
  await expect(addProvider).toBeEnabled();

  const fixtureButton = page.getByRole("button", { name: "打开 Fixture 控制", exact: true });
  await fixtureButton.click();
  const security = page.getByRole("radiogroup", { name: "AI 设置高权限安全状态", exact: true });
  const locked = security.getByRole("radio", { name: "已锁定", exact: true });
  await locked.locator("xpath=ancestor::label[1]").click();
  await expect(locked).toBeChecked();
  await page.keyboard.press("Escape");

  const gate = page.locator('[data-slot="blog-privileged-access-gate"]');
  await expect(gate.getByText("高权限操作需要身份验证", { exact: true })).toBeVisible();
  await expect(addProvider).toBeDisabled();
  await expect(gate.locator("[inert]")).toHaveCount(1);

  await page.screenshot({
    path: testInfo.outputPath("csa-pattern-privileged-access-locked.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });

  await gate.getByRole("button", { name: "解锁以管理模型连接", exact: true }).click();
  await expect(gate.getByText("高权限操作已解锁", { exact: true })).toBeVisible();
  await expect(addProvider).toBeEnabled();
  await expect(gate.locator("[inert]")).toHaveCount(0);

  await fixtureButton.click();
  const expiring = page
    .getByRole("radiogroup", { name: "AI 设置高权限安全状态", exact: true })
    .getByRole("radio", { name: "操作时过期", exact: true });
  await expiring.locator("xpath=ancestor::label[1]").click();
  await expect(expiring).toBeChecked();
  await page.keyboard.press("Escape");
  await expect(gate.getByText("近期 MFA 即将过期", { exact: true })).toBeVisible();
  await expect(gate.getByRole("button", { name: "重新锁定", exact: true })).toBeVisible();

  await page.setViewportSize({ width: 600, height: 1200 });
  const description = lead.getByText(
    "管理模型连接、密钥状态以及文本与图片生成的默认用途。",
    { exact: true },
  );
  const exportButton = lead.getByRole("button", { name: "导出模型连接", exact: true });
  const mobileLead = await Promise.all([description.boundingBox(), exportButton.boundingBox()]);
  if (!mobileLead[0] || !mobileLead[1]) throw new Error("missing TabPanelLead mobile geometry");
  expect(mobileLead[1].y).toBeGreaterThan(mobileLead[0].y);

  await page.screenshot({
    path: testInfo.outputPath("csa-pattern-tab-lead-privileged-expiring-mobile.png"),
    fullPage: true,
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
