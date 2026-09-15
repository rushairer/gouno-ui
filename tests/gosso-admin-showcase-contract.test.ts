import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const gosso = resolve(root, "showcase/demos/products/gosso-admin");
const read = (path: string) => readFileSync(resolve(gosso, path), "utf8");

describe("Gosso Admin Showcase canonical contract", () => {
  it("keeps System Management as sidebar-owned destinations without route-family Tabs", () => {
    expect(read("system-management/index.tsx")).not.toContain("<Tabs");
  });

  it("keeps Account Settings as one PageHeader followed by page-local Tabs", () => {
    const source = read("account-settings/index.tsx");
    expect(source.match(/<PageHeader/g)).toHaveLength(1);
    expect(source.match(/<Tabs/g)).toHaveLength(1);
    expect(source.indexOf("<Tabs")).toBeGreaterThan(source.indexOf("<PageHeader"));
  });

  it("uses Message semantics for transient System Management mutation feedback", () => {
    const shared = read("system-management/shared.tsx");
    expect(shared).toContain("MessageProvider");
    expect(shared).toContain("useMessage");
    expect(shared).not.toContain('<Alert type="success"');

    const siteSettings = read("system-management/site-settings.tsx");
    expect(siteSettings).toContain("<FixtureMessage>");
    expect(siteSettings).not.toContain('<Alert type="success"');
  });

  it("keeps Site Settings form and LoginPreview presentation as siblings", () => {
    const source = read("system-management/site-settings.tsx");
    const grid = source.indexOf('<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">');
    const form = source.indexOf('<form onSubmit={save}', grid);
    const formClose = source.indexOf("</form>", form);
    const preview = source.indexOf("登录页预览", grid);
    expect(grid).toBeGreaterThanOrEqual(0);
    expect(form).toBeGreaterThan(grid);
    expect(formClose).toBeGreaterThan(form);
    expect(preview).toBeGreaterThan(formClose);
  });

  it("does not wrap account collection Empty states in an extra Card", () => {
    const source = read("account-settings/index.tsx");
    expect(source).not.toMatch(/<Card[^>]*>\s*<Empty/);
  });

  it("keeps Auth surfaces standalone and outside the normal Admin page grammar", () => {
    for (const file of ["auth/login.tsx", "auth/forgot-password.tsx", "auth/reset-password.tsx", "auth/callback.tsx", "auth/not-found.tsx"]) {
      const source = read(file);
      expect(source).not.toContain("<PageContainer");
      expect(source).not.toContain("<PageHeader");
    }
  });
});
