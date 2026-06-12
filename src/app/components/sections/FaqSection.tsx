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
    a: "Závisí od rozsahu a požiadaviek. V návrhu dostanete aj orientačnú cenovú ponuku – vopred, bez prekvapení.",
  },
  {
    q: "Ako dlho trvá výroba webu?",
    a: "Štandardne 2–4 týždne od schválenia návrhu. Závisí od rozsahu projektu.",
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
