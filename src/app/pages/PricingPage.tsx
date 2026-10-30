import { Link } from "react-router";
import { ArrowRight, Check, Zap } from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { AnimatedCounter } from "../components/fx/AnimatedCounter";
import { Aurora } from "../components/fx/Aurora";
import { FaqAccordion } from "../components/fx/FaqAccordion";
import { GlowCard } from "../components/fx/GlowCard";
import { MagneticButton } from "../components/fx/MagneticButton";
import { PageHero } from "../components/fx/PageHero";
import { SectionHeading } from "../components/fx/SectionHeading";

const skFormat = (n: number) => n.toLocaleString("sk-SK");

const plans = [
  {
    name: "WEB",
    subtitle: "Jednoduchý web",
    audience: "Pre: Živnostníkov, freelancerov, malé firmy",
    price: 300,
    from: true,
    delivery: "Hotový do 7 dní",
    badge: "Najrýchlejší štart",
    link: null,
    features: [
      "Prezentačný web na mieru",
      "Responzívny dizajn pre mobil aj počítač",
      "Základné SEO nastavenie",
      "Kontaktný formulár",
      "Platíš až po spustení, bez zálohy",
    ],
    cta: "Mám záujem",
  },
  {
    name: "E-SHOP",
    subtitle: "Internetový obchod",
    audience: "Pre: Firmy, ktoré chcú predávať online",
    price: 1000,
    from: true,
    delivery: "Hotový do 14 dní",
    badge: null,
    link: null,
    features: [
      "E-shop na mieru",
      "Katalóg produktov a košík",
      "Správa produktov a objednávok",
      "Responzívny dizajn pre mobil aj počítač",
      "Platíš až po spustení, bez zálohy",
    ],
    cta: "Mám záujem",
  },
  {
    name: "SEO AUDIT",
    subtitle: "Kontrola webu",
    audience: "Pre: Weby, ktoré Google nevidí tak, ako by mal",
    price: 199,
    from: false,
    delivery: "Jednorazová cena",
    badge: null,
    features: [
      "Analýza webu z pohľadu SEO",
      "Konkrétne odporúčania na zlepšenie",
    ],
    link: { to: "/seo-audit", label: "Najprv si spusti automatickú kontrolu zadarmo" },
    cta: "Mám záujem",
  },
];

const faqs = [
  {
    q: "Ako dlho trvá vytvorenie webu?",
    a: "Jednoduchý web je hotový do 7 dní, e-shop do 14 dní od schválenia návrhu. Samotný návrh dostaneš do 24 hodín.",
  },
  {
    q: "Aké sú platobné podmienky?",
    a: "Žiadnu zálohu neplatíš. Za web platíš až po jeho spustení.",
  },
  {
    q: "Môžem si obsah spravovať sám?",
    a: "Áno. Ak chceš texty, obrázky alebo produkty upravovať sám, pripravíme web so správou obsahu bez kódovania. Dohodneme sa na tom pri návrhu.",
  },
  {
    q: "Čo ak nie som spokojný s dizajnom?",
    a: "Dizajn vždy schvaľuješ ešte pred programovaním, takže prekvapenia nehrozia. A keďže platíš až po spustení, neriskuješ nič.",
  },
  {
    q: "Potrebujem aj hosting a doménu?",
    a: "Doménu si registruješ na svoje meno. S hostingom radi pomôžeme — odporúčame rýchle a spoľahlivé riešenia.",
  },
];

