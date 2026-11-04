import { LocaleProvider } from "../../i18n/LocaleContext";
import { localeForPath, pathFor, routeMatch } from "../../i18n/routes";
import { LanguageSuggestion } from "./LanguageSwitch";
import { cityMeta } from "../../seo/city";
import { findClient } from "../../city/cityData";
import { Outlet, useLocation } from "react-router";
import { useEffect, useRef } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Grain } from "../fx/Grain";
import { applyHead } from "../../seo/head";
import { pageFor } from "../../seo/pages";

export function Layout() {
  const location = useLocation();
  const firstLoad = useRef(true);
  // City shares reuse their locale homepage: no remount or scroll reset.
  const pageKey = routeMatch(location.pathname)?.route.id === "cityClient" ? pathFor("home", localeForPath(location.pathname)) : location.pathname;
  // The page the visitor landed on, until they leave it
  const firstKey = useRef<string | null>(pageKey);
  if (firstKey.current !== pageKey) firstKey.current = null;

  // City shares own their metadata; unknown paths get theirs from NotFoundPage.
  useEffect(() => {
    const match = routeMatch(location.pathname);
    const client = match?.slug && findClient(match.slug);
    const page = client ? cityMeta(client, match.locale) : pageFor(location.pathname);
    if (page) applyHead(page);
  }, [location.pathname]);

  useEffect(() => {
    // The browser handles the initial anchor. A late hydration effect must not override
    // a visitor who has already scrolled or opened a city building.
    if (firstLoad.current) return;
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
        // A new click, key, or scroll supersedes an anchor navigation still waiting to run.
        const events = ["click", "keydown", "wheel", "touchstart"] as const;
        const cancel = () => {
          clearTimeout(timer);
          for (const event of events) window.removeEventListener(event, cancel, true);
        };
        const timer = setTimeout(() => { cancel(); el.scrollIntoView({ behavior }); }, 50);
        for (const event of events) window.addEventListener(event, cancel, { capture: true, passive: true });
        return cancel;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pageKey, location.hash]);

  useEffect(() => {
    firstLoad.current = false;
  }, []);

  return (
    <LocaleProvider>
      <div className="min-h-screen bg-background text-foreground font-body">
        <Navbar />
        <LanguageSuggestion />
        {/* Only in-app navigation fades: on first load it would delay the largest paint (LCP) */}
        <main key={pageKey} className={firstKey.current === pageKey ? undefined : "page-enter"}>
          <Outlet />
        </main>
        <Footer />
        <Grain />
      </div>
    </LocaleProvider>
  );
}
