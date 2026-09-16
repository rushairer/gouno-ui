import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const failures = [];

async function source(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

function requireText(file, text, message = `missing canonical text ${JSON.stringify(text)}`) {
  if (!file.includes(text)) failures.push(message);
}

function forbidText(file, text, message = `forbidden text ${JSON.stringify(text)} remains`) {
  if (file.includes(text)) failures.push(message);
}

const media = await source("showcase/demos/products/blog-admin/media-library.tsx");
requireText(media, ">相对地址</Button>");
requireText(media, ">Markdown</Button>");
requireText(media, ">Alt Text</Button>");
requireText(media, ">重新载入</Button>");

const blogUsers = await source("showcase/demos/products/blog-admin/users.tsx");
requireText(blogUsers, ">打开 GOSSO Admin</Button>");
forbidText(blogUsers, ">前往 GOSSO 管理</Button>", "Blog Admin users must use the canonical GOSSO handoff wording: 打开 GOSSO Admin");
requireText(blogUsers, "成员显示昵称 / 备注名");
requireText(blogUsers, "Blog 角色分配（单选）");
requireText(blogUsers, "保存设置");
requireText(blogUsers, "完整 Subject ID");
requireText(blogUsers, 'okText={confirmTarget?.action === "transfer" ? "确认移交" : confirmTarget?.action === "suspend" ? "确认暂停" : "确认恢复"}');

const accountPages = await source("showcase/demos/products/blog/account-pages.tsx");
requireText(accountPages, 'title="账户设置"');
requireText(accountPages, "打开 GOSSO Admin");
for (const label of ["全部标为已读", "标为已读", "查看"]) requireText(accountPages, label);

const blogNotFound = await source("showcase/demos/products/blog/not-found.tsx");
for (const label of ["返回首页", "浏览文章", "搜索内容", "返回上一页"]) requireText(blogNotFound, label);

const mfa = await source("showcase/demos/products/gosso-admin/account-settings/mfa.tsx");
requireText(mfa, 'confirmLabel="重新生成"');
requireText(mfa, 'confirmLabel="确认停用"');

const gossoClients = await source("showcase/demos/products/gosso-admin/system-management/clients.tsx");
requireText(gossoClients, 'confirmText="确认轮换"', "GOSSO client secret rotation must require an action-specific confirmation");
requireText(gossoClients, 'confirmText="确认删除"');
requireText(gossoClients, "复制重定向 URI：", "GOSSO Redirect URI copy action must name the copied object in its accessible label");
requireText(gossoClients, ">重新载入</Button>");

const gossoUsers = await source("showcase/demos/products/gosso-admin/system-management/users.tsx");
for (const label of ["当前管理员", "确认暂停", "确认启用", "确认删除", "重新载入"]) requireText(gossoUsers, label);

const gossoSiteSettings = await source("showcase/demos/products/gosso-admin/system-management/site-settings.tsx");
requireText(gossoSiteSettings, "所有修改已保存");
requireText(gossoSiteSettings, "有未保存修改");

const gossoNotFound = await source("showcase/demos/products/gosso-admin/auth/not-found.tsx");
requireText(gossoNotFound, "返回概览");
requireText(gossoNotFound, "返回上一页");

if (failures.length) {
  console.error(`Showcase microcopy/action grammar contract failed:\n${failures.map((item) => `- ${item}`).join("\n")}`);
  process.exit(1);
}

console.log("Showcase microcopy/action grammar contract passed.");
