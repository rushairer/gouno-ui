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

const aiOpsAdaptiveRailFiles = [
  "showcase/demos/products/blog-admin/ai/operations/overview-inbox.tsx",
  "showcase/demos/products/blog-admin/ai/operations/automation-records.tsx",
];
for (const path of aiOpsAdaptiveRailFiles) {
  const text = await source(path);
  if (/max-h-\[(?:42|44|46|48|56)rem\]/.test(text)) {
    failures.push(
      `${path}: AI Operations master-detail rails must be content-driven; fixed rem max-height is forbidden`,
    );
  }
  for (const marker of ['data-slot="ops-rail"', 'data-slot="ops-rail-body"']) {
    requireText(
      text,
      marker,
      `${path}: missing adaptive master-detail rail marker ${marker}`,
    );
  }
}

const workflowManagementPath =
  "showcase/demos/products/blog-admin/ai/operations/automation-management.tsx";
const workflowManagementSource = await source(workflowManagementPath);
for (const forbidden of ['data-slot="ops-rail"', 'data-slot="ops-rail-body"']) {
  if (workflowManagementSource.includes(forbidden)) {
    failures.push(
      `${workflowManagementPath}: Workflow assets use list → dedicated detail under PI-06 and must not regress to a persistent master-detail rail (${forbidden})`,
    );
  }
}
for (const required of [
  'aria-label="Workflow 列表"',
  'data-slot="workflow-detail"',
  '返回 Workflow 列表',
]) {
  requireText(
    workflowManagementSource,
    required,
    `${workflowManagementPath}: missing dedicated Workflow list/detail contract marker ${required}`,
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
const refreshMarker = "\n  refresh:";
const refreshIndex = goldenWorkflowSource.indexOf(refreshMarker);
if (refreshIndex < 0) {
  failures.push(`${goldenWorkflowPath}: explicit visual golden refresh job is missing`);
} else {
  const compareSection = goldenWorkflowSource.slice(0, refreshIndex);
  const refreshSection = goldenWorkflowSource.slice(refreshIndex);
  if (compareSection.includes("contents: write")) {
    failures.push(`${goldenWorkflowPath}: normal visual comparison job must remain read-only`);
  }
  if (compareSection.includes("--update-snapshots")) {
    failures.push(`${goldenWorkflowPath}: normal visual comparison job must never update accepted baselines`);
  }
  requireText(
    refreshSection,
    "github.event.head_commit.message == 'chore(showcase): refresh canonical visual goldens'",
    `${goldenWorkflowPath}: refresh job must stay explicitly gated by the canonical refresh commit message`,
  );
  requireText(
    refreshSection,
    "contents: write",
    `${goldenWorkflowPath}: refresh job needs narrowly scoped write permission to publish reviewed baselines`,
  );
  requireText(
    refreshSection,
    "--update-snapshots",
    `${goldenWorkflowPath}: refresh job no longer regenerates canonical baselines`,
  );
  requireText(
    refreshSection,
    'git commit -m "test(showcase): refresh canonical visual goldens"',
    `${goldenWorkflowPath}: refresh job must commit regenerated baselines with the canonical verification message`,
  );
}
const writePermissionCount = (goldenWorkflowSource.match(/contents: write/g) ?? []).length;
if (writePermissionCount !== 1) {
  failures.push(
    `${goldenWorkflowPath}: visual golden workflow must contain exactly one write-permission scope for the explicit refresh job; found ${writePermissionCount}`,
  );
}
const updateSnapshotCount = (goldenWorkflowSource.match(/--update-snapshots/g) ?? []).length;
if (updateSnapshotCount !== 1) {
  failures.push(
    `${goldenWorkflowPath}: visual golden workflow must contain exactly one snapshot-update command in the explicit refresh job; found ${updateSnapshotCount}`,
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
  "blog-admin-ai-operations-overview-desktop-light.png",
  "blog-admin-ai-operations-inbox-desktop-light.png",
  "blog-admin-ai-operations-workflow-list-desktop-light.png",
  "blog-admin-ai-operations-workflow-detail-desktop-light.png",
  "blog-admin-ai-operations-workflow-detail-mobile-light.png",
  "blog-admin-ai-operations-workflow-editor-desktop-light.png",
  "blog-admin-ai-operations-run-center-desktop-light.png",
  "gosso-overview-desktop-light.png",
  "gosso-system-clients-desktop-light.png",
  "gosso-site-settings-desktop-light.png",
  "gosso-account-settings-desktop-light.png",
  "blog-admin-posts-desktop-dark.png",
  "blog-admin-posts-mobile-dark.png",
  "blog-admin-post-editor-desktop-dark.png",
  "gosso-site-settings-desktop-dark.png",
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
