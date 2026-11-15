import { Link } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { FaqAccordion } from "../components/fx/FaqAccordion";
import { GlowCard } from "../components/fx/GlowCard";
import { MagneticButton } from "../components/fx/MagneticButton";
import { PageHero } from "../components/fx/PageHero";
import { ReferenceCard, type Reference } from "../components/fx/ReferenceCard";
import { SectionHeading } from "../components/fx/SectionHeading";
import { LeadFormSection } from "../components/sections/LeadFormSection";

/*
 * Slovak only: the page answers "redizajn webu" and "prerábka webu". What it states comes from the
 * owner (2026-11-15): a redesign costs the same as a new website, the new pages replace the old ones
 * and get their SEO set up, texts are written fresh and good wording from the old site is reused, and
 * both examples replaced a WordPress site. It promises neither redirects nor search positions.
 */

const signs = [
  "Web sa na mobile zle číta alebo ovláda",
  "Vyzerá zastarano a už nezodpovedá tomu, čo dnes ponúkate",
  "Úpravy textov a obrázkov sú zložité alebo ich neviete spraviť sami",
  "Načítava sa pomaly",
  "Cez web sa vám zákazníci neozývajú",
];

const included = [
  {
    title: "Nový web na mieru",
    text: "Starý web nahradíme novým. Navrhneme a naprogramujeme ho podľa toho, čo dnes ponúkate a komu. Žiadne šablóny.",
  },
  {
    title: "Čo je dobré, zostáva",
    text: "Texty pripravíme nanovo z vášho zadania a vy ich schválite. Ak je na starom webe niečo vydarené, napríklad dobré formulácie, použijeme to znova.",
  },
  {
    title: "SEO nastavíme nanovo",
    text: "Novým stránkam nastavíme SEO. Pred spustením web otestujeme na mobile aj počítači a skontrolujeme SEO a rýchlosť.",
  },
  {
    title: "Nový web nahradí starý",
    text: "Hotový web si najprv pozriete na testovacej adrese. Keď ho schválite, nahradí starý web na vašej doméne.",
  },
];

const references: Reference[] = [
  {
    name: "jogaslaskou.sk",
    url: "https://www.jogaslaskou.sk",
    image: "/jogaslaskou-preview.webp",
    category: "Jogové štúdio v Pezinku",
    text: "Pôvodný web na WordPresse sme nahradili novým webom na mieru: ponuka rozdelená do troch jasných krokov, popis priebehu lekcie, predstavenie lektorky, galéria z lekcií a pobytov, referencie a časté otázky.",
    review: {
      text: "Oceňujem ľudský a „polopatistický“ prístup, keďže nie som moc technický typ. Resuscitovali sme moju staršiu webku, všetko išlo hladko, skvelá komunikácia a rýchle reakcie na požiadavky.",
      author: "Zuzana Khala, odporúčanie na Facebooku",
    },
  },
  {
    name: "springnitra.sk",
    url: "https://www.springnitra.sk",
    image: "/springnitra-preview.webp",
    category: "Estetické štúdio v Nitre",
    text: "Aj tu pôvodný web bežal na WordPresse. Nový web má elegantný dizajn v teplých tónoch, predstavenie zakladateľky, prehľad služieb a značiek, samostatnú stránku o Fusion Plasma, galériu, recenzie klientiek a napojenie na online rezerváciu termínov.",
    review: {
      text: "Pán mi robil prerábku mojej webovej stránky a všetko prebehlo super. Výborná komunikácia, ochota a profesionálny prístup. Vždy vedel poradiť a výsledok dopadol ešte lepšie, ako som čakala.",
      author: "Jaja Bieliková, odporúčanie na Facebooku",
    },
  },
];

