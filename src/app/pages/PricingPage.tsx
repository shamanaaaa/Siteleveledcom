import { Link } from "react-router";
import { ArrowRight, Check, Star } from "lucide-react";
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
    name: "STARTER",
    subtitle: "Prvý krok",
    audience: "Pre: Freelancerov, fotografov, remeselníkov",
    price: 890,
    priceNote: "jednorazovo",
    popular: false,
    features: [
      "Jednoduchý prezentačný web (do 5 podstránok)",
      "Responzívny dizajn",
      "Základné SEO nastavenie",
      "Kontaktný formulár",
      "1 kolo revízií",
    ],
    cta: "Mám záujem",
  },
  {
    name: "BUSINESS",
    subtitle: "Profesionálna prítomnosť",
    audience: "Pre: Malé firmy, lokálne prevádzky, startupy",
    price: 1990,
    priceNote: "jednorazovo",
    popular: true,
    features: [
      "Web na mieru (5–15 podstránok)",
      "Pokročilý UX/UI dizajn (Figma prototyp)",
      "CMS — správa obsahu bez kódovania",
      "SEO optimalizácia (technická + on-page)",
      "Copywriting pre kľúčové stránky",
      "3 kolá revízií",
      "3 mesiace podpory po spustení",
    ],
    cta: "Mám záujem",
  },
  {
    name: "PREMIUM",
    subtitle: "Plná digitálna transformácia",
    audience: "Pre: Ambiciózne firmy, e-commerce, dlhodobá spolupráca",
    price: 3500,
    priceNote: "individuálna cena",
    popular: false,
    features: [
      "Všetko z BUSINESS",
      "Kompletný copywriting",
      "Pokročilé SEO + obsahová stratégia",
      "Marketing integrácia (Meta / Google Ads setup)",
      "6 mesiacov mesačnej správy v cene",
    ],
    cta: "Nezáväzná ponuka",
  },
];

const faqs = [
  {
    q: "Ako dlho trvá vytvorenie webu?",
    a: "Priemerný projekt trvá 3–6 týždňov v závislosti od rozsahu. Jednoduchý prezentačný web môže byť hotový za 2 týždne.",
  },
  {
    q: "Aké sú platobné podmienky?",
    a: "50% záloha pred začiatkom práce, 50% po spustení webu. Pri väčších projektoch je možnosť rozložiť platbu na splátky.",
  },
  {
    q: "Môžem si obsah spravovať sám?",
    a: "Áno! Balíky BUSINESS a PREMIUM zahŕňajú CMS systém, cez ktorý si jednoducho upravíš texty, obrázky a obsah bez kódovania.",
  },
  {
    q: "Čo ak nie som spokojný s dizajnom?",
    a: "Každý balík obsahuje kolá revízií. Navyše, pred kódovaním vždy schvaľuješ dizajn vo Figme, takže prekvapenia nehrozia.",
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
        <span className="text-[0.85rem] text-[#F5F5F0]/40">od</span>{" "}
        <span className="font-heading text-[2.6rem] font-bold text-[#F5F5F0]">
          <AnimatedCounter end={plan.price} format={skFormat} duration={1.1} />
        </span>{" "}
        <span className="text-[0.85rem] text-[#F5F5F0]/40">&euro;</span>
        <p className="mt-1 text-[0.75rem] text-[#F5F5F0]/30">{plan.priceNote}</p>
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

      <Link
        to="/kontakt"
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[0.9rem] font-semibold transition-all duration-200 ${
          plan.popular
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
        sub="Transparentné ceny. Žiadne prekvapenia. Každý web je na mieru — preto ponúkame orientačné balíky aj individuálne ponuky."
      />

      {/* Pricing cards */}
      <section className="pb-24 pt-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:gap-8">
            {plans.map((plan, i) => (
              <AnimateIn key={plan.name} delay={i * 0.1} className="h-full">
                {plan.popular ? (
                  <div className="conic-border relative h-full rounded-card p-8 lg:scale-[1.02]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#6C63FF] px-4 py-1 text-[0.75rem] text-white shadow-[0_4px_16px_rgba(108,99,255,0.4)]">
                        <Star size={12} className="fill-white" /> Najobľúbenejší
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
                  <AnimatedCounter end={79} duration={0.9} />
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
