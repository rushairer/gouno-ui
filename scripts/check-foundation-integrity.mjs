import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const matrix = JSON.parse(readFileSync(resolve(root, "foundation-integrity.json"), "utf8"));
const reviews = readFileSync(resolve(root, "showcase/catalog/component-progress.ts"), "utf8");
const gateNames = matrix.gates;
const allowedGateStatus = new Set(matrix.statusValues);
const allowedFoundationStatus = new Set(["planned", "reopened", "in_progress", "certified"]);
const failures = [];
let passed = 0;
let total = 0;

for (const [name, foundation] of Object.entries(matrix.foundations)) {
  if (!allowedFoundationStatus.has(foundation.status)) {
    failures.push(name + ": unknown foundation status " + foundation.status);
  }
  const keys = Object.keys(foundation.gates || {});
  for (const gate of gateNames) {
    total += 1;
    const record = foundation.gates && foundation.gates[gate];
    if (!record) {
      failures.push(name + ": missing gate " + gate);
      continue;
    }
    if (!allowedGateStatus.has(record.status)) {
      failures.push(name + "." + gate + ": unknown status " + record.status);
    }
    if (!Array.isArray(record.evidence)) {
      failures.push(name + "." + gate + ": evidence must be an array");
    }
    if (record.status === "passed") {
      passed += 1;
      if (!record.evidence.length) {
        failures.push(name + "." + gate + ": passed gate requires repository evidence");
      }
    }
  }
  for (const extra of keys.filter((key) => !gateNames.includes(key))) {
    failures.push(name + ": unknown gate " + extra);
  }
  const allPassed = gateNames.every((gate) => foundation.gates?.[gate]?.status === "passed");
  if (foundation.status === "certified" && !allPassed) {
    failures.push(name + ": certified requires all gates passed");
  }
  if (allPassed && foundation.status !== "certified") {
    failures.push(name + ": all gates passed but status is not certified");
  }
  if (foundation.status !== "certified") {
    const reopenedIds = new Set();
    for (const match of reviews.matchAll(
      /componentReviews\["([^"]+)"\]\s*=\s*\{\s*status:\s*"reopened"/g,
    )) {
      reopenedIds.add(match[1]);
    }
    for (const match of reviews.matchAll(
      /for\s*\(const\s+id\s+of\s+\[([\s\S]*?)\]\)\s*\{\s*componentReviews\[id\]\s*=\s*\{\s*status:\s*"reopened"/g,
    )) {
      for (const idMatch of match[1].matchAll(/"([^"]+)"/g)) {
        reopenedIds.add(idMatch[1]);
      }
    }
    for (const id of foundation.affectedComponentReviews || []) {
      if (!reopenedIds.has(id)) {
        failures.push(name + ": affected review " + id + " must be explicitly reopened");
      }
    }
  }
}


function collectTsx(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTsx(path);
    return entry.isFile() && path.endsWith(".tsx") ? [path] : [];
  });
}

const canonicalProductRoots = [
  resolve(root, "showcase/demos/products/blog-admin"),
  resolve(root, "showcase/demos/products/gosso-admin"),
  resolve(root, "showcase/demos/products/blog"),
];
const canonicalProductFiles = canonicalProductRoots.flatMap(collectTsx);

function filesMatching(pattern) {
  return canonicalProductFiles.filter((file) =>
    pattern.test(readFileSync(file, "utf8")),
  );
}

const typography = matrix.foundations.typography;
if (typography) {
  const applicationRoots = [
    resolve(root, "showcase/demos/products/blog-admin"),
    resolve(root, "showcase/demos/products/gosso-admin"),
  ];
  const publicRoot = resolve(root, "showcase/demos/products/blog");
  const canonicalCompositionFiles = [
    resolve(root, "showcase/components/tab-panel-lead.tsx"),
    resolve(root, "showcase/components/patterns/dedicated-editor.tsx"),
    resolve(root, "showcase/components/patterns/editor-form-composition.tsx"),
    resolve(root, "showcase/components/patterns/admin-data-composition.tsx"),
  ];
  const applicationFiles = applicationRoots.flatMap(collectTsx);
  const publicFiles = collectTsx(publicRoot);
  const allFiles = [...applicationFiles, ...publicFiles];
  const rawMetricUtility =
    /\b(?:text-(?:xs|sm|base|lg|xl|[2-9]xl|\[[^\]]+\])|font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black|mono|sans)|(?<!type-)tracking-[^\s"'\x60]+|(?<!type-)leading-[^\s"'\x60]+)/;
  const textTags = /<Text\b[\s\S]{0,500}?>/g;
  const nativeTextTags =
    /<(?:p|span|strong|time|dt|dd|div|code|pre|label|small|em|a)\b[\s\S]{0,500}?>/g;

  let rawHeadings = 0;
  let textMetricOverrides = 0;

  for (const file of allFiles) {
    const source = readFileSync(file, "utf8");
    rawHeadings += (source.match(/<h[1-6]\b/g) ?? []).length;
    textMetricOverrides += (source.match(textTags) ?? []).filter((tag) =>
      rawMetricUtility.test(tag),
    ).length;
  }

  const countNativeBypasses = (files) =>
    files.reduce((count, file) => {
      const source = readFileSync(file, "utf8");
      return (
        count +
        (source.match(nativeTextTags) ?? []).filter((tag) =>
          rawMetricUtility.test(tag),
        ).length
      );
    }, 0);

  const applicationNativeMetricBypasses = countNativeBypasses(applicationFiles);
  const publicNativeMetricBypasses = countNativeBypasses(publicFiles);
  const compositionMetricBypasses = canonicalCompositionFiles.reduce(
    (count, file) => {
      const source = readFileSync(file, "utf8");
      const componentTags = [
        ...(source.match(/<Heading\\b[\\s\\S]{0,500}?>/g) ?? []),
        ...(source.match(/<CardTitle\\b[\\s\\S]{0,500}?>/g) ?? []),
        ...(source.match(textTags) ?? []),
      ];
      return (
        count +
        (source.match(/<h[1-6]\\b/g) ?? []).length +
        componentTags.filter((tag) => rawMetricUtility.test(tag)).length
      );
    },
    0,
  );

  process.stdout.write(
    "Typography corpus audit: rawHeadings=" +
      rawHeadings +
      ", TextMetricOverrides=" +
      textMetricOverrides +
      ", applicationNativeMetricBypasses=" +
      applicationNativeMetricBypasses +
      ", publicNativeMetricBypasses=" +
      publicNativeMetricBypasses +
      ", compositionMetricBypasses=" +
      compositionMetricBypasses +
      "\n",
  );

  if (rawHeadings !== 0) {
    failures.push("typography.guard: raw h1-h6 returned to the product corpus");
  }
  if (textMetricOverrides !== 0) {
    failures.push("typography.guard: Text metric overrides returned to the product corpus");
  }
  if (compositionMetricBypasses !== 0) {
    failures.push(
      "typography.guard: canonical composition helpers bypass Typography authority",
    );
  }

  const corpusGate = typography.gates?.corpus;
  if (corpusGate?.status === "passed") {
    if (applicationNativeMetricBypasses !== 0 || publicNativeMetricBypasses !== 0) {
      failures.push("typography.corpus: native typography utility bypasses remain in product corpora");
    }
  } else {
    const expectedApplication = corpusGate?.remainingNativeMetricBypasses;
    const expectedPublic = corpusGate?.remainingPublicMetricBypasses;
    if (typeof expectedApplication !== "number" || typeof expectedPublic !== "number") {
      failures.push(
        "typography.corpus: in-progress gate must record application and public-reading bypass counts",
      );
    } else {
      if (applicationNativeMetricBypasses !== expectedApplication) {
        failures.push(
          "typography.corpus: application bypass ledger is stale; expected " +
            expectedApplication +
            ", found " +
            applicationNativeMetricBypasses +
            ". Update corpus and ledger in the same stage.",
        );
      }
      if (publicNativeMetricBypasses !== expectedPublic) {
        failures.push(
          "typography.corpus: public-reading bypass ledger is stale; expected " +
            expectedPublic +
            ", found " +
            publicNativeMetricBypasses +
            ". Update corpus and ledger in the same stage.",
        );
      }
    }
  }
}