const steps = [
  {
    when: "Menej ako minúta",
    title: "Pošlete adresu svojho webu",
    text: "Vo formulári vyplníte meno, e-mail, názov firmy a adresu súčasného webu. Technické znalosti nepotrebujete.",
  },
  {
    when: "Do 24 hodín",
    title: "Dostanete návrh zadarmo",
    text: "Vizuálny návrh novej hlavnej stránky, štruktúru webu, základný koncept textov, odporúčania pre dizajn a cenovú ponuku. Bez záväzkov.",
  },
  {
    when: "Do 7 dní",
    title: "Naprogramujeme nový web",
    text: "Keď návrh schválite a dodáte podklady, jednoduchý web je hotový do 7 dní. Úpravy do spustenia sú v cene, kým nemeníme dohodnutý rozsah.",
  },
  {
    when: "Po spustení",
    title: "Až potom platíte",
    text: "Nový web si najprv pozriete na testovacej adrese. Žiadnu zálohu neplatíte, platíte až po spustení.",
  },
];

const faqs = [
  {
    q: "Koľko stojí redizajn webu?",
    a: "Rovnako ako nový web. Jednoduchý web začína na 300 €, e-shop na 1 000 €. Presnú cenu dostanete v cenovej ponuke spolu s návrhom, vopred a bez prekvapení.",
  },
  {
    q: "Ako dlho prerábka trvá?",
    a: "Jednoduchý web je hotový do 7 dní, e-shop do 14 dní od schválenia návrhu a dodania podkladov. Samotný návrh dostanete do 24 hodín.",
  },
  {
    q: "Môj web je na WordPresse. Viete ho prerobiť?",
    a: "Áno. Oba weby v príkladoch na tejto stránke pôvodne bežali na WordPresse a nahradili sme ich novým webom na mieru.",
  },
  {
    q: "Zostane web na mojej doméne?",
    a: "Áno. Nový web nahradí starý na vašej doméne.",
  },
  {
    q: "Použijete texty a fotky zo starého webu?",
    a: "Texty pripravíme nanovo z vášho zadania a vy ich schválite. Čo je na starom webe dobré, použijeme znova. Fotky a logo dodáte vy.",
  },
  {
    q: "Čo bude so SEO po prerábke?",
    a: "Novým stránkam nastavíme SEO a pred spustením skontrolujeme SEO aj rýchlosť. Konkrétne pozície vo vyhľadávaní nesľubujeme, o tých rozhoduje Google.",
  },
  {
    q: "Musím platiť zálohu?",
    a: "Nie. Žiadnu zálohu neplatíte, za web platíte až po jeho spustení.",
  },
  {
    q: "Je cena s DPH?",
    a: "DOMAN s.r.o. nie je platiteľom DPH, takže k cenám sa DPH nepripočítava.",
  },
  {
    q: "Postaráte sa o web aj po spustení?",
    a: "Áno, ak o to máte záujem. Mesačná správa začína na 30 € a zahŕňa aktualizácie, zálohy, monitoring a podporu.",
  },
];

// Underlined, because a link inside a sentence must not rely on colour alone (tests/browser.mjs)
const textLink = "text-[#9F97FF] underline underline-offset-2 hover:text-[#F5F5F0]";

