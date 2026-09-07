import { lazy, Suspense } from "react";
import { Card, Heading, Text } from "../../src/core";
import type { ShowcaseWorkspace } from "../catalog";
import { GounoComponentDemo } from "../demos/gouno-components";
import { GounoPageHeaderDemo } from "../demos/gouno-page-header";
import { GossoOverviewDemo } from "../demos/products/gosso-overview";
import { ThemeSystemDemo } from "../demos/theme-system";

const CoreComponentPage = lazy(() =>
  import("../demos/core-components").then((module) => ({ default: module.CoreComponentPage })),
);

const GossoAccountSettingsDemo = lazy(() =>
  import("../demos/products/gosso-account-settings").then((module) => ({
    default: module.GossoAccountSettingsDemo,
  })),
);

const GossoSystemManagementDemo = lazy(() =>
  import("../demos/products/gosso-system-management").then((module) => ({
    default: module.GossoSystemManagementDemo,
  })),
);

const loading = <div className="p-8 text-sm text-muted-foreground">Loading component documentation…</div>;

const workspaceNames: Record<ShowcaseWorkspace, string> = {
  "gouno-ui": "Gouno UI",
  blog: "Blog",
  "blog-admin": "Blog Admin",
  "gosso-admin": "Gosso Admin",
};

function EmptyWorkspace({ workspace }: { workspace: ShowcaseWorkspace }) {
  return (
    <Card variant="subtle" className="min-h-64 justify-center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 py-8 text-center">
        <Heading level={2}>{workspaceNames[workspace]}</Heading>
        <Text tone="muted">暂无已迁移页面</Text>
        <Text size="sm" tone="muted" className="leading-relaxed">
          这个产品空间只展示按 product-driven 流程真实搬入 Showcase 的页面。旧模拟页面已经清除，新页面会按迁移顺序逐个出现。
        </Text>
      </div>
    </Card>
  );
}

export function ShowcasePage({ page, workspace }: { page: string; workspace: ShowcaseWorkspace }) {
  if (!page) return <EmptyWorkspace workspace={workspace} />;

  if (page.startsWith("core-")) {
    return (
      <Suspense fallback={loading}>
        <CoreComponentPage component={page.slice(5)} />
      </Suspense>
    );
  }

  switch (page) {
    case "theme-system":
      return <ThemeSystemDemo />;
    case "gouno-app-shell":
      return <GounoComponentDemo component="app-shell" />;
    case "gouno-page-container":
      return <GounoComponentDemo component="page-container" />;
    case "gouno-page-header":
      return <GounoPageHeaderDemo />;
    case "gosso-overview":
      return <GossoOverviewDemo />;
    case "gosso-account-settings":
      return <Suspense fallback={loading}><GossoAccountSettingsDemo /></Suspense>;
    case "gosso-system-management":
      return <Suspense fallback={loading}><GossoSystemManagementDemo /></Suspense>;
    default:
      return <EmptyWorkspace workspace={workspace} />;
  }
}
