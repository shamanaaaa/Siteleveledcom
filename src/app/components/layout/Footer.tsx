import { Link } from "react-router";
import { Linkedin, Instagram, Github } from "lucide-react";

const navLinks = [
  { label: "Domov", href: "/" },
  { label: "O nás", href: "/o-nas" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Cenník", href: "/cennik" },
  { label: "Blog", href: "/blog" },
  { label: "Kontakt", href: "/kontakt" },
];

const serviceLinks = [
  { label: "Webdizajn", href: "/sluzby" },
  { label: "SEO", href: "/sluzby" },
  { label: "Správa webu", href: "/sluzby" },
  { label: "Copywriting", href: "/sluzby" },
  { label: "Konzultácia", href: "/sluzby" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5">
      {/* Pre-footer CTA */}
      <div className="bg-gradient-to-r from-[#6C63FF]/10 via-[#6C63FF]/5 to-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <h3 className="font-heading text-[1.5rem] md:text-[1.75rem] text-[#F5F5F0] text-center md:text-left">
            Pripravený posunúť svoj biznis na ďalšiu úroveň?
          </h3>
          <Link
            to="/kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-lg transition-all duration-200 hover:shadow-[0_0_30px_rgba(108,99,255,0.3)] whitespace-nowrap"
          >
            Začnime spoluprácu →
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
              Digitálne štúdio pre rast biznisu.
            </p>
            <p className="text-[#F5F5F0]/40 text-[0.8rem]">
              doman s.r.o.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-[0.85rem] text-[#F5F5F0]/40 uppercase tracking-widest mb-5">
              Navigácia
            </h4>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  to={link.href}
                  className="text-[0.875rem] text-[#F5F5F0]/60 hover:text-[#6C63FF] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-[0.85rem] text-[#F5F5F0]/40 uppercase tracking-widest mb-5">
              Služby
            </h4>
            <div className="flex flex-col gap-3">
              {serviceLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.href}
                  className="text-[0.875rem] text-[#F5F5F0]/60 hover:text-[#6C63FF] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
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
              <span>+421 XXX XXX XXX</span>
              <div className="flex items-center gap-4 mt-2">
                <a
                  href="#"
                  className="text-[#F5F5F0]/40 hover:text-[#6C63FF] transition-colors"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="#"
                  className="text-[#F5F5F0]/40 hover:text-[#6C63FF] transition-colors"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="text-[#F5F5F0]/40 hover:text-[#6C63FF] transition-colors"
                >
                  <Github size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.8rem] text-[#F5F5F0]/30">
            &copy; 2025 doman s.r.o. | Všetky práva vyhradené
          </p>
          <div className="flex items-center gap-6 text-[0.8rem] text-[#F5F5F0]/30">
            <a href="#" className="hover:text-[#F5F5F0]/60 transition-colors">
              Ochrana osobných údajov
            </a>
            <a href="#" className="hover:text-[#F5F5F0]/60 transition-colors">
              Obchodné podmienky
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
