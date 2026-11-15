import { Link } from "react-router";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { FaqAccordion } from "../components/fx/FaqAccordion";
import { GlowCard } from "../components/fx/GlowCard";
import { MagneticButton } from "../components/fx/MagneticButton";
import { PageHero } from "../components/fx/PageHero";
import { SectionHeading } from "../components/fx/SectionHeading";
import { LeadFormSection } from "../components/sections/LeadFormSection";
import { IMAGE_SIZES, imageSrcSet, projectPreviewDimensions } from "../lib/images";

/*
 * Slovak only: the page answers "tvorba webstránok Nitra". Every statement is already confirmed
 * for the live pages (seat, prices, terms, the two Nitra clients and the Facebook review).
 * It does not say we meet clients in person: add that only once the owner confirms it.
 */

const reasons = [
  {
    title: "Sídlo pri Nitre",
    text: "SiteLeveled prevádzkuje spoločnosť DOMAN s.r.o. so sídlom v Cabaji-Čápore pri Nitre. Pracujeme pre firmy z celého Slovenska a weby sme robili aj pre nitrianske firmy.",
  },
  {
    title: "Priamo s vývojárom",
    text: "Každý projekt vedie osobne Mário Doman, ktorý váš web navrhuje aj programuje. Zavoláte na 0910 803 993 a hovoríte priamo s ním.",
  },
  {
    title: "Návrh zadarmo do 24 hodín",
    text: "Vizuálny návrh hlavnej stránky, štruktúru webu a cenovú ponuku dostanete zadarmo a bez záväzkov. Rozhodnete sa, až keď návrh uvidíte.",
  },
  {
    title: "Platíte až po spustení",
    text: "Žiadnu zálohu neplatíte. Hotový web si najprv pozriete na testovacej adrese a platíte až po jeho spustení.",
  },
];

const references = [
  {
    name: "springnitra.sk",
    url: "https://www.springnitra.sk",
    image: "/springnitra-preview.webp",
    category: "Estetické štúdio v Nitre",
    text: "Pre estetické štúdio Spring sme prerobili web tak, aby si klientka rýchlo rezervovala termín: elegantný dizajn v teplých tónoch, predstavenie zakladateľky, prehľad služieb a značiek, samostatná stránka o Fusion Plasma, galéria, recenzie klientiek a napojenie na online rezerváciu termínov.",
    review: {
      text: "Pán mi robil prerábku mojej webovej stránky a všetko prebehlo super. Výborná komunikácia, ochota a profesionálny prístup. Vždy vedel poradiť a výsledok dopadol ešte lepšie, ako som čakala.",
      author: "Jaja Bieliková, odporúčanie na Facebooku",
    },
  },
  {
    name: "zeriavynitra.sk",
    url: "https://www.zeriavynitra.sk",
    image: "/zeriavynitra-preview.webp",
    category: "Žeriavnícke práce a prenájom autožeriavov",
    text: "Web získava dopyty na žeriavnícke práce a prenájom autožeriavov v Nitre a okolí, od stavebných firiem aj súkromných osôb. Obsahuje prehľad služieb a autožeriavov Demag AC 40 a AC 55 City, technický nákres žeriavu, spoluprácu v piatich krokoch, časté otázky a formulár na nezáväzný dopyt. Telefón je vždy po ruke.",
  },
];

const prices = [
  "Web od 300 €: do 5 podstránok s kontaktným formulárom, prispôsobený mobilu aj počítaču, so základným SEO",
  "E-shop od 1 000 €, hotový do 14 dní",
  "Správa webu od 30 € mesačne: aktualizácie, zálohy, monitoring a podpora",
  "SEO audit za 199 €: ručná kontrola webu a písomná správa so zoznamom opráv",
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
    text: "Vizuálny návrh hlavnej stránky, štruktúru webu, základný koncept textov, odporúčania pre dizajn a cenovú ponuku. Bez záväzkov.",
  },
  {
    when: "Do 7 dní",
    title: "Naprogramujeme web",
    text: "Keď návrh schválite a dodáte podklady, jednoduchý web je hotový do 7 dní. Úpravy do spustenia sú v cene, kým nemeníme dohodnutý rozsah.",
  },
  {
    when: "Po spustení",
    title: "Až potom platíte",
    text: "Hotový web si najprv pozriete na testovacej adrese. Žiadnu zálohu neplatíte, platíte až po spustení.",
  },
];