function PlanContent({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <p className="mb-1 text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">{plan.name}</p>
        <h3 className="mb-2 font-heading text-[1.2rem] font-bold text-[#F5F5F0]">
          {plan.subtitle}
        </h3>
        <p className="text-[0.8rem] text-[#F5F5F0]/40">{plan.audience}</p>
      </div>

      <div className="mb-6">
        {plan.from && <span className="text-[0.85rem] text-[#F5F5F0]/40">od </span>}
        <span className="font-heading text-[2.6rem] font-bold text-[#F5F5F0]">
          <AnimatedCounter end={plan.price} format={skFormat} duration={1.1} />
        </span>{" "}
        <span className="text-[0.85rem] text-[#F5F5F0]/40">&euro;</span>
        <p className="mt-1 text-[0.8rem] font-semibold text-[#1AFF8C]">{plan.delivery}</p>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((f, j) => (
          <li key={j} className="flex items-start gap-3 text-[0.85rem] text-[#F5F5F0]/60">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1AFF8C]/12">
              <Check size={12} className="text-[#1AFF8C]" />
            </span>
            {f}
          </li>
        ))}
      </ul>

      {plan.link && (
        <Link to={plan.link.to} className="-mt-4 mb-8 text-[0.85rem] text-[#9F97FF] hover:underline">
          {plan.link.label} →
        </Link>
      )}

      <Link
        to="/kontakt"
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[0.9rem] font-semibold transition-all duration-200 ${
          plan.badge
            ? "bg-[#6C63FF] text-white hover:bg-[#7B73FF] hover:shadow-[0_0_30px_rgba(108,99,255,0.4)]"
            : "border border-white/10 text-[#F5F5F0]/80 hover:border-[#6C63FF]/40 hover:text-white"
        }`}
      >
        {plan.cta} <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Cenník"
        segments={[
          { text: "Investícia," },
          { text: "nie náklad.", className: "text-gradient-primary" },
        ]}
        sub="Web od 300 € za 7 dní, e-shop od 1 000 € za 14 dní. Žiadna záloha – platíš až po spustení. Každý web je na mieru, presnú cenu dostaneš spolu s návrhom."
      />

      {/* Pricing cards */}
      <section className="pb-24 pt-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:gap-8">
            {plans.map((plan, i) => (
              <AnimateIn key={plan.name} delay={i * 0.1} className="h-full">
                {plan.badge ? (
                  <div className="conic-border relative h-full rounded-card p-8 lg:scale-[1.02]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#6C63FF] px-4 py-1 text-[0.75rem] text-white shadow-[0_4px_16px_rgba(108,99,255,0.4)]">
                        <Zap size={12} className="fill-white" /> {plan.badge}
                      </span>
                    </div>
                    <PlanContent plan={plan} />
                  </div>
                ) : (
                  <GlowCard className="h-full p-8">
                    <PlanContent plan={plan} />
                  </GlowCard>
                )}
              </AnimateIn>
            ))}
          </div>

          {/* Add-on */}
          <AnimateIn delay={0.3} className="mt-8">
            <GlowCard className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div>
                <h4 className="mb-1 font-heading text-[1rem] font-bold text-[#F5F5F0]">
                  Mesačná správa webu
                </h4>
                <p className="text-[0.85rem] text-[#F5F5F0]/40">
                  Aktualizácie, zálohy, monitoring, podpora
                </p>
              </div>
              <div className="text-right">
                <span className="text-[0.8rem] text-[#F5F5F0]/40">od</span>{" "}
                <span className="font-heading text-[1.5rem] font-bold text-[#9F97FF]">
                  <AnimatedCounter end={30} duration={0.9} />
                </span>{" "}
                <span className="text-[0.8rem] text-[#F5F5F0]/40">&euro;/mesiac</span>
              </div>
            </GlowCard>
          </AnimateIn>
        </div>
      </section>

      {/* Not sure block */}
      <section className="relative overflow-hidden bg-bg-deep py-20">
        <Aurora variant="cta" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <AnimateIn>
            <p className="mb-2 text-[1.1rem] text-[#F5F5F0]/70">Nie si si istý, čo potrebuješ?</p>
            <p className="mb-8 text-[0.95rem] text-[#F5F5F0]/40">
              Dohodnutá bezplatná 30-minútová konzultácia ti objasní všetko.
            </p>
            <MagneticButton to="/kontakt" size="lg">
              Rezervovať konzultáciu
            </MagneticButton>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="FAQ"
            segments={[{ text: "Časté" }, { text: "otázky.", className: "text-gradient-primary" }]}
            className="mb-12"
          />
          <AnimateIn>
            <FaqAccordion items={faqs} />
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
