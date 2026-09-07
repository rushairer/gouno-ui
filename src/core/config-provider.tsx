import { createContext, useContext, type ReactNode } from "react";

export interface UIConfig {
  componentSize?: "small" | "middle" | "large";
  direction?: "ltr" | "rtl";
}

const ConfigContext = createContext<UIConfig>({});

export interface ConfigProviderProps extends UIConfig {
  children: ReactNode;
}

export function ConfigProvider({ children, ...config }: ConfigProviderProps) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  return useContext(ConfigContext);
}
