import { ArrowRight, ExternalLink, Star } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AnimateIn } from "../components/AnimateIn";
import { GlowCard } from "../components/fx/GlowCard";
import { KineticHeading } from "../components/fx/KineticHeading";
import { MagneticButton } from "../components/fx/MagneticButton";
import { PageHero } from "../components/fx/PageHero";

const projects = [
  {
    id: "mdfoto",
    title: "mdfoto.sk",
    category: "Fotografické štúdio",
    tags: ["Fotografi"],
    type: "Prezentačný + konverzný web",
    challenge:
      "Vytvoriť prémiový vizuálny zážitok, ktorý odzrkadľuje kvalitu fotografa a aktívne premieňa návštevníkov na rezervácie.",
    solution:
      "Dark-mode dizajn s elegantnou typografiou, optimalizovaná galéria s rýchlym načítaním, prominentné CTA pre rezervácie, lokálne SEO pre Nitru.",
    results: "Organická návštevnosť ↑ | Priame rezervácie cez web ↑",
    image: "/mdfoto-preview.webp",
    url: "https://www.mdfoto.sk",
  },
  {
    id: "zuzu",
    title: "zuzu-photo.sk",
    category: "Freelance fotografka",
    tags: ["Fotografi"],
    type: "Portfólio + kontakt",
    challenge:
      "Minimalistická, rýchla a osobná prezentácia — aby sa klientka sústredila na svoju prácu, nie na správu webu.",
    solution:
      "Čistý jednostránkový dizajn, optimalizovaná galéria, kontaktný formulár, napojenie na sociálne siete.",
    results: "",
    image: "/zuzu-photo-preview.webp",
    url: "https://www.zuzu-photo.sk",
  },
  {
    id: "nosekrst",
    title: "nosekrst.sk",
    category: "B2B logistika a ťažká technika",
    tags: ["B2B"],
    type: "Firemná prezentácia",
    challenge:
      "Profesionálna B2B prezentácia firmy, ktorá buduje dôveru u priemyselných klientov a uľahčuje prvý kontakt.",
    solution:
      "Štruktúrovaný obsah s dôrazom na služby a kontakt, technické SEO, schema markup pre lokálne vyhľadávanie.",
    results: "",
    image: "/nosekrst-preview.webp",
    url: "https://www.nosekrst.sk",
  },
];

const filterOptions = ["Všetky", "Fotografi", "B2B"];

export function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("Všetky");

  const filtered =
    activeFilter === "Všetky"
      ? projects
      : projects.filter((p) => p.tags.includes(activeFilter));

  return (
    <>
      <PageHero
        eyebrow="Portfólio"
        segments={[
          { text: "Výsledky hovoria" },
          { text: "za nás.", className: "text-gradient-primary" },
        ]}
        sub="Každý projekt je iný. Každý má jeden spoločný cieľ: rast tvojho biznisu."
      />

      {/* Filters */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="inline-flex flex-wrap gap-1 rounded-2xl border border-white/8 bg-surface-1 p-1.5">
            {filterOptions.map((f) => {
              const active = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`relative rounded-xl px-5 py-2 text-[0.85rem] transition-colors duration-200 ${
                    active ? "text-white" : "text-[#F5F5F0]/50 hover:text-[#F5F5F0]/80"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="portfolio-filter"
                      className="absolute inset-0 rounded-xl bg-[#6C63FF] shadow-[0_4px_16px_rgba(108,99,255,0.35)]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{f}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-10">
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GlowCard>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {/* Screenshot */}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block aspect-[16/10] overflow-hidden bg-bg-deep lg:aspect-auto lg:min-h-[20rem]"
                      >
                        <img
                          src={project.image}
                          alt={`Screenshot ${project.title}`}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover/glow:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                          <span className="rounded-full bg-white/10 px-3 py-1 text-[0.75rem] text-white/80 backdrop-blur-sm">
                            {project.type}
                          </span>
                        </div>
                      </a>

                      {/* Content */}
                      <div className="flex flex-col justify-center p-8 md:p-10">
                        <span className="mb-2 text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">
                          {project.category}
                        </span>
                        <h3 className="mb-4 font-heading text-[1.5rem] font-bold text-[#F5F5F0] sm:text-[1.75rem]">
                          {project.title}
                        </h3>

                        <div className="mb-6 space-y-4">
                          <div>
                            <p className="mb-1 text-[0.75rem] uppercase tracking-wider text-[#F5F5F0]/30">
                              Výzva
                            </p>
                            <p className="text-[0.85rem] leading-relaxed text-[#F5F5F0]/60">
                              {project.challenge}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-[0.75rem] uppercase tracking-wider text-[#F5F5F0]/30">
                              Riešenie
                            </p>
                            <p className="text-[0.85rem] leading-relaxed text-[#F5F5F0]/60">
                              {project.solution}
                            </p>
                          </div>
                          {project.results && (
                            <div>
                              <p className="mb-1 text-[0.75rem] uppercase tracking-wider text-[#1AFF8C]">
                                Výsledky
                              </p>
                              <p className="text-[0.85rem] text-[#F5F5F0]/60">{project.results}</p>
                            </div>
                          )}
                        </div>

                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link inline-flex items-center gap-2 text-[0.9rem] text-[#9F97FF] transition-colors hover:text-[#F5F5F0]"
                        >
                          Pozri projekt
                          <ExternalLink
                            size={15}
                            className="transition-transform duration-300 group-hover/link:translate-x-0.5"
                          />
                        </a>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-[#0d0d14] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <AnimateIn>
            <div className="mb-6 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-[#FFD93D] text-[#FFD93D]" />
              ))}
            </div>
            <blockquote className="mb-6 font-heading text-[1.25rem] italic leading-relaxed text-[#F5F5F0]/80 sm:text-[1.5rem]">
              &ldquo;Mária nás prekvapila rýchlosťou a profesionalitou. Web sme spustili za 3
              týždne a zákazníci si ho chvália.&rdquo;
            </blockquote>
            <p className="text-[0.875rem] text-[#F5F5F0]/40">— Klient, mdfoto.sk</p>
          </AnimateIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <KineticHeading
            as="h2"
            segments={[
              { text: "Chceš podobné" },
              { text: "výsledky?", className: "text-gradient-primary" },
            ]}
            className="mb-8 font-heading text-title font-bold"
          />
          <AnimateIn delay={0.2}>
            <MagneticButton to="/kontakt" size="lg">
              Dohodnúť konzultáciu
            </MagneticButton>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
