import { useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { GlowCard } from "../components/fx/GlowCard";
import { PageHero } from "../components/fx/PageHero";
import { applyHead } from "../seo/head";
import { NOT_FOUND } from "../seo/pages";

const destinations = [
  { to: "/", label: "Úvod", text: "Návrh vášho webu zadarmo do 24 hodín" },
  { to: "/sluzby/", label: "Služby", text: "Tvorba webu, e-shopu, SEO a správa" },
  { to: "/cennik/", label: "Cenník", text: "Web od 300 €, e-shop od 1 000 €" },
  { to: "/portfolio/", label: "Portfólio", text: "Weby, ktoré sme vytvorili" },
  { to: "/kontakt/", label: "Kontakt", text: "info@siteleveled.com · 0910 803 993" },
];

export function NotFoundPage() {
  // nginx serves 404.html (static noindex) for unknown paths; this covers in-app navigation to one
  useEffect(() => applyHead(NOT_FOUND), []);

  return (
    <>
      <PageHero
        title="Stránka sa nenašla (404)"
        segments={[{ text: "Táto stránka" }, { text: "neexistuje.", className: "text-gradient-primary" }]}
        sub="Odkaz je neplatný alebo stránka zmizla. Pokračujte niektorou z týchto ciest:"
      />
      <section className="pb-32 pt-4">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <AnimateIn key={d.to} delay={i * 0.06} className="h-full">
              <Link to={d.to} className="group block h-full">
                <GlowCard className="h-full p-6">
                  <p className="mb-1 flex items-center gap-2 font-heading text-[1.1rem] font-bold text-[#F5F5F0]">
                    {d.label}
                    <ArrowRight size={16} className="text-[#9F97FF] transition-transform group-hover:translate-x-1" />
                  </p>
                  <p className="text-[0.85rem] text-[#F5F5F0]/60">{d.text}</p>
                </GlowCard>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </section>
    </>
  );
}
