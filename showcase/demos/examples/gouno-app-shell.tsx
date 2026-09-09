import { Button, Text } from "../../../src/core";
import {
  AppShell,
  NavigationGroup,
  PageContainer,
  navigationItemClass,
} from "../../../src/gouno";

export default function GounoAppShellExample() {
  return (
    <div className="h-[520px] overflow-auto rounded-lg border">
      <AppShell
        brand="Gouno Admin"
        breadcrumbs={<span>系统 / OAuth2 客户端</span>}
        toolbar={<Button size="small">刷新</Button>}
        account={<span className="text-sm">Aben</span>}
        footer={
          <Text size="xs" tone="muted">
            Gouno UI v0.1
          </Text>
        }
        navigationLabel="示例应用导航"
        navigation={(close) => (
          <>
            <NavigationGroup>
              <a
                href="#overview"
                aria-current="page"
                className={navigationItemClass}
                onClick={(event) => {
                  event.preventDefault();
                  close();
                }}
              >
                概览
              </a>
            </NavigationGroup>
            <NavigationGroup label="系统管理">
              <a
                href="#oauth-clients"
                className={navigationItemClass}
                onClick={(event) => {
                  event.preventDefault();
                  close();
                }}
              >
                OAuth2 客户端
              </a>
              <a
                href="#users"
                className={navigationItemClass}
                onClick={(event) => {
                  event.preventDefault();
                  close();
                }}
              >
                用户
              </a>
            </NavigationGroup>
          </>
        )}
      >
        <PageContainer>
          <Text as="div" className="font-semibold">
            OAuth2 客户端
          </Text>
          <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
            Main / children
          </div>
        </PageContainer>
      </AppShell>
    </div>
  );
}
