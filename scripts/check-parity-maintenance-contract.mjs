import { readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

async function source(path) {
  return readFile(resolve(root, path), "utf8");
}

function requireText(sourceText, text, message) {
  if (!sourceText.includes(text)) failures.push(message);
}

const commonMarkers = [
  "pull_request:",
  "push:",
  "workflow_dispatch:",
  '- "src/**"',
  '- "showcase/**"',
  '- "scripts/**"',
  '- "package.json"',
  '- "package-lock.json"',
  "contents: read",
  "cancel-in-progress: true",
  "Checkout candidate Gouno UI",
  "Upload paired consumer parity evidence",
];

const workflows = [
  {
    path: ".github/workflows/blog-consumer-parity.yml",
    name: "Blog Consumer Parity",
    consumerRepository: "repository: rushairer/gouno-blog",
    consumerRef: "ref: main",
    command: "npx playwright test --config=e2e/showcase-parity.config.mjs",
    evidence: "gouno-ui-blog-consumer-parity-${{ github.run_id }}",
  },
  {
    path: ".github/workflows/gosso-admin-consumer-parity.yml",
    name: "Gosso Admin Consumer Parity",
    consumerRepository: "repository: rushairer/gosso-admin",
    consumerRef: "ref: main",
    command: "npx playwright test --config=showcase-parity.config.mjs",
    evidence: "gouno-ui-gosso-admin-consumer-parity-${{ github.run_id }}",
  },
];

for (const workflow of workflows) {
  const workflowSource = await source(workflow.path);
  requireText(
    workflowSource,
    `name: ${workflow.name}`,
    `${workflow.path}: canonical workflow name changed`,
  );
  for (const marker of commonMarkers) {
    requireText(
      workflowSource,
      marker,
      `${workflow.path}: missing reciprocal parity contract marker ${marker}`,
    );
  }
  requireText(
    workflowSource,
    workflow.consumerRepository,
    `${workflow.path}: current consumer repository checkout is missing`,
  );
  requireText(
    workflowSource,
    workflow.consumerRef,
    `${workflow.path}: reciprocal parity must validate the current consumer main branch`,
  );
  requireText(
    workflowSource,
    workflow.command,
    `${workflow.path}: canonical rendered parity command changed or was removed`,
  );
  requireText(
    workflowSource,
    workflow.evidence,
    `${workflow.path}: paired parity evidence artifact contract changed or was removed`,
  );
}

const goldenWorkflowPath = ".github/workflows/canonical-visual-golden.yml";
const goldenWorkflowSource = await source(goldenWorkflowPath);
const goldenWorkflowMarkers = [
  "name: Canonical Visual Golden Smoke",
  "pull_request:",
  "push:",
  "workflow_dispatch:",
  '- "src/**"',
  '- "showcase/**"',
  "contents: read",
  "cancel-in-progress: true",
  "PLAYWRIGHT_VERSION=1.55.0",
  "npx playwright test --config=showcase/e2e/canonical-visual-golden.config.mjs",
  "Upload visual golden evidence",
  "gouno-ui-canonical-visual-golden-${{ github.run_id }}",
  "retention-days: 14",
];
for (const marker of goldenWorkflowMarkers) {
  requireText(
    goldenWorkflowSource,
    marker,
    `${goldenWorkflowPath}: missing visual golden contract marker ${marker}`,
  );
}
if (goldenWorkflowSource.includes("contents: write")) {
  failures.push(`${goldenWorkflowPath}: permanent visual golden CI must remain read-only`);
}
if (goldenWorkflowSource.includes("--update-snapshots")) {
  failures.push(
    `${goldenWorkflowPath}: permanent visual golden CI must never auto-update accepted baselines`,
  );
}

const goldenTestPath = "showcase/e2e/canonical-visual-golden.pw.mjs";
const goldenTestSource = await source(goldenTestPath);
const expectedGoldenBaselines = [
  "blog-home-desktop-light.png",
  "blog-article-detail-desktop-light.png",
  "blog-search-desktop-light.png",
  "blog-account-settings-desktop-light.png",
  "blog-admin-dashboard-desktop-light.png",
  "blog-admin-posts-desktop-light.png",
  "blog-admin-posts-mobile-light.png",
  "blog-admin-post-editor-desktop-light.png",
  "gosso-overview-desktop-light.png",
  "gosso-system-clients-desktop-light.png",
  "gosso-site-settings-desktop-light.png",
  "gosso-account-settings-desktop-light.png",
].sort();

for (const baseline of expectedGoldenBaselines) {
  requireText(
    goldenTestSource,
    baseline.replace(".png", ""),
    `${goldenTestPath}: missing canonical golden scenario ${baseline}`,
  );
}
requireText(
  goldenTestSource,
  "maxDiffPixelRatio: 0.002",
  `${goldenTestPath}: canonical pixel tolerance changed`,
);
requireText(
  goldenTestSource,
  'test("gosso-account-settings-mfa-tab-interaction"',
  `${goldenTestPath}: canonical interaction smoke is missing`,
);
requireText(
  goldenTestSource,
  'getByRole("tab", { name: /MFA/ })',
  `${goldenTestPath}: MFA interaction proof changed or was removed`,
);

const goldenConfigPath = "showcase/e2e/canonical-visual-golden.config.mjs";
const goldenConfigSource = await source(goldenConfigPath);
for (const marker of [
  'browserName: "chromium"',
  'locale: "zh-CN"',
  'timezoneId: "Asia/Shanghai"',
  "deviceScaleFactor: 1",
  '"canonical-visual-golden.pw.mjs-snapshots/{arg}{ext}"',
]) {
  requireText(
    goldenConfigSource,
    marker,
    `${goldenConfigPath}: deterministic visual environment marker changed: ${marker}`,
  );
}

const goldenBaselineDir = resolve(
  root,
  "showcase/e2e/canonical-visual-golden.pw.mjs-snapshots",
);
const actualGoldenBaselines = (await readdir(goldenBaselineDir))
  .filter((name) => name.endsWith(".png"))
  .sort();
if (
  JSON.stringify(actualGoldenBaselines) !==
  JSON.stringify(expectedGoldenBaselines)
) {
  failures.push(
    `canonical visual golden baseline set must contain exactly ${expectedGoldenBaselines.length} accepted PNGs; found ${actualGoldenBaselines.length}`,
  );
}

if (failures.length) {
  console.error("Parity maintenance contract failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Parity maintenance contract passed for reciprocal consumers and ${expectedGoldenBaselines.length} canonical visual goldens.`,
);
