import { ArrowRight, BadgeCheck, CheckCircle2, Shield } from "lucide-react";
import { AnimateIn } from "../AnimateIn";
import { GlowCard } from "../fx/GlowCard";
import { SectionHeading } from "../fx/SectionHeading";

const steps = [
  {
    num: "1",
    title: "Vyplníte formulár",
    sub: "2–3 minúty",
    text: "Krátky formulár o vás a vašom projekte. Žiadne technické znalosti nie sú potrebné.",
    color: "#6C63FF",
  },
  {
    num: "2",
    title: "Do 24h dostanete návrh",
    sub: "profesionálny, na mieru",
    text: "Náš tím pripraví reálny vizuálny návrh vašej webstránky – šitý na mieru vášmu biznisu.",
    color: "#9F97FF",
  },
  {
    num: "3",
    title: "Rozhodnete sa",
    sub: "bez záväzkov",
    text: "Návrh sa vám páči? Spolupracujeme. Nepáči? Žiadny problém. Rozhodnutie je len na vás.",
    color: "#1AFF8C",
  },
];

const assurances = [
  { icon: Shield, label: "Žiadne záväzky" },
  { icon: BadgeCheck, label: "Žiadne skryté poplatky" },
  { icon: CheckCircle2, label: "Bez rizika" },
];

export function HowItWorksSection() {
  return (
    <section id="ako-to-funguje" className="bg-[#0d0d14] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Proces"
          segments={[{ text: "Ako to" }, { text: "funguje?", className: "text-gradient-primary" }]}
          sub="Tri jednoduché kroky. Žiadna komplikácia."
          className="mb-16"
        />

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <AnimateIn key={i} delay={i * 0.1} className="relative h-full">
              {i < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                  <ArrowRight size={18} className="text-[#6C63FF]/40" />
                </div>
              )}
              <GlowCard className="h-full p-8">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-8 right-0 select-none font-heading text-[6.5rem] font-bold leading-none text-stroke-ghost"
                >
                  {step.num}
                </span>
                <span
                  className="mb-4 inline-block rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-wider"
                  style={{ background: `${step.color}14`, color: step.color }}
                >
                  {step.sub}
                </span>
                <h3 className="mb-3 font-heading text-[1.2rem] font-bold text-[#F5F5F0]">
                  {step.title}
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-[#F5F5F0]/50">{step.text}</p>
              </GlowCard>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn>
          <div className="flex flex-wrap justify-center gap-4">
            {assurances.map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-surface-1 px-5 py-2.5 text-[0.875rem] text-[#F5F5F0]/60"
              >
                <item.icon size={16} className="text-[#1AFF8C]" />
                {item.label}
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
