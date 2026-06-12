import { Shield } from "lucide-react";
import { AnimateIn } from "../AnimateIn";
import { Aurora } from "../fx/Aurora";
import { KineticHeading } from "../fx/KineticHeading";
import { MagneticButton } from "../fx/MagneticButton";
import { scrollToForm } from "../../lib/scroll";

export function ClosingCtaSection() {
  return (
    <section className="relative overflow-hidden bg-bg-deep py-28 md:py-40">
      <Aurora variant="cta" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <KineticHeading
          as="h2"
          segments={[
            { text: "Získajte návrh vašej webstránky", br: true },
            { text: "do 24 hodín – bez rizika.", className: "text-gradient-primary" },
          ]}
          className="mb-10 font-heading text-display-2 font-bold"
        />
        <AnimateIn delay={0.2}>
          <MagneticButton size="lg" onClick={scrollToForm} className="mb-8">
            Chcem návrh zadarmo
          </MagneticButton>
        </AnimateIn>
        <AnimateIn delay={0.3}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-surface-1/80 px-5 py-3 text-[0.85rem] text-[#F5F5F0]/50">
            <Shield size={16} className="shrink-0 text-[#1AFF8C]" />
            Garancia: Ak návrh nedodáme do 24 hodín, dostanete mesiac hostovania zadarmo.
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