const faqs = [
  {
    q: "Robíte weby len pre firmy z Nitry?",
    a: "Nie. Sídlo máme v Cabaji-Čápore pri Nitre, ale pracujeme pre firmy z celého Slovenska. Z Nitry sú napríklad springnitra.sk a zeriavynitra.sk, z Pezinka jogaslaskou.sk.",
  },
  {
    q: "Koľko stojí tvorba webstránky v Nitre?",
    a: "Jednoduchý web začína na 300 €, e-shop na 1 000 €. Presnú cenu dostanete v cenovej ponuke spolu s návrhom, vopred a bez prekvapení. Cena nezávisí od toho, kde sídlite.",
  },
  {
    q: "Ako dlho trvá tvorba webu?",
    a: "Jednoduchý web je hotový do 7 dní, e-shop do 14 dní od schválenia návrhu a dodania podkladov. Samotný návrh dostanete do 24 hodín.",
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
    q: "Ako sa s vami spojím?",
    a: "Zavolajte Máriovi Domanovi na 0910 803 993, napíšte na info@siteleveled.com alebo vyplňte formulár na tejto stránke. Odpovieme do 24 hodín v pracovný deň.",
  },
  {
    q: "Kto pripraví texty a fotky?",
    a: "Texty pripravíme z vášho zadania a vy ich schválite. Fotky a logo dodáte vy.",
  },
  {
    q: "Pomôžete nám aj s profilom firmy na Googli a s mapami?",
    a: "Áno. Lokálne SEO, teda firemný profil na Googli a mapy, patrí medzi naše služby. Rozsah a cenu dohodneme v ponuke.",
  },
  {
    q: "Postaráte sa o web aj po spustení?",
    a: "Áno, ak o to máte záujem. Mesačná správa začína na 30 € a zahŕňa aktualizácie, zálohy, monitoring a podporu.",
  },
];

// Underlined, because a link inside a sentence must not rely on colour alone (tests/browser.mjs)
const textLink = "text-[#9F97FF] underline underline-offset-2 hover:text-[#F5F5F0]";

