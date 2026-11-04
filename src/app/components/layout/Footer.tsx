import { useI18n } from "../../i18n/LocaleContext";
import { Link, useLocation } from "react-router";
import { Linkedin, Facebook } from "lucide-react";
import { Aurora } from "../fx/Aurora";
import { HorizonWordmark } from "../fx/HorizonWordmark";
import { KineticHeading } from "../fx/KineticHeading";
import { MagneticButton } from "../fx/MagneticButton";

// Every content page is linked here: crawlers find pages through links (trailing slash = canonical URL)
const navLinks = [
  { label: "Ako to funguje", hash: "ako-to-funguje" },
  { label: "Služby", href: "/sluzby/" },
  { label: "Tvorba e-shopu", href: "/tvorba-eshopu/" },
  { label: "Cenník", href: "/cennik/" },
  { label: "Portfólio", href: "/portfolio/" },
  { label: "Proces spolupráce", href: "/proces/" },
  { label: "O nás", href: "/o-nas/" },
  { label: "SEO audit zadarmo", href: "/seo-audit/" },
  { label: "Kontakt", href: "/kontakt/" },
];

export function Footer() {
  const { t: tr, link: localLink, locale } = useI18n();
  const location = useLocation();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer id="site-footer" className="overflow-hidden border-t border-white/5">
      {/* Pre-footer CTA */}
      <div className="relative overflow-hidden border-b border-white/5 bg-bg-deep">
        <Aurora variant="cta" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-20 md:flex-row">
          <div className="text-center md:text-left">
            <KineticHeading
              as="p"
              segments={tr([
                { text: "Vylevelujte" },
                { text: "svoju stránku.", className: "text-gradient-primary" },
              ])}
              className="mb-2 font-heading text-title font-bold"
            />
            <p className="text-[0.95rem] text-[#F5F5F0]/60">{tr("Návrh webstránky – do 24 hodín, zadarmo.")}</p>
          </div>
          <MagneticButton
            to={localLink("/#formular")}
            size="lg"
            onClick={() => {
              if (location.pathname === "/") scrollTo("formular");
            }}
            className="whitespace-nowrap"
          >{tr("Chcem návrh zadarmo")}</MagneticButton>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to={localLink("/")} className="mb-4 inline-block">
              <span className="font-heading text-[1.25rem] tracking-tight text-[#F5F5F0]">{tr("SITE")}<span className="text-[#6C63FF]">{tr("LEVELED")}</span>
              </span>
            </Link>
            <p className="mb-4 text-[0.875rem] leading-relaxed text-[#F5F5F0]/50">{tr("Váš web na ďalšiu úroveň – do 24 hodín.")}</p>
            <div className="space-y-0.5 text-[0.8rem] text-[#F5F5F0]/50">
              <p className="text-[#F5F5F0]/70">{tr("DOMAN s.r.o.")}</p>
              <p>{tr("IČO: 47 912 383")}</p>
              <p>{tr("Ulica Funduše 1165/26")}</p>
              <p>{tr("Cabaj-Čápor 951 17")}</p>
              <p>{tr("Konateľka: Mária Domanová")}</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-5 font-heading text-[0.85rem] uppercase tracking-widest text-[#F5F5F0]/60">{tr("Navigácia")}</p>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <span key={link.label}>
                  {link.hash ? (
                    <Link
                      to={localLink(`/#${link.hash}`)}
                      onClick={(e) => {
                        if (window.location.pathname === "/") {
                          e.preventDefault();
                          scrollTo(link.hash!);
                        }
                      }}
                      className="cursor-pointer text-[0.875rem] text-[#F5F5F0]/60 transition-colors hover:text-[#9F97FF]"
                    >
                      {tr(link.label)}
                    </Link>
                  ) : (
                    <Link
                      to={localLink(link.href!)}
                      className="text-[0.875rem] text-[#F5F5F0]/60 transition-colors hover:text-[#9F97FF]"
                    >
                      {tr(link.label)}
                    </Link>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Čo dostanete */}
          <div>
            <p className="mb-5 font-heading text-[0.85rem] uppercase tracking-widest text-[#F5F5F0]/60">{tr("Čo dostanete zadarmo")}</p>
            <div className="flex flex-col gap-3 text-[0.875rem] text-[#F5F5F0]/60">
              <span>{tr("Vizuálny návrh hlavnej stránky")}</span>
              <span>{tr("Štruktúra celého webu")}</span>
              <span>{tr("Základný koncept textov")}</span>
              <span>{tr("Odporúčania dizajnu")}</span>
              <span>{tr("Cenová ponuka realizácie")}</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 font-heading text-[0.85rem] uppercase tracking-widest text-[#F5F5F0]/60">{tr("Kontakt")}</p>
            <div className="flex flex-col gap-3 text-[0.875rem] text-[#F5F5F0]/60">
              <a
                href={localLink("mailto:info@siteleveled.com")}
                className="transition-colors hover:text-[#9F97FF]"
              >{tr("info@siteleveled.com")}</a>
              {locale !== "en" && <a href={localLink("tel:+421910803993")} className="transition-colors hover:text-[#9F97FF]">{tr("+421 910 803 993")}</a>}
              <div className="mt-2 flex items-center gap-4">
                <a
                  href={localLink("https://www.linkedin.com/in/m%C3%A1rio-doman-65b08663/")}
                  className="text-[#F5F5F0]/60 transition-colors hover:text-[#9F97FF]"
                  aria-label={tr("LinkedIn")}
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href={localLink("https://www.facebook.com/mario.doman")}
                  className="text-[#F5F5F0]/60 transition-colors hover:text-[#9F97FF]"
                  aria-label={tr("Facebook")}
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-[0.8rem] text-[#F5F5F0]/50" suppressHydrationWarning>{"© "}{tr(new Date().getFullYear())}{tr(" siteleveled.com – DOMAN s.r.o.")}</p>
          <Link
            to={localLink("/ochrana-osobnych-udajov/")}
            className="text-[0.8rem] text-[#F5F5F0]/50 transition-colors hover:text-[#9F97FF]"
          >{tr("Ochrana osobných údajov")}</Link>
        </div>
      </div>

      <HorizonWordmark />
    </footer>
  );
}
