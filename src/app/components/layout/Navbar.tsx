import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Služby", href: "/sluzby" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Proces", href: "/proces" },
  { label: "O nás", href: "/o-nas" },
  { label: "Cenník", href: "/cennik" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-heading text-[1.35rem] tracking-tight text-[#F5F5F0]">
              SITE<span className="text-[#6C63FF]">LEVELED</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-[0.875rem] tracking-wide transition-colors duration-200 hover:text-[#6C63FF] ${
                  location.pathname === link.href
                    ? "text-[#6C63FF]"
                    : "text-[#F5F5F0]/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C63FF] hover:bg-[#5b53e8] text-white text-[0.875rem] rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(108,99,255,0.3)]"
            >
              Nezáväzná konzultácia
              <span className="text-[1rem]">→</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-[#F5F5F0] p-2"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0A0A0F]/98 backdrop-blur-xl pt-20 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className={`block py-3 text-[1.25rem] font-heading tracking-wide transition-colors ${
                      location.pathname === link.href
                        ? "text-[#6C63FF]"
                        : "text-[#F5F5F0]/80 hover:text-[#6C63FF]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-6"
              >
                <Link
                  to="/kontakt"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#6C63FF] text-white rounded-lg text-[1rem]"
                >
                  Nezáväzná konzultácia →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile floating CTA */}
      <div className="fixed bottom-6 left-4 right-4 z-50 lg:hidden">
        <Link
          to="/kontakt"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-xl shadow-[0_4px_30px_rgba(108,99,255,0.4)] text-[0.9rem]"
        >
          Nezáväzná konzultácia →
        </Link>
      </div>
    </>
  );
}
