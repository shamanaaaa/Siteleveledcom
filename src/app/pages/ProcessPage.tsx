import { useRef } from "react";
import {
  MessageCircle,
  Lightbulb,
  Code2,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { AnimateIn } from "../components/AnimateIn";
import { Aurora } from "../components/fx/Aurora";
import { GlowCard } from "../components/fx/GlowCard";
import { MagneticButton } from "../components/fx/MagneticButton";
import { PageHero } from "../components/fx/PageHero";

const steps = [
  {
    num: "01",
    icon: MessageCircle,
    title: "Konzultácia (zdarma)",
    text: "Rozprávame sa o tvojom biznise, cieľoch a predstavách. Bez záväzku. Bez salespitchu.",
    output: "Vzájomné pochopenie + hrubý odhad rozsahu",
    color: "#6C63FF",
  },
  {
    num: "02",
    icon: Lightbulb,
    title: "Stratégia & Návrh",
    text: "Vypracujeme štruktúru webu, wireframy a vizuálny dizajn. Nič nekódujeme, kým si s dizajnom spokojný.",
    output: "Schválený Figma prototyp",
    color: "#6C63FF",
  },
  {
    num: "03",
    icon: Code2,
    title: "Vývoj & Obsah",
    text: "Programujeme web, integrujeme CMS, píšeme alebo finalizujeme texty. Pravidelné aktualizácie cez zdieľaný workspace.",
    output: "Funkčný web na testovacej doméne",
    color: "#6C63FF",
  },
  {
    num: "04",
    icon: CheckCircle2,
    title: "Testovanie & Spustenie",
    text: "Testujeme na všetkých zariadeniach a prehliadačoch. SEO check. Rýchlostný audit. Spúšťame len keď je všetko na 100 %.",
    output: "Live web + odovzdávací checklist",
    color: "#6C63FF",
  },
  {
    num: "05",
    icon: TrendingUp,
    title: "Správa & Rast (voliteľné)",
    text: "Nezmizíme po odovzdaní. Staráme sa o web, sledujeme výkon, navrhujeme zlepšenia.",
    output: "Mesačné reporty + priebežná optimalizácia",
    color: "#1AFF8C",
  },
];

export function ProcessPage() {
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
        eyebrow="Proces"
        segments={[
          { text: "Od nápadu po spustenie." },
          { text: "Bez prekvapení.", className: "text-gradient-primary" },
        ]}
        sub="Vieme, že prvý kontakt s agentúrou môže byť stresujúci. Preto máme jasný, transparentný proces — vždy vieš, kde sme a čo bude ďalej."
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
                        {step.num}
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
                          {step.num}
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
                            {step.num}
                          </span>
                        </div>
                        <h3 className="mb-3 font-heading text-[1.15rem] font-bold text-[#F5F5F0]">
                          {step.title}
                        </h3>
                        <p className="mb-4 text-[0.875rem] leading-relaxed text-[#F5F5F0]/50">
                          {step.text}
                        </p>
                        <div
                          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[0.75rem]"
                          style={{
                            backgroundColor: `${step.color}0d`,
                            borderColor: `${step.color}30`,
                            color: step.color,
                          }}
                        >
                          <span className="opacity-60">→</span> Výstup: {step.output}
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

      {/* Duration note + CTA */}
      <section className="relative overflow-hidden bg-bg-deep py-24">
        <Aurora variant="cta" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <AnimateIn>
            <p className="mb-8 text-[1rem] text-[#F5F5F0]/50">
              Priemerný projekt trvá <span className="text-[#9F97FF]">3–6 týždňov</span>. Chceš
              začať?
            </p>
            <MagneticButton to="/kontakt" size="lg">
              Dohodnúť konzultáciu
            </MagneticButton>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
