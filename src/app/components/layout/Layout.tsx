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
  // /mesto/<client>/ is the home page with a building opened: no remount, no scroll reset
  const pageKey = location.pathname.startsWith("/mesto/") ? "/" : location.pathname;
  // The page the visitor landed on, until they leave it
  const firstKey = useRef<string | null>(pageKey);
  if (firstKey.current !== pageKey) firstKey.current = null;

  // Unknown paths get theirs from NotFoundPage, /mesto/<client>/ from CityPanel
  useEffect(() => {
    const page = pageFor(location.pathname);
    if (page) applyHead(page);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
        return;
      }
    }
    // Not on first load: the visitor may have scrolled a pre-rendered page before the JavaScript arrived
    if (!firstLoad.current) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pageKey, location.hash]);

  useEffect(() => {
    firstLoad.current = false;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navbar />
      {/* Only in-app navigation fades: on first load it would delay the largest paint (LCP) */}
      <main key={pageKey} className={firstKey.current === pageKey ? undefined : "page-enter"}>
        <Outlet />
      </main>
      <Footer />
      <Grain />
    </div>
  );
}
