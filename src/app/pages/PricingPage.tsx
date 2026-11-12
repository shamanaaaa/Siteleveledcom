import { useI18n } from "../i18n/LocaleContext";
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
      "Do 5 podstránok",
      "Responzívny dizajn pre mobil aj počítač",
      "Základné SEO nastavenie",
      "Kontaktný formulár",
      "Platíte až po spustení, bez zálohy",
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
    link: { to: "/tvorba-eshopu/", label: "Viac o tvorbe e-shopu" },
    features: [
      "E-shop na mieru",
      "Katalóg produktov a košík",
      "Správa produktov a objednávok",
      "Responzívny dizajn pre mobil aj počítač",
      "Platíte až po spustení, bez zálohy",
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
      "Ručná kontrola indexovania, štruktúry a odkazov",
      "Titulky, nadpisy a texty podľa toho, čo ľudia hľadajú",
      "Písomná správa a zoznam opráv zoradený podľa dôležitosti",
    ],
    link: { to: "/seo-audit/", label: "Najprv si spustite automatickú kontrolu zadarmo" },
    cta: "Mám záujem",
  },
];

const faqs = [
  {
    q: "Ako dlho trvá vytvorenie webu?",
    a: "Jednoduchý web je hotový do 7 dní, e-shop do 14 dní od schválenia návrhu a dodania podkladov. Samotný návrh dostanete do 24 hodín.",
  },
  {
    q: "Aké sú platobné podmienky?",
    a: "Žiadnu zálohu neplatíte. Za web platíte až po jeho spustení.",
  },
  {
    q: "Je cena s DPH?",
    a: "DOMAN s.r.o. nie je platiteľom DPH, takže k cenám sa DPH nepripočítava.",
  },
  {
    q: "Kto pripraví texty?",
    a: "Texty pripravíme z vášho zadania a vy ich schválite. Fotky a logo dodáte vy.",
  },
  {
    q: "Koľko úprav je v cene?",
    a: "Úpravy do spustenia sú v cene, kým nemeníme dohodnutý rozsah.",
  },
  {
    q: "Môžem si obsah spravovať sám?",
    a: "Áno. Ak chcete texty, obrázky alebo produkty upravovať sami, pripravíme web so správou obsahu bez kódovania. Dohodneme sa na tom pri návrhu.",
  },
  {
    q: "Čo ak nie som spokojný s dizajnom?",
    a: "Dizajn vždy schvaľujete ešte pred programovaním, takže prekvapenia nehrozia. A keďže platíte až po spustení, neriskujete nič.",
  },
  {
    q: "Potrebujem aj hosting a doménu?",
    a: "Doménu si registrujete na svoje meno. S hostingom radi pomôžeme — odporúčame rýchle a spoľahlivé riešenia.",
  },
];

const priceFactors = [
  "Počet podstránok nad 5 a množstvo obsahu",
  "Funkcie navyše, napríklad online rezervácie alebo napojenie na iné systémy",
  "Pri e-shope aj počet produktov a variantov, spôsoby platby a dopravy",
];

const payments = [
  { what: "Návrh", when: "0 €. Dostanete ho zadarmo a k ničomu vás nezaväzuje." },
  { what: "Web alebo e-shop", when: "Platíte až po spustení. Žiadnu zálohu neplatíte." },
  { what: "Texty a úpravy", when: "Texty pripravíme z vášho zadania a vy ich schválite. Úpravy do spustenia sú v cene, kým nemeníme dohodnutý rozsah." },
  { what: "Správa webu", when: "Od 30 € mesačne, ak o ňu máte záujem. Zahŕňa aktualizácie, zálohy, monitoring a podporu." },
  { what: "DPH", when: "DOMAN s.r.o. nie je platiteľom DPH, takže k cenám sa DPH nepripočítava." },
];

