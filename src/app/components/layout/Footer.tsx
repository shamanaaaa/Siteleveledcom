import { Link } from "react-router";
import { Linkedin, Instagram, Facebook } from "lucide-react";

const navLinks = [
  { label: "Ako to funguje", hash: "ako-to-funguje" },
  { label: "Portfólio", hash: "portfolio" },
  { label: "Referencie", hash: "referencie" },
  { label: "FAQ", hash: "faq" },
  { label: "Kontakt", href: "/kontakt" },
];

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/5">
      {/* Pre-footer CTA */}
      <div className="bg-gradient-to-r from-[#6C63FF]/10 via-[#6C63FF]/5 to-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-[1.5rem] md:text-[1.75rem] text-[#F5F5F0] text-center md:text-left mb-1">
              Vyleveluj svoju stránku.
            </h3>
            <p className="text-[0.9rem] text-[#F5F5F0]/40 text-center md:text-left">
              Návrh webstránky – do 24 hodín, zadarmo.
            </p>
          </div>
          <Link
            to="/#formular"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                scrollTo("formular");
              }
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-lg transition-all duration-200 hover:shadow-[0_0_30px_rgba(108,99,255,0.3)] whitespace-nowrap"
          >
            Chcem návrh zadarmo →
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-heading text-[1.25rem] tracking-tight text-[#F5F5F0]">
                SITE<span className="text-[#6C63FF]">LEVELED</span>
              </span>
            </Link>
            <p className="text-[#F5F5F0]/50 text-[0.875rem] mb-4 leading-relaxed">
              Váš web na ďalšiu úroveň – do 24 hodín.
            </p>
            <div className="text-[#F5F5F0]/30 text-[0.8rem] space-y-0.5">
              <p className="text-[#F5F5F0]/50">DOMAN s.r.o.</p>
              <p>IČO: 47 912 383</p>
              <p>Ulica Funduše 1165/26</p>
              <p>Cabaj-Čápor 951 17</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-[0.85rem] text-[#F5F5F0]/40 uppercase tracking-widest mb-5">
              Navigácia
            </h4>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <span key={link.label}>
                  {link.hash ? (
                    <Link
                      to={`/#${link.hash}`}
                      onClick={(e) => {
                        if (window.location.pathname === "/") {
                          e.preventDefault();
                          scrollTo(link.hash!);
                        }
                      }}
                      className="text-[0.875rem] text-[#F5F5F0]/60 hover:text-[#6C63FF] transition-colors cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      to={link.href!}
                      className="text-[0.875rem] text-[#F5F5F0]/60 hover:text-[#6C63FF] transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Čo dostanete */}
          <div>
            <h4 className="font-heading text-[0.85rem] text-[#F5F5F0]/40 uppercase tracking-widest mb-5">
              Čo dostanete zadarmo
            </h4>
            <div className="flex flex-col gap-3 text-[0.875rem] text-[#F5F5F0]/60">
              <span>Vizuálny návrh hlavnej stránky</span>
              <span>Štruktúra celého webu</span>
              <span>Základný koncept textov</span>
              <span>Odporúčania dizajnu</span>
              <span>Cenová ponuka realizácie</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-[0.85rem] text-[#F5F5F0]/40 uppercase tracking-widest mb-5">
              Kontakt
            </h4>
            <div className="flex flex-col gap-3 text-[0.875rem] text-[#F5F5F0]/60">
              <a
                href="mailto:info@siteleveled.com"
                className="hover:text-[#6C63FF] transition-colors"
              >
                info@siteleveled.com
              </a>
              <div className="flex items-center gap-4 mt-2">
                <a
                  href="#"
                  className="text-[#F5F5F0]/40 hover:text-[#6C63FF] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="text-[#F5F5F0]/40 hover:text-[#6C63FF] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="#"
                  className="text-[#F5F5F0]/40 hover:text-[#6C63FF] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.8rem] text-[#F5F5F0]/30">
            &copy; {new Date().getFullYear()} siteleveled.com – DOMAN s.r.o.
          </p>
          <div className="flex items-center gap-6 text-[0.8rem] text-[#F5F5F0]/30">
            <a href="#" className="hover:text-[#F5F5F0]/60 transition-colors">
              Ochrana osobných údajov
            </a>
            <a href="#" className="hover:text-[#F5F5F0]/60 transition-colors">
              Podmienky používania
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