export function NitraPage() {
  return (
    <>
      <PageHero
        title="Tvorba webstránok v Nitre a okolí"
        segments={[
          // Non-breaking spaces keep each line whole, so it can't change lines when the web font arrives
          { text: "Web pre Nitru.", br: true },
          { text: "Od 300 €.", className: "text-gradient-primary" },
        ]}
        sub="Sídlime v Cabaji-Čápore pri Nitre a weby sme robili aj pre nitrianske firmy. Návrh dostanete zadarmo do 24 hodín, jednoduchý web je hotový do 7 dní a zálohu neplatíte."
      >
        <MagneticButton href="#formular" size="lg">Chcem návrh zadarmo</MagneticButton>
      </PageHero>

      {/* Why us */}
      <section className="pb-24 pt-4">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Prečo SiteLeveled"
            segments={[{ text: "Web od ľudí" }, { text: "z okolia Nitry.", className: "text-gradient-primary" }]}
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {reasons.map((item, i) => (
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

      {/* Nitra references */}
      <section className="bg-[#0d0d14] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Referencie z Nitry"
            segments={[{ text: "Weby pre" }, { text: "nitrianske firmy.", className: "text-gradient-primary" }]}
            sub="Oba weby si môžete hneď otvoriť."
            className="mb-12"
          />
          <div className="flex flex-col gap-10">
            {references.map((project) => (
              <AnimateIn key={project.name}>
                <GlowCard>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block aspect-[16/10] overflow-hidden bg-bg-deep lg:aspect-auto lg:min-h-[20rem]"
                    >
                      <img
                        src={project.image}
                        srcSet={imageSrcSet(project.image, 1200)}
                        sizes={IMAGE_SIZES}
                        {...projectPreviewDimensions(project.image, "sk")}
                        alt={`Ukážka webu ${project.name}`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/60 to-transparent" />
                    </a>
                    <div className="flex flex-col justify-center p-8 md:p-10">
                      <p className="mb-2 text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">{project.category}</p>
                      <h3 className="mb-4 font-heading text-[1.5rem] font-bold text-[#F5F5F0] sm:text-[1.75rem]">{project.name}</h3>
                      <p className="mb-6 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">{project.text}</p>
                      {project.review && (
                        <figure className="mb-6">
                          <blockquote className="text-[0.9rem] italic leading-relaxed text-[#F5F5F0]/75">„{project.review.text}“</blockquote>
                          <figcaption className="mt-2 text-[0.8rem] text-[#F5F5F0]/60">— {project.review.author}</figcaption>
                        </figure>
                      )}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[0.9rem] text-[#9F97FF] transition-colors hover:text-[#F5F5F0]"
                      >
                        Pozrieť {project.name} <ExternalLink size={15} />
                      </a>
                    </div>
                  </div>
                </GlowCard>
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
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="Cena"
            segments={[{ text: "Koľko stojí web" }, { text: "v Nitre?", className: "text-gradient-primary" }]}
            className="mb-8"
          />
          <AnimateIn>
            <p className="mb-8 text-[1rem] leading-relaxed text-[#F5F5F0]/70">
              Cena nezávisí od toho, kde sídlite. Jednoduchý web začína na 300 € a je hotový do 7 dní od schválenia návrhu a dodania podkladov. Presnú sumu uvidíte v cenovej ponuke spolu s návrhom, vopred a bez prekvapení.
            </p>
            <ul className="space-y-3">
              {prices.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-[#F5F5F0]/70">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1AFF8C]/12">
                    <Check size={12} className="text-[#1AFF8C]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-[#F5F5F0]/70">
              DOMAN s.r.o. nie je platiteľom DPH, takže k cenám sa DPH nepripočítava. Podrobnosti sú v{" "}
              <Link to="/cennik/" className={textLink}>cenníku</Link>, na stránke{" "}
              <Link to="/tvorba-eshopu/" className={textLink}>tvorba e-shopu</Link> a v článku{" "}
              <Link to="/blog/kolko-stoji-webstranka/" className={textLink}>Koľko stojí webstránka a od čoho závisí cena</Link>.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-[#0d0d14] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Postup"
            segments={[{ text: "Ako prebieha" }, { text: "tvorba webu.", className: "text-gradient-primary" }]}
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

      {/* Local search */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="Google a mapy"
            segments={[{ text: "Aby vás v Nitre" }, { text: "našli.", className: "text-gradient-primary" }]}
            className="mb-8"
          />
          <AnimateIn>
            <div className="space-y-5 text-[1rem] leading-relaxed text-[#F5F5F0]/70">
              <p>
                Zákazníci hľadajú firmy vo svojom okolí cez Google a Mapy Google. Základné SEO je preto súčasťou každého webu, ktorý robíme.
              </p>
              <p>
                Ak chcete byť viditeľní aj v mapách, pomôžeme vám s lokálnym SEO: s firemným profilom na Googli a s mapami. Viac o tom nájdete medzi{" "}
                <Link to="/sluzby/" className={textLink}>našimi službami</Link>.
              </p>
              <p>
                Máte už web? Zadarmo si ho skontrolujte naším nástrojom{" "}
                <Link to="/seo-audit/" className={textLink}>SEO audit</Link>: o pár minút uvidíte skóre SEO, rýchlosti a prístupnosti.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="FAQ"
            segments={[{ text: "Časté otázky" }, { text: "z Nitry.", className: "text-gradient-primary" }]}
            className="mb-12"
          />
          <AnimateIn>
            <FaqAccordion items={faqs} />
          </AnimateIn>
        </div>
      </section>

      <LeadFormSection interest="Web (stránka Nitra)" form="nitra" />
    </>
  );
}
