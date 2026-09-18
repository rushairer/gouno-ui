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
