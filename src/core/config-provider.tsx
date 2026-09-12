import { createContext, useContext, type ReactNode } from "react";
import { enUS, type ComponentLocale } from "./locale";

export interface ConfigProviderProps {
  children?: ReactNode;
  /** Complete language pack. An omitted pack inherits the nearest provider. */
  locale?: ComponentLocale;
}
const LocaleContext = createContext<ComponentLocale>(enUS);

export function ConfigProvider({ children, locale }: ConfigProviderProps) {
  const parent = useContext(LocaleContext);
  return <LocaleContext.Provider value={locale ?? parent}>{children}</LocaleContext.Provider>;
}

/** Internal component integration; not a second public configuration API. */
export function useComponentLocale<K extends Exclude<keyof ComponentLocale, "locale">>(
  component: K,
  override?: Partial<ComponentLocale[K]>,
): ComponentLocale[K] {
  const pack = useContext(LocaleContext);
  const definedOverride = Object.fromEntries(Object.entries(override ?? {}).filter(([, value]) => value !== undefined));
  return { ...enUS[component], ...pack[component], ...definedOverride };
}
