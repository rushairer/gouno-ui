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
    for (const id of foundation.affectedComponentReviews || []) {
      const marker = 'componentReviews["' + id + '"] = {\n  status: "reopened"';
      if (!reviews.includes(marker)) {
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
    for (const prefix of [
      ".control-height-",
      ".control-square-",
      ".control-inset-height-",
    ]) {
      if (!tokenSource.includes(prefix + name)) {
        failures.push("sizing.guard: missing semantic control utility " + prefix + name);
      }
    }
  }

  for (const marker of [
    'small: "control-height-small text-sm"',
    'middle: "control-height-middle text-sm"',
    'large: "control-height-large text-base"',
  ]) {
    if (!controlTypesSource.includes(marker)) {
      failures.push("sizing.guard: ControlSize escaped semantic height authority");
      break;
    }
  }
  if (!coreButtonSource.includes("export type ButtonSize = ControlSize;")) {
    failures.push("sizing.guard: ButtonSize must reuse ControlSize");
  }
  for (const marker of [
    'sm: "control-height-small',
    'default: "control-height-middle',
    'lg: "control-height-large',
  ]) {
    if (!primitiveButtonSource.includes(marker)) {
      failures.push("sizing.guard: Button primitive escaped ControlSize geometry");
      break;
    }
  }
  for (const marker of [
    'small: "control-square-small',
    'middle: "control-square-middle',
    'large: "control-square-large',
  ]) {
    if (!otpSource.includes(marker)) {
      failures.push("sizing.guard: InputOTP escaped ControlSize geometry");
      break;
    }
  }
  for (const marker of [
    'small: "control-inset-height-small',
    'middle: "control-inset-height-middle',
    'large: "control-inset-height-large',
  ]) {
    if (!segmentedSource.includes(marker)) {
      failures.push("sizing.guard: Segmented escaped derived ControlSize geometry");
      break;
    }
  }

  const sizingLeaks = filesMatching(
    /\b(?:control-height|control-square|control-inset-height)-(?:small|middle|large)\b/,
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
