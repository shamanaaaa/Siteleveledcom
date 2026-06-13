import { BadgeCheck, MessageCircle, Shield, Users, Zap } from "lucide-react";
import { AnimateIn } from "../AnimateIn";
import { GlowCard } from "../fx/GlowCard";
import { SectionHeading } from "../fx/SectionHeading";

const benefits = [
  {
    icon: Users,
    title: "Individuálny prístup",
    text: "Každý návrh robíme na mieru – žiadne šablóny.",
  },
  {
    icon: Zap,
    title: "Rýchlosť",
    text: "Návrh do 24 hodín, web do 2–3 týždňov.",
  },
  {
    icon: Shield,
    title: "Transparentné ceny",
    text: "Žiadne prekvapenia, všetko vopred.",
  },
  {
    icon: MessageCircle,
    title: "Komunikácia",
    text: "Vždy viete, kde sa projekt nachádza.",
  },
  {
    icon: BadgeCheck,
    title: "Skúsenosti",
    text: "40+ projektov, 5+ rokov v brandži.",
  },
];

export function WhySection() {
  return (
    <section className="bg-[#0d0d14] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Výhody"
          segments={[
            { text: "Prečo práve" },
            { text: "SiteLeveled?", className: "text-gradient-primary" },
          ]}
          className="mb-16"
        />

        {/* Bento: two wide cells on top, three below */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {benefits.map((benefit, i) => {
            const wide = i < 2;
            return (
              <AnimateIn
                key={benefit.title}
                delay={i * 0.08}
                className={`h-full ${wide ? "lg:col-span-3" : "lg:col-span-2"}`}
              >
                <GlowCard className={`h-full ${wide ? "p-8" : "p-6"}`}>
                  <div
                    className={`mb-5 flex items-center justify-center rounded-xl bg-[#6C63FF]/10 ${
                      wide ? "h-14 w-14" : "h-11 w-11"
                    }`}
                  >
                    <benefit.icon size={wide ? 26 : 20} className="text-[#6C63FF]" />
                  </div>
                  <h3 className={`mb-2 font-heading font-bold text-[#F5F5F0] ${wide ? "text-[1.15rem]" : "text-[0.98rem]"}`}>
                    {benefit.title}
                  </h3>
                  <p className="text-[0.85rem] leading-relaxed text-[#F5F5F0]/50">
                    {benefit.text}
                  </p>
                </GlowCard>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
