import { Link } from "react-router";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { FaqAccordion } from "../components/fx/FaqAccordion";
import { GlowCard } from "../components/fx/GlowCard";
import { MagneticButton } from "../components/fx/MagneticButton";
import { PageHero } from "../components/fx/PageHero";
import { SectionHeading } from "../components/fx/SectionHeading";
import { LeadFormSection } from "../components/sections/LeadFormSection";
import { IMAGE_SIZES, imageSrcSet } from "../lib/images";

const includes = [
  {
    title: "E-shop na mieru",
    text: "Dizajn a štruktúru navrhneme podľa toho, čo a ako predávate. Žiadne šablóny.",
  },
  {
    title: "Katalóg produktov a košík",
    text: "Zákazník si prezrie ponuku, vyberie si a vloží tovar do košíka.",
  },
  {
    title: "Správa produktov a objednávok",
    text: "Produkty a objednávky spravujete sami, bez kódovania.",
  },
  {
    title: "Mobil aj počítač",
    text: "E-shop sa prispôsobí obrazovke, takže sa na ňom dá nakupovať z mobilu aj z počítača.",
  },
];

const steps = [
  {
    when: "Menej ako minúta",
    title: "Vyplníte krátky formulár",
    text: "Stačí meno, e-mail, názov firmy a čomu sa venujete. Technické znalosti nepotrebujete.",
  },
  {
    when: "Do 24 hodín",
    title: "Dostanete návrh zadarmo",
    text: "Vizuálny návrh hlavnej stránky, štruktúru e-shopu, odporúčania pre dizajn a funkcie a cenovú ponuku. Bez záväzkov.",
  },
  {
    when: "Do 14 dní",
    title: "Naprogramujeme e-shop",
    text: "Keď návrh schválite a dodáte podklady, e-shop je hotový do 14 dní. Úpravy do spustenia sú v cene, kým nemeníme dohodnutý rozsah.",
  },
  {
    when: "Po spustení",
    title: "Až potom platíte",
    text: "Hotový e-shop si najprv pozriete na testovacej adrese. Žiadnu zálohu neplatíte, platíte až po spustení.",
  },
];

const priceFactors = [
  "Počet produktov a ich variantov, napríklad veľkostí, farieb alebo balení",
  "Spôsoby platby a dopravy, ktoré chcete zákazníkom ponúknuť",
  "Prenos produktov do e-shopu: ručne alebo zo súboru od dodávateľa",
  "Napojenie na iné systémy, napríklad fakturáciu alebo sklad",
  "Funkcie navyše podľa vášho podnikania",
];

const choice = [
  {
    title: "E-shop sa vám oplatí, ak",
    items: [
      "chcete, aby si zákazník sám vybral tovar a objednal ho bez telefonátu",
      "predávate viac produktov alebo variantov a ponuka sa často mení",
      "chcete mať objednávky prehľadne na jednom mieste",
    ],
  },
  {
    title: "Stačí jednoduchý web, ak",
    items: [
      "ponúkate najmä služby a chcete, aby sa vám zákazník ozval",
      "máte len zopár produktov a predávate ich na dopyt",
      "chcete hlavne predstaviť firmu – web začína na 300 € a je hotový do 7 dní",
    ],
  },
];

