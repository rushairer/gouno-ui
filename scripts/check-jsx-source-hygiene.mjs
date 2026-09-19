import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import ts from "typescript";

const root = process.cwd();
const scanRoots = ["src", "showcase", "tests"];
const failures = [];

function collectTsx(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTsx(path);
    return entry.isFile() && extname(path) === ".tsx" ? [path] : [];
  });
}

function inspectJsxText(file) {
  const source = readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  function visit(node) {
    if (ts.isJsxText(node) && /\\[nrt]/.test(node.getText(sourceFile))) {
      const start = node.getStart(sourceFile);
      const position = sourceFile.getLineAndCharacterOfPosition(start);
      const excerpt = node
        .getText(sourceFile)
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 120);

      failures.push(
        `${relative(root, file)}:${position.line + 1}:${position.character + 1}: JSX raw text contains a literal escape sequence (${JSON.stringify(excerpt)}). Use real source whitespace, or an explicit JSX expression when the backslash text is intentional.`,
      );
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

for (const scanRoot of scanRoots) {
  for (const file of collectTsx(resolve(root, scanRoot))) {
    inspectJsxText(file);
  }
}

if (failures.length > 0) {
  console.error("JSX source hygiene check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("JSX source hygiene check passed.");
