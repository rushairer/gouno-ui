import {
  ButtonLink,
  NavigationProvider,
  Space,
  type LinkAdapterProps,
} from "../../../../src/core";

function DemoRouterLink({ to, ...props }: LinkAdapterProps) {
  return <a {...props} href={to} data-route={to} />;
}

export default function ButtonNavigationDemo() {
  return (
    <NavigationProvider link={DemoRouterLink}>
      <Space wrap>
        <ButtonLink
          href="https://github.com/rushairer/gouno-ui"
          target="_blank"
          rel="noreferrer"
        >
          外部链接
        </ButtonLink>
        <ButtonLink to="/settings" variant="solid" color="primary">
          路由链接
        </ButtonLink>
        <ButtonLink to="/locked" disabled>
          禁用链接
        </ButtonLink>
      </Space>
    </NavigationProvider>
  );
}
