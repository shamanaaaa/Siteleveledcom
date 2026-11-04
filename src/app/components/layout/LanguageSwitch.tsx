import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { X } from "lucide-react";
import { useI18n } from "../../i18n/LocaleContext";
import { counterpart, preferredLocale, routeMatch, type Locale } from "../../i18n/routes";

export const LANGUAGE_KEY = "siteleveled-language";
export const DISMISS_KEY = "siteleveled-language-dismissed";
function remember(locale: Locale) {
  try { localStorage.setItem(LANGUAGE_KEY, locale); } catch { /* The link still works. */ }
}
export function LanguageSwitch() {
  const { locale } = useI18n();
  const location = useLocation();
  const equivalent = Boolean(routeMatch(location.pathname));
  return <nav aria-label={locale === "en" ? "Language" : "Jazyk"} className="flex shrink-0 items-center gap-1 text-xs">
    {(["sk", "en"] as const).map(target => <Link
      key={target}
      lang={target}
      hrefLang={target}
      to={counterpart(location.pathname, target, location.search, location.hash)}
      onClick={() => remember(target)}
      aria-current={locale === target ? "page" : undefined}
      aria-label={!equivalent && target === "en" ? "EN home – English homepage" : target === "en" ? "EN – English" : "SK – Slovenčina"}
      className={`rounded-md px-2 py-2 focus-visible:outline-2 focus-visible:outline-[#9F97FF] ${locale === target ? "bg-[#6C63FF]/25 text-white" : "text-white/60 hover:text-white"}`}
    >{!equivalent && target === "en" ? "EN home" : target.toUpperCase()}</Link>)}
  </nav>;
}
export function LanguageSuggestion() {
  const { locale } = useI18n();
  const location = useLocation();
  const [suggested, setSuggested] = useState<Locale | null>(null);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    let saved: string | null = null;
    let hidden = false;
    try { saved = localStorage.getItem(LANGUAGE_KEY); } catch { /* Optional storage. */ }
    try { hidden = sessionStorage.getItem(DISMISS_KEY) === "1"; } catch { /* Optional storage. */ }
    let languages: readonly string[] = [];
    try { languages = navigator.languages?.length ? navigator.languages : [navigator.language]; } catch { /* International fallback. */ }
    const target = preferredLocale(languages, saved);
    setSuggested(!hidden && target !== locale ? target : null);
  }, [locale, location.pathname]);
  if (!suggested || dismissed) return null;
  const isEnglish = suggested === "en";
  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* State still dismisses it. */ }
  };
  return <aside lang={suggested} aria-label={isEnglish ? "Language suggestion" : "Odporúčaný jazyk"} className="fixed bottom-24 left-4 right-4 z-50 mx-auto flex max-w-lg items-center gap-3 rounded-xl border border-white/20 bg-[#161322] p-4 text-sm text-white shadow-xl lg:bottom-6">
    <Link lang={suggested} hrefLang={suggested} to={counterpart(location.pathname, suggested, location.search, location.hash)} onClick={() => { remember(suggested); setSuggested(null); }} className="flex-1 underline underline-offset-4">
      {isEnglish ? "Prefer English? Visit the English version." : "Uprednostňujete slovenčinu? Prejsť na slovenskú verziu."}
    </Link>
    <button type="button" onClick={dismiss} aria-label={isEnglish ? "Dismiss language suggestion" : "Zavrieť odporúčanie jazyka"} className="p-2"><X size={18} /></button>
  </aside>;
}