const spacing = matrix.foundations.spacing;
if (spacing?.status !== "planned") {
  const layoutSource = readFileSync(resolve(root, "src/core/layout.tsx"), "utf8");
  const tokenSource = readFileSync(resolve(root, "src/tokens.css"), "utf8");
  for (const name of ["xs", "sm", "md", "lg", "xl"]) {
    if (!tokenSource.includes("--space-" + name + ":")) {
      failures.push("spacing.guard: missing semantic spacing token " + name);
    }
    if (!tokenSource.includes(".gap-space-" + name)) {
      failures.push("spacing.guard: missing semantic gap utility " + name);
    }
  }
  for (const name of ["xs", "sm", "md", "lg", "xl"]) {
    if (!layoutSource.includes('"gap-space-' + name + '"')) {
      failures.push("spacing.guard: layout helpers do not consume semantic gap " + name);
    }
  }
  if (/\b(?:xs|sm|md|lg|xl):\s*"gap-\d/.test(layoutSource)) {
    failures.push(
      "spacing.guard: named layout gaps reintroduced component-local Tailwind scales",
    );
  }

  const spacingLeaks = filesMatching(/\bgap-space-(?:xs|sm|md|lg|xl)\b/);
  process.stdout.write(
    "Spacing corpus audit: foundationUtilityLeaks=" + spacingLeaks.length + "\n",
  );
  if (spacingLeaks.length !== 0) {
    failures.push(
      "spacing.corpus: product fixtures must not copy Foundation gap utility classes directly",
    );
  }
}

