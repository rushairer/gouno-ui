import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();

async function source(path) {
  return readFile(resolve(root, path), "utf8");
}

const [matrixRaw, catalog, progress, audit, agents] = await Promise.all([
  source("canonical-showcase.json"),
  source("showcase/catalog/index.tsx"),
  source("showcase/catalog/component-progress.ts"),
  source("docs/canonical-showcase-audit.md"),
  source("AGENTS.md"),
]);

const matrix = JSON.parse(matrixRaw);
const failures = [];

function fail(message) {
  failures.push(message);
}

function idsFrom(content) {
  return [...content.matchAll(/item\("([^"]+)"/g)].map((match) => match[1]);
}

function quotedIds(content) {
  return [...content.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

function duplicates(values) {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

function compareSets(actual, expected, label) {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  const missing = [...expectedSet].filter((id) => !actualSet.has(id));
  const extra = [...actualSet].filter((id) => !expectedSet.has(id));
  if (missing.length || extra.length) {
    fail(
      `${label} mismatch` +
        (missing.length ? `; missing: ${missing.join(", ")}` : "") +
        (extra.length ? `; extra: ${extra.join(", ")}` : ""),
    );
  }
}

if (matrix.version !== 1) fail("canonical-showcase.json version must be 1.");
if (matrix.program !== "CSA-001") fail("Canonical matrix must belong to CSA-001.");
if (matrix.phase !== "CSA-5") fail("Canonical matrix phase must be CSA-5.");
if (!["candidate", "frozen"].includes(matrix.status)) {
  fail("Canonical matrix status must be candidate or frozen.");
}
if (!/^[0-9a-f]{40}$/.test(matrix.baselineCommit ?? "")) {
  fail("Canonical matrix baselineCommit must be a full Git commit SHA.");
}

const catalogIds = idsFrom(catalog);
const componentIds = matrix.componentAndCompositionSurfaces ?? [];
const productGroups = matrix.productPages ?? {};
const productIds = [
  ...(productGroups.publicBlog ?? []),
  ...(productGroups.blogAdmin ?? []),
  ...(productGroups.gossoAdmin ?? []),
];
const matrixIds = [...componentIds, ...productIds];

for (const [group, expected] of Object.entries({
  publicBlog: 12,
  blogAdmin: 14,
  gossoAdmin: 12,
})) {
  const actual = productGroups[group]?.length ?? 0;
  if (actual !== expected) {
    fail(`Canonical product subgroup ${group} expected ${expected} pages, got ${actual}.`);
  }
}

for (const [label, values] of [
  ["catalog", catalogIds],
  ["matrix", matrixIds],
  ["component matrix", componentIds],
  ["product matrix", productIds],
]) {
  const repeated = duplicates(values);
  if (repeated.length) fail(`${label} contains duplicate ids: ${repeated.join(", ")}`);
}

if (matrix.counts?.catalogSurfaces !== catalogIds.length) {
  fail(`Canonical catalog count drifted: matrix=${matrix.counts?.catalogSurfaces}, catalog=${catalogIds.length}.`);
}
if (matrix.counts?.componentAndCompositionSurfaces !== componentIds.length) {
  fail("Canonical component/composition count does not match matrix contents.");
}
if (matrix.counts?.productPages !== productIds.length) {
  fail("Canonical product-page count does not match matrix contents.");
}
if (componentIds.length !== 90 || productIds.length !== 38 || catalogIds.length !== 128) {
  fail(
    `CSA-5 expected 90 component/composition surfaces + 38 product pages = 128 catalog surfaces, got ${componentIds.length} + ${productIds.length} = ${catalogIds.length}.`,
  );
}

compareSets(matrixIds, catalogIds, "Canonical matrix vs Showcase catalog");

const completedMatch = progress.match(/const completedComponents = new Set\(\[([\s\S]*?)\]\);/);
if (!completedMatch) {
  fail("Cannot locate completedComponents in component-progress.ts.");
} else {
  const completedIds = quotedIds(completedMatch[1]);
  compareSets(componentIds, completedIds, "Canonical component matrix vs completedComponents");
}

const reviewedProductIds = [
  ...progress.matchAll(/^\s*"([^"]+)": "CSA-4 Wave [NOPQRS] manual-reviewed:/gm),
].map((match) => match[1]);
compareSets(productIds, reviewedProductIds, "Canonical product matrix vs CSA-4 productReviews");

if (/status:\s*"reopened"/.test(progress)) {
  fail("A canonical review is reopened; CSA-5 freeze must be updated before Consumer propagation.");
}

const freezeAccepted = audit.includes("## CSA-5 Canonical freeze acceptance");
if (freezeAccepted && matrix.status !== "frozen") {
  fail("CSA-5 acceptance exists but canonical-showcase.json is not frozen.");
}
if (matrix.status === "frozen" && matrix.consumerResume?.status !== "unblocked") {
  fail("Frozen Canonical matrix must mark Consumer resume as unblocked.");
}
if (matrix.status === "candidate" && matrix.consumerResume?.status !== "pending-freeze-acceptance") {
  fail("Candidate Canonical matrix must keep Consumer resume pending freeze acceptance.");
}

if (matrix.status === "frozen") {
  for (const marker of [
    "Status: **complete / canonical frozen**",
    "| CSA-1 Foundation sanity | complete |",
    "| CSA-2 Core browser pass | complete |",
    "| CSA-3 Pattern/Gouno pass | complete |",
    "| CSA-4 Product Showcase pages | complete |",
    "| CSA-5 Canonical freeze / Consumer resume | complete |",
    "## CSA-5 Canonical freeze acceptance",
    "Consumer reverse migration may resume only from surfaces listed in that matrix after the freeze is merged to `main`.",
  ]) {
    if (!audit.includes(marker)) {
      fail(`Frozen CSA-5 audit ledger is missing required marker: ${marker}`);
    }
  }
}

for (const marker of [
  "canonical-showcase.json",
  "manual-first",
  "reciprocal parity",
]) {
  if (!agents.toLowerCase().includes(marker.toLowerCase())) {
    fail(`AGENTS.md is missing CSA-5 governance marker: ${marker}`);
  }
}

if (failures.length) {
  process.stderr.write(
    "Canonical freeze contract failed:\n" +
      failures.map((failure) => `- ${failure}`).join("\n") +
      "\n",
  );
  process.exit(1);
}

process.stdout.write(
  `Canonical freeze contract: ${matrixIds.length}/${catalogIds.length} Showcase surfaces are accounted for; status=${matrix.status}.\n`,
);
