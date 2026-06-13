import { Star } from "lucide-react";
import { AnimateIn } from "../AnimateIn";
import { GlowCard } from "../fx/GlowCard";
import { SectionHeading } from "../fx/SectionHeading";

const testimonials = [
  {
    text: "Návrh sme dostali na druhý deň a výsledná stránka nám priniesla viac objednávok hneď v prvom mesiaci.",
    author: "Peter M.",
    company: "mdfoto.sk",
  },
  {
    text: "Výborná komunikácia a profesionálny prístup. Presne to, čo sme hľadali – rýchlo, bez komplikácií.",
    author: "Zuzana K.",
    company: "zuzu-photo.sk",
  },
  {
    text: "Rýchlo, profesionálne a bez stresu. Odporúčam každému, kto chce naozaj dobrý web.",
    author: "Martin H.",
    company: "nosekrst.sk",
  },
];

export function TestimonialsSection() {
  return (
    <section id="referencie" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Referencie"
          segments={[
            { text: "Čo hovoria" },
            { text: "naši klienti.", className: "text-gradient-primary" },
          ]}
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <AnimateIn key={t.author} delay={i * 0.1} className="h-full">
              <GlowCard className="flex h-full flex-col p-8">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-3 left-5 select-none font-heading text-[5.5rem] leading-none text-[#6C63FF]/10"
                >
                  &ldquo;
                </span>
                <div className="mb-6 flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="fill-[#FFD93D] text-[#FFD93D]" />
                  ))}
                </div>
                <blockquote className="mb-6 flex-1 text-[0.9rem] italic leading-relaxed text-[#F5F5F0]/70">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#9F97FF] font-heading text-[0.7rem] text-white">
                    {t.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[0.85rem] text-[#F5F5F0]">{t.author}</p>
                    <p className="text-[0.75rem] text-[#9F97FF]">{t.company}</p>
                  </div>
                </div>
              </GlowCard>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
