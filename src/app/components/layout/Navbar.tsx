import { LanguageSwitch } from "./LanguageSwitch";
import { useI18n } from "../../i18n/LocaleContext";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Aurora } from "../fx/Aurora";

// `hash` = section on the home page, `to` = its own route (trailing slash: the canonical URL)
const navLinks: { label: string; hash?: string; to?: string }[] = [
  { label: "Služby", to: "/sluzby/" },
  { label: "Cenník", to: "/cennik/" },
  { label: "Portfólio", hash: "portfolio" },
  { label: "Referencie", hash: "referencie" },
  { label: "FAQ", hash: "faq" },
  { label: "SEO audit", to: "/seo-audit/" },
];

export function Navbar() {
  const { t: tr, link: localLink } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ctaCovered, setCtaCovered] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Hide the floating mobile CTA while the lead form or the footer is on screen so it
  // never covers the submit button, the footer's own CTA or the closing wordmark
  useEffect(() => {
    const targets = [
      document.getElementById("formular"),
      document.getElementById("site-footer"),
    ].filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) {
      setCtaCovered(false);
      return;
    }
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
        setCtaCovered(onScreen.size > 0);
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50">
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? "mt-3 max-w-5xl rounded-2xl border border-white/8 bg-[#0A0A0F]/75 px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl max-[1064px]:mx-3"
              : "max-w-7xl border border-transparent px-6 py-4"
          }`}
        >
          <Link
            to={localLink("/")}
            onClick={(e) => {
              if (location.pathname === localLink("/")) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="group flex items-center gap-2"
          >
            <span className="font-heading text-[1.35rem] tracking-tight text-[#F5F5F0]">{tr("SITE")}<span className="text-[#6C63FF]">{tr("LEVELED")}</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={localLink(link.to ?? `/#${link.hash}`)}
                onClick={(e) => {
                  if (link.hash && location.pathname === localLink("/")) {
                    e.preventDefault();
                    scrollTo(link.hash);
                  }
                }}
                className="text-[0.875rem] tracking-wide text-[#F5F5F0]/70 transition-colors duration-200 hover:text-[#9F97FF]"
              >
                {tr(link.label)}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Link
              to={localLink("/#formular")}
              onClick={(e) => {
                if (location.pathname === localLink("/")) {
                  e.preventDefault();
                  scrollTo("formular");
                }
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#665DFA] px-5 py-2.5 text-[0.875rem] font-semibold text-white shadow-[0_4px_20px_rgba(108,99,255,0.3)] transition-all duration-200 hover:bg-[#5b53e8] hover:shadow-[0_4px_28px_rgba(108,99,255,0.5)]"
            >{tr("Chcem návrh zadarmo")}<span className="text-[1rem]">{"→"}</span>
            </Link>
          </div>

          <LanguageSwitch />

          {/* Mobile toggle */}
          <button
            className="p-2 text-[#F5F5F0] lg:hidden"
            aria-label={tr(mobileOpen ? "Zavrieť menu" : "Otvoriť menu")}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 overflow-hidden bg-[#06060B]/[0.97] px-6 pt-24 backdrop-blur-xl lg:hidden"
          >
            <Aurora variant="section" />
            <div className="relative flex flex-col">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-white/5"
                >
                  <Link
                    to={localLink(link.to ?? `/#${link.hash}`)}
                    onClick={(e) => {
                      setMobileOpen(false);
                      if (link.hash && location.pathname === localLink("/")) {
                        e.preventDefault();
                        scrollTo(link.hash);
                      }
                    }}
                    className="flex items-baseline gap-4 py-5 font-heading text-[1.7rem] font-bold tracking-tight text-[#F5F5F0]/85 transition-colors hover:text-[#9F97FF]"
                  >
                    <span className="font-body text-[0.7rem] text-[#9F97FF]">{"0"}{tr(i + 1)}
                    </span>
                    {tr(link.label)}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Link
                  to={localLink("/#formular")}
                  onClick={(e) => {
                    setMobileOpen(false);
                    if (location.pathname === localLink("/")) {
                      e.preventDefault();
                      scrollTo("formular");
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#665DFA] px-7 py-3.5 text-[1rem] font-semibold text-white shadow-[0_8px_32px_rgba(108,99,255,0.35)]"
                >{tr("Chcem návrh zadarmo →")}</Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile floating CTA. Part of the first paint: a real link that works before the JavaScript arrives */}
      <AnimatePresence initial={false}>
        {!ctaCovered && !mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-4 right-4 z-50 lg:hidden"
          >
            <Link
              to={localLink("/#formular")}
              onClick={(e) => {
                if (location.pathname === localLink("/")) {
                  e.preventDefault();
                  scrollTo("formular");
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#665DFA] py-3.5 text-[0.9rem] font-semibold text-white shadow-[0_4px_30px_rgba(108,99,255,0.45)]"
            >{tr("Chcem návrh zadarmo →")}</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
