import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocation } from "react-router";
import { localeForPath, localizeLink, type Locale } from "./routes";
import { translate } from "./messages";
export { translate, dictionaries, loadMessages } from "./messages";
export type { MessageKey, Messages } from "./messages";

const LocaleContext = createContext<Locale>("sk");
export function LocaleProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return <LocaleContext.Provider value={localeForPath(pathname)}>{children}</LocaleContext.Provider>;
}
export function useI18n() {
  const locale = useContext(LocaleContext);
  return useMemo(() => ({
    locale,
    t: <T,>(value: T): T => translate(value, locale),
    link: (href: string) => localizeLink(href, locale),
  }), [locale]);
}
