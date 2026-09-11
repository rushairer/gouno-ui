import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const replaceRequired = (text, from, to, label) => {
  if (!text.includes(from)) throw new Error(`${label} anchor missing`);
  return text.replace(from, to);
};

const feedbackPath = "showcase/demos/core/feedback.tsx";
let feedback = readFileSync(feedbackPath, "utf8");
feedback = replaceRequired(
  feedback,
  'code: \'<Popconfirm title="确认删除？"><Button>删除</Button></Popconfirm>\',',
  'code: \'<Popconfirm title="确认删除？" okText="删除" cancelText="取消"><Button>删除</Button></Popconfirm>\',',
  "feedback Popconfirm code",
);
feedback = replaceRequired(
  feedback,
  '<Popconfirm title="确认删除？" description="删除后无法恢复。" danger>',
  '<Popconfirm title="确认删除？" description="删除后无法恢复。" okText="删除" cancelText="取消" danger>',
  "feedback Popconfirm render",
);
writeFileSync(feedbackPath, feedback);

const legacyTestPath = "tests/core-feedback-layout.test.tsx";
let legacyTest = readFileSync(legacyTestPath, "utf8");
legacyTest = replaceRequired(
  legacyTest,
  'import { describe, expect, it } from "vitest";',
  'import { afterEach, describe, expect, it } from "vitest";',
  "feedback test vitest import",
);
legacyTest = replaceRequired(
  legacyTest,
  'import { fireEvent, render, screen, waitFor } from "@testing-library/react";',
  'import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";',
  "feedback test testing-library import",
);
legacyTest = replaceRequired(
  legacyTest,
  'import { Badge, CheckableTag, Drawer, InputOTP, Layout, LayoutContent, LayoutHeader, MessageProvider, Modal, Popconfirm, Space, Splitter, useMessage } from "../src/core";\n\ndescribe("Core layout and feedback", () => {',
  'import { Badge, CheckableTag, Drawer, InputOTP, Layout, LayoutContent, LayoutHeader, MessageProvider, Modal, Popconfirm, Space, Splitter, useMessage } from "../src/core";\n\nafterEach(cleanup);\n\ndescribe("Core layout and feedback", () => {',
  "feedback test cleanup anchor",
);
legacyTest = replaceRequired(
  legacyTest,
  '<Popconfirm title="Delete item?"><button>Delete</button></Popconfirm>',
  '<Popconfirm title="Delete item?" okText="Confirm" cancelText="Cancel"><button>Delete</button></Popconfirm>',
  "feedback test Popconfirm call",
);
writeFileSync(legacyTestPath, legacyTest);

copyFileSync(".github/scripts/package.original.json", "package.json");
unlinkSync(".github/scripts/package.original.json");
unlinkSync(".github/scripts/apply-popconfirm-6e1.mjs");

execFileSync("git", ["config", "user.name", "Aben"]);
execFileSync("git", ["config", "user.email", "5195693+rushairer@users.noreply.github.com"]);
execFileSync("git", [
  "add",
  "-A",
  "showcase/demos/core/feedback.tsx",
  "tests/core-feedback-layout.test.tsx",
  "package.json",
  ".github/scripts",
], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "feat(core): finalize Popconfirm 6E1 call sites"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
