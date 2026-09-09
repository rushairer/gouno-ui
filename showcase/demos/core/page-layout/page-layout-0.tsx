import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSider,
} from "../../../../src/core";

export default function PageLayoutDemo() {
  return (
    <Layout
      data-layout="admin-shell"
      className="min-h-72 overflow-hidden rounded-lg border"
    >
      <LayoutHeader data-region="header">Header / global actions</LayoutHeader>
      <div className="flex min-h-0 flex-1">
        <LayoutSider aria-label="Section navigation">Sider / navigation</LayoutSider>
        <LayoutContent data-region="content">
          Main content
        </LayoutContent>
      </div>
      <LayoutFooter data-region="footer">Footer / status</LayoutFooter>
    </Layout>
  );
}
