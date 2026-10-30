import { AnimateIn } from "../AnimateIn";
import { FaqAccordion } from "../fx/FaqAccordion";
import { SectionHeading } from "../fx/SectionHeading";

const faqs = [
  {
    q: "Je návrh naozaj zadarmo?",
    a: "Áno, bez podmienok a bez skrytých poplatkov. Dostanete reálny návrh vašej webstránky – zdarma a bez záväzkov.",
  },
  {
    q: "Som niečím viazaný?",
    a: "Nie. Návrh vám pošleme a rozhodnutie je len na vás. Žiadny tlak, žiadne záväzky.",
  },
  {
    q: "Čo ak sa mi návrh nebude páčiť?",
    a: "Povieme si to. Radi upravíme alebo vysvetlíme naše rozhodnutia. Záleží nám na tom, aby ste boli spokojní.",
  },
  {
    q: "Ako prebieha realizácia?",
    a: "Po odsúhlasení návrhu dohodíme termín, cenu a podmienky spolupráce. Celý proces je transparentný.",
  },
  {
    q: "Koľko stojí kompletná webstránka?",
    a: "Jednoduchý web od 300 €, e-shop od 1 000 €. Presná cena závisí od rozsahu – v návrhu dostanete aj cenovú ponuku, vopred a bez prekvapení. Zálohu neplatíte, platíte až po spustení webu.",
  },
  {
    q: "Ako dlho trvá výroba webu?",
    a: "Jednoduchý web je hotový do 7 dní, e-shop do 14 dní od schválenia návrhu.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          eyebrow="FAQ"
          segments={[
            { text: "Časté" },
            { text: "otázky.", className: "text-gradient-primary" },
          ]}
          className="mb-12"
        />
        <AnimateIn>
          <FaqAccordion items={faqs} />
        </AnimateIn>
      </div>
    </section>
  );
}
