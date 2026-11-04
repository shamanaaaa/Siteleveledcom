import { useI18n } from "../i18n/LocaleContext";
import { Link } from "react-router";
import {
  Code2,
  Search,
  PenTool,
  Shield,
  ClipboardCheck,
  ArrowRight,
  Check,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GlowCard } from "../components/fx/GlowCard";
import { PageHero } from "../components/fx/PageHero";

const services = [
  {
    icon: Code2,
    title: "Webdizajn & Vývoj",
    headline: "Weby na mieru. Bez kompromisov.",
    text: "Navrhujeme a programujeme weby a e-shopy, ktoré vyzerajú skvele na každom zariadení, načítajú sa rýchlo a konvertujú návštevníkov na zákazníkov. Žiadne drag-and-drop šablóny. Čistý kód. Vaša vízia.",
    includes: [
      "UI/UX dizajn (vizuálny návrh)",
      "Responzívny vývoj (mobile-first)",
      "CMS integrácia (správa obsahu bez kódovania)",
      "Testovanie naprieč prehliadačmi",
    ],
    price: "Web od 300 € do 7 dní · E-shop od 1 000 € do 14 dní",
    link: { to: "/tvorba-eshopu/", label: "Viac o tvorbe e-shopu" },
    cta: "Chcem web na mieru",
  },
  {
    icon: Search,
    title: "SEO Optimalizácia",
    headline: "Buďte tam, kde vás hľadajú.",
    text: "Ak vás Google nenájde, zákazník tiež nie. Optimalizujeme, aby ste boli viditeľní tam, kde na tom záleží.",
    includes: [
      "Technické SEO (rýchlosť, štruktúra, Core Web Vitals)",
      "On-page optimalizácia (texty, meta, schema)",
      "Lokálne SEO (Google Business, mapy)",
    ],
    cta: "Chcem byť na Googli",
  },
  {
    icon: PenTool,
    title: "Copywriting & Obsah",
    headline: "Slová, ktoré predávajú.",
    text: "Skvelý dizajn bez správnych slov nefunguje. Píšeme texty, ktoré hovoria jazykom vášho zákazníka — presvedčivé, jasné, bez marketingového balastu.",
    includes: [
      "Copywriting pre celý web",
      "Texty pre landing pages a kampane",
      "Obsah pre blog a sociálne siete",
      "Preklad SK/EN",
    ],
    cta: "Chcem texty, čo fungujú",
  },
  {
    icon: Shield,
    title: "Správa & Údržba Webu",
    headline: "Váš web v dobrých rukách.",
    text: "Web nie je jednorazový projekt. Je to živý nástroj, ktorý potrebuje starostlivosť. Aktualizácie, zálohy, bezpečnosť, výkon — riešime to za vás.",
    includes: [
      "Mesačná správa a aktualizácie",
      "Bezpečnostné zálohy",
      "Monitoring dostupnosti",
      "Prioritná podpora",
    ],
    cta: "Chcem spoľahlivú správu",
  },
  {
    icon: ClipboardCheck,
    title: "SEO Audit",
    headline: "Zistite, čo brzdí váš rast.",
    text: "Máte web, ale nefunguje? Audit odhalí, prečo. Dostanete konkrétny akčný plán — nie generický report. Len fakty a riešenia.",
    includes: [
      "Ručná kontrola indexovania, štruktúry a odkazov",
      "Titulky, nadpisy a texty podľa toho, čo ľudia hľadajú",
      "Písomná správa",
      "Zoznam opráv zoradený podľa dôležitosti",
    ],
    price: "SEO audit 199 €",
    cta: "Chcem audit môjho webu",
  },
];

const filters = [
  { label: "Všetky", value: "all" },
  { label: "Chcem nový web", value: "new" },
  { label: "Chcem zlepšiť web", value: "improve" },
  { label: "Chcem viac zákazníkov", value: "more" },
];

const filterMap: Record<string, number[]> = {
  all: [0, 1, 2, 3, 4],
  new: [0, 2],
  improve: [1, 3, 4],
  more: [1, 2],
};

export function ServicesPage() {
  const { t: tr, link: localLink } = useI18n();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredServices = filterMap[activeFilter].map((i) => services[i]);

  return (
    <>
      <PageHero
        title={tr("Tvorba webstránok, e-shopov a SEO")}
        segments={tr([
          { text: "Čo robíme." },
          { text: "A robíme to poriadne.", className: "text-gradient-primary" },
        ])}
        sub={tr("Od prvého nápadu po dlhodobú správu — všetko pod jednou strechou.")}
      />

      {/* Filters — segmented control with sliding active pill */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="inline-flex flex-wrap gap-1 rounded-2xl border border-white/8 bg-surface-1 p-1.5">
            {filters.map((f) => {
              const active = activeFilter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`relative rounded-xl px-5 py-2 text-[0.85rem] transition-colors duration-200 ${
                    active ? "text-white" : "text-[#F5F5F0]/50 hover:text-[#F5F5F0]/80"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="service-filter"
                      className="absolute inset-0 rounded-xl bg-[#665DFA] shadow-[0_4px_16px_rgba(108,99,255,0.35)]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{tr(f.label)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredServices.map((service) => (
                <motion.div
                  key={service.title}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GlowCard className="p-8 md:p-10">
                    <service.icon
                      aria-hidden
                      className="pointer-events-none absolute -bottom-8 -right-6 h-44 w-44 text-white/[0.025]"
                      strokeWidth={1}
                    />
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                      <div>
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6C63FF]/10">
                            <service.icon size={20} className="text-[#6C63FF]" />
                          </div>
                          <span className="text-[0.8rem] uppercase tracking-wider text-[#F5F5F0]/50">
                            {tr(service.title)}
                          </span>
                        </div>
                        <h2 className="mb-4 font-heading text-[1.35rem] font-bold text-[#F5F5F0] sm:text-[1.6rem]">
                          {tr(service.headline)}
                        </h2>
                        <p className="text-[0.9rem] leading-relaxed text-[#F5F5F0]/50">
                          {tr(service.text)}
                        </p>
                        {service.price && (
                          <p className="mt-5 inline-flex rounded-full bg-[#1AFF8C]/10 px-3 py-1 text-[0.8rem] text-[#1AFF8C]">
                            {tr(service.price)}
                          </p>
                        )}
                        {service.link && (
                          <Link
                            to={localLink(service.link.to)}
                            className="mt-4 block text-[0.85rem] text-[#9F97FF] transition-colors hover:text-[#F5F5F0]"
                          >
                            {tr(service.link.label)}{" →"}</Link>
                        )}
                      </div>
                      <div>
                        <p className="mb-4 text-[0.75rem] uppercase tracking-wider text-[#F5F5F0]/50">{tr("Zahŕňa")}</p>
                        <ul className="mb-8 space-y-3">
                          {service.includes.map((item, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-3 text-[0.875rem] text-[#F5F5F0]/60"
                            >
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1AFF8C]/12">
                                <Check size={12} className="text-[#1AFF8C]" />
                              </span>
                              {tr(item)}
                            </li>
                          ))}
                        </ul>
                        <Link
                          to={localLink("/kontakt/")}
                          className="group/link inline-flex items-center gap-2 text-[0.9rem] text-[#9F97FF] transition-colors hover:text-[#F5F5F0]"
                        >
                          {tr(service.cta)}
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover/link:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
