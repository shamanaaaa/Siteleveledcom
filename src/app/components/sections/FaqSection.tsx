import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { AnimateIn } from "../AnimateIn";
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
          <div className="divide-y divide-white/8 border-y border-white/8">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span
                      className={`font-heading text-[0.98rem] transition-colors ${
                        open ? "text-[#F5F5F0]" : "text-[#F5F5F0]/75 group-hover:text-[#F5F5F0]"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        open
                          ? "rotate-45 border-[#6C63FF]/50 bg-[#6C63FF]/15 text-[#9F97FF]"
                          : "border-white/10 text-[#F5F5F0]/40 group-hover:border-white/25"
                      }`}
                    >
                      <Plus size={14} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-11 text-[0.875rem] leading-relaxed text-[#F5F5F0]/50">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