const faqs = [
  {
    q: "Koľko stojí tvorba e-shopu?",
    a: "E-shop začína na 1 000 €. Presná cena závisí od rozsahu a dostanete ju spolu s návrhom, vopred a bez prekvapení.",
  },
  {
    q: "Ako dlho trvá tvorba e-shopu?",
    a: "E-shop je hotový do 14 dní od schválenia návrhu a dodania podkladov. Samotný návrh dostanete do 24 hodín.",
  },
  {
    q: "Musím platiť zálohu?",
    a: "Nie. Žiadnu zálohu neplatíte, za e-shop platíte až po jeho spustení.",
  },
  {
    q: "Je cena s DPH?",
    a: "DOMAN s.r.o. nie je platiteľom DPH, takže k cenám sa DPH nepripočítava.",
  },
  {
    q: "Aké platby a dopravu e-shop podporuje?",
    a: "Spôsoby platby a dopravy dohodneme pri návrhu a budú v cenovej ponuke.",
  },
  {
    q: "Môžem si produkty spravovať sám?",
    a: "Áno. Produkty a objednávky spravujete sami, bez kódovania.",
  },
  {
    q: "Čo si mám pripraviť?",
    a: "Zoznam produktov s cenami, fotky, popisy produktov, logo a predstavu o spôsoboch platby a dopravy. Pri predaji spotrebiteľom budete potrebovať aj obchodné podmienky a informácie o reklamácii a odstúpení od zmluvy. Ak niečo chýba, povedzte nám to a dohodneme sa, ako to vyriešiť.",
  },
  {
    q: "Čo ak sa mi návrh nebude páčiť?",
    a: "Ničím nie ste viazaní. Návrh je zadarmo a rozhodnutie je len na vás.",
  },
  {
    q: "Postaráte sa o e-shop aj po spustení?",
    a: "Áno, ak o to máte záujem. Mesačná správa začína na 30 € a zahŕňa aktualizácie, zálohy, monitoring a podporu.",
  },
];

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1AFF8C]/12">
            <Check size={12} className="text-[#1AFF8C]" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function EshopPage() {
  return (
    <>
      <PageHero
        title="Tvorba e-shopu na mieru"
        segments={[
          // Non-breaking spaces: "E-shop od 1 000 €." changed lines at 390 px when the web font arrived
          { text: "Od 1\u00A0000\u00A0€.", br: true },
          { text: "Do\u00A014\u00A0dní.", className: "text-gradient-primary" },
        ]}
        sub="Navrhneme a naprogramujeme internetový obchod podľa toho, čo a ako predávate. Návrh dostanete zadarmo do 24 hodín a zálohu neplatíte – platíte až po spustení."
      >
        <MagneticButton href="#formular" size="lg">
          Chcem návrh zadarmo
        </MagneticButton>
      </PageHero>

      {/* What's included */}
      <section className="pb-24 pt-4">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Čo dostanete"
            segments={[{ text: "Čo váš e-shop" }, { text: "obsahuje.", className: "text-gradient-primary" }]}
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {includes.map((item, i) => (
              <AnimateIn key={item.title} delay={i * 0.08} className="h-full">
                <GlowCard className="h-full p-6 md:p-8">
                  <h3 className="mb-2 font-heading text-[1.1rem] font-bold text-[#F5F5F0]">{item.title}</h3>
                  <p className="text-[0.9rem] leading-relaxed text-[#F5F5F0]/50">{item.text}</p>
                </GlowCard>
              </AnimateIn>
            ))}
          </div>
          <AnimateIn>
            <p className="mt-8 text-center text-[1rem] leading-relaxed text-[#F5F5F0]/60">
              Spôsoby platby a dopravy dohodneme pri návrhu a budú v cenovej ponuke.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-[#0d0d14] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Postup"
            segments={[{ text: "Ako prebieha" }, { text: "tvorba e-shopu.", className: "text-gradient-primary" }]}
            className="mb-12"
          />
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title}>
                <AnimateIn delay={i * 0.08} className="h-full">
                  <GlowCard className="h-full p-6">
                    <p className="mb-3 text-[0.8rem] font-semibold text-[#1AFF8C]">{step.when}</p>
                    <h3 className="mb-2 font-heading text-[1.05rem] font-bold text-[#F5F5F0]">{step.title}</h3>
                    <p className="text-[0.875rem] leading-relaxed text-[#F5F5F0]/50">{step.text}</p>
                  </GlowCard>
                </AnimateIn>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Price */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="Cena"
            segments={[{ text: "Koľko stojí" }, { text: "e-shop?", className: "text-gradient-primary" }]}
            className="mb-8"
          />
          <AnimateIn>
            <p className="mb-8 text-[1rem] leading-relaxed text-[#F5F5F0]/60">
              1 000 € je cena, od ktorej začíname. Koľko zaplatíte vy, závisí od rozsahu a presnú sumu uvidíte v
              cenovej ponuke spolu s návrhom – vopred a bez prekvapení. Cenu ovplyvňuje najmä:
            </p>
            <CheckList items={priceFactors} />
            <p className="mt-6 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">
              DOMAN s.r.o. nie je platiteľom DPH, takže k cenám sa DPH nepripočítava.
            </p>
            <Link
              to="/cennik/"
              className="group/link mt-8 inline-flex items-center gap-2 text-[0.9rem] text-[#9F97FF] transition-colors hover:text-[#F5F5F0]"
            >
              Pozrieť celý cenník
              <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* E-shop or website */}
      <section className="bg-[#0d0d14] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Rozhodovanie"
            segments={[{ text: "E-shop," }, { text: "alebo stačí web?", className: "text-gradient-primary" }]}
            sub="Súčasťou návrhu zadarmo sú aj odporúčania pre funkcie, takže sa nemusíte rozhodnúť vopred."
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {choice.map((option, i) => (
              <AnimateIn key={option.title} delay={i * 0.1} className="h-full">
                <GlowCard className="h-full p-6 md:p-8">
                  <h3 className="mb-5 font-heading text-[1.1rem] font-bold text-[#F5F5F0]">{option.title}</h3>
                  <CheckList items={option.items} />
                </GlowCard>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Reference */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <AnimateIn>
            <GlowCard>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <a
                  href="https://sanifix.sk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[16/10] overflow-hidden bg-bg-deep lg:aspect-auto lg:min-h-[20rem]"
                >
                  <img
                    src="/sanifix-preview.webp"
                    srcSet={imageSrcSet("/sanifix-preview.webp", 1200)}
                    sizes={IMAGE_SIZES}
                    alt="Ukážka webu sanifix.sk"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/60 to-transparent" />
                </a>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <p className="mb-2 text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">Referencia</p>
                  <h2 className="mb-4 font-heading text-[1.5rem] font-bold text-[#F5F5F0] sm:text-[1.75rem]">
                    sanifix.sk
                  </h2>
                  <p className="mb-6 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">
                    Pre SaniFIX s.r.o., autorizované servisné centrum kúpeľňového vybavenia, sme spojili katalóg
                    produktov a objednávanie servisu do jedného webu: produkty s cenami, variantmi a akciami značiek,
                    nezáväzný dopyt na produkt, online nahlásenie servisu a administrácia servisných zákaziek.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-[0.9rem]">
                    <a
                      href="https://sanifix.sk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#9F97FF] transition-colors hover:text-[#F5F5F0]"
                    >
                      Pozrieť sanifix.sk <ExternalLink size={15} />
                    </a>
                    <Link to="/portfolio/" className="text-[#9F97FF] transition-colors hover:text-[#F5F5F0]">
                      Všetky referencie →
                    </Link>
                  </div>
                </div>
              </div>
            </GlowCard>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="FAQ"
            segments={[{ text: "Časté otázky" }, { text: "o e-shope.", className: "text-gradient-primary" }]}
            className="mb-12"
          />
          <AnimateIn>
            <FaqAccordion items={faqs} />
          </AnimateIn>
        </div>
      </section>

      <LeadFormSection interest="E-shop" />
    </>
  );
}
