import { Link, useLocation } from "react-router";
import { Linkedin, Instagram, Facebook } from "lucide-react";
import { Aurora } from "../fx/Aurora";
import { KineticHeading } from "../fx/KineticHeading";
import { MagneticButton } from "../fx/MagneticButton";

const navLinks = [
  { label: "Ako to funguje", hash: "ako-to-funguje" },
  { label: "Portfólio", hash: "portfolio" },
  { label: "Referencie", hash: "referencie" },
  { label: "FAQ", hash: "faq" },
  { label: "Kontakt", href: "/kontakt" },
];

export function Footer() {
  const location = useLocation();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="overflow-hidden border-t border-white/5">
      {/* Pre-footer CTA */}
      <div className="relative overflow-hidden border-b border-white/5 bg-bg-deep">
        <Aurora variant="cta" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-20 md:flex-row">
          <div className="text-center md:text-left">
            <KineticHeading
              as="h3"
              segments={[
                { text: "Vyleveluj" },
                { text: "svoju stránku.", className: "text-gradient-primary" },
              ]}
              className="mb-2 font-heading text-title font-bold"
            />
            <p className="text-[0.95rem] text-[#F5F5F0]/40">
              Návrh webstránky – do 24 hodín, zadarmo.
            </p>
          </div>
          <MagneticButton
            to="/#formular"
            size="lg"
            onClick={() => {
              if (location.pathname === "/") scrollTo("formular");
            }}
            className="whitespace-nowrap"
          >
            Chcem návrh zadarmo
          </MagneticButton>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="mb-4 inline-block">
              <span className="font-heading text-[1.25rem] tracking-tight text-[#F5F5F0]">
                SITE<span className="text-[#6C63FF]">LEVELED</span>
              </span>
            </Link>
            <p className="mb-4 text-[0.875rem] leading-relaxed text-[#F5F5F0]/50">
              Váš web na ďalšiu úroveň – do 24 hodín.
            </p>
            <div className="space-y-0.5 text-[0.8rem] text-[#F5F5F0]/30">
              <p className="text-[#F5F5F0]/50">DOMAN s.r.o.</p>
              <p>IČO: 47 912 383</p>
              <p>Ulica Funduše 1165/26</p>
              <p>Cabaj-Čápor 951 17</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-5 font-heading text-[0.85rem] uppercase tracking-widest text-[#F5F5F0]/40">
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
                      className="cursor-pointer text-[0.875rem] text-[#F5F5F0]/60 transition-colors hover:text-[#9F97FF]"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      to={link.href!}
                      className="text-[0.875rem] text-[#F5F5F0]/60 transition-colors hover:text-[#9F97FF]"
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
            <h4 className="mb-5 font-heading text-[0.85rem] uppercase tracking-widest text-[#F5F5F0]/40">
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
            <h4 className="mb-5 font-heading text-[0.85rem] uppercase tracking-widest text-[#F5F5F0]/40">
              Kontakt
            </h4>
            <div className="flex flex-col gap-3 text-[0.875rem] text-[#F5F5F0]/60">
              <a
                href="mailto:domansro@gmail.com"
                className="transition-colors hover:text-[#9F97FF]"
              >
                domansro@gmail.com
              </a>
              <div className="mt-2 flex items-center gap-4">
                <a
                  href="#"
                  className="text-[#F5F5F0]/40 transition-colors hover:text-[#9F97FF]"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/m%C3%A1rio-doman-65b08663/"
                  className="text-[#F5F5F0]/40 transition-colors hover:text-[#9F97FF]"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://www.facebook.com/mario.doman"
                  className="text-[#F5F5F0]/40 transition-colors hover:text-[#9F97FF]"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-[0.8rem] text-[#F5F5F0]/30">
            &copy; {new Date().getFullYear()} siteleveled.com – DOMAN s.r.o.
          </p>
          <div className="flex items-center gap-6 text-[0.8rem] text-[#F5F5F0]/30">
            <a href="#" className="transition-colors hover:text-[#F5F5F0]/60">
              Ochrana osobných údajov
            </a>
            <a href="#" className="transition-colors hover:text-[#F5F5F0]/60">
              Podmienky používania
            </a>
          </div>
        </div>
      </div>

      {/* Giant outlined wordmark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden leading-none">
        <span className="-mb-[0.2em] block whitespace-nowrap text-center font-heading text-[12.5vw] font-extrabold tracking-tight text-stroke-ghost">
          SITELEVELED
        </span>
      </div>
    </footer>
  );
}
