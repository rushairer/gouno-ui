import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const files = [
  "showcase/demos/products/blog-admin/dashboard.tsx",
  "showcase/demos/products/blog-admin/posts.tsx",
  "showcase/demos/products/blog-admin/pages.tsx",
  "showcase/demos/products/blog-admin/categories.tsx",
  "showcase/demos/products/blog-admin/tags.tsx",
  "showcase/demos/products/blog-admin/comments.tsx",
  "showcase/demos/products/blog-admin/notifications.tsx",
  "showcase/demos/products/blog-admin/site-settings.tsx",
  "showcase/demos/products/blog-admin/users.tsx",
  "showcase/demos/products/blog-admin/ai/operations/index.tsx",
  "showcase/demos/products/blog-admin/ai/settings/index.tsx",
];

function containsNoticeAlert(node, sourceFile) {
  const text = node.getText(sourceFile);
  return text.includes("<Alert") && /\bnotice\b/.test(text);
}

function importPathFor(file) {
  return file.includes("/ai/") ? "../../fixture-notification" : "./fixture-notification";
}

for (const file of files) {
  const absolute = path.resolve(file);
  let source = await readFile(absolute, "utf8");
  const parsed = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const replacements = [];

  function visit(node) {
    if (
      ts.isJsxExpression(node) &&
      node.expression &&
      ts.isConditionalExpression(node.expression) &&
      node.expression.condition.getText(parsed) === "notice" &&
      containsNoticeAlert(node.expression.whenTrue, parsed)
    ) {
      replacements.push({
        start: node.getStart(parsed),
        end: node.getEnd(),
        text: '<FixtureNotification notice={notice} onConsumed={() => setNotice(null)} />',
      });
      return;
    }
    ts.forEachChild(node, visit);
  }

  visit(parsed);
  if (replacements.length === 0) {
    console.log(`skip ${file}: no transient notice Alert`);
    continue;
  }

  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    source = `${source.slice(0, replacement.start)}${replacement.text}${source.slice(replacement.end)}`;
  }

  if (!source.includes('from "./fixture-notification"') && !source.includes('from "../../fixture-notification"')) {
    const importPath = importPathFor(file);
    const lastImport = [...source.matchAll(/^import[\s\S]*?;\n/gm)].at(-1);
    if (!lastImport) throw new Error(`${file}: no import insertion point`);
    const position = lastImport.index + lastImport[0].length;
    source = `${source.slice(0, position)}import { FixtureNotification } from "${importPath}";\n${source.slice(position)}`;
  }

  await writeFile(absolute, source);
  console.log(`migrated ${file}: ${replacements.length} notice Alert(s)`);
}
