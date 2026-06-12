import { CheckCircle2 } from "lucide-react";
import { AnimateIn } from "../AnimateIn";
import { GlowCard } from "../fx/GlowCard";
import { SectionHeading } from "../fx/SectionHeading";
import { SelfBuildingSite } from "../fx/SelfBuildingSite";

const whatsIncluded = [
  "Vizuálny návrh hlavnej stránky",
  "Kompletná štruktúra celého webu",
  "Základný koncept textov",
  "Odporúčania pre dizajn a funkcie",
  "Cenová ponuka realizácie",
];

export function IncludedSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="left"
          eyebrow="Návrh zadarmo"
          segments={[
            { text: "Čo dostanete" },
            { text: "úplne zadarmo.", className: "text-gradient-primary" },
          ]}
          className="mb-12"
        />

        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
          <AnimateIn className="h-full">
            <GlowCard className="flex h-full items-center p-5 sm:p-8">
              <SelfBuildingSite staticFinal className="w-full shadow-none" />
            </GlowCard>
          </AnimateIn>

          <div className="flex flex-col gap-3">
            {whatsIncluded.map((item, i) => (
              <AnimateIn key={i} delay={0.08 + i * 0.06} direction="right">
                <GlowCard className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1AFF8C]/12">
                    <CheckCircle2 size={15} className="text-[#1AFF8C]" />
                  </div>
                  <p className="text-[0.95rem] text-[#F5F5F0]/75">{item}</p>
                </GlowCard>
              </AnimateIn>
            ))}
            <AnimateIn delay={0.4} direction="right">
              <div className="rounded-card border border-[#6C63FF]/20 bg-[#6C63FF]/5 p-5">
                <p className="text-[0.9rem] italic leading-relaxed text-[#F5F5F0]/70">
                  "Nie je to skica. Je to reálny návrh, z ktorého môžete stavať."
                </p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </section>
  );
}
