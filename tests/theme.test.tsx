import { useTheme } from "../src/theme/provider";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "../src/theme/provider";

function setSystemDark(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({
      matches,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

function Probe() {
  const { brand, mode, resolvedMode } = useTheme();
  return (
    <output>
      {brand}:{mode}:{resolvedMode}
    </output>
  );
}

function InteractiveProbe() {
  const { mode, resolvedMode, setMode } = useTheme();
  return (
    <>
      <output>
        {mode}:{resolvedMode}
      </output>
      <button type="button" onClick={() => setMode("dark")}>
        Dark
      </button>
      <button type="button" onClick={() => setMode("light")}>
        Light
      </button>
    </>
  );
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.brand;
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.density;
  document.documentElement.style.colorScheme = "";
  document.head.querySelectorAll('meta[name="theme-color"][data-theme-test]').forEach((node) => node.remove());
});

describe("ThemeProvider", () => {
  it("applies the brand and exposes the resolved mode", () => {
    setSystemDark(false);
    render(
      <ThemeProvider brand="blog-admin" storageKey="test-theme">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByText("blog-admin:system:light")).toBeTruthy();
    expect(document.documentElement.dataset.brand).toBe("blog-admin");
  });

  it("does not require matchMedia in constrained runtimes", () => {
    const original = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: undefined,
    });
    expect(() =>
      render(
        <ThemeProvider brand="blog" storageKey="test-theme-no-media">
          <Probe />
        </ThemeProvider>,
      ),
    ).not.toThrow();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: original,
    });
  });

  it.each(["blog", "blog-admin", "gosso-admin"] as const)(
    "supports the %s brand with system mode",
    (brand) => {
      setSystemDark(true);
      render(
        <ThemeProvider brand={brand} storageKey={`test-theme-${brand}`}>
          <Probe />
        </ThemeProvider>,
      );
      expect(screen.getByText(`${brand}:system:dark`)).toBeTruthy();
      expect(document.documentElement.dataset.brand).toBe(brand);
    },
  );

  it("persists explicit mode and synchronizes browser theme side effects", () => {
    setSystemDark(false);
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.dataset.themeTest = "true";
    document.head.append(meta);

    render(
      <ThemeProvider brand="blog-admin" storageKey="theme-persist" density="compact">
        <InteractiveProbe />
      </ThemeProvider>,
    );

    expect(screen.getByText("system:light")).toBeTruthy();
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.dataset.density).toBe("compact");
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(meta.getAttribute("content")).toBe("#ffffff");

    fireEvent.click(screen.getByRole("button", { name: "Dark" }));
    expect(screen.getByText("dark:dark")).toBeTruthy();
    expect(localStorage.getItem("theme-persist")).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(meta.getAttribute("content")).toBe("#11151b");

    fireEvent.click(screen.getByRole("button", { name: "Light" }));
    expect(screen.getByText("light:light")).toBeTruthy();
    expect(localStorage.getItem("theme-persist")).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(meta.getAttribute("content")).toBe("#ffffff");
  });
});
