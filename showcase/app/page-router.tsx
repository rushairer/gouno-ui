import { lazy, Suspense, type ReactNode } from "react";
import { Card, Heading, Spinner, Text } from "../../src/core";
import { PageSkeleton, type PageSkeletonLayout } from "../../src/gouno";
import type { ShowcaseWorkspace } from "../catalog";
import { GounoComponentDemo } from "../demos/gouno/components";
import { GounoPageHeaderDemo } from "../demos/gouno/page-header";
import { GounoPageSkeletonDemo } from "../demos/gouno/page-skeleton";
import {
  BlogArticleDetailLoading,
  BlogArticleListLoading,
  BlogCustomPageLoading,
  BlogDiscoveryIndexLoading,
  BlogHomeLoading,
  BlogNotificationsLoading,
} from "../demos/products/blog/loading";
import { BlogPublicShellFixture } from "../demos/products/blog/public-shell";
import { GossoOverviewDemo } from "../demos/products/gosso-admin/overview";
import { ThemeSystemDemo } from "../demos/theme/system";

const CoreComponentPage = lazy(() =>
  import("../demos/core").then((module) => ({ default: module.CoreComponentPage })),
);
const PatternBulkActionBarDemo = lazy(() =>
  import("../demos/patterns/bulk-action-bar").then((module) => ({ default: module.PatternBulkActionBarDemo })),
);
const PatternAISuggestionPickerDemo = lazy(() =>
  import("../demos/patterns/ai-suggestion-picker").then((module) => ({ default: module.PatternAISuggestionPickerDemo })),
);
const PatternAISuggestionReviewDemo = lazy(() =>
  import("../demos/patterns/ai-suggestion-review").then((module) => ({ default: module.PatternAISuggestionReviewDemo })),
);
const PatternMarkdownEditorDemo = lazy(() =>
  import("../demos/patterns/markdown-editor").then((module) => ({ default: module.PatternMarkdownEditorDemo })),
);
const PatternDedicatedEditorDemo = lazy(() =>
  import("../demos/patterns/dedicated-editor").then((module) => ({ default: module.PatternDedicatedEditorDemo })),
);
const PatternEditorFormCompositionDemo = lazy(() =>
  import("../demos/patterns/editor-form-composition").then((module) => ({ default: module.PatternEditorFormCompositionDemo })),
);
const PatternCollectionCompositionDemo = lazy(() =>
  import("../demos/patterns/admin-data-composition").then((module) => ({ default: module.PatternCollectionCompositionDemo })),
);
const PatternRecordDetailCompositionDemo = lazy(() =>
  import("../demos/patterns/admin-data-composition").then((module) => ({ default: module.PatternRecordDetailCompositionDemo })),
);
const PatternMasterDetailCompositionDemo = lazy(() =>
  import("../demos/patterns/admin-data-composition").then((module) => ({ default: module.PatternMasterDetailCompositionDemo })),
);
const PatternSettingsCompositionDemo = lazy(() =>
  import("../demos/patterns/admin-data-composition").then((module) => ({ default: module.PatternSettingsCompositionDemo })),
);
const PatternDataSummaryCompositionDemo = lazy(() =>
  import("../demos/patterns/admin-data-composition").then((module) => ({ default: module.PatternDataSummaryCompositionDemo })),
);
const BlogHomeDemo = lazy(() =>
  import("../demos/products/blog/home").then((module) => ({ default: module.BlogHomeDemo })),
);
const BlogArticleIndexDemo = lazy(() =>
  import("../demos/products/blog/article-index").then((module) => ({ default: module.BlogArticleIndexDemo })),
);
const BlogArticleDetailDemo = lazy(() =>
  import("../demos/products/blog/article-detail").then((module) => ({ default: module.BlogArticleDetailDemo })),
);
const BlogDiscoveryIndexDemo = lazy(() =>
  import("../demos/products/blog/discovery-indexes").then((module) => ({ default: module.BlogDiscoveryIndexDemo })),
);
const BlogAboutDemo = lazy(() =>
  import("../demos/products/blog/document-pages").then((module) => ({ default: module.BlogAboutDemo })),
);
const BlogCustomPageDemo = lazy(() =>
  import("../demos/products/blog/document-pages").then((module) => ({ default: module.BlogCustomPageDemo })),
);
const BlogAccountNotificationsDemo = lazy(() =>
  import("../demos/products/blog/account-pages").then((module) => ({ default: module.BlogAccountNotificationsDemo })),
);
const BlogAccountSettingsDemo = lazy(() =>
  import("../demos/products/blog/account-pages").then((module) => ({ default: module.BlogAccountSettingsDemo })),
);
const BlogNotFoundDemo = lazy(() =>
  import("../demos/products/blog/not-found").then((module) => ({ default: module.BlogNotFoundDemo })),
);
const BlogAdminDashboardDemo = lazy(() =>
  import("../demos/products/blog-admin/dashboard").then((module) => ({ default: module.BlogAdminDashboardDemo })),
);
const BlogAdminAIOperationsDemo = lazy(() =>
  import("../demos/products/blog-admin/ai/operations").then((module) => ({ default: module.BlogAdminAIOperationsDemo })),
);
const BlogAdminAISettingsDemo = lazy(() =>
  import("../demos/products/blog-admin/ai/settings").then((module) => ({ default: module.BlogAdminAISettingsDemo })),
);
const BlogAdminPostsDemo = lazy(() =>
  import("../demos/products/blog-admin/posts").then((module) => ({ default: module.BlogAdminPostsDemo })),
);
const BlogAdminPostEditorDemo = lazy(() =>
  import("../demos/products/blog-admin/post-editor").then((module) => ({ default: module.BlogAdminPostEditorDemo })),
);
const BlogAdminCategoriesDemo = lazy(() =>
  import("../demos/products/blog-admin/categories").then((module) => ({ default: module.BlogAdminCategoriesDemo })),
);
const BlogAdminTagsDemo = lazy(() =>
  import("../demos/products/blog-admin/tags").then((module) => ({ default: module.BlogAdminTagsDemo })),
);
const BlogAdminPagesDemo = lazy(() =>
  import("../demos/products/blog-admin/pages").then((module) => ({ default: module.BlogAdminPagesDemo })),
);
const BlogAdminPageEditorDemo = lazy(() =>
  import("../demos/products/blog-admin/page-editor").then((module) => ({ default: module.BlogAdminPageEditorDemo })),
);
const BlogAdminCommentsDemo = lazy(() =>
  import("../demos/products/blog-admin/comments").then((module) => ({ default: module.BlogAdminCommentsDemo })),
);
const BlogAdminNotificationsDemo = lazy(() =>
  import("../demos/products/blog-admin/notifications").then((module) => ({ default: module.BlogAdminNotificationsDemo })),
);
const BlogAdminMediaLibraryDemo = lazy(() =>
  import("../demos/products/blog-admin/media-library").then((module) => ({ default: module.BlogAdminMediaLibraryDemo })),
);
const BlogAdminUsersDemo = lazy(() =>
  import("../demos/products/blog-admin/users").then((module) => ({ default: module.BlogAdminUsersDemo })),
);
const BlogAdminSiteSettingsDemo = lazy(() =>
  import("../demos/products/blog-admin/site-settings").then((module) => ({ default: module.BlogAdminSiteSettingsDemo })),
);
const GossoAccountSettingsDemo = lazy(() =>
  import("../demos/products/gosso-admin/account-settings").then((module) => ({ default: module.GossoAccountSettingsDemo })),
);
const GossoSystemManagementDemo = lazy(() =>
  import("../demos/products/gosso-admin/system-management").then((module) => ({ default: module.GossoSystemManagementDemo })),
);
const GossoLoginDemo = lazy(() => import("../demos/products/gosso-admin/auth/login").then((module) => ({ default: module.GossoLoginDemo })));
const GossoForgotPasswordDemo = lazy(() => import("../demos/products/gosso-admin/auth/forgot-password").then((module) => ({ default: module.GossoForgotPasswordDemo })));
const GossoResetPasswordDemo = lazy(() => import("../demos/products/gosso-admin/auth/reset-password").then((module) => ({ default: module.GossoResetPasswordDemo })));
const GossoCallbackDemo = lazy(() => import("../demos/products/gosso-admin/auth/callback").then((module) => ({ default: module.GossoCallbackDemo })));
const GossoNotFoundDemo = lazy(() => import("../demos/products/gosso-admin/auth/not-found").then((module) => ({ default: module.GossoNotFoundDemo })));

function ShowcaseRouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-64 items-center justify-center gap-2 p-8"
    >
      <Spinner className="size-5 text-primary" />
      <Text size="sm" tone="muted">正在加载页面…</Text>
    </div>
  );
}

function ProductRouteFallback({ layout }: { layout: PageSkeletonLayout }) {
  if (layout === "collection") {
    return <PageSkeleton layout="collection" aria-label="正在加载页面" />;
  }
  if (layout === "form") {
    return <PageSkeleton layout="form" aria-label="正在加载页面" />;
  }
  return <PageSkeleton layout="dashboard" aria-label="正在加载页面" />;
}

const ignoreBlogNavigation = () => {};

function BlogRouteFallback({
  currentPath,
  children,
}: {
  currentPath: string;
  children: ReactNode;
}) {
  return (
    <BlogPublicShellFixture currentPath={currentPath} onNavigate={ignoreBlogNavigation}>
      {children}
    </BlogPublicShellFixture>
  );
}

const loading = <ShowcaseRouteFallback />;
const collectionLoading = <ProductRouteFallback layout="collection" />;
const formLoading = <ProductRouteFallback layout="form" />;
const dashboardLoading = <ProductRouteFallback layout="dashboard" />;

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
    case "pattern-ai-suggestion-picker":
      return <Suspense fallback={loading}><PatternAISuggestionPickerDemo /></Suspense>;
    case "pattern-ai-suggestion-review":
      return <Suspense fallback={loading}><PatternAISuggestionReviewDemo /></Suspense>;
    case "pattern-markdown-editor":
      return <Suspense fallback={loading}><PatternMarkdownEditorDemo /></Suspense>;
    case "pattern-dedicated-editor":
      return <Suspense fallback={loading}><PatternDedicatedEditorDemo /></Suspense>;
    case "pattern-editor-form-composition":
      return <Suspense fallback={loading}><PatternEditorFormCompositionDemo /></Suspense>;
    case "pattern-collection-composition":
      return <Suspense fallback={loading}><PatternCollectionCompositionDemo /></Suspense>;
    case "pattern-record-detail-composition":
      return <Suspense fallback={loading}><PatternRecordDetailCompositionDemo /></Suspense>;
    case "pattern-master-detail-composition":
      return <Suspense fallback={loading}><PatternMasterDetailCompositionDemo /></Suspense>;
    case "pattern-settings-composition":
      return <Suspense fallback={loading}><PatternSettingsCompositionDemo /></Suspense>;
    case "pattern-data-summary-composition":
      return <Suspense fallback={loading}><PatternDataSummaryCompositionDemo /></Suspense>;
    case "gouno-app-shell":
      return <GounoComponentDemo component="app-shell" />;
    case "gouno-page-container":
      return <GounoComponentDemo component="page-container" />;
    case "gouno-page-header":
      return <GounoPageHeaderDemo />;
    case "gouno-page-skeleton":
      return <GounoPageSkeletonDemo />;
    case "blog-home":
      return <Suspense fallback={<BlogRouteFallback currentPath="/"><BlogHomeLoading /></BlogRouteFallback>}><BlogHomeDemo /></Suspense>;
    case "blog-articles":
      return <Suspense fallback={<BlogRouteFallback currentPath="/articles"><BlogArticleListLoading /></BlogRouteFallback>}><BlogArticleIndexDemo mode="articles" /></Suspense>;
    case "blog-article-detail":
      return <Suspense fallback={<BlogRouteFallback currentPath="/articles/gouno-ui-product-driven"><BlogArticleDetailLoading /></BlogRouteFallback>}><BlogArticleDetailDemo /></Suspense>;
    case "blog-search":
      return <Suspense fallback={<BlogRouteFallback currentPath="/search"><BlogArticleListLoading /></BlogRouteFallback>}><BlogArticleIndexDemo mode="search" /></Suspense>;
    case "blog-categories":
      return <Suspense fallback={<BlogRouteFallback currentPath="/categories"><BlogDiscoveryIndexLoading page="categories" /></BlogRouteFallback>}><BlogDiscoveryIndexDemo page="categories" /></Suspense>;
    case "blog-tags":
      return <Suspense fallback={<BlogRouteFallback currentPath="/tags"><BlogDiscoveryIndexLoading page="tags" /></BlogRouteFallback>}><BlogDiscoveryIndexDemo page="tags" /></Suspense>;
    case "blog-archive":
      return <Suspense fallback={<BlogRouteFallback currentPath="/archive"><BlogDiscoveryIndexLoading page="archive" /></BlogRouteFallback>}><BlogDiscoveryIndexDemo page="archive" /></Suspense>;
    case "blog-about":
      return <Suspense fallback={loading}><BlogAboutDemo /></Suspense>;
    case "blog-custom-page":
      return <Suspense fallback={<BlogRouteFallback currentPath="/design-system"><BlogCustomPageLoading /></BlogRouteFallback>}><BlogCustomPageDemo /></Suspense>;
    case "blog-account-notifications":
      return <Suspense fallback={<BlogRouteFallback currentPath="/account/notifications"><BlogNotificationsLoading /></BlogRouteFallback>}><BlogAccountNotificationsDemo /></Suspense>;
    case "blog-account-settings":
      return <Suspense fallback={loading}><BlogAccountSettingsDemo /></Suspense>;
    case "blog-not-found":
      return <Suspense fallback={loading}><BlogNotFoundDemo /></Suspense>;
    case "blog-admin-dashboard":
      return <Suspense fallback={dashboardLoading}><BlogAdminDashboardDemo /></Suspense>;
    case "blog-admin-ai-operations":
      return <Suspense fallback={dashboardLoading}><BlogAdminAIOperationsDemo /></Suspense>;
    case "blog-admin-ai-settings":
      return <Suspense fallback={formLoading}><BlogAdminAISettingsDemo /></Suspense>;
    case "blog-admin-posts":
      return <Suspense fallback={collectionLoading}><BlogAdminPostsDemo /></Suspense>;
    case "blog-admin-post-editor":
      return <Suspense fallback={loading}><BlogAdminPostEditorDemo /></Suspense>;
    case "blog-admin-categories":
      return <Suspense fallback={collectionLoading}><BlogAdminCategoriesDemo /></Suspense>;
    case "blog-admin-tags":
      return <Suspense fallback={collectionLoading}><BlogAdminTagsDemo /></Suspense>;
    case "blog-admin-pages":
      return <Suspense fallback={collectionLoading}><BlogAdminPagesDemo /></Suspense>;
    case "blog-admin-page-editor":
      return <Suspense fallback={loading}><BlogAdminPageEditorDemo /></Suspense>;
    case "blog-admin-comments":
      return <Suspense fallback={collectionLoading}><BlogAdminCommentsDemo /></Suspense>;
    case "blog-admin-notifications":
      return <Suspense fallback={collectionLoading}><BlogAdminNotificationsDemo /></Suspense>;
    case "blog-admin-media-library":
      return <Suspense fallback={loading}><BlogAdminMediaLibraryDemo /></Suspense>;
    case "blog-admin-users":
      return <Suspense fallback={collectionLoading}><BlogAdminUsersDemo /></Suspense>;
    case "blog-admin-site-settings":
      return <Suspense fallback={formLoading}><BlogAdminSiteSettingsDemo /></Suspense>;
    case "gosso-overview":
      return <GossoOverviewDemo />;
    case "gosso-account-settings":
      return <Suspense fallback={formLoading}><GossoAccountSettingsDemo /></Suspense>;
    case "gosso-system-clients":
      return <Suspense fallback={collectionLoading}><GossoSystemManagementDemo section="clients" /></Suspense>;
    case "gosso-system-users":
      return <Suspense fallback={collectionLoading}><GossoSystemManagementDemo section="users" /></Suspense>;
    case "gosso-system-audit-logs":
      return <Suspense fallback={collectionLoading}><GossoSystemManagementDemo section="audit-logs" /></Suspense>;
    case "gosso-system-site-settings":
      return <Suspense fallback={formLoading}><GossoSystemManagementDemo section="site-settings" /></Suspense>;
    case "gosso-system-status":
      return <Suspense fallback={dashboardLoading}><GossoSystemManagementDemo section="system" /></Suspense>;
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
