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
          <MagneticButton size="lg" onClick={scrollToForm}>
            Chcem návrh zadarmo
          </MagneticButton>
        </AnimateIn>
      </div>
    </section>
  );
}
