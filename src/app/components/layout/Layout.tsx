import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Grain } from "../fx/Grain";

export function Layout() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navbar />
      <motion.main
        key={location.pathname}
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
