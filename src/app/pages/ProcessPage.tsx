import { useI18n } from "../i18n/LocaleContext";
import { useRef } from "react";
import {
  Check,
  ClipboardList,
  MessageCircle,
  Lightbulb,
  Code2,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "../lib/useReducedMotion";
import { AnimateIn } from "../components/AnimateIn";
import { Aurora } from "../components/fx/Aurora";
import { GlowCard } from "../components/fx/GlowCard";
import { MagneticButton } from "../components/fx/MagneticButton";
import { PageHero } from "../components/fx/PageHero";
import { SectionHeading } from "../components/fx/SectionHeading";

const steps = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Krátky formulár",
    when: "Menej ako minúta",
    text: "Napíšete nám meno, e-mail, názov firmy a čomu sa venujete. Ak už máte web, pridáte aj jeho adresu. Technické znalosti nepotrebujete.",
    output: "Zadanie pre návrh",
    color: "#8F87FF",
  },
  {
    num: "02",
    icon: Lightbulb,
    title: "Návrh zadarmo",
    when: "Do 24 hodín",
    text: "Pripravíme vizuálny návrh hlavnej stránky, štruktúru celého webu a základný koncept textov. Pridáme odporúčania pre dizajn a funkcie a cenovú ponuku realizácie.",
    output: "Návrh a cenová ponuka",
    color: "#8F87FF",
  },
  {
    num: "03",
    icon: MessageCircle,
    title: "Vaše rozhodnutie",
    when: "Bez záväzkov",
    text: "Návrh si pozriete a rozhodnete sa. Ak sa vám páči, dohodneme termín, cenu a podmienky. Ak nie, povieme si prečo a radi ho upravíme alebo vysvetlíme. Ničím nie ste viazaní.",
    output: "Schválený návrh",
    color: "#8F87FF",
  },
  {
    num: "04",
    icon: Code2,
    title: "Tvorba webu",
    when: "Web do 7 dní, e-shop do 14 dní",
    text: "Po schválení návrhu a dodaní podkladov web naprogramujeme a z vášho zadania pripravíme texty, ktoré schválite. Úpravy do spustenia sú v cene, kým nemeníme dohodnutý rozsah. Projekt vedie osobne Mário Doman, takže vždy viete, kde sa nachádza, a môžete mu priamo zavolať.",
    output: "Web na testovacej adrese",
    color: "#8F87FF",
  },
  {
    num: "05",
    icon: CheckCircle2,
    title: "Testovanie, spustenie a platba",
    when: "Až po spustení",
    text: "Hotový web si najprv pozriete na testovacej adrese. Pred spustením ho otestujeme na mobile aj počítači a skontrolujeme SEO a rýchlosť. Platíte až po spustení, žiadnu zálohu vopred neplatíte.",
    output: "Web naživo",
    color: "#8F87FF",
  },
  {
    num: "06",
    icon: Shield,
    title: "Správa webu (voliteľná)",
    when: "Od 30 € mesačne",
    text: "Ak chcete, postaráme sa o web aj po spustení: aktualizácie, zálohy, monitoring a podpora.",
    output: "Starostlivosť o web",
    color: "#1AFF8C",
  },
];

const timings = [
  { value: "24 hodín", label: "Návrh zadarmo" },
  { value: "7 dní", label: "Jednoduchý web" },
  { value: "14 dní", label: "E-shop" },
];

const needs = [
  "Logo a fotky",
  "Informácie o firme a službách, z ktorých pripravíme texty",
  "Predstavu o tom, čo má web zákazníkom ponúknuť",
  "Pri e-shope aj zoznam produktov s cenami, fotkami a popismi",
];

