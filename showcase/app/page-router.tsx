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
const PatternBulkActionBarDemo = lazy(() =>
  import("../demos/pattern-bulk-action-bar").then((module) => ({ default: module.PatternBulkActionBarDemo })),
);
const BlogAdminPostsDemo = lazy(() =>
  import("../demos/products/blog-admin-posts").then((module) => ({ default: module.BlogAdminPostsDemo })),
);
const BlogAdminCategoriesDemo = lazy(() =>
  import("../demos/products/blog-admin-categories").then((module) => ({ default: module.BlogAdminCategoriesDemo })),
);
const BlogAdminTagsDemo = lazy(() =>
  import("../demos/products/blog-admin-tags").then((module) => ({ default: module.BlogAdminTagsDemo })),
);
const BlogAdminCommentsDemo = lazy(() =>
  import("../demos/products/blog-admin-comments").then((module) => ({ default: module.BlogAdminCommentsDemo })),
);
const BlogAdminMediaDemo = lazy(() =>
  import("../demos/products/blog-admin-media").then((module) => ({ default: module.BlogAdminMediaDemo })),
);
const BlogAdminUsersDemo = lazy(() =>
  import("../demos/products/blog-admin-users").then((module) => ({ default: module.BlogAdminUsersDemo })),
);
const BlogAdminSiteSettingsDemo = lazy(() =>
  import("../demos/products/blog-admin-site-settings").then((module) => ({ default: module.BlogAdminSiteSettingsDemo })),
);
const GossoAccountSettingsDemo = lazy(() =>
  import("../demos/products/gosso-account-settings").then((module) => ({ default: module.GossoAccountSettingsDemo })),
);
const GossoSystemManagementDemo = lazy(() =>
  import("../demos/products/gosso-system-management").then((module) => ({ default: module.GossoSystemManagementDemo })),
);
const GossoLoginDemo = lazy(() => import("../demos/products/gosso-auth/login").then((module) => ({ default: module.GossoLoginDemo })));
const GossoForgotPasswordDemo = lazy(() => import("../demos/products/gosso-auth/forgot-password").then((module) => ({ default: module.GossoForgotPasswordDemo })));
const GossoResetPasswordDemo = lazy(() => import("../demos/products/gosso-auth/reset-password").then((module) => ({ default: module.GossoResetPasswordDemo })));
const GossoCallbackDemo = lazy(() => import("../demos/products/gosso-auth/callback").then((module) => ({ default: module.GossoCallbackDemo })));
const GossoNotFoundDemo = lazy(() => import("../demos/products/gosso-auth/not-found").then((module) => ({ default: module.GossoNotFoundDemo })));

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
    return <Suspense fallback={loading}><CoreComponentPage component={page.slice(5)} /></Suspense>;
  }

  switch (page) {
    case "theme-system":
      return <ThemeSystemDemo />;
    case "pattern-bulk-action-bar":
      return <Suspense fallback={loading}><PatternBulkActionBarDemo /></Suspense>;
    case "gouno-app-shell":
      return <GounoComponentDemo component="app-shell" />;
    case "gouno-page-container":
      return <GounoComponentDemo component="page-container" />;
    case "gouno-page-header":
      return <GounoPageHeaderDemo />;
    case "blog-admin-posts":
      return <Suspense fallback={loading}><BlogAdminPostsDemo /></Suspense>;
    case "blog-admin-categories":
      return <Suspense fallback={loading}><BlogAdminCategoriesDemo /></Suspense>;
    case "blog-admin-tags":
      return <Suspense fallback={loading}><BlogAdminTagsDemo /></Suspense>;
    case "blog-admin-comments":
      return <Suspense fallback={loading}><BlogAdminCommentsDemo /></Suspense>;
    case "blog-admin-media":
      return <Suspense fallback={loading}><BlogAdminMediaDemo /></Suspense>;
    case "blog-admin-users":
      return <Suspense fallback={loading}><BlogAdminUsersDemo /></Suspense>;
    case "blog-admin-site-settings":
      return <Suspense fallback={loading}><BlogAdminSiteSettingsDemo /></Suspense>;
    case "gosso-overview":
      return <GossoOverviewDemo />;
    case "gosso-account-settings":
      return <Suspense fallback={loading}><GossoAccountSettingsDemo /></Suspense>;
    case "gosso-system-management":
      return <Suspense fallback={loading}><GossoSystemManagementDemo /></Suspense>;
    case "gosso-login":
      return <Suspense fallback={loading}><GossoLoginDemo /></Suspense>;
    case "gosso-forgot-password":
      return <Suspense fallback={loading}><GossoForgotPasswordDemo /></Suspense>;
    case "gosso-reset-password":
      return <Suspense fallback={loading}><GossoResetPasswordDemo /></Suspense>;
    case "gosso-callback":
      return <Suspense fallback={loading}><GossoCallbackDemo /></Suspense>;
    case "gosso-not-found":
      return <Suspense fallback={loading}><GossoNotFoundDemo /></Suspense>;
    default:
      return <EmptyWorkspace workspace={workspace} />;
  }
}