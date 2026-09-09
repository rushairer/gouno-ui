import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  AppShell,
  NavigationGroup,
  PageContainer,
  PageHeader,
} from "../src/gouno";

afterEach(cleanup);

describe("Gouno application structure", () => {
  it("keeps PageContainer structural rhythm while forwarding native div props", () => {
    render(
      <PageContainer
        id="settings-page"
        data-testid="page-container"
        data-page="settings"
        className="custom-track"
      >
        Settings
      </PageContainer>,
    );

    const container = screen.getByTestId("page-container");
    expect(container.getAttribute("data-slot")).toBe("page-container");
    expect(container.getAttribute("data-page")).toBe("settings");
    expect(container.getAttribute("id")).toBe("settings-page");
    expect(container.className).toContain("max-w-[1440px]");
    expect(container.className).toContain("gap-6");
    expect(container.className).toContain("custom-track");
  });

  it("renders PageHeader as page semantics with optional description and action slots", () => {
    render(
      <PageHeader
        title="OAuth2 客户端"
        description="管理客户端与回调地址。"
        actions={<button type="button">注册客户端</button>}
        className="page-heading"
      />,
    );

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "OAuth2 客户端",
    });
    const header = heading.closest('[data-slot="page-header"]');
    expect(header?.tagName).toBe("HEADER");
    expect(header?.className).toContain("page-heading");
    expect(screen.getByText("管理客户端与回调地址。")).toBeTruthy();
    expect(screen.getByRole("button", { name: "注册客户端" })).toBeTruthy();
  });

  it("provides skip navigation, labeled desktop navigation and a closable mobile drawer", async () => {
    render(
      <AppShell
        brand="Gouno Admin"
        navigationLabel="Workspace navigation"
        breadcrumbs={<span>Home / Settings</span>}
        toolbar={<button type="button">Search</button>}
        account={<button type="button">Account</button>}
        footer={<span>Build 1</span>}
        navigation={(close) => (
          <NavigationGroup label="System">
            <button type="button" onClick={close}>
              Settings
            </button>
          </NavigationGroup>
        )}
      >
        <div>Page content</div>
      </AppShell>,
    );

    const skip = screen.getByRole("link", { name: "跳至主要内容" });
    const main = screen.getByRole("main");
    expect(main.getAttribute("id")).toMatch(/^app-shell-main-/);
    expect(skip.getAttribute("href")).toBe(`#${main.getAttribute("id")}`);
    expect((main as HTMLElement).tabIndex).toBe(-1);
    expect(
      screen.getByRole("navigation", { name: "Workspace navigation" }),
    ).toBeTruthy();
    expect(screen.getByText("Home / Settings")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Search" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Account" })).toBeTruthy();

    const trigger = screen.getByRole("button", {
      name: "Workspace navigation",
    });
    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog.className).toContain("max-w-[calc(100vw-1rem)]");
    const mobileNavigation = within(dialog).getByRole("navigation", {
      name: "Workspace navigation",
    });
    fireEvent.click(
      within(mobileNavigation).getByRole("button", { name: "Settings" }),
    );

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("assigns unique skip-link targets when multiple AppShell instances share a document", () => {
    const navigation = () => <a href="#section">Section</a>;
    render(
      <>
        <AppShell
          brand="Outer"
          navigationLabel="Outer navigation"
          navigation={navigation}
        >
          Outer content
        </AppShell>
        <AppShell
          brand="Preview"
          navigationLabel="Preview navigation"
          navigation={navigation}
        >
          Preview content
        </AppShell>
      </>,
    );

    const mains = screen.getAllByRole("main");
    const skips = screen.getAllByRole("link", { name: "跳至主要内容" });
    const ids = mains.map((main) => main.id);

    expect(new Set(ids).size).toBe(2);
    expect(ids.every((id) => id.startsWith("app-shell-main-"))).toBe(true);
    expect(skips.map((skip) => skip.getAttribute("href"))).toEqual(
      ids.map((id) => `#${id}`),
    );
  });
});