const sizing = matrix.foundations.sizing;
if (sizing?.status !== "planned") {
  const tokenSource = readFileSync(resolve(root, "src/tokens.css"), "utf8");
  const controlTypesSource = readFileSync(
    resolve(root, "src/core/control-types.ts"),
    "utf8",
  );
  const coreButtonSource = readFileSync(resolve(root, "src/core/button.tsx"), "utf8");
  const primitiveButtonSource = readFileSync(
    resolve(root, "src/components/primitives/button.tsx"),
    "utf8",
  );
  const otpSource = readFileSync(resolve(root, "src/core/input-otp.tsx"), "utf8");
  const segmentedSource = readFileSync(
    resolve(root, "src/core/segmented.tsx"),
    "utf8",
  );

  for (const [name, value] of [
    ["small", "2rem"],
    ["middle", "2.25rem"],
    ["large", "2.75rem"],
  ]) {
    if (!tokenSource.includes("--control-height-" + name + ": " + value + ";")) {
      failures.push(
        "sizing.guard: missing canonical control height " + name + "=" + value,
      );
    }
  }

  for (const marker of [
    'small: "h-[var(--control-height-small)] text-sm"',
    'middle: "h-[var(--control-height-middle)] text-sm"',
    'large: "h-[var(--control-height-large)] text-base"',
  ]) {
    if (!controlTypesSource.includes(marker)) {
      failures.push("sizing.guard: ControlSize escaped semantic height authority");
      break;
    }
  }
  if (!coreButtonSource.includes("export type ButtonSize = ControlSize;")) {
    failures.push("sizing.guard: ButtonSize must reuse ControlSize");
  }
  if (/(?:^|["'`\s])control-(?:height|square|inset-height)-(?:small|middle|large)\b/.test(
    controlTypesSource + primitiveButtonSource + otpSource + segmentedSource,
  )) {
    failures.push(
      "sizing.guard: bespoke sizing utility classes break Tailwind height override semantics",
    );
  }
  for (const marker of [
    'sm: "h-[var(--control-height-small)]',
    'default: "h-[var(--control-height-middle)]',
    'lg: "h-[var(--control-height-large)]',
  ]) {
    if (!primitiveButtonSource.includes(marker)) {
      failures.push("sizing.guard: Button primitive escaped ControlSize geometry");
      break;
    }
  }
  for (const marker of [
    'small: "size-[var(--control-height-small)]',
    'middle: "size-[var(--control-height-middle)]',
    'large: "size-[var(--control-height-large)]',
  ]) {
    if (!otpSource.includes(marker)) {
      failures.push("sizing.guard: InputOTP escaped ControlSize geometry");
      break;
    }
  }
  for (const marker of [
    'small: "h-[calc(var(--control-height-small)-0.25rem)]',
    'middle: "h-[calc(var(--control-height-middle)-0.25rem)]',
    'large: "h-[calc(var(--control-height-large)-0.25rem)]',
  ]) {
    if (!segmentedSource.includes(marker)) {
      failures.push("sizing.guard: Segmented escaped derived ControlSize geometry");
      break;
    }
  }

  const sizingLeaks = filesMatching(
    /\b(?:h|size)-\[(?:var\(|calc\(var\()--control-height-(?:small|middle|large)/,
  );
  process.stdout.write(
    "Sizing corpus audit: foundationUtilityLeaks=" + sizingLeaks.length + "\n",
  );
  if (sizingLeaks.length !== 0) {
    failures.push(
      "sizing.corpus: product fixtures must use component size semantics instead of Foundation geometry classes",
    );
  }
}

const radius = matrix.foundations.radius;
if (radius?.status !== "planned") {
  const tokenSource = readFileSync(resolve(root, "src/tokens.css"), "utf8");
  const baseSource = readFileSync(resolve(root, "src/base.css"), "utf8");
  const checkboxSource = readFileSync(
    resolve(root, "src/components/primitives/checkbox.tsx"),
    "utf8",
  );
  const tooltipSource = readFileSync(
    resolve(root, "src/components/primitives/tooltip.tsx"),
    "utf8",
  );

  for (const marker of [
    "--radius-sm: 4px;",
    "--radius-md: 6px;",
    "--radius-lg: 10px;",
    "--radius-xl: 10px;",
    "--radius: var(--radius-md);",
    "--radius-control: var(--radius-md);",
  ]) {
    if (!tokenSource.includes(marker)) {
      failures.push("radius.guard: missing canonical radius marker " + marker);
    }
  }
  if (/--radius(?:-control)?:\s*6px;/.test(tokenSource)) {
    failures.push(
      "radius.guard: compatibility/control radius aliases must not own duplicate numeric values",
    );
  }
  if (!baseSource.includes("border-radius: var(--radius-control);")) {
    failures.push("radius.guard: Button base radius escaped the control alias");
  }
  if (!checkboxSource.includes("rounded-sm") || checkboxSource.includes("rounded-[4px]")) {
    failures.push("radius.guard: Checkbox must consume the semantic small radius");
  }
  if (!tooltipSource.includes("rounded-[2px]")) {
    failures.push(
      "radius.guard: documented Tooltip arrow shape exception changed without inventory review",
    );
  }

  const arbitraryProductRadius = filesMatching(/\brounded-\[[^\]]+\]/);
  process.stdout.write(
    "Radius corpus audit: arbitraryRadiusBypasses=" +
      arbitraryProductRadius.length +
      "\n",
  );
  if (arbitraryProductRadius.length !== 0) {
    failures.push(
      "radius.corpus: product fixtures must not define arbitrary radius values",
    );
  }
}

const color = matrix.foundations.color;
if (color?.status !== "planned") {
  const tokenSource = readFileSync(resolve(root, "src/tokens.css"), "utf8");
  const themeSource = readFileSync(resolve(root, "src/theme/provider.tsx"), "utf8");
  const alertSource = readFileSync(resolve(root, "src/core/alert.tsx"), "utf8");
  const imageSource = readFileSync(resolve(root, "src/core/image.tsx"), "utf8");
  const qrcodeSource = readFileSync(resolve(root, "src/core/qrcode.tsx"), "utf8");
  const tagSource = readFileSync(resolve(root, "src/core/tag.tsx"), "utf8");
  const badgeSource = readFileSync(resolve(root, "src/core/badge.tsx"), "utf8");
  const timelineSource = readFileSync(resolve(root, "src/core/timeline.tsx"), "utf8");
  const mfaFile = resolve(
    root,
    "showcase/demos/products/gosso-admin/account-settings/mfa.tsx",
  );
  const mfaSource = readFileSync(mfaFile, "utf8");
  const showcaseIndexSource = readFileSync(
    resolve(root, "showcase/index.html"),
    "utf8",
  );

  for (const marker of [
    "--color-background: var(--background);",
    "--color-foreground: var(--foreground);",
    "--color-border: var(--border);",
    "--color-ring: var(--ring);",
    "--color-overlay: var(--overlay);",
    "--color-overlay-foreground: var(--overlay-foreground);",
    "--overlay-foreground: #ffffff;",
  ]) {
    if (!tokenSource.includes(marker)) {
      failures.push("color.guard: missing semantic color marker " + marker);
    }
  }

  for (const marker of [
    'getPropertyValue("--background").trim()',
    "syncBrowserThemeColor(root);",
  ]) {
    if (!themeSource.includes(marker)) {
      failures.push("color.guard: ThemeProvider missing token-driven browser color marker " + marker);
    }
  }
  if (!showcaseIndexSource.includes('<meta name="theme-color" content="">')) {
    failures.push(
      "color.guard: canonical Showcase must provide the ThemeProvider browser theme-color target",
    );
  }

  if (/"#(?:11151b|ffffff)"/i.test(themeSource)) {
    failures.push(
      "color.guard: ThemeProvider must not duplicate light/dark background literals",
    );
  }

  if (
    !alertSource.includes("hover:bg-foreground/5") ||
    !alertSource.includes("dark:hover:bg-foreground/10") ||
    /hover:bg-(?:black|white)\//.test(alertSource)
  ) {
    failures.push(
      "color.guard: Alert close hover must derive from semantic foreground color",
    );
  }

  if (
    !imageSource.includes("text-overlay-foreground") ||
    imageSource.includes("text-white")
  ) {
    failures.push(
      "color.guard: Image overlay copy must consume overlay-foreground",
    );
  }

  if (
    !tagSource.includes("hover:bg-current/10") ||
    /hover:bg-(?:black|white)\//.test(tagSource)
  ) {
    failures.push(
      "color.guard: Tag close hover must derive from current/semantic foreground color",
    );
  }

  for (const [name, source, marker] of [
    ["QRCode foreground", qrcodeSource, 'color = "#000000"'],
    ["QRCode background", qrcodeSource, 'background = "#ffffff"'],
    ["Tag custom color", tagSource, "backgroundColor: selected || semanticColor ? undefined : color"],
    ["Badge custom color", badgeSource, "backgroundColor: color"],
    ["Timeline custom color", timelineSource, '"--timeline-color": color'],
    ["MFA QR quiet zone", mfaSource, 'rounded-lg border bg-white p-4'],
  ]) {
    if (!source.includes(marker)) {
      failures.push(
        "color.guard: documented fixed/caller-owned color exception changed: " + name,
      );
    }
  }

  const rawPaletteUtility =
    /\b(?:bg|text|border|ring|fill|stroke)-(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+)(?:\/\d+)?\b|\b(?:bg|text|border|ring|fill|stroke)-\[(?:#|rgb|hsl|oklch|oklab|color:)[^\]]+\]/;
  const rawProductColorFiles = filesMatching(rawPaletteUtility);
  const unexpectedRawProductColors = rawProductColorFiles.filter(
    (file) => file !== mfaFile,
  );
  const mfaRawColors = [
    ...mfaSource.matchAll(new RegExp(rawPaletteUtility.source, "g")),
  ].map((match) => match[0]);
  const mfaExceptionValid =
    mfaRawColors.length === 1 && mfaRawColors[0] === "bg-white";

  const shortColorPath = (file) =>
    file.startsWith(root) ? file.slice(root.length + 1) : file;
  process.stdout.write(
    "Color corpus audit: unexpectedRawPaletteFiles=" +
      unexpectedRawProductColors.length +
      " [" +
      unexpectedRawProductColors.map(shortColorPath).join(", ") +
      "], mfaFixedColorException=" +
      (mfaExceptionValid ? "valid" : "invalid") +
      "\n",
  );

  if (unexpectedRawProductColors.length !== 0) {
    failures.push(
      "color.corpus: product UI must consume semantic colors instead of raw palette/arbitrary color utilities",
    );
  }
  if (!mfaExceptionValid) {
    failures.push(
      "color.corpus: Gosso MFA fixed white QR quiet-zone exception changed and requires Color inventory review",
    );
  }
}

const border = matrix.foundations.border;
if (border?.status !== "planned") {
  const tokenSource = readFileSync(resolve(root, "src/tokens.css"), "utf8");
  const baseSource = readFileSync(resolve(root, "src/base.css"), "utf8");
  const spinnerSource = readFileSync(resolve(root, "src/core/spinner.tsx"), "utf8");
  const timelineSource = readFileSync(resolve(root, "src/core/timeline.tsx"), "utf8");
  const stepsSource = readFileSync(resolve(root, "src/core/steps.tsx"), "utf8");
  const tableSource = readFileSync(
    resolve(root, "src/components/primitives/table.tsx"),
    "utf8",
  );
  const demoSectionSource = readFileSync(
    resolve(root, "showcase/components/demo-section.tsx"),
    "utf8",
  );
  const markdownSource = readFileSync(
    resolve(root, "showcase/components/markdown-preview.tsx"),
    "utf8",
  );
  const selectedRecordSource = readFileSync(
    resolve(
      root,
      "showcase/demos/products/blog-admin/ai/operations/canonical-patterns.tsx",
    ),
    "utf8",
  );
  const articleDetailSource = readFileSync(
    resolve(root, "showcase/demos/products/blog/article-detail.tsx"),
    "utf8",
  );
  const documentPageSource = readFileSync(
    resolve(root, "showcase/demos/products/blog/document-pages.tsx"),
    "utf8",
  );

  for (const marker of [
    "--border-width-boundary: 1px;",
    "--border-width-emphasis: 2px;",
    "--border-width-accent: 4px;",
    "@utility edge-emphasis",
    "@utility edge-s-accent",
    "@utility edge-bs-emphasis",
    "@utility edge-be-emphasis",
    "@utility edge-s-emphasis",
    "@utility edge-e-emphasis",
  ]) {
    if (!tokenSource.includes(marker)) {
      failures.push("border.guard: missing canonical border marker " + marker);
    }
  }

  if (!baseSource.includes("border-color: var(--border);")) {
    failures.push(
      "border.guard: ordinary border color must default to the semantic border token",
    );
  }

  for (const [name, source, marker] of [
    ["Spinner", spinnerSource, "edge-emphasis border-current border-e-transparent"],
    ["Timeline", timelineSource, "block size-3 rounded-full edge-emphasis"],
    ["Steps", stepsSource, "edge-be-emphasis border-primary"],
    ["Table", tableSource, "[&_tfoot_tr]:edge-bs-emphasis"],
    ["DemoSection", demoSectionSource, "edge-be-emphasis"],
    ["MarkdownPreview", markdownSource, "edge-s-emphasis ps-4"],
    ["SelectedRecord", selectedRecordSource, "edge-s-emphasis"],
    ["ArticleQuote", articleDetailSource, "edge-s-accent border-s-primary/40"],
    ["DocumentQuote", documentPageSource, "edge-s-accent border-s-primary/40"],
  ]) {
    if (!source.includes(marker)) {
      failures.push(
        "border.guard: " + name + " escaped the semantic emphasis-width authority",
      );
    }
  }

  const migratedSources =
    spinnerSource +
    timelineSource +
    stepsSource +
    tableSource +
    demoSectionSource +
    markdownSource +
    selectedRecordSource;
  if (/\bborder(?:-(?:t|r|b|l|x|y|s|e|bs|be))?-2\b/.test(migratedSources)) {
    failures.push(
      "border.guard: registered emphasis roles must not reintroduce raw 2px utilities",
    );
  }
  if (
    /\bborder-l-(?:primary|transparent)\b/.test(
      markdownSource + selectedRecordSource,
    )
  ) {
    failures.push(
      "border.guard: directional emphasis leads must use logical inline-start semantics",
    );
  }

  const numericBorderWidth =
    /\bborder(?:-(?:t|r|b|l|x|y|s|e|bs|be))?-(?:[2-9]|[1-9]\d+)\b|\bborder(?:-(?:t|r|b|l|x|y|s|e|bs|be))?-\[(?:\d|calc\(|length:)[^\]]+\]/;
  const hardCodedNeutralBorder =
    /\bborder-(?:white|black|gray(?:-\d+)?|slate(?:-\d+)?|zinc(?:-\d+)?|neutral(?:-\d+)?|stone(?:-\d+)?)\b|\bborder-\[#[0-9a-fA-F]{3,8}\]/;

  const numericWidthLeaks = filesMatching(numericBorderWidth);
  const neutralColorLeaks = filesMatching(hardCodedNeutralBorder);
  const shortPath = (file) => file.startsWith(root) ? file.slice(root.length + 1) : file;
  process.stdout.write(
    "Border corpus audit: numericWidthBypasses=" +
      numericWidthLeaks.length +
      " [" +
      numericWidthLeaks.map(shortPath).join(", ") +
      "], hardCodedNeutralColors=" +
      neutralColorLeaks.length +
      " [" +
      neutralColorLeaks.map(shortPath).join(", ") +
      "]\n",
  );
  if (numericWidthLeaks.length !== 0) {
    failures.push(
      "border.corpus: product fixtures must use admitted semantic border-width roles instead of numeric/ad-hoc widths",
    );
  }
  if (neutralColorLeaks.length !== 0) {
    failures.push(
      "border.corpus: product fixtures must use semantic border/state colors instead of hard-coded neutral colors",
    );
  }
}

const elevation = matrix.foundations.elevation;
if (elevation?.status !== "planned") {
  const tokenSource = readFileSync(resolve(root, "src/tokens.css"), "utf8");
  const cardSource = readFileSync(resolve(root, "src/core/card.tsx"), "utf8");
  const tableSource = readFileSync(
    resolve(root, "src/components/primitives/table.tsx"),
    "utf8",
  );
  const buttonSource = readFileSync(
    resolve(root, "src/components/primitives/button.tsx"),
    "utf8",
  );
  const segmentedSource = readFileSync(
    resolve(root, "src/core/segmented.tsx"),
    "utf8",
  );
  const dialogSource = readFileSync(
    resolve(root, "src/components/primitives/dialog.tsx"),
    "utf8",
  );
  const sheetSource = readFileSync(
    resolve(root, "src/components/primitives/sheet.tsx"),
    "utf8",
  );
  const popoverSource = readFileSync(
    resolve(root, "src/components/primitives/popover.tsx"),
    "utf8",
  );

  for (const marker of [
    "--shadow-control: var(--elevation-shadow-control);",
    "--shadow-surface: var(--elevation-shadow-surface);",
    "--shadow-raised: var(--elevation-shadow-raised);",
    "--shadow-overlay: var(--elevation-shadow-overlay);",
    "--shadow-modal: var(--elevation-shadow-modal);",
  ]) {
    if (!tokenSource.includes(marker)) {
      failures.push("elevation.guard: missing semantic elevation marker " + marker);
    }
  }
  for (const size of ["xs", "sm", "md", "lg", "xl", "2xl"]) {
    if (!tokenSource.includes("--shadow-" + size + ": 0 0 #0000;")) {
      failures.push(
        "elevation.guard: raw shadow alias " + size + " must remain flat compatibility vocabulary",
      );
    }
  }

  for (const [name, source, marker] of [
    ["Card surface", cardSource, 'variant === "default" && "shadow-surface"'],
    ["Card raised", cardSource, 'variant === "elevated" && "bg-raised shadow-raised"'],
    ["Table surface", tableSource, 'bordered ? "border border-border/80 bg-card shadow-surface"'],
    ["Button control", buttonSource, "shadow-control"],
    ["Segmented control", segmentedSource, "peer-checked:shadow-control"],
    ["Popover overlay", popoverSource, "shadow-overlay"],
    ["Dialog modal", dialogSource, "shadow-modal"],
    ["Sheet modal", sheetSource, "shadow-modal"],
  ]) {
    if (!source.includes(marker)) {
      failures.push("elevation.guard: canonical owner changed: " + name);
    }
  }

  const rawShadowPattern =
    /\bshadow-(?:xs|sm|md|lg|xl|2xl)\b|\bshadow-\[[^\]]+\]|\bboxShadow\s*:/;
  const rawShadowFiles = filesMatching(rawShadowPattern);

  const semanticShadowFiles = canonicalProductFiles.filter((file) =>
    /\bshadow-(?:control|surface|raised|overlay|modal)\b/.test(
      readFileSync(file, "utf8"),
    ),
  );
  const overviewFile = resolve(
    root,
    "showcase/demos/products/gosso-admin/overview.tsx",
  );
  const unexpectedSemanticShadowFiles = semanticShadowFiles;

  const elevatedVariantFiles = canonicalProductFiles.filter((file) =>
    /variant=["']elevated["']/.test(readFileSync(file, "utf8")),
  );
  const allowedElevatedFiles = new Set([
    overviewFile,
    resolve(root, "showcase/demos/products/gosso-admin/auth/shared.tsx"),
    resolve(root, "showcase/demos/products/gosso-admin/auth/not-found.tsx"),
  ]);
  const unexpectedElevatedFiles = elevatedVariantFiles.filter(
    (file) => !allowedElevatedFiles.has(file),
  );

  const shortElevationPath = (file) =>
    file.startsWith(root) ? file.slice(root.length + 1) : file;
  process.stdout.write(
    "Elevation corpus audit: rawShadowBypasses=" +
      rawShadowFiles.length +
      ", unexpectedSemanticShadowFiles=" +
      unexpectedSemanticShadowFiles.length +
      ", unexpectedElevatedFiles=" +
      unexpectedElevatedFiles.length +
      "\n",
  );

  if (rawShadowFiles.length !== 0) {
    failures.push(
      "elevation.corpus: product fixtures must not use raw size/arbitrary/page-local box shadows",
    );
  }
  if (unexpectedSemanticShadowFiles.length !== 0) {
    failures.push(
      "elevation.corpus: product-owned semantic shadows require explicit elevation audit: " +
        unexpectedSemanticShadowFiles.map(shortElevationPath).join(", "),
    );
  }
  if (unexpectedElevatedFiles.length !== 0) {
    failures.push(
      "elevation.corpus: persistent elevated Card variants require whitelist review: " +
        unexpectedElevatedFiles.map(shortElevationPath).join(", "),
    );
  }
}

const surface = matrix.foundations.surface;
if (surface?.status !== "planned") {
  const cardSource = readFileSync(resolve(root, "src/core/card.tsx"), "utf8");
  const tableSource = readFileSync(
    resolve(root, "src/components/primitives/table.tsx"),
    "utf8",
  );
  const overviewSource = readFileSync(
    resolve(root, "showcase/demos/products/gosso-admin/overview.tsx"),
    "utf8",
  );

  for (const marker of [
    '"min-w-0 rounded-lg border bg-card text-card-foreground flex flex-col gap-5"',
    'variant === "default" && "shadow-surface"',
    'variant === "subtle" && "bg-muted"',
    'variant === "elevated" && "bg-raised shadow-raised"',
    'interactive && "cursor-pointer transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-raised"',
  ]) {
    if (!cardSource.includes(marker)) {
      failures.push("surface.guard: Card canonical anatomy changed: " + marker);
    }
  }
  if (
    !tableSource.includes(
      'bordered ? "border border-border/80 bg-card shadow-surface" : "bg-card/40"',
    )
  ) {
    failures.push("surface.guard: bordered Table escaped canonical collection Surface");
  }

  for (const marker of ["<Card", "interactive", 'padding="none"']) {
    if (!overviewSource.includes(marker)) {
      failures.push(
        "surface.guard: Gosso Overview Quick Link must consume Card interactive: " +
          marker,
      );
    }
  }
  if (
    /\bshadow-(?:control|surface|raised|overlay|modal)\b/.test(overviewSource)
  ) {
    failures.push(
      "surface.guard: Gosso Overview must not reproduce semantic Surface depth in product code",
    );
  }

  const directSemanticShadowFiles = canonicalProductFiles.filter((file) =>
    /\bshadow-(?:control|surface|raised|overlay|modal)\b/.test(
      readFileSync(file, "utf8"),
    ),
  );

  const fullCardTreatmentPattern =
    /rounded-(?:md|lg|xl)[^"'\x60]{0,180}\bborder\b[^"'\x60]{0,180}\bbg-card\b[^"'\x60]{0,180}\bshadow-surface\b|\bshadow-surface\b[^"'\x60]{0,180}\bbg-card\b/;
  const duplicatedCardSurfaceFiles = canonicalProductFiles.filter((file) =>
    fullCardTreatmentPattern.test(readFileSync(file, "utf8")),
  );

  const shortSurfacePath = (file) =>
    file.startsWith(root) ? file.slice(root.length + 1) : file;
  process.stdout.write(
    "Surface corpus audit: directSemanticShadowBypasses=" +
      directSemanticShadowFiles.length +
      ", duplicatedCardSurfaceBundles=" +
      duplicatedCardSurfaceFiles.length +
      "\n",
  );

  if (directSemanticShadowFiles.length !== 0) {
    failures.push(
      "surface.corpus: product fixtures must select Surface-owning components/variants instead of semantic shadow utilities: " +
        directSemanticShadowFiles.map(shortSurfacePath).join(", "),
    );
  }
  if (duplicatedCardSurfaceFiles.length !== 0) {
    failures.push(
      "surface.corpus: product fixtures must not reproduce the canonical Card surface bundle: " +
        duplicatedCardSurfaceFiles.map(shortSurfacePath).join(", "),
    );
  }
}

const responsive = matrix.foundations.responsive;
if (responsive?.status !== "planned") {
  const tokenSource = readFileSync(resolve(root, "src/tokens.css"), "utf8");
  const baseSource = readFileSync(resolve(root, "src/base.css"), "utf8");
  const stepsSource = readFileSync(resolve(root, "src/core/steps.tsx"), "utf8");
  const stepsDocSource = readFileSync(
    resolve(root, "showcase/demos/core/steps-menu.tsx"),
    "utf8",
  );

  for (const marker of [
    "--breakpoint-sm: 40rem;",
    "--breakpoint-md: 48rem;",
    "--breakpoint-lg: 64rem;",
    "--breakpoint-xl: 80rem;",
    "--breakpoint-2xl: 96rem;",
  ]) {
    if (!tokenSource.includes(marker)) {
      failures.push("responsive.guard: missing canonical breakpoint " + marker);
    }
  }

  for (const marker of [
    "@media (width < 48rem)",
    "@media (width >= 40rem)",
    "@media (width >= 48rem)",
    "@media (width >= 64rem)",
    "@media (width >= 80rem)",
    "@media (width >= 96rem)",
  ]) {
    if (!baseSource.includes(marker)) {
      failures.push("responsive.guard: Base CSS escaped canonical tier " + marker);
    }
  }
  if (/@media\s*\((?:min|max)-width:\s*\d+px/.test(baseSource)) {
    failures.push(
      "responsive.guard: Base CSS reintroduced px copies of canonical breakpoints",
    );
  }

  if (
    !stepsSource.includes(
      '"max-sm:flex-col max-sm:overflow-visible"',
    )
  ) {
    failures.push(
      "responsive.guard: Steps responsive stacking must consume canonical max-sm",
    );
  }

  for (const marker of [
    "max-sm:w-full max-sm:min-w-0 max-sm:flex-none max-sm:pb-3",
    "max-sm:flex-row max-sm:items-start",
    'data-layout="mobile-vertical"',
    'data-layout="desktop-inline"',
  ]) {
    if (!stepsSource.includes(marker)) {
      failures.push(
        "responsive.guard: Steps responsive composition lost connector/body geometry marker " +
          marker,
      );
    }
  }
  if (/max-\[[^\]]+\]:|min-\[[^\]]+\]:/.test(stepsSource)) {
    failures.push(
      "responsive.guard: Steps reintroduced an arbitrary responsive threshold",
    );
  }
  if (
    !stepsDocSource.includes(
      "低于 canonical sm（40rem / 640px）时将 horizontal 流程切为纵向排列",
    )
  ) {
    failures.push(
      "responsive.guard: Steps public docs must name the canonical responsive threshold",
    );
  }

  const sourceResponsiveFiles = collectTsx(resolve(root, "src"));
  const responsiveCorpusFiles = [
    ...sourceResponsiveFiles,
    ...canonicalProductFiles,
  ];
  const arbitraryResponsiveFiles = responsiveCorpusFiles.filter((file) =>
    /(?:^|\s)(?:min|max)-\[[^\]]+\]:/.test(
      readFileSync(file, "utf8"),
    ),
  );
  const pxWidthMediaQueries = [
    ["src/base.css", baseSource],
    ["src/tokens.css", tokenSource],
  ].filter(([, source]) =>
    /@media\s*\((?:min|max)-width:\s*\d+px/.test(source),
  );

  const shortResponsivePath = (file) =>
    file.startsWith(root) ? file.slice(root.length + 1) : file;
  process.stdout.write(
    "Responsive corpus audit: arbitraryResponsiveVariants=" +
      arbitraryResponsiveFiles.length +
      ", pxWidthMediaQueries=" +
      pxWidthMediaQueries.length +
      "\n",
  );

  if (arbitraryResponsiveFiles.length !== 0) {
    failures.push(
      "responsive.corpus: arbitrary min/max responsive variants require an admitted Foundation exception: " +
        arbitraryResponsiveFiles.map(shortResponsivePath).join(", "),
    );
  }
  if (pxWidthMediaQueries.length !== 0) {
    failures.push(
      "responsive.corpus: px-based width media queries duplicate canonical breakpoint authority: " +
        pxWidthMediaQueries.map(([file]) => file).join(", "),
    );
  }
}

const motion = matrix.foundations.motion;
if (motion?.status !== "planned") {
  const baseSource = readFileSync(resolve(root, "src/base.css"), "utf8");
  const motionSource = readFileSync(resolve(root, "src/lib/motion.ts"), "utf8");
  const hookSource = readFileSync(
    resolve(root, "src/hooks/use-reduced-motion.ts"),
    "utf8",
  );
  const anchorSource = readFileSync(resolve(root, "src/core/anchor.tsx"), "utf8");
  const affixSource = readFileSync(resolve(root, "src/core/affix.tsx"), "utf8");
  const carouselSource = readFileSync(
    resolve(root, "src/core/carousel.tsx"),
    "utf8",
  );

  for (const marker of [
    "@media (prefers-reduced-motion: reduce)",
    "animation-duration: 0s !important;",
    "animation-delay: 0s !important;",
    "transition-duration: 0s !important;",
    "transition-delay: 0s !important;",
    "scroll-behavior: auto !important;",
  ]) {
    if (!baseSource.includes(marker)) {
      failures.push("motion.guard: reduced-motion CSS authority changed: " + marker);
    }
  }

  if (
    !motionSource.includes(
      'REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"',
    ) ||
    !motionSource.includes("preferredScrollBehavior")
  ) {
    failures.push("motion.guard: shared JavaScript reduced-motion authority changed");
  }
  if (!hookSource.includes("window.matchMedia(REDUCED_MOTION_QUERY)")) {
    failures.push("motion.guard: live reduced-motion hook escaped shared query authority");
  }

  for (const [name, source] of [
    ["Anchor", anchorSource],
    ["BackTop", affixSource],
  ]) {
    if (!source.includes("behavior: preferredScrollBehavior()")) {
      failures.push("motion.guard: " + name + " escaped preferred scroll behavior");
    }
    if (/behavior\s*:\s*["']smooth["']/.test(source)) {
      failures.push("motion.guard: " + name + " reintroduced hard-coded smooth scroll");
    }
  }

  if (!carouselSource.includes("useReducedMotionPreference()")) {
    failures.push("motion.guard: Carousel must consume live reduced-motion preference");
  }
  if (
    (carouselSource.match(/transitionDuration: reducedMotion \? "0ms"/g) ?? [])
      .length !== 2
  ) {
    failures.push(
      "motion.guard: Carousel scrollx and fade inline transitions must both collapse under reduced motion",
    );
  }
  if (
    !carouselSource.includes(
      "selected && autoplay && autoplayConfig?.dotDuration && !reducedMotion",
    )
  ) {
    failures.push("motion.guard: Carousel autoplay-dot animation escaped reduced motion");
  }
  if (/matchMedia\?\.\(["']\(prefers-reduced-motion: reduce\)/.test(carouselSource)) {
    failures.push("motion.guard: Carousel reintroduced a local reduced-motion query");
  }

  const collectMotionSources = (directory) =>
    readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) return collectMotionSources(file);
      return entry.isFile() && /\.tsx?$/.test(file) ? [file] : [];
    });

  const sourceFiles = collectMotionSources(resolve(root, "src"));
  const directSmoothScrollFiles = sourceFiles.filter((file) =>
    /behavior\s*:\s*["']smooth["']/.test(readFileSync(file, "utf8")),
  );
  const directMotionQueryFiles = sourceFiles.filter((file) => {
    const source = readFileSync(file, "utf8");
    return (
      /matchMedia/.test(source) &&
      (/REDUCED_MOTION_QUERY/.test(source) ||
        /prefers-reduced-motion:\s*reduce/.test(source))
    );
  });
  const allowedMotionQueryFiles = new Set([
    resolve(root, "src/lib/motion.ts"),
    resolve(root, "src/hooks/use-reduced-motion.ts"),
  ]);
  const unexpectedMotionQueryFiles = directMotionQueryFiles.filter(
    (file) => !allowedMotionQueryFiles.has(file),
  );

  const shortMotionPath = (file) =>
    file.startsWith(root) ? file.slice(root.length + 1) : file;
  process.stdout.write(
    "Motion corpus audit: directSmoothScrollBypasses=" +
      directSmoothScrollFiles.length +
      ", unexpectedMotionQueryFiles=" +
      unexpectedMotionQueryFiles.length +
      "\n",
  );

  if (directSmoothScrollFiles.length !== 0) {
    failures.push(
      "motion.corpus: imperative smooth scroll must resolve through Motion authority: " +
        directSmoothScrollFiles.map(shortMotionPath).join(", "),
    );
  }
  if (unexpectedMotionQueryFiles.length !== 0) {
    failures.push(
      "motion.corpus: reduced-motion matchMedia queries must use shared authority: " +
        unexpectedMotionQueryFiles.map(shortMotionPath).join(", "),
    );
  }
}

const focus = matrix.foundations.focus;
if (focus?.status !== "planned") {
  const tokenSource = readFileSync(resolve(root, "src/tokens.css"), "utf8");
  const baseSource = readFileSync(resolve(root, "src/base.css"), "utf8");
  const tabsSource = readFileSync(
    resolve(root, "src/components/primitives/tabs.tsx"),
    "utf8",
  );
  const badgeSource = readFileSync(
    resolve(root, "src/components/primitives/badge.tsx"),
    "utf8",
  );
  const dialogSource = readFileSync(
    resolve(root, "src/components/primitives/dialog.tsx"),
    "utf8",
  );
  const sheetSource = readFileSync(
    resolve(root, "src/components/primitives/sheet.tsx"),
    "utf8",
  );

  for (const marker of [
    "--focus-ring-width: 2px;",
    "--focus-ring-offset: 2px;",
  ]) {
    if (!tokenSource.includes(marker)) {
      failures.push("focus.guard: missing canonical Focus token " + marker);
    }
  }
  for (const marker of [
    "outline: var(--focus-ring-width) solid var(--ring);",
    "outline-offset: var(--focus-ring-offset);",
  ]) {
    if (!baseSource.includes(marker)) {
      failures.push("focus.guard: Base focus fallback escaped canonical geometry: " + marker);
    }
  }
  if (baseSource.includes("outline-offset: 3px;")) {
    failures.push("focus.guard: Base focus fallback reintroduced 3px offset");
  }

  if (
    !tabsSource.includes(
      "outline-none focus-visible:border-ring focus-visible:ring-2",
    ) ||
    tabsSource.includes("focus-visible:outline-1") ||
    tabsSource.includes("focus-visible:outline-ring")
  ) {
    failures.push("focus.guard: primitive Tabs must own one 2px ring without a second outline");
  }
  if (
    !badgeSource.includes(
      "outline-none focus-visible:border-ring focus-visible:ring-2",
    )
  ) {
    failures.push("focus.guard: primitive Badge must suppress fallback outline when owning a ring");
  }
  for (const [name, source] of [
    ["Dialog", dialogSource],
    ["Sheet", sheetSource],
  ]) {
    if (!source.includes("focus-visible:ring-2")) {
      failures.push("focus.guard: " + name + " close control must use focus-visible:ring-2");
    }
    if (/\bfocus:ring-/.test(source)) {
      failures.push("focus.guard: " + name + " reintroduced mouse-visible focus:ring");
    }
  }

  const focusSourceFiles = collectTsx(resolve(root, "src"));
  const ring3Files = focusSourceFiles.filter((file) =>
    /focus-visible:ring-\[3px\]/.test(readFileSync(file, "utf8")),
  );
  const directFocusRingFiles = focusSourceFiles.filter((file) =>
    /\bfocus:ring-/.test(readFileSync(file, "utf8")),
  );
  const doubleOutlineFiles = focusSourceFiles.filter((file) =>
    /focus-visible:outline-1/.test(readFileSync(file, "utf8")),
  );

  const shortFocusPath = (file) =>
    file.startsWith(root) ? file.slice(root.length + 1) : file;
  process.stdout.write(
    "Focus corpus audit: focusRing3pxFiles=" +
      ring3Files.length +
      ", directFocusRingFiles=" +
      directFocusRingFiles.length +
      ", doubleOutlineFiles=" +
      doubleOutlineFiles.length +
      "\n",
  );

  if (ring3Files.length !== 0) {
    failures.push(
      "focus.corpus: 3px direct focus rings are not admitted: " +
        ring3Files.map(shortFocusPath).join(", "),
    );
  }
  if (directFocusRingFiles.length !== 0) {
    failures.push(
      "focus.corpus: keyboard focus indication must use focus-visible, not direct focus:ring: " +
        directFocusRingFiles.map(shortFocusPath).join(", "),
    );
  }
  if (doubleOutlineFiles.length !== 0) {
    failures.push(
      "focus.corpus: component-owned focus rings must not stack a second focus outline: " +
        doubleOutlineFiles.map(shortFocusPath).join(", "),
    );
  }
}

const overlay = matrix.foundations.overlay;
if (overlay?.status !== "planned") {
  const tokenSource = readFileSync(resolve(root, "src/tokens.css"), "utf8");
  const modalSource = readFileSync(resolve(root, "src/core/modal.tsx"), "utf8");
  const drawerSource = readFileSync(resolve(root, "src/core/drawer.tsx"), "utf8");
  const dialogSource = readFileSync(
    resolve(root, "src/components/primitives/dialog.tsx"),
    "utf8",
  );
  const sheetSource = readFileSync(
    resolve(root, "src/components/primitives/sheet.tsx"),
    "utf8",
  );
  const popoverSource = readFileSync(
    resolve(root, "src/components/primitives/popover.tsx"),
    "utf8",
  );
  const selectSource = readFileSync(
    resolve(root, "src/components/primitives/select.tsx"),
    "utf8",
  );
  const messageSource = readFileSync(
    resolve(root, "src/core/message.tsx"),
    "utf8",
  );
  const notificationSource = readFileSync(
    resolve(root, "src/core/notification.tsx"),
    "utf8",
  );
  const fixtureToolsSource = readFileSync(
    resolve(root, "showcase/components/fixture-tools.tsx"),
    "utf8",
  );
  const standaloneNavigationSource = readFileSync(
    resolve(root, "showcase/components/standalone-navigation.tsx"),
    "utf8",
  );
  const showcaseStylesSource = readFileSync(
    resolve(root, "showcase/styles/showcase.css"),
    "utf8",
  );

  for (const marker of [
    "--layer-sticky: 20;",
    "--layer-shell: 30;",
    "--layer-floating: 40;",
    "--layer-modal: 50;",
    "--layer-popup: 60;",
    "--layer-notice: 100;",
    "@utility layer-sticky",
    "@utility layer-shell",
    "@utility layer-floating",
    "@utility layer-modal",
    "@utility layer-popup",
    "@utility layer-notice",
  ]) {
    if (!tokenSource.includes(marker)) {
      failures.push("overlay.guard: missing canonical Layer authority " + marker);
    }
  }

  for (const [name, source, marker] of [
    ["Dialog", dialogSource, "layer-modal"],
    ["Sheet", sheetSource, "layer-modal"],
    ["Popover", popoverSource, "layer-popup"],
    ["Select", selectSource, "layer-popup"],
    ["Message", messageSource, "layer-notice"],
    ["Notification", notificationSource, "layer-notice"],
  ]) {
    if (!source.includes(marker)) {
      failures.push("overlay.guard: " + name + " escaped semantic Layer role " + marker);
    }
  }

  if (modalSource.includes("zIndex = 50") || drawerSource.includes("zIndex = 50")) {
    failures.push(
      "overlay.guard: Modal/Drawer default zIndex must resolve through layer-modal, not an inline numeric default",
    );
  }

  if (
    !fixtureToolsSource.includes("showcase-layer-tools") ||
    !standaloneNavigationSource.includes("showcase-layer-tools") ||
    !showcaseStylesSource.includes("--showcase-layer-tools: 1000;")
  ) {
    failures.push(
      "overlay.guard: Showcase tooling must remain isolated from the runtime Layer scale",
    );
  }

  const overlayCorpusFiles = [
    ...collectTsx(resolve(root, "src")),
    ...collectTsx(resolve(root, "showcase/components")),
    ...canonicalProductFiles,
  ];
  const localLayerExceptions = new Set([
    resolve(root, "src/core/carousel.tsx"),
  ]);
  const rawGlobalLayerFiles = overlayCorpusFiles.filter((file) => {
    const source = readFileSync(file, "utf8");
    if (/\bz-(?:30|40|50|\[100\])\b/.test(source)) return true;
    return /\bz-20\b/.test(source) && !localLayerExceptions.has(file);
  });
  const numericGlobalInlineFiles = overlayCorpusFiles.filter((file) =>
    /\bzIndex\s*[:=]\s*(?:20|30|40|50|100)\b/.test(
      readFileSync(file, "utf8"),
    ),
  );

  const shortOverlayPath = (file) =>
    file.startsWith(root) ? file.slice(root.length + 1) : file;
  process.stdout.write(
    "Overlay corpus audit: rawGlobalLayerFiles=" +
      rawGlobalLayerFiles.length +
      ", numericGlobalInlineFiles=" +
      numericGlobalInlineFiles.length +
      "\n",
  );

  if (rawGlobalLayerFiles.length !== 0) {
    failures.push(
      "overlay.corpus: runtime/product global stacking must consume semantic Layer roles: " +
        rawGlobalLayerFiles.map(shortOverlayPath).join(", "),
    );
  }
  if (numericGlobalInlineFiles.length !== 0) {
    failures.push(
      "overlay.corpus: default global zIndex numbers must not bypass Layer authority: " +
        numericGlobalInlineFiles.map(shortOverlayPath).join(", "),
    );
  }
}

const state = matrix.foundations.state;
if (state?.status !== "planned") {
  const designLanguageSource = readFileSync(
    resolve(root, "docs/design-language.md"),
    "utf8",
  );
  const carouselSource = readFileSync(
    resolve(root, "src/core/carousel.tsx"),
    "utf8",
  );
  const buttonSource = readFileSync(
    resolve(root, "src/core/button.tsx"),
    "utf8",
  );
  const inputSource = readFileSync(
    resolve(root, "src/core/input.tsx"),
    "utf8",
  );
  const selectSource = readFileSync(
    resolve(root, "src/core/select.tsx"),
    "utf8",
  );
  const tagSource = readFileSync(resolve(root, "src/core/tag.tsx"), "utf8");
  const browserSource = readFileSync(
    resolve(root, "showcase/e2e/canonical-visual-golden.pw.mjs"),
    "utf8",
  );

  if (
    !designLanguageSource.includes(
      "DL-24 — Interaction state changes semantics and appearance, not ownership geometry",
    )
  ) {
    failures.push("state.guard: missing canonical Interaction State authority");
  }

  for (const marker of [
    "disabled={disabled || loading}",
    "aria-busy={loading || undefined}",
    "aria-pressed={selected}",
  ]) {
    if (!buttonSource.includes(marker)) {
      failures.push("state.guard: Button state ownership changed: " + marker);
    }
  }

  if (
    !inputSource.includes(
      'aria-invalid={status === "error" || props["aria-invalid"] || undefined}',
    )
  ) {
    failures.push("state.guard: Input error state must own aria-invalid semantics");
  }

  for (const marker of [
    'aria-expanded={open}',
    'aria-invalid={status === "error" || props["aria-invalid"] || undefined}',
    'aria-busy={loading || undefined}',
    'aria-selected={checked}',
  ]) {
    if (!selectSource.includes(marker)) {
      failures.push("state.guard: Select state ownership changed: " + marker);
    }
  }

  for (const marker of [
    "isInteractivePointerTarget(event.target)",
    "event.button !== 0",
    "!event.isPrimary",
    "releasePointerCapture(event.pointerId)",
    "onLostPointerCapture",
    'data-slot="carousel-prev-arrow"',
    'data-slot="carousel-next-arrow"',
  ]) {
    if (!carouselSource.includes(marker)) {
      failures.push(
        "state.guard: Carousel drag must preserve nested interactive pointer ownership: " +
          marker,
      );
    }
  }

  if (
    !tagSource.includes("hover:bg-current/10") ||
    /hover:bg-(?:black|white)\//.test(tagSource)
  ) {
    failures.push(
      "state.guard: Tag close hover must derive from current/semantic foreground",
    );
  }

  if (
    !browserSource.includes(
      'test("interaction-carousel-arrows-remain-clickable-while-draggable"',
    )
  ) {
    failures.push(
      "state.guard: real-browser Carousel draggable/arrow contract is missing",
    );
  }

  const governedStateFiles = [
    "src/components/primitives/button.tsx",
    "src/components/primitives/checkbox.tsx",
    "src/components/primitives/radio-group.tsx",
    "src/components/primitives/switch.tsx",
    "src/components/primitives/tabs.tsx",
    "src/components/primitives/table.tsx",
    "src/core/button.tsx",
    "src/core/input.tsx",
    "src/core/select.tsx",
    "src/core/segmented.tsx",
    "src/core/tag.tsx",
  ];
  const stateGeometry =
    /(?:disabled|aria-invalid|data-\[state=[^\]]+\]|peer-checked|peer-disabled):(?:h-|w-|min-h-|min-w-|max-h-|max-w-|p[trblxyse]?-|m[trblxyse]?-|border-(?:[2-9]|\[[^\]]+\]))/;
  const stateGeometryBypasses = governedStateFiles.filter((file) =>
    stateGeometry.test(readFileSync(resolve(root, file), "utf8")),
  );

  process.stdout.write(
    "State corpus audit: stateGeometryBypasses=" +
      stateGeometryBypasses.length +
      "\n",
  );

  if (stateGeometryBypasses.length !== 0) {
    failures.push(
      "state.corpus: interaction state must not redefine canonical outer geometry: " +
        stateGeometryBypasses.join(", "),
    );
  }
}

const density = matrix.foundations.density;
if (density?.status !== "planned") {
  const tokenSource = readFileSync(resolve(root, "src/tokens.css"), "utf8");
  const themeSource = readFileSync(resolve(root, "src/theme/provider.tsx"), "utf8");
  const baseSource = readFileSync(resolve(root, "src/base.css"), "utf8");
  const tableSource = readFileSync(
    resolve(root, "src/components/primitives/table.tsx"),
    "utf8",
  );

  for (const marker of [
    "--table-density-comfortable-cell-block: 0.75rem;",
    "--table-density-comfortable-cell-inline: 1rem;",
    "--table-density-comfortable-head-height: 2.5rem;",
    "--table-density-comfortable-footer-height: 3rem;",
    "--table-density-comfortable-edge-inset: 1.5rem;",
    "--table-density-compact-cell-block: 0.5rem;",
    "--table-density-compact-cell-inline: 0.75rem;",
    "--table-density-compact-head-height: 2.25rem;",
    "--table-density-compact-footer-height: 2.5rem;",
    "--table-density-compact-edge-inset: 1rem;",
    "--table-density-touch-cell-block: 1rem;",
    "--table-density-touch-cell-inline: 1rem;",
    "--table-density-touch-head-height: 3rem;",
    "--table-density-touch-footer-height: 3.5rem;",
    "--table-density-touch-edge-inset: 1.5rem;",
  ]) {
    if (!tokenSource.includes(marker)) {
      failures.push("density.guard: missing canonical Table density token " + marker);
    }
  }

  if (!themeSource.includes('export type Density = "comfortable" | "compact";')) {
    failures.push("density.guard: Theme Density vocabulary changed without Foundation review");
  }
  if (!themeSource.includes("root.dataset.density = density;")) {
    failures.push("density.guard: ThemeProvider must publish the global density policy");
  }
  if (
    !baseSource.includes(
      'html[data-density="compact"]\n    [data-slot="table-container"][data-density="default"]',
    )
  ) {
    failures.push(
      "density.guard: global compact policy must affect default density-aware Tables",
    );
  }
  for (const marker of [
    '[data-slot="table-container"][data-density="compact"]',
    '[data-slot="table-container"][data-density="touch"]',
    "padding-block: var(--table-cell-block);",
    "padding-inline: var(--table-cell-inline);",
    "height: var(--table-footer-height);",
    "padding-inline-start: var(--table-edge-inset);",
  ]) {
    if (!baseSource.includes(marker)) {
      failures.push("density.guard: missing Table density authority marker " + marker);
    }
  }

  if (!tableSource.includes("data-density={density}")) {
    failures.push("density.guard: Table must expose its local density policy hook");
  }
  if (/density\s*===/.test(tableSource)) {
    failures.push(
      "density.guard: Table reintroduced component-local density geometry branches",
    );
  }
  if (/\[&_t[hd]\]:p[xy]-|\[&_tfoot_(?:th|td)\]:h-/.test(tableSource)) {
    failures.push(
      "density.guard: Table reintroduced utility-owned density geometry",
    );
  }

  const densityLeaks = filesMatching(/\bdata-density\s*=/);
  process.stdout.write(
    "Density corpus audit: directDensityPolicyBypasses=" + densityLeaks.length + "\n",
  );
  if (densityLeaks.length !== 0) {
    failures.push(
      "density.corpus: product fixtures must use component density APIs instead of writing Foundation data-density hooks",
    );
  }
}

const layout = matrix.foundations.layout;
if (layout?.status !== "planned") {
  const pageContainerSource = readFileSync(
    resolve(root, "src/gouno/page-container.tsx"),
    "utf8",
  );
  const tokenSource = readFileSync(resolve(root, "src/tokens.css"), "utf8");

  if (!pageContainerSource.includes("layout-page-container")) {
    failures.push(
      "layout.guard: PageContainer must consume the semantic page track authority",
    );
  }
  if (/max-w-\[[^\]]+\]|\bgap-\d+\b/.test(pageContainerSource)) {
    failures.push(
      "layout.guard: PageContainer reintroduced local width or vertical-rhythm utilities",
    );
  }
  for (const marker of [
    "--layout-page-max-width:",
    "--layout-page-gap:",
    ".layout-page-container",
  ]) {
    if (!tokenSource.includes(marker)) {
      failures.push("layout.guard: missing semantic page track marker " + marker);
    }
  }

  const layoutLeaks = filesMatching(/\blayout-page-container\b/);
  process.stdout.write(
    "Layout corpus audit: foundationUtilityLeaks=" + layoutLeaks.length + "\n",
  );
  if (layoutLeaks.length !== 0) {
    failures.push(
      "layout.corpus: product fixtures must consume PageContainer semantics instead of its Foundation class",
    );
  }
}

const percentage = total ? ((passed / total) * 100).toFixed(1) : "0.0";
const active = Object.entries(matrix.foundations)
  .filter(([, foundation]) => foundation.status !== "planned")
  .map(([name, foundation]) => name + "=" + foundation.status)
  .join(", ");
process.stdout.write("Foundation integrity: " + passed + "/" + total + " gates passed (" + percentage + "%). Active: " + active + "\n");

if (failures.length) {
  process.stderr.write(failures.map((failure) => "- " + failure).join("\n") + "\n");
  process.exit(1);
}
