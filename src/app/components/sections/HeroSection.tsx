import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Aurora } from "../fx/Aurora";
import { KineticHeading } from "../fx/KineticHeading";
import { MagneticButton } from "../fx/MagneticButton";
import { PixelCity } from "../city/PixelCity";
import { scrollToForm } from "../../lib/scroll";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    // Capped: renderers that stretch the viewport to the page height (5 000 px+) would otherwise
    // stretch the hero too and leave every section below it unrevealed
    <section ref={sectionRef} className="relative flex min-h-[min(100vh,1200px)] items-center overflow-hidden">
      <motion.div className="absolute inset-0" style={reducedMotion ? undefined : { y: auroraY }}>
        <Aurora variant="hero" />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF]/25 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-32 lg:pt-36">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          {/* Copy column */}
          <div className="text-center lg:text-left">
            {/* The copy doesn't fade in: from opacity 0 it delays the largest paint (LCP) by about a second */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#1AFF8C]/20 bg-[#1AFF8C]/5 px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-[#1AFF8C]" />
              <span className="text-[0.8rem] text-[#1AFF8C]">
                Web od 300 € za 7 dní · E-shop od 1 000 € · Bez zálohy
              </span>
            </div>

            <KineticHeading
              as="h1"
              inView={false}
              delay={0.15}
              segments={[
                { text: "Získajte návrh vašej novej webstránky", br: true },
                { text: "do 24 hodín – úplne zadarmo.", className: "text-gradient-primary" },
              ]}
              className="mb-6 font-heading text-display-2 font-bold"
            />

            <p className="mx-auto mb-9 max-w-xl text-[1rem] leading-relaxed text-[#F5F5F0]/60 sm:text-[1.15rem] lg:mx-0">
              Vyplňte krátky formulár. My sa postaráme o zvyšok.
            </p>

            <div className="mb-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <MagneticButton size="lg" onClick={scrollToForm}>
                Chcem návrh zadarmo
              </MagneticButton>
              <MagneticButton variant="ghost" href="#portfolio" arrow={false}>
                Pozrieť portfólio
              </MagneticButton>
            </div>

            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <div className="flex -space-x-2">
                {["ZK", "ZK", "JB"].map((initials, i) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0A0A0F] bg-gradient-to-br from-[#6C63FF] to-[#9F97FF] font-heading text-[0.6rem] text-white"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <a href="#referencie" className="text-[0.8rem] text-[#F5F5F0]/40 transition-colors hover:text-[#F5F5F0]/70">
                Klienti nás <span className="text-[#F5F5F0]/70">odporúčajú na Facebooku</span>
              </a>
            </div>
          </div>

          {/* Client city: every building is a client's website */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={reducedMotion ? undefined : { y: mockupY }}
          >
            <PixelCity />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 pt-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-[#6C63FF]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
