import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Grain } from "../fx/Grain";
import { applyHead } from "../../seo/head";
import { pageFor } from "../../seo/pages";

export function Layout() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  // /mesto/<client>/ is the home page with a building opened: no remount, no scroll reset
  const pageKey = location.pathname.startsWith("/mesto/") ? "/" : location.pathname;

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
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pageKey, location.hash]);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navbar />
      <motion.main
        key={pageKey}
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Outlet />
      </motion.main>
      <Footer />
      <Grain />
    </div>
  );
}
