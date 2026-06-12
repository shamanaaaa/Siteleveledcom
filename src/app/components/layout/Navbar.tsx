import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Aurora } from "../fx/Aurora";

const navLinks = [
  { label: "Ako to funguje", hash: "ako-to-funguje" },
  { label: "Portfólio", hash: "portfolio" },
  { label: "Referencie", hash: "referencie" },
  { label: "FAQ", hash: "faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formOnScreen, setFormOnScreen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Hide the floating mobile CTA while the lead form is on screen so it
  // never covers the submit button
  useEffect(() => {
    const el = document.getElementById("formular");
    if (!el) {
      setFormOnScreen(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setFormOnScreen(entry.isIntersecting),
      { rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(el);
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
            to="/"
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="group flex items-center gap-2"
          >
            <span className="font-heading text-[1.35rem] tracking-tight text-[#F5F5F0]">
              SITE<span className="text-[#6C63FF]">LEVELED</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.hash}
                to={`/#${link.hash}`}
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault();
                    scrollTo(link.hash);
                  }
                }}
                className="text-[0.875rem] tracking-wide text-[#F5F5F0]/70 transition-colors duration-200 hover:text-[#9F97FF]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Link
              to="/#formular"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  scrollTo("formular");
                }
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#6C63FF] px-5 py-2.5 text-[0.875rem] font-semibold text-white shadow-[0_4px_20px_rgba(108,99,255,0.3)] transition-all duration-200 hover:bg-[#7B73FF] hover:shadow-[0_4px_28px_rgba(108,99,255,0.5)]"
            >
              Chcem návrh zadarmo
              <span className="text-[1rem]">→</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="p-2 text-[#F5F5F0] lg:hidden"
            aria-label={mobileOpen ? "Zavrieť menu" : "Otvoriť menu"}
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
                  key={link.hash}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-white/5"
                >
                  <Link
                    to={`/#${link.hash}`}
                    onClick={(e) => {
                      setMobileOpen(false);
                      if (location.pathname === "/") {
                        e.preventDefault();
                        scrollTo(link.hash);
                      }
                    }}
                    className="flex items-baseline gap-4 py-5 font-heading text-[1.7rem] font-bold tracking-tight text-[#F5F5F0]/85 transition-colors hover:text-[#9F97FF]"
                  >
                    <span className="font-body text-[0.7rem] text-[#6C63FF]/70">
                      0{i + 1}
                    </span>
                    {link.label}
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
                  to="/#formular"
                  onClick={(e) => {
                    setMobileOpen(false);
                    if (location.pathname === "/") {
                      e.preventDefault();
                      scrollTo("formular");
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#6C63FF] px-7 py-3.5 text-[1rem] font-semibold text-white shadow-[0_8px_32px_rgba(108,99,255,0.35)]"
                >
                  Chcem návrh zadarmo →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile floating CTA */}
      <AnimatePresence>
        {!formOnScreen && !mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-4 right-4 z-50 lg:hidden"
          >
            <Link
              to="/#formular"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  scrollTo("formular");
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6C63FF] py-3.5 text-[0.9rem] font-semibold text-white shadow-[0_4px_30px_rgba(108,99,255,0.45)]"
            >
              Chcem návrh zadarmo →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
