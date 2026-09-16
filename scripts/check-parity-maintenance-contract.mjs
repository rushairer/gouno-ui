import { readFile } from "node:fs/promises";
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
  'pull_request:',
  'push:',
  'workflow_dispatch:',
  '- "src/**"',
  '- "showcase/**"',
  '- "scripts/**"',
  '- "package.json"',
  '- "package-lock.json"',
  'contents: read',
  'cancel-in-progress: true',
  'Checkout candidate Gouno UI',
  'Upload paired consumer parity evidence',
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
  requireText(workflowSource, `name: ${workflow.name}`, `${workflow.path}: canonical workflow name changed`);
  for (const marker of commonMarkers) {
    requireText(workflowSource, marker, `${workflow.path}: missing reciprocal parity contract marker ${marker}`);
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

if (failures.length) {
  console.error("Parity maintenance contract failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Parity maintenance contract passed for Blog and Gosso Admin reciprocal consumers.");
