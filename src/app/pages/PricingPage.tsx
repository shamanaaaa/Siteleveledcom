import { Link } from "react-router";
import { ArrowRight, Check, Star, ChevronDown } from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { useState } from "react";

const plans = [
  {
    name: "STARTER",
    subtitle: "Prvý krok",
    audience: "Pre: Freelancerov, fotografov, remeselníkov",
    price: "890",
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
    price: "1 990",
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
    price: "3 500",
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

export function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-[#6C63FF]/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <AnimateIn className="max-w-3xl mx-auto text-center">
            <p className="text-[0.85rem] text-[#6C63FF] mb-4 tracking-wide uppercase">
              Cenník
            </p>
            <h1 className="font-heading text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] leading-[1.1] mb-6">
              Investícia, nie náklad.
            </h1>
            <p className="text-[1.05rem] text-[#F5F5F0]/50 leading-relaxed">
              Transparentné ceny. Žiadne prekvapenia. Každý web je na mieru —
              preto ponúkame orientačné balíky aj individuálne ponuky.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div
                  className={`relative p-8 rounded-2xl border h-full flex flex-col ${
                    plan.popular
                      ? "border-[#6C63FF]/30 bg-gradient-to-b from-[#6C63FF]/5 to-[#111118] shadow-[0_0_50px_rgba(108,99,255,0.08)]"
                      : "border-white/5 bg-[#111118]"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-[#6C63FF] text-white text-[0.75rem]">
                        <Star size={12} className="fill-white" />{" "}
                        Najobľúbenejší
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="text-[0.75rem] text-[#6C63FF] uppercase tracking-wider mb-1">
                      {plan.name}
                    </p>
                    <h3 className="font-heading text-[1.2rem] text-[#F5F5F0] mb-2">
                      {plan.subtitle}
                    </h3>
                    <p className="text-[0.8rem] text-[#F5F5F0]/40">
                      {plan.audience}
                    </p>
                  </div>

                  <div className="mb-6">
                    <span className="text-[0.85rem] text-[#F5F5F0]/40">od</span>{" "}
                    <span className="font-heading text-[2.5rem] text-[#F5F5F0]">
                      {plan.price}
                    </span>{" "}
                    <span className="text-[#F5F5F0]/40 text-[0.85rem]">
                      &euro;
                    </span>
                    <p className="text-[0.75rem] text-[#F5F5F0]/30 mt-1">
                      {plan.priceNote}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-[0.85rem] text-[#F5F5F0]/60"
                      >
                        <Check
                          size={16}
                          className="text-[#1AFF8C] shrink-0 mt-0.5"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/kontakt"
                    className={`inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[0.9rem] transition-all duration-200 ${
                      plan.popular
                        ? "bg-[#6C63FF] hover:bg-[#5b53e8] text-white hover:shadow-[0_0_30px_rgba(108,99,255,0.3)]"
                        : "border border-white/10 hover:border-[#6C63FF]/30 text-[#F5F5F0]/80 hover:text-white"
                    }`}
                  >
                    {plan.cta} <ArrowRight size={15} />
                  </Link>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Add-on */}
          <AnimateIn delay={0.3} className="mt-8">
            <div className="p-6 rounded-xl border border-white/5 bg-[#111118] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-heading text-[1rem] text-[#F5F5F0] mb-1">
                  Mesačná správa webu
                </h4>
                <p className="text-[0.85rem] text-[#F5F5F0]/40">
                  Aktualizácie, zálohy, monitoring, podpora
                </p>
              </div>
              <div className="text-right">
                <span className="text-[0.8rem] text-[#F5F5F0]/40">od</span>{" "}
                <span className="font-heading text-[1.5rem] text-[#6C63FF]">
                  79
                </span>{" "}
                <span className="text-[#F5F5F0]/40 text-[0.8rem]">
                  &euro;/mesiac
                </span>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Not sure block */}
      <section className="py-20 bg-[#0d0d14]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <p className="text-[1.1rem] text-[#F5F5F0]/70 mb-2">
              Nie si si istý, čo potrebuješ?
            </p>
            <p className="text-[0.95rem] text-[#F5F5F0]/40 mb-8">
              Dohodnutá bezplatná 30-minútová konzultácia ti objasní všetko.
            </p>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-xl transition-all duration-200 hover:shadow-[0_0_40px_rgba(108,99,255,0.3)]"
            >
              Rezervovať konzultáciu <ArrowRight size={16} />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn className="text-center mb-12">
            <h2 className="font-heading text-[1.75rem] sm:text-[2rem] leading-tight">
              Časté otázky
            </h2>
          </AnimateIn>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AnimateIn key={i} delay={i * 0.05}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 rounded-xl border border-white/5 bg-[#111118] hover:border-white/10 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[0.9rem] text-[#F5F5F0]/80">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#F5F5F0]/30 shrink-0 transition-transform duration-200 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {openFaq === i && (
                    <p className="mt-4 text-[0.85rem] text-[#F5F5F0]/50 leading-relaxed pr-8">
                      {faq.a}
                    </p>
                  )}
                </button>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