export function ProcessPage() {
  const { t: tr, link: localLink, locale: language } = useI18n();
  const timelineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.75", "end 0.55"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <>
      <PageHero
        title={tr("Ako prebieha tvorba webu")}
        segments={tr([
          { text: "Od nápadu po spustenie." },
          { text: "Bez prekvapení.", className: "text-gradient-primary" },
        ])}
        sub={tr("Vieme, že prvý kontakt s agentúrou môže byť stresujúci. Preto máme jasný, transparentný proces — vždy viete, kde sme a čo bude ďalej.")}
      />

      {/* Timeline */}
      <section className="pb-32 pt-4">
        <div className="mx-auto max-w-4xl px-6">
          <div ref={timelineRef} className="relative">
            {/* Base line + scroll-linked progress line */}
            <div className="absolute bottom-0 left-6 top-0 hidden w-px bg-white/8 sm:block md:left-1/2" />
            <motion.div
              aria-hidden
              className="absolute bottom-0 left-6 top-0 hidden w-px origin-top bg-gradient-to-b from-[#6C63FF] via-[#9F97FF] to-[#1AFF8C] sm:block md:left-1/2"
              style={reducedMotion ? undefined : { scaleY: lineScale }}
            />

            <div className="space-y-12 md:space-y-16">
              {steps.map((step, i) => (
                <AnimateIn
                  key={i}
                  delay={i * 0.08}
                  direction={i % 2 === 0 ? "left" : "right"}
                >
                  <div
                    className={`relative flex flex-col items-start gap-6 md:flex-row md:gap-12 ${
                      i % 2 !== 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Number dot */}
                    <div
                      className="absolute left-6 z-10 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-[#0A0A0F] sm:flex md:left-1/2"
                      style={{ borderColor: step.color, boxShadow: `0 0 24px ${step.color}30` }}
                    >
                      <span className="font-heading text-[0.85rem]" style={{ color: step.color }}>
                        {tr(step.num)}
                      </span>
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 ${
                        i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
                      }`}
                    >
                      <GlowCard
                        className={`max-w-md p-6 md:p-8 ${
                          i % 2 === 0 ? "md:ml-0 md:mr-auto" : "md:ml-auto md:mr-0"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`pointer-events-none absolute -top-6 select-none font-heading text-[5.5rem] font-bold leading-none text-stroke-ghost ${
                            i % 2 === 0 ? "left-2 md:left-2" : "right-2"
                          }`}
                        >
                          {tr(step.num)}
                        </span>
                        <div
                          className={`mb-4 flex items-center gap-3 ${
                            i % 2 === 0 ? "md:justify-end" : ""
                          }`}
                        >
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${step.color}15` }}
                          >
                            <step.icon size={20} style={{ color: step.color }} />
                          </div>
                          <span
                            className="font-heading text-[0.85rem] sm:hidden"
                            style={{ color: step.color }}
                          >
                            {tr(step.num)}
                          </span>
                        </div>
                        <h2 className="mb-1 font-heading text-[1.15rem] font-bold text-[#F5F5F0]">
                          {tr(step.title)}
                        </h2>
                        <p className="mb-3 text-[0.8rem] font-semibold text-[#1AFF8C]">{tr(step.when)}</p>
                        <p className="mb-4 text-[0.875rem] leading-relaxed text-[#F5F5F0]/50">
                          {tr(step.text)}
                        </p>
                        <div
                          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[0.75rem]"
                          style={{
                            backgroundColor: `${step.color}0d`,
                            borderColor: `${step.color}30`,
                            color: step.color,
                          }}
                        >
                          <span>{"→"}</span>{tr(" Výstup: ")}{tr(step.output)}
                        </div>
                      </GlowCard>
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden flex-1 md:block" />
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How long it takes */}
      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            eyebrow={tr("Termíny")}
            segments={tr([{ text: "Ako dlho trvá" }, { text: "tvorba webu?", className: "text-gradient-primary" }])}
            sub={tr("Návrh dostanete do 24 hodín. Termíny webu a e-shopu sa počítajú od schválenia návrhu a dodania podkladov.")}
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {timings.map((timing, i) => (
              <AnimateIn key={timing.label} delay={i * 0.08} className="h-full">
                <GlowCard className="h-full p-6 text-center">
                  <p className="mb-1 font-heading text-[1.5rem] font-bold text-[#F5F5F0]">{language === "en" ? (i === 0 ? "" : "within ") : "do "}{tr(timing.value)}</p>
                  <p className="text-[0.875rem] text-[#F5F5F0]/50">{tr(timing.label)}</p>
                </GlowCard>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* What we need */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow={tr("Príprava")}
            segments={tr([{ text: "Čo budeme" }, { text: "od vás potrebovať.", className: "text-gradient-primary" }])}
            sub={tr("Na návrh stačí krátky formulár. Na samotný web sa zídu veci, ktoré o svojej firme viete najlepšie:")}
            className="mb-10"
          />
          <AnimateIn>
            <ul className="space-y-3">
              {needs.map((need) => (
                <li key={need} className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1AFF8C]/12">
                    <Check size={12} className="text-[#1AFF8C]" />
                  </span>
                  {tr(need)}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">{tr("Ak niečo chýba, povedzte nám to a dohodneme sa, ako to vyriešiť.")}</p>
          </AnimateIn>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-bg-deep py-24">
        <Aurora variant="cta" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <AnimateIn>
            <p className="mb-8 text-[1rem] text-[#F5F5F0]/50">{tr("Prvý krok je zadarmo a k ničomu vás nezaväzuje. Chcete začať?")}</p>
            <MagneticButton to={localLink("/#formular")} size="lg">{tr("Chcem návrh zadarmo")}</MagneticButton>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
