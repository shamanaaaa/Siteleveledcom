import { ArrowRight, ExternalLink } from "lucide-react";
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
    review: {
      text: "Mário je kreatívny, trpezlivý a hlavne veľmi šikovný.",
      author: "Zuzana Kondeková",
    },
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
    image: "/nosekrst-preview.webp",
    url: "https://www.nosekrst.sk",
  },
  {
    id: "fotkynavyber",
    title: "fotkynavyber.sk",
    category: "SaaS pre fotografov",
    tags: ["Fotografi", "Aplikácie"],
    type: "Webová aplikácia",
    challenge:
      "Fotografi strácali čas dohadovaním, koľko fotiek si klient nakoniec vyberie a doobjedná. Chýbal systém, ktorý celý proces výberu a platieb zautomatizuje.",
    solution:
      "Webová aplikácia s online galériami, výberom fotiek, transparentnými cenami, automatickými e-mailovými notifikáciami a exportom do CSV — fotograf všetko spravuje z jedného dashboardu.",
    image: "/fotkynavyber-preview.webp",
    url: "https://www.fotkynavyber.sk",
  },
  {
    id: "sanifix",
    title: "sanifix.sk",
    category: "Autorizovaný servis kúpeľňového vybavenia",
    tags: ["E-shopy", "Aplikácie"],
    type: "E-shop + servisný systém",
    challenge:
      "Spojiť predaj kúpeľňového vybavenia a objednávanie servisu autorizovaného servisného centra do jedného webu.",
    solution:
      "E-shop s produktmi, variantmi a akciami jednotlivých značiek, online nahlásenie servisu s výberom produktu a poruchy a administrácia servisných zákaziek.",
    image: "/sanifix-preview.webp",
    url: "https://sanifix.sk",
  },
  {
    id: "zeriavynitra",
    title: "zeriavynitra.sk",
    category: "Žeriavnícke práce a prenájom autožeriavov",
    tags: ["B2B"],
    type: "Firemný web",
    challenge:
      "Získavať dopyty na žeriavnícke práce a prenájom autožeriavov v Nitre a okolí – od stavebných firiem aj súkromných osôb.",
    solution:
      "Prehľad služieb a autožeriavov Demag AC 40 a AC 55 City, technický nákres žeriavu, spolupráca v piatich krokoch, časté otázky a formulár na nezáväzný dopyt. Telefón je vždy po ruke.",
    image: "/zeriavynitra-preview.webp",
    url: "https://www.zeriavynitra.sk",
  },
  {
    id: "jogaslaskou",
    title: "jogaslaskou.sk",
    category: "Jogové štúdio v Pezinku",
    tags: ["Služby"],
    type: "Prezentačný web",
    challenge:
      "Predstaviť jogové štúdio a jeho ponuku – skupinové a súkromné lekcie, eventy a pobyty – tak, aby sa nový návštevník rýchlo zorientoval a vybral si, ako začať.",
    solution:
      "Ponuka rozdelená do troch jasných krokov, popis priebehu lekcie, predstavenie lektorky, galéria z lekcií a pobytov, referencie a časté otázky.",
    review: {
      text: "Resuscitovali sme moju staršiu webku, všetko išlo hladko, skvelá komunikácia a rýchle reakcie na požiadavky.",
      author: "Zuzana Khala",
    },
    image: "/jogaslaskou-preview.webp",
    url: "https://www.jogaslaskou.sk",
  },
  {
    id: "springnitra",
    title: "springnitra.sk",
    category: "Estetické štúdio v Nitre",
    tags: ["Služby"],
    type: "Prezentačný web",
    challenge:
      "Predstaviť estetické štúdio, jeho ošetrenia a prémiovú dermokozmetiku tak, aby si klientka rýchlo rezervovala termín.",
    solution:
      "Elegantný dizajn v teplých tónoch, predstavenie zakladateľky, prehľad služieb a značiek, samostatná stránka o Fusion Plasma, galéria, recenzie klientiek a napojenie na online rezerváciu termínov.",
    review: {
      text: "Určite odporúčam každému, kto hľadá niekoho šikovného a spoľahlivého 👌",
      author: "Jaja Bieliková",
    },
    image: "/springnitra-preview.webp",
    url: "https://www.springnitra.sk",
  },
];

const filterOptions = ["Všetky", "Fotografi", "Služby", "B2B", "E-shopy", "Aplikácie"];

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
                          {project.review && (
                            <figure>
                              <p className="mb-1 text-[0.75rem] uppercase tracking-wider text-[#1AFF8C]">
                                Referencia
                              </p>
                              <blockquote className="text-[0.85rem] italic leading-relaxed text-[#F5F5F0]/60">
                                &ldquo;{project.review.text}&rdquo;
                              </blockquote>
                              <figcaption className="mt-1 text-[0.75rem] text-[#F5F5F0]/40">
                                — {project.review.author}, odporúčanie na Facebooku
                              </figcaption>
                            </figure>
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
            <blockquote className="mb-6 font-heading text-[1.25rem] italic leading-relaxed text-[#F5F5F0]/80 sm:text-[1.5rem]">
              &ldquo;Pán mi robil prerábku mojej webovej stránky a všetko prebehlo super. Výborná
              komunikácia, ochota a profesionálny prístup. Vždy vedel poradiť a výsledok dopadol ešte
              lepšie, ako som čakala.&rdquo;
            </blockquote>
            <p className="text-[0.875rem] text-[#F5F5F0]/40">
              — Jaja Bieliková, springnitra.sk · odporúčanie na Facebooku
            </p>
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