function PlanContent({ plan }: { plan: (typeof plans)[number] }) {
  const { t: tr, link: localLink, locale: language } = useI18n();
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <p className="mb-1 text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">{tr(plan.name)}</p>
        <h2 className="mb-2 font-heading text-[1.2rem] font-bold text-[#F5F5F0]">
          {tr(plan.subtitle)}
        </h2>
        <p className="text-[0.8rem] text-[#F5F5F0]/50">{tr(plan.audience)}</p>
      </div>

      <div className="mb-6">
        {plan.from && <span className="text-[0.85rem] text-[#F5F5F0]/50">{tr("od ")}</span>}
        <span className="font-heading text-[2.6rem] font-bold text-[#F5F5F0]">
          {language === "en" && "€"}<AnimatedCounter end={plan.price} format={language === "en" ? (n) => n.toLocaleString("en-US") : skFormat} duration={1.1} />
        </span>
        {language !== "en" && <>{" "}<span className="text-[0.85rem] text-[#F5F5F0]/50">{"€"}</span></>}
        <p className="mt-1 text-[0.8rem] font-semibold text-[#1AFF8C]">{tr(plan.delivery)}</p>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((f, j) => (
          <li key={j} className="flex items-start gap-3 text-[0.85rem] text-[#F5F5F0]/60">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1AFF8C]/12">
              <Check size={12} className="text-[#1AFF8C]" />
            </span>
            {tr(f)}
          </li>
        ))}
      </ul>

      {plan.link && (
        <Link to={localLink(plan.link.to)} className="-mt-4 mb-8 text-[0.85rem] text-[#9F97FF] hover:underline">
          {tr(plan.link.label)}{" →"}</Link>
      )}

      <Link
        to={localLink("/kontakt/")}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[0.9rem] font-semibold transition-all duration-200 ${
          plan.badge
            ? "bg-[#665DFA] text-white hover:bg-[#5b53e8] hover:shadow-[0_0_30px_rgba(108,99,255,0.4)]"
            : "border border-white/10 text-[#F5F5F0]/80 hover:border-[#6C63FF]/40 hover:text-white"
        }`}
      >
        {tr(plan.cta)} <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export function PricingPage() {
  const { t: tr, link: localLink, locale: language } = useI18n();
  return (
    <>
      <PageHero
        title={tr("Cenník tvorby webstránok a e-shopov")}
        segments={tr([
          { text: "Investícia," },
          { text: "nie náklad.", className: "text-gradient-primary" },
        ])}
        sub={tr("Web od 300 € za 7 dní, e-shop od 1 000 € za 14 dní. Žiadna záloha – platíte až po spustení. Každý web je na mieru, presnú cenu dostanete spolu s návrhom.")}
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
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#665DFA] px-4 py-1 text-[0.75rem] text-white shadow-[0_4px_16px_rgba(108,99,255,0.4)]">
                        <Zap size={12} className="fill-white" /> {tr(plan.badge)}
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
                <h2 className="mb-1 font-heading text-[1rem] font-bold text-[#F5F5F0]">{tr("Mesačná správa webu")}</h2>
                <p className="text-[0.85rem] text-[#F5F5F0]/50">{tr("Aktualizácie, zálohy, monitoring, podpora")}</p>
              </div>
              <div className="text-right">
                <span className="text-[0.8rem] text-[#F5F5F0]/50">{tr("od")}</span>{" "}
                <span className="font-heading text-[1.5rem] font-bold text-[#9F97FF]">
                  {language === "en" && "€"}<AnimatedCounter end={30} duration={0.9} />
                </span>{" "}
                <span className="text-[0.8rem] text-[#F5F5F0]/50">{tr("€/mesiac")}</span>
              </div>
            </GlowCard>
          </AnimateIn>
        </div>
      </section>

      {/* What the price depends on */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow={tr("Cena")}
            segments={tr([{ text: "Koľko stojí" }, { text: "webstránka?", className: "text-gradient-primary" }])}
            className="mb-8"
          />
          <AnimateIn>
            <p className="mx-auto mb-12 max-w-3xl text-center text-[1rem] leading-relaxed text-[#F5F5F0]/60">{tr("Za 300 € dostanete web do 5 podstránok s kontaktným formulárom, zobrazením na mobile aj počítači a základným SEO nastavením. E-shop začína na 1 000 €. „Od“ znamená najnižšiu cenu: väčší rozsah naceníme v návrhu, ktorý dostanete zadarmo do 24 hodín. Web je hotový do 7 dní a e-shop do 14 dní od schválenia návrhu a dodania podkladov.")}</p>
          </AnimateIn>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AnimateIn className="h-full">
              <GlowCard className="h-full p-6 md:p-8">
                <h3 className="mb-5 font-heading text-[1.1rem] font-bold text-[#F5F5F0]">{tr("Čo ovplyvňuje cenu")}</h3>
                <ul className="space-y-3">
                  {priceFactors.map((factor) => (
                    <li key={factor} className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1AFF8C]/12">
                        <Check size={12} className="text-[#1AFF8C]" />
                      </span>
                      {tr(factor)}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </AnimateIn>
            <AnimateIn delay={0.1} className="h-full">
              <GlowCard className="h-full p-6 md:p-8">
                <h3 className="mb-5 font-heading text-[1.1rem] font-bold text-[#F5F5F0]">{tr("Čo a kedy platíte")}</h3>
                <dl className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.what}>
                      <dt className="mb-1 text-[0.9rem] font-semibold text-[#F5F5F0]/80">{tr(payment.what)}</dt>
                      <dd className="text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">{tr(payment.when)}</dd>
                    </div>
                  ))}
                </dl>
              </GlowCard>
            </AnimateIn>
          </div>
          {/* The article is Slovak only */}
          {language === "sk" && (
            <p className="mx-auto mt-10 max-w-3xl text-center text-[0.95rem] leading-relaxed text-[#F5F5F0]/70">
              Podrobne o tom, čo je v cene, čo ju zvyšuje a s čím počítať každý rok, píšeme v článku{" "}
              <Link to="/blog/kolko-stoji-webstranka/" className="text-[#9F97FF] underline underline-offset-2 hover:text-[#F5F5F0]">Koľko stojí webstránka a od čoho závisí cena</Link>.
            </p>
          )}
        </div>
      </section>

      {/* Not sure block */}
      <section className="relative overflow-hidden bg-bg-deep py-20">
        <Aurora variant="cta" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <AnimateIn>
            <p className="mb-2 text-[1.1rem] text-[#F5F5F0]/70">{tr("Nie ste si istí, čo potrebujete?")}</p>
            <p className="mb-8 text-[0.95rem] text-[#F5F5F0]/50">{tr("Zavolajte na")}{" "}
              <a href={localLink("tel:+421910803993")} className="text-[#9F97FF] underline underline-offset-2 hover:text-[#F5F5F0]">{tr("+421 910 803 993")}</a>{" "}{tr("alebo si nechajte pripraviť návrh zadarmo.")}</p>
            <MagneticButton to={localLink("/#formular")} size="lg">{tr("Chcem návrh zadarmo")}</MagneticButton>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow={tr("FAQ")}
            segments={tr([{ text: "Časté" }, { text: "otázky.", className: "text-gradient-primary" }])}
            className="mb-12"
          />
          <AnimateIn>
            <FaqAccordion items={tr(faqs)} />
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
