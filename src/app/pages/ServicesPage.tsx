import { Link } from "react-router";
import {
  Code2,
  Search,
  PenTool,
  Shield,
  Megaphone,
  ClipboardCheck,
  ArrowRight,
  Check,
} from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { useState } from "react";

const services = [
  {
    icon: Code2,
    title: "Webdizajn & Vývoj",
    headline: "Weby na mieru. Bez kompromisov.",
    text: "Navrhujeme a programujeme weby, ktoré vyzerajú skvele na každom zariadení, načítajú sa za sekundu a konvertujú návštevníkov na zákazníkov. Žiadne drag-and-drop šablóny. Čistý kód. Vaša vízia.",
    includes: [
      "UI/UX dizajn (Figma prototyp)",
      "Responzívny vývoj (mobile-first)",
      "CMS integrácia (správa obsahu bez kódovania)",
      "Testovanie naprieč prehliadačmi",
    ],
    cta: "Chcem web na mieru",
  },
  {
    icon: Search,
    title: "SEO Optimalizácia",
    headline: "Buď tam, kde ťa hľadajú.",
    text: "68 % zákazníkov začína hľadanie online. Ak ťa Google nenájde, zákazník tiež nie. Optimalizujeme, aby si bol viditeľný tam, kde na tom záleží.",
    includes: [
      "Technické SEO (rýchlosť, štruktúra, Core Web Vitals)",
      "On-page optimalizácia (texty, meta, schema)",
      "Lokálne SEO (Google Business, mapy)",
      "Mesačné reporty a sledovanie pozícií",
    ],
    cta: "Chcem byť na Googli",
  },
  {
    icon: PenTool,
    title: "Copywriting & Obsah",
    headline: "Slová, ktoré predávajú.",
    text: "Skvelý dizajn bez správnych slov nefunguje. Píšeme texty, ktoré hovoria jazykom tvojho zákazníka — presvedčivé, jasné, bez marketingového balastu.",
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
    headline: "Tvoj web v dobrých rukách.",
    text: "Web nie je jednorazový projekt. Je to živý nástroj, ktorý potrebuje starostlivosť. Aktualizácie, zálohy, bezpečnosť, výkon — riešime to za teba.",
    includes: [
      "Mesačná správa a aktualizácie",
      "Bezpečnostné zálohy",
      "Monitoring dostupnosti",
      "Prioritná podpora",
    ],
    cta: "Chcem spoľahlivú správu",
  },
  {
    icon: Megaphone,
    title: "Výkonnostný Marketing",
    headline: "Web je základ. Marketing je motor.",
    text: "Spájame web s kampaňami, ktoré privádzajú reálnych zákazníkov. Meta Ads, Google Ads, e-mail automácie — merateľné výsledky, nie sľuby.",
    includes: [
      "Nastavenie a správa Meta / Google Ads",
      "Landing page pre kampane",
      "E-mail marketing a automatizácia",
      "A/B testovanie",
    ],
    cta: "Chcem viac zákazníkov",
  },
  {
    icon: ClipboardCheck,
    title: "Konzultácia & Audit",
    headline: "Zisti, čo ti brzdí rast.",
    text: "Máš web, ale nefunguje? Audit odhalí, prečo. Dostaneš konkrétny akčný plán — nie generický report. Len fakty a riešenia.",
    includes: [
      "UX audit (kde strácaš zákazníkov)",
      "Technický audit (rýchlosť, bezpečnosť, SEO)",
      "Konkurenčná analýza",
      "Písomný akčný plán",
    ],
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
  all: [0, 1, 2, 3, 4, 5],
  new: [0, 2],
  improve: [1, 3, 5],
  more: [1, 4],
};

export function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredServices = filterMap[activeFilter].map((i) => services[i]);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#6C63FF]/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <AnimateIn className="max-w-3xl">
            <p className="text-[0.85rem] text-[#6C63FF] mb-4 tracking-wide uppercase">
              Služby
            </p>
            <h1 className="font-heading text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] leading-[1.1] mb-6">
              Čo robíme.{" "}
              <span className="text-[#6C63FF]">A robíme to poriadne.</span>
            </h1>
            <p className="text-[1.05rem] text-[#F5F5F0]/50 leading-relaxed">
              Od prvého nápadu po dlhodobú správu — všetko pod jednou strechou.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-5 py-2 rounded-full text-[0.85rem] transition-all duration-200 border ${
                  activeFilter === f.value
                    ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                    : "border-white/10 text-[#F5F5F0]/50 hover:border-white/20 hover:text-[#F5F5F0]/80"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-sell banner */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-4 rounded-xl border border-[#1AFF8C]/20 bg-[#1AFF8C]/5 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#1AFF8C] shrink-0" />
            <p className="text-[0.85rem] text-[#F5F5F0]/70">
              <span className="text-[#1AFF8C]">Najobľúbenejší balík:</span> Web
              + SEO + Správa — kompletné riešenie pre tvoj biznis.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-8">
            {filteredServices.map((service, i) => (
              <AnimateIn key={service.title} delay={i * 0.08}>
                <div className="group p-8 md:p-10 rounded-2xl border border-white/5 bg-[#111118] hover:border-[#6C63FF]/15 transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
                          <service.icon
                            size={20}
                            className="text-[#6C63FF]"
                          />
                        </div>
                        <span className="text-[0.8rem] text-[#F5F5F0]/30 uppercase tracking-wider">
                          {service.title}
                        </span>
                      </div>
                      <h3 className="font-heading text-[1.35rem] sm:text-[1.5rem] text-[#F5F5F0] mb-4">
                        {service.headline}
                      </h3>
                      <p className="text-[0.9rem] text-[#F5F5F0]/50 leading-relaxed">
                        {service.text}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.75rem] text-[#F5F5F0]/30 uppercase tracking-wider mb-4">
                        Zahŕňa
                      </p>
                      <ul className="space-y-3 mb-8">
                        {service.includes.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-3 text-[0.875rem] text-[#F5F5F0]/60"
                          >
                            <Check
                              size={16}
                              className="text-[#1AFF8C] shrink-0 mt-0.5"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/kontakt"
                        className="inline-flex items-center gap-2 text-[#6C63FF] hover:text-[#9F97FF] transition-colors text-[0.9rem]"
                      >
                        {service.cta} <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
