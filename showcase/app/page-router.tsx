import { lazy, Suspense } from "react";
import { AccountDemo } from "../demos/products/account-demo";
import { DashboardDemo } from "../demos/products/dashboard-demo";
import { EditorDemo } from "../demos/products/editor-demo";
import { GossoOverviewDemo } from "../demos/products/gosso-overview";
import { GossoUsersDemo, ListDemo } from "../demos/products/list-pages";

const CoreComponentPage = lazy(() =>
  import("../demos/core-components").then((module) => ({ default: module.CoreComponentPage })),
);

const loading = <div className="p-8 text-sm text-muted-foreground">Loading component documentation…</div>;

export function ShowcasePage({ page }: { page: string }) {
  if (page.startsWith("core-")) {
    return <Suspense fallback={loading}><CoreComponentPage component={page.slice(5)} /></Suspense>;
  }
  switch (page) {
    case "blog-home":
    case "admin-dashboard":
      return <DashboardDemo />;
    case "blog-account":
    case "gosso-account":
      return <AccountDemo />;
    case "admin-list":
    case "admin-taxonomy":
    case "admin-media":
      return <ListDemo />;
    case "admin-editor":
    case "admin-settings":
    case "gosso-settings":
      return <EditorDemo />;
    case "gosso-overview":
      return <GossoOverviewDemo />;
    case "gosso-login":
      return <AccountDemo login />;
    case "gosso-system":
    case "gosso-status":
      return <DashboardDemo gosso />;
    case "gosso-users":
      return <GossoUsersDemo />;
    case "gosso-clients":
      return <ListDemo kind="clients" />;
    case "gosso-audit":
      return <ListDemo kind="audit" />;
    default:
      return <Suspense fallback={loading}><CoreComponentPage component="button" /></Suspense>;
  }
}
