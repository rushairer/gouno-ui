import { execFileSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const pkg = await readJson("package.json");

const fail = (message) => {
  throw new Error(`package check failed: ${message}`);
};

if (pkg.name !== "@gouno/ui") fail(`unexpected package name ${pkg.name}`);
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(pkg.version)) {
  fail(`version ${pkg.version} is not a publishable SemVer`);
}
if (pkg.publishConfig?.access !== "public") {
  fail("publishConfig.access must be public");
}
if (pkg.publishConfig?.registry !== "https://registry.npmjs.org/") {
  fail("publishConfig.registry must target the public npm registry");
}
if (pkg.repository?.url !== "https://github.com/rushairer/gouno-ui.git") {
  fail("repository metadata does not point at the canonical GitHub repository");
}

const expectedExports = [
  ".",
  "./core",
  "./patterns",
  "./gouno",
  "./theme",
  "./tokens.css",
  "./base.css",
  "./bootstrap.js",
  "./fonts/*",
  "./brand-icons/*",
];
for (const key of expectedExports) {
  if (!(key in (pkg.exports ?? {}))) fail(`missing public export ${key}`);
}
for (const key of Object.keys(pkg.exports ?? {})) {
  if (key.startsWith("./src/") || key.startsWith("./showcase/")) {
    fail(`source-only path ${key} must not be published as public API`);
  }
}

const requiredBuiltFiles = [
  "dist/index.js",
  "dist/index.d.ts",
  "dist/core/index.js",
  "dist/core/index.d.ts",
  "dist/theme/index.js",
  "dist/theme/index.d.ts",
  "dist/patterns/index.js",
  "dist/patterns/index.d.ts",
  "dist/gouno/index.js",
  "dist/gouno/index.d.ts",
  "dist/tokens.css",
  "dist/base.css",
  "dist/bootstrap.js",
  "dist/brand-icons/gouno.svg",
  "dist/brand-icons/gouno-ui.svg",
  "dist/brand-icons/gouno-blog.svg",
  "dist/brand-icons/gosso-admin.svg",
];
for (const file of requiredBuiltFiles) {
  try {
    await access(resolve(root, file));
  } catch {
    fail(`missing built file ${file}; run npm run build first`);
  }
}

const [core, theme, patterns, gouno] = await Promise.all([
  import(pathToFileURL(resolve(root, "dist/core/index.js")).href),
  import(pathToFileURL(resolve(root, "dist/theme/index.js")).href),
  import(pathToFileURL(resolve(root, "dist/patterns/index.js")).href),
  import(pathToFileURL(resolve(root, "dist/gouno/index.js")).href),
]);
for (const [owner, module, names] of [
  ["core", core, ["Button", "Card", "Tabs", "Table"]],
  ["theme", theme, ["ThemeProvider", "ThemeToggle", "useTheme"]],
  ["patterns", patterns, ["BulkActionBar"]],
  ["gouno", gouno, ["AppShell", "PageContainer", "PageHeader"]],
]) {
  for (const name of names) {
    if (!(name in module)) fail(`${owner} entrypoint is missing ${name}`);
  }
}

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const dryRun = execFileSync(
  npmCommand,
  ["pack", "--dry-run", "--json", "--ignore-scripts"],
  { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
);
const packed = JSON.parse(dryRun)?.[0];
if (!packed) fail("npm pack --dry-run did not return package metadata");
if (packed.name !== pkg.name || packed.version !== pkg.version) {
  fail(`packed identity ${packed.name}@${packed.version} does not match package.json`);
}

const packedPaths = new Set((packed.files ?? []).map((file) => file.path));
for (const file of [
  "package.json",
  "README.md",
  "CHANGELOG.md",
  "LICENSE",
  ...requiredBuiltFiles,
]) {
  if (!packedPaths.has(file)) fail(`published archive is missing ${file}`);
}

const forbiddenPrefixes = ["src/", "showcase/", "docs/", "scripts/", ".github/"];
for (const path of packedPaths) {
  if (forbiddenPrefixes.some((prefix) => path.startsWith(prefix))) {
    fail(`published archive unexpectedly contains ${path}`);
  }
}

console.log(
  `Package check passed for ${pkg.name}@${pkg.version}: ${packed.files.length} files, ${packed.size} bytes packed.`,
);