export function RedesignPage() {
  return (
    <>
      <PageHero
        title="Redizajn a prerábka webu"
        segments={[
          // Non-breaking spaces keep each line whole, so it can't change lines when the web font arrives
          { text: "Starý web.", br: true },
          { text: "Nový život.", className: "text-gradient-primary" },
        ]}
        sub="Váš starší web nahradíme novým webom na mieru. Stojí rovnako ako nový web, teda od 300 €. Návrh nového vzhľadu dostanete zadarmo do 24 hodín a zálohu neplatíte."
      >
        <MagneticButton href="#formular" size="lg">Chcem návrh zadarmo</MagneticButton>
      </PageHero>

      {/* When a redesign makes sense */}
      <section className="pb-24 pt-4">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="Kedy prerábať"
            segments={[{ text: "Kedy sa redizajn" }, { text: "oplatí.", className: "text-gradient-primary" }]}
            className="mb-8"
          />
          <AnimateIn>
            <p className="mb-8 text-[1rem] leading-relaxed text-[#F5F5F0]/70">
              Prerábku zvážte, ak pri svojom webe spoznávate aspoň jednu z týchto situácií:
            </p>
            <ul className="space-y-3">
              {signs.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-[#F5F5F0]/70">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1AFF8C]/12">
                    <Check size={12} className="text-[#1AFF8C]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[1rem] leading-relaxed text-[#F5F5F0]/70">
              Neviete, v akom stave váš web je? Zadarmo si ho skontrolujte naším nástrojom{" "}
              <Link to="/seo-audit/" className={textLink}>SEO audit</Link>: o pár minút uvidíte skóre SEO, rýchlosti a prístupnosti.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* What the redesign covers */}
      <section className="bg-[#0d0d14] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Čo urobíme"
            segments={[{ text: "Čo je súčasťou" }, { text: "prerábky webu.", className: "text-gradient-primary" }]}
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {included.map((item, i) => (
              <AnimateIn key={item.title} delay={i * 0.08} className="h-full">
                <GlowCard className="h-full p-6 md:p-8">
                  <h3 className="mb-2 font-heading text-[1.1rem] font-bold text-[#F5F5F0]">{item.title}</h3>
                  <p className="text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">{item.text}</p>
                </GlowCard>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Two redesigns with the clients' own words */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Príklady"
            segments={[{ text: "Dva weby," }, { text: "ktoré sme prerobili.", className: "text-gradient-primary" }]}
            sub="Oba si môžete hneď otvoriť. Slová klientiek sú z ich odporúčaní na Facebooku."
            className="mb-12"
          />
          <div className="flex flex-col gap-10">
            {references.map((project) => (
              <AnimateIn key={project.name}>
                <ReferenceCard project={project} />
              </AnimateIn>
            ))}
          </div>
          <p className="mt-10 text-center text-[0.95rem]">
            <Link to="/portfolio/" className="inline-flex items-center gap-2 text-[#9F97FF] transition-colors hover:text-[#F5F5F0]">
              Všetky referencie <ArrowRight size={16} />
            </Link>
          </p>
        </div>
      </section>

      {/* Price */}
      <section className="bg-[#0d0d14] py-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="Cena"
            segments={[{ text: "Koľko stojí" }, { text: "redizajn webu?", className: "text-gradient-primary" }]}
            className="mb-8"
          />
          <AnimateIn>
            <div className="space-y-5 text-[1rem] leading-relaxed text-[#F5F5F0]/70">
              <p>
                Prerábka stojí rovnako ako nový web. Jednoduchý web začína na 300 €, e-shop na 1 000 €. Presnú sumu uvidíte v cenovej ponuke spolu s návrhom, vopred a bez prekvapení.
              </p>
              <p>
                Zálohu neplatíte, platíte až po spustení. DOMAN s.r.o. nie je platiteľom DPH, takže k cenám sa DPH nepripočítava. Podrobnosti sú v{" "}
                <Link to="/cennik/" className={textLink}>cenníku</Link> a v článku{" "}
                <Link to="/blog/kolko-stoji-webstranka/" className={textLink}>Koľko stojí webstránka a od čoho závisí cena</Link>.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Postup"
            segments={[{ text: "Ako prebieha" }, { text: "redizajn.", className: "text-gradient-primary" }]}
            className="mb-12"
          />
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title}>
                <AnimateIn delay={i * 0.08} className="h-full">
                  <GlowCard className="h-full p-6">
                    <p className="mb-3 text-[0.8rem] font-semibold text-[#1AFF8C]">{step.when}</p>
                    <h3 className="mb-2 font-heading text-[1.05rem] font-bold text-[#F5F5F0]">{step.title}</h3>
                    <p className="text-[0.875rem] leading-relaxed text-[#F5F5F0]/60">{step.text}</p>
                  </GlowCard>
                </AnimateIn>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-center text-[0.95rem]">
            <Link to="/proces/" className="inline-flex items-center gap-2 text-[#9F97FF] transition-colors hover:text-[#F5F5F0]">
              Celý proces spolupráce <ArrowRight size={16} />
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="FAQ"
            segments={[{ text: "Časté otázky" }, { text: "o prerábke webu.", className: "text-gradient-primary" }]}
            className="mb-12"
          />
          <AnimateIn>
            <FaqAccordion items={faqs} />
          </AnimateIn>
        </div>
      </section>

      <LeadFormSection interest="Redizajn webu" form="redizajn" />
    </>
  );
}
