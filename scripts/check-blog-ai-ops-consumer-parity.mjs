import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const consumerRoot = resolve(
  process.env.BLOG_CONSUMER_ROOT || "../",
);
const failures = [];

async function readConsumer(path) {
  return readFile(resolve(consumerRoot, path), "utf8");
}

function requireText(text, marker, message) {
  if (!text.includes(marker)) failures.push(message);
}

const patterns = await readConsumer(
  "blog-frontend/src/components/agent/OperationsPatterns.tsx",
);
requireText(
  patterns,
  'data-pattern="tab-panel-lead"',
  "Blog AI Operations must expose the canonical tab-panel-lead semantic marker",
);

for (const path of [
  "blog-frontend/src/components/agent/WorkspaceOverview.tsx",
  "blog-frontend/src/components/agent/DecisionInboxWorkspace.tsx",
  "blog-frontend/src/components/agent/WorkflowWorkspace.tsx",
  "blog-frontend/src/pages/admin/AIOperations.tsx",
]) {
  const text = await readConsumer(path);
  requireText(
    text,
    "OperationsPanelLead",
    `${path}: top-level AI Operations title/subtitle/actions must use OperationsPanelLead`,
  );
}

const automation = await readConsumer(
  "blog-frontend/src/components/agent/WorkflowWorkspace.tsx",
);
requireText(
  automation,
  "sm:grid-cols-[7rem_7rem_minmax(7rem,0.7fr)_6rem_minmax(0,1.5fr)]",
  "Blog AI Operations Recent Runs must preserve the canonical five-column anatomy",
);
requireText(
  automation,
  "[&>span]:contents",
  "Blog AI Operations Recent Runs must flatten the Core Button/ButtonLink wrapper",
);

for (const path of [
  "blog-frontend/src/components/agent/WorkflowRunRecords.tsx",
  "blog-frontend/src/components/agent/AgentRunRecords.tsx",
]) {
  const text = await readConsumer(path);
  requireText(
    text,
    "xl:grid-cols-[19rem_minmax(0,1fr)]",
    `${path}: Run Center rail width must match the canonical Showcase`,
  );
  requireText(
    text,
    'data-slot="ops-master-detail"',
    `${path}: Run Center must retain the canonical master/detail boundary`,
  );
}

const page = await readConsumer("blog-frontend/src/pages/admin/AIOperations.tsx");
requireText(
  page,
  "运行证据中心",
  "Blog AI Operations Run Center must retain the canonical panel lead",
);
if (page.includes("<Segmented")) {
  failures.push(
    "Blog AI Operations Run Center must not regress to a detached Segmented control",
  );
}

const renderedParity = await readConsumer(
  "blog-frontend/e2e/showcase-parity.pw.mjs",
);
for (const marker of [
  "AI Operations top-level panels, Recent Runs and Run Center match Showcase",
  "installAiFixtures",
  'fixtureId',
  'blog-admin-ai-operations',
  'data-pattern="tab-panel-lead"',
  'data-slot="ops-master-detail"',
  'data-slot="ops-rail"',
]) {
  requireText(
    renderedParity,
    marker,
    `Blog rendered reciprocal parity no longer covers AI Operations marker: ${marker}`,
  );
}

if (failures.length) {
  console.error("Gouno UI -> Blog AI Operations consumer parity failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  "Gouno UI-owned AI Operations consumer contract passed against current Blog main.",
);
